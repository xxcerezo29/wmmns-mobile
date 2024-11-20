<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { CapacitorHttp } from "@capacitor/core";
import {
  IonProgressBar,
  IonSkeletonText,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonButtons,
  IonTitle,
} from "@ionic/vue";
import { onMounted, ref } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";

const schedules = ref<
  Array<{
    id: number;
    start: string;
    ennd: string;
    title: string;
    icon: string;
    content: string;
    contentFull: string;
    class: string;
  }>
>([]);
const loading = ref(false);
const isOpen = ref(false);
const setOpen = (open: boolean) => (isOpen.value = open);

const selectedSched = ref();

const auth = useAuthStore();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleEventClick = (event: any, e: any) => {
  selectedSched.value = event;
  setOpen(true);
};

onMounted(async () => {
  try {
    loading.value = true;

    const options = {
      url: import.meta.env.VITE_WMMNS_API_URL + `/api/schedule`,
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
  } finally {
    loading.value = false;
  }
});
</script>
<template>
  <div class="min-h-screen flex flex-col gap-2 pt-4">
    <ion-modal :is-open="isOpen" v-if="selectedSched">
      <ion-header>
        <ion-toolbar>
          <ion-title>{{ selectedSched.title }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="setOpen(false)">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-html="selectedSched.contentFull"></div>
      </ion-content>
    </ion-modal>
    <ion-progress-bar
      v-if="loading"
      type="indeterminate"
      color="primary"
    ></ion-progress-bar>
    <vue-cal
      v-if="schedules"
      class="md:col-span-10 h-full"
      :events="schedules"
      events-on-month-view="short"
      :snap-to-time="15"
      :disable-views="['years']"
      :on-event-click="handleEventClick"
    />

    <div v-else class="flex flex-col gap-2 p-4">
      <div class="bg-green-400 p-4 rounded-xl">
        <div class="flex justify-between">
          <div class="w-full">
            <ion-skeleton-text
              :animated="true"
              style="width: 80px"
            ></ion-skeleton-text>
            <ion-skeleton-text
              :animated="true"
              class="w-full"
            ></ion-skeleton-text>
            <ion-skeleton-text
              :animated="true"
              class="w-full"
            ></ion-skeleton-text>
            <ion-skeleton-text
              :animated="true"
              class="w-full"
            ></ion-skeleton-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
