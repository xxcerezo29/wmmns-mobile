<script setup lang="ts">
import { useRegistration } from '@/stores/registration';
import { watch } from 'vue';

const formStore = useRegistration();


const validate = () => {
  const isValid = formStore.formData.email !== ''
            && formStore.formData.password !== ''
            && formStore.formData.password_confirmation !== ''
  formStore.setNextEnabled(isValid);
}

watch(() => formStore.formData, validate, { immediate: true, deep: true });


</script>
<template>
  <div>
    <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center">Step 4: Review & Submit</h2>
    <form class="space-y-4"> <!-- Keep the spacing consistent -->
      <label for="firstname" class="label">
        <span class="label-text">Personal Information:</span>
      </label>
      <div class="input input-bordered w-full">
        <span class="label-text">First Name:</span>
        <div>{{ formStore.formData.firstname }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Middle Name:</span>
        <div>{{ formStore.formData.middlename }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Last Name:</span>
        <div>{{ formStore.formData.lastname }}</div>
      </div>
      <label for="firstname" class="label">
        <span class="label-text">Address Information:</span>
      </label>
      <div class="input input-bordered w-full">
        <span class="label-text">Line 1:</span>
        <div>{{ formStore.formData.line1 }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Line 2:</span>
        <div>{{ formStore.formData.line2 }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Barangay:</span>
        <div>{{ formStore.formData.barangay }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">City:</span>
        <div>{{ formStore.formData.city }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Province:</span>
        <div>{{ formStore.formData.province }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Country:</span>
        <div>{{ formStore.formData.country }}</div>
      </div>
      <label for="firstname" class="label">
        <span class="label-text">User Credentials:</span>
      </label>
      <div class="input input-bordered w-full">
        <span class="label-text">Email:</span>
        <div>{{ formStore.formData.email }}</div>
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Password:</span>
        <div>{{ formStore.formData.password.replace(/./g, '*') }}</div> <!-- Masking password -->
      </div>
      <div class="input input-bordered w-full">
        <span class="label-text">Password Confirmation:</span>
        <div>{{ formStore.formData.password_confirmation.replace(/./g, '*') }}</div> <!-- Masking password confirmation -->
      </div>
    </form>
  </div>
</template>