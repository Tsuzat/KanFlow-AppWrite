<script lang="ts">
	interface Props {
		tag: string;
		color: string;
	}

	const { tag, color }: Props = $props();
</script>

<small style={`background-color: ${color}20; color: ${color}`} class="rounded p-1">{tag}</small>
