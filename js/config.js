// Browser-safe Firebase web app settings. These values identify the project; they are not Admin SDK credentials.
export const config={
  firebase:{apiKey:'YOUR_FIREBASE_WEB_API_KEY',authDomain:'YOUR_PROJECT.firebaseapp.com',projectId:'YOUR_PROJECT_ID',storageBucket:'YOUR_PROJECT_ID.firebasestorage.app',messagingSenderId:'YOUR_MESSAGING_SENDER_ID',appId:'YOUR_FIREBASE_APP_ID'},
  appCheckSiteKey:'YOUR_RECAPTCHA_V3_SITE_KEY',
  weddingId:'yani-deni-2026',
  cameraPageUrl:new URL('camera.html',location.href).href,
  maxPhotoBytes:8*1024*1024,
  pageSize:24,
  functionsRegion:'us-central1',
  useEmulators:false
};
export const isConfigured=()=>Boolean(['apiKey','authDomain','projectId','storageBucket','appId'].every(key=>config.firebase[key]&&!config.firebase[key].includes('YOUR_'))&&config.appCheckSiteKey&&!config.appCheckSiteKey.includes('YOUR_'));
