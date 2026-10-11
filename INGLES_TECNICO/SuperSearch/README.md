# SuperSearch

**Find it. Compare it. Save it.**

Prototipo web de la actividad *My First App Idea Pitch* (Inglés Técnico, 2º DAW). Lo hicimos Martín, Jesús y Cristina.

SuperSearch te ayuda a decidir dónde comprar los ingredientes de una receta. Elegís un plato (por ejemplo, chicken tikka masala) y la app te muestra los ingredientes y cuánto cuesta la compra en cada supermercado. También compara dos estrategias: comprar todo en una sola tienda o repartir la compra entre varias para pagar menos.

> **Datos de demostración.** Todos los precios, distancias, ubicaciones y disponibilidades son ilustrativos. SuperSearch no está conectada a Mercadona, Carrefour, Lidl, DIA ni Alcampo, y los nombres aparecen solo como texto, sin logotipos.

## El problema

Cuando queremos cocinar algo, no sabemos qué supermercado tiene todos los ingredientes ni dónde salen más baratos. Comparar tienda por tienda lleva tiempo, y lo más barato de cada producto no siempre compensa si hay que ir a tres sitios distintos.

## Público objetivo

Estudiantes, familias y personas ocupadas que quieren ahorrar tiempo y dinero y planificar la compra antes de salir de casa.

## Funciones implementadas

| Vista | Qué se puede hacer |
| --- | --- |
| **Discover** | Buscador de productos y recetas con resultados en vivo, accesos rápidos, un "ticket" con la comparación de la Chicken Tikka Masala calculada con los datos, las recetas destacadas, los productos con más diferencia de precio y los supermercados con su distancia. |
| **Products** | Búsqueda por nombre, filtro por categoría y orden por precio más bajo, tienda más cercana o nombre. Cada producto despliega la comparación por tienda (precio, diferencia con el más barato, precio por kg/L y distancia), ordenable por precio o distancia, con las etiquetas *Lowest price* y *Nearest*. También se puede añadir a la lista. Si la búsqueda no encuentra productos pero sí recetas (por ejemplo, "bolognese"), ofrece enlaces a esas recetas. |
| **Recipes** | Catálogo de 4 recetas (Chicken Tikka Masala, Spaghetti Bolognese, Spanish Omelette y Weekend Pancakes), favoritos con el corazón y filtro *Saved*. Cada tarjeta tiene *Compare cost* (abre la comparación) y *Add to list* (añade los ingredientes). |
| **Detalle de receta** | Ilustración, tiempo, raciones ajustables (de 1 a 12), ingredientes con cantidades y envases a comprar, casillas *I already have* para descontar lo que ya tenés, pasos, comparación completa del coste y botón para añadir los ingredientes a la lista. |
| **My list** | Lista agrupada por categoría con cantidades editables. Se puede marcar como comprado, desmarcar, eliminar o vaciar la lista (con confirmación). Incluye una estimación del coste de lo que falta comprar (una tienda frente a la cesta combinada) y dónde comprar cada cosa. |
| **Ubicación** | El botón *Use my location* pide permiso solo cuando lo pulsás. Contempla los casos de permiso concedido, denegado, posición no disponible, tiempo agotado, navegador no compatible y página no segura. Si algo falla, se sigue usando la ubicación de demostración. |

La lista y los favoritos se guardan en `localStorage`, así que siguen ahí cuando recargás la página. Si los datos guardados están dañados o mencionan productos que ya no existen en `data.js`, se ignoran sin romper la app. Si el navegador bloquea el almacenamiento, la lista funciona igual pero la app avisa de que no se conservará. La ubicación **no** se guarda nunca.

### Cómo se compara el coste de una receta

Toda la lógica está en `js/pricing.js` y usa solo los datos de `js/data.js`:

