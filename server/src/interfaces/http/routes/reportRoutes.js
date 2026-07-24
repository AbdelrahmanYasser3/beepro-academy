const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/reportValidators");

function createReportRoutes(reportController, authenticate, authorize) {
  const router = Router();

  router.get(
    "/",
    authenticate,
    authorize("admin", "instructor"),
    validate(validators.listSchema),
    reportController.list,
  );
  router.get(
    "/:id",
    authenticate,
    authorize("admin", "instructor"),
    validate(validators.getSchema),
    reportController.get,
  );
  router.post(
    "/export",
    authenticate,
    authorize("admin", "instructor"),
    validate(validators.exportSchema),
    reportController.export,
  );

  return router;
}

module.exports = createReportRoutes;
