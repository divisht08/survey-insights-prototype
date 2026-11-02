/* ═══ v17 (2 Nov) — changes after the ID.me user test (30 Oct) and Pradeep's review:
   1. Slack and Teams: admins can post a persona's insights to a channel; anyone can post an insight to a channel from Share.
   2. Copilot across all surveys: an "Ask about your surveys" bar on the Feed opens the answers (no menu item).
   3. "Where it happened" in the drill-down: change against the usual, impact on the score, and the segments it sits in.
   4. Deleted is now Archived.
   All figures are sample data (see "About the data"). ═══ */

const v17Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const V17_ICON = {
  archive:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 5h18v4H3zM5 9v10a2 2 0 002 2h10a2 2 0 002-2V9M10 13h4"/></svg>',
  spark:'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2zM18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/></svg>',
  slack:'<svg width="14" height="14" viewBox="0 0 24 24"><rect x="9" y="2" width="3.4" height="9" rx="1.7" fill="#36c5f0"/><rect x="2" y="11.6" width="9" height="3.4" rx="1.7" fill="#2eb67d"/><rect x="11.6" y="13" width="3.4" height="9" rx="1.7" fill="#ecb22e"/><rect x="13" y="9" width="9" height="3.4" rx="1.7" fill="#e01e5a"/></svg>',
  teams:'<svg width="14" height="14" viewBox="0 0 24 24"><rect x="2" y="5" width="13" height="14" rx="2" fill="#5059c9"/><path d="M5 9h7M8.5 9v7" stroke="#fff" stroke-width="2"/><circle cx="19" cy="7" r="2.5" fill="#7b83eb"/><rect x="16" y="10.5" width="6" height="8" rx="2" fill="#7b83eb"/></svg>'
};

