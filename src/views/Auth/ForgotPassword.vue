<script setup lang="ts">
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue';
import { IonPage, IonProgressBar } from '@ionic/vue';

const form = ref<{
    email: string;
    type: string;
}>(
    {
        email: '',
        type: '',
    }
);

const authStore = useAuthStore();

const loading = ref(false);

const forgot = async () => {
    loading.value = true;
    try {
        const response = await authStore.forgot(form.value.email, form.value.type)
        if (response === true) {
            router.push({
                name: 'reset-password',  // Use the route's name if you added it
                params: {
                    email: form.value.email,
                    type: form.value.type
                }
            });

            form.value = {
                email: '',
                type: '',
            }
        }
    } finally {
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
                        <h1 class="text-2xl font-bold text-gray-800">Forgot Password?</h1>
                    </div>
                    <div class="w-full">
                        <form class="w-full" @submit.prevent="forgot">
                            <InputError class="mt-2" />

                            <div>
                                <InputLabel for="email" value="Email" />

                                <input v-model="form.email" type="email" placeholder="Email"
                                    class="input input-bordered w-full" required autofocus />

                                <InputError class="mt-2" v-if="authStore.errors.email"
                                    :message="authStore.errors.email[0]" />
                            </div>
                            <div class="mt-4 w-full">

                                <label class="form-control w-full">
                                    <div class="label">
                                        <span class="label-text">User Type</span>
                                    </div>
                                    <select v-model="form.type" class="w-full select select-bordered" required>
                                        <option disabled selected value="">Pick one</option>
                                        <option value="resident">Resident</option>
                                        <option value="driver">Driver</option>
                                    </select>
                                    <InputError class="mt-2" :message="authStore.errors.type" />
                                </label>
                            </div>
                            <div class="flex flex-col w-full items-center justify-end mt-4 gap-2">
                                <button type="submit" :disabled="loading"
                                    class="w-full bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">
                                    Submit
                                </button>
                                <a href="/"
                                    class="border-2 border-white text-white text-lg text-center p-3 rounded  transition w-full">Cancel</a>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </ion-page>
</template>