<script lang="ts">
	import { OutClick } from "svelte-outclick";
	import Label from "../ui/label/label.svelte";
	import Input from "../ui/input/input.svelte";
	import { createEventDispatcher } from "svelte";
	import { createBoardSchema } from "$lib/schemas/create_board";
	import { alertStore, snackbarStore } from "$lib/store";
	import { AlertSeverity } from "../../../enums";
	import ErrorPara from "./ErrorPara.svelte";
	import Button from "../ui/button/button.svelte";
	import LoadingBtn from "../Buttons/LoadingBtn.svelte";
	import Icon from "@iconify/svelte";

    export let boardBeingEditted : Board;
    export let showEditBoardForm : boolean;

    
    let isEditting = false;
    let errors : { name: string | null, columns: string[] | null } = { name: null, columns: null }
    
    $: edittedBoardColumns = boardBeingEditted.board_columns.map(v => ({ name: v.name, position: v.position, id: v.id }))

    const dispatch = createEventDispatcher()

    async function handleSubmit(e: { currentTarget: EventTarget & HTMLFormElement}) {
        try{
            isEditting = true;
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
                mssg: "Board Editted Successfully"
            })

            dispatch("closeEditBoardForm",false)
        }
        catch(err: any | unknown){
            alertStore.set({
                mssg: err.message || "An error occured",
                severity: AlertSeverity.error,
                show: true
            })
        }

        finally {
            isEditting = false;
        }
    }
</script>

<OutClick onOutClick={() => dispatch("closeEditBoardForm",false)}>
    <form  method="POST" action="?/editBoard"  on:submit|preventDefault={handleSubmit} class="{showEditBoardForm ? "block" : "hidden"} px-6 pt-10 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-lg shadow-gray-600/90">
        
        <h2 class="text-xl font-semibold font-quicksand mb-6">Edit Board</h2>
        
        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="name" class="font-medium">Board Name</Label>
            <Input type="text" name="name" id="board-name" placeholder="product launch" class="mt-3" />
            {#if errors?.name}
                <ErrorPara>
                    {errors?.name}
                </ErrorPara>
            {/if}
        </div>
        
        <div>
            <p class="font-medium mb-2 text-sm">Columns</p>
            {#each edittedBoardColumns as col, index (index)}
            <div class="flex w-full items-center justify-between gap-3 my-3">
                <Input type="text" name="column-{index}" id="column-{index}" placeholder={col.name} class="flex-grow" />
                <button class="flex items-center justify-center p-1" on:click={() => edittedBoardColumns = edittedBoardColumns.filter((v,i) => i !== index)}>
                    <Icon icon="lsicon:close-small-outline" class="text-lg" />
                    <span class="sr-only">Remove Column</span>
                </button>
            </div>        
            {/each}

            {#if errors.columns?.length}
                <ErrorPara>
                    {errors.columns[0]} (Check columns)
                </ErrorPara>
            {/if}
        </div>
    
        <div class="flex flex-col gap-3 mt-5">
            <Button type="button" on:click={() => edittedBoardColumns = [...edittedBoardColumns,{ name: "", id: "", position: edittedBoardColumns[edittedBoardColumns.length - 1].position }]} class="text-base font-manrope bg-gray-200 text-light_emerald font-semibold hover:bg-gray-200/90">+ Add Column</Button>
            <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isEditting}>Create Board</LoadingBtn>
        </div>
    </form>
</OutClick> 