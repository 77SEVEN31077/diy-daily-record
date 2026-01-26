// 工具函數

// 初始化時間輸入框
export function initTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('record-time').value = now.toISOString().slice(0, 16);
}

// 分享與截圖功能
export async function shareStats() {
    const captureArea = document.getElementById('capture-area');
    const shareMsg = document.getElementById('share-msg');
    const shareBtn = document.querySelector('.btn-share');
    const texts = window.getTexts ? window.getTexts() : translations['zh-TW'];
    
    shareBtn.innerText = texts['loading'] || "生成截圖中...";
    try {
        const url = window.location.href;
        const shareText = window.getCurrentLanguage && window.getCurrentLanguage() === 'en' 
            ? `My stats here! ${url}`
            : `我的戰績在此！ ${url}`;
        await navigator.clipboard.writeText(shareText);

        document.querySelector('.no-capture').style.display = 'none';
        const canvas = await html2canvas(captureArea, {
            backgroundColor: "#000000",
            scale: 2
        });
        document.querySelector('.no-capture').style.display = 'block';

        const jpgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement('a');
        link.download = `my-stats-${Date.now()}.jpg`;
        link.href = jpgDataUrl;
        link.click();

        shareBtn.innerText = texts['share-btn'];
        shareMsg.innerText = texts['share-success'];
        shareMsg.style.display = 'block';
    } catch (err) {
        alert(texts['share-failed'] || '分享失敗，請手動截圖');
        shareBtn.innerText = texts['share-btn'];
    }
}

// 模態框管理
window.openTerms = function() {
    document.getElementById('termsModal').style.display = 'block';
};

window.closeTerms = function() {
    document.getElementById('termsModal').style.display = 'none';
};

window.openPrivacy = function() {
    document.getElementById('privacyModal').style.display = 'block';
};

window.closePrivacy = function() {
    document.getElementById('privacyModal').style.display = 'none';
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
};

