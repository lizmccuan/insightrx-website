/* ── InsightRx — script.js ── */

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

// ── TAB NAVIGATION ──────────────────────────────────────────────────────────
(function(){
  var tabs   = document.querySelectorAll('.tab-btn');
  var panels = document.querySelectorAll('.tab-panel');

  function showTab(id) {
    tabs.forEach(function(t){ t.classList.toggle('active', t.dataset.tab === id); });
    panels.forEach(function(p){ p.classList.toggle('active', p.id === 'tab-' + id); });
    history.replaceState(null, '', '#tab-' + id);
    // scroll to top of content (below fixed nav + tab bar)
    var tabNav = document.getElementById('tab-nav');
    var navH   = (document.getElementById('navbar')  || {offsetHeight:62}).offsetHeight;
    var tabH   = (tabNav || {offsetHeight:0}).offsetHeight;
    window.scrollTo({ top: navH + tabH - 2, behavior: 'instant' });
    // trigger fade-ups for newly visible content
    setTimeout(function(){
      document.querySelectorAll('.tab-panel.active .fade-up:not(.visible)').forEach(function(el){
        obs.observe(el);
      });
    }, 50);
  }

  tabs.forEach(function(t){
    t.addEventListener('click', function(){ showTab(t.dataset.tab); });
  });

  // honour hash on page load
  var hash  = location.hash.replace('#tab-', '');
  var valid = Array.from(tabs).map(function(t){ return t.dataset.tab; });
  showTab(valid.indexOf(hash) >= 0 ? hash : 'overview');

  // expose for onclick= nav links
  window.showTab = showTab;
})();

// ── ACCORDION ───────────────────────────────────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(function(hdr){
  hdr.addEventListener('click', function(){
    hdr.closest('.accordion').classList.toggle('open');
  });
});

// ── DESKTOP / MOBILE VIEW TOGGLE ────────────────────────────────────────────
function setView(v) {
  document.getElementById('viewDesktop').classList.toggle('active', v === 'desktop');
  document.getElementById('viewMobile').classList.toggle('active', v === 'mobile');
  document.getElementById('vtDesktop').classList.toggle('active', v === 'desktop');
  document.getElementById('vtMobile').classList.toggle('active', v === 'mobile');
}
// On narrow screens, start in mobile view and keep in sync on resize
(function initViewToggle(){
  function syncView(){
    if(window.innerWidth <= 640){
      // CSS forces phone view; keep JS state aligned so vtMobile stays .active
      document.getElementById('vtMobile').classList.add('active');
      document.getElementById('vtDesktop').classList.remove('active');
    }
  }
  syncView();
  window.addEventListener('resize', syncView);
})();

// ── DESKTOP APP INNER TABS ──────────────────────────────────────────────────
document.querySelectorAll('.app-tab').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var panel = btn.dataset.panel;
    btn.closest('.app-inner-tabs').querySelectorAll('.app-tab').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    btn.closest('.app-main').querySelectorAll('.app-panel').forEach(function(p){ p.classList.remove('active'); });
    document.getElementById(panel).classList.add('active');
  });
});

// ── PHONE TABS ───────────────────────────────────────────────────────────────
document.querySelectorAll('.ph-tab').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var panel = btn.dataset.phanel;
    btn.closest('.phone-tabs').querySelectorAll('.ph-tab').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    btn.closest('.phone-screen').querySelectorAll('.phone-panel').forEach(function(p){ p.classList.remove('active'); });
    document.getElementById(panel).classList.add('active');
  });
});
