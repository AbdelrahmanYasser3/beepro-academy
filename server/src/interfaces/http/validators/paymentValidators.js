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

const createSchema = z.object({
  body: z.object({
    course_id: z.string().min(1, "course_id is required"),
    amount: z.number().min(0, "amount must be positive"),
    currency: z.string().optional(),
    payment_method: z.string().optional(),
    payment_reference: z.string().optional(),
  }),
  query: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
});

const updateSchema = z.object({
  body: z
    .object({
      status: z.string().optional(),
      payment_reference: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  query: z.object({}).optional().default({}),
  params: z.object({ id: z.string().min(1, "id is required") }),
});

module.exports = { listSchema, getSchema, createSchema, updateSchema };
