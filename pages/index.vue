<script setup lang="ts">
import { authorization } from "~/services/authorization"

</script>
<template>
    <button @click="authorization.requestUserAuthorization">login</button>
</template>