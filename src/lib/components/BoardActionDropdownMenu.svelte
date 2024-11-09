<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Button } from "./ui/button";
	import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger } from "./ui/dropdown-menu";
	import DropdownMenuSeparator from "./ui/dropdown-menu/dropdown-menu-separator.svelte";
	import DropdownMenuContent from "./ui/dropdown-menu/dropdown-menu-content.svelte";
	import DropdownMenuItem from "./ui/dropdown-menu/dropdown-menu-item.svelte";
	import { createEventDispatcher } from "svelte";


    export let boardID : string;
    const dispatch = createEventDispatcher()
    
</script>
    
<DropdownMenu>
    <DropdownMenuTrigger asChild let:builder>
     <Button builders={[builder]} variant="outline" class="text-2xl w-fit p-0 text-slate-300 bg-transparent border-none hover:bg-transparent">
        <Icon icon="charm:menu-kebab" />
     </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56 font-manrope font-medium text-base">
        <DropdownMenuGroup>
            <DropdownMenuItem on:click={() => dispatch("openEditBoardForm",true)} class="flex gap-2 items-center cursor-pointer">
                <Icon class="text-2xl" icon="line-md:edit-filled" />
                <span>Edit Board</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="flex gap-2 items-center cursor-pointer text-red-600">
                <Icon class="text-2xl" icon="proicons:delete" />
                <span>Delete Board</span>
            </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
</DropdownMenu>