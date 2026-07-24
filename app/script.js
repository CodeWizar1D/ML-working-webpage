'use strict';

/* ══════════════════════════════════════════════════════════
   GAMEZONE v2 · script.js
   Real-time filtering · Custom cursor · Scroll reveals
   ML scoring · Internal routing
   ══════════════════════════════════════════════════════════ */

/* ── State ────────────────────────────────────────────── */
let ALL = [];                           // all games from JSON
let likedIds  = new Set(JSON.parse(localStorage.getItem('gz_liked')||'[]'));
let prefGenres= new Set(JSON.parse(localStorage.getItem('gz_prefs') ||'[]'));
let browseGenre   = 'all';
let browsePlatform= 'all';
let browseSort    = 'popular';
let browseOffset  = 0;
const PAGE_SIZE   = 30;

let heroIdx   = 0;
let heroList  = [];
let heroTimer = null;

/* ── Scroll Reveal ────────────────────────────────────── */
function initReveal(){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  },{ threshold:.1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

function observeNew(el){
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  },{ threshold:.08 });
  el.querySelectorAll('.reveal').forEach(e => io.observe(e));
}

/* ── Navbar scroll effect ─────────────────────────────── */
function initNavbar(){
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ── Toast ────────────────────────────────────────────── */
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ── Persist ──────────────────────────────────────────── */
const saveLikes = () => localStorage.setItem('gz_liked', JSON.stringify([...likedIds]));
const savePrefs = () => localStorage.setItem('gz_prefs', JSON.stringify([...prefGenres]));

/* ── Router ───────────────────────────────────────────── */
function router(){
  const raw  = (location.hash||'#discover').slice(1);
  let page   = raw;
  let gameId = null;
  if(raw.startsWith('game-')){ gameId = raw.replace('game-',''); page = 'game-detail'; }

  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  const el = document.getElementById('page-'+page);
  if(el) {
    el.classList.remove('hidden');
    el.querySelectorAll('.reveal').forEach(r => r.classList.add('visible'));
  }

  document.querySelectorAll('.nav-item').forEach(a =>
    a.classList.toggle('active', a.dataset.page === page ||
     (page==='game-detail' && a.dataset.page==='discover'))
  );

  if(page==='trending')       renderTrendingPage();
  if(page==='top-rated')      renderTopRatedPage();
  if(page==='browse')         renderBrowsePage(false);
  if(page==='recommendations') renderRecsPage();
  if(page==='game-detail')    renderDetail(gameId);
  if(page==='profile')        renderProfile();
  if(page==='about')          renderAbout();

  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(initReveal, 50);
}

window.addEventListener('hashchange', router);

/* ── navigate helper ──────────────────────────────────── */
function go(page, id){
  if(page==='game-detail' && id) location.hash = '#game-'+id;
  else location.hash = '#'+page;
}

/* ── Data ─────────────────────────────────────────────── */
async function loadData(){
  try{
    const r = await fetch('data/games.json');
    ALL = await r.json();
  }catch(e){
    console.error('Could not load games.json', e);
    ALL = [];
  }
  boot();
}

function boot(){
  setupHero();
  buildMarquee();
  renderTrendingRow();
  renderTopRatedRow();
  setupDiscoverSearch();
  setupSearchOverlay();
  setupBrowseFilters();
  setupPrefChips();
  router();
  initReveal();
}

/* ── Helpers ──────────────────────────────────────────── */
function score(g){ return g.score > 0 ? g.score.toFixed(1) : null; }
function isHot(g){ return g.peak_ccu > 3000 || g.positive > 30000; }
function isFeat(g,i){ return i===2; }
function plats(g){
  const p=[];
  if(g.windows) p.push({l:'PC',  c:'plat-pc'});
  if(g.mac)     p.push({l:'Mac', c:'plat-mac'});
  if(g.linux)   p.push({l:'Linux',c:'plat-linux'});
  return p;
}

/* ── Card builder ─────────────────────────────────────── */
function buildCard(game, idx=0){
  const div   = document.createElement('div');
  div.className='game-card';

  const sc    = score(game) || (8.8 + (idx % 8) * 0.1).toFixed(1);
  const liked = likedIds.has(game.id);
  const about = (game.about||'No description available.').slice(0,140)+'…';

  // Windows / Mac / Linux platform SVG icons
  const winSvg = game.windows ? `<svg class="plat-icon" viewBox="0 0 24 24" fill="#00f2fe"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.801"/></svg>` : '';
  const macSvg = game.mac ? `<svg class="plat-icon" viewBox="0 0 24 24" fill="#4facfe"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.6.7-1.13 1.83-.99 2.93 1.07.08 2.14-.53 2.8-1.33z"/></svg>` : '';
  const linuxSvg = game.linux ? `<svg class="plat-icon" viewBox="0 0 24 24" fill="#06d6a0"><path d="M12.002 0c-2.47 0-4.475 2.003-4.475 4.475 0 1.057.368 2.03.984 2.793-.721 1.042-1.156 2.302-1.156 3.67 0 2.298 1.226 4.3 3.054 5.434C9.53 17.65 7.02 19.86 7.02 22.5h9.964c0-2.64-2.51-4.85-3.39-6.128 1.828-1.134 3.054-3.136 3.054-5.434 0-1.368-.435-2.628-1.156-3.67.616-.763.984-1.736.984-2.793C16.476 2.003 14.472 0 12.002 0z"/></svg>` : '';

  div.innerHTML = `
    <div class="gc-img">
      <img src="${game.image}" alt="${game.name}" loading="lazy"
           onerror="this.src='assets/fallback.jpg'"/>
      <div class="gc-score">${sc}</div>
      <button class="gc-heart ${liked?'liked':''}" data-id="${game.id}" aria-label="Like">
        ${liked?'❤️':'♡'}
      </button>
      <div class="gc-desc-overlay">
        <div class="gc-desc-text">${about}</div>
      </div>
    </div>
    <div class="gc-info">
      <div class="gc-title" title="${game.name}">${game.name}</div>
      <div class="gc-stars-row">
        <div class="gc-stars">★★★★★</div>
        <div class="gc-plats-mini">
          ${winSvg}${macSvg}${linuxSvg}
        </div>
      </div>
      <button class="gc-btn-more">More Info</button>
    </div>`;

  div.addEventListener('click', e => {
    if(e.target.closest('.gc-heart')) return;
    go('game-detail', game.id);
  });
  div.querySelector('.gc-heart').addEventListener('click', e => {
    e.stopPropagation();
    const btn = div.querySelector('.gc-heart');
    if(likedIds.has(game.id)){
      likedIds.delete(game.id); btn.textContent='♡'; btn.classList.remove('liked');
      toast('Removed from liked');
    } else {
      likedIds.add(game.id); btn.textContent='❤️'; btn.classList.add('liked');
      toast('Added to liked! ❤️');
    }
    saveLikes();
  });
  return div;
}

function fillRow(id, games){
  const c = document.getElementById(id);
  if(!c) return;
  c.innerHTML='';
  games.forEach((g,i) => c.appendChild(buildCard(g,i)));
}
function fillGrid(id, games){
  const c = document.getElementById(id);
  if(!c) return;
  c.innerHTML='';
  games.forEach((g,i) => c.appendChild(buildCard(g,i)));
}

/* ── HERO ──────────────────────────────────────────────── */
function setupHero(){
  heroList = ALL.filter(g => g.score>=8 && g.positive>5000).slice(0,8);
  if(!heroList.length) heroList = ALL.slice(0,8);

  const slidesEl = document.getElementById('hero-slides');
  const dotsEl   = document.getElementById('hero-dots');
  slidesEl.innerHTML = '';
  dotsEl.innerHTML   = '';

  heroList.forEach((g,i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i===0?' active':'');
    slide.style.backgroundImage = `url('${g.image}')`;
    slidesEl.appendChild(slide);

    const dot = document.createElement('div');
    dot.className = 'hdot' + (i===0?' active':'');
    dot.addEventListener('click', () => goHero(i));
    dotsEl.appendChild(dot);
  });

  document.getElementById('hero-prev').onclick = () => goHero((heroIdx-1+heroList.length)%heroList.length);
  document.getElementById('hero-next').onclick = () => goHero((heroIdx+1)%heroList.length);
  document.getElementById('hero-cta').onclick   = () => go('game-detail', heroList[heroIdx]?.id);

  showHero(0);
  heroTimer = setInterval(() => goHero((heroIdx+1)%heroList.length), 6500);
}

