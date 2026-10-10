# Wedding Camera — Yani & Deni

Website kamera disposable untuk satu album pernikahan bersama. Frontend memakai HTML, CSS, JavaScript vanilla, dan Firebase. Tamu tidak perlu kode undangan: nama hanya label, sedangkan kuota 15 foto dikaitkan ke Firebase Anonymous Auth UID pada browser tersebut.

## Struktur

- `index.html`, `camera.html`, `gallery.html`, `admin.html`: halaman mandiri.
- `css/`: gaya responsif buatan sendiri.
- `js/config.js`: Firebase Web App config yang aman untuk frontend.
- `js/firebase-client.js`: Firebase Auth, Firestore, Storage, App Check, dan callable functions.
- `functions/src/index.js`: Cloud Functions untuk sesi tamu, reservasi kuota, konfirmasi unggahan, dan administrasi.
- `firestore.rules`, `storage.rules`, `firestore.indexes.json`: aturan keamanan dan indeks.

## Siapkan Firebase

1. Buat proyek Firebase, daftarkan Web App, aktifkan Cloud Firestore, Cloud Storage, Authentication, dan Cloud Functions.
2. Di Authentication, aktifkan **Anonymous** untuk tamu dan **Email/Password** untuk administrator.
3. Salin konfigurasi Web App dari Firebase Console ke objek `firebase` di `js/config.js`. Isi juga `appCheckSiteKey` dari reCAPTCHA v3 yang sudah didaftarkan untuk domain produksi. Nilai konfigurasi Web App bersifat publik; jangan menaruh kredensial Admin SDK atau service account di frontend.
4. Siapkan App Check dengan provider reCAPTCHA v3 dan domain situs. Callable Functions mewajibkan token App Check (`enforceAppCheck: true`). Untuk uji lokal, siapkan debug token App Check sesuai dokumentasi Firebase.
5. Instal Firebase CLI dan dependensi Functions:

   ```sh
   npm install -g firebase-tools
   cd functions && npm install && cd ..
   ```

6. Masuk ke Google Cloud dengan akun yang berhak menulis Firestore dan mengubah custom claims. Untuk skrip setup lokal, autentikasi Application Default Credentials:

   ```sh
   gcloud auth application-default login
   ```

   Inisialisasi dokumen acara:

   ```sh
   GOOGLE_CLOUD_PROJECT=ID_PROYEK_FIREBASE node functions/scripts/setup-wedding.mjs
   ```

   Perintah ini membuat `weddings/yani-deni-2026`, sesuai nilai `weddingId` di `js/config.js`.
7. Buat akun admin melalui Firebase Authentication Console, lalu beri custom claim admin menggunakan UID akun tersebut:

   ```sh
   GOOGLE_CLOUD_PROJECT=ID_PROYEK_FIREBASE node functions/scripts/setup-wedding.mjs --grant-admin UID_ADMIN
   ```

   Admin perlu keluar lalu masuk kembali agar token baru membawa claim tersebut.
8. Deploy backend dan aturan keamanan:

   ```sh
   firebase deploy --project ID_PROYEK_FIREBASE --only firestore:rules,firestore:indexes,storage,functions
   ```

   Storage Rules menggunakan `firestore.get()` untuk memastikan berkas terikat pada reservasi yang dibuat backend. Aktifkan izin lintas layanan Firestore yang diminta Firebase saat pertama kali deploy aturan Storage.

9. Jalankan situs statis di hosting HTTPS. Kamera memerlukan HTTPS di produksi atau `localhost` saat pengembangan.

Cloud Functions dan Cloud Storage memerlukan paket Firebase **Blaze**. Cloud Storage untuk proyek baru memerlukan Blaze mulai 3 Februari 2026; pemakaian tanpa biaya tertentu tetap tersedia, namun pemakaian berlebih dapat dikenai biaya. Atur budget alerts sebelum deployment. [Persyaratan Cloud Storage](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024), [persyaratan Cloud Functions](https://firebase.google.com/docs/functions/quotas).

## Menjalankan lokal

```sh
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Tanpa Firebase Web App config, halaman tetap bisa dibuka dan menampilkan keterangan konfigurasi; Auth, galeri, upload, dan admin perlu proyek Firebase yang aktif.

## Identitas tamu dan batas foto

Tamu hanya mengetik nama lalu membuka kamera. Firebase membuat akun anonim dan menyimpannya di browser. Nama tidak dipakai sebagai bukti identitas. Transaksi Firestore mencatat foto diterima dan reservasi yang sedang diunggah; Cloud Function mengunci operasi berdasarkan UID, sehingga banyak unggahan bersamaan tidak dapat melampaui 15 foto pada UID yang sama. Kegagalan dapat dicoba ulang dengan kunci idempotensi yang sama. Storage Rules mengharuskan reservasi aktif yang dibuat oleh Cloud Function sebelum file dapat diunggah. File baru tampil setelah Function memverifikasi Storage lalu menerima foto ke album.

Tanpa kode undangan atau login personal, batas tersebut berlaku per akun anonim Firebase, bukan per orang yang terverifikasi. Menghapus data browser atau memakai browser/perangkat lain dapat membuat akun anonim baru dan kuota baru. App Check dan kuota proyek membantu mengurangi penyalahgunaan, tetapi tidak membuktikan bahwa dua UID anonim berasal dari orang yang berbeda.

Semua foto diterima disimpan di `weddings/{weddingId}/photos` dan menggunakan `weddings/{weddingId}/{uid}/...` di Storage. Galeri mengambil foto semua UID untuk wedding yang sama. Gambar dibaca melalui Firebase SDK agar aturan Storage tetap berlaku; feed memuat halaman 24 foto dan memperbarui otomatis setiap 45 detik. Album memakai thumbnail untuk grid.

## Administrasi

Dashboard masuk menggunakan Email/Password Firebase Auth. Setiap callable admin memeriksa custom claim `admin`; data setting, pencarian tamu, penonaktifan akun tamu, penghapusan foto, dan ekspor ZIP diproses Cloud Functions/Admin SDK. Akses UI saja tidak memberi hak admin. Jangan memberikan custom claim kepada akun yang tidak dipercaya.

## Fitur kamera

Kamera menggunakan `getUserMedia`, tombol kamera depan/belakang, Canvas, pratinjau, retake, thumbnail, upload progress, dan retry. Flash perangkat tidak diasumsikan tersedia. Jika izin kamera ditolak, browser akan menampilkan petunjuk untuk mengaktifkannya kembali.
