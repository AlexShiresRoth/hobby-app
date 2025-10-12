import { OPEN_AI_KEY, OPEN_AI_ORG, OPEN_AI_PROJECT } from '$env/static/private';
import { fail, redirect } from '@sveltejs/kit';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { db } from '../../db';
import { questions, type Question } from '../../questions';
import { hobbyProfiles, hobbyQuestionsAndAnswers, questionsWithAnswers } from '../../schema';
import { ResponseSchema, type HobbySuggestion } from '../../types';
import type { Actions, PageServerLoad } from './$types';

const openai = new OpenAI({
	apiKey: OPEN_AI_KEY,
	organization: OPEN_AI_ORG,
	project: OPEN_AI_PROJECT
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

export const actions: Actions = {
	generate: async ({ request, locals: { safeGetSession } }) => {
		const session = await safeGetSession();
		if (!session) {
			return fail(400, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const questionsAndAnswers = JSON.parse((formData.get('answerBlob') as string) || '{}');

		if (!questionsAndAnswers) {
			return fail(400, {
				message: 'Missing user input'
			});
		}

		const structuredInput: { question: string; answer: string }[] = [];

		for (const [key, value] of Object.entries(questionsAndAnswers)) {
			structuredInput.push({ question: key, answer: `${value}` });
		}

		const response = await openai.responses.parse({
			model: 'gpt-4o',
			input: [
				{
					role: 'system',
					content: 'You are a helpful assistant that recommends new hobbies.'
				},
				{
					role: 'user',
					content: `Here is the user's survey data:\n${JSON.stringify(structuredInput)}\nSuggest a hobby in structured JSON format.`
				}
			],
			text: { format: zodTextFormat(ResponseSchema, 'hobby') }
		});

		return { suggestion: response.output_parsed };
	},
	saveProfile: async ({ request, locals: { safeGetSession } }) => {
		const session = await safeGetSession();

		if (!session) {
			return fail(400, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();
		const questionsAndAnswers: { [key: Question['question']]: Question['answers'][0]['answer'] } =
			JSON.parse((formData.get('profileBlob') as string) || '') || null;
		const hobbySuggestion: HobbySuggestion =
			JSON.parse((formData.get('hobbySuggestion') as string) || '') || null;

		if (!hobbySuggestion) {
			return fail(400, {
				message: 'Missing user input'
			});
		}

		const matchedQuestions = Object.entries(questionsAndAnswers).map(([question, answer]) => {
			const foundQ = questions.find((q) => q.question === question);

			if (!foundQ) throw new Error('Something went wrong saving hobby suggestion');

			return { questionKey: foundQ.name, question: foundQ.question, answer };
		});

		const [hobbyToTry] = await db
			.insert(hobbyProfiles)
			.values({
				timeCommitment: hobbySuggestion.time_commitement,
				hobbySpend: hobbySuggestion.expense_amt,
				description: hobbySuggestion.description,
				personality: hobbySuggestion.social_aspect,
				livingEnvironment: hobbySuggestion.living_environment,
				hobbyName: hobbySuggestion.hobby
			})
			.returning({ id: hobbyProfiles.id })
			.onConflictDoNothing();

		// only update/create user profile if first time going through it
		if (questionsAndAnswers) {
			const questionIds = await Promise.all(
				matchedQuestions.map(async (qwa) => {
					const [row] = await db
						.insert(questionsWithAnswers)
						.values({
							name: qwa.question,
							question: qwa.questionKey,
							answer: qwa.answer
						})
						.onConflictDoUpdate({
							target: questionsWithAnswers.question,
							set: { answer: qwa.answer, question: qwa.questionKey, name: qwa.question }
						})
						.returning({ id: questionsWithAnswers.id });

					return row.id;
				})
			);

			await Promise.all(
				questionIds.map(async (qid) => {
					await db
						.insert(hobbyQuestionsAndAnswers)
						.values({
							questionWithAnswerId: qid,
							hobbyProfileId: hobbyToTry.id
						})
						.onConflictDoUpdate({
							target: hobbyQuestionsAndAnswers.questionWithAnswerId,
							set: { questionWithAnswerId: qid }
						});
				})
			);
		}

		return { hobbyId: hobbyToTry.id };
	}
};
