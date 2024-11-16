import { HttpHandler } from "msw"
import { services } from "~/services"
import { usersHandlers } from "./users"
import { authorizationHandler } from "./authorization"

type Services = typeof services

type Keys = keyof Services

type KeysOfUnion<T> = T extends T ? keyof T : never

// TODO: add refresh token
type Requests = Exclude<KeysOfUnion<Services[Keys]>, "baseURL" | "requestUserAuthorization">

type HandlersObject = {
    [K in Requests]: HttpHandler
}

const handlersObject: HandlersObject = {
    ...usersHandlers,
    ...authorizationHandler
}

export const handlers: HttpHandler[] = Object.values(handlersObject)