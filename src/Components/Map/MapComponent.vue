<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Geolocation } from '@capacitor/geolocation';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';


const props = defineProps<{
    waypoints: Array<{ lat: number; lng: number }>;
}>();


const mapContainer = ref<HTMLElement | null>(null);
const route = useRoute();

import riderIconURL from '@/Assets/garbage-truck.png';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { IonButton, modalController } from '@ionic/vue';
import FinishedModal from '../FinishedModal.vue';
import CancelModal from '../CancelModal.vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

const message = ref('This modal example uses the modalController to present and dismiss modals.');

const openFinishedModal = async () => {
    const modal = await modalController.create({
        component: FinishedModal,
        cssClass: 'centered-modal'
    })

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
        message.value = `Hello, ${data}!`;
    }
}

const openCancelModal = async () => {
    const modal = await modalController.create({
        component: CancelModal,
        cssClass: 'centered-modal'
    })

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
        message.value = `Hello, ${data}!`;
    }
}

let map: L.Map | null = null;
let marker: L.Marker | null = null;
let circle: L.Circle | null = null;
const routingControl = ref<L.Control | null>(null);
const isAtFinalDestination = ref(false);
const auth = useAuthStore();

const initMap = () => {
    if (mapContainer.value && !map) {
        map = L.map(mapContainer.value).setView([16.6942, 121.5512], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        map.invalidateSize();

        window.addEventListener('resize', () => {
            if (map)
                map.invalidateSize();
        })
    }
}

const addWaypoints = (waypoints: Array<{ lat: number; lng: number }>) => {
    if (!map || !waypoints.length) return;

    if (routingControl.value) {
        map.removeControl(routingControl.value);
    }

    const latlngs = waypoints.map(point => L.latLng(point.lat, point.lng));

    routingControl.value = L.Routing.control({
        waypoints: latlngs,
        routeWhileDragging: true,
        createMarker: () => null,
    }).addTo(map);

    watch(() => marker?.getLatLng(), () => {
        if(!marker || !routingControl.value) return;

        const finalWaypoint = routingControl.value.getPlan().getWaypoints().slice(-1)[0].latlng;
        const userLocation = marker?.getLatLng();
        if (userLocation && finalWaypoint) {
            const distanceToFilnalWaypoint = userLocation.distanceTo(finalWaypoint);
            const thresholdDistance = 20;


            isAtFinalDestination.value = distanceToFilnalWaypoint < thresholdDistance;
        }
    }, { immediate: true })
}

const riderIcon = L.icon({
    iconUrl: riderIconURL,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
});

// const centerMapOnLocation = (map: L.Map, latlng: L.LatLng) => {
//     map.setView(latlng, map.getZoom(), { animate: true });
// }

const markAsDone = () => {
    openFinishedModal();
}

const cancel = () => {
    openCancelModal();
}

const trackUserLocation = () => {
    if (!map) return;
    const updateLocation = async (position: GeolocationPosition) => {
        const latlng = new L.LatLng(position.coords.latitude, position.coords.longitude);
        const accuracy = position.coords.accuracy / 2;

        if (marker) {
            marker.setLatLng(latlng);
            marker.bindPopup(`You are within ${accuracy} meters from this point`).openPopup();
        } else {
            marker = L.marker(latlng, { icon: riderIcon }).addTo(map!)
                .bindPopup(`You are within ${accuracy} meters from this point`).openPopup();
        }

        if (circle) {
            circle.setLatLng(latlng).setRadius(accuracy);
        } else {
            circle = L.circle(latlng, accuracy).addTo(map!);
        }

        map?.setView(latlng, map.getZoom(), { animate: true });

        try {

            const options = {
                url: import.meta.env.VITE_WMMNS_API_URL + `/api/roams/location/update`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                data: {
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    }
                }
            }

            const response = await CapacitorHttp.post(options);

            console.log('Location sent to server successfully.');
        } catch (error) {
            console.error('Error sending location to server:', error);
        }
    }
    const watchId = navigator.geolocation.watchPosition(
        async (position) => {
            const latlng = L.latLng(position.coords.latitude, position.coords.longitude);
            const accuracy = position.coords.accuracy / 2;

            if (marker) {
                marker.setLatLng(latlng);
                marker.bindPopup(`You are within ${accuracy} meters from this point`).openPopup();
            } else {
                if (map)
                    marker = L.marker(latlng, { icon: riderIcon }).addTo(map)
                        .bindPopup(`You are within ${accuracy} meters from this point`).openPopup();
            }

            map?.setView(latlng, map.getZoom(), { animate: true });

            setInterval(() => {
                updateLocation(position);
            }, 300000)
        },
        (error) => {
            console.log(error);
            alert('Unable to retrieve your location.');
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,

        }
    );
    return watchId;
}

onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'denied') {
            alert('Location permission is required to use this feature.');
            return;
        }

    }

    setTimeout(() => {
        initMap();
        const watchId = trackUserLocation();

        onBeforeUnmount(() => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
            if (map) {
                map.remove();
                map = null
            }
        })
    }, 100)

})

watch(() => props.waypoints, (newWayPoints) => {
    if (map) {
        addWaypoints(newWayPoints);
    }
}, { immediate: true });
</script>

<template>
    <div id="map" ref="mapContainer" style="position: relative; height: 100%; width: 100%">
        <div class="flex gap-2 w-full" style="
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: max-content;
        z-index: 1000;
        width: 100%;
        max-width: 90%
        ">
            <ion-button class="w-full" @click="markAsDone" :disabled="!isAtFinalDestination">
                Done
            </ion-button>
            <ion-button class="w-full" @click="cancel" >
                Cancel
            </ion-button>
        </div>
    </div>
</template>


<style scoped>
.centered-modal .modal-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.centered-modal {
    --height: 200px;
    --width: 300px;
    --border-radius: 20px;
    --background: white;
    --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
</style>