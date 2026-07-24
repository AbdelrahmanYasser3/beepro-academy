const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/settingsValidators");

function createSettingsRoutes(settingsController, authenticate, authorize) {
  const router = Router();

  router.get("/", authenticate, settingsController.get);
  router.patch(
    "/",
    authenticate,
    validate(validators.settingsSchema),
    settingsController.update,
  );

  return router;
}

module.exports = createSettingsRoutes;
