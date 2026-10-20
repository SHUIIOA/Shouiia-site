/* ---------------- view reset registry ---------------- */
/* Cada módulo registra un callback que se ejecuta al cambiar de vista,
   para poder cerrar sus propios paneles de detalle. */
const viewResetters = [];

export function onViewChange(fn){
  viewResetters.push(fn);
}

/* ---------------- tab switching ---------------- */
export function showView(name, {fromHash=false}={}){
  const view = document.getElementById('view-'+name);
  if(!view) return;

  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  view.classList.add('active');

  document.querySelectorAll('.tab').forEach(t=>{
    const on = t.dataset.view === name;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on);
  });

  viewResetters.forEach(fn=>fn(name));

  if(!fromHash && location.hash !== '#'+name){
    location.hash = name;
  }
}

export function wireNav(){
  document.querySelectorAll('.tab').forEach(t=>{
    t.addEventListener('click', ()=>showView(t.dataset.view));
  });
  document.querySelectorAll('[data-goto]').forEach(el=>{
    el.addEventListener('click', ()=>showView(el.dataset.goto));
  });
}

/* ---------------- hash routing ---------------- */
export function viewFromHash(){
  const name = location.hash.replace(/^#/, '');
  return document.getElementById('view-'+name) ? name : 'home';
}

/* Normaliza la URL sin apilar entradas en el historial del navegador. */
export function syncHash(name){
  if(location.hash !== '#'+name){
    history.replaceState(null, '', '#'+name);
  }
}

export function startRouter(){
  window.addEventListener('hashchange', ()=>{
    const name = viewFromHash();
    showView(name, {fromHash:true});
    syncHash(name);
  });
}
