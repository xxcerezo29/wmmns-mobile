<script setup lang="ts">
import Menu from '@/Components/Menu.vue';
import { useAuthStore } from '@/stores/auth';
import {
  IonPage,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabs,
} from '@ionic/vue';

import {
  mapOutline,
  calendarOutline,
  homeOutline
} from 'ionicons/icons'
import { useRoute } from 'vue-router';

const route = useRoute();

const auth = useAuthStore();

</script>

<template>
  <ion-page id="main-app">
    <ion-tabs>
      <Menu />
      <ion-router-outlet id="main-content" />
      <ion-tab-bar slot="bottom">
        <ion-tab-button v-if="auth.type === 'driver'" tab="route" href="/auth/route" :class="{
          'text-green-500': route.path === '/auth/route',
          'text-gray-500': route.path !== '/auth/route'
        }">
          <ion-icon :icon="mapOutline" />
          <ion-label>Route</ion-label>
        </ion-tab-button>
        <ion-tab-button v-else tab="map" href="/auth/map" :class="{
          'text-green-500': route.path === '/auth/map',
          'text-gray-500': route.path !== '/auth/map'
        }">
          <ion-icon :icon="mapOutline" />
          <ion-label>Map</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="home" href="/auth" :class="{
          'text-green-500': route.path === '/auth',
          'text-gray-500': route.path !== '/auth'
        }">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="schedule" href="/auth/schedule" :class="{
          'text-green-500': route.path === '/auth/schedule',
          'text-gray-500': route.path !== '/auth/schedule'
        }">
          <ion-icon :icon="calendarOutline"/>
          <ion-label>Schedule</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>

  </ion-page>
</template>