/* ════════ 1. Slack and Teams ════════ */
// admin setup: a persona can also post to a channel
const V17_CHAN = {sm:{teams:'Store managers › Weekly insights'}, cp:{slack:'#checkout-payments'}};
function v17Ch(p){ if(!p.chan) p.chan = Object.assign({}, V17_CHAN[p.id] || {}); return p.chan; }
function v17ChanText(p){ const c = v17Ch(p), a = []; if(c.slack) a.push('Slack ' + c.slack); if(c.teams) a.push('Teams ' + c.teams); return a.join(' · '); }
const _v17Step3 = v15Step3;
v15Step3 = function(){
  const p = v15S.edit, c = v17Ch(p);
  const row = (k, ic, name, ph)=>`<div class="v17-ch${c[k]!==undefined?' on':''}" data-v17-chan="${k}"><div class="v15-flex"><span class="v17-chn">${ic}<b>${name}</b></span>
      <button class="v15-toggle${c[k]!==undefined?' on':''}" aria-label="${name}" onclick="v17Chan('${k}')"></button></div>
      ${c[k]!==undefined ? `<input class="v17-chin" value="${v17Esc(c[k])}" placeholder="${ph}" oninput="v15S.edit.chan.${k}=this.value">` : ''}</div>`;
  const card = `<div class="v15-card v15-pad" data-v17-channels><h3>Post to a channel</h3><p>Each update also posts the top insights to a channel the team already works in, with a link to each insight.</p>
    ${row('slack', V17_ICON.slack, 'Slack', '#channel-name')}${row('teams', V17_ICON.teams, 'Microsoft Teams', 'Team › Channel')}</div>`;
  let h = _v17Step3.apply(this, arguments);
  h = h.replace('<div class="v15-card" data-v15-review>', card + '<div class="v15-card" data-v15-review>');
  const ct = v17ChanText(p);
  return h.replace(/(<h4>Delivery<\/h4>[^<]*email (?:on|off))/, `$1${ct ? ' · ' + v17Esc(ct) : ''}`);
};
function v17Chan(k){ const c = v15S.edit.chan; if(c[k]!==undefined) delete c[k]; else c[k] = ''; v15Render(); }
const _v17Personas = v15PersonasHTML;
v15PersonasHTML = function(){
  return _v17Personas.apply(this, arguments).replace(/(<tr data-v15-persona="([^"]+)"[\s\S]*?)<small>(Email on|Feed only)<\/small>/g, (m, pre, id, em)=>{
    const p = v15S.personas.find(x=>x.id===id), ct = p ? v17ChanText(p) : '';
    return `${pre}<small>${em}${ct ? ' · ' + v17Esc(ct.replace(/ ›.*$/,'')) : ''}</small>`;
  });
};
// Share: post an insight to a channel, with or without people
const V17_SHARE_CH = [['slack','Slack','#store-ops'],['teams','Teams','Store managers › General']];
const _v17ShareOpen = openShareModal;
openShareModal = function(id){
  _v17ShareOpen.apply(this, arguments);
  const note = [...document.querySelectorAll('#share-modal p')].find(p=>/Add a note/.test(p.textContent));
  if(note) note.insertAdjacentHTML('beforebegin', `<p class="text-[11.5px] font-600 text-txt-1 mb-2">Or post to a channel</p>
    <div class="v17-shch" data-v17-share-ch>${V17_SHARE_CH.map(([k,n,c])=>`<button class="v17-chip" data-v17-sc="${k}" onclick="this.classList.toggle('on')">${V17_ICON[k]}<span>${n} <b>${c}</b></span></button>`).join('')}</div>`);
};
const _v17Send = sendShare;
sendShare = function(){
  const chans = [...document.querySelectorAll('[data-v17-sc].on')].map(b=>V17_SHARE_CH.find(x=>x[0]===b.dataset.v17Sc));
  if(!chans.length) return _v17Send.apply(this, arguments);
  const people = [...document.querySelectorAll('#share-contacts > div')].filter(r=>r.querySelector('.chk').classList.contains('sel')).length;
  const id = currentShareId, where = chans.map(c=>`${c[1]} ${c[2]}`).join(' and ');
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  if(people){ _v17Send.apply(this, arguments); }
  else {
    const note = (document.getElementById('share-note')||{}).value; if(note && note.trim()) insightActivity[id].events.push({type:'comment', by:'You', text:note.trim(), date:'just now'});
    closeShareModal();
  }
  chans.forEach(c=>insightActivity[id].events.push({type:'share', by:'You', text:`posted this to ${c[1]} ${c[2]}`, date:'just now'}));
  toast(people ? `Shared, and posted to ${where}` : `Posted to ${where}`);
  if(typeof refreshInvestigatePanel==='function') refreshInvestigatePanel(id);
};

