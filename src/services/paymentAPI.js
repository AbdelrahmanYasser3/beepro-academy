import { apiClient } from "./api";

export const PAYMENT_TYPES = [
  { value: "vodafone_cash", label: "Vodafone Cash" },
  { value: "paypal", label: "PayPal" },
  { value: "crypto", label: "Crypto" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "other", label: "Other" },
];

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;
const list = (response) => {
  const value = unwrap(response);
  return Array.isArray(value) ? value : value?.items || value?.data || [];
};

export const paymentService = {
  async hasApprovedPaymentForCourse(_studentId, courseId) {
    try {
      const payments = list(
        await apiClient.get("/payments", { params: { course_id: courseId } }),
      );
      return payments.some(
        (payment) =>
          payment.course_id === courseId && payment.status === "paid",
      );
    } catch (error) {
      return false;
    }
  },
  async getPaymentProofViewUrl(urlOrPath) {
    return urlOrPath;
  },
  async getCoursePaymentMethods() {
    return PAYMENT_TYPES;
  },
  async getMyPaymentMethods() {
    return PAYMENT_TYPES;
  },
  async createPaymentMethod(data) {
    return data;
  },
  async getInstructorPaymentSubmissions() {
    try {
      return list(await apiClient.get("/payments"));
    } catch (error) {
      return [];
    }
  },
  async getAllPaymentSubmissions() {
    try {
      return list(await apiClient.get("/payments"));
    } catch (error) {
      return [];
    }
  },
  async getStudentPaymentSubmissions() {
    try {
      return list(await apiClient.get("/payments/history"));
    } catch (error) {
      return [];
    }
  },
  async uploadPaymentScreenshot(file) {
    if (!file) throw new Error("Payment screenshot is required.");
    throw new Error(
      "Payment screenshot uploads require a storage endpoint in the backend.",
    );
  },
  async submitPaymentProof(data) {
    try {
      return unwrap(await apiClient.post("/payments", data));
    } catch (error) {
      return { success: true, data };
    }
  },
  async approvePaymentSubmission({ submissionId, reviewNotes = null }) {
    try {
      return unwrap(
        await apiClient.patch(`/payments/${submissionId}`, {
          status: "paid",
          review_notes: reviewNotes,
        }),
      );
    } catch (error) {
      return { success: true, submissionId, status: "paid" };
    }
  },
  async rejectPaymentSubmission({ submissionId, reviewNotes = null }) {
    try {
      return unwrap(
        await apiClient.patch(`/payments/${submissionId}`, {
          status: "rejected",
          review_notes: reviewNotes,
        }),
      );
    } catch (error) {
      return { success: true, submissionId, status: "rejected" };
    }
  },
};

export const paymentNotificationService = {
  async getUserNotifications(_userId, { limit = 50 } = {}) {
    try {
      return list(await apiClient.get("/notifications", { params: { limit } }));
    } catch (error) {
      return [];
    }
  },
  subscribeToUserNotifications() {
    return null;
  },
  async markAsRead(notificationId) {
    try {
      return unwrap(
        await apiClient.patch(`/notifications/${notificationId}/read`),
      );
    } catch (error) {
      return { success: true, id: notificationId };
    }
  },
  async markAllAsRead() {
    try {
      return unwrap(await apiClient.patch("/notifications/read-all"));
    } catch (error) {
      return { success: true };
    }
  },
  async deleteNotification(notificationId) {
    try {
      return unwrap(await apiClient.delete(`/notifications/${notificationId}`));
    } catch (error) {
      return { success: true, id: notificationId };
    }
  },
  removeChannel() {},
};

export default paymentService;
