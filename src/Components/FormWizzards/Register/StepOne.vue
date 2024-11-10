<script setup lang="ts">
import InputError from "@/Components/InputError.vue";
import { useAuthStore } from "@/stores/auth";
import { useRegistration } from "@/stores/registration";
import { ref } from "vue";

const authStore = useAuthStore();
const formStore = useRegistration();

const firstname = ref(formStore.formData.firstname);
const middlename = ref(formStore.formData.middlename);
const lastname = ref(formStore.formData.lastname);
</script>
<template>
  <div>
    <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center">
      Step 1: Personal Information
    </h2>
    <form class="space-y-4">
      <div>
        <label for="firstname" class="label">
          <span class="label-text">Firstname:</span>
        </label>
        <input
          v-model="firstname"
          type="text"
          id="firstname"
          class="input input-bordered w-full"
        />
        <InputError
          class="mt-2"
          v-if="authStore.errors.firstname"
          :message="authStore.errors.firstname[0]"
        />
      </div>
      <div>
        <label for="middlename" class="label">
          <span class="label-text">Middlename:</span>
        </label>
        <input
          v-model="middlename"
          type="text"
          id="middlename"
          class="input input-bordered w-full"
        />
        <InputError
          class="mt-2"
          v-if="authStore.errors.middlename"
          :message="authStore.errors.middlename[0]"
        />
      </div>
      <div>
        <label for="lastname" class="label">
          <span class="label-text">Lastname:</span>
        </label>
        <input
          v-model="lastname"
          type="text"
          id="lastname"
          class="input input-bordered w-full"
        />
        <InputError
          class="mt-2"
          v-if="authStore.errors.lastname"
          :message="authStore.errors.lastname[0]"
        />
      </div>
    </form>
  </div>
</template>
