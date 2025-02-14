<script setup lang="ts">
import { io } from 'socket.io-client';
import VideoManager from '@/components/medias/VideoManager.vue'
const socket = io(import.meta.env.VITE_WEBSOCKET_SERVER);
</script>

<template>
    <div>
        <Suspense>
            <VideoManager />

            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<style scoped></style>