# Changelog

Semua perubahan penting pada tomas dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).
Versi mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [1.0.0] - 2026-09-25

Rilis stabil pertama — dokumentasi lengkap dan pemaketan final.

### Ditambahkan
- Bagian "Contoh Penggunaan", "Fitur", "Konfigurasi", dan "Kontribusi" di README.
- Berkas `CONTRIBUTING.md` untuk panduan berkontribusi.
- Struktur proyek diperbarui (mencakup `test/` dan `CHANGELOG.md`).

### Perubahan
- Versi dinaikkan dari `0.1.0` menjadi `1.0.0`.

## [0.1.0] - 2026-09-25

Versi awal tomas (pengembangan bertahap Hari 1–5).

### Ditambahkan
- Kerangka proyek: `package.json`, `config.tomas.json`, struktur `bin/` & `src/`, README, lisensi MIT.
- Pemasangan sebagai perintah global lewat `npm link`.
- Sapaan pribadi dengan nama pemilik dari `config.tomas.json`.
- Menu `tomas bantu` dan cek versi `tomas --versi`.
- Pencatatan kegiatan: `tomas tambah`, `tomas perbaiki`, `tomas ubah`, `tomas hapus` — tersimpan di `CATATAN.md` dikelompokkan per tanggal & jam.
- Riwayat: `tomas lihat` (semua) dan `tomas hariini` (section hari ini).
- Pewarnaan output yang konsisten dan mudah dibaca.
- Auto-test dengan `node --test` (`npm test`).

### Catatan
- `CATATAN.md` adalah file hasil catatan pribadi dan dimasukkan ke `.gitignore`.