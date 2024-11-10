<script lang="ts">
    import BoardActionDropdownMenu from "$lib/components/BoardActionDropdownMenu.svelte";
    import ColorSwitcher from "$lib/components/ColorSwitcher.svelte";
	import AuthPanel from "$lib/components/layout-components/AuthPanel.svelte";
    import Logo from "$lib/components/layout-components/Logo.svelte";
    import { Button } from "$lib/components/ui/button";
	import { alertStore, authStateStore, userBoardData, windowWidth } from "$lib/store";
    import Icon from "@iconify/svelte";
    import { mode } from "mode-watcher";
    import { onDestroy, onMount } from "svelte";
	import { AlertSeverity } from "../enums.js";
	import AddBoardForm from "$lib/components/forms/AddBoardForm.svelte";
    import { assignColorsToColumns } from "$lib/helperFns/assignColumnColor"
	import { checkNumOfCompletedSubtasks } from "$lib/helperFns/checkNumOfCompletedSubtasks.js";
	import { browser } from "$app/environment";
	import AddTask from "$lib/components/forms/AddTask.svelte";
	import TaskViewAndUpdateForm from "$lib/components/forms/TaskViewAndUpdateForm.svelte";
	import EditBoardForm from "$lib/components/forms/EditBoardForm.svelte";
	import MobileBox from "$lib/components/MobileBox.svelte";


    export let form;
    export let data : { boards: Board[], error?: { status: number, message: string }}
    $: boardDataToDisplay = $userBoardData[0]
    
    $: {
        if (data.boards){
            userBoardData.set(data.boards)
            boardDataToDisplay = data.boards[0]
        }
        else{
            userBoardData.set([])
        }
    }

    $: {
        if (boardDataToDisplay) {
            boardDataToDisplay.board_columns.sort((a, b) => a.position - b.position)
        }
    }


    let showAddBoardForm = false;
    let showAddTaskForm = false;
    let showMobileBox = false;
    let themeMode : any;
    let taskBeingViewed : Task;
    let showTaskViewModal = false;
    let showEditBoardForm = false;

    
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

    
    const handleResize = () => {
        if(browser){
            windowWidth.set({ isMobile: window.innerWidth < 1024 ? true : false})
            if (!showMobileBox && !$windowWidth.isMobile){
                showMobileBox = true;
            }
            else if (showMobileBox && $windowWidth.isMobile){
                showMobileBox = false;
            }
        }
    }
    handleResize()


    $: {
        console.log($windowWidth.isMobile)
    }
    

    onMount(() => {
        window.addEventListener('resize',handleResize)

        return () => window.removeEventListener('resize',handleResize)
    })

    onDestroy(unsubscribe)
</script>


