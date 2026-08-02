export const PAYMENT_TYPES = [];

const comingSoon = (message = "Coming Soon") => ({
  disabled: true,
  comingSoon: true,
  message,
});

export const paymentService = {
  async hasApprovedPaymentForCourse() {
    return false;
  },
  async getPaymentProofViewUrl(urlOrPath) {
    return urlOrPath;
  },
  async getCoursePaymentMethods() {
    return [];
  },
  async getMyPaymentMethods() {
    return [];
  },
  async createPaymentMethod() {
    return comingSoon();
  },
  async getInstructorPaymentSubmissions() {
    return [];
  },
  async getAllPaymentSubmissions() {
    return [];
  },
  async getStudentPaymentSubmissions() {
    return [];
  },
  async uploadPaymentScreenshot() {
    return comingSoon();
  },
  async submitPaymentProof() {
    return comingSoon();
  },
  async approvePaymentSubmission() {
    return comingSoon();
  },
  async rejectPaymentSubmission() {
    return comingSoon();
  },
};

export const paymentNotificationService = {
  async getUserNotifications() {
    return [];
  },
  subscribeToUserNotifications() {
    return null;
  },
  async markAsRead() {
    return comingSoon();
  },
  async markAllAsRead() {
    return comingSoon();
  },
  async deleteNotification() {
    return comingSoon();
  },
  removeChannel() {},
};

export default paymentService;
