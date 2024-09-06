<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InputError from './InputError.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { Resident } from '@/Types/inerface';
import api from '@/services/api';
import { toast } from '@/function';
import { CapacitorHttp } from '@capacitor/core';

const auth = useAuthStore();

const updatePersonal = ref<Resident>({
    firstname: '',
    middlename: '',
    lastname: '',
    email: '',
    line1: '',
    line2: '',
    barangay: '',
    city: '',
    country: '',
    province: '',
    id: 0,
});

const errors = ref<Record<string, string>>({});



interface ICities {
    code: number,
    name: string,
    regionCode: string,
}

const barangay = ref<Array<ICities>>([]);

const submit = async () => {
    errors.value = {};
    try {

        const options= {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/profile/resident`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            data: updatePersonal.value
        }

        const response = await CapacitorHttp.post(options);
        
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

    if (auth.user && Object.prototype.hasOwnProperty.call(auth.user, 'line1')) {
        const resident = auth.user as Resident;
        updatePersonal.value = {
            ...resident
        }
    }

    axios.get('https://psgc.gitlab.io/api/cities/023135000/barangays')
        .then((response: any) => {
            barangay.value = response.data
        }).catch((err: any) => {
            toast('top', 'Failed to load barangays. Please try again.');
        })
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
            <InputError :message="errors.firstname" class="mt-2" />
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
            <h1>Address</h1>
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Line1:</span>
            </label>
            <input v-model="updatePersonal.line1" type="text" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.line1" class="mt-2" />
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Line2:</span>
            </label>
            <input v-model="updatePersonal.line2" type="text" id="line1" class="input input-bordered w-full" />
            <InputError :message="errors.line2" class="mt-2" />
        </div>
        <div>
            <label for="line1" class="label">
                <span class="label-text">Barangay:</span>
            </label>
            <select v-model="updatePersonal.barangay" class="select select-bordered w-full">
                <option disabled selected value="">Please select a barangay</option>
                <option v-for="(_barangay, index) in barangay" :key="index" :value="_barangay.name">{{ _barangay.name }}
                </option>
            </select>
            <InputError :message="errors.barangay" class="mt-2" />
        </div>

        <div class="flex  justify-end mt-5">
            <button type="submit"
                class=" bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">
                Submit
            </button>
        </div>
    </form>
</template>