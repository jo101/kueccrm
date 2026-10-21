"""Regenerate Twenty's front-end icon set from the UVenture icon.

Every existing PNG keeps its exact size. The UVenture mark is fitted into a
centred square of 84% of the shorter side, which is where Twenty's own marks sat
(full-bleed icons with an 8% margin, tiles and splash screens at about 85%).
Only the file sizes are read, never their pixels, so re-running gives the same
result. iOS icons get a white background because iOS renders transparency as
black; everything else stays transparent.
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
    with Image.open(path) as old:
        w, h = old.size
    side = round(min(w, h) * 0.84)
    box = ((w - side) // 2, (h - side) // 2, (w - side) // 2 + side, (h - side) // 2 + side)
    bw, bh = side, side
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

# The loader, onboarding header and app-connection header point at this one file.
# Twenty ships it as SVG, so the mark goes in as an embedded PNG to keep the path.
if len(sys.argv) > 3:
    import base64
    import io

    side = 96
    inner = round(side * 0.84)
    scale = inner / max(mark.width, mark.height)
    size = (round(mark.width * scale * 4), round(mark.height * scale * 4))
    buffer = io.BytesIO()
    mark.resize(size, Image.LANCZOS).save(buffer, format="PNG", optimize=True)
    data = base64.b64encode(buffer.getvalue()).decode("ascii")
    width, height = size[0] / 4, size[1] / 4
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{side}px" height="{side}px" '
        f'viewBox="0 0 {side} {side}"><image x="{(side - width) / 2:.2f}" '
        f'y="{(side - height) / 2:.2f}" width="{width:.2f}" height="{height:.2f}" '
        f'href="data:image/png;base64,{data}"/></svg>\n'
    )
    with open(sys.argv[3], "w", encoding="ascii", newline="\n") as handle:
        handle.write(svg)
    print(f"wrote {sys.argv[3]} ({len(svg)} bytes)")
