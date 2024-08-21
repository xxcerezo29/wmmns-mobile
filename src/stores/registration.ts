import { defineStore  } from "pinia";

export interface FormData {
    firstname: string;
    middlename: string;
    lastname: string;
    line1: string;
    line2: string;
    barangay: string;
    city: string;
    province: string;
    country: string;
    email: string;
    password: string;
    password_confirmation: string
}

export const useRegistration = defineStore('registrationForm', {
    state: () => ({
        formData: {
            firstname: '',
            middlename: '',
            lastname: '',
            line1: '',
            line2: '',
            barangay: '',
            city: 'City of Santiago',
            province: 'Isabela',
            country: 'Philippines',
            email: '',
            password: '',
            password_confirmation: '',
        } as FormData,
        currentStep: 0,
        isNextEnabled: false
    }),
    actions: {
        updateFormData(newData: Partial<FormData>) {
            this.formData = { ...this.formData, ...newData };
        },
        setStep(step: number) {
            this.currentStep = step;
        },
        setNextEnabled(enabled: boolean) {
            this.isNextEnabled = enabled;
        },
        validateStep1() {
            const { firstname, lastname } = this.formData;
            this.isNextEnabled = firstname !== '' && lastname !== '';
        }
    }
} )