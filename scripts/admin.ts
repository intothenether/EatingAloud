interface Post {
  id: string;
  title: string;
  image?: string;
  content: string;
}

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

const adminForm = document.getElementById('auth-form') as HTMLFormElement | null;
const loginForm = document.getElementById('login-form') as HTMLDivElement | null;
const cmsContent = document.getElementById('cms-content') as HTMLDivElement | null;

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function generateSalt(): string {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return toHex(salt.buffer);
}

async function hashPassword(password: string, saltHex: string): Promise<string> {
  const saltBytes = fromHex(saltHex);
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes as BufferSource,
      iterations: 150000,
      hash: 'SHA-256'
    },
    passwordKey,
    256
  );

  return toHex(derivedBits);
}

function getStoredCredentials() {
  const hash = localStorage.getItem('adminPasswordHash');
  const salt = localStorage.getItem('adminPasswordSalt');
  return { hash, salt };
}

function setStoredCredentials(hash: string, salt: string) {
  localStorage.setItem('adminPasswordHash', hash);
  localStorage.setItem('adminPasswordSalt', salt);
}

function setSessionToken() {
  const token = crypto.getRandomValues(new Uint8Array(32)).reduce((str, b) => str + b.toString(16).padStart(2, '0'), '');
  const expires = Date.now() + SESSION_DURATION_MS;
  sessionStorage.setItem('adminSessionToken', token);
  sessionStorage.setItem('adminSessionExpires', String(expires));
}

function clearSessionToken() {
  sessionStorage.removeItem('adminSessionToken');
  sessionStorage.removeItem('adminSessionExpires');
}

function isSessionValid(): boolean {
  const token = sessionStorage.getItem('adminSessionToken');
  const expires = Number(sessionStorage.getItem('adminSessionExpires'));
  return !!token && !Number.isNaN(expires) && expires > Date.now();
}

function showCMS() {
  if (loginForm) loginForm.classList.add('hidden');
  if (cmsContent) cmsContent.classList.remove('hidden');
  loadAdminPosts();
}

function requireLogin() {
  if (isSessionValid()) {
    showCMS();
    return;
  }

  if (loginForm) loginForm.classList.remove('hidden');
  if (cmsContent) cmsContent.classList.add('hidden');
}

function handleLogout() {
  clearSessionToken();
  window.location.reload();
}

// Expose deletePost as global
(window as any).deletePost = deletePost;

async function checkMasterPassword(password: string): Promise<boolean> {
  const { hash, salt } = getStoredCredentials();
  if (!hash || !salt) return false;
  const testHash = await hashPassword(password, salt);
  return testHash === hash;
}

async function setupPassword(password: string): Promise<void> {
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);
  setStoredCredentials(hash, salt);
}

function loadAdminPosts() {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]') as Post[];
  const container = document.getElementById('existing-posts');
  if (!container) return;

  container.innerHTML = '';
  posts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'admin-post';
    div.innerHTML = `
      <h3>${post.title}</h3>
      ${post.image ? `<img src="${post.image}" alt="${post.title}" style="max-width: 200px;">` : ''}
      <p>${post.content}</p>
      <button onclick="deletePost('${post.id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}

function savePost(post: Post) {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]') as Post[];
  posts.unshift(post); // Add to beginning
  localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function deletePost(id: string) {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]') as Post[];
  const filtered = posts.filter(p => p.id !== id);
  localStorage.setItem('blogPosts', JSON.stringify(filtered));
  loadAdminPosts();
}

if (adminForm) {
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    if (!passwordInput) return;
    const password = passwordInput.value.trim();
    if (!password) {
      alert('Password cannot be empty');
      return;
    }

    const { hash } = getStoredCredentials();
    if (!hash) {
      // initial setup
      await setupPassword(password);
      alert('Admin password set. Please log in again.');
      passwordInput.value = '';
      return;
    }

    if (await checkMasterPassword(password)) {
      setSessionToken();
      showCMS();
    } else {
      alert('Invalid password');
      passwordInput.value = '';
    }
  });
}

const logoutButton = document.createElement('button');
logoutButton.textContent = 'Logout';
logoutButton.style.margin = '10px 0 20px';
logoutButton.addEventListener('click', handleLogout);
if (cmsContent) cmsContent.prepend(logoutButton);

const newPostForm = document.getElementById('new-post-form') as HTMLFormElement | null;
if (newPostForm) {
  newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (document.getElementById('post-title') as HTMLInputElement).value.trim();
    const image = (document.getElementById('post-image') as HTMLInputElement).value.trim();
    const content = (document.getElementById('post-content') as HTMLTextAreaElement).value.trim();

    if (!title || !content) {
      alert('Please provide title and content.');
      return;
    }

    const post: Post = { id: Date.now().toString(), title, image: image || undefined, content };
    savePost(post);
    loadAdminPosts();
    newPostForm.reset();
  });
}

requireLogin();