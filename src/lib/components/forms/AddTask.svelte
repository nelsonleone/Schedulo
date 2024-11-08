<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { alertStore, snackbarStore, userBoardData } from "$lib/store";
	import { AlertSeverity } from "../../../enums";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";
	import Icon from "@iconify/svelte";
	import { Button } from "../ui/button";
	import { createEventDispatcher } from "svelte";
	import ErrorPara from "./ErrorPara.svelte";
	import LoadingBtn from "../Buttons/LoadingBtn.svelte";
	import DatePicker from "../DatePicker.svelte";
	import { addTaskSchema } from "$lib/schemas/add_task";
	import type { DateValue } from "@internationalized/date";


    interface RefinedFormError {
        title: string | null,
        subtasks: string | null,
        status: string | null,
        description: string | null
    }

    export let boardID : string;
    export let showAddTaskForm = false;

    $: board_columns = $userBoardData.find(v => v.id === boardID)?.board_columns || [];

    let isCreatingBoard = false;
    let errors : RefinedFormError = { title: null, subtasks: null, status: null, description: null }
    let subTasksEg = [
        "Buy new pencils",
        "start clean shading",
        "complete shading"
    ]

    let dueDate : DateValue;

    const dispatch = createEventDispatcher()

    async function handleSubmit(e: { currentTarget: EventTarget & HTMLFormElement}) {
        try{
            isCreatingBoard = true;
            const formData = new FormData(e.currentTarget)

            const { title, description, status, ...rest } = Object.fromEntries(formData.entries())

            const subTasksDataArr = Object.values(rest).filter(v => v !== "")

            const objData = {
                title,
                description,
                dueDate,
                status,
                subtasks: subTasksDataArr
            }

            const validationResult = addTaskSchema.safeParse(objData)

            if (!validationResult.success) {
                const fieldErrors = validationResult.error.flatten().fieldErrors;
                
                errors = {
                    title: fieldErrors?.title ? fieldErrors?.title[0] : null,
                    description: fieldErrors?.description ? fieldErrors?.description[0] : null,
                    subtasks: fieldErrors?.subtasks ? fieldErrors?.subtasks[0] : null,
                    status: fieldErrors?.status ? fieldErrors?.status[0] : null
                }
            }

            const response = await fetch(e.currentTarget.action,{
                body: JSON.stringify({ title, subtasks: subTasksDataArr, due_date: dueDate?.toString(), board_id: boardID, position: parseInt(status.toString()) }),
                method: "POST"
            }) 

            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message)
            }


            snackbarStore.set({
                show: true,
                mssg: "Task Added Successfully"
            })
            
            await invalidateAll()
            isCreatingBoard = false;
            dispatch("closeAddTaskForm",false)
        }
        catch(err: any | unknown){
            alertStore.set({
                mssg: err.message || "An error occured",
                severity: AlertSeverity.error,
                show: true
            })
        }

        finally {
            isCreatingBoard = false;
        }
    }


</script>

<form  method="POST" action="?/addTask"  on:submit|preventDefault={handleSubmit} class="{showAddTaskForm ? "block" : "hidden"} px-6 pt-10 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-lg shadow-gray-600/90">
    <Button type="button" on:click={() => dispatch("closeAddTaskForm",false)} class="bg-transparent absolute text-white text-xl top-4 right-3 hover:bg-transparent">
        <Icon icon="fa:close" />
    </Button>
    
    <h2 class="text-xl font-semibold font-quicksand mb-6">Add New Task</h2>
    
    <div class="flex w-full max-w-sm flex-col my-6">
        <Label for="title" class="font-medium">Title</Label>
        <Input type="text" name="title" id="title" placeholder="e.g Make a sketch" class="mt-3" />
        {#if errors.title}
            <ErrorPara>
                {errors.title}
            </ErrorPara>
        {/if}
    </div>
    
    <div class="flex w-full max-w-sm flex-col my-6">
        <Label for="description" class="font-medium">Description (optional)</Label>
        <Input type="text" name="description" id="description" placeholder="e.g I need to make a sketch of the structure" class="mt-3" />
        {#if errors.description}
            <ErrorPara>
                {errors.description}
            </ErrorPara>
        {/if}
    </div>
    
    <div>
        <p class="font-medium mb-2 text-sm">Substasks</p>
        {#each subTasksEg as val, index (index)}
            <div class="flex w-full items-center justify-between gap-3 my-3">
                <Input type="text" name="subtask-{index}" id="subtask-{index}" placeholder={val} class="flex-grow" />
                <button class="flex items-center justify-center p-1" on:click={() => subTasksEg = subTasksEg.filter((_,i) => i !== index)}>
                    <Icon icon="lsicon:close-small-outline" class="text-lg" />
                    <span class="sr-only">Remove Subtask</span>
                </button>
            </div>        
        {/each}
        <Button type="button" on:click={() => subTasksEg = [...subTasksEg,""]} class="text-base mx-auto mt-2 block font-manrope bg-gray-200 text-light_emerald font-semibold hover:bg-gray-200/90">+ Add New Subtask</Button>

        {#if errors.subtasks?.length}
            <ErrorPara>
                {errors.subtasks} (Check subtasks)
            </ErrorPara>
        {/if}
    </div>

    <div class="flex w-full max-w-sm flex-col my-6">
        <Label for="status" class="font-medium">Status</Label>
        <select id="status" name="status" class="p-2 rounded mt-2">
            {#each board_columns as column, i (i)}
                <option value={column.position} class="font-manrope font-medium text-sm">{column.name}</option>
            {/each}
        </select>
        {#if errors.status}
            <ErrorPara>
                {errors.status}
            </ErrorPara>
        {/if} 
    </div>
    <div class="flex w-full max-w-sm flex-col my-6">
        <Label for="status" class="font-medium my-2">Due Date (optional):</Label>
        <DatePicker on:setDate={(e) => dueDate = e.detail} value={dueDate} />
    </div>

    <div class="flex flex-col gap-3 mt-5">
        <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isCreatingBoard}>Add Task</LoadingBtn>
    </div>
</form>