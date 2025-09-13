<script lang="ts">
	import { goto } from '$app/navigation';
	import { useBoards, type Board } from '$lib/appwrite/db/boards.svelte';
	import ToggleSidebar from '$lib/components/custom/ToggleSidebar.svelte';
	import Icons from '$lib/components/icons';
	import IconRenderer from '$lib/components/icons/IconRenderer.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	const boards = useBoards();

	async function updateBoard(board: Board) {
		await boards.update(board);
	}

	async function deleteBoard(board: Board) {
		const ask = confirm(`Are you sure want to delete board ${board.name}?`);
		if (!ask) return;
		await boards.delete(board.$id);
	}
</script>

<svelte:head>
	<title>Boards | KanFlow</title>
</svelte:head>

<div class="inline-flex items-center gap-4">
	<ToggleSidebar />
	<h3>Boards</h3>
</div>

<main class="mt-4 grid grid-cols-1 gap-4 -bg-conic-0 md:grid-cols-2 lg:grid-cols-3">
	{#each boards.boards as board (board.$id)}
		<Card.Root
			class="w-full max-w-sm gap-2 bg-transparent py-4 transition-all duration-500 hover:scale-[101%] hover:cursor-pointer hover:bg-card"
			onclick={() => goto(`/board-${board.$id}`)}
		>
			<Card.Header>
				<Card.Title class="flex items-center gap-4">
					<IconRenderer icon={board.icon} />
					{board.name}
				</Card.Title>
				<Card.Description class="mt-1">{board.description}</Card.Description>
				<Card.Action>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
							<Icons.ellipsis />
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-fit">
							<DropdownMenu.Item onclick={() => updateBoard({ ...board, pinned: !board.pinned })}>
								{#if board.pinned}
									<Icons.pinOff />
									<span>Unpin</span>
								{:else}
									<Icons.pin />
									<span>Pin</span>
								{/if}
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => deleteBoard(board)}>
								<Icons.trash class="text-destructive" />
								<span>Delete</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Card.Action>
			</Card.Header>
			<Card.Content>
				{#each board.tags ?? [] as tag (tag)}
					<Badge class="mr-1 bg-secondary">{tag}</Badge>
				{/each}
			</Card.Content>
		</Card.Root>
	{/each}
</main>
