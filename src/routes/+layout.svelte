<script lang="ts">
import './layout.css';
import { ModeWatcher } from 'mode-watcher';
import favicon from '$lib/assets/favicon.svg';
import Navigation from '$lib/components/Navigation.svelte';

let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Po-Light</title>
</svelte:head>

<ModeWatcher />

<div class="min-h-screen bg-background">
	<Navigation />
	<main class="mx-auto max-w-2xl px-4 py-6">
		{@render children()}
	</main>
</div>