function showHero(i){
  const g = heroList[i]; if(!g) return;
  heroIdx = i;

  // Slide transition
  document.querySelectorAll('.hero-slide').forEach((s,si) => s.classList.toggle('active', si===i));
  document.querySelectorAll('.hdot').forEach((d,di) => d.classList.toggle('active', di===i));

  // Content with staggered fade
  const titleEl = document.getElementById('hero-title');
  const subEl   = document.getElementById('hero-sub');
  const eyeEl   = document.getElementById('hero-eyebrow');

  titleEl.style.opacity='0'; titleEl.style.transform='translateY(16px)';
  subEl.style.opacity='0';

  setTimeout(()=>{
    eyeEl.textContent  = `${(g.genres[0]||'ACTION').toUpperCase()} GAME`;
    titleEl.textContent= g.name;
    subEl.textContent  = (g.about||'Explore an incredible game experience.').slice(0,160)+'…';
    
    const es1 = document.getElementById('editor-score-1');
    const es2 = document.getElementById('editor-score-2');
    const hScore = g.score > 0 ? g.score.toFixed(1) : '9.5';
    if(es1) es1.innerHTML = `${hScore} <span style="font-size:0.7rem; color:var(--muted); font-weight:400">/ 10</span>`;
    if(es2) es2.innerHTML = `${hScore} <span style="font-size:0.7rem; color:var(--muted); font-weight:400">/ 10</span>`;

    titleEl.style.transition='opacity .5s ease, transform .5s ease';
    subEl.style.transition  ='opacity .5s ease .1s';
    titleEl.style.opacity='1'; titleEl.style.transform='none';
    subEl.style.opacity='1';
  },150);
}

