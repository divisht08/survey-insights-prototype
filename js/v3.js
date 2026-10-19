/* ═══ v3 — manager review (16 Oct) + customer validation (Bosch, Redtag, ID.me) ═══
   Cards are for triage, the drill-down is where work happens. */
const V3_SVG = {
  x:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg>',
  spark:'<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 5.6L19.5 9.5l-5.7 1.9L12 17l-1.8-5.6L4.5 9.5l5.7-1.9z"/><path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z"/></svg>',
  pop:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M14 4h6v6M20 4l-8 8M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4"/></svg>',
  full:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  person:'<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"/></svg>',
  agent:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 3h6M12 3v3m-6 4a6 6 0 0112 0v5a3 3 0 01-3 3H9a3 3 0 01-3-3v-5zm3 2h.01M15 12h.01M9 21h6"/></svg>',
  bin:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>',
  plan:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>'
};
const v3esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function v3Modal(title, body, foot){
  let m = document.getElementById('v3-modal');
  if(!m){ m = document.createElement('div'); m.id = 'v3-modal'; m.onclick = e=>{ if(e.target===m) v3CloseModal(); }; document.body.appendChild(m); }
  m.innerHTML = `<div class="mb"><div class="mh"><b style="font-size:15px;flex:1">${title}</b><button class="iconbtn" data-v3-close onclick="v3CloseModal()">${V3_SVG.x}</button></div><div class="mc">${body}</div>${foot ? `<div class="mf">${foot}</div>` : ''}</div>`;
  m.classList.add('show');
}
function v3CloseModal(){ const m = document.getElementById('v3-modal'); if(m) m.classList.remove('show'); }

shareContacts.push({name:'Central team', role:'Central operations', access:'full', accessLabel:'All stores'});
/* ── 1. Follow keeps the card in the feed; Followed is a view, not a place cards move to ── */
feedStateOf = function(id){
  if(retiredFeed.has(id)) return 'earlier';
  if(dismissedFeed.has(id)) return 'dismissed';
  if(doneFeed.has(id)) return 'done';
  return 'active';
};
follow = function(btn){
  const id = btn.closest('.insight-card').getAttribute('data-id');
  if(followed[id]){ removeFromFollowed(id); toast('Unfollowed'); return; }
  addToFollowed(id, {source:'feed'});
  toast('Following — it stays here and is also in Followed');
};
function v3FollowToggle(id){
  if(followed[id]){ removeFromFollowed(id); toast('Unfollowed'); }
  else { addToFollowed(id, {source:'feed'}); toast('Following — it stays in your feed and is also in Followed'); }
}

/* ── 2. One negative action: Dismiss, with a reason. Thumbs are gone; follows, shares and plans are the positive signal ── */
feedbackHTML = function(){ return ''; };
const V3_REASONS = [
  ['irrelevant','Not relevant to me','It won\'t be shown to you again'],
  ['known','Already knew this','We\'ll favour newer findings'],
  ['wrong','Looks wrong','Sent to the team to check'],
  ['design','Expected by design','Insights like this stay hidden unless they change materially'],
  ['handled','Already handled','Closed, with nothing more to do']
];
function v3DismissMenu(ev, id){
  ev.stopPropagation();
  let m = document.getElementById('v3-dm');
  if(!m){ m = document.createElement('div'); m.id = 'v3-dm'; document.body.appendChild(m); }
  m.innerHTML = `<p>Why are you dismissing this?</p>` + V3_REASONS.map(([k,l,s])=>`<button class="r" data-v3-reason="${k}" onclick="v3Dismiss('${id}','${k}')"><span>${l}</span><small>${s}</small></button>`).join('');
  m.style.display = 'block';
  const r = ev.currentTarget.getBoundingClientRect(), h = m.offsetHeight;
  m.style.top = ((r.bottom + 6 + h > innerHeight) ? Math.max(8, r.top - h - 6) : r.bottom + 6) + 'px';
  m.style.left = Math.max(8, Math.min(innerWidth - 300, r.right - 280)) + 'px';
}
function v3CloseDm(){ const m = document.getElementById('v3-dm'); if(m) m.style.display = 'none'; }
document.addEventListener('click', e=>{ if(!e.target.closest('#v3-dm')) v3CloseDm(); if(!e.target.closest('#v3-scope-menu') && !e.target.closest('[data-scope-pill]')) v3CloseScope(); });
function v3Dismiss(id, reason){
  v3CloseDm();
  insightFeedback[id] = {vote:'down', reasons:[reason], comment:''};
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  const label = (V3_REASONS.find(r=>r[0]===reason)||[])[1] || '';
  insightActivity[id].events.push({type:'done', by:'You', text:'dismissed this — ' + label.toLowerCase(), date:'just now'});
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  if(card && card.classList.contains('active')) closeInvestigatePanel();
  dismissedFeed.add(id);
  applyFeedVisibility();
  toastAction(reason==='design' ? 'Dismissed — insights like this stay hidden unless they change materially' : 'Dismissed — find it under Dismissed', 'Undo', ()=>{
    dismissedFeed.delete(id); delete insightFeedback[id];
    const ev = insightActivity[id].events; if(ev.length && /^dismissed this/.test(ev[ev.length-1].text)) ev.pop();
    applyFeedVisibility();
  });
}
reopenInsight = function(id){
  doneFeed.delete(id); dismissedFeed.delete(id);
  if(insightActivity[id]) insightActivity[id].events.push({type:'done', by:'You', text:'restored this insight', date:'just now'});
  applyFeedVisibility(); refreshInvestigatePanel(id);
  toast('Restored to your feed');
};

