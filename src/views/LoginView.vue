
<script setup lang="ts">
import { authorization } from '@/services/authorization'
import { store } from '@/store/authorization'

console.log(store.codeVerifier.value)

</script>

<template>
  <div class="main">
    <button @click="authorization.authorize">login</button>
    <TestView/>
  </div>
</template>

<style scoped>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>