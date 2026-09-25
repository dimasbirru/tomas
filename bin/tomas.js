#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
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
const fileCatatan = pathCatatan(config);

const TIPE = {
  tambah: "Tambah",
  perbaiki: "Perbaiki",
  ubah: "Ubah",
  hapus: "Hapus",
};

const c = (teks, kode) => (process.stdout.isTTY ? `\x1b[${kode}m${teks}\x1b[0m` : teks);
const hijau = (t) => c(t, "32");
const kuning = (t) => c(t, "33");
const abu = (t) => c(t, "90");
const tebal = (t) => c(t, "1");

function sapaan(modeInteraktif) {
  console.log(`Halo ${tebal(hijau(pemilik))}, selamat datang!`);
  console.log("Aku tomas, pencatat kerjaan harianmu.");
  if (modeInteraktif) {
    console.log(`Kamu sedang dalam mode tomas. Ketik ${hijau("bantu")} untuk daftar perintah, ${hijau("keluar")} untuk kembali ke terminal.`);
  } else {
    console.log(`Ketik ${hijau("tomas bantu")} untuk daftar perintah.`);
  }
}

function bantu() {
  const baris = [
    ['tambah "pesan"', "catat pekerjaan yang ditambahkan"],
    ['perbaiki "pesan"', "catat perbaikan"],
    ['ubah "pesan"', "catat perubahan"],
    ['hapus "pesan"', "catat penghapusan"],
    ["lihat", "lihat seluruh catatan"],
    ["hariini", "lihat catatan hari ini"],
    ["bantu", "tampilkan menu ini"],
    ["keluar", "keluar dari mode interaktif"],
    ["versi", "versi tomas"],
  ];
  const lebar = Math.max(...baris.map(([k]) => k.length));
  console.log(`Halo ${hijau(pemilik)}, ini daftar perintah tomas:`);
  for (const [k, v] of baris) {
    console.log(`  ${hijau(k.padEnd(lebar))}   ${v}`);
  }
  console.log(abu("\nDalam mode satu-perintah, tambahkan 'tomas' di depan, misalnya:"));
  console.log(abu(hijau('tomas tambah "tambah fitur pengaturan"')));
}

function versi() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  console.log(`tomas ${pkg.version}`);
}

function catatDenganJawaban(tipe, pesan) {
  if (!pesan) {
    console.log(kuning("Pesannya belum diisi."));
    console.log(`Contoh: ${hijau('tambah "deskripsi kegiatan"')}`);
    return;
  }
  catat(fileCatatan, pemilik, tipe, pesan);
  const tanggal = tanggalHariIni();
  const jam = jamSekarang();
  console.log(`Baik ${tebal(hijau(pemilik))}, saya catat: "${pesan}".`);
  console.log(`Sudah masuk ke catatan (${tanggal}, pukul ${jam}). Ketik ${hijau("lihat")} untuk melihatnya.`);
}

function tampilkanCatatan(teks, kosong, berjudul) {
  if (!teks) {
    console.log(kuning(kosong));
    console.log(`Ketik ${hijau('tambah "pesan"')} untuk mulai mencatat.`);
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

function parseBaris(baris) {
  const m = baris.trim().match(/^(\S+)(?:\s+([\s\S]*))?$/);
  const perintah = m ? m[1] : "";
  let pesan = m && m[2] ? m[2].trim() : "";
  pesan = pesan.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  return { perintah, pesan };
}

function jalankan(perintah, pesan) {
  switch (perintah) {
    case "bantu":
      bantu();
      return;
    case "tambah":
    case "perbaiki":
    case "ubah":
    case "hapus":
      catatDenganJawaban(TIPE[perintah], pesan);
      return;
    case "lihat":
      lihat();
      return;
    case "hariini":
      hariIni();
      return;
    case "versi":
    case "--versi":
    case "-v":
      versi();
      return;
    case "keluar":
    case "exit":
      return "keluar";
    case "":
      return;
    default:
      console.log(`Perintah "${perintah}" tidak dikenal.`);
      bantu();
  }
}

function modeInteraktif() {
  sapaan(true);
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.setPrompt("tomas> ");
  rl.prompt();

  rl.on("line", (baris) => {
    const { perintah, pesan } = parseBaris(baris);
    const hasil = jalankan(perintah, pesan);
    if (hasil === "keluar") {
      rl.close();
      return;
    }
    rl.prompt();
  });

  const pamit = () => {
    console.log(`Sampai jumpa ${pemilik}, sampai jumpa lagi!`);
    process.exit(0);
  };
  rl.on("close", pamit);
  process.on("SIGINT", pamit);
}

const { perintah, pesan } = parseBaris(args.join(" "));
if (perintah === "") {
  modeInteraktif();
} else {
  jalankan(perintah, pesan);
}