1. **Cantidades**: se escalan según las raciones. Los gramos y mililitros se redondean de 5 en 5; las unidades (huevos) se redondean hacia arriba.
2. **Envases enteros**: en el súper se compran paquetes completos. Por ejemplo, 600 g de pollo en bandejas de 500 g son 2 bandejas. Lo que sobra no se descuenta. Es una simplificación que también se explica en la interfaz.
3. **Una sola tienda**: se calcula el total en cada supermercado. Si a una tienda le falta algún producto, se marca como incompleta y nunca se presenta como la más barata.
4. **Cesta combinada**: cada producto se compra donde es más barato (si hay empate, en la tienda más cercana). Se cuenta en cuántas tiendas habría que comprar.
5. **Veredicto**: compara la mejor tienda única con la cesta combinada.
   - *single-best*: una sola tienda ya iguala el precio mínimo.
   - *split-saves*: repartir la compra ahorra al menos 1 € por cada tienda extra.
   - *split-small*: el ahorro existe, pero es menor que eso, y se dice sin forzar una recomendación.
   - *no-single-store*: ninguna tienda tiene todos los productos.

   El umbral está en `settings.minSavingPerExtraStore`.
6. **Opción más cercana**: además, se muestra la tienda más cercana que tiene todos los productos y cuánto más costaría.

El dinero se calcula en céntimos enteros, para evitar errores de coma flotante, y se muestra con el formato español (`17,99 €`).

## Estructura de carpetas

```
INGLES_TECNICO/SuperSearch/
├── index.html              Estructura de todas las vistas y sprite de iconos SVG
├── css/
│   └── styles.css          Variables de diseño, componentes y responsive
├── js/
│   ├── data.js             Única fuente de datos: tiendas, productos, precios y recetas
│   ├── pricing.js          Cálculos puros y formato (precios, envases, comparación)
│   ├── storage.js          Lista de la compra y favoritos en localStorage
│   ├── location.js         Geolocalización opcional y distancias de demostración
│   ├── views.js            Plantillas: convierten datos en HTML
│   └── app.js              Estado de la interfaz, router por hash y eventos
├── assets/
│   ├── logo.svg            Marca (cesta + lupa), también se usa como favicon
│   └── recipes/            Ilustraciones SVG propias de cada receta
├── docs/
│   ├── PROJECT_BRIEF.md    Planteamiento del producto
│   └── PITCH_SCRIPT.md     Guion de la exposición (en inglés)
├── README.md
└── CONTRIBUTING.md         Cómo colaborar con forks y Pull Requests
```

## Cómo ejecutarla

No hace falta instalar nada: no hay dependencias, paquetes ni compilación.

**Opción rápida:** abrí `index.html` con doble clic. Funciona todo excepto, normalmente, la geolocalización, porque los navegadores la bloquean en páginas `file://`. En ese caso, la app muestra un aviso que explica cómo abrirla en `localhost` y sigue con la ubicación de demostración.

**Opción completa (con geolocalización):** servila desde `localhost`.

- **Live Server (VS Code):** clic derecho sobre `index.html` → *Open with Live Server*.
- **Python:** desde la carpeta del proyecto, ejecutá:

  ```bash
  cd INGLES_TECNICO/SuperSearch
  python -m http.server 8000
  ```

  Después abrí <http://localhost:8000> en el navegador. Para parar el servidor, usá `Ctrl + C`.

## Qué no es real todavía

- **Precios y disponibilidad:** son inventados para la demo. No hay conexión con ningún supermercado.
- **Tiendas y distancias:** las posiciones son desplazamientos fijos alrededor del usuario, definidos en `data.js`. Si compartís tu ubicación, la app lo indica, pero **no** busca supermercados reales, y las distancias siguen siendo de ejemplo (la interfaz lo dice).
- **Coste de los desplazamientos:** no se calcula. El umbral de 1 € por tienda extra es una regla orientativa.
- **Envases sobrantes:** no se descuentan. Tampoco se consideran ofertas, marcas ni tamaños alternativos.
- **Persistencia:** la lista y los favoritos viven solo en el navegador que estás usando, sin cuentas ni sincronización.

La arquitectura está preparada para una integración futura. `location.js` concentra el cálculo de distancias en `getDistances()`, y el resto de la app solo usa el mapa `{ idTienda: km }` que devuelve. Un proveedor real de tiendas o mapas podría reemplazar esa función sin tocar las vistas. Lo mismo pasa con los precios: con que `data.js` mantenga la misma forma, podría generarse desde una API.

