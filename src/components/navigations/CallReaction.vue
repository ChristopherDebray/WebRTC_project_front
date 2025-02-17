<script setup lang="ts">
import { useSocketStore } from '@/stores/socket';

const socketStore = useSocketStore();
</script>

<template>
    <div class="call">
        <div class="pulse z-20"></div>

        <div class="call_content bg-grey px-8 py-4 rounded-lg elevation-8">
            <div class="d-flex">
                <v-avatar :color="socketStore.incomingUserCall?.userColor" size="28">
                    {{ socketStore.incomingUserCall?.userInitials }}
                </v-avatar>
                <div class="pl-4">
                    {{ socketStore.incomingUserCall?.userName }}
                </div>
            </div>
            <div class="d-flex justify-space-around pt-4">
                <v-btn class="ma-2" color="red" size="small" icon="mdi-phone-hangup"></v-btn>
                <v-btn class="ma-2" color="green" size="small" icon="mdi-phone"></v-btn>
            </div>
        </div>
    </div>
</template>


<style scoped>
.call {
    border-radius: 8px;
    position: fixed;
    bottom: 20vh;
}

.call_content {
    position: relative;
    z-index: 100;
}

.pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    background-color: rgba(21, 255, 0, 0.5);
    animation: pulse-animation 1s infinite;
    transform-origin: center;
    border-radius: 8px;
    z-index: 90;
}

.pulse::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    bottom: 0;
    background-color: rgba(21, 255, 0, 0.3);
    animation: pulse-animation .7s infinite;
    transform-origin: center;
    border-radius: 8px;
}

@keyframes pulse-animation {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    100% {
        transform: scale(1.3);
        opacity: 0;
    }
}
</style>