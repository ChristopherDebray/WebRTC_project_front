<script setup lang="ts">
import { ref } from 'vue';

const constraints: MediaStreamConstraints = {
    audio: true,
    video: true,
};

let camStream: MediaStream | null = null;
let screenStream: MediaStream | null = null;

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

const startScreenStream = async () => {
    screenStream = await navigator.mediaDevices.getDisplayMedia()
    if (ownScreen.value) {
        ownScreen.value.srcObject = screenStream;
    }
}

const stopScreenStream = async () => {
    if (null == screenStream) {
        return
    }

    screenStream.getTracks().forEach(track => {
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
        <div>
            <button @click="startScreenStream">Start screen share</button>
            <button @click="stopScreenStream">Stop screen share</button>
            <video ref="ownScreen" autoplay playsinline controls></video>
        </div>
    </div>
</template>

<style scoped></style>