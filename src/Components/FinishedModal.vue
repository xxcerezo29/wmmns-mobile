<script lang="ts" setup>
import { formatDate } from '@/function';
import router from '@/router';
import api from '@/services/api';
import { useRoamStore } from '@/stores/roam';
import {
    IonProgressBar,
    modalController,
} from '@ionic/vue';
import { ref } from 'vue';
const loading = ref(false);
const name = ref();

const roam = useRoamStore();

const cancel = () => modalController.dismiss(null, 'cancel');
const confirm = async () => {
    loading.value = true;
    try {
        const ended = formatDate(new Date());
        await api.post('/roams/end/'+roam.id, {
            ended: ended
        });
    } catch (error) {
        console.error('Failed to end roam:', error);
    } finally {
        loading.value = false;

        roam.setEmpty();

        router.push('/auth/');
        modalController.dismiss(name.value, 'confirm');
    }
}
</script>

<template>
    <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
    <div style="padding: 20px; text-align: center;">
        <h2>You have reached the final destination!</h2>
        <ion-button expand="block" @click="cancel">Close</ion-button>
        <ion-button expand="block" @click="confirm">Home</ion-button>
    </div>
</template>
