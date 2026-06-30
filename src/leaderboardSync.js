import {
    db,
    doc,
    Timestamp,
    runTransaction
} from './firebase.js';
import { sanitizeDisplayName } from './sanitize.js';
import { getCurrentMonthKey } from './stats.js';

const CLIENT_ID_KEY = 'leaderboard_client_id';
const OPTIN_KEY = 'leaderboard_optin';
const NICKNAME_KEY = 'wank_nickname';

function getLeaderboardClientId() {
    let id = localStorage.getItem(CLIENT_ID_KEY);

    if (!id) {
        id = crypto.randomUUID
            ? crypto.randomUUID()
            : `lb_${Date.now()}_${Math.random().toString(36).slice(2)}`;

        localStorage.setItem(CLIENT_ID_KEY, id);
    }

    return id;
}

function getLeaderboardDocId(month = getCurrentMonthKey()) {
    return `${month}_${getLeaderboardClientId()}`;
}

export function initLeaderboardOptIn() {
    const checkbox = document.getElementById('join-leaderboard');
    const nicknameGroup = document.getElementById('optin-nickname-group');
    const nicknameInput = document.getElementById('public-nickname');

    if (!checkbox) return;

    const savedOptIn = localStorage.getItem(OPTIN_KEY) === 'true';
    checkbox.checked = savedOptIn;

    if (nicknameGroup) {
        nicknameGroup.style.display = savedOptIn ? 'block' : 'none';
    }

    const savedName = localStorage.getItem(NICKNAME_KEY);

    if (nicknameInput && savedName) {
        nicknameInput.value = savedName;
    }

    checkbox.addEventListener('change', () => {
        localStorage.setItem(OPTIN_KEY, checkbox.checked ? 'true' : 'false');

        if (nicknameGroup) {
            nicknameGroup.style.display = checkbox.checked ? 'block' : 'none';
        }
    });
}

/**
 * 僅在使用者 opt-in 後由 records.js 呼叫。
 * 寫入 monthlyLeaderboard：displayName、month、count、updatedAt
 */
export async function syncLeaderboardIncrement(displayName) {
    const name = sanitizeDisplayName(displayName);

    if (!name || name.length < 1) {
        throw new Error('INVALID_DISPLAY_NAME');
    }

    const month = getCurrentMonthKey();
    const docRef = doc(db, 'monthlyLeaderboard', getLeaderboardDocId(month));
    const now = Timestamp.now();

    await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(docRef);

        if (!snapshot.exists()) {
            transaction.set(docRef, {
                displayName: name,
                month,
                count: 1,
                updatedAt: now
            });
            return;
        }

        const prev = snapshot.data();
        const prevCount = Number.isInteger(prev.count) ? prev.count : 0;

        transaction.update(docRef, {
            displayName: name,
            month,
            count: prevCount + 1,
            updatedAt: now
        });
    });

    localStorage.setItem(NICKNAME_KEY, name);
}
