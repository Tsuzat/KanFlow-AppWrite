<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { createSessionWithIDAndScrete } from '$lib/appwrite/oauth';
	import Icons from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import { AppwriteException } from 'appwrite';
	import { onMount } from 'svelte';

	let isLoading = $state(false);
	let error = $state<string>();

	onMount(async () => {
		isLoading = true;
		const userId = page.url.searchParams.get('userId');
		const secret = page.url.searchParams.get('secret');
		if (!userId || !secret) {
			error = 'Invalid authenication url';
			isLoading = false;
			return;
		}

		try {
			await createSessionWithIDAndScrete(userId, secret);
			goto('/');
		} catch (err) {
			console.error(err);
			if (err instanceof AppwriteException) {
				error = err.message;
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<main class="m-auto flex h-screen w-screen flex-col items-center justify-center gap-4">
	<div class="flex items-center gap-2">
		<Icons.loader class="animate-spin text-primary" />
		<span>Verifying...</span>
	</div>
	{#if error}
		<p class="text-center text-destructive">{error}</p>
	{/if}
	<Button disabled={isLoading} href="/" variant="link" class="text-primary underline"
		>Go to Home</Button
	>
</main>
