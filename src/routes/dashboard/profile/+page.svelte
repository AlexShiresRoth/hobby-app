<script lang="ts">
	import { enhance } from '$app/forms';
	import { TextInput } from '$lib/index.js';
	import { Loader } from 'lucide-svelte';
	import type { TProfile } from '../../../schema.js';

	export let data;

	let saving = false;
	let success = false;
	let error = '';
	let profile = data.profile;

	let formData = {
		full_name: profile?.full_name ?? '',
		avatar_url: profile?.avatar_url ?? '',
		username: profile?.username ?? ''
	};
</script>

<h1 class="text-4xl font-bold">Account Settings</h1>

<div class="mt-8 flex w-3xl flex-col gap-4">
	<h3 class="text-2xl">
		Let's get to know you better, in order to provide you with the best possible results.
	</h3>
	<form
		class="flex flex-col gap-4 rounded-lg bg-gray-200 p-4"
		action="?/savePreferences"
		method="POST"
		use:enhance={() => {
			saving = true;
			success = false;

			return async ({ update, result }) => {
				await update();
				saving = false;

				if (result.type === 'success') {
					const data = result.data?.profile as TProfile;

					const { fullName, userName, avatar, phone, stylePreference, customStylePreference } =
						data;

					formData = {
						full_name: fullName,
						avatar_url: avatar,
						username: userName
					};

					success = true;
				}
				if (result.type === 'error' || result.type === 'failure') {
					error = 'Failed to save preferences';
				}
			};
		}}
	>
		<TextInput
			name="full_name"
			bind:value={formData.full_name}
			placeholder="Full Name"
			label="What should we call you?"
			disabled={saving}
		/>
		<TextInput
			name="username"
			bind:value={formData.username}
			placeholder="User Name"
			label="What do you want your username to be?"
			disabled={saving}
		/>

		{#if !saving}
			<button
				class="w-64 self-end rounded-full bg-rose-500 p-2 font-semibold text-white"
				type="submit">Save</button
			>
		{:else}
			<button
				class="flex w-64 items-center justify-center gap-4 self-end rounded-full bg-rose-500/60 p-2 font-semibold text-white"
				type="button"
				disabled>Saving <Loader class="animate-spin" /></button
			>
		{/if}
	</form>
</div>
