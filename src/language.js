// 語言切換下拉菜單
window.toggleLanguageDropdown = function(event) {
    event.stopPropagation();
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
    
    // 切換語言並更新頁面
    if (window.setLanguage) {
        window.setLanguage(lang);
    } else {
        // 如果 setLanguage 還沒加載，先保存設置
        localStorage.setItem('language', lang);
        // 延遲更新，等待模組加載
        setTimeout(() => {
            if (window.setLanguage) {
                window.setLanguage(lang);
            }
        }, 100);
    }
};

// 點擊外部關閉下拉菜單
document.addEventListener('click', function(event) {
    const languageDropdown = document.getElementById('language-dropdown');
    const languageBtn = document.getElementById('language-toggle-btn');
    
    if (languageDropdown && languageBtn && !languageBtn.contains(event.target) && !languageDropdown.contains(event.target)) {
        languageDropdown.classList.remove('show');
        languageBtn.setAttribute('aria-expanded', 'false');
    }
});
