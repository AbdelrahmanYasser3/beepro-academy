const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/paymentValidators");

function createPaymentRoutes(paymentController, authenticate, authorize) {
  const router = Router();

  router.get(
    "/",
    authenticate,
    authorize("admin", "instructor", "student"),
    validate(validators.listSchema),
    paymentController.list,
  );
  router.get(
    "/history",
    authenticate,
    validate(validators.listSchema),
    paymentController.history,
  );
  router.get(
    "/:id",
    authenticate,
    validate(validators.getSchema),
    paymentController.get,
  );
  router.post(
    "/",
    authenticate,
    validate(validators.createSchema),
    paymentController.create,
  );
  router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    validate(validators.updateSchema),
    paymentController.update,
  );

  return router;
}

module.exports = createPaymentRoutes;
