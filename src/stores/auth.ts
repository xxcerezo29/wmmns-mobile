import api from "@/services/api";
import { defineStore } from "pinia";
import { FormData } from "./registration";
import { Driver, Resident } from "@/Types/inerface";
import { Capacitor, CapacitorHttp } from "@capacitor/core";

type User = Driver | Resident;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    token: "",
    type: "",
    errors: {} as Record<string, string>,
  }),
  actions: {
    async _login(
      email: string,
      password: string,
      type: string,
      remember: boolean
    ) {
      const options = {
        url: import.meta.env.VITE_WMMNS_API_URL + "/api/login",
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'email': email,
          'password': password,
          'type':type,
          'remember':remember,
        },
      };

      const response = await CapacitorHttp.post(options);

      return response;
    },
    async getToken() {
      await api.get("/sanctum/csrf-cookie", { withCredentials: true });
    },
    async login(
      email: string,
      password: string,
      type: string,
      remember: boolean
    ) {
      try {

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
        this.user = responseData.user;
        this.token = responseData.access_token;
        this.type = responseData.type;
        
        if (this.token) localStorage.setItem("token", this.token);
      } catch (error: any) {
        this.errors = {};

        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
          const status = error.response.status;
          if (error.response.data.errors) {
            this.errors = error.response.data.errors;
          } else {
            switch (status) {
              case 400:
                this.errors.general =
                  "Invalid request. Please check your input.";
                break;
              case 401:
                this.errors.general =
                  "Unauthorized. Incorrect email or password.";
                break;
              case 403:
                this.errors.general =
                  "Access denied. You do not have the required permissions.";
                break;
              case 404:
                this.errors.general =
                  "Server not found. Please try again later.";
                break;
              case 405:
                this.errors.general = "Invalid Method.";
                break;
              case 500:
                this.errors.general = "Server error. Please try again later.";
                break;
              default:
                this.errors.general =
                  "An unexpected error occurred. Please try again.";
            }
          }
        } else {
          this.errors.general =
            "Network error. Please check your connection and try again.";
        }

        console.error("Login error:", error);
        alert(this.errors.general);
      }
    },
    async register(request: FormData) {
      try {
        const options = {
          url: import.meta.env.VITE_WMMNS_API_URL + "/api/register",
          headers: {
            "Content-Type": "application/json",
          },
          data: request,
        };

        const response = await CapacitorHttp.post(options);
        const responseData = response.data;

        this.user = response.data.user;
        this.token = response.data.access_token;

        if (this.token) localStorage.setItem("token", this.token);
      } catch (error: any) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        } else {
          this.errors = { general: "Register failed. Please try again." };
        }
      }
    },
    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    },
    async checkAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const options = {
            url: import.meta.env.VITE_WMMNS_API_URL + "/api/user",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          };

          const response = await CapacitorHttp.get(options);
          this.user = response.data.user;
          this.type = response.data.type;

          if (token) this.token = token;
        } catch (error) {
          this.logout();
        }
      }
    },
    clearErrors() {
      this.errors = {};
    },
  },
});
