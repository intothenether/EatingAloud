interface Recipe {
  ingredients: string[];
  steps: string[];
}

interface RestaurantLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface Review {
  rating: number;
}

interface Post {
  id: string;
  title: string;
  image?: string;
  content: string;
  recipe?: Recipe;
  location?: RestaurantLocation;
  review?: Review;
  publishDate?: string;
}

let currentEditId: string | null = null;
let coverImageDataUrl: string | null = null;

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

const newPostForm = document.getElementById('new-post-form') as HTMLFormElement | null;
const cancelEditButton = document.getElementById('cancel-edit') as HTMLButtonElement | null;
const emojiPickerContainer = document.getElementById('emoji-picker') as HTMLDivElement | null;
const customEmojiInput = document.getElementById('custom-emoji') as HTMLInputElement | null;
const addCustomEmojiButton = document.getElementById('add-custom-emoji') as HTMLButtonElement | null;
const coverImageFileInput = document.getElementById('post-image-file') as HTMLInputElement | null;
const inlineImageFileInput = document.getElementById('post-inline-image-file') as HTMLInputElement | null;

const defaultEmojis = ['🍜', '🍰', '🍷', '🌶️', '🥂', '🍣', '🍕', '✨'];

function getStoredEmojis(): string[] {
  const stored = localStorage.getItem('adminEmojiList');
  if (!stored) return defaultEmojis;
  try {
    const list = JSON.parse(stored) as string[];
    return Array.isArray(list) && list.length ? list : defaultEmojis;
  } catch {
    return defaultEmojis;
  }
}

function saveStoredEmojis(emojis: string[]) {
  localStorage.setItem('adminEmojiList', JSON.stringify(emojis.slice(0, 50)));
}

function insertAtCursor(element: HTMLTextAreaElement, text: string) {
  const start = element.selectionStart || 0;
  const end = element.selectionEnd || 0;
  const value = element.value;
  element.value = value.slice(0, start) + text + value.slice(end);
  element.selectionStart = element.selectionEnd = start + text.length;
  element.focus();
}

function renderEmojiPicker() {
  const emojis = getStoredEmojis();
  if (!emojiPickerContainer) return;
  emojiPickerContainer.innerHTML = '';
  emojis.forEach(emoji => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'emoji-button';
    button.textContent = emoji;
    button.addEventListener('click', () => {
      const contentField = document.getElementById('post-content') as HTMLTextAreaElement | null;
      if (contentField) {
        insertAtCursor(contentField, emoji);
      }
    });
    emojiPickerContainer.appendChild(button);
  });
}

function addCustomEmoji() {
  if (!customEmojiInput) return;
  const emoji = customEmojiInput.value.trim();
  if (!emoji) return;

  const emojis = getStoredEmojis();
  if (!emojis.includes(emoji)) {
    emojis.unshift(emoji);
    saveStoredEmojis(emojis);
    renderEmojiPicker();
  }
  customEmojiInput.value = '';
}

function handleCoverImageFile() {
  if (!coverImageFileInput || !coverImageFileInput.files?.length) return;
  const file = coverImageFileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string | null;
    if (result) {
      coverImageDataUrl = result;
      const imageField = document.getElementById('post-image') as HTMLInputElement | null;
      if (imageField) {
        imageField.value = result;
      }
    }
  };
  reader.readAsDataURL(file);
}

function handleInlineImageFile() {
  if (!inlineImageFileInput || !inlineImageFileInput.files?.length) return;
  const file = inlineImageFileInput.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string | null;
    if (!result) return;
    const contentField = document.getElementById('post-content') as HTMLTextAreaElement | null;
    if (contentField) {
      insertAtCursor(contentField, `\n<img src="${result}" alt="Inline image" />\n`);
    }
    inlineImageFileInput.value = '';
  };
  reader.readAsDataURL(file);
}

// Expose admin helpers as globals
(window as any).deletePost = deletePost;
(window as any).editPost = editPost;

