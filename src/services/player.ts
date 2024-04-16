import { authorization } from "@/store/authorization"
import type { WebAPI, Web_API } from "@/types/types"
import { camelize } from "@/utils/camelize"

const baseURL = import.meta.env.VITE_BASE_URL_API + "/me/player"

async function getPlaybackState(): Promise<WebAPI["Player"]["getPlaybackState"]["response"]>{
    const payload: Web_API["Player"]["get_playback_state"]["payload"] = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authorization.accessToken.value}`
        },
    }

    const req = await fetch(baseURL, payload)

    if(req.status !== 200){

        if(req.status === 204)
            throw new Error("Playback not available or active")

        const response: Web_API["Player"]["get_playback_state"]["error_response"] = await req.json()
        throw new Error(`error: ${response.status}, description: ${response.message}`)
    }

    const response: Web_API["Player"]["get_playback_state"]["response"] = await req.json()

    return camelize(response)
}

export const player = {
    baseURL,
    getPlaybackState,
}