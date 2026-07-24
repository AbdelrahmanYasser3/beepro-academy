const { toProfileDTO } = require("../../../application/dtos/profileDTOs");

class ProfileController {
  constructor({
    getUseCase,
    updateUseCase,
    updateAvatarUseCase,
    updatePasswordUseCase,
  }) {
    this.getUseCase = getUseCase;
    this.updateUseCase = updateUseCase;
    this.updateAvatarUseCase = updateAvatarUseCase;
    this.updatePasswordUseCase = updatePasswordUseCase;
  }

  get = async (req, res, next) => {
    try {
      const result = await this.getUseCase.execute({ userId: req.user?.id });
      res.status(200).json({ success: true, data: toProfileDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const result = await this.updateUseCase.execute({
        userId: req.user?.id,
        data: req.body,
      });
      res.status(200).json({ success: true, data: toProfileDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  updateAvatar = async (req, res, next) => {
    try {
      const { avatarUrl } = req.body;
      const result = await this.updateAvatarUseCase.execute({
        userId: req.user?.id,
        avatarUrl,
      });
      res.status(200).json({ success: true, data: toProfileDTO(result) });
    } catch (err) {
      next(err);
    }
  };

  updatePassword = async (req, res, next) => {
    try {
      const result = await this.updatePasswordUseCase.execute({
        userId: req.user?.id,
        data: req.body,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProfileController;
