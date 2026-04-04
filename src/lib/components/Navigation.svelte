<script lang="ts">
import { History, Lightbulb } from 'lucide-svelte';
import { page } from '$app/state';
</script>

<nav class="border-b border-border bg-card">
	<div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
		<a href="/" class="text-lg font-semibold tracking-tight text-foreground">Po-Light</a>
		<div class="flex gap-1">
			<a
				href="/"
				class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url
					.pathname === '/'
					? 'bg-primary/10 text-primary'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<Lightbulb class="size-4" />
				提案
			</a>
			<a
				href="/history"
				class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors {page
					.url.pathname === '/history'
					? 'bg-primary/10 text-primary'
					: 'text-muted-foreground hover:text-foreground'}"
			>
				<History class="size-4" />
				履歴
			</a>
		</div>
	</div>
</nav>
