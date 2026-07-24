const { toDashboardDTO } = require("../../../application/dtos/dashboardDTOs");

class DashboardController {
  constructor({ studentUseCase, teacherUseCase, adminUseCase }) {
    this.studentUseCase = studentUseCase;
    this.teacherUseCase = teacherUseCase;
    this.adminUseCase = adminUseCase;
  }

  student = async (req, res, next) => {
    try {
      const result = await this.studentUseCase.execute({
        userId: req.user?.id,
      });
      res
        .status(200)
        .json({ success: true, data: toDashboardDTO({ student: result }) });
    } catch (err) {
      next(err);
    }
  };

  teacher = async (req, res, next) => {
    try {
      const result = await this.teacherUseCase.execute({
        userId: req.user?.id,
      });
      res
        .status(200)
        .json({ success: true, data: toDashboardDTO({ teacher: result }) });
    } catch (err) {
      next(err);
    }
  };

  admin = async (req, res, next) => {
    try {
      const result = await this.adminUseCase.execute();
      res
        .status(200)
        .json({ success: true, data: toDashboardDTO({ admin: result }) });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = DashboardController;
