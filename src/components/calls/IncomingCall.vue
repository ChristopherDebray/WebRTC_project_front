<script setup lang="ts">
import { useSocketStore } from '@/stores/socket';

const socketStore = useSocketStore();
</script>

<template>
    <div class="position-relative">
        <div class="pulse-animation z-20"></div>
        <div class="call_content bg-grey px-8 py-4 rounded-lg elevation-8">
            <div class="d-flex">
                <v-avatar :color="socketStore.incomingUserCall?.userColor" size="28">
                    {{ socketStore.incomingUserCall?.userInitials }}
                </v-avatar>
                <div class="pl-3">
                    {{ socketStore.incomingUserCall?.userName }}
                </div>
            </div>
            <div class="d-flex justify-space-around pt-4">
                <v-btn class="ma-2" color="red" size="small" icon="mdi-phone-hangup"
                    @click.once="socketStore.rejectCall()"></v-btn>
                <v-btn class="ma-2" color="green" size="small" icon="mdi-phone"></v-btn>
            </div>
        </div>
    </div>
</template>


<style scoped>
.call_content {
    position: relative;
    z-index: 100;
}
</style>