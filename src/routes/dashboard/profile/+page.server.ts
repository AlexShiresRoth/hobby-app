import { fail, redirect } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';
import { db } from '../../../db';
import { profiles } from '../../../schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (!session) {
		redirect(303, '/');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name, avatar_url`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};

export const actions: Actions = {
	savePreferences: async ({ request, locals: { safeGetSession } }) => {
		const session = safeGetSession();

		if (!session) {
			return fail(400, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();

		const style = formData.get('style_preference')?.toString();
		const values = {
			phone: formData.get('phone')?.toString(),
			userName: formData.get('username')?.toString(),
			fullName: formData.get('full_name')?.toString(),
			avatarUrl: formData.get('avatar_url')?.toString(),
			stylePreference: style,
			customStylePreference:
				style === 'custom' ? formData.get('custom_style_preference')?.toString() : null,
			updatedAt: sql`NOW()`
		};

		const profile = await db
			.update(profiles)
			.set(values)
			.where(eq(profiles.id, (await session).user.id))
			.returning();

		return { success: true, message: 'Saved your account preferences', profile: profile[0] };
	}
};
