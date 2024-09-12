export default defineNuxtRouteMiddleware(async (to, from) => {
    const isRouteRestrict = utils.isRouteRestrict(to.name)
    setPageLayout(isRouteRestrict ? "restrict" : undefined)

    if (!import.meta.client)
        return

    // auth restricted area
    if (isRouteRestrict) {
        const isAuthorizationSuccessful = await utils.token.getUserAuthorization()

        // redirects to unrestricted area if user's is not logged
        if (!isAuthorizationSuccessful) {
            return navigateTo("/")
        }
        // redirect to restricted area if logged users access a unrestricted area
    } else if (utils.token.isAccessTokenStoredValid()) {
        return navigateTo("/home")
    }else{
        localStorage.clear()
    }
})