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
  cariEntri,
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
        ['hapus <nomor|"teks">', "hapus entri (lihat nomor atau cari teks) — dikonfirmasi"],
        ['cari "kata"', "temukan catatan berisi kata"],
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
  console.log(abu(`  Untuk menghapus: ${hijau('hapus 2')} atau ${hijau('hapus "sebagian pesan"')} — selalu dikonfirmasi.`));
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

const YA = new Set(["y", "ya", "yes", "1", "lanjut", "hapus"]);

function pratinjauEntri(e) {
  return `${e.nomor}. (${e.tanggal}) ${e.jam} — **${e.tipe}**: ${e.pesan}`;
}

function hapusDenganJawaban(pesan) {
  if (!pesan) {
    console.log(kuning("Nomor atau teks entri yang mau dihapus belum diisi."));
    console.log(`Contoh: ${hijau("hapus 5")} atau ${hijau('hapus "sebagian pesan"')}.`);
    return;
  }

  const nomor = Number(pesan);
  if (Number.isInteger(nomor) && nomor >= 1) {
    const daftar = daftarEntri(fileCatatan);
    const entri = daftar[nomor - 1];
    if (!entri) {
      console.log(kuning(`Tidak ada entri nomor ${nomor}. Ketik ${hijau("lihat")} dulu.`));
      return;
    }
    console.log(`Entri nomor ${tebal(hijau(String(nomor)))} yang akan dihapus:`);
    console.log(abu(pratinjauEntri({ nomor, ...entri })));
    console.log(`Yakin hapus? Ketik ${hijau("ya")} untuk lanjut, atau lainnya untuk batal.`);
    menunggu = { aksi: "konfirmasi-hapus", nomor };
    return;
  }

  const hasil = cariEntri(fileCatatan, pesan);
  if (!hasil.length) {
    console.log(kuning(`Tidak ada catatan yang berisi '${pesan}'.`));
    console.log(`Cek ejaannya atau ketik ${hijau("lihat")}.`);
    return;
  }
  if (hasil.length === 1) {
    console.log(`Ditemukan 1 catatan berisi '${pesan}':`);
    console.log(abu(pratinjauEntri(hasil[0])));
    console.log(`Yakin hapus? Ketik ${hijau("ya")} untuk lanjut, atau lainnya untuk batal.`);
    menunggu = { aksi: "konfirmasi-hapus", nomor: hasil[0].nomor };
    return;
  }
  console.log(`Ditemukan ${tebal(hijau(String(hasil.length)))} catatan berisi '${pesan}':`);
  for (const e of hasil) {
    console.log(pratinjauEntri(e));
  }
  console.log(`Ketik nomor untuk menghapus satu, ${hijau("semua")} untuk semua, atau ${hijau("batal")}.`);
  menunggu = { aksi: "pilih-entri", nomor: hasil.map((e) => e.nomor) };
}

function prosesJawaban(baris) {
  if (!menunggu) return true;
  const jawaban = baris.trim().toLowerCase();

  if (menunggu.aksi === "konfirmasi-hapus") {
    if (YA.has(jawaban)) {
      const hasil = hapusEntri(fileCatatan, menunggu.nomor);
      if (hasil.ok) {
        console.log(`Sudah kuhapus entri nomor ${tebal(hijau(String(menunggu.nomor)))}.`);
      } else {
        console.log(kuning(`Entri nomor ${menunggu.nomor} tidak ditemukan saat eksekusi.`));
      }
    } else {
      console.log("Batal, tidak ada yang dihapus.");
    }
    menunggu = null;
    return true;
  }

  if (menunggu.aksi === "pilih-entri") {
    if (jawaban === "semua" || jawaban === "all") {
      let berhasil = 0;
      for (const nomor of [...menunggu.nomor].sort((a, b) => b - a)) {
        if (hapusEntri(fileCatatan, nomor).ok) berhasil += 1;
      }
      console.log(`Sudah kuhapus ${tebal(hijau(String(berhasil)))} entri.`);
      menunggu = null;
      return true;
    }
    if (jawaban === "batal" || jawaban === "tidak" || jawaban === "no" || jawaban === "n" || jawaban === "0") {
      console.log("Batal, tidak ada yang dihapus.");
      menunggu = null;
      return true;
    }
    const nomor = Number(jawaban);
    if (Number.isInteger(nomor) && menunggu.nomor.includes(nomor)) {
      const hasil = hapusEntri(fileCatatan, nomor);
      console.log(
        hasil.ok
          ? `Sudah kuhapus entri nomor ${tebal(hijau(String(nomor)))}.`
          : kuning(`Entri nomor ${nomor} tidak ditemukan saat eksekusi.`)
      );
      menunggu = null;
      return true;
    }
    console.log(abu(`Hapus dibatalkan — '${baris.trim()}' bukan salah satu pilihan.`));
    menunggu = null;
    return false;
  }
  return true;
}

function cariDenganJawaban(teks) {
  if (!teks) {
    console.log(kuning("Teks yang dicari belum diisi."));
    console.log(`Contoh: ${hijau('cari "api"')}.`);
    return;
  }
  const hasil = cariEntri(fileCatatan, teks);
  if (!hasil.length) {
    console.log(kuning(`Tidak ada catatan yang berisi '${teks}'.`));
    console.log(`Cek ejaannya atau ketik ${hijau("lihat")}.`);
    return;
  }
  console.log(`Ditemukan ${tebal(hijau(String(hasil.length)))} catatan berisi '${teks}':`);
  for (const e of hasil) {
    console.log(pratinjauEntri(e));
  }
  console.log(abu(`Mau hapus salah satunya? Gunakan ${hijau('hapus <nomor>')}.`));
}

function parseBaris(baris) {
  const m = baris.trim().match(/^(\S+)(?:\s+([\s\S]*))?$/);
  const perintah = m ? m[1] : "";
  let pesan = m && m[2] ? m[2].trim() : "";
  pesan = pesan.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  return { perintah, pesan };
}

let menunggu = null;

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
      hapusDenganJawaban(pesan);
      return;
    case "cari":
      cariDenganJawaban(pesan);
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
    if (menunggu) {
      const diterima = prosesJawaban(baris);
      if (!diterima) {
        const { perintah: p2, pesan: m2 } = parseBaris(baris);
        const hasil2 = jalankan(p2, m2);
        if (hasil2 === "keluar") {
          rl.close();
          return;
        }
      }
      rl.prompt();
      return;
    }
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