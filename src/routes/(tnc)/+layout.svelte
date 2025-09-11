<script lang="ts">
	import Navbar from '$lib/components/custom/Navbar.svelte';

	const { children } = $props();
</script>

<Navbar />
<main
	class="mx-auto max-w-3xl *:my-4 [&_a]:text-primary [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_code]:text-muted-foreground [&_li]:my-2 [&_li]:ml-6 [&_li]:list-disc"
>
	{@render children()}
</main>
