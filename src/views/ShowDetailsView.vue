<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const id = route.params.id
</script>

<template>
  <div class="ShowDetails">
    <h1>This is the view which shows the details of the show with the id: {{ id }}</h1>
  </div>
</template>