/* ── 3. Feed: sections by what the insight asks of you, type as filter chips, Dismissed in the left nav ── */
const V3_SECS = [['high','Needs attention','#c5221f'],['med','Worth a look','#d9900f'],['pos','Bright spots','#0e8a5f'],['low','Good to know','#b8bec8']];
const V3_TYPES = [['all','All'],['change','Changes',['comparison','trend','segment','seasonal']],['driver','Drivers',['driver']],['theme','Themes',['recurring','emerging']],['anomaly','Anomalies',['anomaly']]];
var v3Type = 'all';
function v3TypeOf(card){ const t = card.dataset.type; const g = V3_TYPES.find(x=>x[2] && x[2].includes(t)); return g ? g[0] : 'other'; }
const _v3Apply = applyFeedVisibility;
applyFeedVisibility = function(){
  _v3Apply();
  const grid = document.getElementById('card-grid'); if(!grid) return;
  const past = typeof viewingEdition!=='undefined' && viewingEdition!==CURRENT_EDITION;
  const cards = [...grid.querySelectorAll('.insight-card')];
  // the bin: dismissed and done insights together
  if(feedView==='closed' && !past){
    cards.forEach(c=>{ const st = c.dataset.state; c.style.display = (st==='done'||st==='dismissed') ? '' : 'none'; });
  }
  // type filter applies to the active feed only
  const typeCounts = {};
  cards.forEach(c=>{ if(c.dataset.state==='active'){ const t = v3TypeOf(c); typeCounts[t] = (typeCounts[t]||0) + 1; } });
  if(feedView==='active' && v3Type!=='all') cards.forEach(c=>{ if(c.style.display!=='none' && v3TypeOf(c)!==v3Type) c.style.display = 'none'; });
  // sections
  grid.querySelectorAll('.v3-sec').forEach(s=>s.remove());
  if(feedView==='active' && !past){
    V3_SECS.forEach(([lvl,label,col])=>{
      const inSec = cards.filter(c=>c.dataset.priority===lvl);
      const vis = inSec.filter(c=>c.style.display!=='none');
      if(!vis.length) return;
      const h = document.createElement('div'); h.className = 'v3-sec'; h.dataset.sec = lvl;
      h.innerHTML = `<i style="background:${col}"></i>${label}<span class="n">${vis.length}</span>`;
      grid.appendChild(h); inSec.forEach(c=>grid.appendChild(c));
    });
    cards.filter(c=>!V3_SECS.some(s=>s[0]===c.dataset.priority)).forEach(c=>grid.appendChild(c));
  }
  // chips row: insight types (replaces the Active / Done tabs)
  const chips = document.getElementById('feed-state-chips');
  if(chips){
    if(feedView==='closed'){ chips.innerHTML = `<button class="v3-chip" onclick="v3OpenFeed()">← Back to feed</button>`; }
    else {
      const total = cards.filter(c=>c.dataset.state==='active').length;
      chips.innerHTML = `<div class="v3-chips" data-v3-types>${V3_TYPES.filter(t=>t[0]==='all'||typeCounts[t[0]]).map(t=>`<button class="v3-chip${v3Type===t[0]?' on':''}" data-v3-type="${t[0]}" onclick="v3SetType('${t[0]}')">${t[1]}<span class="n">${t[0]==='all'?total:typeCounts[t[0]]}</span></button>`).join('')}</div>`;
    }
  }
  const label = document.getElementById('feed-count-label');
  const vis = cards.filter(c=>c.style.display!=='none');
  if(label && !past){
    if(feedView==='closed') label.textContent = vis.length + ' dismissed or done ' + (vis.length===1?'insight':'insights');
    else if(feedView==='active'){ const n = vis.filter(c=>c.dataset.priority==='high').length;
      label.innerHTML = vis.length + (vis.length===1?' insight':' insights') + (n ? ` <span style="color:#c5221f;font-weight:600">· ${n} need${n===1?'s':''} attention</span>` : ''); }
  }
  const empty = document.getElementById('feed-empty');
  if(empty && !past && feedView==='closed'){
    empty.classList.toggle('hidden', vis.length>0);
    document.getElementById('feed-empty-title').textContent = 'Nothing dismissed or done';
    document.getElementById('feed-empty-sub').textContent = 'Insights you dismiss, or mark done after following, are kept here so nothing is lost by accident.';
  }
  const dn = document.getElementById('v3-bin-n'); if(dn){ const n = doneFeed.size + dismissedFeed.size; dn.textContent = n || ''; }
  document.querySelectorAll('#si-subnav .sn-i').forEach(b=>{
    if(b.id==='seg-insights') b.classList.toggle('active', !document.getElementById('view-insights').classList.contains('hidden') && feedView!=='closed');
    if(b.id==='v3-nav-bin') b.classList.toggle('active', !document.getElementById('view-insights').classList.contains('hidden') && feedView==='closed');
  });
  v3DecorateCards();
};
function v3SetType(t){ v3Type = t; applyFeedVisibility(); }
function v3OpenBin(){ if(v3Scope!=='store') v3SetScope('store', true); segNav('insights'); feedView = 'closed'; closeInvestigatePanel(); applyFeedVisibility(); const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Dismissed & done'; }
function v3OpenFeed(){ feedView = 'active'; applyFeedVisibility(); const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Feed'; }
// the hover X on each card: Dismiss with a reason
function v3DecorateCards(){
  document.querySelectorAll('#card-grid .insight-card').forEach(c=>{
    if(c.querySelector('.v3-x')) return;
    const head = c.querySelector('.ic-head'); if(!head) return;
    const b = document.createElement('button'); b.className = 'v3-x'; b.title = 'Dismiss'; b.dataset.v3Dismiss = c.dataset.id;
    b.innerHTML = V3_SVG.x; b.setAttribute('onclick', `v3DismissMenu(event,'${c.dataset.id}')`);
    head.appendChild(b);
  });
}

/* ── 4. Editions stay as the engine; the UI shows when it was updated, with past updates behind one link ── */
var v3ShowEds = false;
const _v3EdBar = renderEditionBar;
renderEditionBar = function(){
  _v3EdBar();
  const el = document.getElementById('edition-bar'); if(!el) return;
  const past = viewingEdition!==CURRENT_EDITION;
  if(past || firstEditionMode) return;
  const sch = EDITION_SCHEDULE[editionFreq], nextShort = (pendingFreq ? EDITION_SCHEDULE[pendingFreq].next : sch.next).split(',')[0];
  if(v3ShowEds){
    el.insertAdjacentHTML('afterbegin', `<div style="text-align:right;margin-bottom:4px"><button class="v3-seeall" style="margin:0" onclick="v3ShowEds=false;renderEditionBar()">Hide past updates</button></div>`);
    return;
  }
  el.innerHTML = `<div class="v3-upd" data-edition-bar data-v3-upd style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:#5f6672;margin:0 0 10px">
      <span data-edition-tag>Updated <b style="color:#1f2329">${EDITIONS[0].short}</b> · next update ${nextShort}</span>
      <button class="v3-seeall" style="margin:0" data-v3-past onclick="event.stopPropagation();v3ShowEds=true;renderEditionBar()">Past updates</button></div>
    ${pendingFreq ? `<div class="ed-pending" data-pending>Switching to ${pendingFreq.toLowerCase()} updates from ${EDITION_SCHEDULE[pendingFreq].next}. This update stays as it is until then.</div>` : ''}`;
};
const _v3ViewEd = viewEdition;
viewEdition = function(id){ if(id===CURRENT_EDITION) v3ShowEds = false; _v3ViewEd(id); };

/* ── 5. Drill-down: focus, clear sections, CTAs on next steps, Copilot pinned at the bottom ── */
const V3_HL = {
  'INS-05':['declined','wasn’t working','wasn&rsquo;t working','card machine kept failing','payment never reached'],
  'INS-04':['messy','dirty','no clean fitting room'],
  'INS-02':['offers are misleading','misleading','only on certain items','discount applies on a future purchase','fake offers'],
  'INS-03':['less the price','discount can be more understandable','Affordable','affordable','suitable price'],
  'INS-01':['welcoming','smiling','perfect servivce','respectful','options in homewear are good','friendly'],
  'INS-06':['helped me find every size','greeted us at the door','patient','checked the stock room'],
  'CTY-01':[]
};
const V3_POS_IDS = ['INS-01','INS-06'];
function v3Highlight(html, id){
  (V3_HL[id]||[]).forEach(k=>{ if(!k) return; const i = html.indexOf(k); if(i>-1) html = html.slice(0,i) + '<mark class="v3-hl">' + k + '</mark>' + html.slice(i + k.length); });
  return html;
}
function v3Sentiment(id, theme){
  if(/positive|helpful|friendly|respectful|product choice|value \/ product quality|team friendliness/i.test(theme)) return 'pos';
  if(V3_POS_IDS.includes(id)) return 'pos';
  if(/mixed/i.test(theme)) return 'neu';
  return 'neg';
}
function v3Voice(sect, id){
  const quotes = [...sect.querySelectorAll('.rounded-md.p-2\\.5')];
  quotes.forEach(q=>{
    const ps = [...q.querySelectorAll('p')]; if(!ps.length) return;
    const meta = ps[ps.length-1], mt = meta.textContent;
    const theme = (mt.split('Theme:')[1] || '').trim(), period = (mt.match(/Period:\s*([^·]+)/)||[])[1] || '';
    const s = v3Sentiment(id, theme), sl = s==='pos' ? 'Positive' : s==='neg' ? 'Negative' : 'Mixed';
    ps.slice(0,-1).forEach(p=>{ p.innerHTML = v3Highlight(p.innerHTML, id); });
    meta.remove();
    const inner = q.innerHTML;
    q.classList.add('v3-q', s);
    q.innerHTML = `<span class="av ${s}">${V3_SVG.person}</span><div class="qb"><div class="qm"><b>Respondent</b><span>· ${v3esc(period.trim())} period</span><span class="v3-sent ${s}">${sl}</span><span>· ${v3esc(theme)}</span></div>${inner}</div>`;
  });
  if(quotes.length){
    const b = document.createElement('button'); b.className = 'v3-seeall'; b.dataset.v3SeeAll = id;
    b.setAttribute('onclick', `v3SeeAll('${id}')`); b.textContent = 'See all matching comments →';
    sect.appendChild(b);
  }
}
function v3SeeAll(id){
  const panel = document.querySelector('.v3d[data-v3-id="'+id+'"]');
  const qs = panel ? [...panel.querySelectorAll('.v3-q')] : [];
  const title = (document.querySelector('.insight-card[data-id="'+id+'"] [data-el="title"]')||{}).textContent || 'This insight';
  v3Modal('Comments behind this insight', `<p class="v3-note" style="margin-bottom:10px">${v3esc(title)} · the comments matched to this finding, newest first. Customer names are never shown.</p>
    <div class="v3-chips" style="margin-bottom:10px"><button class="v3-chip on">All ${qs.length}</button><button class="v3-chip">Negative ${qs.filter(q=>q.classList.contains('neg')).length}</button><button class="v3-chip">Positive ${qs.filter(q=>q.classList.contains('pos')).length}</button></div>
    <div class="space-y-2" data-v3-allq>${qs.map(q=>`<div class="${q.className} rounded-md p-2.5">${q.innerHTML}</div>`).join('')}</div>`,
    `<button class="btn-sec" onclick="v3CloseModal();segNav('resp')">Open in Response Analytics</button><button class="btn-pri" onclick="v3CloseModal()">Done</button>`);
}
const V3_NEG = id=>!V3_POS_IDS.includes(id);
function v3NextSteps(sect, id){
  sect.querySelectorAll('.id-means').forEach(m=>{
    const lbl = ((m.querySelector('b')||{}).textContent || '').toLowerCase();
    const host = m.querySelector('div'); if(!host) return;
    let btn;
    if(lbl.includes('area manager') && !lbl.includes('central')) btn = `<button class="btn-sec" data-v3-cta="share-am" onclick="openShareModal('${id}');v3Prefill('Omar Hassan')">Share with Area Manager</button>`;
    else if(lbl.includes('central')) btn = `<button class="btn-sec" data-v3-cta="share-central" onclick="openShareModal('${id}');v3Prefill('Central team')">Share with Central team</button>`;
    else btn = actionPlans[id] ? `<button class="btn-sec" data-v3-cta="plan" onclick="openActionPlan('${id}')">Open action plan</button>` : `<button class="btn-sec" data-v3-cta="plan" onclick="openActionPlan('${id}')">Add to action plan</button>`;
    host.insertAdjacentHTML('beforeend', `<div class="v3-cta">${btn}</div>`);
  });
  sect.insertAdjacentHTML('beforeend', `<p class="eyebrow" style="margin:14px 0 2px">Let an agent do it</p>
    <div class="v3-agent" data-v3-agent="review"><span class="ai">${V3_SVG.agent}</span><div class="at"><b>Review pack agent</b> · drafts a one-page summary of this insight for your next store review.</div><button class="btn-sec" style="padding:5px 11px;font-size:12px" onclick="v3Agent('review','${id}')">Draft it</button></div>
    ${V3_NEG(id) ? `<div class="v3-agent" data-v3-agent="followup"><span class="ai">${V3_SVG.agent}</span><div class="at"><b>Detractor follow-up agent</b> · lists the respondents behind this insight who agreed to be contacted, and creates follow-up tasks.</div><button class="btn-sec" style="padding:5px 11px;font-size:12px" onclick="v3Agent('followup','${id}')">Find respondents</button></div>` : ''}
    <p class="v3-note" style="margin-top:7px">Agents prepare drafts and tasks. Nothing is sent until you approve it.</p>`);
}
function v3Prefill(who){
  setTimeout(()=>{ const row = [...document.querySelectorAll('#share-contacts [data-contact]')].find(r=>(r.querySelector('p')||{}).textContent===who); if(row && !row.querySelector('.chk.sel') && typeof toggleShareContact==='function') toggleShareContact(row); }, 30);
}
function v3Agent(kind, id){
  const card = document.querySelector('.insight-card[data-id="'+id+'"]') || document.querySelector('.v3-card[data-v3-card="'+id+'"]');
  const title = card ? (card.querySelector('[data-el="title"], .ic-title')||{}).textContent : 'This insight';
  const sum = card ? (card.querySelector('[data-el="summary"], .ic-sum')||{}).textContent : '';
  const basis = card ? (card.querySelector('[data-el="basis"], .ic-basis')||{}).textContent : '';
  const nextStep = ((document.querySelector('.v3d[data-v3-id="'+id+'"] .id-means div')||{}).textContent || '').replace(/Add to action plan|Open action plan|Share with.*$/,'').trim();
  if(kind==='review'){
    v3Modal('Review pack agent · draft', `<span class="illus" style="display:inline-flex;margin-bottom:10px">Illustrative draft</span>
      <div class="v3-draft" data-v3-draft><h4>${v3esc(title)}</h4><p>${v3esc(sum)}</p>
        <ul><li><b>Scope:</b> ${v3esc(basis.replace(/ · New this edition| · In \d+ editions in a row/,''))}</li><li><b>Proposed step:</b> ${v3esc(nextStep || 'agree an owner and a date to re-check this in the next update.')}</li><li><b>Check next update:</b> whether the figure has moved.</li></ul></div>
      <p class="v3-note" style="margin-top:10px">Built only from this insight's evidence. Edit it, then share it or add it to your review deck.</p>`,
      `<button class="btn-sec" onclick="v3CloseModal()">Discard</button><button class="btn-sec" onclick="v3CloseModal();toast('Added to your review deck')">Add to review deck</button><button class="btn-pri" onclick="v3CloseModal();openShareModal('${id}')">Share…</button>`);
  } else {
    v3Modal('Detractor follow-up agent', `<span class="illus" style="display:inline-flex;margin-bottom:10px">Illustrative</span>
      <p style="font-size:13.5px;margin-bottom:10px"><b>7 respondents</b> linked to this insight scored 6 or below and agreed to be contacted.</p>
      <table class="v3-tbl"><thead><tr><th>Respondent</th><th>Score</th><th>Visited</th><th>Said</th></tr></thead><tbody>
        <tr><td>Respondent 1</td><td class="bad">3</td><td>14 Sep</td><td>Card declined twice at the till</td></tr>
        <tr><td>Respondent 2</td><td class="bad">4</td><td>14 Sep</td><td>Had to leave the items</td></tr>
        <tr><td>Respondent 3</td><td class="bad">5</td><td>15 Sep</td><td>Waited ten minutes at checkout</td></tr>
        <tr><td colspan="4" class="v3-note">+ 4 more</td></tr></tbody></table>
      <p class="v3-note" style="margin-top:10px">Only respondents who agreed to be contacted are listed. A comment matching the theme doesn't prove that person had the problem, so each follow-up starts with a question, not an offer.</p>`,
      `<button class="btn-sec" onclick="v3CloseModal()">Cancel</button><button class="btn-pri" onclick="v3CloseModal();toast('7 follow-up tasks created for your team')">Create 7 follow-up tasks</button>`);
  }
}
function v3Full(btn){
  const split = btn.closest('#insights-split, .tab-split'); if(!split) return;
  split.classList.toggle('v3-fullpage');
  btn.title = split.classList.contains('v3-fullpage') ? 'Back to the list' : 'Open full page';
}
function v3Dock(id){
  const d = document.getElementById('v3-dock-'+id);
  if(d && (copilotLog[id]||[]).length) d.classList.add('big');
}
function v3TogglePop(id){ const d = document.getElementById('v3-dock-'+id); if(d){ d.classList.toggle('pop'); if(d.classList.contains('pop')) d.classList.add('big'); } }
function v3ToggleBig(id){ const d = document.getElementById('v3-dock-'+id); if(d) d.classList.toggle('big'); }
const _v3Ask = askCopilot;
askCopilot = function(id, preset){ _v3Ask(id, preset); const d = document.getElementById('v3-dock-'+id); if(d){ d.classList.add('big'); const t = d.querySelector('.dthread'); if(t) t.scrollTop = t.scrollHeight; } };

function v3Drill(html, id){
  const t = document.createElement('template'); t.innerHTML = html;
  const f = t.content;
  const nodes = [...f.children];
  const head = nodes[0], actRow = nodes[1];
  // header: full-page and close
  const close = head && head.querySelector('[data-close-panel]');
  if(close){
    const wrap = document.createElement('div'); wrap.className = 'v3-hd-btns';
    wrap.innerHTML = `<button class="iconbtn" title="Open full page" data-v3-full onclick="v3Full(this)">${V3_SVG.full}</button>`;
    close.parentNode.insertBefore(wrap, close); wrap.appendChild(close);
  }
  // actions: Follow · Share · Action plan · (right) Dismiss or Mark as done
  if(actRow && actRow.querySelector('button')){
    const isDone = doneFeed.has(id) || dismissedFeed.has(id);
    const share = [...actRow.children].find(b=>/Share this insight/.test(b.textContent));
    const plan = actRow.querySelector('[data-panel-plan]') || actRow.querySelector('.plan-chip, [data-plan-chip]') || [...actRow.children].find(b=>/plan/i.test(b.textContent) && b!==share);
    const doneBtn = actRow.querySelector('[data-panel-done]'), reopen = actRow.querySelector('[data-panel-reopen]');
    actRow.innerHTML = '';
    actRow.classList.add('v3-acts');
    if(!isDone) actRow.insertAdjacentHTML('beforeend', `<button class="btn-sec${followed[id]?' on':''}" data-v3-follow="${id}" onclick="v3FollowToggle('${id}')">${followed[id] ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>`);
    if(share){ share.innerHTML = share.innerHTML.replace('Share this insight','Share'); actRow.appendChild(share); }
    if(plan) actRow.appendChild(plan);
    actRow.insertAdjacentHTML('beforeend', '<span class="sp"></span>');
    if(isDone){ actRow.insertAdjacentHTML('beforeend', `<button class="btn-sec" data-panel-reopen onclick="reopenInsight('${id}')">Restore to feed</button>`); }
    else if(followed[id] && doneBtn) actRow.appendChild(doneBtn);
    else actRow.insertAdjacentHTML('beforeend', `<button class="btn-sec" data-v3-dismiss-panel="${id}" onclick="v3DismissMenu(event,'${id}')">${V3_SVG.x}Dismiss</button>`);
  }
  // body
  const prioP = nodes.find(n=>n.tagName==='P' && n.querySelector('.prio'));
  const body = nodes.find(n=>n!==head && n.classList && n.classList.contains('py-4') && !n.querySelector('[data-close-panel]'));
  const oldBar = nodes.find(n=>n.classList && n.classList.contains('sticky'));
  if(oldBar) oldBar.remove();
  if(body){
    body.classList.add('v3d'); body.dataset.v3Id = id;
    const lede = body.querySelector(':scope > .id-lede');
    const sum = document.createElement('div'); sum.className = 'v3-sum'; sum.dataset.v3Summary = '1';
    sum.innerHTML = `<p class="eyebrow" style="margin-bottom:4px">Summary</p>`;
    if(prioP){ prioP.className = 'text-[12px] text-txt-3 leading-snug'; sum.appendChild(prioP); }
    if(lede) sum.appendChild(lede);
    body.insertBefore(sum, body.firstChild);
    // since-followed details: collapsed
    const since = body.querySelector('[data-since], .since-box, [data-since-followed]');
    if(since){ const d = document.createElement('details'); d.className = 'v3-col v3-box'; d.dataset.v3Since = '1'; d.innerHTML = '<summary>Since you followed · how the figure moved</summary>'; since.parentNode.insertBefore(d, since); d.appendChild(since); since.classList.remove('id-sect'); const e = since.querySelector(':scope > .eyebrow'); if(e) e.remove(); }
    body.querySelectorAll('.id-sect').forEach(s=>{
      const eb = s.querySelector(':scope > .eyebrow'); const name = eb ? eb.textContent.trim() : '';
      if(name==='Evidence limitations'){
        const d = document.createElement('details'); d.className = 'id-sect v3-col'; d.dataset.v3Limits = '1';
        eb.remove(); d.innerHTML = '<summary>Evidence limitations</summary>'; while(s.firstChild) d.appendChild(s.firstChild);
        s.replaceWith(d);
      } else if(name==='Customer voice') v3Voice(s, id);
      else if(name==='Suggested next steps'){ eb.textContent = 'Next steps'; v3NextSteps(s, id); }
      else if(name==='Activity'){ eb.textContent = 'Activity and comments';
        eb.insertAdjacentHTML('afterend', `<p class="v3-cmnote" data-v3-comment-note>Comments are visible to everyone with access to this store's insights. Sharing only notifies someone.</p>`);
        const inp = s.querySelector('input[id^="comment-input-"]'); if(inp) inp.placeholder = 'Add a comment…'; }
    });
    // grounding moves below the sections, collapsed (already a details element)
    // old inline Copilot block → the pinned dock
    const cp = [...body.children].find(n=>n.querySelector && n.querySelector('[id^="copilot-thread-"]'));
    if(cp) cp.remove();
    const log = (copilotLog[id]||[]).length;
    const dock = document.createElement('div');
    dock.className = 'v3-dock' + (log ? ' big' : ''); dock.id = 'v3-dock-'+id; dock.dataset.v3Dock = id;
    dock.innerHTML = `<div class="dh"><b><span style="color:#5b3fd1">${V3_SVG.spark}</span>Copilot</b><span class="v3-note">Answers from this insight's evidence</span><span class="sp"></span>
        <button class="iconbtn" title="Expand or collapse" onclick="v3ToggleBig('${id}')"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg></button>
        <button class="iconbtn" title="Pop out" data-v3-pop onclick="v3TogglePop('${id}')">${V3_SVG.pop}</button></div>
      <div class="dthread"><div id="copilot-thread-${id}" class="space-y-2">${copilotThreadHTML(id)}</div></div>
      ${suggestedQuestionsHTML(id)}
      <div class="flex items-center gap-2"><input id="copilot-input-${id}" class="flex-1 text-[13px] border border-line rounded-md px-3 h-9 focus:outline-none focus:border-spr-blue" placeholder="Ask Copilot about this insight…" onkeydown="if(event.key==='Enter')askCopilot('${id}')"><button class="btn-pri" onclick="askCopilot('${id}')">Send</button></div>`;
    f.appendChild(dock);
  }
  const out = document.createElement('div'); out.appendChild(f);
  return out.innerHTML;
}
const _v3Inv = investigateHTML;
investigateHTML = function(srcBtn){
  const card = srcBtn ? srcBtn.closest('.insight-card') : null;
  const id = card ? card.getAttribute('data-id') : null;
  return v3Drill(_v3Inv(srcBtn), id);
};

/* ── 6. Scope: one store, an area of stores, or all my surveys. Insights differ by level, not just by filter ── */
var v3Scope = 'store';
// The switcher picks the survey. Each survey has its own feed; Followed and Shared work across all of them.
const V3_SCOPES = {
  store:{label:'Store experience survey', sub:'RT ATYAF MALL · in-store visits'},
  online:{label:'Online experience survey', sub:'Website and app orders'},
  returns:{label:'Returns & exchanges survey', sub:'After a return or exchange'},
  care:{label:'Customer care survey', sub:'After a contact-centre call'}
};
function v3OpenScope(ev){
  ev.stopPropagation();
  let m = document.getElementById('v3-scope-menu');
  if(!m){ m = document.createElement('div'); m.id = 'v3-scope-menu'; document.body.appendChild(m); }
  m.innerHTML = `<p class="eyebrow" style="padding:6px 10px 4px">Survey</p>` + Object.entries(V3_SCOPES).map(([k,s])=>`<button class="${v3Scope===k?'on':''}" data-v3-scope="${k}" onclick="v3SetScope('${k}')"><span>${s.label}</span><small>${s.sub}</small></button>`).join('');
  const r = ev.currentTarget.getBoundingClientRect();
  m.style.display = 'block'; m.style.top = (r.bottom + 6) + 'px'; m.style.left = r.left + 'px';
}
function v3CloseScope(){ const m = document.getElementById('v3-scope-menu'); if(m) m.style.display = 'none'; }
const V3_AREA = [
  {id:'AR-01', prio:'high', type:'Segment comparison · Checkout', title:'Checkout satisfaction trails in 4 of your 30 stores',
   sum:'4 stores score at least 0.8 below the area average on checkout, each with 100+ responses this period.', num:'4 of 30', unit:'stores below the area', basis:'CRN area · 01 Jun – 23 Sep 2026 · stores with 100+ responses',
   table:[['Store 07 · Riyadh','7.6','−1.0'],['Store 12 · Riyadh','7.8','−0.8'],['Store 19 · Qassim','7.8','−0.8'],['Store 23 · Qassim','7.7','−0.9']], tableHead:['Store','Checkout','vs area 8.6'],
   steps:[['Recommended action.','compare till cover at peak hours in these 4 stores with the area\'s best checkout stores.','plan'],['For the 4 Store Managers.','share this so each manager sees their own store against the area.','share']]},
  {id:'AR-02', prio:'high', type:'Anomaly · Checkout & payments', title:'Payment-failure complaints spiked in 6 stores on 14–15 Sep',
   sum:'The same 2 days show the spike in 6 stores, which points to one shared cause rather than store issues.', num:'6 of 30', unit:'stores, same 2 days', basis:'CRN area · daily comments · 14–15 Sep 2026',
   table:[['Store 03 · Riyadh','14'],['RT ATYAF MALL','11'],['Store 12 · Riyadh','9'],['+ 3 more stores','17']], tableHead:['Store','Mentions'],
   steps:[['For the Central team.','ask IT or the payment provider about an outage on 14–15 Sep.','central']]},
  {id:'AR-03', prio:'med', type:'Key driver · Cleanliness', title:'Fitting-room cleanliness is the top factor in 18 of your 30 stores',
   sum:'Across the area, cleanliness moves most with overall satisfaction. In 18 stores it is also the top factor on its own.', num:'18 of 30', unit:'stores', basis:'CRN area · 01 Jun – 23 Sep 2026',
   table:[['Top factor in','18 stores'],['Second factor in','7 stores'],['Not in top 3','5 stores']], tableHead:['Cleanliness',''],
   steps:[['Recommended action.','make a fitting-room reset part of the area\'s shift standard.','plan']]},
  {id:'AR-04', prio:'pos', type:'Period comparison · Overall', title:'Your 5 highest-scoring stores this week',
   sum:'Overall satisfaction at these stores is above 9.5 for the 4th week running.', num:'9.5+', unit:'5 stores', basis:'CRN area · week of 21 Sep 2026',
   table:[['RT ATYAF MALL','9.63'],['Store 05 · Riyadh','9.61'],['Store 09 · Hail','9.58'],['Store 14 · Riyadh','9.55'],['Store 28 · Qassim','9.52']], tableHead:['Store','Overall'],
   steps:[['For your Area Manager review.','ask these store managers what they do differently at the next area call.','share']]}
];
const V3_ALL = [
  {proj:'Store experience survey', n:6, open:'store', items:[
    {id:'AL-01', prio:'high', type:'Anomaly · Checkout & payments', title:'Payment-failure complaints spiked on 14–15 Sep', sum:'11 respondents over 2 days, against about 1 a week normally.', num:'11', unit:'mentions', basis:'RT ATYAF MALL · 14–15 Sep 2026', table:[['Mentions, 14–15 Sep','11'],['Typical week','~1']], tableHead:['',''], steps:[['For the Central team.','check for a payment outage on those days.','central']]},
    {id:'AL-02', prio:'pos', type:'Period comparison · Overall', title:'Overall satisfaction rose to 9.63', sum:'Up from 9.23 in the previous period, on 261 vs 568 responses.', num:'9.63', unit:'out of 10', basis:'RT ATYAF MALL · 01 Jun – 23 Sep vs 14 Feb – 31 May 2026', table:[['Current','9.63'],['Previous','9.23']], tableHead:['Period','Score'], steps:[['Recommended action.','name the service behaviours customers praise in the next team briefing.','plan']]}]},
  {key:'online', proj:'Online experience survey', n:2, items:[
    {id:'AL-03', prio:'high', type:'Recurring theme · Delivery', title:'Late-delivery complaints are the top detractor theme', sum:'Late or missed delivery windows appear in detractor comments in every week of the period.', num:'Recurring', unit:'every week', basis:'Online survey · 01 Jul – 23 Sep 2026', table:[['Weeks with the theme','12 of 12']], tableHead:['',''], steps:[['For the e-commerce team.','share the delivery comments with the delivery partner owner.','share']]}]},
  {key:'returns', proj:'Returns & exchanges survey', n:1, items:[
    {id:'AL-04', prio:'med', type:'Emerging theme · Refunds', title:'Refund-delay comments appeared in the last 3 weeks', sum:'Not seen in the 6 months before.', num:'New', unit:'theme', basis:'Returns survey · last 3 weeks vs 6 months before', table:[['Last 3 weeks','new'],['6 months before','none']], tableHead:['',''], steps:[['Recommended action.','check refund processing times with finance.','plan']]}]},
  {key:'care', proj:'Customer care survey', n:0, items:[]}
];
function v3ScopeCardHTML(c){
  return `<div class="v3-card ic spr-card" data-v3-card="${c.id}" data-priority="${c.prio}" onclick="v3OpenScopeCard('${c.id}')">
    <div class="ic-body"><div class="ic-head"><div class="ic-kind"><span class="ic-type"><span>${c.type}</span></span><span class="illus" style="display:inline-flex!important">Illustrative</span></div></div>
      <div class="ic-main"><div class="ic-text"><p class="ic-title">${c.title}</p><p class="ic-sum">${c.sum}</p></div>
        <div class="ic-stat"><p class="ic-num${/^\d/.test(c.num)?'':' word'}">${c.num}</p><p class="ic-unit">${c.unit}</p></div></div></div>
    <div class="ic-foot"><p class="ic-basis">${c.basis}</p><div class="ic-acts"><button class="btn-pri" onclick="event.stopPropagation();v3OpenScopeCard('${c.id}')">Investigate</button></div></div></div>`;
}
function v3RenderScope(){
  let host = document.getElementById('v3-scope-view');
  const jr = document.getElementById('journey-returning');
  if(!host){ host = document.createElement('div'); host.id = 'v3-scope-view'; host.className = 'hidden'; jr.parentNode.insertBefore(host, jr.nextSibling); }
  if(v3Scope==='store'){ host.classList.add('hidden'); host.innerHTML = ''; jr.classList.remove('hidden'); return; }
  jr.classList.add('hidden'); host.classList.remove('hidden');
  const sv = V3_ALL.find(p=>p.key===v3Scope) || {items:[]};
  let list = V3_SECS.map(([lvl,label,col])=>{ const cs = sv.items.filter(c=>c.prio===lvl); return cs.length ? `<div class="v3-sec"><i style="background:${col}"></i>${label}<span class="n">${cs.length}</span></div>${cs.map(v3ScopeCardHTML).join('')}` : ''; }).join('');
  list = `<div class="v3-upd" style="display:flex;gap:10px;font-size:12.5px;color:#5f6672;margin:0 0 10px"><span>Updated <b style="color:#1f2329">${EDITIONS[0].short}</b> · next update ${nextEditionShort()}</span></div>
    <div class="feed-head"><p class="text-[13.5px] font-600 text-txt-1">${sv.items.length} ${sv.items.length===1?'insight':'insights'}</p></div>`
    + (sv.items.length ? list : `<div class="spr-card p-8 text-center" data-v3-survey-empty><p class="text-[13.5px] font-600 text-txt-1">No insights for this survey yet</p><p class="text-[12.5px] text-txt-3 mt-1">Nothing met the evidence rules in the latest update. New insights appear here when they do.</p></div>`);
  host.innerHTML = `<div class="flex gap-5 items-start" id="v3-scope-split"><div class="flex-1 min-w-0 space-y-3" id="v3-scope-list" style="max-width:960px;margin:0 auto">${list}</div>
    <div id="v3-scope-panel" class="hidden flex-shrink-0 spr-card" style="flex:1 1 auto;position:sticky;top:16px;overflow-y:auto"></div></div>`;
}
function v3FindScopeCard(cid){ return V3_AREA.find(c=>c.id===cid) || V3_ALL.flatMap(p=>p.items).find(c=>c.id===cid); }
function v3OpenScopeCard(cid){
  const c = v3FindScopeCard(cid); if(!c) return;
  const list = document.getElementById('v3-scope-list'), panel = document.getElementById('v3-scope-panel');
  list.style.maxWidth = '340px'; list.style.flex = '0 0 340px'; list.style.margin = '0';
  list.querySelectorAll('.v3-card').forEach(x=>x.classList.toggle('active', x.dataset.v3Card===cid));
  list.querySelectorAll('.ic-sum,.ic-foot,.ic-stat').forEach(x=>x.style.display='none');
  const stepBtn = s=> s[2]==='share' ? `<button class="btn-sec" onclick="toast('Shared')">Share</button>` : s[2]==='central' ? `<button class="btn-sec" onclick="toast('Shared with the Central team')">Share with Central team</button>` : `<button class="btn-sec" onclick="toast('Added to an action plan')">Add to action plan</button>`;
  panel.innerHTML = `<div class="flex items-center justify-between px-5 py-4 border-b border-line2"><div class="min-w-0"><p class="text-[10.5px] font-600 uppercase tracking-wide text-txt-4 mb-0.5">${c.type}</p><p class="text-[14.5px] font-600 text-txt-1 leading-snug">${c.title}</p></div>
      <button class="iconbtn" onclick="v3CloseScopeCard()">${V3_SVG.x}</button></div>
    <div class="px-5 pt-3.5 v3-acts"><button class="btn-sec" onclick="this.classList.toggle('on');this.innerHTML=this.classList.contains('on')?FOLLOW_ON_HTML:FOLLOW_OFF_HTML">${FOLLOW_OFF_HTML}</button><button class="btn-sec" onclick="toast('Shared')">Share</button><span class="sp"></span><button class="btn-sec" onclick="v3CloseScopeCard();toast('Dismissed')">${V3_SVG.x}Dismiss</button></div>
    <div class="px-5 py-4 v3d" data-v3-id="${c.id}">
      <div class="illus-banner"><span><b style="color:#42474f">Illustrative example.</b> This survey's figures are placeholders that show how its insights would read.</span></div>
      <div class="v3-sum"><p class="eyebrow" style="margin-bottom:4px">Summary</p><p class="id-lede">${c.sum}</p></div>
      <div class="id-sect"><p class="eyebrow">The evidence</p><table class="v3-tbl"><thead><tr>${c.tableHead.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${c.table.map(r=>`<tr>${r.map((x,i)=>`<td class="${i && /^−/.test(x)?'bad':''}">${x}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="v3-note" style="margin-top:6px">${c.basis}</p></div>
      <div class="id-sect"><p class="eyebrow">Next steps</p>${c.steps.map(s=>`<div class="id-means" style="margin-top:9px"><div><b>${s[0]}</b> ${s[1]}<div class="v3-cta">${stepBtn(s)}</div></div></div>`).join('')}
        <div class="v3-agent"><span class="ai">${V3_SVG.agent}</span><div class="at"><b>Review pack agent</b> · drafts a one-page summary of this insight for your next review.</div><button class="btn-sec" style="padding:5px 11px;font-size:12px" onclick="v3Agent('review','${c.id}')">Draft it</button></div></div>
      <details class="id-sect v3-col"><summary>Evidence limitations</summary><ul class="id-why"><li>Stores with fewer than 100 responses this period are left out of the comparison.</li></ul></details>
    </div>`;
  panel.classList.remove('hidden');
}
function v3CloseScopeCard(){ v3RenderScope(); }
function v3SetScope(k, silent){
  v3Scope = k; v3CloseScope();
  const pill = document.querySelector('[data-scope-pill]'); if(pill) pill.textContent = V3_SCOPES[k].label;
  if(k!=='store'){ closeInvestigatePanel(); if(document.getElementById('view-insights').classList.contains('hidden')) segNav('insights'); }
  v3RenderScope();
  const h1 = document.getElementById('page-h1'); if(h1 && !document.getElementById('view-insights').classList.contains('hidden')) h1.textContent = 'Feed';
  if(k==='store' && feedView==='closed') feedView = 'active';
  applyFeedVisibility();
  if(!silent) toast('Showing insights for ' + V3_SCOPES[k].label);
}
// Store Manager: the week's main KPIs before the insights (Redtag)
function v3Kpis(){
  const host = document.getElementById('feed-col'); if(!host || document.getElementById('v3-kpis')) return;
  const el = document.createElement('div'); el.id = 'v3-kpis'; el.className = 'v3-kpis';
  el.innerHTML = `<div class="kh" data-v3-kpi-head><b>This period at RT ATYAF MALL</b><span>Dashed tiles use illustrative figures</span></div>
    <div class="v3-kpi"><div class="k">Overall satisfaction</div><div class="v">9.63<small style="color:#0e8a5f">▲ 0.40</small></div></div>
    <div class="v3-kpi"><div class="k">Responses</div><div class="v">261</div></div>
    <div class="v3-kpi illu" title="Illustrative figure"><div class="k">Alerts closed within 24h</div><div class="v">92%</div></div>
    <div class="v3-kpi illu" title="Illustrative figure"><div class="k">Detractors to follow up</div><div class="v">7 <button onclick="v3Agent('followup','INS-05')">Review</button></div></div>`;
  const eb = document.getElementById('edition-bar'); eb.parentNode.insertBefore(el, eb.nextSibling);
}

/* ── 7. Copilot on every page: summarises the page and suggests starter questions ── */
function v3PageCtx(){
  const v = ['insights','followed','shared','plans'].find(x=>{ const e = document.getElementById('view-'+x); return e && !e.classList.contains('hidden'); }) || 'insights';
  if(v==='insights' && v3Scope!=='store') return v3Scope;
  if(v==='insights' && feedView==='closed') return 'bin';
  return v;
}
function v3FeedCards(){ return [...document.querySelectorAll('#card-grid .insight-card')].filter(c=>c.dataset.state==='active'); }
const v3T = c=>(c.querySelector('[data-el="title"]')||{}).textContent;
function v3PageSummary(ctx){
  if(ctx==='insights'){
    const cs = v3FeedCards(), hi = cs.filter(c=>c.dataset.priority==='high'), pos = cs.filter(c=>c.dataset.priority==='pos');
    return `<b>${cs.length} insights</b> for RT ATYAF MALL in the update of ${EDITIONS[0].short}. <b>${hi.length} need attention</b>${pos.length ? `, and ${pos.length} ${pos.length===1?'is a bright spot':'are bright spots'}` : ''}.<ul>${hi.map(c=>`<li>${v3esc(v3T(c))}</li>`).join('')}</ul>`;
  }
  if(ctx==='followed'){ const ids = Object.keys(followed); const up = ids.filter(i=>followed[i].updated); return `You follow <b>${ids.length} insights</b>; <b>${up.length}</b> changed since you last opened them.`; }
  if(ctx==='shared'){ const n = sharedWithMe.filter(s=>!s.dismissed).length, u = sharedWithMe.filter(s=>s.unread).length; return `<b>${n} insights</b> shared with you, <b>${u}</b> not opened yet.`; }
  if(ctx==='plans'){ const ps = Object.entries(actionPlans); return `<b>${ps.length} action plans</b> linked to insights; ${ps.filter(p=>p[1].status==='In progress').length} in progress.`; }
  if(V3_SCOPES[ctx] && ctx!=='store'){ const sv = V3_ALL.find(p=>p.key===ctx)||{items:[]}; const hi = sv.items.filter(c=>c.prio==='high'); return `<b>${sv.items.length} ${sv.items.length===1?'insight':'insights'}</b> in the ${V3_SCOPES[ctx].label}${hi.length?`; <b>${hi.length} need${hi.length===1?'s':''} attention</b>:<ul>${hi.map(c=>`<li>${c.title}</li>`).join('')}</ul>`:'.'}`; }
  if(ctx==='area') return `<b>4 roll-up insights</b> across your 30 stores. <b>2 need attention:</b> checkout trails in 4 stores, and a payment-failure spike hit 6 stores on the same 2 days.`;
  if(ctx==='all') return `<b>4 insights</b> across 4 surveys. The store survey has 2, online 1, returns 1, and customer care has nothing new.`;
  return `Insights you dismissed, or marked done after following.`;
}
const V3_STARTERS = {
  insights:['What needs my action today?','Summarise my followed insights','What changed since last week?'],
  followed:['Summarise my followed insights','Which followed insights got worse?','What should I close?'],
  shared:['Who shared what with me?','What needs a reply?'],
  plans:['Which plans are overdue?','Summarise progress for my review'],
  area:['Which stores need my attention?','What is happening in several stores at once?','Prepare my monthly area review'],
  all:['Which survey needs my attention?','Summarise this week across surveys'],
  online:['What needs my action today?','What changed since last week?'], returns:['What needs my action today?','What changed since last week?'], care:['What changed since last week?'],
  bin:['Why did I dismiss these?']
};
function v3PageAnswer(q){
  const cs = v3FeedCards();
  if(/action today|attention/i.test(q) && v3Scope==='store'){ const hi = cs.filter(c=>c.dataset.priority==='high'); return hi.length ? `${hi.length} insights need your action:<ul>${hi.map(c=>`<li><b>${v3esc(v3T(c))}</b> — ${v3esc((c.querySelector('[data-el="action"]')||{}).textContent.replace('Recommended action:','').trim())}</li>`).join('')}</ul>` : 'Nothing needs your action right now.'; }
  if(/followed/i.test(q)){ const ids = Object.keys(followed); return ids.length ? `<ul>${ids.map(i=>`<li><b>${v3esc(metaOf(i).title)}</b>${followed[i].atVal ? ` — ${followed[i].atVal} when you followed` : ''}${followed[i].updated ? ' · <b>changed</b>' : ''}</li>`).join('')}</ul>` : 'You are not following any insights yet.'; }
  if(/changed since/i.test(q)){ const n = cs.filter(c=>typeof streakOf==='function' && streakOf(c.dataset.id)===1); return n.length ? `New in this update:<ul>${n.map(c=>`<li>${v3esc(v3T(c))}</li>`).join('')}</ul>Everything else was in the previous update too.` : 'Nothing new since the last update.'; }
  if(/stores need|several stores/i.test(q)) return 'Checkout trails the area in Stores 07, 12, 19 and 23. The payment-failure spike on 14–15 Sep hit 6 stores at once, which points to one shared cause. <span class="illus" style="display:inline-flex!important">Illustrative</span>';
  if(/review/i.test(q)) return 'I can draft it with the Review pack agent: one slide per finding, with the stores to discuss. Open any insight and choose <b>Draft it</b> under Next steps.';
  return v3PageSummary(v3PageCtx());
}
function v3OpenPageCopilot(){
  let p = document.getElementById('v3-pcp');
  if(!p){ p = document.createElement('div'); p.id = 'v3-pcp'; document.body.appendChild(p); }
  const ctx = v3PageCtx();
  p.innerHTML = `<div class="ph"><span style="color:#5b3fd1">${V3_SVG.spark}</span><b style="flex:1;font-size:14.5px">Copilot</b><button class="iconbtn" data-v3-pcp-close onclick="document.getElementById('v3-pcp').classList.remove('show')">${V3_SVG.x}</button></div>
    <div class="pb"><p class="eyebrow" style="margin-bottom:6px">On this page</p><div class="v3-psum" data-v3-psum>${v3PageSummary(ctx)}</div>
      <div id="v3-pcp-thread" class="space-y-2" style="margin-top:12px"></div>
      <div class="cp-sugg" style="margin-top:12px"><span class="cp-sugg-l">Try asking</span>${(V3_STARTERS[ctx]||[]).map(q=>`<button class="cp-q" data-v3-starter onclick="v3PageAsk(this.textContent)">${q}</button>`).join('')}</div></div>
    <div class="pf"><input id="v3-pcp-in" class="flex-1 text-[13px] border border-line rounded-md px-3 h-9 focus:outline-none" placeholder="Ask about this page…" onkeydown="if(event.key==='Enter')v3PageAsk(this.value)"><button class="btn-pri" onclick="v3PageAsk(document.getElementById('v3-pcp-in').value)">Send</button></div>`;
  requestAnimationFrame(()=>p.classList.add('show'));
}
function v3PageAsk(q){
  q = (q||'').trim(); if(!q) return;
  const t = document.getElementById('v3-pcp-thread');
  t.insertAdjacentHTML('beforeend', `<div class="rounded-md px-3 py-2 ml-8" style="background:#eef4ff"><p class="text-[12.5px] text-txt-1">${v3esc(q)}</p></div><div class="rounded-md px-3 py-2" style="background:#f7f8fa" data-v3-pcp-answer><div class="text-[12.5px] text-txt-2 leading-[1.5] v3-psum" style="background:none;border:0;padding:0">${v3PageAnswer(q)}</div></div>`);
  const i = document.getElementById('v3-pcp-in'); if(i) i.value = '';
}

/* ── 8. Action plans as their own page ── */
function v3RenderPlans(){
  const el = document.getElementById('v3-plans-list'); if(!el) return;
  const ps = Object.entries(actionPlans);
  el.innerHTML = ps.length ? ps.map(([id,p])=>{ const cls = p.status==='In progress' ? 'ip' : p.status==='Completed' ? 'dn' : '';
    return `<div class="v3-plan" data-v3-plan="${id}"><span style="color:#5f6672">${V3_SVG.plan}</span><div style="flex:1;min-width:0"><p class="text-[13.5px] font-600 text-txt-1">${v3esc(metaOf(id).title)}</p><p class="text-[12px] text-txt-3">Owner: ${v3esc(p.owner||'You')} · linked insight</p></div><span class="v3-st ${cls}">${v3esc(p.status)}</span><button class="btn-sec" style="padding:5px 11px;font-size:12px" onclick="v3OpenPlanInsight('${id}')">Open insight</button></div>`; }).join('')
    : `<p class="p-6 text-center text-[13px] text-txt-3">No action plans yet. Create one from Next steps in any insight.</p>`;
  const n = document.getElementById('v3-plans-n'); if(n) n.textContent = ps.length || '';
}
function v3OpenPlanInsight(id){ v3SetScope('store', true); segNav('insights'); v3OpenFeed(); if(document.querySelector('#card-grid .insight-card[data-id="'+id+'"]')) openInvestigate(id); }
const _v3OpenPlan = openActionPlan;
openActionPlan = function(id){ const r = _v3OpenPlan(id); setTimeout(v3RenderPlans, 0); return r; };

/* ── 9. Navigation: Dismissed & done and Action plans in the left nav; Copilot and scope in the header ── */
const _v3Seg = segNav;
segNav = function(v){
  const pv = document.getElementById('view-plans');
  if(v==='plans'){
    _v3Seg('insights'); document.getElementById('view-insights').classList.add('hidden');
    document.getElementById('seg-insights').classList.remove('active');
    pv.classList.remove('hidden'); v3RenderPlans();
    document.getElementById('v3-nav-plans').classList.add('active');
    const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Action plans';
    return;
  }
  if(pv) pv.classList.add('hidden');
  const np = document.getElementById('v3-nav-plans'); if(np) np.classList.remove('active');
  if(v==='insights' && feedView==='closed' && !v3BinNav) feedView = 'active';
  _v3Seg(v);
  if(v==='insights') applyFeedVisibility();
};
var v3BinNav = false;
(function v3Init(){
  // left nav
  const nav = document.getElementById('si-subnav');
  const hr = nav.querySelector('hr');
  hr.insertAdjacentHTML('beforebegin', `<button class="sn-i" id="v3-nav-plans" onclick="segNav('plans')">${V3_SVG.plan}<span class="sn-t">Action plans</span><span class="sn-c" id="v3-plans-n"></span></button>`);
  hr.insertAdjacentHTML('afterend', `<button class="sn-i dim" id="v3-nav-bin" onclick="v3BinNav=true;v3OpenBin();v3BinNav=false">${V3_SVG.bin}<span class="sn-t">Dismissed &amp; done</span><span class="sn-c" id="v3-bin-n"></span></button>`);
  document.getElementById('seg-insights').setAttribute('onclick', "v3OpenFeedNav()");
  // action plans view
  const vf = document.getElementById('view-followed');
  vf.insertAdjacentHTML('beforebegin', `<div id="view-plans" class="px-6 pb-14 hidden"><div class="cx" style="max-width:960px;margin:0 auto"><p class="text-[13px] text-txt-3 mb-3">Every action plan linked to an insight, with its owner and status.</p><div class="spr-card" id="v3-plans-list"></div></div></div>`);
  // header: scope selector and Copilot
  const pill = document.querySelector('[data-scope-pill]');
  if(pill){ pill.classList.add('v3-scope'); pill.title = 'Change which stores or surveys these insights cover'; pill.setAttribute('onclick', 'v3OpenScope(event)'); }
  const right = document.getElementById('seg-wrap-main').parentNode;
  right.insertAdjacentHTML('beforeend', `<button class="v3-ask" id="v3-ask" data-v3-ask onclick="v3OpenPageCopilot()">${V3_SVG.spark}Ask Copilot</button>`);
  v3Kpis(); v3RenderPlans(); if(typeof renderFeedbackSlots==='function') renderFeedbackSlots();
  renderEditionBar(); applyFeedVisibility();
})();
function v3OpenFeedNav(){ if(v3Scope!=='store'){ segNav('insights'); v3RenderScope(); return; } segNav('insights'); v3OpenFeed(); }

/* ── Shared cards: same button as the feed, and the hover X clears it from Shared ── */
const _v3Shared = renderSharedTab;
renderSharedTab = function(){
  const r = _v3Shared.apply(this, arguments);
  document.querySelectorAll('#shared-list .shr-card').forEach(c=>{
    c.querySelectorAll('.btn-pri').forEach(b=>{ if(/View insight/.test(b.textContent)) b.innerHTML = b.innerHTML.replace('View insight','Investigate'); });
    const head = c.querySelector('.ic-head'), sid = c.dataset.shareCard;
    if(head && sid && !head.querySelector('.v3-x')) head.insertAdjacentHTML('beforeend', `<button class="v3-x" title="Clear from Shared" data-v3-share-x="${sid}" onclick="event.stopPropagation();dismissShare('${sid}')">${V3_SVG.x}</button>`);
  });
  return r;
};
renderSharedTab();
/* ── Drill-down height: from where it starts to the bottom of the window, so Copilot is always at the foot of the page ── */
function v3SizePanes(){
  const sp = document.getElementById('v3-scope-panel');
  if(sp && !sp.classList.contains('hidden') && sp.offsetParent!==null) document.body.classList.remove('no-pane');
  ['investigate-panel','followed-panel','shared-panel','v3-scope-panel'].forEach(id=>{
    const p = document.getElementById(id);
    if(!p || p.classList.contains('hidden') || p.offsetParent===null) return;
    const top = Math.max(16, p.getBoundingClientRect().top);
    p.style.maxHeight = 'none';
    p.style.height = Math.max(320, innerHeight - top - 16) + 'px';
  });
}
addEventListener('scroll', v3SizePanes, {passive:true});
addEventListener('resize', v3SizePanes);
new MutationObserver(()=>requestAnimationFrame(v3SizePanes)).observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
/* ── 10. Prototype pages: Use cases (validated vs not), and parked flows ── */
const UC_ROWS = [
  // [bucket, use case, status y|n|m|h, who, note, where in the prototype]
  ['Workflow','Turn survey data into findings, then act or escalate (find → investigate → act)','y','Bosch, Redtag, ID.me','Bosch routes technician issues to training and systemic ones to central teams; ID.me routes to owners every morning.','Drill-down next steps, each with a button'],
  ['Workflow','The bottleneck is putting metrics, comments and charts together into a prioritised finding','y','Bosch, Redtag, ID.me','Customers do it by hand or with external AI today.','The feed itself'],
  ['Personas','Different users need different insights, not just a filtered copy','y','Bosch, Redtag, ID.me','Redtag: store manager, area manager, country head. ID.me: ops vs product owners.','Not yet: the prototype switches surveys only'],
  ['Personas','Store Manager: the week\'s main KPIs, main detractor issue, alerts closed on time, which detractors to follow up','y','Redtag','Karim described this for store managers.','KPI row on the store feed; detractor follow-up agent'],
  ['Personas','Area Manager: the same, added up across stores, with best and worst stores','y','Redtag','"Who is performing well from the 10 stores, who is low."','Not in the prototype (parked)'],
  ['Content','State scope and comparison: which survey, period, stores, compared with what','y','Redtag; Bosch, ID.me','Karim could not read a number without it.','Scope line on every card'],
  ['Content','Say what changed and name the specific driver, not a broad theme','y','ID.me, Redtag, Bosch','"People can\'t get verified" is not enough without why or how.','Headline + key figure'],
  ['Content','Short and prioritised first, depth behind it','y','Redtag, ID.me','Redtag rejected paragraphs; ID.me wants a TLDR for executives.','Light cards; drill-down'],
  ['Content','Customer comments make an insight easier to trust and understand','y','ID.me; Redtag, Bosch, Sézane','"Necessary to keep" (ID.me).','Customer voice + See all'],
  ['Content','Point to where attention is needed and a next step or owner','y','Bosch, Redtag, ID.me','Validates actionability, not fully automatic actions.','Next steps with buttons'],
  ['Trigger','Surface findings on a cadence even without a big KPI drop; novelty and recurrence count','y','Bosch; ID.me','ID.me checks daily for broken integrations and new themes.','Sections; New label'],
  ['Novelty','Accurate but already-known findings are not enough; newer findings matter','m','ID.me only','Strong at ID.me, needs a second customer.','"Already knew this" dismiss reason'],
  ['Delivery','Push important insights proactively (email)','y','Bosch, ID.me; Redtag directional','Email with a link to explore further.','Email digests journey'],
  ['Delivery','A pushed insight links to a deeper place to explore','y','Bosch, ID.me','"An email with a link to a dashboard."','Email → drill-down'],
  ['Cadence','Frequency differs by role and survey','y','Bosch, Redtag, ID.me','Daily (ID.me), weekly + monthly (Redtag), weekly/biweekly (ops). One-off surveys: on demand.','Update cadence in Configure'],
  ['Copilot','Prompt-first is enough to discover what matters','n','Bosch; ID.me','Proactive insights for discovery; Copilot for digging in. ID.me asked for starter questions.','Copilot pinned in drill-down + on every page'],
  ['Trust','Survey data alone is enough for prescriptive recommendations','m','ID.me','Plausible but wrong without business context (failed attempts are intended).','"Expected by design" dismiss reason'],
  ['Granularity','One insight per survey question','n','Redtag, ID.me','Both want a prioritised set instead.','Not done'],
  ['Granularity','Survey level is the right long-term boundary','n','ID.me','Product owners own a journey step across surveys.','Survey switcher (one survey at a time)'],
  ['Destination','A feed is the place users want to go','n','None','The job and content are validated; the destination is not.','Open question: feed vs email vs dashboard'],
  ['Leadership','A leadership-specific narrative and cadence','n','None directly','Only a proxy from ID.me.','Not in the prototype'],
  ['Advanced','Insights across surveys / journeys','m','ID.me; Human Company (older call)','Human Company asked for a quick view across about 20 surveys.','Survey switcher (one survey at a time)'],
  ['Advanced','Benchmarking','m','Bosch; Redtag (older call)','Bosch country benchmarks; Redtag asked for competitor and global benchmarks.','Not in the prototype'],
  ['Hypothesis','Follow an insight and see how it moves after acting','h','Partly Sézane','Sézane: "measure the NPS after the action taken".','Follow · Followed'],
  ['Hypothesis','Share an insight with a note; comments on the insight','h','—','','Share · Activity and comments'],
  ['Hypothesis','Action plans attached to insights','h','—','','Action plans page'],
  ['Hypothesis','Dismiss reasons improve future insights','h','—','','Dismiss with a reason'],
  ['Hypothesis','Agents: review pack, detractor follow-up','h','Redtag needs, not the agent','Karim builds the review deck by hand; store managers want detractors to follow up.','Next steps → agents'],
  ['Hypothesis','One card per topic with its history (no editions)','h','—','Pradeep: drop editions, keep soft links between versions of the same topic.','History in each drill-down; New / Updated / Missed labels'],
  ['Hypothesis','Agent-level comments for staff training','m','ID.me','Ops want repeated comments about one agent. Conflicts with "never rank or name staff". Open decision.','Not in the prototype']
];
const UC_ST = {y:['y','Validated'], n:['n','Not validated'], m:['m','Mixed or one customer'], h:['h','Hypothesis']};
let ucFilter = 'all';
function ucHTML(){
  const rows = UC_ROWS.filter(r=>ucFilter==='all' || r[2]===ucFilter);
  const cnt = k=>UC_ROWS.filter(r=>r[2]===k).length;
  return `<div class="hm-proto"><b>Prototype · Use cases</b><button style="margin-left:auto" data-uc-close onclick="closeUseCases()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap">
      <h1>Use cases this prototype handles</h1>
      <p class="lo-lede">From customer calls with Bosch, Redtag and ID.me (Sep 2026), plus older calls with Human Company and Sézane. Each row says whether customers confirmed it, and where it shows up in the prototype.</p>
      <div class="uc-filter">${[['all','All',UC_ROWS.length],['y','Validated',cnt('y')],['m','Mixed or one customer',cnt('m')],['n','Not validated',cnt('n')],['h','Hypothesis',cnt('h')]].map(([k,l,n])=>`<button class="v3-chip${ucFilter===k?' on':''}" data-uc-filter="${k}" onclick="ucFilter='${k}';openUseCases()">${l}<span class="n">${n}</span></button>`).join('')}</div>
      <table class="uc-tbl" data-uc-table><thead><tr><th style="width:110px">Area</th><th>Use case</th><th style="width:150px">Status</th><th style="width:170px">Who said so</th><th>Notes</th><th style="width:200px">In the prototype</th></tr></thead>
      <tbody>${rows.map(r=>`<tr data-uc-row="${r[2]}"><td>${r[0]}</td><td><b style="font-weight:600">${r[1]}</b></td><td><span class="uc-st ${UC_ST[r[2]][0]}">${UC_ST[r[2]][1]}</span></td><td>${r[3]}</td><td style="color:#42474f">${r[4]}</td><td style="color:#42474f">${r[5]}</td></tr>`).join('')}</tbody></table>
      <p class="uc-h">Parked flows</p>
      <p class="lo-lede">Thought through, but not validated with a customer and adding weight to the cards. Still openable here.</p>
      <div class="flex gap-2 flex-wrap" style="margin-bottom:30px"><button class="btn-sec" data-parked="layouts" onclick="closeUseCases();openCardLayouts()">Card layout options</button><button class="btn-sec" data-parked="journeys" onclick="closeUseCases();openCardJourneys()">How cards change</button><button class="btn-sec" onclick="toast('Held back / Bring it back is parked: held-back topics no longer show under the feed')">Held back · Bring it back</button><button class="btn-sec" onclick="toast('The settle rule and snapshot outcomes are parked; old copies keep only Open latest')">Settle rule · snapshot outcomes</button></div>
    </div></div>`;
}
function openUseCases(){
  let l = document.getElementById('uc-layer');
  if(!l){ l = document.createElement('div'); l.id = 'uc-layer'; document.body.appendChild(l); }
  const top = l.querySelector('.lo-scroll') ? l.querySelector('.lo-scroll').scrollTop : 0;
  l.innerHTML = ucHTML(); l.classList.add('show'); document.body.style.overflow = 'hidden';
  const sc = l.querySelector('.lo-scroll'); if(sc) sc.scrollTop = top;
}
function closeUseCases(){ const l = document.getElementById('uc-layer'); if(l) l.classList.remove('show'); document.body.style.overflow = ''; }
(function v3ProtoBar(){
  const lay = document.getElementById('open-card-layouts'), jr = document.getElementById('open-card-journeys');
  if(lay) lay.style.display = 'none'; if(jr) jr.style.display = 'none';
  const ref = document.getElementById('open-card-types');
  if(ref) ref.insertAdjacentHTML('beforebegin', `<button class="journey-btn" id="open-use-cases" onclick="openUseCases()">✓ Use cases</button>`);
})();
