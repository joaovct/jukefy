import { store } from "@/store/authorization"

const baseURL = "https://accounts.spotify.com"

function authorize() {
    const generateRandomString = (length: number) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const values = crypto.getRandomValues(new Uint8Array(length))
        return values.reduce((acc, x) => acc + possible[x % possible.length], "")
    }

    const sha256 = async (plain: string) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    const base64encode = (input: ArrayBuffer) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
    }

    const codeVerifier = generateRandomString(64)

    sha256(codeVerifier).then(hashed => {
        const codeChallenge = base64encode(hashed)
        const authUrl = new URL(baseURL + "/authorize")

        console.log(codeVerifier)

        store.codeVerifier.set(codeVerifier)

        const params = {
            response_type: 'code',
            client_id: import.meta.env.VITE_CLIENT_ID,
            scope: import.meta.env.VITE_API_SCOPE,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        }

        authUrl.search = new URLSearchParams(params).toString()
        window.location.href = authUrl.toString()
    })
}

export const authorization = {
    authorize,
}

