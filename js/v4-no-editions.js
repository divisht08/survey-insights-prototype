/* ═══ v4 — no editions. One continuous feed per survey.
   Insights are generated on a schedule, but each insight is one card with a version history:
   a new result on the same topic updates the card instead of adding a stale twin.
   Labels: New · Updated · Missed. Insights whose evidence no longer holds leave the feed. ═══ */

// how an insight's figure has moved: from its previous version to the latest one
function v4Versions(id){
  const t = FOLLOW_TRACK[id];
  const eds = EDITIONS.slice().reverse().filter(e=>e.ids.includes(id));   // oldest first
  return eds.map(e=>{ const r = t ? t.rows.find(x=>x.ed===e.short) : null; return {ed:e.short, val:r ? r.val : null, ev:r ? r.ev : null}; });
}
const v4Num = v=>{ const m = String(v||'').replace('−','-').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; };
function v4Change(id){
  const v = v4Versions(id).filter(x=>x.val!==null);
  if(v.length<2) return null;
  const a = v[v.length-2], b = v[v.length-1];
  if(a.val===b.val) return null;
  const na = v4Num(a.val), nb = v4Num(b.val); if(na===null || nb===null) return null;
  const d = nb - na, pct = /%/.test(b.val);
  const txt = (d>0?'+':'−') + (pct ? Math.abs(d).toFixed(0)+' pts' : Math.abs(d).toFixed(Math.abs(d)<1?2:1));
  return {from:a.val, to:b.val, since:a.ed, d, txt};
}
// one label at most: New → Updated → Missed
function v4Label(id){
  if(firstEditionMode) return null;
  if(streakOf(id)===1) return 'new';
  // never opened since it appeared: Missed, even if its figure has moved since (you never saw the old figure)
  if(awayMode && !openedIds.has(id)) return 'missed';
  if(v4Change(id)) return 'upd';
  return null;
}
const V4_LBL = {new:['new','New','First found in the latest update'], upd:['upd','Updated','The figure changed in the latest update'], missed:['missed','Missed','Found while you were away, and you have not opened it']};
renderFreshness = function(){
  document.querySelectorAll('#card-grid .insight-card').forEach(card=>{
    const id = card.dataset.id;
    card.querySelectorAll('[data-fresh],[data-fresh-tag],[data-was],[data-v4-since]').forEach(e=>e.remove());
    const l = v4Label(id); card.dataset.v4Label = l || '';
    const group = card.querySelector('[data-el="kind-row"]');
    if(l && group){ const [cls,txt,title] = V4_LBL[l]; const t = document.createElement('span'); t.className = 'fresh-tag '+cls; t.dataset.freshTag = cls; t.textContent = txt; t.title = title; group.appendChild(t); }
    const ch = v4Change(id), stat = card.querySelector('[data-el="stat"]');
    if(ch && stat){ const p = document.createElement('p'); p.className = 'ic-since'; p.dataset.v4Since = '1'; p.title = ch.from + ' on ' + ch.since;
      p.innerHTML = `${ch.d>0?'▲':'▼'} ${ch.txt}<small>since ${ch.since}</small>`; stat.appendChild(p); }
  });
};

// no past-edition views: the update line has no "Past updates", and old links open the latest version
renderEditionBar = function(){
  updateFeedNeed();
  const el = document.getElementById('edition-bar'); if(!el) return;
  const sch = EDITION_SCHEDULE[editionFreq], nextShort = (pendingFreq ? EDITION_SCHEDULE[pendingFreq].next : sch.next).split(',')[0];
  el.innerHTML = `<div class="v3-upd" data-edition-bar data-v3-upd style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:#5f6672;margin:0 0 10px">
      <span data-edition-tag>${firstEditionMode ? 'Your first insights · ' : ''}Updated <b style="color:#1f2329">${EDITIONS[0].short}</b> · next update ${nextShort}</span></div>
    ${pendingFreq ? `<div class="ed-pending" data-pending>Switching to ${pendingFreq.toLowerCase()} updates from ${EDITION_SCHEDULE[pendingFreq].next}. Nothing changes until then.</div>` : ''}`;
};
viewEdition = function(){ viewingEdition = CURRENT_EDITION; snapOpenId = null; feedView = feedView==='closed' ? 'closed' : 'active'; renderEditionBar(); applyFeedVisibility(); };
openSnapshot = function(id){ if(inCurrentEdition(id) && document.querySelector('#card-grid .insight-card[data-id="'+id+'"]')) openInvestigate(id); else v4OpenEnded(id); };

