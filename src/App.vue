<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        -
        <RouterLink to="/show">Show</RouterLink>
        -
        <RouterLink to="/show/1">Show 1</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
