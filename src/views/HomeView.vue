<script setup>
  import {useRouter, RouterLink} from 'vue-router'
  const router = useRouter()

  import { ref, onMounted, watch } from 'vue';

  import PreloadImages from '../components/PreloadImages.vue'
  
  // Import Swiper Vue.js components
  import { Swiper, SwiperSlide } from 'swiper/vue';
  // Import Swiper styles
  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/navigation';

  // import required modules
  import { Pagination, Navigation } from 'swiper/modules';

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
    console.log("swiper");
    swiperInstance.value = swiper
  };
  const onSlideChange = () => {
    console.log('slide change');
  };
  
  
  onMounted(async () => {
    contents.value = await global.loadContents();
    if(contents.value.length == 1){
      router.push({name: 'detail', params: {folder: contents.value[0].folder}})
      return
    }
  });
</script>

<template>
  <pre v-if="false">{{ contents.map( content => content.pages[0].image) }}</pre>
  <PreloadImages :images="contents.map( content => content.pages[0].image) " />

  <h1 class="text-center text-3xl mb-4">pubblications</h1>
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
  width: 100vw;
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
    }
  }
  .swiper-slide-active {
    img{
      box-shadow: 10px 15px 10px rgba(0, 0, 0, .3);
    }
  }
}
</style>