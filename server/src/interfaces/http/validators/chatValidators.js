const { z } = require("zod");

const listSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.object({
    search: z.string().optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    offset: z.string().regex(/^\d+$/).optional(),
  }),
  params: z.object({}).optional().default({}),
});

const getSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().min(1, "id is required") }),
});

const createSchema = z.object({
  body: z.object({
    receiver_id: z.string().min(1, "receiver_id is required"),
    course_id: z.string().optional(),
    content: z.string().min(1, "content is required"),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

const updateSchema = z.object({
  body: z
    .object({
      content: z.string().min(1, "content is required").optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().min(1, "id is required") }),
});

module.exports = { listSchema, getSchema, createSchema, updateSchema };
