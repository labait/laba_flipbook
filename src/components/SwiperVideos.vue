<script setup>
import { ref, watch, nextTick } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Keyboard, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { useGlobal } from '../global.js';

const swiperModules = [Keyboard, Pagination];

const props = defineProps({
  videos: {
    type: Array,
    default: () => [],
  },
});

const global = useGlobal();
const swiperInstance = ref();
const playingVideo = ref(null);
const lastPlayedIndex = ref(-1);
const started = ref(false);
const isMuted = ref(false);

const applyMuteState = (swiper = swiperInstance.value) => {
  if (!swiper) return;
  for (const slide of swiper.slides) {
    const video = slide.querySelector('video');
    if (video) {
      video.muted = isMuted.value;
    }
  }
};

const setMuted = (muted) => {
  isMuted.value = muted;
  applyMuteState();
};

const playVideo = async (video, { restart = false } = {}) => {
  if (!video) return;
  if (!restart && playingVideo.value === video && !video.paused) return;

  if (restart) {
    video.currentTime = 0;
  }

  video.muted = isMuted.value;

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
    if (!isMuted.value) {
      setMuted(true);
      await video.play().catch((error) => {
        console.warn('Video playback failed:', video.src, error);
      });
    }
  }

  playingVideo.value = video;
};

const getActiveSlide = (swiper) => swiper.slides[swiper.activeIndex];

const syncPlayback = async (swiper, { restart = false } = {}) => {
  if (!swiper || !started.value) return;

  const index = swiper.realIndex ?? swiper.activeIndex;
  if (restart) {
    lastPlayedIndex.value = index;
  }

  const activeSlide = getActiveSlide(swiper);
  if (!activeSlide) return;

  for (const slide of swiper.slides) {
    const video = slide.querySelector('video');
    if (!video) continue;

    if (slide === activeSlide) {
      await playVideo(video, { restart });
    } else {
      video.pause();
    }
  }
};

const beginPlayback = async (swiper) => {
  if (!swiper || !started.value) return;

  swiper.slideToLoop(0, 0);
  await nextTick();
  await syncPlayback(swiper, { restart: true });
};

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
  lastPlayedIndex.value = -1;

  if (started.value) {
    beginPlayback(swiper);
  }
};

const startSlideshow = async () => {
  started.value = true;
  await nextTick();

  if (swiperInstance.value) {
    await beginPlayback(swiperInstance.value);
  }
};

const onSlideChangeTransitionEnd = (swiper) => {
  if (!started.value) return;
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
  if (!swiperInstance.value || !started.value) return;

  switch (newGesture.name) {
    case 'right':
      swiperInstance.value.slideNext();
      break;
    case 'left':
      swiperInstance.value.slidePrev();
      break;
    case 'back':
      // do nothing
      break;
    case 'ok':
      setMuted(!isMuted.value);
      break;
    default:
      break;
  }
});
</script>

<template>
  <div class="swiper-videos">
    <div v-if="!started" class="start-overlay">
      <button type="button" class="start-button" @click="startSlideshow">
        Click Me to start!
      </button>
    </div>

    <swiper
      v-if="videos.length"
      class="swiper-videos__carousel"
      :modules="swiperModules"
      @swiper="onSwiper"
      @slideChangeTransitionEnd="onSlideChangeTransitionEnd"
      :slidesPerView="1"
      :centeredSlides="true"
      :loop="true"
      :spaceBetween="0"
      :keyboard="{
        enabled: true,
        onlyInViewport: true,
      }"
      :pagination="{
        clickable: true,
      }"
    >
      <swiper-slide v-for="video in videos" :key="video.file">
        <div class="slide-title">{{ video.file }}</div>
        <video
          class="video-player"
          :src="video.path"
          :muted="isMuted"
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
  position: relative;
  width: 100%;
  max-width: 100vw;
  height: 85vh;
  margin: 0 auto;
  padding: 1rem 0 2.5rem;
  font-weight: 600;
  overflow: hidden;

  .start-overlay {
    position: absolute;
    inset: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(6px);
  }

  .start-button {
    padding: 1.1rem 2.5rem;
    border: 2px solid var(--color1);
    border-radius: 999px;
    background: var(--color1);
    color: #fff;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 0 40px rgba(237, 113, 55, 0.45);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

    &:hover {
      transform: scale(1.05);
      background: #fff;
      color: var(--color1);
      box-shadow: 0 0 55px rgba(237, 113, 55, 0.65);
    }

    &:active {
      transform: scale(0.98);
    }
  }

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
