<script setup lang="ts">
import { useSocketStore } from '@/stores/socket';
import { onMounted, ref, watch } from 'vue';

const constraints: MediaStreamConstraints = {
    audio: true,
    video: true,
};

let camStream: MediaStream | null = null;
let screenStream: MediaStream | null = null;

const ownVideo = ref<HTMLVideoElement | null>(null);
const ownScreen = ref<HTMLVideoElement | null>(null);
const callerVideo = ref<HTMLVideoElement | null>(null);
const callerScreenVideo = ref<HTMLVideoElement | null>(null);
const displaySmallVideo = ref<boolean>(false);
const isCamShared = ref<boolean>(false);
const isScreenShared = ref<boolean>(false);
const socketStore = useSocketStore();

const toggleCamStream = async () => {
    if (true === isCamShared.value) {
        stopCamStream()
        return
    }

    await startCamStream()
}

const startCamStream = async () => {
    camStream = await navigator.mediaDevices.getUserMedia(constraints);
    isCamShared.value = true
    if (ownVideo.value) {
        const videoStream = new MediaStream(camStream.getVideoTracks())
        ownVideo.value.srcObject = videoStream;
        displaySmallVideo.value = true
    }

    socketStore.peerConnection.getTransceivers().forEach(element => {
        console.log(element);
    });
    const videoTransceiver = socketStore.peerConnection.getTransceivers().find(t => t.receiver.track?.kind === 'video');
    const audioTransceiver = socketStore.peerConnection.getTransceivers().find(t => t.receiver.track?.kind === 'audio');

    if (videoTransceiver) {
        videoTransceiver.sender.replaceTrack(camStream.getVideoTracks()[0]);
    }

    if (audioTransceiver) {
        audioTransceiver.sender.replaceTrack(camStream.getAudioTracks()[0]);
    }

    camStream.getTracks().forEach(track => {
        console.log(track)
    });

    // socketStore.createOffer()
}

const stopCamStream = () => {
    if (null == camStream) {
        return
    }

    isCamShared.value = false
    camStream.getTracks().forEach(track => {
        track.stop()
    });
    camStream = null
    displaySmallVideo.value = false
}

const toggleScreenStream = async () => {
    if (true === isScreenShared.value) {
        stopScreenStream()
        return
    }

    await startScreenStream()
}

const startScreenStream = async () => {
    screenStream = await navigator.mediaDevices.getDisplayMedia()
    isScreenShared.value = true
    if (ownScreen.value) {
        ownScreen.value.srcObject = screenStream;
    }

    screenStream.getVideoTracks().forEach((track) => {
        console.log(track);

        const sender = socketStore.peerConnection.getSenders()[2];
        console.error(socketStore.peerConnection.getSenders())
        if (sender) sender.replaceTrack(track);
    });
}

const stopScreenStream = () => {
    if (null == screenStream) {
        return
    }

    isScreenShared.value = false
    screenStream.getTracks().forEach(track => {
        track.stop()
    });
    screenStream = null
    ownScreen.value.srcObject = null
}

onMounted(async () => {
    await socketStore.createOffer()
    watch(() => socketStore.remoteStream, (newStream) => {
        if (newStream && callerVideo.value) {
            callerVideo.value.srcObject = newStream;
        }
    }, { immediate: true });

    watch(() => socketStore.remoteScreenStream, (newStream) => {
        if (newStream && callerScreenVideo.value) {
            callerScreenVideo.value.srcObject = newStream;
        }
    }, { immediate: true });
});
</script>

<template>
    <div class="video_page">
        <video class="video_full_page" ref="ownScreen" autoplay playsinline></video>
        <video class="video_small_picture" ref="ownVideo" autoplay playsinline controls height="200"
            v-show="displaySmallVideo"></video>

        <video class="video_small_picture bottom" ref="callerVideo" autoplay playsinline controls height="100"></video>
        <video class="video_small_picture left bottom" ref="callerScreenVideo" autoplay playsinline controls
            height="100"></video>

        <div class="action_bar">
            <v-btn size="small" class="ma-2" :color="isCamShared ? 'orange-lighten-2' : 'grey-darken-2'"
                :icon="isCamShared ? 'mdi-video-off' : 'mdi-video'" @click="toggleCamStream"></v-btn>

            <v-btn size="small" class="ma-2" :color="isScreenShared ? 'orange-lighten-2' : 'grey-darken-2'"
                :icon="isScreenShared ? 'mdi-monitor-off' : 'mdi-monitor'" @click="toggleScreenStream"></v-btn>

            <v-btn class="ma-2" color="red" size="small" icon="mdi-phone-hangup" @click="socketStore.hangUp()"></v-btn>
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
    width: 100vw;
    height: 100vh;
    transition: width 0.05s ease-in-out;
}

.is_open_menu .video_full_page {
    width: calc(100vw - 72px);
}

.video_small_picture {
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
}

.video_small_picture.bottom {
    bottom: 10px;
    top: auto;
}

.video_small_picture.left {
    left: 10px;
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
    padding: 0px 8px;
}

.action_bar .btn {
    border-radius: 999px;

}
</style>