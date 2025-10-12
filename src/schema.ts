import { date, pgTable, text, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

// @note - this is the command that works pnpm exec drizzle-kit migrate --config=./src/drizzle.config.ts

// TODO either create a join table or just use the array and test saving this schema
export enum TABLES {
	profiles = 'profiles',
	hobbyProfiles = 'hobbyProfiles',
	hobbyQuestionsAndAnswers = 'hobbyQuestionsAndAnswers',
	questionsWithAnswers = 'questionsWithAnswers'
}

export const questionsWithAnswers = pgTable(TABLES.questionsWithAnswers, {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name'),
	question: text('question').notNull().unique(),
	answer: text('answer')
});

export const hobbyProfiles = pgTable(TABLES.hobbyProfiles, {
	id: uuid('id').primaryKey().defaultRandom(),
	timeCommitment: text('time_commitment'),
	livingEnvironment: text('environment'),
	personality: text('personality'),
	hobbySpend: text('spend_amt'),
	description: text('description'),
	resourceLink: text('resourceLink'),
	hobbyName: text('hobby_name')
});

export const hobbyQuestionsAndAnswers = pgTable(
	TABLES.hobbyQuestionsAndAnswers,
	{
		id: uuid('id').primaryKey().defaultRandom(),
		hobbyProfileId: uuid('hobby_profile_id')
			.references(() => hobbyProfiles.id, {
				onDelete: 'cascade'
			})
			.notNull(),
		questionWithAnswerId: uuid('questions_with_answers_id')
			.references(() => questionsWithAnswers.id, {
				onDelete: 'cascade'
			})
			.notNull()
	},
	(table) => ({
		uniqueHobbyQuestion: uniqueIndex('unique_hobby_question').on(table.questionWithAnswerId)
	})
);

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
