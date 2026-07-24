const {
  toReportDTO,
  toReportListDTO,
} = require("../../../application/dtos/reportDTOs");

class ReportController {
  constructor({ listUseCase, getUseCase, exportUseCase }) {
    this.listUseCase = listUseCase;
    this.getUseCase = getUseCase;
    this.exportUseCase = exportUseCase;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.listUseCase.execute({
        userId: req.user?.id,
        search: req.query?.search,
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res.status(200).json({ success: true, data: toReportListDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.getUseCase.execute({
        id,
        userId: req.user?.id,
      });
      res.status(200).json({ success: true, data: toReportDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  export = async (req, res, next) => {
    try {
      const result = await this.exportUseCase.execute({
        userId: req.user?.id,
        data: req.body,
      });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ReportController;
