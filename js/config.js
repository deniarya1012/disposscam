// Browser-safe Firebase web app settings. These values identify the project; they are not Admin SDK credentials.
export const firebaseConfig = {
  apiKey: "AIzaSyAcdBYhHrG1L6enl3YvdQMXecdSYbBAtp4",
  authDomain: "disposscam.firebaseapp.com",
  projectId: "disposscam",
  storageBucket: "disposscam.firebasestorage.app",
  messagingSenderId: "143505878093",
  appId: "1:143505878093:web:0cd509414fa047359d8004",
  measurementId: "G-CPVR9BX4VV"
};
export const isConfigured=()=>Boolean(['apiKey','authDomain','projectId','storageBucket','appId'].every(key=>config.firebase[key]&&!config.firebase[key].includes('YOUR_'))&&config.appCheckSiteKey&&!config.appCheckSiteKey.includes('YOUR_'));
