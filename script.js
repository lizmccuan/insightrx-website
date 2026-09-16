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
  var navLinks = document.querySelectorAll('.nav-link[data-tab]');
  var panels   = document.querySelectorAll('.tab-panel');

  function showTab(id) {
    navLinks.forEach(function(t){ t.classList.toggle('active', t.dataset.tab === id); });
    panels.forEach(function(p){ p.classList.toggle('active', p.id === 'tab-' + id); });
    history.replaceState(null, '', '#tab-' + id);
    // scroll to top of content (below fixed nav)
    var navH = (document.getElementById('navbar') || {offsetHeight:62}).offsetHeight;
    window.scrollTo({ top: navH - 2, behavior: 'instant' });
    // trigger fade-ups for newly visible content
    setTimeout(function(){
      document.querySelectorAll('.tab-panel.active .fade-up:not(.visible)').forEach(function(el){
        obs.observe(el);
      });
    }, 50);
  }

  navLinks.forEach(function(t){
    t.addEventListener('click', function(){ showTab(t.dataset.tab); });
  });

  // honour hash on page load — includes tabs not in the top nav (e.g. contact)
  var hash  = location.hash.replace('#tab-', '');
  var valid = Array.from(panels).map(function(p){ return p.id.replace('tab-', ''); });
  showTab(valid.indexOf(hash) >= 0 ? hash : 'overview');

  // expose for onclick= nav links (top nav + "Get in Touch" CTA)
  window.showTab = showTab;
})();

// ── ACCORDION ───────────────────────────────────────────────────────────────
document.querySelectorAll('.accordion-header').forEach(function(hdr){
  hdr.addEventListener('click', function(){
    hdr.closest('.accordion').classList.toggle('open');
  });
});

// ── INTERACTIVE PRODUCT DEMO (Demo tab) ─────────────────────────────────────
(function(){
  var sidebarItems = document.querySelectorAll('.pf-sidebar .pf-nav-item[data-page]');
  var mobileItems  = document.querySelectorAll('.pf-mobile-item[data-page]');
  var pages        = document.querySelectorAll('.pf-page');
  if (!pages.length) return;

  function showPage(id) {
    sidebarItems.forEach(function(t){ t.classList.toggle('active', t.dataset.page === id); });
    mobileItems.forEach(function(t){ t.classList.toggle('active', t.dataset.page === id); });
    pages.forEach(function(p){ p.classList.toggle('active', p.dataset.page === id); });
  }

  sidebarItems.forEach(function(t){
    t.addEventListener('click', function(){ showPage(t.dataset.page); });
  });
  mobileItems.forEach(function(t){
    t.addEventListener('click', function(){ showPage(t.dataset.page); });
  });

  // in-page links/buttons that jump to another sidebar page (e.g. dashboard's
  // "View Opportunity" or opportunities' "See Action Plan")
  document.querySelectorAll('.pf-goto[data-goto]').forEach(function(el){
    el.addEventListener('click', function(){ showPage(el.dataset.goto); });
  });

  // Analysis page's internal Traffic/Search/Pages sub-toggle
  var subTabs = document.querySelectorAll('.analysis-subtab');
  var subPanels = document.querySelectorAll('.analysis-subpanel');
  subTabs.forEach(function(t){
    t.addEventListener('click', function(){
      subTabs.forEach(function(b){ b.classList.toggle('active', b === t); });
      subPanels.forEach(function(p){ p.classList.toggle('active', p.dataset.subPanel === t.dataset.sub); });
    });
  });

  // Recommendations page: queue ⇄ detail internal navigation
  var recQueue  = document.querySelector('.pf-rec-queue');
  var recDetail = document.querySelector('.pf-rec-detail');
  if (recQueue && recDetail) {
    document.querySelectorAll('.pf-rec-open').forEach(function(btn){
      btn.addEventListener('click', function(){
        recQueue.classList.remove('active');
        recDetail.classList.add('active');
      });
    });
    document.querySelector('.pf-rec-back').addEventListener('click', function(){
      recDetail.classList.remove('active');
      recQueue.classList.add('active');
    });
  }
})();

// ── HOW THE SYSTEM WORKS TABS (System page) ──────────────────────────────────
(function(){
  var tabs = document.querySelectorAll('.hiw-tab');
  var panels = document.querySelectorAll('.hiw-panel');
  if (!tabs.length) return;

  function showHiwTab(id) {
    tabs.forEach(function(t){
      var isActive = t.dataset.hiw === id;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.tabIndex = isActive ? 0 : -1;
      if (isActive) t.scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
    });
    panels.forEach(function(p){
      var isActive = p.id === 'hiw-panel-' + id;
      p.classList.toggle('active', isActive);
      p.hidden = !isActive;
    });
  }

  tabs.forEach(function(t){
    t.addEventListener('click', function(){ showHiwTab(t.dataset.hiw); });
    t.addEventListener('keydown', function(e){
      var idx = Array.prototype.indexOf.call(tabs, t);
      var target = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = tabs[(idx + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = tabs[(idx - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') target = tabs[0];
      else if (e.key === 'End') target = tabs[tabs.length - 1];
      if (target) {
        e.preventDefault();
        target.focus();
        showHiwTab(target.dataset.hiw);
      }
    });
  });

  // expose for the "See the AI Agents →" in-panel CTA
  window.showHiwTab = showHiwTab;
})();
