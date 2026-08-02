import axios from "axios";
import { formatErrorMessage } from "../lib/supabaseErrors";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const AUTH_STORAGE_KEY = "beepro_academy_auth_session";
const AUTH_SESSION_EVENT = "beepro:auth-session-changed";
const API_LOADING_EVENT = "beepro:api-loading-changed";
const REQUEST_TIMEOUT = 20_000;

let activeRequests = 0;
let refreshPromise = null;

function normalizeBaseUrl(value) {
  const trimmed = String(value || "").replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:5000/api/v1";
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
}

export const API_BASE_URL = normalizeBaseUrl(rawBaseUrl);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function emitLoading() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(API_LOADING_EVENT, {
      detail: { isLoading: activeRequests > 0, activeRequests },
    }),
  );
}

function beginRequest(config) {
  if (config?.skipGlobalLoading) return;
  activeRequests += 1;
  emitLoading();
}

function endRequest(config) {
  if (config?.skipGlobalLoading) return;
  activeRequests = Math.max(0, activeRequests - 1);
  emitLoading();
}

export function subscribeApiLoading(handler) {
  if (typeof window === "undefined") return () => {};
  const listener = (event) => handler(event.detail);
  window.addEventListener(API_LOADING_EVENT, listener);
  handler({ isLoading: activeRequests > 0, activeRequests });
  return () => window.removeEventListener(API_LOADING_EVENT, listener);
}

function storedSession() {
  const value = storage()?.getItem(AUTH_STORAGE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    storage()?.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function persistSession(session) {
  if (!session?.access_token) storage()?.removeItem(AUTH_STORAGE_KEY);
  else storage()?.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function notifyAuth(event, session = null) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EVENT, { detail: { event, session } }),
  );
}

export function unwrapResponse(response) {
  return response?.data?.data ?? response?.data ?? null;
}

export function toList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

export function listResponse(response) {
  const value = unwrapResponse(response);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.courses)) return value.courses;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

export function buildApiError(error, fallback = "Request failed") {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error
      : new Error(formatErrorMessage(error) || fallback);
  }

  const responseData = error.response?.data || {};
  const apiError = responseData.error || responseData;
  const details = Array.isArray(apiError.details)
    ? apiError.details.map((item) => item.message || item).join(", ")
    : "";
  const status = error.response?.status;
  const friendlyFallback =
    status === 404
      ? "The requested resource could not be found."
      : status === 401
        ? "Your session has expired. Please sign in again."
        : status === 403
          ? "You do not have permission to perform this action."
          : status >= 500
            ? "The server is currently unavailable. Please try again shortly."
            : fallback;
  const result = new Error(
    details
      ? `${apiError.message || friendlyFallback}: ${details}`
      : apiError.message || friendlyFallback,
  );
  result.status = status;
  result.code = apiError.code || error.code;
  result.isTimeout = error.code === "ECONNABORTED";
  return result;
}

export async function safeRequest(
  request,
  fallback = null,
  label = "Request failed",
) {
  try {
    return unwrapResponse(await request);
  } catch (error) {
    console.warn(label, buildApiError(error, label).message);
    return fallback;
  }
}

export async function safeList(request, label = "Failed to load list") {
  try {
    return listResponse(await request);
  } catch (error) {
    console.warn(label, buildApiError(error, label).message);
    return [];
  }
}

function comingSoon(label) {
  return { disabled: true, comingSoon: true, message: label || "Coming Soon" };
}

function findToken(data, key) {
  return (
    data?.[key] ||
    data?.data?.[key] ||
    data?.tokens?.[key] ||
    data?.data?.tokens?.[key] ||
    null
  );
}

function normalizeUser(user = {}) {
  return {
    ...user,
    id: user.id || user.sub,
    full_name:
      user.full_name || user.fullName || user.name || user.email?.split("@")[0],
    fullName: user.fullName || user.full_name || user.name,
    avatar_url: user.avatar_url || user.avatarUrl || null,
    role: user.role || "student",
  };
}

