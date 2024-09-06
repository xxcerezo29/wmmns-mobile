<script setup lang="ts">
import { toast } from '@/function';
import { ref } from 'vue';
import InputError from './InputError.vue';
import { useAuthStore } from '@/stores/auth';
import { CapacitorHttp } from '@capacitor/core';

const updatePassword = ref<{
    current_password: string;
    password: string;
    password_confirmation: string;
}>({
    current_password: '',
    password: '',
    password_confirmation: ''
});

const errors = ref<Record<string, string>>({});
const auth = useAuthStore();

const submit = async () => {
    errors.value = {};
    try {
        const options= {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/password`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
             data: updatePassword.value
        }

        const response = await CapacitorHttp.get(options);

        updatePassword.value = {
            current_password: '',
            password: '',
            password_confirmation: ''
        };

        toast('top', 'Password was changed successfully!')

        console.log(response);
    } catch (error: any) {
        if (error.response && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            toast('top', 'An unexpected error occurred. Please try again.');
        }
    }
}

</script>
<template>
    <form @submit.prevent="submit" class="p-5 bg-green-200 rounded-badge shadow-md">
        <div>
            <h1>Change Password</h1>
        </div>
        <div>
            <label for="line2" class="label">
                <span class="label-text">Current Password:</span>
            </label>
            <input v-model="updatePassword.current_password" type="password" id="line2"
                class="input input-bordered w-full" />
            <InputError :message="errors.current_password" />
        </div>
        <div>
            <label for="line2" class="label">
                <span class="label-text">New Password:</span>
            </label>
            <input v-model="updatePassword.password" type="password" id="line2" class="input input-bordered w-full" />
            <InputError :message="errors.password" />
        </div>
        <div>
            <label for="line2" class="label">
                <span class="label-text">Password Confirmation:</span>
            </label>
            <input v-model="updatePassword.password_confirmation" type="password" id="line2"
                class="input input-bordered w-full" />
        </div>
        <div class="flex  justify-end mt-5">
            <button type="submit"
                class=" bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">
                Submit
            </button>
        </div>
    </form>
</template>