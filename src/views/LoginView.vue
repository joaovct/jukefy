
<script setup lang="ts">
import { authorization } from '@/services/authorization'
</script>

<template>
  <div class="main">
    <button @click="authorization.authorize">login</button>
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