function normalizeAuthResponse(data = {}) {
  const root = data.data || data;
  const accessToken =
    findToken(data, "access_token") ||
    findToken(data, "accessToken") ||
    findToken(data, "token");
  const refreshToken =
    findToken(data, "refresh_token") || findToken(data, "refreshToken");
  const expiresIn = Number(root.expiresIn || root.expires_in || 3600);
  const user = normalizeUser(root.user || root.profile || root);

  return {
    user,
    session: {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_at:
        root.expires_at ||
        root.expiresAt ||
        Math.floor(Date.now() / 1000) + expiresIn,
      user,
    },
  };
}

async function refreshSession() {
  if (refreshPromise) return refreshPromise;
  const refreshToken = storedSession()?.refresh_token;
  if (!refreshToken) return null;

  refreshPromise = apiClient
    .post(
      "/auth/refresh-token",
      { refreshToken },
      { skipAuthRefresh: true, skipGlobalLoading: true },
    )
    .then((response) => {
      const session = normalizeAuthResponse(response.data).session;
      persistSession(session);
      notifyAuth("SIGNED_IN", session);
      return session;
    })
    .catch((error) => {
      persistSession(null);
      notifyAuth("SIGNED_OUT");
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function shouldRetry(error) {
  const config = error.config || {};
  const method = (config.method || "get").toLowerCase();
  const status = error.response?.status;
  return (
    !config._retryNetwork &&
    ["get", "head", "options"].includes(method) &&
    (!error.response || [408, 429, 502, 503, 504].includes(status))
  );
}

apiClient.interceptors.request.use((config) => {
  beginRequest(config);
  const token = storedSession()?.access_token;
  if (token && !config.skipAuth) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    endRequest(response.config);
    return response;
  },
  async (error) => {
    endRequest(error.config);
    const request = error.config;

    if (request && shouldRetry(error)) {
      request._retryNetwork = true;
      return apiClient(request);
    }

    if (
      request &&
      error.response?.status === 401 &&
      !request._retryAuth &&
      !request.skipAuthRefresh
    ) {
      request._retryAuth = true;
      try {
        const session = await refreshSession();
        if (session?.access_token) {
          request.headers = request.headers || {};
          request.headers.Authorization = `Bearer ${session.access_token}`;
          return apiClient(request);
        }
      } catch {
        persistSession(null);
        notifyAuth("SIGNED_OUT");
      }
    }

    return Promise.reject(error);
  },
);

export const authService = {
  async register(data) {
    const response = await apiClient.post(
      "/auth/register",
      {
        fullName: data.fullName,
        email: data.email?.trim().toLowerCase(),
        phone: data.phone || "",
        password: data.password,
        role: data.role || "student",
      },
      { skipAuth: true },
    );
    const auth = normalizeAuthResponse(response.data);
    persistSession(auth.session);
    notifyAuth("SIGNED_IN", auth.session);
    return {
      ...unwrapResponse(response),
      ...auth,
      resolvedRole: data.role || "student",
    };
  },

  async login({ email, password }) {
    const response = await apiClient.post(
      "/auth/login",
      { email: email?.trim().toLowerCase(), password },
      { skipAuth: true },
    );
    const auth = normalizeAuthResponse(response.data);
    persistSession(auth.session);
    notifyAuth("SIGNED_IN", auth.session);
    return { ...unwrapResponse(response), ...auth };
  },

  async logout() {
    const refreshToken = storedSession()?.refresh_token;
    try {
      await safeRequest(
        apiClient.post("/auth/logout", { refreshToken }, { skipAuth: false }),
        null,
        "Failed to sign out",
      );
    } catch (err) {
      console.warn("Logout request failed:", err);
    }
    persistSession(null);
    notifyAuth("SIGNED_OUT");
    return { success: true };
  },

  async getCurrentUser() {
    const result = await safeRequest(
      apiClient.get("/auth/me"),
      null,
      "Failed to fetch current user",
    );
    return result || storedSession()?.user || null;
  },

  async resetPassword(email) {
    return safeRequest(
      apiClient.post("/auth/forgot-password", { email }, { skipAuth: true }),
      null,
      "Password reset request failed",
    );
  },

  async confirmResetPassword(data) {
    return safeRequest(
      apiClient.post("/auth/reset-password", data, { skipAuth: true }),
      null,
      "Password reset failed",
    );
  },

  async updatePassword(data) {
    const payload =
      typeof data === "string" ? { newPassword: data } : { ...data };
    return safeRequest(
      apiClient.patch("/profile/password", payload),
      null,
      "Password update failed",
    );
  },

  getAuthState() {
    const session = storedSession();
    return { session, user: session?.user || null };
  },

  isSessionExpired(session) {
    return Boolean(
      session?.expires_at && session.expires_at * 1000 <= Date.now(),
    );
  },

  isConfigured() {
    return Boolean(API_BASE_URL);
  },
};

export const courseService = {
  async getCourses(params = {}) {
    const result = await safeRequest(
      apiClient.get("/courses", { params }),
      null,
      "Failed to fetch courses",
    );

    const courses = Array.isArray(result?.courses)
      ? result.courses
      : toList(result);
    const total = Number(
      result?.pagination?.total ?? result?.pagination?.count ?? courses.length,
    );

    return {
      data: courses,
      count: Number.isFinite(total) ? total : courses.length,
    };
  },
  async getCourseById(id) {
    if (!id) return null;
    return safeRequest(
      apiClient.get(`/courses/${id}`),
      null,
      "Failed to fetch course",
    );
  },
  async getPublishedCourseDetails(id) {
    const course = await this.getCourseById(id);
    const isVisible =
      course?.status === "published" &&
      course?.admin_approval_status === "approved";
    return isVisible ? course : null;
  },
  async getCourseCheckoutSummary(id) {
    return this.getCourseById(id);
  },
  async createCourse(data) {
    return safeRequest(
      apiClient.post("/courses", data),
      null,
      "Failed to create course",
    );
  },
  async updateCourse(id, data) {
    return safeRequest(
      apiClient.patch(`/courses/${id}`, data),
      null,
      "Failed to update course",
    );
  },
  async deleteCourse(id) {
    return safeRequest(
      apiClient.delete(`/courses/${id}`),
      null,
      "Failed to delete course",
    );
  },
  async getFeaturedCourses(limit = 6) {
    const result = await this.getCourses({ limit });
    return result.data || [];
  },
  async getCoursesByCategory(category) {
    const result = await this.getCourses({ category });
    return result.data || [];
  },
  async getInstructorCourses(instructorId) {
    const { data = [] } = await this.getCourses();
    if (!instructorId) return data;
    return data.filter((course) =>
      [
        course.instructor_id,
        course.instructorId,
        course.created_by,
        course.user_id,
      ].includes(instructorId),
    );
  },
};

export const categoryService = {
  async getCategories(params = {}) {
    return safeList(
      apiClient.get("/categories", { params }),
      "Failed to fetch categories",
    );
  },
  async createCategory(data) {
    return safeRequest(
      apiClient.post("/categories", data),
      null,
      "Failed to create category",
    );
  },
  async updateCategory(id, data) {
    return safeRequest(
      apiClient.patch(`/categories/${id}`, data),
      null,
      "Failed to update category",
    );
  },
  async deleteCategory(id) {
    return safeRequest(
      apiClient.delete(`/categories/${id}`),
      null,
      "Failed to delete category",
    );
  },
};

export const sectionService = {
  async getSectionsByCourse(courseId) {
    if (!courseId) return [];
    return safeList(
      apiClient.get(`/courses/${courseId}/sections`),
      "Failed to fetch course sections",
    );
  },
  async createSection(courseId, data) {
    return safeRequest(
      apiClient.post(`/courses/${courseId}/sections`, data),
      null,
      "Failed to create section",
    );
  },
  async updateSection(courseId, sectionId, data) {
    return safeRequest(
      apiClient.patch(`/courses/${courseId}/sections/${sectionId}`, data),
      null,
      "Failed to update section",
    );
  },
  async deleteSection(courseId, sectionId) {
    return safeRequest(
      apiClient.delete(`/courses/${courseId}/sections/${sectionId}`),
      null,
      "Failed to delete section",
    );
  },
};

import { createLessonService } from "./lessonService";

export const lessonService = createLessonService({
  apiClient,
  safeRequest,
  safeList,
  comingSoon,
});

export const enrollmentService = {
  async enrollInCourse(courseId) {
    return safeRequest(
      apiClient.post(`/progress/enroll/${courseId}`),
      null,
      "Enrollment failed",
    );
  },
  async getEnrollments() {
    return safeList(
      apiClient.get("/progress/enrollments"),
      "Failed to fetch enrollments",
    );
  },
  async getUserEnrollments() {
    return this.getEnrollments();
  },
  async isEnrolled(courseId) {
    const rows = await this.getEnrollments();
    return rows.some((row) =>
      [row.course_id, row.courseId, row.course?.id, row.Course?.id].includes(
        courseId,
      ),
    );
  },
  async updateProgress(lessonId, data = {}) {
    if (!lessonId) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.put(`/progress/lesson/${lessonId}`, data),
      null,
      "Failed to update lesson progress",
    );
  },
  async getCourseProgress(courseId) {
    if (!courseId) return null;
    return safeRequest(
      apiClient.get(`/progress/course/${courseId}`),
      null,
      "Failed to fetch course progress",
    );
  },
  async deleteEnrollment() {
    return comingSoon("Coming Soon");
  },
};

export const progressService = {
  updateLessonProgress: enrollmentService.updateProgress,
  getCourseProgress: enrollmentService.getCourseProgress,
};

export const adminService = {
  async getAllUsers(params = {}) {
    return safeList(
      apiClient.get("/admin/users", { params }),
      "Failed to fetch users",
    );
  },
  async getAllUsersAdmin(params) {
    return this.getAllUsers(params);
  },
  async getPendingInstructors() {
    return safeList(
      apiClient.get("/admin/users/pending"),
      "Failed to fetch pending instructors",
    );
  },
  async approveInstructor(userId) {
    return safeRequest(
      apiClient.patch(`/admin/users/${userId}/approve`),
      null,
      "Failed to approve instructor",
    );
  },
  async rejectInstructor(userId) {
    if (!userId) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.patch(`/admin/users/${userId}/role`, { role: "student" }),
      null,
      "Failed to reject instructor",
    );
  },
  async setUserSuspended(userId, isSuspended) {
    return safeRequest(
      apiClient.patch(
        `/admin/users/${userId}/${isSuspended ? "suspend" : "activate"}`,
      ),
      null,
      "Failed to update user status",
    );
  },
  async updateUserRole() {
    return comingSoon("Coming Soon");
  },
  async updateUserRoleAdmin(userId, role) {
    if (!userId || !role) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.patch(`/admin/users/${userId}/role`, { role }),
      null,
      "Failed to update user role",
    );
  },
  async updateCourseStatus(courseId, status) {
    return safeRequest(
      apiClient.patch(`/admin/courses/${courseId}/update-status`, { status }),
      null,
      "Failed to update course status",
    );
  },
  async getUserDetailsAdmin(userId) {
    if (!userId) return null;
    return safeRequest(
      apiClient.get(`/admin/users/${userId}`),
      null,
      "Failed to fetch user details",
    );
  },
  async getUserDetailsFallback() {
    return null;
  },
  async deletePlatformUser() {
    return comingSoon("Coming Soon");
  },
  async getCrmContacts() {
    return [];
  },
  async getDashboardStats() {
    const [users, pendingInstructors, coursesResult, categories] =
      await Promise.all([
        this.getAllUsers(),
        this.getPendingInstructors(),
        courseService.getCourses(),
        categoryService.getCategories(),
      ]);
    const courses = coursesResult.data || [];
    return { users, pendingInstructors, courses, categories };
  },
};

