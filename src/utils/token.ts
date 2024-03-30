import { authorization } from "@/store/authorization"
import { workers } from "@/workers"
import type { InputRefreshExpiratedToken, OutputRefreshExpiratedToken } from "@/workers/refreshToken"
import { services } from "@/services"
import type { Authorization_code_PKCE } from "@/types/types"

const worker = new workers.refreshToken() as Worker

function getUrlParams(): Authorization_code_PKCE["request_user_authorization"]["response"] {
    const urlParams = new URLSearchParams(window.location.search)

    if(urlParams.has('code')){
        return {
            code: urlParams.get('code') as string,
            state: urlParams.get('state') || undefined
        }
    }

    throw new Error(urlParams.get("error") || undefined)
}

interface SetTokenParameters {
    accessToken: string,
    refreshToken: string,
    expiresIn: number
}

function setToken({ accessToken, expiresIn, refreshToken }: SetTokenParameters) {
    authorization.accessToken.set(accessToken)
    authorization.refreshToken.set(refreshToken)
    authorization.expirationDate.set(expiresIn)

    return { refreshToken: authorization.refreshToken.value, expirationDate: authorization.expirationDate.value }
}

interface PostMessageParameters {
    refreshToken: string
    expirationDate: Date
}

function postMessage(params: PostMessageParameters) {
    worker.postMessage({ ...params } as InputRefreshExpiratedToken)
}

function onMessage(event: MessageEvent<OutputRefreshExpiratedToken>) {
    const data = event.data

    const refreshData = setToken({ ...data })
    postMessage({ refreshToken: refreshData.refreshToken, expirationDate: refreshData.expirationDate })
}

export function isAccessTokenStoredValid() {
    return authorization.expirationDate.value && new Date() < authorization.expirationDate.value
}

/**
 * 
 * @returns true or false on wheter the setup was successful or not.
 */
export async function getUserAuthorization() {
    const params = getUrlParams()
    const isTokenValid = (authorization.expirationDate.value && new Date() < authorization.expirationDate.value)

    if(!params.code && !isTokenValid)
        // no token stored in params neither a valid one in localStorage
        return false

    if (params.code && !isTokenValid) {
        authorization.code.set(params.code)
        
        try {
            const response = await services.authorization.requestAccessToken()
    
            setToken({ ...response })
            return true
        } catch (error) {
            // token invalid
            return false
        }
    }

    postMessage({ refreshToken: authorization.refreshToken.value, expirationDate: authorization.expirationDate.value })
    worker.onmessage = onMessage
    return true
}