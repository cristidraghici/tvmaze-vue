import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import getShows from '@/api/getShows'
import type { Show } from '@/api/types'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<Show[]>([])
  const page = ref(0)

  const isLoading = ref(false)
  const error = ref<string>('')

  /**
   * We do not have an indicator about how many more results are there, thus
   * we will just assume that if the request is successful and we still have results,
   * then there will be more in the next page
   */
  const hasMoreShows = ref(true)

  const loadMoreShows = async () => {
    isLoading.value = true
    error.value = ''

    try {
      const result = await getShows(page.value)

      shows.value = shows.value.concat(result)
      page.value++

      if (result.length === 0) {
        hasMoreShows.value = false
      }
    } catch (e) {
      const err = e as Error
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const showsCount = computed(() => shows.value.length)

  const showNameById = computed(() => {
    return (id: number) => {
      const show = shows.value.find((show) => {
        return show.id == id
      })
      return show?.name
    }
  })

  const showsByGenre = computed(() => {
    return (genre: string) => {
      return shows.value.filter((show) => {
        return show.genres.includes(genre)
      })
    }
  })

  const genres = computed(() => {
    return shows.value.reduce((allGenres, show) => {
      for (const genre of show.genres) {
        allGenres.add(genre)
      }
      return allGenres
    }, new Set<string>())
  })

  return {
    shows,
    isLoading,
    error,
    hasMoreShows,
    loadMoreShows,
    showsCount,
    showNameById,
    showsByGenre,
    genres
  }
})
