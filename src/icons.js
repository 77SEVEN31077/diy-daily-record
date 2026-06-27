const ICONS = {
    hero: {
        dark: '/icons/hero-icon-dark.png',
        light: '/icons/hero-icon-light.png',
    },
    section: {
        dark: '/icons/section-icon-dark.png',
        light: '/icons/section-icon-light.png',
    },
    age: {
        dark: '/icons/age-icon-dark.png?v=2',
        light: '/icons/age-icon-light.png?v=2',
    },
};

export function isLightTheme() {
    const root = document.documentElement;
    const theme = root.getAttribute('data-theme');
    if (theme === 'light') return true;
    if (theme === 'dark') return false;
    return root.classList.contains('light');
}

export function getAgeIconSrc() {
    return isLightTheme() ? ICONS.age.light : ICONS.age.dark;
}

export function updateAgeGateIcons() {
    const src = getAgeIconSrc();
    document.querySelectorAll('.age-title-icon').forEach((img) => {
        if (img.getAttribute('src') !== src) img.src = src;
    });
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
    updateAgeGateIcons();
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
window.updateAgeGateIcons = updateAgeGateIcons;
window.getAgeIconSrc = getAgeIconSrc;
window.updateAgeGateLangButtons = updateAgeGateLangButtons;

window.selectAgeGateLanguage = function(lang) {
    if (window.setLanguage && typeof window.setLanguage === 'function') {
        window.setLanguage(lang);
    }
    updateAgeGateLangButtons(lang);
};
