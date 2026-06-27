// 工具函數

// 初始化時間輸入框
export function initTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('record-time').value = now.toISOString().slice(0, 16);
}

// 18+ 年齡確認
export function initAgeGate() {
    if (localStorage.getItem('age_confirmed') === 'true') return;
    const modal = document.getElementById('ageGateModal');
    if (modal) modal.style.display = 'block';
}

window.confirmAgeGate = function() {
    localStorage.setItem('age_confirmed', 'true');
    const modal = document.getElementById('ageGateModal');
    if (modal) modal.style.display = 'none';
};

// 分享與截圖功能（兩段式：先生成 → 顯示提示 → 使用者點下載）
let pendingShareImageDataUrl = null;

export async function shareStats() {
    const captureArea = document.getElementById('share-capture-area');
    const shareMsg = document.getElementById('share-msg');
    const shareBtn = document.getElementById('share-generate-btn') || document.querySelector('.btn-share');
    const downloadBtn = document.getElementById('share-download-btn');
    const texts = window.getTexts ? window.getTexts() : translations['zh-TW'];

    if (typeof window.updateShareCaptureArea === 'function') {
        window.updateShareCaptureArea();
    }

    if (shareBtn) {
        shareBtn.disabled = true;
        shareBtn.innerText = texts['loading'] || '載入中...';
    }
    if (shareMsg) shareMsg.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
    pendingShareImageDataUrl = null;

    try {
        captureArea.style.display = 'block';
        captureArea.style.position = 'fixed';
        captureArea.style.left = '0';
        captureArea.style.top = '0';
        captureArea.style.zIndex = '-1';

        const canvas = await html2canvas(captureArea, {
            backgroundColor: '#000000',
            scale: 2
        });

        captureArea.style.display = '';
        captureArea.style.position = '';
        captureArea.style.left = '';
        captureArea.style.top = '';
        captureArea.style.zIndex = '';

        pendingShareImageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

        if (shareMsg) {
            shareMsg.innerText = texts['share-success'] || '戰績圖已生成。';
            shareMsg.style.display = 'block';
        }
        if (downloadBtn) {
            downloadBtn.textContent = texts['share-download-btn'] || '下載圖片';
            downloadBtn.style.display = 'block';
        }
    } catch (err) {
        console.error(err);
        alert(texts['share-failed'] || '分享失敗，請手動截圖');
    } finally {
        if (shareBtn) {
            shareBtn.disabled = false;
            shareBtn.innerText = texts['share-btn'] || '生成戰績圖';
        }
    }
}

window.downloadShareImage = function() {
    if (!pendingShareImageDataUrl) return;
    const texts = window.getTexts ? window.getTexts() : translations['zh-TW'];
    const link = document.createElement('a');
    link.download = `daily-record-${Date.now()}.jpg`;
    link.href = pendingShareImageDataUrl;
    link.click();
    const shareMsg = document.getElementById('share-msg');
    if (shareMsg && texts['share-success']) {
        shareMsg.innerText = texts['share-success'];
        shareMsg.style.display = 'block';
    }
};

// 模態框管理
window.openTerms = function() {
    // 確保內容是最新語言
    const texts = window.getTexts ? window.getTexts() : {};
    const termsModalBody = document.querySelector('#termsModal .modal-body');
    if (termsModalBody && texts['terms-welcome']) {
        termsModalBody.innerHTML = `
            <p>${texts['terms-welcome']}</p>
            
            <p><strong>${texts['terms-1-title']}</strong></p>
            <p>${texts['terms-1-content']}</p>
            
            <p><strong>${texts['terms-2-title']}</strong></p>
            <p>${texts['terms-2-content']}</p>
            
            <p><strong>${texts['terms-3-title']}</strong></p>
            <p>${texts['terms-3-content']}</p>
            
            <p><strong>${texts['terms-4-title']}</strong></p>
            <p>${texts['terms-4-content']}</p>
            
            <p><strong>${texts['terms-5-title']}</strong></p>
            <p>${texts['terms-5-content']}</p>
            
            <p><strong>${texts['terms-6-title']}</strong></p>
            <p>${texts['terms-6-content']}</p>
        `;
    }
    const termsTitle = document.querySelector('#termsModal h3');
    if (termsTitle && texts['terms-title']) {
        termsTitle.textContent = texts['terms-title'];
    }
    document.getElementById('termsModal').style.display = 'block';
};

window.closeTerms = function() {
    document.getElementById('termsModal').style.display = 'none';
};

