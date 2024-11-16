import { faker } from "@faker-js/faker"
import { store } from "~/store"

export const baseURL = "https://accounts.spotify.com"

function requestUserAuthorization() {
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

        store.authorization.codeVerifier.set(codeVerifier)

        const params: Authorization_code_PKCE["request_user_authorization"]["URLParams"] = {
            response_type: 'code',
            client_id: import.meta.env.VITE_CLIENT_ID,
            scope: import.meta.env.VITE_API_SCOPE,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        }

        if(import.meta.dev){
            const params: Authorization_code_PKCE["request_user_authorization"]["response"] = {
                code: faker.string.alphanumeric(256),
                state: ""
            }

            const query = new URLSearchParams(params).toString()

            return window.location.href = import.meta.env.VITE_REDIRECT_URI + "?" + query
        }

        authUrl.search = new URLSearchParams(params).toString()
        window.location.href = authUrl.toString()
    })
}

async function requestAccessToken(): Promise<AuthorizationCodePKCE["requestAccessToken"]["response"]> {
    const method: Authorization_code_PKCE["request_access_token"]["payload"]["method"] = "POST"
    const headers: Authorization_code_PKCE["request_access_token"]["payload"]["headers"] = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    const body: Authorization_code_PKCE["request_access_token"]["payload"]["body"] = {
        client_id: import.meta.env.VITE_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        code: store.authorization.code.value,
        code_verifier: store.authorization.codeVerifier.value,
        grant_type: 'authorization_code',
    }

    const req = await fetch(requestAccessToken.url, {
        method,
        headers,
        body: new URLSearchParams(body)
    })


    if (!req.ok) {
        const response: Authorization_code_PKCE["request_access_token"]["error_response"] = await req.json()
        throw new Error(`error: ${response.error}, description: ${response.error_description}`)
    }

    const response: Authorization_code_PKCE["request_access_token"]["response"] = await req.json()

    return camelize(response)
}

requestAccessToken.url = baseURL + "/api/token"

export const authorization = {
    requestUserAuthorization,
    requestAccessToken,
}

