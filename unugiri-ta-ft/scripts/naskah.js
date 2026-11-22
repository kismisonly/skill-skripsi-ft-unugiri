// naskah.js — pustaka kecil untuk membuat naskah proposal/skripsi FT UNUGIRI (.docx)
// Dibangun di atas paket npm `docx` (v9). Semua ukuran dalam twip (1 cm = 567 twip).
//
// Pakai:
//   const N = require('./naskah');
//   const doc = N.buatDokumen({ refs, sections: [...] });   // lihat contoh_proposal.js
//   await N.simpan(doc, 'Proposal.docx');
//   lalu jalankan: python3 rapikan.py Proposal.docx   (nomor footnote ulang per bab + footnote tak terpotong)
//
// Prinsip tata letak (Pedoman TA FT 2026 + kebiasaan bimbingan):
//   A4, margin atas/kiri 4 cm, bawah/kanan 3 cm, TNR 12, spasi 2 (before/after 0), rata kanan-kiri.
//   Penomoran bertingkat A. → 1. → a. → 1) → a), tiap tingkat menjorok 0,7 cm (397 twip).
//   Paragraf di bawah sebuah judul lurus dengan teks judulnya, baris pertama menjorok 1,2 cm.
//   Footnote TNR 10, spasi 1, Chicago 17 full note. Tabel TNR 10 spasi 1, sejajar teks di atasnya.

const fs = require('fs');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType,
  BorderStyle, FootnoteReferenceRun, Footer, Header, PageNumber, NumberFormat, ImageRun, TabStopType,
  VerticalAlign, PageBreak, HeadingLevel,
} = D;

const CM = 567;
const LEBAR_TEKS = 11906 - 2268 - 1701; // 7937 twip = 14 cm
const STEP = 397;                         // 0,7 cm per tingkat
const SPASI2 = 480, SPASI1 = 240;
const FONT = 'Times New Roman';

// ---------- teks dengan format sederhana: *miring*, **tebal**, {{kunci|halaman}} = footnote ----------
let REFS = {};
let FOOTNOTES = {};
let FN_ID = 0;
let FN_LOG = [];      // untuk pengecekan: jumlah footnote per paragraf

function fnText(key, pg) {
  const r = REFS[key];
  if (!r) throw new Error(`Rujukan "${key}" belum ada di refs`);
  return r.f(pg);
}

// Gabungkan semua sitasi di satu paragraf menjadi maksimal `maks` footnote (default 2).
// Sitasi berurutan yang berdekatan digabung dengan titik koma.
function runs(teks, opt = {}) {
  const size = opt.size || 24;
  const out = [];
  const parts = teks.split(/(\{\{[^}]+\}\})/);
  let fnCount = 0;
  for (const part of parts) {
    if (!part) continue;
    const m = part.match(/^\{\{(.+)\}\}$/);
    if (m) {
      // {{kunciA|12; kunciB|30-31}} → satu footnote berisi dua sumber
      const sumber = m[1].split(';').map(s => s.trim()).filter(Boolean).map(s => {
        const [k, pg] = s.split('|').map(x => x && x.trim());
        return fnText(k, pg).replace(/\.\s*$/, '');
      });
      const id = ++FN_ID;
      FOOTNOTES[id] = { children: [fnParagraph(sumber.join('; ') + '.')] };
      out.push(new FootnoteReferenceRun(id));
      fnCount++;
      continue;
    }
    out.push(...inline(part, { size, bold: opt.bold, italics: opt.italics }));
  }
  if (opt.log !== false) FN_LOG.push({ awal: teks.slice(0, 60), fn: fnCount });
  return out;
}

function inline(s, base = {}) {
  const res = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) res.push(tr(s.slice(last, m.index), base));
    const t = m[0];
    if (t.startsWith('**')) res.push(tr(t.slice(2, -2), { ...base, bold: true }));
    else res.push(tr(t.slice(1, -1), { ...base, italics: true }));
    last = m.index + t.length;
  }
  if (last < s.length) res.push(tr(s.slice(last), base));
  return res;
}
const tr = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 24, bold: o.bold, italics: o.italics });

