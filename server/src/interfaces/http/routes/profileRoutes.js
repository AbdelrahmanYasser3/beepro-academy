const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/profileValidators");

function createProfileRoutes(profileController, authenticate, authorize) {
  const router = Router();

  router.get("/", authenticate, profileController.get);
  router.patch(
    "/",
    authenticate,
    validate(validators.profileSchema),
    profileController.update,
  );
  router.patch(
    "/avatar",
    authenticate,
    validate(validators.avatarSchema),
    profileController.updateAvatar,
  );
  router.patch(
    "/password",
    authenticate,
    validate(validators.passwordSchema),
    profileController.updatePassword,
  );

  return router;
}

module.exports = createProfileRoutes;
