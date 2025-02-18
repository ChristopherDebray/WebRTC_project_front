<script setup lang="ts">
import VideoManager from '@/components/medias/VideoManager.vue'
import { ref } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const peer = ref<RTCPeerConnection | null>(null);

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
    <VideoManager />
</template>

<style scoped></style>