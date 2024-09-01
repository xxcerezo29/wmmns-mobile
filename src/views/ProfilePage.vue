<script setup lang="ts">

import DriverPersonalInfoUpdate from '@/Components/DriverPersonalInfoUpdate.vue';
import PasswordChange from '@/Components/PasswordChange.vue';
import ResidentPersonalInfoUpdate from '@/Components/ResidentPersonalInfoUpdate.vue';
import { useAuthStore } from '@/stores/auth';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent
} from '@ionic/vue';

const auth = useAuthStore();


</script>

<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>Profile</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500  min-h-full mt-4 p-5 flex flex-col gap-2">
                <DriverPersonalInfoUpdate v-if="auth.type === 'driver'" />
                <ResidentPersonalInfoUpdate v-else />
                <PasswordChange />
            </div>
        </ion-content>
    </ion-page>
</template>