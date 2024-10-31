<script lang="ts">
    import BoardActionDropdownMenu from "$lib/components/BoardActionDropdownMenu.svelte";
    import ColorSwitcher from "$lib/components/ColorSwitcher.svelte";
	import AuthPanel from "$lib/components/layout-components/AuthPanel.svelte";
    import Logo from "$lib/components/layout-components/Logo.svelte";
    import { Button } from "$lib/components/ui/button";
	import { activeBoardTab, alertStore, authStateStore, userBoardData } from "$lib/store";
    import Icon from "@iconify/svelte";
    import { mode } from "mode-watcher";
    import { onDestroy } from "svelte";
	import { AlertSeverity } from "../enums.js";
	import AddBoardForm from "$lib/components/forms/AddBoardForm.svelte";
    import { assignColorsToColumns } from "$lib/helperFns/assignColumnColor"
	import { checkNumOfCompletedSubtasks } from "$lib/helperFns/checkNumOfCompletedSubtasks.js";
	import { browser } from "$app/environment";
	import AddTask from "$lib/components/forms/AddTask.svelte";


    export let form;
    export let data : { boards: Board[], error?: { status: number, message: string }};

    $: {
        if (data.boards){
            userBoardData.set(data.boards)
            activeBoardTab.set({
                name: data.boards[0].name,
                id: data.boards[0].id
            })
        }
        else{
            userBoardData.set([])
            activeBoardTab.set(null)
        }
    }

    $: boardDataToDisplay = $userBoardData.find(v => v.id === $activeBoardTab?.id)

    $: {
        if (boardDataToDisplay) {
            boardDataToDisplay.board_columns.sort((a, b) => a.position - b.position)
        }
    }


    let showAddBoardForm = false;
    let showAddTaskForm = false;
    let showMobileBox = false;
    let addTaskBoardID : string | null = null;
    let themeMode : any;

    const unsubscribe = mode.subscribe((val) => {
        themeMode = val;
    })

    const handleRefresh = () => {
        if (browser){
            window.location.reload()
        }
    }

    $: {
        if (form?.socialSignInErrorMessage){
            alertStore.set({
                mssg: form.socialSignInErrorMessage,
                severity: "error" as AlertSeverity,
                show: true
            })
        }
    }

    onDestroy(unsubscribe)
</script>



