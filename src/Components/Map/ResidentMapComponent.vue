<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Geolocation } from '@capacitor/geolocation';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const mapContainer = ref<HTMLElement | null>(null);

import riderIconURL from '@/Assets/garbage-truck.png';
import { Capacitor } from '@capacitor/core';
import Pusher, { Channel } from 'pusher-js';
import { useAuthStore } from '@/stores/auth';
import { Driver } from '@/Types/inerface';
import { useRoute, useRouter } from 'vue-router';

let map: L.Map | null = null;
const driverMarkers: Map<number, L.Marker> = new Map();

let pusher: Pusher | null = null;
let channel: Channel | null = null;

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

const riderIcon = L.icon({
    iconUrl: riderIconURL,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
});
const updateDriverLocation = (driverId: number, location: { lat: number; lng: number }, plateNumber: string) => {
    if (!map) {
        console.log('Map is not initialized');
        return;
    }
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        console.error('Invalid location data: ', location);
        return;
    }
    const _driver = L.latLng(location);

    if (driverMarkers.has(driverId)) {
        const marker = driverMarkers.get(driverId);
        if (marker) {
            marker.setLatLng(_driver).bindPopup(`<b>Plate Number:</b> ${plateNumber}`).openPopup();
        }
    } else {
        const marker = L.marker(_driver, { icon: riderIcon })
            .bindPopup(`<b>Plate Number:</b> ${plateNumber}`)
            .addTo(map!);
        marker.openPopup(); // Automatically opens the popup when the marker is added
        driverMarkers.set(driverId, marker);
    }
};

onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'denied') {
            alert('Location permission is required to use this feature.');
            return;
        }
    }

    const auth = useAuthStore();

    pusher = new Pusher('2b9e426ef902f27d56e7', {
        cluster: 'ap1',
    })

    channel = pusher.subscribe(auth.user?.barangay + '-track-garbage-truck');

    channel.bind('TrackGarbageTruck', (data: { location: { lat: number; lng: number }, truck: any, user: Driver }) => {
        updateDriverLocation(data.user.id, { lat: data.location.lat, lng: data.location.lng }, data.truck.plate_number);
        console.log('Received data:', data);
    });

    setTimeout(() => {
        initMap();
    }, 100)
})

onBeforeUnmount(() => {
    if (map)
        map.remove();
})
const router = useRouter();

router.beforeEach((to, from, next) => {
    if(pusher && channel){
        console.log('Unbinding from Pusher and disconnecting...');
        channel.unbind('TrackGarbageTruck');
    }
    next();
})
</script>

<template>
    <div id="map" ref="mapContainer" class="h-full w-full">

    </div>
</template>