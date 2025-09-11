<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { slide } from 'svelte/transition';
	import BoardTile from './BoardTile.svelte';
	import Icons from '$lib/components/icons';
	import { cn } from '$lib/utils';
	import { useBoards } from '$lib/appwrite/db/boards.svelte';

	let showAllBoards = $state(false);
	const allBoards = $derived(useBoards().boards);
</script>

<Sidebar.Group class={cn(!Sidebar.useSidebar().open && 'rounded border border-dashed')}>
	<Sidebar.GroupLabel>My Boards - {allBoards.length}</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{@const boards = allBoards.slice(0, showAllBoards ? undefined : 3)}
		{#each boards as board (board.$id)}
			<div transition:slide>
				<BoardTile {board} />
			</div>
		{/each}
		<Sidebar.MenuItem onclick={() => (showAllBoards = !showAllBoards)}>
			<Sidebar.MenuButton class="text-sidebar-foreground/70">
				{#snippet tooltipContent()}
					<span class="font-semibold">{showAllBoards ? 'Show Less' : 'Show More'}</span>
				{/snippet}
				{#if !showAllBoards}
					<Icons.chevronDown class="text-sidebar-foreground/70" />
					<span>Show More</span>
				{:else}
					<Icons.chevronUp class="text-sidebar-foreground/70" />
					<span>Show Less</span>
				{/if}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
</Sidebar.Group>
