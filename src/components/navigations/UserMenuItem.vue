<script setup lang="ts">
import type { UserSocket } from '@/stores/socket';
import { mergeProps, ref } from 'vue';

defineProps<{
    user: UserSocket
}>()
const menu = ref(false)
</script>

<template>
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
        <template v-slot:activator="{ props: menu }">
            <v-tooltip :text="user.userName">
                <template v-slot:activator="{ props: tooltip }">
                    <div class="d-flex items-center" v-bind="mergeProps(menu, tooltip)">
                        <v-avatar :color="user.userColor" size="28">
                            {{ user.userInitials }}
                        </v-avatar>
                        <div class="pl-4">
                            {{ user.userName }}
                        </div>
                    </div>
                </template>
            </v-tooltip>
        </template>

        <v-card min-width="300">
            <v-list>
                <v-list-item>
                    <div class="d-flex">
                        <v-avatar :color="user.userColor" size="28">
                            {{ user.userInitials }}
                        </v-avatar>
                        <div class="pl-4">
                            {{ user.userName }}
                        </div>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list>
                <v-list-item>
                    <v-icon icon="mdi-phone"></v-icon>
                    <span class="pl-2">
                        Call
                    </span>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>