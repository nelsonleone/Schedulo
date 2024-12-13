<script lang="ts">
	import { createEventDispatcher } from "svelte";
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
	import Modal from "../Modal.svelte";
	import { formatDateString } from "$lib/helperFns/formatDateString";
	import { checkDueDate } from "$lib/helperFns/checkDueDate";


    const dispatch = createEventDispatcher()
    export let showTaskViewModal = false;
    export let taskBeingViewed : Task;
    export let boardID : string;
    let completedSubtasksCount = 0;
    let isUpdating = false;
    let position : number;
    let isDeleting = false;
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
            
            await  invalidateAll()
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


    const handleDeleteTask = async () => {
        try {
            isDeleting = true;

            snackbarStore.set({
                show: true,
                mssg: "Processing",
                loading: true
            })

            const response = await fetch("?/deleteTask", {
                method: "POST",
                body: JSON.stringify({ task_id: taskBeingViewed?.id })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message)
            }

            snackbarStore.update(() => ({
                loading: false, show: true, mssg: "Task Deleted Successfully"
            }))

            await  invalidateAll()
            dispatch("closeTaskViewModal", false)
        } catch (err: any) {
            alertStore.set({
                mssg: err.message || "An error occurred",
                severity: AlertSeverity.error,
                show: true
            })

            snackbarStore.update(() => ({
                loading: false, show: false, mssg: ""
            }));
        } finally {
            isDeleting = false;
        }
    }


    const handleClose = () => {
        dispatch("closeTaskViewModal",false)
        isUpdating = false;
    }
</script>


{#if showTaskViewModal}
    <Modal>
        <form  method="POST" action="?/updateTask"  on:submit|preventDefault={handleSubmit} class="px-6 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-white dark:bg-[#101321] rounded-md pb-6 shadow-lg drop-shadow-lg shadow-gray-800/60 md:w-[25em] md:h-[27em]">
            {#if taskBeingViewed?.due_date && !taskBeingViewed?.is_completed}
                {#if checkDueDate(taskBeingViewed?.due_date).is_due}
                    <div>
                        <Icon icon="noto-v1:hourglass-done" />
                        <span class="text-sm text-red-500 font-medium block mb-6 mt-3">{checkDueDate(taskBeingViewed?.due_date).message}</span>
                    </div>

                    {:else}
                    <div class="flex gap-2 items-center mb-6 mt-3">
                        <span class="text-sm text-orange-500 font-medium block">Due On {formatDateString(taskBeingViewed?.due_date)}</span>
                        <Icon icon="twemoji:hourglass-done" class="text-2xl" />
                    </div>
                {/if}
            {/if}
            
            <div class="flex flex-row-reverse justify-between items-center">
                <TaskActionDropdown on:delete={handleDeleteTask} />
                <Button type="button" on:click={handleClose} class="bg-transparent text-base_color2 dark:text-base_color1 text-xl hover:bg-transparent">
                    <Icon icon="fa:close" />
                </Button>
            </div>
    
            <div class="mt-2 pt-3 border-t flex justify-between items-center">
                <h2 class="text-2xl font-semibold font-quicksand">{taskBeingViewed?.title}</h2>
                <TaskCompletedCheckbox bind:checked={taskIsCompleted} />
            </div>
            {#if taskBeingViewed?.description}
                <p class="block text-teal-700 dark:text-teal-500 mt-2 font-sm">{taskBeingViewed?.description}</p>
            {/if}
            <div class="mt-7">
                {#if taskBeingViewed?.sub_tasks.length}
                    <p class="font-medium mb-3 text-sm">Substasks ({completedSubtasksCount}/{taskBeingViewed?.sub_tasks.length})</p>
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
                <LoadingBtn type={isDeleting ? "button" : "submit"} styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isUpdating}>Update Task</LoadingBtn>
            </div>
        </form>
    </Modal>
{/if}
