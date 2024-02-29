<script setup lang="ts">
import { store } from '@/store/authorization'

console.log(store.codeVerifier.value)

type Params = { code?: string, error?: string }

function parseCode(search: string): Params {
    const urlParams = new URLSearchParams(window.location.search)
    const params: Params = {}

    if (urlParams.has('code'))
        params.code = urlParams.get('code') as string
    if (urlParams.has('error'))
        params.error = urlParams.get('error') as string

    return params
}

async function getToken(code: string): Promise<string> {
    const client_id = localStorage.getItem("client_id") || ""
    const redirect_uri = localStorage.getItem("redirect_uri") || ""
    const code_verifier = localStorage.getItem('code_verifier') || ""
    

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id,
            grant_type: 'authorization_code',
            code,
            redirect_uri,
            code_verifier
        }),
    }

    const body = await fetch("https://accounts.spotify.com/api/token", payload)
    const response = await body.json()

    // localStorage.setItem('accessToken', response.access_token)
    return response.access_token
}

const params = parseCode(window.location.search)

</script>

<template>
    <h1>oi</h1>
</template>