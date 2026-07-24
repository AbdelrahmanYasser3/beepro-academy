const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/chatValidators");

function createChatRoutes(chatController, authenticate, authorize) {
  const router = Router();

  router.get(
    "/",
    authenticate,
    validate(validators.listSchema),
    chatController.list,
  );
  router.get(
    "/:id",
    authenticate,
    validate(validators.getSchema),
    chatController.get,
  );
  router.post(
    "/",
    authenticate,
    validate(validators.createSchema),
    chatController.create,
  );
  router.patch(
    "/:id",
    authenticate,
    validate(validators.updateSchema),
    chatController.update,
  );
  router.delete(
    "/:id",
    authenticate,
    validate(validators.getSchema),
    chatController.delete,
  );

  return router;
}

module.exports = createChatRoutes;
