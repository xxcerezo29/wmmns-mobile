import { PushNotifications } from "@capacitor/push-notifications";
import { useAuthStore } from "./stores/auth";
import { CapacitorHttp } from "@capacitor/core";

export const initializePushNotifications = async () => {
  await addListeners();

  await registerNotifications();
};

const auth = useAuthStore();

const addListeners = async () => {
  await PushNotifications.addListener("registration", async (token) => {

    console.log(token)

    const options = {
      url: import.meta.env.VITE_WMMNS_API_URL + `/api/store/device`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      data: {
          token: token.value
      }
    };
    const response = await CapacitorHttp.post(options);

    if(response.data.success === true){
      console.log("Registration Token: ", token.value);
    }else{
      console.log("Registration Token: ", response.data.message);
    }

    // alert("Registration Token: " + token.value);
    
  });

  await PushNotifications.addListener("registrationError", (err) => {
    // alert("Registration error: "+ err.error);
    console.error("Registration error: ", err.error);
  });

  await PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {
      // alert("Push notification received: "+ notification);
      console.log("Push notification received: " + notification);
    }
  );

  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log(
        "Push notification action performed",
        notification.actionId,
        notification.inputValue
      );
    }
  );
};

const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    throw new Error("User denied permissions!");
  }

  await PushNotifications.register();
};

export const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log("Delivered notifications", notificationList);
};
