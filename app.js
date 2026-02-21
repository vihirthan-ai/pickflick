import movies from './data/movies.js';
import platforms from './data/platforms.js';

// Fallbacks if ES module imports fail in older environments
console.log('App started');

// Data fetchers (local static for now)
let data = {movies: [], platforms: []};
async function loadData(){
  try {
    data.movies = await fetch('/movies.json').then(r=>r.json());
  } catch(e){ data.movies = movies || []; }
  try {
    data.platforms = await fetch('/platforms.json').then(r=>r.json());
  } catch(e){ data.platforms = platforms || []; }
}
loadData();

// Minimal rendering logic (placeholder for now)
const root=document.getElementById('root');
root.innerHTML = '<h1>PickFlick MVP</h1>';
