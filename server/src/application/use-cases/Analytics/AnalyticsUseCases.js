class GetCourseAnalyticsUseCase {
  constructor({ analyticsRepository }) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute({ courseId }) {
    if (!courseId) throw new Error("courseId is required");
    return await this.analyticsRepository.getCourseAnalytics(courseId);
  }
}

class GetTeacherAnalyticsUseCase {
  constructor({ analyticsRepository }) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute({ userId }) {
    return await this.analyticsRepository.getTeacherAnalytics(userId);
  }
}

class GetAdminAnalyticsUseCase {
  constructor({ analyticsRepository }) {
    this.analyticsRepository = analyticsRepository;
  }

  async execute() {
    return await this.analyticsRepository.getAdminAnalytics();
  }
}

module.exports = {
  GetCourseAnalyticsUseCase,
  GetTeacherAnalyticsUseCase,
  GetAdminAnalyticsUseCase,
};
