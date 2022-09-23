<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: string
    color?: string
  }>(),
  { size: '30px', color: 'primary' }
)
</script>
<template>
  <q-circular-progress indeterminate :size="props.size" :color="props.color" />
</template>
