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

## Status

Pengembangan bertahap. Perintah yang sudah berfungsi: sapaan (`tomas`), menu (`tomas bantu`), cek versi (`tomas --versi`), pencatatan (`tambah`, `perbaiki`, `ubah`, `hapus`), serta riwayat (`lihat`, `hariini`).

## Roadmap Pengerjaan

| Step | Isi | Status |
|------|-----|--------|
| 1 | Kerangka proyek (repo, config, struktur, README) | Selesai |
| 2 | Sapaan `tomas` + menu `tomas bantu` | Selesai |
| 2.1 | Pasang tomas sebagai perintah global (`npm link`) | Selesai |
| 3 | Mesin catatan `CATATAN.md` + `tomas tambah "..."` | Selesai |
| 4 | Keyword `perbaiki`, `ubah`, `hapus` + `lihat` & `hariini` | Selesai |
| 5 | Polesan output, auto-test, CHANGELOG | Selesai |
| 6 | Dokumentasi lengkap + rilis `v1.0.0` | Belum |

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
├── src/                  # Logika inti
├── config.tomas.json     # Nama pemilik & nama file catatan
├── CATATAN.md            # Hasil catatan (dibuat saat pertama kali mencatat)
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

## Pengujian

Jalankan auto-test (tanpa dependensi eksternal):

```bash
npm test
```

Hasil akhir diharapkan semua lulus (`pass`). Test mencakup format tanggal, pembuatan file catatan, pengelompokan per tanggal, serta riwayat `lihat`/`hariini`.

## Lisensi

[MIT](LICENSE)