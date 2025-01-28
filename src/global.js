import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
import axios from 'axios';
import { data } from 'autoprefixer';

const dataAttributes = ref(document.getElementById('app').dataset);
const triggeredGestures = reactive([])
const gestureNone = {name: 'none', timestamp: 0}
let gestureResetTimeout = null;
// const currentGesture = () => {
//   return triggeredGestures[triggeredGestures.length - 1] || gestureNone;
// }
const currentGesture = computed(() => {
  return triggeredGestures[triggeredGestures.length - 1] || gestureNone;
})
const triggerGesture = (name) => {
  clearTimeout(gestureResetTimeout)
  if(currentGesture.value.name != name) {
    const timestamp = new Date().getTime()
    triggeredGestures.push({name, timestamp})
    //console.log('gesture', name, "at", (new Date(timestamp)).toLocaleTimeString())
  }
  gestureResetTimeout = setTimeout(() => {
    triggeredGestures.push(gestureNone)
  }, 500)
  //console.log('currentGesture', currentGesture)
}


const loadContents = async () => {
  const url = dataAttributes.value.contentsUrl || import.meta.env.VITE_API_CONTENTS_URL
  const response = await axios.get(url);
  //console.log('loadContents', url, "data", response.data)
  return response.data;
};

export function useGlobal() {
  return {
    dataAttributes,
    loadContents,
    triggerGesture,
    currentGesture,
  }
}