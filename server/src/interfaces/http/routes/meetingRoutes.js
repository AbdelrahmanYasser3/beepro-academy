const { Router } = require("express");
const validate = require("../middlewares/validate");
const validators = require("../validators/meetingValidators");

function createMeetingRoutes(meetingController, authenticate, authorize) {
  const router = Router();

  router.get(
    "/",
    authenticate,
    validate(validators.listSchema),
    meetingController.list,
  );
  router.get(
    "/:id",
    authenticate,
    validate(validators.getSchema),
    meetingController.get,
  );
  router.post(
    "/",
    authenticate,
    authorize("instructor", "admin"),
    validate(validators.createSchema),
    meetingController.create,
  );
  router.patch(
    "/:id",
    authenticate,
    authorize("instructor", "admin"),
    validate(validators.updateSchema),
    meetingController.update,
  );
  router.delete(
    "/:id",
    authenticate,
    authorize("instructor", "admin"),
    validate(validators.getSchema),
    meetingController.delete,
  );

  return router;
}

module.exports = createMeetingRoutes;
