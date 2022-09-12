<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, unref, onMounted } from 'vue'
import debounce from '@/utils/debounce'

import getShows from '@/api/getShows'
import getSearchShows from '@/api/getSearchShows'

import type { Show } from '@/api/types'

// Search
const search = ref<string>('')
const searchResults = ref<Show[]>([])

const onSearchInputChange = debounce(async (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value
  search.value = value

  // ... or we can enjoy the reactivity and put the request on a watcher
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
}, 500)

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
    <h1>Search</h1>
    <input type="text" @input="onSearchInputChange" />
    {{ search }}
    <ul>
      <li v-for="show in searchResults" :key="show.id">
        <RouterLink :to="`/show/${show.id}`">{{ show.name }}</RouterLink>
      </li>
    </ul>

    <h1>Available shows</h1>
    <ol>
      <li v-for="show in shows" :key="show.id">
        <RouterLink :to="`/show/${show.id}`">{{ show.name }}</RouterLink>
      </li>
    </ol>
    <a
      href="#"
      @click.prevent="
        () => {
          loadShows(++showsPage)
        }
      "
    >
      Load more shows
    </a>
  </div>
</template>
