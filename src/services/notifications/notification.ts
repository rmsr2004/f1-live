import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export async function registerDevice() {
    console.log("backend-url: ", import.meta.env.VITE_BACKEND_URL);
    console.log("Registering device for notifications...");

    const deviceId = localStorage.getItem("deviceId") || crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
    });

    console.log("res: ", res);

    //const data = await res.json();

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        return;
    }

    const messaging = getMessaging();
    const realFcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY,
    });

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-fcm-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, fcmToken: realFcmToken }),
    });

    onMessage(messaging, (payload: any) => {
        console.log("Message received. ", payload);
        new Notification(payload.notification?.title || "Notification", {
            body: payload.notification?.body,
            icon: "../assets/icon.png",
        });
    });
}
