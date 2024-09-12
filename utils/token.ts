import { workers } from "~/workers"
import type { InputRefreshExpiratedToken, OutputRefreshExpiratedToken } from "~/workers/refreshToken"
import { services } from "~/services"
import { store } from "~/store"

const worker = (() => {
    if (import.meta.client)
        return new workers.refreshToken() as Worker
})()

function getUrlParams(): Authorization_code_PKCE["request_user_authorization"]["response"] {
    const urlParams = new URLSearchParams(window.location.search)

    return {
        code: urlParams.get('code') as string,
        state: urlParams.get('state') || undefined
    }
}

interface SetTokenParameters {
    accessToken: string,
    refreshToken: string,
    expiresIn: number
}

function setToken({ accessToken, expiresIn, refreshToken }: SetTokenParameters) {
    store.authorization.accessToken.set(accessToken)
    store.authorization.refreshToken.set(refreshToken)
    store.authorization.expirationDate.set(expiresIn)

    return { refreshToken: store.authorization.refreshToken.value, expirationDate: store.authorization.expirationDate.value }
}

interface PostMessageParameters {
    refreshToken: string
    expirationDate: Date
}

function postMessage(params: PostMessageParameters) {
    worker?.postMessage({ ...params } as InputRefreshExpiratedToken)
}

function onMessage(event: MessageEvent<OutputRefreshExpiratedToken>) {
    const data = event.data

    const refreshData = setToken({ ...data })
    postMessage({ refreshToken: refreshData.refreshToken, expirationDate: refreshData.expirationDate })
}

function isAccessTokenStoredValid() {
    return store.authorization.expirationDate.value && new Date() < store.authorization.expirationDate.value
}

/**
 * 
 * @returns true or false on wheter the setup was successful or not.
 */
async function getUserAuthorization() {
    const params = getUrlParams()
    const isTokenValid = (store.authorization.expirationDate.value && new Date() < store.authorization.expirationDate.value)

    if (!params?.code && !isTokenValid)
        // no token stored in params neither a valid one in localStorage
        return false

    if (params?.code && !isTokenValid) {
        store.authorization.code.set(params.code)

        try {
            const response = await services.authorization.requestAccessToken()

            setToken({ ...response })
            return true
        } catch (error) {
            // token invalid
            return false
        }
    }

    postMessage({ refreshToken: store.authorization.refreshToken.value, expirationDate: store.authorization.expirationDate.value })
    if (worker)
        worker.onmessage = onMessage
    return true
}

export const token = { isAccessTokenStoredValid, getUserAuthorization }