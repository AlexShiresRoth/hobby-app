import { date, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

export enum TABLES {
	profiles = 'profiles'
}

export const profiles = pgTable(TABLES.profiles, {
	id: uuid('id').primaryKey().defaultRandom(),
	userName: text('username'),
	fullName: text('full_name'),
	phone: varchar('phone', { length: 256 }),
	stylePreference: text('style_preference'),
	avatar: text('avatar_url'),
	updatedAt: date('updated_at'),
	customStylePreference: text('custom_style_preference')
});

export type TProfile = typeof profiles.$inferSelect;
