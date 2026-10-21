/* ═══ v7 — inbox-style feed (call with Pradeep and Divisht, 19 Oct)
   · one living feed, grouped by update date, newest first; urgency only orders cards inside a date
   · two states only: read and unread (bold + dot); opening an insight marks it read; Unread filter
   · no links between versions: no New/Updated/Missed, no History, no "since" figures, no "no longer supported" list
   · Follow is the only thing that tracks an insight over time
   · lighter cards: the key figure is optional, a small row of activity icons ═══ */

/* ── read / unread ── */
const v7Read = new Set();
// what each journey state starts with: read = opened before (followed insights count as read)
const V7_READ_SEED = {
  returning: ['INS-01','INS-02','INS-03','INS-05','FOL-01','FOL-02'],
  away:      ['INS-01'],
  day50:     ['INS-01','INS-02','INS-03','INS-04','INS-05','FOL-01','FOL-02'],
  'first-ready': [], quiet:['INS-01','INS-02','INS-03','INS-04','INS-05','INS-06'], 'expired-link':['INS-01','INS-02','INS-03','INS-05','FOL-01','FOL-02']
};
function v7Seed(state){ v7Read.clear(); (V7_READ_SEED[state] || V7_READ_SEED.returning).forEach(i=>v7Read.add(i)); Object.keys(followed).forEach(i=>v7Read.add(i)); }
v7Seed('returning');
const v7IsUnread = id=>!v7Read.has(id);
var v7UnreadOnly = false;

/* ── the living feed: insights from earlier updates stay, as cards of their own ── */
function v7OldIds(){
  const now = EDITIONS[0].ids, out = [];
  EDITIONS.slice(1).forEach(e=>e.ids.forEach(i=>{ if(!now.includes(i) && !out.includes(i) && !SUPPRESSED.find(s=>s.id===i)) out.push(i); }));
  return out;
}
// the update an insight was last published in: that is its date in the feed
function v7DateOf(id){ const e = EDITIONS.find(x=>x.ids.includes(id)); return e || EDITIONS[0]; }
function v7OldCardHTML(id){
  const x = SNAP_EXTRA[id] || {}, m = INSIGHT_META[id] || {}, t = FOLLOW_TRACK[id];
  const r = t ? [...t.rows].reverse().find(y=>/\d/.test(y.val)) : null;
  const kind = (TYPE_LABEL[x.type] || m.category || '') + (x.tag ? ' · ' + x.tag : '');
  const stat = r ? `<p class="ic-num">${r.val}</p><p class="ic-unit">${x.unit || m.statSub || ''}</p>` : '';
  return `<div class="insight-card ic spr-card v7-old" data-id="${id}" data-type="${x.type || m.type || 'recurring'}" data-priority="${x.prio || 'low'}" onclick="openInvestigate(this)">
    <div class="ic-body"><div class="ic-head"><div class="ic-kind" data-el="kind-row"><span class="ic-type" data-el="kind"><span data-el="kind-text">${kind}</span></span></div><div class="ic-tags" data-el="tags"></div></div>
      <div class="ic-main"><div class="ic-text"><p class="ic-title" data-el="title">${x.title || m.title}</p><p class="ic-sum" data-el="summary">${x.summary || m.summary || ''}</p></div>
        <div class="ic-stat" data-el="stat">${stat}</div></div></div>
    <div class="ic-foot"><p class="ic-basis" data-el="basis">${x.ctx || m.ctx || ''}</p><div class="ic-acts"><div class="flex items-center gap-1.5 act-live">
      <button class="btn-sec" onclick="event.stopPropagation();follow(this)">${FOLLOW_OFF_HTML}</button>
      <button class="btn-pri" onclick="event.stopPropagation();openInvestigate(this)">${STAR_ICON}Investigate</button></div></div></div></div>`;
}
function v7SyncOldCards(){
  const grid = document.getElementById('card-grid'); if(!grid) return;
  if(typeof v3Scope!=='undefined' && v3Scope!=='store') return;
  const ids = (typeof firstEditionMode!=='undefined' && firstEditionMode) ? [] : v7OldIds();
  grid.querySelectorAll('.v7-old').forEach(c=>{ if(!ids.includes(c.dataset.id)) c.remove(); });
  ids.forEach(id=>{ if(!grid.querySelector(`.v7-old[data-id="${id}"]`)){ const t = document.createElement('template'); t.innerHTML = v7OldCardHTML(id).trim(); grid.appendChild(t.content.firstElementChild); syncFeedFollowButton(id); } });
}
// the old v5 section and the v4 "No longer supported" list are no longer used
v5SyncFollowedCards = function(){ document.querySelectorAll('#card-grid .v5-fol').forEach(c=>c.remove()); };
v4RenderEnded = function(){ const el = document.getElementById('v4-ended'); if(el) el.remove(); };

