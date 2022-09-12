<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, unref, onMounted, watch } from 'vue'

import PosterImage from '@/components/PosterImage.vue'

import getShows from '@/api/getShows'
import getSearchShows from '@/api/getSearchShows'

import type { Show } from '@/api/types'

// Search
const search = ref<string>('')
const searchResults = ref<Show[]>([])

watch(search, async (value) => {
  if (value.length > 0) {
    try {
      searchResults.value = await getSearchShows(value)
    } catch (e) {
      const err = e as Error
      console.error(err.message)
    }
  } else {
    searchResults.value = []
  }
})

// Shows list
const shows = ref<Show[]>([])
const showsPage = ref(0)

const loadShows = async (page: number) => {
  try {
    const retrievedShows = await getShows(page)

    shows.value = shows.value.concat(retrievedShows)
  } catch (e) {
    const err = e as Error
    console.error(err.message)
  }
}

onMounted(async () => {
  await loadShows(unref(showsPage))
})
</script>

<template>
  <div class="Dashboard">
    <q-input rounded outlined v-model="search" placeholder="Search for a show" debounce="500">
      <template v-slot:append>
        <q-avatar>
          <q-icon v-if="search === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" />
        </q-avatar>
      </template>
    </q-input>

    <template v-if="search.length > 0">
      <h1 class="text-h4">Search results</h1>
      <ol class="shows-list">
        <li v-for="show in searchResults" :key="`search-${show.id}`">
          <RouterLink :to="`/show/${show.id}`">
            <PosterImage :src="show.image?.medium" :name="show.name" />
          </RouterLink>
        </li>
      </ol>
    </template>

    <template v-else>
      <h1 class="text-h4">Available shows</h1>
      <ol class="shows-list">
        <li v-for="show in shows" :key="show.id">
          <RouterLink :to="`/show/${show.id}`">
            <PosterImage :src="show.image?.medium" :name="show.name" />
          </RouterLink>
        </li>
      </ol>

      <q-btn @click="loadShows(++showsPage)" color="primary" icon="more" label="Load more shows" />
    </template>
  </div>
</template>

<style lang="scss" scoped>
ol.shows-list {
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    display: inline-block;
    margin: 0px 10px 10px 0px;
  }
}
</style>
