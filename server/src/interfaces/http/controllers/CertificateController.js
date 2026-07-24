const {
  toCertificateDTO,
  toCertificateListDTO,
} = require("../../../application/dtos/certificateDTOs");

class CertificateController {
  constructor({ listUseCase, getUseCase, generateUseCase }) {
    this.listUseCase = listUseCase;
    this.getUseCase = getUseCase;
    this.generateUseCase = generateUseCase;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.listUseCase.execute({
        userId: req.user?.id,
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res
        .status(200)
        .json({ success: true, data: toCertificateListDTO(result) });
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
      res.status(200).json({ success: true, data: toCertificateDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  generate = async (req, res, next) => {
    try {
      const result = await this.generateUseCase.execute({
        userId: req.user?.id,
        data: req.body,
      });
      res.status(201).json({ success: true, data: toCertificateDTO(result) });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CertificateController;
