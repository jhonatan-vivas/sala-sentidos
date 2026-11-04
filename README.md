# Portal Sala de los Sentidos · UTP

Sitio web de la Sala de los Sentidos (VRSBU, Universidad Tecnológica de Pereira).
Está hecho con **Jekyll**, que **GitHub Pages compila solo**: no hay servidor ni base de datos.
El contenido vive en archivos de texto (`.yml` y `.md`). Se pueden editar a mano o con el **panel de edición** (Decap CMS).

---

## 1. Publicarlo en GitHub Pages (una sola vez)

1. Crea un repositorio en GitHub, por ejemplo `sala-de-los-sentidos`.
2. Descomprime el .zip en una carpeta y súbelo con Git Bash:
   ```bash
   cd sala-de-los-sentidos
   git init
   git add .
   git commit -m "Primera versión del portal"
   git branch -M main
   git remote add origin https://github.com/USUARIO/sala-de-los-sentidos.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings › Pages**. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)**.
4. Antes de subir, abre estos dos archivos y cambia `USUARIO` por tu usuario de GitHub:
   - `_config.yml` → `url: "https://USUARIO.github.io"`. Si el repositorio tiene otro nombre, cambia también `baseurl`.
   - `admin/config.yml` → `repo: USUARIO/sala-de-los-sentidos`.

El sitio queda en `https://USUARIO.github.io/sala-de-los-sentidos/`. Después de cada `git push`, GitHub lo actualiza solo en 1 o 2 minutos.

---

## 2. Editar el contenido con el panel (en tu computador)

El panel es una página con formularios. Lo que llenas se guarda directamente en los archivos de la carpeta, sin tocar código. Después revisas los cambios y los subes con Git Bash.

