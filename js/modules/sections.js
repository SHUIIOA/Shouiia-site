/* ---------------- load section partials ---------------- */
export async function loadSections(){
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
