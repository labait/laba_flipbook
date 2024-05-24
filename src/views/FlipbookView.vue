<script setup>
import Flipbook from 'flipbook-vue'
const pages = Array(10).fill().map((_, i) => `https://picsum.photos/500/800?v=${i}`)
console.log(pages)
</script>

<template>
  <flipbook 
    class="flipbook" 
    :pages="pages">
  </flipbook>
</template>

<style lang="scss">
.flipbook {
  // border: 1px solid black;
  width: 80vw;
  height: 800px;
}
</style>