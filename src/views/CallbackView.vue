<script setup lang="ts">
import { authorization } from '@/store/authorization'
import { services } from '@/services'
import { onMounted } from 'vue'

type Params = { code?: string, error?: string }

function parseCode(): Params {
    const urlParams = new URLSearchParams(window.location.search)
    const params: Params = {}

    if (urlParams.has('code'))
        params.code = urlParams.get('code') as string
    if (urlParams.has('error'))
        params.error = urlParams.get('error') as string

    return params
}

onMounted(async () => {
    const params = parseCode()
    const isAccessTokenValid = (authorization.accessToken.expirationDate && new Date() < authorization.accessToken.expirationDate)

    if (params.code && !isAccessTokenValid) {
        authorization.code.set(params.code)
        const response = await services.authorization.getToken()
        authorization.accessToken.set(response.accessToken, response.expiresIn)
    }
})
</script>

<template>
    <h1>{{ authorization.accessToken.value }}</h1>
</template>