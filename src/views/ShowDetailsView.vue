<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

import PosterImage from '@/components/PosterImage.vue'
import CircularLoader from '@/components/CircularLoader.vue'

import { useShowsStore } from '@/stores/shows'
import { useNotifications } from '@/hooks/useNotifications'

import getShow from '@/api/getShow'
import type { Show } from '@/api/types'

const { notifyError } = useNotifications()

// Get the id of the movie from the url
const route = useRoute()
const id = route.params.id as unknown as number

// Get the title of the show, if available in the store
const showsStore = useShowsStore()
const name = ref<string | null>(null)
name.value = showsStore.showNameById(id) || null

// Load the show details
const show = ref<Show | null>(null)
const isLoading = ref(false)
const error = ref('')

const loadShow = async () => {
  isLoading.value = true
  error.value = ''

  try {
    show.value = await getShow(id)
  } catch (e) {
    const err = e as Error
    error.value = err.message

    notifyError(error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  loadShow()
})
</script>

<template>
  <div class="ShowDetails">
    <q-btn
      class="ShowDetails__BackButton"
      to="/"
      flat
      color="primary"
      icon="directions"
      label="Back"
    />

    <div v-if="isLoading" class="ShowDetails__Loader">
      <h1 v-if="!!name" class="ShowDetails__Loader_title text-h4">{{ name }}</h1>
      <CircularLoader />
    </div>

    <div v-else-if="!!error || !show" class="ShowDetails__Reload">
      <q-btn label="Try again" @click.stop="loadShow()" color="red" />
    </div>

    <template v-else>
      <q-card class="ShowDetails__Columns shadow-13">
        <div class="ShowDetails__Columns__Poster">
          <PosterImage :src="show.image?.medium" :name="show.name" />
        </div>

        <div class="ShowDetails__Columns__Info">
          <h1 class="text-h4 no-top-margin">{{ show.name }}</h1>

          <h2 class="text-h5">Summary</h2>
          <div v-html="show.summary" />

          <h2 class="text-h5">Genre</h2>
          <div>
            <span v-for="genre in show.genres" :key="genre" class="genre">{{ genre }}</span>
          </div>

          <h2 class="text-h5">Premiere</h2>
          <div>{{ show.premiered }}</div>

          <h2 class="text-h5">Language</h2>
          <div>{{ show.language }}</div>

          <h2 class="text-h5">Status</h2>
          <div>{{ show.status }}</div>
        </div>
      </q-card>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.ShowDetails {
  margin-top: 20px;

  .no-top-margin {
    margin-top: 0;
  }

  .genre {
    padding: 0px 10px 10px 0px;
  }

  &__Reload,
  &__Loader {
    height: 100%;
    min-height: 300px;
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    &_title {
      margin-right: 20px;
    }
  }

  &__BackButton {
    margin-bottom: 20px;
  }

  &__Columns {
    display: flex;
    padding: 20px;

    &__Poster {
      flex: 0 0 210px;
    }

    &__Info {
      flex: 1;
      padding-left: 20px;
    }
  }
}
</style>
