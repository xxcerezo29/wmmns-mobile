<template>
  <ion-app>
    <ion-router-outlet id="main-app" class="bg-slate-400" />
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/vue';
import { initializePushNotifications } from './push-notifications';
import { onMounted } from 'vue';


onMounted(async() => {
    
})
</script>
