<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<Toaster />

<div class="p-8">
	{#if session}
		<nav class="flex w-full items-center justify-between">
			<div class="flex items-center gap-4">
				<a href="/dashboard">Dashboard</a>
				<a href="/dashboard/hobby">Hobbies</a>
				<a href="/dashboard/profile">Profile</a>
			</div>
			<form method="POST" action="/auth/sign-out">
				<button type="submit">Sign out</button>
			</form>
		</nav>
	{/if}
	<slot />
</div>
