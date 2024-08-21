<script setup lang="ts">

import { IonPage } from '@ionic/vue';
import MainComponent from '@/Components/FormWizzards/Register/MainComponent.vue';

</script>

<template>
    <ion-page>
        <div class="min-h-screen">
            <div class="flex justify-center">
                <div class="bg-white min-h-screen flex justify-center items-center">
                    <div>
                        <MainComponent />
                    </div>
                </div>
            </div>
        </div>
    </ion-page>
</template>