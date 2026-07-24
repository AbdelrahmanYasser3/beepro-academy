const { Router } = require("express");

function createDashboardRoutes(dashboardController, authenticate, authorize) {
  const router = Router();

  router.get("/student", authenticate, dashboardController.student);
  router.get(
    "/teacher",
    authenticate,
    authorize("instructor", "admin"),
    dashboardController.teacher,
  );
  router.get(
    "/admin",
    authenticate,
    authorize("admin"),
    dashboardController.admin,
  );

  return router;
}

module.exports = createDashboardRoutes;
