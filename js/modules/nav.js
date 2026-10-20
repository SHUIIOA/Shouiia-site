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
    /* roving tabindex: solo el tab activo es tabulable,
       el resto se alcanza con las flechas del teclado */
    t.tabIndex = on ? 0 : -1;
  });

  viewResetters.forEach(fn=>fn(name));

  if(!fromHash && location.hash !== '#'+name){
    location.hash = name;
  }
}

export function wireNav(){
  const tabs = [...document.querySelectorAll('.tab')];

  tabs.forEach(t=>{
    t.addEventListener('click', ()=>showView(t.dataset.view));
  });

  /* navegacion por teclado del patron WAI-ARIA Tabs */
  tabs.forEach((tab, i)=>{
    tab.addEventListener('keydown', e=>{
      let target = null;
      if(e.key === 'ArrowRight')     target = tabs[(i+1) % tabs.length];
      else if(e.key === 'ArrowLeft')  target = tabs[(i-1+tabs.length) % tabs.length];
      else if(e.key === 'Home')       target = tabs[0];
      else if(e.key === 'End')        target = tabs[tabs.length-1];
      if(!target) return;
      e.preventDefault();
      showView(target.dataset.view);
      target.focus();
    });
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
