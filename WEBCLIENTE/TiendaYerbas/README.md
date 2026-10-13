# Martinete Yerbas

Tienda de yerbas con login y carrito hecha con HTML, CSS y JavaScript, sin servidor ni base de datos.
Usa `sessionStorage` y `localStorage` para guardar los datos.

## Cómo abrirla

1. Descomprimir el ZIP.
2. Abrir `index.html` con doble clic (Chrome, Edge o Firefox).

No hace falta instalar nada. Todas las rutas son relativas.

## Usuarios de prueba

| Usuario  | Contraseña |
|----------|------------|
| Riquelme | 1234       |
| Robben   | abcd       |
| Palermo  | boca       |

Los usuarios están escritos en `js/datos.js` solo con fines didácticos: no es un login seguro.

## Qué se guarda y dónde

| Clave        | Dónde              | Qué tiene                                        | Por qué |
|--------------|--------------------|--------------------------------------------------|---------|
| `sesion`     | **sessionStorage** | `{ usuario, nombre }` (sin la contraseña)        | La sesión dura lo que dura la pestaña. Al cerrarla o al cerrar sesión desaparece. |
| `carrito`    | **sessionStorage** | `[{ id, cantidad }, ...]`                        | Es de esa sesión: se conserva al recargar, pero no se comparte con otras pestañas y se borra al cerrar sesión. |
| `inventario` | **localStorage**   | Los productos con `id, nombre, precio, existencias, imagen` | Tiene que durar entre visitas y ser el mismo para todas las pestañas, para que una compra descuente el stock para todos. |

Todo se guarda con `JSON.stringify()` y se lee con `JSON.parse()`. Si no hay nada guardado o el dato está roto, se usa un valor por defecto (el inventario vuelve al inicial y el carrito empieza vacío).

## Estructura

```
index.html            login
tienda.html           catálogo y carrito (sin sesión redirige al login)
css/estilos.css
img/                  fotos de las yerbas
js/datos.js           usuarios de prueba e inventario inicial
js/almacenamiento.js  guardarJSON / leerJSON (con try/catch)
js/sesion.js          iniciar, obtener y cerrar sesión
js/carrito.js         inventario, carrito, validaciones y compra
js/login.js           listeners de la pantalla de login
js/tienda.js          pinta productos y carrito, listeners y evento storage
```

Los archivos de lógica (`almacenamiento`, `sesion`, `carrito`) no tocan el HTML. Los listeners están solo en `login.js` y `tienda.js`.

## Para probar

- **Recargar**: la sesión y el carrito siguen.
- **Otra pestaña**: hay que volver a iniciar sesión (cada pestaña tiene su sessionStorage), pero el inventario es el mismo.
- **Comprar en una pestaña**: en la otra se actualizan solas las existencias (evento `storage`), y si su carrito ya no alcanza, avisa y no deja comprar.
- **Cerrar sesión**: se borran la sesión y el carrito y vuelve al login.
- **Abrir `tienda.html` sin sesión**: redirige a `index.html`.
- **Volver al stock inicial**: F12 → Aplicación → Local Storage → borrar `inventario`.
