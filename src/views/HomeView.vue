<script setup lang="ts">
import { services } from '@/services'
import { onMounted } from 'vue'

onMounted(async () => {
    try {
        const res = await services.player.getPlaybackState()        
    } catch (error) {
        console.log('message received: ' + error)
    }
})

</script>

<template>
    <h1>User: </h1>
    <h3>Playing now: </h3>
</template>