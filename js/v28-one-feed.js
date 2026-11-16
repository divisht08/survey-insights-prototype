/* ═══ v28 (16 Nov, call with Pradeep and Divisht) — one feed with everything.
   1. Followed insights stay in My insights and also show under Followed (already the rule; kept).
   2. Insights shared with me show in My insights with the Shared-with-me card: who shared it, their note,
      then the insight. They sit under the date they were shared, as shares arrive on any day.
      Followed, Shared with me and Shared by me in the menu are quick views of the same feed.
   3. Share pop-up: User groups and Users as two sections, each a dropdown; quick picks below Users. ═══ */

/* ── dates: the prototype's today is Tue 29 Sep 2026, two days after the 27 Sep insights ── */
const V28_TODAY = new Date(2026, 8, 29);
const V28_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], V28_MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function v28Short(d){ return `${V28_DAYS[d.getDay()]} ${d.getDate()} ${V28_MON[d.getMonth()]}`; }
function v28ShareDate(s){
  const t = String(s.date||'').toLowerCase(), d = new Date(V28_TODAY);
  const m = t.match(/(\d+)\s*day/); const n = m ? +m[1] : (/yesterday/.test(t) ? 1 : 0);
  d.setDate(d.getDate() - n); return d;
}
function v28EdDate(e){ const p = String(e.date||'').split(' '); return new Date(+p[3], V28_MON.indexOf(p[2]), +p[1]); }

/* ── which shares appear in the feed ── */
function v28Shares(){
  if(typeof sharedWithMe==='undefined' || (typeof firstEditionMode!=='undefined' && firstEditionMode)) return [];
  return sharedWithMe.filter(s=>!s.dismissed);
}
function v28ShareOf(id){ return v28Shares().find(s=>s.insightId===id) || null; }

/* the same "from" header as the Shared with me card */
function v28FromHTML(s){
  const ini = s.from.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  return `<div class="ic-from" data-v28-from="${s.id}">
    <span class="ic-av">${ini}</span>
    <div class="ic-from-text">
      <p><b>${s.from}</b><span>${s.fromRole} · shared ${s.date}</span></p>
      ${s.note ? `<p class="ic-note">&ldquo;${s.note}&rdquo;</p>` : ''}
    </div></div>`;
}
/* a share of an insight that is not in my own feed (another store, the whole country) gets a feed card of its own */
function v28CardHTML(s){
  const id = s.insightId, p = cardParts(id), m = INSIGHT_META[id] || {};
  const prio = (PRIORITY[id] && PRIORITY[id].level) || 'med';
  return `<div class="insight-card ic spr-card v28-ext" data-id="${id}" data-type="${m.type||'recurring'}" data-priority="${prio}" onclick="if(!event.target.closest('button,a'))v28Open('${id}')">
    <div class="ic-body"><div class="ic-head"><div class="ic-kind" data-el="kind-row"><span class="ic-type" data-el="kind"><span data-el="kind-text">${kindText(id)}</span></span></div><div class="ic-tags" data-el="tags"></div></div>
      <div class="ic-main"><div class="ic-text"><p class="ic-title" data-el="title">${p.title}</p><p class="ic-sum" data-el="summary">${p.summary||''}</p></div>
        <div class="ic-stat" data-el="stat">${p.stat}</div></div></div>
    <div class="ic-foot"><p class="ic-basis" data-el="basis"></p><div class="ic-acts"><div class="flex items-center gap-1.5 act-live">
      <button class="btn-sec" onclick="event.stopPropagation();follow(this)">${FOLLOW_OFF_HTML}</button>
      <button class="btn-pri" onclick="event.stopPropagation();v28Open('${id}')">${STAR_ICON}Investigate</button></div></div></div></div>`;
}
function v28Sync(){
  const grid = document.getElementById('card-grid'); if(!grid) return;
  const shares = v28Shares(), byId = {};
  shares.forEach(s=>{ if(!byId[s.insightId]) byId[s.insightId] = s; });
  // cards made for outside shares that are no longer live go
  grid.querySelectorAll('.v28-ext').forEach(c=>{ if(!byId[c.dataset.id]) c.remove(); });
  // outside shares get a card; ones already in my feed get the header on their own card
  Object.values(byId).forEach(s=>{
    if(!grid.querySelector(`.insight-card[data-id="${s.insightId}"]`)){
      const t = document.createElement('template'); t.innerHTML = v28CardHTML(s).trim(); grid.appendChild(t.content.firstElementChild);
    }
  });
  grid.querySelectorAll('.insight-card').forEach(c=>{
    const s = c.classList.contains('v9-am') ? null : byId[c.dataset.id], cur = c.querySelector(':scope > [data-v28-from]');
    if(!s){ if(cur) cur.remove(); delete c.dataset.v28Share; c.classList.remove('v28-sh'); return; }
    c.dataset.v28Share = s.id; c.classList.add('v28-sh');
    const sig = [s.id, s.date, s.note].join('|');
    if(cur && cur.dataset.sig===sig) return;
    if(cur) cur.remove();
    c.insertAdjacentHTML('afterbegin', v28FromHTML(s));
    c.querySelector(':scope > [data-v28-from]').dataset.sig = sig;
  });
}

