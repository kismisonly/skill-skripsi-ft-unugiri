# Script

```bash
npm install                                   # paket docx
node kerangka.js <kuantitatif|kualitatif|rnd|pustaka|campuran> <proposal|skripsi>
node contoh_proposal.js                       # contoh proposal R&D lengkap dengan sitasi
node contoh_skripsi.js                        # contoh skripsi BAB I–V + halaman awal
python3 rapikan.py Naskah.docx --pratinjau Pratinjau.docx
python3 cek_naskah.py Naskah.docx --judul "…" --jenis rnd --bentuk proposal
```

- `naskah.js` — pustaka pembuat .docx sesuai tata letak FT UNUGIRI.
- `rapikan.py` — nomor footnote mulai lagi per bab, footnote tidak terpotong.
- `cek_naskah.py` — pemeriksa naskah terhadap Pedoman.
