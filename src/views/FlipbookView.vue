<script setup>
import {ref, onMounted, watch} from 'vue'
import {useRoute, useRouter, RouterLink} from 'vue-router'
const route = useRoute()
const router = useRouter()

import PreloadImages from '../components/PreloadImages.vue'
import Flipbook from 'flipbook-vue'

const contents = ref([])
const content = ref({})
const fb=ref(null);

import {useGlobal} from '../global.js'
const global = useGlobal()
watch(global.currentGesture, (newGesture, oldGesture) => {
  console.log('gesture', newGesture.name, "at", newGesture.timestamp)
  switch (newGesture.name) {
    case 'right':
      fb.value.flipRight()
      break;
    case 'left':
      fb.value.flipLeft()
      break; 
    case 'back':
      router.push({name: 'home'})
      break; 
    default:
      break;
  }
})

onMounted(async () => {
  contents.value = await global.loadContents()
  // get folder param from url
  const folder = route.params.folder
  content.value = contents.value.find(content => content.folder === folder)
  //pages.value = Array(10).fill().map((_, i) => `https://picsum.photos/500/800?v=${i}`)
})

</script>



<template>

  <PreloadImages v-if="content.pages" :images="content.pages.map(page => page.image)" />
  <h1 class="text-center text-3xl mb-4">{{ content.folder }}</h1>
  <flipbook 
    ref="fb"
    v-if="content.pages"
    class="flipbook mb-4" 
    :pages="content.pages.map(page => page.image)"
  >
  </flipbook>
  <RouterLink class="title" :to="{name: 'home'}">back home</RouterLink>

</template>

<style lang="scss" scoped>

.flipbook {
  // border: 1px solid black;
  width: 80vw;
  height: 80vh;
}
</style>