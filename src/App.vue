<script setup>
import  { ref,onMounted, watch } from 'vue'

import WebcamInput from './components/WebCamInput.vue'
import { useRouter, RouterLink } from 'vue-router'
const router = useRouter();
//router.push('/flipbook') // redirect to flipbook view

import { useGlobal } from './global.js'
const global = useGlobal()


</script>

<template>
  <nav v-if="false" class="mb-2">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/flipbook">Flipbook</RouterLink>
  </nav>
  <main class=" flex flex-col items-center">
    <RouterView />
  </main>
  <WebcamInput v-if="true"/>
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
