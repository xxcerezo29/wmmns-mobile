<script setup lang="ts">
import InputError from '@/Components/InputError.vue';
import { useAuthStore } from '@/stores/auth';
import { useRegistration } from '@/stores/registration';
import { watch } from 'vue';

const authStore = useAuthStore();
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
    <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center">Step 2: Address Information</h2>
    <form class="space-y-4"> <!-- Increased space between elements for better visibility -->
      <div>
        <label for="email" class="label">
          <span class="label-text">Email:</span>
        </label>
        <input v-model="formStore.formData.email" type="email" id="email" class="input input-bordered w-full" />
        <InputError class="mt-2" v-if="authStore.errors.email"
                                        :message="authStore.errors.email[0]" 
                                        />
      </div>
      <div>
        <label for="password" class="label">
          <span class="label-text">Password:</span>
        </label>
        <input v-model="formStore.formData.password" type="password" id="password" class="input input-bordered w-full" />
        <InputError class="mt-2" v-if="authStore.errors.password"
                                        :message="authStore.errors.password[0]" 
                                        />
      </div>
      <div>
        <label for="password" class="label">
          <span class="label-text">Password Confirmation:</span>
        </label>
        <input v-model="formStore.formData.password_confirmation" type="password" id="password" class="input input-bordered w-full" />
      </div>
    </form>
  </div>
</template>