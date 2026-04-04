<script lang="ts">
import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
import { page } from '$app/state';
import { Button } from '$lib/components/ui/button';
</script>

<div class="flex flex-col items-center gap-4 py-16 text-center">
	<TriangleAlert class="size-10 text-muted-foreground" />
	<h1 class="text-2xl font-bold">{page.status}</h1>
	<p class="text-sm text-muted-foreground">{page.error?.message ?? 'エラーが発生しました'}</p>
	<Button variant="outline" href="/">トップに戻る</Button>
</div>
