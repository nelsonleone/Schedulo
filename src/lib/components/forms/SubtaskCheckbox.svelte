<script lang="ts">
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
	import { createEventDispatcher } from "svelte";


    export let is_completed : boolean;
    export let title : string;
    export let id : string;

    const dispatch = createEventDispatcher()
</script>
    
<div class="flex items-center space-x-2">
    <Checkbox id={`subtask-${id}`} checked={is_completed} onCheckedChange={(v) => dispatch("setIsCompleted",v)}  aria-labelledby={`subtask-${id}-label`} />
    <Label
     id={`subtask-${id}-label`}
     for={`subtask-${id}`}
     class="text-sm font-medium cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
     {title}
    </Label>
</div>