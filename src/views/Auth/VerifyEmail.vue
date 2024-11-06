<script setup lang="ts">
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watch } from "vue";
import { IonPage, IonProgressBar } from "@ionic/vue";
import { CapacitorHttp } from "@capacitor/core";

const form = ref<{
  otp: string;
}>({
  otp: "",
});

const authStore = useAuthStore();

const loading = ref(false);
const canResend = ref(true);
const resendLoading = ref(false);
const timer = ref(30);

const request = async () => {
  loading.value = true;
  try {
    const response = await authStore.requestVerification();
    if (response === true) {
      router.replace("/auth/home");
      form.value = {
        otp: "",
      };
    }
  } finally {
    loading.value = false;
  }
};

const verify = async () => {
  loading.value = true;

  const success = await authStore.verifyEmail(form.value.otp);
  if (success === true) {
    loading.value = false;
    await router.replace("/auth/home");

    window.location.reload();
  }
  loading.value = false;
};

const resendOtp = async () => {
  if (canResend.value) {
    resendLoading.value = true;
    canResend.value = false;

    try {
      await authStore.requestVerification();
      startTimer();
    } finally {
      resendLoading.value = false;
    }
  }
};

const startTimer = () => {
  timer.value = 30; // Set timer to 30 seconds
  const interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
      canResend.value = true; // Allow resend after cooldown
    }
  }, 1000); // Update every second
};

watch(
  () => form.value,
  () => {
    authStore.clearErrors();
  },
  { deep: true }
);

onMounted(() => {
  request();
});
</script>

<template>
  <ion-page>
    <div class="min-h-screen bg-green-400">
      <ion-progress-bar
        v-if="loading"
        type="indeterminate"
        color="primary"
      ></ion-progress-bar>
      <div
        class="flex flex-col m-auto justify-around items-centerw-full max-w-sm h-screen rounded-lg overflow-hidden"
      >
        <div class="w-full h-1/2">
          <img
            src="../../Assets/bg-garbage.png"
            alt="Welcome Image"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="p-6 w-full">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">
              Almost there! Please verify your email.
            </h1>
            <p>
              We’ve sent a One-Time Password (OTP) to your email. Please check
              your inbox and enter the code to verify your email address.
            </p>
          </div>
          <div class="w-full mt-6">
            <form class="w-full" @submit.prevent="verify">
              <InputError class="mt-2" />

              <div>
                <InputLabel for="otp" value="OTP" />

                <input
                  v-model="form.otp"
                  type="text"
                  placeholder="One Time Password"
                  class="input input-bordered w-full"
                  required
                  autofocus
                />

                <InputError
                  class="mt-2"
                  v-if="authStore.errors.code"
                  :message="authStore.errors.code[0]"
                />
              </div>
              <div
                class="flex flex-col w-full items-center justify-end mt-4 gap-2"
              >
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition"
                >
                  Submit
                </button>
                <button
                  type="button"
                  :disabled="resendLoading || !canResend"
                  @click="resendOtp"
                  class="w-full bg-blue-500 text-white text-lg text-center p-3 rounded-btn hover:bg-blue-400 transition mt-4"
                >
                  <span v-if="canResend">Resend OTP</span>
                  <span v-else>{{ timer }} seconds left</span>
                </button>
                <a
                  href="/"
                  class="border-2 border-white text-white text-lg text-center p-3 rounded transition w-full"
                  >Cancel</a
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </ion-page>
</template>