export const reviewService = {
  async getReviewsByCourse(courseId) {
    return safeList(
      apiClient.get("/reviews", { params: courseId ? { courseId } : {} }),
      "Failed to fetch reviews",
    );
  },
  async createReview() {
    return comingSoon("Coming Soon");
  },
  async updateReview() {
    return comingSoon("Coming Soon");
  },
  async deleteReview() {
    return comingSoon("Coming Soon");
  },
};

export const assessmentService = {
  async getCourseAssessments(courseId) {
    if (!courseId) return [];
    return safeList(
      apiClient.get(`/courses/${courseId}/assessments`),
      "Failed to fetch assessments",
    );
  },
  async createAssessment(courseId, data) {
    return safeRequest(
      apiClient.post(`/courses/${courseId}/assessments`, data),
      null,
      "Failed to create assessment",
    );
  },
  async updateAssessment(courseId, assessmentId, data) {
    return safeRequest(
      apiClient.patch(`/courses/${courseId}/assessments/${assessmentId}`, data),
      null,
      "Failed to update assessment",
    );
  },
  async deleteAssessment(courseId, assessmentId) {
    return safeRequest(
      apiClient.delete(`/courses/${courseId}/assessments/${assessmentId}`),
      null,
      "Failed to delete assessment",
    );
  },
  async getAssessment(courseId, assessmentId) {
    return safeRequest(
      apiClient.get(`/courses/${courseId}/assessments/${assessmentId}`),
      null,
      "Failed to fetch assessment",
    );
  },
  async startAssessment(courseId, assessmentId, data = {}) {
    return safeRequest(
      apiClient.post(
        `/courses/${courseId}/assessments/${assessmentId}/start`,
        data,
      ),
      null,
      "Failed to start assessment",
    );
  },
  async submitAssessment(courseId, assessmentId, data) {
    return safeRequest(
      apiClient.post(
        `/courses/${courseId}/assessments/${assessmentId}/submit`,
        data,
      ),
      null,
      "Failed to submit assessment",
    );
  },
  async getSubmission(submissionId) {
    return safeRequest(
      apiClient.get(`/submissions/${submissionId}`),
      null,
      "Failed to fetch submission",
    );
  },
  async getAssessmentSubmission(courseId, assessmentId, submissionId) {
    return safeRequest(
      apiClient.get(
        `/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}`,
      ),
      null,
      "Failed to fetch assessment submission",
    );
  },
};

