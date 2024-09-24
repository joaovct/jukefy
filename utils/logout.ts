import { store } from "~/store"

export function logout(){
    localStorage.clear()
    store.user.set(undefined)
    window.location.href = "/"
}