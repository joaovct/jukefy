import { HttpHandler } from "msw"
import { services } from "~/services"
import { usersHandlers } from "./users"

type Services = typeof services

type Keys = keyof Services

type KeysOfUnion<T> = T extends T ? keyof T : never

type Requests = Exclude<KeysOfUnion<Services[Keys]>, "baseURL" | "requestAccessToken" | "requestUserAuthorization">

type HandlersObject = {
    [K in Requests]: HttpHandler
}

const handlersObject: HandlersObject = {
    ...usersHandlers
}

export const handlers: HttpHandler[] = Object.values(handlersObject)