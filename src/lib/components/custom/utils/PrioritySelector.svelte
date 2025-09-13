<script lang="ts">
	import { Priority } from '$lib/appwrite/db/tasks.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	interface Props {
		priority?: Priority;
	}
	let { priority = $bindable() }: Props = $props();
	const priorities = [
		{ value: Priority.Low, label: 'Low' },
		{ value: Priority.Medium, label: 'Medium' },
		{ value: Priority.High, label: 'High' }
	];
</script>

<Select.Root type="single" bind:value={priority}>
	<Select.Trigger class="w-fit capitalize">
		{priority ?? 'Select Priority'}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Priorities</Select.Label>
			{#each priorities as pr (pr.value)}
				<Select.Item value={pr.value}>
					{pr.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
