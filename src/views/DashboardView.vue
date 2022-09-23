<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

import ShowsList from './DashboardView/ShowsList.vue'
import ShowsCarouselByGenre from './DashboardView/ShowsCarouselByGenre.vue'
import { useNotifications } from '@/hooks/useNotifications'
import { useShowsStore } from '@/stores/shows'
import { useShowSearchStore } from '@/stores/showSearch'
import { useWindowSize } from '@/hooks/useWindowSize'

import { POSTER_WIDTH } from '@/config/posters'

const { notifyError } = useNotifications()

// Window size
const { windowWidth } = useWindowSize()

// Search
const search = ref<string>('')
const showSearchStore = useShowSearchStore()

/**
 * By watching the error value, we ensure that we will display the notification,
 * in case something happens with our request. It's not the best implementation,
 * given that a more performant solution might have been call the notify function
 * as a side effect in the store. However, it's clean and for the moment, at least,
 * not too expensive for the applications performance all in all.
 */
watch(
  () => showSearchStore.error,
  (value) => {
    if (value) {
      notifyError(value)
    }
  }
)

// Shows list
const showsStore = useShowsStore()

watch(
  () => showsStore.error,
  (value) => {
    if (value) {
      notifyError(value)
    }
  }
)

onMounted(async () => {
  if (showsStore.showsCount === 0) {
    showsStore.loadMoreShows()
  }
})
</script>

<template>
  <div class="Dashboard">
    <q-input
      type="text"
      rounded
      outlined
      autofocus
      v-model="search"
      placeholder="Search for a show"
      debounce="500"
      @update:model-value="(searchTerm) => showSearchStore.findShows(searchTerm as unknown as string)"
    >
      <template v-slot:append>
        <q-avatar>
          <q-icon v-if="search === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
        </q-avatar>
      </template>
    </q-input>

    <ShowsList
      v-if="search.length > 0"
      title="Search results"
      no-results-text="There are no shows matching your search criteria."
      load-more-results-text="Load more shows"
      :shows="showSearchStore.searchResults"
      :is-loading="showSearchStore.isLoading"
    />

    <template v-else>
      <ShowsCarouselByGenre
        title="All available shows"
        no-results-text="There are no shows to display yet."
        :window-width="windowWidth"
        :poster-width="POSTER_WIDTH"
        :shows="showsStore.shows"
        :can-load-more="showsStore.hasMoreShows"
        :is-loading="showsStore.isLoading"
        @load-more="showsStore.loadMoreShows"
      />

      <ShowsCarouselByGenre
        v-for="genre in showsStore.genres"
        :key="genre"
        :title="genre"
        :window-width="windowWidth"
        :poster-width="POSTER_WIDTH"
        :shows="showsStore.showsByGenre(genre)"
        :can-load-more="showsStore.hasMoreShows"
        :is-loading="showsStore.isLoading"
        @load-more="showsStore.loadMoreShows"
        no-results-text="There are no shows to display yet."
      />
    </template>
  </div>
</template>
