#!/bin/bash
# Despliega mis dos webs con nginx en Ubuntu Server (Despliegue de Aplicaciones Web, 2.º DAW)
#   http://localhost/portfolio/  <- github.com/martinete14/martin-portfolio
#   http://localhost/pulperia/   <- github.com/martinete14/la-pulperia
# nginx escucha en el 8080 (y en el 80). VirtualBox reenvía el 80 de Windows al 8080 de Ubuntu,
# así en el navegador alcanza con poner localhost/NOMBRE/.
# Uso, dentro de la VM:  sudo bash webs.sh
set -e

if [ "$(id -u)" -ne 0 ]; then
    echo "Hay que ejecutarlo con sudo: sudo bash webs.sh"
    exit 1
fi

echo
echo "=== 1/5 nginx y git (si ya están, no hace nada) ==="
apt-get update -qq
apt-get install -y -qq nginx git curl
systemctl enable --now nginx

echo
echo "=== 2/5 Un solo sitio que carga un archivo por web desde /etc/nginx/webs/ ==="
mkdir -p /etc/nginx/webs /var/www/inicio
cat > /etc/nginx/sites-available/miswebs <<'EOF'
server {
    listen 80 default_server;
    listen 8080 default_server;
    server_name _;

    # sin esto, /portfolio redirige a /portfolio/ metiendo el :8080 en la URL
    absolute_redirect off;

    root /var/www/inicio;
    index index.html;

    include /etc/nginx/webs/*.conf;
}
EOF
find /etc/nginx/sites-enabled/ -mindepth 1 -delete
ln -sf /etc/nginx/sites-available/miswebs /etc/nginx/sites-enabled/

echo
echo "=== 3/5 Saco las dos webs de prueba del principio ==="
for VIEJA in mdn landing; do
    rm -f /etc/nginx/webs/$VIEJA.conf
    rm -rf /var/www/$VIEJA
done

anadir_web() {
    NOMBRE=$1
    REPO=$2
    CARPETA=$3
    echo "--- $NOMBRE <- $REPO"
    rm -rf /var/www/$NOMBRE
    git clone --quiet $REPO /var/www/$NOMBRE
    chown -R www-data:www-data /var/www/$NOMBRE
    cat > /etc/nginx/webs/$NOMBRE.conf <<EOF
location = /$NOMBRE { return 301 /$NOMBRE/; }
location /$NOMBRE/ {
    alias /var/www/$NOMBRE/$CARPETA;
    index index.html;
}
EOF
}

echo
echo "=== 4/5 Clono las dos webs desde GitHub ==="
anadir_web portfolio https://github.com/martinete14/martin-portfolio.git ""
anadir_web pulperia https://github.com/martinete14/la-pulperia.git ""

# la portada de localhost/, con los colores de mi guía de estilos
cat > /var/www/inicio/index.html <<'EOF'
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Despliegue · Martín Villagra</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #12324a; color: #fff; font-family: system-ui, sans-serif; }
  main { width: min(92vw, 760px); padding: 40px 0; }
  small { color: #74acdf; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; font-size: 12px; }
  h1 { margin: 12px 0 0; font: 500 clamp(34px, 6vw, 54px)/1.1 Georgia, serif; }
  h1 em { color: #74acdf; }
  i { display: block; width: 50px; height: 4px; margin: 22px 0 30px; background: #f6b40e; }
  p { color: #c9dcef; line-height: 1.6; }
  .webs { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-top: 28px; }
  a { display: block; padding: 24px; border: 1px solid rgba(116,172,223,.35); border-radius: 14px; color: #fff; text-decoration: none; background: rgba(255,255,255,.04); }
  a:hover { border-color: #f6b40e; }
  a b { display: block; font: 500 26px Georgia, serif; }
  a span { color: #74acdf; font-size: 14px; }
</style>
</head>
<body>
<main>
  <small>Despliegue de Aplicaciones Web · 2.º DAW</small>
  <h1>Dos webs en <em>nginx</em></h1>
  <i></i>
  <p>Ubuntu Server en VirtualBox. Cada web se clona desde GitHub y nginx la sirve en su ruta.</p>
  <div class="webs">
    <a href="/portfolio/"><b>Mi portfolio</b><span>localhost/portfolio/ · martin-portfolio</span></a>
    <a href="/pulperia/"><b>La Pulpería</b><span>localhost/pulperia/ · la-pulperia</span></a>
  </div>
</main>
</body>
</html>
EOF
chown -R www-data:www-data /var/www/inicio

if ufw status 2>/dev/null | grep -q "Status: active"; then
    ufw allow 80/tcp
    ufw allow 8080/tcp
fi

nginx -t
systemctl reload nginx
sleep 2   # que terminen los workers viejos antes de comprobar

echo
echo "=== 5/5 Comprobación (200 = bien, 301 = redirige a la barra final) ==="
for RUTA in / /portfolio /portfolio/ /pulperia/ /portfolio/assets/css/martin.css /pulperia/assets/images/pulperia/hero-1.jpg; do
    R=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" http://localhost:8080$RUTA || true)
    printf "  %-48s %s\n" "localhost:8080$RUTA" "$R"
done
echo
echo "LISTO. En el navegador de Windows: http://localhost/portfolio/  y  http://localhost/pulperia/"
