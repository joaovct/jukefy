export default defineNuxtRouteMiddleware(async (to) => {
    const isRouteRestrict = utils.isRouteRestrict(to.name)
    setPageLayout(isRouteRestrict ? "restrict" : false)

    if (!import.meta.client)
        return

    // auth restricted area
    if (isRouteRestrict) {
        const isAuthorizationSuccessful = await utils.token.getUserAuthorization()

        // redirects to unrestricted area if user's is not logged
        if (!isAuthorizationSuccessful) {
            // avoid rendering problems
            console.log('oh no')
            // return window.location.href = "/"
        }
        // redirect to restricted area if logged users access a unrestricted area
    } else if (utils.token.isAccessTokenStoredValid()) {
        return navigateTo("/home")
    }else{
        localStorage.clear()
    }
})