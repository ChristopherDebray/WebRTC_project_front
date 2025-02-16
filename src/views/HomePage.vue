<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import router from '@/router';
import { useSocketStore } from '@/stores/socket';

const socketStore = useSocketStore();
if (!socketStore.socket) {
    router.replace('/')
}
</script>

<template>
    <DefaultLayout>
        Main Content
    </DefaultLayout>
</template>

<style scoped></style>