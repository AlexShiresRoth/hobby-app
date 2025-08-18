import { date, pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';

// @note - this is the command that works pnpm exec drizzle-kit migrate --config=./src/drizzle.config.ts
export enum TABLES {
	profiles = 'profiles',
	hobbyProfiles = 'hobbyProfiles'
}

export const hobbyProfiles = pgTable(TABLES.hobbyProfiles, {
	id: uuid('id').primaryKey().defaultRandom(),
	timeCommitment: text('time_commitment'),
	livingEnvironment: text('environment'),
	personality: text('personality'),
	hobbySpend: text('spend_amt')
});

export const profiles = pgTable(TABLES.profiles, {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('full_name'),
	phone: varchar('phone', { length: 256 }),
	avatar: text('avatar_url'),
	updatedAt: date('updated_at'),
	hobbyProfileId: uuid('hobby_profile_id').references(() => hobbyProfiles.id, {
		onDelete: 'cascade'
	})
});

export type TProfile = typeof profiles.$inferSelect;
export type THobbyProfile = typeof hobbyProfiles.$inferSelect;
