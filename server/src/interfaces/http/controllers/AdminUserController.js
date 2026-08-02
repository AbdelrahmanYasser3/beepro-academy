class AdminUserController {
  constructor({
    listUseCase,
    detailsUseCase,
    updateRoleUseCase,
    setSuspendedUseCase,
    deleteUseCase,
  }) {
    this.listUseCase = listUseCase;
    this.detailsUseCase = detailsUseCase;
    this.updateRoleUseCase = updateRoleUseCase;
    this.setSuspendedUseCase = setSuspendedUseCase;
    this.deleteUseCase = deleteUseCase;
  }

  list = async (req, res, next) => {
    try {
      const result = await this.listUseCase.execute();
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  details = async (req, res, next) => {
    try {
      const result = await this.detailsUseCase.execute({ id: req.params.id });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const result = await this.updateRoleUseCase.execute({
        id: req.params.id,
        role: req.body.role,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  setSuspended = async (req, res, next) => {
    try {
      const result = await this.setSuspendedUseCase.execute({
        id: req.params.id,
        isSuspended: req.body.is_suspended,
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.deleteUseCase.execute({ id: req.params.id });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AdminUserController;
