
/* stars + gentle sparkles + wishes */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d", { alpha: true });

let w, h, dpr;
function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.width = Math.floor(window.innerWidth * dpr);
  h = canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);
resize();

const stars = [];
const STAR_COUNT = Math.floor(Math.min(220, Math.max(120, (window.innerWidth * window.innerHeight) / 8000)));

function rand(min, max){ return Math.random() * (max - min) + min; }

for(let i=0;i<STAR_COUNT;i++){
  stars.push({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.6, 1.8) * dpr,
    a: rand(0.15, 0.9),
    tw: rand(0.002, 0.012),
    sp: rand(0.02, 0.12) * dpr
  });
}

const sparkles = [];
function addSparkle(x, y, big=false){
  const count = big ? 26 : 14;
  for(let i=0;i<count;i++){
    sparkles.push({
      x, y,
      vx: rand(-1.6, 1.6) * dpr * (big ? 1.25 : 1),
      vy: rand(-2.2, 0.8) * dpr * (big ? 1.25 : 1),
      life: rand(22, 46) * (big ? 1.25 : 1),
      max: 0,
      r: rand(0.8, 2.2) * dpr,
    });
  }
}

function draw(){
  ctx.clearRect(0,0,w,h);

  // stars
  for(const s of stars){
    s.a += s.tw * (Math.random() > 0.5 ? 1 : -1);
    s.a = Math.max(0.08, Math.min(0.95, s.a));
    s.y += s.sp;
    if(s.y > h + 10) s.y = -10;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${s.a})`;
    ctx.fill();
  }

  // sparkles
  for(let i=sparkles.length-1;i>=0;i--){
    const p = sparkles[i];
    p.life -= 1;
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04 * dpr;

    const alpha = Math.max(0, Math.min(1, p.life / 40));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255, 213, 138, ${alpha})`;
    ctx.fill();

    if(p.life <= 0) sparkles.splice(i,1);
  }

  requestAnimationFrame(draw);
}
draw();

// interaction
document.addEventListener("pointerdown", (e)=>{
  addSparkle(e.clientX * dpr, e.clientY * dpr, false);
});

// buttons
document.getElementById("sparkleBtn").addEventListener("click", ()=>{
  addSparkle(w/2, h/2, true);
});

const wishes = [
  "May your birthday be soft, beautiful, and full of little moments that make you smile.",
  "May this year bring you the kind of happiness that feels calm and real — not temporary.",
  "May you always be surrounded by people who choose you, support you, and celebrate you.",
  "May you get everything you’ve been silently praying for — and more.",
  "May your heart stay light, your dreams stay big, and your life stay lovely.",
  "May your confidence grow, your worries shrink, and your peace become permanent.",
  "May love find you in the simplest things — music, sunsets, and the right people.",
  "May every chapter ahead be kinder than the last one."
];

function pickWish(){
  return wishes[Math.floor(Math.random() * wishes.length)];
}

const modal = document.getElementById("modal");
const wishText = document.getElementById("wishText");

function openModal(){
  wishText.textContent = pickWish();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

document.getElementById("wishBtn").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("nextWish").addEventListener("click", ()=>{
  wishText.textContent = pickWish();
});

modal.addEventListener("click", (e)=>{
  if(e.target === modal) closeModal();
});
document.addEventListener("keydown", (e)=>{
  if(e.key === "Escape") closeModal();
});

