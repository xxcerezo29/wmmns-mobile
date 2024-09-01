<script setup lang="ts">
import MapComponent from '@/Components/Map/MapComponent.vue';
import { 
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent
 } from '@ionic/vue';

</script>
<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar >
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>Map</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 h-full min-h-full">
                <MapComponent />
            </div>
            
        </ion-content>
    </ion-page>
</template>