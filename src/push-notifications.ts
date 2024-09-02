import { PushNotifications } from "@capacitor/push-notifications";

PushNotifications.requestPermissions().then(result => {
    if(result.receive === 'granted'){
        PushNotifications.register();
    }else{
        console.log('Push Notifications permission nor granted.');
    }
});

PushNotifications.addListener('registration', (token) => {
    console.log('Push registration success, token: ', token.value );
});

PushNotifications.addListener('registrationError', (error) => {
    console.error('Push registration error: ', error);
});

PushNotifications.addListener('pushNotificationReceived', (notification) => {
    console.log('Push Notification received: ', notification);
});

PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    console.log('Push notificaiton action performed: ', action);
});