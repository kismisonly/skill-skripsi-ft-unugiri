// kerangka.js — buat kerangka kosong proposal/skripsi sesuai jenis penelitian (Pedoman TA FT 2026 Bab II).
// Pakai:
//   node kerangka.js <jenis> <bentuk> [file.docx]
//   jenis  : kuantitatif | kualitatif | rnd | pustaka | campuran
//   bentuk : proposal | skripsi
// Contoh:  node kerangka.js kualitatif skripsi Skripsi_Kualitatif.docx
// Lalu:    python3 rapikan.py Skripsi_Kualitatif.docx
// Isi tiap bagian berupa petunjuk [dalam kurung siku] yang harus diganti tulisanmu sendiri.

const N = require('./naskah');
const [, , jenis = 'kuantitatif', bentuk = 'proposal', out] = process.argv;
const J = { rnd: 'R&D', kuantitatif: 'Kuantitatif', kualitatif: 'Kualitatif', pustaka: 'Kajian Pustaka', campuran: 'Campuran' };
if (!J[jenis] || !['proposal', 'skripsi'].includes(bentuk)) {
  console.error('Pakai: node kerangka.js <kuantitatif|kualitatif|rnd|pustaka|campuran> <proposal|skripsi> [file.docx]');
  process.exit(1);
}
N.mulai({});
const P = t => N.para(`[${t}]`, 1);
const ABJAD = 'ABCDEFGHIJKLMNOP';

