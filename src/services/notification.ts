import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-fcm-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId, fcmToken: realFcmToken }),
    });

    onMessage(messaging, (payload: any) => {
        new Notification(payload.notification?.title || "Notification", {
            body: payload.notification?.body,
            icon: "../assets/icon.png",
        });
    });
}