// 多語言翻譯對象
export const translations = {
    'zh-TW': {
        'title': '打飛機紀錄',
        'subtitle': '今天來一發？',
        'record-title': '記下你的每一次',
        'nickname-label': '你的暱稱',
        'nickname-placeholder': '輸入你的暱稱...',
        'time-label': '時間',
        'confirm-btn': '確認紀錄',
        'history-title': '你的近期戰績',
        'rank-title': '本月打槍王 (Top 30)',
        'loading': '載入中...',
        'share-btn': '分享你的戰績 📸',
        'share-success': '截圖已生成，連結已複製！',
        'no-records': '本月尚無戰績',
        'load-failed': '排行榜加載失敗',
        'synced': '已同步',
        'times': '次',
        'you': '(你)',
        'alert-nickname': '請輸入暱稱！',
        'alert-time': '請選擇時間！',
        'alert-success': '紀錄成功！要注意身體喔。',
        'alert-sync-failed': '同步失敗，請檢查網路或 Firebase 規則。',
        'share-failed': '分享失敗，請手動截圖',
        'login': '登入',
        'signup': '註冊',
        'logout': '登出',
        'terms': '服務條款',
        'privacy': '隱私政策',
        'terms-title': '服務條款',
        'privacy-title': '隱私政策',
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
        'footer-agreement': '使用此網站即表示您同意',
        'footer-and': '並已閱讀',
        'synced': '已同步',
        'logging-in': '登入中...',
        'signing-up': '註冊中...',
        'login-success': '登入成功！',
        'signup-success': '註冊成功！歡迎使用！',
        'logout-success': '已成功登出！',
        'logout-failed': '登出失敗：',
        'error-user-not-found': '找不到此帳號，請先註冊。',
        'error-wrong-password': '密碼錯誤，請重新輸入。',
        'error-invalid-email': '電子郵件格式不正確。',
        'error-login-failed': '登入失敗：',
        'error-password-mismatch': '兩次輸入的密碼不一致，請重新輸入。',
        'error-password-too-short': '密碼長度至少需要6個字元。',
        'error-email-in-use': '此電子郵件已被使用，請直接登入。',
        'error-weak-password': '密碼強度不足，請使用更複雜的密碼。',
        'error-signup-failed': '註冊失敗：'
    },
    'en': {
        'title': 'DIY Record',
        'subtitle': 'Ready for today?',
        'record-title': 'Record Your Every Time',
        'nickname-label': 'Your Nickname',
        'nickname-placeholder': 'Enter your nickname...',
        'time-label': 'Time',
        'confirm-btn': 'Confirm Record',
        'history-title': 'Your Recent Records',
        'rank-title': 'Top 30 This Month',
        'loading': 'Loading...',
        'share-btn': 'Share Your Stats 📸',
        'share-success': 'Screenshot generated, link copied!',
        'no-records': 'No records this month',
        'load-failed': 'Failed to load leaderboard',
        'synced': 'Synced',
        'times': 'times',
        'you': '(You)',
        'alert-nickname': 'Please enter nickname!',
        'alert-time': 'Please select time!',
        'alert-success': 'Record successful! Take care of your health.',
        'alert-sync-failed': 'Sync failed, please check network or Firebase rules.',
        'share-failed': 'Share failed, please screenshot manually',
        'login': 'Sign In',
        'signup': 'Sign Up',
        'logout': 'Sign Out',
        'terms': 'Terms of Service',
        'privacy': 'Privacy Policy',
        'terms-title': 'Terms of Service',
        'privacy-title': 'Privacy Policy',
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
        'footer-agreement': 'By using this website, you agree to',
        'footer-and': 'and have read',
        'synced': 'Synced',
        'logging-in': 'Signing in...',
        'signing-up': 'Signing up...',
        'login-success': 'Sign in successful!',
        'signup-success': 'Sign up successful! Welcome!',
        'logout-success': 'Signed out successfully!',
        'logout-failed': 'Sign out failed: ',
        'error-user-not-found': 'Account not found, please sign up first.',
        'error-wrong-password': 'Wrong password, please try again.',
        'error-invalid-email': 'Invalid email format.',
        'error-login-failed': 'Sign in failed: ',
        'error-password-mismatch': 'Passwords do not match, please try again.',
        'error-password-too-short': 'Password must be at least 6 characters.',
        'error-email-in-use': 'This email is already in use, please sign in.',
        'error-weak-password': 'Password is too weak, please use a stronger password.',
        'error-signup-failed': 'Sign up failed: '
    },
    'zh-CN': {
        'title': '打飞机记录',
        'subtitle': '今天来一发？',
        'record-title': '记下你的每一次',
        'nickname-label': '你的昵称',
        'nickname-placeholder': '输入你的昵称...',
        'time-label': '时间',
        'confirm-btn': '确认记录',
        'history-title': '你的近期战绩',
        'rank-title': '本月打枪王 (Top 30)',
        'loading': '加载中...',
        'share-btn': '分享你的战绩 📸',
        'share-success': '截图已生成，链接已复制！',
        'no-records': '本月尚无战绩',
        'load-failed': '排行榜加载失败',
        'synced': '已同步',
        'times': '次',
        'you': '(你)',
        'alert-nickname': '请输入昵称！',
        'alert-time': '请选择时间！',
        'alert-success': '记录成功！要注意身体喔。',
        'alert-sync-failed': '同步失败，请检查网络或 Firebase 规则。',
        'share-failed': '分享失败，请手动截图',
        'login': '登录',
        'signup': '注册',
        'logout': '登出',
        'terms': '服务条款',
        'privacy': '隐私政策',
        'terms-title': '服务条款',
        'privacy-title': '隐私政策',
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
        'footer-agreement': '使用此网站即表示您同意',
        'footer-and': '并已阅读',
        'synced': '已同步',
        'logging-in': '登录中...',
        'signing-up': '注册中...',
        'login-success': '登录成功！',
        'signup-success': '注册成功！欢迎使用！',
        'logout-success': '已成功登出！',
        'logout-failed': '登出失败：',
        'error-user-not-found': '找不到此账号，请先注册。',
        'error-wrong-password': '密码错误，请重新输入。',
        'error-invalid-email': '电子邮件格式不正确。',
        'error-login-failed': '登录失败：',
        'error-password-mismatch': '两次输入的密码不一致，请重新输入。',
        'error-password-too-short': '密码长度至少需要6个字符。',
        'error-email-in-use': '此电子邮件已被使用，请直接登录。',
        'error-weak-password': '密码强度不足，请使用更复杂的密码。',
        'error-signup-failed': '注册失败：'
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
    const html = document.documentElement;
    
    // 更新 HTML lang 屬性（影響日曆等原生控件）
    html.setAttribute('lang', currentLanguage);
    
    // 更新 datetime-local 輸入框的語言（通過設置 lang 屬性）
    const timeInput = document.getElementById('record-time');
    if (timeInput) {
        timeInput.setAttribute('lang', currentLanguage);
    }
    
    // 更新標題
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleElement.textContent = `${texts['title']} - ${texts['subtitle']}`;
    }
    
    // 更新導航欄
    const navTitle = document.querySelector('.nav-left a');
    if (navTitle) {
        navTitle.textContent = texts['title'];
    }
    
    // 更新主標題
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.textContent = texts['title'];
    }
    
    // 更新副標題
    const h2 = document.querySelector('h2');
    if (h2) {
        h2.textContent = texts['subtitle'];
    }
    
    // 更新表單標籤和按鈕
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length > 0) {
        sectionTitles[0].textContent = texts['record-title'];
    }
    
    const nicknameLabel = document.querySelector('.form-group:first-of-type label');
    if (nicknameLabel) {
        nicknameLabel.textContent = texts['nickname-label'];
    }
    
    const nicknameInput = document.getElementById('nickname');
    if (nicknameInput) {
        nicknameInput.placeholder = texts['nickname-placeholder'];
    }
    
    const timeLabel = document.querySelectorAll('.form-group label')[1];
    if (timeLabel) {
        timeLabel.textContent = texts['time-label'];
    }
    
    const confirmBtn = document.querySelector('.btn[onclick="addRecord()"]');
    if (confirmBtn) {
        confirmBtn.textContent = texts['confirm-btn'];
    }
    
    // 更新歷史標題
    if (sectionTitles.length > 1) {
        const historySection = document.getElementById('history-section');
        if (historySection && historySection.querySelector('.section-title')) {
            historySection.querySelector('.section-title').textContent = texts['history-title'];
        }
    }
    
    // 更新排行榜標題
    if (sectionTitles.length > 2) {
        sectionTitles[sectionTitles.length - 2].textContent = texts['rank-title'];
    }
    
    // 更新分享按鈕
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.textContent = texts['share-btn'];
    }
    
    // 更新登入/註冊按鈕
    const loginLink = document.querySelector('.nav-link-signin');
    if (loginLink) {
        loginLink.textContent = texts['login'];
    }
    
    const signupLink = document.querySelector('.nav-link-signup');
    if (signupLink) {
        signupLink.textContent = texts['signup'];
    }
    
    // 更新模態框標題
    const loginTitle = document.querySelector('#loginModal h3');
    if (loginTitle) {
        loginTitle.textContent = texts['login-title'];
    }
    
    const signupTitle = document.querySelector('#signupModal h3');
    if (signupTitle) {
        signupTitle.textContent = texts['signup-title'];
    }
    
    // 更新表單標籤
    const loginEmailLabel = document.querySelector('#loginForm label[for="loginEmail"]');
    if (loginEmailLabel) {
        loginEmailLabel.textContent = texts['email'];
    }
    
    const loginPasswordLabel = document.querySelector('#loginForm label[for="loginPassword"]');
    if (loginPasswordLabel) {
        loginPasswordLabel.textContent = texts['password'];
    }
    
    const signupEmailLabel = document.querySelector('#signupForm label[for="signupEmail"]');
    if (signupEmailLabel) {
        signupEmailLabel.textContent = texts['email'];
    }
    
    const signupPasswordLabel = document.querySelector('#signupForm label[for="signupPassword"]');
    if (signupPasswordLabel) {
        signupPasswordLabel.textContent = texts['password'];
    }
    
    const signupPasswordConfirmLabel = document.querySelector('#signupForm label[for="signupPasswordConfirm"]');
    if (signupPasswordConfirmLabel) {
        signupPasswordConfirmLabel.textContent = texts['confirm-password'];
    }
    
    // 更新輸入框 placeholder
    const loginEmailInput = document.getElementById('loginEmail');
    if (loginEmailInput) {
        loginEmailInput.placeholder = texts['email-placeholder'];
    }
    
    const loginPasswordInput = document.getElementById('loginPassword');
    if (loginPasswordInput) {
        loginPasswordInput.placeholder = texts['password-placeholder'];
    }
    
    const signupEmailInput = document.getElementById('signupEmail');
    if (signupEmailInput) {
        signupEmailInput.placeholder = texts['email-placeholder'];
    }
    
    const signupPasswordInput = document.getElementById('signupPassword');
    if (signupPasswordInput) {
        signupPasswordInput.placeholder = texts['password-min'];
    }
    
    const signupPasswordConfirmInput = document.getElementById('signupPasswordConfirm');
    if (signupPasswordConfirmInput) {
        signupPasswordConfirmInput.placeholder = texts['password-confirm-placeholder'];
    }
    
    // 更新按鈕文字
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.textContent = texts['login-title'];
    }
    
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.textContent = texts['signup-title'];
    }
    
    // 更新頁腳
    const footerLinks = document.querySelectorAll('.footer-link');
    if (footerLinks.length >= 2) {
        footerLinks[0].textContent = texts['terms'];
        footerLinks[1].textContent = texts['privacy'];
    }
    
    const footerText = document.querySelector('.footer');
    if (footerText) {
        const footerContent = footerText.innerHTML;
        if (footerContent.includes('使用此網站')) {
            footerText.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <span style="color: var(--text-muted);">@ 2025 打飛機  ｜  </span>
                    <a href="https://x.com/77seven31077" target="_blank" rel="noopener noreferrer" class="footer-x-link" style="display: inline-block; vertical-align: middle;">
                        <svg class="footer-x-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="var(--text-muted)"/>
                        </svg>
                    </a>
                </div>
                ${texts['footer-agreement']}<a href="#" onclick="openTerms(); return false;" class="footer-link">${texts['terms']}</a>${texts['footer-and']}<a href="#" onclick="openPrivacy(); return false;" class="footer-link">${texts['privacy']}</a>
            `;
        }
    }
    
    // 更新主題下拉菜單文字
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
    
    // 更新登入/註冊模態框中的連結文字
    const loginModalLinks = document.querySelectorAll('#loginModal a');
    loginModalLinks.forEach(link => {
        if (link.textContent.includes('還沒有帳號') || link.textContent.includes("Don't have")) {
            const parent = link.parentElement;
            if (parent) {
                parent.innerHTML = `${texts['no-account']} <a href="#" onclick="closeLogin(); openSignup(); return false;" style="color: var(--highlight); text-decoration: underline;">${texts['signup-link']}</a>`;
            }
        }
    });
    
    const signupModalLinks = document.querySelectorAll('#signupModal a');
    signupModalLinks.forEach(link => {
        if (link.textContent.includes('已有帳號') || link.textContent.includes('Already have')) {
            const parent = link.parentElement;
            if (parent) {
                parent.innerHTML = `${texts['has-account']} <a href="#" onclick="closeSignup(); openLogin(); return false;" style="color: var(--highlight); text-decoration: underline;">${texts['login-link']}</a>`;
            }
        }
    });
    
    // 重新渲染歷史記錄以更新"已同步"文字
    if (typeof window.renderLocalHistory === 'function') {
        window.renderLocalHistory();
    }
    
    // 重新載入排行榜以更新文字
    if (typeof window.loadLeaderboard === 'function') {
        window.loadLeaderboard();
    }
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
