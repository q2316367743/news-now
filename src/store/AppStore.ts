import {ref} from "vue";

export const detach = ref(utools.getWindowType() !== 'main')
