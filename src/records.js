import { getLocalRecords, saveLocalRecords, renderLocalStats } from './stats.js';
import { syncLeaderboardIncrement } from './leaderboardSync.js';
import { sanitizeDisplayName } from './sanitize.js';

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

    const time = timeInput?.value;
    const note = noteInput?.value?.trim() || '';
    const joinLeaderboard = joinCheckbox?.checked === true;

    if (!time) {
        alert(t['alert-time'] || '請選擇時間！');
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
    alert(t['alert-success'] || '紀錄成功！');
};

window.renderLocalHistory = renderLocalStats;
