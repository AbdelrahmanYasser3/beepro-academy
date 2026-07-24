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
    title: z.string().min(2, "title is required"),
    content: z.string().optional(),
    video_url: z.string().url().optional(),
    duration: z.string().optional(),
    order_index: z.number().int().optional(),
    course_id: z.string().optional(),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

const updateSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).optional(),
      content: z.string().optional(),
      video_url: z.string().url().optional(),
      duration: z.string().optional(),
      order_index: z.number().int().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().min(1, "id is required") }),
});

module.exports = { listSchema, getSchema, createSchema, updateSchema };
