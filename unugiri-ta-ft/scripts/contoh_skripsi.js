// contoh_skripsi.js — kerangka naskah skripsi (BAB I–V) R&D sesuai Pedoman TA FT UNUGIRI 2026.
// Bagian awal bernomor romawi kecil; tiap BAB = section baru (nomor footnote mulai dari 1,
// halaman pertama bab bernomor tengah bawah, halaman lain kanan atas).
// Tabel & gambar dinomori per bab: Tabel 1.1, Gambar 2.1, dst.
//   node contoh_skripsi.js && python3 rapikan.py Skripsi.docx --pratinjau Pratinjau.docx

const N = require('./naskah');
const refs = {
  branch: {
    penulis: 'Branch, Robert Maribe',
    f: pg => `Robert Maribe Branch, *Instructional Design: The ADDIE Approach* (New York: Springer, 2009), ${pg || '1–20'}.`,
    b: 'Branch, Robert Maribe. *Instructional Design: The ADDIE Approach*. New York: Springer, 2009.',
  },
};
N.mulai(refs);
const JUDUL = 'Judul Skripsi Maksimal Dua Puluh Kata';

const sampul = N.sampul({
  judul: JUDUL, jenis: 'SKRIPSI',
  tujuan: 'Diajukan untuk Memenuhi Sebagian Syarat guna Memperoleh Gelar Sarjana Strata Satu (S1) dalam Ilmu Pendidikan Agama Islam pada Universitas Nahdlatul Ulama Sunan Giri',
  nama: 'Nama Mahasiswa', nim: '2301xxxxx', tahun: 2027, pembimbing: ['Nama Pembimbing I', 'Nama Pembimbing II'],
});

// Halaman awal (Pedoman hlm. 9–10; contoh di Lampiran 6, 7, 10, 11, 16)
const ID = { nama: 'Nama Mahasiswa', nim: '2301xxxxx', judul: JUDUL };
const P1 = { nama: 'Nama Pembimbing I, M.Pd.', nidn: '..........' }, P2 = { nama: 'Nama Pembimbing II, M.Pd.', nidn: '..........' };
const awal = [
  ...N.pernyataanKeaslian(ID),
  ...N.persetujuanSkripsi(ID, { p1: P1, p2: P2, kaprodi: { prodi: 'Pendidikan Agama Islam', nama: 'Nama Kaprodi, M.Ag.', nidn: '..........' } }),
  ...N.pengesahanSkripsi(ID),
  ...N.abstrak({ judul: JUDUL, penulis: 'Nama Mahasiswa, Nama Pembimbing I, Nama Pembimbing II',
    isi: ['Paragraf 1: latar belakang dan rumusan masalah.', 'Paragraf 2: metode penelitian.', 'Paragraf 3: temuan/simpulan dan manfaat. Total maksimal 300 kata.'],
    kataKunci: 'kata kunci 1, kata kunci 2, kata kunci 3' }),
  ...N.abstrak({ judul: 'Title in English', penulis: 'Nama Mahasiswa, Nama Pembimbing I, Nama Pembimbing II', isi: ['English version of the abstract.'], kataKunci: 'keyword 1, keyword 2', inggris: true }),
  N.tengah('KATA PENGANTAR', { bold: true, after: 240, halamanBaru: true }),
  N.para('Gunakan kata "penulis", bukan kata ganti orang pertama. Sampaikan terima kasih kepada Rektor, Dekan, pembimbing, Kaprodi, dosen, pihak sekolah/lembaga tempat penelitian, dan rekan.', 0),
  ...N.daftarIsi(),
];

const bab1 = [
  ...N.judulBab('I', 'Pendahuluan'),
  N.judul('A.', 'Latar Belakang Masalah', 1),
  N.para('Isi latar belakang.{{branch|2}}', 1),
  ...N.tabel({ nomor: 'Tabel 1.1', judul: 'Contoh Tabel Bab I', kolom: ['No', 'Aspek', 'Keterangan'], lebar: [8, 40, 52], baris: [['1', 'Aspek', 'Keterangan']], gaya: 'pedoman' }),
  N.judul('B.', 'Rumusan Masalah', 1),
  N.judul('C.', 'Tujuan Penelitian', 1),
  N.judul('D.', 'Manfaat Penelitian', 1),
  N.judul('E.', 'Spesifikasi Produk', 1),
  N.judul('F.', 'Definisi Operasional', 1),
  N.judul('G.', 'Orisinalitas Penelitian', 1),
];
const bab2 = [...N.judulBab('II', 'Kajian Pustaka'), N.para('Isi kajian pustaka.{{branch|5}}', 1)];

const doc = N.buatDokumen({
  judulDok: JUDUL,
  sections: [
    { isi: sampul, nomor: 'tanpa' },
    { isi: awal, nomor: 'romawi', mulai: 1 },
    { isi: bab1, nomor: 'arab', mulai: 1, bab: true },
    { isi: [...bab2, ...N.daftarPustaka()], nomor: 'arab', bab: true },
  ],
});
N.simpan(doc, 'Skripsi.docx');