/* ── no links between versions ── */
v4Label = function(){ return null; };
v4HistoryHTML = function(){ return ''; };

/* ── cards: key figure only when it adds something; activity icons; read/unread ── */
const V7_ICON = {
  comment:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 10h8M8 14h5M21 12a8 8 0 01-11.6 7.1L4 20l1-4.2A8 8 0 1121 12z"/></svg>',
  share:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg>',
  plan:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>',
  hide:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c5 0 8.5 4.3 9.5 7-.4 1.1-1.2 2.4-2.3 3.6M6.6 6.6C4.6 7.9 3.2 9.9 2.5 12c1 2.7 4.5 7 9.5 7 1.6 0 3-.4 4.3-1"/></svg>'
};
function v7Activity(id){
  const ev = (insightActivity[id] && insightActivity[id].events) || [];
  const comments = ev.filter(e=>e.type==='comment').length;
  const shared = ev.some(e=>e.type==='share') || (typeof sharedWithMe!=='undefined' && sharedWithMe.some(s=>s.insightId===id && !s.dismissed));
  const plan = !!actionPlans[id];
  return `<span class="v7-act" data-v7-act="${id}">
    <span class="${comments?'on':''}" title="${comments ? comments + (comments===1?' comment':' comments') : 'No comments'}">${V7_ICON.comment}${comments ? `<b>${comments}</b>` : ''}</span>
    <span class="${shared?'on':''}" title="${shared ? 'Shared' : 'Not shared'}">${V7_ICON.share}</span>
    <span class="${plan?'on':''}" title="${plan ? 'Action plan · ' + actionPlans[id].status : 'No action plan'}">${V7_ICON.plan}</span></span>`;
}
function v7PaintCard(c){
  const id = c.dataset.id;
  c.classList.toggle('v7-unread', v7IsUnread(id));
  // the key figure stays only when it is a figure the summary does not already give
  const num = c.querySelector('[data-el="stat"] .ic-num, .ic-stat .ic-num'), sum = c.querySelector('[data-el="summary"], .ic-sum');
  const n = num ? num.textContent.trim() : '';
  const dup = !num || num.classList.contains('word') || (sum && n && sum.textContent.replace(/~/g,'').includes(n.replace(/%$/,'')));
  c.classList.toggle('v7-nostat', !!dup);
  // a followed insight that is no longer significant says so, and keeps updating
  if(c.classList.contains('v7-old')){
    const b = c.querySelector('[data-el="basis"]'), t = FOLLOW_TRACK[id], last = t ? t.rows[t.rows.length-1] : null;
    if(b) b.innerHTML = followed[id]
      ? `<span class="v7-nosig">${last && last.ev==='thin' ? 'Too few responses in the latest update · showing the last reliable figure' : 'No longer significant · still updating because you follow it'}</span>`
      : ((SNAP_EXTRA[id] || {}).ctx || '');
  }
  const foot = c.querySelector('.ic-foot .ic-basis');
  c.querySelectorAll('[data-v7-act]').forEach(e=>e.remove());
  if(foot) foot.insertAdjacentHTML('afterend', v7Activity(id));
}

