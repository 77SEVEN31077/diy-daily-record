import { db, collection, query, where, orderBy, limit, getDocs } from './firebase.js';
import { escapeHtml } from './sanitize.js';
import { getCurrentMonthKey } from './stats.js';

let isLoadingLeaderboard = false;

function getLeaderboardErrorHint(error) {
    const code = error?.code || '';
    const message = error?.message || '';

    if (code === 'failed-precondition' || message.includes('requires an index')) {
        return 'MISSING_FIRESTORE_INDEX';
    }

    if (code === 'permission-denied') {
        return 'FIRESTORE_RULES_DENIED';
    }

    if (code === 'unavailable') {
        return 'FIRESTORE_UNAVAILABLE_OR_NETWORK';
    }

    if (message.includes('does not provide an export named')) {
        return 'ES_MODULE_EXPORT_ERROR';
    }

    return 'UNKNOWN_LEADERBOARD_ERROR';
}

window.loadLeaderboard = async function() {
    if (isLoadingLeaderboard) return;
    isLoadingLeaderboard = true;

    const list = document.getElementById('rank-list');
    const t = window.getTexts ? window.getTexts() : {
        loading: '載入中...',
        you: '(你)',
        times: '次',
        'no-records': '本月尚無紀錄',
        'load-failed': '排行榜載入失敗'
    };

    if (!list) {
        isLoadingLeaderboard = false;
        return;
    }

    list.innerHTML = `<li class="rank-item rank-empty">${t.loading || '載入中...'}</li>`;

    try {
        const month = getCurrentMonthKey();
        const q = query(
            collection(db, 'monthlyLeaderboard'),
            where('month', '==', month),
            orderBy('count', 'desc'),
            limit(30)
        );

        const querySnapshot = await getDocs(q);
        const entries = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            entries.push({
                name: data.displayName || '匿名',
                count: data.count || 0
            });
        });

        const myName = localStorage.getItem('wank_nickname');

        if (entries.length === 0) {
            list.innerHTML = `<li class="rank-item rank-empty">${t['no-records']}</li>`;
        } else {
            list.innerHTML = entries.map((user, index) => {
                const isMe = user.name === myName;
                const highlight = isMe ? 'border-bottom: 1px solid var(--highlight);' : '';
                const isTop3 = index < 3 ? 'top-3' : '';
                const safeName = escapeHtml(user.name);
                return `<li class="rank-item"><span style="${highlight}"><span class="rank-badge ${isTop3}">#${index + 1}</span>${safeName}${isMe ? ` ${t.you || '(你)'}` : ''}</span><span class="leaderboard-count">${user.count} ${t.times || '次'}</span></li>`;
            }).join('');
        }
    } catch (error) {
        const hint = getLeaderboardErrorHint(error);

        console.error('[Leaderboard] load failed', {
            hint,
            code: error?.code,
            message: error?.message,
            error
        });

        list.innerHTML = `<li class="rank-item rank-empty">${t['load-failed'] || '排行榜載入失敗'}</li>`;
    } finally {
        isLoadingLeaderboard = false;
    }
};
