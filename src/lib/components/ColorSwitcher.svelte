<script>
    import { mode, toggleMode } from "mode-watcher"
	import Icon from "@iconify/svelte";
	import { Switch } from "./ui/switch";

</script>
<form class="flex justify-between gap-5 max-w-full w-8/12 mx-auto mt-10 bg-slate-700 px-4 py-3 rounded">
    <Icon class="text-2xl {$mode === "light" ? "text-teal-400" : ""}" icon="line-md:star-alt-twotone" />
    <Switch
        name="theme-switcher"
        checked={$mode === "dark"}
        onCheckedChange={toggleMode}
    />
    <Icon class="text-2xl {$mode === "dark" ? "text-teal-400" : ""}" icon="line-md:moon-loop" />
</form>