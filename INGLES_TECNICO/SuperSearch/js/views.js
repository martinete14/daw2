/*
 * Views: functions that turn data into HTML strings.
 *
 * They do not change any state and do not attach events. Buttons carry
 * data-action / data-id attributes and app.js handles them with event
 * delegation. Every text value goes through escapeHtml().
 */
(function (SuperSearch) {
  'use strict';

  const data = SuperSearch.data;
  const pricing = SuperSearch.pricing;
  const storage = SuperSearch.storage;
  const price = pricing.formatPrice;

  /* ---------- Helpers ---------- */

  const htmlEscapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => htmlEscapes[char]);
  }

  function icon(name) {
    return '<svg class="icon" aria-hidden="true" focusable="false"><use href="#i-' + name + '"></use></svg>';
  }

  function plural(count, word, pluralWord) {
    return count + ' ' + (count === 1 ? word : pluralWord || word + 's');
  }

  // ["Lidl", "DIA", "Alcampo"] -> "Lidl, DIA and Alcampo"
  function joinNames(names) {
    if (names.length <= 1) return names.join('');
    return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  }

  function storeName(storeId) {
    return data.stores.find((store) => store.id === storeId).name;
  }

  function badge(text, tone) {
    return '<span class="badge badge-' + tone + '">' + escapeHtml(text) + '</span>';
  }

  function categoryTile(categoryId) {
    const category = pricing.getCategory(categoryId);
    return '<span class="tile tone-' + category.tone + '">' + icon(category.icon) + '</span>';
  }

  function packLabel(packs, product) {
    return packs + ' × ' + escapeHtml(product.pack.label);
  }

  function emptyState(options) {
    const actions = (options.actions || [])
      .map((action) => '<a class="btn btn-secondary" href="' + action.href + '">' + escapeHtml(action.label) + '</a>')
      .join('');
    return (
      '<div class="empty-state">' +
      '<span class="empty-icon">' + icon(options.icon) + '</span>' +
      '<p class="empty-title">' + escapeHtml(options.title) + '</p>' +
      '<p>' + options.text + '</p>' +
      (actions ? '<div class="empty-actions">' + actions + '</div>' : '') +
      '</div>'
    );
  }

  /* ---------- Products ---------- */

  function offerTable(product, distances, sortBy) {
    const offers = pricing.offersFor(product.id, distances);
    const cheapest = pricing.cheapestOffer(product.id, distances);
    const nearest = pricing.nearestOffer(product.id, distances);

    const rows = pricing.sortOffers(offers, sortBy).map((offer) => {
      if (!offer.available) {
        return (
          '<tr class="is-unavailable"><th scope="row">' + escapeHtml(offer.store.name) + '</th>' +
          '<td>' + pricing.formatDistance(offer.distanceKm) + '</td>' +
          '<td colspan="2">Not stocked</td></tr>'
        );
      }
      const labels = [];
      if (offer.store.id === cheapest.store.id) labels.push(badge('Lowest price', 'green'));
      if (offer.store.id === nearest.store.id) labels.push(badge('Nearest', 'blue'));
      const difference = offer.cents - cheapest.cents;
      return (
        '<tr><th scope="row">' + escapeHtml(offer.store.name) + ' ' + labels.join(' ') + '</th>' +
        '<td>' + pricing.formatDistance(offer.distanceKm) + '</td>' +
        '<td class="num"><strong>' + price(offer.cents) + '</strong>' +
        (difference > 0 ? '<span class="diff">+' + price(difference) + '</span>' : '') + '</td>' +
        '<td class="num col-unit">' + pricing.formatUnitPrice(offer.cents, product.pack) + '</td></tr>'
      );
    });

    const sortButton = (value, label) =>
      '<button type="button" class="segment" data-action="offer-sort" data-sort="' + value + '" aria-pressed="' +
      (sortBy === value) + '">' + label + '</button>';

    return (
      '<div class="offers" id="offers-' + product.id + '">' +
      '<div class="offers-head"><p>Price per pack · ' + escapeHtml(product.pack.label) + '</p>' +
      '<div class="segmented" role="group" aria-label="Sort stores by">' +
      sortButton('price', 'Price') + sortButton('distance', 'Distance') + '</div></div>' +
      '<table class="data-table"><caption class="visually-hidden">' + escapeHtml(product.name) +
      ' prices by store</caption><thead><tr><th scope="col">Store</th><th scope="col">Distance</th>' +
      '<th scope="col" class="num">Price</th><th scope="col" class="num col-unit">Unit price</th></tr></thead>' +
      '<tbody>' + rows.join('') + '</tbody></table></div>'
    );
  }

  function productRow(product, context) {
    const cheapest = pricing.cheapestOffer(product.id, context.distances);
    const range = pricing.priceRange(product.id);
    const category = pricing.getCategory(product.category);
    const inList = storage.packsInList(product.id);
    const expanded = context.expanded.has(product.id);

    return (
      '<li class="product-row' + (expanded ? ' is-open' : '') + '">' +
      '<div class="product-main">' +
      categoryTile(product.category) +
      '<div class="product-info">' +
      '<h2 class="product-name">' + escapeHtml(product.name) + '</h2>' +
      '<p class="muted">' + escapeHtml(product.pack.label) + ' · ' + escapeHtml(category.name) + '</p>' +
      '</div>' +
      '<div class="product-price">' +
      '<p><span class="muted">from</span> <strong>' + price(cheapest.cents) + '</strong></p>' +
      '<p class="muted">at ' + escapeHtml(cheapest.store.name) + ' · ' + pricing.formatDistance(cheapest.distanceKm) + '</p>' +
      '</div>' +
      '<p class="product-stock muted">In ' + range.storeCount + ' of ' + data.stores.length + ' stores' +
      (inList ? '<br><span class="in-list">' + icon('check') + plural(inList, 'pack') + ' in your list</span>' : '') +
      '</p>' +
      '<div class="product-actions">' +
      '<button type="button" class="btn btn-secondary btn-sm" data-action="toggle-offers" data-id="' + product.id +
      '" aria-expanded="' + expanded + '"' + (expanded ? ' aria-controls="offers-' + product.id + '"' : '') + '>' +
      icon('chevron') + (expanded ? 'Hide prices' : 'Compare prices') + '</button>' +
      '<button type="button" class="btn btn-primary btn-sm" data-action="add-product" data-id="' + product.id + '">' +
      icon('plus') + 'Add to list<span class="visually-hidden">: ' + escapeHtml(product.name) + '</span></button>' +
      '</div></div>' +
      (expanded ? offerTable(product, context.distances, context.offerSort) : '') +
      '</li>'
    );
  }

  function productResults(products, context) {
    if (products.length === 0) {
      // The main search covers recipes too, so point to matching recipes instead of a dead end.
      const recipes = context.matchingRecipes;
      return emptyState({
        icon: 'search',
        title: 'No products found',
        text: !context.query
          ? 'There are no products in this category yet.'
          : 'Nothing matches “' + escapeHtml(context.query) + '”' + (context.categoryName ? ' in ' + escapeHtml(context.categoryName) : '') +
            (recipes.length ? '. These recipes do:' : '. Check the spelling or try another category.'),
        actions: recipes.map((recipe) => ({ label: recipe.name, href: '#/recipes/' + recipe.id }))
      });
    }
    return '<ul class="product-list">' + products.map((product) => productRow(product, context)).join('') + '</ul>';
  }

  function categoryChips(selectedId) {
    const chip = (id, label) =>
      '<button type="button" class="chip" data-action="filter-category" data-id="' + id + '" aria-pressed="' +
      (selectedId === id) + '">' + escapeHtml(label) + '</button>';
    return chip('', 'All') + data.categories.map((category) => chip(category.id, category.name)).join('');
  }

  /* ---------- Recipes ---------- */

  function recipeCard(recipe, comparison, servings, headingTag) {
    const saved = storage.isFavourite(recipe.id);
    const tag = headingTag || 'h3';
    const best = comparison.bestSingle;
    return (
      '<article class="recipe-card">' +
      '<div class="recipe-media tone-' + recipe.tone + '"><img src="' + recipe.image + '" alt="" width="320" height="220" loading="lazy"></div>' +
      '<div class="recipe-body">' +
      '<' + tag + ' class="recipe-title"><a href="#/recipes/' + recipe.id + '">' + escapeHtml(recipe.name) + '</a></' + tag + '>' +
      '<p class="meta">' + icon('clock') + recipe.minutes + ' min <span aria-hidden="true">·</span> ' +
      icon('users') + plural(servings, 'serving') + '</p>' +
      '<p class="recipe-cost"><span class="muted">From</span> <strong>' + price(comparison.combined.cents) + '</strong>' +
      (best ? '<span class="muted"> · ' + price(best.cents) + ' all at ' + escapeHtml(best.store.name) + '</span>' : '') +
      '</p>' +
      '<div class="card-actions">' +
      '<a class="btn btn-secondary btn-sm" href="#/recipes/' + recipe.id + '/cost">Compare cost<span class="visually-hidden"> of ' + escapeHtml(recipe.name) + '</span></a>' +
      '<button type="button" class="btn btn-ghost btn-sm" data-action="add-recipe" data-id="' + recipe.id + '">' +
      icon('plus') + 'Add to list<span class="visually-hidden">: ingredients for ' + escapeHtml(recipe.name) + '</span></button>' +
      '</div></div>' +
      favouriteButton(recipe, saved, true) +
      '</article>'
    );
  }

  // A toggle button: the name stays the same and aria-pressed carries the state.
  function favouriteButton(recipe, saved, compact) {
    return (
      '<button type="button" class="' + (compact ? 'fav-btn' : 'btn btn-secondary fav-toggle') + (saved ? ' is-saved' : '') +
      '" data-action="toggle-favourite" data-id="' + recipe.id + '" aria-pressed="' + saved + '"' +
      (compact ? ' aria-label="Save ' + escapeHtml(recipe.name) + '"' : '') + '>' +
      icon('heart') + (compact ? '' : 'Save recipe') + '</button>'
    );
  }

  function recipeGrid(cards) {
    return '<div class="recipe-grid">' + cards.join('') + '</div>';
  }

  function ingredientRow(line) {
    const product = pricing.getProduct(line.productId);
    const inputId = 'have-' + product.id;
    return (
      '<li class="ingredient' + (line.have ? ' is-have' : '') + '">' +
      '<input type="checkbox" class="check" id="' + inputId + '" data-action="toggle-have" data-id="' + product.id + '"' +
      (line.have ? ' checked' : '') + '>' +
      '<label for="' + inputId + '"><span class="visually-hidden">I already have </span>' +
      '<span class="ingredient-name">' + escapeHtml(product.name) + '</span>' +
      '<span class="ingredient-amount">' + pricing.formatAmount(line.amount, product.pack.unit) +
      (line.note ? ' <span class="muted">(' + escapeHtml(line.note) + ')</span>' : '') + '</span></label>' +
      '<span class="ingredient-buy">' + (line.have ? 'At home' : 'Buy ' + packLabel(line.packs, product)) + '</span>' +
      '</li>'
    );
  }

  function recipeDetail(recipe, context) {
    const lines = context.lines;
    const saved = storage.isFavourite(recipe.id);
    const toBuy = lines.filter((line) => !line.have).length;
    const settings = data.settings;

    return (
      '<div class="container">' +
      '<button type="button" class="back-link" data-action="go-back">' + icon('arrow-left') + 'Back</button>' +
      '<div class="recipe-hero">' +
      '<div class="recipe-hero-media tone-' + recipe.tone + '"><img src="' + recipe.image + '" alt="Illustration of ' +
      escapeHtml(recipe.name) + '" width="320" height="220"></div>' +
      '<div class="recipe-hero-body">' +
      '<p class="eyebrow">Recipe</p>' +
      '<h1 id="recipe-title" tabindex="-1">' + escapeHtml(recipe.name) + '</h1>' +
      '<p class="lede">' + escapeHtml(recipe.summary) + '</p>' +
      '<p class="meta">' + icon('clock') + recipe.minutes + ' min <span aria-hidden="true">·</span> ' +
      icon('basket') + plural(recipe.ingredients.length, 'ingredient') + '</p>' +
      '<div class="hero-controls">' +
      '<div class="stepper" role="group" aria-labelledby="servings-label">' +
      '<span id="servings-label" class="stepper-label">Servings</span>' +
      '<button type="button" class="stepper-btn" data-action="servings" data-id="down" aria-label="Fewer servings"' +
      (context.servings <= settings.minServings ? ' disabled' : '') + '>' + icon('minus') + '</button>' +
      '<output class="stepper-value" aria-live="polite">' + context.servings + '</output>' +
      '<button type="button" class="stepper-btn" data-action="servings" data-id="up" aria-label="More servings"' +
      (context.servings >= settings.maxServings ? ' disabled' : '') + '>' + icon('plus') + '</button>' +
      '</div>' +
      '<button type="button" class="btn btn-primary" data-action="add-recipe" data-id="' + recipe.id + '"' +
      (toBuy === 0 ? ' disabled' : '') + '>' + icon('plus') + 'Add ' + plural(toBuy, 'item') + ' to list</button>' +
      favouriteButton(recipe, saved, false) +
      '</div></div></div>' +
      '<div class="recipe-layout">' +
      '<div class="recipe-main">' +
      '<section class="panel" aria-labelledby="ingredients-title">' +
      '<h2 id="ingredients-title">Ingredients</h2>' +
      '<p class="muted">Tick anything you already have at home. It is left out of the cost and the shopping list.</p>' +
      '<ul class="ingredient-list">' + lines.map(ingredientRow).join('') + '</ul>' +
      '</section>' +
      '<section class="panel" aria-labelledby="method-title">' +
      '<h2 id="method-title">Method</h2>' +
      '<ol class="method">' + recipe.steps.map((step) => '<li>' + escapeHtml(step) + '</li>').join('') + '</ol>' +
      '</section></div>' +
      '<section class="receipt" id="recipe-cost" aria-labelledby="cost-title" tabindex="-1">' +
      comparisonPanel(context.comparison, {
        title: 'Cost comparison',
        titleId: 'cost-title',
        subtitle: plural(context.servings, 'serving') + ' · ' + plural(toBuy, 'item') + ' to buy',
        distances: context.distances,
        emptyText: 'You have marked every ingredient as already at home, so there is nothing to buy.'
      }) +
      '</section></div></div>'
    );
  }

  /* ---------- Basket comparison (recipes and shopping list) ---------- */

  function verdictText(comparison) {
    const best = comparison.bestSingle;
    const combined = comparison.combined;
    const splitStores = joinNames(combined.storeIds.map(storeName));
    const stops = plural(comparison.extraStores, 'extra stop');

    switch (comparison.verdict) {
      case 'single-best':
        return {
          title: best.store.name + ' has the lowest total',
          text: 'Buying everything at ' + best.store.name + ' costs ' + price(best.cents) +
            '. Splitting the shop would not make it any cheaper, so one trip is enough.'
        };
      case 'split-saves':
        return {
          title: 'Splitting the shop saves ' + price(comparison.saving),
          text: 'Buying each item where it is cheapest costs ' + price(combined.cents) + ' at ' + splitStores +
            '. That is ' + price(comparison.saving) + ' less than ' + best.store.name + ', the best single store, but it means ' +
            stops + '.'
        };
      case 'split-small':
        return {
          title: 'Splitting saves only ' + price(comparison.saving),
          text: 'The lowest possible total is ' + price(combined.cents) + ', but it needs ' + plural(combined.storeIds.length, 'store') +
            ' (' + splitStores + '). ' + best.store.name + ' has everything for ' + price(best.cents) +
            ', so the saving may not be worth ' + stops + '.'
        };
      case 'no-single-store':
        return {
          title: 'No single store has everything',
          text: 'The cheapest way to get every item costs ' + price(combined.cents) + ' at ' + splitStores + '.'
        };
      default:
        return null;
    }
  }

  function storeTable(comparison) {
    const best = comparison.bestSingle;
    const nearest = comparison.nearestComplete;
    const itemCount = comparison.lines.length;

    const rows = comparison.stores.map((entry) => {
      const labels = [];
      if (best && entry.store.id === best.store.id) labels.push(badge('Best single-store option', 'green'));
      if (nearest && entry.store.id === nearest.store.id) labels.push(badge('Nearest option', 'blue'));
      const missingNames = entry.missing.map((id) => pricing.getProduct(id).name);
      return (
        '<tr' + (entry.complete ? '' : ' class="is-unavailable"') + '>' +
        '<th scope="row">' + escapeHtml(entry.store.name) + (labels.length ? '<span class="badges">' + labels.join('') + '</span>' : '') + '</th>' +
        '<td>' + pricing.formatDistance(entry.distanceKm) + '</td>' +
        '<td class="num">' +
        (entry.complete
          ? '<strong>' + price(entry.cents) + '</strong>'
          : '<span class="muted">' + price(entry.cents) + '</span>' +
            '<span class="missing">' + (itemCount - entry.missing.length) + ' of ' + itemCount + ' items. Missing: ' +
            escapeHtml(missingNames.join(', ')) + '</span>') +
        '</td></tr>'
      );
    });

    return (
      '<table class="data-table store-table"><caption class="visually-hidden">Total cost at each store</caption>' +
      '<thead><tr><th scope="col">Store</th><th scope="col">Distance</th><th scope="col" class="num">Total</th></tr></thead>' +
      '<tbody>' + rows.join('') + '</tbody></table>'
    );
  }

  function splitBreakdown(comparison, distances) {
    const groups = comparison.combined.storeIds.map((storeId) => {
      const picks = comparison.combined.picks.filter((pick) => pick.store.id === storeId);
      const subtotal = picks.reduce((sum, pick) => sum + pick.cents, 0);
      const items = picks.map((pick) => {
        const product = pricing.getProduct(pick.productId);
        return '<li><span>' + pick.packs + ' × ' + escapeHtml(product.name) + '</span><span class="num">' + price(pick.cents) + '</span></li>';
      });
      return (
        '<div class="split-store"><p class="split-store-name">' + icon('store') + escapeHtml(storeName(storeId)) +
        ' <span class="muted">· ' + pricing.formatDistance(distances[storeId]) + '</span><span class="num">' + price(subtotal) + '</span></p>' +
        '<ul>' + items.join('') + '</ul></div>'
      );
    });
    return (
      '<details class="split-details"><summary>' + icon('chevron') + 'Where to buy each item for ' + price(comparison.combined.cents) + '</summary>' +
      groups.join('') + '</details>'
    );
  }

  function comparisonPanel(comparison, options) {
    const head =
      '<header class="receipt-head"><h2 id="' + options.titleId + '">' + escapeHtml(options.title) + '</h2>' +
      '<p class="muted">' + escapeHtml(options.subtitle) + '</p></header>';
    const notice = '<p class="fine-print">' + icon('info') + 'Totals count the whole packs you need to buy. Leftovers are not deducted. ' +
      escapeHtml(data.demoNotice) + '</p>';

    if (comparison.verdict === 'empty') {
      return head + '<p class="verdict">' + escapeHtml(options.emptyText) + '</p>' + notice;
    }

    const verdict = verdictText(comparison);
    const best = comparison.bestSingle;
    const combined = comparison.combined;
    const nearest = comparison.nearestComplete;
    const distances = options.distances;

    let nearestNote = '';
    if (best && nearest && nearest.store.id !== best.store.id) {
      nearestNote =
        '<p class="nearest-note">' + icon('pin') + 'Prefer fewer kilometres? ' + escapeHtml(nearest.store.name) + ' is the nearest store with everything (' +
        pricing.formatDistance(nearest.distanceKm) + '): ' + price(nearest.cents) + ', ' + price(nearest.cents - best.cents) +
        ' more than ' + escapeHtml(best.store.name) + '.</p>';
    }

    return (
      head +
      '<div class="verdict verdict-' + comparison.verdict + '"><p class="verdict-title">' + escapeHtml(verdict.title) + '</p>' +
      '<p>' + escapeHtml(verdict.text) + '</p></div>' +
      '<dl class="totals">' +
      '<div><dt>One store<span>' + (best ? escapeHtml(best.store.name) + ' · ' + pricing.formatDistance(best.distanceKm) : 'Not possible with the demo stores') +
      '</span></dt><dd>' + (best ? price(best.cents) : '—') + '</dd></div>' +
      '<div><dt>Split basket<span>' + plural(combined.storeIds.length, 'store') + ' · ' + escapeHtml(joinNames(combined.storeIds.map(storeName))) +
      '</span></dt><dd>' + price(combined.cents) + '</dd></div>' +
      '<div class="totals-diff"><dt>Difference</dt><dd>' + (best ? price(comparison.saving) : '—') + '</dd></div>' +
      '</dl>' +
      nearestNote +
      '<h3 class="receipt-subtitle">Every store</h3>' +
      storeTable(comparison) +
      splitBreakdown(comparison, distances) +
      notice
    );
  }

  /* ---------- Shopping list ---------- */

  function listItemRow(item, distances) {
    const product = pricing.getProduct(item.productId);
    const cheapest = pricing.cheapestOffer(product.id, distances);
    const checkId = 'bought-' + product.id;
    const fromRecipes = item.recipes.map((id) => pricing.getRecipe(id).name);
    return (
      '<li class="list-item' + (item.bought ? ' is-bought' : '') + '">' +
      '<input type="checkbox" class="check" id="' + checkId + '" data-action="toggle-bought" data-id="' + product.id + '"' +
      (item.bought ? ' checked' : '') + '>' +
      '<label for="' + checkId + '"><span class="list-item-name">' + escapeHtml(product.name) + '</span>' +
      '<span class="muted">' + escapeHtml(product.pack.label) + ' · from ' + price(cheapest.cents) + ' at ' + escapeHtml(cheapest.store.name) +
      (fromRecipes.length ? ' · for ' + escapeHtml(joinNames(fromRecipes)) : '') + '</span></label>' +
      '<div class="stepper stepper-sm" role="group" aria-label="Packs of ' + escapeHtml(product.name) + '">' +
      '<button type="button" class="stepper-btn" data-action="change-packs" data-id="' + product.id + '" data-step="-1" aria-label="One pack fewer"' +
      (item.packs <= 1 ? ' disabled' : '') + '>' + icon('minus') + '</button>' +
      '<output class="stepper-value">' + item.packs + '</output>' +
      '<button type="button" class="stepper-btn" data-action="change-packs" data-id="' + product.id + '" data-step="1" aria-label="One pack more">' +
      icon('plus') + '</button></div>' +
      '<span class="list-item-total num">' + price(cheapest.cents * item.packs) + '</span>' +
      '<button type="button" class="icon-btn" data-action="remove-item" data-id="' + product.id + '" aria-label="Remove ' +
      escapeHtml(product.name) + '">' + icon('close') + '</button>' +
      '</li>'
    );
  }

  function listItems(items, distances) {
    if (items.length === 0) {
      return emptyState({
        icon: 'list',
        title: 'Your list is empty',
        text: 'Add products one by one, or add all the ingredients of a recipe in one go.',
        actions: [{ label: 'Browse products', href: '#/products' }, { label: 'Choose a recipe', href: '#/recipes' }]
      });
    }
    return data.categories
      .map((category) => {
        const group = items.filter((item) => pricing.getProduct(item.productId).category === category.id);
        if (group.length === 0) return '';
        return (
          '<section class="list-group" aria-label="' + escapeHtml(category.name) + '">' +
          '<h2 class="list-group-title">' + categoryTile(category.id) + escapeHtml(category.name) + '</h2>' +
          '<ul class="list-items">' + group.map((item) => listItemRow(item, distances)).join('') + '</ul></section>'
        );
      })
      .join('');
  }

  function listSummary(items, comparison, distances) {
    const remaining = items.filter((item) => !item.bought).length;
    const bought = items.length - remaining;
    const progress =
      '<p class="list-progress" id="list-progress-label"><strong>' + bought + ' of ' + items.length + '</strong> bought</p>' +
      '<progress class="progress" max="' + items.length + '" value="' + bought + '" aria-labelledby="list-progress-label"></progress>';

    return (
      progress +
      comparisonPanel(comparison, {
        title: 'Basket estimate',
        titleId: 'basket-title',
        subtitle: 'For the ' + plural(remaining, 'item') + ' still to buy',
        distances,
        emptyText: 'Everything on your list is ticked off. Nice work!'
      })
    );
  }

  /* ---------- Discover ---------- */

  function heroReceipt(recipe, comparison, servings) {
    const best = comparison.bestSingle;
    const nearest = comparison.nearestComplete;
    const rows = comparison.stores
      .filter((entry) => entry.complete)
      .slice(0, 3)
      .map((entry) => {
        let note = '';
        if (best && entry.store.id === best.store.id) note = 'best single store';
        else if (nearest && entry.store.id === nearest.store.id) note = 'nearest';
        return '<li><span>' + escapeHtml(entry.store.name) + (note ? ' <em>' + note + '</em>' : '') + '</span><span class="num">' + price(entry.cents) + '</span></li>';
      });

    return (
      '<p class="receipt-kicker">Basket check</p>' +
      '<h2 class="receipt-title" id="receipt-title">' + escapeHtml(recipe.name) + '</h2>' +
      '<p class="muted">' + plural(servings, 'serving') + ' · everything at one store</p>' +
      '<ul class="receipt-lines">' + rows.join('') + '</ul>' +
      '<ul class="receipt-lines receipt-total">' +
      '<li><span>Split basket <em>' + escapeHtml(joinNames(comparison.combined.storeIds.map(storeName))) + '</em></span><span class="num">' +
      price(comparison.combined.cents) + '</span></li>' +
      '<li class="receipt-save"><span>' + (comparison.saving > 0 ? 'You save' : 'Difference') + '</span><span class="num">' + price(comparison.saving) + '</span></li>' +
      '</ul>' +
      '<a class="btn btn-primary btn-block" href="#/recipes/' + recipe.id + '/cost">See the full comparison' + icon('arrow-right') + '</a>' +
      '<p class="receipt-foot">Demo prices</p>'
    );
  }

  function searchPreview(query, products, recipes, distances) {
    if (!query) return '';
    if (products.length === 0 && recipes.length === 0) {
      return '<p class="preview-empty">No products or recipes match “' + escapeHtml(query) + '”. Try “rice”, “eggs” or “pasta”.</p>';
    }
    const productLinks = products.slice(0, 4).map((product) => {
      const cheapest = pricing.cheapestOffer(product.id, distances);
      return '<li><a href="#/products?q=' + encodeURIComponent(product.name) + '">' + categoryTile(product.category) +
        '<span>' + escapeHtml(product.name) + '<small>' + escapeHtml(product.pack.label) + '</small></span>' +
        '<span class="num">from ' + price(cheapest.cents) + '</span></a></li>';
    });
    const recipeLinks = recipes.slice(0, 3).map((recipe) =>
      '<li><a href="#/recipes/' + recipe.id + '"><span class="tile tone-' + recipe.tone + '">' + icon('pot') + '</span>' +
      '<span>' + escapeHtml(recipe.name) + '<small>' + recipe.minutes + ' min · ' + plural(recipe.ingredients.length, 'ingredient') + '</small></span>' +
      icon('arrow-right') + '</a></li>'
    );
    return (
      (recipeLinks.length ? '<p class="preview-label">Recipes</p><ul class="preview-list">' + recipeLinks.join('') + '</ul>' : '') +
      (productLinks.length ? '<p class="preview-label">Products</p><ul class="preview-list">' + productLinks.join('') + '</ul>' : '') +
      (products.length ? '<a class="text-link" href="#/products?q=' + encodeURIComponent(query) + '">See all ' +
        plural(products.length, 'matching product') + icon('arrow-right') + '</a>' : '')
    );
  }

  function priceSpread(products, distances) {
    const rows = products.map((product) => {
      const range = pricing.priceRange(product.id);
      const cheapest = pricing.cheapestOffer(product.id, distances);
      return (
        '<tr><th scope="row"><span class="cell-product">' + categoryTile(product.category) +
        '<span>' + escapeHtml(product.name) + '<small>' + escapeHtml(product.pack.label) + '</small></span></span></th>' +
        '<td class="num"><strong>' + price(range.min) + '</strong><small>' + escapeHtml(cheapest.store.name) + '</small></td>' +
        '<td class="num col-unit">' + price(range.max) + '</td>' +
        '<td class="num"><span class="gap">' + price(range.max - range.min) + '</span></td></tr>'
      );
    });
    return (
      '<table class="data-table spread-table"><caption class="visually-hidden">Lowest and highest demo price per product</caption>' +
      '<thead><tr><th scope="col">Product</th><th scope="col" class="num">Lowest</th><th scope="col" class="num col-unit">Highest</th>' +
      '<th scope="col" class="num">Gap</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>'
    );
  }

  const locationMessages = {
    idle: 'Distances are measured from a demo location in the city centre.',
    locating: 'Asking your browser for your location…',
    denied: 'Location permission was denied, so we are using the demo location. You can allow it later in your browser settings.',
    unavailable: 'Your position is not available right now, so we are using the demo location.',
    timeout: 'Finding your location took too long, so we are using the demo location.',
    unsupported: 'This browser does not support location, so we are using the demo location.',
    insecure: 'Location only works on a secure page (https or localhost). We are using the demo location. The README explains how to run SuperSearch on localhost.'
  };

  function locationMessage(state) {
    if (state.status === 'granted') {
      return 'Using your device location (accurate to about ' + state.accuracyM + ' m). SuperSearch is not connected to real store data yet, so store positions and distances are still demo examples.';
    }
    return locationMessages[state.status];
  }

  function storeList(distances) {
    return data.stores
      .slice()
      .sort((a, b) => distances[a.id] - distances[b.id])
      .map((store) => {
        const stocked = data.products.filter((product) => typeof product.prices[store.id] === 'number').length;
        return (
          '<li><span class="tile tone-green">' + icon('store') + '</span>' +
          '<span class="store-name">' + escapeHtml(store.name) + '<small>' + escapeHtml(store.area) + ' · ' + stocked + ' of ' + data.products.length + ' products</small></span>' +
          '<span class="store-distance num">' + pricing.formatDistance(distances[store.id]) + '</span></li>'
        );
      })
      .join('');
  }

  SuperSearch.views = {
    plural,
    productResults,
    categoryChips,
    recipeCard,
    recipeGrid,
    recipeDetail,
    listItems,
    listSummary,
    heroReceipt,
    searchPreview,
    priceSpread,
    locationMessage,
    storeList,
    emptyState
  };
})(window.SuperSearch);
