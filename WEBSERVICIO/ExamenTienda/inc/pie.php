  </main>
  <footer class="pie">
    <p class="pie-marca" aria-hidden="true">La Pulpería</p>
    <p class="pie-nota">lo de allá, acá</p>
    <p class="pie-letra">Almacén argentino en Europa · Precios en euros; en pesos, a una cotización fija de 1 € = <?php echo number_format(COTIZACION_ARS, 0, ",", "."); ?> ARS · Proyecto de DAW, Ilerna 2026</p>
  </footer>

  <!-- GSAP (animaciones) desde CDN. Si no carga, tienda.js lo detecta y la página se ve igual, sin animar -->
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
  <script defer src="js/tienda.js"></script>
</body>
</html>
