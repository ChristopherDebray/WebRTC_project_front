<script setup lang="ts">
import VideoManager from '@/components/medias/VideoManager.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import router from '@/router';
import { useSocketStore } from '@/stores/socket';
import { storeToRefs } from 'pinia';

const socketStore = useSocketStore();
const { outgoingCallUser } = storeToRefs(socketStore)
if (!socketStore.socket) {
    router.replace('/')
}
</script>

<template>
    <DefaultLayout>
        <div v-if="outgoingCallUser">
            <VideoManager />
        </div>
        <div v-else>
            Main Content
        </div>
    </DefaultLayout>
</template>

<style scoped></style>