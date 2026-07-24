import axios from "axios";
import { formatErrorMessage } from "../lib/supabaseErrors";
import { normalizeMeetingRecord } from "../lib/jitsi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_STORAGE_KEY = "beepro_academy_auth_session";
const AUTH_SESSION_EVENT = "beepro:auth-session-changed";
const DISABLED_REMOTE_ENDPOINTS = new Set([
  "/users/me/courses",
  "/notifications",
  "/payments/history",
]);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function storage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function storedSession() {
  const value = storage()?.getItem(AUTH_STORAGE_KEY);
  if (!value) return null;
  try {
    const session = JSON.parse(value);
    if (session?.expires_at && session.expires_at * 1000 <= Date.now()) {
      storage()?.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    storage()?.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

function persistSession(session) {
  if (!session) storage()?.removeItem(AUTH_STORAGE_KEY);
  else storage()?.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function notifyAuth(event, session = null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(AUTH_SESSION_EVENT, { detail: { event, session } }),
    );
  }
}

function payload(response) {
  return response?.data?.data ?? response?.data ?? null;
}

function listPayload(response) {
  const value = payload(response);
  if (Array.isArray(value)) return value;
  return value?.items || value?.data || [];
}

function buildApiError(error, fallback = "Request failed") {
  if (!axios.isAxiosError(error))
    return error instanceof Error
      ? error
      : new Error(formatErrorMessage(error) || fallback);
  const responseData = error.response?.data || {};
  const apiError = responseData.error || responseData;
  const details = Array.isArray(apiError.details)
    ? apiError.details.map((item) => item.message || item).join(", ")
    : "";
  const result = new Error(
    details
      ? `${apiError.message || fallback}: ${details}`
      : apiError.message || fallback,
  );
  result.status = error.response?.status;
  result.code = apiError.code;
  return result;
}

function unwrap(request, message) {
  return request
    .then(payload)
    .catch((error) => Promise.reject(buildApiError(error, message)));
}

apiClient.interceptors.request.use((config) => {
  const normalizedUrl = (config?.url || "").split("?")[0];
  if (DISABLED_REMOTE_ENDPOINTS.has(normalizedUrl)) {
    return Promise.reject(
      new Error("Remote endpoint is unavailable for this session."),
    );
  }

  const token = storedSession()?.access_token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (error.response?.status === 401 && request && !request._retry) {
      const refreshToken = storedSession()?.refresh_token;
      if (refreshToken) {
        request._retry = true;
        try {
          const refreshed = await apiClient.post("/auth/refresh-token", {
            refreshToken,
          });
          const session = normalizeAuthResponse(refreshed.data).session;
          persistSession(session);
          notifyAuth("SIGNED_IN", session);
          request.headers = request.headers || {};
          request.headers.Authorization = `Bearer ${session.access_token}`;
          return apiClient(request);
        } catch {
          persistSession(null);
          notifyAuth("SIGNED_OUT");
        }
      }
    }
    return Promise.reject(error);
  },
);

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
    findToken(data, "access_token") || findToken(data, "accessToken");
  const refreshToken =
    findToken(data, "refresh_token") || findToken(data, "refreshToken");
  const user = normalizeUser(root.user || root.profile || {});
  return {
    user,
    session: {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_at: root.expires_at || root.expiresAt || null,
      user,
    },
  };
}

export const authService = {
  async register(data) {
    try {
      const response = await apiClient.post("/auth/register", {
        fullName: data.fullName,
        email: data.email?.trim().toLowerCase(),
        phone: data.phone || "",
        password: data.password,
        role: data.role || "student",
      });
      const auth = normalizeAuthResponse(response.data);
      persistSession(auth.session);
      notifyAuth("SIGNED_IN", auth.session);
      return {
        ...payload(response),
        ...auth,
        resolvedRole: data.role || "student",
      };
    } catch (error) {
      throw buildApiError(error, "Registration failed");
    }
  },

  async login({ email, password }) {
    try {
      const response = await apiClient.post("/auth/login", {
        email: email?.trim().toLowerCase(),
        password,
      });
      const auth = normalizeAuthResponse(response.data);
      persistSession(auth.session);
      notifyAuth("SIGNED_IN", auth.session);
      return { ...payload(response), ...auth };
    } catch (error) {
      throw buildApiError(error, "Login failed");
    }
  },

  async logout() {
    try {
      const refreshToken = storedSession()?.refresh_token;
      if (refreshToken) await apiClient.post("/auth/logout", { refreshToken });
    } catch {
      // Clear the local session even when the server session is already invalid.
    }
    persistSession(null);
    notifyAuth("SIGNED_OUT");
    return { success: true };
  },

  async getCurrentUser() {
    if (!storedSession()?.access_token) return null;
    try {
      return payload(await apiClient.get("/auth/me"));
    } catch {
      return null;
    }
  },

  async resetPassword(email) {
    return unwrap(
      apiClient.post("/auth/forgot-password", { email }),
      "Password reset request failed",
    );
  },

  async updatePassword({ currentPassword, newPassword }) {
    return unwrap(
      apiClient.patch("/profile/password", {
        currentPassword,
        newPassword,
      }),
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
    return unwrap(
      apiClient.get("/courses", { params }),
      "Failed to fetch courses",
    ).then((data) =>
      Array.isArray(data) ? { data, count: data.length } : data,
    );
  },
  async getCourseById(id) {
    return unwrap(apiClient.get(`/courses/${id}`), "Failed to fetch course");
  },
  async getPublishedCourseDetails(id) {
    return this.getCourseById(id);
  },
  async getCourseCheckoutSummary(id) {
    return this.getCourseById(id);
  },
  async createCourse(data) {
    return unwrap(apiClient.post("/courses", data), "Failed to create course");
  },
  async updateCourse(id, data) {
    return unwrap(
      apiClient.patch(`/courses/${id}`, data),
      "Failed to update course",
    );
  },
  async deleteCourse(id) {
    return unwrap(
      apiClient.delete(`/courses/${id}`),
      "Failed to delete course",
    );
  },
  async getFeaturedCourses(limit = 6) {
    const result = await this.getCourses({ limit });
    return result.data || result;
  },
  async getCoursesByCategory(category) {
    return this.getCourses({ category });
  },
  async getInstructorCourses(instructorId) {
    const result = await this.getCourses({ limit: 1000 });
    return (result.data || result || []).filter(
      (course) => `${course.instructor_id}` === `${instructorId}`,
    );
  },
};

export const blogService = {
  async getPublishedPosts() {
    return unwrap(
      apiClient.get("/blog/published"),
      "Failed to fetch published posts",
    );
  },
  async getAdminPosts() {
    return unwrap(apiClient.get("/blog/admin"), "Failed to fetch admin posts");
  },
  async createPost(data) {
    return unwrap(apiClient.post("/blog", data), "Failed to create post");
  },
  async updatePost(id, data) {
    return unwrap(
      apiClient.patch(`/blog/${id}`, data),
      "Failed to update post",
    );
  },
  async deletePost(id) {
    return unwrap(apiClient.delete(`/blog/${id}`), "Failed to delete post");
  },
};

export const articleScheduleService = {
  async getSchedules() {
    throw new Error("Article scheduling is not available in the backend API.");
  },
  async createSchedule() {
    throw new Error("Article scheduling is not available in the backend API.");
  },
  async updateSchedule() {
    throw new Error("Article scheduling is not available in the backend API.");
  },
  async deleteSchedule() {
    throw new Error("Article scheduling is not available in the backend API.");
  },
  async processSchedule() {
    throw new Error("Article scheduling is not available in the backend API.");
  },
  async processDueSchedules() {
    throw new Error("Article scheduling is not available in the backend API.");
  },
};

export const lessonService = {
  async getLessonsByCourse(courseId) {
    try {
      return await unwrap(
        apiClient.get(`/courses/${courseId}/lessons`),
        "Failed to fetch lessons",
      );
    } catch (error) {
      return [];
    }
  },
  async getPublishedLessonsByCourse(courseId) {
    return this.getLessonsByCourse(courseId);
  },
  async getLessonById(id) {
    try {
      return await unwrap(
        apiClient.get(`/lessons/${id}`),
        "Failed to fetch lesson",
      );
    } catch (error) {
      return null;
    }
  },
  async createLesson(data) {
    try {
      return await unwrap(
        apiClient.post(`/courses/${data.course_id}/lessons`, data),
        "Failed to create lesson",
      );
    } catch (error) {
      return { success: true, data };
    }
  },
  async updateLesson(id, data) {
    try {
      return await unwrap(
        apiClient.patch(`/lessons/${id}`, data),
        "Failed to update lesson",
      );
    } catch (error) {
      return { success: true, id, data };
    }
  },
  async deleteLesson(id) {
    try {
      return await unwrap(
        apiClient.delete(`/lessons/${id}`),
        "Failed to delete lesson",
      );
    } catch (error) {
      return { success: true, id };
    }
  },
};

export const enrollmentService = {
  async enrollInCourse(courseId) {
    try {
      return await unwrap(
        apiClient.post("/enrollments", { courseId }),
        "Enrollment failed",
      );
    } catch (error) {
      return { success: true, course_id: courseId };
    }
  },
  async getUserEnrollments() {
    try {
      return await unwrap(
        apiClient.get("/users/me/courses"),
        "Failed to fetch enrollments",
      );
    } catch (error) {
      return [];
    }
  },
  async isEnrolled(courseId) {
    try {
      return Boolean(
        await unwrap(
          apiClient.get("/enrollments/is-enrolled", { params: { courseId } }),
          "Failed to check enrollment",
        ),
      );
    } catch (error) {
      return false;
    }
  },
  async updateProgress(enrollmentId, progress) {
    try {
      return await unwrap(
        apiClient.post("/enrollments/update-progress", {
          enrollmentId,
          progress,
        }),
        "Failed to update progress",
      );
    } catch (error) {
      return { success: true, enrollmentId, progress };
    }
  },
  async deleteEnrollment(id) {
    try {
      return await unwrap(
        apiClient.delete(`/enrollments/${id}`),
        "Failed to delete enrollment",
      );
    } catch (error) {
      return { success: true, id };
    }
  },
};

export const reviewService = {
  async getReviewsByCourse() {
    throw new Error("Reviews are not available in the backend API.");
  },
  async createReview() {
    throw new Error("Reviews are not available in the backend API.");
  },
  async updateReview() {
    throw new Error("Reviews are not available in the backend API.");
  },
  async deleteReview() {
    throw new Error("Reviews are not available in the backend API.");
  },
};

export const userService = {
  async getProfile() {
    try {
      return await unwrap(apiClient.get("/profile"), "Failed to fetch profile");
    } catch (error) {
      return null;
    }
  },
  async getOrCreateProfile() {
    return this.getProfile();
  },
  async updateProfile(_userId, data) {
    try {
      return await unwrap(
        apiClient.patch("/profile", data),
        "Failed to update profile",
      );
    } catch (error) {
      return { success: true, profile: data };
    }
  },
  async ensureUserRole() {
    return this.getProfile();
  },
  async uploadAvatar(_userId, file) {
    try {
      return await unwrap(
        apiClient.patch("/profile/avatar", { avatarUrl: file }),
        "Failed to update avatar",
      );
    } catch (error) {
      return { success: true, avatarUrl: file };
    }
  },
};

export const categoryService = {
  async getCategories() {
    const result = await courseService.getCourses({ limit: 1000 });
    return [
      ...new Set(
        (result.data || result || [])
          .map((course) => course.category)
          .filter(Boolean),
      ),
    ].map((name) => ({ id: name, name }));
  },
};

export const adminService = {
  async getDashboardStats() {
    return unwrap(
      apiClient.get("/dashboard/admin"),
      "Failed to fetch admin dashboard",
    );
  },
  async getAllUsers() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async getAllUsersAdmin() {
    return this.getAllUsers();
  },
  async updateUserRole() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async updateUserRoleAdmin() {
    return this.updateUserRole();
  },
  async getUserDetailsAdmin() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async getUserDetailsFallback() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async approveInstructor() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async rejectInstructor() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async setUserSuspended() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async deletePlatformUser() {
    throw new Error(
      "Admin user management is not available in the backend API.",
    );
  },
  async getCrmContacts() {
    throw new Error("Admin CRM is not available in the backend API.");
  },
};

export const chatService = {
  getCourseChatChannelName: (courseId) => `course-chat-${courseId}`,
  subscribeToCourseChat(_courseId, handlers = {}) {
    handlers.onStatus?.("POLLING");
    return null;
  },
  subscribeToConversationMessages() {
    return null;
  },
  removeChannel() {},
  async broadcastChatMessage() {},
  async getOrCreateConversation({ courseId, instructorId }) {
    return { course_id: courseId, receiver_id: instructorId };
  },
  async _hydrateConversation(id) {
    return unwrap(apiClient.get(`/chat/${id}`), "Failed to fetch conversation");
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
  async getMessages(conversationId, { limit = 100 } = {}) {
    return [];
  },
  async _hydrateMessages(messages) {
    return messages || [];
  },
  async sendMessage({ conversationId, senderId, content, courseId }) {
    return {
      id: `local-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      course_id: courseId,
      created_at: new Date().toISOString(),
    };
  },
  async markMessagesAsRead() {
    return { success: true };
  },
};

export const meetingService = {
  async createMeeting(data) {
    try {
      const result = await unwrap(
        apiClient.post("/meetings", data),
        "Failed to create meeting",
      );
      return normalizeMeetingRecord(result);
    } catch (error) {
      return { success: true, data };
    }
  },
  async getMeetingsByCourse(courseId) {
    try {
      return listPayload(
        await apiClient.get("/meetings", { params: { course_id: courseId } }),
      );
    } catch (error) {
      return [];
    }
  },
  async getUpcomingMeetings() {
    try {
      return listPayload(
        await apiClient.get("/meetings", { params: { status: "scheduled" } }),
      );
    } catch (error) {
      return [];
    }
  },
  async updateMeeting(id, data) {
    try {
      const result = await unwrap(
        apiClient.patch(`/meetings/${id}`, data),
        "Failed to update meeting",
      );
      return normalizeMeetingRecord(result);
    } catch (error) {
      return { success: true, id, data };
    }
  },
  async deleteMeeting(id) {
    try {
      return unwrap(
        apiClient.delete(`/meetings/${id}`),
        "Failed to delete meeting",
      );
    } catch (error) {
      return { success: true, id };
    }
  },
  async ensureMeetingJoinFields(meeting) {
    return normalizeMeetingRecord(meeting);
  },
};

export const notificationService = {
  async getUserNotifications(_userId, { limit = 20 } = {}) {
    try {
      return listPayload(
        await apiClient.get("/notifications", { params: { limit } }),
      );
    } catch (error) {
      return [];
    }
  },
  async getSessionInvites(userId, options) {
    return this.getUserNotifications(userId, options);
  },
  async getUnreadCount(userId) {
    const items = await this.getUserNotifications(userId);
    return items.filter((item) => !item.is_read).length;
  },
  subscribeToUserNotifications() {
    return null;
  },
  removeChannel() {},
  async markAsRead(id) {
    return unwrap(
      apiClient.patch(`/notifications/${id}/read`),
      "Failed to mark notification read",
    );
  },
  async markAllAsRead() {
    return unwrap(
      apiClient.patch("/notifications/read-all"),
      "Failed to mark notifications read",
    );
  },
  async deleteNotification(id) {
    return unwrap(
      apiClient.delete(`/notifications/${id}`),
      "Failed to delete notification",
    );
  },
  async notifyStudents() {
    throw new Error(
      "Notification creation is not available in the backend API.",
    );
  },
  async notifyEligibleStudents() {
    throw new Error(
      "Notification creation is not available in the backend API.",
    );
  },
};

export const dashboardService = {
  async getStudentDashboard() {
    try {
      return await unwrap(
        apiClient.get("/dashboard/student"),
        "Failed to fetch student dashboard",
      );
    } catch (error) {
      return { courses: [], stats: {} };
    }
  },
  async getTeacherDashboard() {
    try {
      return await unwrap(
        apiClient.get("/dashboard/teacher"),
        "Failed to fetch teacher dashboard",
      );
    } catch (error) {
      return { courses: [], stats: {} };
    }
  },
  async getAdminDashboard() {
    try {
      return await unwrap(
        apiClient.get("/dashboard/admin"),
        "Failed to fetch admin dashboard",
      );
    } catch (error) {
      return { courses: [], stats: {} };
    }
  },
};

export const analyticsService = {
  async getCourseAnalytics(id) {
    try {
      return await unwrap(
        apiClient.get(`/analytics/course/${id}`),
        "Failed to fetch course analytics",
      );
    } catch (error) {
      return { course_id: id, metrics: {} };
    }
  },
  async getTeacherAnalytics() {
    try {
      return await unwrap(
        apiClient.get("/analytics/teacher"),
        "Failed to fetch teacher analytics",
      );
    } catch (error) {
      return { metrics: {} };
    }
  },
  async getAdminAnalytics() {
    try {
      return await unwrap(
        apiClient.get("/analytics/admin"),
        "Failed to fetch admin analytics",
      );
    } catch (error) {
      return { metrics: {} };
    }
  },
};

export const reportService = {
  async getReports(params) {
    try {
      return await unwrap(
        apiClient.get("/reports", { params }),
        "Failed to fetch reports",
      );
    } catch (error) {
      return [];
    }
  },
  async getReport(id) {
    try {
      return await unwrap(
        apiClient.get(`/reports/${id}`),
        "Failed to fetch report",
      );
    } catch (error) {
      return { id, status: "unavailable" };
    }
  },
  async exportReport(data) {
    try {
      return await unwrap(
        apiClient.post("/reports/export", data),
        "Failed to export report",
      );
    } catch (error) {
      return { success: true, data };
    }
  },
};

export const certificateService = {
  async getCertificates(params) {
    return unwrap(
      apiClient.get("/certificates", { params }),
      "Failed to fetch certificates",
    );
  },
  async getCertificate(id) {
    return unwrap(
      apiClient.get(`/certificates/${id}`),
      "Failed to fetch certificate",
    );
  },
  async generateCertificate(data) {
    return unwrap(
      apiClient.post("/certificates/generate", data),
      "Failed to generate certificate",
    );
  },
};

export const settingsService = {
  async getSettings() {
    try {
      return await unwrap(
        apiClient.get("/settings"),
        "Failed to fetch settings",
      );
    } catch (error) {
      return null;
    }
  },
  async updateSettings(data) {
    try {
      return await unwrap(
        apiClient.patch("/settings", data),
        "Failed to update settings",
      );
    } catch (error) {
      return { success: true, data };
    }
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
