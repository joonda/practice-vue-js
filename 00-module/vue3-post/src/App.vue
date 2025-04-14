<template>
  <AppHeader></AppHeader>
  <AppView></AppView>
  <AppAlert :items="alerts" />
</template>

<script setup>
import AppHeader from '@/layouts/AppHeader.vue'
import AppView from '@/layouts/AppView.vue'
import AppAlert from './components/AppAlert.vue'

import { useAlert } from './composables/alert'
const { alerts } = useAlert()
</script>

<style scoped></style>
