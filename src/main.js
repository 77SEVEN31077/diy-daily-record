// 主入口文件
import './styles.css';
import './firebase.js';
import './theme.js';
import './language.js';
import './icons.js';
import './auth.js';
import { initTime, shareStats, initLanguage, initAgeGate } from './utils.js';
import { updateThemeIcons } from './icons.js';
import './records.js';
import { renderLocalStats } from './stats.js';
import { initLeaderboardOptIn } from './leaderboardSync.js';
import './leaderboard.js';

window.shareStats = shareStats;

window.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initAgeGate();
    initTime();
    initLeaderboardOptIn();
    renderLocalStats();
    updateThemeIcons();

    if (typeof window.loadLeaderboard === 'function') {
        window.loadLeaderboard();
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .then((registration) => {
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    }
                });

                setInterval(() => registration.update(), 60 * 60 * 1000);
            })
            .catch((error) => console.log('Service Worker 註冊失敗:', error));

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });
    });
}

function showUpdateNotification() {
    const texts = window.getTexts ? window.getTexts() : {};
    const updateText = texts['update-available'] || '有新版本可用，是否立即更新？';
    const updateBtn = texts['update-now'] || '立即更新';
    const updateLater = texts['update-later'] || '稍後';

    const updateBanner = document.createElement('div');
    updateBanner.id = 'update-banner';
    updateBanner.style.cssText = `
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
        background: var(--input-bg); border: 1px solid var(--border-color);
        padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000; max-width: 90%; text-align: center; color: var(--text-color); font-size: 0.9rem;
    `;
    updateBanner.innerHTML = `
        <p style="margin: 0 0 10px 0;">${updateText}</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="updateServiceWorker()" style="background: var(--highlight); color: var(--bg-color); border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">${updateBtn}</button>
            <button onclick="document.getElementById('update-banner').remove()" style="background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">${updateLater}</button>
        </div>
    `;
    document.body.appendChild(updateBanner);
}

window.updateServiceWorker = function() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
};