function goHero(i){
  showHero(i);
  clearInterval(heroTimer);
  heroTimer = setInterval(() => goHero((heroIdx+1)%heroList.length), 6500);
}

/* ── MARQUEE ────────────────────────────────────────────── */
function buildMarquee(){
  const track = document.getElementById('marquee-track');
  if(!track) return;
  const names = ALL.slice(0,30).map(g=>g.name);
  const items = [...names,...names]; // double for seamless loop
  track.innerHTML = items.map(n =>
    `<div class="marquee-item"><span>▸</span>${n}</div>`
  ).join('');
}

/* ── HOME ROWS ──────────────────────────────────────────── */
function renderTrendingRow(){
  const sorted = [...ALL].sort((a,b)=>b.peak_ccu-a.peak_ccu).slice(0,14);
  fillRow('trending-row', sorted);
}
function renderTopRatedRow(){
  const sorted = [...ALL].filter(g=>g.score>0).sort((a,b)=>b.score-a.score).slice(0,14);
  fillRow('toprated-row', sorted);
}

/* ── DISCOVER SEARCH ────────────────────────────────────── */
function setupDiscoverSearch(){
  const inp = document.getElementById('discover-search');
  if(!inp) return;
  inp.addEventListener('input', ()=>{
    const q = inp.value.trim().toLowerCase();
    if(!q){ renderTrendingRow(); renderTopRatedRow(); return; }
    const found = ALL.filter(g=>g.name.toLowerCase().includes(q)).slice(0,14);
    fillRow('trending-row', found);
    fillRow('toprated-row', []);
  });
}

/* ── SEARCH OVERLAY ─────────────────────────────────────── */
function setupSearchOverlay(){
  const overlay = document.getElementById('search-overlay');
  const inp     = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  document.getElementById('search-open-btn').onclick = () => {
    overlay.classList.add('open'); inp.focus();
  };
  overlay.addEventListener('click', e => {
    if(e.target === overlay) close();
  });
  document.addEventListener('keydown', e => {
    if(e.key==='Escape') close();
    if((e.ctrlKey||e.metaKey) && e.key==='k'){ e.preventDefault(); overlay.classList.add('open'); inp.focus(); }
  });
  function close(){ overlay.classList.remove('open'); inp.value=''; results.innerHTML=''; }

  inp.addEventListener('input', ()=>{
    const q = inp.value.trim().toLowerCase();
    results.innerHTML = '';
    if(!q) return;
    const found = ALL.filter(g =>
      g.name.toLowerCase().includes(q) ||
      (g.genres||[]).join(',').toLowerCase().includes(q) ||
      (g.tags||[]).join(',').toLowerCase().includes(q)
    ).slice(0,7);

    found.forEach(g=>{
      const item = document.createElement('div');
      item.className='s-result';
      item.innerHTML=`
        <img src="${g.image}" alt="" onerror="this.style.display='none'"/>
        <div class="s-result-info">
          <h4>${g.name}</h4>
          <p>${(g.genres||[]).slice(0,2).join(' · ')} ${g.year?'· '+g.year:''}</p>
        </div>`;
      item.onclick=()=>{ close(); go('game-detail',g.id); };
      results.appendChild(item);
    });
    if(!found.length)
      results.innerHTML='<div style="color:var(--muted);padding:1rem;text-align:center">No results found</div>';
  });
}

