const { toSettingsDTO } = require("../../../application/dtos/settingsDTOs");

class SettingsController {
  constructor({ getUseCase, updateUseCase }) {
    this.getUseCase = getUseCase;
    this.updateUseCase = updateUseCase;
  }

  get = async (req, res, next) => {
    try {
      const result = await this.getUseCase.execute({ userId: req.user?.id });
      res.status(200).json({ success: true, data: toSettingsDTO(result) });
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
      res.status(200).json({ success: true, data: toSettingsDTO(result) });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = SettingsController;
