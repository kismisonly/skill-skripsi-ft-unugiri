# Tata Letak Naskah (angka pasti)

Gabungan aturan Pedoman (Bab IV, Lampiran 1–2) dan kebiasaan yang lolos bimbingan di Prodi PAI (proposal R&D, Okt–Nov 2026). 1 cm = 567 twip. Semua ini sudah diterapkan otomatis di `scripts/naskah.js`.

## Halaman
| Unsur | Nilai | Twip |
|---|---|---|
| Kertas | A4 | 11906 × 16838 |
| Margin atas / kiri | 4 cm | 2268 |
| Margin bawah / kanan | 3 cm | 1701 |
| Lebar bidang teks | 14 cm | 7937 |
| Jarak header/footer dari tepi | 1,5 cm | 851 |

## Huruf & spasi
- **Isi:** Times New Roman 12 pt, spasi 2 (line 480), before 0, after 0, rata kanan-kiri.
- **Footnote:**
  - TNR 10 pt, spasi 1, rata kanan-kiri, jarak antar-footnote 3 pt.
  - Atur *keep lines together* agar satu footnote tidak terpotong ke halaman berikutnya. Potongan sambungan footnote tampil **tanpa nomor** dan sering dicoret dosen.
- **Tabel:** TNR 10 pt, spasi 1.
- **Daftar pustaka:** TNR 12, spasi 1 di dalam entri, 1 baris kosong antarentri (after 240), menggantung 1 cm, **rata kanan-kiri**. Dosen meminta rata kanan-kiri.

## Penomoran bertingkat & indentasi
Tiap tingkat menjorok **0,7 cm (397 twip)**. Nomor berada di posisi tingkat sebelumnya, teks judul di posisi tingkatnya. Gunakan *hanging indent* + tab, bukan spasi.

| Tingkat | Format | Kiri teks (twip) | Paragraf isi di bawahnya |
|---|---|---|---|
| 1 | **A.** Judul | 397 | kiri 397, baris pertama +680 (1,2 cm) |
| 2 | **1.** Judul | 794 | kiri 794, baris pertama +567 |
| 3 | **a.** Judul | 1191 | kiri 1191, baris pertama +567 |
| 4 | **1)** Judul | 1588 | kiri 1588, baris pertama +567 |
| 5 | **a)** Judul | 1985 | kiri 1985, baris pertama +567 |

Aturan yang diminta dosen:
- **Baris kedua paragraf lurus dengan teks judulnya**, tidak kembali ke margin. Inilah fungsi indentasi "kiri" di tabel atas.
- Judul tebal, huruf awal kapital tiap kata kecuali kata sambung/kata depan, **tanpa titik**.
- Butir daftar berisi kalimat (rumusan masalah, tujuan, manfaat) memakai format yang sama dengan judul tingkatnya, tetapi tidak tebal.

## Halaman bab baru (skripsi — Lampiran 2)
1. Kosongkan 4 spasi dari margin atas, lalu tulis **BAB I** (tengah, tebal).
2. Beri jarak 2 spasi, lalu tulis **JUDUL BAB** (tengah, tebal, kapital).
3. Beri jarak 4 spasi, lalu mulai subbab **A. …**.
4. Nomor halaman halaman pertama bab ada di tengah bawah. Halaman lain di kanan atas.

Proposal **tidak memakai BAB**. Langsung A. Judul, B. Latar Belakang, dst. Nomor halaman cukup tengah bawah.

## Tabel
- Judul tabel ada **di atas, rata kiri, sejajar dengan teks di atasnya**. Kalau tabel berada di bawah subjudul tingkat 2, judul dan tabel mulai dari 794 twip, dengan lebar 7937 − 794.
  - Dosen menyebut ini "tabelnya diluruskan".
- Penomoran:
  - Proposal: Tabel 1, Tabel 2, dst.
  - Skripsi: per bab (Tabel 1.1).
  - Judul tabel tanpa titik.
- Jarak 2 spasi sebelum dan sesudah tabel.
- **Garis:**
  - Pedoman: hanya garis horizontal di atas dan bawah kepala tabel serta di bawah tabel (`gaya: 'pedoman'`).
  - Pembimbing bisa meminta **garis vertikal dan horizontal penuh** (`gaya: 'penuh'`). Kalau diminta, ikuti pembimbing.
- Kepala tabel tebal dan rata tengah. Isi rata kiri. Baris tidak boleh terpotong antarhalaman. Kepala tabel diulang di halaman lanjutan.

## Gambar
- Gambar di tengah. Judul **di bawahnya, di tengah**, tanpa titik: "Gambar 1 Kerangka Berpikir" (skripsi: Gambar 2.1).
- Diagram (kerangka berpikir, alur ADDIE, rancangan antarmuka) dibuat rapi dan proporsional, maksimal ±14 cm. Boleh berwarna.

