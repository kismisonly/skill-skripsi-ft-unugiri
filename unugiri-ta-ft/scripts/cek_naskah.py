"""cek_naskah.py — periksa .docx proposal/skripsi terhadap Pedoman TA FT UNUGIRI 2026.

Pakai:  python3 cek_naskah.py Naskah.docx [--judul "Judul skripsi"] [--jenis kuantitatif|kualitatif|rnd|pustaka|campuran] [--bentuk proposal|skripsi]
        --jenis/--bentuk: cek kelengkapan subbab wajib sesuai Pedoman Bab II.

Hanya memeriksa hal yang bisa dicek otomatis. Hasilnya daftar ⚠ untuk diperbaiki manual.
Tidak mengubah file.
"""
import html
import re
import sys
import zipfile
from collections import Counter

TW = 567  # twip per cm


def teks(xml):
    return html.unescape(''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', xml)))


WAJIB = {
    'proposal': {
        'kuantitatif': ['Latar Belakang', 'Rumusan Masalah', 'Tujuan', 'Manfaat', 'Penelitian Terdahulu', 'Kajian Teori', 'Hipotesis', 'Metode'],
        'campuran': ['Latar Belakang', 'Rumusan Masalah', 'Tujuan', 'Manfaat', 'Penelitian Terdahulu', 'Kajian Teori', 'Metode'],
        'kualitatif': ['Konteks Penelitian|Latar Belakang', 'Fokus Penelitian|Rumusan Masalah', 'Tujuan', 'Manfaat', 'Penelitian Terdahulu', 'Kajian Teori|Kajian Pustaka', 'Metode'],
        'rnd': ['Latar Belakang', 'Rumusan Masalah', 'Tujuan', 'Manfaat', 'Penelitian Terdahulu', 'Kajian Teori', 'Spesifikasi Produk', 'Metode'],
        'pustaka': ['Latar Belakang', 'Rumusan Masalah', 'Tujuan', 'Manfaat', 'Penelitian Terdahulu', 'Kajian Teori|Kajian Pustaka', 'Metode'],
    },
    'skripsi': {
        'kuantitatif': ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Orisinalitas Penelitian', 'Hipotesis', 'Tempat dan Waktu', 'Desain Penelitian', 'Populasi', 'Teknik Pengumpulan Data', 'Teknik Analisis Data', 'Uji Persyaratan', 'Uji Hipotesis', 'Pembahasan', 'Simpulan', 'Saran'],
        'campuran': ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Orisinalitas Penelitian', 'Teknik Pengumpulan Data', 'Teknik Analisis Data', 'Pembahasan', 'Simpulan', 'Saran'],
        'kualitatif': ['Konteks Penelitian', 'Fokus Penelitian', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Definisi Operasional', 'Orisinalitas Penelitian', 'Latar Penelitian', 'Sumber Data', 'Teknik Pengumpulan Data', 'Teknik Analisis Data', 'Deskripsi Hasil', 'Temuan Penelitian', 'Pembahasan', 'Simpulan', 'Saran'],
        'rnd': ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Spesifikasi Produk', 'Definisi Operasional', 'Orisinalitas Penelitian', 'Jenis Penelitian', 'Prosedur Penelitian', 'Studi Pendahuluan', 'Pengembangan Produk', 'Pengujian Produk', 'Pembahasan', 'Simpulan', 'Saran'],
        'pustaka': ['Latar Belakang Masalah', 'Rumusan Masalah', 'Tujuan Penelitian', 'Manfaat Penelitian', 'Definisi Operasional', 'Orisinalitas Penelitian', 'Sumber Data', 'Pengumpulan Data', 'Analisis Data', 'Paparan Data', 'Temuan Penelitian', 'Pembahasan', 'Simpulan', 'Saran'],
    },
}
AWAL_SKRIPSI = ['PERNYATAAN KEASLIAN', 'PERSETUJUAN', 'PENGESAHAN', 'ABSTRAK', 'KATA PENGANTAR', 'DAFTAR ISI']


def main(path, judul=None, jenis=None, bentuk=None):
    z = zipfile.ZipFile(path)
    doc = z.read('word/document.xml').decode()
    fn = z.read('word/footnotes.xml').decode() if 'word/footnotes.xml' in z.namelist() else ''
    styles = z.read('word/styles.xml').decode()
    peringatan = []
    W = peringatan.append

    # 1. Kertas & margin (A4; atas/kiri 4 cm, bawah/kanan 3 cm)
    for s in re.findall(r'<w:sectPr.*?</w:sectPr>', doc, re.S):
        pg = re.search(r'<w:pgSz w:w="(\d+)" w:h="(\d+)"', s)
        mg = re.search(r'<w:pgMar ([^>]*)/>', s)
        if pg and (abs(int(pg.group(1)) - 11906) > 20 or abs(int(pg.group(2)) - 16838) > 20):
            W('Ukuran kertas bukan A4.')
        if mg:
            a = dict(re.findall(r'w:(\w+)="(-?\d+)"', mg.group(1)))
            harap = {'top': 2268, 'left': 2268, 'bottom': 1701, 'right': 1701}
            for k, v in harap.items():
                if k in a and abs(int(a[k]) - v) > 30:
                    W(f'Margin {k} = {int(a[k]) / TW:.2f} cm (seharusnya {v / TW:.0f} cm).')
    # 2. Font dasar
    if 'Times New Roman' not in styles and 'Times New Roman' not in doc:
        W('Font Times New Roman tidak ditemukan.')

    body = doc.split('<w:body>')[1]
    paras = re.findall(r'<w:p[ >].*?</w:p>', body, re.S)
    jumlah_fn_paragraf, pembuka, orang1, dimana, judul_titik = [], [], [], [], []
    for p in paras:
        t = teks(p).strip()
        if not t:
            continue
        nfn = len(re.findall(r'<w:footnoteReference ', p))
        if nfn > 2:
            jumlah_fn_paragraf.append((nfn, t[:70]))
        is_body = 'w:line="480"' in p and 'w:firstLine' in p
        if is_body:
            if re.match(r'^(Sehingga|Sedangkan|Dan|Tetapi|Serta|Karena|Yang|Pada|Dalam|Misalnya)\b', t):
                pembuka.append(t[:70])
            if re.search(r'\b(saya|aku|kami|kita|engkau|anda)\b', t, re.I):
                orang1.append(t[:70])
            if re.search(r'\bdimana\b', t, re.I):
                dimana.append(t[:70])
        isi_judul = t.split('\t', 1)[-1]
        if '<w:b/>' in p and 'w:hanging' in p and len(t) < 120 and t.endswith('.') and '. ' not in isi_judul.rstrip('.'):
            judul_titik.append(t[:70])
    if jumlah_fn_paragraf:
        W(f'{len(jumlah_fn_paragraf)} paragraf punya >2 footnote (dosen umumnya minta jangan tiap kalimat):')
        peringatan.extend(f'    - ({n}) {t}…' for n, t in jumlah_fn_paragraf[:10])
    if pembuka:
        W(f'{len(pembuka)} paragraf diawali kata sambung/kata depan (Pedoman hlm. 62 & 67):')
        peringatan.extend(f'    - {t}…' for t in pembuka[:10])
    if orang1:
        W(f'{len(orang1)} paragraf memakai kata orang pertama/kedua (pakai "peneliti"/"penulis"/kalimat pasif):')
        peringatan.extend(f'    - {t}…' for t in orang1[:10])
    if dimana:
        W(f'{len(dimana)} paragraf memakai "dimana" (tidak baku; ganti "yang", "tempat", dsb.):')
        peringatan.extend(f'    - {t}…' for t in dimana[:5])
    if judul_titik:
        W('Judul/subjudul diakhiri titik (Pedoman: tanpa titik):')
        peringatan.extend(f'    - {t}' for t in judul_titik[:10])

    # 3. Footnote: jurnal tanpa DOI, footnote tanpa halaman
    if fn:
        notes = [teks(x) for x in re.findall(r'<w:footnote [^>]*w:id="\d+"[^>]*>(.*?)</w:footnote>', fn, re.S)]
        notes = [n for n in notes if n.strip()]
        pola_jurnal = re.compile(r'\d+, no\. ?\d+[^()]{0,10}\(')   # "122, no. 26 (Juli 2025)"
        tanpa_doi = [n for n in notes if pola_jurnal.search(n) and 'doi' not in n.lower() and 'http' not in n.lower()]
        if tanpa_doi:
            W(f'{len(tanpa_doi)} footnote jurnal tanpa link DOI/URL (Pedoman hlm. 83–84):')
            peringatan.extend(f'    - {t[:90]}…' for t in tanpa_doi[:10])
        berita = [n for n in notes if 'http' in n and 'doi.org' not in n and 'diakses' not in n.lower() and not pola_jurnal.search(n)]
        if berita:
            W(f'{len(berita)} footnote sumber daring tanpa "diakses pada …" (Pedoman hlm. 85):')
            peringatan.extend(f'    - {t[:90]}…' for t in berita[:10])
        print(f'Footnote: {len(notes)}')

    # 4. Tabel: ukuran huruf 10
    for i, tb in enumerate(re.findall(r'<w:tbl>.*?</w:tbl>', body, re.S), 1):
        tbb = re.search(r'<w:tblBorders>(.*?)</w:tblBorders>', tb, re.S)
        if tbb and not re.search(r'w:val="single"', tbb.group(1)) and 'w:val="single"' not in tb:
            continue  # tabel tanpa garis = tata letak (mis. kolom tanda tangan), bukan tabel data
        if re.search(r'Judul Skripsi|NIDN|Pembimbing I', teks(tb)):
            continue  # blok identitas / tanda tangan di halaman awal
        sz = Counter(re.findall(r'<w:sz w:val="(\d+)"', tb))
        if sz and sz.most_common(1)[0][0] not in ('20',) and len(teks(tb)) > 200:
            W(f'Tabel ke-{i}: ukuran huruf dominan {int(sz.most_common(1)[0][0]) / 2:g} pt (Pedoman: 10 pt).')

    # 5. Judul ≤ 20 kata
    if judul:
        n = len(judul.split())
        print(f'Judul: {n} kata')
        if n > 20:
            W(f'Judul {n} kata — Pedoman Bab II.C membatasi maksimal 20 kata.')

    # 6. Kelengkapan subbab per jenis penelitian
    if jenis and bentuk:
        semua = teks(body).lower()
        kurang = [w for w in WAJIB[bentuk][jenis] if not any(alt.lower() in semua for alt in w.split('|'))]
        if bentuk == 'skripsi':
            kurang += [a.title() for a in AWAL_SKRIPSI if a.lower() not in semua]
        if kurang:
            W(f'Subbab/halaman wajib ({bentuk} {jenis}) belum ditemukan:')
            peringatan.extend(f'    - {k.split("|")[0]}' for k in kurang)
        else:
            print(f'Struktur {bentuk} {jenis}: lengkap.')

    # 7. Daftar pustaka ada?
    if 'DAFTAR PUSTAKA' not in teks(body):
        W('Tidak ada judul "DAFTAR PUSTAKA".')

    print(f'Paragraf diperiksa: {len(paras)}')
    if peringatan:
        print('\n'.join('⚠ ' + p if not p.startswith('    ') else p for p in peringatan))
    else:
        print('✓ Tidak ada temuan otomatis. Tetap baca ulang manual.')
    print('\nCek manual yang tidak bisa otomatis: minimal 5 dosen prodi dikutip; R&D: kajian teori ≥30 buku primer;'
          ' footnote ⇄ daftar pustaka saling cocok; similarity ≤20%.')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    def arg(n):
        return sys.argv[sys.argv.index(n) + 1] if n in sys.argv else None
    jn, bt = arg('--jenis'), arg('--bentuk')
    if (jn or bt) and not (jn in WAJIB['skripsi'] and bt in WAJIB):
        sys.exit('--jenis harus kuantitatif|kualitatif|rnd|pustaka|campuran dan --bentuk proposal|skripsi')
    main(sys.argv[1], arg('--judul'), jn, bt)