/* ════════ 2. Copilot across all surveys: Ask page + bar on the Feed ════════ */
const V17_SURVEYS = 'Store experience, Online experience, Returns & exchanges';
const V17_STARTERS = ['What are people saying about checkout and payments?', 'What do unhappy shoppers mention most?', 'How do first-time and returning shoppers compare?', 'Which part of the visit is rated lowest right now?'];
const V17_ANS = {
  [V17_STARTERS[0]]: {a:`<p>Two things stand out.</p><ul><li><b>A one-off spike in failed card payments:</b> 11 shoppers at RT ATYAF MALL said their card or phone payment failed on 14–15 Sep, against about 1 a week normally. Mentions stopped after the 15th.</li><li><b>Weekend checkout waits are easing:</b> weekend shoppers rated checkout 7.4 out of 10 in early September and 8.0 in the latest update.</li></ul>`,
    src:'Store experience survey · 261 responses, 01 Jun – 23 Sep', ins:['INS-05','FOL-01']},
  [V17_STARTERS[1]]: {a:`<p>Among shoppers who rated the visit 6 or lower, the most common topics are:</p><ul><li><b>Cleanliness of the store and fitting rooms</b>, the lowest-rated part of the visit at 7.4 out of 10.</li><li><b>Offers that weren't what they seemed</b>, such as a "2+2 free" that applied only to some items.</li><li><b>Prices</b>, mentioned by a few shoppers this period.</li></ul>`,
    src:'Store experience survey · 261 responses, 01 Jun – 23 Sep', ins:['INS-04','INS-02','INS-03']},
  [V17_STARTERS[2]]: {a:`<p>In mid-September, first-time shoppers rated fitting-room help 1.3 points lower than returning shoppers, and 1.1 lower in the 20 Sep update. The latest update had only 18 first-time shoppers, fewer than the 30 needed to compare the two groups reliably.</p>`,
    src:'Store experience survey · first-time vs returning shoppers', ins:['FOL-02']},
  [V17_STARTERS[3]]: {a:`<p><b>Cleanliness of the store and fitting rooms</b>, at 7.4 out of 10, down 0.6 on the previous period. It's also the part of the visit most closely linked with overall satisfaction. Staff helpfulness is the highest-rated, at 9.1.</p>`,
    src:'Store experience survey · 261 responses, 01 Jun – 23 Sep', ins:['INS-04','INS-06']}
};
var v17Thread = [];
function v17Title(id){ return ((typeof INSIGHT_META!=='undefined' && INSIGHT_META[id]) || {}).title || ''; }
function v17AnswerFor(q){
  return V17_ANS[q] || {a:`<p>I looked across the responses you can see in ${V17_SURVEYS}. Try asking about a topic, a part of the visit or a group of shoppers, such as checkout, fitting rooms or first-time shoppers, and I'll pull the figures and comments behind it.</p>`, src:'All surveys you can see', ins:[]};
}
function v17AskHTML(){
  const thread = v17Thread.map(t=>`<div class="v17-q">${v17Esc(t.q)}</div>
    <div class="v17-a" data-v17-answer>${t.r.a}
      ${t.r.ins.length ? `<div class="v17-cite"><span>Related insights</span>${t.r.ins.map(id=>`<button onclick="segNav('insights');openInvestigate('${id}')">${v17Esc(v17Title(id))}</button>`).join('')}</div>` : ''}
      <div class="v17-afoot"><small>Based on: ${v17Esc(t.r.src)}</small><span><button class="btn-sec" onclick="toast('Posted to Slack #store-ops')">${V17_ICON.slack} Post to Slack</button><button class="btn-sec" onclick="toast('Copied')">Copy</button></span></div></div>`).join('');
  return `<div class="v17-ask" data-v17-ask>
    <a class="v17-back" data-v17-back onclick="segNav('insights')">← Back to the feed</a>
    <p class="v17-lede">Ask anything about your surveys. Answers use every response you can see, across all your surveys.</p>
    <div class="v17-scope"><span class="v17-pill">All surveys · ${V17_SURVEYS.split(', ').length} ▾</span><span class="v17-pill">Last 90 days ▾</span></div>
    ${thread ? `<div class="v17-thread">${thread}</div>` : `<div class="v17-starters"><p>Try asking</p>${V17_STARTERS.map(q=>`<button data-v17-starter onclick="v17Ask(this.textContent)">${v17Esc(q)}</button>`).join('')}</div>`}
    <div class="v17-box"><span>${V17_ICON.spark}</span><input id="v17-in" placeholder="Ask about a topic, a group of customers or a change you noticed…" onkeydown="if(event.key==='Enter')v17Ask(this.value)"><button class="btn-pri" onclick="v17Ask(document.getElementById('v17-in').value)">Ask</button></div>
  </div>`;
}
function v17Ask(q){ q = (q||'').trim(); if(!q) return; v17Thread.push({q, r:v17AnswerFor(q)}); v17RenderAsk(); const i = document.getElementById('v17-in'); if(i){ i.value=''; i.focus(); } }
function v17RenderAsk(){ const v = document.getElementById('view-ask'); if(v) v.innerHTML = v17AskHTML(); }
function v17AskFrom(q){ segNav('ask'); if(q && q.trim()) v17Ask(q); }
const _v17Seg = segNav;
segNav = function(v){
  let view = document.getElementById('view-ask');
  const pill = document.querySelector('[data-scope-pill]');
  if(v==='ask'){
    _v17Seg('insights');
    if(!view){ view = document.createElement('div'); view.id = 'view-ask'; view.className = 'px-6 pb-14'; const vi = document.getElementById('view-insights'); vi.parentNode.insertBefore(view, vi); }
    document.getElementById('view-insights').classList.add('hidden');
    if(typeof closeInvestigatePanel==='function') closeInvestigatePanel();
    v17RenderAsk(); view.classList.remove('hidden');
    document.querySelectorAll('#si-subnav .sn-i').forEach(b=>b.classList.toggle('active', b.id==='seg-insights'));
    const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Ask';
    if(pill) pill.style.display = 'none';
    return;
  }
  if(view) view.classList.add('hidden');
  if(pill) pill.style.display = '';
  const a = document.getElementById('v17-nav-ask'); if(a) a.classList.remove('active');
  return _v17Seg.apply(this, arguments);
};
(function v17AskEntry(){
  const h = document.querySelector('#si-subnav .sn-h');
  const vi = document.getElementById('view-insights');
  if(vi && !document.getElementById('v17-bar')) vi.insertAdjacentHTML('afterbegin', `<div class="v17-bar" id="v17-bar"><span>${V17_ICON.spark}</span>
    <input id="v17-bar-in" placeholder="Ask about your surveys, for example: what are people saying about checkout?" onkeydown="if(event.key==='Enter')v17AskFrom(this.value)">
    <small>All your surveys</small><button class="btn-sec" onclick="v17AskFrom(document.getElementById('v17-bar-in').value)">Ask</button></div>`);
})();

