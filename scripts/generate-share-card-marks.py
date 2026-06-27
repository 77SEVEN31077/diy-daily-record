#!/usr/bin/env python3
"""Generate share-card mark assets (dark/light) from source illustration."""
from PIL import Image
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'scripts', 'assets', 'share-card-mark-source.png')
OUT_DIR = os.path.join(ROOT, 'public', 'icons')
OUT_SIZE = 512
MARGIN_RATIO = 0.06
LUM_THRESHOLD = 25
LINE_DARK = (242, 238, 231, 255)
LINE_LIGHT = (34, 34, 34, 255)
BLUSH_COLOR = (200, 138, 138, 255)


def is_blush(r, g, b):
    return r > 120 and g < 140 and b < 140 and r > g + 15 and r > b + 15


def is_tan_accent(r, g, b):
    return 90 < r < 210 and 70 < g < 180 and 50 < b < 160 and not is_blush(r, g, b) and r > b + 10


def is_art_pixel(r, g, b, a, lum_threshold=LUM_THRESHOLD):
    if a < 8:
        return False
    if is_blush(r, g, b) or is_tan_accent(r, g, b):
        return True
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    return lum >= lum_threshold


def crop_art(im, margin_ratio=MARGIN_RATIO):
    im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_art_pixel(r, g, b, a):
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return im
    cw, ch = max_x - min_x + 1, max_y - min_y + 1
    pad_x = int(cw * margin_ratio)
    pad_y = int(ch * margin_ratio)
    left = max(0, min_x - pad_x)
    top = max(0, min_y - pad_y)
    right = min(w, max_x + pad_x + 1)
    bottom = min(h, max_y + pad_y + 1)
    cropped = im.crop((left, top, right, bottom))
    cw2, ch2 = cropped.size
    side = max(cw2, ch2)
    pad = int(side * margin_ratio)
    canvas = Image.new('RGBA', (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    ox = pad + (side - cw2) // 2
    oy = pad + (side - ch2) // 2
    canvas.paste(cropped, (ox, oy), cropped)
    return canvas.resize((OUT_SIZE, OUT_SIZE), Image.Resampling.LANCZOS)


def to_dark_mark(im):
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if is_blush(r, g, b):
                alpha = min(255, max(140, int((r - 90) * 1.5)))
                px[x, y] = (*BLUSH_COLOR[:3], alpha)
            elif is_tan_accent(r, g, b):
                px[x, y] = (r, g, b, a)
            elif lum < 40:
                px[x, y] = (0, 0, 0, 0)
            elif lum > 120:
                px[x, y] = LINE_DARK
            else:
                alpha = min(255, int((lum - 40) * 2.5))
                px[x, y] = (*LINE_DARK[:3], alpha)
    return im


def to_light_mark(im):
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if is_blush(r, g, b):
                alpha = min(255, max(120, int((r - 90) * 1.6)))
                px[x, y] = (*BLUSH_COLOR[:3], alpha)
            elif is_tan_accent(r, g, b):
                px[x, y] = (r, g, b, a)
            elif lum < 40:
                px[x, y] = (0, 0, 0, 0)
            elif lum > 175:
                px[x, y] = LINE_LIGHT
            elif lum > 70:
                alpha = min(255, int((lum - 55) * 2.0))
                px[x, y] = (42, 42, 42, alpha)
            else:
                px[x, y] = (0, 0, 0, 0)
    return im


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    source = Image.open(SRC)
    cropped = crop_art(source)
    dark = to_dark_mark(cropped.copy())
    light = to_light_mark(cropped.copy())
    dark_path = os.path.join(OUT_DIR, 'share-card-mark-dark.png')
    light_path = os.path.join(OUT_DIR, 'share-card-mark-light.png')
    dark.save(dark_path, 'PNG', optimize=True)
    light.save(light_path, 'PNG', optimize=True)
    print('wrote', dark_path, dark.size)
    print('wrote', light_path, light.size)


if __name__ == '__main__':
    main()
