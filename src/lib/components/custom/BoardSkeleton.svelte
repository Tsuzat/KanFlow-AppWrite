<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="flex h-full w-full max-w-1/3 min-w-72 flex-col gap-4">
	{#each Array(Math.random() > 0.5 ? 3 : 2) as _}
		<Skeleton class="h-40 w-full" />
	{/each}
</div>
