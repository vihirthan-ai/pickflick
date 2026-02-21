// Phase 2: Buff mode integration (autonomous)
let state = {
  mood: null,
  subs: [],
  time: null,
  who: null,
  buffMode: false,
  buffList: [],
  buffPage: 0,
  loaded: false
};

async function loadData(){
  try{ state.movies = await fetch('/movies.json').then(r=>r.json()); }catch(e){ state.movies = [] }
  try{ state.platforms = await fetch('/platforms.json').then(r=>r.json()); }catch(e){ state.platforms = [] }
  state.loaded = true;
}

function initBuffs(seedList){
  // For now, pick first 9 entries deterministically; will be replaced by smarter selection
  const list = (seedList && seedList.length>=9) ? seedList.slice(0,9) : (state.movies||[]).slice(0,9);
  state.buffList = list;
  state.buffPage = 0;
}

function computeWhyPick(movie){
  // Simple heuristic to illustrate: mood match + platform overlap + duration fit
  const moodHit = (state.mood && movie.mood && movie.mood.some(m => state.mood.includes(m))) ? 1:0;
  const platformOverlap = movie.platforms && (movie.platforms.some(p=> state.subs.includes(p))?1:0);
  const timeFit = true; // placeholder; implement bucket check if time known
  const parts = [];
  if(moodHit) parts.push('aligned with your mood');
  if(platformOverlap) parts.push('available on your selected platforms');
  if(timeFit) parts.push('fits your time window');
  return 'Why this pick: ' + parts.join('; ') + '.';
}

function renderBuffPage(){
  const perPage = 3;
  const start = state.buffPage * perPage;
  const end = start + perPage;
  const slice = state.buffList.slice(start, end);
  const cards = slice.map((m,i)=>{
    const why = computeWhyPick(m);
    return `<div class="buff-card" style="flex:1 1 calc(33% - 8px);min-width:240px;border:1px solid #333;border-radius:12px;padding:12px;margin:6px;background:#1a1a2e">
      <h3>${m.title} (${m.year})</h3>
      <div class="genre">${m.genre}</div>
      <div class="desc">${m.description||m.desc}</div>
      <div class="meta"><span class="badge">⭐ ${m.rating}</span><span class="badge">📺 ${m.platforms?.join(', ')||''}</span></div>
      <p class="why" style="font-size:.85rem;color:#ddd">${why}</p>
    </div>`;
  }).join('');
  document.getElementById('buff-area').innerHTML = `<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">${cards}</div>`;
}

function nextBuffPage(){
  if(!state.buffList || state.buffList.length===0) {
    // fallback to 3 sample items
    state.buffList = (state.movies||[]).slice(0,3);
  }
  state.buffPage = (state.buffPage + 1) % Math.ceil(state.buffList.length/3);
  renderBuffPage();
}

function startBuffMode(){
  state.buffMode = true;
  // generate buffList from first 9 items of movies.json for now
  const pool = (state.movies||[]);
  const candidates = pool.length>=9 ? pool : pool;
  state.buffList = candidates.slice(0,9);
  state.buffPage = 0;
  renderBuffPage();
}

async function bootstrap(){
  await loadData();
  // ensure root entry exists and go buff mode if asked
  if(window.location.search.includes('buff=true')){
    startBuffMode();
  }
}
bootstrap();
