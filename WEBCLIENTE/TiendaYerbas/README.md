# Martinete Yerbas

Tienda de yerbas con login y carrito hecha con HTML, CSS y JavaScript, sin base de datos ni servidor de autenticación.
Usa `sessionStorage` y `localStorage` para guardar los datos.

## Cómo abrirla

1. Descomprimir el ZIP.
2. Abrir la carpeta `TiendaYerbas` en VS Code.
3. Clic derecho en `index.html` → **Open with Live Server**.

Hace falta Live Server (o cualquier servidor local) porque los productos se cargan de `data/productos.json` con `fetch()`, y el navegador no deja hacer `fetch` si se abre el HTML con doble clic (`file://`).
Todas las rutas son relativas.

## Usuarios de prueba

| Usuario  | Contraseña |
|----------|------------|
| Riquelme | 1234       |
| Robben   | abcd       |
| Palermo  | boca       |

Están escritos en `js/usuarios.js` solo con fines didácticos: no es un login seguro.

## Qué se guarda y dónde

| Clave        | Dónde              | Qué tiene                                   | Por qué |
|--------------|--------------------|---------------------------------------------|---------|
| `sesion`     | **sessionStorage** | `{ usuario, nombre }` (sin la contraseña)   | La sesión dura lo que dura la pestaña. Se borra al cerrar sesión o al cerrar la pestaña. |
| `carrito`    | **sessionStorage** | `[{ id, cantidad }, ...]`                   | Es de esa sesión: se conserva al recargar, no se comparte con otras pestañas y se borra al cerrar sesión. |
| `inventario` | **localStorage**   | Los productos con sus existencias           | Tiene que durar entre visitas y ser el mismo en todas las pestañas, para que una compra descuente el stock para todos. |

La primera vez, el inventario se lee de `data/productos.json` y se copia al localStorage. A partir de ahí siempre se lee del localStorage, que es donde están las existencias actualizadas.

Todo se guarda con `JSON.stringify()` y se lee con `JSON.parse()`. Si no hay nada guardado o el dato está roto, se usa un valor por defecto (el inventario se vuelve a cargar del JSON y el carrito empieza vacío).

## Estructura

```
index.html          login
home.html           catálogo y carrito (sin sesión redirige al login)
css/estilos.css
data/productos.json la "base de datos" de yerbas
img/                fotos de las yerbas
js/usuarios.js      usuarios de prueba
js/login.js         inicio de sesión
js/productos.js     inventario: lo carga del json y lo guarda en el localStorage
js/carrito.js       carrito en el sessionStorage, validaciones y compra
js/home.js          pinta productos y carrito, listeners y evento storage
```

La lógica (`productos.js`, `carrito.js`) no toca el HTML. Los listeners están en `login.js` y `home.js`.

## Para probar

- **Recargar**: la sesión y el carrito siguen.
- **Otra pestaña**: hay que volver a iniciar sesión (cada pestaña tiene su sessionStorage), pero el inventario es el mismo.
- **Comprar en una pestaña**: en la otra se actualizan solas las existencias (evento `storage`) y, si su carrito ya no alcanza, avisa y no deja comprar.
- **Cerrar sesión**: se borran la sesión y el carrito y vuelve al login.
- **Abrir `home.html` sin sesión**: redirige a `index.html`.
- **Volver al stock inicial**: F12 → Aplicación → Local Storage → borrar `inventario`.
