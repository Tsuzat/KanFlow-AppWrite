<script lang="ts">
	import { signInWithGoogle, signInWithGithub } from '$lib/appwrite/oauth';
	import AppLogo from '$lib/components/custom/AppLogo.svelte';
	import Icons from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';

	let ref = $state<HTMLDivElement | null>(null);

	// variables for animation
	let mouseX = $state(0);
	let mouseY = $state(0);
	let rotateX = $derived.by(() => {
		// Convert mouse Y position to rotation around X axis (tilt up/down)
		// Normalize to a small angle range for subtle effect
		return (mouseY / 360) * -10; // Max 10 degrees rotation
	});
	let rotateY = $derived.by(() => {
		// Convert mouse X position to rotation around Y axis (tilt left/right)
		// Normalize to a small angle range for subtle effect
		return (mouseX / 360) * 10; // Max 10 degrees rotation
	});

	function handleMouseMove(e: MouseEvent) {
		if (ref === null) return;
		e.preventDefault();
		// mouse x and y position
		const x = e.clientX;
		const y = e.clientY;
		// get the element that was clicked
		const rect = ref.getBoundingClientRect();
		// Center the coordinates and normalize to card dimensions
		mouseX = x - rect.left - rect.width / 2;
		mouseY = y - rect.top - rect.height / 2;
	}

	function handleMouseLeave(e: MouseEvent) {
		e.preventDefault();
		// Reset mouse position to center when mouse leaves
		mouseX = 0;
		mouseY = 0;
	}

	onMount(() => {
		if (ref !== null) {
			ref.addEventListener('mousemove', handleMouseMove);
			ref.addEventListener('mouseleave', handleMouseLeave);
		}
		return () => {
			if (ref !== null) {
				ref.removeEventListener('mousemove', handleMouseMove);
				ref.removeEventListener('mouseleave', handleMouseLeave);
			}
		};
	});
</script>

<svelte:head>
	<title>Sign In | KanFlow</title>
</svelte:head>

<div
	class="inset-0 flex h-screen w-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-primary/30 via-background/50 to-background"
>
	<AppLogo />
	<Card.Root
		bind:ref
		class="w-[30rem] max-w-full border bg-transparent p-4 backdrop-blur-2xl transition-transform duration-500 ease-out"
		style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg); transform-style: preserve-3d;"
	>
		<Card.Header>
			<Card.Title class="text-2xl font-bold">Welcome Back! Sign In</Card.Title>
			<Card.Description class="mt-0">
				By signing in, you agree to our <a href="/terms" class="text-primary">Terms of Service</a>
				and
				<a href="/privacy" class="text-primary">Privacy Policy</a>.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="flex w-full flex-col items-center gap-2 border-dashed pb-4">
				<Button variant="outline" class="w-full" onclick={signInWithGoogle}>
					<Icons.google />
					Google
				</Button>
				<Button variant="outline" class="w-full" onclick={signInWithGithub}>
					<Icons.github />
					Github
				</Button>
			</div>
		</Card.Content>
	</Card.Root>
</div>
