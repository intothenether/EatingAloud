"use strict";
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function toggleMenu() {
    if (!menuToggle || !mobileNav)
        return;
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
        article.dataset.postId = post.id;
        if (post.image) {
            const img = document.createElement('img');
            img.className = 'post-image';
            img.src = post.image;
            img.alt = post.title;
            article.appendChild(img);
        }
        const h3 = document.createElement('h3');
        h3.textContent = post.title;
        article.appendChild(h3);
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
initSmoothScroll();
initTopCardNav();
loadPosts();
//# sourceMappingURL=main.js.map