"""Rebuild Rider.pdf under 3 MB (TECH-SPEC 5.8).

The source is three full-page JPEG scans (2160x2700, ~12 MB in total) with
no text layer. This re-encodes each page at 1600 px wide and writes a new
PDF at the same page size. Run from the project root:

    python -I scripts/rider-pdf.py

Needs pypdf and Pillow (pip install pypdf pillow).
"""

import io
import pathlib

from PIL import Image
from pypdf import PdfReader

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCE = next(
    p
    for p in (ROOT / "source-media" / "Rider.pdf", ROOT / "Все что нужно тут" / "Rider.pdf")
    if p.exists()
)
TARGET = ROOT / "public" / "media" / "rider" / "OPPAACHA-Rider.pdf"

reader = PdfReader(SOURCE)
pages = []
for page in reader.pages:
    image = Image.open(io.BytesIO(page.images[0].data)).convert("RGB")
    image.thumbnail((1600, 2000), Image.LANCZOS)
    # round-trip through JPEG so Pillow embeds compact DCT data
    buf = io.BytesIO()
    image.save(buf, "JPEG", quality=72, optimize=True, progressive=True)
    pages.append(Image.open(io.BytesIO(buf.getvalue())))

TARGET.parent.mkdir(parents=True, exist_ok=True)
# 1600 px across the original 1025 pt page width
dpi = 1600 / (float(reader.pages[0].mediabox.width) / 72)
pages[0].save(TARGET, "PDF", save_all=True, append_images=pages[1:], resolution=dpi, title="OPPAACHA Rider")
print(f"{TARGET.relative_to(ROOT)}: {TARGET.stat().st_size / 1024:.0f} KB, {len(pages)} pages")
