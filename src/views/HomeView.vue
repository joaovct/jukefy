<script setup lang="ts">
import { onMounted } from 'vue'
import { setupToken } from '@/utils/token'

onMounted(setupToken)
</script>

<template>
    <h1>Usuário: </h1>
    <h3>Tocando agora: </h3>
</template>