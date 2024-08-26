<script setup lang="ts">
import { MapIcon } from '@heroicons/vue/24/outline';


</script>
<template>
    <div class="min-h-screen flex flex-col gap-2 pt-4">
        <div class="bg-green-400 rounded-full overflow-hidden">
            <div class="flex gap-2 p-4 px-9 overflow-auto">
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">M</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Mon</span>
                </div>
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">T</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Tue</span>
                </div>
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">W</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Wed</span>
                </div>
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">TH</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Thu</span>
                </div>
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">F</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Fri</span>
                </div>
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">S</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Sat</span>
                </div>
                <div class="max-w-14 truncate min-w-14">
                    <div
                        class="bg-blue-500 p-4 rounded-full flex items-center justify-center h-14 w-14 shadow-md transform transition-transform duration-300 hover:scale-105">
                        <h4 class="text-white font-semibold text-lg">S</h4>
                    </div>
                    <span class="block text-center text-sm font-medium mt-2 text-gray-700">Sun</span>
                </div>
            </div>

        </div>
        <div class="flex flex-col gap-2 p-4">
            <div class="bg-green-400 p-4 rounded-xl">
                <div class="flex justify-between">
                    <div>
                        <MapIcon class="w-7" />
                        <h1>Route Name</h1>
                    </div>

                </div>
                <div>
                    <span>6:30 AM</span>
                </div>
            </div>

        </div>
    </div>


</template>