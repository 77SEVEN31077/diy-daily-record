export const FUTURE_TOLERANCE_MS = 60 * 1000;

function pad2(value) {
    return String(value).padStart(2, '0');
}

export function formatDateTimeLocal(date = new Date()) {
    return [
        date.getFullYear(),
        pad2(date.getMonth() + 1),
        pad2(date.getDate())
    ].join('-') + 'T' + [
        pad2(date.getHours()),
        pad2(date.getMinutes())
    ].join(':');
}

export function parseLocalRecordTime(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

export function isFutureDate(date, now = new Date()) {
    return date.getTime() - now.getTime() > FUTURE_TOLERANCE_MS;
}
