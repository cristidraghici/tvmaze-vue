<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import PosterImage from '@/components/PosterImage.vue'
import CircularLoader from '@/components/CircularLoader.vue'
import type { Show } from '@/api/types'

defineProps<{
  title: string
  noResultsText?: string
  shows: Show[]
  hasMore: boolean
  isLoading: boolean

  isHorizontal?: boolean
}>()

const isMobile = ref(false)
isMobile.value = !!('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/))
</script>

<template>
  <div
    class="VerticalShowsList"
    :class="{
      'VerticalShowsList--horizontal': isHorizontal,
      'VerticalShowsList--horizontal--isMobile': isHorizontal && isMobile
    }"
  >
    <h1 class="text-h4">{{ title }}</h1>
    <ul v-if="shows.length > 0">
      <li v-for="show in shows" :key="show.id">
        <RouterLink :to="`/show/${show.id}`">
          <PosterImage :src="show.image?.medium" :name="show.name" />
        </RouterLink>
      </li>
    </ul>

    <div v-else-if="!!noResultsText">{{ noResultsText }}</div>

    <div class="row q-my-md">
      <q-btn
        v-if="hasMore"
        :disable="isLoading"
        @click="$emit('load-more')"
        class="LoadMoreButton"
        color="primary"
        icon="more"
        label="Load more shows"
      />

      <CircularLoader v-if="isLoading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.VerticalShowsList {
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      display: inline-block;
      margin: 0px 10px 10px 0px;
    }
  }

  .LoadMoreButton {
    margin-right: 20px;
  }

  // Add the following for a CSS based rudimentary horizontal scrolling solution on mobile
  &--horizontal {
    ul {
      display: flex;
      max-height: 320px;
      overflow-x: auto;

      li {
        line-height: 320px;
      }
    }

    &--isMobile {
      ul::-webkit-scrollbar {
        width: 0;
      }
    }
  }
}
</style>
