<script lang="ts">
	import { snackbarStore } from '$lib/store';
    import { onDestroy, onMount } from 'svelte';
  
    
  
    let timer: NodeJS.Timeout;
  
    $: {
        if ($snackbarStore.show) {
        timer = setTimeout(() => {
          snackbarStore.update(state => ({ ...state, showSnackbar: false }))
        }, 3000)
      }
    }
  
    onDestroy(() => {
      clearTimeout(timer)
    })
  </script>
  
<div
    class="snackbar fixed bottom-4 z-50 right-4 bg-gray-800 text-white py-3 px-5 rounded-lg shadow-lg animate-snackbar transition duration-500 transform"
    class:invisible={!$snackbarStore.show}>

    <div class="flex items-center gap-3">
        {#if $snackbarStore.loading}
        <span class="loader inline-block w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></span>
        {/if}
        <p class="text-sm font-quicksand">{$snackbarStore.mssg}</p>
    </div>

    {#if $snackbarStore.loading}
        <div class="h-1 bg-emerald-500 mt-2 animate-progress"></div>
    {/if}
</div>

  