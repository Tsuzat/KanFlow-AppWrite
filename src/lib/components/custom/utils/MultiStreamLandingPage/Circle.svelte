<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';

	interface Props {
		class?: any;
		content: string;
		children?: Snippet<[]>;
	}

	let { class: className = '', children, content }: Props = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={100}>
		<Tooltip.Trigger
			class={cn(
				'z-10 flex size-16 cursor-pointer items-center justify-center rounded-full border-2 bg-background p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] transition-all duration-200 dark:hover:border-primary',
				className
			)}
		>
			{@render children?.()}
		</Tooltip.Trigger>
		<Tooltip.Content>
			{content}
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