export const uploadService = {
  async getSignature(params = {}) {
    return safeRequest(
      apiClient.get("/upload/signature", { params }),
      null,
      "Failed to get upload signature",
    );
  },
  async upload(data) {
    const headers =
      data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {};
    return safeRequest(
      apiClient.post("/upload", data, { headers }),
      null,
      "Failed to upload file",
    );
  },
};

export const userService = {
  async getProfile() {
    return safeRequest(
      apiClient.get("/profile"),
      null,
      "Failed to fetch profile",
    );
  },
  async getOrCreateProfile() {
    return this.getProfile();
  },
  async updateProfile(data) {
    return safeRequest(
      apiClient.patch("/profile", data),
      null,
      "Failed to update profile",
    );
  },
  async ensureUserRole() {
    return this.getProfile();
  },
  async uploadAvatar(fileOrUrl) {
    if (typeof fileOrUrl === "string") {
      return safeRequest(
        apiClient.patch("/profile/avatar", { avatarUrl: fileOrUrl }),
        null,
        "Failed to update avatar",
      );
    }
    return comingSoon("Avatar upload requires a supported upload flow.");
  },
};

export const profileService = userService;

export const dashboardService = {
  async getAdminDashboard() {
    return safeRequest(
      apiClient.get("/dashboard/admin"),
      null,
      "Failed to fetch admin dashboard",
    );
  },
  async getTeacherDashboard() {
    return safeRequest(
      apiClient.get("/dashboard/teacher"),
      null,
      "Failed to fetch teacher dashboard",
    );
  },
  async getStudentDashboard() {
    return safeRequest(
      apiClient.get("/dashboard/student"),
      null,
      "Failed to fetch student dashboard",
    );
  },
};

