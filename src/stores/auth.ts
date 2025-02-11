import api from "@/services/api";
import { defineStore } from "pinia";
import { FormData } from "./registration";
import { Driver, Resident } from "@/Types/inerface";
import { CapacitorHttp } from "@capacitor/core";
import { toast } from "@/function";

type User = Driver | Resident;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: "",
    type: "",
    errors: {} as Record<string, string>,
  }),
  actions: {
    async getToken() {
      await api.get("/sanctum/csrf-cookie", { withCredentials: true });
    },
    async requestVerification() {
      const options = {
        url:
          import.meta.env.VITE_WMMNS_API_URL +
          "/api/email/verification-notification",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      };
      try {
        const response = await CapacitorHttp.post(options);
        if (response.status === 200) {
          toast(
            "top",
            response.data.message || "Verification email sent successfully."
          );

          return true;
        } else {
          toast(
            "top",
            response.data.message || "Error in sending verification email."
          );

          return false;
        }
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 429) {
            toast(
              "top",
              "You have exceeded the maximum number of requests. Please try again later."
            );
          } else {
            toast(
              "top",
              error.response.data.message || "Something went wrong."
            );
          }
        } else {
          toast("top", "Unable to contact the server. Please try again.");
        }
        return false;
      }
    },
    async verifyEmail(otp: string) {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/verify-email",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data: { code: otp }, // Sending the OTP as the payload
      };

      try {
        const response = await CapacitorHttp.post(options);
        if (response.status === 200) {
          toast("top", response.data.message || "Email verified successfully.");
          return true;
        } else {
          toast("top", response.data.message || "Error verifying email.");
          return false;
        }
      } catch (error: any) {
        if (error.response) {
          toast("top", error.response.data.message || "Verification failed.");
        } else {
          toast("top", "Unable to contact the server. Please try again.");
        }
        return false;
      }
    },
    async login(
      email: string,
      password: string,
      type: string,
      remember: boolean
    ) {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: email,
          password: password,
          type: type,
          remember: remember,
        },
      };

      const response = await CapacitorHttp.post(options);
      const responseData = response.data;
      if (responseData.success === true) {
        this.user = responseData.user;
        this.token = responseData.access_token;
        this.type = responseData.type;

        if (this.token) localStorage.setItem("token", this.token);
      } else {
        toast("top", "Incorrect email or password.");
        this.errors.general = "Incorrect email or password.";
      }
    },
    async register(request: FormData) {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/register",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          firstname: request.firstname,
          middlename: request.middlename,
          lastname: request.lastname,
          line1: request.line1,
          line2: request.line2,
          barangay: request.barangay,
          city: request.city,
          province: request.province,
          country: request.country,
          email: request.email,
          password: request.password,
          password_confirmation: request.password_confirmation,
        },
      };

      const response = await CapacitorHttp.post(options);
      const responseData = response.data;
      if (responseData.errors) {
        this.errors = responseData.errors;
      } else {
        this.user = response.data.user;
        this.token = response.data.access_token;

        if (this.token) localStorage.setItem("token", this.token);
      }
    },
    async forgot(email: string, type: string) {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/forgot-password",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          type: type,
          email: email,
        },
      };

      const response = await CapacitorHttp.post(options);

      if (response.data.success === true) {
        toast("top", response.data.message);
        return true;
      } else {
        toast("top", response.data.message);
        this.errors.general = response.data.message;
        return false;
      }
    },
    async reset(
      email: string,
      type: string,
      password: string,
      password_confirmation: string,
      token: string
    ) {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/reset-password",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: {
          type: type,
          email: email,
          password: password,
          password_confirmation: password_confirmation,
          token: token,
        },
      };

      const response = await CapacitorHttp.post(options);

      if (response.data.success === true) {
        toast("top", response.data.message);
        return true;
      } else {
        toast("top", response.data.message);
        this.errors.general = response.data.message;
        return false;
      }
    },
    async logout() {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/logout",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        data: {},
      };

      const response = await CapacitorHttp.post(options);
      if (response.data.success === true) {
        this.user = null;
        this.token = "";
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        toast("top", response.data.message);
        return true;
      } else {
        toast("top", "Failed to Log out.");
        return false;
      }
    },
    async checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const options = {
            url: import.meta.env.VITE_WMMNS_API_URL + "/api/user",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await CapacitorHttp.get(options);
          this.user = response.data.user;
          this.type = response.data.type;

          if (token) this.token = token;
        } catch (error) {
          this.logout();
        }
      } else {
        this.user = null;
        this.token = "";
      }
    },
    clearErrors() {
      this.errors = {};
    },
  },
});
