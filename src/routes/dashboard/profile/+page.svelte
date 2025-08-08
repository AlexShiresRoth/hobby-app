<script lang="ts">
	import { enhance } from '$app/forms';
	import SelectInput from '$lib/components/SelectInput.svelte';
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
		username: profile?.username ?? '',
		phone: profile?.phone ?? '',
		style_preference: profile?.style_preference ?? '',
		custom_style_preference: profile?.custom_style_preference ?? ''
	};
</script>

<h1 class="text-4xl font-bold">Account Settings</h1>

<div class="w-3xl mt-8 flex flex-col gap-4">
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
						username: userName,
						phone,
						style_preference: stylePreference,
						custom_style_preference: customStylePreference
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
		<TextInput
			label="We just need phone # for verification"
			name="phone"
			bind:value={formData.phone}
			placeholder="+6-666-6666"
			disabled={saving}
		/>
		<SelectInput
			label="How would you choose your style preference?"
			name="style_preference"
			bind:value={formData.style_preference}
			disabled={saving}
			options={[
				{ label: 'Masculine', value: 'masculine' },
				{ label: 'Feminine', value: 'feminine' },
				{ label: 'Custom', value: 'custom' }
			]}
		/>
		{#if formData.style_preference === 'custom'}
			<TextInput
				name="custom_style_preference"
				label="Please describe your preference"
				bind:value={formData.custom_style_preference}
				disabled={saving}
			/>
		{/if}
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
