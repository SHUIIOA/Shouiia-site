# assets/

Imagenes de la web. Se referencian desde `js/data.js`.

## Estructura

```
assets/img/
├── perfil/      foto de la biografia (inicio)
├── proyectos/   imagen de cada proyecto (card + detalle)
└── blog/        portadas e imagenes de las notas
```

## Como se referencian

En `js/data.js`:

```js
export const profile = {
  photo:"assets/img/perfil/sergio-ulloa.webp",
  photoAlt:"Sergio Ulloa"
};

export const projects = [
  {
    /* ... */
    image:"assets/img/proyectos/shoulla-web.webp",
    imageAlt:"Captura de Shoulla portafolio"
  }
];

export const posts = [
  {
    /* ... */
    image:"assets/img/blog/dns-github-pages.webp",
    imageAlt:"Configuracion de DNS en GitHub Pages"
  }
];
```

Las rutas son **relativas a la raiz del sitio** y funcionan igual en el
dominio propio (`shoulla.com/`) y en la subruta de GitHub Pages.

### Imagenes dentro del texto de una nota

El campo `content` de cada nota es HTML, asi que tambien admite imagenes:

```js
content:"<p>Texto de la nota.</p><img src=\"assets/img/blog/diagrama.png\" alt=\"Diagrama\">"
```

## Formatos recomendados

| Uso | Formato | Tamano maximo |
|---|---|---|
| Foto de perfil | `.webp` | 400 KB (se muestra a ~440px de ancho) |
| Imagen de proyecto | `.webp` | 250 KB (se muestra hasta 1180px de ancho) |
| Portada de nota | `.webp` | 200 KB (se muestra a ~640px, aspecto 16/9) |

- `.webp` pesa bastante menos que `.png`/`.jpg` con el mismo resultado.
- Si la imagen pesa mas de 1 MB, optimizala antes de subirla.
- `.jpg` y `.png` tambien funcionan.

## Si la imagen no se encuentra

No se muestran imagenes rotas. Si el archivo falta, la imagen se retira y
queda el fondo de debajo (el degradado con el icono en las tarjetas de
proyecto, o el texto "Foto pendiente" en la biografia).

## Reglas de git

`.gitignore` deja pasar las imagenes optimizadas (`.webp`, `.jpg`, `.jpeg`,
`.png`, `.avif`, `.svg`) y descarta el resto de archivos de esta carpeta
(por ejemplo un `.psd` o un `.zip` de trabajo).
