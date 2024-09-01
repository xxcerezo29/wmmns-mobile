<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputError from './InputError.vue';
import { useAuthStore } from '@/stores/auth';
import { Driver } from '@/Types/inerface';
import api from '@/services/api';
import { toast } from '@/function';


const updatePersonal = ref<{
    firstname: string;
    middlename: string;
    lastname: string;
    email: string;
    mobile_number: string;
}>({
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    mobile_number: ''
});

const errors = ref<Record<string, string>>({});

const auth = useAuthStore();

const submit = async () => {
    errors.value = {};
    try {
        const response = await api.post('/profile/driver', updatePersonal.value);
        toast('top', 'Profile updated successfully!');
    } catch (error: any) {
        if (error.response && error.response.data.errors) {
            errors.value = error.response.data.errors;
        } else {
            toast('top', 'An unexpected error occurred. Please try again.');
        }
    }


}

onMounted(() => {
    if (auth.user) {
        const driver = auth.user as Driver;
        updatePersonal.value.firstname = driver.firstname;
        updatePersonal.value.middlename = driver.middlename;
        updatePersonal.value.lastname = driver.lastname;
        updatePersonal.value.email = driver.email;
        updatePersonal.value.mobile_number = driver.mobile_number;
    }
})
</script>
<template>
    <form @submit.prevent="submit" class="p-5 bg-green-200 rounded-badge shadow-md">
        <div>
            <h1>Personal Information</h1>
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Firstname:</span>
            </label>
            <input v-model="updatePersonal.firstname" type="text" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.firstname"  class="mt-2" />
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Middlename:</span>
            </label>
            <input v-model="updatePersonal.middlename" type="text" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.middlename" class="mt-2" />
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Lastname:</span>
            </label>
            <input v-model="updatePersonal.lastname" type="text" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.lastname" class="mt-2" />
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Email:</span>
            </label>
            <input v-model="updatePersonal.email" type="email" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.email" class="mt-2" />
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Mobile Number:</span>
            </label>
            <input v-model="updatePersonal.mobile_number" type="text" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.mobile_number" class="mt-2" />
        </div>

        <div class="flex  justify-end mt-5">
            <button type="submit"
                class=" bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">
                Submit
            </button>
        </div>
    </form>
</template>