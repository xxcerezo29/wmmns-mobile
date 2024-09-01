<script setup lang="ts">
import DriverMapComponent from '@/Components/Map/DriverMapComponent.vue';
import { formatTime, isScheduleMissed } from '@/function';
import api from '@/services/api';
import { Cog6ToothIcon, MapIcon } from '@heroicons/vue/24/outline';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent
} from '@ionic/vue';
import { onMounted, ref } from 'vue';

interface schedule {
    id: number;
    barangay: string;
    day: string;
    truck_id: number;
    route_id: number;
    time: string;
    route: {
        barangay: string;
        id: number;
        name: string;
        waypoint: string;
    };
    truck: {
        barangay: string;
        id: number;
        plate_number: string;
    }
}

const waypoints = ref<string>();

const schedules = ref<Array<schedule>>();


const view = (id: number) => {
    const sched = schedules.value?.find(item => item.id === id);
    if(!sched)
        return;

    waypoints.value = sched.route.waypoint

}

onMounted(async () => {
    try {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        const day = days[today.getDay()];

        const response = await api.get('/schedule/get-by-day/' + day);
        schedules.value = response.data.schedules;
    } catch (error: any) {
        if (error.response) {
            // s
        }
    }
});

</script>
<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>ROUTE</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 h-full">
                <div class=" h-1/2 min-h-1/2">
                    <DriverMapComponent :waypoints="waypoints" />
                </div>
                <div class="p-6 ">
                    <div v-if="schedules?.length" class="flex flex-col gap-2">
                        <div v-for="schedule in schedules" :key="schedule.id" class="text-white bg-green-400 p-4 rounded-xl">
                            <div class="flex justify-between">
                                <div>
                                    <MapIcon class="w-7" />
                                    <h1>{{ schedule.route.name }}</h1>
                                </div>
                                <div class="dropdown dropdown-end">
                                    <div tabindex="0" role="button">
                                        <button class="bg-green-100 rounded-full p-4 text-black">
                                            <Cog6ToothIcon class="w-7" />
                                        </button>
                                    </div>
                                    <ul tabindex="0"
                                        class="dropdown-content  menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li><a @click="view(schedule.id)" class="!text-black">View</a></li>
                                        <li><a class="!text-black">Start</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <span>Start Time: {{formatTime(schedule.time)}}</span>
                                <span v-if="isScheduleMissed(schedule.time)" class="text-red-500"> - Missed Schedule</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>