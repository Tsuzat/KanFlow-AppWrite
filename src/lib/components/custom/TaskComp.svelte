<script lang="ts">
	import { useSections, type Section } from '$lib/appwrite/db/sections.svelte';
	import { useTasks, type Task } from '$lib/appwrite/db/tasks.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { toast } from 'svelte-sonner';
	import Icons from '../icons';
	import { buttonVariants } from '../ui/button';
	import Tag from './Tag.svelte';
	import TaskPriority from './TaskPriority.svelte';
	import { Separator } from '../ui/separator';
	import { cn, formatDateWithCheck } from '$lib/utils';

	interface Props {
		task: Task;
		section: Section;
		syncing: boolean;
	}

	const sections = useSections();
	const tasks = useTasks();

	let { task, section, syncing = $bindable() }: Props = $props();

	function moveCardToSection(sec: Section) {
		toast.warning('Not Implementation');
	}

	function handleMoveUpDown(task: Task, dir: 'UP' | 'DOWN') {
		toast.warning('Not Implementation');
	}

	async function deleteTask() {
		const ask = confirm(`Do you really want to delete task ${task.name} ??`);
		if (!ask) return;
		syncing = true;
		await tasks.delete(task.$id);
		syncing = false;
	}
</script>

{#snippet DueDate(due_date?: string)}
	{@const dueDate = formatDateWithCheck(due_date)}
	<div
		class={cn(
			dueDate.isPassed ? 'text-destructive' : 'text-muted-foreground',
			'flex items-center gap-1'
		)}
	>
		<Icons.calendar class="size-4" />
		<small>{dueDate.display ?? 'No due date'}</small>
	</div>
{/snippet}

<Card.Root
	class="group cursor-pointer gap-2 border-0 bg-muted py-2 shadow backdrop-blur-3xl dark:bg-muted/20"
>
	<Card.Header class="px-4">
		<Card.Title class="flex items-center justify-between">
			<div class="inline-flex flex-wrap items-center gap-1">
				<TaskPriority priority={task.priority} />
				{#each task.tags ?? [] as tag (tag)}
					<Tag {tag} color={section.color ?? '#000A78'} />
				{/each}
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
					<Icons.ellipsis />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item>
						<Icons.edit />
						Edit Card
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						{@const otherSections = sections.sections.filter((sec) => sec.$id !== section.$id)}
						<DropdownMenu.SubTrigger disabled={otherSections.length === 0}>
							<Icons.arrowLeftRight />
							Move To Section
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							{#if otherSections.length > 0}
								{#each otherSections as sec (sec.$id)}
									<DropdownMenu.Item
										class="text-muted-foreground"
										onclick={() => moveCardToSection(sec)}
									>
										{sec.name}
									</DropdownMenu.Item>
								{/each}
							{/if}
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<Icons.arrowUpDown />
							Move Up Down
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.Item onclick={() => handleMoveUpDown(task, 'UP')}>
								<span>Move Up</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => handleMoveUpDown(task, 'DOWN')}>
								<span>Move Down</span>
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
					<DropdownMenu.Item variant="destructive" onclick={deleteTask}>
						<Icons.trash />
						Delete Task
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2 px-4 py-0">
		<span>{task.name}</span>
		<small class="text-muted-foreground">
			{task.description}
		</small>
		<Separator orientation="horizontal" class="my-1 h-[0.5px]" />
		<div class="flex items-center justify-between">
			{@render DueDate(task.due_date)}
		</div>
	</Card.Content>
</Card.Root>
