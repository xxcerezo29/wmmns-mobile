import { PushNotifications } from "@capacitor/push-notifications";

export const initializePushNotifications = async () => {
  await addListeners();

  await registerNotifications();
};

const addListeners = async () => {
  await PushNotifications.addListener("registration", (token) => {
    alert("Registration Token: " + token.value);
    console.log("Registration Token: " , token.value);
  });

  await PushNotifications.addListener("registrationError", (err) => {
    alert("Registration error: "+ err.error);
    console.error("Registration error: ", err.error)
  });

  await PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {
        alert("Push notification received: "+ notification);
        console.log("Push notification received: "+ notification)
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
