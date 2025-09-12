<script lang="ts">
	import { Priority } from '$lib/appwrite/db/tasks.svelte';
	import { cn } from '$lib/utils';
	import Icons from '../icons';

	interface Props {
		priority: Priority;
	}

	const { priority }: Props = $props();
</script>

{#snippet Render(priority: Priority)}
	{@const Icon = Icons[priority]}
	<div
		class={cn(
			'flex items-center gap-1 rounded p-1',
			priority === Priority.Low &&
				'bg-green-500/25 text-green-600 dark:bg-green-900/25 dark:text-green-500',
			priority === Priority.Medium &&
				'bg-yellow-500/25 text-yellow-600 dark:bg-yellow-900/25 dark:text-yellow-500',
			priority === Priority.High &&
				'bg-red-500/25 text-red-600 dark:bg-red-900/25 dark:text-red-500'
		)}
	>
		<Icon class="!size-3" />
		<small class="capitalize">{priority}</small>
	</div>
{/snippet}

{@render Render(priority)}
