import { getLocalRecords, saveLocalRecords, renderLocalStats } from './stats.js';
import { syncLeaderboardIncrement } from './leaderboardSync.js';
import { sanitizeDisplayName } from './sanitize.js';
import {
    formatDateTimeLocal,
    parseLocalRecordTime,
    FUTURE_TOLERANCE_MS
} from './dateUtils.js';
import { initTime, refreshRecordTimeMax } from './utils.js';

/**
 * 新增紀錄：
 * 1. 永遠只寫入 localStorage（時間、備註）
 * 2. 僅在使用者勾選「加入本月排行榜」時，才呼叫 Firebase
 * 3. Firebase 只寫入 monthlyLeaderboard 聚合欄位，不含私人時間
 */
window.addRecord = async function() {
    const timeInput = document.getElementById('record-time');
    const noteInput = document.getElementById('record-note');
    const joinCheckbox = document.getElementById('join-leaderboard');
    const publicNicknameInput = document.getElementById('public-nickname');
    const t = window.getTexts ? window.getTexts() : {};

    refreshRecordTimeMax();

    const time = timeInput?.value;
    const note = noteInput?.value?.trim() || '';
    const joinLeaderboard = joinCheckbox?.checked === true;

    if (!time) {
        alert(t['alert-time'] || '請選擇時間！');
        return;
    }

    const selectedDate = parseLocalRecordTime(time);
    if (!selectedDate) {
        alert(t['alert-invalid-time'] || '時間格式不正確，請重新選擇。');
        return;
    }

    const now = new Date();
    if (selectedDate.getTime() - now.getTime() > FUTURE_TOLERANCE_MS) {
        alert(t['alert-future-time'] || '時間不能晚於現在。');
        const localNow = formatDateTimeLocal(now);
        timeInput.value = localNow;
        timeInput.max = localNow;
        return;
    }

    if (joinLeaderboard) {
        const displayName = sanitizeDisplayName(publicNicknameInput?.value);
        if (!displayName) {
            alert(t['alert-display-name'] || '加入排行榜需填寫公開暱稱（1-24 字元）');
            return;
        }
    }

    // 私人紀錄：僅本機
    const records = getLocalRecords();
    records.push({ time, note: note || undefined });
    saveLocalRecords(records);

    renderLocalStats();

    // Firebase：僅 opt-in 時寫入排行榜聚合資料
    if (joinLeaderboard) {
        try {
            await syncLeaderboardIncrement(publicNicknameInput.value);
            if (typeof window.loadLeaderboard === 'function') {
                window.loadLeaderboard();
            }
        } catch (e) {
            console.error(e);
            alert(t['alert-leaderboard-failed'] || '本機已保存，但排行榜同步失敗，請稍後再試。');
            return;
        }
    }

    if (noteInput) noteInput.value = '';
    initTime();
    alert(t['alert-success'] || '紀錄成功！');
};

window.renderLocalHistory = renderLocalStats;
