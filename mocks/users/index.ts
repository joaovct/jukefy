import type { HttpHandler } from "msw"
import type { services } from "~/services"
import { getCurrentUserProfile } from './getCurrentUserProfile'

type UsersHandler = OmitStrict<{
    [K in keyof typeof services["users"]]: HttpHandler
}, "baseURL">

export const usersHandlers: UsersHandler = {
    getCurrentUserProfile
}