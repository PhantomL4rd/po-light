<script lang="ts">
import History from '@lucide/svelte/icons/history';
import Lightbulb from '@lucide/svelte/icons/lightbulb';
import { page } from '$app/state';
</script>

<nav class="bg-primary">
	<div class="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
		<a href="/" class="text-xl font-bold tracking-tight text-primary-foreground">Po-Light</a>
		<div class="flex gap-1">
			<a
				href="/"
				class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors {page.url
					.pathname === '/'
					? 'bg-primary-foreground/20 text-primary-foreground'
					: 'text-primary-foreground/70 hover:text-primary-foreground'}"
			>
				<Lightbulb class="size-4" />
				提案
			</a>
			<a
				href="/history"
				class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors {page
					.url.pathname === '/history'
					? 'bg-primary-foreground/20 text-primary-foreground'
					: 'text-primary-foreground/70 hover:text-primary-foreground'}"
			>
				<History class="size-4" />
				履歴
			</a>
		</div>
	</div>
</nav>
