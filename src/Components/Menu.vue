<template>
    <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
    <ion-menu :swipeGesture="swipe" content-id="main-content" side="start" menuId="first">

        <ion-header>
            <ion-toolbar>
                <ion-title>Menu</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list>
                <ion-item button @click="goTo('/auth/profile')">Profile</ion-item>
                <ion-item button @click="logout">Logout</ion-item>
            </ion-list>
        </ion-content>
    </ion-menu>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import router from '@/router';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonProgressBar } from '@ionic/vue';
import { ref } from 'vue';

const swipe = ref(true);

const goTo = (path: string) => {
    router.push(path);
};

const authStore = useAuthStore();
const loading = ref(false);


const logout = async () => {
    loading.value = true
    try {
        const response = await authStore.logout();
        if (response === true) {
            setTimeout(() => {
                router.replace('/');
            }, 100);
            
        }

    } finally {
        loading.value = false;
    }

};
</script>