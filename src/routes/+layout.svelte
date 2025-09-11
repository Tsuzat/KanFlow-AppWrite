<script lang="ts">
	import '@fontsource-variable/dm-sans';
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>KanFlow - Best Personal Kanban App</title>
</svelte:head>

<ModeWatcher />
<Toaster richColors closeButton />

{@render children?.()}
