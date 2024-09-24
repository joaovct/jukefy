import { services } from "~/services"
import { store } from "~/store"

export default defineNuxtRouteMiddleware(async () => {
    const shouldRun = !store.user.value && utils.token.isAccessTokenStoredValid()

    if(shouldRun){
        const currentUserProfile = await services.users.getCurrentUserProfile()

        store.user.set(currentUserProfile)
    }
})