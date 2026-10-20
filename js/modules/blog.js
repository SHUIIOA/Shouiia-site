import { posts } from '../data.js';
import { showView, onViewChange } from './nav.js';
import { imgTag, onActivate } from './util.js';

/* ---------------- state ---------------- */
let postListEl, postDetailEl;

/* ---------------- render: home rail (ultimas notas) ---------------- */
function renderHomePosts(){
  const homePosts = document.getElementById('home-posts');
  posts.slice(0,3).forEach(p=>{
    const el = document.createElement('div');
    el.className = 'post-mini';
    el.tabIndex = 0;
    el.innerHTML = `
      ${p.image ? `<div class="post-art">${imgTag(p.image, p.imageAlt, {className:'post-art-img'})}</div>` : ''}
      <div class="post-mini-body">
        <div class="date mono">${p.date}</div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
      </div>`;
    onActivate(el, ()=>openPost(p.id));
    homePosts.appendChild(el);
  });
}

/* ---------------- render: blog list ---------------- */
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
    onActivate(el, ()=>openPost(p.id));
    postListEl.appendChild(el);
  });
}

/* ---------------- blog detail ---------------- */
function openPost(id){
  const p = posts.find(x=>x.id===id);
  if(!p) return;
  showView('blog');
  postListEl.style.display = 'none';
  document.querySelector('#view-blog .page-title').style.display = 'none';
  postDetailEl.classList.add('active');
  postDetailEl.innerHTML = `
    <button class="back-link" id="back-to-blog" type="button">← Volver a la bitácora</button>
    <div class="date mono">${p.date} · #${p.tag}</div>
    <h2>${p.title}</h2>
    ${p.image ? `<div class="post-cover">${imgTag(p.image, p.imageAlt, {className:'post-cover-img', eager:true})}</div>` : ''}
    <div class="content">${p.content}</div>`;
  document.getElementById('back-to-blog').addEventListener('click', closePostDetail);
  window.scrollTo({top:0, behavior:'smooth'});
}
function closePostDetail(){
  if(!postDetailEl) return;
  postDetailEl.classList.remove('active');
  postDetailEl.innerHTML = "";
  postListEl.style.display = 'flex';
  document.querySelector('#view-blog .page-title').style.display = 'block';
}

/* ---------------- lifecycle ---------------- */
onViewChange(name=>{ if(name!=='blog') closePostDetail(); });

export function initBlog(){
  postListEl = document.getElementById('post-list');
  postDetailEl = document.getElementById('post-detail');

  renderHomePosts();
  renderPostList();
}
