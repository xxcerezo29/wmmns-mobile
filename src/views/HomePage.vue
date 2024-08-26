<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>Home</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true" >
            <div class="bg-gradient-to-t from-green-400 to-white-500 min-h-full">
                <div class="py-4">
                    <TruckListComponent />
                    <div class="p-4">
                        <div class="flex gap-2">
                            <MapPinIcon class="w-7" />
                            <h1>Today Route</h1>
                        </div>
                        <div class="flex flex-col gap-2">
                            <div class="bg-green-400 p-4 rounded-xl">
                                <div class="flex justify-between">
                                    <div>
                                        <MapIcon class="w-7" />
                                        <h1>Route Name</h1>
                                    </div>
                                    <div class="dropdown dropdown-end">
                                        <div tabindex="0" role="button">
                                            <button class="bg-green-100 rounded-full p-4">
                                                <Cog6ToothIcon class="w-7" />
                                            </button>
                                        </div>
                                        <ul tabindex="0"
                                            class="dropdown-content  menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                            <li><a class="!text-black">View</a></li>
                                            <li><a class="!text-black">Start</a></li>
                                        </ul>
                                    </div>

                                </div>
                                <div>
                                    <span>Tr</span>
                                </div>
                                <div>
                                    <span>6:30 AM</span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>


        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import TruckListComponent from '@/Components/TruckListComponent.vue';
import { Cog6ToothIcon, MapIcon, MapPinIcon } from '@heroicons/vue/24/outline';
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButtons, IonMenuButton } from '@ionic/vue';

</script>