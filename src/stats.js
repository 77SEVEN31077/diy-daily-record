import { escapeHtml } from './sanitize.js';
import { isFutureDate } from './dateUtils.js';

const STORAGE_KEY = 'wank_records';

export function getLocalRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

export function saveLocalRecords(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getCurrentMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatDuration(ms, texts) {
    if (ms == null || ms < 0) return '—';
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        const remainHours = hours % 24;
        return remainHours > 0
            ? `${days}${texts['unit-day'] || '天'} ${remainHours}${texts['unit-hour'] || '小時'}`
            : `${days}${texts['unit-day'] || '天'}`;
    }
    if (hours > 0) {
        const remainMinutes = minutes % 60;
        return remainMinutes > 0
            ? `${hours}${texts['unit-hour'] || '小時'} ${remainMinutes}${texts['unit-minute'] || '分鐘'}`
            : `${hours}${texts['unit-hour'] || '小時'}`;
    }
    if (minutes > 0) return `${minutes}${texts['unit-minute'] || '分鐘'}`;
    return texts['time-just-now'] || '剛剛';
}

function parseRecord(record) {
    if (!record || !record.time) return null;
    const date = new Date(record.time);
    if (Number.isNaN(date.getTime())) return null;
    return { ...record, date };
}

export function computeStats(records = getLocalRecords()) {
    const now = new Date();
    const parsed = records.map(parseRecord).filter(Boolean);
    const sorted = [...parsed].sort((a, b) => b.date - a.date);
    const futureRecords = sorted.filter((record) => isFutureDate(record.date, now));
    const validSorted = sorted.filter((record) => !isFutureDate(record.date, now));

    const monthKey = getCurrentMonthKey(now);
    const monthlyCount = validSorted.filter((record) => getCurrentMonthKey(record.date) === monthKey).length;

    let sinceLast = null;
    if (validSorted.length > 0) {
        sinceLast = Math.max(0, now - validSorted[0].date);
    }

    let avgInterval = null;
    let longestInterval = null;
    if (validSorted.length >= 2) {
        const intervals = [];
        for (let i = 0; i < validSorted.length - 1; i++) {
            const gap = validSorted[i].date - validSorted[i + 1].date;
            if (gap > 0) intervals.push(gap);
        }
        if (intervals.length > 0) {
            avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            longestInterval = Math.max(...intervals);
        }
    }

    return {
        sorted,
        validSorted,
        futureRecords,
        futureCount: futureRecords.length,
        monthlyCount,
        sinceLast,
        avgInterval,
        longestInterval
    };
}

function formatFutureRecordsHint(texts, futureCount) {
    const template = texts['future-records-excluded'] || '有 {count} 筆時間晚於現在，已不納入統計。';
    return template.replace('{count}', String(futureCount));
}

export function renderLocalStats() {
    const texts = window.getTexts ? window.getTexts() : {};
    const {
        sorted,
        futureCount,
        monthlyCount,
        sinceLast,
        avgInterval
    } = computeStats();

    const sinceEl = document.getElementById('stat-since-value');
    const monthlyEl = document.getElementById('stat-monthly-value');
    const avgEl = document.getElementById('stat-avg-value');
    const list = document.getElementById('history-list');
    const emptyHint = document.getElementById('history-empty');
    const futureHint = document.getElementById('history-future-hint');

    if (sinceEl) {
        sinceEl.textContent = sinceLast != null ? formatDuration(sinceLast, texts) : '—';
    }
    if (monthlyEl) monthlyEl.textContent = String(monthlyCount);
    if (avgEl) avgEl.textContent = avgInterval != null ? formatDuration(avgInterval, texts) : '—';

    if (futureHint) {
        if (futureCount > 0) {
            futureHint.textContent = formatFutureRecordsHint(texts, futureCount);
            futureHint.style.display = 'block';
        } else {
            futureHint.textContent = '';
            futureHint.style.display = 'none';
        }
    }

    if (!list) return;

    const recent = sorted.slice(0, 10);
    if (recent.length === 0) {
        list.innerHTML = '';
        if (emptyHint) emptyHint.style.display = 'block';
        return;
    }

    if (emptyHint) emptyHint.style.display = 'none';
    const now = new Date();
    list.innerHTML = recent.map((rec) => {
        const dateObj = rec.date;
        const dateStr = `${dateObj.getFullYear()}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
        const note = rec.note ? `<span class="history-note">${escapeHtml(rec.note)}</span>` : '';
        const futureClass = isFutureDate(dateObj, now) ? ' is-future-record' : '';
        return `<li class="history-item${futureClass}"><span>${dateStr}${note ? ' · ' + note : ''}</span></li>`;
    }).join('');
}

window.renderLocalStats = renderLocalStats;
window.computeStats = computeStats;
window.formatDuration = formatDuration;
