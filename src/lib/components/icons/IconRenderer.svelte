<script lang="ts">
	import { icons } from '@lucide/svelte';

	interface Props {
		icon: keyof typeof icons | string;
		[key: string]: unknown;
	}

	const { icon, ...props }: Props = $props();

	const Icon = $derived(icons[icon as keyof typeof icons]);
</script>

<Icon {...props} />
