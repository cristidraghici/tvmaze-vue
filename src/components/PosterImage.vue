<script setup lang="ts">
import { POSTER_WIDTH, POSTER_HEIGHT } from '@/config/posters'

defineProps<{
  src?: string
  name: string
}>()
</script>

<template>
  <div
    class="PosterImage shadow-13"
    :style="{
      width: `${POSTER_WIDTH}px`,
      height: `${POSTER_HEIGHT}px`
    }"
  >
    <img v-if="!!src" :src="src" :alt="name" />
    <div v-else class="PosterImage__Placeholder">{{ name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.PosterImage {
  overflow: hidden;
  text-align: left;
  box-sizing: border-box;

  &__Placeholder {
    background-color: #ccc;
    height: 100%;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
