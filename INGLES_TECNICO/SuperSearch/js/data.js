/*
 * SuperSearch demo data.
 *
 * This file is the single source of truth for every view: product catalogue,
 * store prices, store positions and recipes. All figures are illustrative
 * examples for the prototype, not live supermarket data.
 *
 * Conventions
 * - Prices are in euros per pack. `null` means the store does not stock it.
 * - Pack sizes and recipe amounts use the same unit: g, ml or a count unit
 *   (e.g. "egg"), so the app can work out how many packs to buy.
 * - Store positions are offsets in km from the shopper (x = east, y = north).
 *   They are demo values: the app never claims to know real store locations.
 */
window.SuperSearch = window.SuperSearch || {};

window.SuperSearch.data = {
  demoNotice: 'Demo data · Prices and availability are illustrative, not live supermarket data.',

  settings: {
    locale: 'es-ES',
    currency: 'EUR',
    // If splitting the basket saves less than this per extra store visited,
    // the comparison says the saving is small instead of pushing the split.
    minSavingPerExtraStore: 1.0,
    minServings: 1,
    maxServings: 12
  },

  stores: [
    { id: 'mercadona', name: 'Mercadona', area: 'Calle Mayor', offsetKm: [0.35, 0.45] },
    { id: 'carrefour', name: 'Carrefour', area: 'Avenida del Parque', offsetKm: [1.6, -1.3] },
    { id: 'lidl', name: 'Lidl', area: 'Ronda Norte', offsetKm: [-1.1, 0.8] },
    { id: 'dia', name: 'DIA', area: 'Plaza del Mercado', offsetKm: [0.2, -0.25] },
    { id: 'alcampo', name: 'Alcampo', area: 'Retail park', offsetKm: [-2.9, -2.4] }
  ],

  categories: [
    { id: 'dairy', name: 'Dairy & eggs', icon: 'milk', tone: 'blue' },
    { id: 'meat', name: 'Meat', icon: 'meat', tone: 'coral' },
    { id: 'produce', name: 'Fruit & veg', icon: 'leaf', tone: 'green' },
    { id: 'pantry', name: 'Pantry', icon: 'jar', tone: 'yellow' },
    { id: 'pasta-rice', name: 'Pasta & rice', icon: 'grain', tone: 'yellow' },
    { id: 'spices', name: 'Spices', icon: 'spice', tone: 'coral' }
  ],

  products: [
    {
      id: 'milk', name: 'Semi-skimmed milk', category: 'dairy',
      pack: { size: 1000, unit: 'ml', label: '1 L carton' },
      prices: { mercadona: 0.95, carrefour: 0.99, lidl: 0.89, dia: 0.92, alcampo: 0.94 }
    },
    {
      id: 'eggs', name: 'Free-range eggs', category: 'dairy',
      pack: { size: 12, unit: 'egg', label: 'Box of 12' },
      prices: { mercadona: 2.85, carrefour: 2.99, lidl: 2.69, dia: 2.79, alcampo: 2.75 }
    },
    {
      id: 'natural-yogurt', name: 'Natural yogurt', category: 'dairy',
      pack: { size: 500, unit: 'g', label: '4 × 125 g' },
      prices: { mercadona: 1.2, carrefour: 1.35, lidl: 1.09, dia: 1.15, alcampo: 1.19 }
    },
    {
      id: 'cooking-cream', name: 'Cooking cream', category: 'dairy',
      pack: { size: 200, unit: 'ml', label: '200 ml carton' },
      prices: { mercadona: 0.95, carrefour: 1.05, lidl: 0.89, dia: 0.99, alcampo: 0.92 }
    },
    {
      id: 'butter', name: 'Unsalted butter', category: 'dairy',
      pack: { size: 250, unit: 'g', label: '250 g block' },
      prices: { mercadona: 2.35, carrefour: 2.49, lidl: 2.39, dia: 2.45, alcampo: 2.29 }
    },
    {
      id: 'parmesan', name: 'Grated Parmesan', category: 'dairy',
      pack: { size: 100, unit: 'g', label: '100 g bag' },
      prices: { mercadona: 1.95, carrefour: 2.15, lidl: 1.79, dia: 1.99, alcampo: 1.69 }
    },
    {
      id: 'chicken', name: 'Chicken breast fillets', category: 'meat',
      pack: { size: 500, unit: 'g', label: '500 g tray' },
      prices: { mercadona: 3.95, carrefour: 4.29, lidl: 3.79, dia: 4.1, alcampo: 4.15 }
    },
    {
      id: 'minced-beef', name: 'Minced beef', category: 'meat',
      pack: { size: 500, unit: 'g', label: '500 g tray' },
      prices: { mercadona: 3.95, carrefour: 4.45, lidl: 3.99, dia: null, alcampo: 4.15 }
    },
    {
      id: 'onions', name: 'Onions', category: 'produce',
      pack: { size: 1000, unit: 'g', label: '1 kg net' },
      prices: { mercadona: 1.49, carrefour: 1.59, lidl: 1.29, dia: 1.45, alcampo: 1.39 }
    },
    {
      id: 'garlic', name: 'Garlic', category: 'produce',
      pack: { size: 250, unit: 'g', label: '250 g net' },
      prices: { mercadona: 1.1, carrefour: 1.25, lidl: 0.99, dia: 1.15, alcampo: 1.05 }
    },
    {
      id: 'ginger', name: 'Fresh ginger', category: 'produce',
      pack: { size: 150, unit: 'g', label: '150 g pack' },
      prices: { mercadona: 0.8, carrefour: 0.69, lidl: null, dia: 0.85, alcampo: 0.75 }
    },
    {
      id: 'carrots', name: 'Carrots', category: 'produce',
      pack: { size: 1000, unit: 'g', label: '1 kg bag' },
      prices: { mercadona: 0.99, carrefour: 1.09, lidl: 0.89, dia: 0.95, alcampo: 0.92 }
    },
    {
      id: 'potatoes', name: 'Potatoes', category: 'produce',
      pack: { size: 2000, unit: 'g', label: '2 kg bag' },
      prices: { mercadona: 2.49, carrefour: 2.69, lidl: 2.29, dia: 2.39, alcampo: 2.35 }
    },
    {
      id: 'tomato-sauce', name: 'Tomato sauce', category: 'pantry',
      pack: { size: 400, unit: 'g', label: '400 g jar' },
      prices: { mercadona: 0.85, carrefour: 0.95, lidl: 0.79, dia: 0.89, alcampo: 0.82 }
    },
    {
      id: 'passata', name: 'Tomato passata', category: 'pantry',
      pack: { size: 500, unit: 'g', label: '500 g bottle' },
      prices: { mercadona: 0.75, carrefour: 0.85, lidl: 0.69, dia: 0.79, alcampo: 0.72 }
    },
    {
      id: 'olive-oil', name: 'Extra virgin olive oil', category: 'pantry',
      pack: { size: 1000, unit: 'ml', label: '1 L bottle' },
      prices: { mercadona: 7.95, carrefour: 8.49, lidl: 7.69, dia: 8.15, alcampo: 7.89 }
    },
    {
      id: 'flour', name: 'Plain flour', category: 'pantry',
      pack: { size: 1000, unit: 'g', label: '1 kg bag' },
      prices: { mercadona: 0.79, carrefour: 0.85, lidl: 0.69, dia: 0.75, alcampo: 0.72 }
    },
    {
      id: 'basmati-rice', name: 'Basmati rice', category: 'pasta-rice',
      pack: { size: 1000, unit: 'g', label: '1 kg bag' },
      prices: { mercadona: 2.35, carrefour: 2.59, lidl: 2.19, dia: 2.45, alcampo: 2.29 }
    },
    {
      id: 'spaghetti', name: 'Spaghetti', category: 'pasta-rice',
      pack: { size: 500, unit: 'g', label: '500 g pack' },
      prices: { mercadona: 0.75, carrefour: 0.99, lidl: 0.79, dia: 0.85, alcampo: 0.82 }
    },
    {
      id: 'garam-masala', name: 'Garam masala', category: 'spices',
      pack: { size: 40, unit: 'g', label: '40 g jar' },
      prices: { mercadona: 1.65, carrefour: 1.49, lidl: null, dia: 1.79, alcampo: 1.55 }
    },
    {
      id: 'paprika', name: 'Sweet paprika', category: 'spices',
      pack: { size: 75, unit: 'g', label: '75 g jar' },
      prices: { mercadona: 1.25, carrefour: 1.35, lidl: 1.09, dia: 1.19, alcampo: 1.15 }
    }
  ],

  // `pantry: true` marks staples most people already have at home. They start
  // ticked as "I have it" and are left out of the cost until the user unticks them.
  recipes: [
    {
      id: 'chicken-tikka-masala',
      name: 'Chicken Tikka Masala',
      image: 'assets/recipes/chicken-tikka-masala.svg',
      tone: 'coral',
      minutes: 45,
      servings: 4,
      summary: 'Creamy, spiced tomato curry with tender chicken, served with basmati rice.',
      ingredients: [
        { product: 'chicken', amount: 600 },
        { product: 'natural-yogurt', amount: 150 },
        { product: 'onions', amount: 300, note: '2 onions' },
        { product: 'garlic', amount: 20, note: '4 cloves' },
        { product: 'ginger', amount: 30 },
        { product: 'garam-masala', amount: 15, note: '2 tbsp' },
        { product: 'paprika', amount: 5, note: '1 tsp' },
        { product: 'passata', amount: 400 },
        { product: 'cooking-cream', amount: 200 },
        { product: 'basmati-rice', amount: 300 },
        { product: 'olive-oil', amount: 30, note: '2 tbsp', pantry: true }
      ],
      steps: [
        'Mix the chicken with the yogurt, half the garam masala and the paprika. Leave it for 15 minutes.',
        'Brown the chicken in a hot pan with a little oil, then set it aside.',
        'Fry the onion, garlic and ginger until soft. Add the rest of the spices, the passata and the cream.',
        'Return the chicken to the sauce and simmer for 15 minutes. Serve with boiled basmati rice.'
      ]
    },
    {
      id: 'spaghetti-bolognese',
      name: 'Spaghetti Bolognese',
      image: 'assets/recipes/spaghetti-bolognese.svg',
      tone: 'yellow',
      minutes: 50,
      servings: 4,
      summary: 'A slow-cooked beef and tomato sauce over spaghetti, finished with Parmesan.',
      ingredients: [
        { product: 'minced-beef', amount: 500 },
        { product: 'spaghetti', amount: 400 },
        { product: 'onions', amount: 150, note: '1 onion' },
        { product: 'carrots', amount: 150, note: '2 carrots' },
        { product: 'garlic', amount: 10, note: '2 cloves' },
        { product: 'tomato-sauce', amount: 400 },
        { product: 'parmesan', amount: 40 },
        { product: 'olive-oil', amount: 30, note: '2 tbsp', pantry: true }
      ],
      steps: [
        'Chop the onion, carrots and garlic finely and fry them gently in olive oil.',
        'Add the minced beef and cook until it is brown all over.',
        'Pour in the tomato sauce and simmer for 25 minutes, stirring now and then.',
        'Cook the spaghetti, mix it with the sauce and top with grated Parmesan.'
      ]
    },
    {
      id: 'spanish-omelette',
      name: 'Spanish Omelette',
      image: 'assets/recipes/spanish-omelette.svg',
      tone: 'blue',
      minutes: 40,
      servings: 4,
      summary: 'The classic tortilla de patatas: potatoes and onion slowly cooked, then set with eggs.',
      ingredients: [
        { product: 'eggs', amount: 6 },
        { product: 'potatoes', amount: 800, note: '4 medium potatoes' },
        { product: 'onions', amount: 150, note: '1 onion' },
        { product: 'olive-oil', amount: 150, pantry: true }
      ],
      steps: [
        'Slice the potatoes and onion thinly.',
        'Cook them slowly in plenty of olive oil until soft, then drain.',
        'Beat the eggs, mix in the potatoes and onion and leave for 5 minutes.',
        'Cook in a pan on both sides until golden but still juicy inside.'
      ]
    },
    {
      id: 'weekend-pancakes',
      name: 'Weekend Pancakes',
      image: 'assets/recipes/weekend-pancakes.svg',
      tone: 'green',
      minutes: 20,
      servings: 4,
      summary: 'Fluffy pancakes for a slow breakfast, made with basic ingredients from the cupboard.',
      ingredients: [
        { product: 'flour', amount: 200 },
        { product: 'milk', amount: 300 },
        { product: 'eggs', amount: 2 },
        { product: 'butter', amount: 30 }
      ],
      steps: [
        'Whisk the flour, milk and eggs into a smooth batter.',
        'Melt a little butter in a frying pan over medium heat.',
        'Pour in small ladles of batter and cook until bubbles appear, then flip.',
        'Serve warm with fruit, honey or a little extra butter.'
      ]
    }
  ]
};