<main class="lg:flex">
    <div class="z-10 {!showMobileBox && !$windowWidth.isMobile ? "lg:animate-mobileBox" : showMobileBox && $windowWidth.isMobile  ? "block" : !showMobileBox && $windowWidth.isMobile ? "hidden" : ""} fade-up lg:w-[24%] xl:w-[22%] relative">
        <div class="p-10 z-20 relative hidden lg:block">
            {#if themeMode === "light" && !$windowWidth.isMobile}
                <Logo styles="w-40 md:w-52 block" logoType="blk" />

                {:else if themeMode === "dark" && !$windowWidth.isMobile}
                <Logo styles="w-40 md:w-52 block" logoType="wht" />

                {:else if themeMode === "light" && $windowWidth.isMobile}
                <Logo styles="w-40 md:w-52 block" logoType="wht" />

                {:else if themeMode === "dark" && $windowWidth.isMobile}
                <Logo styles="w-40 md:w-52 block" logoType="wht" />
            {/if}
        </div>
        <MobileBox {showMobileBox} on:closeMobileBox={(e) => showMobileBox = e.detail} on:setBoardToDisplay={((e) => boardDataToDisplay = e.detail)} on:showAddBoardForm={(e) => showAddBoardForm = e.detail} />
    </div>

    <div class="{showMobileBox ? 'lg:w-[76%] xl:w-[78%]' : 'w-full'} bg-[#f4f7fde9] dark:bg-[#20212c]">
        <header class="border-b border-b-gray-400 p-4 bg-teal-950 w-full h-20 flex items-center lg:h-32 lg:hidden">
            {#if themeMode === "light" && !$windowWidth.isMobile}
                <Logo styles="w-40 lg:w-52 block" logoType="blk" />

                {:else if themeMode === "dark" && !$windowWidth.isMobile}
                <Logo styles="w-40 lg:w-52 block" logoType="wht" />

                {:else if themeMode === "light" && $windowWidth.isMobile}
                <Logo styles="w-40 lg:w-52 block" logoType="wht" />

                {:else if themeMode === "dark" && $windowWidth.isMobile}
                <Logo styles="w-40 lg:w-52 block" logoType="wht" />
            {/if}
        </header> 
        <div class="min-h-screen lg:h-screen lg:min-h-[unset] lg:overflow-y-hidden pb-4">
            <div class="px-4 pb-5 pt-5 lg:py-0 lg:px-0 lg:bg-white dark:bg-teal-950 lg:ps-10">
                <h1 class="sr-only">Task Manager Dashboard</h1>
                {#if !data.error && boardDataToDisplay?.id && boardDataToDisplay.name}
                    <div class="flex justify-between items-center pb-5 z-10 border-b px-4 lg:py-10 lg:ps-0 lg:pe-10">
                        <div class="flex gap-1 items-center w-[75%]">
                            <h2 
                                class="font-semibold text-2xl max-w-full block text-ellipsis capitalize font-quicksand text-slate-900 dark:text-slate-100 overflow-hidden whitespace-nowrap"
                            >
                                <button on:click|stopPropagation={() => showMobileBox = true} class="w-full text-left">
                                {boardDataToDisplay?.name}
                                </button>
                            </h2>
                        
                            <Icon icon="basil:caret-down-solid" aria-hidden="true" class="text-emerald-500 text-2xl" />
                        </div>
                        
                        
                        <div class="flex gap-6">            
                            <Button on:click={() => showAddTaskForm = true} class="text-center open-add-task-btn w-fit text-xl rounded-lg p-3 text-base_color1 bg-light_emerald hover:border hover:border-teal-600 hover:bg-transparent hover:text-light_emerald">
                                <Icon icon="ooui:add" />
                                <span class="hidden">Add New Task</span>
                            </Button>
            
                            <BoardActionDropdownMenu boardID={boardDataToDisplay?.id || ""} on:openEditBoardForm={(e) => showEditBoardForm = e.detail} />
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
            </div>
            
            <div class="md:px-3">
                <div class="horizontal-scroll-grid lg:h-screen lg:overflow-y-auto">
                    {#if $authStateStore.authenticated}
            
                        {#if boardDataToDisplay && !data.error}
                        {#each boardDataToDisplay.board_columns as column, i (i)}
                            <div class="px-4 lg:py-7">
                                <h2 class="text-sm font-semibold uppercase tracking-wide relative flex  items-center gap-2 justify-start">
                                    <span 
                                        aria-hidden="true"
                                        class="w-4 aspect-square rounded-full block" 
                                        style="background-color: {assignColorsToColumns(boardDataToDisplay.board_columns, column.id)}">
                                    </span>
                                    <span>{column.name} ({boardDataToDisplay.tasks.filter(task => task.position === column.position).length})</span>
                                </h2>
                                <div class="grid grid-cols-1 gap-10 mt-7">
                                    {#each boardDataToDisplay.tasks as task, i (i)}
                                        {#if task.position === column.position}
                                            <button on:click={() => {
                                                taskBeingViewed = task;
                                                showTaskViewModal = true;
                                            }} class="drop-shadow-xl bg-white dark:bg-[#2b2c37d3] font-quicksand text-left min-h-[5.5em] h-[5.5em] rounded-md p-4 flex flex-col justify-center">
                                                <h3 class="font-semibold">{task.title}</h3>
        
                                                {#if task.sub_tasks?.length}
                                                    <p class="text-slate-600 dark:text-slate-400 mt-2 font-semibold text-sm">{checkNumOfCompletedSubtasks(task.sub_tasks)} of {task.sub_tasks.length} subtasks</p>
                                                {:else}
                                                    <p class="text-slate-600 dark:text-slate-400 mt-2 font-semibold text-sm">No subtasks</p>
                                                {/if}
                                            </button>
                                        {/if}
        
                                    {/each}
                                </div>
                                {#if  !boardDataToDisplay.tasks.find(v => v.position === column.position) }
                                    <button aria-hidden="true" class="bg-blue-100/60 dark:bg-[#2b2c3765] w-full text-left h-1/2 rounded-md p-4 flex flex-col justify-center">
                                    </button>
                                {/if}
                            </div>
                        {/each}
                        <div class="w-full rounded-lg overflow-hidden me-4">
                            <button on:click={() => showEditBoardForm = true} class="w-full block h-2/3 {themeMode === "dark" ? "dark:bg-add-column-dark" : "bg-add-column-light"}  text-3xl font-semibold font-quicksand md:mt-20">
                                + New Column
                            </button>
                        </div>
                        {/if}
                
                        {:else}
                        <div class="flex justify-center flex-col items-center mt-20">
                            <h2 role="alert" class="text-2xl font-quicksand underline font-semibold text-slate-400 text-center">
                                Please Log In
                            </h2>
        
                            <AuthPanel formAction="?/login" />
                        </div>
                    {/if}
                </div>
        
                {#if data.error && $authStateStore.authenticated}
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
            

            {#if showEditBoardForm}
                <EditBoardForm on:closeEditBoardForm={(e) => showEditBoardForm = e.detail} {showEditBoardForm} boardBeingEditted={boardDataToDisplay!} />
            {/if}
            {#if showTaskViewModal}
                <TaskViewAndUpdateForm boardID={boardDataToDisplay?.id} {taskBeingViewed} {showTaskViewModal} on:closeTaskViewModal={(e) => showTaskViewModal = e.detail} />
            {/if}
                <AddBoardForm {showAddBoardForm} on:closeAddBoardForm={e => {
                    showAddBoardForm = e.detail
                    showMobileBox = false
            }} />
            <AddTask boardID={boardDataToDisplay?.id}  {showAddTaskForm} on:closeAddTaskForm={e => showAddTaskForm = e.detail} />
        </div>
    </div>


    {#if !showMobileBox}
        <button id="mobile-box-btn" aria-controls="mobile-box" aria-expanded="{showMobileBox ? "true" : "false"}" on:click={() => showMobileBox = true} class="text-5xl hidden lg:flex bg-teal-800 drop-shadow-lg shadow-md rounded-e-full p-3 pe-1 justify-center absolute items-center aspect-square w-10 left-0 bottom-20 text-gray-100 z-10 hover:bg-teal-600">
            <Icon icon="mdi:arrow-collapse-left" />
            <span class="sr-only">Show Sidebar</span>
        </button>
    {/if}
</main>