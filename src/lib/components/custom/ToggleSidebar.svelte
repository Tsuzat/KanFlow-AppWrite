<script lang="ts">
	import { getKeyboardShortcut } from '$lib/utils';
	import Icons from '../icons';
	import { Button } from '../ui/button';
	import { useSidebar } from '../ui/sidebar';
	import SimpleTooltip from './SimpleTooltip.svelte';

	const sidebar = useSidebar();
</script>

<SimpleTooltip>
	<Button variant="ghost" size="icon" onclick={sidebar.toggle}>
		<Icons.sidebar />
	</Button>
	{#snippet child()}
		<div class="flex flex-col items-center">
			<span>Toggle Sidebar</span>
			<span class="rounded bg-muted p-0.5">{getKeyboardShortcut('\\', true)}</span>
		</div>
	{/snippet}
</SimpleTooltip>
