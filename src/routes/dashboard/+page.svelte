<script lang="ts">
	import Questions from '$lib/components/Questions.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	type Question = {
		question: string;
		answers: Array<{ id: number; label: string; answer: string }>;
	};

	const ideas = ['new?', 'unique?', 'creative?', 'adventurous?', 'technical?'];

	let mounted = false;

	let current = 0;
	let started = false;
	let interval: NodeJS.Timeout;
	let questionIndex = 0;

	const questions: Question[] = [
		{
			question: 'How much time do you want to spend on a new hobby per/week?',
			answers: [
				{ id: 1, label: '<= 1hr', answer: 'less than 1 hour' },
				{ id: 2, label: '<= 4hrs', answer: 'less than 4 hours' },
				{ id: 3, label: '<= 8hrs', answer: 'less than 8 hours' },
				{ id: 4, label: 'All I got is time baby', answer: 'All the time in the world' }
			]
		},
		{
			question: 'What kind of environment do you live in?',
			answers: [
				{ id: 5, label: 'Rural', answer: 'lives in rural environment' },
				{ id: 6, label: 'Suburbs', answer: 'lives in the suburbs' },
				{ id: 7, label: 'City', answer: 'lives in the city' },
				{ id: 8, label: 'Beach', answer: 'lives in a beach area' }
			]
		}
	];

	function startGenerator() {
		return (started = true);
	}

	function handleQuestionChange(direction: number) {
		if (direction === 1) questionIndex++;
		if (direction === -1 && questionIndex > 0) questionIndex--;
	}

	onMount(() => {
		mounted = true;

		// TODO - this is breaking answer selection - it clears it on the interval
		// clearInterval(interval);

		// if (started) return;

		// interval = setInterval(() => {
		// 	if (current < ideas.length - 1) {
		// 		current++;
		// 	} else current = 0;
		// }, 6000);
	});
</script>

<div class="flex h-[85vh] w-full flex-col items-center justify-center overflow-auto">
	<div class="flex w-3/4 flex-col items-center gap-4 py-16">
		{#if mounted}
			<!-- {#key current} -->
			{#if !started}
				<h1 class="text-6xl font-bold" in:fly={{ y: 20 }}>
					<span>Looking to try something new?</span>
					<span>{ideas[current]}</span>
				</h1>
				<button
					onclick={startGenerator}
					class="rounded-full bg-amber-500 px-4 py-2 text-lg font-semibold">Get Started</button
				>
			{:else}
				<form in:fly={{ y: 40 }}>
					<h2 class="mb-4 text-4xl font-bold">
						Alright! Let's try and get to know you a bit more, first
					</h2>
					{#key questionIndex}
						<div class="flex flex-col gap-4">
							<Questions
								question={questions[questionIndex]}
								currentIndex={questionIndex}
								maxIndex={questions.length}
								{handleQuestionChange}
							/>
						</div>
					{/key}
				</form>
			{/if}
			<!-- {/key} -->
		{/if}
	</div>
</div>

<style>
	@keyframes flyIn {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.fly-in {
		opacity: 0;
		animation: flyIn 0.6s ease-out forwards;
	}
</style>
