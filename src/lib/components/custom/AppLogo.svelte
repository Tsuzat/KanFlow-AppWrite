<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		size?: number;
		href?: string;
		showLogo?: boolean;
		class?: string;
	}

	let { size = 2.5, href = '/', showLogo = true, class: className = '' }: Props = $props();
</script>

<a class={cn('logo flex items-center', className)} {href}>
	<div class="relative" style={`width: ${size}rem; height: ${size}rem`}>
		<div class="rect"></div>
		<div
			class="rect blur-rect absolute border-[0.5px] border-primary !bg-primary/50 backdrop-blur-xl"
		></div>
	</div>
	{#if showLogo}
		<span class="ml-4 hidden text-2xl font-bold sm:block">KanFlow</span>
	{/if}
</a>

<style>
	.rect {
		position: absolute;
		width: 70%;
		height: 70%;
		z-index: 0;
		background: var(--color-primary);
		border: 1px solid var(--color-border);
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		transform: translate(10%, 10%);
		border-radius: 0.25rem;
		transition: all 500ms ease;
	}

	.blur-rect {
		z-index: 1;
		transform: translate(30%, 30%);
		box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.5);
	}

	.logo:hover .rect {
		transform: translate(5%, 5%);
	}

	.logo:hover .blur-rect {
		transform: translate(35%, 35%);
	}

	.logo:active .rect {
		transform: translate(10%, 10%);
	}

	.logo:active .blur-rect {
		transform: translate(30%, 30%);
	}
</style>
