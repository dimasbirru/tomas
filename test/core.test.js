import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  tanggalHariIni,
  judulTanggal,
  catat,
  ambilCatatan,
  ambilCatatanHariIni,
  daftarEntri,
  hapusEntri,
  cariEntri,
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

test("ambilCatatan mengembalikan null bila file belum ada", () => {
  const { dir, path } = setup();
  assert.equal(ambilCatatan(path), null);
  teardown(dir);
});

test("ambilCatatan mengabaikan header file dan hanya menampilkan bagian catatan", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Ubah", "pesan contoh");
  const hasil = ambilCatatan(path);
  assert.ok(!hasil.includes("Catatan Kerja"), "header tidak boleh tampil");
  assert.ok(!hasil.includes("Pemilik:"), "baris pemilik tidak boleh tampil");
  assert.ok(hasil.includes("pesan contoh"));
  teardown(dir);
});

test("ambilCatatanHariIni mengembalikan null bila belum ada catatan", () => {
  const { dir, path } = setup();
  assert.equal(ambilCatatanHariIni(path), null);
  teardown(dir);
});

test("ambilCatatanHariIni membaca section tanggal hari ini", () => {
  const { dir, path } = setup();
  catat(path, "Dimas", "Tambah", "pesan hari ini");
  const bagian = ambilCatatanHariIni(path);
  assert.ok(bagian.includes("pesan hari ini"));
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