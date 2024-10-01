import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { Show } from '@/api/types'
import getSearchShows from '@/api/getSearchShows'

export const useShowSearchStore = defineStore('showSearch', () => {
  const searchResults = ref<Show[]>([])

  const isLoading = ref(false)
  const error = ref<string>('')

  const findShows = async (searchTerm: string) => {
    isLoading.value = true
    error.value = ''

    try {
      const result = await getSearchShows(searchTerm)

      searchResults.value = result
    } catch (e) {
      const err = e as Error
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  return { searchResults, isLoading, error, findShows }
})
