"""rapikan.py — langkah akhir setelah naskah.js membuat .docx

Pakai:
    python3 rapikan.py Naskah.docx                 # rapikan file Word (untuk dikirim ke dosen)
    python3 rapikan.py Naskah.docx --pratinjau Pratinjau.docx
        # tambahan: salinan khusus untuk dikonversi ke PDF via LibreOffice,
        # karena LibreOffice tidak mengulang nomor footnote per bab dengan benar.

Yang dilakukan:
1. Nomor footnote mulai lagi dari 1 di setiap bab/section (Pedoman Bab VIII: "penulisan footnotes
   pada bab baru dimulai lagi dengan nomor 1").
2. Paragraf footnote diberi "keep lines together" supaya tidak terpotong ke halaman berikutnya
   (potongan sambungan footnote muncul tanpa nomor dan sering dicoret dosen).
"""
import re
import shutil
import sys
import zipfile


def baca(path):
    z = zipfile.ZipFile(path)
    files = {i.filename: z.read(i.filename) for i in z.infolist()}
    infos = z.infolist()
    z.close()
    return files, infos


def tulis(path, files, infos):
    tmp = path + '.tmp'
    z = zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED)
    for i in infos:
        z.writestr(i, files[i.filename])
    z.close()
    shutil.move(tmp, path)


def rapikan(src, dst, pratinjau=False):
    files, infos = baca(src)
    doc = files['word/document.xml'].decode()
    if '<w:numRestart' not in doc:
        doc = doc.replace('<w:pgSz', '<w:footnotePr><w:numRestart w:val="eachSect"/></w:footnotePr><w:pgSz')
    if 'word/footnotes.xml' in files:
        fn = files['word/footnotes.xml'].decode()
        fn = re.sub(r'<w:pPr>(?!<w:keepLines/>)', '<w:pPr><w:keepLines/>', fn)
        if pratinjau:
            # nomor statis per section supaya PDF hasil LibreOffice sama dengan tampilan Word
            sec, counters, mapping, res, pos = 0, {}, {}, [], 0
            for m in re.finditer(r'<w:footnoteReference w:id="(\d+)"/>|<w:sectPr', doc):
                res.append(doc[pos:m.start()])
                pos = m.end()
                if m.group(0) == '<w:sectPr':
                    sec += 1
                    res.append(m.group(0))
                    continue
                counters[sec] = counters.get(sec, 0) + 1
                n = counters[sec]
                mapping[m.group(1)] = n
                res.append(f'<w:footnoteReference w:customMarkFollows="1" w:id="{m.group(1)}"/>'
                           f'<w:t>{n}</w:t>')
            res.append(doc[pos:])
            doc = ''.join(res)

            def ganti(m):
                fid, body = m.group(1), m.group(2)
                body = body.replace('<w:footnoteRef/>', f'<w:t>{mapping.get(fid, "")}</w:t>', 1)
                return f'<w:footnote w:id="{fid}">{body}</w:footnote>'
            fn = re.sub(r'<w:footnote w:id="(\d+)">(.*?)</w:footnote>', ganti, fn, flags=re.S)
        files['word/footnotes.xml'] = fn.encode()
    files['word/document.xml'] = doc.encode()
    if src != dst:
        shutil.copy(src, dst)
    tulis(dst, files, infos)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    rapikan(src, src)
    if len(sys.argv) > 3 and sys.argv[2] == '--pratinjau':
        rapikan(src, sys.argv[3], pratinjau=True)
    print('Selesai dirapikan:', src)
