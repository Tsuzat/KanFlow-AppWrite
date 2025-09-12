<script lang="ts">
	import { useBoards } from '$lib/appwrite/db/boards.svelte';
	import { useSections } from '$lib/appwrite/db/sections.svelte';
	import BoardSkeleton from '$lib/components/custom/BoardSkeleton.svelte';
	import SectionComp from '$lib/components/custom/SectionComp.svelte';
	import ToggleSidebar from '$lib/components/custom/ToggleSidebar.svelte';
	import IconPicker from '$lib/components/icons/IconPicker.svelte';
	import Icons from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import SimpleTooltip from '$lib/components/custom/SimpleTooltip.svelte';
	import NewSection from '$lib/components/custom/dialogs/NewSection.svelte';
	import { useTasks } from '$lib/appwrite/db/tasks.svelte.js';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	overrideItemIdKeyNameBeforeInitialisingDndZones('$id');

	const { data } = $props();

	const boards = useBoards();
	const sections = useSections();
	const tasks = useTasks();

	let isLoadingBoardData = $state(false);
	let syncing = $state(false);
	let openSections = $state(false);

	let board = $derived.by(() => boards.boards.find((b) => b.$id === data.id));
	$effect(() => {
		if (board !== undefined) loadBoardData(board.$id);
	});

	async function loadBoardData(boardId: string) {
		isLoadingBoardData = true;
		try {
			await sections.fetch(boardId);
			await tasks.fetch(boardId);
		} catch (error) {
			toast.error("Couldn't load board data");
			console.error(error);
		} finally {
			isLoadingBoardData = false;
		}
	}
</script>

<svelte:head>
	<title>Board | {board?.name}</title>
</svelte:head>

{#if board !== undefined}
	<NewSection {board} bind:open={openSections} />
	<main class="flex size-full flex-col gap-2">
		<div class="flex items-center justify-between gap-2">
			<div class="flex items-center gap-2">
				<ToggleSidebar />
				<IconPicker
					currentIcon={board.icon}
					onClose={async (icon) => {
						if (board === undefined) return;
						if (icon === board.icon) return;
						board = { ...board, icon };
						syncing = true;
						await boards.update(board);
						syncing = false;
					}}
				/>
				<Input
					value={board.name}
					onfocusout={async (e) => {
						if (board === undefined) return;
						const name = (e.target as HTMLInputElement).value;
						if (name.trim() === '' || name.trim() === board.name) return;
						board = { ...board, name: name };
						syncing = true;
						await boards.update(board);
						syncing = false;
					}}
					class="max-w-60 border-0 !bg-transparent p-1 !text-xl font-bold ring-0"
				/>
			</div>
			<div class="flex items-center gap-2">
				<SimpleTooltip content={syncing ? 'Syncing' : 'Synced'}>
					<Button size="icon" variant="ghost">
						{#if syncing}
							<Icons.loader class="animate-spin text-primary" />
						{:else}
							<Icons.cloud />
						{/if}
					</Button>
				</SimpleTooltip>
				<Button onclick={() => (openSections = true)}>
					<Icons.addCircle />
					<span>Section</span>
				</Button>
			</div>
		</div>
		<div class="flex max-h-full flex-1 items-center gap-4 overflow-auto p-2">
			{#if isLoadingBoardData}
				<BoardSkeleton />
				<BoardSkeleton />
				<BoardSkeleton />
			{:else}
				{#each sections.sections as section (section.$id)}
					<div animate:flip={{ duration: 500 }} class="h-full w-full max-w-1/3 min-w-72">
						<SectionComp {section} bind:syncing />
					</div>
				{/each}
			{/if}
		</div>
	</main>
{:else if board === undefined && !isLoadingBoardData}
	<div class="flex size-full flex-col items-center justify-center gap-4">
		<h3>Board is not fond.</h3>
		<p class="text-muted-foreground">
			You either do not own this board or do not have permissions. Please go to
			<a href="/home">Home</a> to explore your boards.
		</p>
	</div>
{/if}