/* ════════ 3. Where it happened ════════ */
// change against the usual, the effect on the score, and the segments the issue sits in
const V17_WHERE = {
  'INS-05': {kpi:[['Against the usual','About 38× the normal rate','11 mentions in 2 days, against about 1 a week'],['Effect on the score','−0.24 on overall satisfaction','9.63 for the period; 9.87 without these 11 shoppers']],
    segs:[['Payment method',[['Card',8],['Phone wallet',3]]],['Day',[['Mon 14 Sep',7],['Tue 15 Sep',4]]],['Shopper',[['Returning',6],['First-time',5]]]], unit:'mentions'},
  'INS-04': {kpi:[['Against the usual','7.4 out of 10, down 0.6','8.0 in the previous period (−7.5%)'],['Effect on the score','Most linked with overall satisfaction','Explains 31% of the variation in overall scores']],
    segs:[['Where in the store',[['Fitting rooms',23],['Shop floor',13]]],['Day',[['Weekend',21],['Weekday',15]]],['Shopper',[['First-time',19],['Returning',17]]]], unit:'low-score comments'},
  'CTY-01': {kpi:[['Against the usual','About 37× the normal rate','64 mentions in 2 days across KSA, against about 6 a week'],['How widespread','9 of 42 stores','All on 14–15 Sep, none after']],
    segs:[['Region',[['Riyadh · 5 stores',41],['Jeddah · 3 stores',19],['Dammam · 1 store',4]]],['Payment method',[['Card',47],['Phone wallet',17]]]], unit:'mentions'}
};
function v17WhereHTML(id){
  const w = V17_WHERE[id]; if(!w) return '';
  const kpi = w.kpi.map(([k,v,s])=>`<div class="v17-kpi"><span>${k}</span><b>${v17Esc(v)}</b><small>${v17Esc(s)}</small></div>`).join('');
  const segs = w.segs.map(([g,rows])=>{ const tot = rows.reduce((a,r)=>a+r[1],0), max = Math.max(...rows.map(r=>r[1]));
    return `<div class="v17-seg"><p>${g}</p>${rows.map(([l,n])=>`<div class="v17-srow"><span>${v17Esc(l)}</span><i><em style="width:${Math.round(n/max*100)}%"></em></i><b>${n}</b><small>${Math.round(n/tot*100)}%</small></div>`).join('')}</div>`; }).join('');
  return `<div class="id-sect" data-v11-sect="Where it happened" data-v17-where><div class="v6-sh"><b>Where it happened</b><span>Count of ${w.unit}</span></div>
    <div class="v17-kpis">${kpi}</div><div class="v17-segs">${segs}</div></div>`;
}
const _v17Shape = v6Shape;
v6Shape = function(html, id, opts){
  const out = _v17Shape.apply(this, arguments); if(!V17_WHERE[id]) return out;
  const t = document.createElement('template'); t.innerHTML = out;
  const ev = [...t.content.querySelectorAll('.id-sect')].find(s=>{ const b = s.querySelector(':scope > .v6-sh b'); return b && b.textContent.trim()==='Evidence'; });
  if(ev && !t.content.querySelector('[data-v17-where]')) ev.insertAdjacentHTML('afterend', v17WhereHTML(id));
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};

