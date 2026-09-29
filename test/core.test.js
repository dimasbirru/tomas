import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { tmpdir } from "node:os";
import {
  tanggalHariIni,
  judulTanggal,
  catat,
  daftarEntri,
  hapusEntri,
  cariEntri,
  rekapEntri,
  periodeValid,
  hitungStreak,
  tanggalOffset,
  namaProyekSekarang,
  pathCatatan,
  ROOT,
} from "../src/core.js";

function setup() {
  const dir = mkdtempSync(join(tmpdir(), "tomas-test-"));
  return { dir, path: join(dir, "CATATAN.md") };
}

function teardown(dir) {
  rmSync(dir, { recursive: true, force: true });
}

test("tanggalHariIni berformat YYYY-MM-DD", () => {
  assert.match(tanggalHariIni(), /^\d{4}-\d{2}-\d{2}$/);
});

test("judulTanggal mengubah tanggal menjadi nama bulan Indonesia", () => {
  assert.equal(judulTanggal("2026-09-25"), "25 September 2026");
});

test("catat membuat file otomatis dan menulis entri pertama", () => {
  const { dir, path } = setup();
  const hasil = catat(path, "Dimas", "Tambah", "fitur testing");
  assert.ok(existsSync(path), "file catatan harus dibuat");
  assert.match(readFileSync(path, "utf8"), /fitur testing/);
  assert.ok(hasil.includes("fitur testing"));
  teardown(dir);
});

test("catat menggabungkan entri dengan tanggal yang sama", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "entri satu");
  catat(path, "Dimas", "Perbaiki", "entri dua");
  const teks = readFileSync(path, "utf8");
  const tanggal = tanggalHariIni();
  const hari = teks.split(`## ${tanggal}`)[1] || "";
  assert.ok(hari.includes("entri satu"));
  assert.ok(hari.includes("entri dua"));
  assert.equal((hari.match(/entri satu/g) || []).length, 1, "tidak boleh duplikat");
  teardown(dir);
});

test("daftarEntri membaca semua entri beserta tanggalnya", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "satu");
  catat(path, "Dimas", "Perbaiki", "dua");
  const daftar = daftarEntri(path);
  assert.equal(daftar.length, 2);
  assert.equal(daftar[0].tipe, "Tambah");
  assert.equal(daftar[1].pesan, "dua");
  assert.match(daftar[0].tanggal, /^\d{4}-\d{2}-\d{2}$/);
  teardown(dir);
});

test("hapusEntri menghapus nomor yang diminta", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "pertama");
  catat(path, "Dimas", "Ubah", "kedua");
  catat(path, "Dimas", "Perbaiki", "ketiga");
  const hasil = hapusEntri(path, 2);
  assert.ok(hasil.ok);
  const daftar = daftarEntri(path);
  assert.equal(daftar.length, 2);
  assert.equal(daftar[0].pesan, "pertama");
  assert.equal(daftar[1].pesan, "ketiga");
  teardown(dir);
});

test("hapusEntri mengembalikan gagal bila nomor tidak ditemukan", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "satu");
  assert.equal(hapusEntri(path, 5).ok, false);
  teardown(dir);
});

test("hapusEntri membuang header tanggal bila seksi jadi kosong", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "satu-satunya");
  const hasil = hapusEntri(path, 1);
  assert.ok(hasil.ok);
  const teks = readFileSync(path, "utf8");
  assert.ok(!teks.includes("## "), "header tanggal ikut terhapus bila kosong");
  teardown(dir);
});

test("cariEntri menemukan entri berdasarkan teks (tidak peduli huruf besar/kecil)", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "belajar React");
  catat(path, "Dimas", "Perbaiki", "bug login");
  catat(path, "Dimas", "Ubah", "styling react page");
  const hasil = cariEntri(path, "REACT");
  assert.equal(hasil.length, 2);
  assert.deepEqual(hasil.map((e) => e.nomor), [1, 3]);
  teardown(dir);
});

test("cariEntri kembali kosong bila tidak ada yang cocok", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "menulis catatan");
  assert.equal(cariEntri(path, "kapal").length, 0);
  teardown(dir);
});

test("cariEntri juga mencocokkan tanggal", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "entri apapun");
  const hasil = cariEntri(path, tanggalHariIni());
  assert.ok(hasil.length >= 1);
  teardown(dir);
});

