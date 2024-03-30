import { authorization } from "@/store/authorization"
import type { WebAPI, Web_API } from "@/types/types"

const baseURL = import.meta.env.VITE_BASE_URL_API + "/me/player"

async function getPlaybackState(): Promise<WebAPI["Player"]["getPlaybackState"]["response"]>{
    const payload: Web_API["Player"]["get_playback_state"]["payload"] = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authorization.accessToken.value}`
        },
    }

    const body = await fetch(baseURL, payload)

    // parse based on the response status
    // if(!body.ok){
    //     const response: ErrorResponse = await body.json()
    //     throw new Error(response.error)
    // }

    // type afterwards
    const response: any = await body.json()

    return response
}

export const player = {
    baseURL,
    getPlaybackState,
}