<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Button } from "./ui/button";
	import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger } from "./ui/dropdown-menu";
	import DropdownMenuSeparator from "./ui/dropdown-menu/dropdown-menu-separator.svelte";
	import DropdownMenuContent from "./ui/dropdown-menu/dropdown-menu-content.svelte";
	import DropdownMenuItem from "./ui/dropdown-menu/dropdown-menu-item.svelte";
	import { createEventDispatcher } from "svelte";
	import { invalidateAll } from "$app/navigation";
	import { alertStore, snackbarStore } from "$lib/store";
	import { AlertSeverity } from "../../enums";


    export let boardID : string;
    let processing = false;
    const dispatch = createEventDispatcher()


    const handleDeleteBoard = async () => {
        try{
            processing = true;
            snackbarStore.set({
                show: true,
                mssg: "Processing",
                loading: true
            })

            const response = await fetch("?/deleteBoard", {
                method: "POST",
                body: JSON.stringify({ board_id: boardID })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.message)
            }

            snackbarStore.update(() => ({
                loading: false, show: true, mssg: "Board Deleted Successfully"
            }))

            invalidateAll()
        } catch (err: any) {
            alertStore.set({
                mssg: err.message || "An error occurred",
                severity: AlertSeverity.error,
                show: true
            })

            snackbarStore.update(() => ({
                loading: false, show: false, mssg: ""
            }))
        } finally {
            processing = false;
        }
    }
</script>
    
<DropdownMenu>
    <DropdownMenuTrigger asChild let:builder>
     <Button builders={[builder]} variant="outline" class="text-2xl w-fit p-0 text-slate-700  dark:text-slate-300 bg-transparent border-none hover:bg-transparent">
        <Icon icon="charm:menu-kebab" />
     </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56 font-manrope font-medium text-base">
        <DropdownMenuGroup>
            <DropdownMenuItem disabled={processing} on:click={() => dispatch("openEditBoardForm",true)} class="flex open-edit-board-btn gap-2 items-center cursor-pointer">
                <Icon class="text-2xl" icon="line-md:edit-filled" />
                <span>Edit Board</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem on:click={handleDeleteBoard} disabled={processing} class="flex gap-2 items-center cursor-pointer text-red-600">
                <Icon class="text-2xl" icon="proicons:delete" />
                <span>Delete Board</span>
            </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
</DropdownMenu>