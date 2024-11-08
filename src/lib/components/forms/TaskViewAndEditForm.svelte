<script lang="ts">
	import { createEventDispatcher } from "svelte";
    import { OutClick } from "svelte-outclick";
	import Button from "../ui/button/button.svelte";
	import Icon from "@iconify/svelte";
	import Label from "../ui/label/label.svelte";
	import { userBoardData } from "$lib/store";
	import LoadingBtn from "../Buttons/LoadingBtn.svelte";


    const dispatch = createEventDispatcher()
    export let showTaskViewModal = false;
    export let taskBeingViewed : Task;
    export let boardID : string;
    let completedSubtasksCount = 0;

    $: board_columns = $userBoardData.find(v => v.id === boardID)?.board_columns || [];

    $: {
        taskBeingViewed?.sub_tasks.map((v) => {
            v.is_completed ? completedSubtasksCount++ : null;
        })
    }

    const handleSubmit = async() => {
        
    }
</script>

<OutClick onOutClick={() => dispatch("closeTaskViewModal",false)}>
    <form  method="POST" action="?/addTask"  on:submit|preventDefault={handleSubmit} class="{showTaskViewModal ? "block" : "hidden"} px-6 pt-10 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-md shadow-gray-600/80">
        <Button type="button" on:click={() => dispatch("closeTaskViewModal",false)} class="bg-transparent absolute text-white text-xl top-4 right-3 hover:bg-transparent">
            <Icon icon="fa:close" />
        </Button>
        
        <h2 class="text-xl font-semibold font-quicksand mb-6">{taskBeingViewed?.title}</h2>
        
        <div>
            <p class="font-medium mb-2 text-sm">Substasks (completedSubtasksCount/{taskBeingViewed?.sub_tasks.length})</p>
    
        </div>
    
        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="status" class="font-medium">Status</Label>
            <select id="status" name="status" class="p-2 rounded mt-2">
                {#each board_columns as column, i (i)}
                    <option value={column.position} class="font-manrope font-medium text-sm">{column.name}</option>
                {/each}
            </select>
        </div>
    
        <div class="flex flex-col gap-3 mt-5">
            <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={false}>Add Task</LoadingBtn>
        </div>
    </form>
</OutClick>