## Halaman awal proposal
1. **Sampul:**
   - Judul kapital tebal di tengah.
   - PROPOSAL SKRIPSI.
   - Logo UNUGIRI.
   - OLEH, NAMA (kapital), NIM.
   - PRODI …, FAKULTAS TARBIYAH, UNIVERSITAS NAHDLATUL ULAMA SUNAN GIRI, tahun.
   - Tanpa nomor halaman.
2. **Halaman pengesahan** (contoh Lampiran 4):
   - Kalimat pembuka.
   - Blok identitas Nama / NIM / Program Studi / Fakultas / Judul Skripsi. Titik dua dibuat sejajar, dan baris lanjutan judul lurus dengan isinya.
   - "dapat diajukan untuk menempuh seminar proposal."
   - Bojonegoro, tanggal (boleh dikosongkan lalu ditulis tangan).
   - Pembimbing I & II berdampingan dengan ruang tanda tangan, nama tebal, NIDN.
   - "Mengetahui, Ketua Program Studi …" beserta nama dan NIDN.
3. Langsung disambung **A. Judul** di halaman 1.

## Halaman awal skripsi (Pedoman hlm. 9–10, Lampiran 5–16)
Urutannya sebagai berikut. Nomor halaman romawi kecil dimulai dari pernyataan keaslian atau halaman judul.
1. **Sampul dan halaman judul** (isi sama, halaman judul memakai kertas putih):
   - Judul (kapital tebal), SKRIPSI.
   - "Diajukan untuk Memenuhi Sebagian Syarat guna Memperoleh Gelar Sarjana Strata Satu (S1) dalam Ilmu … pada Universitas Nahdlatul Ulama Sunan Giri".
   - OLEH, NAMA, NIM.
   - Pembimbing I dan II.
   - PRODI, FAKULTAS TARBIYAH, UNUGIRI, tahun.
2. **Pernyataan keaslian tulisan:**
   - Blok identitas, lalu pernyataan bahwa karya ini asli dan siap menerima sanksi bila terbukti plagiat.
   - Tanggal, "Yang membuat pernyataan,".
   - **Meterai Rp10.000** dan tanda tangan, lalu nama.
3. **Persetujuan (nota dinas pembimbing):**
   - Lamp. (… eks.), Hal: Naskah Skripsi.
   - Yth. Rektor UNUGIRI.
   - Salam, kalimat persetujuan, blok identitas, "telah memenuhi syarat untuk diuji di depan sidang munaqasah skripsi", salam penutup.
   - Tanda tangan Pembimbing I dan II berdampingan, lalu Ketua Program Studi di bawahnya.
4. **Pengesahan:**
   - "Setelah dipertahankan di depan Dewan Penguji Skripsi…", blok identitas, hari/tanggal dan tempat ujian.
   - Dewan Penguji: 1. Ketua, 2. Sekretaris, 3. Penguji I, 4. Penguji II, masing-masing dengan kolom tanda tangan.
   - "Mengesahkan, Dekan Fakultas Tarbiyah", lalu nama dan NIDN.
5. **Moto** dan **Persembahan** (opsional).
6. **Abstrak:**
   - Judul tebal kapital di tengah.
   - Nama penulis dan pembimbing.
   - Isi ≤300 kata, **spasi 1**, umumnya 3 paragraf: latar belakang dan masalah, metode, temuan dan manfaat.
   - Kata Kunci.
   - Disusul **Abstract** berbahasa Inggris dengan format yang sama (Keywords).
7. **Pedoman transliterasi** (bila ada istilah Arab).
8. **Kata pengantar:**
   - Pembuka hamdalah dan shalawat, lalu judul skripsi.
   - Terima kasih bernomor kepada Rektor, Dekan, pembimbing, Kaprodi, dosen, lembaga tempat penelitian, responden, dan rekan.
   - Doa penutup.
   - Bojonegoro, tanggal; Penulis, (nama).
9. **Daftar isi, daftar tabel, daftar gambar, daftar lampiran:**
   - Spasi 1, nomor halaman rata kanan dengan titik-titik.
   - Daftar isi dimulai dari halaman judul.

Semua halaman ini tersedia sebagai fungsi di `scripts/naskah.js`: `sampul`, `pernyataanKeaslian`, `persetujuanSkripsi`, `pengesahanSkripsi`, `abstrak`, `daftarIsi`. Daftar isi berupa field Word yang diperbarui otomatis saat file dibuka (atau klik kanan → Update Field).

## Halaman yang sudah ditandatangani
- **Jangan pernah membuat ulang PDF halaman ber-TTD dari docx.** Pindai atau foto halaman yang sudah ditandatangani, rapikan (luruskan, putihkan latar), lalu sisipkan menggantikan halaman pengesahan di PDF.
- Teks judul di halaman ber-TTD harus **sama persis** dengan sampul, isi, dan form pendaftaran. Kalau berbeda, sesuaikan isi naskah ke versi yang sudah ditandatangani.
