<script lang="ts">
	import clsx from 'clsx';
	import { ArrowLeft, ArrowRight } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	type Answer = { id: number; label: string; answer: string };
	type Question = {
		question: string;
		answers: Answer[];
	};
	export let currentIndex = 0;
	export let maxIndex = 0;
	export let question: Question | undefined;
	export let handleQuestionChange: (direction: number) => void;

	let selected: Answer;

	function handleSelectAnswer(answer: Answer) {
		selected = answer;
	}
</script>

{#if question}
	{#key currentIndex}
		<div class="flex flex-col gap-4">
			<p>{currentIndex}/{maxIndex}</p>
			<p class="text-2xl">{question.question}</p>
			<div class="grid w-full grid-cols-2 gap-8">
				{#each question.answers as answer}
					<button
						type="button"
						onclick={() => handleSelectAnswer(answer)}
						class={clsx(
							'rounded-lg border p-8 transition-colors hover:cursor-pointer hover:border-amber-400',
							{
								'border-amber-400': selected?.answer === answer.answer,
								'border-gray-200': selected?.answer !== answer.answer
							}
						)}
					>
						<p class="text-2xl font-bold">{answer.label}</p>
						{#if selected?.answer === answer.answer}
							<input type="text" value={answer.answer} readonly class="hidden" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/key}
	{#if !!selected?.answer}
		<div class="flex w-full items-center justify-between" in:fade>
			{#if currentIndex > 0}
				<button type="button" class="flex items-center" onclick={() => handleQuestionChange(-1)}
					><ArrowLeft size={14} /> Back</button
				>
			{:else}
				<div></div>
			{/if}
			<button type="button" class="flex items-center" onclick={() => handleQuestionChange(1)}
				>Next <ArrowRight size={14} /></button
			>
		</div>
	{/if}
{/if}
