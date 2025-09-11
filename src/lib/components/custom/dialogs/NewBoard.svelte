<script lang="ts">
	import { useBoards } from '$lib/appwrite/db/boards.svelte';
	import Icons from '$lib/components/icons';
	import IconPicker from '$lib/components/icons/IconPicker.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { icons } from '@lucide/svelte';
	import { type Models } from 'appwrite';
	import { toast } from 'svelte-sonner';

	interface Props {
		open: boolean;
		user: Models.User<Models.Preferences>;
	}

	let { open = $bindable(false), user }: Props = $props();
	let isLoading = $state(false);

	const defaultFormData = {
		name: '',
		description: '',
		icon: 'AArrowDown' as keyof typeof icons,
		pinned: false,
		tags: []
	};

	let form = $state(defaultFormData);

	const boards = useBoards();

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (form.name.trim() === '' || form.icon.trim() === '') {
			toast.warning('Please provide name and icon');
			return;
		}
		isLoading = true;
		await boards.create({
			...form,
			owner: user.$id
		});
		isLoading = false;
		form = defaultFormData;
		open = false;
	}
</script>

<Dialog.Root
	bind:open
	onOpenChange={(value) => {
		if (value === false) {
			form = defaultFormData;
			isLoading = false;
		}
	}}
>
	<Dialog.Trigger>
		<span class="sr-only">Open</span>
	</Dialog.Trigger>
	<Dialog.Content class="w-auto bg-popover">
		<Dialog.Header>
			<Dialog.Title>Create New Board</Dialog.Title>
		</Dialog.Header>
		<Dialog.Description>
			<p class="text-muted-foreground">Create a new board with title, description and icon.</p>
		</Dialog.Description>
		<form onsubmit={handleSubmit} class="*:my-2">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="name" class="text-muted-foreground"
					>Name
					<span class="text-destructive">*</span>
				</Label>
				<Input
					id="name"
					bind:value={form.name}
					placeholder="Board Name"
					class="col-span-3"
					maxlength={48}
					required
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="description" class="text-muted-foreground">Description</Label>
				<Input
					id="description"
					bind:value={form.description}
					placeholder="Board Description"
					maxlength={128}
					class="col-span-3"
				/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label for="icon" class="text-muted-foreground">Icon</Label>
				<IconPicker bind:currentIcon={form.icon} />
				<div class="flex w-[10rem] items-center gap-2">
					<Checkbox id="terms" bind:checked={form.pinned} />
					<Label for="terms">Pin this board?</Label>
				</div>
			</div>
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
