const {
  toMessageDTO,
  toChatListDTO,
} = require("../../../application/dtos/chatDTOs");

class ChatController {
  constructor({
    listUseCase,
    getUseCase,
    createUseCase,
    updateUseCase,
    deleteUseCase,
  }) {
    this.listUseCase = listUseCase;
    this.getUseCase = getUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.listUseCase.execute({
        userId: req.user?.id,
        search: req.query?.search,
        limit: req.query?.limit,
        offset: req.query?.offset,
      });
      res.status(200).json({ success: true, data: toChatListDTO(result) });
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
      res.status(200).json({ success: true, data: toMessageDTO(result) });
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
      res.status(201).json({ success: true, data: toMessageDTO(result) });
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
      res.status(200).json({ success: true, data: toMessageDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.deleteUseCase.execute({
        id,
        userId: req.user?.id,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ChatController;