<header class="border-b border-b-gray-400 p-4 bg-teal-950 w-full h-20 flex items-center">
    {#if themeMode === "dark"}
        <Logo styles="w-40 block" logoType="wht" />
        {:else}
        <Logo styles="w-40 block" logoType="blk" />
    {/if}
</header>
<div class="min-h-screen">
    <main class="px-4 md:px-8 lg:px-16 pb-5 pt-5">
        <h1 class="sr-only">Task Manager Dashboard</h1>
        {#if !data.error && $activeBoardTab?.id && $activeBoardTab.name}
            <div class="flex justify-between items-center pb-5 z-10 border-b px-4 md:px-8 lg:px-16">
                <div class="flex gap-1 items-center">
                    <h2 class="font-semibold text-2xl capitalize font-quicksand text-slate-100 text-ellipsis overflow-hidden whitespace-nowrap">
                        <button on:click={() => showMobileBox = true}>{$activeBoardTab?.name}</button>
                    </h2>
                    <Icon icon="basil:caret-down-solid" aria-hidden="true" class="text-emerald-500 text-2xl" />
                </div>
                
                
                <div class="flex gap-6">            
                    <Button on:click={() => showAddTaskForm = true} class="text-center w-fit text-xl rounded-lg p-3 text-base_color1 bg-light_emerald hover:border hover:border-teal-600 hover:bg-transparent hover:text-light_emerald">
                        <Icon icon="ooui:add" />
                        <span class="hidden">Add New Task</span>
                    </Button>
    
                    <BoardActionDropdownMenu />
                </div>
            </div>
            {:else if !data.error && boardDataToDisplay}
            <div class="border-y p-4">
                <button on:click={() => showAddTaskForm = true} class="flex items-center gap-1 font-semibold underline">
                    <Icon icon="ooui:add" />
                    <span class="">Add New Task</span>
                </button>
            </div>
        {/if}
    
        {#if showMobileBox}
            <div class="fixed w-11/12 h-[26em] z-10 fade-up overflow-y-auto mx-auto left-0 right-0 top-24 bg-[#101321] text-slate-300 rounded-md pb-6 pt-10 pe-6 shadow-md drop-shadow-lg shadow-gray-500/60">
                <Logo logoType={$mode === "dark" ? "wht" : "blk"} styles="hidden" />
    
                {#if $authStateStore.authenticated}
                    <h3 class="font-semibold mx-6">All Boards ({$userBoardData.length})</h3>
    
                    <div class="my-7">
                        {#each $userBoardData as board, i (i)}
                        <button class="flex font-semibold gap-4 items-center p-3 my-2 w-full rounded-e bg-teal-800 hover:bg-slate-200 hover:text-teal-800 transition ease-in-out duration-200">
                            <Icon icon="tabler:table-column" class="text-2xl" />
                            <span>{board.name}</span>
                        </button>
                        {/each}
                        <Button class="font-semibold p-3 rounded-e mx-auto block my-4 text-center text-base_color1 h-fit bg-teal-600">
                            <span>+ Create New Board</span>
                        </Button>
                    </div>
                    {:else}
                    <AuthPanel formAction="?/login" />
                {/if}
    
                <ColorSwitcher />
                <Button class="hidden">
                    <Icon icon="ri:collapse-diagonal-line" />
                </Button>
                <button class="absolute top-4 right-7 text-2xl" on:click={() => showMobileBox = false}>
                    <Icon icon="fa:close" />
                </button>
            </div>
        {/if}
    </main>
    
    <div>
        <div class="horizontal-scroll-grid {data.boards ? "min-h-[20em]" : ""}">
            {#if $authStateStore.authenticated}
    
                {#if boardDataToDisplay && !data.error}
                  {#each boardDataToDisplay.board_columns as column, i (i)}
                    <div class="px-4">
                        <h2 class="text-sm font-semibold uppercase tracking-wide relative flex  items-center gap-2 justify-start">
                            <span 
                                aria-hidden="true"
                                class="w-4 aspect-square rounded-full block" 
                                style="background-color: {assignColorsToColumns(boardDataToDisplay.board_columns, column.id)}">
                            </span>
                            <span>{column.name}</span>
                        </h2>
                        <div class="grid grid-cols-1 gap-10 mt-7">
                            {#each boardDataToDisplay.tasks as task, i (i)}
                                {#if task.position === column.position}
                                    <button class="bg-[#2b2c37d3] text-left min-h-[5.5em] h-[5.5em] rounded-md p-4 flex flex-col justify-center">
                                        <h3 class="font-medium">{task.title}</h3>

                                        {#if task.sub_tasks?.length}
                                            <p class="text-slate-700 text-sm">{checkNumOfCompletedSubtasks(task.sub_tasks)}/{task.sub_tasks.length} subtasks</p>
                                        {:else}
                                            <p class="text-slate-400 mt-2 font-medium text-sm">No subtasks</p>
                                        {/if}
                                    </button>
                                {/if}

                            {/each}
                        </div>
                        {#if  !boardDataToDisplay.tasks.find(v => v.position === column.position) }
                            <button aria-hidden="true" class="bg-[#2b2c3765] w-full text-left h-full rounded-md p-4 flex flex-col justify-center">
                            </button>
                        {/if}
                    </div>
                  {/each}
                  <div class="w-full rounded-lg overflow-hidden me-4">
                    <button class="w-full block h-full bg-[#2b2c37] text-3xl font-medium font-quicksand">
                        + New Column
                    </button>
                  </div>
                {/if}
        
                {:else}
                <div class="flex justify-center items-center h-full">
                    <h2 role="alert" class="text-2xl font-quicksand underline font-semibold text-slate-400 text-center">
                        Please Log In
                    </h2>
                </div>
            {/if}
        </div>

        {#if data.error}
            <div class="flex flex-col justify-center items-center my-20">
                <p role="alert" class="font-medium text-center font-quicksand flex items-center justify-center gap-2">
                    <Icon icon="fluent:cloud-error-20-regular" class="text-4xl text-red-500" />
                    <span>Failed To Fetch Boards Data</span>
                </p>
                <Button type="button" on:click={handleRefresh} class="my-4 text-base font-medium">Try Again</Button>
            </div>
        {/if}
    
    
        {#if $authStateStore.authenticated && data.boards?.length === 0 && !data.error}
            <p role="alert" class="font-medium text-center font-quicksand my-20 flex items-center justify-center gap-2">
                <Icon icon="tdesign:task-visible" class="text-light_emerald text-4xl" />
                <span>You have no created boards</span>
            </p>              
        {/if}
    </div>
    
    <AddBoardForm {showAddBoardForm} on:closeAddBoardForm={e => showAddBoardForm = e.detail} />
    <AddTask boardID={addTaskBoardID}  {showAddTaskForm} on:closeAddTaskForm={e => showAddTaskForm = e.detail} />
</div>