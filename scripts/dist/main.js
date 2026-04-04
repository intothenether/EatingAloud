"use strict";
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const languages = {
    en: 'English',
    pl: 'Polski',
    sv: 'Svenska'
};
const translations = {
    en: {
        navHome: 'Home',
        navStories: 'Stories',
        navAbout: 'About us',
        navContact: 'Contact',
        heroTitle: 'Living to eat',
        heroSubtitle: 'Home-cooked favorites and honest restaurant reviews.',
        ctaButton: 'See more stories',
        moreStoriesTitle: 'More Stories',
        moreStoriesDesc: 'Discover our collection of recipes and dining experiences',
        footerTitle: 'Living to eat',
        footerDesc: 'Home-cooked favorites and honest restaurant reviews.',
        footerCopyright: '© 2026 Living to eat. All rights reserved.',
        aboutTitle: 'About Living to eat',
        aboutIntro: 'Living to eat is a food storytelling platform where we share home-cooked favorites, restaurant discoveries, and honest reviews from our culinary adventures.',
        aboutMission: 'Our mission is to inspire people to cook better, eat with curiosity, and explore places where flavor and hospitality meet.',
        aboutTeam: 'Behind Living to eat is a small team of cooks, writers, and travelers who believe in simple ingredients, honest opinions and the joy of gathering around food.',
        aboutContact: 'Want to collaborate or share a recipe? Reach out via the contact links in the site footer.',
        backToHome: 'Back to Home',
        footerQuickLinks: 'Quick Links',
        footerFollowUs: 'Follow Us',
        recipeTitle: 'Recipe',
        ingredientsTitle: 'Ingredients',
        stepsTitle: 'Steps',
        portionsLabel: 'Portions',
        unitsLabel: 'Units',
        metricOption: 'Metric',
        imperialOption: 'Imperial',
        restaurantLocationTitle: 'Restaurant location'
    },
    pl: {
        navHome: 'Strona główna',
        navStories: 'Historie',
        navAbout: 'O nas',
        navContact: 'Kontakt',
        heroTitle: 'Żyć, by jeść',
        heroSubtitle: 'Ulubione domowe potrawy i szczere recenzje restauracji.',
        ctaButton: 'Zobacz więcej historii',
        moreStoriesTitle: 'Więcej historii',
        moreStoriesDesc: 'Odkryj naszą kolekcję przepisów i doświadczeń kulinarnych',
        footerTitle: 'Żyć, by jeść',
        footerDesc: 'Ulubione domowe potrawy i szczere recenzje restauracji.',
        footerCopyright: '© 2026 Żyć, by jeść. Wszelkie prawa zastrzeżone.',
        aboutTitle: 'O Living to eat',
        aboutIntro: 'Living to eat to platforma opowiadania o jedzeniu, gdzie dzielimy się ulubionymi domowymi potrawami, odkryciami restauracyjnymi i szczerymi recenzjami z naszych kulinarnych przygód.',
        aboutMission: 'Naszą misją jest inspirowanie do lepszego gotowania, jedzenia z ciekawością i odkrywania miejsc, gdzie smak i gościnność się spotykają.',
        aboutTeam: 'Za Living to eat stoi mały zespół kucharzy, pisarzy i podróżników, którzy wierzą w proste składniki, uczciwe opinie i radość z gromadzenia się przy jedzeniu.',
        aboutContact: 'Chcesz współpracować lub podzielić się przepisem? Skontaktuj się poprzez linki kontaktowe w stopce strony.',
        backToHome: 'Powrót do strony głównej',
        footerQuickLinks: 'Szybkie linki',
        footerFollowUs: 'Śledź nas',
        recipeTitle: 'Przepis',
        ingredientsTitle: 'Składniki',
        stepsTitle: 'Kroki',
        portionsLabel: 'Porcje',
        unitsLabel: 'Jednostki',
        metricOption: 'Metryczne',
        imperialOption: 'Imperialne',
        restaurantLocationTitle: 'Lokalizacja restauracji'
    },
    sv: {
        navHome: 'Hem',
        navStories: 'Berättelser',
        navAbout: 'Om oss',
        navContact: 'Kontakt',
        heroTitle: 'Leva för att äta',
        heroSubtitle: 'Hemlagade favoriter och ärliga restaurangupplevelser.',
        ctaButton: 'Se fler berättelser',
        moreStoriesTitle: 'Fler berättelser',
        moreStoriesDesc: 'Upptäck vår samling av recept och matupplevelser',
        footerTitle: 'Leva för att äta',
        footerDesc: 'Hemlagade favoriter och ärliga restaurangupplevelser.',
        footerCopyright: '© 2026 Leva för att äta. Alla rättigheter förbehållna.',
        aboutTitle: 'Om Leva för att äta',
        aboutIntro: 'Living to eat är en matberättelseplattform där vi delar hemgjorda favoriter, restaurangupptäckter och ärliga recensioner från våra kulinariska äventyr.',
        aboutMission: 'Vårt uppdrag är att inspirera människor att laga bättre, äta med nyfikenhet och utforska platser där smak och gästfrihet möts.',
        aboutTeam: 'Bakom Living to eat finns ett litet team av kockar, författare och resenärer som tror på enkla ingredienser, ärliga åsikter och glädjen av att samlas runt mat.',
        aboutContact: 'Vill du samarbeta eller dela ett recept? Kontakta oss via kontaktlänkarna i sidfoten.',
        backToHome: 'Tillbaka till startsidan',
        footerQuickLinks: 'Snabblänkar',
        footerFollowUs: 'Följ oss',
        recipeTitle: 'Recept',
        ingredientsTitle: 'Ingredienser',
        stepsTitle: 'Steg',
        portionsLabel: 'Portioner',
        unitsLabel: 'Enheter',
        metricOption: 'Metriska',
        imperialOption: 'Imperial',
        restaurantLocationTitle: 'Restaurangens plats'
    }
};
const captions = {
    en: {
        hero1: 'Dinner at Farang, Stockholm',
        hero2: 'Basque cheesecake at Ruby Grill',
        hero3: 'Larb at home',
        story1: 'Poké – Hawaii meets Japan',
        story2: 'Khao Soi – World\'s best soup?',
        story3: 'Korean BBQ in Stockholm',
        story4: 'Hidden gem restaurants',
        story5: 'Deep fried octopus for dinner',
        story6: 'How to find amazing cocktails'
    },
    pl: {
        hero1: 'Kolacja w Farang, Sztokholm',
        hero2: 'Sernik baskijski w Ruby Grill',
        hero3: 'Larb w domu',
        story1: 'Poké – Hawaje spotykają Japonię',
        story2: 'Khao Soi – Najlepsza zupa na świecie?',
        story3: 'Koreański BBQ w Sztokholmie',
        story4: 'Ukryte perełki restauracji',
        story5: 'Smażony na głębokim oleju ośmiornica na obiad',
        story6: 'Jak znaleźć niesamowite koktajle'
    },
    sv: {
        hero1: 'Middag på Farang, Stockholm',
        hero2: 'Baskisk cheesecake på Ruby Grill',
        hero3: 'Larb hemma',
        story1: 'Poké – Hawaii möter Japan',
        story2: 'Khao Soi – Världens bästa soppa?',
        story3: 'Koreansk BBQ i Stockholm',
        story4: 'Dolda pärlor restauranger',
        story5: 'Friterad bläckfisk till middag',
        story6: 'Hur man hittar fantastiska cocktails'
    }
};
function currentLanguage() {
    const stored = localStorage.getItem('siteLang');
    return stored && languages[stored] ? stored : 'en';
}
function setLanguage(lang) {
    if (!languages[lang])
        return;
    localStorage.setItem('siteLang', lang);
    location.reload();
}
function initLanguageSelector() {
    const desktopMenu = document.querySelector('.desktop-menu');
    if (!desktopMenu)
        return;
    const select = document.createElement('select');
    select.className = 'lang-selector';
    select.setAttribute('aria-label', 'Select site language');
    Object.entries(languages).forEach(([code, label]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = label;
        select.appendChild(option);
    });
    select.value = currentLanguage();
    select.addEventListener('change', () => setLanguage(select.value));
    desktopMenu.after(select);
}
function updateCardCaptions(lang) {
    document.querySelectorAll('.card-grid .card').forEach((card) => {
        const id = card.getAttribute('data-post-id');
        const caption = card.querySelector('.caption');
        if (id && caption && captions[lang] && captions[lang][id]) {
            caption.textContent = captions[lang][id];
        }
    });
}
function applyTranslations() {
    const lang = currentLanguage();
    const ui = translations[lang];
    // nav
    const nav = document.querySelectorAll('.desktop-menu li a');
    if (nav.length >= 4) {
        nav[0].textContent = ui.navHome;
        nav[1].textContent = ui.navStories;
        nav[2].textContent = ui.navAbout;
        nav[3].textContent = ui.navContact;
    }
    const mobileNavLinks = document.querySelectorAll('#mobile-nav a');
    if (mobileNavLinks.length >= 4) {
        mobileNavLinks[0].textContent = ui.navHome;
        mobileNavLinks[1].textContent = ui.navStories;
        mobileNavLinks[2].textContent = ui.navAbout;
        mobileNavLinks[3].textContent = ui.navContact;
    }
    // hero
    const heroHeader = document.querySelector('.hero h1');
    const heroSubtitle = document.querySelector('.hero .subtitle');
    const ctaBtn = document.querySelector('.cta-button');
    if (heroHeader)
        heroHeader.textContent = ui.heroTitle;
    if (heroSubtitle)
        heroSubtitle.textContent = ui.heroSubtitle;
    if (ctaBtn)
        ctaBtn.textContent = ui.ctaButton;
    // more stories
    const moreTitle = document.querySelector('.more-stories h2');
    const moreDesc = document.querySelector('.more-stories > p');
    if (moreTitle)
        moreTitle.textContent = ui.moreStoriesTitle;
    if (moreDesc)
        moreDesc.textContent = ui.moreStoriesDesc;
    // footer
    const footerTitle = document.querySelector('.footer h3');
    const footerDesc = document.querySelector('.footer .footer-section > p');
    const footerCopyright = document.querySelector('.footer .footer-bottom p');
    const footerQuickLinks = document.querySelector('.footer .footer-section h4');
    const footerFollowUs = document.querySelectorAll('.footer .footer-section h4')[1];
    if (footerTitle)
        footerTitle.textContent = ui.footerTitle;
    if (footerDesc)
        footerDesc.textContent = ui.footerDesc;
    if (footerCopyright)
        footerCopyright.textContent = ui.footerCopyright;
    if (footerQuickLinks)
        footerQuickLinks.textContent = ui.footerQuickLinks;
    if (footerFollowUs)
        footerFollowUs.textContent = ui.footerFollowUs;
    // about page
    const aboutHeading = document.querySelector('.stories-content h2');
    const aboutParagraphs = document.querySelectorAll('.stories-content > p');
    const aboutButton = document.querySelector('.stories-content a.cta-button');
    if (aboutHeading)
        aboutHeading.textContent = ui.aboutTitle;
    if (aboutParagraphs[0])
        aboutParagraphs[0].textContent = ui.aboutIntro;
    if (aboutParagraphs[1])
        aboutParagraphs[1].textContent = ui.aboutMission;
    if (aboutParagraphs[2])
        aboutParagraphs[2].textContent = ui.aboutTeam;
    if (aboutParagraphs[3])
        aboutParagraphs[3].textContent = ui.aboutContact;
    if (aboutButton)
        aboutButton.textContent = ui.backToHome;
    updateCardCaptions(lang);
}
function toggleMenu() {
    if (!menuToggle || !mobileNav)
        return;
    mobileNav.classList.remove('hidden');
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
}
function initSmoothScroll() {
    const down = document.querySelector('.scroll-down');
    if (!down)
        return;
    down.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(down.getAttribute('href') || '#');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}
