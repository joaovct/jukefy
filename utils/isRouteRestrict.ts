import type { RouteNamedMap } from "vue-router/auto-routes"

export function isRouteRestrict(name: keyof RouteNamedMap): boolean{
    switch (name) {
        case "index":
            return false
        case "home":
            return true
        default:
            const assertUnreachable: never = name
            throw new Error("Unknown new route: " + assertUnreachable)
    }
}