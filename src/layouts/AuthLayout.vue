<script setup lang="ts">
import Menu from "@/Components/Menu.vue";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import {
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabs,
} from "@ionic/vue";

import {
  mapOutline,
  calendarOutline,
  homeOutline,
  documentsOutline,
} from "ionicons/icons";

const auth = useAuthStore();

const navigateTo = (path: string) => {
  router.replace(path);
};
</script>

<template>
  <ion-page id="main-app">
    <ion-tabs>
      <Menu />
      <ion-router-outlet id="main-content" />
      <ion-tab-bar slot="bottom">
        <ion-tab-button
          v-if="auth.type === 'driver'"
          tab="route"
          @click="navigateTo('/auth/route')"
        >
          <ion-icon :icon="mapOutline" />
          <ion-label>Route</ion-label>
        </ion-tab-button>
        <ion-tab-button v-else tab="map" @click="navigateTo('/auth/map')">
          <ion-icon :icon="mapOutline" />
          <ion-label>Map</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="home" @click="navigateTo('/auth/home')">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="schedule" @click="navigateTo('/auth/schedule')">
          <ion-icon :icon="calendarOutline" />
          <ion-label>Schedule</ion-label>
        </ion-tab-button>
        <ion-tab-button
          v-if="auth.type === 'resident'"
          tab="complaint"
          @click="navigateTo('/auth/complaints')"
        >
          <ion-icon :icon="documentsOutline" />
          <ion-label>Complaints</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
