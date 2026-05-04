/* ── InsightRx — script.js ── */

/* Carousel */
(function(){
  var slides=[
    {label:'01 / Data Sources',caption:'Upload and compare marketing data runs across time periods'},
    {label:'02 / Dashboard',caption:'View real-time marketing intelligence KPIs at a glance'},
    {label:'03 / Dashboard Detail',caption:'Analyze search, traffic, and user behavior signals in depth'},
    {label:'04 / Analysis',caption:'Break down GA4 and GSC acquisition and performance patterns'},
    {label:'05 / Social Analysis',caption:'Identify Meta content strengths and conversion patterns'},
    {label:'06 / Opportunities',caption:'Surface prioritized SEO and growth opportunities from live data'},
    {label:'07 / Recommendations',caption:'Translate AI insights into prioritized, actionable plans'},
    {label:'08 / Reports',caption:'Generate executive-ready marketing summaries and briefings'},
    {label:'09 / AI Agent',caption:'Ask questions and receive strategic marketing guidance in real time'}
  ];
  var cur=0;
  var track=document.getElementById('carTrack');
  var dotsEl=document.getElementById('carDots');
  var cap=document.getElementById('carCaption');

  // build dots
  slides.forEach(function(_,i){
    var d=document.createElement('div');
    d.className='car-pip'+(i===0?' active':'');
    d.onclick=function(){carGoTo(i)};
    dotsEl.appendChild(d);
  });

  function carGoTo(n){
    cur=Math.max(0,Math.min(n,slides.length-1));
    track.style.transform='translateX(-'+cur*100+'%)';
    document.querySelectorAll('.car-pip').forEach(function(p,i){p.classList.toggle('active',i===cur)});
    cap.innerHTML='<strong>'+slides[cur].label+'</strong> — '+slides[cur].caption;
    document.getElementById('carPrev').disabled=cur===0;
    document.getElementById('carNext').disabled=cur===slides.length-1;
  }

  window.carMove=function(dir){carGoTo(cur+dir)};
  carGoTo(0);

  // keyboard nav
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft')carGoTo(cur-1);
    if(e.key==='ArrowRight')carGoTo(cur+1);
  });
})();

/* Nav + Fade-up observer */
// Nav scroll
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 20));

// Fade-up observer
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 55);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// Active nav highlighting
const secs = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(s => { if (scrollY >= s.offsetTop - 90) cur = s.id; });
  links.forEach(a => {
    const on = a.getAttribute('href') === `#${cur}`;
    a.style.color = on ? '#f1f5f9' : '';
    a.style.fontWeight = on ? '600' : '';
  });
});

// Dashboard nav interactivity
document.querySelectorAll('.df-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.df-nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});
