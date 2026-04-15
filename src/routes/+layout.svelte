<script lang="ts">
import './layout.css';
import { ModeWatcher } from 'mode-watcher';
import Navigation from '$lib/components/Navigation.svelte';

let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.png" />
	<meta property="og:image" content="/og-image.png" />
	<title>Po-Light</title>
</svelte:head>

<ModeWatcher />

<div class="flex min-h-screen flex-col bg-background">
	<Navigation />
	<main class="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
		{@render children()}
	</main>
	<footer class="py-4 text-center text-sm text-muted-foreground">
		&copy; SQUARE ENIX
	</footer>
</div>