// the drill-down gets a collapsed History: every version of this insight
function v4HistoryHTML(id){
  const v = v4Versions(id); if(!v.length) return '';
  const rows = v.slice().reverse().map((x,i,arr)=>{
    const prev = arr[i+1], what = !prev ? 'First found' : (x.val!==null && prev.val!==null && x.val!==prev.val) ? 'Updated' : 'Unchanged';
    return `<tr><td>${x.ed}</td><td class="num">${x.val!==null ? x.val : '—'}</td><td>${what}</td></tr>`; }).join('');
  return `<details class="id-sect v3-col" data-v4-history><summary>History · ${v.length} ${v.length===1?'version':'versions'}</summary>
    <table class="v3-tbl"><thead><tr><th>Update</th><th>Figure</th><th></th></tr></thead><tbody>${rows}</tbody></table>
    <p class="v3-note" style="margin-top:6px">A new result on the same topic updates this insight instead of adding a new one.</p></details>`;
}
const _v4Inv = investigateHTML;
investigateHTML = function(srcBtn){
  const html = _v4Inv(srcBtn);
  const card = srcBtn ? srcBtn.closest('.insight-card') : null, id = card ? card.dataset.id : null;
  const h = id ? v4HistoryHTML(id) : ''; if(!h) return html;
  const t = document.createElement('template'); t.innerHTML = html;
  const sum = t.content.querySelector('[data-v3-summary]'); if(!sum) return html;
  sum.insertAdjacentHTML('afterend', h);
  const out = document.createElement('div'); out.appendChild(t.content); return out.innerHTML;
};
const _v4Open = openInvestigate;
openInvestigate = function(el){ _v4Open(el); if(awayMode) setTimeout(()=>{ renderFreshness(); }, 0); };

