"""Regenerate Twenty's front-end icon set from the uVENTURE icon.

Every existing PNG keeps its exact size. The uVENTURE mark is placed in the same
box the Twenty mark occupied (its alpha bounding box), or with an 8% margin when
the Twenty icon was full-bleed. iOS icons get a white background because iOS
renders transparency as black; everything else stays transparent.
"""
import glob
import os
import sys

from PIL import Image

src_path, icons_dir = sys.argv[1], sys.argv[2]

mark = Image.open(src_path).convert("RGBA")
mark = mark.crop(mark.getchannel("A").getbbox())

count = 0
for path in sorted(glob.glob(os.path.join(icons_dir, "**", "*.png"), recursive=True)):
    old = Image.open(path).convert("RGBA")
    w, h = old.size
    box = old.getchannel("A").getbbox() or (0, 0, w, h)
    if box == (0, 0, w, h):
        mx, my = round(w * 0.08), round(h * 0.08)
        box = (mx, my, w - mx, h - my)
    bw, bh = box[2] - box[0], box[3] - box[1]
    scale = min(bw / mark.width, bh / mark.height)
    size = (max(1, round(mark.width * scale)), max(1, round(mark.height * scale)))
    resized = mark.resize(size, Image.LANCZOS)

    is_ios = os.sep + "ios" + os.sep in path or "/ios/" in path.replace("\\", "/")
    canvas = Image.new("RGBA", (w, h), (255, 255, 255, 255 if is_ios else 0))
    x = box[0] + (bw - size[0]) // 2
    y = box[1] + (bh - size[1]) // 2
    canvas.alpha_composite(resized, (x, y))
    if is_ios:
        canvas = canvas.convert("RGB")
    canvas.save(path, optimize=True)
    count += 1

print(f"regenerated {count} icons")
