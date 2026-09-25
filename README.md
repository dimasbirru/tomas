# tomas

Pencatat log kerja harian pribadi, langsung dari terminal.

```
$ tomas
Halo Dimas, selamat datang!
Aku tomas, pencatat kerjaan harianmu.
Ketik bantu untuk daftar perintah, keluar untuk kembali ke terminal.

tomas> tambah "tambah fitur pengaturan"
Baik Dimas, saya catat: "tambah fitur pengaturan".
Sudah masuk ke catatan (2026-09-25, pukul 15.54).
```

Ketik `tomas` sekali, kamu masuk mode tomas. Perintah berikutnya diketik langsung, tanpa prefix. Nama di atas ("Dimas") diambil dari `config.tomas.json`. Tiap pencatatan tersimpan rapi di file `CATATAN.md`, dikelompokkan per tanggal dan jam.

## Fitur

- Sapaan pribadi dengan nama pemilik (dari `config.tomas.json`)
- Mode interaktif: `tomas` masuk, ketik `keluar` untuk kembali ke terminal
- Mencatat: `tambah`, `perbaiki`, `ubah`
- Mengelola: `lihat` (seluruh, bernomor), `cari "kata"`, dan `hapus <nomor|"teks">` yang benar-benar menghapus entri dengan pratinjau & konfirmasi
- Auto-create file catatan (dibuat otomatis saat pertama mencatat)
- Tanpa dependensi eksternal — murni Node.js
- Auto-test bawaan (`npm test`)

## Status

Rilis v1.3.0. Semua perintah berfungsi dalam mode interaktif: sapaan (`tomas`), menu (`bantu`), cek versi (`versi`), pencatatan (`tambah`, `perbaiki`, `ubah`), riwayat (`lihat`, `hariini`), pencarian (`cari "kata"`), dan penghapusan aman (`hapus <nomor|"teks">`) dengan pratinjau & konfirmasi.

## Roadmap Pengerjaan

| Step | Isi | Status |
|------|-----|--------|
| 1 | Kerangka proyek (repo, config, struktur, README) | Selesai |
| 2 | Sapaan `tomas` + menu `bantu` | Selesai |
| 2.1 | Pasang tomas sebagai perintah global (`npm link`) | Selesai |
| 3 | Mesin catatan `CATATAN.md` + `tambah "..."` | Selesai |
| 4 | Keyword `perbaiki`, `ubah`, `hapus` + `lihat` & `hariini` | Selesai |
| 5 | Polesan output, auto-test, CHANGELOG | Selesai |
| 6 | Dokumentasi lengkap + rilis `v1.0.0` | Selesai |
| 7 | Mode interaktif (tanpa prefix `tomas` tiap perintah) | Selesai |
| 8 | `hapus` menghapus entri sungguhan (bernomor) | Selesai |
| 9 | `cari`, `hapus` berbasis teks, dan konfirmasi sebelum hapus | Selesai |

### Ide pengembangan lanjut

| # | Ide | Status |
|---|-----|--------|
| 6 | Perlihatkan lokasi `CATATAN.md` yang dibaca tomas | Terbuka |
| 8 | Input suara untuk mencatat (voice-to-note) | Terbuka |
| — | Auto-commit/push harian, rekap mingguan, ekspor JSON/CSV, tag & filter | Dipertimbangkan |

## Struktur Proyek

```
tomas/
├── bin/tomas.js          # Titik masuk CLI
├── src/core.js           # Logika inti (config, tanggal, catatan)
├── test/core.test.js     # Auto-test
├── config.tomas.json     # Nama pemilik & nama file catatan
├── CHANGELOG.md          # Riwayat versi
├── CATATAN.md            # Hasil catatan (dibuat saat pertama kali mencatat, tidak ikut git)
├── package.json
└── README.md
```

## Cara Memasang & Menjalankan

Butuh Node.js 18+ (`node --version`).

### Pakai sebagai perintah global (disarankan)

Setelah instalasi, perintah `tomas` bisa diketik dari direktori mana pun.

```bash
cd tomas
npm link
```

Buka terminal baru, lalu ketik:

```bash
tomas   # masuk mode tomas
```

### Atau jalankan dari folder proyek saja

```bash
cd tomas
node bin/tomas.js
```

## Contoh Penggunaan

Semua contoh ini di dalam mode interaktif (jalankan `tomas` dulu).

### 1. Berkenalan dengan tomas