function fnParagraph(teks) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED, keepLines: true, spacing: { after: 60, line: SPASI1 },
    children: inline(teks, { size: 20 }),
  });
}

// ---------- blok-blok naskah ----------
const kiri = lvl => STEP * lvl; // posisi teks pada tingkat lvl (0 = margin)

// Judul bernomor. lvl 1 = "A.", 2 = "1.", 3 = "a.", 4 = "1)", 5 = "a)"
function judul(nomor, teks, lvl = 1) {
  const left = kiri(lvl);
  return new Paragraph({
    keepNext: true, alignment: AlignmentType.LEFT,
    heading: lvl === 1 ? HeadingLevel.HEADING_2 : lvl === 2 ? HeadingLevel.HEADING_3 : undefined,
    spacing: { before: lvl === 1 ? 240 : 0, after: 0, line: SPASI2 },
    indent: { left, hanging: STEP },
    tabStops: [{ type: TabStopType.LEFT, position: left }],
    children: [tr(nomor + '\t', { bold: true }), ...inline(teks, { bold: true })],
  });
}

// Paragraf isi di bawah judul tingkat lvl: lurus dengan teks judul, baris pertama menjorok.
function para(teks, lvl = 1, opt = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 0, after: 0, line: SPASI2 },
    indent: { left: kiri(lvl), firstLine: opt.tanpaIndent ? 0 : (lvl <= 1 ? 680 : 567) },
    children: runs(teks, opt),
  });
}

// Butir daftar bernomor yang isinya kalimat (bukan judul).
function butir(nomor, teks, lvl = 2, opt = {}) {
  const left = kiri(lvl);
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 0, line: SPASI2 },
    indent: { left, hanging: STEP }, tabStops: [{ type: TabStopType.LEFT, position: left }],
    children: [tr(nomor + '\t', { bold: opt.nomorTebal }), ...runs(teks, opt)],
  });
}

// Judul BAB (skripsi): "BAB I" lalu judul bab, tengah, tebal, kapital (Pedoman hlm. 62–63, Lampiran 2).
function judulBab(romawi, teks) {
  // satu paragraf (BAB I ↵ JUDUL) agar masuk daftar isi sebagai satu entri
  return [new Paragraph({
    alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, pageBreakBefore: false,
    spacing: { before: 4 * SPASI1, after: 2 * SPASI1, line: SPASI2 },
    children: [tr('BAB ' + romawi, { bold: true }), new TextRun({ break: 1, text: teks.toUpperCase(), font: FONT, size: 24, bold: true })],
  })];
}

function tengah(teks, opt = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER, pageBreakBefore: opt.halamanBaru, heading: opt.heading ? HeadingLevel.HEADING_1 : undefined,
    spacing: { before: opt.before || 0, after: opt.after || 0, line: opt.line || SPASI2 },
    children: inline(teks, { bold: opt.bold, size: opt.size }),
  });
}

