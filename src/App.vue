<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="mb-2">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/flipbook">Flipbook</RouterLink>
  </nav>
  <main class=" flex flex-col items-center">
    <h1 class="text-3xl font-bold mb-2">
      Flipbook
    </h1>
    <RouterView />
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
