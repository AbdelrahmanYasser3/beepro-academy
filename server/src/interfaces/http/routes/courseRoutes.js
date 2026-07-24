const { Router } = require("express");

function createCourseRoutes(
  courseController,
  authenticate,
  authorize,
  lessonController,
) {
  const router = Router();

  // Public
  router.get("/", courseController.list);
  if (lessonController) {
    router.get("/:courseId/lessons", lessonController.listByCourse);
    router.post(
      "/:courseId/lessons",
      authenticate,
      authorize("instructor", "admin"),
      lessonController.create,
    );
  }
  router.get("/:id", courseController.get);

  // Protected - instructor/admin
  router.post(
    "/",
    authenticate,
    authorize("instructor", "admin"),
    courseController.create,
  );
  router.patch(
    "/:id",
    authenticate,
    authorize("instructor", "admin"),
    courseController.update,
  );
  router.delete(
    "/:id",
    authenticate,
    authorize("instructor", "admin"),
    courseController.delete,
  );

  return router;
}

module.exports = createCourseRoutes;
