const { z } = require("zod");

const settingsSchema = z.object({
  body: z
    .object({
      notifications_enabled: z.boolean().optional(),
      email_notifications: z.boolean().optional(),
      dark_mode: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

module.exports = { settingsSchema };
