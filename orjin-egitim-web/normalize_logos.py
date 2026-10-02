"""Filigran logolarını eşit görsel boyuta getirir.

Her PNG için:
 1. Beyaz/şeffaf kenar boşluğu kırpılır (gerçek logo sınırları bulunur).
 2. Beyaz zemin şeffaflaştırılır.
 3. Logo, alanı sabit olacak şekilde (kare mühürler aynı çapta, yatay logolar
    aynı yüzey alanında) ölçeklenir ve 1000x1000 şeffaf tuvalin ortasına konur.
"""
import glob, os, sys, math
from PIL import Image, ImageChops

SRC = sys.argv[1]
DST = sys.argv[2]
CANVAS = 1000
TARGET = 780          # kare bir logonun kenar uzunluğu
MAX_W, MAX_H = 960, 820  # yatay/dikey logolar için üst sınır

os.makedirs(DST, exist_ok=True)

for path in sorted(glob.glob(os.path.join(SRC, "*.png"))):
    im = Image.open(path).convert("RGBA")
    r, g, b, a = im.split()
    rgb = im.convert("RGB")

    # Beyazlığa göre yumuşak alfa: saf beyaz -> şeffaf
    darkness = ImageChops.difference(rgb, Image.new("RGB", im.size, "white")).convert("L")
    soft = darkness.point(lambda v: min(255, v * 10))
    alpha = ImageChops.multiply(a, soft)
    im.putalpha(alpha)

    box = alpha.point(lambda v: 255 if v > 24 else 0).getbbox()
    if not box:
        print("BOŞ:", path); continue
    logo = im.crop(box)
    w, h = logo.size

    s = TARGET / math.sqrt(w * h)            # eşit alan
    s = min(s, MAX_W / w, MAX_H / h)          # taşmasın
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    logo = logo.resize((nw, nh), Image.LANCZOS)

    out = Image.new("RGBA", (CANVAS, CANVAS), (255, 255, 255, 0))
    out.alpha_composite(logo, ((CANVAS - nw) // 2, (CANVAS - nh) // 2))
    out.save(os.path.join(DST, os.path.basename(path)), optimize=True)
    print(f"{os.path.basename(path):55s} {w}x{h} -> {nw}x{nh}")
