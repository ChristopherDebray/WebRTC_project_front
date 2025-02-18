<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === "/");
</script>

<template>
  <DefaultLayout v-if="!isLoginPage">
    <router-view />
  </DefaultLayout>
  <router-view v-else />
</template>
