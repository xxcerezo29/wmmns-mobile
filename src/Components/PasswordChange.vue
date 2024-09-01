<script setup lang="ts">
import { ref } from 'vue';

const updatePassword = ref<{
    current_password: string;
    password: string;
    password_confirmation: string;
}>({
    current_password: '',
    password: '',
    password_confirmation: ''
});

</script>
<template>
    <form class="p-5 bg-green-200 rounded-badge shadow-md">
        <div>
            <h1>Change Password</h1>
        </div>
        <div>
            <label for="line2" class="label">
                <span class="label-text">Current Password:</span>
            </label>
            <input v-model="updatePassword.current_password" type="password" id="line2"
                class="input input-bordered w-full" />
        </div>
        <div>
            <label for="line2" class="label">
                <span class="label-text">New Password:</span>
            </label>
            <input v-model="updatePassword.password" type="password" id="line2" class="input input-bordered w-full" />
        </div>
        <div>
            <label for="line2" class="label">
              <span class="label-text">Password Confirmation:</span>
            </label>
            <input  v-model="updatePassword.password_confirmation" type="password" id="line2" class="input input-bordered w-full" />
          </div>
        <div class="flex  justify-end mt-5">
            <button type="submit"
                class=" bg-white text-black text-lg text-center p-3 rounded-btn hover:bg-slate-200 transition">
                Submit
            </button>
        </div>
    </form>
</template>