## Cómo modificar los datos

Todo está en `js/data.js`. Las vistas y los cálculos se actualizan solos.

**Cambiar un precio:** editá `prices` del producto. Usá `null` si la tienda no lo vende.

```js
prices: { mercadona: 0.95, carrefour: 0.99, lidl: 0.89, dia: null, alcampo: 0.94 }
```

**Añadir un producto:**

```js
{
  id: 'lentils', name: 'Brown lentils', category: 'pantry',
  pack: { size: 1000, unit: 'g', label: '1 kg bag' },
  prices: { mercadona: 1.45, carrefour: 1.59, lidl: 1.29, dia: 1.39, alcampo: 1.35 }
}
```

- `id`: único, en minúsculas y con guiones.
- `category`: tiene que existir en `categories`.
- `unit`: `g`, `ml` o una unidad contable en singular (por ejemplo, `egg`).

**Añadir una receta:** copiá una de las existentes en `recipes`, cambiale el `id` y guardá una ilustración en `assets/recipes/`. En cada ingrediente, `product` es el `id` del producto y `amount` la cantidad en la misma unidad que su envase. Con `pantry: true`, el ingrediente aparece marcado como "ya lo tengo". La receta con la que se arma el ticket de Discover está en `FEATURED_RECIPE_ID`, dentro de `app.js`.

**Añadir una tienda:** agregala en `stores` con su `offsetKm` (km al este y al norte) y añadí su precio en cada producto.

## Organización del código

- Los scripts son **clásicos con `defer`** (no módulos ES), así funcionan abriendo el archivo directamente. Comparten un único objeto global, `window.SuperSearch`, y cada archivo añade una parte: `data`, `pricing`, `storage`, `location` y `views`. El orden de carga está en `index.html`.
- **`pricing.js` no toca el DOM.** Todas las vistas usan las mismas funciones, así que el número que aparece en una tarjeta es el mismo que en el detalle, en el ticket y en la lista.
- **`views.js` solo genera HTML.** Los botones llevan `data-action` y `data-id`, y `app.js` los gestiona con delegación de eventos. Todo el texto pasa por `escapeHtml()`.
- **`app.js`:** el router lee el hash (`#/recipes/chicken-tikka-masala/cost`). Después de cada acción, vuelve a dibujar la vista actual y devuelve el foco al mismo control, para no perderlo al usar el teclado.
- **CSS:** organizado por secciones numeradas, con los colores, espaciados y radios en variables de `:root`. Cada tarjeta, chip, botón o tabla se define una sola vez.

## Accesibilidad

HTML semántico (`header`, `nav`, `main`, `section`, `table`, `dialog`), enlace "Skip to content", etiquetas en todos los controles, foco visible y gestión del foco al cambiar de vista, `aria-pressed` y `aria-expanded` en los botones de estado, regiones `role="status"` para los avisos, contraste AA en el texto y respeto por `prefers-reduced-motion`. En el móvil, la navegación pasa a una barra inferior.

## Comprobación manual

Para revisar la app en un navegador real:

1. Abrila en escritorio y redimensioná la ventana hasta el ancho de un móvil (o usá el modo dispositivo de DevTools, con `F12`). No debería aparecer scroll horizontal.
2. **Discover:** escribí "chicken" en el buscador y pulsá *Search*.
3. **Products:** filtrá por categoría y cambiá el orden. Abrí *Compare prices* y alterná entre *Price* y *Distance*.
4. **Recipes:** abrí una receta, cambiá las raciones, marcá un ingrediente que ya tenés, añadí los ingredientes a la lista y volvé con *Back*.
5. **My list:** marcá productos como comprados y desmarcalos, cambiá cantidades, eliminá un elemento, recargá la página para comprobar que la lista se mantiene, y vaciala (primero cancelá y después confirmá).
6. **Ubicación:** desde `localhost`, pulsá *Use my location* y probá tanto aceptar como rechazar el permiso.
7. **Teclado:** recorré la app solo con `Tab`, `Enter` y `Espacio`.

Ver también [CONTRIBUTING.md](CONTRIBUTING.md) para colaborar en el proyecto.
