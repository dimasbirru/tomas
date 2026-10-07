import { mkdirSync, readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const CONFIG_PATH = join(ROOT, "config.tomas.json");

const DEFAULT_CONFIG = { pemilik: "Dimas", folderCatatan: "catatan" };

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

export function namaProyekSekarang() {
  const cwd = process.cwd();
  const base = cwd.split(/[\\/]/).filter(Boolean).pop() || "";
  const dibersihkan = base.replace(/[<>:"/\\|?*]/g, "").trim();
  if (!dibersihkan || /^[a-zA-Z]:$/.test(dibersihkan) || dibersihkan.length <= 1) {
    return "umum";
  }
  return dibersihkan;
}

export function pathCatatan(config) {
  if (config.fileCatatan) {
    return join(ROOT, config.fileCatatan);
  }
  const folder = config.folderCatatan || "catatan";
  return join(ROOT, folder, `${namaProyekSekarang()}.md`);
}

export function bacaCatatan(path) {
  if (!existsSync(path)) return null;
  return readFileSync(path, "utf8");
}

export function buatLogBaru(path, pemilik) {
  mkdirSync(dirname(path), { recursive: true });
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

export function cariEntri(path, teks) {
  const q = teks.trim().toLowerCase();
  if (!q) return [];
  return daftarEntri(path)
    .map((e, i) => ({ nomor: i + 1, ...e }))
    .filter(
      (e) =>
        e.pesan.toLowerCase().includes(q) ||
        e.tipe.toLowerCase().includes(q) ||
        e.tanggal.includes(q)
    );
}

export function tanggalOffset(tanggal, offset) {
  const [thn, bln, tgl] = tanggal.split("-").map(Number);
  const d = new Date(thn, bln - 1, tgl + offset);
  const thnBaru = String(d.getFullYear()).padStart(4, "0");
  const blnBaru = String(d.getMonth() + 1).padStart(2, "0");
  const tglBaru = String(d.getDate()).padStart(2, "0");
  return `${thnBaru}-${blnBaru}-${tglBaru}`;
}

export function hitungStreak(tanggalSet, acuan = tanggalHariIni()) {
  let pointer = tanggalSet.has(acuan) ? acuan : tanggalOffset(acuan, -1);
  let n = 0;
  while (tanggalSet.has(pointer)) {
    n += 1;
    pointer = tanggalOffset(pointer, -1);
  }
  return n;
}

const PERIODE_REKAP = ["hari", "minggu", "bulan", "semua"];

export function periodeValid(periode) {
  return PERIODE_REKAP.includes(periode);
}

//function untuk membuat rekap entri berdasarkan periode tertentu
export function rekapEntri(path, periode = "minggu") {
  const acuan = tanggalHariIni();
  const semua = daftarEntri(path);

  let terfilter = semua;
  let rentang = null;

  if (periode === "hari") {
    terfilter = semua.filter((e) => e.tanggal === acuan);
    rentang = [acuan, acuan];
  } else if (periode === "minggu") {
    const mulai = tanggalOffset(acuan, -6);
    terfilter = semua.filter((e) => e.tanggal >= mulai && e.tanggal <= acuan);
    rentang = [mulai, acuan];
  } else if (periode === "bulan") {
    const bulan = acuan.slice(0, 7);
    terfilter = semua.filter((e) => e.tanggal.startsWith(bulan));
    rentang = [bulan + "-01", bulan + "-31"];
  }

  const perTanggal = new Map();
  const perTipe = new Map();
  const perJam = new Map();

  for (const e of terfilter) {
    perTanggal.set(e.tanggal, (perTanggal.get(e.tanggal) || 0) + 1);
    perTipe.set(e.tipe, (perTipe.get(e.tipe) || 0) + 1);
    const jam = e.jam.split(".")[0];
    perJam.set(jam, (perJam.get(jam) || 0) + 1);
  }

  const perTipeUrut = [...perTipe.entries()].sort((a, b) => b[1] - a[1]);
  const perTanggalUrut = [...perTanggal.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const jamUrut = [...perJam.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);

  let totalHari = null;
  if (periode === "hari") totalHari = 1;
  else if (periode === "minggu") totalHari = 7;
  else if (periode === "bulan") {
    const [thn, bln] = acuan.split("-").map(Number);
    totalHari = new Date(thn, bln, 0).getDate();
  } else {
    totalHari = perTanggal.size;
  }

  return {
    periode,
    total: terfilter.length,
    hariAktif: perTanggal.size,
    totalHari,
    rentang,
    streak: hitungStreak(new Set(semua.map((e) => e.tanggal)), acuan),
    jamTeratas: jamUrut,
    perTipe: perTipeUrut,
    perTanggal: perTanggalUrut,
    maxPerTanggal: perTanggalUrut.length ? perTanggalUrut[perTanggalUrut.length - 1][1] : 0,
    maxPerTipe: perTipeUrut.length ? perTipeUrut[0][1] : 0,
  };
}

//function unutk menghapus entri berdasarkan nomor urut
export function dirSimpanan(path) {
  return join(dirname(path), ".tomas", "simpanan");
}

const POLA_SIMPANAN = /^(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})(?:-(\d+))?\.md$/;

export function daftarSimpanan(path) {
  const dir = dirSimpanan(path);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => POLA_SIMPANAN.test(f))
    .map((f) => {
      const m = f.match(POLA_SIMPANAN);
      return { nama: f, waktu: m[1], urut: Number(m[2] || 0) };
    })
    .sort((a, b) => a.waktu.localeCompare(b.waktu) || a.urut - b.urut)
    .map((s) => s.nama);
}

function stempelWaktu() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

export function simpanKeSimpanan(path) {
  const isi = bacaCatatan(path);
  if (isi === null) return null;
  const dir = dirSimpanan(path);
  mkdirSync(dir, { recursive: true });
  const stempel = stempelWaktu();
  let nama = `${stempel}.md`;
  let n = 1;
  while (existsSync(join(dir, nama))) {
    nama = `${stempel}-${n}.md`;
    n += 1;
  }
  const tujuan = join(dir, nama);
  writeFileSync(tujuan, isi);
  return tujuan;
}

export function undoTerakhir(path) {
  const daftar = daftarSimpanan(path);
  if (!daftar.length) return { ok: false, alasan: "tidak-ada" };
  const dir = dirSimpanan(path);
  const terpilih = daftar[daftar.length - 1];
  const isi = readFileSync(join(dir, terpilih), "utf8");
  writeFileSync(path, isi);
  unlinkSync(join(dir, terpilih));
  return { ok: true, dari: terpilih, sisa: daftar.length - 1 };
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

  const simpanan = simpanKeSimpanan(path);

  while (kepala.length && kepala[kepala.length - 1] === "") kepala.pop();
  const hasil = kepala.length ? [...kepala, "", ...seksi] : seksi;
  const teksBaru = hasil.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  writeFileSync(path, `${teksBaru}\n`);
  return { ok: true, nomor, simpanan };
}