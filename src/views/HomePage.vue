<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>Home</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" >
            <div class="bg-gradient-to-t from-green-400 to-white-500 min-h-full">
                <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
                <div class="py-4">
                    <TruckListComponent v-if="auth.type === 'resident'" />
                    <div class="p-4">
                        <div class="flex gap-2">
                            <MapPinIcon class="w-7" />
                            <h1  v-if="auth.type === 'resident'">Today's Route</h1>
                            <h1  v-else-if="auth.type === 'driver'">My Today's Route</h1>
                        </div>
                        <div v-if="!loading">
                            <div v-if="schedules?.length" class="flex flex-col gap-2">
                                <div v-for="schedule in schedules" :key="schedule.id"  class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <div>
                                            <MapIcon class="w-7" />
                                            <h1>{{schedule.route_name}}</h1>
                                        </div>
                                        <div class="dropdown dropdown-end">
                                            <div tabindex="0" role="button">
                                                <button class="bg-green-100 rounded-full p-4">
                                                    <Cog6ToothIcon class="w-7" />
                                                </button>
                                            </div>
                                            <ul tabindex="0"
                                                class="dropdown-content  menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                                <li><a class="!text-black">View</a></li>
                                                <li><a class="!text-black">Start</a></li>
                                            </ul>
                                        </div>
    
                                    </div>
                                    <div>
                                        <span>Truck: {{ schedule.truck_plate}}</span>
                                    </div>
                                    <div>
                                        <span>{{formatTime(schedule.time)}}</span>
                                    </div>
                                </div>
    
                            </div>
                            <div v-else class="bg-gray-200 p-4 rounded-xl">
                                <p>No schedules available for this day.</p>
                            </div>
                        </div>
                        <div  v-if="loading">
                            <div class="flex flex-col gap-2">
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>

                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                    </div>
                </div>
            </div>


        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import TruckListComponent from '@/Components/TruckListComponent.vue';
import { formatTime } from '@/function';
import { useAuthStore } from '@/stores/auth';
import { CapacitorHttp } from '@capacitor/core';
import { Cog6ToothIcon, MapIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButtons, IonMenuButton, IonProgressBar, IonSkeletonText } from '@ionic/vue';
import { onMounted, ref } from 'vue';

interface schedule {
    id: number;
    barangay: string;
    day: string;
    truck_id: number;
    route_id: number;
    time: string;
    truck_plate: string;
    route_name: string;
}

const schedules = ref<Array<schedule>>();

const auth = useAuthStore();

const loading = ref(false);


onMounted(async () => {
    try{
        loading.value = true;
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        const day = days[today.getDay()];

        const options= {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/schedule/get-by-day/${day}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }

        const response = await CapacitorHttp.get(options);

        schedules.value = response.data.schedules;
    }catch(error: any){
        if(error.response){
            // s
        }
    }finally {
        loading.value = false;
    }
});

</script>