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
        <ion-header>
            <ion-toolbar>
                <ion-buttons>
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>ROUTE</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 min-h-full">
                <MapComponent />
            </div>
            
        </ion-content>
    </ion-page>
</template>