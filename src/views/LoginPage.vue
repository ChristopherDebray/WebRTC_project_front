<script setup lang="ts">
import { ref } from 'vue';
import { useSocketStore } from '@/stores/socket';
import router from '@/router';

const userName = ref('');
const password = ref('');
const socketStore = useSocketStore();

const userNameRules = [
    (value: string) => value?.length >= 3 || 'First name must be at least 3 characters.'
];
const passwordRules = [
    (value: string) => value?.length >= 3 || 'Password must be at least 3 characters.'
];

const onSubmit = () => {
    socketStore.connect(userName.value, password.value)
    router.push('/home')
}
</script>

<template>
    <v-sheet class="mx-auto px-8 py-8" width="350" elevation="16">
        <v-form fast-fail @submit.prevent="onSubmit">
            <v-text-field prepend-icon="mdi-account" v-model="userName" :rules="userNameRules" label="First name"
                class="mb-3"></v-text-field>
            <v-text-field prepend-icon="mdi-lock" v-model="password" :rules="passwordRules"
                label="Password"></v-text-field>
            <v-btn class="mt-3" type="submit" block color="success">Login</v-btn>
        </v-form>
    </v-sheet>
</template>


<style scoped></style>