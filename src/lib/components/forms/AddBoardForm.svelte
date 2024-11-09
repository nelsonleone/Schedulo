<script lang="ts">
	import { createBoardSchema } from "$lib/schemas/create_board";
	import { alertStore, snackbarStore } from "$lib/store";
	import { AlertSeverity } from "../../../enums";
	import { Label } from "../ui/label";
	import { Input } from "../ui/input";
	import Icon from "@iconify/svelte";
	import { Button } from "../ui/button";
	import { createEventDispatcher } from "svelte";
	import ErrorPara from "./ErrorPara.svelte";
	import LoadingBtn from "../Buttons/LoadingBtn.svelte";
	import { invalidateAll } from "$app/navigation";
	import OutsideClick from "../OutsideClick.svelte";
    export let showAddBoardForm = false;

    let isCreatingBoard = false;
    let errors : { name: string | null, columns: string[] | null } = { name: null, columns: null }
    let numOfColumns = [
        "backlog",
        "in progress",
        "completed"
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

            invalidateAll()
            dispatch("closeAddBoardForm",false)
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
<OutsideClick on:outclick={() => dispatch("closeAddBoardForm",false)}>
    <form  method="POST" action="?/createBoard"  on:submit|preventDefault={handleSubmit} class="{showAddBoardForm ? "block" : "hidden"} px-6 fixed w-11/12 h-[24em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] rounded-md py-6 shadow-lg drop-shadow-md shadow-gray-600/80">
        <h2 class="text-xl font-semibold font-quicksand mb-6">Add New Board</h2>
        
        <div class="flex w-full max-w-sm flex-col my-6">
            <Label for="board-name" class="font-medium">Board Name</Label>
            <Input type="text" name="name" id="board-name" placeholder="product launch" class="mt-3" />
            {#if errors.name}
                <ErrorPara>
                    {errors.name}
                </ErrorPara>
            {/if}
        </div>
        
        <div>
            <p class="font-medium mb-2 text-sm">Columns</p>
            {#each numOfColumns as col, index (index)}
            <div class="flex w-full items-center justify-between gap-3 my-3">
                <Input type="text" name="column-{index}" id="column-{index}" placeholder={col} class="flex-grow" />
                <button class="flex items-center justify-center p-1" on:click={() => numOfColumns = numOfColumns.filter((v,i) => i !== index)}>
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
            <Button type="button" on:click={() => numOfColumns = [...numOfColumns,""]} class="text-base font-manrope bg-gray-200 text-light_emerald font-semibold hover:bg-gray-200/90">+ Add Column</Button>
            <LoadingBtn type="submit" styles="text-base font-manrope bg-light_emerald text-base_color1 font-semibold hover:bg-light_emerald/70" isLoading={isCreatingBoard}>Create Board</LoadingBtn>
        </div>
    </form>
</OutsideClick>
