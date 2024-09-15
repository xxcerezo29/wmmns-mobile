<template>
  <ion-app>
    <ion-router-outlet id="main-app" class="bg-slate-400" />
  </ion-app>
</template>

<script setup lang="ts">
import {
  alertController,
  IonApp,
  IonRouterOutlet,
} from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { Network } from '@capacitor/network';

const isConnected = ref(true);

const showAlert = async () => {
  const alert = await alertController.create({
    header: 'No Internet Connection',
    message: 'Please check your internet connection and try again.',
    buttons: ['OK'],
  });
  await alert.present();
};

const checkNetworkStatus = async () => {
  const status = await Network.getStatus();
  isConnected.value = status.connected;
  if (!status.connected) {
    showAlert();
  }
};

const listenToNetworkChanges = () => {
      Network.addListener('networkStatusChange', (status) => {
        isConnected.value = status.connected;
        if (!status.connected) {
          showAlert();
        }
      });
    };

onMounted(async () => {
  onMounted(() => {
      checkNetworkStatus();
      listenToNetworkChanges();
    });
})
</script>
