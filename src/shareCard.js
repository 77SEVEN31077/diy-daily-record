const DARK_PALETTE = {
    pageBg: '#050505',
    cardBg: '#0d0d0d',
    textMain: 'rgba(255,255,255,0.92)',
    textMuted: 'rgba(255,255,255,0.62)',
    border: 'rgba(255,255,255,0.22)',
    divider: 'rgba(255,255,255,0.14)',
};

const LIGHT_PALETTE = {
    pageBg: '#fafafa',
    cardBg: '#ffffff',
    textMain: 'rgba(0,0,0,0.88)',
    textMuted: 'rgba(0,0,0,0.58)',
    border: 'rgba(0,0,0,0.18)',
    divider: 'rgba(0,0,0,0.12)',
};

const FONT_SANS = '-apple-system, BlinkMacSystemFont, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", "Segoe UI", sans-serif';
const FONT_MONO = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

const SIZE = 1080;
const CARD_X = 96;
const CARD_Y = 96;
const CARD_W = 888;
const CARD_H = 888;
const PAD = 80;

const MARK_PATHS = {
    dark: '/icons/share-card-mark-dark.png',
    light: '/icons/share-card-mark-light.png',
};

export function getResolvedTheme() {
    const root = document.documentElement;
    const dataTheme = root.getAttribute('data-theme');
    if (dataTheme === 'light') return 'light';
    if (dataTheme === 'dark') return 'dark';
    if (root.classList.contains('light')) return 'light';
    return 'dark';
}

export function getShareCardMarkSrc(theme) {
    const resolved = theme === 'light' ? 'light' : 'dark';
    return MARK_PATHS[resolved];
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function roundRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
}

function computeMarkLayout(lastRowY) {
    const markSize = Math.round(SIZE * 0.222);
    const lastRowBottom = lastRowY + 46;
    let markY = lastRowBottom + 44;
    const footerY = CARD_Y + CARD_H - PAD - 20;
    const maxMarkBottom = footerY - 24;
    if (markY + markSize > maxMarkBottom) {
        markY = maxMarkBottom - markSize;
    }
    const markX = Math.round((SIZE - markSize) / 2);
    return { markSize, markX, markY, footerY };
}

export async function renderBattleCard({ texts, monthlyCount, sinceLast, longestGap, theme }) {
    const palette = theme === 'light' ? LIGHT_PALETTE : DARK_PALETTE;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = palette.pageBg;
    ctx.fillRect(0, 0, SIZE, SIZE);

    roundRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, 20);
    ctx.fillStyle = palette.cardBg;
    ctx.fill();
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 2;
    ctx.stroke();

    const innerX = CARD_X + PAD;
    const innerY = CARD_Y + PAD;
    const innerW = CARD_W - PAD * 2;
    const centerX = CARD_X + CARD_W / 2;

    const title = texts['share-card-title'] || '';
    ctx.fillStyle = palette.textMain;
    ctx.font = `700 52px ${FONT_SANS}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(title, centerX, innerY + 36);

    const dividerY = innerY + 118;
    ctx.strokeStyle = palette.divider;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(innerX, dividerY);
    ctx.lineTo(innerX + innerW, dividerY);
    ctx.stroke();

    const rows = [
        [texts['share-card-this-month'] || '', String(monthlyCount)],
        [texts['share-card-time-since-last'] || '', sinceLast],
        [texts['share-card-longest-gap'] || '', longestGap],
    ];

    let rowY = dividerY + 52;
    const rowGap = 108;
    let lastRowY = rowY;

    rows.forEach(([label, value], index) => {
        if (index > 0) {
            ctx.strokeStyle = palette.divider;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(innerX, rowY - 24);
            ctx.lineTo(innerX + innerW, rowY - 24);
            ctx.stroke();
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = palette.textMain;
        ctx.font = `700 42px ${FONT_SANS}`;
        ctx.fillText(label, innerX, rowY);

        ctx.textAlign = 'right';
        ctx.font = `700 46px ${FONT_MONO}`;
        ctx.fillText(value, innerX + innerW, rowY);

        lastRowY = rowY;
        rowY += rowGap;
    });

    const { markSize, markX, markY, footerY } = computeMarkLayout(lastRowY);

    try {
        const markImg = await loadImage(getShareCardMarkSrc(theme));
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(markImg, markX, markY, markSize, markSize);
    } catch (err) {
        console.warn('[shareCard] mark image failed to load', err);
    }

    const footer = texts['share-card-footer'] || '';
    ctx.textAlign = 'center';
    ctx.fillStyle = palette.textMuted;
    ctx.font = `400 30px ${FONT_SANS}`;
    ctx.fillText(footer, centerX, footerY);

    return canvas;
}
