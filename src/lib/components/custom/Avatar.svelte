<script lang="ts">
	import { goto } from '$app/navigation';
	import { getUserInitals } from '$lib/appwrite';
	import * as Avatar from '$lib/components/ui/avatar';
	import { cn } from '$lib/utils';
	import type { Models } from 'appwrite';

	interface Props {
		user: Models.User<Models.Preferences>;
		class?: string;
	}

	const { user, class: className = '' }: Props = $props();
</script>

<Avatar.Root class={cn('cursor-pointer', className)} onclick={() => goto('/profile')}>
	<Avatar.Fallback class="rounded-lg">{getUserInitals(user.name)}</Avatar.Fallback>
</Avatar.Root>
