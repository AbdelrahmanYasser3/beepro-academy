import { apiClient, safeRequest, safeList } from "./api";

export const assessmentService = {
  async getCourseAssessments(courseId) {
    if (!courseId) return [];
    return safeList(
      apiClient.get(`/courses/${courseId}/assessments`),
      "Failed to fetch assessments",
    );
  },

  async createAssessment(courseId, data) {
    if (!courseId) return null;
    return safeRequest(
      apiClient.post(`/courses/${courseId}/assessments`, data),
      null,
      "Failed to create assessment",
    );
  },

  async updateAssessment(courseId, assessmentId, data) {
    if (!courseId || !assessmentId) return null;
    return safeRequest(
      apiClient.patch(`/courses/${courseId}/assessments/${assessmentId}`, data),
      null,
      "Failed to update assessment",
    );
  },

  async deleteAssessment(courseId, assessmentId) {
    if (!courseId || !assessmentId) return null;
    return safeRequest(
      apiClient.delete(`/courses/${courseId}/assessments/${assessmentId}`),
      null,
      "Failed to delete assessment",
    );
  },

  async getAssessment(courseId, assessmentId) {
    if (!courseId || !assessmentId) return null;
    return safeRequest(
      apiClient.get(`/courses/${courseId}/assessments/${assessmentId}`),
      null,
      "Failed to fetch assessment",
    );
  },

  async startAssessment(courseId, assessmentId, data = {}) {
    if (!courseId || !assessmentId) return null;
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
    if (!courseId || !assessmentId) return null;
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
    if (!submissionId) return null;
    return safeRequest(
      apiClient.get(`/submissions/${submissionId}`),
      null,
      "Failed to fetch submission",
    );
  },

  async getAssessmentSubmission(courseId, assessmentId, submissionId) {
    if (!courseId || !assessmentId || !submissionId) return null;
    return safeRequest(
      apiClient.get(
        `/courses/${courseId}/assessments/${assessmentId}/submissions/${submissionId}`,
      ),
      null,
      "Failed to fetch assessment submission",
    );
  },
};
