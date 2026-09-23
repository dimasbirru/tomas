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