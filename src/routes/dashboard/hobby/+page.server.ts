import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: hobbyProfiles } = await supabase.from('hobbyProfiles').select(`id, hobby_name`);

	console.log('hobby profiles', hobbyProfiles);

	return { session, hobbyProfiles };
};
