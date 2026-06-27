import './styles.css';
import './theme.js';
import './language.js';
import { initLanguage, getTexts, getCurrentLanguage } from './utils.js';
import {
    renderAboutBody,
    renderTermsBody,
    renderPrivacyBody,
    renderFooterLinksHTML,
} from './legalContent.js';

const PAGE = document.body.dataset.legalPage;
const RENDERERS = {
    about: renderAboutBody,
    terms: renderTermsBody,
    privacy: renderPrivacyBody,
};
const TITLE_KEYS = {
    about: 'about-title',
    terms: 'terms-title',
    privacy: 'privacy-title',
};

function updateThemeDropdownLabels(texts) {
    const themeItems = document.querySelectorAll('#theme-dropdown .dropdown-item span');
    if (themeItems.length < 3) return;
    const lang = getCurrentLanguage();
    if (lang === 'en') {
        themeItems[0].textContent = 'Light Mode';
        themeItems[1].textContent = 'Dark Mode';
        themeItems[2].textContent = 'System';
    } else if (lang === 'zh-CN') {
        themeItems[0].textContent = '浅色模式';
        themeItems[1].textContent = '深色模式';
        themeItems[2].textContent = '系统设置';
    } else {
        themeItems[0].textContent = '淺色模式';
        themeItems[1].textContent = '深色模式';
        themeItems[2].textContent = '系統設定';
    }
}

function updateLegalPageTexts() {
    const texts = getTexts();
    const lang = getCurrentLanguage();
    document.documentElement.setAttribute('lang', lang);

    const titleKey = TITLE_KEYS[PAGE];
    const pageTitle = texts[titleKey] || '';
    document.title = `${pageTitle} - ${texts['title']}`;

    const navTitle = document.querySelector('.nav-left a.logo-text');
    if (navTitle) navTitle.textContent = texts['title'];

    const legalTitle = document.getElementById('legal-title');
    if (legalTitle) legalTitle.textContent = pageTitle;

    const body = document.getElementById('legal-body');
    const render = RENDERERS[PAGE];
    if (body && render) body.innerHTML = render(texts);

    const footerLinks = document.getElementById('footer-links');
    if (footerLinks) footerLinks.innerHTML = renderFooterLinksHTML(texts);

    const backHome = document.getElementById('back-home');
    if (backHome) backHome.textContent = texts['back-home'];

    updateThemeDropdownLabels(texts);
}

window.updateLegalPageTexts = updateLegalPageTexts;

window.addEventListener('DOMContentLoaded', () => {
    initLanguage();
});