// --- isi bagian (petunjuk singkat dari Pedoman) ---
const PETUNJUK = {
  'Latar Belakang Masalah': 'Kesenjangan harapan–kenyataan beserta data dan dampaknya → alternatif solusi + faktor pendukung/penghambat → solusi terpilih dan alasannya. Sertakan penelitian terdahulu secara naratif.',
  'Konteks Penelitian': 'Situasi yang melingkupi masalah: lokasi, waktu, karakteristik subjek, kondisi sosial-budaya, kebijakan sekolah. Jelaskan mengapa fenomena ini penting dikaji.',
  'Rumusan Masalah': { kuantitatif: 'Kalimat tanya lengkap: variabel, sifat hubungan antarvariabel, subjek. Contoh: Apakah terdapat pengaruh X terhadap Y pada siswa …?', rnd: '1. Bagaimana proses pengembangan … dengan model …? 2. Bagaimana kelayakan … (kevalidan dan kepraktisan)?', pustaka: 'Pertanyaan yang mengarahkan penelusuran dan analisis literatur.', campuran: 'Gabungan pertanyaan kuantitatif (hubungan/pengaruh variabel) dan kualitatif (bagaimana/mengapa).' },
  'Fokus Penelitian': 'Aspek utama yang diteliti beserta batasannya; tulis sebagai pertanyaan: Bagaimana …? Apa faktor pendukung dan penghambat …?',
  'Tujuan Penelitian': 'Kalimat pernyataan yang menjawab tiap rumusan/fokus.',
  'Manfaat Penelitian': 'Manfaat teoretis (pengembangan ilmu) dan praktis (siswa, guru, sekolah, peneliti lain).',
  'Spesifikasi Produk': 'Bentuk, nama, fitur, materi, sasaran pengguna, platform, keunggulan, unsur kebaruan.',
  'Definisi Operasional': 'Definisi istilah/variabel kunci yang terukur atau teramati beserta indikatornya.',
  'Orisinalitas Penelitian': 'Narasi penelitian terdahulu, lalu tabel No | Nama, Tahun, Sumber | Judul | Persamaan | Perbedaan | Orisinalitas.',
  'Penelitian Terdahulu': 'Narasi penelitian terdahulu, lalu tabel No | Nama, Tahun, Sumber | Judul | Persamaan | Perbedaan | Orisinalitas.',
  'Kajian Teori': { kuantitatif: 'Teori per variabel → pendapat ahli → sintesis variabel → konstruk, cara ukur, indikator. Akhiri dengan kerangka berpikir.', kualitatif: 'Teori yang menjadi lensa analisis + penelitian terdahulu; kerangka berpikir.', rnd: 'Teori produk/media, teori belajar, materi, model pengembangan, kriteria kelayakan (≥30 buku primer); kerangka berpikir.', pustaka: 'Teori dan penelitian yang relevan; celah yang belum dikaji.', campuran: 'Teori per variabel + lensa analisis kualitatif; kerangka berpikir.' },
  'Hipotesis': 'Ha: Terdapat pengaruh/hubungan yang signifikan antara … dan …; H0: Tidak terdapat …',
  'Metode Penelitian': null,
  'Tempat dan Waktu Penelitian': 'Lokasi spesifik; waktu dari pengajuan judul sampai publikasi, sajikan juga dalam Gantt chart.',
  'Rancangan/Desain Penelitian': 'Eksperimen/kuasi-eksperimen/survei/korelasional beserta alasan; gambarkan desainnya.',
  'Populasi, Sampel, dan Sampling': 'Karakteristik populasi, ukuran sampel, teknik sampling (idealnya acak) beserta alasannya.',
  'Teknik Pengumpulan Data': { kuantitatif: 'Teknik dan instrumen tiap variabel; kisi-kisi; uji validitas (isi/konstruk), analisis butir, reliabilitas beserta rumusnya.', kualitatif: 'Wawancara mendalam, observasi, dokumentasi beserta alasan; pedoman di lampiran.', default: 'Teknik dan instrumen beserta alasannya.' },
  'Teknik Analisis Data': { kuantitatif: 'Statistik deskriptif → uji persyaratan (normalitas, homogenitas/linearitas) → uji hipotesis (rumus) → hipotesis statistik.', kualitatif: 'Mis. model interaktif: kondensasi data → penyajian → penarikan kesimpulan; keabsahan data: triangulasi, member check.', default: 'Teknik analisis beserta rumus/kriteria.' },
  'Latar Penelitian': 'Lokasi, waktu, subjek, kondisi sosial, batasan penelitian; kehadiran peneliti.',
  'Data dan Sumber Data': 'Data primer/sekunder; informan (kriteria, teknik purposive/snowball), dokumen, arsip; alasan pemilihan.',
  'Jenis Penelitian': 'Penelitian dan pengembangan (R&D) dengan model … beserta alasan memilih model.',
  'Prosedur Penelitian': 'Tahap pendahuluan → pengembangan (rancangan, prototipe, validasi ahli ≠ pembimbing, uji coba) → pengujian; sertakan diagram alir.',
  'Uji Coba Produk': 'Desain uji coba, subjek, jenis data, instrumen, teknik analisis (rumus kelayakan & kategorinya).',
  'Metode dan Jenis Penelitian': 'Kajian pustaka, deskriptif-analitik; pendekatan kualitatif/kuantitatif.',
  'Sumber Data': 'Sumber primer & sekunder yang otentik: kitab, buku, artikel, peraturan.',
  'Prosedur Pengumpulan Data': 'Penelusuran basis data/perpustakaan/jurnal elektronik dan kriteria seleksi sumber.',
  'Analisis Data': 'Analisis tematik/isi/sintesis kritis.',
};
const pet = (k) => { const v = PETUNJUK[k]; if (!v) return ''; return typeof v === 'string' ? v : (v[jenis] || v.default || Object.values(v)[0]); };

