# Berkontribusi ke tomas

Terima kasih sudah mau meluangkan waktu! tomas adalah proyek pribadi untuk belajar, jadi kontribusi — sekecil apa pun — sangat berarti.

## Cara berkontribusi

1. **Buka/lihat issue** di [Issues](https://github.com/dimasbirru/tomas/issues) untuk mengetahui ide & pekerjaan yang sedang direncanakan.
2. **Fork** repo ini dan buat branch baru:
   ```bash
   git checkout -b fitur-atau-perbaikan-baru
   ```
3. Kerjakan perubahan, lalu **pastikan test tetap hijau**:
   ```bash
   npm test
   ```
4. Commit dengan pesan yang jelas (gunakan *conventional commits*, mis. `feat:`, `fix:`, `docs:`).
5. **Buat Pull Request** dengan deskripsi singkat tentang perubahan dan kenapa diperlukan.

## Pedoman kecil

- Jaga kesederhanaan: tomas tanpa dependensi eksternal (kecuali memang dibutuhkan & dijelaskan).
- Ikuti gaya kode yang sudah ada (ESM, nama fungsi bahasa deskriptif).
- Tambahkan/update test di `test/core.test.js` bila logika berubah.
- Perbarui `CHANGELOG.md` bila fitur yang ditambahkan layak versi baru.

## Pertanyaan?

Buka [discussion/issue baru](https://github.com/dimasbirru/tomas/issues) — tim disambut pertanyaan apa pun.