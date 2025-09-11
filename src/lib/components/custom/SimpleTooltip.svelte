<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Tooltip from '../ui/tooltip';

	interface Props {
		children: Snippet<[]>;
		content?: string;
		child?: Snippet<[]>;
	}
	const { children, content, child }: Props = $props();
</script>

<Tooltip.Provider delayDuration={100}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{#if child}
				{@render child()}
			{:else}
				{content}
			{/if}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
