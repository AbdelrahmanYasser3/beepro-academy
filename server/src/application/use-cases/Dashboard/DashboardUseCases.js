class GetStudentDashboardUseCase {
  constructor({ dashboardRepository }) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute({ userId }) {
    return await this.dashboardRepository.getStudentDashboard(userId);
  }
}

class GetTeacherDashboardUseCase {
  constructor({ dashboardRepository }) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute({ userId }) {
    return await this.dashboardRepository.getTeacherDashboard(userId);
  }
}

class GetAdminDashboardUseCase {
  constructor({ dashboardRepository }) {
    this.dashboardRepository = dashboardRepository;
  }

  async execute() {
    return await this.dashboardRepository.getAdminDashboard();
  }
}

module.exports = {
  GetStudentDashboardUseCase,
  GetTeacherDashboardUseCase,
  GetAdminDashboardUseCase,
};