function resetPostForm() {
  currentEditId = null;
  coverImageDataUrl = null;
  const idField = document.getElementById('post-id') as HTMLInputElement | null;
  const cancelButton = document.getElementById('cancel-edit') as HTMLButtonElement | null;
  const submitButton = document.querySelector<HTMLButtonElement>('#new-post-form button[type="submit"]');
  const coverFileInput = document.getElementById('post-image-file') as HTMLInputElement | null;
  const inlineImageInput = document.getElementById('post-inline-image-file') as HTMLInputElement | null;
  const publishDateField = document.getElementById('post-publish-date') as HTMLInputElement | null;
  if (idField) idField.value = '';
  if (cancelButton) cancelButton.classList.add('hidden');
  if (submitButton) submitButton.textContent = 'Add Post';
  if (coverFileInput) coverFileInput.value = '';
  if (inlineImageInput) inlineImageInput.value = '';
  newPostForm?.reset();
  if (publishDateField) {
    publishDateField.value = new Date().toISOString().slice(0, 10);
  }
}

function populatePostForm(post: Post) {
  currentEditId = post.id;
  coverImageDataUrl = null;
  const idField = document.getElementById('post-id') as HTMLInputElement | null;
  const titleField = document.getElementById('post-title') as HTMLInputElement | null;
  const imageField = document.getElementById('post-image') as HTMLInputElement | null;
  const contentField = document.getElementById('post-content') as HTMLTextAreaElement | null;
  const ingredientField = document.getElementById('post-recipe-ingredients') as HTMLTextAreaElement | null;
  const stepsField = document.getElementById('post-recipe-steps') as HTMLTextAreaElement | null;
  const locationNameField = document.getElementById('post-location-name') as HTMLInputElement | null;
  const locationAddressField = document.getElementById('post-location-address') as HTMLInputElement | null;
  const locationLatField = document.getElementById('post-location-lat') as HTMLInputElement | null;
  const locationLngField = document.getElementById('post-location-lng') as HTMLInputElement | null;
  const reviewCheckbox = document.getElementById('post-review-checkbox') as HTMLInputElement | null;
  const reviewRating = document.getElementById('post-review-rating') as HTMLSelectElement | null;
  const cancelButton = document.getElementById('cancel-edit') as HTMLButtonElement | null;
  const submitButton = document.querySelector<HTMLButtonElement>('#new-post-form button[type="submit"]');

  if (idField) idField.value = post.id;
  if (titleField) titleField.value = post.title;
  if (imageField) imageField.value = post.image || '';
  if (contentField) contentField.value = post.content;
  if (ingredientField) ingredientField.value = post.recipe ? post.recipe.ingredients.join('\n') : '';
  if (stepsField) stepsField.value = post.recipe ? post.recipe.steps.join('\n') : '';
  if (locationNameField) locationNameField.value = post.location?.name || '';
  if (locationAddressField) locationAddressField.value = post.location?.address || '';
  if (locationLatField) locationLatField.value = post.location ? String(post.location.lat) : '';
  if (locationLngField) locationLngField.value = post.location ? String(post.location.lng) : '';
  const publishDateField = document.getElementById('post-publish-date') as HTMLInputElement | null;
  if (publishDateField) publishDateField.value = post.publishDate || new Date().toISOString().slice(0, 10);
  if (reviewCheckbox) reviewCheckbox.checked = !!post.review;
  if (reviewRating) reviewRating.value = post.review ? String(post.review.rating) : '5';
  if (cancelButton) cancelButton.classList.remove('hidden');
  if (submitButton) submitButton.textContent = 'Update Post';
}

