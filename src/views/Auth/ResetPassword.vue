<script setup lang="ts">
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watch } from "vue";
import { IonPage, IonProgressBar } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const form = ref<{
  email: string;
  type: string;
  password: string;
  password_confirmation: string;
  token: string;
}>({
  email: "",
  type: "",
  password: "",
  password_confirmation: "",
  token: "",
});

const authStore = useAuthStore();

const loading = ref(false);

const reset = async () => {
  loading.value = true;
  try {
    const response = await authStore.reset(
      form.value.email,
      form.value.type,
      form.value.password,
      form.value.password_confirmation,
      form.value.token
    );
    if (response === true) {
      form.value = {
        email: "",
        type: "",
        password: "",
        password_confirmation: "",
        token: "",
      };
      router.replace({
        name: "login",
      });
    }
  } finally {
    loading.value = false;
  }
};

watch(
  () => form.value,
  () => {
    authStore.clearErrors();
  },
  { deep: true }
);

onMounted(() => {
  // alert( useRoute().params.email )
  form.value.email = useRoute().params.email as string;
  form.value.type = useRoute().params.type as string;
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
            <h1 class="text-2xl font-bold text-gray-800">Forgot Password?</h1>
          </div>
          <div class="w-full">
            <form class="w-full" @submit.prevent="reset">
              <InputError class="mt-2" />
              <div class="mt-4 w-full">
                <label class="form-control w-full">
                  <div class="label">
                    <span class="label-text">User Type</span>
                  </div>
                  <select
                    v-model="form.type"
                    class="w-full select select-bordered"
                    required
                  >
                    <option disabled selected value="">Pick one</option>
                    <option value="resident">Resident</option>
                    <option value="driver">Driver</option>
                  </select>
                  <InputError class="mt-2" :message="authStore.errors.type" />
                </label>
              </div>
              <div>
                <InputLabel for="email" value="Email" />

                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  class="input input-bordered w-full"
                  required
                  autofocus
                />

                <InputError
                  class="mt-2"
                  v-if="authStore.errors.email"
                  :message="authStore.errors.email[0]"
                />
              </div>
              <div class="mt-4 w-full">
                <InputLabel for="password" value="New Password" />

                <input
                  v-model="form.password"
                  type="password"
                  placeholder="New Password"
                  class="input input-bordered w-full"
                  required
                  autofocus
                />

                <InputError
                  class="mt-2"
                  v-if="authStore.errors.password"
                  :message="authStore.errors.password[0]"
                />
              </div>
              <div class="mt-4 w-full">
                <InputLabel for="password" value="Password Confirmation" />

                <input
                  v-model="form.password_confirmation"
                  type="password"
                  placeholder="Password Confirmation"
                  class="input input-bordered w-full"
                  required
                  autofocus
                />
              </div>

              <div class="mt-4 w-full">
                <InputLabel for="password" value="OTP" />

                <input
                  v-model="form.token"
                  type="text"
                  placeholder="OTP"
                  class="input input-bordered w-full"
                  required
                  autofocus
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
