<script lang="ts">
	import { account } from '$lib/appwrite';
	import AppLogo from './AppLogo.svelte';
	import Button, { buttonVariants } from '../ui/button/button.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icons from '../icons';
	import Avatar from './Avatar.svelte';
	import ModeToggler from './ModeToggler.svelte';
	import { goto } from '$app/navigation';
	import { signOut } from '$lib/appwrite/oauth';

	const navItems = [
		{
			url: '#features',
			title: 'Features'
		},
		{
			url: '#solutions',
			title: 'Solution'
		},
		{
			url: '#pricing',
			title: 'Pricing'
		},
		{
			url: '#faqs',
			title: 'FAQs'
		}
	];
</script>

<nav
	class="sticky top-0 z-10 flex w-full items-center justify-between gap-8 border-b bg-background/20 p-4 backdrop-blur-xl"
>
	<a href="/">
		<AppLogo />
	</a>
	<!-- Desktop Navigation -->
	<div class="hidden items-center gap-8 md:flex">
		{#each navItems as item, idx (idx)}
			<a
				href={`${item.url}`}
				class="text-muted-foreground capitalize transition-all duration-500 hover:text-foreground"
				>{item.title}</a
			>
		{/each}
	</div>

	<!-- Mobile Navigation -->
	<div class="md:hidden">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class={buttonVariants({ variant: 'ghost', class: 'text-muted-foreground' })}
			>
				<Icons.add />
				<span>Links</span>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-fit md:hidden">
				{#each navItems as item, idx (idx)}
					<DropdownMenu.Item>
						<a href={`${item.url}`} class="block w-full capitalize">
							{item.title}
						</a>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	<div class="flex items-center gap-4">
		<ModeToggler />

		{#await account.get()}
			<Button variant="secondary">
				<Icons.loader class="animate-spin" />
			</Button>
		{:then user}
			{#if user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ variant: 'ghost', class: 'rounded p-0' })}>
						<Avatar {user} />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Label>
							{user.email}
						</DropdownMenu.Label>
						<DropdownMenu.Item onclick={() => goto('/profile')}>
							<Icons.person />
							Profile
						</DropdownMenu.Item>
						<DropdownMenu.Item onclick={signOut}>
							<Icons.logOut />
							Log Out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<Button href="/login">Get Started</Button>
			{/if}
		{:catch error}
			{console.error(error)}
			<Button href="/login">Get Started</Button>
		{/await}
	</div>
</nav>
