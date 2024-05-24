<script setup>
import { useRoute,RouterLink } from 'vue-router'
const route = useRoute()

import WebcamInput from './components/WebCamInput.vue'
</script>

<template>
  <nav class="mb-2">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/flipbook">Flipbook</RouterLink>
  </nav>
  <main class=" flex flex-col items-center">
    <p>
      <strong>Current route path:</strong> {{ $route.fullPath }}
    </p>
    <h1 class="text-3xl font-bold mb-2">
      Flipbook
    </h1>
    <RouterView />
    <WebcamInput />
  </main>
</template>

<style scoped>
main {

}

nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
