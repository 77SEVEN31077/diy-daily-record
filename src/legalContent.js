export function renderFooterLinksHTML(texts) {
    return `
        <a href="/about.html" class="footer-link">${texts['about']}</a>
        <span style="color: var(--text-muted);"> / </span>
        <a href="/terms.html" class="footer-link">${texts['terms']}</a>
        <span style="color: var(--text-muted);"> / </span>
        <a href="/privacy.html" class="footer-link">${texts['privacy']}</a>
    `;
}

export function renderAboutBody(texts) {
    return `
        <p>${texts['about-p1']}</p>
        <p>${texts['about-p2']}</p>
        <p>${texts['about-p3']}</p>
        <p>${texts['about-p4']}</p>
        <p>${texts['about-p5']}</p>
        <ol class="legal-list">
            <li>${texts['about-li1']}</li>
            <li>${texts['about-li2']}</li>
            <li>${texts['about-li3']}</li>
        </ol>
        <p>${texts['about-p6']}</p>
        <p>${texts['about-p7']}</p>
        <p>${texts['about-p8']}</p>
        <p>${texts['about-p9']}</p>
    `;
}

function renderNumberedSections(texts, prefix, count) {
    return Array.from({ length: count }, (_, i) => {
        const n = i + 1;
        return `
            <div class="legal-section">
                <h2 class="legal-section-title">${texts[`${prefix}-${n}-title`]}</h2>
                <p>${texts[`${prefix}-${n}-content`]}</p>
            </div>
        `;
    }).join('');
}

export function renderTermsBody(texts) {
    return `
        <p>${texts['terms-intro']}</p>
        ${renderNumberedSections(texts, 'terms', 7)}
    `;
}

export function renderPrivacyBody(texts) {
    return `
        <p>${texts['privacy-intro']}</p>
        ${renderNumberedSections(texts, 'privacy', 7)}
    `;
}
