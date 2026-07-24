const { z } = require("zod");

const profileSchema = z.object({
  body: z
    .object({
      full_name: z.string().min(2).optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

const avatarSchema = z.object({
  body: z.object({
    avatarUrl: z.string().url("avatarUrl must be a valid URL"),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

const passwordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "currentPassword is required"),
    newPassword: z.string().min(8, "newPassword must be at least 8 characters"),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

module.exports = { profileSchema, avatarSchema, passwordSchema };
