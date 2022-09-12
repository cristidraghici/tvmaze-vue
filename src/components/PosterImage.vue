<script setup lang="ts">
defineProps<{
  src?: string
  name: string
}>()
</script>

<template>
  <div class="PosterImage shadow-13">
    <img v-if="!!src" :src="src" :alt="name" />
    <div v-else class="PosterImage__Placeholder">{{ name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.PosterImage {
  overflow: hidden;
  width: 210px;
  height: 295px;
  text-align: left;

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
