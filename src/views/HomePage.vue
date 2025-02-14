<script setup lang="ts">
import { io } from 'socket.io-client';
import VideoManager from '@/components/medias/VideoManager.vue'
const socket = io(import.meta.env.VITE_WEBSOCKET_SERVER);

socket.on('connect', () => {
    console.log('connected to socket server');
})
socket.emit('test', {
    firstName: 'Chris',
    lastName: 'Deb',
})

socket.on("testReceived", () => {
    console.log('web socket test received');
})
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