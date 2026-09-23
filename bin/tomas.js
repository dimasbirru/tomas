#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { muatConfig, pathCatatan, catat, tanggalHariIni, jamSekarang } from "../src/core.js";

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
    ['tomas lihat', "lihat seluruh catatan"],
    ['tomas hariini', "lihat catatan hari ini"],
    ['tomas bantu', "tampilkan menu ini"],
    ["tomas --versi", "versi tomas"],
  ];
  const lebar = Math.max(...baris.map(([k]) => k.length));
  console.log(`Halo ${hijau(pemilik)}, ini daftar perintah tomas:`);
  for (const [k, v] of baris) {
    console.log(`  ${hijau(k.padEnd(lebar))}   ${v}`);
  }
  console.log(abu("\nCatatan: perintah selain bantu/menunya aktif di tahap ke-3 dan ke-4,"));
  console.log(abu("lihat daftar lengkap di README (Roadmap Pengerjaan)."));
}

function versi() {
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  console.log(`tomas ${pkg.version}`);
}

function tambah() {
  if (!pesan) {
    console.log(kuning("Pesannya belum diisi."));
    console.log(`Contoh: ${hijau('tomas tambah "tambah fitur pengaturan"')}`);
    return;
  }
  catat(pathCatatan(config), pemilik, "Tambah", pesan);
  const tanggal = tanggalHariIni();
  const jam = jamSekarang();
  console.log(`Baik ${tebal(hijau(pemilik))}, saya catat: "${pesan}".`);
  console.log(
    `Sudah masuk ke catatan (${tanggal}, pukul ${jam}). Ketik ${hijau("tomas lihat")} untuk melihatnya.`
  );
}

const RENCANA = ["perbaiki", "ubah", "hapus", "lihat", "hariini"];

switch (perintah) {
  case "":
    sapaan();
    break;
  case "bantu":
    bantu();
    break;
  case "tambah":
    tambah();
    break;
  case "--versi":
  case "-v":
  case "versi":
    versi();
    break;
  default:
    if (RENCANA.includes(perintah)) {
      console.log(kuning(`Perintah "${perintah}" belum tersedia.`));
      console.log("Ini bagian dari pengembangan tahap ke-4.");
      console.log(`Ketik ${hijau("tomas bantu")} untuk melihat menu.`);
    } else {
      console.log(`Perintah "${perintah}" tidak dikenal.`);
      bantu();
    }
}