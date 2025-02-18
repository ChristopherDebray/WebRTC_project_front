<script setup lang="ts">
import { ref } from 'vue';
import { useSocketStore } from '@/stores/socket';
import router from '@/router';

const userName = ref('');
const socketStore = useSocketStore();
const form = ref();


const userNameRules = [
    (value: string) => value?.length >= 3 || 'First name must be at least 3 characters.'
];

const onSubmit = async () => {
    const { valid } = await form.value.validate()
    if (!valid) {
        return
    }
    socketStore.connect(userName.value)
    router.push('/home')
}
</script>

<template>
    <v-sheet class="mx-auto px-8 py-8" width="350" elevation="16">
        <v-form fast-fail ref="form" @submit.prevent="onSubmit">
            <v-text-field prepend-icon="mdi-account" v-model="userName" :rules="userNameRules" label="User name"
                class="mb-3"></v-text-field>
            <v-btn class="mt-3" type="submit" block color="success">Login</v-btn>
        </v-form>
    </v-sheet>
</template>


<style scoped></style>