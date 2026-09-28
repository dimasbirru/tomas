# tomas

Pencatat log kerja harian pribadi, langsung dari terminal. Tiap project punya catatannya sendiri.

```
$ tomas
Halo Dimas! Aku tomas, pencatat kerja 'tomas' — ketik bantu untuk perintah, keluar untuk keluar.

tomas> tambah "bikin halaman login"
Baik Dimas, saya catat: "bikin halaman login".

tomas> lihat
Seluruh catatan Dimas:

## 2026-09-25 (25 September 2026)
1. 15.54 — **Tambah**: bikin halaman login
```

## Fitur

- Mode interaktif: `tomas` masuk, ketik `keluar` untuk kembali ke terminal
- Catatan terpisah per project di `catatan/<nama-project>.md`
- Mencatat: `tambah`, `perbaiki`, `ubah`
- Mengelola: `lihat`, `hariini`, `cari "kata"`, `hapus <nomor|"teks">` (dengan pratinjau & konfirmasi)
- Perintah `lokasi` untuk melihat jalur file catatan project aktif
- Tanpa dependensi eksternal — murni Node.js
- Auto-test bawaan (`npm test`)

## Pemasangan

Butuh Node.js 18+ (`node --version`).

```bash
cd tomas
npm link
```

Buka terminal baru, lalu ketik `tomas` dari direktori mana pun.

## Catatan per project

Nama file diambil dari nama folder tempat `tomas` dijalankan. Folder `catatan/` dibuat otomatis dan tidak ikut di-commit ke git.

```
cd C:\Users\kemba\Projects\proyek-ecommerce
tomas   → memakai catatan/proyek-ecommerce.md

cd C:\Users\kemba\Projects\proyek-portfolio
tomas   → memakai catatan/proyek-portfolio.md
```

## Perintah

| Perintah | Fungsi |
|----------|--------|
| `tambah "pesan"` | catat kegiatan |
| `perbaiki "pesan"` | catat perbaikan |
| `ubah "pesan"` | catat perubahan |
| `lihat` | seluruh catatan bernomor |
| `hariini` | catatan hari ini |
| `cari "kata"` | temukan catatan |
| `hapus <nomor\|"teks">` | hapus entri (berkonfirmasi) |
| `lokasi` | jalur file catatan project aktif |
| `bantu` | daftar perintah |
| `versi` | versi tomas |
| `keluar` | kembali ke terminal |

Contoh pemakaian lengkap: [docs/CONTOH.md](docs/CONTOH.md).

> Nomor entri bersifat **urut** (1, 2, 3, ...) dan bergeser setiap kali ada yang dihapus. Kalau tidak yakin, pakai `hapus "teks"` daripada `hapus <nomor>`.

## Konfigurasi

`config.tomas.json`:

```json
{
  "pemilik": "Dimas",
  "folderCatatan": "catatan"
}
```

## Pengujian

```bash
npm test
```

## Lisensi

[MIT](LICENSE) © 2026 Dimas Birru