// --- struktur per jenis (Pedoman hlm. 7–8 untuk proposal; hlm. 12–39 untuk skripsi) ---
const METODE = {
  kuantitatif: ['Tempat dan Waktu Penelitian', 'Rancangan/Desain Penelitian', 'Populasi, Sampel, dan Sampling', 'Teknik Pengumpulan Data', 'Teknik Analisis Data'],
  campuran: ['Tempat dan Waktu Penelitian', 'Rancangan/Desain Penelitian', 'Populasi, Sampel, dan Sampling', 'Data dan Sumber Data', 'Teknik Pengumpulan Data', 'Teknik Analisis Data'],
  kualitatif: ['Latar Penelitian', 'Data dan Sumber Data', 'Teknik Pengumpulan Data', 'Teknik Analisis Data'],
  rnd: ['Jenis Penelitian', 'Prosedur Penelitian', 'Uji Coba Produk'],
  pustaka: ['Metode dan Jenis Penelitian', 'Sumber Data', 'Prosedur Pengumpulan Data', 'Analisis Data'],
};
const BAB1 = {
  kuantitatif: ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Orisinalitas Penelitian'],
  campuran: ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Orisinalitas Penelitian'],
  kualitatif: ['Konteks Penelitian', 'Fokus Penelitian', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Definisi Operasional', 'Orisinalitas Penelitian'],
  rnd: ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Spesifikasi Produk', 'Definisi Operasional', 'Orisinalitas Penelitian'],
  pustaka: ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Definisi Operasional', 'Orisinalitas Penelitian'],
};
const BAB4 = {
  kuantitatif: [['A.', 'Hasil Penelitian', [['1.', 'Hasil Uji Persyaratan Analisis'], ['2.', 'Hasil Uji Hipotesis']]], ['B.', 'Pembahasan']],
  campuran: [['A.', 'Hasil Penelitian Kuantitatif', [['1.', 'Hasil Uji Persyaratan Analisis'], ['2.', 'Hasil Uji Hipotesis']]], ['B.', 'Temuan Kualitatif'], ['C.', 'Pembahasan']],
  kualitatif: [['A.', 'Deskripsi Hasil Penelitian'], ['B.', 'Temuan Penelitian'], ['C.', 'Pembahasan']],
  rnd: [['A.', 'Hasil Studi Pendahuluan'], ['B.', 'Pengembangan Produk', [['1.', 'Penyusunan Rancangan Produk'], ['2.', 'Penyusunan Prototipe Produk'], ['3.', 'Hasil Uji Coba Produk']]], ['C.', 'Pengujian Produk'], ['D.', 'Pembahasan']],
  pustaka: [['A.', 'Paparan Data'], ['B.', 'Temuan Penelitian'], ['C.', 'Pembahasan']],
};

const sub = (nomor, nama, lvl) => [N.judul(nomor, nama, lvl), ...(pet(nama) ? [N.para(`[${pet(nama)}]`, lvl)] : [])];

function proposal() {
  const bagian = ['Judul', ...BAB1[jenis].filter(x => !['Definisi Operasional', 'Orisinalitas Penelitian', 'Spesifikasi Produk'].includes(x)),
    'Penelitian Terdahulu', 'Kajian Teori', ...((jenis === 'kuantitatif' || jenis === 'campuran') ? ['Hipotesis'] : []),
    ...(jenis === 'rnd' ? ['Spesifikasi Produk'] : []), ...(jenis === 'kualitatif' ? ['Definisi Operasional'] : []), 'Metode Penelitian'];
  const isi = [];
  bagian.forEach((b, i) => {
    const no = ABJAD[i] + '.';
    if (b === 'Judul') { isi.push(N.judul(no, 'Judul', 1), N.para('**[Judul maksimal 20 kata]**', 1, { tanpaIndent: true })); return; }
    if (b === 'Metode Penelitian') { isi.push(N.judul(no, b, 1)); METODE[jenis].forEach((m, j) => isi.push(...sub(`${j + 1}.`, m, 2))); return; }
    isi.push(...sub(no, b, 1));
  });
  isi.push(...N.daftarPustaka([]));
  return [{ isi: [...N.sampul({ judul: '[Judul Proposal]', nama: '[Nama]', nim: '[NIM]', tahun: new Date().getFullYear() }),
    ...N.pengesahanProposal({ nama: '[Nama]', nim: '[NIM]', judul: '[Judul Proposal]', p1: { nama: '[Pembimbing I]', nidn: '……' }, p2: { nama: '[Pembimbing II]', nidn: '……' }, kaprodi: { prodi: '[Program Studi]', nama: '[Kaprodi]', nidn: '……' } })], nomor: 'tanpa' },
  { isi, nomor: 'arab', mulai: 1 }];
}

function skripsi() {
  const babs = [];
  const b1 = [...N.judulBab('I', 'Pendahuluan')];
  BAB1[jenis].forEach((x, i) => b1.push(...sub(ABJAD[i] + '.', x, 1)));
  babs.push(b1);
  const b2 = [...N.judulBab('II', jenis === 'kuantitatif' ? 'Landasan Pustaka' : 'Kajian Pustaka')];
  if (jenis === 'kuantitatif' || jenis === 'campuran') b2.push(...sub('A.', 'Kajian Teori', 1), ...sub('B.', 'Hipotesis', 1));
  else b2.push(P(pet('Kajian Teori')));
  babs.push(b2);
  const b3 = [...N.judulBab('III', 'Metode Penelitian')];
  METODE[jenis].forEach((m, i) => b3.push(...sub(ABJAD[i] + '.', m, 1)));
  babs.push(b3);
  const b4 = [...N.judulBab('IV', 'Hasil Penelitian dan Pembahasan')];
  for (const [no, nm, anak] of BAB4[jenis]) { b4.push(N.judul(no, nm, 1)); (anak || []).forEach(([n2, nm2]) => b4.push(N.judul(n2, nm2, 2))); }
  babs.push(b4);
  const b5 = [...N.judulBab('V', jenis === 'kualitatif' ? 'Simpulan, Implikasi, dan Saran' : 'Penutup'),
    N.judul('A.', 'Simpulan', 1), P('Jawaban tiap rumusan/fokus masalah + implikasi teoretis dan praktis.'),
    N.judul('B.', 'Saran', 1), P('Spesifik (menyebut pihak) dan aplikatif (cara melaksanakan), berdasarkan temuan.'),
    ...N.daftarPustaka([])];
  babs.push(b5);
  const ID = { nama: '[Nama]', nim: '[NIM]', judul: '[Judul Skripsi]', prodi: '[PROGRAM STUDI]' };
  const awal = [
    ...N.pernyataanKeaslian(ID),
    ...N.persetujuanSkripsi(ID, { p1: { nama: '[Pembimbing I]', nidn: '……' }, p2: { nama: '[Pembimbing II]', nidn: '……' }, kaprodi: { prodi: '[Program Studi]', nama: '[Kaprodi]', nidn: '……' } }),
    ...N.pengesahanSkripsi(ID, { gelar: 'Ilmu [Program Studi]' }),
    ...N.abstrak({ judul: '[Judul Skripsi]', penulis: '[Nama], [Pembimbing I], [Pembimbing II]', isi: ['[Latar belakang & rumusan] [metode] [temuan/simpulan & manfaat] — maks. 300 kata, spasi 1.'], kataKunci: '[3–5 kata kunci]' }),
    ...N.abstrak({ judul: '[Title in English]', penulis: '[Nama], [Pembimbing I], [Pembimbing II]', isi: ['[English abstract]'], kataKunci: '[keywords]', inggris: true }),
    ...(jenis === 'kualitatif' || jenis === 'pustaka' ? [N.tengah('PEDOMAN TRANSLITERASI', { bold: true, halamanBaru: true, after: 240 }), N.para('[Bila memuat istilah Arab: tabel transliterasi sesuai Pedoman Bab VII.]', 0)] : []),
    N.tengah('KATA PENGANTAR', { bold: true, halamanBaru: true, after: 240 }), N.para('[Pakai kata "penulis". Ucapan terima kasih kepada Rektor, Dekan, pembimbing, Kaprodi, dosen, lembaga tempat penelitian, rekan.]', 0),
    ...N.daftarIsi(), ...N.daftarIsi('DAFTAR TABEL').slice(0, 1), N.para('[Tabel 1.1 Judul ........ halaman]', 0, { tanpaIndent: true }),
    N.tengah('DAFTAR GAMBAR', { bold: true, halamanBaru: true, after: 240 }), N.para('[Gambar 2.1 Judul ........ halaman]', 0, { tanpaIndent: true }),
    N.tengah('DAFTAR LAMPIRAN', { bold: true, halamanBaru: true, after: 240 }), N.para('[Lampiran 1 Judul ........ halaman]', 0, { tanpaIndent: true }),
  ];
  return [
    { isi: N.sampul({ judul: '[Judul Skripsi]', jenis: 'SKRIPSI', tujuan: 'Diajukan untuk Memenuhi Sebagian Syarat guna Memperoleh Gelar Sarjana Strata Satu (S1) dalam Ilmu [Program Studi] pada Universitas Nahdlatul Ulama Sunan Giri', nama: '[Nama]', nim: '[NIM]', tahun: new Date().getFullYear(), pembimbing: ['[Pembimbing I]', '[Pembimbing II]'] }), nomor: 'tanpa' },
    { isi: awal, nomor: 'romawi', mulai: 1 },
    ...babs.map((b, i) => ({ isi: b, nomor: 'arab', mulai: i === 0 ? 1 : undefined, bab: true })),
  ];
}

const file = out || `Kerangka_${bentuk}_${jenis}.docx`;
N.simpan(N.buatDokumen({ judulDok: `Kerangka ${bentuk} ${J[jenis]}`, sections: bentuk === 'proposal' ? proposal() : skripsi() }), file);
