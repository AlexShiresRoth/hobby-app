import { z } from 'zod';

export const ResponseSchema = z.object({
	description: z.string(),
	equipment_needed: z.string(),
	hobby: z.string(),
	social_aspect: z.string(),
	time_commitement: z.string(),
	resource_link: z.string(),
	expense_amt: z.string()
});

export type HobbySuggestion = z.infer<typeof ResponseSchema>;