test("namaProyekSekarang memakai nama folder kerja saat ini", () => {
  const nama = namaProyekSekarang();
  assert.ok(nama.length > 0);
  assert.equal(nama, basename(process.cwd()).replace(/[<>:"/\\|?*]/g, ""));
});

test("pathCatatan menaruh file per project di dalam folder catatan", () => {
  const p = pathCatatan({ folderCatatan: "catatan" });
  const folder = dirname(p);
  assert.equal(basename(folder), "catatan");
  assert.equal(dirname(folder), ROOT);
  assert.equal(basename(p), `${namaProyekSekarang()}.md`);
});

test("pathCatatan menghormati fileCatatan eksplisit bila diisi", () => {
  const p = pathCatatan({ fileCatatan: "CATATAN.md" });
  assert.equal(basename(p), "CATATAN.md");
  assert.equal(dirname(p), ROOT);
});

test("buatLogBaru membuat folder catatan bila belum ada", () => {
  const { dir, path } = setup();
  const dalam = join(dir, "catatan", "proyek-x.md");
  catat(dalam, "Dimas", "Tambah", "isi");
  assert.ok(existsSync(join(dir, "catatan")), "folder catatan harus dibuat otomatis");
  assert.match(readFileSync(dalam, "utf8"), /isi/);
  teardown(dir);
});

test("tanggalOffset mundur dan maju lintas bulan dengan benar", () => {
  assert.equal(tanggalOffset("2026-09-27", -6), "2026-09-21");
  assert.equal(tanggalOffset("2026-09-01", -1), "2026-08-31");
  assert.equal(tanggalOffset("2026-01-01", -1), "2025-12-31");
  assert.equal(tanggalOffset("2026-09-27", 0), "2026-09-27");
});

test("hitungStreak menghitung hari berurutan dan berhenti saat ada yang kosong", () => {
  const acuan = "2026-09-27";
  assert.equal(hitungStreak(new Set(), acuan), 0);
  assert.equal(hitungStreak(new Set(["2026-09-27"]), acuan), 1);
  assert.equal(
    hitungStreak(new Set(["2026-09-27", "2026-09-26", "2026-09-25"]), acuan),
    3
  );
  assert.equal(
    hitungStreak(new Set(["2026-09-27", "2026-09-26", "2026-09-24"]), acuan),
    2,
    "2026-09-25 kosong jadi streak terputus"
  );
  assert.equal(
    hitungStreak(new Set(["2026-09-26"]), acuan),
    1,
    "kalau hari ini kosong, streak dihitung dari kemarin"
  );
});

test("periodeValid hanya menerima periode yang dikenal", () => {
  assert.ok(periodeValid("hari"));
  assert.ok(periodeValid("minggu"));
  assert.ok(periodeValid("bulan"));
  assert.ok(periodeValid("semua"));
  assert.ok(!periodeValid("minggu depan"));
  assert.ok(!periodeValid(""));
});

test("rekapEntri menghitung total, hari aktif, dan breakdown per jenis", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "satu");
  catat(path, "Dimas", "Perbaiki", "dua");
  catat(path, "Dimas", "Perbaiki", "tiga");

  const r = rekapEntri(path, "hari");
  assert.equal(r.total, 3);
  assert.equal(r.hariAktif, 1);
  assert.equal(r.totalHari, 1);
  assert.deepEqual(r.perTipe, [
    ["Perbaiki", 2],
    ["Tambah", 1],
  ]);
  assert.equal(r.maxPerTipe, 2);
  assert.equal(r.perTanggal.length, 1);
  assert.equal(r.perTanggal[0][0], tanggalHariIni());
  teardown(dir);
});

test("rekapEntri streak memakai seluruh riwayat, bukan cuma periode", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "hari ini");
  const r = rekapEntri(path, "hari");
  assert.ok(r.streak >= 1, "harus ada entri hari ini sehingga streak minimal 1");
  teardown(dir);
});

test("rekapEntri periode kosong memberi angka nol tanpa error", () => {
  const { dir, path } = setup();
  const r = rekapEntri(path, "semua");
  assert.equal(r.total, 0);
  assert.equal(r.hariAktif, 0);
  assert.equal(r.streak, 0);
  assert.deepEqual(r.perTipe, []);
  assert.deepEqual(r.perTanggal, []);
  assert.equal(r.maxPerTipe, 0);
  assert.equal(r.maxPerTanggal, 0);
  teardown(dir);
});

test("rekapEntri rekap bulan hanya menghitung entri bulan berjalan", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "bulan ini");

  const isi = readFileSync(path, "utf8");
  const bulanLalu = tanggalOffset(tanggalHariIni(), -35);
  writeFileSync(
    path,
    isi + `\n## ${bulanLalu} (1 Januari 2026)\n\n- 09.00 — **Ubah**: entri lama\n`
  );

  const bulanIni = rekapEntri(path, "bulan");
  assert.equal(bulanIni.total, 1, "entri bulan lalu tidak boleh ikut");
  assert.equal(bulanIni.perTipe[0][0], "Tambah");

  const semua = rekapEntri(path, "semua");
  assert.equal(semua.total, 2, "periode semua harus mengambil semua entri");
  teardown(dir);
});

test("rekapEntri rekap minggu memakai rentang 7 hari", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "hari ini");
  const isi = readFileSync(path, "utf8");
  const lama = tanggalOffset(tanggalHariIni(), -30);
  writeFileSync(path, isi + `\n## ${lama} (1 Agustus 2026)\n\n- 09.00 — **Ubah**: entri lama\n`);

  const minggu = rekapEntri(path, "minggu");
  assert.equal(minggu.total, 1, "entri 30 hari lalu di luar rentang 7 hari");
  assert.equal(minggu.totalHari, 7);
  assert.equal(minggu.rentang[0], tanggalOffset(tanggalHariIni(), -6));
  assert.equal(minggu.rentang[1], tanggalHariIni());
  teardown(dir);
});

test("rekapEntri tidak menulis ke file catatan (read-only)", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "satu");
  const sebelum = readFileSync(path, "utf8");
  rekapEntri(path, "hari");
  rekapEntri(path, "bulan");
  rekapEntri(path, "semua");
  assert.equal(readFileSync(path, "utf8"), sebelum, "rekap tidak boleh mengubah file");
  teardown(dir);
});