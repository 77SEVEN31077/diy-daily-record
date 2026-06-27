#!/usr/bin/env python3
"""Generate PWA app icons and favicons from user-provided brand assets."""
from PIL import Image
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
PUBLIC = os.path.join(ROOT, 'public')
APP_SRC = '/Users/leftleft/.cursor/projects/Users-leftleft-public/assets/PWA___RWA_icon-d276f576-9c7c-4ff2-b622-cef2e2d5067b.png'
FAV_SRC = '/Users/leftleft/.cursor/projects/Users-leftleft-public/assets/favicon-5f919f81-b747-4277-972a-03023879b77f.png'

LINE_DARK = (34, 34, 34, 255)
BG_DARK = (18, 18, 18, 255)


def is_blush(r, g, b):
    return r > 120 and g < 130 and b < 130 and r > g + 15 and r > b + 15


def content_bbox(im, threshold=14):
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    w, h = im.size
    px = im.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if is_blush(r, g, b) or max(r, g, b) > threshold:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return 0, 0, w, h
    return min_x, min_y, max_x + 1, max_y + 1


def trim_pad_square(im, margin_ratio=0.09):
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    min_x, min_y, max_x, max_y = content_bbox(im)
    cropped = im.crop((min_x, min_y, max_x, max_y))
    cw, ch = cropped.size
    side = max(cw, ch)
    pad = int(side * margin_ratio)
    canvas = Image.new('RGBA', (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
    ox = pad + (side - cw) // 2
    oy = pad + (side - ch) // 2
    canvas.paste(cropped, (ox, oy), cropped)
    return canvas


def flatten_on_dark(im, bg=BG_DARK):
    base = Image.new('RGBA', im.size, bg)
    base.alpha_composite(im)
    return base


def to_light_variant(im):
    im = im.convert('RGBA')
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 8:
                continue
            if is_blush(r, g, b):
                continue
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            if lum > 185:
                alpha = min(255, int((lum - 70) * 1.6))
                px[x, y] = (LINE_DARK[0], LINE_DARK[1], LINE_DARK[2], alpha)
            elif lum < 40:
                px[x, y] = (0, 0, 0, 0)
            elif lum > 90:
                alpha = min(255, int((lum - 50) * 1.4))
                px[x, y] = (LINE_DARK[0], LINE_DARK[1], LINE_DARK[2], alpha)
            else:
                px[x, y] = (0, 0, 0, 0)
    return im


def resize_icon(im, size):
    return im.resize((size, size), Image.Resampling.LANCZOS)


def save_png(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if im.mode == 'RGBA' and path.endswith('-light.png'):
        im.save(path, 'PNG', optimize=True)
    else:
        im.convert('RGB').save(path, 'PNG', optimize=True)
    print('wrote', path)


def save_ico(images, path):
    sizes = [(im.width, im.height) for im in images]
    images[0].save(path, format='ICO', sizes=sizes, append_images=images[1:])


def main():
    app_raw = Image.open(APP_SRC).convert('RGBA')
    fav_raw = Image.open(FAV_SRC).convert('RGBA')

    app_trim = trim_pad_square(app_raw, margin_ratio=0.09)
    fav_trim = trim_pad_square(fav_raw, margin_ratio=0.06)

    app_dark = flatten_on_dark(app_trim)
    app_light = to_light_variant(app_trim.copy())

    fav_dark = flatten_on_dark(fav_trim)
    fav_light = to_light_variant(fav_trim.copy())

    app_sizes = [512, 192, 180, 144, 96]
    for size in app_sizes:
        save_png(resize_icon(app_dark, size), os.path.join(PUBLIC, f'icon-{size}.png'))
        save_png(resize_icon(app_light, size), os.path.join(PUBLIC, f'icon-{size}-light.png'))

    save_png(resize_icon(app_dark, 192), os.path.join(PUBLIC, 'icon-192.png'))
    save_png(resize_icon(app_dark, 512), os.path.join(PUBLIC, 'icon-512.png'))
    save_png(resize_icon(app_dark, 180), os.path.join(PUBLIC, 'apple-touch-icon.png'))

    fav_sizes = [16, 32, 48]
    dark_ico_imgs = []
    light_ico_imgs = []
    for size in fav_sizes:
        d = resize_icon(fav_dark, size)
        l = resize_icon(fav_light, size)
        dark_ico_imgs.append(d)
        light_ico_imgs.append(l)
        save_png(d, os.path.join(PUBLIC, f'favicon-{size}x{size}.png'))
        save_png(l, os.path.join(PUBLIC, f'favicon-{size}x{size}-light.png'))

    save_ico(dark_ico_imgs, os.path.join(PUBLIC, 'favicon.ico'))
    save_ico(light_ico_imgs, os.path.join(PUBLIC, 'favicon-light.ico'))

    # Optional SVG favicon (simple reference to 32px dark)
    save_png(resize_icon(fav_dark, 32), os.path.join(PUBLIC, 'favicon.png'))


if __name__ == '__main__':
    main()
