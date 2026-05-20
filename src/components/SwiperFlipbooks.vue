<script setup>
import { ref, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import PreloadImages from '../PreloadImages.vue';
import { useGlobal } from '../global.js';

const props = defineProps({
  contents: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();
const global = useGlobal();

const swiperInstance = ref();

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
};

const onSlideChange = () => {
  console.log('slide change');
};

watch(global.currentGesture, (newGesture) => {
  if (!swiperInstance.value) return;

  console.log('gesture', newGesture.name, 'at', newGesture.timestamp);
  switch (newGesture.name) {
    case 'right':
      swiperInstance.value.slideNext();
      break;
    case 'left':
      swiperInstance.value.slidePrev();
      break;
    case 'ok': {
      const index = swiperInstance.value.activeIndex;
      const content = props.contents[index];
      if (content) {
        router.push({ name: 'detail', params: { folder: content.folder } });
      }
      break;
    }
    default:
      break;
  }
});
</script>

<template>
  <pre v-if="false">{{ contents.map(content => content.pages[0].image) }}</pre>
  <PreloadImages
    v-if="contents.length > 0"
    :images="contents.map(content => content.pages[0].image)"
  />

  <div class="swiper">
    <swiper
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :slidesPerView="3"
      :centeredSlides="true"
      :spaceBetween="30"
      :pagination="{
        clickable: true,
      }"
    >
      <swiper-slide v-for="content in contents" :key="content.folder">
        <div class="text-center text-3xl mb-4">{{ content.folder }}</div>
        <router-link class="mb-4" :to="{ name: 'detail', params: { folder: content.folder } }">
          <img :src="content.pages[0].image" />
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.swiper {
  width: 100vw;
  padding: 30px;
  padding-right: 60px;
  margin-left: -15px;
  font-weight: 600;

  .swiper-slide {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      border-radius: 5px;
      display: block;
      width: 25vw;
    }
  }

  .swiper-slide-active {
    img {
      box-shadow: 0px 0px 40px rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
