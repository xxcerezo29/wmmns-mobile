<template>
  <ion-app>
    <Menu v-if="showMenu"/>
    <ion-router-outlet id="main-content"/>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonApp,
  IonRouterOutlet,
} from '@ionic/vue';
import Menu from './Components/Menu.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const showMenu = computed(() => route.path !== '/login' && route.path !== '/register');
</script>
