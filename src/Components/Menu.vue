<template>
    <ion-menu  swipeGesture="false" content-id="main-content" side="start" menuId="first">
        <ion-header>
            <ion-toolbar>
                <ion-title>Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item button @click="goTo('/home')">Home</ion-item>
                <ion-item button @click="goTo('/profile')">Profile</ion-item>
                <ion-item button @click="goTo('/settings')">Settings</ion-item>
                <ion-item button @click="logout">Logout</ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonButton } from '@ionic/vue';
import { ref, watchEffect } from 'vue';

const goTo = (path: string) => {
    router.push(path);
};

const authStore = useAuthStore();

const logout = () => {
    authStore.logout();
    setTimeout(() => {
    router.push('/login');
  }, 100);
};
</script>