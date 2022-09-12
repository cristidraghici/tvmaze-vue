<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

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
    <div v-if="!show">Loading...</div>
    <div v-else>
      {{ show.name }}
    </div>
  </div>
</template>
