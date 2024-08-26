<script setup lang="ts">
import Menu from '@/Components/Menu.vue';
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

</script>

<template>
    <ion-page id="main-app">
      <ion-tabs>
        <Menu />
        <ion-router-outlet id="main-content"/>
        <ion-tab-bar slot="bottom" class="bg-white border-t shadow-md">
          <ion-tab-button tab="route" href="/auth/route" class="flex flex-col items-center text-gray-500" 
          :class="{
            'text-green-500': route.path === '/auth/route',
            'text-gray-500': route.path !== '/auth/route'
          }">
            <ion-icon  :icon="mapOutline" class="w-6 h-6"/>
            <ion-label class="text-xs">Route</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="home" href="/auth/" class="flex flex-col items-center text-gray-500"
          :class="{
            'text-green-500': route.path === '/auth/',
            'text-gray-500': route.path !== '/auth/'
          }">
            <ion-icon  :icon="homeOutline" class="w-6 h-6"/>
            <ion-label class="text-xs">Home</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="schedule" href="/auth/schedule" class="flex flex-col items-center text-gray-500"
          :class="{
            'text-green-500': route.path === '/auth/schedule',
            'text-gray-500': route.path !== '/auth/schedule'
          }">
            <ion-icon  :icon="calendarOutline" class="w-6 h-6"/>
            <ion-label class="text-xs">Schedule</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
       
    </ion-page>
</template>