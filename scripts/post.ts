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
}

const uiTranslations = {
  en: {
    recipeTitle: 'Recipe',
    ingredientsTitle: 'Ingredients',
    stepsTitle: 'Steps',
    portionsLabel: 'Portions',
    unitsLabel: 'Units',
    metricOption: 'Metric',
    imperialOption: 'Imperial',
    restaurantLocationTitle: 'Restaurant location',
    mapTitle: 'Map location for'
  },
  pl: {
    recipeTitle: 'Przepis',
    ingredientsTitle: 'Składniki',
    stepsTitle: 'Kroki',
    portionsLabel: 'Porcje',
    unitsLabel: 'Jednostki',
    metricOption: 'Metryczne',
    imperialOption: 'Imperialne',
    restaurantLocationTitle: 'Lokalizacja restauracji',
    mapTitle: 'Mapa lokalizacji dla'
  },
  sv: {
    recipeTitle: 'Recept',
    ingredientsTitle: 'Ingredienser',
    stepsTitle: 'Steg',
    portionsLabel: 'Portioner',
    unitsLabel: 'Enheter',
    metricOption: 'Metriska',
    imperialOption: 'Imperial',
    restaurantLocationTitle: 'Restaurangens plats',
    mapTitle: 'Kartplats för'
  }
};

function getCurrentLang(): 'en' | 'pl' | 'sv' {
  const stored = localStorage.getItem('siteLang') as 'en' | 'pl' | 'sv' | null;
  return stored && uiTranslations[stored] ? stored : 'en';
}

