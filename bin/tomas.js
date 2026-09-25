#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  muatConfig,
  pathCatatan,
  catat,
  tanggalHariIni,
  judulTanggal,
  jamSekarang,
  ambilCatatan,
  ambilCatatanHariIni,
} from "../src/core.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = muatConfig();
const pemilik = config.pemilik || "Dimas";
const args = process.argv.slice(2);
const perintah = args[0] ?? "";
const pesan = args.slice(1).join(" ").trim();

const c = (teks, kode) => (process.stdout.isTTY ? `\x1b[${kode}m${teks}\x1b[0m` : teks);
const hijau = (t) => c(t, "32");
const kuning = (t) => c(t, "33");
const abu = (t) => c(t, "90");
const tebal = (t) => c(t, "1");

const fileCatatan = pathCatatan(config);

const TIPE = {
  tambah: "Tambah",
  perbaiki: "Perbaiki",
  ubah: "Ubah",
  hapus: "Hapus",
};

function sapaan() {
  console.log(`Halo ${tebal(hijau(pemilik))}, selamat datang!`);
  console.log("Aku tomas, pencatat kerjaan harianmu.");
  console.log(`Ketik ${hijau("tomas bantu")} untuk daftar perintah.`);
}

function bantu() {
  const baris = [
    ['tomas tambah "pesan"', "catat pekerjaan yang ditambahkan"],
    ['tomas perbaiki "pesan"', "catat perbaikan"],
    ['tomas ubah "pesan"', "catat perubahan"],
    ['tomas hapus "pesan"', "catat penghapusan"],
    ["tomas lihat", "lihat seluruh catatan"],
    ["tomas hariini", "lihat catatan hari ini"],
    ["tomas bantu", "tampilkan menu ini"],
    ["tomas --versi", "versi tomas"],
  ];
  const lebar = Math.max(...baris.map(([k]) => k.length));
  console.log(`Halo ${hijau(pemilik)}, ini daftar perintah tomas:`);
  for (const [k, v] of baris) {
    console.log(`  ${hijau(k.padEnd(lebar))}   ${v}`);
  }
  console.log(abu("\nCatatan disimpan di file CATATAN.md pada folder proyek tomas."));
  console.log(abu("Semua perintah di atas sudah aktif. Selamat mencatat!"));
}

function versi() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  console.log(`tomas ${pkg.version}`);
}

function catatDenganJawaban() {
  if (!pesan) {
    console.log(kuning("Pesannya belum diisi."));
    console.log(`Contoh: ${hijau(`tomas ${perintah} "deskripsi kegiatan"`)}`);
    return;
  }
  catat(fileCatatan, pemilik, TIPE[perintah], pesan);
  const tanggal = tanggalHariIni();
  const jam = jamSekarang();
  console.log(`Baik ${tebal(hijau(pemilik))}, saya catat: "${pesan}".`);
  console.log(
    `Sudah masuk ke catatan (${tanggal}, pukul ${jam}). Ketik ${hijau("tomas lihat")} untuk melihatnya.`
  );
}

function tampilkanCatatan(teks, kosong, berjudul) {
  if (!teks) {
    console.log(kuning(kosong));
    console.log(`Ketik ${hijau('tomas tambah "pesan"')} untuk mulai mencatat.`);
    return;
  }
  console.log(hijau(berjudul));
  console.log(teks);
}

function lihat() {
  tampilkanCatatan(
    ambilCatatan(fileCatatan),
    "Belum ada catatan sama sekali.",
    `Seluruh catatan ${tebal(pemilik)}:`
  );
}

function hariIni() {
  const tanggal = tanggalHariIni();
  tampilkanCatatan(
    ambilCatatanHariIni(fileCatatan),
    `Belum ada catatan untuk hari ini (${tanggal}).`,
    `Catatan hari ini (${tanggal}, ${judulTanggal(tanggal)}):`
  );
}

switch (perintah) {
  case "":
    sapaan();
    break;
  case "bantu":
    bantu();
    break;
  case "tambah":
  case "perbaiki":
  case "ubah":
  case "hapus":
    catatDenganJawaban();
    break;
  case "lihat":
    lihat();
    break;
  case "hariini":
    hariIni();
    break;
  case "--versi":
  case "-v":
  case "versi":
    versi();
    break;
  default:
    console.log(`Perintah "${perintah}" tidak dikenal.`);
    bantu();
}