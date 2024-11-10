<script>
    import { mode, toggleMode } from "mode-watcher"
	import Icon from "@iconify/svelte";

</script>
<form class="flex justify-between gap-5 max-w-full w-9/12 mx-auto mt-10 bg-slate-800 dark:bg-slate-800 px-2 py-3 rounded lg:mt-40 lg:px-4">
    <Icon class="text-2xl {$mode === "light" ? "text-teal-400" : "text-slate-300"}" icon="line-md:star-alt-twotone" />
    <label class="relative inline-flex items-center cursor-pointer">
        <!-- Hidden checkbox for accessibility -->
        <input type="checkbox" on:change={toggleMode} class="sr-only peer" aria-label="Toggle switch" />
    
        <!-- Track (background) -->
        <div class="w-11 h-6 rounded-full peer-focus:ring-1 peer-focus:ring-offset-1 peer-focus:ring-teal-500
                    peer-checked:bg-teal-600 bg-gray-400 transition-all duration-300"></div>
    
        <!-- Button (toggle handle) -->
        <span class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transform transition-all
                     duration-300 peer-checked:translate-x-5 shadow-md"></span>
    </label>    
    <Icon class="text-2xl {$mode === "dark" ? "text-teal-400" : "text-slate-300"}" icon="line-md:moon-loop" />
</form>