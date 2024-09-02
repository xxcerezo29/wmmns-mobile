<script lang="ts" setup>
import router from '@/router';
import api from '@/services/api';
import { useRoamStore } from '@/stores/roam';
import {
    modalController,
} from '@ionic/vue';
import { ref } from 'vue';
const name = ref();
const loading = ref(false);

const roam = useRoamStore();

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = async () => {
    loading.value = true;

    try{
        await api.post('/roams/cancel/'+roam.id);
    }catch (error) {
        console.error('Failed to end roam:', error);
    }finally {
        loading.value = false;

        roam.setEmpty();

        router.push('/auth/');
    modalController.dismiss(name.value, 'confirm');
    }

    
} 
</script>

<template>
    <div style="padding: 20px; text-align: center;">
        <h2>Are you sure you want to cancel?</h2>
        <ion-button expand="block" @click="cancel">No</ion-button>
        <ion-button expand="block" @click="confirm">Yes</ion-button>
    </div>
</template>
