import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useWindowSize = () => {
  // Window width in pixels
  const windowWidth = ref<number>(0)

  // Get the current window width
  const onResize = () => {
    windowWidth.value =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  }
  onMounted(() => {
    window.addEventListener('resize', onResize)
    onResize()
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
  })

  return {
    windowWidth
  }
}
