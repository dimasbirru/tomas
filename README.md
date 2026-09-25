# tomas

Pencatat log kerja harian pribadi, langsung dari terminal.

```
$ tomas
Halo Dimas, selamat datang!

$ tomas tambah "tambah fitur pengaturan"
Baik Dimas, saya catat: tambah fitur pengaturan
Sudah masuk ke catatan.
```

Nama di atas ("Dimas") diambil dari `config.tomas.json`. Tiap pencatatan tersimpan rapi di file `CATATAN.md`, dikelompokkan per tanggal dan jam.

## Fitur

- Sapaan pribadi dengan nama pemilik (dari `config.tomas.json`)
- 4 jenis catatan: `tambah`, `perbaiki`, `ubah`, `hapus`
- Riwayat lengkap (`tomas lihat`) dan riwayat hari ini (`tomas hariini`)
- Auto-create file catatan (dibuat otomatis saat pertama mencatat)
- Tanpa dependensi eksternal — murni Node.js
- Auto-test bawaan (`npm test`)

## Status

Rilis v1.0.0. Semua perintah inti berfungsi: sapaan (`tomas`), menu (`tomas bantu`), cek versi (`tomas --versi`), pencatatan (`tambah`, `perbaiki`, `ubah`, `hapus`), serta riwayat (`lihat`, `hariini`).

## Roadmap Pengerjaan

| Step | Isi | Status |
|------|-----|--------|
| 1 | Kerangka proyek (repo, config, struktur, README) | Selesai |
| 2 | Sapaan `tomas` + menu `tomas bantu` | Selesai |
| 2.1 | Pasang tomas sebagai perintah global (`npm link`) | Selesai |
| 3 | Mesin catatan `CATATAN.md` + `tomas tambah "..."` | Selesai |
| 4 | Keyword `perbaiki`, `ubah`, `hapus` + `lihat` & `hariini` | Selesai |
| 5 | Polesan output, auto-test, CHANGELOG | Selesai |
| 6 | Dokumentasi lengkap + rilis `v1.0.0` | Selesai |

### Ide pengembangan lanjut

| # | Ide | Status |
|---|-----|--------|
| 6 | Perlihatkan lokasi `CATATAN.md` yang dibaca tomas | Terbuka |
| 7 | Mode interaktif (tanpa prefix `tomas` tiap perintah) | Terbuka |
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

Buka terminal baru, lalu coba:

```bash
tomas          # sapaan
tomas bantu    # menu perintah
tomas --versi  # versi
```

### Atau jalankan dari folder proyek saja

```bash
cd tomas
node bin/tomas.js          # sapaan
node bin/tomas.js bantu    # menu perintah
```

atau lewat script npm:

```bash
npm start
```

## Contoh Penggunaan

### 1. Berkenalan dengan tomas

```bash
$ tomas
Halo Dimas, selamat datang!
Aku tomas, pencatat kerjaan harianmu.
Ketik tomas bantu untuk daftar perintah.
```

### 0. Mode interaktif (tanpa `tomas` di tiap perintah)

Cukup ketik `tomas` sekali — kamu masuk mode tomas. Perintah berikutnya cukup langsung, tanpa prefix:

```bash
$ tomas
Halo Dimas, selamat datang!
Kamu sedang dalam mode tomas. Ketik bantu untuk daftar perintah, keluar untuk kembali ke terminal.

tomas> tambah "catatan hari ini"
Baik Dimas, saya catat: "catatan hari ini".
Sudah masuk ke catatan (2026-09-25, pukul 16.47).

tomas> hariini
Catatan hari ini (2026-09-25, 25 September 2026):
## 2026-09-25 (25 September 2026)

- 16.47 — **Tambah**: catatan hari ini

tomas> keluar
Sampai jumpa Dimas, sampai jumpa lagi!
```

Perintah sekali-pakai (`tomas tambah "..."`, `tomas lihat`, dst.) tetap tersedia.

### 2. Mencatat kegiatan

```bash
$ tomas tambah "tambah fitur pengaturan"
Baik Dimas, saya catat: "tambah fitur pengaturan".
Sudah masuk ke catatan (2026-09-25, pukul 15.54). Ketik tomas lihat untuk melihatnya.

$ tomas perbaiki "bug harga di cart"
$ tomas ubah "ganti warna tombol"
$ tomas hapus "hapus fitur cadangan"
```

### 3. Melihat catatan hari ini

```bash
$ tomas hariini
Catatan hari ini (2026-09-25, 25 September 2026):
## 2026-09-25 (25 September 2026)

- 15.54 — **Tambah**: tambah fitur pengaturan
- 15.54 — **Perbaiki**: bug harga di cart
- 15.54 — **Ubah**: ganti warna tombol
- 15.54 — **Hapus**: hapus fitur cadangan
```

### 4. Melihat seluruh catatan

```bash
$ tomas lihat
Seluruh catatan Dimas:
## 2026-09-25 (25 September 2026)

- 15.54 — **Tambah**: tambah fitur pengaturan
- 15.54 — **Perbaiki**: bug harga di cart
```

### 5. Lokasi file catatan

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

Hasil akhir diharapkan semua lulus (`pass`). Test mencakup format tanggal, pembuatan file catatan, pengelompokan per tanggal, serta riwayat `lihat`/`hariini`.

## Kontribusi

Ide, saran, atau perbaikan sangat diterima. Silakan lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduannya, atau buka [issue baru](https://github.com/dimasbirru/tomas/issues).

## Lisensi

[MIT](LICENSE) © 2026 Dimas Birru