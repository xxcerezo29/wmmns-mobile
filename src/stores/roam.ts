import { defineStore } from "pinia";

export const useRoamStore = defineStore('loading', {
    state: () => ({
        id: 0,
        driver_id: 0,
        schedule_id: 0,
        started: '',
        ended: '',
    }),
    actions: {
        setRoam(roam: {
            id: number;
            driver_id: number
            schedule_id: number,
            started: string;
            ended: string;
        }){
            this.id = roam.id;
            this.driver_id = roam.driver_id;
            this.schedule_id = roam.schedule_id;
            this.started = roam.started;
            this.ended = roam.ended
        },
        setEmpty(){
            this.id = 0;
            this.driver_id = 0;
            this.schedule_id = 0;
            this.started = '';
            this.ended = '';
        }
    }
})