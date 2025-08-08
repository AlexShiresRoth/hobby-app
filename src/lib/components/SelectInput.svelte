<script lang="ts">
	import clsx from 'clsx';

	export let options: { label: string; value: string }[] = [];
	export let name: string = '';
	export let defaultOption: string = 'Please select';
	export let value: string = '';
	export let label: string = '';
	export let disabled = false;
</script>

<div class="flex flex-col">
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	{#if options.length > 0}
		<select
			{name}
			bind:value
			class={clsx('rounded-lg bg-white p-2 focus:outline-0', {
				'cursor-not-allowed bg-gray-100 text-gray-400/80': disabled
			})}
			{disabled}
		>
			<option>{defaultOption}</option>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{/if}
</div>
