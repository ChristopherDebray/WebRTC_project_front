<script setup lang="ts">
import { ref } from 'vue';

// Define reactive state
const firstName = ref('');
const password = ref('password');

// Validation rules
const firstNameRules = [
    (value: string) => value?.length >= 3 || 'First name must be at least 3 characters.'
];

const passwordRules = [
    (value: string) => value?.length >= 3 || 'Password must be at least 3 characters.'
];
</script>

<template>
    <v-sheet class="mx-auto px-8 py-8" width="350" elevation="16">
        <v-form fast-fail @submit.prevent>
            <v-text-field prepend-icon="mdi-account" v-model="firstName" :rules="firstNameRules" label="First name"
                class="mb-3"></v-text-field>
            <v-text-field prepend-icon="mdi-lock" v-model="password" :rules="passwordRules"
                label="Password"></v-text-field>
            <v-btn class="mt-3" type="submit" block color="success">Login</v-btn>
        </v-form>
    </v-sheet>
</template>


<style scoped></style>