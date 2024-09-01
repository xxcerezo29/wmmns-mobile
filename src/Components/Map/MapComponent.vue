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

let map: L.Map | null = null;
let marker: L.Marker | null = null;
let circle: L.Circle | null = null;

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

const centerMapOnLocation = (map: L.Map, latlng: L.LatLng) => {
    map.setView(latlng, map.getZoom(), { animate: true });
}

const trackUserLocation = () => {
    if (!map) return;
    const watchId = navigator.geolocation.watchPosition(
        (position) => {
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

            if (circle) {
                circle.setLatLng(latlng);
                circle.setRadius(accuracy);
            } else {
                if (map)
                    circle = L.circle(latlng, accuracy).addTo(map);
            }

            if (map)
                centerMapOnLocation(map, latlng);

            L.Routing.control({
                waypoints: [
                    latlng,
                    L.latLng(16.7060, 121.5550)
                ],
                routeWhileDragging: true,
                addWaypoints: false,
                draggableWaypoints: false,
                show: false,
                createMarker: () => null
            }).addTo(map);
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
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }

            if (map)
                map.remove();
        })
    }, 100)


})
</script>

<template>
    <div id="map" ref="mapContainer"  class="h-full w-full">

    </div>
</template>