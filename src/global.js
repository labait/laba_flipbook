import { ref } from 'vue';
import axios from 'axios';

const loadContents = async () => {
  const response = await axios.get('/api/contents');
  return response.data;
};


export function useGlobal() {
  return {
    loadContents
  }
}