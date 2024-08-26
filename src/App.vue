<template>
  <ion-app>
    <ion-router-outlet id="main-app" class="bg-slate-400"/>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/vue';
// import Menu from './Components/Menu.vue';
// import { useRoute } from 'vue-router';
// import { computed } from 'vue';

// const route = useRoute();

// const showMenu = computed(() => route.path !== '/login' && route.path !== '/register');
</script>
