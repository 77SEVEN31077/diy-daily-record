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
    if (typeof window.updateAgeGateLangButtons === 'function') {
        window.updateAgeGateLangButtons(window.getCurrentLanguage ? window.getCurrentLanguage() : 'zh-TW');
    }
    const modal = document.getElementById('ageGateModal');
    if (modal) modal.style.display = 'block';
}

window.confirmAgeGate = function() {
    localStorage.setItem('age_confirmed', 'true');
    const modal = document.getElementById('ageGateModal');
    if (modal) modal.style.display = 'none';
};

// 分享與截圖功能（Canvas 繪製戰績圖）
import { renderBattleCard, getResolvedTheme } from './shareCard.js';
import { computeStats, formatDuration } from './stats.js';
import { renderFooterLinksHTML } from './legalContent.js';

let pendingShareImageDataUrl = null;

export async function shareStats() {
    const shareMsg = document.getElementById('share-msg');
    const shareBtn = document.getElementById('share-generate-btn') || document.querySelector('.btn-share');
    const downloadBtn = document.getElementById('share-download-btn');
    const texts = window.getTexts ? window.getTexts() : translations['zh-TW'];

    if (shareBtn) {
        shareBtn.disabled = true;
        shareBtn.innerText = texts['loading'] || '載入中...';
    }
    if (shareMsg) shareMsg.style.display = 'none';
    if (downloadBtn) downloadBtn.style.display = 'none';
    pendingShareImageDataUrl = null;

    try {
        const { monthlyCount, sinceLast, longestInterval } = computeStats();
        const sinceLastStr = sinceLast != null ? formatDuration(sinceLast, texts) : '—';
        const longestStr = longestInterval != null ? formatDuration(longestInterval, texts) : '—';

        const canvas = renderBattleCard({
            texts,
            monthlyCount,
            sinceLast: sinceLastStr,
            longestGap: longestStr,
            theme: getResolvedTheme(),
        });

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

// 點擊模態框外部關閉
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

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
};

// 多語言翻譯對象
export const translations = {
    'zh-TW': {
        'title': '打飛機紀錄',
        'subtitle': '私密紀錄，不評判。',
        'hero-desc-lead': '記下時間，看看頻率，順便面對一下自己。',
        'tip-title': '小提示',
        'tip-line1': '不需要登入。',
        'tip-line2': '私人紀錄保存在本機。',
        'tip-line3': '只有選擇加入排行榜時，才會公開暱稱與本月次數。',
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
        'share-card-title': '我的戰績表',
        'share-card-this-month': '本月次數',
        'share-card-time-since-last': '距離上次',
        'share-card-longest-gap': '最長間隔',
        'share-card-footer': 'Generated by 打飛機紀錄',
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
        'footer-support': '支持本站',
        'about-support-title': '支持這個小作品',
        'about-support-text': '如果你覺得這個奇怪的小工具有點用，或至少有點好笑，可以支持我繼續做更多獨立網頁作品。',
        'about-support-button': '支持小作品',
        'terms-support-boundary': '支持本站屬於自願性支持，不會解鎖任何額外功能，也不影響排行榜或紀錄功能。',
        'privacy-external-support': '若你點擊外部支持連結，付款與支持流程將由第三方平台 Ko-fi / PayPal 處理，本網站不會儲存你的付款資料。',
        'back-home': '返回首頁',
        'terms-title': '服務條款',
        'privacy-title': '隱私政策',
        'about-title': '關於',
        'about-p1': '這是一個很不必要、但又莫名其妙成立的私人紀錄工具。',
        'about-p2': '它不是健康建議，也不是人生指南。',
        'about-p3': '它只是把一件通常不會被記錄的事，做成一個可以記錄、統計、截圖的小工具。',
        'about-p4': '這個網站的重點不是鼓勵你增加頻率，也不是評判你。',
        'about-p5': '它只做三件事：',
        'about-li1': '讓你記下時間。',
        'about-li2': '讓你看看自己的頻率。',
        'about-li3': '如果你願意，讓你用公開暱稱加入本月排行榜。',
        'about-p6': '私人紀錄預設保存在本設備。',
        'about-p7': '只有選擇加入排行榜時，才會公開暱稱與本月次數。',
        'about-p8': 'Just for fun.',
        'about-p9': '但隱私邊界要認真。',
        'terms-intro': '歡迎使用本網站。使用本網站即表示你同意以下條款。',
        'terms-1-title': '1. 服務說明',
        'terms-1-content': '本網站提供私人紀錄與娛樂用途的記錄工具。你可以記下時間、查看本機統計，並可選擇是否加入本月排行榜。',
        'terms-2-title': '2. 年齡限制',
        'terms-2-content': '本網站僅供 18 歲以上使用者使用。繼續使用本網站，即表示你確認自己已年滿 18 歲。',
        'terms-3-title': '3. 使用者責任',
        'terms-3-content': '你應自行負責使用本網站的行為與輸入內容。請勿濫用排行榜、惡意灌水、攻擊網站、輸入違法內容，或以任何方式干擾服務運作。',
        'terms-4-title': '4. 隱私與公開資料',
        'terms-4-content': '私人紀錄預設保存在本設備。只有在你選擇加入排行榜時，公開暱稱與本月次數才會顯示於排行榜。更多資料處理方式請參閱隱私政策。',
        'terms-5-title': '5. 非專業建議',
        'terms-5-content': '本網站僅供私人紀錄與娛樂用途，不提供醫療、心理、性健康或其他專業建議。如你對身體或心理狀態有疑慮，請尋求專業協助。',
        'terms-6-title': '6. 服務變更與終止',
        'terms-6-content': '我們可能隨時修改、暫停或終止本網站的部分或全部功能，恕不另行通知。',
        'terms-7-title': '7. 條款修改',
        'terms-7-content': '我們可能不定期更新本服務條款。更新後的內容會公布於本頁面。',
        'privacy-intro': '本網站的原則是：私人紀錄預設留在你的設備上。只有你主動選擇加入排行榜時，才會公開必要資料。',
        'privacy-1-title': '1. 本機保存',
        'privacy-1-content': '本網站會在你的瀏覽器 localStorage 中保存紀錄時間、備註（若有）、語言設定、主題設定、排行榜選項，以及年齡確認狀態。',
        'privacy-2-title': '2. Firebase 保存',
        'privacy-2-content': '只有當你選擇加入本月排行榜時，本網站才會向 Firebase 保存公開暱稱、月份、本月累計次數與更新時間。如果你使用登入或註冊功能，Firebase Authentication 可能會處理你的電子郵件與登入驗證資料。',
        'privacy-3-title': '3. 公開資料',
        'privacy-3-content': '只有你選擇加入排行榜時，公開暱稱與本月次數會顯示在公開排行榜上。具體紀錄時間、備註與完整歷史不會上傳，也不會公開。',
        'privacy-4-title': '4. 刪除本機資料',
        'privacy-4-content': '你可以透過瀏覽器清除本網站的 localStorage，移除保存在本機的紀錄與設定。請注意，清除本機資料不會自動刪除已公開的排行榜資料。',
        'privacy-5-title': '5. 第三方服務',
        'privacy-5-content': '本網站使用 Firebase 提供排行榜與帳號驗證功能，並使用 html2canvas 或 canvas 相關工具生成分享圖。',
        'privacy-6-title': '6. 分析與追蹤',
        'privacy-6-content': '本網站目前未嵌入第三方分析工具或廣告追蹤工具。',
        'privacy-7-title': '7. 資料出售',
        'privacy-7-content': '我們不出售你的個人資料。',
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
    },
    'en': {
        'title': 'DIY Daily Record',
        'subtitle': 'Private tracking. No judgment.',
        'hero-desc-lead': 'Log the time, check the pattern, and face yourself a little.',
        'tip-title': 'Quick Note',
        'tip-line1': 'No account required.',
        'tip-line2': 'Private records stay on this device.',
        'tip-line3': 'Only when you choose to join the leaderboard will your nickname and monthly count be public.',
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
        'share-card-title': 'My Battle Card',
        'share-card-this-month': 'This month',
        'share-card-time-since-last': 'Time since last',
        'share-card-longest-gap': 'Longest gap',
        'share-card-footer': 'Generated by DIY Daily Record',
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
        'footer-support': 'Support',
        'about-support-title': 'Support this small project',
        'about-support-text': 'If this weird little tool was useful, or at least strangely memorable, you can support more independent web experiments here.',
        'about-support-button': 'Support small projects',
        'terms-support-boundary': 'Supporting this site is voluntary. It does not unlock features, affect records, or influence the leaderboard.',
        'privacy-external-support': 'If you click an external support link, the payment and support process is handled by third-party platforms such as Ko-fi / PayPal. This website does not store your payment information.',
        'back-home': 'Back to home',
        'terms-title': 'Terms of Service',
        'privacy-title': 'Privacy Policy',
        'about-title': 'About',
        'about-p1': 'This is an unnecessary, strangely reasonable private logging tool.',
        'about-p2': 'It is not health advice. It is not a life guide.',
        'about-p3': 'It simply turns something people usually do not record into something you can log, measure, and optionally share as a small battle card.',
        'about-p4': 'The point is not to encourage frequency or judge anyone.',
        'about-p5': 'This site does three things:',
        'about-li1': 'Lets you log the time.',
        'about-li2': 'Lets you check your own pattern.',
        'about-li3': 'Lets you join the monthly leaderboard with a public nickname if you choose.',
        'about-p6': 'Private records stay on this device by default.',
        'about-p7': 'Only when you choose to join the leaderboard will your nickname and monthly count be public.',
        'about-p8': 'Just for fun.',
        'about-p9': 'But the privacy boundary is serious.',
        'terms-intro': 'Welcome. By using this site, you agree to the following terms.',
        'terms-1-title': '1. Service description',
        'terms-1-content': 'This site provides a private logging tool for personal and entertainment purposes. You can log the time, view local statistics, and choose whether to join the monthly leaderboard.',
        'terms-2-title': '2. Age restriction',
        'terms-2-content': 'This site is intended for users 18+ only. By continuing to use this site, you confirm that you are at least 18 years old.',
        'terms-3-title': '3. User responsibility',
        'terms-3-content': 'You are responsible for your use of this site and any content you enter. Do not abuse the leaderboard, spam the service, attack the site, submit illegal content, or interfere with the operation of the service.',
        'terms-4-title': '4. Privacy and public data',
        'terms-4-content': 'Private records stay on this device by default. Only when you choose to join the leaderboard will your public nickname and monthly count appear on the leaderboard. See the Privacy Policy for more details.',
        'terms-5-title': '5. No professional advice',
        'terms-5-content': 'This site is for private logging and entertainment purposes only. It does not provide medical, psychological, sexual health, or other professional advice. If you have health concerns, seek professional help.',
        'terms-6-title': '6. Service changes and termination',
        'terms-6-content': 'We may modify, suspend, or terminate part or all of the service at any time without prior notice.',
        'terms-7-title': '7. Terms updates',
        'terms-7-content': 'We may update these terms from time to time. Updated terms will be posted on this page.',
        'privacy-intro': 'The principle of this site is simple: private records stay on your device by default. Only when you choose to join the leaderboard will the necessary public data be shown.',
        'privacy-1-title': '1. Local storage',
        'privacy-1-content': 'This site stores record times, optional notes, language settings, theme settings, leaderboard preferences, and age confirmation status in your browser localStorage.',
        'privacy-2-title': '2. Firebase storage',
        'privacy-2-content': 'Only when you choose to join the monthly leaderboard will this site save your public nickname, month, monthly count, and update time to Firebase. If you use the login or sign-up feature, Firebase Authentication may process your email address and authentication data.',
        'privacy-3-title': '3. Public data',
        'privacy-3-content': 'Only when you join the leaderboard will your public nickname and monthly count appear on the public leaderboard. Exact record times, notes, and full history are not uploaded and are not public.',
        'privacy-4-title': '4. Deleting local data',
        'privacy-4-content': 'You can clear this site\'s localStorage in your browser to remove records and settings saved on this device. Please note that clearing local data does not automatically remove leaderboard data that has already been made public.',
        'privacy-5-title': '5. Third-party services',
        'privacy-5-content': 'This site uses Firebase for leaderboard and account authentication features, and uses html2canvas or canvas-related tools to generate share images.',
        'privacy-6-title': '6. Analytics and tracking',
        'privacy-6-content': 'This site currently does not include third-party analytics tools or advertising trackers.',
        'privacy-7-title': '7. Data sales',
        'privacy-7-content': 'We do not sell your personal data.',
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
    },
    'zh-CN': {
        'title': '打飞机记录',
        'subtitle': '私密记录，不评判。',
        'hero-desc-lead': '记下时间，看看频率，顺便面对一下自己。',
        'tip-title': '小提示',
        'tip-line1': '不需要登录。',
        'tip-line2': '私人记录保存在本机。',
        'tip-line3': '只有选择加入排行榜时，才会公开昵称与本月次数。',
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
        'share-card-title': '我的战绩表',
        'share-card-this-month': '本月次数',
        'share-card-time-since-last': '距离上次',
        'share-card-longest-gap': '最长间隔',
        'share-card-footer': 'Generated by 打飞机记录',
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
        'footer-support': '支持本站',
        'about-support-title': '支持这个小作品',
        'about-support-text': '如果你觉得这个奇怪的小工具有点用，或至少有点好笑，可以支持我继续做更多独立网页作品。',
        'about-support-button': '支持小作品',
        'terms-support-boundary': '支持本站属于自愿性支持，不会解锁任何额外功能，也不影响排行榜或记录功能。',
        'privacy-external-support': '若你点击外部支持链接，付款与支持流程将由第三方平台 Ko-fi / PayPal 处理，本网站不会储存你的付款资料。',
        'back-home': '返回首页',
        'terms-title': '服务条款',
        'privacy-title': '隐私政策',
        'about-title': '关于',
        'about-p1': '这是一个很不必要、但又莫名其妙成立的私人记录工具。',
        'about-p2': '它不是健康建议，也不是人生指南。',
        'about-p3': '它只是把一件通常不会被记录的事，做成一个可以记录、统计、截图的小工具。',
        'about-p4': '这个网站的重点不是鼓励你增加频率，也不是评判你。',
        'about-p5': '它只做三件事：',
        'about-li1': '让你记下时间。',
        'about-li2': '让你看看自己的频率。',
        'about-li3': '如果你愿意，让你用公开昵称加入本月排行榜。',
        'about-p6': '私人记录默认保存在本设备。',
        'about-p7': '只有选择加入排行榜时，才会公开昵称与本月次数。',
        'about-p8': 'Just for fun.',
        'about-p9': '但隐私边界要认真。',
        'terms-intro': '欢迎使用本网站。使用本网站即表示你同意以下条款。',
        'terms-1-title': '1. 服务说明',
        'terms-1-content': '本网站提供私人记录与娱乐用途的记录工具。你可以记下时间、查看本机统计，并可选择是否加入本月排行榜。',
        'terms-2-title': '2. 年龄限制',
        'terms-2-content': '本网站仅供 18 岁以上用户使用。继续使用本网站，即表示你确认自己已年满 18 岁。',
        'terms-3-title': '3. 用户责任',
        'terms-3-content': '你应自行负责使用本网站的行为与输入内容。请勿滥用排行榜、恶意灌水、攻击网站、输入违法内容，或以任何方式干扰服务运行。',
        'terms-4-title': '4. 隐私与公开资料',
        'terms-4-content': '私人记录默认保存在本设备。只有在你选择加入排行榜时，公开昵称与本月次数才会显示于排行榜。更多资料处理方式请参阅隐私政策。',
        'terms-5-title': '5. 非专业建议',
        'terms-5-content': '本网站仅供私人记录与娱乐用途，不提供医疗、心理、性健康或其他专业建议。如你对身体或心理状态有疑虑，请寻求专业协助。',
        'terms-6-title': '6. 服务变更与终止',
        'terms-6-content': '我们可能随时修改、暂停或终止本网站的部分或全部功能，恕不另行通知。',
        'terms-7-title': '7. 条款修改',
        'terms-7-content': '我们可能不定期更新本服务条款。更新后的内容会公布于本页面。',
        'privacy-intro': '本网站的原则是：私人记录默认留在你的设备上。只有你主动选择加入排行榜时，才会公开必要资料。',
        'privacy-1-title': '1. 本机保存',
        'privacy-1-content': '本网站会在你的浏览器 localStorage 中保存记录时间、备注（若有）、语言设置、主题设置、排行榜选项，以及年龄确认状态。',
        'privacy-2-title': '2. Firebase 保存',
        'privacy-2-content': '只有当你选择加入本月排行榜时，本网站才会向 Firebase 保存公开昵称、月份、本月累计次数与更新时间。如果你使用登录或注册功能，Firebase Authentication 可能会处理你的电子邮件与登录验证资料。',
        'privacy-3-title': '3. 公开资料',
        'privacy-3-content': '只有你选择加入排行榜时，公开昵称与本月次数会显示在公开排行榜上。具体记录时间、备注与完整历史不会上传，也不会公开。',
        'privacy-4-title': '4. 删除本机资料',
        'privacy-4-content': '你可以通过浏览器清除本网站的 localStorage，移除保存在本机的记录与设置。请注意，清除本机资料不会自动删除已公开的排行榜资料。',
        'privacy-5-title': '5. 第三方服务',
        'privacy-5-content': '本网站使用 Firebase 提供排行榜与账号验证功能，并使用 html2canvas 或 canvas 相关工具生成分享图。',
        'privacy-6-title': '6. 分析与追踪',
        'privacy-6-content': '本网站目前未嵌入第三方分析工具或广告追踪工具。',
        'privacy-7-title': '7. 资料出售',
        'privacy-7-content': '我们不出售你的个人资料。',
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

    setText('tip-title', 'tip-title');
    setText('tip-line1', 'tip-line1');
    setText('tip-line2', 'tip-line2');
    setText('tip-line3', 'tip-line3');
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
    setText('sync-desc-line1', 'sync-desc-line1');
    setText('sync-desc-line2', 'sync-desc-line2');
    setText('sync-desc-line3', 'sync-desc-line3');

    const navTitle = document.querySelector('.nav-left a.logo-text') || document.querySelector('.nav-left a');
    if (navTitle) navTitle.textContent = texts['title'];

    const h1 = document.querySelector('h1.hero-title') || document.querySelector('h1');
    if (h1) h1.textContent = texts['title'];

    const h2 = document.querySelector('.hero-subtitle');
    if (h2) h2.textContent = texts['subtitle'];

    const shareBtn = document.getElementById('share-generate-btn') || document.querySelector('.btn-share');
    if (shareBtn) shareBtn.textContent = texts['share-btn'];

    const downloadBtn = document.getElementById('share-download-btn');
    if (downloadBtn && downloadBtn.style.display !== 'none') {
        downloadBtn.textContent = texts['share-download-btn'] || '下載圖片';
    }

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
        footerLinks.innerHTML = renderFooterLinksHTML(texts);
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

    if (typeof window.renderLocalStats === 'function') window.renderLocalStats();
    if (typeof window.loadLeaderboard === 'function') window.loadLeaderboard();
    if (typeof window.updateSyncAuthUI === 'function') window.updateSyncAuthUI();
    if (typeof window.updateThemeIcons === 'function') window.updateThemeIcons();
    if (typeof window.updateAgeGateLangButtons === 'function') window.updateAgeGateLangButtons(currentLanguage);
    if (typeof window.updateLegalPageTexts === 'function') window.updateLegalPageTexts();
}

export function resolveInitialLanguage() {
    const saved = localStorage.getItem('language');
    if (saved && translations[saved]) return saved;

    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    if (nav === 'zh-tw' || nav === 'zh-hk' || nav === 'zh-mo'
        || nav.startsWith('zh-tw') || nav.startsWith('zh-hk') || nav.startsWith('zh-mo')) {
        return 'zh-TW';
    }
    if (nav === 'zh-cn' || nav === 'zh-sg'
        || nav.startsWith('zh-cn') || nav.startsWith('zh-sg')) {
        return 'zh-CN';
    }
    return 'en';
}

// 初始化語言
export function initLanguage() {
    setLanguage(resolveInitialLanguage());
}

// 將 texts 暴露為當前語言的翻譯（向後兼容）
export const texts = translations['zh-TW'];

// 將語言相關變數暴露到全局，供模塊腳本使用
window.texts = texts;
window.getTexts = getTexts;
window.setLanguage = setLanguage;
window.getCurrentLanguage = getCurrentLanguage;
window.updatePageTexts = updatePageTexts;
