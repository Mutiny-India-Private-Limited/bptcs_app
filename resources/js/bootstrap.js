import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import { router } from "@inertiajs/react";

// Attach globally
window.Inertia = { router };

// if (window.Inertia && window.Inertia.router) {
//     // Listen to Inertia navigation events
//     window.Inertia.router.on("navigate", (event) => {
//         alert(`Page changed to: ${event.detail.page.url}`);
//         // event.detail.page contains the new page data
//     });
// }
// // Function to show logs on the mobile screen
// // Function to show logs directly on screen
function logOnScreen(msg) {
    const el = document.createElement('div');
    el.textContent = msg;
    el.style.background = 'rgba(255,255,255,0.9)';
    el.style.color = '#000';
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.left = '0';
    el.style.padding = '4px 8px';
    el.style.fontSize = '12px';
    el.style.zIndex = '9999';
    el.style.borderTop = '1px solid #ccc';
    document.body.appendChild(el);
}
// window.addEventListener('DOMContentLoaded', async () => {
//     if (window.AppInterface) {
//         if (window.AppInterface.getDeviceDetails()) {
//             logOnScreen("getDeviceDetails Detected: ");
//         } else {
//             logOnScreen("getDeviceDetails NOt Detected: ");
//         }

//         // const token = window.AppInterface.getDeviceDetails();
//         // const token = window.AppInterface.setLoggedInUser(id);
//         // const token = window.AppInterface.getLoggedInUser();
//         logOnScreen("App Detected: ");

//     } else {
//         logOnScreen("App Not Detected");
//     }
// });

// window.addEventListener('DOMContentLoaded', async () => {
//     // Step 1: Check if Capacitor exists
//     if (window.Capacitor) {
//         logOnScreen("✅ window.Capacitor exists");

//         // Step 2: Check if Plugins exist
//         if (window.Capacitor.Plugins) {
//             logOnScreen("✅ window.Capacitor.Plugins exists");

//             // Step 3: Check if StatusBar plugin exists
//             if (window.Capacitor.Plugins.StatusBar) {
//                 logOnScreen("✅ StatusBar plugin is available");

//                 const { StatusBar, Style } = window.Capacitor.Plugins;

//                 // Only run on Android
//                 const platform = window.Capacitor.getPlatform();
//                 logOnScreen(`Platform detected: ${platform}`);

//                 if (platform === 'android') {
//                     try {
//                         await StatusBar.setStyle({ style: Style.Dark });
//                         logOnScreen("StatusBar.setStyle called");

//                         await StatusBar.setBackgroundColor({ color: '#ff0000' });
//                         logOnScreen("StatusBar.setBackgroundColor called");

//                         await StatusBar.show();
//                         logOnScreen("StatusBar.show called");
//                     } catch (err) {
//                         logOnScreen("❌ StatusBar plugin error: " + err);
//                     }
//                 } else {
//                     logOnScreen("Not Android, skipping StatusBar plugin");
//                 }
//             } else {
//                 logOnScreen("❌ StatusBar plugin is NOT available");
//             }
//         } else {
//             logOnScreen("❌ window.Capacitor.Plugins is NOT available");
//         }
//     } else {
//         logOnScreen("❌ window.Capacitor is NOT available (running in browser?)");
//     }
// });
