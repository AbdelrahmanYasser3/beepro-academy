const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/certificateValidators");

function createCertificateRoutes(
  certificateController,
  authenticate,
  authorize,
) {
  const router = Router();

  router.get(
    "/",
    authenticate,
    validate(validators.listSchema),
    certificateController.list,
  );
  router.get(
    "/:id",
    authenticate,
    validate(validators.getSchema),
    certificateController.get,
  );
  router.post(
    "/generate",
    authenticate,
    validate(validators.generateSchema),
    certificateController.generate,
  );

  return router;
}

module.exports = createCertificateRoutes;
