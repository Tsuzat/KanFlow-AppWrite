<script lang="ts">
	import { Status, useSections } from '$lib/appwrite/db/sections.svelte';
	import Icons from '$lib/components/icons';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import ColorPicker from 'svelte-awesome-color-picker';
	import BoardStatusSelector from '../utils/BoardStatusSelector.svelte';
	import type { Board } from '$lib/appwrite/db/boards.svelte';

	interface Props {
		open: boolean;
		board: Board;
	}
	let { open = $bindable(false), board }: Props = $props();

	const sections = useSections();
	let isLoading = $state(false);

	let name = $state<string>();
	const order = $derived(sections.sections.length);
	let color = $state<string>('#000000');
	let status = $state<Status>(Status.Active);

	async function handleSubmit() {
		if (!name || name.trim().length === 0) return;
		isLoading = true;

		try {
			await sections.create({
				name,
				color,
				status,
				order,
				board: board.$id
			});
			open = false;
		} catch (err) {
			console.error(err);
			toast.error("Couldn't create section. Please try again.");
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog.Root
	bind:open
	onOpenChange={(value) => {
		if (value === false) {
			name = undefined;
			color = '#000000';
		}
	}}
>
	<Dialog.Trigger>
		<span class="sr-only">Open</span>
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-[30rem] bg-popover">
		<Dialog.Header>
			<Dialog.Title>Create New Section</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			<p class="text-muted-foreground">Create a new section with title and color</p>
		</Dialog.Description>
		<form onsubmit={handleSubmit} class="*:my-2">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-muted-foreground"
					>Name
					<span class="text-destructive">*</span>
				</Label>
				<Input id="name" bind:value={name} placeholder="Section Name" class="col-span-3" required />
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="color" class="text-muted-foreground">Color</Label>
				<div id="color" class="flex items-center gap-2">
					<ColorPicker
						bind:hex={color}
						isAlpha={false}
						sliderDirection="vertical"
						label=""
						--picker-indicator-size="1rem"
						--input-size="1.125rem"
					/>
					<span class="text-sm text-muted-foreground">{color}</span>
				</div>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="status" class="text-muted-foreground">Status</Label>
				<BoardStatusSelector bind:value={status} />
			</div>
			<span class="flex items-start gap-2 text-sm text-primary">
				<Icons.info class="size-5" />
				Status will be applied to all the cards in the section which helps you to filter cards.
			</span>
			<Dialog.Footer class="mt-4">
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Close</Dialog.Close>
				<Button type="submit" class="w-24">
					{#if isLoading}
						<Icons.loader class="animate-spin" />
					{/if}
					Create
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
