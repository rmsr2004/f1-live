import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export let messaging: Messaging | null = null;

if (firebaseConfig.projectId) {
    try {
        messaging = getMessaging(app);
    } catch (error) {
        console.error("Failed to initialize Firebase Messaging:", error);
    }
}

export async function registerDevice() {
    if (!firebaseConfig.projectId) {
        console.warn("Firebase configuration value (VITE_PROJECT_ID) is missing.");
        return;
    }

    const deviceId = localStorage.getItem("deviceId") || crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (backendUrl) {
        await fetch(`${backendUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deviceId }),
        }).catch((err) => console.error("Failed to register device with backend:", err));
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        return;
    }

    if (!messaging) {
        try {
            messaging = getMessaging(app);
        } catch (err) {
            console.error("Firebase messaging not available:", err);
            return;
        }
    }

    try {
        const realFcmToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_KEY,
        });

        if (backendUrl) {
            await fetch(`${backendUrl}/update-fcm-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId, fcmToken: realFcmToken }),
            }).catch((err) => console.error("Failed to update FCM token on backend:", err));
        }

        onMessage(messaging, (payload: any) => {
            new Notification(payload.notification?.title || "Notification", {
                body: payload.notification?.body,
                icon: "../assets/icon.png",
            });
        });
    } catch (err) {
        console.error("Error setting up FCM token or message listener:", err);
    }
}

