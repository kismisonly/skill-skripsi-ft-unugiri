# Skill Pendamping Tugas Akhir FT UNUGIRI

Skill Claude untuk mahasiswa **Fakultas Tarbiyah Universitas Nahdlatul Ulama Sunan Giri (UNUGIRI) Bojonegoro**: PAI, PGMI, dan PIAUD. Sekali dipasang, Claude langsung paham aturan *Pedoman Penulisan Tugas Akhir FT 2026* dan tata letak naskah yang lolos bimbingan.

## Isinya
- **Semua jenis penelitian:** kuantitatif, kualitatif, campuran, kajian pustaka, dan R&D, masing-masing dengan sistematika BAB I–V, isi tiap bagian, metode, dan analisis.
- **Ringkasan lengkap Pedoman TA FT 2026:** syarat, prosedur, sistematika proposal dan skripsi per jenis penelitian, tata tulis, penilaian, plagiarisme, transliterasi, sitasi. Ringkasan ini juga mencatat aturan yang saling bertentangan di buku.
- **Tata letak pasti:** margin, spasi, indentasi bertingkat A. → 1. → a. → 1) → a), tabel, gambar, halaman sampul dan pengesahan.
- **Format footnote dan daftar pustaka** Chicago 17 full note untuk tiap jenis sumber, plus alur verifikasi sumber.
- **Pola tulisan yang lolos bimbingan:** latar belakang, rumusan masalah R&D, kajian teori, metode.
- **Alur lengkap** RMC → proposal → sempro → penelitian → munaqasah → yudisium.
- **Script:**
  - `naskah.js` membuat .docx sesuai format.
  - `kerangka.js` membuat kerangka kosong proposal/skripsi per jenis penelitian, lengkap dengan petunjuk isi.
  - `rapikan.py` mengulang nomor footnote per bab dan mencegah footnote terpotong.
  - `cek_naskah.py` memeriksa naskah terhadap Pedoman, termasuk kelengkapan subbab per jenis penelitian.
- **Halaman awal skripsi siap pakai:** sampul, pernyataan keaslian (bermeterai), persetujuan, pengesahan dewan penguji, abstrak Indonesia dan Inggris, kata pengantar, daftar isi otomatis.

## Cara pasang
**Claude (claude.ai / aplikasi desktop):**
1. Unduh `unugiri-ta-ft.zip` dari halaman Releases, atau zip folder `unugiri-ta-ft/`.
2. Buka **Settings → Capabilities → Skills → Upload skill**, lalu pilih file zip tadi.
3. Mulai chat, misalnya: *"Bantu rapikan footnote proposalku sesuai pedoman FT UNUGIRI."*

**Claude Code:** salin folder `unugiri-ta-ft/` ke `~/.claude/skills/`.

## Menjalankan script sendiri
```bash
cd unugiri-ta-ft/scripts
npm install                       # memasang paket docx
node contoh_proposal.js           # menghasilkan Proposal.docx (contoh R&D)
node kerangka.js kualitatif skripsi   # kerangka skripsi kualitatif (jenis: kuantitatif|kualitatif|rnd|pustaka|campuran; bentuk: proposal|skripsi)
python3 rapikan.py Proposal.docx --pratinjau Pratinjau.docx
python3 cek_naskah.py Proposal.docx --judul "Judul proposalmu" --jenis rnd --bentuk proposal
```
Logo UNUGIRI untuk sampul sudah ada di `unugiri-ta-ft/assets/logo-unugiri.png` dan otomatis dipakai oleh script. Logo adalah milik Universitas Nahdlatul Ulama Sunan Giri dan disertakan hanya untuk sampul naskah tugas akhir mahasiswa sesuai Pedoman.

## Penting
- Skill ini **bukan joki**. Isi, data, dan argumen penelitian tetap milikmu. Skill membantu format, sitasi, pengecekan, dan persiapan ujian. Jangan memasukkan data yang tidak pernah kamu kumpulkan.
- Buku Pedoman resmi adalah milik Fakultas Tarbiyah UNUGIRI dan **tidak disertakan** di repo ini. Mintalah ke prodi. Ringkasan di sini bisa tertinggal dari edisi terbaru, jadi selalu cek pengumuman Fakultas dan arahan pembimbingmu.
- Repo ini proyek mahasiswa, **bukan produk resmi UNUGIRI**.

## Lisensi
- Teks dan dokumentasi: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Script: MIT.

Bebas dipakai dan dikembangkan, asal menyebut sumber repo ini.

Disusun oleh mahasiswa FT UNUGIRI, untuk mahasiswa FT UNUGIRI.
