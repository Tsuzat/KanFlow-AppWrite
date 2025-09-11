<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import Navbar from '$lib/components/custom/Navbar.svelte';
	import BorderBeam from '$lib/components/custom/utils/BorderBeam.svelte';
	import MutliStream from '$lib/components/custom/utils/MultiStreamLandingPage/MutliStream.svelte';
	import Particles from '$lib/components/custom/utils/Particles.svelte';
	import SpotLight from '$lib/components/custom/utils/SpotLight.svelte';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ArrowRight, Check, LayoutPanelTop, Rocket, ShieldCheck, Users } from '@lucide/svelte';
	import { onMount } from 'svelte';

	const features = [
		{
			name: 'Intuitive Kanban Boards',
			description:
				'Visualize your work with clean, customizable Kanban boards designed for effortless task management.',
			icon: LayoutPanelTop
		},
		{
			name: 'Seamless Team Collaboration',
			description:
				'Invite teammates, assign tasks, and track progress — all in real-time, with role-based access control.',
			icon: Users
		},
		{
			name: 'Pro Tools for Power Users',
			description:
				'Unlock recurring tasks, private boards, analytics, and more with KanFlow Pro — built for productivity.',
			icon: Rocket
		},
		{
			name: 'Secure by Design',
			description:
				'All your boards and data are encrypted and protected. You’re in control of your workflow and privacy.',
			icon: ShieldCheck
		}
	];

	const pricingList = {
		free: ['At max 2 Kanban boards', 'At max 4 Sections each board', 'At max 10 Cards each board'],
		pro: [
			'Profile Avatar',
			'Unlimited Kanban Boards',
			'Unlimited Sections',
			'Unlimited Cards',
			'Board and Card Tags',
			'Tasks within Cards',
			'Access to Community Forum',
			'Single User Access',
			'Monthly Product Updates',
			'Standard Security Features'
		]
	};

	const faqItems = [
		{
			id: 'item-1',
			question: 'What do I get in the free plan?',
			answer:
				"The free plan is great for individuals starting out. You can create up to 2 Kanban boards, each with up to 4 sections and 10 cards. It's a simple way to stay organized without any cost."
		},
		{
			id: 'item-2',
			question: 'What features are included in the Pro plan?',
			answer:
				"The Pro plan gives you everything unlimited — boards, sections, and cards. You'll also get access to board and card tags, tasks within cards, monthly updates, and our community forum."
		}
	];

	onMount(() => {
		const sections = document.querySelectorAll('section');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('show');
				}
			});
		});
		sections.forEach((section) => {
			section.classList.add('hide');
			observer.observe(section);
		});
	});
	afterNavigate(() => {
		if (localStorage.getItem('first-time') === null) {
			localStorage.setItem('first-time', 'true');
		}
	});
</script>

<Navbar />
<Particles className="fixed top-0 size-full inset-0 -z-10" refresh={true} />
<SpotLight />

