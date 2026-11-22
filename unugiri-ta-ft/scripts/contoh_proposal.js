// contoh_proposal.js — kerangka proposal skripsi R&D sesuai Pedoman TA FT UNUGIRI 2026.
// Salin file ini, ganti isinya dengan naskahmu, lalu jalankan:
//   node contoh_proposal.js && python3 rapikan.py Proposal.docx --pratinjau Pratinjau.docx
//   soffice --headless --convert-to pdf Pratinjau.docx      (opsional, untuk cek tampilan)
//   python3 cek_naskah.py Proposal.docx --judul "Judul kamu"
//
// Sitasi di teks: {{kunci|halaman}}  → jadi footnote Chicago full note.
// Dua sumber dalam satu footnote: {{kunciA|12; kunciB|5–6}}
// Format *miring* dan **tebal** didukung.

const N = require('./naskah');

// ---- RUJUKAN ----
// f(pg) = bentuk footnote (nama tidak dibalik, ada halaman, jurnal wajib link DOI)
// b     = bentuk daftar pustaka (nama dibalik, tanpa halaman kutip, jurnal: rentang halaman + DOI)
// penulis = untuk deteksi penulis sama berurutan di daftar pustaka
// CONTOH FORMAT: periksa sendiri halaman yang kamu kutip dari sumber aslinya.
const refs = {
  branch: {
    penulis: 'Branch, Robert Maribe',
    f: pg => `Robert Maribe Branch, *Instructional Design: The ADDIE Approach* (New York: Springer, 2009), ${pg || '1–20'}.`,
    b: 'Branch, Robert Maribe. *Instructional Design: The ADDIE Approach*. New York: Springer, 2009.',
  },
  vygotsky: {
    penulis: 'Vygotsky, L. S.',
    f: pg => `L. S. Vygotsky, *Mind in Society: The Development of Higher Psychological Processes*, ed. Michael Cole, dkk (Cambridge: Harvard University Press, 1978), ${pg || '84–91'}.`,
    b: 'Vygotsky, L. S. *Mind in Society: The Development of Higher Psychological Processes*. Ed. Michael Cole, dkk. Cambridge: Harvard University Press, 1978.',
  },
  bastani: {
    penulis: 'Bastani, Hamsa',
    f: pg => `Hamsa Bastani, dkk, "Generative AI without Guardrails Can Harm Learning: Evidence from High School Mathematics," *Proceedings of the National Academy of Sciences* 122, no. 26 (Juli 2025): ${pg || 'e2422633122'}, https://doi.org/10.1073/pnas.2422633122.`,
    b: 'Bastani, Hamsa, dkk. "Generative AI without Guardrails Can Harm Learning: Evidence from High School Mathematics." *Proceedings of the National Academy of Sciences* 122, no. 26 (2025): e2422633122. https://doi.org/10.1073/pnas.2422633122.',
  },
};

N.mulai(refs);
const JUDUL = 'Pengembangan [Produk] Berbasis [Teknologi] pada Materi [Materi] Kelas [X] [Nama Sekolah]';

const awal = [
  // logo UNUGIRI dipakai otomatis dari assets/logo-unugiri.png
  ...N.sampul({ judul: JUDUL, nama: 'Nama Mahasiswa', nim: '2301xxxxx', tahun: 2026 }),
  ...N.pengesahanProposal({
    nama: 'Nama Mahasiswa', nim: '2301xxxxx', judul: JUDUL,
    p1: { nama: 'Nama Pembimbing I, M.Pd.', nidn: '..........' },
    p2: { nama: 'Nama Pembimbing II, M.Pd.', nidn: '..........' },
    kaprodi: { prodi: 'Pendidikan Agama Islam', nama: 'Nama Kaprodi, M.Ag.', nidn: '..........' },
  }),
];

