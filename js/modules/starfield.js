/* ---------------- starfield canvas ---------------- */
export function startStarfield(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){
    canvas.width = window.innerWidth;
    /* El canvas es position:fixed, solo se ve la porcion del viewport.
       Medirlo con scrollHeight creaba un canvas de 390x4000px en movil
       que se repintaba entero en cada frame. */
    canvas.height = window.innerHeight;
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