export const analyticsService = {
  async getAdminAnalytics() {
    const { users, pendingInstructors, courses, categories } =
      await adminService.getDashboardStats();
    return {
      total_users: users.length,
      pending_instructors: pendingInstructors.length,
      total_courses: courses.length,
      total_categories: categories.length,
    };
  },
  async getTeacherAnalytics(userId) {
    const courses = await courseService.getInstructorCourses(userId);
    const enrollments = await enrollmentService.getEnrollments();
    return {
      total_courses: courses.length,
      total_enrollments: enrollments.length,
    };
  },
  async getCourseAnalytics(courseId) {
    const [progress, reviews] = await Promise.all([
      enrollmentService.getCourseProgress(courseId),
      reviewService.getReviewsByCourse(courseId),
    ]);
    return { progress, reviews };
  },
};

export const meetingService = {
  async getMeetings(params = {}) {
    return safeList(
      apiClient.get("/meetings", { params }),
      "Failed to fetch meetings",
    );
  },
  async getMeeting(id) {
    if (!id) return null;
    return safeRequest(
      apiClient.get(`/meetings/${id}`),
      null,
      "Failed to fetch meeting",
    );
  },
  async createMeeting(data) {
    return safeRequest(
      apiClient.post("/meetings", data),
      null,
      "Failed to create meeting",
    );
  },
  async getMeetingsByCourse(courseId, options = {}) {
    const meetings = await this.getMeetings(options);
    if (!courseId || !Array.isArray(meetings)) return meetings || [];
    return meetings.filter((meeting) =>
      [
        meeting.course_id,
        meeting.courseId,
        meeting.course?.id,
        meeting.course?.course_id,
      ].includes(courseId),
    );
  },
  async getUpcomingMeetings(options = {}) {
    const meetings = await this.getMeetings(options);
    const now = Date.now();
    return (meetings || []).filter((meeting) => {
      const scheduled = meeting.scheduled_at
        ? new Date(meeting.scheduled_at).getTime()
        : NaN;
      return Number.isFinite(scheduled) && scheduled > now;
    });
  },
  async updateMeeting(id, data) {
    if (!id) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.patch(`/meetings/${id}`, data),
      null,
      "Failed to update meeting",
    );
  },
  async deleteMeeting(id) {
    if (!id) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.delete(`/meetings/${id}`),
      null,
      "Failed to delete meeting",
    );
  },
  async ensureMeetingJoinFields(meeting) {
    return meeting;
  },
};

