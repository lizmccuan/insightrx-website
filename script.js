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

// ── APP TAB + SIDEBAR SYNC ───────────────────────────────────────────────────
(function(){
  var tabLabels = {
    'dt-overview':   'Executive Overview',
    'dt-intake':     '① Data Intake Agent',
    'dt-insight':    '② Insight Agent',
    'dt-strategy':   '③ Strategy Agent',
    'dt-execution':  '④ Execution Agent',
    'dt-evaluation': '⑤ Evaluation Agent',
    'dt-reports':    'Executive Reports',
    'dt-chat':       'Talk to AI Agent'
  };
  function switchAppTab(id){
    document.querySelectorAll('.app-tab').forEach(function(b){
      b.classList.toggle('active', b.dataset.panel === id);
    });
    document.querySelectorAll('.app-panel').forEach(function(p){
      p.classList.toggle('active', p.id === id);
    });
    document.querySelectorAll('.sb-item[data-apptab]').forEach(function(s){
      s.classList.toggle('active', s.dataset.apptab === id);
    });
    var lbl = document.getElementById('app-topbar-label');
    if(lbl && tabLabels[id]) lbl.textContent = tabLabels[id];
  }
  document.querySelectorAll('.sb-item[data-apptab]').forEach(function(s){
    s.addEventListener('click', function(){ switchAppTab(s.dataset.apptab); });
  });
  document.querySelectorAll('.app-tab').forEach(function(btn){
    btn.addEventListener('click', function(){ switchAppTab(btn.dataset.panel); });
  });
})();

// ── AI AGENT CHAT ─────────────────────────────────────────────────────────────
var chatResponses = {
  'What are my biggest SEO opportunities?': 'Your biggest SEO opportunities are: (1) CTR recovery on "botox savings near me" — 12,400 impressions, only 1.9% CTR vs 6.2% expected (+520 clicks/month potential); (2) Local search gap — 14 high-intent Chicago queries with zero competition; (3) AI answer visibility — add FAQ schema to appear in Google AI Overviews and Perplexity.',
  'Which pages should I update first?': 'Prioritize in this order: (1) /botox-savings — highest impression volume, worst CTR gap; (2) /dermal-fillers — similar CTR underperformance; (3) /med-spa-services — high traffic but missing local modifiers. All three need title tag rewrites with price signals and local modifiers. Implementation briefs are ready in the Execution tab.',
  'What content topics could drive more traffic?': 'Based on your Search Visibility Data, the highest-opportunity content topics are: (1) Chicago local landing page targeting "med spa chicago" (9,100 impressions/month, uncontested); (2) Before/after patient results — your highest social engagement topic at 7.1% ER; (3) FAQ content targeting "how much does X cost in Chicago" — qualifies for both featured snippets and AI answer citations.',
  'Summarize the top recommendations.': 'Here's your 5-action priority list: (1) Rewrite title tags on /botox-savings, /dermal-fillers, /med-spa-services — est. +520 clicks/month, 1-2 days; (2) Move booking CTA above fold, simplify form to 3 fields — target 1.2% → 3.7% conversion, 1 week; (3) Add FAQ schema to top 3 pages — AI answer eligibility, 2-3 days; (4) Publish /chicago-med-spa local landing page — 14 uncontested queries, 2 weeks; (5) Shift social to 60% IG Reels — 2× reach in 60 days, ongoing.'
};
function irChatSend(btn) {
  var box = document.getElementById('chat-messages-box');
  var inp = document.getElementById('chat-input-field');
  if(!box) return;
  var q = btn ? btn.textContent.trim() : (inp ? inp.value.trim() : '');
  if(!q) return;
  if(inp) inp.value = '';
  var uDiv = document.createElement('div');
  uDiv.className = 'chat-msg chat-user';
  uDiv.innerHTML = '<div class="chat-bubble user">' + q + '</div><div class="chat-ts">Just now</div>';
  box.appendChild(uDiv);
  var r = chatResponses[q] || 'Great question. Based on your pipeline data, I can see clear patterns in your traffic and conversion signals. Check the Analysis and Execution tabs for specific findings and ready-to-execute briefs.';
  setTimeout(function(){
    var aDiv = document.createElement('div');
    aDiv.className = 'chat-msg chat-ai';
    aDiv.innerHTML = '<div class="chat-bubble ai">' + r + '</div><div class="chat-ts">Just now</div>';
    box.appendChild(aDiv);
    box.scrollTop = box.scrollHeight;
  }, 600);
  box.scrollTop = box.scrollHeight;
}
window.irChatSend = irChatSend;
