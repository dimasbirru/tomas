# Contoh Penggunaan tomas

Semua contoh dijalankan di dalam mode interaktif. Ketik `tomas` di terminal, lalu ketik perintahnya langsung (tanpa prefix `tomas`).

## Daftar perintah

```
tomas> menu
Halo Dimas, ini daftar perintah tomas:

MENCATAT
  tambah "pesan"             catat kegiatan yang ditambahkan
  perbaiki "pesan"           catat perbaikan
  ubah "pesan"               catat perubahan

MENGELOLA
  lihat                      lihat seluruh catatan bernomor
  hariini                    lihat catatan hari ini
  rekap [hari|bulan|semua]   ringkasan statistik catatan
  hapus <nomor|"teks">       hapus entri (lihat nomor atau cari teks) — dikonfirmasi
  undo                       kembalikan penghapusan terakhir
  cari "kata"                temukan catatan berisi kata

LAINNYA
  menu                       tampilkan daftar perintah ini
  lokasi                     lihat lokasi file catatan proyek ini
  versi                      versi tomas
  keluar                     keluar dari mode interaktif
```

## Mencatat kegiatan

```
tomas> tambah "tambah fitur pengaturan"
Baik Dimas, saya catat: "tambah fitur pengaturan".
Sudah masuk ke catatan (2026-09-25, pukul 15.54). Ketik lihat untuk melihatnya.

tomas> perbaiki "bug harga di cart"
Baik Dimas, saya catat: "bug harga di cart".

tomas> ubah "ganti warna tombol"
Baik Dimas, saya catat: "ganti warna tombol".
```

## Melihat catatan

```
tomas> lihat
Seluruh catatan Dimas:

## 2026-09-25 (25 September 2026)
1. 15.54 — **Tambah**: tambah fitur pengaturan
2. 15.55 — **Perbaiki**: bug harga di cart
3. 15.55 — **Ubah**: ganti warna tombol
```

```
tomas> hariini
Catatan hari ini (2026-09-25, 25 September 2026):
## 2026-09-25 (25 September 2026)
1. 15.54 — **Tambah**: tambah fitur pengaturan
```

## Menghapus entri (pakai nomor)

Selalu ada pratinjau & konfirmasi sebelum dihapus:

```
tomas> hapus 2
Entri nomor 2 yang akan dihapus:
2. (2026-09-25) 15.55 — **Perbaiki**: bug harga di cart
Yakin hapus? Ketik ya untuk lanjut, atau lainnya untuk batal.
tomas> ya
Sudah kuhapus entri nomor 2.
Simpanan: C:\Users\kemba\Projects\tomas\catatan\.tomas\simpanan\2026-09-25-15-56-02.md
Ketik undo untuk mengembalikan, satu langkah per kali.
```

## Menghapus entri kalau lupa nomornya (pakai teks)

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

## Kembalikan penghapusan (undo)

Sebelum file ditimpa, tomas menyimpan salinannya ke `catatan/.tomas/simpanan/`. Perintah `undo` mengembalikan isi file persis seperti sebelum terakhir kali dihapus:

```
tomas> undo
File dikembalikan seperti sebelum hapus.
Dari: 2026-09-25-15-56-02.md
Sisa simpanan: 0
```

`undo` hanya menangani penghapusan — perintah tambah/perbaiki/ubah tidak bisa dibatalkan dengannya. Satu langkah per kali: kalau kamu hapus dua kali berturut-turut, `undo` pertama mengembalikan ke keadaan setelah hapus pertama, `undo` kedua ke keadaan sebelum keduanya.

Kalau tidak ada simpanan tersisa:

```
tomas> undo
Tidak ada simpanan yang bisa dikembalikan.
Simpanan tersimpan di C:\Users\kemba\Projects\tomas\catatan\.tomas\simpanan
```

## Mencari catatan

```
tomas> cari "login"
Ditemukan 2 catatan berisi 'login':
3. (2026-09-25) 15.58 — **Perbaiki**: bug login
7. (2026-09-25) 16.30 — **Tambah**: bikin halaman login
Mau hapus salah satunya? Gunakan hapus <nomor>.
```

`cari` juga cocok dengan **tanggal**, jadi bisa langsung menyaring satu hari:

```
tomas> cari 2026-09-25
Ditemukan 4 catatan berisi '2026-09-25':
1. (2026-09-25) 15.54 — **Tambah**: bikin halaman login
2. (2026-09-25) 15.58 — **Perbaiki**: bug login
3. (2026-09-25) 16.30 — **Tambah**: bikin halaman login
4. (2026-09-25) 17.02 — **Ubah**: ganti warna tombol
```

Kata kunci dicocokkan dengan isi pesan, jenis catatan (Tambah/Perbaiki/Ubah), dan tanggal — jadi `cari "perbaiki"` atau `cari "2026-09-25"` sama-sama berhasil.

## Rekap statistik

`rekap` meringkas catatan jadi angka. Tanpa argumen ia menghitung 7 hari terakhir.

```
tomas> rekap

REKAP 7 HARI TERAKHIR (2026-09-23 s/d 2026-09-29)
────────────────────────────────────────────────────
Total entri      24
Hari aktif       6 dari 7
Streak           3 hari beruntun
Jam paling sering 15:00 (8), 16:00 (5)

Per jenis
  Perbaiki  ████████████████████   10  42%
  Tambah    █████████████          6  25%
  Ubah      ████                   3  12%

Per hari
  2026-09-25  ██████████████  6
  2026-09-26  ████████        4
  2026-09-27  ████████████████████  10
```

Argumen yang tersedia:

| Perintah | Menghitung |
|----------|-----------|
| `rekap` | 7 hari terakhir (default) |
| `rekap hari` | hari ini saja |
| `rekap bulan` | bulan berjalan |
| `rekap semua` | seluruh riwayat |

Cara membacanya:
- **Streak** dihitung mundur dari hari ini. Kalau hari ini belum ada entri, streak dihitung dari kemarin.
- **Jam paling sering** diambil dari 3 jam tersibuk, jadi terlihat kapan kamu paling produktif.
- **Breakdown per jenis** menunjukkan rasio `Tambah` / `Perbaiki` / `Ubah`. Kalau `Perbaiki` jauh lebih besar, minggumu mungkin lebih banyak memperbaiki daripada membuat.
- `rekap` **tidak pernah menulis** ke file catatan — murni membaca.

Argumen yang tidak dikenal akan ditolak dengan daftar pilihan yang valid:

```
tomas> rekap minggu depan
Periode "minggu depan" tidak dikenal. Pilihan: hari, minggu (default), bulan, semua.
```

## Catatan tentang nomor entri

Nomor yang tampil di `lihat` dan `cari` adalah **nomor urut** (1, 2, 3, ...), bukan nomor baris di file. Konsekuensinya:

- Nomor **bergeser setiap kali ada entri dihapus** — jadi nomor bersifat "k的记忆", bukan identitas tetap.
- Nomor **berbeda antar project**, karena tiap project punya file sendiri.
- Entri lebih aman dihapus dengan `hapus "teks"` daripada `hapus <nomor>`, kalau tidak yakin nomornya masih benar.

## Lokasi file catatan

```
tomas> lokasi
Catatan proyek 'proyek-ecommerce' disimpan di:
C:\Users\kemba\Projects\tomas\catatan\proyek-ecommerce.md
```

## Keluar

```
tomas> keluar
Sampai jumpa Dimas, sampai jumpa lagi!
```
