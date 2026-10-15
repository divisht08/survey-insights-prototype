/* ═══ EDITIONS — the feed refreshes only on the user's frequency; each edition replaces the last ═══ */
const PRIO_DOT = {high:'#c5221f', med:'#d9900f', pos:'#0e8a5f', low:'#b8bec8'};
const NEWS_ICON = '<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color:#42474f;flex:none"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>';
function inCurrentEdition(id){ return EDITIONS[0].ids.includes(id); }
function streakOf(id){ let n=0; for(const e of EDITIONS){ if(e.ids.includes(id)) n++; else break; } return n; }
function metaOf(id){ return INSIGHT_META[id] || EXTRA_TOPICS[id] || {title:id, category:''}; }

const CHEV = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color:#5f6672"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>';
// what the user has opened on purpose (a click, not the default selection), so counts reflect what still needs them
var openedIds = new Set(), backlogDismissed = false;
function needsYou(id){ const lvl = snapLevel(id); return (lvl==='high' || lvl==='med') && !hasAction(id) && !openedIds.has(id) && !SUPPRESSED.find(x=>x.id===id); }
// latest edition: insights needing attention you have not opened or acted on
function edOutstanding(e){
  if(e.id===CURRENT_EDITION) return e.ids.filter(id=> needsYou(id) && feedStateOf(id)==='active');
  // past editions: insights that left the feed before you opened them
  return e.ids.filter(id=> !inCurrentEdition(id) && needsYou(id));
}
function missedBacklog(){
  const seen = new Set(), out = [];
  EDITIONS.slice(1).forEach(e=> edOutstanding(e).forEach(id=>{ if(!seen.has(id)){ seen.add(id); out.push({id, ed:e}); } }));
  return out;
}
function edCountLabel(e, n){ return e.id===CURRENT_EDITION ? n + ' need' + (n===1?'s':'') + ' you' : n + ' not opened'; }
function updateFeedNeed(){
  const f = document.getElementById('feed-need'); if(!f) return;
  const n = edOutstanding(EDITIONS[0]).length;
  f.textContent = n; f.dataset.n = n; f.style.display = n ? '' : 'none';
}
function renderEditionBar(){
  updateFeedNeed();
  const el = document.getElementById('edition-bar'); if(!el) return;
  const sch = EDITION_SCHEDULE[editionFreq], cur = EDITIONS[0];
  const viewing = EDITIONS.find(e=>e.id===viewingEdition) || cur, past = viewingEdition!==CURRENT_EDITION;
  const nextShort = (pendingFreq ? EDITION_SCHEDULE[pendingFreq].next : sch.next).split(',')[0];
  if(firstEditionMode){
    el.innerHTML = `<div class="ed-bar2" data-edition-bar><div class="eb-top">${NEWS_ICON}<b class="eb-d" data-edition-tag>Your first edition · ${cur.date}</b><span class="ed-next">Next edition ${nextShort}</span></div></div>`;
    return;
  }
  const chips = EDITIONS.filter((e,i)=> i<EDITION_BAR_MAX || e.id===viewingEdition).map(e=>{
    const n = edOutstanding(e).length;
    return `<button class="eb-chip${viewingEdition===e.id?' on':''}" data-edition="${e.id}" onclick="viewEdition('${e.id}')">${e.short}${e.id===CURRENT_EDITION?'<span class="eb-latest">Latest</span>':''}${n ? `<span class="eb-n${e.id===CURRENT_EDITION?'':' past'}" data-ed-count="${e.id}" title="${edCountLabel(e,n)}">${n}</span>` : ''}</button>`;
  }).join('');
  const missed = missedBacklog();
  const callout = false ? `<div class="eb-callout" data-backlog>
      <span class="eb-ci">!</span>
      <div class="min-w-0"><b>${missed.length} insight${missed.length===1?'':'s'} left your feed before you opened ${missed.length===1?'it':'them'}.</b> ${missed.length===1?'It is':'They are'} no longer in the latest edition, but ${missed.length===1?'it was':'they were'} worth a look.
        <div class="eb-cl">${missed.map(m=>`<button data-backlog-open="${m.id}" onclick="viewEdition('${m.ed.id}');openSnapshot('${m.id}')">${(SNAP_EXTRA[m.id]&&SNAP_EXTRA[m.id].title) || metaOf(m.id).title}<span>last in ${m.ed.short}</span></button>`).join('')}</div></div>
      <button class="eb-x" title="Dismiss" onclick="backlogDismissed=true;renderEditionBar()">×</button></div>` : '';
  el.innerHTML = `<div class="ed-bar2${past?' past':''}" data-edition-bar>
      <div class="eb-top">${NEWS_ICON}<span class="eb-k">${past ? 'Past edition' : 'Latest edition'}</span><b class="eb-d">${viewing.date}</b>
        ${past ? `<span class="ed-ro" data-edition-tag>Read-only copy</span><button class="btn-sec eb-back ed-back" data-edition="${CURRENT_EDITION}" onclick="viewEdition('${CURRENT_EDITION}')">← Back to the latest edition</button>`
               : `<span class="ed-next" data-edition-tag>Next edition ${nextShort}</span>`}</div>
      <div class="eb-chips"><span class="eb-l">Editions</span>${chips}<button class="ed-all" data-all-editions onclick="event.stopPropagation();toggleAllEditions()">${allEditionsOpen?'Hide all editions':'All editions'}</button></div>
      ${allEditionsOpen ? allEditionsHTML() : ''}
    </div>
    ${pendingFreq ? `<div class="ed-pending" data-pending>Switching to ${pendingFreq.toLowerCase()} editions from ${EDITION_SCHEDULE[pendingFreq].next}. This edition stays as it is until then.</div>` : ''}
    ${callout}`;
}
function allEditionsHTML(){
  const rows = EDITIONS.map(e=>{ const n = edOutstanding(e).length;
    return `<button class="ed-opt${viewingEdition===e.id?' on':''}" data-all-edition="${e.id}" onclick="viewEdition('${e.id}')"><span class="d">${e.short}</span><span class="m">${e.id===CURRENT_EDITION?'Latest · ':''}${e.ids.length} insights</span>${n ? `<span class="eb-n${e.id===CURRENT_EDITION?'':' past'} wide">${edCountLabel(e,n)}</span>` : '<span class="eb-ok">Nothing outstanding</span>'}${viewingEdition===e.id?'<span class="ok">✓</span>':''}</button>`; }).join('');
  return `<div class="ed-list" data-all-panel onclick="event.stopPropagation()">${rows}
    <div class="ed-keep2" data-retention-note>Editions are kept for ${EDITION_RETENTION}. Comments, follows and action plans stay with the insight.</div></div>`;
}
function toggleAllEditions(){ allEditionsOpen = !allEditionsOpen; renderEditionBar(); }
document.addEventListener('click', ()=>{ if(allEditionsOpen){ allEditionsOpen = false; renderEditionBar(); } });
// landing for an email link whose edition is past the retention period (journey state "expired-link")
function showExpiredEditionLanding(){
  showEmailBanner(`Opened from your email · <b>Store Manager weekly digest</b> · sent Sun 21 Sep 2025. <b>That edition is no longer available.</b> Editions are kept for ${EDITION_RETENTION}, then deleted, so you are viewing the current edition (${EDITIONS[0].short}). Your comments, follows and action plans on those insights are still here.`);
  const b = document.getElementById('email-landing-banner'); if(b) b.dataset.expiredEdition = '1';
  window.scrollTo(0,0);
}
function renderFreshness(){
  // edition labels from the topic key: new this edition, or how many editions in a row
  document.querySelectorAll('#card-grid .insight-card').forEach(card=>{
    const id = card.dataset.id;
    card.querySelectorAll('[data-fresh],[data-fresh-tag],[data-was]').forEach(e=>e.remove());
    if(firstEditionMode) return;
    const n = streakOf(id);
    const ctx = card.querySelector('[data-el="basis"]');
    if(ctx && n){
      const sp = document.createElement('span'); sp.dataset.fresh = '1';
      sp.textContent = n===1 ? ' · New this edition' : (' · In ' + n + ' editions in a row');
      ctx.appendChild(sp);
    }
    const group = card.querySelector('[data-el="kind-row"]');
    const tag = (cls, txt, title)=>{ const t=document.createElement('span'); t.className='fresh-tag '+cls; t.dataset.freshTag=cls; t.textContent=txt; if(title) t.title=title; group && group.appendChild(t); };
    if(n===1) tag('new','New','New in this edition — not in any earlier edition');
    else if(n>=3 && !hasAction(id)) tag('stale', n+' editions · no action', 'In every edition since '+EDITIONS[n-1].short+', and nobody has acted on it');
  });
}
function renderEditionFoot(){
  const el = document.getElementById('edition-foot'); if(!el) return;
  if(firstEditionMode){ el.innerHTML = ''; return; }
  el.innerHTML = SUPPRESSED.map(x=> x.returning
    ? `<div class="ed-foot" data-suppressed="${x.id}" data-returning="1"><span style="flex:1"><b style="color:#42474f">Coming back in the next edition:</b> ${metaOf(x.id).title} — you asked to bring it back. It returns on ${nextEditionShort()} if it is still in the data.</span>
      <button style="font-weight:600;color:#1a73e8;flex:none" onclick="setHeldBack('${x.id}', false)">Undo</button></div>`
    : `<div class="ed-foot" data-suppressed="${x.id}">
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="flex:none;margin-top:1px"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
      <span style="flex:1"><b style="color:#42474f">Held back from this edition:</b> ${metaOf(x.id).title} — ${x.why}. It comes back only if it gets materially worse.</span>
      <button style="font-weight:600;color:#1a73e8;flex:none" onclick="viewEdition('${x.lastIn}')">See where it last appeared</button>
      <button style="font-weight:600;color:#1a73e8;flex:none" data-bring-back="${x.id}" onclick="setHeldBack('${x.id}', true)">Bring it back</button></div>`).join('');
}
// An edition is a fixed snapshot, so bringing a held-back topic back takes effect from the next edition
function setHeldBack(id, returning){
  const x = SUPPRESSED.find(y=>y.id===id); if(!x) return;
  x.returning = returning; renderEditionFoot();
  if(returning) toast('It will be back in the next edition if it is still in the data');
}
/* Past editions: the same cards as the feed, as read-only copies, with a read-only drill-down. */
const SNAP_EXTRA = {   // topics that are in a past edition but not the current one
  'FOL-01': { cloneFrom:'INS-01', prio:'med', type:'comparison', tag:'Checkout', ctx:'Weekend visits · vs previous period', illustrative:true, track:true,
    title:"Weekend shoppers' checkout score fell", unit:'out of 10, weekend visits',
    summary:'Respondents who visited on a weekend rated checkout lower than in the previous period.',
    action:'check weekend till cover against footfall.',
    reason:'A significant drop on a factor within store control.',
    body:'<p class="id-lede">Respondents who visited on a weekend rated checkout lower than in the previous period. The figures are placeholders that show the behaviour.</p>' },
  'FOL-02': { cloneFrom:'INS-01', prio:'med', type:'segment', tag:'Fitting rooms', ctx:'First-time vs returning shoppers', illustrative:true, track:true,
    title:'First-time shoppers rate fitting-room help lower than returning shoppers', unit:'points vs returning shoppers',
    summary:'First-time shoppers rate fitting-room help lower than returning shoppers. Both groups had enough responses to compare.',
    action:'check how first-time shoppers are helped at the fitting rooms.',
    reason:'A significant gap between two groups, within store control.',
    body:'<p class="id-lede">First-time shoppers rate fitting-room help lower than returning shoppers. The figures are placeholders that show the behaviour.</p>' },
  'TOP-QUEUE': { cloneFrom:'INS-02', tag:'Checkout', ctx:'vs 14 Feb – 31 May 2026', illustrative:true,
    summary:'Comments about waiting at the tills on weekends were present in this edition.',
    action:'check weekend till cover against footfall; escalate if staffing is fixed centrally.',
    reason:'Recurring and within store control, with no evidence it was getting worse.',
    body:`
      <p class="id-lede">A set of comments in this edition pointed to waiting at the tills on weekends. The comments show the theme was present; they do not show that queueing is associated with the satisfaction score.</p>
      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">The evidence</p>
        <div class="rounded-md" style="border:1px solid var(--line-soft);background:var(--surface-2)">
          <div class="flex items-center justify-between px-3 py-2 border-b" style="border-color:var(--line-soft)">
            <span class="text-[11.5px] font-500 text-txt-2">Weekend checkout-queue comments</span>
            <span class="text-[10.5px] text-txt-4">Not stated as meaningful movement</span>
          </div>
          <div class="px-3 py-2 text-[11px] text-txt-3"><span class="font-500 text-txt-2">Current:</span> 2 clear examples shown &nbsp;&middot;&nbsp; <span class="font-500 text-txt-2">Previous:</span> 1 clear example shown</div>
        </div>
      </div>
      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">Customer voice</p>
        <p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding.</p>
        <div class="space-y-2">
          <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)"><p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Long queue at the till on Friday evening&rdquo;</p><p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Checkout queue</p></div>
          <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)"><p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Only two counters open on the weekend&rdquo;</p><p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Checkout queue</p></div>
          <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)"><p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Waited too long to pay&rdquo;</p><p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Checkout queue</p></div>
        </div>
      </div>
      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p>
        <div class="id-means" style="margin-top:9px">
          <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
          <div><b>Recommended action.</b> check weekend till cover against footfall; escalate if staffing is fixed centrally.</div>
        </div>
      </div>` }
};
const SNAP_RANK = {high:0, med:1, pos:2, low:3};
function snapLevel(id){ return (SNAP_EXTRA[id] && SNAP_EXTRA[id].prio) || (PRIORITY[id]||{}).level || metaOf(id).prio || 'low'; }
// how many editions in a row the topic had been in, as of the edition at index idx (EDITIONS is newest first)
function streakAt(id, idx){ let n=0; for(let i=idx;i<EDITIONS.length;i++){ if(EDITIONS[i].ids.includes(id)) n++; else break; } return n; }
function snapFate(id){
  if(SUPPRESSED.find(x=>x.id===id)) return 'held';
  return inCurrentEdition(id) ? 'current' : 'gone';
}
function snapFateNote(id){
  const fate = snapFate(id);
  return fate==='held' ? 'Held back from later editions — you marked it Done on 14 Sep'
       : fate==='gone' ? 'Not in later editions' : '';
}
// An old copy shows the insight as it was generated: its figure, its data window, and a drill-down cut at that date.
function snapRow(id, ed){ const t = FOLLOW_TRACK[id]; return t ? t.rows.find(r=>r.ed===ed.short) : null; }
function snapBasisText(txt, ed){ return ed.id===CURRENT_EDITION ? txt : txt.replace(/23 Sep 2026/g, ed.cut); }
const SNAP_BODY = {   // edition-specific drill-down content where the stored analysis differs from the latest
  'INS-04': { 'Sun 20 Sep': b=>b.replace('at 31% of the explained variation','at 28% of the explained variation')
      .replace('<span class="drv-pct">31%</span>','<span class="drv-pct">28%</span>').replace('<span class="drv-pct">24%</span>','<span class="drv-pct">25%</span>')
      .replace('<span class="drv-pct">18%</span>','<span class="drv-pct">19%</span>').replace('<span class="drv-pct">15%</span>','<span class="drv-pct">16%</span>') }
};
function snapBodyHTML(id, ed, body){
  const f = SNAP_BODY[id] && SNAP_BODY[id][ed.short];
  return f ? f(body) : body;
}
// charts in the drill-down stop at the edition's last day of responses
function snapCutCharts(panel, id, ed){
  if(ed.id===CURRENT_EDITION) return;
  if(id==='INS-05' && ed.short==='Sun 20 Sep'){
    const bars = [...panel.querySelectorAll('.anom-chart .b')], labs = [...panel.querySelectorAll('.anom-chart + div span')];
    const keep = 21;   // 27 Aug – 16 Sep
    bars.slice(keep).forEach(b=>b.remove()); labs.slice(keep).forEach(l=>l.remove());
    if(labs[keep-1]){ labs[keep-1].textContent = '16 Sep'; labs[keep-1].style.textAlign = 'right'; }
    panel.querySelectorAll('.eyebrow').forEach(e=>{ if(e.textContent.includes('27 Aug – 23 Sep')) e.textContent = e.textContent.replace('23 Sep','16 Sep'); });
  }
}
function snapActions(id){
  const fate = snapFate(id);
  const openBtn = fate==='current'
    ? `<button class="btn-sec" data-open-current="${id}" onclick="event.stopPropagation();openFromEdition('${id}')">Open latest →</button>` : '';
  // following works from any edition: it tracks the topic from now on, in the feed or not
  const follow = fate==='held' ? '' : `<button class="btn-sec${followed[id]?' on':''}" data-snap-follow="${id}" onclick="event.stopPropagation();snapFollow('${id}')">${followed[id] ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>`;
  return `${follow}${openBtn}<button class="btn-pri" data-snap-details="${id}" onclick="event.stopPropagation();openSnapshot('${id}')">${STAR_ICON}Investigate</button>`;
}
function snapFollow(id){
  if(followed[id]){ removeFromFollowed(id); toast('Unfollowed'); }
  else {
    const ed = EDITIONS.find(e=>e.id===viewingEdition) || EDITIONS[0];
    addToFollowed(id, {source:'feed', fromEd:ed.short});
    const then = snapRow(id, ed), now = FOLLOW_TRACK[id] ? FOLLOW_TRACK[id].rows[FOLLOW_TRACK[id].rows.length-1] : null;
    const moved = then && now && then.val!==now.val && /\d/.test(then.val) && /\d/.test(now.val) ? ` Changes are tracked from today's figure (${now.val}), not the ${then.val} in this edition.` : '';
    toast((inCurrentEdition(id) ? 'Following — it is in Followed.' : 'Following — it is in Followed and recalculated every edition, even though it is not in the feed.') + moved);
  }
  renderEditionSnapshot();
  if(snapOpenId){ const p = document.getElementById('investigate-panel'); if(p){ p.innerHTML = snapshotPanelHTML(snapOpenId); snapCutCharts(p, snapOpenId, EDITIONS.find(e=>e.id===viewingEdition) || EDITIONS[0]); } }
}
function buildSnapCard(id, idx){
  const extra = SNAP_EXTRA[id], m = metaOf(id), level = snapLevel(id), ed = EDITIONS[idx];
  const src = document.querySelector('#card-grid .insight-card[data-id="'+(extra ? extra.cloneFrom : id)+'"]');
  if(!src) return null;
  const c = src.cloneNode(true);
  c.className = 'snap-card ic spr-card';
  ['data-id','data-state','style','onclick','data-illustrative'].forEach(a=>c.removeAttribute(a));
  c.dataset.snap = id; c.dataset.priority = level;
  c.setAttribute('onclick', "openSnapshot('"+id+"')");
  c.querySelectorAll('.dismiss-x,[id^="plan-"],[data-plan-btn],[data-fresh],[data-fresh-tag],[data-was],[data-fb-slot]').forEach(e=>e.remove());
  c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  const titleEl = c.querySelector('[data-el="title"]');
  const ctxEl   = c.querySelector('[data-el="basis"]');
  if(extra){
    // a topic with no card in the current edition: same card shape, its own content
    titleEl.textContent = extra.title || m.title;
    if(ctxEl) ctxEl.textContent = extra.ctx;
    const row = extra.track && FOLLOW_TRACK[id] ? FOLLOW_TRACK[id].rows.find(r=>r.ed===ed.short) : null;
    const stEl = c.querySelector('[data-el="stat"]');
    if(stEl && row) stEl.innerHTML = `<p class="ic-num">${row.val}</p><p class="ic-unit">${extra.unit||''}</p>`;
    const sum = c.querySelector('[data-el="summary"]'); if(sum) sum.textContent = extra.summary;
    const act = c.querySelector('[data-el="action"]'); if(act) act.innerHTML = '<span class="font-600">Recommended action:</span> ' + extra.action;
    const kind = c.querySelector('[data-el="kind-text"]'); if(kind) kind.textContent = TYPE_LABEL[extra.type || 'recurring'] + ' · ' + extra.tag;
    const pl = c.querySelector('[data-prio-label]'); if(pl){ pl.className = 'prio '+level; pl.innerHTML = '<i></i>'+PRIO_LABEL[level]; }
  }
  // edition labels as they stood in that edition (unknown for the oldest edition we hold)
  const n = streakAt(id, idx), reachesOldest = (idx + n) >= EDITIONS.length;
  const group = c.querySelector('[data-el="kind-row"]');
  const right = c.querySelector('[data-el="tags"]');
  if(ctxEl && !(n===1 && reachesOldest)){
    const sp = document.createElement('span'); sp.dataset.fresh = '1';
    sp.textContent = n===1 ? ' · New in this edition' : (' · In ' + n + ' editions in a row by then');
    ctxEl.appendChild(sp);
  }
  if(group && n===1 && !reachesOldest){ const t=document.createElement('span'); t.className='fresh-tag new'; t.dataset.freshTag='new'; t.textContent='New'; t.title='New in this edition'; group.appendChild(t); }
  if(group && extra && extra.illustrative){ const t=document.createElement('span'); t.className='illus'; t.title='Illustrative example — not real RT ATYAF MALL data'; t.textContent='Illustrative'; group.appendChild(t); }
  if(right) right.innerHTML = `<span class="fresh-tag asof" data-snap-tag title="A read-only copy of this insight as it was published">Snapshot · ${ed.short}</span>`;
  const note = snapFateNote(id);
  if(ctxEl && note){ const sp = document.createElement('span'); sp.dataset.snapFate = '1'; sp.textContent = ' · ' + note; ctxEl.appendChild(sp); }
  if(!extra){
    const row = snapRow(id, ed), num = c.querySelector('[data-el="stat"] .ic-num:not(.word)');
    if(row && num && /\d/.test(row.val)) num.textContent = row.val;
    if(ctxEl) ctxEl.childNodes.forEach(n=>{ if(n.nodeType===3) n.textContent = snapBasisText(n.textContent, ed); });
  }
  const acts = c.querySelector('.ic-acts');
  if(acts) acts.innerHTML = snapActions(id);
  return c;
}
function renderEditionSnapshot(){
  const el = document.getElementById('earlier-list'); if(!el) return;
  const idx = EDITIONS.findIndex(e=>e.id===viewingEdition); if(idx<0) return;
  const ed = EDITIONS[idx];
  el.innerHTML = '';   // the edition control above already says it is a past, read-only edition
  [...ed.ids].sort((a,b)=> SNAP_RANK[snapLevel(a)] - SNAP_RANK[snapLevel(b)]).forEach(id=>{
    const c = buildSnapCard(id, idx); if(!c) return;
    if(id===snapOpenId) c.classList.add('active');
    el.appendChild(c);
  });
}
// A clear alert at the top of an old copy: where the newer data is, or why there is none
function snapAlertHTML(id, ed){
  const fate = snapFate(id), cur = EDITIONS[0], t = FOLLOW_TRACK[id];
  const rowAt = d=> t ? t.rows.find(r=>r.ed===d) : null;
  const then = rowAt(ed.short), now = t ? t.rows[t.rows.length-1] : null;
  if(fate==='current'){
    const fig = (then && now && then.val!==now.val) ? ` It was <b>${then.val}</b> in this edition and is <b>${now.val}</b> now.` : '';
    return `<div class="snap-alert cur" data-snap-note><span class="sa-i">↻</span><div><b>You're viewing an old copy from the ${ed.short} edition.</b> This insight is in the latest edition (${cur.short}) with newer data.${fig}
      <div class="sa-act"><button class="btn-pri" data-snap-latest onclick="openFromEdition('${id}')">Open the latest version →</button></div></div></div>`;
  }
  if(fate==='held'){
    const x = SUPPRESSED.find(y=>y.id===id);
    return `<div class="snap-alert held" data-snap-note><span class="sa-i">✓</span><div><b>Old copy from the ${ed.short} edition.</b> You marked it Done on 14 Sep, so it is held back from later editions. It comes back only if it gets materially worse.
      <div class="sa-act"><button class="btn-sec" onclick="setHeldBack('${id}', true);toast('It will be back in the next edition if it is still in the data')">${x && x.returning ? 'Coming back next edition' : 'Bring it back'}</button></div></div></div>`;
  }
  const why = now && now.ev==='nosig' ? 'the change is no longer significant' : now && now.ev==='thin' ? 'there were too few responses to confirm it' : 'it no longer meets the evidence rules';
  return `<div class="snap-alert gone" data-snap-note><span class="sa-i">!</span><div><b>Old copy from the ${ed.short} edition.</b> This insight is not in the latest edition because ${why}. There is no newer version in the feed.
    ${followed[id] ? `<div class="sa-act"><button class="btn-pri" onclick="segNav('followed');selectTabCard('followed','${id}')">See it in Followed →</button></div>` : `<div class="sa-act"><span class="sa-n">Follow insights like this to keep tracking them after they leave the feed.</span></div>`}</div></div>`;
}
function snapshotPanelHTML(id){
  const ed = EDITIONS.find(e=>e.id===viewingEdition) || EDITIONS[0];
  const m = metaOf(id), extra = SNAP_EXTRA[id], level = snapLevel(id), fate = snapFate(id);
  const reason = (extra && extra.track && extra.reason) || (PRIORITY[id]||{}).reason || (extra && extra.reason) || '';
  const illus  = (INSIGHT_META[id] && INSIGHT_META[id].illustrative) || (extra && extra.illustrative);
  const body   = snapBodyHTML(id, ed, investigateContent[id] || (extra && extra.body) || '<p class="text-[12.5px] text-txt-3">No additional detail available for this insight.</p>');
  const row    = snapRow(id, ed);
  const where  = fate==='current' ? `It is also in the current edition, where you can act on it.`
               : fate==='held'    ? `It is held back from later editions because you marked it Done on 14 Sep, and it hasn't got worse.`
               : `It is not in later editions.`;
  const cta = fate==='current' ? `<button class="btn-pri" data-snap-open-current onclick="openFromEdition('${id}')">${followed[id]?'Open in Followed':'Open in current edition'} →</button>` : '';
  return `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <div class="min-w-0">
        <p class="text-[10.5px] font-600 uppercase tracking-wide text-txt-4 mb-0.5">${m.category}</p>
        <p class="text-[14.5px] font-600 text-txt-1 leading-snug">${(extra && extra.title) || m.title}</p>
      </div>
      <button class="iconbtn flex-shrink-0" data-close-panel onclick="closeSnapshot()"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    ${snapAlertHTML(id, ed)}
    <div class="snap-asof" data-snap-asof><span>Generated <b>${ed.date}</b></span><span>Responses up to <b>${ed.cut}</b></span><span class="sa-n">Figures, charts and quotes below are as they were in this edition.</span></div>
    ${reason ? `<p class="px-5 pt-3 text-[12px] text-txt-3 leading-snug"><span class="prio ${level}"><i></i>${PRIO_LABEL[level]}</span> <span class="text-txt-4">—</span> ${reason}</p>` : ''}
    <div class="px-5 py-4">
      ${illus ? `<div class="illus-banner"><svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span><b style="color:#42474f">Illustrative example.</b> Figures, quotes and dates below show what this type of analysis looks like. They are placeholders, not RT ATYAF MALL survey data.</span></div>` : ''}
      ${body}
      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">Activity</p>
        <div class="locked" data-snap-readonly><span class="lk"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></span>
          <span>Past editions are read-only, apart from Follow. Comments, sharing, action plans and Copilot follow-ups belong to the insight itself, not to one edition, so they live on the latest version${fate==='current' ? '.' : ' — and this insight is not in the latest edition.'}</span></div>
        <div class="flex items-center gap-2" style="margin-top:10px">${fate==='held' ? '' : `<button class="btn-sec${followed[id]?' on':''}" data-snap-panel-follow onclick="snapFollow('${id}')">${followed[id] ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>`}${cta}</div>
      </div>
    </div>`;
}
function openSnapshot(id){
  snapOpenId = id;
  if(window.event && window.event.type==='click' && !openedIds.has(id)){ openedIds.add(id); setTimeout(renderEditionBar, 0); }
  document.getElementById('insights-split').classList.add('has-panel');
  document.querySelectorAll('.insight-card.active').forEach(c=>c.classList.remove('active'));
  document.querySelectorAll('#earlier-list .snap-card').forEach(c=>c.classList.toggle('active', c.dataset.snap===id));
  const panel = document.getElementById('investigate-panel');
  panel.innerHTML = snapshotPanelHTML(id);
  snapCutCharts(panel, id, EDITIONS.find(e=>e.id===viewingEdition) || EDITIONS[0]);
  panel.classList.remove('hidden');
  panel.scrollTop = 0;
}
function closeSnapshot(){
  snapOpenId = null;
  document.querySelectorAll('#earlier-list .snap-card').forEach(c=>c.classList.remove('active'));
  closeInvestigatePanel();
}
function viewEdition(id){
  viewingEdition = id; snapOpenId = null; allEditionsOpen = false;
  closeInvestigatePanel();          // the pane never carries an insight from one edition into another
  feedView = 'active';
  renderEditionBar(); applyFeedVisibility();
  if(id===CURRENT_EDITION){ ensureSelection(); return; }
  // like the feed, a past edition opens as a list; its drill-down opens when the user picks a card
}
function openFromEdition(id){
  viewEdition(CURRENT_EDITION);
  openInsightInFeed(id);
}
function renderCatchup(){
  const el = document.getElementById('catchup');
  if(!awayMode){ el.classList.add('hidden'); el.innerHTML=''; return; }
  el.classList.remove('hidden');
  const missed = EDITIONS.slice(1).filter(e=>['e13','e20'].includes(e.id)).reverse();
  el.innerHTML = `<div class="catchup" data-catchup>
    <div class="cu-head"><b>Welcome back</b><span>· you missed ${missed.length} editions since your last visit on ${LAST_VISIT}</span>
      <button class="cu-x" title="Dismiss" onclick="dismissCatchup()">×</button></div>
    <div class="ed-past" style="margin-top:8px">${missed.map(e=>`<button class="ed-chip" data-missed="${e.id}" onclick="viewEdition('${e.id}')">${e.short} edition</button>`).join('')}</div>
    <p class="cu-foot">You're on the latest edition. Anything from those weeks that is still true is below.</p></div>`;
}
function dismissCatchup(){ document.getElementById('catchup').classList.add('hidden'); }
// Journey scenarios swap the user's saved state: 'steady' is the returning user, 'first' is Day 0 (a clean slate),
// 'day50' is the capability in full use. Leaving a scenario puts the steady state back; changes made inside it are dropped.
let scenario = 'steady';
function scenarioSeed(name){
  const clone = o=>JSON.parse(JSON.stringify(o));
  if(name==='first') return {followed:{}, activity:{}, shared:[], done:[], dismissed:[], feedback:{}, plans:{}};
  // Day 50: insights are being followed, worked on and shared across the team
  const activity = clone(steadyState.activity), shared = clone(steadyState.shared);
  activity['INS-04'] = {status:'in-progress', events:[
    {type:'follow', by:'You', text:'started following this insight', date:'8 days ago'},
    {type:'plan', by:'You', text:'created an action plan', date:'6 days ago'},
    {type:'comment', by:'You', text:'Added a fitting-room reset to the weekend shift checklist. Checking the next two editions.', date:'6 days ago'}]};
  activity['FOL-01'] = {status:'open', events:[
    {type:'follow', by:'You', text:'started following this insight', date:'20 days ago'},
    {type:'comment', by:'You', text:'Added a third till on Saturdays from 12 Sep.', date:'17 days ago'}]};
  activity['FOL-02'] = {status:'open', events:[
    {type:'follow', by:'You', text:'started following this insight', date:'15 days ago'}]};
  activity['INS-02'] = {status:'in-progress', events:[
    {type:'follow', by:'You', text:'started following this insight', date:'21 days ago'},
    {type:'share', by:'Fatima Al-Rashid', text:'shared this with you', date:'2 days ago'},
    {type:'comment', by:'Fatima Al-Rashid', text:'Seeing the same thing at our store — worth a network-wide look?', date:'2 days ago'},
    {type:'comment', by:'You', text:"Agreed. I'll flag it to the Central team so we can check promo signage across stores.", date:'1 day ago'},
    {type:'plan', by:'You', text:'created an action plan', date:'1 day ago'}]};
  activity['INS-01'] = {status:'resolved', events:[
    {type:'follow', by:'You', text:'started following this insight', date:'28 days ago'},
    {type:'plan', by:'You', text:'created an action plan', date:'26 days ago'},
    {type:'share', by:'Anish', text:'shared this with you', date:'5 days ago'}]};
  activity['CTY-01'] = {status:'reviewed', events:[
    {type:'share', by:'Khalid Al-Mansour', text:'shared this with you', date:'1 day ago'},
    {type:'follow', by:'You', text:'started following this insight', date:'1 day ago'}]};
  activity['INS-03'] = {status:'open', events:[{type:'done', by:'You', text:'marked this done', date:'2 days ago'}]};
  shared.forEach(x=>{ if(x.insightId==='CTY-01' || x.insightId==='INS-02') x.unread = false; });
  shared.unshift({id:'sw5', insightId:'INS-06', insightTitle:INSIGHT_META['INS-06'].title, insightTag:'Staff helpfulness', from:'Omar Hassan', fromRole:'Area Manager — CRN region',
    note:'Good to see this. Can you share what your team does differently at the next area call?', date:'today', unread:true, reviewed:false});
  return {
    followed:{
      'INS-04':{daysAgo:8,  on:'Mon 21 Sep', atVal:'28%', updated:true, source:'feed', sharedBy:null, history:null, since:{from:'28%', delta:'+3 pts', dir:'up'}},
      'INS-02':{daysAgo:21, on:'Tue 8 Sep', updated:true, source:'feed', sharedBy:null, history:null},
      'FOL-02':{daysAgo:15, on:'Mon 14 Sep', atVal:'−1.3', updated:true, source:'feed', sharedBy:null, history:null, since:{from:'−1.3', delta:'+0.2', dir:'up'}},
      'CTY-01':{daysAgo:1,  on:'Mon 28 Sep', source:'shared', sharedBy:'Khalid Al-Mansour', history:null},
      'FOL-01':{daysAgo:20, on:'Wed 9 Sep', atVal:'7.4', source:'feed', sharedBy:null, history:null, since:{from:'7.4', delta:'+0.6', dir:'up'}},
      'INS-01':{daysAgo:28, on:'Tue 1 Sep', atVal:'9.63', since:{same:true}, source:'feed', sharedBy:null, history:[9.23,9.63]}},
    activity, shared, done:['INS-03'], dismissed:[], feedback:{'INS-01':{vote:'up', reasons:[], comment:''}},
    plans:{'INS-04':{status:'In progress', owner:'You'}, 'INS-02':{status:'Not started', owner:'You'}, 'INS-01':{status:'Completed', owner:'You'}}};
}
function setScenario(name){
  if(name === scenario) return;
  const clone = o=>JSON.parse(JSON.stringify(o));
  const clear = o=>Object.keys(o).forEach(k=>delete o[k]);
  if(scenario==='steady') steadyState = {followed:clone(followed), activity:insightActivity, shared:sharedWithMe, done:[...doneFeed], dismissed:[...dismissedFeed], feedback:clone(insightFeedback), plans:clone(actionPlans)};
  const st = name==='steady' ? steadyState : scenarioSeed(name);
  scenario = name; firstEditionMode = (name==='first');
  clear(followed); Object.assign(followed, st.followed);
  insightActivity = st.activity; sharedWithMe = st.shared;
  doneFeed.clear(); st.done.forEach(x=>doneFeed.add(x));
  dismissedFeed.clear(); st.dismissed.forEach(x=>dismissedFeed.add(x));
  clear(insightFeedback); Object.assign(insightFeedback, st.feedback);
  actionPlans = clone(st.plans || {});
  SUPPRESSED.forEach(x=>{ x.returning = false; });
  openedIds.clear(); backlogDismissed = false;
  ['followed','shared'].forEach(t=>{ tabSel[t] = null; tabPanelClosed[t] = true; });
  if(name==='steady') steadyState = null;
  closeInvestigatePanel();
  Object.keys(INSIGHT_META).forEach(syncFeedFollowButton);
  updateAllCardStatusPills(); updateFollowedBadge(); updateSharedBadge();
  renderFollowedTab(); renderSharedTab(); renderFeedbackSlots();
}
function setAway(on){
  awayMode = on;
  if(snapOpenId){ snapOpenId = null; closeInvestigatePanel(); }
  viewingEdition = CURRENT_EDITION;
  feedView = 'active';
  renderCatchup(); renderEditionBar(); renderFreshness(); renderEditionFoot(); applyFeedVisibility();
}
