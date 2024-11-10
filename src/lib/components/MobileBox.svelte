<script lang="ts">
	import { mode } from "mode-watcher";
	import Logo from "./layout-components/Logo.svelte";
	import { authStateStore, userBoardData, windowWidth } from "$lib/store";
	import Icon from "@iconify/svelte";
	import Button from "./ui/button/button.svelte";
	import ColorSwitcher from "./ColorSwitcher.svelte";
	import { createEventDispatcher, onMount } from "svelte";
	import { OutsideClick } from "./OutsideClick";

    export let showMobileBox : boolean;

    const dispatch = createEventDispatcher()

    const handleOutSideClick = (e: MouseEvent) => OutsideClick(e,"mobile-box",$windowWidth.isMobile ? showMobileBox : false,dispatch,"closeMobileBox")

    onMount(() => {
        window.addEventListener('click',handleOutSideClick)

        return () => window.removeEventListener("click",handleOutSideClick)
    })
</script>



<div id="mobile-box" aria-controls="mobile-box-btn" class="fixed max-w-[90%] w-[27em] h-[26em] mobile-box overflow-y-auto mx-auto left-0 right-0 top-24 bg-white dark:bg-[#101321] text-slate-800 dark:text-slate-300 rounded-md pb-6 pt-10 pe-6 shadow-sm dark:drop-shadow-lg dark:shadow-gray-500/60 lg:left-0 lg:mx-0 lg:top-0 lg:pt-40 mb-32 lg:h-screen lg:max-w-full lg:pe-10 lg:w-full lg:absolute">
    <Logo logoType={$mode === "dark" ? "wht" : "blk"} styles="hidden" />

    {#if $authStateStore.authenticated}
        <h3 class="font-semibold mx-6">All Boards ({$userBoardData.length})</h3>

        <div class="my-7">
            {#each $userBoardData as board, i (i)}
            <button on:click={(e) => {
                dispatch("setBoardToDisplay",board)
                dispatch("closeMobileBox",false)
            }} class="flex font-semibold gap-4 items-center p-3 my-2 w-full rounded-e text-white bg-teal-800 hover:bg-slate-200 hover:text-teal-800 transition ease-in-out duration-200">
                <Icon icon="tabler:table-column" class="text-2xl" />
                <span>{board.name}</span>
            </button>
            {/each}
            <Button on:click={() => dispatch("showAddBoardForm",true)} class="font-semibold p-3 rounded-e mx-auto block my-4 text-center text-base_color1 h-fit bg-teal-600 hover:bg-teal-500">
                <span>+ Create New Board</span>
            </Button>
        </div>
    {/if}

    <ColorSwitcher />
    <button id="mobile-box-btn" aria-controls="mobile-box" aria-expanded="{showMobileBox ? "true" : "false"}" on:click={() => dispatch("closeMobileBox",false)} class="text-5xl hidden lg:flex bg-teal-800 drop-shadow-lg shadow-md rounded-s-full p-3 pe-1 justify-center absolute items-center aspect-square w-10 my-auto right-0 top-40 bottom-0 text-gray-100 z-10 hover:bg-teal-600">
        <Icon icon="mdi:arrow-collapse-left" />
    </button>
</div>