// ---------- tabel ----------
// gaya: 'penuh' (semua garis — sering diminta dosen) | 'pedoman' (garis atas, bawah judul kolom, dan bawah saja; Pedoman hlm. 64)
function tabel({ nomor, judul: jdl, kolom, baris, lebar, lvl = 1, gaya = 'penuh' }) {
  const indent = kiri(lvl);
  const total = LEBAR_TEKS - indent;
  const w = lebar ? lebar.map(x => Math.round(x / lebar.reduce((a, b) => a + b, 0) * total)) : kolom.map(() => Math.round(total / kolom.length));
  const garis = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
  const kosong = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const borders = gaya === 'penuh'
    ? { top: garis, bottom: garis, left: garis, right: garis, insideHorizontal: garis, insideVertical: garis }
    : { top: garis, bottom: garis, left: kosong, right: kosong, insideHorizontal: kosong, insideVertical: kosong };
  const sel = (t, i, head) => new TableCell({
    width: { size: w[i], type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP,
    borders: (gaya === 'pedoman' && head) ? { bottom: garis } : undefined,
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    children: String(t).split('\n').map(line => new Paragraph({
      alignment: head ? AlignmentType.CENTER : AlignmentType.LEFT, spacing: { before: 0, after: 0, line: SPASI1 },
      children: inline(line, { size: 20, bold: head }),
    })),
  });
  const caption = new Paragraph({
    keepNext: true, alignment: AlignmentType.LEFT, spacing: { before: 240, after: 60, line: SPASI1 },
    indent: { left: indent }, children: inline(`${nomor} ${jdl}`, {}),
  });
  const t = new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: w, indent: { size: indent, type: WidthType.DXA },
    borders,
    rows: [new TableRow({ tableHeader: true, children: kolom.map((k, i) => sel(k, i, true)) }),
      ...baris.map(r => new TableRow({ cantSplit: true, children: r.map((c, i) => sel(c, i, false)) }))],
  });
  return [caption, t, new Paragraph({ spacing: { after: 240, line: SPASI1 }, children: [] })];
}

// ---------- gambar ----------
function gambar({ file, nomor, judul: jdl, lebarCm = 12 }) {
  const buf = fs.readFileSync(file);
  const { width, height } = ukuranGambar(buf);
  const wpx = lebarCm * 37.8, hpx = wpx * height / width;
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 0 },
      children: [new ImageRun({ type: file.toLowerCase().endsWith('.png') ? 'png' : 'jpg', data: buf, transformation: { width: wpx, height: hpx } })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 240, line: SPASI1 }, children: inline(`${nomor} ${jdl}`) }),
  ];
}
function ukuranGambar(buf) {
  if (buf[0] === 0x89) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  let i = 2; // JPEG
  while (i < buf.length) {
    const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
    if (m >= 0xC0 && m <= 0xC3) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return { width: 4, height: 3 };
}

// ---------- daftar pustaka ----------
// Urut alfabetis; spasi 1 di dalam entri, jarak antarentri satu baris kosong; baris kedua menjorok 1 cm.
// Penulis yang sama berurutan diganti garis sepanjang ±1 cm (Pedoman hlm. 69).
function daftarPustaka(keys) {
  const list = (keys || Object.keys(REFS)).map(k => REFS[k]).filter(r => r && r.b);
  list.sort((a, b) => (a.urut || a.b).localeCompare(b.urut || b.b, 'id'));
  const out = [new Paragraph({ pageBreakBefore: true, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 480, line: SPASI2 }, children: [tr('DAFTAR PUSTAKA', { bold: true })] })];
  let prev = null;
  for (const r of list) {
    let teks = r.b;
    if (r.penulis && r.penulis === prev) teks = '\u2014\u2014\u2014, ' + teks.slice(r.penulis.length).replace(/^[.,]\s*/, '');
    prev = r.penulis || null;
    out.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 0, after: 240, line: SPASI1 }, indent: { left: CM, hanging: CM }, children: inline(teks) }));
  }
  return out;
}

