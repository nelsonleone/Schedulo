<script lang="ts">
	import { createBoardSchema } from "$lib/schemas/create_board";
    import { OutClick } from "svelte-outclick"
	import { alertStore, snackbarStore, userBoardData } from "$lib/store";
    import { z } from "zod";
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


    interface RefinedFormError {
        title: string | null,
        subtasks: string[] | null,
        status: string | null,
        description: string[] | null
    }

    export let boardID;
    export let showAddTaskForm = false;

    $: board_columns = $userBoardData.find(v => v.id === boardID)?.board_columns || [];

    let isCreatingBoard = false;
    let errors : RefinedFormError = { title: null, subtasks: null, status: null, description: null }
    let subTasksEg = [
        "Buy new pencils",
        "start clean shading",
        "complete shading"
    ]

    const dispatch = createEventDispatcher()

    async function handleSubmit(e: { currentTarget: EventTarget & HTMLFormElement}) {
        try{
            isCreatingBoard = true;
            const formData = new FormData(e.currentTarget)

            const { title, description, dueDate, ...rest } = Object.fromEntries(formData.entries())

            const subTasksDataArr = Object.values(rest).filter(v => v !== "")

            const objData = {
                title,
                description,
                dueDate,
                subtasks: subTasksDataArr
            }

            const validationResult = addTaskSchema.safeParse(objData)

            if (!validationResult.success) {
                const fieldErrors = validationResult.error.flatten().fieldErrors;
                
                console.log(fieldErrors)
                return;
            }
            return;

            const response = await fetch(e.currentTarget.action,{
                body: JSON.stringify(objData),
                method: "POST"
            }) 

            const data = await response.json()

            if(!response.ok){
                throw new Error(data.message)
            }


            snackbarStore.set({
                show: true,
                mssg: "Board Created Successfully"
            })

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

<OutClick onOutClick={() => dispatch("closeAddTaskForm",false)}>
    <form  method="POST" action="?/createBoard"  on:submit|preventDefault={handleSubmit} class="{showAddTaskForm ? "block" : "hidden"} px-6 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-md shadow-gray-600/80">
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
            <Button type="button" on:click={() => subTasksEg = [...subTasksEg,""]} class="text-base font-manrope bg-gray-200 text-light_emerald font-semibold hover:bg-gray-200/90">+ Add New Subtask</Button>

            {#if errors.subtasks?.length}
                <ErrorPara>
                    {errors.subtasks[0]} (Check columns)
                </ErrorPara>
            {/if}
        </div>

        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="status" class="font-medium">Status</Label>
            <select id="status" class="p-2 rounded my-2">
                {#each board_columns as column}
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
            <Label for="status" class="font-medium">Due Date (optional):</Label>
            <DatePicker />
        </div>
    
        <div class="flex flex-col gap-3 mt-5">
            <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isCreatingBoard}>Add Task</LoadingBtn>
        </div>
    </form>
</OutClick>