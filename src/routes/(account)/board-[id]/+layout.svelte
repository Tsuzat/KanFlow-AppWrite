<script lang="ts">
	import { setSections } from '$lib/appwrite/db/sections.svelte';
	import { setTasks } from '$lib/appwrite/db/tasks.svelte';

	let { children } = $props();

	setSections();
	setTasks();
</script>

{@render children()}
