<script setup lang="ts">
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { CapacitorHttp } from '@capacitor/core';
import { TruckIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref } from 'vue';

interface truck {
    id: number;
    barangay: string;
    plate_number: string;
}

const trucksToday = ref<Array<truck>>();
const loading = ref(false);
const auth = useAuthStore();

onMounted(async () => {

    try {
        loading.value = true;

        const options= {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/schedule/get-trucks-today`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }

        const truckResponse = await CapacitorHttp.get(options);

        trucksToday.value = truckResponse.data.trucks;
    } catch (error: any) {
        if (error.response) {
            // s
        }
    }finally {
        loading.value = false;
    }
})

</script>

<template>
    <div class="bg-green-400 rounded-full overflow-hidden">
        <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
        <div class="flex gap-2 p-4 px-9 overflow-auto ">
            <div v-if="!loading">
                <div v-if="trucksToday?.length">
                    <div v-for="truck in trucksToday" :key="truck.id" class="max-w-14 truncate min-w-14">
                        <div class="bg-slate-200 p-4 rounded-full ">
                            <TruckIcon class="h-7" />
                        </div>
                        <span>{{ truck.plate_number }}</span>
                    </div>
                </div>
                <div v-else class=" min-w-14">
                    <span>No Truck on schedule.</span>
                </div>
            </div>
            <div v-if="loading">
                <div class="max-w-14 truncate min-w-14">
                    <div class="bg-slate-200 p-4 rounded-full ">
                        <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text>
                    </div>
                    <ion-skeleton-text :animated="true" style="width: 80px"></ion-skeleton-text>
                </div>
            </div>
            
        </div>

    </div>
</template>