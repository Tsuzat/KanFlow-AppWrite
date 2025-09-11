<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import type { Models } from 'appwrite';
	import User from './User.svelte';
	import Icons from '$lib/components/icons';
	import { cn, getKeyboardShortcut } from '$lib/utils';
	import { page } from '$app/state';
	import { Home } from '@lucide/svelte';
	import { useBoards } from '$lib/appwrite/db/boards.svelte';
	import { toast } from 'svelte-sonner';
	import Pinned from './Pinned.svelte';
	import AllBoards from './AllBoards.svelte';
	interface Props {
		user: Models.User<Models.Preferences>;
	}

	const { user }: Props = $props();
	let open = $state(false);
	const boards = useBoards();

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
			e.preventDefault();
			open = true;
		}
	}

	async function createSampleBoard() {
		const id = toast.loading('Creating board');
		const created = await boards.create({
			icon: 'Kanban',
			name: 'Sample Board',
			description: 'This is a sample board',
			pinned: true,
			owner: user.$id
		});
		if (created) toast.success('Create board successfully', { id });
		else toast.dismiss(id);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<Sidebar.Root variant="inset" collapsible="icon" class="!bg-background">
	<Sidebar.Header class="!bg-background">
		<User {user} />
	</Sidebar.Header>
	<Sidebar.Content class="overflow-y-auto !bg-background">
		<Sidebar.Group>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					{@const href = '/home'}
					<Sidebar.MenuButton class={cn(page.url.pathname === href && 'bg-muted')}>
						{#snippet tooltipContent()}
							<div class="flex w-40 flex-col gap-1">
								<span class="font-semibold">All Boards</span>
							</div>
						{/snippet}
						{#snippet child({ props })}
							<a {href} {...props}>
								<Home />
								<span class="text-muted-foreground">All Boards</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>
		<Pinned />
		<AllBoards />
	</Sidebar.Content>
	<Sidebar.Footer class="!bg-background">
		<Sidebar.MenuButton class="bg-primary transition-all duration-500" onclick={createSampleBoard}>
			{#snippet tooltipContent()}
				<span class="font-semibold">Create Board</span>
			{/snippet}
			<Icons.add class="text-sidebar-foreground/70" />
			<span>Create Board</span>
			<span class="rounded bg-muted/50 p-0.5 text-[0.7rem]">{getKeyboardShortcut('B', true)}</span>
		</Sidebar.MenuButton>
	</Sidebar.Footer>
</Sidebar.Root>
