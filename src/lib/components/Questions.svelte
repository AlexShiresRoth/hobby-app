<script lang="ts">
	import clsx from 'clsx';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	type Answer = { id: number; label: string; answer: string };
	type Question = {
		name: string;
		question: string;
		answers: Answer[];
	};
	export let currentIndex = 0;
	export let maxIndex = 0;
	export let question: Question | undefined;
	export let handleQuestionChange: (direction: number) => void;
	export let handleAnswerSelection: (questionName: string, answer: string) => void;
	export let currentAnswerState: Map<any, any>;

	let selected: Answer = { id: -1, label: '', answer: '' };
	// current answer is just used for UI updates
	let currentAnswer = selected?.answer || currentAnswerState.get(question?.question);

	function handleSelectAnswer(answer: Answer) {
		if (!question) return;
		selected = answer;
		currentAnswer = answer.answer;
		return handleAnswerSelection(question.question, answer.answer);
	}
</script>

{#if question}
	{#key currentIndex && currentAnswerState}
		<div class="flex flex-col gap-4">
			<p>{currentIndex + 1}/{maxIndex}</p>
			<p class="text-2xl">{question.question}</p>
			<div class="grid w-full grid-cols-2 gap-8">
				{#each question.answers as answer}
					<button
						type="button"
						onclick={() => handleSelectAnswer(answer)}
						class={clsx(
							'rounded-lg border p-8 transition-colors hover:cursor-pointer hover:border-amber-400',
							{
								'border-amber-400': currentAnswer === answer.answer,
								'border-gray-200': currentAnswer !== answer.answer
							}
						)}
					>
						<p class="text-2xl font-bold">{answer.label}</p>
					</button>
				{/each}
			</div>
		</div>
	{/key}

	<div class="flex w-full items-center justify-between" in:fade>
		{#if currentIndex > 0}
			<button type="button" class="flex items-center" onclick={() => handleQuestionChange(-1)}
				><ArrowLeft size={14} /> Back</button
			>
		{:else}
			<div></div>
		{/if}

		{#if !!currentAnswer}
			{#if maxIndex - currentIndex > 1}
				<button type="button" class="flex items-center" onclick={() => handleQuestionChange(1)}
					>Next <ArrowRight size={14} /></button
				>
			{:else}
				<button type="submit">Finish</button>
			{/if}
		{/if}
	</div>
{/if}