/* the shared-by pill is not needed when the card says who shared it */
const _v28Pills = v26PillsHTML;
v26PillsHTML = function(id, card, extra){ return _v28Pills(id, card, card && card.dataset && card.dataset.v28Share ? 'noshare' : extra); };
/* Hide shared also hides shares from outside my scope */
const _v28Match = v9Match;
v9Match = function(c){ if(typeof v26HideShared!=='undefined' && v26HideShared && c.dataset.v28Share) return false; return _v28Match.apply(this, arguments); };

/* ── feed: date groups by the day each card arrived (insights by update, shares by the day shared) ── */
function v28DateOf(c){
  const s = c.dataset.v28Share && sharedWithMe.find(x=>x.id===c.dataset.v28Share);
  if(s) return v28ShareDate(s);
  return v28EdDate(v7DateOf(c.dataset.id));
}
function v28Regroup(){
  const grid = document.getElementById('card-grid'); if(!grid || feedView!=='active' || (typeof v9Area!=='undefined' && v9Area)) return;
  const cards = [...grid.querySelectorAll('.insight-card')].filter(c=>c.style.display!=='none');
  if(!cards.length) return;
  grid.querySelectorAll('.v7-date').forEach(h=>h.remove());
  const cur = EDITIONS.find(e=>e.id===CURRENT_EDITION), curT = cur ? v28EdDate(cur).getTime() : 0;
  const quiet = typeof v8Quiet!=='undefined' && v8Quiet;
  cards.map(c=>({c, t:v28DateOf(c).getTime()}))
    .sort((a,b)=>b.t-a.t || (b.c.dataset.v28Share?1:0) - (a.c.dataset.v28Share?1:0) || (V7_RANK[a.c.dataset.priority]??4) - (V7_RANK[b.c.dataset.priority]??4))
    .forEach((x,i,arr)=>{
      if(i===0 || arr[i-1].t!==x.t){
        const n = arr.filter(y=>y.t===x.t).length, h = document.createElement('div');
        h.className = 'v7-date'; h.dataset.v7Date = 'd' + x.t;
        h.innerHTML = `<b>${v28Short(new Date(x.t))}</b>${x.t===curT && !quiet ? '<span class="lt">Latest update</span>' : ''}<span class="n">${n}</span>`;
        grid.appendChild(h);
      }
      grid.appendChild(x.c);
    });
  if(typeof v26Wording==='function') v26Wording();
}
/* after painting: no "Shared by" pill on a card that already says who shared it; an outside share is dated the day it was shared */
function v28Tidy(){
  document.querySelectorAll('#card-grid .v28-sh .v26-shared').forEach(e=>e.remove());
  document.querySelectorAll('#card-grid .v28-ext').forEach(c=>{
    const s = sharedWithMe.find(x=>x.id===c.dataset.v28Share), w = c.querySelector('.v9-when'); if(!s || !w) return;
    const d = v28ShareDate(s), t = `${d.getDate()} ${V28_MON[d.getMonth()]}`; if(w.textContent!==t) w.textContent = t;
  });
}
const _v28Vis = applyFeedVisibility;
applyFeedVisibility = function(){
  v28Sync();
  const r = _v28Vis.apply(this, arguments);
  v28Regroup(); v28Tidy();
  return r;
};

/* ── opening a shared card: it counts as read in Shared with me too ── */
function v28MarkRead(id){
  const s = v28ShareOf(id);
  if(s && s.unread){ s.unread = false; if(typeof updateSharedBadge==='function') updateSharedBadge(); if(typeof v26Counts==='function') v26Counts(); }
}
function v28Open(id){
  const s = v28ShareOf(id);
  if(s && typeof SHARED_VIEWS!=='undefined' && SHARED_VIEWS[s.id] && !document.querySelector(`#card-grid .insight-card:not(.v28-ext)[data-id="${id}"]`)){
    v28MarkRead(id);
    if(typeof openedIds!=='undefined') openedIds.add(id);
    if(typeof v7Read!=='undefined') v7Read.add(id);
    panelUserClosed = false;
    document.getElementById('insights-split').classList.add('has-panel');
    document.querySelectorAll('.insight-card').forEach(c=>c.classList.toggle('active', c.dataset.id===id));
    const panel = document.getElementById('investigate-panel');
    panel.innerHTML = sharedViewerHTML(s, 'feed').replace(/closeTabPanel\('feed'\)/g, 'closeInvestigatePanel(true)');
    panel.classList.remove('hidden'); panel.scrollTop = 0;
    applyFeedVisibility();
    return;
  }
  return _v28Open(id);
}
const _v28Open = openInvestigate;
openInvestigate = function(el){
  const id = typeof el==='string' ? el : (el && el.closest && el.closest('.insight-card') ? el.closest('.insight-card').dataset.id : null);
  if(id && document.querySelector(`#card-grid .v28-ext[data-id="${id}"]`)) return v28Open(id);
  if(id) v28MarkRead(id);
  return _v28Open.apply(this, arguments);
};