// ---------- halaman awal ----------
const LOGO_BAWAAN = require('path').join(__dirname, '..', 'assets', 'logo-unugiri.png');
function sampul({ judul: jdl, jenis = 'PROPOSAL SKRIPSI', tujuan, nama, nim, prodi = 'PENDIDIKAN AGAMA ISLAM', tahun, logo = LOGO_BAWAAN, pembimbing }) {
  const P = (t, o = {}) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: o.before || 0, after: o.after || 0, line: 276 }, children: inline(t, { bold: o.bold !== false }) });
  const out = [P(jdl.toUpperCase(), { after: 480 }), P(jenis, { after: tujuan ? 120 : 600 })];
  if (tujuan) out.push(P(tujuan, { bold: false, after: 600 }));
  if (logo && fs.existsSync(logo)) {
    const buf = fs.readFileSync(logo); const { width, height } = ukuranGambar(buf);
    out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new ImageRun({ type: logo.toLowerCase().endsWith('.png') ? 'png' : 'jpg', data: buf, transformation: { width: 151, height: 151 * height / width } })] }));
  } else out.push(P('[LOGO UNUGIRI]', { bold: false, after: 600 }));
  out.push(P('OLEH'), P(nama.toUpperCase()), P('NIM ' + nim, { after: pembimbing ? 360 : 900 }));
  if (pembimbing) { out.push(P('Pembimbing I', { bold: false }), P(pembimbing[0], { after: 120 }), P('Pembimbing II', { bold: false }), P(pembimbing[1], { after: 600 })); }
  out.push(P('PRODI ' + prodi), P('FAKULTAS TARBIYAH'), P('UNIVERSITAS NAHDLATUL ULAMA SUNAN GIRI'), P(String(tahun)));
  return out;
}

// Halaman pengesahan proposal (Pedoman Lampiran 4). Tanggal dikosongkan untuk diisi tangan.
function pengesahanProposal({ nama, nim, prodi = 'PENDIDIKAN AGAMA ISLAM', judul: jdl, p1, p2, kaprodi }) {
  // label di 1 cm, titik dua di 4,9 cm, isi di 5,5 cm; baris lanjutan isi lurus dengan isi
  const baris = (a, b) => new Paragraph({ spacing: { line: 276 }, indent: { left: 3100, hanging: 2533 }, tabStops: [{ type: TabStopType.LEFT, position: 2800 }, { type: TabStopType.LEFT, position: 3100 }],
    children: [tr(a), tr('\t:\t'), tr(b)] });
  const ttd = (label, nm, nidn) => new TableCell({ width: { size: LEBAR_TEKS / 2, type: WidthType.DXA }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1100, line: 276 }, children: [tr(label)] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276 }, children: [tr(nm, { bold: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276 }, children: [tr('NIDN ' + nidn)] })] });
  const out = [
    new Paragraph({ pageBreakBefore: true, alignment: AlignmentType.CENTER, spacing: { after: 480 }, children: [tr('HALAMAN PENGESAHAN', { bold: true })] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 240, line: 360 }, children: [tr('Setelah diadakan pemeriksaan, pembimbingan, dan perbaikan, saya yang bertanda tangan di bawah ini menyatakan bahwa proposal skripsi saudara:')] }),
    baris('Nama', nama.toUpperCase()), baris('NIM', nim), baris('Program Studi', prodi), baris('Fakultas', 'TARBIYAH'), baris('Judul Skripsi', jdl.toUpperCase()),
    new Paragraph({ spacing: { before: 360, after: 480, line: 360 }, children: [tr('dapat diajukan untuk menempuh seminar proposal.')] }),
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 360 }, children: [tr('Bojonegoro, ........................ ' + new Date().getFullYear())] }),
    new Table({ width: { size: LEBAR_TEKS, type: WidthType.DXA }, columnWidths: [LEBAR_TEKS / 2, LEBAR_TEKS / 2], borders: D.TableBorders.NONE,
      rows: [new TableRow({ children: [ttd('Pembimbing I', p1.nama, p1.nidn), ttd('Pembimbing II', p2.nama, p2.nidn)] })] }),
  ];
  if (kaprodi) out.push(
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, line: 276 }, children: [tr('Mengetahui,')] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1100, line: 276 }, children: [tr('Ketua Program Studi ' + kaprodi.prodi)] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276 }, children: [tr(kaprodi.nama, { bold: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276 }, children: [tr('NIDN ' + kaprodi.nidn)] }));
  return out;
}