/* ── the feed: date groups, newest first; urgency inside a date; Unread filter ── */
const V7_RANK = {high:0, med:1, pos:2, low:3};
const _v7Apply = applyFeedVisibility;
applyFeedVisibility = function(){
  v7SyncOldCards();
  _v7Apply();
  const grid = document.getElementById('card-grid'); if(!grid) return;
  grid.querySelectorAll('.v3-sec,.v5-sec,.v7-date').forEach(h=>h.remove());
  const cards = [...grid.querySelectorAll('.insight-card')];
  cards.forEach(v7PaintCard);
  if(feedView==='active' && v7UnreadOnly) cards.forEach(c=>{ if(!v7IsUnread(c.dataset.id)) c.style.display = 'none'; });
  if(feedView==='active'){
    const idx = id=>EDITIONS.indexOf(v7DateOf(id));
    cards.sort((a,b)=> idx(a.dataset.id) - idx(b.dataset.id) || (V7_RANK[a.dataset.priority]??4) - (V7_RANK[b.dataset.priority]??4));
    let cur = null;
    cards.forEach(c=>{
      const e = v7DateOf(c.dataset.id);
      if(c.style.display!=='none' && e!==cur){
        cur = e;
        const n = cards.filter(x=>x.style.display!=='none' && v7DateOf(x.dataset.id)===e).length;
        const h = document.createElement('div'); h.className = 'v7-date'; h.dataset.v7Date = e.id;
        h.innerHTML = `<b>${e.short}</b>${e.id===CURRENT_EDITION ? '<span class="lt">Latest update</span>' : ''}<span class="n">${n}</span>`;
        grid.appendChild(h);
      }
      grid.appendChild(c);
    });
  }
  // the chip row: Unread first, then the insight types (no New / Updated / Missed)
  const row = document.querySelector('[data-v3-types]');
  row && row.querySelectorAll('[data-v4-status],.v4-sep').forEach(e=>e.remove());
  const unread = cards.filter(c=>c.dataset.state==='active' && v7IsUnread(c.dataset.id)).length;
  if(row && feedView==='active'){
    row.insertAdjacentHTML('afterbegin', `<button class="v3-chip v7-unread-chip${v7UnreadOnly?' on':''}" data-v7-unread onclick="v7UnreadOnly=!v7UnreadOnly;applyFeedVisibility()">Unread<span class="n">${unread}</span></button><span class="v4-sep"></span>`);
    if(v7UnreadOnly){ const all = row.querySelector('[data-v3-type="all"]'); if(all && v3Type==='all') all.classList.remove('on'); }
  }
  const label = document.getElementById('feed-count-label');
  if(label && feedView==='active'){
    const vis = cards.filter(c=>c.style.display!=='none').length;
    label.innerHTML = `${vis} ${vis===1?'insight':'insights'}${unread ? ` <span style="color:#1a73e8;font-weight:600">· ${unread} unread</span>` : ''}`;
  }
  updateFeedNeed();
  if(label && feedView==='closed') label.textContent = label.textContent.replace('dismissed or done', 'dismissed');
  const et = document.getElementById('feed-empty-title'); if(et && feedView==='closed') et.textContent = 'Nothing dismissed';
};
const _v7SetType = v3SetType;
v3SetType = function(t){ v7UnreadOnly = false; _v7SetType(t); };


/* the Feed count in the left nav is the unread count */
function v7Unread(){ return [...document.querySelectorAll('#card-grid .insight-card')].filter(c=>c.dataset.state==='active' && v7IsUnread(c.dataset.id)).length; }
updateFeedNeed = function(){ const el = document.getElementById('feed-need'); if(!el) return; const n = v7Unread(); el.textContent = n || ''; el.title = n ? n + ' unread' : ''; el.style.display = n ? '' : 'none'; };

