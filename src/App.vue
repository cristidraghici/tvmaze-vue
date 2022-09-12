<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <q-layout class="App q-pa-md q-gutter-sm">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.App {
  padding: 20px;
}
</style>
