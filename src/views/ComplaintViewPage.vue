<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButtons, IonBackButton, IonProgressBar } from '@ionic/vue';
import { caretBack } from 'ionicons/icons';
import { Resident, Schedule } from '@/Types/inerface';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { CapacitorHttp } from '@capacitor/core';
import { toast } from '@/function';
import router from '@/router';
import { format } from 'date-fns';

interface Icomplaint {
    id: number;
    reference_number: string;
    resident_id: number;
    schedule_id: number;
    report_type: string;
    location: string;
    barangay: string;
    description: string;
    status: string;
    photo_url: string;
    resolved_at: string;
    resident: Resident;
    schedule: Schedule;
    created_at: string;
    updated_at: string;
}

const loading = ref(false);

const selectedImage = ref('');

const selectImage = (image: string)  => {
    selectedImage.value = image;
} 

const complaint = ref<Icomplaint>();
const auth = useAuthStore();

const route = useRoute();
const complaintId = route.params.complaintId;

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy h:mm a'); // Example format: "September 07, 2024 9:00 AM"
};

const formatReportType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const url = import.meta.env.VITE_WMMNS_API_URL;


onMounted(async () => {
    try {
        loading.value = true;

        const options = {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/complaints/show/${complaintId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }

        const response = await CapacitorHttp.get(options);

        if(response.data.success === true)
            complaint.value = response.data.report
        else{
            toast('top', response.data.message);
            router.push('/auth/complaints')
        }


    } catch (error: any) {
        if (error.response) {
            // s
        }
    } finally {
        loading.value = false;
    }

})

</script>
<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button :icon="caretBack" default-href="/auth/complaints"></ion-back-button>
                </ion-buttons>
                <ion-title>Complaint Details</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 min-h-full">
                <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
                <div class="py-4">
                    <div class="p-4">
                        <dl class="sm:divide-y sm:divide-gray-200">
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Reference Number
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ complaint?.reference_number }}
                                </dd>
                            </div>
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Status
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div class="badge text-white uppercase" :class="{
                                        'bg-green-600': complaint?.status === 'resolved',
                                        'bg-yellow-600' : complaint?.status === 'reviewed',
                                        'bg-red-600': complaint?.status === 'pending',
                                        'bg-gray-600': complaint?.status === 'closed'
                                    }">{{ complaint?.status }}</div>
                                </dd>
                            </div>
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Fullname
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ complaint?.resident.firstname }} {{ complaint?.resident.middlename }} {{ complaint?.resident.lastname }}
                                </dd>
                            </div>
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Report Type
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ formatReportType(complaint?.report_type?? '') }}
                                </dd>
                            </div>
                            <div v-if="complaint?.schedule_id" class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Schedule
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ complaint.schedule.day }}-{{ complaint.schedule.time }}: 
                                </dd>
                            </div>
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Description
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ complaint?.description }}
                                </dd>
                            </div>
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Photo
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div  v-if="complaint?.photo_url"  class="grid gap-4">
                                        <div v-if="selectedImage">
                                            <img class="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                                                :src="url + '/storage/'+selectedImage"
                                                alt="" />
                                        </div>
                                        <div v-else>
                                            Click an  Image to Enlarge.
                                        </div>
                                        <div class="grid grid-cols-5 gap-4">
                                            <div @click="selectImage(image)" v-for="(image, index) in JSON.parse(complaint.photo_url)" :key="index">
                                                <img
                                                  :src="url + '/storage/'+image"
                                                  class="object-cover object-center h-20 max-w-full rounded-lg cursor-pointer" alt="gallery-image" />
                                              </div>
                                        </div>
                                    </div>
                                    <span v-else>No Photos uploaded</span>
                                </dd>
                            </div>
                            <div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Barangay
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ complaint?.barangay }}
                                </dd>
                            </div>
                            <div v-if="complaint?.resolved_at" class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt class="text-sm font-medium text-gray-500">
                                    Resolved At
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {{ formatDate(complaint.resolved_at) }}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>