// ---------- halaman awal skripsi (Pedoman Lampiran 6, 7, 10, 16) ----------
const tanpaGaris = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
function blokIdentitas({ nama, nim, prodi = 'PENDIDIKAN AGAMA ISLAM', judul: jdl }) {
  const b = (a, v) => new Paragraph({ spacing: { line: 276 }, indent: { left: 3100, hanging: 2533 }, tabStops: [{ type: TabStopType.LEFT, position: 2800 }, { type: TabStopType.LEFT, position: 3100 }], children: [tr(a), tr('\t:\t'), tr(v)] });
  return [b('Nama', nama.toUpperCase()), b('NIM', nim), b('Program Studi', prodi), b('Fakultas', 'TARBIYAH'), b('Judul Skripsi', jdl.toUpperCase())];
}
const kalimat = (t, o = {}) => new Paragraph({ alignment: o.align || AlignmentType.JUSTIFIED, spacing: { before: o.before || 0, after: o.after || 0, line: o.line || 360 }, indent: o.indent, children: inline(t, { bold: o.bold }) });
function kolomTtd(kiri, kanan) {
  const sel = d => new TableCell({ width: { size: LEBAR_TEKS / 2, type: WidthType.DXA }, borders: tanpaGaris, children: d ? [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276 }, children: [tr(d.label)] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1100, line: 276 }, children: [tr(d.nama, { bold: true })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { line: 276 }, children: [tr(d.nidn ? 'NIDN ' + d.nidn : '')] })] : [new Paragraph({})] });
  return new Table({ width: { size: LEBAR_TEKS, type: WidthType.DXA }, columnWidths: [LEBAR_TEKS / 2, LEBAR_TEKS / 2], borders: D.TableBorders.NONE, rows: [new TableRow({ children: [sel(kiri), sel(kanan)] })] });
}
const tanggalKosong = () => 'Bojonegoro, ........................ ' + new Date().getFullYear();

// Pernyataan keaslian tulisan — ditandatangani di atas meterai Rp10.000 (Lampiran 16)
function pernyataanKeaslian(id) {
  return [
    tengah('PERNYATAAN KEASLIAN TULISAN', { bold: true, after: 480, halamanBaru: true }),
    kalimat('Yang bertanda tangan di bawah ini, saya:', { after: 120 }), ...blokIdentitas(id),
    kalimat('Menyatakan dengan sebenarnya bahwa skripsi yang saya tulis ini benar-benar merupakan hasil karya sendiri, bukan merupakan pengambilalihan tulisan atau pikiran orang lain yang saya aku sebagai hasil tulisan atau pikiran saya sendiri. Apabila di kemudian hari terbukti atau dapat dibuktikan skripsi ini hasil plagiasi, maka saya bersedia menerima sanksi atas perbuatan tersebut.', { before: 240, after: 360 }),
    kalimat(tanggalKosong(), { align: AlignmentType.RIGHT }),
    kalimat('Yang membuat pernyataan,', { align: AlignmentType.RIGHT, after: 240 }),
    kalimat('Meterai Rp10.000', { align: AlignmentType.RIGHT, after: 600 }),
    kalimat(id.nama, { align: AlignmentType.RIGHT, bold: true }),
  ];
}

// Persetujuan pembimbing (nota dinas) — Lampiran 6
function persetujuanSkripsi(id, { p1, p2, kaprodi, eksemplar = '5 (lima)' }) {
  return [
    tengah('PERSETUJUAN', { bold: true, after: 360, halamanBaru: true }),
    kalimat(`Lamp.\t: ${eksemplar} Eks.`, { line: 276 }), kalimat('Hal\t: Naskah Skripsi', { line: 276, after: 240 }),
    kalimat('Yth.', { line: 276 }), kalimat('Rektor Universitas Nahdlatul Ulama Sunan Giri', { line: 276 }), kalimat('di Bojonegoro', { line: 276, after: 240 }),
    kalimat('*Assalamu’alaikum Wr. Wb.*', { after: 120 }),
    kalimat('Setelah diadakan pemeriksaan, pembimbingan, penelitian, dan perbaikan, maka kami berpendapat bahwa naskah skripsi saudara:', { after: 120 }),
    ...blokIdentitas(id),
    kalimat('telah memenuhi syarat untuk diuji di depan sidang munaqasah skripsi.', { before: 240 }),
    kalimat('*Wassalamu’alaikum Wr. Wb.*', { after: 240 }),
    kalimat(tanggalKosong(), { align: AlignmentType.RIGHT, after: 240 }),
    kolomTtd({ label: 'Pembimbing I', ...p1 }, { label: 'Pembimbing II', ...p2 }),
    ...(kaprodi ? [kalimat('Ketua Program Studi ' + kaprodi.prodi, { align: AlignmentType.CENTER, before: 360, line: 276 }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1100, line: 276 }, children: [tr(kaprodi.nama, { bold: true })] }),
      kalimat('NIDN ' + kaprodi.nidn, { align: AlignmentType.CENTER, line: 276 })] : []),
  ];
}

