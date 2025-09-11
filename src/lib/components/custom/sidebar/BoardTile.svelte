<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_FRONTEND_URL } from '$env/static/public';
	import { useBoards, type Board } from '$lib/appwrite/db/boards.svelte';
	import Icons from '$lib/components/icons';
	import IconRenderer from '$lib/components/icons/IconRenderer.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { cn } from '$lib/utils';
	import { icons } from '@lucide/svelte';

	const sidebar = useSidebar();

	interface Props {
		board: Board;
	}

	const boards = useBoards();

	async function handleUpdate() {
		await boards.update(board);
	}

	async function handleDelete() {
		const del = confirm('Are you sure you want to delete this board?');
		if (del) await boards.delete(board.$id);
	}

	async function handleShare() {
		navigator.clipboard.writeText(url);
	}

	async function handleOpen() {
		window.open(url, '_target');
	}

	const { board }: Props = $props();

	const url = `${PUBLIC_FRONTEND_URL}board-${board.$id}`;
</script>

<Sidebar.MenuItem>
	{@const href = `/board-${board.$id}`}
	<Sidebar.MenuButton class={cn(page.url.pathname === href && 'bg-muted')}>
		{#snippet tooltipContent()}
			<div class="flex w-40 flex-col gap-1">
				<span class="font-semibold">{board.name}</span>
				<span>{board.description}</span>
			</div>
		{/snippet}
		{#snippet child({ props })}
			<a {href} {...props}>
				<IconRenderer icon={board.icon as keyof typeof icons} class="mr-2 size-4" />
				<span class="text-muted-foreground">{board.name}</span>
			</a>
		{/snippet}
	</Sidebar.MenuButton>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Sidebar.MenuAction showOnHover {...props}>
					<Icons.ellipsis />
					<span class="sr-only">More</span>
				</Sidebar.MenuAction>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content
			class="w-fit rounded-lg"
			side={sidebar.isMobile ? 'bottom' : 'right'}
			align={sidebar.isMobile ? 'end' : 'start'}
		>
			<DropdownMenu.Item
				onclick={() => {
					board.pinned = !board.pinned;
					handleUpdate();
				}}
			>
				{#if board.pinned}
					<Icons.pinOff />
				{:else}
					<Icons.pin />
				{/if}
				<span class="text-muted-foreground">{board.pinned ? 'Unpin Board' : 'Pin Board'}</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleOpen}>
				<Icons.externalLink />
				<span class="text-muted-foreground">Open in new Tab</span>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={handleShare}>
				<Icons.share />
				<span class="text-muted-foreground">Share Board</span>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={handleDelete}>
				<Icons.trash class="text-red-500" />
				<span class="text-muted-foreground">Delete Board</span>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Sidebar.MenuItem>
