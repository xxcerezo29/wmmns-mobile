<script setup lang="ts">
import api from '@/services/api';
import { MapIcon } from '@heroicons/vue/24/outline';
import { computed, onMounted, ref } from 'vue';

interface schedule {
    id: number;
    barangay: string;
    day: string;
    truck_id: number;
    route_id: number;
    time: string;
    truck_plate: string;
}

interface groupedSchedule {
    [day: string]: schedule[];
}
const schedules = ref<groupedSchedule>({});

const selectedDay = ref<string>('');
const todaySchedule = computed(() => {
    if (schedules.value)
        return schedules.value[selectedDay.value] || [];
    else
        return []
})

const selectDay = (day: string) => {
    selectedDay.value = day;
}

onMounted(async () => {
    try {
        const response = await api.get('/schedule');

        schedules.value = response.data.schedules;

    } catch (error: any) {
        if (error.response) {
            // s
        }
    }

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date();
    selectedDay.value = days[today.getDay()];
})

const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);
}

</script>
<template>
    <div class="min-h-screen flex flex-col gap-2 pt-4">
        <div class="bg-green-400 rounded-full overflow-hidden">
            <div class="flex gap-2 p-4 px-9 overflow-auto">
                <div v-for="(day, index) in ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']"
                    :key="index" class="max-w-14 truncate min-w-14">
                    <div :class="[
                    'p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105',
                    selectedDay === day ? 'bg-blue-700' : 'bg-blue-300'
                ]" @click="selectDay(day)">
                        <h4 class="text-white font-semibold text-lg">{{ day.charAt(0).toUpperCase() }}</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">{{
                    day.charAt(0).toUpperCase() + day.slice(1) }}</span>
                </div>
            </div>
        </div>
        <h2 class="p-4 text-lg font-semibold mb-2">Schedules for {{ selectedDay.charAt(0).toUpperCase() +
            selectedDay.slice(1) }}</h2>
        <div v-if="todaySchedule.length" class="flex flex-col gap-2 p-4">
            <div v-for="schedule in todaySchedule" :key="schedule.id" class="bg-green-400 p-4 rounded-xl">
                <div  class="flex justify-between">
                    <div>
                        <MapIcon class="w-7" />
                        <h3 class="text-md font-medium">{{ schedule.barangay }}</h3>
                        <span>Truck: {{ schedule.truck_plate}}</span><br>
                        <span>{{ formatTime(schedule.time) }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="bg-gray-200 p-4 rounded-xl">
            <p>No schedules available for this day.</p>
        </div>
    </div>


</template>