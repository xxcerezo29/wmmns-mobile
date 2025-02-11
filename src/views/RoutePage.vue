<script setup lang="ts">
import DriverMapComponent from "@/Components/Map/DriverMapComponent.vue";
import { formatDate, formatTime, isScheduleMissed } from "@/function";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { useRoamStore } from "@/stores/roam";
import { CapacitorHttp } from "@capacitor/core";
import { Cog6ToothIcon, MapIcon } from "@heroicons/vue/24/outline";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonProgressBar,
  IonSkeletonText,
} from "@ionic/vue";
import { onMounted, ref } from "vue";

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
  };
}

const waypoints = ref<string>();

const schedules = ref<Array<schedule>>();

const auth = useAuthStore();
const loading = ref(false);
const roam = useRoamStore();

const view = (id: number) => {
  const sched = schedules.value?.find((item) => item.id === id);
  if (!sched) return;

  waypoints.value = sched.route.waypoint;
};

const start = async (id: number) => {
  loading.value = true;
  try {
    const started = formatDate(new Date());
    const options = {
      url: import.meta.env.VITE_WMMNS_API_URL + "/api/roams/start",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      data: {
        driver_id: auth.user?.id,
        schedule_id: id,
        started: started,
      },
    };

    const response = await CapacitorHttp.post(options);

    console.log(response);

    if (response.data.roam) roam.setRoam(response.data.roam);

    router.push("/driver/" + id);
  } catch (error) {
    console.error("Failed to start roam:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const today = new Date();
    const day = today.toISOString().split("T")[0];

    const options = {
      url:
        import.meta.env.VITE_WMMNS_API_URL + "/api/schedule/get-by-day/" + day,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
    };

    const response = await CapacitorHttp.get(options);
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
      <ion-progress-bar
        v-if="loading"
        type="indeterminate"
        color="primary"
      ></ion-progress-bar>
      <div class="bg-gradient-to-t from-green-400 to-white-500 h-full">
        <div class="h-1/2 min-h-1/2">
          <DriverMapComponent :waypoints="waypoints" />
        </div>
        <div class="p-6" v-if="!loading">
          <div v-if="schedules?.length" class="flex flex-col gap-2">
            <div
              v-for="schedule in schedules"
              :key="schedule.id"
              class="text-white bg-green-400 p-4 rounded-xl"
            >
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
                  <ul
                    tabindex="0"
                    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                  >
                    <li>
                      <button @click="view(schedule.id)" class="!text-black">
                        View
                      </button>
                    </li>
                    <li>
                      <button
                        @click="start(schedule.id)"
                        class="!text-black disabled:line-through"
                      >
                        Start
                        <span
                          class="text-red-500"
                          v-if="isScheduleMissed(schedule.time)"
                          >Missed Schedule</span
                        >
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <span>Start Time: {{ formatTime(schedule.time) }}</span>
                <span
                  v-if="isScheduleMissed(schedule.time)"
                  class="text-red-500"
                >
                  - Missed Schedule</span
                >
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="flex flex-col gap-2">
            <div class="text-white bg-green-400 p-4 rounded-xl">
              <div class="flex justify-between">
                <div>
                  <ion-skeleton-text :animated="true"></ion-skeleton-text>
                  <ion-skeleton-text :animated="true"></ion-skeleton-text>
                </div>
              </div>
              <div>
                <ion-skeleton-text :animated="true"></ion-skeleton-text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