function renderPrivacyBody(texts) {
    const items = [
        texts['privacy-local'],
        texts['privacy-firebase'],
        texts['privacy-public'],
        texts['privacy-delete'],
        texts['privacy-third-party'],
        texts['privacy-analytics'],
        texts['privacy-sell']
    ].filter(Boolean);
    return `<ul class="privacy-list">${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function renderAboutBody(texts) {
    return `
        <p><strong>${texts['about-1-title'] || ''}</strong></p>
        <p>${texts['about-1-content'] || ''}</p>
        <p><strong>${texts['about-2-title'] || ''}</strong></p>
        <p>${texts['about-2-p1'] || ''}</p>
        <p>${texts['about-2-p2'] || ''}</p>
        <p>${texts['about-2-p3'] || ''}</p>
        <p>${texts['about-2-p4'] || ''}</p>
        <p>${texts['about-2-p5'] || ''}</p>
        <p>${texts['about-2-p6'] || ''}</p>
        <p style="text-align: right; margin-top: 20px; color: #888;">${texts['about-author'] || ''}</p>
    `;
}

window.openPrivacy = function() {
    const texts = window.getTexts ? window.getTexts() : {};
    const privacyModalBody = document.querySelector('#privacyModal .modal-body');
    if (privacyModalBody) privacyModalBody.innerHTML = renderPrivacyBody(texts);
    const privacyTitle = document.querySelector('#privacyModal h3');
    if (privacyTitle && texts['privacy-title']) privacyTitle.textContent = texts['privacy-title'];
    document.getElementById('privacyModal').style.display = 'block';
};

window.closePrivacy = function() {
    document.getElementById('privacyModal').style.display = 'none';
};

window.openAbout = function() {
    const texts = window.getTexts ? window.getTexts() : {};
    const aboutModalBody = document.querySelector('#aboutModal .modal-body');
    if (aboutModalBody) aboutModalBody.innerHTML = renderAboutBody(texts);
    const aboutTitle = document.querySelector('#aboutModal h3');
    if (aboutTitle && texts['about-title']) aboutTitle.textContent = texts['about-title'];
    document.getElementById('aboutModal').style.display = 'block';
};

window.closeAbout = function() {
    document.getElementById('aboutModal').style.display = 'none';
};

// 點擊模態框外部關閉
window.onclick = function(event) {
    const termsModal = document.getElementById('termsModal');
    const privacyModal = document.getElementById('privacyModal');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target == termsModal) {
        termsModal.style.display = 'none';
    }
    if (event.target == privacyModal) {
        privacyModal.style.display = 'none';
    }
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
    }
    const aboutModal = document.getElementById('aboutModal');
    if (event.target == aboutModal) {
        aboutModal.style.display = 'none';
    }
};

// 多語言翻譯對象
export const translations = {
    'zh-TW': {
        'title': '打飛機紀錄',
        'subtitle': '私密紀錄，不評判。',
        'hero-desc-lead': '記下時間，看看頻率，順便面對一下自己。',
        'hero-desc-line1': '不需要登入。',
        'hero-desc-line2': '私人紀錄保存在本機。',
        'hero-desc-line3': '只有選擇加入排行榜時，才會公開暱稱與本月次數。',
        'record-title': '新增紀錄',
        'time-label': '時間',
        'note-label': '備註（可選）',
        'note-placeholder': '只保存在本設備，可寫可不寫。',
        'join-leaderboard-label': '加入本月排行榜',
        'public-nickname-label': '公開暱稱',
        'public-nickname-placeholder': '1-24 字元',
        'optin-hint': '只公開暱稱與本月次數，不公開具體時間。',
        'confirm-btn': '記錄這一次',
        'stats-section-title': '目前統計',
        'stat-since': '距離上次',
        'stat-monthly': '本月次數',
        'stat-avg': '平均間隔',
        'stat-longest': '最長間隔',
        'recent-title': '最近 10 筆',
        'history-empty': '尚無紀錄。這裡目前很乾淨。',
        'rank-title': '本月排行榜',
        'rank-subtitle': 'Top 30',
        'loading': '載入中...',
        'share-btn': '生成戰績圖',
        'share-success': '戰績圖已生成。',
        'share-download-btn': '下載圖片',
        'share-card-caption': '截圖已生成！',
        'share-generated-by': 'Generated by 打飛機紀錄',
        'no-records': '本月尚無紀錄',
        'load-failed': '排行榜載入失敗',
        'times': '次',
        'you': '(你)',
        'unit-day': '天',
        'unit-hour': '小時',
        'unit-minute': '分鐘',
        'alert-time': '請選擇時間！',
        'alert-display-name': '加入排行榜需填寫公開暱稱（1-24 字元）',
        'alert-success': '紀錄成功！',
        'alert-leaderboard-failed': '本機已保存，但排行榜同步失敗，請稍後再試。',
        'share-failed': '分享失敗，請手動截圖',
        'sync-section-title': '跨裝置同步',
        'sync-desc-line1': '進階功能，開發中。',
        'sync-desc-line2': '不登入也能完整使用本機紀錄。',
        'sync-desc-line3': '需要跨裝置保存時，再考慮註冊。',
        'login': '登入',
        'signup': '註冊',
        'logout': '登出',
        'terms': '服務條款',
        'privacy': '隱私政策',
        'about': '關於',
        'terms-title': '服務條款',
        'privacy-title': '隱私政策',
        'about-title': '關於',
        'privacy-local': '本機保存：每次紀錄的時間與備註（若有），以及語言、主題、排行榜 opt-in 設定。',
        'privacy-firebase': 'Firebase 保存：僅在您勾選加入排行榜時，上傳公開暱稱、月份與本月累計次數。',
        'privacy-public': '公開情況：只有勾選加入排行榜時，暱稱與本月次數會顯示在公開排行榜；具體時間與備註不會上傳。',
        'privacy-delete': '刪除本機資料：清除瀏覽器本網站的 localStorage 即可移除所有本機紀錄與設定。',
        'privacy-third-party': '第三方服務：使用 Firebase（Google）提供排行榜與帳號驗證；html2canvas 用於生成分享圖。',
        'privacy-analytics': '分析工具：本網站未嵌入第三方分析或追蹤工具。',
        'privacy-sell': '資料出售：我們不出售您的個人資料。',
        'about-1-title': '1. 網站起源',
        'about-1-content': '純粹為了打飛機而生',
        'about-2-title': '2. 關於打飛機的意義',
        'about-2-p1': '目前這個時代，"打飛機" 被歸納為是一個很 "低級" 的詞彙。甚至戀愛、約炮和嫖娼都比打飛機顯得要 "高級"，經常打飛機的人還會被貼上 "Loser" 的標籤。',
        'about-2-p2': '但是打飛機其實是解決性慾成本最低的方式。',
        'about-2-p3': '你不打飛機，你就得通過戀愛、約炮、或者嫖娼去解決你的性慾，但是這三者無論是從時間、精神、或金錢層面去看，成本都遠遠高於打飛機。所以，打飛機實際上是在以最高效的方式來解決自己的性慾。',
        'about-2-p4': '"自己自足" 在任何領域都屬於 "高級" 的詞彙，但是到了 "解決性慾" 這件事情上，自給自足反而成了一個 "低級" 詞彙。所以我覺得，目前這個時代，世人對於 "打飛機" 這件事情有著嚴重的價值錯判。',
        'about-2-p5': 'AI 帶來的信息爆炸時代開始逐漸把 "效率主義" 推向主流，而 "打飛機" 這個在 "解決性慾" 領域中最有 "效率" 的解決方案可能會被大家重新正視和定位。',
        'about-2-p6': '未來會有越來越多的人選擇打飛機，整個世界會迎來一次屬於打飛機的大牛市，進入全民打飛機的時代。到時候你跟別人說你打飛機，別人會覺得你很時尚，你很高級。',
        'about-author': '-殺破狼(X:@wolfyxbt)',
        'age-gate-title': '年齡確認',
        'age-gate-line1': '本網站僅供 18 歲以上使用者。',
        'age-gate-line2': '作為私人紀錄與娛樂用途。',
        'age-gate-line3': '繼續使用即表示你已年滿 18 歲。',
        'age-gate-confirm': '我已年滿 18 歲',
        'login-title': '登入',
        'signup-title': '註冊',
        'email': '電子郵件',
        'password': '密碼',
        'confirm-password': '確認密碼',
        'email-placeholder': '請輸入您的電子郵件',
        'password-placeholder': '請輸入您的密碼',
        'password-min': '請輸入密碼（至少6個字元）',
        'password-confirm-placeholder': '請再次輸入密碼',
        'no-account': '還沒有帳號？',
        'has-account': '已有帳號？',
        'signup-link': '立即註冊',
        'login-link': '立即登入',
        'logging-in': '登入中...',
        'signing-up': '註冊中...',
        'login-success': '登入成功！',
        'signup-success': '註冊成功！歡迎使用！',
        'logout-success': '已成功登出！',
        'logout-failed': '登出失敗，請稍後再試。',
        'error-user-not-found': '找不到此帳號，請先註冊。',
        'error-wrong-password': '密碼錯誤，請重新輸入。',
        'error-invalid-email': '電子郵件格式不正確。',
        'error-login-failed': '登入失敗，請稍後再試。',
        'error-password-mismatch': '兩次輸入的密碼不一致，請重新輸入。',
        'error-password-too-short': '密碼長度至少需要6個字元。',
        'error-email-in-use': '此電子郵件已被使用，請直接登入。',
        'error-weak-password': '密碼強度不足，請使用更複雜的密碼。',
        'error-signup-failed': '註冊失敗，請稍後再試。',
        'error-generic': '操作失敗，請稍後再試。',
        'forgot-password': '忘記密碼？',
        'forgot-password-title': '忘記密碼',
        'forgot-password-description': '請輸入您的電子郵件地址，我們將發送密碼重設連結給您。',
        'forgot-password-submit': '發送重設連結',
        'sending': '發送中...',
        'reset-email-sent': '密碼重設連結已發送到您的電子郵件，請檢查您的收件箱。',
        'reset-email-failed': '發送失敗，請稍後再試。',
        'error-too-many-requests': '請求過於頻繁，請稍後再試。',
        'back-to-login': '返回登入',
        'update-available': '有新版本可用，是否立即更新？',
        'update-now': '立即更新',
        'update-later': '稍後',
        'ok': '確定',
        'time-just-now': '剛剛',
        'terms-welcome': '歡迎使用本網站。使用本網站即表示您同意遵守以下服務條款：',
        'terms-1-title': '1. 服務說明',
        'terms-1-content': '本網站提供個人追蹤記錄服務，僅供個人使用及娛樂目的。',
        'terms-2-title': '2. 使用者責任',
        'terms-2-content': '使用者應確保所提供資訊的真實性，並對其使用本網站的行為負責。請適度操作，注意身體健康。',
        'terms-3-title': '3. 隱私保護',
        'terms-3-content': '我們重視您的隱私，相關隱私政策請參閱「隱私政策」頁面。',
        'terms-4-title': '4. 免責聲明',
        'terms-4-content': '本網站僅用於個人追蹤，只有娛樂價值，不提供其他額外服務。網站不對使用者的任何行為或後果負責。',
        'terms-5-title': '5. 服務變更',
        'terms-5-content': '我們保留隨時修改或終止服務的權利，恕不另行通知。',
        'terms-6-title': '6. 條款修改',
        'terms-6-content': '我們保留隨時修改本服務條款的權利，修改後的條款將在網站上公布。'
    },
    'en': {
        'title': 'DIY Daily Record',
        'subtitle': 'Private tracking. No judgment.',
        'hero-desc-lead': 'Log the time, check the pattern, and face yourself a little.',
        'hero-desc-line1': 'No account required.',
        'hero-desc-line2': 'Private records stay on this device.',
        'hero-desc-line3': 'Only when you choose to join the leaderboard will your nickname and monthly count be public.',
        'record-title': 'New Record',
        'time-label': 'Time',
        'note-label': 'Note (optional)',
        'note-placeholder': 'Saved only on this device. Write it or skip it.',
        'join-leaderboard-label': "Join this month's leaderboard",
        'public-nickname-label': 'Public nickname',
        'public-nickname-placeholder': '1-24 characters',
        'optin-hint': 'Only your nickname and monthly count are public. Exact times are not shown.',
        'confirm-btn': 'Log this one',
        'stats-section-title': 'Current Stats',
        'stat-since': 'Time since last',
        'stat-monthly': 'This month',
        'stat-avg': 'Average interval',
        'stat-longest': 'Longest gap',
        'recent-title': 'Latest 10 records',
        'history-empty': 'No records yet. This place is still clean.',
        'rank-title': 'Monthly Leaderboard',
        'rank-subtitle': 'Top 30',
        'loading': 'Loading...',
        'share-btn': 'Generate Battle Card',
        'share-success': 'Battle card generated.',
        'share-download-btn': 'Download image',
        'share-card-caption': 'Screenshot ready!',
        'share-generated-by': 'Generated by DIY Daily Record',
        'no-records': 'No entries this month',
        'load-failed': 'Failed to load leaderboard',
        'times': 'times',
        'you': '(you)',
        'unit-day': 'd',
        'unit-hour': 'h',
        'unit-minute': 'm',
        'alert-time': 'Please select a time!',
        'alert-display-name': 'Public nickname required (1-24 chars) to join leaderboard.',
        'alert-success': 'Recorded!',
        'alert-leaderboard-failed': 'Saved locally, but leaderboard sync failed. Try again later.',
        'share-failed': 'Share failed, please screenshot manually',
        'sync-section-title': 'Cross-device sync',
        'sync-desc-line1': 'Advanced feature, in development.',
        'sync-desc-line2': 'You can fully use local records without logging in.',
        'sync-desc-line3': 'Register only if you need cross-device saving.',
        'login': 'Log in',
        'signup': 'Sign up',
        'logout': 'Sign Out',
        'terms': 'Terms',
        'privacy': 'Privacy',
        'about': 'About',
        'terms-title': 'Terms of Service',
        'privacy-title': 'Privacy Policy',
        'about-title': 'About',
        'privacy-local': 'Stored locally: record times, optional notes, language, theme, and leaderboard opt-in settings.',
        'privacy-firebase': 'Firebase: only when you opt in — public nickname, month, and monthly count.',
        'privacy-public': 'Public data: only nickname and monthly count on the leaderboard if opted in. Times and notes are never uploaded.',
        'privacy-delete': 'Delete local data: clear this site\'s localStorage in your browser.',
        'privacy-third-party': 'Third parties: Firebase (Google) for leaderboard and auth; html2canvas for share images.',
        'privacy-analytics': 'Analytics: no third-party analytics or tracking on this site.',
        'privacy-sell': 'Data sales: we do not sell your personal data.',
        'about-1-title': '1. Origin',
        'about-1-content': 'Built for personal tracking.',
        'about-2-title': '2. On efficiency',
        'about-2-p1': 'Self-care tracking should be private and judgment-free.',
        'about-2-p2': 'This tool keeps your data local by default.',
        'about-2-p3': 'You choose what, if anything, goes public.',
        'about-2-p4': 'No social pressure. Just your own rhythm.',
        'about-2-p5': 'Track quietly. Share lightly if you want.',
        'about-2-p6': 'Your data, your rules.',
        'about-author': '',
        'age-gate-title': 'Age Confirmation',
        'age-gate-line1': 'This site is for users 18+ only.',
        'age-gate-line2': 'For private logging and entertainment purposes.',
        'age-gate-line3': 'By continuing, you confirm that you are 18+.',
        'age-gate-confirm': 'I am 18+',
        'login-title': 'Sign In',
        'signup-title': 'Sign Up',
        'email': 'Email',
        'password': 'Password',
        'confirm-password': 'Confirm Password',
        'email-placeholder': 'Enter your email',
        'password-placeholder': 'Enter your password',
        'password-min': 'Enter password (at least 6 characters)',
        'password-confirm-placeholder': 'Enter password again',
        'no-account': "Don't have an account?",
        'has-account': 'Already have an account?',
        'signup-link': 'Sign up now',
        'login-link': 'Sign in now',
        'logging-in': 'Signing in...',
        'signing-up': 'Signing up...',
        'login-success': 'Sign in successful!',
        'signup-success': 'Sign up successful! Welcome!',
        'logout-success': 'Signed out successfully!',
        'logout-failed': 'Sign out failed. Please try again.',
        'error-user-not-found': 'Account not found, please sign up first.',
        'error-wrong-password': 'Wrong password, please try again.',
        'error-invalid-email': 'Invalid email format.',
        'error-login-failed': 'Sign in failed. Please try again.',
        'error-password-mismatch': 'Passwords do not match.',
        'error-password-too-short': 'Password must be at least 6 characters.',
        'error-email-in-use': 'This email is already in use.',
        'error-weak-password': 'Password is too weak.',
        'error-signup-failed': 'Sign up failed. Please try again.',
        'error-generic': 'Something went wrong. Please try again.',
        'forgot-password': 'Forgot password?',
        'forgot-password-title': 'Forgot Password',
        'forgot-password-description': 'Enter your email and we will send a reset link.',
        'forgot-password-submit': 'Send Reset Link',
        'sending': 'Sending...',
        'reset-email-sent': 'Reset link sent. Check your inbox.',
        'reset-email-failed': 'Failed to send. Please try again.',
        'error-too-many-requests': 'Too many requests. Please try again later.',
        'back-to-login': 'Back to Sign In',
        'update-available': 'A new version is available. Update now?',
        'update-now': 'Update Now',
        'update-later': 'Later',
        'ok': 'OK',
        'time-just-now': 'Just now',
        'terms-welcome': 'Welcome. By using this site you agree to these terms:',
        'terms-1-title': '1. Service',
        'terms-1-content': 'Personal tracking for private use and entertainment.',
        'terms-2-title': '2. Responsibility',
        'terms-2-content': 'Use in moderation and take care of your health.',
        'terms-3-title': '3. Privacy',
        'terms-3-content': 'See our Privacy Policy.',
        'terms-4-title': '4. Disclaimer',
        'terms-4-content': 'For personal tracking only. No liability for user actions.',
        'terms-5-title': '5. Changes',
        'terms-5-content': 'We may modify or terminate the service at any time.',
        'terms-6-title': '6. Terms updates',
        'terms-6-content': 'Updated terms will be posted on this site.'
    },
    'zh-CN': {
        'title': '打飞机记录',
        'subtitle': '私密记录，不评判。',
        'hero-desc-lead': '记下时间，看看频率，顺便面对一下自己。',
        'hero-desc-line1': '不需要登录。',
        'hero-desc-line2': '私人记录保存在本机。',
        'hero-desc-line3': '只有选择加入排行榜时，才会公开昵称与本月次数。',
        'record-title': '新增记录',
        'time-label': '时间',
        'note-label': '备注（可选）',
        'note-placeholder': '只保存在本设备，可写可不写。',
        'join-leaderboard-label': '加入本月排行榜',
        'public-nickname-label': '公开昵称',
        'public-nickname-placeholder': '1-24 字符',
        'optin-hint': '只公开昵称与本月次数，不公开具体时间。',
        'confirm-btn': '记录这一次',
        'stats-section-title': '目前统计',
        'stat-since': '距离上次',
        'stat-monthly': '本月次数',
        'stat-avg': '平均间隔',
        'stat-longest': '最长间隔',
        'recent-title': '最近 10 笔',
        'history-empty': '暂无记录。这里目前很干净。',
        'rank-title': '本月排行榜',
        'rank-subtitle': 'Top 30',
        'loading': '加载中...',
        'share-btn': '生成战绩图',
        'share-success': '战绩图已生成。',
        'share-download-btn': '下载图片',
        'share-card-caption': '截图已生成！',
        'share-generated-by': 'Generated by 打飞机记录',
        'no-records': '本月尚无记录',
        'load-failed': '排行榜加载失败',
        'times': '次',
        'you': '(你)',
        'unit-day': '天',
        'unit-hour': '小时',
        'unit-minute': '分钟',
        'alert-time': '请选择时间！',
        'alert-display-name': '加入排行榜需填写公开昵称（1-24 字符）',
        'alert-success': '记录成功！',
        'alert-leaderboard-failed': '本机已保存，但排行榜同步失败，请稍后再试。',
        'share-failed': '分享失败，请手动截图',
        'sync-section-title': '跨设备同步',
        'sync-desc-line1': '进阶功能，开发中。',
        'sync-desc-line2': '不登录也能完整使用本机记录。',
        'sync-desc-line3': '需要跨设备保存时，再考虑注册。',
        'login': '登录',
        'signup': '注册',
        'logout': '登出',
        'terms': '服务条款',
        'privacy': '隐私政策',
        'about': '关于',
        'terms-title': '服务条款',
        'privacy-title': '隐私政策',
        'about-title': '关于',
        'privacy-local': '本机保存：每次记录的时间与备注（若有），以及语言、主题、排行榜 opt-in 设定。',
        'privacy-firebase': 'Firebase 保存：仅在您勾选加入排行榜时，上传公开昵称、月份与本月累计次数。',
        'privacy-public': '公开情况：只有勾选加入排行榜时，昵称与本月次数会显示在公开排行榜；具体时间与备注不会上传。',
        'privacy-delete': '删除本机资料：清除浏览器本网站的 localStorage 即可移除所有本机记录与设定。',
        'privacy-third-party': '第三方服务：使用 Firebase（Google）提供排行榜与账号验证；html2canvas 用于生成分享图。',
        'privacy-analytics': '分析工具：本网站未嵌入第三方分析或追踪工具。',
        'privacy-sell': '资料出售：我们不出售您的个人资料。',
        'about-1-title': '1. 网站起源',
        'about-1-content': '纯粹为了打飞机而生',
        'about-2-title': '2. 关于打飞机的意义',
        'about-2-p1': '目前这个时代，"打飞机" 被归纳为是一个很 "低级" 的词汇。甚至恋爱、约炮和嫖娼都比打飞机显得要 "高级"，经常打飞机的人还会被贴上 "Loser" 的标签。',
        'about-2-p2': '但是打飞机其实是解决性欲成本最低的方式。',
        'about-2-p3': '你不打飞机，你就得通过恋爱、约炮、或者嫖娼去解决你的性欲，但是这三者无论从时间、精神、或金钱层面去看，成本都远远高于打飞机。所以，打飞机实际上是在以最高效的方式来解决自己的性欲。',
        'about-2-p4': '"自己自足" 在任何领域都属于 "高级" 的词汇，但是到了 "解决性欲" 这件事情上，自给自足反而成了一个 "低级" 词汇。所以我觉得，目前这个时代，世人对于 "打飞机" 这件事情有着严重的价值错判。',
        'about-2-p5': 'AI 带来的信息爆炸时代开始逐渐把 "效率主义" 推向主流，而 "打飞机" 这个在 "解决性欲" 领域中最有 "效率" 的解决方案可能会被大家重新正视和定位。',
        'about-2-p6': '未来会有越来越多的人选择打飞机，整个世界会迎来一次属于打飞机的大牛市，进入全民打飞机的时代。到时候你跟别人说你打飞机，别人会觉得你很时尚，你很高級。',
        'about-author': '-殺破狼(X:@wolfyxbt)',
        'age-gate-title': '年龄确认',
        'age-gate-line1': '本网站仅供 18 岁以上用户。',
        'age-gate-line2': '作为私人记录与娱乐用途。',
        'age-gate-line3': '继续使用即表示你已年满 18 岁。',
        'age-gate-confirm': '我已年满 18 岁',
        'login-title': '登录',
        'signup-title': '注册',
        'email': '电子邮件',
        'password': '密码',
        'confirm-password': '确认密码',
        'email-placeholder': '请输入您的电子邮件',
        'password-placeholder': '请输入您的密码',
        'password-min': '请输入密码（至少6个字符）',
        'password-confirm-placeholder': '请再次输入密码',
        'no-account': '还没有账号？',
        'has-account': '已有账号？',
        'signup-link': '立即注册',
        'login-link': '立即登录',
        'logging-in': '登录中...',
        'signing-up': '注册中...',
        'login-success': '登录成功！',
        'signup-success': '注册成功！欢迎使用！',
        'logout-success': '已成功登出！',
        'logout-failed': '登出失败，请稍后再试。',
        'error-user-not-found': '找不到此账号，请先注册。',
        'error-wrong-password': '密码错误，请重新输入。',
        'error-invalid-email': '电子邮件格式不正确。',
        'error-login-failed': '登录失败，请稍后再试。',
        'error-password-mismatch': '两次输入的密码不一致，请重新输入。',
        'error-password-too-short': '密码长度至少需要6个字符。',
        'error-email-in-use': '此电子邮件已被使用，请直接登录。',
        'error-weak-password': '密码强度不足，请使用更复杂的密码。',
        'error-signup-failed': '注册失败，请稍后再试。',
        'error-generic': '操作失败，请稍后再试。',
        'forgot-password': '忘记密码？',
        'forgot-password-title': '忘记密码',
        'forgot-password-description': '请输入您的电子邮件地址，我们将发送密码重设链接给您。',
        'forgot-password-submit': '发送重设链接',
        'sending': '发送中...',
        'reset-email-sent': '密码重设链接已发送到您的电子邮件，请检查您的收件箱。',
        'reset-email-failed': '发送失败，请稍后再试。',
        'error-too-many-requests': '请求过于频繁，请稍后再试。',
        'back-to-login': '返回登录',
        'update-available': '有新版本可用，是否立即更新？',
        'update-now': '立即更新',
        'update-later': '稍后',
        'ok': '确定',
        'time-just-now': '刚刚',
        'terms-welcome': '欢迎使用本网站。使用本网站即表示您同意遵守以下服务条款：',
        'terms-1-title': '1. 服务说明',
        'terms-1-content': '本网站提供个人追踪记录服务，仅供个人使用及娱乐目的。',
        'terms-2-title': '2. 使用者责任',
        'terms-2-content': '使用者应确保所提供信息的真实性，并对其使用本网站的行为负责。请适度操作，注意身体健康。',
        'terms-3-title': '3. 隐私保护',
        'terms-3-content': '我们重视您的隐私，相关隐私政策请参阅「隐私政策」页面。',
        'terms-4-title': '4. 免责声明',
        'terms-4-content': '本网站仅用于个人追踪，只有娱乐价值，不提供其他额外服务。网站不对使用者的任何行为或后果负责。',
        'terms-5-title': '5. 服务变更',
        'terms-5-content': '我们保留随时修改或终止服务的权利，恕不另行通知。',
        'terms-6-title': '6. 条款修改',
        'terms-6-content': '我们保留随时修改本服务条款的权利，修改后的条款将在网站上公布。'
    }
};

// 當前語言（默認為繁體中文）
let currentLanguage = 'zh-TW';

// 獲取當前語言的翻譯文本
export function getTexts(lang = null) {
    const langToUse = lang || currentLanguage;
    return translations[langToUse] || translations['zh-TW'];
}

// 設置當前語言
export function setLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageTexts();
        return true;
    }
    return false;
}

// 獲取當前語言
export function getCurrentLanguage() {
    return currentLanguage;
}

// 更新頁面文字
function updatePageTexts() {
    const texts = getTexts();
    document.documentElement.setAttribute('lang', currentLanguage);

    const setText = (id, key) => {
        const el = document.getElementById(id);
        if (el && texts[key]) el.textContent = texts[key];
    };

    const titleEl = document.querySelector('title');
    if (titleEl) titleEl.textContent = `${texts['title']} - ${texts['subtitle']}`;

    setText('record-section-title', 'record-title');
    setText('time-label', 'time-label');
    setText('note-label', 'note-label');
    setText('join-leaderboard-label', 'join-leaderboard-label');
    setText('public-nickname-label', 'public-nickname-label');
    setText('optin-hint', 'optin-hint');
    setText('stats-section-title', 'stats-section-title');
    setText('stat-since-label', 'stat-since');
    setText('stat-monthly-label', 'stat-monthly');
    setText('stat-avg-label', 'stat-avg');
    setText('recent-title', 'recent-title');
    setText('history-empty', 'history-empty');
    setText('rank-section-title', 'rank-title');
    setText('rank-subtitle', 'rank-subtitle');
    setText('sync-section-title', 'sync-section-title');
    setText('age-gate-title', 'age-gate-title');
    setText('age-gate-line1', 'age-gate-line1');
    setText('age-gate-line2', 'age-gate-line2');
    setText('age-gate-line3', 'age-gate-line3');
    setText('age-gate-confirm', 'age-gate-confirm');
    setText('hero-desc-lead', 'hero-desc-lead');
    setText('hero-desc-line1', 'hero-desc-line1');
    setText('hero-desc-line2', 'hero-desc-line2');
    setText('hero-desc-line3', 'hero-desc-line3');
    setText('sync-desc-line1', 'sync-desc-line1');
    setText('sync-desc-line2', 'sync-desc-line2');
    setText('sync-desc-line3', 'sync-desc-line3');

    const navTitle = document.querySelector('.nav-left a');
    if (navTitle) navTitle.textContent = texts['title'];

    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = texts['title'];

    const h2 = document.querySelector('.hero-subtitle');
    if (h2) h2.textContent = texts['subtitle'];

    const shareBtn = document.getElementById('share-generate-btn') || document.querySelector('.btn-share');
    if (shareBtn) shareBtn.textContent = texts['share-btn'];

    const downloadBtn = document.getElementById('share-download-btn');
    if (downloadBtn && downloadBtn.style.display !== 'none') {
        downloadBtn.textContent = texts['share-download-btn'] || '下載圖片';
    }

    const shareCardCaption = document.getElementById('share-card-caption');
    if (shareCardCaption) shareCardCaption.textContent = texts['share-card-caption'] || '';

    const noteInput = document.getElementById('record-note');
    if (noteInput) noteInput.placeholder = texts['note-placeholder'];

    const publicNickname = document.getElementById('public-nickname');
    if (publicNickname) publicNickname.placeholder = texts['public-nickname-placeholder'];

    const timeInput = document.getElementById('record-time');
    if (timeInput) timeInput.setAttribute('lang', currentLanguage);

    const confirmBtn = document.querySelector('.btn[onclick="addRecord()"]');
    if (confirmBtn) confirmBtn.textContent = texts['confirm-btn'];

    const shareMsg = document.getElementById('share-msg');
    if (shareMsg && shareMsg.style.display !== 'none' && texts['share-success']) {
        shareMsg.innerText = texts['share-success'];
    }

    const footerLinks = document.getElementById('footer-links');
    if (footerLinks) {
        footerLinks.innerHTML = `
            <a href="#" onclick="openTerms(); return false;" class="footer-link">${texts['terms']}</a>
            <span style="color: var(--text-muted);"> / </span>
            <a href="#" onclick="openPrivacy(); return false;" class="footer-link">${texts['privacy']}</a>
            <span style="color: var(--text-muted);"> / </span>
            <a href="#" onclick="openAbout(); return false;" class="footer-link">${texts['about']}</a>
        `;
    }

    const themeItems = document.querySelectorAll('#theme-dropdown .dropdown-item span');
    if (themeItems.length >= 3) {
        if (currentLanguage === 'en') {
            themeItems[0].textContent = 'Light Mode';
            themeItems[1].textContent = 'Dark Mode';
            themeItems[2].textContent = 'System';
        } else if (currentLanguage === 'zh-CN') {
            themeItems[0].textContent = '浅色模式';
            themeItems[1].textContent = '深色模式';
            themeItems[2].textContent = '系统设置';
        } else {
            themeItems[0].textContent = '淺色模式';
            themeItems[1].textContent = '深色模式';
            themeItems[2].textContent = '系統設定';
        }
    }

    // 模態框
    const loginTitle = document.querySelector('#loginModal h3');
    if (loginTitle) loginTitle.textContent = texts['login-title'];
    const signupTitle = document.querySelector('#signupModal h3');
    if (signupTitle) signupTitle.textContent = texts['signup-title'];

    const termsModalBody = document.querySelector('#termsModal .modal-body');
    if (termsModalBody) {
        termsModalBody.innerHTML = `
            <p>${texts['terms-welcome']}</p>
            <p><strong>${texts['terms-1-title']}</strong></p><p>${texts['terms-1-content']}</p>
            <p><strong>${texts['terms-2-title']}</strong></p><p>${texts['terms-2-content']}</p>
            <p><strong>${texts['terms-3-title']}</strong></p><p>${texts['terms-3-content']}</p>
            <p><strong>${texts['terms-4-title']}</strong></p><p>${texts['terms-4-content']}</p>
            <p><strong>${texts['terms-5-title']}</strong></p><p>${texts['terms-5-content']}</p>
            <p><strong>${texts['terms-6-title']}</strong></p><p>${texts['terms-6-content']}</p>
        `;
    }
    const termsTitle = document.querySelector('#termsModal h3');
    if (termsTitle) termsTitle.textContent = texts['terms-title'];

    const privacyModalBody = document.querySelector('#privacyModal .modal-body');
    if (privacyModalBody) privacyModalBody.innerHTML = renderPrivacyBody(texts);
    const privacyTitle = document.querySelector('#privacyModal h3');
    if (privacyTitle) privacyTitle.textContent = texts['privacy-title'];

    const aboutModalBody = document.querySelector('#aboutModal .modal-body');
    if (aboutModalBody) aboutModalBody.innerHTML = renderAboutBody(texts);
    const aboutTitle = document.querySelector('#aboutModal h3');
    if (aboutTitle) aboutTitle.textContent = texts['about-title'];

    if (typeof window.renderLocalStats === 'function') window.renderLocalStats();
    if (typeof window.updateShareCaptureArea === 'function') window.updateShareCaptureArea();
    if (typeof window.loadLeaderboard === 'function') window.loadLeaderboard();
    if (typeof window.updateSyncAuthUI === 'function') window.updateSyncAuthUI();
}

// 初始化語言
export function initLanguage() {
    const savedLang = localStorage.getItem('language') || 'zh-TW';
    setLanguage(savedLang);
}

// 將 texts 暴露為當前語言的翻譯（向後兼容）
export const texts = translations['zh-TW'];

// 將語言相關變數暴露到全局，供模塊腳本使用
window.texts = texts;
window.getTexts = getTexts;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.updatePageTexts = updatePageTexts;
