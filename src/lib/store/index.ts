import { browser } from "$app/environment";
import { writable } from "svelte/store";
import type { AlertSeverity } from "../../enums";
import type { User } from "@supabase/supabase-js";

interface SnackbarProps {
    show: boolean,
    mssg: string,
    loading?: boolean
}

interface AlertProps {
    show: boolean,
    mssg: string,
    severity: AlertSeverity | null
}

export const userBoardData = writable<Board[]>([])

export const activeBoardTab = writable<{ name: string, id: string } | null>(null)

export const mobileNavMode = writable<{ show: boolean }>({
    show: browser && window.innerWidth < 1024 ? false : true
})

export const authStateStore = writable<{ authenticated: boolean | null, userDetails: User | null }>({
    authenticated: null,
    userDetails: null
})

export const snackbarStore = writable<SnackbarProps>({
    show: false,
    mssg: ""
})


export const windowWidth = writable<{ isMobile: boolean | null}>({ isMobile: true})

export const alertStore = writable<AlertProps>({
    show: false,
    mssg: "",
    severity: null
})

export const showSnackbar = (message: string, isLoading: boolean = false) => {
    snackbarStore.set({ show: true, mssg: message, loading: isLoading })
}
  
export const hideSnackbar = () => {
    snackbarStore.update(state => ({ ...state, showSnackbar: false, loading: false }))
}

export const showAlert = (mssg: string, severity: AlertSeverity) => {
    alertStore.set({ show: true, mssg, severity })
}
  
export const hideAlert = () => {
    alertStore.set({ show: false, mssg: "", severity: null })
}