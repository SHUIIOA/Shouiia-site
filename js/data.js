export const profile = {
  /* Ruta de la foto de la biografia (opcional).
     Ejemplo: "assets/img/perfil/sergio-ulloa.webp"
     Si queda vacia se mantiene el placeholder "Foto pendiente". */
  photo:"assets/img/perfil/prof.jpg",
  photoAlt:"Sergio Ulloa"
};

export const projects = [
  {
    id:"Shoulla-webpage",
    name:"Shoulla portafolio",
    tag:"DESTACADO",
    cat:"web",
    short:"Página web para portafolio de trabajo y blog personal.",
    desc:"Página web que sirve como portafolio y a su vez un lugar para documentar mi proceso de aprendizaje en mis áreas de interés.",
    stack:["HTML","JavaScript","Css"],
    status:"En desarrollo activo",
    role:"Autor único",
    repo:"https://github.com/SHUIIOA/Shouiia-site",
    demo:null,
    /* Imagen del proyecto (opcional). Si queda vacia se ve el degradado con el icono.
       Ejemplo: "assets/img/proyectos/shoulla-web.webp" */
    image:"",
    imageAlt:"Captura de Shoulla portafolio",
    colorA:"#0e2a29", colorB:"#0A1828"
  }
];

export const posts = [
  {
    id:"github-pages",
    date:"2026-10-18",
    title:"Configurando DNS para hostear una página web en Github Pages",
    tag:"web",
    excerpt:"Problemas que tuve al intentar configurar una DNS para una página web por primera vez",
    /* Portada de la nota (opcional).
       Ejemplo: "assets/img/blog/dns-github-pages.webp" */
    image:"",
    imageAlt:"Configuracion de DNS en GitHub Pages",
    content:"<p>Documentando el proceso de deployment de una pagina web en Github Pages. Nada del otro mundo, pero es la clase de cosas que se pueden volver innecesariamente complejas.</p><p>La parte que más tiempo me tomó fue configurar correctamente la DNS para verificar el dominio en github, el hosting donde compre el dominio no tenía correctamente configurados los nameservers, me tomó un tiempo darme cuenta de que esa era la falla.</p>"
  }

];
