<script lang="ts">
	import clsx from 'clsx';

	export let name: string;
	export let value: string | undefined = '';
	export let placeholder: string | undefined = '';
	export let label: string | undefined = undefined;
	export let disabled = false;
</script>

<div class="flex flex-col gap-1">
	{#if label}
		<label for={name}>{label}</label>
	{/if}
	<input
		{name}
		{placeholder}
		bind:value
		class={clsx('rounded-lg bg-white p-2 focus:outline-0', {
			'cursor-not-allowed bg-gray-100 text-gray-400/80': disabled
		})}
		{disabled}
	/>
</div>
