/*
 * App: UI state, hash router and event handling.
 *
 * Routes (hash based, so the app also works when opened as a local file):
 *   #/discover            #/discover/stores
 *   #/products?q=milk     #/recipes
 *   #/recipes/<id>        #/recipes/<id>/cost
 *   #/list
 */
(function (SuperSearch) {
  'use strict';

  const data = SuperSearch.data;
  const pricing = SuperSearch.pricing;
  const storage = SuperSearch.storage;
  const userLocation = SuperSearch.location;
  const views = SuperSearch.views;

  const FEATURED_RECIPE_ID = 'chicken-tikka-masala';
  const PRICE_GAP_ROWS = 6;
  const TOAST_MS = 3500;
  const VIEW_NAMES = ['discover', 'products', 'recipes', 'list'];
  const VIEW_TITLES = { discover: 'Discover', products: 'Products', recipes: 'Recipes', list: 'My list' };

  const ui = {
    route: { view: 'discover', id: null, section: null },
    inAppNavigations: 0,
    productQuery: '',
    productCategory: '',
    productSort: 'price',
    expandedProducts: new Set(),
    offerSort: 'price',
    recipeFilter: 'all',
    recipeSettings: {}
  };

  const $ = (selector) => document.querySelector(selector);

  /* ---------- Search ---------- */

  function normalise(text) {
    return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }

  // Every word of the query must appear somewhere in the text ("tikka chicken" works).
  function matches(text, query) {
    const haystack = normalise(text);
    return normalise(query).split(/\s+/).every((word) => haystack.includes(word));
  }

  function searchProducts(query, categoryId) {
    return data.products.filter((product) => {
      if (categoryId && product.category !== categoryId) return false;
      return !query || matches(product.name + ' ' + pricing.getCategory(product.category).name, query);
    });
  }

  // Recipes match by their name or by the name of an ingredient ("garlic").
  function searchRecipes(query) {
    return data.recipes.filter((recipe) => {
      const ingredientNames = recipe.ingredients.map((ingredient) => pricing.getProduct(ingredient.product).name);
      return matches(recipe.name + ' ' + ingredientNames.join(' '), query);
    });
  }

  function sortProducts(products, sortBy, distances) {
    const sorted = products.slice();
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    } else if (sortBy === 'distance') {
      sorted.sort((a, b) => {
        const nearestA = pricing.nearestOffer(a.id, distances);
        const nearestB = pricing.nearestOffer(b.id, distances);
        return nearestA.distanceKm - nearestB.distanceKm || nearestA.cents - nearestB.cents;
      });
    } else {
      sorted.sort((a, b) => pricing.cheapestOffer(a.id, distances).cents - pricing.cheapestOffer(b.id, distances).cents);
    }
    return sorted;
  }

  /* ---------- Recipe state ---------- */

  // Servings and "I have it" choices are kept per recipe while the page is open.
  function recipeSettings(recipe) {
    if (!ui.recipeSettings[recipe.id]) {
      const pantry = recipe.ingredients.filter((ingredient) => ingredient.pantry).map((ingredient) => ingredient.product);
      ui.recipeSettings[recipe.id] = { servings: recipe.servings, have: new Set(pantry) };
    }
    return ui.recipeSettings[recipe.id];
  }

  function recipeBasket(recipe) {
    const settings = recipeSettings(recipe);
    const lines = pricing.recipeLines(recipe, settings.servings, settings.have);
    return { settings, lines, comparison: pricing.compareBasket(lines, userLocation.getDistances()) };
  }

  function recipeCards(recipes, headingTag) {
    return recipes.map((recipe) => {
      const basket = recipeBasket(recipe);
      return views.recipeCard(recipe, basket.comparison, basket.settings.servings, headingTag);
    });
  }

  /* ---------- Rendering ---------- */

  function renderChrome() {
    const count = storage.getItems().filter((item) => !item.bought).length;
    const badge = $('#list-badge');
    badge.textContent = count;
    badge.hidden = count === 0;
    $('#list-badge-label').textContent = count ? ', ' + views.plural(count, 'item') + ' to buy' : '';

    const state = userLocation.getState();
    $('#location-chip-label').textContent =
      state.status === 'locating' ? 'Locating…' : state.source === 'device' ? 'Your location' : 'Demo location';

    const activeNav = ui.route.view === 'recipe' ? 'recipes' : ui.route.view;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === activeNav) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  function renderDiscover() {
    const distances = userLocation.getDistances();
    const featured = pricing.getRecipe(FEATURED_RECIPE_ID);
    const featuredBasket = recipeBasket(featured);
    $('#hero-receipt').innerHTML = views.heroReceipt(featured, featuredBasket.comparison, featuredBasket.settings.servings);
    $('#featured-recipes').innerHTML = views.recipeGrid(recipeCards(data.recipes, 'h3'));

    // The products where the gap between stores is largest, relative to their price.
    const biggestGaps = data.products
      .map((product) => ({ product, range: pricing.priceRange(product.id) }))
      .sort((a, b) => (b.range.max - b.range.min) / b.range.min - (a.range.max - a.range.min) / a.range.min)
      .slice(0, PRICE_GAP_ROWS)
      .map((entry) => entry.product);
    $('#price-spread').innerHTML = views.priceSpread(biggestGaps, distances);

    $('#store-list').innerHTML = views.storeList(distances);
    renderLocationStatus();
    renderSearchPreview();
    $('#quick-list-count').textContent = views.plural(storage.getItems().length, 'item');
  }

  function renderLocationStatus() {
    const state = userLocation.getState();
    const status = $('#location-status');
    status.textContent = views.locationMessage(state);
    status.dataset.status = state.status;
    $('#use-location').disabled = state.status === 'locating';
    $('#use-demo-location').hidden = state.source !== 'device';
  }

  function renderSearchPreview() {
    const query = $('#discover-query').value.trim();
    const products = query ? searchProducts(query, '') : [];
    const recipes = query ? searchRecipes(query) : [];
    $('#discover-results').innerHTML = query ? views.searchPreview(query, products, recipes, userLocation.getDistances()) : '';
    // A short summary for screen readers instead of reading the whole preview on every key press.
    $('#discover-status').textContent = query
      ? views.plural(recipes.length, 'recipe') + ' and ' + views.plural(products.length, 'product') + ' found'
      : '';
  }

  function renderProducts() {
    const distances = userLocation.getDistances();
    const category = pricing.getCategory(ui.productCategory);
    const results = sortProducts(searchProducts(ui.productQuery, ui.productCategory), ui.productSort, distances);

    $('#category-chips').innerHTML = views.categoryChips(ui.productCategory);
    $('#product-count').textContent =
      views.plural(results.length, 'product') +
      (category ? ' in ' + category.name : '') +
      (ui.productQuery ? ' matching “' + ui.productQuery + '”' : '');
    $('#product-results').innerHTML = views.productResults(results, {
      distances,
      expanded: ui.expandedProducts,
      offerSort: ui.offerSort,
      query: ui.productQuery,
      categoryName: category ? category.name : '',
      matchingRecipes: results.length === 0 && ui.productQuery ? searchRecipes(ui.productQuery) : []
    });
  }

  function renderRecipes() {
    const saved = data.recipes.filter((recipe) => storage.isFavourite(recipe.id));
    const shown = ui.recipeFilter === 'saved' ? saved : data.recipes;

    document.querySelectorAll('[data-action="recipe-filter"]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.id === ui.recipeFilter));
    });
    $('#saved-count').textContent = saved.length;

    $('#recipe-results').innerHTML = shown.length
      ? views.recipeGrid(recipeCards(shown, 'h2'))
      : views.emptyState({
          icon: 'heart',
          title: 'No saved recipes yet',
          text: 'Use the heart on a recipe to keep it here for next time.'
        });
  }

  function renderRecipeDetail() {
    const recipe = pricing.getRecipe(ui.route.id);
    const container = $('#recipe-detail');
    if (!recipe) {
      container.innerHTML =
        '<div class="container"><h1 id="recipe-title" tabindex="-1" class="visually-hidden">Recipe not found</h1>' +
        views.emptyState({
          icon: 'pot',
          title: 'Recipe not found',
          text: 'This recipe does not exist or the link is incomplete.',
          actions: [{ label: 'See all recipes', href: '#/recipes' }]
        }) +
        '</div>';
      return;
    }
    const basket = recipeBasket(recipe);
    container.innerHTML = views.recipeDetail(recipe, {
      servings: basket.settings.servings,
      lines: basket.lines,
      comparison: basket.comparison,
      distances: userLocation.getDistances()
    });
  }

  function renderList() {
    const items = storage.getItems();
    const distances = userLocation.getDistances();
    const toBuy = items
      .filter((item) => !item.bought)
      .map((item) => ({ productId: item.productId, packs: item.packs, have: false }));

    $('#list-items').innerHTML = views.listItems(items, distances);
    $('#list-summary').innerHTML = items.length ? views.listSummary(items, pricing.compareBasket(toBuy, distances), distances) : '';
    $('#list-summary').hidden = items.length === 0;
    $('#clear-list').hidden = items.length === 0;
    $('#storage-warning').hidden = storage.isPersistent();
  }

  const viewRenderers = {
    discover: renderDiscover,
    products: renderProducts,
    recipes: renderRecipes,
    recipe: renderRecipeDetail,
    list: renderList
  };

  // A CSS selector that finds "the same" control again after its HTML is replaced.
  function focusSelector(element) {
    if (!element || !element.dataset || !element.dataset.action) return null;
    let selector = '[data-action="' + element.dataset.action + '"]';
    ['id', 'sort', 'step'].forEach((key) => {
      if (element.dataset[key] !== undefined) selector += '[data-' + key + '="' + CSS.escape(element.dataset[key]) + '"]';
    });
    return selector;
  }

  // Re-renders the current view and keeps keyboard focus on the control the user was using.
  function refresh() {
    const selector = focusSelector(document.activeElement);
    renderChrome();
    viewRenderers[ui.route.view]();
    if (!selector) return;
    // Hidden views can contain the same buttons (e.g. recipe cards), so look in the visible one first.
    const target = document.querySelector('.view:not([hidden]) ' + selector) || document.querySelector(selector);
    if (target && !target.disabled) {
      target.focus();
    } else if (target) {
      const sibling = target.parentElement.querySelector('button:not([disabled])');
      if (sibling) sibling.focus();
    }
  }

  /* ---------- Router ---------- */

  function parseHash() {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const [path, queryString] = raw.split('?');
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    const params = new URLSearchParams(queryString || '');
    const view = parts[0] || 'discover';

    if (view === 'recipes' && parts[1]) return { view: 'recipe', id: parts[1], section: parts[2] || null, params };
    if (VIEW_NAMES.includes(view)) return { view, id: null, section: parts[1] || null, params };
    return { view: 'discover', id: null, section: null, params };
  }

  function showView(viewName) {
    document.querySelectorAll('.view').forEach((view) => {
      view.hidden = view.dataset.view !== viewName;
    });
  }

  function setDocumentTitle() {
    const recipe = ui.route.view === 'recipe' ? pricing.getRecipe(ui.route.id) : null;
    const name = recipe ? recipe.name : VIEW_TITLES[ui.route.view] || 'Recipe not found';
    document.title = name + ' · SuperSearch';
  }

  // Moves focus to the new content so keyboard and screen reader users start there.
  function focusRouteTarget() {
    const view = document.querySelector('.view:not([hidden])');
    const sectionTarget = ui.route.section && view.querySelector('#' + CSS.escape(ui.route.view === 'recipe' ? 'recipe-cost' : ui.route.section));
    const target = sectionTarget || view.querySelector('h1');
    if (sectionTarget) {
      sectionTarget.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
    if (target) target.focus({ preventScroll: true });
  }

  function onRouteChange(isFirstLoad) {
    ui.route = parseHash();

    if (ui.route.view === 'products' && ui.route.params.has('q')) {
      ui.productQuery = ui.route.params.get('q');
      ui.productCategory = '';
      $('#product-query').value = ui.productQuery;
    }

    showView(ui.route.view);
    renderChrome();
    viewRenderers[ui.route.view]();
    setDocumentTitle();

    if (!isFirstLoad) {
      ui.inAppNavigations += 1;
      focusRouteTarget();
    } else if (ui.route.section) {
      focusRouteTarget();
    }
  }

  function goBack() {
    // history.back() would leave SuperSearch if the detail page was opened directly.
    if (ui.inAppNavigations > 0) {
      window.history.back();
    } else {
      window.location.hash = '#/recipes';
    }
  }

  /* ---------- Feedback ---------- */

  let toastTimer = null;

  function toast(message) {
    const element = $('#toast');
    const unsaved = storage.isPersistent() ? '' : ' This browser is blocking storage, so it will not be kept after you close the page.';
    element.textContent = message + unsaved;
    element.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      element.classList.remove('is-visible');
      // Empty it after the fade so screen readers do not find stale text later.
      toastTimer = setTimeout(() => {
        element.textContent = '';
      }, 300);
    }, TOAST_MS);
  }

  /* ---------- Actions ---------- */

  function addRecipeToList(recipeId) {
    const recipe = pricing.getRecipe(recipeId);
    const lines = recipeBasket(recipe).lines.filter((line) => !line.have);
    if (lines.length === 0) {
      toast('Nothing to add: every ingredient is marked as already at home.');
      return;
    }
    storage.addLines(lines, recipe.id);
    toast('Added ' + views.plural(lines.length, 'item') + ' for ' + recipe.name + ' to your list.');
  }

  function changeServings(direction) {
    const recipe = pricing.getRecipe(ui.route.id);
    const settings = recipeSettings(recipe);
    const step = direction === 'up' ? 1 : -1;
    settings.servings = Math.min(data.settings.maxServings, Math.max(data.settings.minServings, settings.servings + step));
  }

  function toggleSetValue(set, value, forceOn) {
    if (forceOn) set.add(value);
    else set.delete(value);
  }

  function removeListItem(productId) {
    const checkboxes = [...document.querySelectorAll('[data-action="toggle-bought"]')];
    const index = checkboxes.findIndex((box) => box.dataset.id === productId);
    const name = pricing.getProduct(productId).name;
    storage.remove(productId);
    refresh();
    toast('Removed ' + name + ' from your list.');
    // Keep keyboard focus nearby instead of losing it with the removed row.
    const remaining = document.querySelectorAll('[data-action="toggle-bought"]');
    const next = remaining[Math.min(index, remaining.length - 1)];
    (next || $('#list-title')).focus();
  }

  function askToClearList() {
    const dialog = $('#clear-dialog');
    if (typeof dialog.showModal === 'function') {
      dialog.returnValue = '';
      dialog.showModal();
    } else if (window.confirm('Clear your shopping list? This removes every item.')) {
      clearList();
    }
  }

  function clearList() {
    storage.clear();
    refresh();
    toast('Your shopping list is now empty.');
    $('#list-title').focus();
  }

  function useDeviceLocation() {
    userLocation.requestDeviceLocation(() => {
      renderChrome();
      if (ui.route.view === 'discover') renderLocationStatus();
    });
  }

  const clickActions = {
    'add-product': (id) => {
      storage.addProduct(id, 1);
      toast('Added ' + pricing.getProduct(id).name + ' to your list.');
    },
    'toggle-offers': (id) => toggleSetValue(ui.expandedProducts, id, !ui.expandedProducts.has(id)),
    'offer-sort': (id, button) => {
      ui.offerSort = button.dataset.sort;
    },
    'filter-category': (id) => {
      ui.productCategory = id;
    },
    'recipe-filter': (id) => {
      ui.recipeFilter = id;
    },
    'add-recipe': addRecipeToList,
    'toggle-favourite': (id) => {
      const saved = storage.toggleFavourite(id);
      toast((saved ? 'Saved ' : 'Removed ') + pricing.getRecipe(id).name + (saved ? ' to your recipes.' : ' from your saved recipes.'));
    },
    servings: changeServings,
    'change-packs': (id, button) => storage.changePacks(id, Number(button.dataset.step)),
    'quick-search': (id, button) => {
      $('#discover-query').value = button.dataset.query;
      renderSearchPreview();
      $('#discover-query').focus();
      return false;
    },
    'use-location': () => {
      useDeviceLocation();
      return false;
    },
    'use-demo-location': () => {
      userLocation.useDemoLocation();
      $('#use-location').focus();
    }
  };

  // Actions that manage focus or re-rendering themselves.
  const standaloneActions = {
    'go-back': goBack,
    'remove-item': removeListItem,
    'clear-list': askToClearList
  };

  function onClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;

    if (standaloneActions[action]) {
      standaloneActions[action](id);
      return;
    }
    if (clickActions[action]) {
      // An action returns false when it does not need a full re-render.
      if (clickActions[action](id, button) !== false) refresh();
    }
  }

  function onChange(event) {
    const input = event.target;
    if (input.dataset.action === 'toggle-have') {
      const recipe = pricing.getRecipe(ui.route.id);
      toggleSetValue(recipeSettings(recipe).have, input.dataset.id, input.checked);
      refresh();
    } else if (input.dataset.action === 'toggle-bought') {
      storage.setBought(input.dataset.id, input.checked);
      refresh();
    } else if (input.id === 'product-sort') {
      ui.productSort = input.value;
      refresh();
    }
  }

  function bindEvents() {
    document.addEventListener('click', onClick);
    document.addEventListener('change', onChange);
    window.addEventListener('hashchange', () => onRouteChange(false));

    $('#discover-query').addEventListener('input', renderSearchPreview);
    $('#discover-search').addEventListener('submit', (event) => {
      event.preventDefault();
      const query = $('#discover-query').value.trim();
      window.location.hash = '#/products' + (query ? '?q=' + encodeURIComponent(query) : '');
    });

    $('#product-query').addEventListener('input', (event) => {
      ui.productQuery = event.target.value.trim();
      renderProducts();
    });
    $('#product-filters').addEventListener('submit', (event) => event.preventDefault());

    $('#clear-dialog').addEventListener('close', () => {
      if ($('#clear-dialog').returnValue === 'clear') clearList();
      else $('#clear-list').focus();
    });
  }

  function init() {
    document.querySelectorAll('[data-demo-notice]').forEach((element) => {
      element.textContent = data.demoNotice;
    });
    $('#product-sort').value = ui.productSort;
    bindEvents();
    onRouteChange(true);
  }

  init();
})(window.SuperSearch);
