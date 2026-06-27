const ICONS = {
    hero: {
        dark: '/icons/hero-icon-dark.png',
        light: '/icons/hero-icon-light.png',
    },
    section: {
        dark: '/icons/section-icon-dark.png',
        light: '/icons/section-icon-light.png',
    },
};

export function isLightTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute('data-theme');
    if (theme === 'light') return true;
    if (theme === 'dark') return false;
    return root.classList.contains('light');
}

export function updateThemeIcons() {
    const light = isLightTheme();
    const heroSrc = light ? ICONS.hero.light : ICONS.hero.dark;
    const sectionSrc = light ? ICONS.section.light : ICONS.section.dark;

    document.querySelectorAll('.hero-icon').forEach((img) => {
        if (img.getAttribute('src') !== heroSrc) img.src = heroSrc;
    });
    document.querySelectorAll('.section-title-icon').forEach((img) => {
        if (img.getAttribute('src') !== sectionSrc) img.src = sectionSrc;
    });
}

export function updateAgeGateLangButtons(lang) {
    const switcher = document.getElementById('age-language-switch');
    if (!switcher) return;
    switcher.querySelectorAll('button[data-lang]').forEach((btn) => {
        const active = btn.getAttribute('data-lang') === lang;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

window.updateThemeIcons = updateThemeIcons;
window.updateAgeGateLangButtons = updateAgeGateLangButtons;

window.selectAgeGateLanguage = function(lang) {
    if (window.setLanguage && typeof window.setLanguage === 'function') {
        window.setLanguage(lang);
    }
    updateAgeGateLangButtons(lang);
};
