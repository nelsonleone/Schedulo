<script>
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { authStateStore } from '$lib/store';
	import Snackbar from '$lib/components/layout-components/Snackbar.svelte';
	import Alert from '$lib/components/layout-components/Alert.svelte';

	export let data;
	$: ({ session, supabase, authenticated, user } = data)

	$: {
	   authStateStore.set({ authenticated, userDetails: user })
	}

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((c, newSession) => {
			console.log("Logged")
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>Schedulo</title>
</svelte:head>
<ModeWatcher />
<Snackbar />
<Alert />
<slot />