/* ── opening an insight marks it read; insights from earlier updates open their own drill-down ── */
const _v7Open = openInvestigate;
openInvestigate = function(el){
  const id = typeof el==='string' ? el : (el && el.closest && el.closest('.insight-card') ? el.closest('.insight-card').dataset.id : null);
  const card = id ? document.querySelector(`#card-grid .insight-card[data-id="${id}"]`) : null;
  if(card && card.classList.contains('v7-old')){
    if(followed[id]) v5OpenFollowed(id); else v4OpenEnded(id);
    document.querySelectorAll('.insight-card').forEach(c=>c.classList.toggle('active', c===card));
  } else _v7Open(el);
  if(id && !v7Read.has(id)){ v7Read.add(id); if(card) v7PaintCard(card); v7RefreshCounts(); }
};
openSnapshot = function(id){ openInvestigate(id); };
function v7RefreshCounts(){
  const cards = [...document.querySelectorAll('#card-grid .insight-card')];
  const unread = cards.filter(c=>c.dataset.state==='active' && v7IsUnread(c.dataset.id)).length;
  const chip = document.querySelector('[data-v7-unread] .n'); if(chip) chip.textContent = unread;
  const label = document.getElementById('feed-count-label');
  if(label && feedView==='active'){ const vis = cards.filter(c=>c.style.display!=='none').length; label.innerHTML = `${vis} ${vis===1?'insight':'insights'}${unread ? ` <span style="color:#1a73e8;font-weight:600">· ${unread} unread</span>` : ''}`; }
  updateFeedNeed(); renderCatchup();
}

/* ── drill-down: "Found in the update of …", period comparison, Since you followed open ── */
v6Case = function(id){
  if(dismissedFeed.has(id)){ const r = (insightFeedback[id] && insightFeedback[id].reasons || [])[0]; const l = (V3_REASONS.find(x=>x[0]===r)||[])[1];
    return {k:'closed', chip:'Dismissed', text:`You dismissed this${l ? ' — ' + l.toLowerCase() : ''}. It stays out of your feed unless you restore it.`}; }
  if(doneFeed.has(id)) return {k:'closed', chip:'Done', text:'You marked this done. It stays out of your feed unless you restore it.'};
  if(!inCurrentEdition(id)){
    const t = FOLLOW_TRACK[id], last = t ? t.rows[t.rows.length-1] : null;
    if(followed[id]) return {k:'nosig', chip: last && last.ev==='thin' ? 'Too few responses' : 'No longer significant',
      text: (last && last.ev==='thin' ? 'Too few responses in the latest update to confirm this; the last reliable figure is shown.' : 'No longer significant in the latest update.') + ' ' + v6FollowLine(id) + ' It keeps updating while you follow it.'};
    const why = t && t.why ? ' ' + t.why.replace(/,? ?and (it )?is not in the feed/g,'') : '';
    return {k:'nosig', chip:'', text:`Not significant in the latest update (${EDITIONS[0].short}).${why}`};
  }
  if(followed[id]) return {k:'fol', chip:'Following', text:v6FollowLine(id)};
  return {k:'', chip:'', text:''};
};
v6Metrics = function(id){
  const card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  const num = card && card.querySelector('.ic-num'), unit = card && card.querySelector('.ic-unit'), delta = card && card.querySelector('.ic-delta');
  const t = FOLLOW_TRACK[id], last = t ? t.rows[t.rows.length-1] : null;
  const keyVal = num ? num.textContent.trim() : (v6NowVal(id) || '—');
  const keySub = unit ? unit.textContent.trim() : ((SNAP_EXTRA[id]||{}).unit || '');
  let cmp = '—', cmpSub = 'no comparison for this insight', cls = '';
  if(delta){ cmp = delta.childNodes[0] ? delta.childNodes[0].textContent.trim() : delta.textContent; const sm = delta.querySelector('small'); cmpSub = sm ? sm.textContent : ''; cls = delta.classList.contains('down') ? 'neg' : 'pos'; }
  const sig = inCurrentEdition(id) ? ['pos','Significant'] : (last && last.ev==='thin' ? ['warn','Too few responses'] : ['muted','Not significant']);
  const numColor = num && num.getAttribute('style') ? num.getAttribute('style') : '';
  return `<div class="v6-metrics" data-v6-metrics>
      <div><span>Key figure</span><b style="${numColor}">${v6Esc(keyVal)}</b><small>${v6Esc(keySub)}</small></div>
      <div><span>vs previous period</span><b class="${cls}">${v6Esc(cmp)}</b><small>${v6Esc(cmpSub)}</small></div>
      <div><span>Evidence</span><b class="${sig[0]}">${sig[1]}</b><small>in the latest update</small></div></div>`;
};
const _v7Shape = v6Shape;
v6Shape = function(html, id, opts){
  const out = _v7Shape(html, id, opts);
  const t = document.createElement('template'); t.innerHTML = out;
  t.content.querySelectorAll('[data-v6-case]').forEach(c=>{ if(!c.textContent.trim()) c.remove(); });
  const head = t.content.querySelector('.v6-head');
  if(head){ const e = v7DateOf(id); head.insertAdjacentHTML('beforeend', `<p class="v7-found" data-v7-found>Found in the update of ${e.short}${e.id===CURRENT_EDITION ? ' (latest)' : ''}</p>`); }
  t.content.querySelectorAll('[data-v3-since]').forEach(d=>d.setAttribute('open',''));
  t.content.querySelectorAll('[data-v6-bar] button').forEach(b=>{ if(b.textContent.trim()==='Dismiss' && !b.querySelector('svg')) b.insertAdjacentHTML('afterbegin', V7_ICON.hide); });
  t.content.querySelectorAll('.v6-sh b, .eyebrow').forEach(b=>{ if(/^As last published/i.test(b.textContent)) b.textContent = 'What we found'; });
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};

