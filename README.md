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

Proyek masih dalam tahap awal (kerangka). Belum ada perintah yang berfungsi.

## Roadmap Pengerjaan

| Step | Isi | Status |
|------|-----|--------|
| 1 | Kerangka proyek (repo, config, struktur, README) | Selesai |
| 2 | Sapaan `tomas` + menu `tomas bantu` | Selesai |
| 3 | Mesin catatan `CATATAN.md` + `tomas tambah "..."` | Belum |
| 4 | Keyword `perbaiki`, `ubah`, `hapus` + `lihat` & `hariini` | Belum |
| 5 | Polesan output, auto-test, CHANGELOG | Belum |
| 6 | Dokumentasi lengkap + rilis `v1.0.0` | Belum |

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

## Cara Menjalankan (sementara)

Kerangka saja, jadi hanya memastikan Node terpasang:

```bash
node --version
```

## Lisensi

[MIT](LICENSE)