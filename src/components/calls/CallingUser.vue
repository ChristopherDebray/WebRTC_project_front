<script setup lang="ts">
import { useSocketStore } from '@/stores/socket';

const socketStore = useSocketStore();
</script>

<template>
    <div>
        <div class="bg-grey-lighten-3 px-8 py-2 rounded-lg elevation-8">
            <div>
                Calling...
            </div>
            <div class="d-flex">
                <v-avatar :color="socketStore.calledUser?.userColor" size="28">
                    {{ socketStore.calledUser?.userInitials }}
                </v-avatar>
                <div class="pl-4">
                    {{ socketStore.calledUser?.userName }}
                </div>
            </div>
            <div class="d-flex justify-space-around pt-4">
                <v-btn class="ma-2" color="red" size="small" icon="mdi-phone-hangup"
                    @click.once="socketStore.rejectCall"></v-btn>
            </div>
        </div>
    </div>
</template>