/* ── Copilot: "Has this happened before?" on every insight ── */
function v7BeforeAnswer(id){
  const eds = EDITIONS.slice().reverse().filter(e=>e.ids.includes(id)).map(e=>e.short);
  if(eds.length<=1) return 'Not in this survey\'s earlier updates. This is the first time this topic has come up as an insight.';
  return `Yes. The same topic came up in the updates of ${eds.slice(0,-1).join(', ')} and ${eds[eds.length-1]}. Each update is analysed on its own data, so check those periods' figures before comparing them.`;
}
[...EDITIONS[0].ids, ...v7OldIds()].forEach(id=>{
  COPILOT_QA[id] = COPILOT_QA[id] || [];
  if(!COPILOT_QA[id].some(q=>q[0]==='Has this happened before?')) COPILOT_QA[id].push(['Has this happened before?', v7BeforeAnswer(id), 'Earlier updates of this survey']);
});

/* ── welcome back: unread since your last visit ── */
renderCatchup = function(){
  const el = document.getElementById('catchup'); if(!el) return;
  if(!awayMode){ el.classList.add('hidden'); el.innerHTML = ''; return; }
  const n = [...document.querySelectorAll('#card-grid .insight-card')].filter(c=>c.dataset.state==='active' && v7IsUnread(c.dataset.id)).length;
  el.classList.remove('hidden');
  el.innerHTML = `<div class="catchup" data-catchup><div class="cu-head"><b>Welcome back</b><span>· ${n} unread ${n===1?'insight':'insights'} since your last visit on ${LAST_VISIT}</span>
      <button class="cu-x" title="Dismiss" onclick="dismissCatchup()">×</button></div>
    ${n ? `<div style="margin-top:8px"><button class="btn-sec" data-v7-catchup onclick="v7UnreadOnly=true;applyFeedVisibility()">Show unread</button></div>` : ''}</div>`;
};
const _v7Journey = setJourney;
setJourney = function(state){ v7Seed(state); v7UnreadOnly = false; _v7Journey(state); applyFeedVisibility(); renderCatchup(); };

