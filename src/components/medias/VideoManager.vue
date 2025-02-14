<script setup lang="ts">
import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

const socket: Socket = io(import.meta.env.VITE_WEBSOCKET_SERVER);
const constraints: MediaStreamConstraints = {
    audio: true,
    video: true,
};

let camStream: MediaStream | null = null;
const screenStream: MediaStream | null = null;

const ownVideo = ref<HTMLVideoElement | null>(null);
const ownScreen = ref<HTMLVideoElement | null>(null);

const startCamStream = async () => {
    camStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (ownVideo.value) {
        ownVideo.value.srcObject = camStream;
    }
}

const stopCamStream = () => {
    if (null == camStream) {
        return
    }

    camStream.getTracks().forEach(track => {
        track.stop()
    });
}

</script>

<template>
    <div>
        <div>
            <button @click="startCamStream">Start cam</button>
            <button @click="stopCamStream">Stop cam</button>
            <video ref="ownVideo" autoplay playsinline controls></video>
        </div>
    </div>
</template>

<style scoped></style>