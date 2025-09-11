<script lang="ts">
	let { data } = $props();

	import { account, avatars } from '$lib/appwrite';
	import Icons from '$lib/components/icons';
	import { Input } from '$lib/components/ui/input';
	import { AppwriteException, Browser, type Models } from 'appwrite';
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import SimpleTooltip from '$lib/components/custom/SimpleTooltip.svelte';
	import ToggleSidebar from '$lib/components/custom/ToggleSidebar.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import { signOut } from '$lib/appwrite/oauth';
	import { onMount } from 'svelte';

	let user = $derived(data.user);
	let userName = $derived(data.user.name);
	let userEmail = $derived(data.user.email);

	let sessions = $state<Models.Session[]>([]);

	onMount(async () => {
		const userSessions = await account.listSessions();
		sessions = userSessions.sessions.sort((a, b) => b.$createdAt.localeCompare(a.$createdAt));
	});
</script>

<svelte:head>
	<title>Profile | {data.user.name}</title>
</svelte:head>

<main class="flex size-full flex-col overflow-auto">
	<div class="flex items-center gap-8">
		<ToggleSidebar />
		<h3 class="capitalize">{data.user.name}</h3>
	</div>

	<Card.Root class="mx-auto my-4 w-full max-w-4xl bg-background/20 backdrop-blur-3xl">
		<Card.Content class="flex justify-between">
			<div class="flex flex-col gap-2">
				<h3 class="flex items-center gap-4">Display Name</h3>
				<small class="text-sm/6 font-light">
					Please enter your full name, or a display name you are comfortable with.
				</small>
				<Input bind:value={userName} disabled maxlength={32} class="w-80" />
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-between">
			<span class="text-xs font-light">Please use 32 characters at maximum.</span>
			<Button
				disabled={userName.trim() === user.name || userName.trim() === ''}
				onclick={async () => {
					toast.promise(account.updateName(userName), {
						loading: 'Updating name...',
						success: (res) => {
							user = res;
							return 'Name updated successfully';
						},
						error: (err) => {
							if (err instanceof AppwriteException) {
								return err.message;
							} else {
								console.error(err);
								return 'Something went wrong';
							}
						}
					});
				}}>Save Changes</Button
			>
		</Card.Footer>
	</Card.Root>

	<Card.Root
		class="mx-auto my-4 w-full max-w-4xl bg-background/20 backdrop-blur-3xl"
		id="user-email"
	>
		<Card.Content class="flex justify-between">
			<div class="flex flex-col gap-2">
				<h3>Email</h3>
				<small class="text-sm/6 font-light">
					Enter the email addresses you want to use to log in with KanFlow. Your new email must be
					verified.
				</small>
				<div class="flex items-center gap-2">
					<Input bind:value={userEmail} class="w-80" disabled type="email" />
					{#if user.emailVerification}
						<SimpleTooltip content="Email Verified">
							<Button variant="ghost" size="icon">
								<Icons.badgeCheck class=" text-green-500" />
							</Button>
						</SimpleTooltip>
					{:else}
						<SimpleTooltip content="Email Unverified. Click to verify">
							<Button
								variant="ghost"
								size="icon"
								onclick={() => {
									// toast.promise(sendEmailVerification(), {
									// 	loading: 'Sending verification email...',
									// 	success: 'Verification email sent successfully',
									// 	error: (err) => {
									// 		if (err instanceof AppwriteException) {
									// 			return err.message;
									// 		} else {
									// 			console.error(err);
									// 			return 'Something went wrong';
									// 		}
									// 	}
									// });
								}}
							>
								<Icons.badgeX class="text-destructive" />
							</Button>
						</SimpleTooltip>
					{/if}
				</div>
			</div>
		</Card.Content>
		<Card.Footer class="text-xs font-light">
			Emails must be verified to be able to login with them or be used as primary email.
		</Card.Footer>
	</Card.Root>

	<Card.Root class="mx-auto my-4 w-full max-w-4xl bg-background/20 backdrop-blur-3xl" id="billing">
		<Card.Content class="flex justify-between">
			<div class="flex flex-col gap-2">
				<h3 class="flex items-center gap-4">Your sessions</h3>
				<small class="text-sm/6 font-light">
					A session is created when you login with KanFlow via a new device or browser.
				</small>
				<div class="overflow-x-auto rounded border">
					<Table.Root class="min-w-[600px]">
						<Table.Header class="bg-muted">
							<Table.Row>
								<Table.Head class="max-w-1/2">Client</Table.Head>
								<Table.Head>Location</Table.Head>
								<Table.Head>IP</Table.Head>
								<Table.Head></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each sessions as session, idx (idx)}
								<Table.Row class="items-center">
									<Table.Cell class="flex flex-wrap items-center gap-2">
										<Avatar.Root class="size-8 bg-muted p-2">
											<Avatar.Image
												src={avatars.getBrowser({ code: session.clientCode as Browser })}
											/>
											<Avatar.Fallback>{session.clientName}</Avatar.Fallback>
										</Avatar.Root>
										{session.clientName}
										{session.clientVersion}
										on
										{session.osName}
										{session.osVersion}
										{#if session.current}
											<SimpleTooltip content="Current session">
												<span class="relative flex size-2">
													<span
														class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"
													></span>
													<span class="relative inline-flex size-2 rounded-full bg-primary"></span>
												</span>
											</SimpleTooltip>
										{/if}
									</Table.Cell>
									<Table.Cell>
										{session.countryName}
									</Table.Cell>
									<Table.Cell>
										{session.ip}
									</Table.Cell>
									<Table.Cell class="text-right">
										<SimpleTooltip content="Delete Session">
											<Button
												variant="ghost"
												size="icon"
												title="Delete Session"
												onclick={async () => {
													sessions = sessions.filter((s) => s.$id !== session.$id);
													if (session.current) await signOut();
													else await account.deleteSession(session.$id);
												}}
											>
												<Icons.trash />
											</Button>
										</SimpleTooltip>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root class="mx-auto my-4 w-full max-w-4xl bg-background/20 backdrop-blur-3xl" id="billing">
		<Card.Content class="flex justify-between">
			<div class="flex flex-col gap-2">
				<h3 class="flex items-center gap-4">Delete Account</h3>
				<small class="text-sm/6 font-light">
					You can request to delete your account permanently. <br />
					Please note that this action is irreversible, and all your data will be permanently deleted.
				</small>
			</div>
		</Card.Content>
		<Card.Footer class="flex items-center justify-between">
			<span class="text-xs font-light">
				Deleting your account is permanent and irreversible. Please be careful.
			</span>
			<Button variant="destructive">Delete Account</Button>
		</Card.Footer>
	</Card.Root>
</main>
