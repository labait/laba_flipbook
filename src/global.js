import { ref, computed, reactive } from 'vue';
import axios from 'axios';

const loadContents = async () => {
  // check brower url is localhost or not
  const url = window.location.href.includes('localhost') ? '/api/contents' : import.meta.env.VITE_API_CONTENTS_URL
  const response = await axios.get(url);
  return response.data;
};

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


export function useGlobal() {
  return {
    loadContents,
    triggerGesture,
    currentGesture,
  }
}