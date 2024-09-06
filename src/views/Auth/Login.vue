<script setup lang="ts">
import PrimaryButton from '@/Components/daisyUI/PrimaryButton.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { IonPage,IonProgressBar  } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = ref<{
    email: string;
    password: string;
    type: string;
    remember: boolean
}>(
    {
        email: '',
        password: '',
        type: '',
        remember: false
    }
);

const loading = ref(false);



const login = async () => {
    loading.value = true;
    try {
        
        const response = await authStore.login(form.value?.email, form.value?.password, form.value?.type, form.value.remember);
        if (authStore.user) {
            form.value = {
                email: '',
                password: '',
                type: '',
                remember: false,
            }
            router.push('/auth/');
        }

        console.log(response);
    }catch(error){
        alert(error);
    }
    finally {
        loading.value = false;
    }
}

watch(() => form.value, () => {
    authStore.clearErrors();
}, { deep: true });

</script>

<template>
    <ion-page>
        <div class="min-h-screen bg-green-400">
            <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
            <div
                class="flex flex-col m-auto justify-around items-centerw-full max-w-sm h-screen rounded-lg overflow-hidden">
                <div class="w-full h-1/2">
                    <img src="../../Assets/bg-garbage.png" alt="Welcome Image" class="w-full h-full object-cover">
                </div>
                <div class="p-6 w-full">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">Welcome Back!</h1>
                    </div>
                    <div class="w-full">
                        <form class="w-full" @submit.prevent="login">
                            <div>
                                <InputLabel for="email" value="Email" />

                                <input v-model="form.email" type="email" placeholder="Email"
                                    class="input input-bordered w-full" required autofocus />

                                <InputError class="mt-2" v-if="authStore.errors.email"
                                    :message="authStore.errors.email[0]" />
                            </div>
                            <div class="mt-4 w-full">
                                <InputLabel for="password" value="Password" />

                                <input v-model="form.password" type="password" placeholder="Password"
                                    class="input input-bordered w-full" required autofocus />


                                <InputError class="mt-2" v-if="authStore.errors.password"
                                    :message="authStore.errors.password[0]" />
                            </div>
                            <div class="mt-4 w-full">

                                <label class="form-control w-full">
                                    <div class="label">
                                        <span class="label-text">User Type</span>
                                    </div>
                                    <select v-model="form.type" class="w-full select select-bordered">
                                        <option disabled selected value="">Pick one</option>
                                        <option value="resident">Resident</option>
                                        <option value="driver">Driver</option>
                                    </select>
                                    <InputError class="mt-2" :message="authStore.errors.type" />
                                </label>
                            </div>
                            <div class="block mt-4">
                                <label class="flex items-center">
                                    <input v-model="form.remember" type="checkbox" class="checkbox" />
                                    <span class="ms-2 text-sm text-gray-600">Remember me</span>
                                </label>
                            </div>
                            <div class="flex flex-col w-full items-center justify-end mt-4 gap-2">
                                <button type="submit"
                                    :disabled="loading"
                                    class="w-full bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">
                                    Login
                                </button>
                                <a href="/"
                                    class="border-2 border-white text-white text-lg text-center p-3 rounded  transition w-full">Cancel</a>
                                <button
                                    class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Forgot your password?
                                </button>

                            </div>
                            <InputError class="mt-2" :message="authStore.errors.general" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </ion-page>

</template>