/* ── Dismissed: one name, "Not relevant to me" first, free text, its own icon ── */
v3DismissMenu = function(ev, id){
  ev.stopPropagation();
  let m = document.getElementById('v3-dm');
  if(!m){ m = document.createElement('div'); m.id = 'v3-dm'; document.body.appendChild(m); }
  m.innerHTML = `<p>Why are you dismissing this?</p>` + V3_REASONS.map(([k,l],i)=>`<label class="v7-r" data-v3-reason="${k}"><input type="radio" name="v7-reason" value="${k}"${i===0?' checked':''}> <span>${l}</span></label>`).join('')
    + `<textarea id="v7-dm-text" rows="2" placeholder="Anything else? (optional)"></textarea>
       <div class="v7-dm-acts"><button class="btn-sec" onclick="v3CloseDm()">Cancel</button><button class="btn-pri" data-v7-dismiss-go onclick="v7DismissGo('${id}')">Dismiss</button></div>`;
  m.style.display = 'block';
  const r = ev.currentTarget.getBoundingClientRect(), h = m.offsetHeight;
  m.style.top = ((r.bottom + 6 + h > innerHeight) ? Math.max(8, r.top - h - 6) : r.bottom + 6) + 'px';
  m.style.left = Math.max(8, Math.min(innerWidth - 310, r.right - 290)) + 'px';
};
function v7DismissGo(id){
  const r = (document.querySelector('#v3-dm input[name="v7-reason"]:checked') || {}).value || 'irrelevant';
  const txt = (document.getElementById('v7-dm-text') || {}).value || '';
  v3Dismiss(id, r);
  if(txt.trim() && insightFeedback[id]) insightFeedback[id].comment = txt.trim();
}
// "Not relevant to me" first, as Pradeep asked (it already is); keep the order explicit
V3_REASONS.sort((a,b)=>(a[0]==='irrelevant'?-1:0) - (b[0]==='irrelevant'?-1:0));
const _v7Bin = v3OpenBin;
v3OpenBin = function(){ _v7Bin(); const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Dismissed'; };
const _v7Deco = v3DecorateCards;
v3DecorateCards = function(){ _v7Deco(); document.querySelectorAll('#card-grid .v3-x').forEach(b=>{ if(!b.dataset.v7){ b.dataset.v7 = '1'; b.innerHTML = V7_ICON.hide; b.title = 'Dismiss'; } }); };

/* ── use cases: what this change assumes ── */
UC_ROWS.push(
  ['Feed','Inbox-style living feed: newest first, read and unread, insights stay and sink down','h','—','From the 19 Oct review with Pradeep and Divisht. Not tested with a customer.','Feed grouped by update date; Unread filter'],
  ['Feed','No links between versions: a topic that comes back is a new card; Follow is the only way to track one','h','—','Copilot "Has this happened before?" covers looking back.','Follow; Copilot question in every drill-down'],
  ['Cadence','The update frequency sets the comparison window (weekly → weekly comparisons and trends)','h','—','About 80% confident (19 Oct). Validate with customers.','Update cadence in Configure']
);

v3Kpis = function(){ const k = document.getElementById('v3-kpis'); if(k) k.remove(); };

/* ── start ── */
(function v7Init(){
  const bin = document.getElementById('v3-nav-bin'); if(bin){ const t = bin.querySelector('.sn-t'); if(t) t.textContent = 'Dismissed'; }
  const kp = document.getElementById('v3-kpis'); if(kp) kp.remove();
  v3DecorateCards(); applyFeedVisibility(); renderCatchup();
  // an email link opened before this file loaded: reopen it with the current drill-down
  const q = new URLSearchParams(location.search), qi = q.get('insight');
  if(qi && !q.get('sso') && (q.get('action') || 'investigate')==='investigate' && document.querySelector(`#card-grid .insight-card[data-id="${qi}"]`)){ segNav('insights'); openInvestigate(qi); }
})();
