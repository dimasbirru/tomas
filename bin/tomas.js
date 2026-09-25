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
  daftarEntri,
  hapusEntri,
} from "../src/core.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = muatConfig();
const pemilik = config.pemilik || "Dimas";
const fileCatatan = pathCatatan(config);

const TIPE = {
  tambah: "Tambah",
  perbaiki: "Perbaiki",
  ubah: "Ubah",
};

const c = (teks, kode) => (process.stdout.isTTY ? `\x1b[${kode}m${teks}\x1b[0m` : teks);
const hijau = (t) => c(t, "32");
const kuning = (t) => c(t, "33");
const abu = (t) => c(t, "90");
const tebal = (t) => c(t, "1");

function sapaan() {
  console.log(`Halo ${tebal(hijau(pemilik))}, selamat datang!`);
  console.log("Aku tomas, pencatat kerjaan harianmu.");
  console.log(`Ketik ${hijau("bantu")} untuk daftar perintah, ${hijau("keluar")} untuk kembali ke terminal.`);
}

function bantu() {
  const kelompok = [
    {
      judul: "Mencatat",
      baris: [
        ['tambah "pesan"', "catat kegiatan yang ditambahkan"],
        ['perbaiki "pesan"', "catat perbaikan"],
        ['ubah "pesan"', "catat perubahan"],
      ],
    },
    {
      judul: "Mengelola",
      baris: [
        ["lihat", "lihat seluruh catatan bernomor"],
        ["hariini", "lihat catatan hari ini"],
        ["hapus <nomor>", "hapus entri sesuai nomor (lihat dulu)"],
      ],
    },
    {
      judul: "Lainnya",
      baris: [
        ["bantu", "tampilkan menu ini"],
        ["versi", "versi tomas"],
        ["keluar", "keluar dari mode interaktif"],
      ],
    },
  ];

  const lebar = Math.max(...kelompok.flatMap((k) => k.baris).map(([k]) => k.length));
  console.log(`Halo ${hijau(pemilik)}, ini daftar perintah tomas:`);
  for (const { judul, baris } of kelompok) {
    console.log(`\n${tebal(hijau(judul.toUpperCase()))}`);
    for (const [k, v] of baris) {
      console.log(`  ${hijau(k.padEnd(lebar))}   ${v}`);
    }
  }
  console.log(`\n${abu("Tips:")}`);
  console.log(abu(`  Ketik langsung, misalnya ${hijau('tambah "fitur"')} atau ${hijau("lihat")}.`));
  console.log(abu(`  Untuk menghapus: ${hijau("lihat")} dulu, lalu ${hijau("hapus 2")}.`));
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

function cetakDaftar(daftar) {
  let tanggalSekarang = null;
  daftar.forEach((e, i) => {
    if (e.tanggal !== tanggalSekarang) {
      tanggalSekarang = e.tanggal;
      console.log(`\n${hijau(`## ${e.tanggal} (${judulTanggal(e.tanggal)})`)}`);
    }
    console.log(`${i + 1}. ${e.jam} — **${e.tipe}**: ${e.pesan}`);
  });
}

function lihat() {
  const daftar = daftarEntri(fileCatatan);
  if (!daftar.length) {
    console.log(kuning("Belum ada catatan sama sekali."));
    console.log(`Ketik ${hijau('tambah "pesan"')} untuk mulai mencatat.`);
    return;
  }
  console.log(hijau(`Seluruh catatan ${tebal(pemilik)}:`));
  cetakDaftar(daftar);
}

function hariIni() {
  const tanggal = tanggalHariIni();
  const daftar = daftarEntri(fileCatatan).filter((e) => e.tanggal === tanggal);
  if (!daftar.length) {
    console.log(kuning(`Belum ada catatan untuk hari ini (${tanggal}).`));
    console.log(`Ketik ${hijau('tambah "pesan"')} untuk mulai mencatat.`);
    return;
  }
  console.log(hijau(`Catatan hari ini (${tanggal}, ${judulTanggal(tanggal)}):`));
  cetakDaftar(daftar);
}

function hapusDenganJawaban(nomor) {
  if (!Number.isInteger(nomor) || nomor < 1) {
    console.log(kuning("Nomor entri yang mau dihapus belum diisi."));
    console.log(`Ketik ${hijau("lihat")} dulu untuk melihat nomor, lalu ${hijau("hapus 2")}.`);
    return;
  }
  const hasil = hapusEntri(fileCatatan, nomor);
  if (hasil.ok) {
    console.log(`Sudah kuhapus entri nomor ${tebal(hijau(String(nomor)))}.`);
    console.log(`Ketik ${hijau("lihat")} untuk daftar terbaru.`);
  } else if (hasil.alasan === "nomor-tidak-ditemukan") {
    console.log(kuning(`Tidak ada entri nomor ${nomor}. Ketik ${hijau("lihat")} dulu.`));
  } else {
    console.log(kuning("Belum ada catatan sama sekali."));
  }
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
      catatDenganJawaban(TIPE[perintah], pesan);
      return;
    case "hapus":
      hapusDenganJawaban(Number(pesan));
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
  sapaan();
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

modeInteraktif();