<script setup lang="ts">
import { ref, computed } from 'vue'

import PosterImage from '@/components/PosterImage.vue'
import CircularLoader from '@/components/CircularLoader.vue'
import type { Show } from '@/api/types'

const props = withDefaults(
  defineProps<{
    title: string
    noResultsText: string

    windowWidth: number
    posterWidth: number
    shows: Show[]

    canLoadMore?: boolean
    isLoading?: boolean
  }>(),
  {
    windowWidth: 1,
    posterWidth: 1,

    canLoadMore: false,
    isLoading: false
  }
)

const itemsPerPage = computed(() => {
  // Get the window width, but subtract the width of the buttons
  // and some buffer for the padding of the content

  /**
   * We will use the passed window width, but we will consider some extra
   * 50px on each side for the buttons and 40px as a general space around
   * our element.
   */
  const windowWidth = props.windowWidth - 100 - 40

  /**
   * We will use the passed poster width, but we will add the 10px set as
   * margin internally, in the css of this component.
   */
  const posterWidth = props.posterWidth + 10

  return Math.floor(windowWidth / posterWidth) || 1
})
const currentItem = ref<number>(0)

const totalShows = computed(() => props.shows.length)

const hasMoreLeft = computed(() => currentItem.value > 0)
const hasMoreRight = computed(
  () => props.canLoadMore || currentItem.value + itemsPerPage.value > totalShows.value
)

const paginatedShows = computed(() => {
  return props.shows.slice(currentItem.value, currentItem.value + itemsPerPage.value)
})

const setOffset = (offset: number) => {
  if (offset < 0) {
    return
  }
  if (offset > totalShows.value) {
    return
  }

  currentItem.value = offset
}
</script>

<template>
  <div class="ShowsCarouselByGenre">
    <h1 class="text-h4">{{ title }}</h1>

    <div class="ShowsCarouselByGenre__Shows">
      <div class="ShowsCarouselByGenre__Shows__Navigation">
        <div
          class="ShowsCarouselByGenre__Shows__Navigation__GoLeft"
          :class="{ 'ShowsCarouselByGenre__Shows__Navigation__GoLeft--disabled': !hasMoreLeft }"
          @click.stop="setOffset(currentItem - itemsPerPage)"
        >
          <q-icon name="arrow_back" size="xl" />
        </div>
      </div>

      <div class="ShowsCarouselByGenre__Shows__Items">
        <div v-for="show in paginatedShows" :key="show.id" :itemHeight="290" :itemWidth="210">
          <RouterLink :to="`/show/${show.id}`">
            <transition name="slide" :duration="500" appear>
              <PosterImage :src="show.image?.medium" :name="show.name" />
            </transition>
          </RouterLink>
        </div>
      </div>

      <div class="ShowsCarouselByGenre__Shows__Navigation">
        <div
          class="ShowsCarouselByGenre__Shows__Navigation__GoRight"
          :class="{
            'ShowsCarouselByGenre__Shows__Navigation__GoRight--disabled':
              !hasMoreRight && !canLoadMore
          }"
        >
          <q-icon
            v-if="!isLoading"
            name="arrow_forward"
            size="xl"
            @click.stop="
              () => {
                setOffset(currentItem + itemsPerPage)

                if (canLoadMore && currentItem + itemsPerPage * 2 > totalShows) {
                  $emit('load-more')
                }
              }
            "
          />
          <CircularLoader color="#000" v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ShowsCarouselByGenre {
  &__Shows {
    display: flex;
    flex-direction: row;

    &__Navigation {
      display: flex;
      justify-content: center;
      align-items: center;

      &__GoLeft,
      &__GoRight {
        width: 50px;
        cursor: pointer;

        &--disabled {
          pointer-events: none;
          opacity: 0.4;
        }
      }
    }

    &__Items {
      display: flex;
      flex-direction: row;

      & > * {
        box-sizing: border-box;
        margin: 0px 10px 10px 0px;
      }
    }
  }
}
</style>
