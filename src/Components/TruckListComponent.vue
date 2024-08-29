<script setup lang="ts">
import api from '@/services/api';
import { TruckIcon } from '@heroicons/vue/24/outline';
import { onMounted, ref } from 'vue';

interface truck {
    id: number;
    barangay: string;
    plate_number: string;
}

const trucksToday = ref<Array<truck>>();

onMounted(async ()=> {

    try{
        const truckResponse = await api.get('/schedule/get-trucks-today');
        trucksToday.value = truckResponse.data.trucks;
    }catch(error: any){
        if(error.response){
            // s
        }
    }
})

</script>

<template>
    <div class="bg-green-400 rounded-full overflow-hidden">
        <div class="flex gap-2 p-4 px-9 overflow-auto ">
            <div  v-if="trucksToday?.length">
                <div v-for="truck in trucksToday" :key="truck.id" class="max-w-14 truncate min-w-14">
                    <div class="bg-slate-200 p-4 rounded-full ">
                        <TruckIcon class="h-7" />
                    </div>
                    <span>{{truck.plate_number}}</span>
                </div>
            </div>
            <div v-else  class=" min-w-14">
                <span>No Truck on schedule.</span>
            </div>
        </div>
        
    </div>
</template>