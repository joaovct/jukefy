import { type getTokenParsedResponse, type getTokenResponse } from "@/services/authorization"

export type InputRefreshExpiratedToken = {
    refreshToken: string
    expirationDate: Date
}

export type OutputRefreshExpiratedToken = getTokenParsedResponse

onmessage = (ev: MessageEvent<InputRefreshExpiratedToken>) => {
    const { refreshToken, expirationDate } = ev.data

    if (!isNaN(expirationDate.getTime()))
        setTimeout(async () => {
            const response = await getRefreshedToken(refreshToken)
            postMessage(response as OutputRefreshExpiratedToken)
        }, expirationDate.getTime() - Date.now() /*- 60000*/)
}

// Cannot be placed along the service folder because this last one uses the store
async function getRefreshedToken(refreshToken: string): Promise<getTokenParsedResponse> {
    const payload = {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: import.meta.env.VITE_CLIENT_ID
        })
    }

    const body = await fetch("https://accounts.spotify.com/api/token", payload)
    const response: getTokenResponse = await body.json()

    return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        expiresIn: response.expires_in
    }
}