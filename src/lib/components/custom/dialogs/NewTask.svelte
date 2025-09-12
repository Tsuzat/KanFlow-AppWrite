<script lang="ts">
	import type { Section } from '$lib/appwrite/db/sections.svelte';
	import { Priority, useTasks } from '$lib/appwrite/db/tasks.svelte';
	import Icons from '$lib/components/icons';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import DatePicker from '../DatePicker.svelte';
	import { type DateValue } from '@internationalized/date';
	import { generateKeyBetween } from '$lib/utils';

	interface Props {
		open: boolean;
		section: Section;
	}

	let { open = $bindable(), section }: Props = $props();

	// form data
	let name = $state<string>('');
	let description = $state<string>('');
	let due_date = $state<DateValue>();
	let priority = $state<Priority>(Priority.Low);
	const order = $derived.by(() => {
		const tasksInSec = tasks.tasks.filter((t) => t.section.$id === section.$id);
		const lastCardOrder = tasksInSec.length > 0 ? tasksInSec[tasksInSec.length - 1].order : null;
		return generateKeyBetween(lastCardOrder, null);
	});

	let isLoading = $state(false);
	const tasks = useTasks();

	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (name.trim() === '') {
			toast.warning('Name is required to create new task');
			return;
		}
		isLoading = true;
		await tasks.create({
			name,
			description,
			due_date: due_date?.toString(),
			priority,
			order,
			section: section.$id,
			board: section.board as string
		});
		isLoading = false;
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class="sr-only">open</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-[30rem] bg-popover">
		<Dialog.Header>
			<Dialog.Title>New Card</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			<p class="text-muted-foreground">Create a new card with title, description and due date.</p>
		</Dialog.Description>
		<form onsubmit={handleSubmit} class="*:my-2">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-muted-foreground"
					>Name <span class="text-destructive">*</span></Label
				>
				<Input
					id="name"
					type="text"
					bind:value={name}
					placeholder="Card Name"
					class="col-span-3"
					required
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="description" class="text-muted-foreground">Description</Label>
				<Input
					id="description"
					type="text"
					bind:value={description}
					placeholder="Card Description"
					class="col-span-3"
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="dueDate" class="text-muted-foreground">Due Date</Label>
				<DatePicker bind:value={due_date} />
			</div>
			<Dialog.Footer class="mt-4">
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Close</Dialog.Close>
				<Button type="submit" class="w-24">
					{#if isLoading}
						<Icons.loader class="animate-spin" />
					{/if}
					Create
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