<div id="landing" class="relative mx-auto my-8 max-w-4xl px-2 text-center *:my-8 sm:px-0">
	<section class="!delay-1000 *:my-8">
		<a
			class="group z-10 mx-auto flex w-fit items-center gap-4 rounded-full border bg-primary/50 p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 hover:bg-background dark:border-t-white/5 dark:shadow-zinc-950 dark:hover:border-t-border"
			href="#pricing"
		>
			<span class="text-sm text-foreground">✨ 50% off for 100 new users ✨</span>
			<span class="block h-4 w-0.5 border-l bg-muted-foreground dark:border-background"></span>

			<div
				class="size-6 overflow-hidden rounded-full bg-background duration-500 group-hover:bg-muted"
			>
				<div class="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
					<span class="flex size-6">
						<ArrowRight class="m-auto size-4" />
					</span>
					<span class="flex size-6">
						<ArrowRight class="m-auto size-4" />
					</span>
				</div>
			</div>
		</a>
		<h1>Collaborate and manage projects with ease</h1>
		<p class="text-muted-foreground">
			Discover KanFlow—a dynamic Kanban board that transforms the way your team visualizes tasks,
			streamlines workflows, and drives continuous improvement.
		</p>
		<div class="flex items-center justify-center gap-4">
			<Button href="/login">Get Started</Button>
			<Button variant="outline" href="#pricing">See Pricing</Button>
		</div>

		<div
			class="relative -z-10 h-fit w-full rounded-xl shadow-lg inset-shadow-2xs shadow-zinc-950/15 dark:inset-shadow-white/20"
		>
			<BorderBeam size={150} duration={12} />
			<img
				src="/medias/dark/full_app.png"
				alt="KanFlow"
				class="hidden h-auto w-full max-w-full rounded-xl border object-cover object-center dark:block"
			/>
			<img
				src="/medias/light/full_app.png"
				alt="KanFlow"
				class="border-xl block h-auto w-full max-w-full rounded-xl object-cover object-center dark:hidden"
			/>
		</div>
	</section>

	<section id="features">
		<div class="flex flex-col items-center gap-4">
			<h1 class="text-4xl font-bold">Features That'll help your workflow</h1>
			<span class="text-lg text-muted-foreground"
				>Everything you need to create an amazing kanban workflow
			</span>
		</div>
		<dl class="my-20 grid grid-cols-2 gap-10">
			{#each features as item}
				{@const Icon = item.icon}
				<div class="col-span-full sm:col-span-2 lg:col-span-1">
					<div
						class="mx-auto flex w-fit rounded-lg p-2 shadow-md ring-1 shadow-orange-400/30 ring-black/5 dark:shadow-purple-600/30 dark:ring-white/5"
					>
						<Icon aria-hidden="true" class="size-6 text-muted-foreground" />
					</div>
					<dt class="mt-6 text-center font-semibold text-gray-900 dark:text-gray-50">
						{item.name}
					</dt>
					<dd class="mt-2 text-center leading-7 text-gray-600 dark:text-gray-400">
						{item.description}
					</dd>
				</div>
			{/each}
		</dl>
		<div class="flex flex-col items-center gap-4">
			<h1 class="text-4xl font-bold">Multi-Stream Workflows and Projects</h1>
			<span class="text-lg text-balance text-muted-foreground"
				>Multi-Stream by default. Whether it's a technical project, a marketing campaign, or a
				social media strategy, KanFlow has you covered, no matter what field you're in.
			</span>
		</div>
		<MutliStream class="mx-auto my-16 bg-background" />
	</section>

	<section id="solutions">
		<div class="flex flex-col items-center gap-4">
			<h1 class="text-4xl font-bold">Solutions for your workflow</h1>
			<span class="text-lg text-balance text-muted-foreground">
				KanFlow is a versatile tool that can be used for a variety of workflows. Whether you're a
				freelancer, a team, or a business, KanFlow has you covered, no matter what field you're in.
			</span>
		</div>
		<div class="my-8">
			<h3>Minimal yet feature rich by design</h3>
			<div class="my-8 grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
				<div class="relative mb-6 w-96 sm:mb-0">
					<img
						src="/medias/dark/card.png"
						class="hidden h-auto w-full max-w-full rounded-2xl border object-cover object-center sm:max-w-md lg:max-w-lg dark:block"
						alt="Cards dark"
					/>
					<img
						src="/medias/light/card.png"
						class="h-auto w-full max-w-full rounded-2xl border object-cover object-center shadow sm:max-w-md lg:max-w-lg dark:hidden"
						alt="Card light"
					/>
				</div>
				<div class="relative space-y-4">
					<p class="text-muted-foreground">
						KanFlow Cards are the core of your workflow — built to capture tasks, context, and
						collaboration in one place.
					</p>
					<p>
						Add descriptions, due dates, and labels; Break work into subtasks with checklists;
						Collaborate with comments and mentions; Drag, drop, and track across board sections
					</p>
				</div>
			</div>
		</div>
		<div class="my-8">
			<h3>Keep your workflow organized with Tags</h3>
			<div class="my-8 grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
				<div class="relative mb-6 w-96 sm:mb-0">
					<img
						src="/medias/dark/board_tags.png"
						class="hidden h-auto w-full max-w-full rounded-2xl border object-cover object-center sm:max-w-md lg:max-w-lg dark:block"
						alt="Cards dark"
					/>
					<img
						src="/medias/light/board_tags.png"
						class="h-auto w-full max-w-full rounded-2xl border object-cover object-center shadow sm:max-w-md lg:max-w-lg dark:hidden"
						alt="Card light"
					/>
				</div>
				<div class="relative space-y-4">
					<p class="text-muted-foreground">
						Board Tags are a great way to keep your workflow organized. They are a great way to
						categorize your boards and make them easier to find.
					</p>
					<p>
						Add or remove tags from your boards; Create custom tags; Filter boards by tags; add Tags
						to cards to organize them
					</p>
				</div>
			</div>
		</div>
	</section>

	<section id="pricing">
		<div class="flex flex-col items-center gap-4">
			<h1 class="text-4xl font-bold">Pricing that fits your needs</h1>
			<span class="text-lg text-muted-foreground"
				>KanFlow has a very generous free tier, with no hidden costs. The pro tier is what you need
				to unlock all the features. The teams tier will be available soon.
			</span>
		</div>
		<div class="mt-8 grid gap-6 md:mt-20 md:grid-cols-2">
			<Card class="flex flex-col bg-background">
				<CardHeader>
					<CardTitle class="font-medium">Free</CardTitle>
					<span class="my-3 block text-2xl font-semibold">$0 / mo</span>
				</CardHeader>
				<CardContent class="space-y-4">
					<hr class="border-dashed" />
					<ul class="list-outside space-y-3 text-sm">
						{#each pricingList.free as item}
							<li class="flex items-center gap-2">
								<Check class="size-3" />
								{item}
							</li>
						{/each}
					</ul>
				</CardContent>
			</Card>
			<Card class="relative">
				<BorderBeam />
				<span
					class="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-offset-1 ring-offset-gray-950/5 ring-inset"
					>Popular</span
				>
				<div class="flex flex-col">
					<CardHeader>
						<CardTitle class="font-medium">Pro</CardTitle>
						<span class="my-3 block text-2xl font-semibold"
							>$3.50 / mo
							<span class="text-lg font-normal text-muted-foreground">or</span>
							$30 / y</span
						>
					</CardHeader>
					<CardContent class="space-y-4">
						<hr class="border-dashed" />
						<ul class="list-outside space-y-3 text-sm">
							{#each pricingList.pro as item}
								<li class="flex items-center gap-2">
									<Check class="size-3" />
									{item}
								</li>
							{/each}
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							class="w-full"
							onclick={() => {
								// window.navigator.clipboard.writeText('KANFLOW50');
								// toast.success('Discount Code Copied to Clipboard', {
								// 	description: 'Hurry up!! The code is only valid for first 100 users',
								// 	action: {
								// 		label: 'Use Code',
								// 		onClick: () => {
								// 			goto('/profile?tabs=billing');
								// 		}
								// 	}
								// });
							}}>Free During Demo</Button
						>
					</CardFooter>
				</div>
			</Card>
		</div>
	</section>
	<section id="faqs">
		<div class="mx-auto px-4 md:px-6">
			<div class="mx-auto max-w-xl text-center">
				<h1>Frequently Asked Questions</h1>
				<p class="mt-4 text-balance text-muted-foreground">
					Discover quick and comprehensive answers to common questions about our platform, services,
					and features.
				</p>
			</div>

			<div class="mx-auto mt-12 max-w-2xl">
				<Accordion
					type="single"
					class="w-full rounded-2xl border bg-background px-8 py-3 shadow-sm ring-4 ring-muted dark:ring-0"
				>
					{#each faqItems as item, index}
						<AccordionItem
							value={item.id}
							class={[faqItems.length - 1 !== index ? 'border-dashed' : 'border-none']}
						>
							<AccordionTrigger class="cursor-pointer text-base font-semibold hover:no-underline"
								>{item.question}</AccordionTrigger
							>
							<AccordionContent>
								<p class="text-base">{item.answer}</p>
							</AccordionContent>
						</AccordionItem>
					{/each}
				</Accordion>

				<p class="mt-6 px-4 text-muted-foreground">
					Can't find what you're looking for?
					<a href="mailto:contact@kanflow.pro" class="font-medium text-primary hover:underline">
						Contact Us
					</a>
				</p>
			</div>
		</div>
	</section>
	<footer class="flex items-center justify-center gap-2 border-t pt-2 text-sm">
		© 2025 KanFlow. All rights reserved •
		<a href="/terms" class="text-primary">Terms of Service</a> •
		<a href="/privacy" class="text-primary">Privacy Policy</a> •
		<a href="mailto:contact@kanflow.pro" class="text-primary">Contact Us</a>
	</footer>
</div>

<style>
	section {
		padding-top: 5rem;
	}

	:global(#landing section.hide) {
		opacity: 0;
		filter: blur(4px);
		transform: translateY(2rem);
		transition: all 500ms ease-in-out;
		transition-delay: 300ms;
	}

	:global(#landing section.show) {
		opacity: 1;
		filter: blur(0px);
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		:global(#landing section.hide) {
			transition: none;
		}
	}

	/* reduce motion */
	@media (prefers-reduced-motion: reduce) {
		:global(#landing section.hide) {
			transition: none;
		}
	}
</style>