function editPost(id: string) {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]') as Post[];
  const post = posts.find(p => p.id === id);
  if (!post) return;
  populatePostForm(post);
}

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
    const reviewStars = post.review ? '★'.repeat(post.review.rating) + '☆'.repeat(5 - post.review.rating) : '';
    div.innerHTML = `
      <h3>${post.title}</h3>
      ${post.publishDate ? `<p><strong>Publish date:</strong> ${post.publishDate}</p>` : ''}
      ${post.review ? `<p><strong>Review:</strong> <span aria-label="${post.review.rating} out of 5 stars">${reviewStars}</span></p>` : ''}
      ${post.image ? `<img src="${post.image}" alt="${post.title}" style="max-width: 200px;">` : ''}
      <p>${post.content}</p>
      ${post.recipe ? `<p><strong>Recipe:</strong> ${post.recipe.ingredients.length} ingredients, ${post.recipe.steps.length} steps</p>` : ''}
      ${post.location ? `<p><strong>Location:</strong> ${post.location.name || 'Map'} (${post.location.lat.toFixed(4)}, ${post.location.lng.toFixed(4)})</p>` : ''}
      <div class="post-actions">
        <button type="button" class="edit-button" onclick="editPost('${post.id}')">Edit</button>
        <button type="button" class="delete-button" onclick="deletePost('${post.id}')">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function savePost(post: Post) {
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]') as Post[];
  const existingIndex = posts.findIndex(p => p.id === post.id);
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.unshift(post);
  }
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

if (cancelEditButton) {
  cancelEditButton.addEventListener('click', resetPostForm);
}

if (addCustomEmojiButton) {
  addCustomEmojiButton.addEventListener('click', addCustomEmoji);
}

if (coverImageFileInput) {
  coverImageFileInput.addEventListener('change', handleCoverImageFile);
}

if (inlineImageFileInput) {
  inlineImageFileInput.addEventListener('change', handleInlineImageFile);
}

if (newPostForm) {
  resetPostForm();
  renderEmojiPicker();

  newPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (document.getElementById('post-title') as HTMLInputElement).value.trim();
    const imageUrl = (document.getElementById('post-image') as HTMLInputElement).value.trim();
    const content = (document.getElementById('post-content') as HTMLTextAreaElement).value.trim();
    const recipeIngredients = (document.getElementById('post-recipe-ingredients') as HTMLTextAreaElement).value.trim();
    const recipeSteps = (document.getElementById('post-recipe-steps') as HTMLTextAreaElement).value.trim();
    const locationName = (document.getElementById('post-location-name') as HTMLInputElement).value.trim();
    const locationAddress = (document.getElementById('post-location-address') as HTMLInputElement).value.trim();
    const locationLat = parseFloat((document.getElementById('post-location-lat') as HTMLInputElement).value.trim());
    const locationLng = parseFloat((document.getElementById('post-location-lng') as HTMLInputElement).value.trim());
    const publishDate = (document.getElementById('post-publish-date') as HTMLInputElement).value.trim();
    const reviewEnabled = (document.getElementById('post-review-checkbox') as HTMLInputElement).checked;
    const reviewRating = parseInt((document.getElementById('post-review-rating') as HTMLSelectElement).value, 10);

    if (!title || !content) {
      alert('Please provide title and content.');
      return;
    }

    const recipe = recipeIngredients || recipeSteps ? {
      ingredients: recipeIngredients ? recipeIngredients.split('\n').map(item => item.trim()).filter(Boolean) : [],
      steps: recipeSteps ? recipeSteps.split('\n').map(item => item.trim()).filter(Boolean) : []
    } : undefined;

    const location = !Number.isNaN(locationLat) && !Number.isNaN(locationLng)
      ? { name: locationName, address: locationAddress, lat: locationLat, lng: locationLng }
      : undefined;

    const review = reviewEnabled ? { rating: Math.max(1, Math.min(5, reviewRating)) } : undefined;

    const postId = currentEditId || Date.now().toString();
    const post: Post = {
      id: postId,
      title,
      image: coverImageDataUrl || imageUrl || undefined,
      content,
      recipe,
      location,
      review,
      publishDate: publishDate || new Date().toISOString().slice(0, 10)
    };

    savePost(post);
    loadAdminPosts();
    resetPostForm();
  });
}

requireLogin();