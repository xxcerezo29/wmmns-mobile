<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButtons, IonMenuButton, IonProgressBar, IonSkeletonText } from '@ionic/vue';
import { DocumentIcon } from '@heroicons/vue/24/outline';
import PrimaryButton from '@/Components/daisyUI/PrimaryButton.vue';
import { Resident, Schedule } from '@/Types/inerface';
import { useAuthStore } from '@/stores/auth';
import { CapacitorHttp } from '@capacitor/core';
import { format } from 'date-fns';
import router from '@/router';

const loading = ref(false);
const errors = ref<Record<string, string>>({});

interface complaint {
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

const complaints = ref<{
    success: boolean;
    reports: {
        current_page: number;
        data: Array<complaint>;
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        link: Array<{
            url: string;
            label: string;
            active: string;
        }>;
        next_page_url: string;
        path: string;
        per_page: number;
        prev_page_url: string;
        to: number;
        total: number;
    }
    }>();

const auth = useAuthStore();

onMounted(async () => {
    try{
        loading.value = true;

        const options= {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/complaints/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }

        const response = await CapacitorHttp.get(options);

        complaints.value = response.data;

    }catch(error: any){
        if(error.response){
            // s
        }
    }finally {
        loading.value = false;
    }
})

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy h:mm a'); // Example format: "September 07, 2024 9:00 AM"
};

const formatReportType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const file = () => {
    router.push('/auth/file-a-compplaints')
}

</script>
<template>
    <ion-page id="main-content">
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-menu-button></ion-menu-button>
                </ion-buttons>
                <ion-title>Complaints</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 min-h-full">
                <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
                <div class="py-4">
                    <div class="p-4">
                        <div class="flex gap-2">
                            <PrimaryButton @click="file" class="bg-green-600">File a Complaint</PrimaryButton>
                        </div>
                        <div class="flex gap-2">
                            <h1>My Complaints</h1>
                        </div>
                        <div v-if="!loading">
                            <div v-if="complaints?.reports.data.length" class="flex flex-col gap-2 ">
                                <div v-for="complaint in complaints.reports.data" :key="complaint.id" class="bg-green-400 p-4 rounded-xl hover:bg-green-600">
                                    <div class="flex justify-between">
                                        <div>
                                            <div class="flex gap-2">
                                                <DocumentIcon class="w-7" />
                                                <div class="badge text-white uppercase" :class="{
                                                    'bg-green-600': complaint.status === 'resolved',
                                                    'bg-yellow-600' : complaint.status === 'reviewed',
                                                    'bg-red-600': complaint.status === 'pending',
                                                    'bg-gray-600': complaint.status === 'closed'
                                                }">{{ complaint.status }}</div>
                                            </div>
                                            
                                            <h1>{{complaint.reference_number}}</h1>
                                        </div>
                                    </div>
                                    <div>
                                        <span>Type: {{ formatReportType(complaint.report_type)}}</span>
                                    </div>
                                    <div>
                                        <span>Time: {{ formatDate(complaint.created_at)}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="flex flex-col gap-2">
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>

                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                                <div class="bg-green-400 p-4 rounded-xl">
                                    <div class="flex justify-between">
                                        <ion-skeleton-text :animated="true" style="width: 50px; height: 50px;"></ion-skeleton-text>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                    <div>
                                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>