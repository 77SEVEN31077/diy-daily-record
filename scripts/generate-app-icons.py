#!/usr/bin/env python3
"""Draw PWA app icons and favicons from scratch (vector-style, full-bleed)."""
from PIL import Image, ImageDraw
import os

ROOT = os.path.join(os.path.dirname(__file__), '..')
PUBLIC = os.path.join(ROOT, 'public')
ICONS = os.path.join(PUBLIC, 'icons')

BG = (17, 17, 17)
LINE = (242, 238, 231)
BLUSH = (208, 138, 138)
FAV_LINE = (34, 34, 34)
FAV_BLUSH = (200, 117, 117)

MASTER = 512


def _mouth(draw, cx, cy, half_w, half_h, color):
    draw.rounded_rectangle(
        [cx - half_w, cy - half_h, cx + half_w, cy + half_h],
        radius=half_h,
        fill=color,
    )


def draw_shy_face(draw, cx, cy, face_r, line_w, line_color, blush_color):
    bbox = [cx - face_r, cy - face_r, cx + face_r, cy + face_r]
    draw.ellipse(bbox, outline=line_color, width=line_w)

    eye_r = max(2, int(face_r * 0.058))
    eye_y = cy - int(face_r * 0.13)
    eye_dx = int(face_r * 0.27)
    for ex in (cx - eye_dx, cx + eye_dx):
        draw.ellipse(
            [ex - eye_r, eye_y - eye_r, ex + eye_r, eye_y + eye_r],
            fill=line_color,
        )

    mouth_w = int(face_r * 0.24)
    mouth_h = max(2, int(face_r * 0.045))
    mouth_y = cy + int(face_r * 0.17)
    _mouth(draw, cx, mouth_y, mouth_w, mouth_h, line_color)

    blush_w = int(face_r * 0.16)
    blush_h = max(2, int(face_r * 0.065))
    blush_y = cy + int(face_r * 0.04)
    blush_dx = int(face_r * 0.4)
    for bx in (cx - blush_dx, cx + blush_dx):
        draw.ellipse(
            [bx - blush_w // 2, blush_y - blush_h // 2, bx + blush_w // 2, blush_y + blush_h // 2],
            fill=blush_color,
        )


def draw_clock_badge(draw, cx, cy, r, line_w, line_color, fill_color):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=fill_color, outline=line_color, width=line_w)
    hand = max(2, int(line_w * 0.75))
    v_len = int(r * 0.5)
    h_len = int(r * 0.32)
    draw.line([(cx, cy), (cx, cy - v_len)], fill=line_color, width=hand)
    draw.line([(cx, cy), (cx + h_len, cy)], fill=line_color, width=hand)


def render_app_icon(size, maskable=False):
    im = Image.new('RGB', (size, size), BG)
    draw = ImageDraw.Draw(im)

    if maskable:
        face_r = int(size * 0.34)
        clock_r = int(size * 0.105)
        cx, cy = size // 2, int(size * 0.46)
    else:
        face_r = int(size * 0.395)
        clock_r = int(size * 0.135)
        cx, cy = size // 2, int(size * 0.475)

    line_w = max(2, round(18 * size / MASTER))
    draw_shy_face(draw, cx, cy, face_r, line_w, LINE, BLUSH)

    clock_cx = cx + int(face_r * 0.7)
    clock_cy = cy + int(face_r * 0.7)
    draw_clock_badge(draw, clock_cx, clock_cy, clock_r, line_w, LINE, BG)
    return im


def render_favicon(size, dark=False):
    if dark:
        im = Image.new('RGBA', (size, size), BG + (255,))
        line = LINE + (255,) if len(LINE) == 3 else LINE
        blush = BLUSH + (255,) if len(BLUSH) == 3 else BLUSH
    else:
        im = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        line = FAV_LINE + (255,)
        blush = FAV_BLUSH + (255,)

    draw = ImageDraw.Draw(im)
    face_r = int(size * 0.445)
    line_w = max(2, round(24 * size / MASTER))
    cx, cy = size // 2, size // 2
    draw_shy_face(draw, cx, cy, face_r, line_w, line, blush)
    return im


def save_rgb(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'PNG', optimize=True)
    print('wrote', path)


def save_rgba(im, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'PNG', optimize=True)
    print('wrote', path)


def save_ico(images, path):
    sizes = [(im.width, im.height) for im in images]
    rgb_images = [im.convert('RGBA') for im in images]
    rgb_images[0].save(path, format='ICO', sizes=sizes, append_images=rgb_images[1:])
    print('wrote', path)


def write_favicon_svg(path):
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <circle cx="16" cy="16" r="14.4" stroke="#222222" stroke-width="2.2"/>
  <circle cx="11.4" cy="13.8" r="1.55" fill="#222222"/>
  <circle cx="20.6" cy="13.8" r="1.55" fill="#222222"/>
  <rect x="12.2" y="18.2" width="7.6" height="2" rx="1" fill="#222222"/>
  <ellipse cx="8.8" cy="17.2" rx="2.3" ry="1.15" fill="#c87575"/>
  <ellipse cx="23.2" cy="17.2" rx="2.3" ry="1.15" fill="#c87575"/>
</svg>'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print('wrote', path)


def write_favicon_dark_svg(path):
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" fill="#111111"/>
  <circle cx="16" cy="16" r="14.4" stroke="#f2eee7" stroke-width="2.2"/>
  <circle cx="11.4" cy="13.8" r="1.55" fill="#f2eee7"/>
  <circle cx="20.6" cy="13.8" r="1.55" fill="#f2eee7"/>
  <rect x="12.2" y="18.2" width="7.6" height="2" rx="1" fill="#f2eee7"/>
  <ellipse cx="8.8" cy="17.2" rx="2.3" ry="1.15" fill="#d08a8a"/>
  <ellipse cx="23.2" cy="17.2" rx="2.3" ry="1.15" fill="#d08a8a"/>
</svg>'''
    with open(path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print('wrote', path)


def main():
    master_app = render_app_icon(MASTER, maskable=False)
    master_mask = render_app_icon(MASTER, maskable=True)
    master_fav = render_favicon(MASTER, dark=False)

    app_sizes = [512, 192, 180, 144, 96]
    for size in app_sizes:
        if size == 512:
            im = master_app
        else:
            im = master_app.resize((size, size), Image.Resampling.LANCZOS)
        save_rgb(im, os.path.join(ICONS, f'app-icon-{size}.png'))

    save_rgb(
        master_mask.resize((512, 512), Image.Resampling.LANCZOS) if MASTER != 512 else master_mask,
        os.path.join(ICONS, 'app-icon-maskable-512.png'),
    )

    fav_sizes = [16, 32, 48]
    ico_images = []
    for size in fav_sizes:
        if size == MASTER:
            im = master_fav
        else:
            im = master_fav.resize((size, size), Image.Resampling.LANCZOS)
        save_rgba(im, os.path.join(ICONS, f'favicon-{size}x{size}.png'))
        ico_images.append(im)

    dark32 = render_favicon(32, dark=True)
    save_rgba(dark32, os.path.join(ICONS, 'favicon-dark-32x32.png'))

    save_ico(ico_images, os.path.join(PUBLIC, 'favicon.ico'))
    write_favicon_svg(os.path.join(PUBLIC, 'favicon.svg'))
    write_favicon_dark_svg(os.path.join(ICONS, 'favicon-dark.svg'))


if __name__ == '__main__':
    main()
