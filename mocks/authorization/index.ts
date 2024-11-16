import type { HttpHandler } from "msw"
import type { services } from "~/services"
import { requestAccessToken } from "./requestAccessToken"

type AuthorizationHandler = OmitStrict<{
    [K in keyof typeof services["authorization"]]: HttpHandler
}, "requestUserAuthorization">

export const authorizationHandler: AuthorizationHandler = {
    requestAccessToken
}