<script lang="ts">
	import Label from "../ui/label/label.svelte";
	import Input from "../ui/input/input.svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { createBoardSchema } from "$lib/schemas/create_board";
	import { alertStore, snackbarStore } from "$lib/store";
	import { AlertSeverity } from "../../../enums";
	import ErrorPara from "./ErrorPara.svelte";
	import Button from "../ui/button/button.svelte";
	import LoadingBtn from "../Buttons/LoadingBtn.svelte";
	import Icon from "@iconify/svelte";
	import { invalidateAll } from "$app/navigation";
	import { OutsideClick } from "../OutsideClick";
	import Modal from "../Modal.svelte";

    export let boardBeingEditted : Board;
    export let showEditBoardForm : boolean;
    
    let isEditting = false;
    let errors : { name: string | null, columns: string[] | null } = { name: null, columns: null }
    
    let edittedBoardColumns = boardBeingEditted?.board_columns.map(v => ({ name: v.name, position: v.position, id: v.id }))

    $: {
        console.log(edittedBoardColumns)
    }
    
    const dispatch = createEventDispatcher()

    const handleOutSideClick = (e: MouseEvent) => OutsideClick(e,"edit-board-form",isEditting ? false : showEditBoardForm,dispatch,"closeEditBoardForm")

    onMount(() => {
        window.addEventListener('click',handleOutSideClick)

        return () => window.removeEventListener("click",handleOutSideClick)
    })

    async function handleSubmit(e: { currentTarget: EventTarget & HTMLFormElement}) {
        try{
            isEditting = true;
            const formData = new FormData(e.currentTarget)
            const columnsArrWithJustNames = edittedBoardColumns.map(v => v.name)

            const objData = {
                name: formData.get("name"),
                columns: columnsArrWithJustNames
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
                body: JSON.stringify({ name: objData.name, columns: edittedBoardColumns, board_id: boardBeingEditted?.id }),
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

            await invalidateAll()
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



{#if showEditBoardForm}
    <Modal>
        <form  method="POST" action="?/editBoard"  on:submit|preventDefault={handleSubmit} class="edit-board-form px-6 pt-10 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-white dark:bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-lg shadow-gray-600/90 lg:w-[25em] lg:h-[27em]">
            
            <h2 class="text-xl font-semibold font-quicksand mb-6">Edit Board</h2>
            
            <div class="flex w-full max-w-sm flex-col my-6">
                <Label for="name" class="font-medium">Board Name</Label>
                <Input type="text" name="name" id="board-name" value={boardBeingEditted?.name} placeholder="product launch" class="mt-3" />
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
                    <Input 
                        type="text" 
                        name="column-{index}" 
                        value={col.name} 
                        id="column-{index}" 
                        on:change={(e) => edittedBoardColumns = edittedBoardColumns.map(((v,i) => i === index ? {...v, name: e.currentTarget.value } : v))}
                        placeholder={col.name} 
                        class="flex-grow" 
                    />
                    <button class="flex items-center justify-center p-1" on:click|stopPropagation={() => edittedBoardColumns = edittedBoardColumns.filter((v,i) => i !== index)}>
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
                <Button type="button" on:click={() => edittedBoardColumns = [...edittedBoardColumns,{ name: "", id: "", position: edittedBoardColumns.length }]} class="text-base font-manrope bg-gray-200 text-light_emerald font-semibold hover:bg-gray-200/90">+ Add Column</Button>
                <LoadingBtn type="submit" styles="text-base drop-shadow-md  font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isEditting}>Edit Board</LoadingBtn>
            </div>
        </form>
    </Modal>
{/if}
