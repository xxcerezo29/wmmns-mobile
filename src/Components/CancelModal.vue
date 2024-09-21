<script lang="ts" setup>
import router from '@/router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useRoamStore } from '@/stores/roam';
import { CapacitorHttp } from '@capacitor/core';
import {
    modalController,
    IonButton
} from '@ionic/vue';
import { ref } from 'vue';
const name = ref();
const loading = ref(false);

const roam = useRoamStore();
const auth = useAuthStore();

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = async () => {
    loading.value = true;
    try{

        const options= {
            url: import.meta.env.VITE_WMMNS_API_URL + '/api/roams/cancel/'+roam.id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
        }
        const response = await CapacitorHttp.post(options);
        roam.stopTrackingLocation();
        
    }catch (error) {
        console.error('Failed to end roam:', error);
    }finally {
        loading.value = false;

        roam.setEmpty();

        router.push('/auth/home');
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
