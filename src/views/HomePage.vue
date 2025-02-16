<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
import { useSocketStore } from '@/stores/socket';
import { computed, ref } from 'vue';

const peer = ref<RTCPeerConnection | null>(null);
const isConnected = ref<boolean>(false);
const socketStore = useSocketStore();
const connectedUsers = computed(() => socketStore.connectedUsers);


const peerConfiguration = {
    iceServers: [
        {
            // Thoose are free servers from google
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

const onLogin = () => {
    isConnected.value = true
}

/**
 * Need an array
 * 
 * 
 * create call
 *      Create peer connection
 *          offer = createOffer
 *          setLocaldescription to offer
 *          foreach ice candidate
 *              emit newIceCandidate to signaling server
 * 
 * answer call
 *      create peer connection
 *      answer = createAnswer
 *      setLocaldescription to answer
 *      setRemoteDescription to offer
 */
const createCall = async () => {
    peer.value = new RTCPeerConnection(peerConfiguration);
    const offer: RTCSessionDescriptionInit = await peer.value.createOffer()
    peer.value.setLocalDescription(offer)
}

const answerCall = async (offer: RTCSessionDescription) => {
    peer.value = new RTCPeerConnection(peerConfiguration);
    const answer: RTCSessionDescriptionInit = await peer.value.createAnswer()
    peer.value.setLocalDescription(answer)
    peer.value.setRemoteDescription(offer)
}
/**
 * Here add the tracks, before the setlocaldescription
 * peer.addTrack()
 */
// Will trigger the ice gathering.
// peer.value.addEventListener("icecandidate", (event) => {
//     // Ice gathering will always generate an empty ice candidate at the end
//     if (null === event.candidate) {
//         return
//     }
//     // Emit via signaling server to the other user
//     socket.emit('newIceCandidate', event.candidate)
// });

// // When user receive from the signaling server
// socket.on('newIceCandidate', (candidate) => {
//     peer.value.addIceCandidate(candidate)
// })
</script>

<template>
    <div v-if="false === isConnected">
        <LoginForm @loggedIn="onLogin" />
    </div>
    <div v-else>
        <div v-for="user in connectedUsers" :key="`user-${user.socketId}`">
            {{ user.userName }}
        </div>
    </div>
</template>

<style scoped></style>