// Pengesahan dewan penguji + Dekan — Lampiran 7
function pengesahanSkripsi(id, { gelar = 'Ilmu Pendidikan Agama Islam', dekan, penguji = ['Ketua', 'Sekretaris', 'Penguji I', 'Penguji II'] } = {}) {
  const baris = (i, peran) => new Paragraph({ spacing: { line: 360 }, tabStops: [{ type: TabStopType.LEFT, position: 1900 }, { type: TabStopType.LEFT, position: 5600 }],
    children: [tr(`${i + 1}. ${peran}`), tr('\t: ..............................'), tr('\t(........................)')] });
  return [
    tengah('PENGESAHAN', { bold: true, after: 360, halamanBaru: true }),
    kalimat('Setelah dipertahankan di depan Dewan Penguji Skripsi, maka skripsi dari:', { after: 120 }),
    ...blokIdentitas(id),
    kalimat(`dapat disetujui untuk memenuhi sebagian syarat guna memperoleh gelar Sarjana Strata Satu (S1) dalam ${gelar} pada Universitas Nahdlatul Ulama Sunan Giri pada:`, { before: 240, after: 120 }),
    kalimat('Hari, tanggal\t: ..............................', { line: 276 }), kalimat('Tempat\t: Kampus Universitas Nahdlatul Ulama Sunan Giri', { line: 276, after: 240 }),
    kalimat('Dewan Penguji:', { after: 60 }), ...penguji.map((p, i) => baris(i, p)),
    kalimat(tanggalKosong(), { align: AlignmentType.RIGHT, before: 240 }),
    kalimat('Mengesahkan', { align: AlignmentType.CENTER, line: 276 }), kalimat('Dekan Fakultas Tarbiyah', { align: AlignmentType.CENTER, line: 276 }),
    kalimat('Universitas Nahdlatul Ulama Sunan Giri', { align: AlignmentType.CENTER, line: 276 }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1100, line: 276 }, children: [tr(dekan ? dekan.nama : '(..............................)', { bold: true })] }),
    kalimat(dekan ? 'NIDN ' + dekan.nidn : 'NIDN ..........', { align: AlignmentType.CENTER, line: 276 }),
  ];
}

// Abstrak ≤300 kata, spasi 1 (Lampiran 10). judulAbs: judul; penulis: "Nama, Pembimbing I, Pembimbing II"
function abstrak({ judul: jdl, penulis, isi, kataKunci, inggris = false }) {
  const kata = isi.join(' ').split(/\s+/).filter(Boolean).length;
  if (kata > 300) console.log(`⚠ ${inggris ? 'Abstract' : 'Abstrak'} ${kata} kata (maks. 300).`);
  return [
    tengah(inggris ? 'ABSTRACT' : 'ABSTRAK', { bold: true, after: 240, halamanBaru: true }),
    tengah(jdl.toUpperCase(), { bold: true, line: SPASI1, after: 240 }),
    tengah(penulis, { line: SPASI1, after: 240 }),
    ...isi.map(t => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 120, line: SPASI1 }, indent: { firstLine: 680 }, children: inline(t, { italics: inggris }) })),
    new Paragraph({ spacing: { before: 240, line: SPASI1 }, indent: { left: 1418, hanging: 1418 }, children: [tr(inggris ? 'Keywords' : 'Kata Kunci', { bold: true }), tr(': ' + kataKunci)] }),
  ];
}

