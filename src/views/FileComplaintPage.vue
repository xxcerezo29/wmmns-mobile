<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonButtons, IonBackButton, IonProgressBar } from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import PrimaryButton from '@/Components/daisyUI/PrimaryButton.vue';
import { CapacitorHttp } from '@capacitor/core';
import { useAuthStore } from '@/stores/auth';
import { TrashIcon } from '@heroicons/vue/24/outline';
import InputError from '@/Components/InputError.vue';
import { formatTime, toast } from '@/function';
import router from '@/router';
import { caretBack } from 'ionicons/icons';

const loading = ref(false);

const auth = useAuthStore();
const photos = ref<string[]>([]);
const schedule = ref<Array<{
    id: number;
    barangay: string;
    day: string;
    truck_id: number;
    route_id: number;
    time: string;
    truck_plate: string;
    truck: {
        id: number;
        barangay: string;
        plate_number: string;
    }
    route: {
        id: number;
        barangay: string;
        name: string;
    }
}>>();
const formData = ref<{
    report_type: string,
    schedule_id: string,
    location: string,
    description: string,
}>({
    report_type: "",
    schedule_id: "",
    location: " ",
    description: "",
});

const takePhoto = async () => {
    try {
        const result = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera
        });

        photos.value.push('data:image/jpeg;base64,' + result.base64String);
    } catch (error) {
        console.error('Error taking photo:', error);
    }
};

const chooseFromGallery = async () => {
    try {
        const result = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Photos
        });

        photos.value.push('data:image/jpeg;base64,' + result.base64String);
    } catch (error) {
        console.error('Error choosing photo from gallery:', error);
    }
}

const removePhoto = (index: number) => {
    photos.value.splice(index, 1);
};

const base64ToBlob = (base64Data: string, contentType: string) => {
    const byteCharacters = atob(base64Data.split(',')[1]);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
};

const errors = ref<Record<string, string>>({});

const uploadComplaint = async () => {
    try {

        loading.value = true;

        const data = {
            report_type: formData.value.report_type,
            location: formData.value.report_type === "missed_collection" ? "No Location" : formData.value.location,
            description: formData.value.description,
            schedule_id: formData.value.schedule_id,
            photo_urls: photos.value.map(photo => photo.split(',')[1]),
        }


        const options = {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/complaints/file/store`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${auth.token}`,
            },
            data: data
        }

        const response = await CapacitorHttp.post(options);

        if (response.status === 200 || response.status === 201) {
            loading.value = false;
            toast('top', 'Complaint uploaded successfully!');
            router.push('/auth/complaints');
        } else {
            // Handle cases where the response status code is not 2xx
            loading.value = false;
            errors.value = response.data.errors || {};
            toast('top', 'An error occurred. Please check your input.');
        }

    } catch (error: any) {
        console.error('Upload error:', error);

        loading.value = false;

        // If it's an HTTP error, check if it contains response data
        if (error.data?.errors) {
            errors.value = error.data.errors;
        }

        // Display a generic error message
        toast('top', 'An unexpected error occurred. Please try again.');
    }
}

onMounted(async () => {
    try {
        loading.value = true;

        const options = {
            url: import.meta.env.VITE_WMMNS_API_URL + `/api/schedule/list`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            }
        }

        const response = await CapacitorHttp.get(options);

        if (response.data.success === true) {
            schedule.value = response.data.schedules
        } else {
            alert(response.data.message)
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
                <ion-title>File a complaint</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <div class="bg-gradient-to-t from-green-400 to-white-500 min-h-full">
                <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
                <div class="py-4">
                    <div class="p-4">
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Report Type</span>
                            </div>
                            <select v-model="formData.report_type" class="select select-bordered">
                                <option disabled selected value="">Pick select type</option>
                                <option value="missed_collection">Missed Collection</option>
                                <option value="illegal_dumping">Illegal Dumping</option>
                            </select>
                            <InputError :message="errors.report_type" class="mt-2" />
                        </label>
                        <label v-if="formData.report_type === 'missed_collection'" class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Schedule</span>
                            </div>
                            <select v-model="formData.schedule_id" class="select select-bordered">
                                <option disabled selected value="">Pick select Schedule</option>
                                <option v-for="(sched, index) in schedule" :key="index" :value="sched.id"
                                    class="capitalize">
                                    {{ sched.day }}-{{ formatTime(sched.time) }} : {{ sched.route.name }} - {{
                                    sched.truck.plate_number }}
                                </option>
                            </select>
                            <InputError :message="errors.schedule_id" class="mt-2" />
                        </label>
                        <label v-if="formData.report_type === 'illegal_dumping'" class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Location/Purok</span>
                            </div>
                            <input v-model="formData.location" type="text" placeholder="Type here"
                                class="input input-bordered w-full" />
                            <InputError :message="errors.location" class="mt-2" />
                        </label>
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Description</span>
                            </div>
                            <textarea v-model="formData.description" class="textarea textarea-bordered h-24"
                                placeholder="Description"></textarea>
                            <InputError :message="errors.description" class="mt-2" />
                        </label>
                        <div class="flex justify-center w-full gap-2 mt-5">
                            <PrimaryButton @click="takePhoto" class="!bg-green-600">Take a Photo
                            </PrimaryButton>
                            <PrimaryButton @click="chooseFromGallery" class="!bg-green-600">Choose from Gallery
                            </PrimaryButton>
                        </div>
                        <div class="py-4 mt-5">
                            <div v-if="photos.length > 0" class="mt-4">
                                <h3 class="text-lg font-semibold">Uploaded Photos</h3>
                                <div class="grid grid-cols-2 gap-4 mt-2">
                                    <div v-for="(photo, index) in photos" :key="index"
                                        class="relative p-2 border rounded">
                                        <img :src="photo" alt="Uploaded photo" class="w-full h-auto rounded" />
                                        <PrimaryButton class="!bg-red-600 absolute top-0 right-0 !rounded-full"
                                            color="danger" @click="removePhoto(index)">
                                            <TrashIcon class="w-4" />
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PrimaryButton type="submit" @click="uploadComplaint" class="!bg-green-600 !w-full">Submit
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>