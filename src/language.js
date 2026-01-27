// 語言切換下拉菜單
window.toggleLanguageDropdown = function(event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = document.getElementById('language-dropdown');
    const themeDropdown = document.getElementById('theme-dropdown');
    const btn = document.getElementById('language-toggle-btn');
    
    // 關閉其他下拉菜單
    if (themeDropdown) themeDropdown.classList.remove('show');
    
    // 切換當前下拉菜單
    if (dropdown) {
        dropdown.classList.toggle('show');
        if (btn) btn.setAttribute('aria-expanded', dropdown.classList.contains('show'));
    }
};

// 選擇語言
window.selectLanguage = function(lang) {
    console.log('[Language] selectLanguage called with:', lang);
    
    const dropdown = document.getElementById('language-dropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
        
        // 更新活動狀態
        const items = dropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('onclick')?.includes(lang)) {
                item.classList.add('active');
            }
        });
    }
    
    // 保存語言設置
    localStorage.setItem('language', lang);
    
    // 切換語言並更新頁面
    const trySetLanguage = () => {
        if (window.setLanguage && typeof window.setLanguage === 'function') {
            console.log('[Language] Calling setLanguage');
            window.setLanguage(lang);
        } else {
            console.log('[Language] setLanguage not available, retrying...');
            // 如果 setLanguage 還沒加載，延遲重試
            setTimeout(() => {
                if (window.setLanguage && typeof window.setLanguage === 'function') {
                    window.setLanguage(lang);
                } else {
                    // 如果還是沒有，強制重新載入頁面以應用語言
                    console.warn('[Language] setLanguage still not available, reloading page');
                    window.location.reload();
                }
            }, 200);
        }
    };
    
    trySetLanguage();
};

// 點擊外部關閉下拉菜單 - 確保在 DOM 準備好後才添加監聽器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setupLanguageDropdownClose();
    });
} else {
    setupLanguageDropdownClose();
}

function setupLanguageDropdownClose() {
    document.addEventListener('click', function(event) {
        const languageDropdown = document.getElementById('language-dropdown');
        const languageBtn = document.getElementById('language-toggle-btn');
        
        if (languageDropdown && languageBtn && !languageBtn.contains(event.target) && !languageDropdown.contains(event.target)) {
            languageDropdown.classList.remove('show');
            languageBtn.setAttribute('aria-expanded', 'false');
        }
    });
}
