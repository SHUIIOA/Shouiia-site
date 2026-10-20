import { profile } from './data.js';
import { loadSections } from './modules/sections.js';
import { showView, wireNav, viewFromHash, syncHash, startRouter } from './modules/nav.js';
import { initProjects } from './modules/projects.js';
import { initBlog } from './modules/blog.js';
import { startStarfield } from './modules/starfield.js';
import { imgTag } from './modules/util.js';

/* ---------------- foto de la biografia (opcional) ---------------- */
function initProfilePhoto(){
  const host = document.getElementById('profile-photo');
  if(!host || !profile.photo) return;
  host.insertAdjacentHTML('afterbegin', imgTag(profile.photo, profile.photoAlt, { className:'profile-photo-img', eager:true }));
}

/* ---------------- boot ---------------- */
async function init(){
  await loadSections();

  initProfilePhoto();
  initProjects();
  initBlog();
  wireNav();
  startRouter();

  const initial = viewFromHash();
  showView(initial, {fromHash:true});
  syncHash(initial);

  startStarfield();
}

init();
