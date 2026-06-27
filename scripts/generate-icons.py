#!/usr/bin/env python3
"""Generate dark/light hero & section icons from the main hero source."""
from PIL import Image
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'public', 'icons', 'hero-icon.png')
AGE_SRC = os.path.join(ROOT, 'public', 'icons', 'age-icon.png')
AGE_DARK_OUT = os.path.join(ROOT, 'public', 'icons', 'age-icon-dark.png')
AGE_LIGHT_OUT = os.path.join(ROOT, 'public', 'icons', 'age-icon-light.png')
OUT_DIR = os.path.join(ROOT, 'public', 'icons')
MARGIN_RATIO = 0.05
LINE_COLOR = (34, 34, 34, 255)
BLUSH_COLOR = (208, 138, 138, 255)


def trim_content(im, margin_ratio=MARGIN_RATIO, threshold=18):
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    w, h = im.size
    pixels = im.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a > 10 and (r > threshold or g > threshold or b > threshold):
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
    canvas = Image.new('RGBA', (side + pad * 2, side + pad * 2), (0, 0, 0, 255))
    ox = pad + (side - cw2) // 2
    oy = pad + (side - ch2) // 2
    canvas.paste(cropped, (ox, oy), cropped)
    return canvas


def is_blush_pixel(r, g, b):
    return r > 120 and g < 130 and b < 130 and r > g + 15 and r > b + 15


def is_age_art_pixel(r, g, b, a, lum_threshold=22):
    if a < 8:
        return False
    if is_blush_pixel(r, g, b):
        return True
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    return lum >= lum_threshold


def crop_age_icon_tight(im, margin_ratio=0.05, lum_threshold=22):
    """Tight crop for age gate: keeps 18+ card, face, clock; drops outer black padding."""
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    w, h = im.size
    pixels = im.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_age_art_pixel(r, g, b, a, lum_threshold):
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
    canvas = Image.new('RGBA', (side + pad * 2, side + pad * 2), (0, 0, 0, 255))
    ox = pad + (side - cw2) // 2
    oy = pad + (side - ch2) // 2
    canvas.paste(cropped, (ox, oy), cropped)
    return canvas


def to_age_light_variant(im):
    """Transparent background + dark gray lines; preserve muted blush."""
    im = im.convert('RGBA')
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 8:
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if is_blush_pixel(r, g, b):
                blush_alpha = min(255, max(120, int((r - 90) * 1.6)))
                pixels[x, y] = (*BLUSH_COLOR[:3], blush_alpha)
            elif lum < 40:
                pixels[x, y] = (0, 0, 0, 0)
            elif lum > 175:
                pixels[x, y] = LINE_COLOR
            elif lum > 70:
                edge_alpha = min(255, int((lum - 55) * 2.0))
                pixels[x, y] = (42, 42, 42, edge_alpha)
            else:
                pixels[x, y] = (0, 0, 0, 0)
    return im


def is_blush(r, g, b):
    return r > 130 and g < 110 and b < 110 and r > g + 20 and r > b + 20


def to_light_variant(im):
    im = im.convert('RGBA')
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_blush(r, g, b):
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if lum > 200:
                pixels[x, y] = LINE_COLOR
            elif lum < 35:
                pixels[x, y] = (0, 0, 0, 0)
            elif lum > 120:
                alpha = min(255, int((lum - 80) * 1.8))
                pixels[x, y] = (34, 34, 34, alpha)
            else:
                pixels[x, y] = (0, 0, 0, 0)
    return im


def save_png(im, path):
    im.save(path, 'PNG', optimize=True)
    print('wrote', path, im.size)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    source = Image.open(SRC)
    dark = trim_content(source)
    light = to_light_variant(dark.copy())

    for name in ('hero-icon-dark', 'section-icon-dark'):
        save_png(dark, os.path.join(OUT_DIR, f'{name}.png'))
    for name in ('hero-icon-light', 'section-icon-light'):
        save_png(light, os.path.join(OUT_DIR, f'{name}.png'))

    if os.path.exists(AGE_SRC):
        age_source = Image.open(AGE_SRC)
        age_dark = crop_age_icon_tight(age_source, margin_ratio=0.05, lum_threshold=22)
        save_png(age_dark, AGE_DARK_OUT)
        save_png(to_age_light_variant(age_dark.copy()), AGE_LIGHT_OUT)


if __name__ == '__main__':
    main()
