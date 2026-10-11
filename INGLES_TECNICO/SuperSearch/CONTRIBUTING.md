# Cómo colaborar en SuperSearch

SuperSearch vive dentro del repositorio de Martín, <https://github.com/martinete14/daw2>, que también tiene los trabajos de **todas sus asignaturas**. Por eso la regla más importante es tocar **solo** la carpeta `INGLES_TECNICO/SuperSearch/`.

- **Martín** es el propietario: revisa los Pull Requests y decide si se integran.
- **Jesús y Cristina** trabajan en una copia propia del repositorio (un *fork*) y proponen sus cambios con un *Pull Request*.

## Índice

0. [Antes de empezar](#0-antes-de-empezar)
1. [Qué impone GitHub y qué acordamos nosotros](#1-qué-impone-github-y-qué-acordamos-nosotros)
2. [Crear el fork (una sola vez)](#2-crear-el-fork-una-sola-vez)
3. [Clonar el fork y conectarlo con el original (una sola vez)](#3-clonar-el-fork-y-conectarlo-con-el-original-una-sola-vez)
4. [Empezar una tarea: crear una rama](#4-empezar-una-tarea-crear-una-rama)
5. [Trabajar solo en la carpeta del proyecto](#5-trabajar-solo-en-la-carpeta-del-proyecto)
6. [Revisar antes de subir](#6-revisar-antes-de-subir)
7. [Commit y push](#7-commit-y-push)
8. [Abrir el Pull Request](#8-abrir-el-pull-request)
9. [Mantener la rama al día y resolver conflictos](#9-mantener-la-rama-al-día-y-resolver-conflictos)
10. [Para Martín: revisar e integrar un Pull Request](#10-para-martín-revisar-e-integrar-un-pull-request)
11. [Problemas frecuentes](#11-problemas-frecuentes)

## 0. Antes de empezar

Necesitás:

- Una cuenta de GitHub.
- Git instalado (<https://git-scm.com>) y, recomendado, VS Code.
- Tu nombre y tu correo configurados en Git. Se hace una sola vez por computadora:

  ```bash
  git config --global user.name "Tu Nombre"
  git config --global user.email "tu-correo@ejemplo.com"
  ```

Vocabulario mínimo:

| Palabra | Qué es |
| --- | --- |
| **Repositorio original** | `martinete14/daw2`, el de Martín. |
| **Fork** | Tu copia del original en GitHub (`TU-USUARIO/daw2`). Ahí sí podés subir cambios. |
| **`origin`** | El nombre que Git le da a **tu fork** en tu computadora. |
| **`upstream`** | El nombre que le vamos a dar al **original** para poder traer novedades. |
| **Rama** | Una línea de trabajo separada. Cada tarea va en su propia rama. |
| **Pull Request (PR)** | Una propuesta para que los cambios de tu rama entren en el original. |

Los comandos de esta guía funcionan en Git Bash y en la terminal de VS Code. Cuando un comando cambia según la terminal, aparecen las dos versiones.

## 1. Qué impone GitHub y qué acordamos nosotros

Algunas reglas las aplica GitHub automáticamente. Otras son **solo acuerdos del equipo**: GitHub no las comprueba, así que se controlan a mano en la revisión (sección 10).

| Regla | ¿La impone GitHub? |
| --- | --- |
| Solo Martín puede subir cambios (*push*) al repositorio original. | **Sí**, siempre que Martín no agregue a nadie en *Settings → Collaborators*. Un colaborador tendría permiso de escritura en **todo** el repositorio, no solo en esta carpeta. |
| Cualquiera puede hacer un fork del repositorio y abrir un PR. | **Sí**, porque el repositorio es público. Si fuera privado, habría que invitar a Jesús y Cristina como colaboradores, y eso les daría escritura en todo. |
| Un PR solo entra en el original cuando Martín lo integra (*merge*). | **Sí.** Solo alguien con permiso de escritura puede integrarlo. |
| Los cambios se limitan a `INGLES_TECNICO/SuperSearch/`. | **No.** GitHub no tiene permisos por carpeta en un repositorio personal. Lo revisa Martín en cada PR. |
| Ramas con nombre descriptivo, una tarea por PR, descripción con pruebas y formato de los mensajes de commit. | **No.** Es un acuerdo del equipo. |
| Sin frameworks ni dependencias, datos en `js/data.js`, interfaz en inglés y documentación en español. | **No.** Es un acuerdo del equipo, y se revisa con la checklist. |

## 2. Crear el fork (una sola vez)

1. Entrá en <https://github.com/martinete14/daw2> con tu cuenta.
2. Pulsá **Fork** (arriba a la derecha) y después **Create fork**.
3. Se crea tu copia en `https://github.com/TU-USUARIO/daw2`.

## 3. Clonar el fork y conectarlo con el original (una sola vez)

```bash
git clone https://github.com/TU-USUARIO/daw2.git
cd daw2
git remote add upstream https://github.com/martinete14/daw2.git
git remote -v
```

`git remote -v` tiene que mostrar `origin` apuntando a **tu** fork y `upstream` apuntando a `martinete14/daw2`.

La primera vez que hagas `push`, Git te va a pedir que inicies sesión en GitHub. En Windows se abre una ventana del navegador. GitHub no acepta tu contraseña normal en la terminal, así que, si te la pide ahí, usá esa ventana o un *token* personal.

## 4. Empezar una tarea: crear una rama

Antes de cada tarea nueva, avisá al grupo qué vas a hacer, para no editar los mismos archivos que otra persona a la vez. Después, traé lo último del original y creá la rama a partir de ahí:

```bash
git fetch upstream
git switch -c feature/supersearch-recipes upstream/main
```

**Nombres de rama:** `tipo/supersearch-descripcion-corta`, en minúsculas y con guiones.

| Tipo | Para qué | Ejemplo |
| --- | --- | --- |
| `feature/` | Algo nuevo | `feature/supersearch-recipes`, `feature/supersearch-search` |
| `fix/` | Arreglar algo que falla | `fix/supersearch-mobile` |
| `docs/` | Solo documentación o guion | `docs/supersearch-pitch` |

Una rama = una tarea = un PR. Si querés hacer otra cosa, creá otra rama.

## 5. Trabajar solo en la carpeta del proyecto

Abrí y editá únicamente archivos dentro de `INGLES_TECNICO/SuperSearch/`. **No toques** el README raíz, el `.gitignore` ni las carpetas de otras asignaturas, ni siquiera para "arreglar" algo.

Para probar la app:

```bash
cd INGLES_TECNICO/SuperSearch
python -m http.server 8000
# abrir http://localhost:8000 y parar con Ctrl + C
```

También podés usar Live Server de VS Code. Los precios, productos y recetas se cambian en `js/data.js` (el [README](README.md#cómo-modificar-los-datos) explica el formato).

## 6. Revisar antes de subir

**1. Qué archivos cambiaste:**

```bash
git status
```

Todas las rutas tienen que empezar por `INGLES_TECNICO/SuperSearch/`. Si aparece otra:

| Lo que ves en `git status` | Qué hacer |
| --- | --- |
| `modified: OTRA/ruta` (sin `git add`) | `git restore OTRA/ruta` (descarta tu cambio en ese archivo). |
| En *Changes to be committed* (ya hiciste `git add`) | `git restore --staged OTRA/ruta` y después lo anterior. |
| *Untracked files: OTRA/ruta* (archivo nuevo tuyo) | No lo agregues. Borralo si lo creaste por error. |

**2. Qué cambiaste dentro de los archivos:**

```bash
git diff
```

Tienen que aparecer solo los cambios que querías hacer. Para salir de la vista, pulsá `q`.

**3. Comprobación final: tu rama comparada con el original.** Este paso revisa también los commits que ya hiciste:

```bash
git fetch upstream
git diff --name-only upstream/main...HEAD
```

Ves la lista de archivos que va a incluir el PR. Para mostrar **solo los que estén fuera de la carpeta** (lo correcto es que no aparezca nada):

```bash
# Git Bash
git diff --name-only upstream/main...HEAD | grep -v '^INGLES_TECNICO/SuperSearch/'
```

```powershell
# PowerShell (terminal por defecto de VS Code en Windows)
git diff --name-only upstream/main...HEAD | Where-Object { $_ -notlike 'INGLES_TECNICO/SuperSearch/*' }
```

Si aparece algún archivo, mirá la sección [11](#11-problemas-frecuentes).

## 7. Commit y push

Agregá **solo** la carpeta del proyecto. Nunca uses `git add .` ni `git add -A` en este repositorio.

```bash
git add INGLES_TECNICO/SuperSearch
git commit -m "INGLES_TECNICO: SuperSearch, añade receta de lentejas"
git push -u origin feature/supersearch-recipes
```

Los mensajes siguen el formato del repositorio: `ASIGNATURA: qué hiciste`, en español y explicando el cambio. Por ejemplo: `INGLES_TECNICO: SuperSearch, arregla la lista en el móvil`.

## 8. Abrir el Pull Request

1. En tu fork, en GitHub, pulsá **Compare & pull request** (o andá a *Pull requests → New pull request*).
2. Revisá la parte de arriba: **base repository** `martinete14/daw2`, **base** `main` ← **head repository** `TU-USUARIO/daw2`, **compare** tu rama.
3. Escribí un título corto, por ejemplo `SuperSearch: receta de lentejas`.
4. Copiá esta plantilla en la descripción y completala. GitHub **no** la carga sola, porque está en este documento y no en la configuración del repositorio.

   ```markdown
   ## Qué cambia
   - (Lista breve de cambios)

   ## Por qué
   - (Qué problema resuelve o qué tarea completa)

   ## Cómo probarlo
   1. Abrir `INGLES_TECNICO/SuperSearch/index.html` (o `python -m http.server 8000`).
   2. (Pasos concretos: a qué vista ir, qué pulsar, qué debería verse)

   ## Comprobaciones
   - [ ] Solo cambié archivos dentro de `INGLES_TECNICO/SuperSearch/` (sección 6, paso 3).
   - [ ] La consola del navegador (F12 → Console) no muestra errores.
   - [ ] Lo probé en escritorio y en ancho de móvil.
   - [ ] Si cambió el comportamiento de la app, actualicé el README o el guion.

   ## Capturas
   (Si cambia algo visual)
   ```

5. Dejá marcada la casilla **Allow edits by maintainers**. Así Martín puede hacer pequeños arreglos en tu rama si hace falta.
6. Pulsá **Create pull request**.

**Si Martín te pide cambios**, hacelos en la misma rama y repetí las secciones 6 y 7 (`git add`, `git commit`, `git push`). El PR se actualiza solo, así que no hace falta abrir otro.

## 9. Mantener la rama al día y resolver conflictos

Mientras trabajás, Martín sigue subiendo otras asignaturas, y también puede integrar PRs de tus compañeros. Si GitHub dice **This branch has conflicts**, o si querés traer lo último antes de seguir, actualizá tu rama:

```bash
git fetch upstream
git merge upstream/main
```

Si no hay conflictos, `git push` y listo. Si hay conflictos, `git status` los muestra como `both modified`:

**Conflicto dentro de `INGLES_TECNICO/SuperSearch/`** (por ejemplo, tu compañera también cambió `js/data.js`):

1. Abrí el archivo en VS Code. Vas a ver bloques marcados con `<<<<<<<`, `=======` y `>>>>>>>`.
2. Elegí *Accept Current* (lo tuyo), *Accept Incoming* (lo del original) o *Accept Both*. Normalmente hay que **conservar el trabajo de las dos personas**, así que revisá el resultado a mano y borrá cualquier marca que quede.
3. Probá que la app siga funcionando.
4. Terminá la integración:

   ```bash
   git add INGLES_TECNICO/SuperSearch
   git commit -m "INGLES_TECNICO: SuperSearch, integra cambios de main"
   git push
   ```

**Conflicto fuera de `INGLES_TECNICO/SuperSearch/`**: significa que tocaste un archivo que no debías. Quedate con la versión del original:

```bash
git checkout upstream/main -- RUTA/DEL/ARCHIVO
```

Después seguí con el paso 4 de la lista anterior.

**Nunca, para "arreglar" un conflicto:**

- Borres carpetas o archivos de otras asignaturas.
- Uses `git reset --hard`, `git push --force`, `git checkout --ours .` o `git checkout --theirs .`, porque afectan a **todo** el repositorio.
- Copies tu carpeta encima de un clon nuevo y la subas tal cual. Así se pierden los cambios de los demás.

Si te perdés en medio de una integración, `git merge --abort` deja todo como estaba antes del `git merge`, y podés pedir ayuda.

## 10. Para Martín: revisar e integrar un Pull Request

### Checklist de revisión

Copiala en un comentario del PR y marcala a medida que revisás:

```markdown
- [ ] En **Files changed**, todos los archivos están dentro de `INGLES_TECNICO/SuperSearch/` (incluidos los borrados y los renombrados).
- [ ] No se borró ni se modificó nada de otras asignaturas, ni el README raíz ni `.gitignore`.
- [ ] No hay archivos ajenos (`node_modules`, `.vscode`, `.DS_Store`, `Thumbs.db`, imágenes pesadas sin usar).
- [ ] No se agregaron frameworks, librerías, CDNs ni dependencias. Las imágenes son locales.
- [ ] La descripción explica qué cambia y cómo probarlo, y los pasos funcionan.
- [ ] GitHub no marca conflictos (si los marca, pedir al autor la sección 9).
- [ ] La app abre sin errores en la consola (F12 → Console).
- [ ] Discover, Products, Recipes, el detalle de receta y My list siguen funcionando, en escritorio y en el móvil.
- [ ] Los precios nuevos salen de `js/data.js`, sin importes escritos a mano en otras vistas, y el aviso de datos de demostración sigue visible.
- [ ] La interfaz sigue en inglés y la documentación en español.
- [ ] Si cambió el comportamiento, se actualizaron el README o `docs/PITCH_SCRIPT.md`.
```

### Probar el PR en tu computadora

Reemplazá `12` por el número del PR:

```bash
git fetch origin
git fetch origin pull/12/head:pr-12
git diff --name-only origin/main...pr-12
git switch pr-12
```

`git diff --name-only` muestra los archivos del PR: todos tienen que empezar por `INGLES_TECNICO/SuperSearch/`. Si hay muchos, filtralos con el mismo `grep -v` o `Where-Object` de la sección 6. Después de probar:

```bash
git switch main
git branch -D pr-12
```

### Integrar o pedir cambios

En la pestaña **Files changed**, pulsá **Review changes**:

- **Request changes**, explicando qué falta. El autor corrige en la misma rama.
- **Approve**, y después volvé a la pestaña **Conversation**, pulsá **Merge pull request** y luego **Confirm merge**.

Si hay conflictos, pedile al autor que actualice su rama (sección 9) en lugar de resolverlos desde la web, salvo que sean triviales y estén dentro de la carpeta.

Después de integrar, **antes de seguir trabajando en cualquier asignatura**, traé el resultado a tu computadora:

```bash
git switch main
git pull
```

Si no lo hacés, tu próximo `git push` a `main` va a ser rechazado, porque GitHub tiene commits que tu copia todavía no tiene.

### Cuando Martín cambia SuperSearch

Martín puede subir directo a `main`, pero, para que el equipo revise igual que con los demás, conviene que use una rama y un PR dentro de su propio repositorio:

```bash
git switch -c fix/supersearch-algo
# ...cambios solo en INGLES_TECNICO/SuperSearch/...
git add INGLES_TECNICO/SuperSearch
git commit -m "INGLES_TECNICO: SuperSearch, ..."
git push -u origin fix/supersearch-algo
```

Además, no mezcles en un mismo commit cambios de SuperSearch con cambios de otras asignaturas.

## 11. Problemas frecuentes

**`git push` da *Permission denied* o *403*.** Seguramente estás haciendo push al original y no a tu fork. Revisá con `git remote -v` que `origin` sea `TU-USUARIO/daw2`.

**Ya hice commit de un archivo fuera de la carpeta.** Devolvelo a la versión del original y hacé un commit nuevo:

```bash
git fetch upstream
git checkout upstream/main -- RUTA/DEL/ARCHIVO
git commit -m "INGLES_TECNICO: SuperSearch, deshace cambio fuera de la carpeta"
git push
```

Si el archivo no existe en el original (lo creaste vos), usá `git rm RUTA/DEL/ARCHIVO` en lugar del `checkout`. Después, repetí la comprobación de la sección 6, paso 3.

**`git diff` o `git log` no terminan y no puedo escribir.** Pulsá `q`.

**No sé en qué rama estoy.** Usá `git status`: la primera línea lo dice.