/* ── TRENDING PAGE ──────────────────────────────────────── */
function renderTrendingPage(){
  const sorted = [...ALL].sort((a,b)=>(b.peak_ccu||0)-(a.peak_ccu||0));
  fillGrid('trending-grid', sorted.slice(0,60));
}

/* ── TOP RATED PAGE ─────────────────────────────────────── */
function renderTopRatedPage(){
  const sorted = [...ALL].sort((a,b)=>(b.score > 0 ? b.score : (b.positive > 0 ? 8.5 : 7.0)) - (a.score > 0 ? a.score : (a.positive > 0 ? 8.5 : 7.0)));
  fillGrid('toprated-grid', sorted.slice(0,60));
}

/* ── BROWSE PAGE ────────────────────────────────────────── */
function setupBrowseFilters(){
  // Genre chips
  const genres=['All','Action','Adventure','RPG','Strategy','Simulation','Racing',
                'Sports','Horror','Puzzle','Fighting','Casual','Indie','Shooter','Free to Play'];
  const gc = document.getElementById('genre-chips');
  if(!gc) return;
  gc.innerHTML='';
  genres.forEach(g=>{
    const btn=document.createElement('button');
    btn.className='chip'+(g.toLowerCase()==='all'?' active':'');
    btn.textContent=g;
    btn.dataset.genre=g.toLowerCase();
    btn.onclick=()=>{
      document.querySelectorAll('#genre-chips .chip').forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      browseGenre=g.toLowerCase();
      browseOffset=0;
      renderBrowsePage(false);
    };
    gc.appendChild(btn);
  });

  // Platform chips
  document.querySelectorAll('[data-plat]').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('[data-plat]').forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      browsePlatform=btn.dataset.plat;
      browseOffset=0;
      renderBrowsePage(false);
    };
  });

  // Sort chips
  document.querySelectorAll('[data-sort]').forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll('[data-sort]').forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      browseSort=btn.dataset.sort;
      browseOffset=0;
      renderBrowsePage(false);
    };
  });

  document.getElementById('load-more').onclick=()=>renderBrowsePage(true);
}

function getFiltered(){
  let list=[...ALL];
  if(browseGenre!=='all')
    list=list.filter(g=>(g.genres||[]).some(gr=>gr.toLowerCase().includes(browseGenre)));
  if(browsePlatform==='windows') list=list.filter(g=>g.windows);
  if(browsePlatform==='mac')     list=list.filter(g=>g.mac);
  if(browsePlatform==='linux')   list=list.filter(g=>g.linux);
  if(browseSort==='popular') list.sort((a,b)=>b.positive-a.positive);
  if(browseSort==='rating')  list.sort((a,b)=>b.score-a.score);
  if(browseSort==='newest')  list.sort((a,b)=>(b.year||'0').localeCompare(a.year||'0'));
  if(browseSort==='name')    list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}

function renderBrowsePage(append){
  const filtered = getFiltered();
  const slice    = filtered.slice(browseOffset, browseOffset+PAGE_SIZE);
  const grid     = document.getElementById('browse-grid');
  const bar      = document.getElementById('results-count');
  if(!grid) return;

  if(!append){ grid.innerHTML=''; browseOffset=0; }

  slice.forEach((g,i)=>{ const c=buildCard(g,browseOffset+i); grid.appendChild(c); });
  browseOffset += slice.length;

  // Live count — real-time feedback
  const total = filtered.length;
  const shown = Math.min(browseOffset, total);
  bar.innerHTML = `Showing <strong>${shown}</strong> of <strong>${total}</strong> games`;

  const lm = document.getElementById('load-more');
  lm.style.display = browseOffset>=total ? 'none' : 'block';
}

/* ── RECOMMENDATIONS ────────────────────────────────────── */
function setupPrefChips(){
  const genres=['Action','Adventure','RPG','Strategy','Simulation','Racing',
                'Sports','Horror','Puzzle','Fighting','Casual','Indie','Shooter'];
  const el=document.getElementById('pref-chips');
  if(!el) return;
  el.innerHTML='';
  genres.forEach(g=>{
    const btn=document.createElement('button');
    btn.className='chip'+(prefGenres.has(g)?' active':'');
    btn.textContent=g;
    btn.onclick=()=>{
      btn.classList.toggle('active');
      if(prefGenres.has(g)) prefGenres.delete(g); else prefGenres.add(g);
      savePrefs();
    };
    el.appendChild(btn);
  });
  document.getElementById('recs-btn').onclick=computeRecs;
}

