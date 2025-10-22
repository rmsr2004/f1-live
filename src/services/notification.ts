import { getMessaging, getToken, onMessage } from "firebase/messaging";

export async function registerDevice() {
    const deviceId = localStorage.getItem("deviceId") || crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);

    await fetch(`${import.meta.env.BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
    });

    //const data = await res.json();

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        return;
    }

    const messaging = getMessaging();
    const realFcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    await fetch(`${import.meta.env.BACKEND_URL}/update-fcm-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, fcmToken: realFcmToken }),
    });

    onMessage(messaging, (payload) => {
        new Notification(payload.notification?.title || "Notification", {
            body: payload.notification?.body,
            icon: "../assets/icon.png",
        });
    });
}
