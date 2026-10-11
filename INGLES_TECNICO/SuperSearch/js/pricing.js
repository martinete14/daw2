/*
 * Pricing: pure calculations and formatting.
 *
 * Nothing here touches the DOM, so every view gets the same numbers.
 * Money is handled in integer cents to avoid floating point drift
 * (0.1 + 0.2 !== 0.3) when adding many prices together.
 */
(function (SuperSearch) {
  'use strict';

  const data = SuperSearch.data;
  const settings = data.settings;

  const productById = new Map(data.products.map((product) => [product.id, product]));
  const recipeById = new Map(data.recipes.map((recipe) => [recipe.id, recipe]));
  const categoryById = new Map(data.categories.map((category) => [category.id, category]));

  const moneyFormat = new Intl.NumberFormat(settings.locale, { style: 'currency', currency: settings.currency });
  const kmFormat = new Intl.NumberFormat(settings.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  /* ---------- Formatting ---------- */

  function toCents(euros) {
    return Math.round(euros * 100);
  }

  function formatPrice(cents) {
    return moneyFormat.format(cents / 100);
  }

  function formatDistance(km) {
    return kmFormat.format(km) + ' km';
  }

  function formatAmount(amount, unit) {
    if (unit === 'g' || unit === 'ml') {
      if (amount >= 1000) {
        return kmFormat.format(amount / 1000).replace(/,0$/, '') + (unit === 'g' ? ' kg' : ' L');
      }
      return amount + ' ' + unit;
    }
    return amount + ' ' + unit + (amount === 1 ? '' : 's');
  }

  // Price per kg, per litre or per item, so packs of different sizes can be compared.
  function formatUnitPrice(cents, pack) {
    if (pack.unit === 'g' || pack.unit === 'ml') {
      const perThousand = Math.round((cents * 1000) / pack.size);
      return formatPrice(perThousand) + (pack.unit === 'g' ? '/kg' : '/L');
    }
    return formatPrice(Math.round(cents / pack.size)) + '/' + pack.unit;
  }

  /* ---------- Lookups ---------- */

  function getProduct(id) {
    return productById.get(id);
  }

  function getRecipe(id) {
    return recipeById.get(id);
  }

  function getCategory(id) {
    return categoryById.get(id);
  }

  /* ---------- Product offers ---------- */

  // One entry per store, including stores that do not stock the product.
  function offersFor(productId, distances) {
    const product = getProduct(productId);
    return data.stores.map((store) => {
      const price = product.prices[store.id];
      return {
        store,
        available: typeof price === 'number',
        cents: typeof price === 'number' ? toCents(price) : null,
        distanceKm: distances[store.id]
      };
    });
  }

  function byPrice(a, b) {
    return a.cents - b.cents || a.distanceKm - b.distanceKm;
  }

  function byDistance(a, b) {
    return a.distanceKm - b.distanceKm || a.cents - b.cents;
  }

  // Available offers first, sorted by the chosen key; unavailable stores go last.
  function sortOffers(offers, sortBy) {
    const compare = sortBy === 'distance' ? byDistance : byPrice;
    const available = offers.filter((offer) => offer.available).sort(compare);
    const unavailable = offers.filter((offer) => !offer.available).sort(byDistance);
    return available.concat(unavailable);
  }

  function cheapestOffer(productId, distances) {
    return sortOffers(offersFor(productId, distances), 'price')[0];
  }

  function nearestOffer(productId, distances) {
    return sortOffers(offersFor(productId, distances), 'distance')[0];
  }

  // Lowest and highest available price, used for the "price spread" in summaries.
  function priceRange(productId) {
    const prices = Object.values(getProduct(productId).prices)
      .filter((price) => typeof price === 'number')
      .map(toCents);
    return { min: Math.min(...prices), max: Math.max(...prices), storeCount: prices.length };
  }

  /* ---------- Recipe quantities ---------- */

  // Weights and volumes are rounded to 5 g/ml; countable items (eggs) round up.
  function scaleAmount(amount, unit, factor) {
    const scaled = amount * factor;
    if (unit === 'g' || unit === 'ml') {
      return Math.max(5, Math.round(scaled / 5) * 5);
    }
    return Math.max(1, Math.ceil(scaled - 1e-9));
  }

  // Shops sell whole packs: 600 g of chicken in 500 g trays means buying 2 trays.
  function packsNeeded(amount, packSize) {
    return Math.max(1, Math.ceil(amount / packSize - 1e-9));
  }

  // Turns a recipe into shopping lines for a number of servings.
  // `haveIds` contains products the user already has, which are left out.
  function recipeLines(recipe, servings, haveIds) {
    const factor = servings / recipe.servings;
    return recipe.ingredients.map((ingredient) => {
      const product = getProduct(ingredient.product);
      const amount = scaleAmount(ingredient.amount, product.pack.unit, factor);
      return {
        productId: product.id,
        amount,
        note: factor === 1 ? ingredient.note : '',
        packs: packsNeeded(amount, product.pack.size),
        have: haveIds.has(product.id)
      };
    });
  }

  /* ---------- Basket comparison ---------- */

  // Cost of buying every line at a single store. Lines the store does not stock
  // are reported as missing, so an incomplete store is never shown as "cheapest".
  function singleStoreTotal(lines, store, distances) {
    let cents = 0;
    const missing = [];
    lines.forEach((line) => {
      const price = getProduct(line.productId).prices[store.id];
      if (typeof price === 'number') {
        cents += toCents(price) * line.packs;
      } else {
        missing.push(line.productId);
      }
    });
    return { store, cents, missing, complete: missing.length === 0, distanceKm: distances[store.id] };
  }

  // Cheapest store for each line (ties go to the nearer store).
  function combinedBasket(lines, distances) {
    const picks = [];
    const unavailable = [];
    lines.forEach((line) => {
      const offer = cheapestOffer(line.productId, distances);
      if (offer && offer.available) {
        picks.push({ productId: line.productId, packs: line.packs, store: offer.store, cents: offer.cents * line.packs });
      } else {
        unavailable.push(line.productId);
      }
    });
    const storeIds = [...new Set(picks.map((pick) => pick.store.id))];
    const cents = picks.reduce((sum, pick) => sum + pick.cents, 0);
    return { picks, cents, storeIds, unavailable };
  }

  /*
   * Compares "everything at one store" with "each item where it is cheapest".
   * verdict:
   *   empty           - nothing to compare
   *   no-single-store - no store stocks every item
   *   single-best     - one store already matches the lowest possible total
   *   split-small     - splitting saves less than settings.minSavingPerExtraStore per extra stop
   *   split-saves     - splitting saves a meaningful amount
   */
  function compareBasket(lines, distances) {
    const buyLines = lines.filter((line) => !line.have);
    const stores = data.stores
      .map((store) => singleStoreTotal(buyLines, store, distances))
      .sort((a, b) => Number(b.complete) - Number(a.complete) || a.cents - b.cents || a.distanceKm - b.distanceKm);
    const complete = stores.filter((entry) => entry.complete);
    const bestSingle = complete[0] || null;
    const nearestComplete = complete.slice().sort((a, b) => a.distanceKm - b.distanceKm)[0] || null;
    const combined = combinedBasket(buyLines, distances);

    let saving = 0;
    let extraStores = Math.max(0, combined.storeIds.length - 1);
    let verdict;

    if (buyLines.length === 0) {
      verdict = 'empty';
    } else if (!bestSingle) {
      verdict = 'no-single-store';
    } else {
      saving = bestSingle.cents - combined.cents;
      if (saving <= 0) {
        // The single store is as cheap as any split, so no extra trips are needed.
        saving = 0;
        extraStores = 0;
        verdict = 'single-best';
      } else if (saving < toCents(settings.minSavingPerExtraStore) * extraStores) {
        verdict = 'split-small';
      } else {
        verdict = 'split-saves';
      }
    }

    return { lines: buyLines, stores, bestSingle, nearestComplete, combined, saving, extraStores, verdict };
  }

  SuperSearch.pricing = {
    formatPrice,
    formatDistance,
    formatAmount,
    formatUnitPrice,
    getProduct,
    getRecipe,
    getCategory,
    offersFor,
    sortOffers,
    cheapestOffer,
    nearestOffer,
    priceRange,
    recipeLines,
    compareBasket
  };
})(window.SuperSearch);
