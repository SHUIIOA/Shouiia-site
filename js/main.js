import { projects, posts } from './data.js';

/* ---------------- load section partials ---------------- */
async function loadSections(){
  const [header, home, about, projectsView, blog, footer] = await Promise.all([
    fetch('sections/header.html').then(r=>r.text()),
    fetch('sections/home.html').then(r=>r.text()),
    fetch('sections/about.html').then(r=>r.text()),
    fetch('sections/projects.html').then(r=>r.text()),
    fetch('sections/blog.html').then(r=>r.text()),
    fetch('sections/footer.html').then(r=>r.text()),
  ]);

  document.getElementById('header-mount').innerHTML = header;
  document.getElementById('main-mount').innerHTML = home + about + projectsView + blog;
  document.getElementById('footer-mount').innerHTML = footer;
}

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
      </div>
      <div class="capsule-body">
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <div class="stack-row">${p.stack.map(s=>`<span class="stack-chip">${s}</span>`).join('')}</div>
      </div>`;
    el.addEventListener('click', ()=>openProject(p.id));
    el.addEventListener('keydown', e=>{ if(e.key==='Enter') openProject(p.id); });
    rail.appendChild(el);
  });
}

/* ---------------- render: home posts ---------------- */
function renderHomePosts(){
  const homePosts = document.getElementById('home-posts');
  posts.slice(0,3).forEach(p=>{
    const el = document.createElement('div');
    el.className = 'post-mini';
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="date mono">${p.date}</div>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>`;
    el.addEventListener('click', ()=>openPost(p.id));
    homePosts.appendChild(el);
  });
}

/* ---------------- render: project grid + filters ---------------- */
let grid, filtersEl, detailEl;
const cats = [["todos","Todos"],["sistemas","Sistemas"],["web","Web"],["juegos","Juegos"]];
let activeCat = "todos";

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
      <div class="capsule-art" style="${capsuleArtStyle(p)}">${iconFor(p.cat)}</div>
      <div class="capsule-body">
        <h3>${p.name}</h3>
        <p>${p.short}</p>
        <div class="stack-row">${p.stack.map(s=>`<span class="stack-chip">${s}</span>`).join('')}</div>
      </div>`;
    el.addEventListener('click', ()=>openProject(p.id));
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
    <span class="back-link" id="back-to-projects">← Volver a proyectos</span>
    <div class="detail-banner" style="background:radial-gradient(120% 140% at 30% 20%, ${p.colorA} 0%, ${p.colorB} 40%, #05070f 100%);">
      ${iconFor(p.cat)}
    </div>
    <div class="detail-head">
      <div>
        <h2>${p.name}</h2>
        <div class="status">${p.status}</div>
      </div>
      <div class="detail-links">
        <button class="btn btn-primary" onclick="return false;">Ver repositorio</button>
        <button class="btn btn-ghost" onclick="return false;">Ver demo</button>
      </div>
    </div>
    <div class="detail-body">
      <div>
        <p>${p.desc}</p>
        <div class="stack-row">${p.stack.map(s=>`<span class="stack-chip">${s}</span>`).join('')}</div>
      </div>
      <div class="spec-list">
        ${p.specs.map(([k,v])=>`<div class="spec-row"><span>${k.toUpperCase()}</span><span>${v}</span></div>`).join('')}
      </div>
    </div>`;
  document.getElementById('back-to-projects').addEventListener('click', closeProjectDetail);
  window.scrollTo({top:0, behavior:'smooth'});
}
function closeProjectDetail(){
  detailEl.classList.remove('active');
  detailEl.innerHTML = "";
  grid.style.display = 'grid';
  filtersEl.style.display = 'flex';
  document.querySelector('#view-projects .page-title').style.display = 'block';
}

/* ---------------- blog list + detail ---------------- */
let postListEl, postDetailEl;

function renderPostList(){
  posts.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'post-entry';
    el.tabIndex = 0;
    el.innerHTML = `
      <div class="date mono">${p.date}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <span class="tag">#${p.tag}</span>
      </div>`;
    el.addEventListener('click', ()=>openPost(p.id));
    postListEl.appendChild(el);
  });
}

function openPost(id){
  const p = posts.find(x=>x.id===id);
  if(!p) return;
  showView('blog');
  postListEl.style.display = 'none';
  document.querySelector('#view-blog .page-title').style.display = 'none';
  postDetailEl.classList.add('active');
  postDetailEl.innerHTML = `
    <span class="back-link" id="back-to-blog">← Volver a la bitácora</span>
    <div class="date mono">${p.date} · #${p.tag}</div>
    <h2>${p.title}</h2>
    <div class="content">${p.content}</div>`;
  document.getElementById('back-to-blog').addEventListener('click', closePostDetail);
  window.scrollTo({top:0, behavior:'smooth'});
}
function closePostDetail(){
  postDetailEl.classList.remove('active');
  postDetailEl.innerHTML = "";
  postListEl.style.display = 'flex';
  document.querySelector('#view-blog .page-title').style.display = 'block';
}

/* ---------------- tab switching ---------------- */
function showView(name){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>{
    const on = t.dataset.view === name;
    t.classList.toggle('active', on);
    t.setAttribute('aria-selected', on);
  });
  if(name!=='projects') closeProjectDetail();
  if(name!=='blog') closePostDetail();
}

function wireNav(){
  document.querySelectorAll('.tab').forEach(t=>{
    t.addEventListener('click', ()=>showView(t.dataset.view));
  });
  document.querySelectorAll('[data-goto]').forEach(el=>{
    el.addEventListener('click', ()=>showView(el.dataset.goto));
  });
}

/* ---------------- starfield canvas ---------------- */
function startStarfield(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    const count = Math.floor((canvas.width * 600) / 9000);
    stars = Array.from({length:count}, ()=>({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.2 + 0.2,
      a: Math.random()*0.6 + 0.2,
      tw: Math.random()*0.02 + 0.005
    }));
  }
  let t=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      const flicker = s.a + Math.sin(t*s.tw*10 + s.x)*0.15;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(220,230,255,${Math.max(0,flicker)})`;
      ctx.fill();
    });
    t++;
    requestAnimationFrame(draw);
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize();
  window.addEventListener('resize', resize);
  if(!reduceMotion){ requestAnimationFrame(draw); } else { draw(); }
}

/* ---------------- boot ---------------- */
async function init(){
  await loadSections();

  grid = document.getElementById('project-grid');
  filtersEl = document.getElementById('filters');
  detailEl = document.getElementById('project-detail');
  postListEl = document.getElementById('post-list');
  postDetailEl = document.getElementById('post-detail');

  renderFeaturedRail();
  renderHomePosts();
  renderFilters();
  renderGrid();
  renderPostList();
  wireNav();
  startStarfield();
}

init();
