import type { EventDispatcher } from "svelte";

export function OutsideClick(e: MouseEvent, className: string, isOpen: boolean, dispatch: EventDispatcher<any>,dispatchEventName: string) {
    if (e.target && !(e.target as HTMLElement).closest(`.${className}`) && isOpen && !(e.target as HTMLElement).closest(`.open-edit-board-btn`) && !(e.target as HTMLElement).closest(`.open-add-task-btn`) ) {
        console.log("out")
        dispatch(dispatchEventName,false)
    }
}