export const notificationService = {
  async getUserNotifications(params = {}) {
    return safeList(
      apiClient.get("/notifications", { params }),
      "Failed to fetch notifications",
    );
  },
  async getSessionInvites(_, options = {}) {
    const items = await this.getUserNotifications(options);
    return (items || []).filter((notification) => {
      const text =
        `${notification?.title || ""} ${notification?.message || ""}`.toLowerCase();
      return (
        notification?.type === "meeting" ||
        notification?.type === "live_meeting" ||
        /meeting|session|live/i.test(text)
      );
    });
  },
  async getUnreadCount() {
    const items = await this.getUserNotifications({ limit: 100 });
    return (items || []).filter((notification) => !notification?.is_read)
      .length;
  },
  subscribeToUserNotifications() {
    return null;
  },
  removeChannel() {},
  async markAsRead(notificationId) {
    if (!notificationId) return null;
    return safeRequest(
      apiClient.patch(`/notifications/${notificationId}/read`),
      null,
      "Failed to mark notification as read",
    );
  },
  async markAllAsRead() {
    return safeRequest(
      apiClient.patch("/notifications/read-all"),
      null,
      "Failed to mark all notifications as read",
    );
  },
  async deleteNotification(notificationId) {
    if (!notificationId) return null;
    return safeRequest(
      apiClient.delete(`/notifications/${notificationId}`),
      null,
      "Failed to delete notification",
    );
  },
  async notifyStudents() {
    return comingSoon("Coming Soon");
  },
  async notifyEligibleStudents() {
    return comingSoon("Coming Soon");
  },
};

