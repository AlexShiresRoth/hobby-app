import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	const { supabase } = locals;

	await supabase.auth.signOut();

	return redirect(303, '/');
};