// Insights whose evidence no longer holds leave the feed; they are listed once, at the end
function v4EndedIds(){
  const now = EDITIONS[0].ids, seen = new Set();
  EDITIONS.slice(1).forEach(e=>e.ids.forEach(i=>{ if(!now.includes(i) && !SUPPRESSED.find(s=>s.id===i)) seen.add(i); }));
  return [...seen];
}
function v4EndedInfo(id){
  const last = EDITIONS.find(e=>e.ids.includes(id)), idx = EDITIONS.indexOf(last), endedOn = idx>0 ? EDITIONS[idx-1].short : '';
  const t = FOLLOW_TRACK[id];
  const why = t && t.why ? t.why : 'It no longer meets the evidence rules.';
  const title = (SNAP_EXTRA[id] && SNAP_EXTRA[id].title) || metaOf(id).title;
  return {last:last ? last.short : '', endedOn, why, title};
}
function v4RenderEnded(){
  let el = document.getElementById('v4-ended');
  const grid = document.getElementById('card-grid'); if(!grid) return;
  if(!el){ el = document.createElement('details'); el.id = 'v4-ended'; el.className = 'v4-ended'; grid.parentNode.insertBefore(el, grid.nextSibling); }
  const ids = v4EndedIds();
  el.style.display = (ids.length && feedView==='active' && v3Scope==='store' && !firstEditionMode) ? '' : 'none';
  el.innerHTML = `<summary>No longer supported · ${ids.length}<span>Insights that dropped out because the evidence stopped holding</span></summary>` + ids.map(id=>{ const x = v4EndedInfo(id);
    return `<button class="v4-row" data-v4-ended="${id}" onclick="v4OpenEnded('${id}')"><span class="t">${x.title}</span><span class="m">Ended ${x.endedOn}${followed[id] ? ' · <b>Following</b>' : ''}</span></button>`; }).join('');
}
function v4OpenEnded(id){
  const x = v4EndedInfo(id), extra = SNAP_EXTRA[id] || {};
  const body = (investigateContent[id] || extra.body || '');
  const panel = document.getElementById('investigate-panel');
  document.querySelectorAll('.insight-card').forEach(c=>c.classList.remove('active'));
  document.getElementById('insights-split').classList.add('has-panel');
  panelUserClosed = false;
  panel.innerHTML = `<div class="flex items-center justify-between px-5 py-4 border-b border-line2"><div class="min-w-0"><p class="text-[10.5px] font-600 uppercase tracking-wide text-txt-4 mb-0.5">${(TYPE_LABEL[extra.type]||metaOf(id).category||'')}${extra.tag ? ' · '+extra.tag : ''}</p><p class="text-[14.5px] font-600 text-txt-1 leading-snug">${x.title}</p></div>
      <button class="iconbtn flex-shrink-0" data-close-panel onclick="closeInvestigatePanel(true)">${V3_SVG.x}</button></div>
    <div class="px-5 pt-3.5 v3-acts"><button class="btn-sec${followed[id]?' on':''}" data-v3-follow="${id}" onclick="v3FollowToggle('${id}');v4OpenEnded('${id}');v4RenderEnded()">${followed[id] ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button></div>
    <div class="px-5 py-4 v3d" data-v3-id="${id}">
      <div class="v4-endnote" data-v4-endnote><b>No longer supported since ${x.endedOn}.</b> ${x.why} ${followed[id] ? 'You follow it, so it keeps being recalculated and shows in Followed.' : 'Follow it to keep it recalculated after it leaves the feed.'}</div>
      ${extra.illustrative ? `<div class="illus-banner"><span><b style="color:#42474f">Illustrative example.</b> Figures are placeholders.</span></div>` : ''}
      ${v4HistoryHTML(id).replace('<details class="id-sect v3-col"','<details open class="id-sect v3-col"')}
      ${body ? `<div class="id-sect"><p class="eyebrow">As last published, ${x.last}</p>${body}</div>` : ''}
    </div>`;
  panel.classList.remove('hidden'); panel.scrollTop = 0;
}

// New & missed: one chip in the filter row
const _v4Apply = applyFeedVisibility;
applyFeedVisibility = function(){
  renderFreshness();
  _v4Apply();
  const cards = [...document.querySelectorAll('#card-grid .insight-card')];
  // New, Updated and Missed are separate filters: they answer different questions
  const cnt = {new:0, upd:0, missed:0};
  cards.forEach(c=>{ if(c.dataset.state==='active' && c.dataset.v4Label) cnt[c.dataset.v4Label]++; });
  if(v4Status && !cnt[v4Status]) v4Status = null;
  if(feedView==='active' && v4Status) cards.forEach(c=>{ if(c.dataset.v4Label!==v4Status) c.style.display = 'none'; });
  const row = document.querySelector('[data-v3-types]');
  const chips = Object.keys(cnt).filter(k=>cnt[k]).map(k=>`<button class="v3-chip v4-st ${k}${v4Status===k?' on':''}" data-v4-status="${k}" onclick="v4SetStatus('${k}')">${V4_LBL[k][1]}<span class="n">${cnt[k]}</span></button>`).join('');
  if(row && feedView==='active' && chips) row.insertAdjacentHTML('afterbegin', chips + '<span class="v4-sep"></span>');
  if(row && v4Status){ const all = row.querySelector('[data-v3-type="all"]'); if(all && v3Type==='all') all.classList.remove('on'); }
  if(feedView==='active'){
    document.querySelectorAll('#card-grid .v3-sec').forEach(h=>{ const lvl = h.dataset.sec; const n = cards.filter(c=>c.dataset.priority===lvl && c.style.display!=='none').length; if(!n) h.style.display = 'none'; else { h.style.display = ''; const s = h.querySelector('.n'); if(s) s.textContent = n; } });
    const label = document.getElementById('feed-count-label');
    const vis = cards.filter(c=>c.style.display!=='none'), n = vis.filter(c=>c.dataset.priority==='high').length;
    if(label && v4Status) label.innerHTML = vis.length + ' ' + V4_LBL[v4Status][1].toLowerCase() + (n ? ` <span style="color:#c5221f;font-weight:600">· ${n} need${n===1?'s':''} attention</span>` : '');
  }
  v4RenderEnded();
};
var v4Status = null;   // null | 'new' | 'upd' | 'missed'
function v4SetStatus(k){ v4Status = v4Status===k ? null : k; applyFeedVisibility(); }
const _v4SetType = v3SetType;
v3SetType = function(t){ v4Status = null; _v4SetType(t); };

