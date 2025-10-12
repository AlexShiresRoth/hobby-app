<script lang="ts">
	export let data;
</script>

<p>hobbies</p>

<div>
	{#each data?.hobbyProfiles as profile}
		<p>{profile.hobby_name}</p>
	{/each}
</div>
