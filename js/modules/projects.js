import { projects } from '../data.js';
import { showView, onViewChange } from './nav.js';
import { imgTag, onActivate } from './util.js';

/* ---------------- state ---------------- */
let grid, filtersEl, detailEl;
const cats = [["todos","Todos"],["sistemas","Sistemas"],["web","Web"],["juegos","Juegos"]];
let activeCat = "todos";

/* ---------------- helpers ---------------- */
function iconFor(cat){
  const icons = {
    sistemas:'<svg viewBox="0 0 24 24" fill="none" stroke="#178582" stroke-width="1.3"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/></svg>',
    juegos:'<svg viewBox="0 0 24 24" fill="none" stroke="#178582" stroke-width="1.3"><rect x="2" y="7" width="20" height="10" rx="4"/><path d="M7 10v4M5 12h4M16 11h.01M18.5 13h.01"/></svg>',
    web:'<svg viewBox="0 0 24 24" fill="none" stroke="#178582" stroke-width="1.3"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/></svg>'
  };
  return icons[cat] || icons.sistemas;
}

function capsuleArtStyle(p){
  return `--art-a:${p.colorA}; --art-b:${p.colorB};`;
}

/* ---------------- project links (repo / demo are optional) ---------------- */
function projectLinks(p){
  const links = [];
  if(p.repo) links.push(`<a class="btn btn-primary" href="${p.repo}" target="_blank" rel="noopener noreferrer">Ver repositorio</a>`);
  if(p.demo) links.push(`<a class="btn btn-ghost" href="${p.demo}" target="_blank" rel="noopener noreferrer">Ver demo</a>`);
  if(!links.length) return '';
  return `<div class="detail-links">${links.join('')}</div>`;
}

/* ---------------- project specs (derived from the project fields) ---------------- */
function projectSpecs(p){
  const specs = [];
  if(p.role) specs.push(['Rol', p.role]);
  if(p.stack && p.stack.length) specs.push(['Stack', p.stack.join(', ')]);
  return specs;
}

/* ---------------- render: featured rail (home) ---------------- */
function renderFeaturedRail(){
  const rail = document.getElementById('featured-rail');
  projects.filter(p=>p.tag).forEach(p=>{
    const el = document.createElement('div');
    el.className = 'capsule';
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="capsule-art" style="${capsuleArtStyle(p)}">
        <span class="tag">${p.tag}</span>
        ${iconFor(p.cat)}
        ${imgTag(p.image, p.imageAlt, {className:'card-img'})}
      </div>
      <div class="capsule-body">
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <div class="stack-row">${p.stack.map(s=>`<span class="stack-chip">${s}</span>`).join('')}</div>
      </div>`;
    onActivate(el, ()=>openProject(p.id));
    rail.appendChild(el);
  });
}

/* ---------------- render: project grid + filters ---------------- */
function renderFilters(){
  filtersEl.innerHTML = cats.map(([id,label])=>
    `<button class="filter-chip ${id===activeCat?'active':''}" data-cat="${id}">${label}</button>`
  ).join('');
  filtersEl.querySelectorAll('.filter-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{ activeCat = chip.dataset.cat; renderFilters(); renderGrid(); });
  });
}

function renderGrid(){
  const list = activeCat==="todos" ? projects : projects.filter(p=>p.cat===activeCat);
  grid.innerHTML = "";
  list.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'card';
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="capsule-art" style="${capsuleArtStyle(p)}">
        ${iconFor(p.cat)}
        ${imgTag(p.image, p.imageAlt, {className:'card-img'})}
      </div>
      <div class="capsule-body">
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <div class="stack-row">${p.stack.map(s=>`<span class="stack-chip">${s}</span>`).join('')}</div>
      </div>`;
    onActivate(el, ()=>openProject(p.id));
    grid.appendChild(el);
  });
}

/* ---------------- project detail ---------------- */
function openProject(id){
  const p = projects.find(x=>x.id===id);
  if(!p) return;
  showView('projects');
  grid.style.display = 'none';
  filtersEl.style.display = 'none';
  document.querySelector('#view-projects .page-title').style.display = 'none';
  detailEl.classList.add('active');
  detailEl.innerHTML = `
    <button class="back-link" id="back-to-projects" type="button">← Volver a proyectos</button>
    <div class="detail-banner" style="background:radial-gradient(120% 140% at 30% 20%, ${p.colorA} 0%, ${p.colorB} 40%, #05070f 100%);">
      ${iconFor(p.cat)}
      ${imgTag(p.image, p.imageAlt, {className:'detail-img', eager:true})}
    </div>
    <div class="detail-head">
      <div>
        <h2>${p.name}</h2>
        <div class="status">${p.status}</div>
      </div>
      ${projectLinks(p)}
    </div>
    <div class="detail-body">
      <div>
        <p>${p.desc}</p>
        <div class="stack-row">${p.stack.map(s=>`<span class="stack-chip">${s}</span>`).join('')}</div>
      </div>
      <div class="spec-list">
        ${projectSpecs(p).map(([k,v])=>`<div class="spec-row"><span>${k.toUpperCase()}</span><span>${v}</span></div>`).join('')}
      </div>
    </div>`;
  document.getElementById('back-to-projects').addEventListener('click', closeProjectDetail);
  window.scrollTo({top:0, behavior:'smooth'});
}
function closeProjectDetail(){
  if(!detailEl) return;
  detailEl.classList.remove('active');
  detailEl.innerHTML = "";
  grid.style.display = 'grid';
  filtersEl.style.display = 'flex';
  document.querySelector('#view-projects .page-title').style.display = 'block';
}

/* ---------------- lifecycle ---------------- */
onViewChange(name=>{ if(name!=='projects') closeProjectDetail(); });

export function initProjects(){
  grid = document.getElementById('project-grid');
  filtersEl = document.getElementById('filters');
  detailEl = document.getElementById('project-detail');

  renderFeaturedRail();
  renderFilters();
  renderGrid();
}
