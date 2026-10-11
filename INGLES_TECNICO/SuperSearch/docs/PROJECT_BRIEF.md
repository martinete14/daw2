# SuperSearch: planteamiento del producto

**Eslogan:** *Find it. Compare it. Save it.*
**Equipo:** Martín, Jesús y Cristina, de Inglés Técnico (2º DAW).
**Actividad:** *My First App Idea Pitch*. Presentar, como emprendedores, una idea sencilla de aplicación en unos 3 minutos, con un soporte visual y con un minuto por integrante. Como soporte visual, construimos un prototipo web que funciona.

## El problema

Para cocinar un plato hacen falta varios ingredientes, y cada supermercado tiene precios y surtido distintos. Hoy, para saber dónde conviene comprar, hay que mirar varias webs o ir de tienda en tienda. Además, lo que parece más barato producto por producto puede no compensar si obliga a visitar tres supermercados.

## Objetivo

Que el usuario pueda tomar una **decisión de compra informada antes de salir de casa**:

- Cuánto le cuesta una receta completa en cada supermercado.
- Cuánto se ahorraría repartiendo la compra y cuántas tiendas extra implicaría.
- Si ese ahorro le compensa, o si es mejor la opción más cercana o la más cómoda.

## Personas usuarias

| Persona | Situación | Qué le aporta SuperSearch |
| --- | --- | --- |
| **Lucía, estudiante (20)** | Comparte piso, tiene un presupuesto ajustado y cocina para varios días. | Ve el coste total de la receta y la tienda más barata. |
| **Familia García** | Hace una compra grande cada semana y cocina para cuatro. | Ajusta las raciones y prepara una lista de la compra con el coste estimado. |
| **Andrés, trabaja a jornada completa (35)** | Tiene poco tiempo y prefiere una sola parada. | Ve si el ahorro de repartir la compra vale la pena o si basta con la tienda más cercana. |

## Propuesta de valor

No es "encontrar el producto más barato", sino **comparar estrategias de compra**:

1. **Todo en una tienda:** el total en cada supermercado, avisando si falta algún producto.
2. **Cesta combinada:** cada ingrediente donde es más barato, indicando cuántas tiendas hay que visitar.
3. **Opción cercana:** la tienda más próxima que tiene todo, y cuánto más cuesta.

## Funcionalidades del prototipo

- **Discover:** buscador global, accesos rápidos, ticket con la comparación de una receta, recetas destacadas, productos con más diferencia de precio y tiendas cercanas.
- **Products:** búsqueda, filtros por categoría, orden por precio, distancia o nombre, y una tabla de precios por tienda con precio unitario.
- **Recipes:** cuatro recetas con ilustración propia, favoritos, raciones ajustables, la opción "ya lo tengo" y la comparación completa del coste.
- **My list:** añadir productos desde Products o desde una receta, cambiar cantidades, marcar como comprado, eliminar y vaciar con confirmación. Incluye un coste estimado de lo que queda por comprar y se guarda en `localStorage`.
- **Ubicación opcional:** se pide solo con un botón, y la app gestiona todos los casos de error. Mientras no haya datos reales, las distancias son de ejemplo.

## Ejemplo con los datos de la demo

Chicken Tikka Masala para 4 raciones, con el aceite de oliva marcado como "ya lo tengo":

| Estrategia | Coste |
| --- | --- |
| Mejor tienda única (Alcampo, 3,8 km) | 19,31 € |
| Tienda más cercana con todo (DIA, 0,3 km) | 20,01 € |
| Cesta combinada (Lidl + Carrefour) | 17,99 € |
| **Ahorro de la cesta combinada** | **1,32 € con 1 parada extra** |

Lidl sería la más barata (15,81 €), pero no tiene jengibre fresco ni garam masala, así que la app no la presenta como opción de tienda única.

Las otras recetas muestran casos distintos: en la Spanish Omelette, Lidl ya es lo más barato y no hace falta repartir; en Spaghetti Bolognese y en Weekend Pancakes, el ahorro es tan pequeño que la app lo dice sin recomendar repartir.

## Limitaciones del prototipo

- **Datos:** todos los precios, distancias y disponibilidades son ilustrativos. No hay backend, base de datos ni API, ni ningún acuerdo con supermercados. Los nombres de las cadenas aparecen como texto neutro, sin logotipos.
- **Geolocalización:** no localiza tiendas reales. Solo cambia el origen indicado y avisa de que las distancias siguen siendo de ejemplo. Las coordenadas no se guardan ni se envían.
- **Cálculo:** se compran envases enteros sin descontar lo que sobra. No se consideran ofertas, marcas alternativas ni el coste del desplazamiento (solo un umbral orientativo de 1 € por tienda extra).
- **Cuentas:** no hay sincronización entre dispositivos. La lista vive en el navegador.

## Posible evolución

- Integrar precios reales mediante una API o datos abiertos, manteniendo el formato de `data.js`.
- Usar un proveedor de mapas para encontrar tiendas reales cercanas: el punto de integración es `location.getDistances()`.
- Calcular el coste del desplazamiento (tiempo o combustible) y añadir preferencias del usuario (marcas, ecológico, sin gluten).
- Ofrecer cuentas para sincronizar la lista y compartirla con la familia.