const staticPosts: { [key: string]: Post } = {
  hero1: {
    id: 'hero1',
    title: 'Dinner at Farang, Stockholm',
    image: 'resources/images/oysters.jpg',
    content: 'A memorable Nordic tasting menu experience at Farang in Stockholm. The chef\'s innovative take on traditional Scandinavian flavors created an unforgettable dining adventure. Each course was a perfect balance of local ingredients and modern techniques.',
    location: {
      name: 'Farang',
      address: 'Ringvägen 100, 118 61 Stockholm, Sweden',
      lat: 59.338, 
      lng: 18.071
    }
  },
  hero2: {
    id: 'hero2',
    title: 'Basque cheesecake at Ruby Grill',
    image: 'resources/images/cheesecake.jpg',
    content: 'Discovered this incredible Basque cheesecake at Ruby Grill. The burnt top and creamy interior make it a standout dessert. The restaurant\'s focus on seasonal ingredients shines through in every bite.',
    location: {
      name: 'Ruby Grill',
      address: 'Västermalmsgallerian, Stockholm, Sweden',
      lat: 59.3327,
      lng: 18.0454
    }
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

const postTranslations: { [lang: string]: { [id: string]: Partial<Post> } } = {
  pl: {
    hero1: {
      title: 'Kolacja w Farang, Sztokholm',
      content: 'Niezapomniane nordyckie menu degustacyjne w Farang w Sztokholmie. Innowacyjne podejście szefa kuchni do tradycyjnych skandynawskich smaków stworzyło niezapomnianą kulinarną przygodę. Każdy kurs był idealną równowagą lokalnych składników i nowoczesnych technik.'
    },
    hero2: {
      title: 'Sernik baskijski w Ruby Grill',
      content: 'Odkryłem niesamowity sernik baskijski w Ruby Grill. Przypalona skórka i kremowe wnętrze wyróżniają go jako deser. Restauracja stawia na sezonowe składniki, co widać w każdym kęsie.'
    },
    hero3: {
      title: 'Larb w domu',
      content: 'Odtwarzanie autentycznego tajskiego larb w domu. Świeże zioła, mięso mielone i idealna równowaga pikantnych, kwaśnych i słonych smaków. Udany eksperyment w przenoszeniu jakości restauracyjnej do kuchni.',
      recipe: {
        ingredients: [
          '300g mielonego kurczaka lub wieprzowiny',
          '1 szalotka, cienko pokrojona',
          '2 łyżki sosu rybnego',
          '2 łyżki soku z limonki',
          '1 łyżeczka prażonej mąki ryżowej',
          '5 liści limonki kaffir, cienko pokrojonych',
          'Garść kolendry i mięty',
          '1 mała czerwona chili, posiekana',
          '2 łyżki prażonej mąki ryżowej'
        ],
        steps: [
          'Upraż ryż na suchej patelni na złoty kolor, a następnie zmiel na proszek.',
          'Usmaż mięso na suchej patelni do ugotowania, odstaw.',
          'Wymieszaj sos rybny, sok z limonki i chili w misce.',
          'Połącz mięso z szalotką, ziołami, liśćmi limonki i prażonym proszkiem z ryżu.',
          'Dokładnie wymieszaj i podawaj z sałatą lub kapustą.'
        ]
      }
    }
  },
  sv: {
    hero1: {
      title: 'Middag på Farang, Stockholm',
      content: 'En minnesvärd nordisk avsmakningsmeny på Farang i Stockholm. Kockens innovativa tolkning av traditionella skandinaviska smaker skapade ett oförglömligt matäventyr. Varje rätt var en perfekt balans mellan lokala ingredienser och moderna tekniker.'
    },
    hero2: {
      title: 'Baskisk cheesecake på Ruby Grill',
      content: 'Upptäckte denna otroliga baskiska cheesecake på Ruby Grill. Den brända ytan och krämiga insidan gör den till en utstickande dessert. Restaurangens fokus på säsongsbetonade råvaror skinande igen i varje tugga.'
    },
    hero3: {
      title: 'Larb hemma',
      content: 'Återskapar autentisk thailändsk larb hemma. Färska örter, köttfärs och den perfekta balansen mellan kryddigt, surt och umami. Ett lyckat experiment att ta restaurangkvalitet till köket.',
      recipe: {
        ingredients: [
          '300g mald kyckling eller fläsk',
          '1 schalottenlök, tunt skivad',
          '2 matskedar fisksås',
          '2 matskedar limejuice',
          '1 tesked rostat rispulver',
          '5 kaffirblad, tunt skivade',
          'En näve koriander och mynta',
          '1 liten röd chili, hackad',
          '2 matskedar rostat rispulver'
        ],
        steps: [
          'Rosta ris i en torr panna tills gyllene och mal sedan till ett pulver.',
          'Koka köttfärsen i en torr stekpanna tills den är färdig och ställ åt sidan.',
          'Blanda fisksås, limejuice och chili i en skål.',
          'Blanda köttet med schalottenlök, örter, limeblad och rostat rispulver.',
          'Blanda väl och servera med salladsblad eller kål.'
        ]
      }
    }
  }
};

function getSiteLanguage(): string {
  return localStorage.getItem('siteLang') || 'en';
}

function translatePost(post: Post): Post {
  const lang = getSiteLanguage();
  if (lang === 'en') return post;

  const locale = postTranslations[lang];
  if (!locale || !locale[post.id]) return post;

  const override = locale[post.id];
  return {
    ...post,
    ...override,
    recipe: override.recipe || post.recipe
  };
}

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

  const currentPost = translatePost(post);
  const lang = getCurrentLang();
  const ui = uiTranslations[lang];

  let recipeHtml = '';
  if (currentPost.recipe) {
    recipeHtml = `
      <section class="recipe-block">
        <h2>${ui.recipeTitle}</h2>
        <div class="recipe-controls">
          <label>${ui.portionsLabel}
            <input id="portion-input" type="number" min="1" value="1" />
          </label>
          <label>${ui.unitsLabel}
            <select id="unit-select">
              <option value="metric">${ui.metricOption}</option>
              <option value="imperial">${ui.imperialOption}</option>
            </select>
          </label>
        </div>

        <div class="recipe-section">
          <h3>${ui.ingredientsTitle}</h3>
          <ul id="ingredients-list">
            ${currentPost.recipe.ingredients.map(item => `<li data-source="${item}">${formatIngredient(item, 1, 'metric')}</li>`).join('')}
          </ul>
        </div>
        <div class="recipe-section">
          <h3>${ui.stepsTitle}</h3>
          <ol>
            ${currentPost.recipe.steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </section>
    `;
  }

  let locationHtml = '';
  if (post.location) {
    const { lat, lng, name, address } = post.location;
    const delta = 0.006;
    const left = lng - delta;
    const right = lng + delta;
    const bottom = lat - delta;
    const top = lat + delta;
    const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;

    locationHtml = `
      <section class="location-block">
        <h3>${ui.restaurantLocationTitle}</h3>
        <p><strong>${name}</strong><br>${address}</p>
        <div class="map-wrapper">
          <iframe
            src="${mapSrc}"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="${ui.mapTitle} ${name}"
          ></iframe>
        </div>
      </section>
    `;
  }

  let reviewHtml = '';
  if (currentPost.review) {
    reviewHtml = `
      <div class="post-review">
        <div class="rating" aria-label="${currentPost.review.rating} out of 5 stars">
          ${'★'.repeat(currentPost.review.rating)}${'☆'.repeat(5 - currentPost.review.rating)}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <article class="full-post">
      ${currentPost.image ? `<img src="${currentPost.image}" alt="${currentPost.title}" class="post-hero-image" />` : ''}
      <h1>${currentPost.title}</h1>
      ${currentPost.publishDate ? `<p class="post-date">${new Date(currentPost.publishDate).toLocaleDateString()}</p>` : ''}
      ${reviewHtml}
      <div class="post-body">
        ${currentPost.content.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>
      ${locationHtml}
      ${recipeHtml}
      <a href="index.html" class="back-link">← Back to Home</a>
    </article>
  `;

  if (currentPost.recipe) {
    const portionInput = document.getElementById('portion-input') as HTMLInputElement;
    const unitSelect = document.getElementById('unit-select') as HTMLSelectElement;
    const ingredientsList = document.getElementById('ingredients-list') as HTMLUListElement;

    const updateIngredients = () => {
      const portions = Number(portionInput.value) || 1;
      const unitMode = (unitSelect.value as 'metric'|'imperial');
      const items = currentPost.recipe!.ingredients;
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