importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "dummy",
    authDomain: "dummy",
    projectId: "dummy",
    messagingSenderId: "dummy",
    appId: "dummy",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const title = payload.notification?.title || "F1 Live Notification";
    self.registration.showNotification(title, {
        body: payload.notification?.body || "",
        icon: "/icon.png",
        badge: "/icon.png",
        vibrate: [200, 100, 200],
    });
});