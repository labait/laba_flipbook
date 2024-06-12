<script setup>
defineProps(['images'])
</script>

<template>
  <ul id="preload">
    <li v-for="image in images"><img :src="image" alt=""></li>
  </ul>
</template>

<style scoped>
#preload {
  display: none;
}
</style>