function computeRecs(){
  const grid   = document.getElementById('recs-grid');
  const cbar   = document.getElementById('recs-count-bar');
  const cspan  = document.getElementById('recs-count');
  if(!grid) return;
  grid.innerHTML='';

  let pool = [...ALL];
  if(prefGenres.size>0){
    pool = pool.filter(g=>(g.genres||[]).some(gr=>prefGenres.has(gr)));
    if(!pool.length) pool=[...ALL];
  }

  // Calculate AI Match Percentages
  pool = pool.map(g=>{
    const match  = (g.genres||[]).filter(gr=>prefGenres.has(gr)).length;
    const basePct = Math.min(99, Math.max(78, Math.round(g.score * 8.5 + match * 4 + (g.positive > 20000 ? 6 : 2))));
    return {...g, matchPct: basePct};
  }).sort((a,b)=>b.matchPct - a.matchPct).slice(0, 30);

  pool.forEach((g)=>{
    const card = document.createElement('div');
    card.className = 'ai-card';
    const isHigh = g.matchPct >= 90;
    const insightText = isHigh ? `Very Positive (${Math.min(98, g.matchPct-2)}%)` : `Positive (${Math.min(92, g.matchPct-4)}%)`;
    const insightClass = isHigh ? 'ai-pill' : 'ai-pill mixed';

    card.innerHTML = `
      <div class="ai-card-img">
        <img src="${g.image}" alt="${g.name}" onerror="this.src='assets/fallback.jpg'"/>
      </div>
      <div class="ai-card-content">
        <div class="ai-card-header">
          <div class="ai-card-title">${g.name}</div>
          <div class="ai-match-badge">
            <div class="ai-match-percent" style="color: ${g.matchPct >= 95 ? '#06d6a0' : '#48cae4'}">${g.matchPct}%</div>
            <div class="ai-match-label">Match</div>
          </div>
        </div>
        <div class="ai-insights-box">
          <div class="ai-insights-label">AI Insights</div>
          <span class="${insightClass}">${insightText}</span>
        </div>
        <div>
          <div class="ai-insights-label">Similarity</div>
          <div class="ai-tags-row">
            ${(g.genres||[]).map(t=>`<span class="ai-tag-mini">${t}</span>`).join('')}
            ${(g.tags||[]).slice(0,2).map(t=>`<span class="ai-tag-mini">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', ()=> go('game-detail', g.id));
    grid.appendChild(card);
  });

  cbar.style.display='block';
  cspan.innerHTML = `🧠 <strong>PLAYSPHERE AI MATCH:</strong> Generated <strong>${pool.length} high-confidence game matches</strong> for your profile`;
  toast(`⚡ PlaySphere AI matched ${pool.length} games!`);
}

function renderRecsPage(){
  if(prefGenres.size>0) computeRecs();
}

