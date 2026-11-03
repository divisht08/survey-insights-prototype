/* ═══ v22 (3 Nov) — Pradeep's review, the parts we are sure of:
   1. The drill-down opens as a full page in two columns: the story on the left (2/3), Copilot and the
      details on the right (1/3).
   2. Five cards finished end to end, card and drill-down: Feed — payment spike (INS-05), cleanliness
      (INS-04), late deliveries (AL-03); Followed — overall satisfaction (INS-01), weekend checkout (FOL-01).
      Each card: scope line, the number with its comparison and a small trend line, one customer comment.
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
const V22_CARDS = {
  'INS-05': {tone:'bad', scope:['RT ATYAF MALL','14–15 Sep','Compared with the previous 89 days'],
    num:'▲ 3,700%', unit:'payment-failure mentions vs a usual week', cmp:'11 in 2 days, against ~1 a week',
    spark:[1,0,1,1,12,0], sparkLabel:'per week, last 6 weeks',
    quote:['My card was declined twice at the till but the bank says the payment never reached them.','Store experience survey · 14 Sep']},
  'INS-04': {tone:'bad', scope:['RT ATYAF MALL','01 Jun – 23 Sep','Compared with 14 Feb – 31 May'],
    num:'▼ 7.5%', unit:'cleanliness score, now 7.4 out of 10', cmp:'The factor most linked with satisfaction (31%)',
    spark:[8.0,7.8,7.6,7.4], sparkLabel:'cleanliness score, last 4 updates',
    quote:['Fitting rooms were messy with clothes left everywhere.','Store experience survey · Fitting-room cleanliness']},
  'AL-03': {tone:'bad', scope:['Online survey','01 Jul – 23 Sep','Compared with the 12 weeks before'],
    num:'▲ 17%', unit:'detractor comments about late deliveries', cmp:'173, against 148 · 34% of detractor comments',
    spark:[11,12,13,12,14,14,15,14,16,15,18,19], sparkLabel:'per week, last 12 weeks',
    quote:['My order arrived two days after the delivery window.','Online survey · Late delivery']},
  'INS-01': {tone:'good', scope:['RT ATYAF MALL','01 Jun – 23 Sep','Compared with 14 Feb – 31 May'],
    num:'9.63', unit:'overall satisfaction, out of 10', cmp:'▲ 0.40 against 9.23 · no change since you followed',
    spark:[9.23,9.41,9.55,9.63], sparkLabel:'last 4 updates',
    quote:['Cooperative, smooth, smiling, welcoming.','Store experience survey · translated from Arabic']},
  'FOL-01': {tone:'good', scope:['RT ATYAF MALL','Weekend visits','Compared with the previous period'],
    num:'8.0', unit:'weekend checkout score, out of 10', cmp:'▲ 0.6 since you followed (7.4 on 9 Sep)',
    spark:[7.4,7.6,7.8,8.0], sparkLabel:'since you followed',
    quote:['Much quicker at the till this weekend.','Store experience survey · Weekend checkout']}
};
const V22_IC = {
  store:'<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M3 9h18M9 20v-6h6v6"/></svg>',
  cal:'<svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>'
};
function v22Spark(vals, tone){
  const w = 132, h = 36, lo = Math.min(...vals), hi = Math.max(...vals), r = hi - lo || 1;
  const pts = vals.map((v,i)=>[Math.round(i/(vals.length-1)*(w-6))+3, Math.round(h-4-(v-lo)/r*(h-10))]);
  const line = pts.map(p=>p.join(',')).join(' '), last = pts[pts.length-1];
  const c = tone==='good' ? '#1e8e5a' : '#c5221f';
  return `<svg class="v22-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polygon points="3,${h} ${line} ${w-3},${h}" fill="${c}" opacity=".1"/><polyline points="${line}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3" fill="${c}"/></svg>`;
}
function v22CardHTML(id){
  const c = V22_CARDS[id];
  return `<div class="v22-c" data-v22-card="${id}">
    <p class="v22-scope"><span>${V22_IC.store}${c.scope[0]}</span><span>${V22_IC.cal}${c.scope[1]}</span><span>${c.scope[2]}</span></p>
    <div class="v22-row">
      <div class="v22-met ${c.tone}"><b>${c.num}</b><span>${c.unit}</span><em>${c.cmp}</em>
        <div class="v22-sp">${v22Spark(c.spark, c.tone)}<small>${c.sparkLabel}</small></div></div>
      <blockquote class="v22-q">“${c.quote[0]}”<small>${c.quote[1]}</small></blockquote>
    </div></div>`;
}
function v22Cards(){
  Object.keys(V22_CARDS).forEach(id=>{
    const sel = id==='FOL-01' ? `.fol-card[data-fol-id="${id}"]` : `.insight-card[data-id="${id}"], .fol-card[data-fol-id="${id}"]`;
    document.querySelectorAll(sel).forEach(card=>{
      card.classList.remove('v7-nostat');
      if(card.querySelector('[data-v22-card]')) return;
      const title = card.querySelector('.ic-title'); if(!title) return;
      title.insertAdjacentHTML('afterend', v22CardHTML(id));
      card.classList.add('v22-hero');
    });
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
