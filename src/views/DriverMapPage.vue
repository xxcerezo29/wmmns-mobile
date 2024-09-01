<script setup lang="ts">
import MapComponent from '@/Components/Map/MapComponent.vue';
import api from '@/services/api';
import {
    IonPage,
    IonContent
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

interface Ischedule {
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


const route = useRoute();
const scheduleId = route.params.scheduleId as string;

const schedule = ref<Ischedule>();

const waypoints = ref<Array<{ lat: number; lng: number }>>();

onMounted(async () => {
    try {
        const response = await api.get(`/schedule/get-by-id/${scheduleId}`);
        schedule.value = response.data.schedules;

        if(schedule.value?.route?.waypoint)
            waypoints.value = JSON.parse(schedule.value?.route?.waypoint)
    } catch (error) {
        console.error('Failed to fetch schedule:', error);
    }
})


</script>

<template>
    <ion-page id="main-content">
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 h-full min-h-full">
                <MapComponent :waypoints="waypoints!" />
            </div>
        </ion-content>
    </ion-page>
</template>