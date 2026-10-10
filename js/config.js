// Browser-safe Firebase web app settings. These values identify the project; they are not Admin SDK credentials.
export const config={
  firebase:{
    apiKey: "AIzaSyAcdBYhHrG1L6enl3YvdQMXecdSYbBAtp4",
    authDomain: "disposscam.firebaseapp.com",
    projectId: "disposscam",
    storageBucket: "disposscam.firebasestorage.app",
    messagingSenderId: "143505878093",
    appId: "1:143505878093:web:0cd509414fa047359d8004",
    measurementId: "G-CPVR9BX4VV"
  },
  appCheckSiteKey:'6LcOhOgtAAAAAIv7EZdlb5TlgSo0XsjpFIpTBR7M',
  weddingId:'yani-deni-2026',
  cameraPageUrl:new URL('camera.html',location.href).href,
  maxPhotoBytes:8*1024*1024,
  pageSize:24,
  functionsRegion:'us-central1',
  useEmulators:false
};
export const isConfigured=()=>Boolean(['apiKey','authDomain','projectId','storageBucket','appId'].every(key=>config.firebase[key]&&!config.firebase[key].includes('YOUR_'))&&config.appCheckSiteKey&&!config.appCheckSiteKey.includes('YOUR_'));
