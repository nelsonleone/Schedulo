<script lang="ts">
	import { alertStore } from '$lib/store';
    import { fade } from 'svelte/transition';
  
    // Automatically hide alert after a timeout

    $: {
      if ($alertStore.show) {
        timer = setTimeout(() => {
          alertStore.set({ show: false, mssg: "", severity: null })
        }, 3000)
      }
    }

    let timer : any;
    function startTimer() {
      if ($alertStore.show) {
        timer = setTimeout(() => {
          alertStore.set({ show: false, mssg: "", severity: null })
        }, 3000)
      }
    }
  </script>
  
  {#if $alertStore.show}
    <div class="alert fixed top-4 z-50 right-4 flex items-center gap-3 p-3 rounded-lg shadow-lg transition-opacity duration-500"
        class:alert-success={$alertStore.severity === 'success'}
        class:alert-error={$alertStore.severity === 'error'}
        transition:fade
        role="alert"
        on:mouseenter={() => clearTimeout(timer)}
        on:mouseleave={startTimer}>
      <div class="alert-icon">
        {#if $alertStore.severity === 'success'}
          <span class="text-emerald-500">✔️</span>
        {:else if $alertStore.severity === 'error'}
          <span class="text-red-500">❌</span>
        {/if}
      </div>
      <p class="alert-message text-white">{$alertStore.mssg}</p>
    </div>
  {/if}
  
<style>
    .alert {
        max-width: 300px;
        color: white;
        background-color: var(--color-bg)
    }

    .alert-success { @apply bg-emerald-600; }
    .alert-error { @apply bg-red-500/85; }
</style>
  