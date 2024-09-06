<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonPage } from '@ionic/vue';


</script>
<template>
    <ion-page>
        <div class="min-h-screen bg-green-400 ">
            <ion-header>
                <ion-toolbar class="transparent-toolbar">
                  <div class="toolbar-title-container">
                    <ion-title>WMMNS Mobile</ion-title>
                  </div>
                </ion-toolbar>
              </ion-header>
            <div
                class="flex flex-col m-auto justify-around items-center w-full max-w-sm h-screen rounded-lg overflow-hidden">
                <div class="w-full h-1/2">
                    <img src="../Assets/bg-garbage.png" alt="Welcome Image" class="w-full h-full object-cover">
                </div>
                <div class="p-6 w-full">
    
                    <div class="mt-3 flex flex-col gap-2 justify-between ">
                        <a href="/login"
                            class="bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">Login</a>
                        <a href="/register"
                            class="border-2 border-white text-white text-lg text-center p-3 rounded  transition">Sign Up</a>
                    </div>
                </div>
            </div>
        </div>
    </ion-page>
    
</template>
<style scoped>
.transparent-toolbar {
    --ion-toolbar-background: transparent;
    --background: transparent;
    --ion-color-base: transparent;
    --ion-toolbar-border-color: transparent;
    --box-shadow: none;
    border-bottom: none;
  }
  
  .toolbar-title-container {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Align items to the start (left) */
    width: 100%; /* Ensure the container takes full width */
  }
  
  .toolbar-title-container ion-title {
    text-align: left; /* Align text to the left */
    margin-left: 0;  /* Ensure there's no left margin */
  }
</style>