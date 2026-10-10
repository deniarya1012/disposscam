import {config,isConfigured} from './config.js';
import {initializeApp,getApps} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInAnonymously,signInWithEmailAndPassword,signOut,connectAuthEmulator} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,collection,doc,getDoc,getDocs,getCountFromServer,query,where,orderBy,limit,startAfter,updateDoc,serverTimestamp,connectFirestoreEmulator} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import {getStorage,ref as storageRef,getBytes,uploadBytesResumable,deleteObject,connectStorageEmulator} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js';
import {getFunctions,httpsCallable,connectFunctionsEmulator} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';
import {initializeAppCheck,ReCaptchaV3Provider} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app-check.js';

let app,appCheck;
if(isConfigured()){
  app=getApps().length?getApps()[0]:initializeApp(config.firebase);
if(!config.useEmulators&&config.appCheckSiteKey&&!config.appCheckSiteKey.includes('YOUR_'))appCheck=initializeAppCheck(app,{provider:new ReCaptchaV3Provider(config.appCheckSiteKey),isTokenAutoRefreshEnabled:true});
}
export const auth=app?getAuth(app):null;
export const db=app?getFirestore(app):null;
export const storage=app?getStorage(app):null;
export const functions=app?getFunctions(app,config.functionsRegion):null;
if(config.useEmulators&&app){connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);connectStorageEmulator(storage,'127.0.0.1',9199);connectFunctionsEmulator(functions,'127.0.0.1',5001)}
export const api=functions?Object.fromEntries(['initializeGuest','reservePhoto','completePhoto','releasePhotoReservation','adminDashboard','adminUpdateWedding','adminSearchGuests','adminDisableGuest','adminDeletePhoto','adminExportPhotos'].map(name=>[name,httpsCallable(functions,name)])):null;
export {collection,doc,getDoc,getDocs,getCountFromServer,query,where,orderBy,limit,startAfter,updateDoc,serverTimestamp,storageRef,getBytes,uploadBytesResumable,deleteObject,onAuthStateChanged,signInAnonymously,signInWithEmailAndPassword,signOut,appCheck};
export function secureImageUrl(path){return getBytes(storageRef(storage,path)).then(bytes=>URL.createObjectURL(new Blob([bytes])))}
export function setupMessage(){return 'Firebase belum dikonfigurasi. Isi Firebase Web App config dan App Check site key di js/config.js.'}
export function guestName(){try{return localStorage.getItem('yd_guest_name')||''}catch{return ''}}
export function saveGuestName(name){try{localStorage.setItem('yd_guest_name',name)}catch{}}
