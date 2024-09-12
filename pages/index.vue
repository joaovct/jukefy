<script setup lang="ts">
import { authorization } from "~/services/authorization"

// const route = useRoute()

// definePageMeta({
//     layout: utils.isRouteRestrict(route.name) ? "restrict" : undefined
// })
</script>
<template>
    <button @click="authorization.requestUserAuthorization">login</button>
</template>