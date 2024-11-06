<script setup lang="ts">
import InputError from '@/Components/InputError.vue';
import { useAuthStore } from '@/stores/auth';
import { useRegistration } from '@/stores/registration';
import axios from 'axios';
import { onMounted, ref, watch } from 'vue';

const formStore = useRegistration();

interface ICities {
    code: number,
    name: string,
    regionCode: string,
}

const validate = () => {
  const isValid = formStore.formData.line1 !== ''
    && formStore.formData.barangay !== '';
  formStore.setNextEnabled(isValid);
}

const authStore = useAuthStore();
const barangay = ref<Array<ICities>>([]);

watch(() => formStore.formData, validate, { immediate: true, deep: true });

onMounted(()=> {
  axios.get('https://psgc.gitlab.io/api/cities/023135000/barangays')
    .then((response: any) => {
      barangay.value = response.data
    }).catch((err: any) => {
      alert(err);
    })
})
</script>
<template>
  <div>
    <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center">Step 2: Address Information</h2>
    <form class="space-y-4"> <!-- Increased space between elements for better visibility -->
      <div>
        <label for="line1" class="label">
          <span class="label-text">Line 1:</span>
        </label>
        <input v-model="formStore.formData.line1" type="text" id="line1" class="input input-bordered w-full" />
        <InputError class="mt-2" v-if="authStore.errors.line1"
                                        :message="authStore.errors.line1[0]"/>
      </div>
      <div>
        <label for="line2" class="label">
          <span class="label-text">Line 2:</span>
        </label>
        <input  v-model="formStore.formData.line2" type="text" id="line2" class="input input-bordered w-full" />
      </div>
      <div>
        <label class="label">
          <span class="label-text">Barangay:</span>
        </label>
        <select v-model="formStore.formData.barangay" class="select select-bordered w-full"> <!-- Removed max-w-xs -->
          <option disabled selected value="">Please select a barangay</option>
          <option v-for="(_barangay, index) in barangay" :key="index" :value="_barangay.name">{{_barangay.name}}</option>
        </select>
        <InputError class="mt-2" v-if="authStore.errors.barangay"
                                        :message="authStore.errors.barangay[0]"/>
      </div>
    </form>
  </div>
</template>