export const chatService = {
  getCourseChatChannelName: (courseId) => `course-chat-${courseId}`,
  subscribeToCourseChat(_courseId, handlers = {}) {
    handlers.onStatus?.("DISABLED");
    return null;
  },
  subscribeToConversationMessages() {
    return null;
  },
  removeChannel() {},
  async broadcastChatMessage() {},
  async getOrCreateConversation() {
    return null;
  },
  async _hydrateConversation() {
    return null;
  },
  async getInstructorChatRoster() {
    return [];
  },
  async getStudentChatInbox() {
    return [];
  },
  async getInstructorConversations() {
    return [];
  },
  async getMessages() {
    return [];
  },
  async _hydrateMessages(messages) {
    return messages || [];
  },
  async sendMessage() {
    return comingSoon("Coming Soon");
  },
  async markMessagesAsRead() {
    return comingSoon("Coming Soon");
  },
};

export const paymentService = {
  async hasApprovedPaymentForCourse() {
    return false;
  },
};

export const blogService = {
  async getPublishedPosts() {
    return safeList(
      apiClient.get("/blog/published"),
      "Failed to fetch blog posts",
    );
  },
  async getAdminPosts() {
    return safeList(
      apiClient.get("/blog/admin"),
      "Failed to fetch admin blog posts",
    );
  },
  async createPost(data) {
    return safeRequest(
      apiClient.post("/blog", data),
      null,
      "Failed to create blog post",
    );
  },
  async updatePost(id, data) {
    if (!id) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.patch(`/blog/${id}`, data),
      null,
      "Failed to update blog post",
    );
  },
  async deletePost(id) {
    if (!id) return comingSoon("Coming Soon");
    return safeRequest(
      apiClient.delete(`/blog/${id}`),
      null,
      "Failed to delete blog post",
    );
  },
};

export const articleScheduleService = {
  async getSchedules() {
    return [];
  },
  async createSchedule() {
    return comingSoon("Coming Soon");
  },
  async updateSchedule() {
    return comingSoon("Coming Soon");
  },
  async deleteSchedule() {
    return comingSoon("Coming Soon");
  },
  async processSchedule() {
    return comingSoon("Coming Soon");
  },
  async processDueSchedules() {
    return comingSoon("Coming Soon");
  },
};

export const reportService = {
  async getReports() {
    return [];
  },
  async getReport() {
    return null;
  },
  async exportReport() {
    return comingSoon("Coming Soon");
  },
};

export const certificateService = {
  async getCertificates() {
    return [];
  },
  async getCertificate() {
    return null;
  },
  async generateCertificate() {
    return comingSoon("Coming Soon");
  },
};

export const settingsService = {
  async getSettings() {
    return {};
  },
  async updateSettings() {
    return comingSoon("Coming Soon");
  },
};

export const services = {
  categories: categoryService,
  blogs: blogService,
  articleSchedules: articleScheduleService,
  admin: adminService,
  meetings: meetingService,
  notifications: notificationService,
  chat: chatService,
};

export const apiInternals = {
  AUTH_STORAGE_KEY,
  AUTH_SESSION_EVENT,
  API_BASE_URL,
};
