<script lang="ts">
	import { Status } from '$lib/appwrite/db/sections.svelte';
	import * as Select from '$lib/components/ui/select';

	interface Props {
		value?: Status;
	}
	let { value = $bindable(Status.Active) }: Props = $props();

	const statusOptions = [
		{ value: Status.Active, label: 'Active' },
		{ value: Status.InReview, label: 'In Review' },
		{ value: Status.Completed, label: 'Completed' },
		{ value: Status.Archived, label: 'Archived' }
	];

	const triggerContent = $derived(
		statusOptions.find((f) => f.value === value)?.label ?? 'Select a status'
	);
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Board Status</Select.Label>
			{#each statusOptions as status (status.value)}
				<Select.Item value={status.value}>{status.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
