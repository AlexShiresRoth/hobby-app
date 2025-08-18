<script lang="ts">
	import { enhance } from '$app/forms';
	import Questions from '$lib/components/Questions.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { LoaderPinwheelIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { questions } from '../../questions';
	import type { HobbySuggestion } from '../../types';

	const ideas = ['new?', 'unique?', 'creative?', 'adventurous?', 'technical?'];

	let mounted = false;

	let current = 0;
	let started = false;
	let interval: NodeJS.Timeout;
	let questionIndex = 0;
	let questionMap = new Map();
	let generationError;
	let hobbySuggestion: HobbySuggestion;
	let generating = false;
	let saving = false;

	// TODO add response to UI
	// TODO need to save previously answered questions to user profile
	// TODO use the saved data to quickly generate new hobby suggestion
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
				const data = result.data as { suggestion: HobbySuggestion };
				generating = false;
				hobbySuggestion = data.suggestion;
			}
		};
	};

	const handleSaveProfile: SubmitFunction = () => {
		saving = true;
		return async ({ update, result }) => {
			await update();
			if (result.type === 'error') {
				saving = false;
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
					{#if !hobbySuggestion}
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
							<div>
								<LoaderPinwheelIcon class="animate-spin" size={24} />
							</div>
						{/if}
					{/if}
				</form>

				{#if hobbySuggestion && !generating}
					<div class="flex w-1/2 flex-col gap-2">
						<h2 class="text-2xl font-bold">{hobbySuggestion.hobby}</h2>
						<p>{hobbySuggestion.description}</p>
						<p>{hobbySuggestion.social_aspect}</p>
						<p>{hobbySuggestion.time_commitement}</p>
						<p>{hobbySuggestion.equipment_needed}</p>
						<p>{hobbySuggestion.expense_amt}</p>
						<a href={hobbySuggestion.resource_link} target="_blank" rel="noopener noreferer"
							>More info</a
						>
						<form action="?/saveProfile" use:enhance={handleSaveProfile} method="POST">
							<input
								type="text"
								name="profileBlob"
								value={JSON.stringify(convertMapToObject(questionMap))}
								readonly
								class="hidden"
							/>
							<input
								type="text"
								name="hobbySuggestion"
								readonly
								class="hidden"
								value={JSON.stringify(hobbySuggestion)}
							/>
							<button type="submit">Try out hobby</button>
						</form>
					</div>
				{/if}
			{/if}
		{/if}
	</div>
</div>
