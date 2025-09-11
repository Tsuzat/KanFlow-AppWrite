<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import Icons from '../icons';
	import { Button } from '../ui/button';
	import SimpleTooltip from './SimpleTooltip.svelte';
</script>

<SimpleTooltip content="Toggle Mode">
	<Button variant="ghost" size="icon" onclick={toggleMode}>
		<Icons.sun class="block dark:hidden" />
		<Icons.moon class="hidden dark:block" />
	</Button>
</SimpleTooltip>
