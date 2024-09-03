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
import Pusher from 'pusher-js';
import { useAuthStore } from '@/stores/auth';
import { Driver } from '@/Types/inerface';

let map: L.Map | null = null;
const driverMarkers: Map<number, L.Marker> = new Map();

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
const updateDriverLocation = (driverId: number, location: { lat: number; lng: number }) => {
    const _driver = L.latLng(location);

    if (driverMarkers.has(driverId)) {
        const marker = driverMarkers.get(driverId);
        if (marker) {
            marker.setLatLng(_driver);
        }
    } else {
        const marker = L.marker(_driver, { icon: riderIcon }).addTo(map!);
        driverMarkers.set(driverId, marker);
    }
};
const auth = useAuthStore();

onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
        const permission = await Geolocation.requestPermissions();
        if (permission.location === 'denied') {
            alert('Location permission is required to use this feature.');
            return;
        }
    }

    const pusher = new Pusher('1417267', {
        cluster: 'ap1',
    })

    const channel = pusher.subscribe('private-'+auth.user?.barangay+'-track-garbage-truck');

    channel.bind('TrackGarbageTruck', (data: { location: { lat: number; lng: number }, truck: any, user: Driver }) => {
        updateDriverLocation(data.user.id,data.location);
    });

    setTimeout(() => {
        initMap();

        onBeforeUnmount(() => {

            if (map)
                map.remove();
        })
    }, 100)


})
</script>

<template>
    <div id="map" ref="mapContainer" class="h-full w-full">

    </div>
</template>