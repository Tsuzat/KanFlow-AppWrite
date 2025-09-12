<script lang="ts">
	import { Status, useSections, type Section } from '$lib/appwrite/db/sections.svelte';
	import Icons from '../icons';
	import { Button, buttonVariants } from '../ui/button';
	import SimpleTooltip from './SimpleTooltip.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { useTasks, type Task } from '$lib/appwrite/db/tasks.svelte';
	import { flip } from 'svelte/animate';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import TaskComp from './TaskComp.svelte';
	import NewTask from './dialogs/NewTask.svelte';

	interface Props {
		section: Section;
		syncing: boolean;
	}

	let { section, syncing = $bindable() }: Props = $props();

	const sections = useSections();
	const tasks = useTasks();

	let open = $state(false);

	let tasksForSection = $derived(tasks.tasks.filter((t) => t.section === section.$id));

	const SectionIcon = $derived.by(() => {
		switch (section.status) {
			case Status.Active:
				return Icons.active;
			case Status.Completed:
				return Icons.completed;
			case Status.Archived:
				return Icons.archive;
			case Status.InReview:
				return Icons.review;
			default:
				return Icons.active;
		}
	});

	async function handlDelete() {
		const shouldDelete = confirm(
			`Delete section ${section.name}. All data will be permanently lost.`
		);
		if (!shouldDelete) return;
		await sections.delete(section.$id);
	}

	function transformDraggedElement(element?: HTMLElement) {
		if (element) {
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.border = '1px solid hsl(var(--primary))';
		}
	}

	function handleDragStart(event: CustomEvent<DndEvent<Task>>) {
		const { items } = event.detail;
		tasksForSection = items;
	}

	function handleDrop(event: CustomEvent<DndEvent<Task>>) {
		const { items } = event.detail;
		tasksForSection = items;
	}
</script>

<div class="flex h-full w-full flex-col rounded-xl p-0">
	<div class="flex items-center justify-between gap-2">
		<span class="inline-flex items-center gap-2">
			<SimpleTooltip content="Section Status">
				<SectionIcon class="size-4 text-muted-foreground" />
			</SimpleTooltip>
			<span>
				{section.name}
			</span>
			<span class="text-sm font-semibold" style:color={`${section.color}`}>{2}</span>
		</span>
		<span class="flex items-center gap-1">
			<SimpleTooltip content="Add Task">
				<NewTask bind:open {section} />
				<Button variant="ghost" size="icon" onclick={() => (open = true)}>
					<Icons.add />
				</Button>
			</SimpleTooltip>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Icons.ellipsis />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item variant="destructive" onclick={handlDelete}>
						<Icons.trash />
						<span>Delete</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</span>
	</div>
	<div
		class="h-full flex-1 overflow-auto"
		aria-label={section.$id}
		use:dndzone={{
			items: tasksForSection,
			type: 'columns',
			dragDisabled: false,
			transformDraggedElement,
			dropTargetStyle: {
				outline: 'none'
			}
		}}
		onconsider={handleDragStart}
		onfinalize={handleDrop}
	>
		{#each tasksForSection as task (task.$id)}
			<div animate:flip={{ duration: 200 }} aria-label={task.name} class="relative my-2 rounded-xl">
				<TaskComp {task} {section} bind:syncing />
			</div>
		{/each}
	</div>
</div>
