/*
 * Storage: shopping list and saved recipes, persisted with localStorage.
 *
 * Only product ids, pack counts and recipe ids are stored. Nothing personal
 * (and never the user's location) is written to the browser.
 */
(function (SuperSearch) {
  'use strict';

  const LIST_KEY = 'supersearch.list.v1';
  const FAVOURITES_KEY = 'supersearch.favourites.v1';
  const pricing = SuperSearch.pricing;

  // Becomes false if the browser blocks storage (private mode, disabled cookies...).
  let persistent = true;

  function read(key, fallback) {
    let raw;
    try {
      raw = window.localStorage.getItem(key);
    } catch (error) {
      persistent = false;
      return fallback;
    }
    // Corrupted JSON is not a storage problem: start again from the fallback.
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      persistent = true;
    } catch (error) {
      persistent = false;
    }
    return persistent;
  }

  // Ignore saved entries that no longer match the demo data (e.g. a removed product).
  function sanitiseList(raw) {
    if (!Array.isArray(raw)) return [];
    const seen = new Set();
    return raw
      .filter((item) => {
        // Keep known products only, and each product once.
        if (!item || !pricing.getProduct(item.productId) || seen.has(item.productId)) return false;
        seen.add(item.productId);
        return true;
      })
      .map((item) => ({
        productId: item.productId,
        packs: Math.max(1, Math.min(99, Math.round(Number(item.packs) || 1))),
        bought: item.bought === true,
        recipes: Array.isArray(item.recipes) ? item.recipes.filter((id) => pricing.getRecipe(id)) : []
      }));
  }

  let items = sanitiseList(read(LIST_KEY, []));
  const savedFavourites = read(FAVOURITES_KEY, []);
  const favourites = new Set(Array.isArray(savedFavourites) ? savedFavourites.filter((id) => pricing.getRecipe(id)) : []);

  function saveList() {
    return write(LIST_KEY, items);
  }

  function findItem(productId) {
    return items.find((item) => item.productId === productId);
  }

  /* ---------- Shopping list ---------- */

  function getItems() {
    return items.map((item) => Object.assign({}, item, { recipes: item.recipes.slice() }));
  }

  function packsInList(productId) {
    const item = findItem(productId);
    return item ? item.packs : 0;
  }

  // Adding a product that is already on the list increases its pack count.
  // A product marked as bought goes back to "to buy", because more is needed.
  function addPacks(productId, packs, recipeId) {
    let item = findItem(productId);
    if (!item) {
      item = { productId, packs: 0, bought: false, recipes: [] };
      items.push(item);
    }
    item.packs = Math.min(99, item.packs + packs);
    item.bought = false;
    if (recipeId && !item.recipes.includes(recipeId)) item.recipes.push(recipeId);
  }

  function addProduct(productId, packs) {
    addPacks(productId, packs);
    return saveList();
  }

  function addLines(lines, recipeId) {
    lines.forEach((line) => addPacks(line.productId, line.packs, recipeId));
    return saveList();
  }

  function changePacks(productId, delta) {
    const item = findItem(productId);
    if (!item) return persistent;
    item.packs = Math.max(1, Math.min(99, item.packs + delta));
    return saveList();
  }

  function setBought(productId, bought) {
    const item = findItem(productId);
    if (!item) return persistent;
    item.bought = bought;
    return saveList();
  }

  function remove(productId) {
    items = items.filter((item) => item.productId !== productId);
    return saveList();
  }

  function clear() {
    items = [];
    return saveList();
  }

  /* ---------- Saved recipes ---------- */

  function isFavourite(recipeId) {
    return favourites.has(recipeId);
  }

  function toggleFavourite(recipeId) {
    if (favourites.has(recipeId)) {
      favourites.delete(recipeId);
    } else {
      favourites.add(recipeId);
    }
    write(FAVOURITES_KEY, [...favourites]);
    return favourites.has(recipeId);
  }

  SuperSearch.storage = {
    isPersistent: () => persistent,
    getItems,
    packsInList,
    addProduct,
    addLines,
    changePacks,
    setBought,
    remove,
    clear,
    isFavourite,
    toggleFavourite
  };
})(window.SuperSearch);