```
tomas> bantu
Halo Dimas, ini daftar perintah tomas:

MENCATAT
  tambah "pesan"     catat kegiatan yang ditambahkan
  perbaiki "pesan"   catat perbaikan
  ubah "pesan"       catat perubahan

MENGELOLA
  lihat                  lihat seluruh catatan bernomor
  hariini                lihat catatan hari ini
  hapus <nomor|"teks">   hapus entri (lihat nomor atau cari teks) — dikonfirmasi
  cari "kata"            temukan catatan berisi kata

LAINNYA
  bantu                  tampilkan menu ini
  versi                  versi tomas
  keluar                 keluar dari mode interaktif
```

### 2. Mencatat kegiatan

```
tomas> tambah "tambah fitur pengaturan"
Baik Dimas, saya catat: "tambah fitur pengaturan".
Sudah masuk ke catatan (2026-09-25, pukul 15.54).

tomas> perbaiki "bug harga di cart"
Baik Dimas, saya catat: "bug harga di cart".

tomas> ubah "ganti warna tombol"
Baik Dimas, saya catat: "ganti warna tombol".
```

### 3. Melihat seluruh catatan (bernomor)

```
tomas> lihat
Seluruh catatan Dimas:

## 2026-09-25 (25 September 2026)
1. 15.54 — **Tambah**: tambah fitur pengaturan
2. 15.55 — **Perbaiki**: bug harga di cart
3. 15.55 — **Ubah**: ganti warna tombol
```

### 4. Menghapus entri (pakai nomor)

Nomor pada `lihat` dipakai untuk menghapus — selalu ada pratinjau & konfirmasi:

```
tomas> hapus 2
Entri nomor 2 yang akan dihapus:
2. (2026-09-25) 15.55 — **Perbaiki**: bug harga di cart
Yakin hapus? Ketik ya untuk lanjut, atau lainnya untuk batal.
tomas> ya
Sudah kuhapus entri nomor 2.
```

### 4b. Menghapus entri kalau lupa nomornya (pakai teks)

Lupa entri nomor berapa? Langsung hapus dengan sebagian isi pesannya:

```
tomas> hapus "bug harga"
Ditemukan 1 catatan berisi 'bug harga':
3. (2026-09-25) 15.55 — **Perbaiki**: bug harga di cart
Yakin hapus? Ketik ya untuk lanjut, atau lainnya untuk batal.
tomas> ya
Sudah kuhapus entri nomor 3.
```

Kalau yang cocok banyak, tomas menampilkan pilihan:

```
tomas> hapus "fitur"
Ditemukan 3 catatan berisi 'fitur':
1. (2026-09-25) 15.54 — **Tambah**: tambah fitur pengaturan
2. (2026-09-25) 15.57 — **Ubah**: ubah fitur harga
3. (2026-09-25) 16.02 — **Hapus**: lepas fitur cadangan
Ketik nomor untuk menghapus satu, semua untuk semua, atau batal.
tomas> semua
Sudah kuhapus 3 entri.
```

Ketik selain nomor (mis. `lihat` atau `keluar`) untuk membatalkan pilihan itu.

### 5. Mencari catatan

```
tomas> cari "login"
Ditemukan 2 catatan berisi 'login':
3. (2026-09-25) 15.58 — **Perbaiki**: bug login
7. (2026-09-25) 16.30 — **Tambah**: bikin halaman login
Mau hapus salah satunya? Gunakan hapus <nomor>.
```

### 6. Melihat catatan hari ini

```
tomas> hariini
Catatan hari ini (2026-09-25, 25 September 2026):
## 2026-09-25 (25 September 2026)
1. 15.54 — **Tambah**: tambah fitur pengaturan
```

### 7. Keluar

```
tomas> keluar
Sampai jumpa Dimas, sampai jumpa lagi!
```

### 8. Lokasi file catatan

Catatan tersimpan (dan dibuat otomatis bila belum ada) di:

```
C:\Users\kemba\Projects\tomas\CATATAN.md
```

## Konfigurasi

Ubah nama pemilik atau nama file catatan di `config.tomas.json`:

```json
{
  "pemilik": "Dimas",
  "fileCatatan": "CATATAN.md"
}
```

## Pengujian

Jalankan auto-test (tanpa dependensi eksternal):

```bash
npm test
```

Hasil akhir diharapkan semua lulus (`pass`). Test mencakup format tanggal, pembuatan file catatan, pengelompokan per tanggal, pembacaan entri (`lihat`), pencarian teks (`cari`), serta penghapusan entri (`hapus`).

## Kontribusi

Ide, saran, atau perbaikan sangat diterima. Silakan lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduannya, atau buka [issue baru](https://github.com/dimasbirru/tomas/issues).

## Lisensi

[MIT](LICENSE) © 2026 Dimas Birru