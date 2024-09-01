<script setup lang="ts">

import { IonPage } from '@ionic/vue';
import MainComponent from '@/Components/FormWizzards/Register/MainComponent.vue';

</script>

<template>
    <ion-page>
        <div class="min-h-screen bg-green-400 ">
            <div
                class="flex flex-col m-auto justify-around items-center w-full max-w-sm h-screen rounded-lg overflow-hidden">
                <div class="w-full h-1/2">
                    <img src="../../Assets/bg-garbage.png" alt="Welcome Image" class="w-full h-full object-cover">
                </div>

                <MainComponent />
            </div>
        </div>
    </ion-page>
</template>