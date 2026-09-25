import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const CONFIG_PATH = join(ROOT, "config.tomas.json");

const DEFAULT_CONFIG = { pemilik: "Dimas", fileCatatan: "CATATAN.md" };

export function muatConfig() {
  if (existsSync(CONFIG_PATH)) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync(CONFIG_PATH, "utf8")) };
    } catch {
      return DEFAULT_CONFIG;
    }
  }
  return DEFAULT_CONFIG;
}

export function tanggalHariIni() {
  const d = new Date();
  const tgl = String(d.getDate()).padStart(2, "0");
  const bln = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${bln}-${tgl}`;
}

export function jamSekarang() {
  const d = new Date();
  const jam = String(d.getHours()).padStart(2, "0");
  const mnt = String(d.getMinutes()).padStart(2, "0");
  return `${jam}.${mnt}`;
}

export function judulTanggal(tanggal) {
  const [thn, bln, tgl] = tanggal.split("-");
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${tgl} ${namaBulan[Number(bln) - 1]} ${thn}`;
}

export function pathCatatan(config) {
  const nama = config.fileCatatan || "CATATAN.md";
  return join(ROOT, nama);
}

export function bacaCatatan(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

export function buatLogBaru(path, pemilik) {
  writeFileSync(
    path,
    `# Catatan Kerja — tomas\n\nPemilik: ${pemilik}\nBerisi daftar kegiatan harian yang dicatat lewat tomas.\n\n`
  );
}

export function catat(path, pemilik, tipe, isi) {
  const tanggal = tanggalHariIni();
  const baris = `- ${jamSekarang()} — **${tipe}**: ${isi}\n`;
  const judul = `## ${tanggal} (${judulTanggal(tanggal)})`;

  if (!existsSync(path)) {
    buatLogBaru(path, pemilik);
    appendFileSync(path, `${judul}\n\n${baris}`);
    return `\`${tipe}\` "${isi}"`;
  }

  const teks = readFileSync(path, "utf8");
  if (teks.includes(judul)) {
    appendFileSync(path, baris);
  } else {
    const pembatas = teks.endsWith("\n") ? "" : "\n";
    appendFileSync(path, `${pembatas}\n${judul}\n\n${baris}`);
  }
  return `\`${tipe}\` "${isi}"`;
}

export function ambilCatatan(path) {
  const teks = bacaCatatan(path);
  if (!teks) return null;
  const baris = teks.split("\n");
  const mulai = baris.findIndex((b) => b.startsWith("## "));
  if (mulai === -1) return null;
  return baris.slice(mulai).join("\n").trim();
}

export function ambilCatatanHariIni(path) {
  const teks = bacaCatatan(path);
  if (!teks) return null;
  const judul = `## ${tanggalHariIni()}`;
  const baris = teks.split("\n");
  const idx = baris.findIndex((b) => b.startsWith(judul));
  if (idx === -1) return null;
  const bagian = baris.slice(idx).join("\n");
  return bagian.replace(/\s+$/, "");
}

const POLA_ENTRI = /^- (\d{2}\.\d{2}) — \*\*([^*]+)\*\*: (.*)$/;

export function daftarEntri(path) {
  const teks = bacaCatatan(path);
  if (!teks) return [];
  const hasil = [];
  let tanggal = null;
  for (const baris of teks.split(/\r?\n/)) {
    const judul = baris.match(/^## (\d{4}-\d{2}-\d{2})/);
    if (judul) {
      tanggal = judul[1];
      continue;
    }
    const m = baris.match(POLA_ENTRI);
    if (m && tanggal) {
      hasil.push({ tanggal, jam: m[1], tipe: m[2], pesan: m[3] });
    }
  }
  return hasil;
}

export function hapusEntri(path, nomor) {
  const teks = bacaCatatan(path);
  if (!teks) return { ok: false, alasan: "file-tidak-ada" };

  const garis = teks.split(/\r?\n/);
  const kepala = [];
  const seksi = [];
  let judul = null;
  let isi = [];
  let mulai = false;
  let no = 0;
  let dihapus = false;
  const simpan = () => {
    if (judul && isi.some((g) => POLA_ENTRI.test(g))) {
      seksi.push(judul, ...isi, "");
    }
    isi = [];
  };

  for (const baris of garis) {
    if (baris.startsWith("## ")) {
      simpan();
      judul = baris;
      mulai = true;
    } else if (!mulai) {
      kepala.push(baris);
    } else if (POLA_ENTRI.test(baris)) {
      no += 1;
      if (no === nomor) {
        dihapus = true;
      } else {
        isi.push(baris);
      }
    } else {
      isi.push(baris);
    }
  }
  simpan();

  if (!dihapus) return { ok: false, alasan: "nomor-tidak-ditemukan" };

  while (kepala.length && kepala[kepala.length - 1] === "") kepala.pop();
  const hasil = kepala.length ? [...kepala, "", ...seksi] : seksi;
  const teksBaru = hasil.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  writeFileSync(path, `${teksBaru}\n`);
  return { ok: true, nomor };
}