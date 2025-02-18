<script setup lang="ts">
import VideoManager from '@/components/medias/VideoManager.vue';
import { useSocketStore } from '@/stores/socket';
import { storeToRefs } from 'pinia';

const socketStore = useSocketStore();
const { outgoingCallUser } = storeToRefs(socketStore)
</script>

<template>
    <div>
        <div v-if="outgoingCallUser">
            <VideoManager />
        </div>
        <div v-else>
            Main Content
        </div>
    </div>
</template>

<style scoped></style>