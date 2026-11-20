# 📝 TodoApp — React Native (Expo) & Cloud Firestore Full CRUD

![React Native](https://img.shields.io/badge/React_Native-0.88.1-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-~58.0.23-000020?style=for-the-badge&logo=expo&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-~58.0.30-4630EB?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-~6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase_Firestore-^9.22.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

> **Dokumentasi Proyek UTS Pemrograman Mobile (Tugas Sesi #6: CRUD To Do List)**

---

## 📖 Deskripsi Singkat Proyek

**TodoApp** adalah aplikasi mobile pencatat daftar tugas (*To-Do List*) berbasis **React Native (Expo)** dengan bahasa **TypeScript (`.tsx`)** yang terintegrasi secara *real-time* menggunakan layanan database NoSQL **Google Cloud Firestore**.

Aplikasi ini mengimplementasikan operasi **Full CRUD (*Create, Read, Update, Delete*)** secara langsung ke Cloud Firestore dan menggunakan sistem *file-based routing* dari **Expo Router** untuk berpindah antar layar (**Home Screen** dan **Detail/Edit Screen**).

---

## ✨ Fitur CRUD yang Diimplementasikan

Seluruh fitur CRUD diimplementasikan secara *real-time* pada koleksi Firestore bernama `todos`:

### 1. Create (Tambah Todo — `src/app/index.tsx`)
- Pengguna memasukkan teks tugas baru melalui komponen `TextInput` (`placeholder="Add A New Todo"`) dan menekan tombol **Add** (`#788eec`).
- Fungsi `addTodo()` memvalidasi agar input tidak kosong (`addData.trim().length > 0`), lalu membentuk objek dokumen dengan struktur:
  - `heading`: teks todo yang telah di-*trim* (`string`).
  - `createdAt`: waktu server Firestore (`firebase.firestore.FieldValue.serverTimestamp()`).
- Data disimpan menggunakan `todoRef.add(data)`. Setelah berhasil, kolom input dikosongkan (`setAddData('')`) dan keyboard ditutup secara otomatis menggunakan `Keyboard.dismiss()`.

### 2. Read Real-time (Tampil & Sinkronisasi Otomatis — `src/app/index.tsx`)
- Menggunakan React Hook `useEffect` dengan listener *real-time* `todoRef.orderBy('createdAt', 'desc').onSnapshot(...)` sehingga daftar todo selalu diurutkan dari yang terbaru dan otomatis diperbarui setiap kali terjadi perubahan data di Cloud Firestore.
- Listener dibersihkan secara aman melalui fungsi cleanup `return () => unsubscribe()` saat komponen di-*unmount*.
- Data dirender menggunakan komponen `FlatList` dengan `SafeAreaView` serta format kapitalisasi huruf pertama otomatis pada setiap item (`item.heading[0].toUpperCase() + item.heading.slice(1)`).

### 3. Update (Edit Todo via Halaman Detail — `src/app/detail.tsx`)
- Menekan salah satu kartu item todo pada `FlatList` akan menavigasikan pengguna ke halaman edit (`/detail`) menggunakan `router.push({ pathname: '/detail', params: { id: item.id, heading: item.heading } })`.
- Halaman `Detail` membaca parameter `id` dan `heading` melalui hook `useLocalSearchParams<{ id: string; heading: string }>()` dan menampilkannya ke dalam `TextInput` yang dapat diedit.
- Saat tombol **UPDATE** (`#0de065`) ditekan, fungsi `updateTodo()` mengeksekusi `todoRef.doc(id).update({ heading: textHeading.trim() })` dan otomatis mengembalikan pengguna ke layar utama menggunakan `router.back()`.

### 4. Delete (Hapus Todo — `src/app/index.tsx`)
- Setiap item pada `FlatList` dilengkapi tombol ikon tempat sampah berwarna merah (`<FontAwesome name="trash-o" color="red" />` dari `@expo/vector-icons`).
- Saat ikon ditekan, fungsi `deleteTodo(item)` memanggil `todoRef.doc(todo.id).delete()` untuk menghapus dokumen berdasarkan ID dokumen di Cloud Firestore.

---

## 📂 Struktur Proyek & Navigasi

Proyek ini menggunakan **Expo Router** dengan struktur file utama sebagai berikut:

```text
ToDoApp/
├── config.js                  # Konfigurasi & inisialisasi koneksi Firebase (Cloud Firestore)
├── package.json               # Daftar dependensi, versi library, dan skrip proyek
├── app.json                   # Konfigurasi aplikasi Expo
├── tsconfig.json              # Konfigurasi TypeScript (strict mode)
└── src/
    └── app/
        ├── _layout.tsx        # Konfigurasi Stack Navigator Expo Router (headerShown: false)
        ├── index.tsx          # Layar Utama (Home Screen): Read (onSnapshot + FlatList), Create, & Delete
        └── detail.tsx         # Layar Edit (Detail Screen): Update data todo berdasarkan ID dokumen
```

### Peran File Utama
| File | Peran & Tanggung Jawab |
| :--- | :--- |
| **`config.js`** | Mengimpor `firebase/compat/app` dan `firebase/compat/firestore`, menginisialisasi `firebaseConfig` (dengan penjagaan `if (!firebase.apps.length)`), serta mengekspor instance `firebase`. |
| **`src/app/_layout.tsx`** | Mendefinisikan `Stack` navigator dari `expo-router` dengan `screenOptions={{ headerShown: false }}` yang menghubungkan rute `index` dan `detail`. |
| **`src/app/index.tsx`** | Layar utama aplikasi yang memuat form input tambah todo, listener *real-time* `onSnapshot`, daftar `FlatList`, tombol hapus (`FontAwesome` `trash-o`), dan aksi `router.push` ke halaman detail. |
| **`src/app/detail.tsx`** | Layar pembaruan data todo yang menangkap `id` serta `heading` menggunakan `useLocalSearchParams`, memperbarui dokumen di Firestore, lalu memanggil `router.back()`. |

---

## ⚙️ Konfigurasi Firebase & Cara Menjalankan Proyek

### 1. Prasyarat
- **Node.js** telah terpasang di komputer.
- Aplikasi **Expo Go** di perangkat Android/iOS, atau **Android Emulator / iOS Simulator**.
- Proyek Firebase dengan layanan **Cloud Firestore** yang sudah diaktifkan.

### 2. Instalasi Dependensi
Clone repositori atau buka folder proyek ini, kemudian jalankan perintah berikut di terminal:

```bash
npm install
```

### 3. Konfigurasi Firebase (`config.js`) & Koleksi Firestore
1. Buka Firebase Console dan aktifkan **Cloud Firestore** (atur *Rules* agar mengizinkan baca/tulis selama pengujian).
2. Pastikan konfigurasi proyek Firebase Anda telah sesuai di dalam file `config.js`:

```javascript
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
```

3. Aplikasi secara otomatis menggunakan koleksi bernama **`todos`** dengan struktur field dokumen:
   - `heading` (*string*): isi teks todo.
   - `createdAt` (*timestamp*): waktu pembuatan dokumen dari `serverTimestamp()`.

### 4. Menjalankan Aplikasi
Jalankan server pengembangan Expo dengan perintah:

```bash
npx expo start
```

Atau jalankan langsung pada platform target sesuai skrip di `package.json`:

```bash
npm run android   # Menjalankan di Android Emulator / perangkat Android
npm run ios       # Menjalankan di iOS Simulator
npm run web       # Menjalankan di browser Web
```

---

## 📸 Screenshot Aplikasi & Database

> *Ganti path gambar di bawah ini dengan file tangkapan layar aplikasi dan konsol Firestore Anda.*

| Halaman Utama (Create, Read, Delete) | Halaman Detail (Update Todo) |
| :---: | :---: |
| ![Home Screen](./assets/screenshots/home-screen.png) | ![Detail Screen](./assets/screenshots/detail-screen.png) |

### Tampilan Cloud Firestore (`todos` Collection)
![Cloud Firestore Console](./assets/screenshots/firestore-console.png)

---

## 👨‍💻 Identitas Pembuat

| Informasi | Detail |
| :--- | :--- |
| **Nama** | **Fajar Try Sutrasno** |
| **NPM** | **41155050210053** |
| **Program Studi** | Teknik Informatika |
| **Institusi** | Universitas Langlangbuana (UNLA) |
| **Mata Kuliah** | Pemrograman Mobile (UTS – Tugas Sesi #6: CRUD To Do List) |
