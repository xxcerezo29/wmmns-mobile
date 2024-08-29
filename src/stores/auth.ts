import api from "@/services/api";
import { defineStore } from "pinia";
import { FormData } from "./registration";

export  const useAuthStore = defineStore('auth', {
    state: () => ({
        user: '',
        token: '',
        type: '',
        errors: {} as Record<string, string>
    }),
    actions: {
        async login(email: string, password: string, type: string, remember: boolean) {
          console.log(api.getUri());
            try{
                const response = await api.post('/login', {email, password, type, remember});
                this.user = response.data.user;
                this.token = response.data.access_token;
                this.type = response.data.type;
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                if(this.token)
                  localStorage.setItem('token', this.token);
            }catch (error: any){
              if(error.response && error.response.data.errors){
                this.errors = error.response.data.errors;
              }else{
                this.errors = { general: 'Login failed. Please try again.'};
              }
            }
        },
        async register(request: FormData ) {
            try {
              const response = await api.post('/register', request);
              this.user = response.data.user;
              this.token = response.data.access_token;
              api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
              if(this.token)
                localStorage.setItem('token', this.token);
            } catch (error: any) {
              if(error.response && error.response.data.errors){
                this.errors = error.response.data.errors;
              }else{
                this.errors = { general: 'Register failed. Please try again.'};
              }
            }
          },
          logout() {
            this.user = '';
            this.token = '';
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
          },
          async checkAuth(){
            const token = localStorage.getItem('token');
            if(token){
                try{
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get('/user');
                    this.user = response.data.user;
                    this.type = response.data.type;
                    if(token)
                      this.token = token;
                } catch (error) {
                    this.logout();
                  }
            }
          },
          clearErrors(){
            this.errors = {};
          }
    }
})