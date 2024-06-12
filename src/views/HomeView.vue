<script setup>
  import {useRouter} from 'vue-router'
  const router = useRouter()
  import { ref, onMounted, watch } from 'vue';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { RouterLink } from 'vue-router';
  import 'swiper/css';

  import {useGlobal} from '../global.js'
  const global = useGlobal()
  watch(global.currentGesture, (newGesture, oldGesture) => {
    console.log('gesture', newGesture.name, "at", newGesture.timestamp)
    switch (newGesture.name) {
      case 'right':
        swiperInstance.value.slideNext()
        break;
      case 'left':
        swiperInstance.value.slidePrev()
        break; 
      case 'ok':
        const index = swiperInstance.value.activeIndex
        const content = contents.value[index]
        router.push({name: 'detail', params: {folder: content.folder}})
        break; 
      default:
        break;
    }
  })


  const contents = ref([]);

  const swiperInstance = ref()
  const onSwiper = (swiper) => {
    console.log(swiper);
    swiperInstance.value = swiper
  };
  const onSlideChange = () => {
    console.log('slide change');
  };
  
  onMounted(async () => {
    contents.value = await global.loadContents();
  });
</script>

<template>
  <h1 class="text-center text-3xl mb-4">pubblications</h1>
  <div class="swiper">
    <swiper
      :slides-per-view="1"
      :space-between="50"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="content in contents">
        <div class="text-center text-3xl mb-4">{{ content.folder }}</div>
        <router-link class="mb-4" :to="{name: 'detail', params: {folder: content.folder}}">
          <img :src="content.pages[0].image" />
        </router-link>
      </swiper-slide>
    </swiper>
    </div>
</template>

<style lang="scss" scoped>
.swiper {
  width: 600px;
  // border: 1px solid red;
  padding: 30px;
  padding-right: 60px;
  margin-left: -15px;
  .swiper-slide {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    img {
      border-radius: 5px;
      display: block;
      box-shadow: 10px 15px 10px rgba(0, 0, 0, .3);
    }
  }
}
</style>