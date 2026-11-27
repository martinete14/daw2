# DESPLIEGUE

Despliegue de aplicaciones web.

## Dos webs en nginx con Ubuntu Server

La actividad: clonar dos webs de GitHub y desplegarlas en un Ubuntu Server, en el localhost y en el puerto 8080. Parto de la guía que armó mi compañero (nginx con una `location` por web) y la adapté al 8080.

Las dos webs son plantillas con licencia MIT que personalicé, cada una en su repo:

| Ruta | Repo | Qué es |
|---|---|---|
| `localhost/portfolio/` | [martin-portfolio](https://github.com/martinete14/martin-portfolio) | Mi portfolio, sobre la plantilla vCard, con la paleta de mi guía de estilos (`INTERFAZ/Tp2`), mi CV y mis proyectos |
| `localhost/pulperia/` | [la-pulperia](https://github.com/martinete14/la-pulperia) | La cara de afuera de La Pulpería (`WEBSERVICIO/ExamenTienda`), sobre la plantilla Grilli, con la identidad de afiches y los productos de `pulperia.sql` |

Las dos traen las fuentes y los íconos adentro del repo, así nginx sirve todo desde la VM y se ven completas sin internet.

### Cómo está armado

- **La VM:** `UbuntuServer-DAWNETE`, Ubuntu Server 26.04 LTS en VirtualBox, con la red en NAT.
- **El reenvío de puertos** (Configuración → Red → Avanzado → Reenvío de puertos, Host IP y Guest IP vacíos):

| Nombre | Puerto anfitrión (Windows) | Puerto invitado (Ubuntu) | Para qué |
|---|---|---|---|
| WEB | 80 | 8080 | Abrir las webs como `localhost/NOMBRE/`, sin puerto en la URL |
| HTTP | 8080 | 8080 | Lo mismo, pero con `localhost:8080/NOMBRE/` |
| SSH | 2222 | 22 | Conectarse por SSH desde Windows |

- **nginx:** un solo sitio, `miswebs`, que escucha en el 8080 (y en el 80) y carga un archivo por web desde `/etc/nginx/webs/`. Cada web es una `location` con `alias` a su carpeta en `/var/www/`. Tiene `absolute_redirect off` para que `/portfolio` redirija a `/portfolio/` sin meter el `:8080` en la URL.
- **La portada:** `localhost/` muestra una página con los links a las dos webs (`/var/www/inicio`).

### Desplegar

Dentro de la VM, con el usuario normal:

```bash
wget raw.githubusercontent.com/martinete14/daw2/main/DESPLIEGUE/webs.sh
sudo bash webs.sh
```

[`webs.sh`](webs.sh) instala nginx y git si faltan, arma el sitio `miswebs`, saca las dos webs de prueba del principio (`mdn` y `landing`), clona las dos webs, escribe la portada, recarga nginx y al final hace un `curl` a cada ruta: tiene que dar `200` (o `301` en `/portfolio`, que redirige a la barra final).

En Windows: `http://localhost/portfolio/` y `http://localhost/pulperia/`.

### Para mostrarlo

```bash
systemctl status nginx          # active (running); se sale con q
sudo ss -tlnp                   # nginx escuchando en 0.0.0.0:8080 y 0.0.0.0:80
ls /var/www                     # inicio, portfolio, pulperia
git -C /var/www/portfolio remote -v
git -C /var/www/pulperia remote -v
cat /etc/nginx/sites-available/miswebs
cat /etc/nginx/webs/*.conf
sudo nginx -t
curl -I localhost:8080/portfolio/
curl -I localhost:8080/pulperia/
```

### Actualizar una web después de un cambio en GitHub

```bash
sudo -u www-data git -C /var/www/portfolio pull
sudo -u www-data git -C /var/www/pulperia pull
```

### Cosas que me encontré

- **El Apache de XAMPP también usa el 80 de Windows.** Para que VirtualBox pueda reenviar el 80, Apache tiene que estar parado antes de arrancar la VM. Si se arrancó con Apache encendido: parar Apache y reiniciar la VM. Para volver a usar XAMPP, apagar la VM.
- **El teclado de la VM está en inglés (US).** En el teclado latinoamericano la `/` sale con la tecla `-`. Se arregla con `sudo dpkg-reconfigure keyboard-configuration`, eligiendo Spanish (Latin American), y reiniciando.
- **Sin `absolute_redirect off`** nginx redirige `/portfolio` a `http://localhost:8080/portfolio/`, y el puerto aparece en la URL.
- **Si se olvida la contraseña de Ubuntu:** al arrancar, apretar Esc para ver el menú de GRUB, entrar en *Advanced options* → *recovery mode*, elegir `network` y después `root`, y cambiarla con `passwd usuario`.
