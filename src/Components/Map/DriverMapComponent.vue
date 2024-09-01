<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Geolocation } from '@capacitor/geolocation';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const mapContainer = ref<HTMLElement | null>(null);

import { Capacitor } from '@capacitor/core';

let map: L.Map | null = null;
let markers: L.Marker[] = [];

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

const props = defineProps<{ waypoints: string | undefined }>();

const updateWaypoint = (waypoints: { lat: number, lng: number }[]) => {
    if (!map) return;

    markers.forEach(marker => map!.removeLayer(marker));
    markers = [];

    waypoints.forEach((point, index) => {
        const marker = L.marker([point.lat, point.lng])
            .addTo(map!)
            .bindPopup(`Waypoint ${index + 1}`)
            .openPopup();

        markers.push(marker);

    })

    if (waypoints.length > 0) {
        const bounds = L.latLngBounds(waypoints.map(point => [point.lat, point.lng]));
        map.fitBounds(bounds);
    }
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
    }, 100)


})

watch(() => props.waypoints,
    (newWaypoints) => {
        if (newWaypoints) {
            try {
                const parsedWaypoint = JSON.parse(newWaypoints);
                if (Array.isArray(parsedWaypoint)) {
                    updateWaypoint(parsedWaypoint);
                }
            } catch (error) {
                console.log('Invalid waypoint data: ', error);
            }
        }
    })
</script>

<template>
    <div id="map" ref="mapContainer" class="h-full w-full">

    </div>
</template>