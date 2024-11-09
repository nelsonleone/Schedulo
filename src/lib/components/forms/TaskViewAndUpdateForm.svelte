<script lang="ts">
	import { createEventDispatcher } from "svelte";
    import { OutClick } from "svelte-outclick";
	import Button from "../ui/button/button.svelte";
	import Icon from "@iconify/svelte";
	import Label from "../ui/label/label.svelte";
	import { alertStore, snackbarStore, userBoardData } from "$lib/store";
	import LoadingBtn from "../Buttons/LoadingBtn.svelte";
	import SubtaskCheckbox from "./SubtaskCheckbox.svelte";
	import { invalidateAll } from "$app/navigation";
	import { AlertSeverity } from "../../../enums";
	import TaskActionDropdown from "../TaskActionDropdown.svelte";
	import TaskCompletedCheckbox from "./TaskCompletedCheckbox.svelte";


    const dispatch = createEventDispatcher()
    export let showTaskViewModal = false;
    export let taskBeingViewed : Task;
    export let boardID : string;
    let completedSubtasksCount = 0;
    let isUpdating = false;
    let position : number;
    $: taskIsCompleted = taskBeingViewed?.is_completed;

    $: board_columns = $userBoardData.find(v => v.id === boardID)?.board_columns || [];

    $: {
        taskBeingViewed?.sub_tasks.map((v) => {
            v.is_completed ? completedSubtasksCount++ : null;
        })
    }

    $: subtasksEdittedValue = taskBeingViewed?.sub_tasks;


    const handleSubmit = async(e: { currentTarget: EventTarget & HTMLFormElement}) => {
        try{
            isUpdating = true;

            const formData = new FormData(e.currentTarget)

            const response = await fetch(e.currentTarget.action,{
                body: JSON.stringify({ task_id: taskBeingViewed?.id, position: parseInt(formData.get("status") as string), board_id: boardID, is_completed: taskIsCompleted, subtasks: subtasksEdittedValue }),
                method: "POST"
            }) 

            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message)
            }


            snackbarStore.set({
                show: true,
                mssg: "Task Updated Successfully"
            })
            
            await invalidateAll()
            dispatch("closeTaskViewModal",false)
        }
        catch(err: any | unknown){
            alertStore.set({
                mssg: err.message || "An error occured",
                severity: AlertSeverity.error,
                show: true
            })
        }

        finally {
            isUpdating = false;
        }
    }


    const handleClose = () => {
        dispatch("closeTaskViewModal",false)
        isUpdating = false;
    }
</script>

<OutClick onOutClick={handleClose}>
    <form  method="POST" action="?/updateTask"  on:submit|preventDefault={handleSubmit} class="{showTaskViewModal ? "block" : "hidden"} p-6 pt-3 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-md shadow-gray-600/80">
        <div class="flex flex-row-reverse justify-between items-center">
            <TaskActionDropdown />
            <Button type="button" on:click={handleClose} class="bg-transparent text-white text-xl hover:bg-transparent">
                <Icon icon="fa:close" />
            </Button>
        </div>
    
        <div class="mt-2 pt-3 border-t flex justify-between items-center">
            <h2 class="text-2xl font-semibold font-quicksand">{taskBeingViewed?.title}</h2>
            <TaskCompletedCheckbox bind:checked={taskIsCompleted} />
        </div>
        {#if taskBeingViewed?.description}
            <p class="block text-teal-300 font-sm">{taskBeingViewed?.description}</p>
        {/if}
        <div>
            {#if taskBeingViewed?.sub_tasks.length}
                <p class="font-medium mt-7 mb-3 text-sm">Substasks ({completedSubtasksCount}/{taskBeingViewed?.sub_tasks.length})</p>
                {#each subtasksEdittedValue as subtask, i (i)}
                    <div class="my-3 bg-cyan-950/90 p-3 rounded">
                        <SubtaskCheckbox 
                            id={subtask.id}
                            title={subtask.title}
                            is_completed={subtask.is_completed} 
                            on:setIsCompleted={(e) => {
                                subtasksEdittedValue = subtasksEdittedValue.map(v => v.id === subtask.id ? {...v, is_completed: e.detail} : v)
                            }}  
                        />
                    </div>
                {/each}
                {:else}
                <p class="font-medium mb-2 text-sm">No Substask</p>
            {/if}
        </div>
    
        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="status" class="font-medium">Current Status</Label>
            <select id="status" name="status" class="p-2 rounded mt-2">
                {#each board_columns as column, i (i)}
                    <option value={column.position} class="font-manrope font-medium text-sm">{column.name}</option>
                {/each}
            </select>
        </div>
    
        <div class="flex flex-col gap-3 mt-5">
            <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isUpdating}>Update Task</LoadingBtn>
        </div>
    </form>
</OutClick>