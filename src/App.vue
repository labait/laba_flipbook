<script setup>
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter();
router.push('/flipbook') // redirect to flipbook view

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
