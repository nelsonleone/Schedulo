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

    export let boardID;
    export let showAddTaskForm = false;

    let board_columns = $userBoardData.find(v => v.id === boardID)?.board_columns || [];

    let isCreatingBoard = false;
    let errors : { name: string | null, columns: string[] | null } = { name: null, columns: null }
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

            const { name, ...rest } = Object.fromEntries(formData.entries())

            const columnsDataArr = Object.values(rest).filter(v => v !== "")

            const objData = {
                name,
                columns: columnsDataArr
            }

            const validationResult = createBoardSchema.safeParse(objData)

            if (!validationResult.success) {
                const fieldErrors = validationResult.error.flatten().fieldErrors;
                
                errors = {
                    name: fieldErrors.name ? fieldErrors.name[0] : null,
                    columns : fieldErrors.columns ? fieldErrors.columns : null
                }
                return;
            }

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
            <Input type="text" name="name" id="title" placeholder="e.g Make a sketch" class="mt-3" />
            {#if errors.name}
                <ErrorPara>
                    {errors.name}
                </ErrorPara>
            {/if}
        </div>
        
        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="description" class="font-medium">Description</Label>
            <Input type="text" name="name" id="description" placeholder="e.g I need to make a sketch of the structure" class="mt-3" />
            {#if errors.name}
                <ErrorPara>
                    {errors.name}
                </ErrorPara>
            {/if}
        </div>
        
        <div>
            <p class="font-medium mb-2 text-sm">Substasks</p>
            {#each subTasksEg as val, index (index)}
                <div class="flex w-full items-center justify-between gap-3 my-3">
                    <Input type="text" name="subtask-{index}" id="subtask-{index}" placeholder={val} class="flex-grow" />
                    <button class="flex items-center justify-center p-1" on:click={() => subTasksEg = subTasksEg.filter((v,i) => i !== index)}>
                        <Icon icon="lsicon:close-small-outline" class="text-lg" />
                        <span class="sr-only">Remove Subtask</span>
                    </button>
                </div>        
            {/each}
            <Button type="button" on:click={() => subTasksEg = [...subTasksEg,""]} class="text-base font-manrope bg-gray-200 text-light_emerald font-semibold hover:bg-gray-200/90">+ Add New Subtask</Button>

            {#if errors.columns?.length}
                <ErrorPara>
                    {errors.columns[0]} (Check columns)
                </ErrorPara>
            {/if}
        </div>

        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="status" class="font-medium">Status</Label>
            <select id="status">
                {#each board_columns as column}
                    <option value={column.position}>{column.name}</option>
                {/each}
            </select>
            {#if errors.name}
                <ErrorPara>
                    {errors.name}
                </ErrorPara>
            {/if}
        </div>
    
        <div class="flex flex-col gap-3 mt-5">
            <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isCreatingBoard}>Create Board</LoadingBtn>
        </div>
    </form>
</OutClick>