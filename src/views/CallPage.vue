<script setup lang="ts">
import VideoManager from '@/components/medias/VideoManager.vue'

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

</script>

<template>
    <VideoManager />
</template>

<style scoped></style>