// Daftar isi/tabel/gambar: field TOC Word (perbarui di Word: klik kanan → Update Field)
function daftarIsi(judulDaftar = 'DAFTAR ISI') {
  return [tengah(judulDaftar, { bold: true, after: 360, halamanBaru: true }),
    new D.TableOfContents('Daftar Isi', { hyperlink: true, headingStyleRange: '1-3' }),
    kalimat('[Klik kanan di sini lalu pilih Update Field, atau References → Update Table, setelah naskah selesai. Daftar isi memakai spasi 1.]', { line: SPASI1 })];
}

// ---------- dokumen ----------
const halamanNomor = align => new Paragraph({ alignment: align, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 24 })] });
const MARGIN = { top: 2268, right: 1701, bottom: 1701, left: 2268, header: 851, footer: 851 };

// sections: [{ isi:[...], nomor:'tanpa'|'arab'|'romawi', mulai:1, bab:true }]
//  - nomor 'arab' + bab:true → halaman pertama bab: nomor tengah bawah; halaman lain: kanan atas (Pedoman hlm. 63)
//  - nomor 'arab' tanpa bab   → nomor tengah bawah di semua halaman (lazim untuk proposal tanpa BAB)
function buatDokumen({ refs = {}, sections, judulDok = 'Naskah' }) {
  const secs = sections.map(s => {
    const props = { page: { size: { width: 11906, height: 16838 }, margin: MARGIN } };
    const out = { properties: props, children: s.isi };
    if (s.nomor === 'tanpa' || !s.nomor) return out;
    props.page.pageNumbers = { start: s.mulai, formatType: s.nomor === 'romawi' ? NumberFormat.LOWER_ROMAN : NumberFormat.DECIMAL };
    if (s.bab) {
      props.titlePage = true;
      out.headers = { default: new Header({ children: [halamanNomor(AlignmentType.RIGHT)] }), first: new Header({ children: [new Paragraph({})] }) };
      out.footers = { default: new Footer({ children: [new Paragraph({})] }), first: new Footer({ children: [halamanNomor(AlignmentType.CENTER)] }) };
    } else {
      out.footers = { default: new Footer({ children: [halamanNomor(AlignmentType.CENTER)] }) };
    }
    return out;
  });
  return new Document({
    creator: 'unugiri-ta-ft', title: judulDok,
    styles: {
      default: { document: { run: { font: FONT, size: 24 } } },
      paragraphStyles: [1, 2, 3].map(n => ({ id: 'Heading' + n, name: 'Heading ' + n, basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { spacing: { before: 0, after: 0 } } })),
    },
    features: { updateFields: true },
    footnotes: FOOTNOTES, sections: secs,
  });
}

function mulai(refs) { REFS = refs; FOOTNOTES = {}; FN_ID = 0; FN_LOG = []; }
async function simpan(doc, path) {
  fs.writeFileSync(path, await Packer.toBuffer(doc));
  const lebih = FN_LOG.filter(x => x.fn > 2);
  console.log(`Tersimpan: ${path} — ${FN_ID} footnote.`);
  if (lebih.length) console.log(`⚠ ${lebih.length} paragraf punya >2 footnote (dosen biasanya minta maks. 2):\n` + lebih.map(x => '  - ' + x.awal + '…').join('\n'));
}

module.exports = { mulai, buatDokumen, simpan, judul, para, butir, judulBab, tengah, tabel, gambar, daftarPustaka, sampul, pengesahanProposal, pernyataanKeaslian, persetujuanSkripsi, pengesahanSkripsi, abstrak, daftarIsi, PageBreak, Paragraph, CM, STEP, LEBAR_TEKS };
