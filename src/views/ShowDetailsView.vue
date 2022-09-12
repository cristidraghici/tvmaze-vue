<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

import PosterImage from '@/components/PosterImage.vue'

import getShow from '@/api/getShow'
import type { Show } from '@/api/types'

const route = useRoute()

const show = ref<Show | null>(null)

onMounted(async () => {
  const id = route.params.id as unknown as number

  show.value = await getShow(id)
})
</script>

<template>
  <div class="ShowDetails">
    <div v-if="!show" class="row justify-center q-my-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <template v-else>
      <q-btn
        class="ShowDetails__BackButton"
        to="/"
        flat
        color="primary"
        icon="directions"
        label="Back"
      />

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
