<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { slide } from 'svelte/transition';
	import BoardTile from './BoardTile.svelte';
	import { cn } from '$lib/utils';
	import { useBoards, type Board } from '$lib/appwrite/db/boards.svelte';

	const boards = useBoards();
</script>

<Sidebar.Group class={cn(!Sidebar.useSidebar().open && 'rounded border border-dashed')}>
	<Sidebar.GroupLabel>Pinned Boards</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each boards.boards.filter((b) => b.pinned) as board (board.$id)}
			<div transition:slide>
				<BoardTile {board} />
			</div>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
