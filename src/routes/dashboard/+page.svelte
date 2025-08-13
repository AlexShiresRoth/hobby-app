<script lang="ts">
	import { enhance } from '$app/forms';
	import Questions from '$lib/components/Questions.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LoaderPinwheelIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { z } from 'zod';

	const ResponseSchema = z.object({
		description: z.string(),
		equipment_needed: z.string(),
		hobby: z.string(),
		social_aspect: z.string(),
		time_commitement: z.string()
	});

	type HobbyDetails = z.infer<typeof ResponseSchema>;

	type Question = {
		question: string;
		answers: Array<{ id: number; label: string; answer: string }>;
		name: string;
	};

	const ideas = ['new?', 'unique?', 'creative?', 'adventurous?', 'technical?'];

	let mounted = false;

	let current = 0;
	let started = false;
	let interval: NodeJS.Timeout;
	let questionIndex = 0;
	let questionMap = new Map();
	let generationError;
	let hobbySuggestion: HobbyDetails;
	let generating = false;

	// TODO add response to UI
	const questions: Question[] = [
		{
			name: 'questionOne',
			question: 'How much time do you want to spend on a new hobby per/week?',
			answers: [
				{ id: 1, label: '<= 1hr', answer: 'less than 1 hour' },
				{ id: 2, label: '<= 4hrs', answer: 'less than 4 hours' },
				{ id: 3, label: '<= 8hrs', answer: 'less than 8 hours' },
				{ id: 4, label: 'All I got is time baby', answer: 'All the time in the world' }
			]
		},
		{
			name: 'questionTwo',
			question: 'What kind of environment do you live in?',
			answers: [
				{ id: 5, label: 'Rural', answer: 'lives in rural environment' },
				{ id: 6, label: 'Suburbs', answer: 'lives in the suburbs' },
				{ id: 7, label: 'City', answer: 'lives in the city' },
				{ id: 8, label: 'Beach', answer: 'lives in a beach area' }
			]
		},
		{
			name: 'questionThree',
			question: 'How would you best describe your personality?',
			answers: [
				{
					id: 9,
					label: 'Introverted',
					answer: 'introverted personality'
				},
				{
					id: 10,
					label: 'Extroverted',
					answer: 'extroverted personality'
				},
				{
					id: 11,
					label: 'Introverted but trying to branch out',
					answer: 'introverted but trying to become more extroverted'
				},
				{
					id: 12,
					label: 'Extroverted but should relax a little bit',
					answer: 'extroverted but wants to learn to do some things alone'
				}
			]
		}
	];

	(function () {
		for (const q of questions) {
			questionMap.set(q.question, '');
		}
	})();

	function startGenerator() {
		return (started = true);
	}

	function handleQuestionChange(direction: number) {
		if (direction === 1) questionIndex++;
		if (direction === -1 && questionIndex > 0) questionIndex--;
	}

	function setQuestionAnswerInState(questionName: string, answer: string) {
		questionMap = new Map(questionMap).set(questionName, answer);
	}

	function convertMapToObject(map: Map<any, any>) {
		return Object.fromEntries(map);
	}

	const handleFormSubmit: SubmitFunction = () => {
		generating = true;
		return async ({ update, result }) => {
			await update();
			if (result.type === 'error') {
				generationError = result;
				generating = false;
			}
			if (result.type === 'success') {
				const data = result.data as { suggestion: HobbyDetails };
				generating = false;
				hobbySuggestion = data.suggestion;
			}
		};
	};

	onMount(() => {
		mounted = true;

		clearInterval(interval);

		if (started) return;

		interval = setInterval(() => {
			if (current < ideas.length - 1) {
				current++;
			} else current = 0;
		}, 6000);
	});
</script>

<div class="flex h-[85vh] w-full flex-col items-center justify-center overflow-auto">
	<div class="flex w-3/4 flex-col items-center gap-4 py-16">
		{#if mounted}
			{#if !started}
				{#key current}
					<h1 class="text-6xl font-bold" in:fly={{ y: 20 }}>
						<span>Looking to try something</span>
						<span>{ideas[current]}</span>
					</h1>
					<button
						onclick={startGenerator}
						class="rounded-full bg-amber-500 px-4 py-2 text-lg font-semibold">Get Started</button
					>
				{/key}
			{:else}
				<form in:fly={{ y: 40 }} use:enhance={handleFormSubmit} action="?/generate" method="POST">
					<h2 class="mb-4 text-4xl font-bold">
						Alright! Let's try and get to know you a bit more, first
					</h2>
					{#key questionMap}
						<input
							readonly
							class="hidden"
							type="text"
							value={JSON.stringify(convertMapToObject(questionMap))}
							name="answerBlob"
						/>
					{/key}
					{#if !hobbySuggestion}
						{#if !generating}
							{#key questionIndex}
								<div class="flex flex-col gap-4">
									<Questions
										question={questions[questionIndex]}
										currentIndex={questionIndex}
										maxIndex={questions.length}
										{handleQuestionChange}
										handleAnswerSelection={setQuestionAnswerInState}
										currentAnswerState={questionMap}
									/>
								</div>
							{/key}
						{:else}
							<div><LoaderPinwheelIcon class="animate-spin" /></div>
						{/if}
					{/if}

					<!-- {#if hobbyChoices && !generating}
						<div>{hobbyChoices}</div>
					{/if} -->
				</form>
			{/if}
		{/if}
	</div>
</div>
