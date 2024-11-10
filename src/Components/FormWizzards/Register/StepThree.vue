<script setup lang="ts">
import InputError from "@/Components/InputError.vue";
import { useAuthStore } from "@/stores/auth";
import { useRegistration } from "@/stores/registration";
import { ref, watch } from "vue";

const authStore = useAuthStore();
const formStore = useRegistration();

const emit = defineEmits(["updateFormData"]);

const email = ref(formStore.formData.email);
const password = ref(formStore.formData.password);
const password_confirmation = ref(formStore.formData.password_confirmation);

const validate = () => {
  const isValid =
    formStore.formData.email !== "" &&
    formStore.formData.password !== "" &&
    formStore.formData.password_confirmation !== "";

  emit("updateFormData", {
    email: email.value,
    password: password.value,
    password_confirmation: password_confirmation.value,
    isNextEnabled: isValid,
  });
};

watch(() => formStore.formData, validate, { immediate: true, deep: false });
</script>
<template>
  <div>
    <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center">
      Step 3: User Credentials
    </h2>
    <form class="space-y-4">
      <!-- Increased space between elements for better visibility -->
      <div>
        <label for="email" class="label">
          <span class="label-text">Email:</span>
        </label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="input input-bordered w-full"
        />
        <InputError
          class="mt-2"
          v-if="authStore.errors.email"
          :message="authStore.errors.email[0]"
        />
      </div>
      <div>
        <label for="password" class="label">
          <span class="label-text">Password:</span>
        </label>
        <input
          v-model="password"
          type="password"
          id="password"
          class="input input-bordered w-full"
        />
        <InputError
          class="mt-2"
          v-if="authStore.errors.password"
          :message="authStore.errors.password[0]"
        />
      </div>
      <div>
        <label for="password" class="label">
          <span class="label-text">Password Confirmation:</span>
        </label>
        <input
          v-model="password_confirmation"
          type="password"
          id="password"
          dir="ltr"
          class="input input-bordered w-full"
        />
      </div>
    </form>
  </div>
</template>
