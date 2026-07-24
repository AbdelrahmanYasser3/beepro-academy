const { z } = require("zod");

const listSchema = z.object({
  body: z.object({}).optional().default({}),
  query: z.object({
    search: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
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
    description: z.string().optional(),
    scheduled_at: z.string().min(1, "scheduled_at is required"),
    meeting_type: z.string().optional(),
    course_id: z.string().optional(),
    participant_ids: z.array(z.string()).optional(),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

const updateSchema = z.object({
  body: z
    .object({
      title: z.string().min(2).optional(),
      description: z.string().optional(),
      scheduled_at: z.string().optional(),
      meeting_type: z.string().optional(),
      course_id: z.string().optional(),
      participant_ids: z.array(z.string()).optional(),
      status: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().min(1, "id is required") }),
});

module.exports = { listSchema, getSchema, createSchema, updateSchema };
