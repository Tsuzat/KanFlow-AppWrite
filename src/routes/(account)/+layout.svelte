<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import UserSidebar from '$lib/components/custom/sidebar/AppBar.svelte';
	import { setBoards, type Board } from '$lib/appwrite/db/boards.svelte';
	import { onMount } from 'svelte';

	let open = $state(false);

	const { data, children } = $props();

	const boards = setBoards();

	onMount(async () => {
		await boards.fetch();
	});
</script>

<Sidebar.Provider
	class="h-screen w-screen !bg-background"
	{open}
	onOpenChange={(op) => {
		localStorage.setItem('sidebar:state', op.toString());
	}}
>
	<UserSidebar user={data.user!} />
	<Sidebar.Inset class="!ml-1 overflow-hidden border-1 bg-primary/5 p-2">
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
