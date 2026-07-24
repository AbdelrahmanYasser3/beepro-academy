const { z } = require("zod");

const listSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.object({
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

const generateSchema = z.object({
  body: z.object({
    course_id: z.string().min(1, "course_id is required"),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

module.exports = { listSchema, getSchema, generateSchema };
