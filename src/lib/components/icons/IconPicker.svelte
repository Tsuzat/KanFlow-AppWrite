<script lang="ts">
	import { icons } from '@lucide/svelte';
	import { Button, buttonVariants } from '../ui/button';
	import IconRenderer from './IconRenderer.svelte';
	import * as Popover from '../ui/popover';
	import { Input } from '../ui/input';
	import Icons from '.';

	const allLucideIcons = Object.keys(icons) as Array<keyof typeof icons>;

	let iconNames = $state(allLucideIcons);

	interface Props {
		currentIcon: keyof typeof icons | string;
		class?: string;
		side?: 'left' | 'right' | 'top' | 'bottom';
		onClose?: (icon: keyof typeof icons | string) => void;
	}
	let {
		currentIcon = $bindable(),
		class: className = undefined,
		side = 'right',
		onClose
	}: Props = $props();

	let loadedIcons = $state(100);
	let searchTerm = $state('');

	function updateSearch(searchTerm: string) {
		if (searchTerm.trim() === '') {
			iconNames = allLucideIcons;
			loadedIcons = 100;
		} else {
			iconNames = allLucideIcons.filter((iconName) =>
				iconName.toLowerCase().includes(searchTerm.toLowerCase())
			);
			loadedIcons = Math.min(iconNames.length, 100);
		}
	}

	function onscroll() {
		loadedIcons = Math.min(iconNames.length, loadedIcons + 100);
	}

	let iconListDiv: HTMLDivElement | null = null;

	function handleScroll() {
		if (!iconListDiv) return;
		const { scrollTop, scrollHeight, clientHeight } = iconListDiv;
		// Load more when scrolled within 50px of the bottom
		if (scrollTop + clientHeight >= scrollHeight - 50) {
			onscroll();
		}
	}

	let searchDebounce: ReturnType<typeof setTimeout> | null = null;

	function handleInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		searchTerm = value;
		if (searchDebounce) clearTimeout(searchDebounce);
		searchDebounce = setTimeout(() => {
			updateSearch(searchTerm);
		}, 300);
	}
</script>

<Popover.Root
	onOpenChange={(value) => {
		if (value === false) {
			onClose?.(currentIcon);
		}
	}}
>
	<Popover.Trigger class={className ?? buttonVariants({ variant: 'outline', size: 'icon' })}>
		<IconRenderer icon={currentIcon} />
	</Popover.Trigger>
	<Popover.Content class="flex h-96 w-80 flex-col gap-2 px-0 py-0" {side}>
		<div class="relative flex h-12 items-center gap-2 p-1">
			<Input
				bind:value={searchTerm}
				oninput={handleInput}
				placeholder="Search icons..."
				class="w-full pr-16"
			/>
			<Button
				variant="ghost"
				title="Clear Search"
				class="absolute right-2 size-6 p-1"
				onclick={() => {
					searchTerm = '';
					updateSearch(searchTerm);
				}}
			>
				<Icons.clear />
			</Button>
		</div>
		<div
			class="flex w-full flex-wrap gap-2 overflow-auto"
			bind:this={iconListDiv}
			onscroll={handleScroll}
		>
			{#each iconNames.slice(0, loadedIcons) as iconName, idx (idx)}
				<Button
					variant="ghost"
					size="icon"
					onclick={() => {
						currentIcon = iconName;
					}}
					title={iconName}
				>
					<IconRenderer icon={iconName} />
				</Button>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
