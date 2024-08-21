<script setup lang="ts">

import { useRegistration } from '@/stores/registration';
import StepOne from './StepOne.vue';
import StepTwo from './StepTwo.vue';
import StepThree from './StepThree.vue';
import ReviewSubmit from './ReviewSubmit.vue';
import { computed, watch } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import InputError from '@/Components/InputError.vue';

const formStore = useRegistration();
const authStore = useAuthStore();


interface Step {
  title: string;
  component: any;
}

const steps: Step[] = [
  { title: 'Personal Information', component: StepOne },
  { title: 'Address Information', component: StepTwo },
  { title: 'User Credentials', component: StepThree },
  { title: 'Review & Submit', component: ReviewSubmit },
];

const currentStepComponent = computed(() => steps[formStore.currentStep].component);
const isFirstStep = computed(() => formStore.currentStep === 0);
const isLastStep = computed(() => formStore.currentStep === steps.length - 1);

const goToStep = (index: number) => {
  formStore.currentStep = index;
}

const prevStep = () => {
  if (!isFirstStep.value) {
    formStore.setStep(formStore.currentStep - 1);
  }
}

const nextStep = () => {
  if (!isLastStep.value) {
    formStore.setStep(formStore.currentStep + 1);
  }
}

const submit = async () => {
  await authStore.register(formStore.formData);
  if (authStore.user) {
    formStore.$reset();
    router.push('/home');
  }
  console.log(formStore.formData);
}

watch(() => formStore.formData, () => {
    authStore.clearErrors();
}, { deep: true });

watch(() => authStore.errors, () => {
  if(authStore.errors.firstname) {
    goToStep(0)
  }
  if(authStore.errors.middlename) {
    goToStep(0)
  }
  if(authStore.errors.lastname) {
    goToStep(0)
  }
  if(authStore.errors.line1) {
    goToStep(1)
  }
  if(authStore.errors.barangay) {
    goToStep(1)
  }
  if(authStore.errors.email) {
    goToStep(2)
  }
  if(authStore.errors.password) {
    goToStep(2)
  }
}, {deep : true})


</script>

<template>
  <div class="w-full max-w-xl mx-auto sm:p-6 bg-white shadow-lg rounded-lg overflow-y-auto h-[calc(100vh-150px)] p-4">
    <h1 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Registration Form</h1>

    <div class="mb-4 sm:mb-6">
      <component :is="currentStepComponent"></component>
    </div>

    <div class="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
      <button class="btn btn-secondary w-full sm:w-auto" @click="prevStep" :disabled="isFirstStep">Previous</button>
      <div v-if="!isLastStep">
        <button class="btn btn-primary w-full sm:w-auto" @click="nextStep"
          :disabled="!formStore.isNextEnabled">Next</button>
      </div>
      <div v-else>
        <button class="btn btn-success w-full sm:w-auto" @click="submit">Submit</button>
      </div>
      <button class="btn btn-secondary w-full sm:w-auto" @click="router.push('login')">Cancel</button>
      <InputError class="mt-2" :message="authStore.errors.general" />
    </div>
  </div>
</template>./StepOne.vue./StepTwo.vue./StepThree.vue./ReviewSubmit.vue