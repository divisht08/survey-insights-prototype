/* ═══ v22 (3 Nov) — Pradeep's review, the parts we are sure of:
   1. The drill-down opens as a full page in two columns: the story on the left (2/3), Copilot and the
      details on the right (1/3).
   2. Five insights finished end to end: Feed — payment spike (INS-05), cleanliness (INS-04), late
      deliveries (AL-03); Followed — overall satisfaction (INS-01), weekend checkout (FOL-01). Cards keep
      the feed's design with Nadav's asks only: % change up front and key points in bold.
   3. A "This period" summary above the feed.
   4. How long insights stay in the feed.
   Left out on purpose (conflict with earlier decisions or not agreed): ranking, "Recurring" labels,
   duplicates, a separate Copilot app, an action plans list, user feed customisation.
   Figures are sample data, consistent with what each insight already states. ═══ */

/* ── 2. drill-down content for the two Followed insights (the three Feed ones are in v21) ── */
Object.assign(V21_HERO, {
  'INS-01': {card:{},
    kpis:[['Overall satisfaction','▲ 4.3%','9.63 out of 10, against 9.23','good'],
          ['Since you followed (1 Sep)','No change','Still 9.63',''],
          ['Service satisfaction','▲ 4.0%','9.67, against 9.30','good']],
    what:'<b>Overall satisfaction rose from 9.23 to 9.63</b> out of 10. <b>Service satisfaction rose by about the same</b>, from 9.30 to 9.67, and this period’s comments describe staff as <b>welcoming, smooth and respectful</b>. The biggest lift was in <b>weekend visits (▲ 0.58)</b>. The two moved together; the data does not show which caused the other.'},
  'FOL-01': {card:{},
    kpis:[['Weekend checkout score','▲ 8.1%','8.0 out of 10, against 7.4 in early September','good'],
          ['Since you followed (9 Sep)','▲ 0.6','Up in each update since','good'],
          ['Gap to weekdays','0.3','Weekdays are at 8.3','']],
    what:'In early September, <b>weekend shoppers rated checkout 7.4</b> out of 10. It has <b>risen in each update since, to 8.0</b>, and is now <b>within normal variation</b>: weekdays are at 8.3. <b>Saturday is up most (▲ 0.7)</b>. Nothing here needs action now; keep following to see that it holds.'}
});
['INS-01','FOL-01'].forEach(id=>{ if(V10_DRILL[id]) V10_DRILL[id].what = V21_HERO[id].what.replace(/<[^>]+>/g,''); });

/* ── 2. the cards ── */
// Cards keep the feed's own design; only Nadav's asks apply (% change up front, key points in bold).
// The three Feed cards get these in v21; the two Followed cards get them here.
const V22_FOL_SUM = {
  'INS-01':'<b>Overall satisfaction rose to 9.63</b>, up 4.3%. Comments in both periods praise <b>staff warmth and smooth assistance</b>.',
  'FOL-01':'Weekend checkout rose <b>from 7.4 to 8.0</b> since you followed, up 8.1%, and is <b>now within normal variation</b>.'
};
function v22Cards(){
  Object.entries(V22_FOL_SUM).forEach(([id,html])=>{
    document.querySelectorAll(`.fol-card[data-fol-id="${id}"] .ic-sum`).forEach(sum=>{ if(sum.innerHTML!==html){ sum.innerHTML = html; sum.closest('.fol-card').classList.add('v21-hero'); } });
  });
}

/* Followed: the weekend checkout insight is followed too, so Followed has two finished cards */
function v22SeedFollowed(){
  if(typeof followed==='undefined' || followed['FOL-01'] || !followed['INS-01']) return;
  followed['FOL-01'] = {daysAgo:20, on:'Wed 9 Sep', atVal:'7.4', source:'feed', sharedBy:null, history:null, since:{from:'7.4', delta:'+0.6', dir:'up'}};
  if(typeof renderFollowedTab==='function') try{ renderFollowedTab(); }catch(e){}
  if(typeof updateFollowedBadge==='function') try{ updateFollowedBadge(); }catch(e){}
}

