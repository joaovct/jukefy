<script setup lang="ts">
import { authorization } from '@/store/authorization'
import { onMounted, ref } from 'vue'
import { workers } from '@/workers'
import { type InputRefreshExpiratedToken, type OutputRefreshExpiratedToken } from '@/workers/refreshToken'
import { services } from '@/services'
import router from '@/router'


onMounted(async () => {
    const worker = new workers.refreshToken() as Worker

    type ParseCodeParameters = { code?: string, error?: string }

    function parseCode(): ParseCodeParameters {
        const urlParams = new URLSearchParams(window.location.search)
        const params: ParseCodeParameters = {}

        if (urlParams.has('code'))
            params.code = urlParams.get('code') as string
        if (urlParams.has('error'))
            params.error = urlParams.get('error') as string

        return params
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

    function onMessage(event: MessageEvent<OutputRefreshExpiratedToken>){
        const data = event.data

        const refreshData = setToken({ ...data })
        postMessage({ refreshToken: refreshData.refreshToken, expirationDate: refreshData.expirationDate })
    }

    const params = parseCode()
    const isAccessTokenValid = (authorization.expirationDate.value && new Date() < authorization.expirationDate.value)

    if(!params.code && !isAccessTokenValid) {
        // apply this logic to all restricted areas
        return router.push("/")
    }
    
    if (params.code && !isAccessTokenValid) {
        authorization.code.set(params.code)
        const response = await services.authorization.getToken()
        setToken({ ...response })
    }

    postMessage({ refreshToken: authorization.refreshToken.value, expirationDate: authorization.expirationDate.value })
    worker.onmessage = onMessage
})
</script>

<template>
    <h1>{{ authorization.accessToken.value }}</h1>
</template>