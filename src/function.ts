import { toastController } from "@ionic/vue";

export const toast = async (position: 'top' | 'middle' | 'bottom', message: string) => {
    const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: position
    });

    await toast.present();
}

export const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);
}

export const hasTimePassed =(scheduleTime: string): boolean => {
    const currentTime = new Date();
    const [hours, minutes] = scheduleTime.split(':').map(Number);
    const scheduleDate = new Date();
    scheduleDate.setHours(hours, minutes, 0, 0);
    return currentTime > scheduleDate;
}

export const isScheduleMissed = (scheduleTime: string): boolean => {
    return hasTimePassed(scheduleTime);
} 

export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}