/* ── 1. full-page drill-down in two columns ── */
const V22_PANELS = ['investigate-panel','followed-panel','shared-panel'];
// The drill-down opens beside the list, so moving to the next insight is one click.
// "Open full page" shows the same drill-down in two columns: story 2/3, Copilot and details 1/3.
function v22Layout(){
  V22_PANELS.forEach(pid=>{
    const p = document.getElementById(pid); if(!p) return;
    const split = p.parentElement; if(!split) return;
    const open = !p.closest('.hidden') && !p.classList.contains('hidden') && p.getClientRects().length>0 && p.innerHTML.trim() && p.querySelector('.v10-cols');
    if(!open){ split.classList.remove('v3-fullpage'); return; }   // closing the drill-down always brings the list back
    const full = split.classList.contains('v3-fullpage');
    // a followed insight opens on its latest state, so it carries its latest title
    const id = (p.querySelector('[data-v3-id]')||{dataset:{}}).dataset.v3Id, h3 = p.querySelector('[data-v6-head] h3');
    if(id && followed[id] && INSIGHT_META[id] && h3 && h3.textContent.trim()!==INSIGHT_META[id].title) h3.textContent = INSIGHT_META[id].title;
    // Nadav: "~" instead of "about"
    const cols = p.querySelector('.v10-cols');
    if(cols && !cols.dataset.v22Tilde){ cols.dataset.v22Tilde = '1';
      const w = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let n;
      while((n = w.nextNode())){ if(/\b[Aa]bout (?=[~\d])/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\b[Aa]bout (?=[~\d])/g, '~'); }
    }
    // right column (full page only): Copilot, then the details; the facts line stays for the side panel
    if(cols && !cols.querySelector('.v22-side')){
      const main = cols.querySelector('.v10-main'), meta = main && main.querySelector('.v21-meta');
      const side = document.createElement('aside'); side.className = 'v22-side';
      if(meta){
        const rows = [...meta.querySelectorAll('span')].map(s=>{ const k = s.querySelector('i'); const key = k ? k.textContent : ''; const val = s.innerHTML.replace(/<i>[^<]*<\/i>\s*/,''); return `<div><dt>${key}</dt><dd>${val}</dd></div>`; }).join('');
        side.insertAdjacentHTML('beforeend', `<div class="v22-det"><p>Details</p><dl>${rows}</dl></div>`);
      }
      cols.appendChild(side);
    }
    const side = cols && cols.querySelector('.v22-side'), dock = p.querySelector('[data-v3-dock]');
    if(side && dock){
      if(full && dock.parentElement!==side) side.insertBefore(dock, side.firstChild);
      if(!full && dock.parentElement===side) p.appendChild(dock);
    }
    // in full page, a way back to the list with the insight still open
    const head = p.querySelector('[data-v6-head]');
    let back = head && head.querySelector('.v22-back');
    if(head && !back){ head.insertAdjacentHTML('afterbegin', `<button class="v22-back" type="button">← Back to the list</button>`); back = head.querySelector('.v22-back');
      back.onclick = ()=>{ split.classList.remove('v3-fullpage'); const t = p.querySelector('[data-v3-full]'); if(t) t.title = 'Open full page'; }; }
    if(back) back.style.display = full ? '' : 'none';
  });
}
const _v22Place = v9Place;
v9Place = function(){ v22Layout(); v22Cards(); return _v22Place.apply(this, arguments); };

/* ── 3. This period, above the feed ── */
function v22Summary(){
  const col = document.getElementById('feed-col'); if(!col) return;
  let s = document.getElementById('v22-sum');
  const active = typeof feedView==='undefined' || feedView==='active';
  const grid = document.getElementById('card-grid');
  const cards = grid ? [...grid.querySelectorAll('.insight-card')].filter(c=>c.dataset.state==='active' && c.style.display!=='none') : [];
  if(!active || !cards.length){ if(s) s.style.display = 'none'; return; }
  const high = cards.filter(c=>c.dataset.priority==='high').length;
  const html = `<div class="v22-st"><span>Overall satisfaction</span><b>9.63</b><em class="good">▲ 0.40 vs previous period</em></div>
    <div class="v22-st"><span>Responses this period</span><b>261</b><em>Store experience survey</em></div>
    <div class="v22-st"><span>Needs attention</span><b>${high} of ${cards.length}</b><em>insights in your feed</em></div>`;
  if(!s){ col.insertAdjacentHTML('afterbegin', `<div id="v22-sum" class="v22-sum"></div>`); s = document.getElementById('v22-sum'); }
  if(s.innerHTML!==html) s.innerHTML = html;
  s.style.display = '';
  const bar = document.getElementById('edition-bar'); if(bar && s.nextElementSibling!==bar && bar.parentElement===col) col.insertBefore(s, bar.nextSibling);
}

/* ── 4. how long insights stay ── */
function v22Retention(){
  const grid = document.getElementById('card-grid'); if(!grid) return;
  let r = document.getElementById('v22-ret');
  if(!r){ grid.insertAdjacentHTML('afterend', `<p id="v22-ret" class="v22-ret">Insights you don’t follow, share or act on leave your feed after 4 weeks. Anything you archive stays in Archived.</p>`); r = document.getElementById('v22-ret'); }
  r.style.display = (typeof feedView==='undefined' || feedView==='active') ? '' : 'none';
}

const _v22Vis = applyFeedVisibility;
applyFeedVisibility = function(){ const r = _v22Vis.apply(this, arguments); v22Summary(); v22Retention(); v22Cards(); return r; };
const _v22Journey = setJourney;
setJourney = function(){ const r = _v22Journey.apply(this, arguments); v22SeedFollowed(); applyFeedVisibility(); return r; };

v22SeedFollowed(); applyFeedVisibility(); v22Cards();
