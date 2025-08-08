import { OPEN_AI_KEY, OPEN_AI_ORG, OPEN_AI_PROJECT } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import OpenAI from 'openai';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const openai = new OpenAI({
	apiKey: OPEN_AI_KEY,
	organization: OPEN_AI_ORG, // TODO add these to env vars
	project: OPEN_AI_PROJECT
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SearchResultSchema = z.object({
	position: z.number(),
	title: z.string(),
	product_link: z.string().url(),
	redirect_link: z.string().url(),
	displayed_link: z.string(),
	thumbnail: z.string().url(),
	favicon: z.string().url(),
	snippet: z.string(),
	snippet_highlighted_words: z.array(z.string()),
	rich_snippet: z.object({
		bottom: z.object({
			detected_extensions: z.record(z.any()).optional(),
			extensions: z.array(z.string())
		})
	}),
	price: z.string(),
	source: z.string()
});

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, website, avatar_url`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};

export const actions: Actions = {};
