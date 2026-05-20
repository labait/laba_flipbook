<script setup>
import { ref, onMounted } from 'vue';
import SwiperVideos from '../components/SwiperVideos.vue';
import { useGlobal } from '../global.js';

const global = useGlobal();
const contents = ref([]);

onMounted(async () => {
  try {
    const data = await global.loadContents();
    const list = Array.isArray(data) ? data : data?.videos;

    if (!Array.isArray(list)) {
      console.error('loadContents: expected an array or { videos }, got', data);
      return;
    }

    contents.value = list;
  } catch (error) {
    console.error('Failed to load contents:', error);
  }
});
</script>

<template>
  <SwiperVideos :videos="contents" />
</template>