**Requisito:** tener [Node.js](https://nodejs.org) instalado (versión LTS).

1. Abre **dos** ventanas de Git Bash dentro de la carpeta del proyecto.
2. En la primera ejecuta (déjala abierta):
   ```bash
   npx decap-server
   ```
3. En la segunda ejecuta (déjala abierta):
   ```bash
   npx http-server -p 4000 -c-1
   ```
4. Abre en el navegador: **http://localhost:4000/admin/**
5. Edita lo que necesites y pulsa **Publicar** (en modo local solo guarda el archivo en tu computador).
6. Sube los cambios:
   ```bash
   git status            # ver qué cambió
   git add .
   git commit -m "Agrego clase 4 del nivel 1"
   git push
   ```

> El panel solo funciona en tu computador (`localhost`). Si abres `/admin/` en el sitio publicado, pedirá iniciar sesión con GitHub y no funcionará, porque eso requiere un servicio de autenticación adicional. Si algún día otra persona necesita editar desde su propio equipo, se puede configurar ese servicio sin cambiar nada más.

### Qué se edita en cada parte del panel

| Panel | Archivo | Para qué |
|---|---|---|
| Curso · Clases | `_clases/*.md` | Una clase por archivo: nivel, número, tema, **varios videos**, materiales y actividad. |
| Repositorio · Señas | `_senas/*.md` | Una seña por archivo: término, área, subárea, video, contexto, variantes y validación. |
| Secciones › Curso de LSC | `_data/curso.yml` | Video y texto de bienvenida, descripción de cada nivel. |
| Secciones › Comunidad Sorda | `_data/comunidad_sorda.yml` | Bienvenida, categorías, videos y podcast. |
| Secciones › Comunidad ciega | `_data/comunidad_ciega.yml` | Texto y recursos (sección por definir con la tiflóloga). |
| Secciones › Verificación | `_data/verificacion.yml` | Enlaces de los formularios. El QR se genera solo. |
| Configuración › Datos de la Sala | `_data/sitio.yml` | Contacto, logos, canal de YouTube, videos y texto de Inicio. |
| Configuración › Menú | `_data/menu.yml` | Texto de cada opción y su clip de seña. |
| Configuración › Equipo | `_data/equipo.yml` | Personas, rol, grupo, foto y presentación en LSC. |
| Configuración › Horarios | `_data/horarios.yml` | Horarios y aviso de cambios. |
| Configuración › Áreas del repositorio | `_data/areas.yml` | Áreas (Ingeniería, Licenciaturas…) y sus subáreas. |

---

## 3. Dónde va cada archivo

```
assets/img/logos/      logo-utp.svg, logo-sala.svg y sus versiones -blanco (reemplázalos con el mismo nombre)
assets/img/equipo/     fotos del equipo (el panel las sube aquí)
assets/video/menu/     clips de 2–3 s de las señas del menú: inicio.mp4, curso.mp4, comunidad-sorda.mp4,
                       repositorio.mp4, comunidad-ciega.mp4, verificacion.mp4
assets/uploads/        otros archivos que subas desde el panel
```

- **Logos:** si son `.png`, cambia la extensión en *Configuración › Datos de la Sala*.
- **Clips del menú:** `.mp4` sin audio, unos 480 px de ancho, idealmente menos de 500 KB. Si un clip falta, el sitio muestra "La seña estará disponible pronto".
- **Videos de clases, señas y Comunidad Sorda:** se quedan en **YouTube** (canal de la Sala; pueden ser *no listados*). En el panel pega el enlace completo (`https://youtu.be/…` o `https://www.youtube.com/watch?v=…`) o solo el ID. El sitio extrae el ID solo.
- **PDF y actividades:** pega el enlace (Drive, Classroom, Forms, etc.).

---

## 4. Tareas frecuentes

- **Agregar una clase:** *Curso · Clases › Nueva clase*. Escribe el nivel (1–4) y el número de la clase, que define el orden. Agrega uno o varios videos. Si desmarcas *Publicada*, la clase se oculta sin borrarla.
- **Agregar un área al repositorio** (por ejemplo, Ciencias de la Salud): en *Configuración › Áreas del repositorio* agrega el área y sus subáreas. Luego crea las señas eligiendo esa área. El menú lateral del repositorio se actualiza solo.
- **Agregar una persona al equipo:** *Configuración › Equipo*. Las personas con el mismo *Grupo* aparecen juntas.
- **Anunciar un cambio de horario:** *Configuración › Horarios › Aviso*.
- **Enlace directo a una seña:** `…/repositorio/#derivada` (el nombre del archivo de la seña).

---

## 5. Ver el sitio completo en tu computador (opcional)

El paso 2 sirve para editar. Para ver el sitio ya armado antes de subirlo, necesitas Ruby:

1. Instala Ruby (en Windows: *RubyInstaller* con DevKit).
2. En la carpeta del proyecto ejecuta:
   ```bash
   gem install bundler
   bundle install
   bundle exec jekyll serve
   ```
3. Abre `http://localhost:4000/sala-de-los-sentidos/`.

Si no quieres instalar Ruby, puedes subir los cambios y revisarlos en GitHub Pages.

---

## 6. Accesibilidad incluida

- Cada sección abre con un **video en LSC + su texto en español**.
- **Señas en el menú:**
  - En computador aparecen al pasar el mouse o al llegar con el teclado. Se pueden fijar y se cierran con *Esc*.
  - En celular se abren tocando la mano que hay junto a cada opción.
- **Botón flotante de accesibilidad** (abajo a la izquierda):
  - tamaño de letra;
  - alto contraste;
  - lectura en voz alta con la voz del navegador;
  - apagar las señas del menú.
  
  Las preferencias se recuerdan en el navegador de cada persona.
- Enlace "Saltar al contenido", foco visible, navegación completa con teclado, encabezados en orden y textos alternativos.
- Ningún video se reproduce solo con sonido.
- Tipografía **Atkinson Hyperlegible**, diseñada para baja visión.
- Colores institucionales con contraste AA: azul `#003D6D`, blanco y negro.

---

## 7. Pendiente de completar

Todo lo que aparece entre corchetes, por ejemplo `[Nombre]`, `[HH:MM – HH:MM]` o `[correo@utp.edu.co]`, es información por llenar. También faltan:

- logos oficiales;
- clips de las señas del menú;
- enlaces de YouTube y de los formularios de verificación;
- clases reales: hay 4 de ejemplo en `_clases/`;
- señas reales: hay 9 de ejemplo en `_senas/`.

Las clases y señas de ejemplo se pueden borrar desde el panel.
