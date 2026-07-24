const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/notificationValidators");

function createNotificationRoutes(
  notificationController,
  authenticate,
  authorize,
) {
  const router = Router();

  router.get(
    "/",
    authenticate,
    validate(validators.listSchema),
    notificationController.list,
  );
  router.patch(
    "/:id/read",
    authenticate,
    validate(validators.readSchema),
    notificationController.markRead,
  );
  router.patch("/read-all", authenticate, notificationController.markAllRead);
  router.delete(
    "/:id",
    authenticate,
    validate(validators.readSchema),
    notificationController.delete,
  );

  return router;
}

module.exports = createNotificationRoutes;
