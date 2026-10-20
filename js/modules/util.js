/* ---------------- utilidades compartidas ---------------- */

/* Marca un elemento como activable con clic, Enter o Espacio.
   Se usa en las cards y listas que se comportan como botones. */
export function onActivate(el, fn){
  el.addEventListener('click', fn);
  el.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){ e.preventDefault(); fn(); }
  });
}

/* ---------------- media ---------------- */
/* Resuelve rutas relativas contra la raiz real del sitio.
   Funciona igual en el dominio propio (shoulla.com/) y en la
   subruta de GitHub Pages (shuiioa.github.io/Shouiia-site/). */
const SITE_BASE = new URL('../../', import.meta.url);

export function mediaUrl(path){
  const p = String(path ?? '').trim();
  if(!p) return '';
  if(/^https?:\/\//i.test(p)) return p;   // URL absoluta
  if(p.startsWith('/')) return p;           // ruta desde la raiz
  return new URL(p.replace(/^\.?\//, ''), SITE_BASE).href;
}

/* Markup de imagen: carga diferida y respaldo si el archivo no existe.
   onerror retira la imagen y deja ver el fondo o degradado de debajo,
   por lo que nunca quedan marcos vacios ni imagenes rotas. */
export function imgTag(path, alt, { className='', eager=false }={}){
  const src = mediaUrl(path);
  if(!src) return '';
  const a = String(alt ?? '').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  return `<img class="${className}" src="${src}" alt="${a}" loading="${eager?'eager':'lazy'}" decoding="async" onerror="this.remove()">`;
}