function initTopCardNav() {
    const cards = document.querySelectorAll('.card-grid .card');
    cards.forEach(card => {
        const postId = card.getAttribute('data-post-id');
        if (postId) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = `post?id=${postId}`;
            });
        }
    });
}
function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const postGrid = document.getElementById('post-grid');
    if (!postGrid)
        return;
    // Clear existing dynamic posts
    const existing = postGrid.querySelectorAll('.dynamic-post');
    existing.forEach(el => el.remove());
    posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post-card dynamic-post';
        if (post.review) {
            article.classList.add('review-card');
        }
        article.dataset.postId = post.id;
        if (post.image) {
            const img = document.createElement('img');
            img.className = 'post-image';
            img.src = post.image;
            img.alt = post.title;
            article.appendChild(img);
        }
        if (post.review) {
            const rating = document.createElement('div');
            rating.className = 'rating';
            rating.textContent = '★'.repeat(post.review.rating) + '☆'.repeat(5 - post.review.rating);
            rating.setAttribute('aria-label', `${post.review.rating} out of 5 stars`);
            article.appendChild(rating);
        }
        const h3 = document.createElement('h3');
        h3.textContent = post.title;
        article.appendChild(h3);
        if (post.publishDate) {
            const meta = document.createElement('time');
            meta.className = 'post-date';
            meta.dateTime = post.publishDate;
            meta.textContent = new Date(post.publishDate).toLocaleDateString();
            article.appendChild(meta);
        }
        const p = document.createElement('p');
        p.textContent = post.content;
        article.appendChild(p);
        article.addEventListener('click', () => {
            window.location.href = `post?id=${post.id}`;
        });
        postGrid.appendChild(article);
    });
}
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            menuToggle?.classList.remove('open');
        });
    });
}
initLanguageSelector();
applyTranslations();
initSmoothScroll();
initTopCardNav();
loadPosts();
//# sourceMappingURL=main.js.map