/* ── share pop-up: User groups, then Users with quick picks under it ── */
const V28_QUICK = ['Anish','Fatima Al-Rashid','Omar Hassan'];
const _v28ShRender = v26ShRender;
v26ShRender = function(){
  _v28ShRender.apply(this, arguments);
  const m = document.getElementById('v26-share'), s = v26Sh; if(!m || !s) return;
  const dds = m.querySelector('.v26-dds'), quick = dds && dds.nextElementSibling;
  if(!dds) return;
  const [g, u] = dds.querySelectorAll('.v26-dd');
  const gb = g.querySelector('.v26-dd-btn'), ub = u.querySelector('.v26-dd-btn');
  const nG = V26_GROUPS.filter(r=>s.to.indexOf(r[0])>-1).length, nU = V26_PEOPLE.filter(r=>s.to.indexOf(r[0])>-1).length;
  gb.firstChild.textContent = nG ? `${nG} selected` : 'Select user groups';
  ub.firstChild.textContent = nU ? `${nU} selected` : 'Select users';
  const qp = V28_QUICK.map(n=>`<button class="v26-qp${s.to.indexOf(n)>-1?' on':''}" onclick="v26ShToggle('${v26E(n)}')">${s.to.indexOf(n)>-1?'✓ ':''}${v26E(n)}</button>`).join('');
  const lbl = m.querySelector('.v26-sh-lbl');   // "Send to"
  const sec = document.createElement('div'); sec.className = 'v28-sh-secs';
  sec.innerHTML = `<p class="v26-sh-lbl">User groups</p><div class="v28-dd-g"></div>
    <p class="v26-sh-lbl">Users</p><div class="v28-dd-u"></div>
    <div class="v26-quick v28-quick"><span>Often shared with</span>${qp}</div>`;
  sec.querySelector('.v28-dd-g').appendChild(g); sec.querySelector('.v28-dd-u').appendChild(u);
  dds.replaceWith(sec);
  if(quick && quick.classList.contains('v26-quick')) quick.remove();
  if(lbl && lbl.textContent==='Send to') lbl.remove();
  const q = m.querySelector('.v26-dd-q'); if(q) q.placeholder = 'Search users';
};

/* ── the same card everywhere: Followed and Shared with me cards get the feed's footer
   (activity icons on the left, Following only when followed, Investigate) and the feed card's priority colour ── */
function v28PaintTabs(){
  document.querySelectorAll('#followed-list .fol-card, #shared-list .shr-card').forEach(c=>{
    const id = c.dataset.folId || (sharedWithMe.find(x=>x.id===c.dataset.shareCard) || {}).insightId; if(!id) return;
    const twin = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
    if(twin){
      if(twin.dataset.priority && c.dataset.priority!==twin.dataset.priority) c.dataset.priority = twin.dataset.priority;
      // the body is the feed card's own: same pills, title, summary and figure
      const tb = twin.querySelector(':scope > .ic-body'), cb = c.querySelector(':scope > .ic-body');
      if(tb && cb && cb.dataset.v28Src!==tb.innerHTML.length+''){ const n = tb.cloneNode(true); n.dataset.v28Src = tb.innerHTML.length+''; n.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id')); cb.replaceWith(n); }
      // who shared it, as on the feed card
      const tf = twin.querySelector(':scope > [data-v28-from]');
      if(c.classList.contains('fol-card')){ const cf = c.querySelector(':scope > [data-v28-from]'); if(cf && !tf) cf.remove(); if(tf && !cf) c.insertAdjacentElement('afterbegin', tf.cloneNode(true)); }
      c.classList.toggle('v7-unread', twin.classList.contains('v7-unread'));
    }
    const foot = c.querySelector('.ic-foot'); if(!foot) return;
    if(!foot.querySelector('[data-v7-act]')) foot.insertAdjacentHTML('afterbegin', v7Activity(id));
  });
}
let v28Raf = 0;
['followed-list','shared-list'].forEach(k=>{ const el = document.getElementById(k); if(el) new MutationObserver(()=>{ if(v28Raf) return; v28Raf = requestAnimationFrame(()=>{ v28Raf = 0; v28PaintTabs(); }); }).observe(el, {childList:true, subtree:true}); });
if(typeof v26Cards==='function'){ const _v28C = v26Cards; v26Cards = function(){ const r = _v28C.apply(this, arguments); v28Tidy(); return r; }; }
applyFeedVisibility();
