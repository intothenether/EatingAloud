interface Recipe {
  ingredients: string[];
  steps: string[];
}

interface Post {
  id: string;
  title: string;
  image?: string;
  content: string;
  recipe?: Recipe;
}

const staticPosts: { [key: string]: Post } = {
  hero1: {
    id: 'hero1',
    title: 'Dinner at Farang, Stockholm',
    image: 'resources/images/oysters.jpg',
    content: 'A memorable Nordic tasting menu experience at Farang in Stockholm. The chef\'s innovative take on traditional Scandinavian flavors created an unforgettable dining adventure. Each course was a perfect balance of local ingredients and modern techniques.'
  },
  hero2: {
    id: 'hero2',
    title: 'Basque cheesecake at Ruby Grill',
    image: 'resources/images/cheesecake.jpg',
    content: 'Discovered this incredible Basque cheesecake at Ruby Grill. The burnt top and creamy interior make it a standout dessert. The restaurant\'s focus on seasonal ingredients shines through in every bite.'
  },
  hero3: {
    id: 'hero3',
    title: 'Larb at home',
    image: 'resources/images/larb.jpg',
    content: 'Recreating authentic Thai larb at home. Fresh herbs, ground meat, and the perfect balance of spicy, sour, and savory flavors. A successful experiment in bringing restaurant-quality dishes to the kitchen.',
    recipe: {
      ingredients: [
        '300g ground chicken or pork',
        '1 shallot, thinly sliced',
        '2 tablespoons fish sauce',
        '2 tablespoons lime juice',
        '1 teaspoon toasted rice powder',
        '5 kaffir lime leaves, thinly sliced',
        'Handful cilantro and mint leaves',
        '1 small red chili, chopped',
        '2 tablespoons toasted rice powder'
      ],
      steps: [
        'Toast rice in a dry pan until golden, then grind to a powder.',
        'Cook ground meat in a dry skillet until done and set aside.',
        'Mix fish sauce, lime juice, and chillies in a bowl.',
        'Combine meat with shallots, herbs, lime leaves, and toasted rice powder.',
        'Toss thoroughly and serve with lettuce wraps or cabbage.'
      ]
    }
  }
};

function getPostById(id: string): Post | null {
  // Check static posts first
  if (staticPosts[id]) {
    return staticPosts[id];
  }

  // Check dynamic posts
  const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]') as Post[];
  return posts.find(p => p.id === id) || null;
}

function normalizeIngredient(ingredient: string): {amount: number|null,unit:string,rest:string} {
  const match = ingredient.match(/^\s*([\d/.]+)\s*([a-zA-Zµ°]+)?\s*(.*)$/);
  if (!match) return { amount: null, unit: '', rest: ingredient};

  let amount: number | null = parseFloat(match[1]);
  if (isNaN(amount)) {
    const fracMatch = match[1].match(/^(\d+)\/(\d+)$/);
    if (fracMatch) amount = parseInt(fracMatch[1],10)/parseInt(fracMatch[2],10);
    else amount = null;
  }

  const unit = match[2] || '';
  return { amount, unit, rest: match[3] };
}

function formatIngredient(item: string, scale: number, unitMode: 'metric'|'imperial'): string {
  const parsed = normalizeIngredient(item);
  if (parsed.amount === null) return item;

  const scaled = parsed.amount * scale;

  let converted = scaled;
  let unit = parsed.unit;

  if (unitMode === 'imperial') {
    if (unit === 'g') {
      converted = scaled / 28.35;
      unit = 'oz';
    } else if (unit === 'kg') {
      converted = scaled * 2.20462;
      unit = 'lb';
    } else if (unit === 'ml') {
      converted = scaled / 29.5735;
      unit = 'floz';
    } else if (unit === 'l') {
      converted = scaled * 33.814;
      unit = 'floz';
    }
  } else {
    if (unit === 'oz') {
      converted = scaled * 28.35;
      unit = 'g';
    } else if (unit === 'lb') {
      converted = scaled / 2.20462;
      unit = 'kg';
    } else if (unit === 'floz') {
      converted = scaled * 29.5735;
      unit = 'ml';
    }
  }

  return `${converted.toFixed(2)} ${unit} ${parsed.rest}`.trim();
}

function renderPost(post: Post) {
  const container = document.getElementById('post-content');
  if (!container) return;

  let recipeHtml = '';
  if (post.recipe) {
    recipeHtml = `
      <section class="recipe-block">
        <h2>Recipe</h2>
        <div class="recipe-controls">
          <label>Portions
            <input id="portion-input" type="number" min="1" value="1" />
          </label>
          <label>Units
            <select id="unit-select">
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </label>
        </div>

        <div class="recipe-section">
          <h3>Ingredients</h3>
          <ul id="ingredients-list">
            ${post.recipe.ingredients.map(item => `<li data-source="${item}">${formatIngredient(item, 1, 'metric')}</li>`).join('')}
          </ul>
        </div>
        <div class="recipe-section">
          <h3>Steps</h3>
          <ol>
            ${post.recipe.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </section>
    `;
  }

  container.innerHTML = `
    <article class="full-post">
      ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-hero-image" />` : ''}
      <h1>${post.title}</h1>
      <div class="post-body">
        ${post.content.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>
      ${recipeHtml}
      <a href="index.html" class="back-link">← Back to Home</a>
    </article>
  `;

  if (post.recipe) {
    const portionInput = document.getElementById('portion-input') as HTMLInputElement;
    const unitSelect = document.getElementById('unit-select') as HTMLSelectElement;
    const ingredientsList = document.getElementById('ingredients-list') as HTMLUListElement;

    const updateIngredients = () => {
      const portions = Number(portionInput.value) || 1;
      const unitMode = (unitSelect.value as 'metric'|'imperial');
      const items = post.recipe!.ingredients;
      ingredientsList.innerHTML = items.map(item => `<li>${formatIngredient(item, portions, unitMode)}</li>`).join('');
    };

    portionInput.addEventListener('input', updateIngredients);
    unitSelect.addEventListener('change', updateIngredients);
  }
}

function initPostPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id') || '';

  // Also support hash-based navigation for convenience
  if (!id) {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('id=')) {
      id = hash.replace('id=', '');
    } else if (hash) {
      id = hash;
    }
  }

  console.log('URL params:', { id });
  console.log('Static posts available:', Object.keys(staticPosts));

  if (!id) {
    document.getElementById('post-content')!.innerHTML = '<p>Post not found: no ID in URL.</p>';
    return;
  }

  const post = getPostById(id);
  console.log('Post found:', post);
  
  if (post) {
    renderPost(post);
  } else {
    document.getElementById('post-content')!.innerHTML = `<p>Post not found: "${id}" does not exist.</p>`;
  }
}

initPostPage();