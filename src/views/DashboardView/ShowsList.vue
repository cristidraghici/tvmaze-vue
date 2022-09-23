<script setup lang="ts">
import { RouterLink } from 'vue-router'
import PosterImage from '@/components/PosterImage.vue'
import CircularLoader from '@/components/CircularLoader.vue'
import type { Show } from '@/api/types'

withDefaults(
  defineProps<{
    title: string
    loadMoreResultsText?: string
    noResultsText?: string
    shows: Show[]
    hasMore?: boolean
    isLoading?: boolean
  }>(),
  {
    hasMore: false,
    idLoading: false,
    noResultsText: 'There are no shows to display.',
    loadMoreResultsText: 'Load more shows'
  }
)
</script>

<template>
  <div class="ShowsList">
    <h1 class="text-h4">{{ title }}</h1>
    <template v-if="shows.length > 0">
      <ul>
        <li v-for="show in shows" :key="show.id">
          <RouterLink :to="`/show/${show.id}`">
            <transition name="slide" :duration="500" appear>
              <PosterImage :src="show.image?.medium" :name="show.name" />
            </transition>
          </RouterLink>
        </li>
      </ul>
    </template>

    <div v-else-if="!!noResultsText">{{ noResultsText }}</div>

    <div class="row q-my-md">
      <q-btn
        v-if="hasMore"
        :disable="isLoading"
        @click="$emit('load-more')"
        class="LoadMoreButton"
        color="primary"
        icon="more"
        :label="loadMoreResultsText"
      />

      <CircularLoader v-if="isLoading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ShowsList {
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
}
</style>
