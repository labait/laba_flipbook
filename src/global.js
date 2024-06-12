import { ref, computed } from 'vue';
import axios from 'axios';

const loadContents = async () => {
  const response = await axios.get('/api/contents');
  return response.data;
};

const triggeredGestures = []
const gestureNone = {name: 'none', timestamp: 0}
let gestureResetTimeout = null;
const currentGesture = () => {
  return triggeredGestures[triggeredGestures.length - 1] || gestureNone;
}
const triggerGesture = (name) => {
  clearTimeout(gestureResetTimeout)
  if(currentGesture().name != name) {
    const timestamp = new Date().getTime()
    triggeredGestures.push({name, timestamp})
    console.log('gesture', name, "at", (new Date(timestamp)).toLocaleTimeString())
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