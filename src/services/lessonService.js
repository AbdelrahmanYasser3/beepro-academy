export function createLessonService({
  apiClient,
  safeRequest,
  safeList,
  comingSoon,
}) {
  const service = {
    async getLessonsByCourse(courseId) {
      if (!courseId) return [];
      return safeList(
        apiClient.get(`/courses/${courseId}/lessons`),
        "Failed to fetch course lessons",
      );
    },

    async getPublishedLessonsByCourse(courseId) {
      return this.getLessonsByCourse(courseId);
    },

    async getLessonById(id) {
      if (!id) return null;
      return safeRequest(
        apiClient.get(`/lessons/${id}`),
        null,
        "Failed to fetch lesson",
      );
    },

    async getLessonsBySection(sectionId, courseId) {
      if (!sectionId || !courseId) return [];
      const lessons = await this.getLessonsByCourse(courseId);
      return (lessons || []).filter(
        (lesson) =>
          lesson.section_id === sectionId || lesson.sectionId === sectionId,
      );
    },

    async createLesson(data) {
      const courseId = data?.course_id || data?.courseId;
      if (!courseId) return comingSoon("Lesson creation requires a course ID");
      return safeRequest(
        apiClient.post(`/courses/${courseId}/lessons`, data),
        null,
        "Failed to create lesson",
      );
    },

    async createLessonInSection(sectionId, data) {
      const courseId = data?.course_id || data?.courseId;
      if (!sectionId || !courseId)
        return comingSoon(
          "Lesson creation in section requires section and course IDs",
        );
      return safeRequest(
        apiClient.post(`/courses/${courseId}/lessons`, {
          ...data,
          section_id: sectionId,
        }),
        null,
        "Failed to create lesson in section",
      );
    },

    async updateLesson(id, data) {
      if (!id) return comingSoon("Lesson ID is required");
      return safeRequest(
        apiClient.patch(`/lessons/${id}`, data),
        null,
        "Failed to update lesson",
      );
    },

    async deleteLesson(id) {
      if (!id) return comingSoon("Lesson ID is required");
      return safeRequest(
        apiClient.delete(`/lessons/${id}`),
        null,
        "Failed to delete lesson",
      );
    },
  };

  return service;
}
