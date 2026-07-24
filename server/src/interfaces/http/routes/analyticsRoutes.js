const { Router } = require("express");

function createAnalyticsRoutes(analyticsController, authenticate, authorize) {
  const router = Router();

  router.get("/course/:id", authenticate, analyticsController.course);
  router.get(
    "/teacher",
    authenticate,
    authorize("instructor", "admin"),
    analyticsController.teacher,
  );
  router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    analyticsController.admin,
  );

  return router;
}

module.exports = createAnalyticsRoutes;
