// Deprecated payment API shim — frontend must use REST endpoints via src/services/api.js
// Keeping this file to avoid breaking imports elsewhere, but all functions throw.

const throwDeprecated = () => {
  throw new Error("Deprecated: use REST API via src/services/api.js");
};

export const getInstructorPaymentMethods = () => throwDeprecated();
export const createPaymentMethod = () => throwDeprecated();
export const updatePaymentMethod = () => throwDeprecated();
export const deletePaymentMethod = () => throwDeprecated();
export const setPrimaryPaymentMethod = () => throwDeprecated();
export const getCoursePaymentMethods = () => throwDeprecated();
export const uploadPaymentScreenshot = () => throwDeprecated();
export const submitPaymentProof = () => throwDeprecated();
export const getStudentPaymentSubmissions = () => throwDeprecated();
export const getInstructorPaymentSubmissions = () => throwDeprecated();
export const getPaymentSubmissionDetails = () => throwDeprecated();
export const approvePaymentSubmission = () => throwDeprecated();
export const rejectPaymentSubmission = () => throwDeprecated();
export const requestPaymentInfo = () => throwDeprecated();
export const createPaymentNotification = () => throwDeprecated();
export const getPaymentNotifications = () => throwDeprecated();
export const markNotificationAsRead = () => throwDeprecated();
export const getInstructorPaymentStats = () => throwDeprecated();
export const getPendingPaymentsCount = () => throwDeprecated();
export const getRecentPaymentActivity = () => throwDeprecated();
export const formatPaymentDetails = () => throwDeprecated();
export const validatePaymentMethodData = () => throwDeprecated();
export const cleanupExpiredPayments = () => throwDeprecated();

export default {
  getInstructorPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setPrimaryPaymentMethod,
  getCoursePaymentMethods,
  uploadPaymentScreenshot,
  submitPaymentProof,
  getStudentPaymentSubmissions,
  getInstructorPaymentSubmissions,
  getPaymentSubmissionDetails,
  approvePaymentSubmission,
  rejectPaymentSubmission,
  requestPaymentInfo,
  createPaymentNotification,
  getPaymentNotifications,
  markNotificationAsRead,
  getInstructorPaymentStats,
  getPendingPaymentsCount,
  getRecentPaymentActivity,
  formatPaymentDetails,
  validatePaymentMethodData,
  cleanupExpiredPayments,
};
