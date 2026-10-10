import {applicationDefault,initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {FieldValue,Timestamp,getFirestore} from 'firebase-admin/firestore';

const projectId=process.env.GOOGLE_CLOUD_PROJECT||process.env.GCLOUD_PROJECT;
if(!projectId)throw new Error('Set GOOGLE_CLOUD_PROJECT to your Firebase project ID.');
initializeApp({credential:applicationDefault(),projectId});
const db=getFirestore();
const weddingId='yani-deni-2026';
await db.collection('weddings').doc(weddingId).set({coupleNames:'Yani & Deni',eventDate:Timestamp.fromDate(new Date('2026-10-10T12:00:00.000Z')),venue:'Jakarta',welcomeMessage:'Welcome to our wedding camera! Capture the laughter, happy tears, candid moments, and little details that make our day unforgettable. You have 15 shots to capture your memories. Every photo becomes part of our shared wedding album.',eventStatus:true,galleryVisibility:true,photoDownloadEnabled:true,createdAt:FieldValue.serverTimestamp()},{merge:true});
console.log(`Initialized wedding ${weddingId} in Firebase project ${projectId}.`);
if(process.argv[2]==='--grant-admin'){
  const uid=process.argv[3];if(!uid)throw new Error('Provide the Firebase Auth user UID after --grant-admin.');
  const auth=getAuth(),user=await auth.getUser(uid);await auth.setCustomUserClaims(uid,{...user.customClaims,admin:true});
  console.log(`Granted the admin custom claim to ${uid}. Sign out and sign in again to refresh the ID token.`);
}
