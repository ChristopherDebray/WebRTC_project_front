<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useSocketStore } from '@/stores/socket';
import UserMenuItem from '@/components/navigations/UserMenuItem.vue';

const socketStore = useSocketStore();
const connectedUsers = ref(socketStore.connectedUsers);
watchEffect(() => {
    connectedUsers.value = socketStore.connectedUsers; // Ensure reactivity
});
const drawer = ref<boolean>(true);
const isMobile = computed(() => window.innerWidth <= 600);
</script>

<template>
    <v-layout class="rounded rounded-md">
        <v-app-bar color="grey-lighten-2" name="app-bar">
            <v-btn icon="mdi-menu" @click="drawer = !drawer">
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer color="grey-darken-2" :style="{
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

        <v-main class="d-flex align-center justify-center" style="min-height: 300px;">
            <slot></slot>
        </v-main>

        <v-footer name="footer" app>
            <slot name="footer"></slot>
        </v-footer>
    </v-layout>
</template>