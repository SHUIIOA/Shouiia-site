import { loadSections } from './modules/sections.js';
import { showView, wireNav, viewFromHash, syncHash, startRouter } from './modules/nav.js';
import { initProjects } from './modules/projects.js';
import { initBlog } from './modules/blog.js';
import { startStarfield } from './modules/starfield.js';

/* ---------------- boot ---------------- */
async function init(){
  await loadSections();

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