// back after time away: what is new, updated and missed — no edition list
renderCatchup = function(){
  const el = document.getElementById('catchup');
  if(!awayMode){ el.classList.add('hidden'); el.innerHTML = ''; return; }
  const ids = EDITIONS[0].ids.filter(i=>document.querySelector('#card-grid .insight-card[data-id="'+i+'"]'));
  const c = {new:0, upd:0, missed:0}; ids.forEach(i=>{ const l = v4Label(i); if(l) c[l]++; });
  el.classList.remove('hidden');
  el.innerHTML = `<div class="catchup" data-catchup><div class="cu-head"><b>Welcome back</b><span>· since your last visit on ${LAST_VISIT}: ${c.new} new, ${c.upd} updated, ${c.missed} missed</span>
      <button class="cu-x" title="Dismiss" onclick="dismissCatchup()">×</button></div>
    <div class="flex gap-2" style="margin-top:8px">${['new','upd','missed'].filter(k=>c[k]).map(k=>`<button class="btn-sec" data-v4-catchup="${k}" onclick="v4Status='${k}';applyFeedVisibility()">See ${c[k]} ${V4_LBL[k][1].toLowerCase()}</button>`).join('')}</div></div>`;
};
const _v4Away = setAway;
setAway = function(on){ _v4Away(on); renderFreshness(); v4Status = null; applyFeedVisibility(); renderCatchup(); };

// email links from older digests: open the latest version, and say what changed
showExpiredEditionLanding = function(){
  showEmailBanner(`Opened from your email · <b>Store Manager weekly digest</b> · sent Sun 21 Sep 2025. Insights have been updated many times since, so you're seeing the latest version of each. Your comments, follows and action plans are unchanged.`);
  const bn = document.getElementById('email-landing-banner'); if(bn) bn.dataset.expiredEdition = '1';
  window.scrollTo(0,0);
};

// wording: the product no longer talks about editions
const V4_WORDS = [[/\bEditions\b/g,'Updates'],[/\beditions\b/g,'updates'],[/\bEdition\b/g,'Update'],[/\bedition\b/g,'update']];
function v4Reword(root){
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode:n=>{ const p = n.parentNode; if(!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT; return /dition/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; }});
  const ns = []; while(w.nextNode()) ns.push(w.currentNode);
  ns.forEach(n=>{ let v = n.nodeValue; V4_WORDS.forEach(([re,r])=>{ v = v.replace(re, r); }); if(v!==n.nodeValue) n.nodeValue = v; });
}
let v4RewordQueued = false;
new MutationObserver(()=>{ if(v4RewordQueued) return; v4RewordQueued = true; requestAnimationFrame(()=>{ v4RewordQueued = false; v4Reword(document.body); }); }).observe(document.body, {subtree:true, childList:true, characterData:true});

(function v4Init(){
  const b = document.querySelector('[data-state="away"]'); if(b) b.textContent = 'Returning · after time away';
  const q = document.querySelector('[data-state="quiet"]'); if(q) q.textContent = 'Quiet update · nothing new';
  const x = document.querySelector('[data-state="expired-link"]'); if(x) x.textContent = 'Old email link';
  renderEditionBar(); renderFreshness(); applyFeedVisibility(); v4Reword(document.body);
})();
