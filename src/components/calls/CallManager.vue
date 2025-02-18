<script setup lang="ts">
import { useSocketStore } from '@/stores/socket';
import { ref, watchEffect } from 'vue';
import IncomingCall from '@/components/calls/IncomingCall.vue';
import CallingUser from '@/components/calls/CallingUser.vue';

const socketStore = useSocketStore();
const incomingUserCall = ref(socketStore.incomingUserCall);
const calledUser = ref(socketStore.calledUser);
watchEffect(() => {
    incomingUserCall.value = socketStore.incomingUserCall;
    calledUser.value = socketStore.calledUser;
});
</script>

<template>
    <div class="call_container">
        <CallingUser v-if="calledUser" />
        <IncomingCall v-if="incomingUserCall" />
    </div>
</template>


<style scoped>
.call_container {
    position: fixed;
    bottom: 20vh;
    display: grid;
    grid-row-gap: 20px;
}
</style>