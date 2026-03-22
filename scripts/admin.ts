interface Post {
  id: string;
  title: string;
  image?: string;
  content: string;
}

const PASSWORD = 'admin123'; // Change this to a secure password

function checkAuth(): boolean {
  const auth = localStorage.getItem('adminAuth');
  if (auth === 'true') return true;
  
  const password = prompt('Enter admin password:');
  if (password === PASSWORD) {
    localStorage.setItem('adminAuth', 'true');
    return true;
  }
  return false;
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

function initCMS() {
  if (!checkAuth()) {
    alert('Access denied');
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('login-form')!.classList.add('hidden');
  document.getElementById('cms-content')!.classList.remove('hidden');

  const form = document.getElementById('new-post-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = (document.getElementById('post-title') as HTMLInputElement).value;
    const image = (document.getElementById('post-image') as HTMLInputElement).value;
    const content = (document.getElementById('post-content') as HTMLTextAreaElement).value;

    const post: Post = {
      id: Date.now().toString(),
      title,
      image: image || undefined,
      content
    };

    savePost(post);
    loadAdminPosts();
    form.reset();
  });

  loadAdminPosts();
}

// Make deletePost global
(window as any).deletePost = deletePost;

initCMS();