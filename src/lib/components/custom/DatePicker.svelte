<script lang="ts">
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import Icons from '../icons';

	interface Props {
		value?: DateValue;
	}

	let { value = $bindable() }: Props = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'w-fit justify-start text-left font-normal'
			}),
			!value && 'text-muted-foreground'
		)}
	>
		<Icons.calendar />
		{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<Calendar type="single" bind:value />
	</Popover.Content>
</Popover.Root>
