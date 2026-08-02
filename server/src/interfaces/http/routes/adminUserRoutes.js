const { Router } = require("express");
const { z } = require("zod");
const validate = require("../middlewares/validate");

const idParams = z.object({
  body: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().uuid("id must be a valid UUID") }),
});

const roleSchema = z.object({
  body: z.object({
    role: z.enum(["student", "pending_instructor", "instructor", "teacher", "admin"]),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().uuid("id must be a valid UUID") }),
});

const suspendedSchema = z.object({
  body: z.object({
    is_suspended: z.boolean(),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().uuid("id must be a valid UUID") }),
});

function createAdminUserRoutes(adminUserController, authenticate, authorize) {
  const router = Router();

  router.use(authenticate, authorize("admin"));
  router.get("/users", adminUserController.list);
  router.get("/users/:id", validate(idParams), adminUserController.details);
  router.patch("/users/:id/role", validate(roleSchema), adminUserController.updateRole);
  router.patch(
    "/users/:id/suspended",
    validate(suspendedSchema),
    adminUserController.setSuspended,
  );
  router.delete("/users/:id", validate(idParams), adminUserController.delete);

  return router;
}

module.exports = createAdminUserRoutes;
