<script setup lang="ts">
import router from "@/router";
import { useAuthStore } from "@/stores/auth";
import { FormKit, FormKitComponent } from "@formkit/vue";
import axios from "axios";
import { onMounted, ref } from "vue";
import { FormKitNode } from "@formkit/core";

const auth = useAuthStore();
const loading = ref(false);

interface ICities {
  code: number;
  name: string;
  regionCode: string;
}
interface IForm {
  form: {
    personal_information: {
      firstname: string;
      middlename: string;
      lastname: string;
    };
    address_information: {
      line1: string;
      line2: string;
      barangay: string;
    };
    user_credentials: {
      email: string;
      password: string;
      password_confirm: string;
    };
  };
}
const barangay = ref<Array<ICities>>([]);
const baragayOptions = ref<any>([]);

const form = ref<FormKitComponent | null>(null);

const submit = async (data: IForm, node: FormKitNode) => {
  loading.value = true;
  const formData = {
    firstname: data.form.personal_information.firstname,
    middlename: data.form.personal_information.middlename,
    lastname: data.form.personal_information.lastname,
    line1: data.form.address_information.line1,
    line2: data.form.address_information.line2,
    barangay: data.form.address_information.barangay,
    email: data.form.user_credentials.email,
    password: data.form.user_credentials.password,
    password_confirmation: data.form.user_credentials.password_confirm,
    city: "City of Santiago",
    province: "Isabela",
    country: "Philippines",
  };
  node.clearErrors();
  try {
    await auth.register(formData);

    if (auth.errors) {
      const mapped: Record<string, string> = {};

      const personalInformationFields = ["firstname", "middlename", "lastname"];
      const addressInformationFields = ["line1", "line2", "barangay"];
      const credentialsInformationFields = ["email", "password"];
      personalInformationFields.forEach((field) => {
        if (auth.errors[field]) {
          mapped[`form.personal_information.${field}`] = Array.isArray(
            auth.errors[field]
          )
            ? auth.errors[field].join(", ")
            : auth.errors[field];
        }
      });

      addressInformationFields.forEach((field) => {
        if (auth.errors[field]) {
          mapped[`form.address_information.${field}`] = Array.isArray(
            auth.errors[field]
          )
            ? auth.errors[field].join(", ")
            : auth.errors[field];
        }
      });

      credentialsInformationFields.forEach((field) => {
        if (auth.errors[field]) {
          mapped[`form.user_credentials.${field}`] = Array.isArray(
            auth.errors[field]
          )
            ? auth.errors[field].join(", ")
            : auth.errors[field];
        }
      });

      node.setErrors({}, mapped);
    }
    if (auth.user) {
      router.replace("/auth/home");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  axios
    .get("https://psgc.gitlab.io/api/cities/023135000/barangays")
    .then((response: any) => {
      barangay.value = response.data;

      baragayOptions.value = barangay.value.map((b) => ({
        label: b.name,
        value: b.name,
      }));
    })
    .catch((err: any) => {
      alert(err);
    });
});
</script>

<template>
  <FormKit type="form" ref="form" @submit="submit" :actions="false">
    <FormKit
      type="multi-step"
      name="form"
      tab-style="progress"
      :allow-incomplete="false"
      :hide-progress-labels="true"
    >
      <FormKit
        type="step"
        name="personal_information"
        label="Personal Information"
      >
        <FormKit
          type="text"
          name="firstname"
          label="Firstname"
          validation="required"
        />
        <FormKit
          type="text"
          name="middlename"
          label="Middlename (optional)"
          validation="nullable"
        />
        <FormKit
          type="text"
          name="lastname"
          label="Lastname"
          validation="required"
        />
      </FormKit>
      <FormKit
        type="step"
        name="address_information"
        label="Address Information"
      >
        <FormKit
          type="text"
          name="line1"
          label="Line 1"
          validation="required"
        />
        <FormKit
          type="text"
          name="line2"
          label="Line 2 (optional)"
          validation="nullable"
        />
        <FormKit
          type="select"
          label="Barangay"
          name="barangay"
          placeholder="Barangay"
          validation="required"
          :options="baragayOptions"
        />
      </FormKit>
      <FormKit type="step" label="User Credentials" name="user_credentials">
        <FormKit
          type="email"
          name="email"
          label="Email"
          validation="required|email"
          validation-visibility="live"
        />
        <FormKit
          name="password"
          type="password"
          label="Password"
          validation="required|confirm"
        />
        <FormKit
          name="password_confirm"
          type="password"
          label="Password Confirmation"
          validation="required"
        />
        <template #stepNext>
          <FormKit type="submit" />
        </template>
      </FormKit> </FormKit
  ></FormKit>
</template>
<style scoped>
/* Ensure proper spacing between step labels */
.formkit-step {
  font-size: 1rem;
  padding: 0 1rem; /* Add padding to prevent overlap */
}

/* Adjust width for the progress tab style */
.formkit-multi-step-tab {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.formkit-multi-step-tab .formkit-step {
  min-width: 30%; /* Adjust to fit the text within the container */
  text-align: center;
}

/* Optional: Add ellipsis if the label is too long */
.formkit-step-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
