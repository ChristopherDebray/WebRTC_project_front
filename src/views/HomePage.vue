<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue'
import { useSocketStore } from '@/stores/socket';
import { computed, ref } from 'vue';
import { getAvatarInitials } from '@/utils/avatarUtils';

const peer = ref<RTCPeerConnection | null>(null);
const isConnected = ref<boolean>(false);
const drawer = ref<boolean>(true);
const socketStore = useSocketStore();
const connectedUsers = computed(() => socketStore.connectedUsers);
const isMobile = computed(() => window.innerWidth <= 600);

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
        <v-layout ref="app" class="rounded rounded-md">
            <v-app-bar color="grey-lighten-2" name="app-bar">
                <v-btn icon="mdi-menu" @click="drawer = !drawer">
                </v-btn>
            </v-app-bar>

            <v-navigation-drawer color="grey-darken-2" :style="{
                width: isMobile ? '100%' : '72px',
                transform: drawer ? 'translateX(0)' : (isMobile ? 'translateX(-100%)' : 'translateX(-72px)')
            }" name="drawer" v-model="drawer">
                <v-list-item class="py-2">
                    <v-avatar color="secondary" size="28">
                        {{ getAvatarInitials(socketStore.userName) }}
                    </v-avatar>
                </v-list-item>

                <v-divider class="py-2"></v-divider>

                <v-list-item v-for="user in connectedUsers" :key="`user-${user.socketId}`">
                    <v-tooltip :text="user.userName">
                        <template v-slot:activator="{ props }">
                            <div class="d-flex items-center">
                                <v-avatar v-bind="props" :color="user.userColor" size="28">
                                    {{ user.userInitials }}
                                </v-avatar>
                                <div class="pl-2">
                                    {{ user.userName }}
                                </div>
                            </div>
                        </template>
                    </v-tooltip>
                </v-list-item>
            </v-navigation-drawer>

            <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
                Main Content
            </v-main>

            <v-footer name="footer" app>

            </v-footer>
        </v-layout>
    </div>
</template>

<style scoped></style>