const isi = [
  N.judul('A.', 'Judul', 1),
  N.para(`**${JUDUL}**`, 1, { tanpaIndent: true }),
  N.judul('B.', 'Latar Belakang Masalah', 1),
  N.para('Paragraf pertama menjelaskan kondisi ideal (harapan kurikulum/teori). Paragraf berikutnya menunjukkan kondisi nyata di lapangan beserta datanya, lalu dampak kesenjangan tersebut.{{bastani|1}} Setiap satu atau dua sitiran ditutup dengan kesimpulan sendiri, bukan langsung pindah ke sumber lain.', 1),
  N.para('Bagian akhir latar belakang memaparkan alternatif solusi, faktor pendukung dan penghambatnya, lalu alasan memilih solusi yang menjadi judul.{{branch|2–3}}', 1),
  N.judul('C.', 'Rumusan Masalah', 1),
  N.butir('1.', 'Bagaimana proses pengembangan [produk] dengan model ADDIE?', 2),
  N.butir('2.', 'Bagaimana kelayakan [produk] ditinjau dari kevalidan dan kepraktisan?', 2),
  N.judul('D.', 'Tujuan Penelitian', 1),
  N.butir('1.', 'Mendeskripsikan proses pengembangan [produk].', 2),
  N.butir('2.', 'Menguji kelayakan [produk].', 2),
  N.judul('E.', 'Manfaat Penelitian', 1),
  N.judul('1.', 'Manfaat Teoretis', 2),
  N.para('Uraikan kontribusi bagi pengembangan ilmu.', 2),
  N.judul('2.', 'Manfaat Praktis', 2),
  N.butir('a.', 'Bagi siswa, …', 3),
  N.butir('b.', 'Bagi guru, …', 3),
  N.judul('F.', 'Penelitian Terdahulu', 1),
  N.para('Uraikan tiap penelitian terdahulu secara naratif, lalu ringkas dalam Tabel 1.', 1),
  ...N.tabel({
    nomor: 'Tabel 1', judul: 'Penelitian Terdahulu dan Orisinalitas Penelitian', lvl: 1, gaya: 'penuh',
    kolom: ['No', 'Nama, Tahun, Sumber', 'Judul', 'Persamaan', 'Perbedaan', 'Orisinalitas'],
    lebar: [7, 18, 24, 17, 17, 17],
    baris: [['1', 'Nama Peneliti, 2024, *Nama Jurnal*', 'Judul penelitian', '…', '…', '…']],
  }),
  N.judul('G.', 'Kajian Teori', 1),
  N.judul('1.', 'Teori Pertama', 2),
  N.judul('a.', 'Pengertian', 3),
  N.para('Definisi menurut ahli.{{vygotsky|86}} Kalimat sintesis peneliti.', 3),
  N.judul('b.', 'Fungsi', 3),
  N.para('…', 3),
  N.judul('c.', 'Macam-Macam', 3),
  N.para('…', 3),
  N.judul('H.', 'Spesifikasi Produk', 1),
  N.butir('1.', 'Bentuk, nama, fitur, sasaran pengguna, platform, keunggulan.', 2),
  N.judul('I.', 'Metode Penelitian', 1),
  N.judul('1.', 'Jenis Penelitian', 2),
  N.para('Penelitian ini merupakan penelitian dan pengembangan (*research and development*) dengan model ADDIE (*Analysis, Design, Development, Implementation, Evaluation*).{{branch|2}}', 2),
  N.judul('2.', 'Prosedur Penelitian', 2),
  N.judul('3.', 'Uji Coba Produk', 2),
  N.judul('a.', 'Desain Uji Coba', 3),
  N.judul('b.', 'Subjek Uji Coba', 3),
  N.judul('c.', 'Jenis Data', 3),
  N.judul('d.', 'Instrumen Pengumpulan Data', 3),
  N.judul('e.', 'Teknik Analisis Data', 3),
  ...N.daftarPustaka(),
];

const doc = N.buatDokumen({
  judulDok: JUDUL,
  sections: [
    { isi: awal, nomor: 'tanpa' },
    { isi, nomor: 'arab', mulai: 1 },   // proposal tanpa BAB: nomor tengah bawah
  ],
});
N.simpan(doc, 'Proposal.docx');
