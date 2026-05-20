<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SwiperFlipbooks from '../components/swiper-flipbooks/SwiperFlipbooks.vue';
import { useGlobal } from '../global.js';

const router = useRouter();
const global = useGlobal();
const contents = ref([]);

onMounted(async () => {
  try {
    const data = await global.loadContents();
    if (!Array.isArray(data)) {
      console.error('loadContents: expected an array, got', data);
      return;
    }
    contents.value = data.filter(content => content.pages?.length > 0);
    if (contents.value.length === 1) {
      router.push({ name: 'detail', params: { folder: contents.value[0].folder } });
    }
  } catch (error) {
    console.error('Failed to load contents:', error);
  }
});
</script>

<template>
  <SwiperFlipbooks :contents="contents" />
</template>
