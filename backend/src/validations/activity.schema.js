const { z } = require('zod');

const logActivity = z.object({
  body: z.object({
    category: z.enum(['Transport', 'Food', 'Energy', 'Shopping', 'Water']),
    activityType: z.string().min(1, 'Activity type is required'),
    description: z.string().optional(),
    carbonEmission: z.number().nonnegative(),
    date: z.string().optional(),
    title: z.string().optional(),
    notes: z.string().optional(),
  }),
});

module.exports = {
  logActivity,
};
