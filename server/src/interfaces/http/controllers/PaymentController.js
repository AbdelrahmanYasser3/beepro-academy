const {
  toPaymentDTO,
  toPaymentListDTO,
} = require("../../../application/dtos/paymentDTOs");

class PaymentController {
  constructor({
    listUseCase,
    getUseCase,
    historyUseCase,
    createUseCase,
    updateUseCase,
  }) {
    this.listUseCase = listUseCase;
    this.getUseCase = getUseCase;
    this.historyUseCase = historyUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.listUseCase.execute({
        userId: req.user?.id,
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res.status(200).json({ success: true, data: toPaymentListDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  history = async (req, res, next) => {
    try {
      const result = await this.historyUseCase.execute({
        userId: req.user?.id,
      });
      res.status(200).json({ success: true, data: toPaymentListDTO(result) });
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
      res.status(200).json({ success: true, data: toPaymentDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const result = await this.createUseCase.execute({
        userId: req.user?.id,
        data: req.body,
      });
      res.status(201).json({ success: true, data: toPaymentDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.updateUseCase.execute({
        id,
        userId: req.user?.id,
        data: req.body,
      });
      res.status(200).json({ success: true, data: toPaymentDTO(result) });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = PaymentController;
