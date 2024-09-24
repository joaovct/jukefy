import { authorization } from '@/store/authorization'

const baseURL = import.meta.env.VITE_BASE_URL_API + "/me"

async function getCurrentUserProfile(): Promise<WebAPI["Users"]["getCurrentUserProfile"]["response"]> {
    const payload: Web_API["Player"]["get_playback_state"]["payload"] = {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            "Authorization": `Bearer ${authorization.accessToken.value}`
        }
    }

    const req = await fetch(baseURL, payload)

    if(req.status !== 200){
        const response: Web_API["Users"]["get_current_user_profile"]["error_response"] = await req.json()
        throw new Error(`error: ${response.error.status}, description: ${response.error.message}`)
    }

    const response: Web_API["Player"]["get_playback_state"]["response"] = await req.json()

    return camelize(response)
}

export const users = {
    baseURL,
    getCurrentUserProfile
}