<script setup lang="ts">

import { useRegistration } from '@/stores/registration';
import StepOne from './StepOne.vue';
import StepTwo from './StepTwo.vue';
import StepThree from './StepThree.vue';
import ReviewSubmit from './ReviewSubmit.vue';
import { computed, ref, watch } from 'vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import InputError from '@/Components/InputError.vue';

const formStore = useRegistration();
const authStore = useAuthStore();

const loading = ref(false);


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
  loading.value = true;
  try {
    await authStore.register(formStore.formData);
    if (authStore.user) {
      formStore.$reset();
      router.push('/auth/home');
    }
    console.log(formStore.formData);
  } finally {
    loading.value = false;
  }

}

watch(() => formStore.formData, () => {
  authStore.clearErrors();
}, { deep: true });

watch(() => authStore.errors, () => {
  if (authStore.errors.firstname) {
    goToStep(0)
  }
  if (authStore.errors.middlename) {
    goToStep(0)
  }
  if (authStore.errors.lastname) {
    goToStep(0)
  }
  if (authStore.errors.line1) {
    goToStep(1)
  }
  if (authStore.errors.barangay) {
    goToStep(1)
  }
  if (authStore.errors.email) {
    goToStep(2)
  }
  if (authStore.errors.password) {
    goToStep(2)
  }
}, { deep: true });


</script>

<template>
  <ion-progress-bar v-if="loading" type="indeterminate" color="primary"></ion-progress-bar>
  <div class="w-full mt-4 px-6 overflow-y-auto">
    <component :is="currentStepComponent"></component>
  </div>

  <div class="p-6 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 mt-4 w-full">
    <button class=" !border-white text-white text-lg p-3 rounded transition w-full sm:w-auto" @click="prevStep"
      :disabled="isFirstStep">Previous</button>
    <button v-if="!isLastStep"
      class="bg-white text-black text-lg p-3 rounded-btn hover:bg-slate-200 transition w-full sm:w-auto"
      @click="nextStep" :disabled="!formStore.isNextEnabled">Next</button>
    <button v-else
      class="w-full bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition" @click="submit">Submit</button>
    <a class="border-2 border-white text-white text-lg text-center p-3 rounded transition w-full sm:w-auto"
      href="/">Cancel</a>
  </div>
  <InputError class="mt-2" :message="authStore.errors.general" />
</template>