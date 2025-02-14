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
const displaySmallVideo = ref<boolean>(false);

const startCamStream = async () => {
    camStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (ownVideo.value) {
        ownVideo.value.srcObject = camStream;
        displaySmallVideo.value = true
    }
}

const stopCamStream = () => {
    if (null == camStream) {
        return
    }

    camStream.getTracks().forEach(track => {
        track.stop()
    });
    camStream = null
    displaySmallVideo.value = false
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
    screenStream = null
}
</script>

<template>
    <div class="video_page">
        <video class="video_full_page" ref="ownScreen" autoplay playsinline></video>
        <video class="video_small_picture" ref="ownVideo" autoplay playsinline controls
            v-show="displaySmallVideo"></video>

        <div class="action_bar">
            <button class="btn" @click="startCamStream">Start cam</button>
            <button class="btn" @click="stopCamStream">Stop cam</button>
            |
            <button class="btn" @click="startScreenStream">Start screen share</button>
            <button class="btn" @click="stopScreenStream">Stop screen share</button>
        </div>
    </div>
</template>

<style scoped>
.video_page {
    height: 100%;
    background-color: rgb(32, 32, 32);
    position: relative;
}

.video_full_page {
    display: block;
    margin: auto;
    width: 99vw;
    height: 100vh;
}

.video_small_picture {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.action_bar {
    position: absolute;
    bottom: 40px;
    right: 50%;
    transform: translateX(50%);
    background-color: rgb(49, 49, 49);
    margin: 10px;
    border-radius: 9999px;
    display: inline-flex;
    justify-content: space-around;
    padding: 8px 10px;
}

.action_bar .btn {
    border-radius: 999px;

}
</style>