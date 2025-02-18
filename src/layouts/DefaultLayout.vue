<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useSocketStore } from '@/stores/socket';
import UserMenuItem from '@/components/navigations/UserMenuItem.vue';
import CallManager from '@/components/calls/CallManager.vue';

const socketStore = useSocketStore();
const connectedUsers = ref(socketStore.connectedUsers);
const incomingUserCall = ref(socketStore.incomingUserCall);
watchEffect(() => {
    connectedUsers.value = socketStore.connectedUsers; // Ensure reactivity
    incomingUserCall.value = socketStore.incomingUserCall;
});
const drawer = ref<boolean>(true);
const isMobile = computed(() => window.innerWidth <= 600);
</script>

<template>
    <v-layout class="rounded rounded-md relative">
        <v-btn class="menu_btn" icon="mdi-menu" size="28" @click="drawer = !drawer">
        </v-btn>

        <v-navigation-drawer color="grey-darken-2" class="pt-12" :style="{
            width: isMobile ? '100%' : '70px',
            transform: drawer ? 'translateX(0)' : (isMobile ? 'translateX(-100%)' : 'translateX(-72px)')
        }" name="drawer" v-model="drawer">
            <v-list-item class="py-2">
                <v-menu :close-on-content-click="false" location="end">
                    <template v-slot:activator="{ props }">
                        <v-avatar :color="socketStore.userColor" size="28" v-bind="props">
                            {{ socketStore.userInitials }}
                        </v-avatar>
                    </template>
                </v-menu>
            </v-list-item>

            <v-divider class="py-2"></v-divider>

            <v-list-item v-for="user in connectedUsers" :key="`user-${user.socketId}`">
                <UserMenuItem :user="user" />
            </v-list-item>
        </v-navigation-drawer>

        <v-main :class="{ 'd-flex align-center justify-center relative': true, 'is_open_menu': drawer }"
            :style="{ '--v-layout-left': drawer ? '72px' : '0px' }">
            <slot></slot>

            <CallManager />
        </v-main>
    </v-layout>
</template>

<style scoped>
.menu_btn {
    position: absolute;
    left: 16px;
    top: 8px;
    z-index: 10000;
}

.main {
    --v-layout-bottom: 0px;
}

main.is_open_menu {
    --v-layout-left: 76px;
}
</style>