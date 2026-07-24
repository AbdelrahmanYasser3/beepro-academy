const { NotFoundError } = require("../../../domain/errors/AppError");

class ListReportsUseCase {
  constructor({ reportRepository }) {
    this.reportRepository = reportRepository;
  }

  async execute({ userId, search, limit, offset }) {
    return await this.reportRepository.list({ userId, search, limit, offset });
  }
}

class GetReportUseCase {
  constructor({ reportRepository }) {
    this.reportRepository = reportRepository;
  }

  async execute({ id, userId }) {
    if (!id) throw new Error("id is required");
    const report = await this.reportRepository.getById(id, userId);
    if (!report) throw new NotFoundError("Report");
    return report;
  }
}

class ExportReportUseCase {
  constructor({ reportRepository }) {
    this.reportRepository = reportRepository;
  }

  async execute({ userId, data }) {
    if (!data) throw new Error("data is required");
    return await this.reportRepository.exportReport(userId, data);
  }
}

module.exports = { ListReportsUseCase, GetReportUseCase, ExportReportUseCase };
