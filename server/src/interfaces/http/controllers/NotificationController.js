const {
  toNotificationDTO,
  toNotificationListDTO,
} = require("../../../application/dtos/notificationDTOs");

class NotificationController {
  constructor({
    listUseCase,
    markReadUseCase,
    markAllReadUseCase,
    deleteUseCase,
  }) {
    this.listUseCase = listUseCase;
    this.markReadUseCase = markReadUseCase;
    this.markAllReadUseCase = markAllReadUseCase;
    this.deleteUseCase = deleteUseCase;
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
        .json({ success: true, data: toNotificationListDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  markRead = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await this.markReadUseCase.execute({
        id,
        userId: req.user?.id,
      });
      res.status(200).json({ success: true, data: toNotificationDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  markAllRead = async (req, res, next) => {
    try {
      const result = await this.markAllReadUseCase.execute({
        userId: req.user?.id,
      });
      res.status(200).json({ success: true, data: result });
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

module.exports = NotificationController;