/* ════════ 4. Deleted → Archived ════════ */
V9_ICON.trash = V17_ICON.archive;
function v17Archive(){
  document.querySelectorAll('[title="Delete"]').forEach(e=>{ e.title = 'Archive'; if(e.matches('.v3-x,.v9-ib')) e.innerHTML = V17_ICON.archive; });
  const bin = document.getElementById('v3-nav-bin');
  if(bin){ const t = bin.querySelector('.sn-t'); if(t && t.textContent!=='Archived') t.textContent = 'Archived'; const ic = bin.querySelector('svg'); if(ic && !bin.dataset.v17){ bin.dataset.v17 = '1'; ic.outerHTML = V17_ICON.archive; } }
  if(typeof feedView!=='undefined' && feedView==='closed'){
    const l = document.getElementById('feed-count-label'); if(l) l.textContent = l.textContent.replace('deleted','archived');
    const et = document.getElementById('feed-empty-title'); if(et) et.textContent = 'Nothing archived';
  }
}
const _v17Toast = toastAction;
toastAction = function(msg, ...rest){ return _v17Toast(String(msg).replace(/Deleted/g,'Archived').replace(/deleted/g,'archived'), ...rest); };
const _v17Dm = v3DismissMenu;
v3DismissMenu = function(ev, id){ _v17Dm.apply(this, arguments); const m = document.getElementById('v3-dm'); if(!m) return;
  const p = m.querySelector('p'); if(p) p.textContent = 'Why are you archiving this?';
  const go = m.querySelector('[data-v7-dismiss-go]'); if(go) go.textContent = 'Archive'; };
const _v17Dismiss = v3Dismiss;
v3Dismiss = function(id, reason){ _v17Dismiss.apply(this, arguments); const ev = insightActivity[id] && insightActivity[id].events, l = ev && ev[ev.length-1]; if(l && /^deleted this/.test(l.text)) l.text = l.text.replace(/^deleted/,'archived'); v17Archive(); };
const _v17Case = v6Case;
v6Case = function(id){ const c = _v17Case.apply(this, arguments); if(c && c.chip==='Deleted'){ c.chip = 'Archived'; c.text = String(c.text).replace('You deleted this','You archived this'); } return c; };
const _v17Bin = v3OpenBin;
v3OpenBin = function(){ _v17Bin.apply(this, arguments); const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Archived'; v17Archive(); };
const _v17Facts = v10Facts;
v10Facts = function(id){ return String(_v17Facts.apply(this, arguments)).replace(/\bDeleted\b/g,'Archived'); };
const _v17Vis = applyFeedVisibility;
applyFeedVisibility = function(){ const r = _v17Vis.apply(this, arguments); v17Archive(); return r; };
['openInvestigate','refreshInvestigatePanel'].forEach(fn=>{ const prev = window[fn]; if(typeof prev!=='function') return;
  window[fn] = function(){ const r = prev.apply(this, arguments); setTimeout(v17Archive, 0); return r; }; });
v17Archive();
