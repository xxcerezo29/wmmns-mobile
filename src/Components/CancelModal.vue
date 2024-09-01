<script lang="ts" setup>
import router from '@/router';
import {
    modalController,
} from '@ionic/vue';
import { ref } from 'vue';
const name = ref();

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = () => {
    router.push('/auth/');
    modalController.dismiss(name.value, 'confirm');
} 
</script>

<template>
    <div style="padding: 20px; text-align: center;">
        <h2>Are you sure you want to cancel?</h2>
        <ion-button expand="block" @click="cancel">No</ion-button>
        <ion-button expand="block" @click="confirm">Yes</ion-button>
    </div>
</template>
