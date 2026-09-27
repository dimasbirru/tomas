# Changelog

Semua perubahan penting pada tomas dicatat di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).
Versi mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [1.4.1] - 2026-09-27

### Perubahan
- README dipangkas: contoh penggunaan lengkap dipindahkan ke `docs/CONTOH.md`, tabel perintah diringkas.
- Versi dinaikkan dari `1.4.0` menjadi `1.4.1`.

## [1.4.0] - 2026-09-27

### Ditambahkan
- **Catatan terpisah per project**: setiap project punya file sendiri di `catatan/<nama-project>.md` (nama diambil dari folder tempat `tomas` dijalankan). Semua file terkumpul dalam satu folder `catatan/` di dalam repo tomas.
- Perintah `lokasi` — menampilkan jalur lengkap file catatan project yang sedang aktif.
- Sapaan sekalian menyebut nama project aktif dan lokasi relatif filenya.
- Folder `catatan/` dibuat otomatis saat pertama kali mencatat, dan sudah masuk `.gitignore`.
- Nama file project dibersihkan dari karakter yang tidak valid di Windows.

### Perubahan
- `config.tomas.json`: `fileCatatan` diganti `folderCatatan` (default `catatan`). Kalau `fileCatatan` masih diisi, perilaku lama (satu file di root repo) tetap dipakai.
- Versi dinaikkan dari `1.3.0` menjadi `1.4.0`.

## [1.3.0] - 2026-09-25

### Ditambahkan
- `cari "kata"` — temukan catatan yang berisi kata/kalimat (menampilkan nomor entri).
- `hapus "sebagian pesan"` — hapus entri berdasarkan teks bila lupa nomornya. Cocok saat catatan sudah banyak.
- **Pratinjau & konfirmasi**: sebelum menghapus, tomas menampilkan entri yang akan dihapus lalu menunggu `ya` untuk lanjut.
- Bila banyak entri cocok, tomas menampilkan daftar pilihan lalu menerima nomor / `semua` / `batal`.
- Input yang bukan pilihan saat konfirmasi otomatis **membatalkan** hapus, dan diperlakukan sebagai perintah biasa.

### Perubahan
- `hapus <nomor>` kini menampilkan pratinjau & konfirmasi (tidak langsung eksekusi).
- Menu `bantu` diperbarui (baris `hapus <nomor|"teks">` dan `cari "kata"`).
- Versi dinaikkan dari `1.2.0` menjadi `1.3.0`.

## [1.2.0] - 2026-09-25

### Ditambahkan
- `hapus <nomor>` kini **menghapus entri sungguhan** (sebelumnya hanya mencatat kategori "Hapus"). Gunakan `lihat` untuk melihat nomor, lalu `hapus 2`.
- `lihat` dan `hariini` menampilkan entri **bernomor**.
- Header tanggal yang kehabisan entri otomatis dibersihkan.

### Perubahan
- **Satu mode saja**: tomas kini murni interaktif (`tomas` → ketik perintah langsung, `keluar` untuk kembali). Mode satu-perintah (`tomas tambah "..."`) dihapus.
- `hapus "pesan"` tidak lagi mencatat kategori; perintah `hapus` kini butuh nomor entri.
- Menu `bantu` dirapikan menjadi kelompok Mencatat / Mengelola / Lainnya.
- Versi dinaikkan dari `1.1.0` menjadi `1.2.0`.

## [1.1.0] - 2026-09-25

### Ditambahkan
- **Mode interaktif**: ketik `tomas` sekali, lalu perintah cukup langsung (`tambah "..."`, `lihat`, `hariini`, `keluar`) tanpa prefix `tomas`.
- Perintah `keluar` / `exit` untuk kembali ke terminal.
- Dokumentasi mode interaktif di README.

### Perubahan
- Versi dinaikkan dari `1.0.0` menjadi `1.1.0`.

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