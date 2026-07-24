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

const exportSchema = z.object({
  body: z.object({
    type: z.string().min(1, "type is required"),
    title: z.string().min(1, "title is required"),
    format: z.string().optional(),
    metadata: z.object({}).optional(),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

module.exports = { listSchema, getSchema, exportSchema };