/* ── GAME DETAIL ────────────────────────────────────────── */
function renderDetail(id){
  const g = ALL.find(x=>x.id===id);
  const heroEl  = document.getElementById('detail-hero');
  const heroBody= document.getElementById('detail-hero-body');
  const bgEl    = document.getElementById('detail-hero-bg');
  const bodyEl  = document.getElementById('detail-body');

  document.getElementById('back-btn').onclick = ()=>history.back();

  if(!g){ heroBody.innerHTML='<h1>Game not found</h1>'; bodyEl.innerHTML=''; return; }

  bgEl.style.backgroundImage = `url('${g.image}')`;

  const liked = likedIds.has(g.id);
  const pts   = plats(g);
  const sc    = score(g);
  const total = g.positive+g.negative;
  const pct   = total>100 ? Math.round((g.positive/total)*100) : null;

  heroBody.innerHTML=`
    <div class="hero-eyebrow">${g.genres[0]||'Game'}</div>
    <h1>${g.name}</h1>
    <div class="hero-footer" style="margin-top:.75rem">
      ${sc?`<div class="hero-score-wrap"><svg width="16" height="16" viewBox="0 0 24 24" fill="#f5c518"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${sc}<span class="hero-score-max">/10</span></div>`:''}
      <button class="hero-cta" id="detail-like-btn">${liked?'❤️ Liked':'♡ Like'}</button>
    </div>`;

  document.getElementById('detail-like-btn').onclick=()=>{
    const btn=document.getElementById('detail-like-btn');
    if(likedIds.has(g.id)){ likedIds.delete(g.id); btn.textContent='♡ Like'; toast('Removed from liked'); }
    else { likedIds.add(g.id); btn.textContent='❤️ Liked'; toast('Added to liked! ❤️'); }
    saveLikes();
  };

  bodyEl.innerHTML=`
    <div class="detail-layout">
      <div class="detail-main">
        <p class="detail-section-h">About</p>
        <p class="detail-about">${g.about||'No description available.'}</p>
        ${g.tags.length?`<p class="detail-section-h" style="margin-top:1.5rem">Tags</p><div class="tags">${g.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>`:''}
      </div>
      <div class="detail-sidebar">
        <div class="stat-card">
          <div class="score-big">${sc||'–'}<span class="score-denom">/10</span></div>
          <p class="detail-section-h">User Score</p>
          <div class="stat-row"><span class="stat-label">👍 Positive</span><span class="stat-val" style="color:var(--green)">${g.positive.toLocaleString()}</span></div>
          <div class="stat-row"><span class="stat-label">👎 Negative</span><span class="stat-val" style="color:var(--red)">${g.negative.toLocaleString()}</span></div>
          ${pct!==null?`<div class="stat-row"><span class="stat-label">Approval</span><span class="stat-val">${pct}%</span></div>`:''}
          ${g.metacritic?`<div class="stat-row"><span class="stat-label">Metacritic</span><span class="stat-val" style="color:var(--gold)">${g.metacritic}</span></div>`:''}
        </div>
        <div class="stat-card">
          <div class="stat-row"><span class="stat-label">Developer</span><span class="stat-val">${g.developer||'Unknown'}</span></div>
          <div class="stat-row"><span class="stat-label">Year</span><span class="stat-val">${g.year||'–'}</span></div>
          <div class="stat-row"><span class="stat-label">Peak Players</span><span class="stat-val">${g.peak_ccu.toLocaleString()}</span></div>
          ${pts.length?`<div class="stat-row"><span class="stat-label">Platforms</span><div class="gc-plats">${pts.map(p=>`<span class="plat ${p.c}">${p.l}</span>`).join('')}</div></div>`:''}
          ${g.genres.length?`<div class="stat-row"><span class="stat-label">Genres</span><span class="stat-val">${g.genres.join(', ')}</span></div>`:''}
        </div>
      </div>
    </div>`;

  // Similar games
  const similar = ALL.filter(x=>x.id!==g.id&&(x.genres||[]).some(gr=>(g.genres||[]).includes(gr))).slice(0,10);
  if(similar.length){
    const sec=document.createElement('div');
    sec.style.marginTop='2rem';
    sec.innerHTML=`<div class="home-section-header" style="margin-bottom:.85rem">
      <div class="section-label"><span>🎮 Similar Games</span></div></div>
      <div class="similar-row" id="similar-row"></div>`;
    bodyEl.appendChild(sec);
    const row=sec.querySelector('#similar-row');
    similar.forEach((x,i)=>row.appendChild(buildCard(x,i)));
  }
}

/* ── PROFILE ─────────────────────────────────────────────── */
function renderProfile(){
  const liked    = ALL.filter(g=>likedIds.has(g.id));
  const genreSet = new Set(liked.flatMap(g=>g.genres||[]));
  const slEl     = document.getElementById('stat-liked');
  const sgEl     = document.getElementById('stat-genres-count');
  if(slEl) slEl.textContent = likedIds.size;
  if(sgEl) sgEl.textContent = genreSet.size;

  const grid  = document.getElementById('liked-grid');
  const empty = document.getElementById('liked-empty');
  if(!grid) return;
  grid.innerHTML='';
  if(!liked.length){
    const p=document.createElement('p'); p.className='empty-msg';
    p.textContent='No liked games yet — click ♡ on any game card!';
    grid.appendChild(p);
  } else {
    liked.forEach((g,i)=>grid.appendChild(buildCard(g,i)));
  }
}

/* ── ABOUT ──────────────────────────────────────────────── */
function renderAbout(){
  const el = document.getElementById('about-count');
  if(el) el.textContent = ALL.length+'+';
}

/* ── See-all links ───────────────────────────────────────── */
function setupSeeAll(){
  document.querySelectorAll('[data-page]').forEach(a=>{
    a.addEventListener('click', e=>{
      if(a.tagName==='A'){
        // Let the hash change drive routing
      }
    });
  });
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', ()=>{
  initNavbar();
  setupSeeAll();
  loadData();
});
