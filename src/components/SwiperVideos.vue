<script setup>
import { ref, watch } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';

import { useGlobal } from '../global.js';

defineProps({
  videos: {
    type: Array,
    default: () => [],
  },
});

const global = useGlobal();
const swiperInstance = ref();
const playingVideo = ref(null);
const lastPlayedIndex = ref(-1);

const playVideo = async (video, { restart = false } = {}) => {
  if (!video) return;
  if (!restart && playingVideo.value === video && !video.paused) return;

  if (restart) {
    video.currentTime = 0;
  }

  if (video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
    await new Promise((resolve) => {
      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        resolve();
        return;
      }
      video.addEventListener('canplay', resolve, { once: true });
    });
  }

  try {
    await video.play();
  } catch {
    if (!video.muted) {
      video.muted = true;
      await video.play().catch((error) => {
        console.warn('Video playback failed:', video.src, error);
      });
    }
  }

  playingVideo.value = video;
};

const syncPlayback = async (swiper, { restart = false } = {}) => {
  if (!swiper) return;

  const index = swiper.realIndex ?? swiper.activeIndex;
  if (restart) {
    lastPlayedIndex.value = index;
  }

  for (const slide of swiper.slides) {
    const video = slide.querySelector('video');
    if (!video) continue;

    if (slide.classList.contains('swiper-slide-active')) {
      await playVideo(video, { restart });
    } else {
      video.pause();
    }
  }
};

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
  lastPlayedIndex.value = -1;
  syncPlayback(swiper, { restart: true });
};

const onSlideChangeTransitionEnd = (swiper) => {
  const index = swiper.realIndex ?? swiper.activeIndex;
  const restart = index !== lastPlayedIndex.value;
  syncPlayback(swiper, { restart });
};

const onVideoEnded = (event) => {
  const video = event.target;
  if (video !== playingVideo.value) return;
  swiperInstance.value?.slideNext();
};

watch(global.currentGesture, (newGesture) => {
  if (!swiperInstance.value) return;

  switch (newGesture.name) {
    case 'right':
      swiperInstance.value.slideNext();
      break;
    case 'left':
      swiperInstance.value.slidePrev();
      break;
    default:
      break;
  }
});
</script>

<template>
  <div class="swiper-videos">
    <swiper
      class="swiper-videos__carousel"
      @swiper="onSwiper"
      @slideChangeTransitionEnd="onSlideChangeTransitionEnd"
      :slidesPerView="1"
      :centeredSlides="true"
      :loop="true"
      :spaceBetween="0"
      :pagination="{
        clickable: true,
      }"
    >
      <swiper-slide v-for="video in videos" :key="video.file">
        <div class="slide-title">{{ video.file }}</div>
        <video
          class="video-player"
          :src="video.path"
          playsinline
          preload="auto"
          @ended="onVideoEnded"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.swiper-videos {
  width: 100%;
  max-width: 100vw;
  height: 85vh;
  margin: 0 auto;
  padding: 1rem 0 2.5rem;
  font-weight: 600;
  overflow: hidden;

  :deep(.swiper-videos__carousel) {
    width: 100%;
    height: 100%;
  }

  :deep(.swiper-slide) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .slide-title {
      margin-bottom: 0.75rem;
      font-size: 1.75rem;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: min(90vw, 1200px);
    }

    .video-player {
      display: block;
      width: min(90vw, 1200px);
      height: calc(85vh - 4rem);
      max-height: 78vh;
      margin: 0 auto;
      object-fit: contain;
      backface-visibility: hidden;
      transform: translateZ(0);
    }
  }
}
</style>
