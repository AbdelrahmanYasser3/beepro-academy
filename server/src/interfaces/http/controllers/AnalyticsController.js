const { toAnalyticsDTO } = require("../../../application/dtos/analyticsDTOs");

class AnalyticsController {
  constructor({ courseUseCase, teacherUseCase, adminUseCase }) {
    this.courseUseCase = courseUseCase;
    this.teacherUseCase = teacherUseCase;
    this.adminUseCase = adminUseCase;
  }

  course = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.courseUseCase.execute({ courseId: id });
      res
        .status(200)
        .json({
          success: true,
          data: toAnalyticsDTO({ ...result, course_id: id }),
        });
    } catch (err) {
      next(err);
    }
  };

  teacher = async (req, res, next) => {
    try {
      const result = await this.teacherUseCase.execute({
        userId: req.user?.id,
      });
      res.status(200).json({ success: true, data: toAnalyticsDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  admin = async (req, res, next) => {
    try {
      const result = await this.adminUseCase.execute();
      res.status(200).json({ success: true, data: toAnalyticsDTO(result) });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AnalyticsController;
