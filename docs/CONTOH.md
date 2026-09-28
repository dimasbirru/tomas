# Contoh Penggunaan tomas

Semua contoh dijalankan di dalam mode interaktif. Ketik `tomas` di terminal, lalu ketik perintahnya langsung (tanpa prefix `tomas`).

## Daftar perintah

```
tomas> menu
Halo Dimas, ini daftar perintah tomas:

MENCATAT
  tambah "pesan"         catat kegiatan yang ditambahkan
  perbaiki "pesan"       catat perbaikan
  ubah "pesan"           catat perubahan

MENGELOLA
  lihat                  lihat seluruh catatan bernomor
  hariini                lihat catatan hari ini
  hapus <nomor|"teks">   hapus entri (lihat nomor atau cari teks) — dikonfirmasi
  cari "kata"            temuan catatan berisi kata

LAINNYA
  menu                   tampilkan daftar perintah ini
  lokasi                 lihat lokasi file catatan proyek ini
  versi                  versi tomas
  keluar                 keluar dari mode interaktif

Tips:
  Ketik langsung, misalnya tambah "fitur" atau lihat.
  Untuk menghapus: hapus 2 atau hapus "sebagian pesan" — selalu dikonfirmasi.
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
