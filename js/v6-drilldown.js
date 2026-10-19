/* ═══ v6 — drill-down: says which case you are looking at (New, Updated, Missed, Followed,
   no longer significant, dismissed) and uses a cleaner layout:
   header with chips → case note → key-figure strip → section cards → pinned Copilot + action bar. ═══ */

/* ── 1. Wording that has to match the case ── */
// INS-05 was first found on Sun 20 Sep, so after that update it is no longer "new this period"
if(typeof PRIORITY!=='undefined' && PRIORITY['INS-05']) PRIORITY['INS-05'].reason = 'A sharp break from the normal rate, and the respondents involved scored very low.';
function v6FixCardText(){
  const b = document.querySelector('#card-grid .insight-card[data-id="INS-05"] [data-el="basis"]');
  if(b && /New this period/.test(b.firstChild ? b.firstChild.textContent : '')) b.firstChild.textContent = '14–15 Sep vs the previous 89 days';
}
// Missed = first found after your last visit, and never opened. A followed insight cannot be missed: following it means you saw it.
const V6_MON = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
function v6Day(s){ const m = String(s).match(/(\d{1,2})\s+([A-Z][a-z]{2})/); return m ? V6_MON[m[2]]*40 + (+m[1]) : 0; }
function v6FoundAfterLastVisit(id){ return v6Day(v6FirstFound(id)) > v6Day(LAST_VISIT); }
const _v6Label = v4Label;
v4Label = function(id){
  const l = _v6Label(id);
  if(l==='missed' && (followed[id] || !v6FoundAfterLastVisit(id))) return v4Change(id) ? 'upd' : null;
  return l;
};

const v6Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function v6FirstFound(id){ const v = v4Versions(id); return v.length ? v[0].ed : EDITIONS[0].short; }
function v6NowVal(id){
  const t = FOLLOW_TRACK[id], r = t ? [...t.rows].reverse().find(x=>/\d/.test(x.val)) : null;
  if(r) return r.val;
  const c = document.querySelector(`#card-grid .insight-card[data-id="${id}"] .ic-num`); return c ? c.textContent.trim() : '';
}
function v6FollowLine(id){
  const f = followed[id]; if(!f) return '';
  const now = v6NowVal(id), then = f.atVal;
  const moved = then && now && then!==now ? ` ${then} when you followed, ${now} now.` : (then ? ` No change since you followed at ${then}.` : '');
  return `You follow this since ${f.on || 'today'}.${moved}`;
}
// the one line at the top of the drill-down that says why you are seeing this card, in this state
function v6Case(id){
  if(dismissedFeed.has(id)){ const r = (insightFeedback[id] && insightFeedback[id].reasons || [])[0]; const l = (V3_REASONS.find(x=>x[0]===r)||[])[1];
    return {k:'closed', chip:'Dismissed', text:`You dismissed this${l ? ' — ' + l.toLowerCase() : ''}. It stays out of your feed unless you restore it.`}; }
  if(doneFeed.has(id)) return {k:'closed', chip:'Done', text:'You marked this done. It stays out of your feed unless you restore it.'};
  if(document.querySelector(`#card-grid .v5-fol[data-id="${id}"]`)){
    const st = followState(id), thin = st.ev==='thin';
    return {k:'nosig', chip: thin ? 'Too few responses' : 'No longer significant',
      text: thin ? `Too few responses in the latest update to confirm this, so the last reliable figure is shown. It stays in your feed because you follow it. ${v6FollowLine(id)}`
                 : `No longer significant in the latest update. It stays in your feed because you follow it, and keeps updating. ${v6FollowLine(id)}`}; }
  if(!inCurrentEdition(id) && !followed[id]){ const x = v4EndedInfo(id); return {k:'ended', chip:'No longer supported', text:`No longer supported since ${x.endedOn}. ${x.why}`}; }
  const l = v4Label(id), ch = v4Change(id), first = v6FirstFound(id), fl = followed[id] ? ' ' + v6FollowLine(id) : '';
  if(l==='new') return {k:'new', chip:'New', text:`New in the latest update (${EDITIONS[0].short}). This is the first time it was found.${fl}`};
  if(l==='missed') return {k:'missed', chip:'Missed', text:`First found on ${first}, after your last visit on ${LAST_VISIT}, and you have not opened it yet. Still significant in the latest update.${ch ? ` It was ${ch.from} then and is ${ch.to} now.` : ' The figure has not changed since.'}`};
  if(l==='upd') return {k:'upd', chip:'Updated', text:`Updated in the latest update: ${ch.from} on ${ch.since}, ${ch.to} now.${fl}`};
  if(followed[id]) return {k:'fol', chip:'Following', text:v6FollowLine(id) + ' Still significant in the latest update.'};
  return {k:'seen', chip:'', text:`Still significant in the latest update and unchanged since you last saw it. First found on ${first}.`};
}

/* ── 2. Layout ── */
const V6_HINT = {'The evidence':'What the data shows', 'Customer voice':'Examples, not the full basis', 'Next steps':'In priority order', 'Activity and comments':'Visible to everyone with access',
  'Activity':'Visible to everyone with access', 'How each factor relates to satisfaction':'Share of the variation', 'Where to act first':'Association × score', 'Since you followed':'How the figure moved'};
const V6_PRIO = {high:['high','Needs attention'], med:['med','Worth a look'], pos:['pos','Bright spot'], low:['low','For awareness']};
// change since the previous update: from the per-update figures, so followed-only insights work too
function v6Change(id){
  const t = FOLLOW_TRACK[id];
  if(t){
    const rows = t.rows.filter(r=>/\d/.test(r.val));
    if(rows.length<2){ const v = v4Versions(id); return v.length>1 ? {none:true, since:v[v.length-2].ed} : {none:true, first:true}; }
    const a = rows[rows.length-2], b = rows[rows.length-1], na = v4Num(a.val), nb = v4Num(b.val);
    const stale = t.rows[t.rows.length-1] !== b;   // the latest update had no reliable figure
    if(na===null || nb===null || na===nb) return {none:true, since:a.ed, stale};
    const d = nb - na, pct = /%/.test(b.val);
    return {d, txt:(d>0?'+':'−') + (pct ? Math.abs(d).toFixed(0)+' pts' : Math.abs(d).toFixed(Math.abs(d)<1?2:1)), since:a.ed, stale};
  }
  const v = v4Versions(id);
  return {none:true, first:v.length<=1, since:v.length>1 ? v[v.length-2].ed : ''};
}
function v6Metrics(id){
  const isFol = !!document.querySelector(`#card-grid .v5-fol[data-id="${id}"]`);
  const card = isFol ? null : document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  const meta = INSIGHT_META[id] || {}, extra = (typeof SNAP_EXTRA!=='undefined' && SNAP_EXTRA[id]) || {};
  const num = card && card.querySelector('.ic-num'), unit = card && card.querySelector('.ic-unit'), delta = card && card.querySelector('.ic-delta');
  const t = FOLLOW_TRACK[id], last = t ? t.rows[t.rows.length-1] : null;
  const keyVal = num ? num.textContent.trim() : (v6NowVal(id) || '—');
  let keySub = unit ? unit.textContent.trim() : (extra.unit || meta.statSub || '');
  if(delta){ const d0 = delta.childNodes[0] ? delta.childNodes[0].textContent.trim() : '', sm = delta.querySelector('small'); keySub += ` · ${d0} ${sm ? sm.textContent : ''}`; }
  if(last && !/\d/.test(last.val)){ const r = [...t.rows].reverse().find(x=>/\d/.test(x.val)); if(r) keySub = `last reliable figure, ${r.ed}`; }
  const ch = v6Change(id);
  const chVal = ch.none ? (ch.first ? 'First update' : 'No change') : `${ch.d>0?'▲':'▼'} ${ch.txt}`;
  const chSub = ch.none ? (ch.first ? 'nothing to compare yet' : `since ${ch.since}`) : `since ${ch.since}${ch.stale ? ' (last reliable)' : ''}`;
  const ev = isFol ? (last && last.ev==='thin' ? ['warn','Too few responses'] : ['muted','Not significant']) : ['pos','Significant'];
  const numColor = num && num.getAttribute('style') ? num.getAttribute('style') : '';
  return `<div class="v6-metrics" data-v6-metrics>
      <div><span>Key figure</span><b style="${numColor}">${v6Esc(keyVal)}</b><small title="${v6Esc(keySub)}">${v6Esc(keySub)}</small></div>
      <div><span>Since the last update</span><b>${v6Esc(chVal)}</b><small>${v6Esc(chSub)}</small></div>
      <div><span>Evidence</span><b class="${ev[0]}">${ev[1]}</b><small>in the latest update</small></div></div>`;
}
function v6SectionHead(sect){
  const eb = sect.querySelector(':scope > .eyebrow'); if(!eb) return;
  const name = eb.textContent.trim().replace(/^(\w)(.*)$/,(m,a,b)=>a.toUpperCase()+b.toLowerCase());
  const known = Object.keys(V6_HINT).find(k=>k.toLowerCase()===eb.textContent.trim().toLowerCase());
  const head = document.createElement('div'); head.className = 'v6-sh';
  head.innerHTML = `<b>${v6Esc(known || name)}</b><span>${known ? V6_HINT[known] : ''}</span>`;
  eb.replaceWith(head);
}
function v6NextSteps(sect){
  sect.querySelectorAll('.id-means').forEach(m=>{
    const host = m.querySelector(':scope > div'); if(!host) return;
    const cta = host.querySelector('.v3-cta'); const btn = cta ? cta.innerHTML : '';
    if(cta) cta.remove();
    const b = host.querySelector('b'); const title = b ? b.textContent.replace(/\.$/,'') : 'Step';
    if(b) b.remove();
    m.className = 'v6-row'; m.innerHTML = `<span class="ri">${V3_SVG.agent.replace('M9 3h6M12 3v3m-6 4a6 6 0 0112 0v5a3 3 0 01-3 3H9a3 3 0 01-3-3v-5zm3 2h.01M15 12h.01M9 21h6','M13 10V3L4 14h7v7l9-11h-7z')}</span><div class="rt"><b>${v6Esc(title)}</b><p>${host.innerHTML.trim()}</p></div><div class="rb">${btn}</div>`;
  });
  sect.querySelectorAll('.v3-agent').forEach(a=>a.classList.add('v6-row','agent'));
}
function v6Voice(sect){
  sect.querySelectorAll('.v3-q').forEach(q=>{
    const sent = q.querySelector('.v3-sent'); if(sent){ sent.remove(); q.appendChild(sent); sent.classList.add('v6-sent'); }
  });
}
function v6Footer(id, opts){
  const isClosed = dismissedFeed.has(id) || doneFeed.has(id);
  const fol = followed[id];
  const primary = isClosed ? `<button class="v6-pri" data-panel-reopen onclick="reopenInsight('${id}')">Restore to feed</button>`
    : actionPlans[id] ? `<button class="v6-pri" data-v6-plan onclick="openActionPlan('${id}')">Open action plan</button>`
    : `<button class="v6-pri" data-v6-plan onclick="openActionPlan('${id}')">Create action plan</button>`;
  return `<div class="v6-bar" data-v6-bar>
      ${isClosed ? '' : `<button class="v6-b${fol?' on':''}" data-v3-follow="${id}" onclick="v3FollowToggle('${id}')">${fol ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>`}
      <button class="v6-b" data-v6-share onclick="openShareModal('${id}')">Share</button>
      ${opts.full ? `<button class="v6-b" data-v3-full onclick="v3Full(this)">Open full page</button>` : ''}
      ${isClosed ? '' : fol ? `<button class="v6-b" data-panel-done onclick="doneFromFollowed('${id}')">Mark as done</button>` : `<button class="v6-b" data-v3-dismiss-panel="${id}" onclick="v3DismissMenu(event,'${id}')">Dismiss</button>`}
      ${primary}</div>`;
}
// reshape any drill-down (feed insight, followed-only, ended) into the same layout
function v6Shape(html, id, opts){
  opts = opts || {};
  const t = document.createElement('template'); t.innerHTML = html;
  const f = t.content, kids = [...f.children];
  const head = kids[0], acts = kids[1] && kids[1].querySelector('button') && !kids[1].classList.contains('py-4') ? kids[1] : null;
  const body = kids.find(n=>n.classList && n.classList.contains('py-4') && !n.querySelector('[data-close-panel]'));
  const prioP = kids.find(n=>n.tagName==='P' && n.querySelector('.prio')) || (body && body.querySelector('[data-v3-summary] p.text-\\[12px\\]'));
  const card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  const meta = INSIGHT_META[id] || {}, extra = (typeof SNAP_EXTRA!=='undefined' && SNAP_EXTRA[id]) || {};
  const title = card ? card.querySelector('[data-el="title"], .ic-title').textContent : (extra.title || meta.title || '');
  const sumEl = card && card.querySelector('[data-el="summary"], .ic-sum');
  const summary = sumEl ? sumEl.textContent : (meta.summary || extra.summary || '');
  const kindTxt = card ? ((card.querySelector('[data-el="kind-text"]') || card.querySelector('.ic-type')) || {}).textContent : (meta.category || '');
  const lvl = (PRIORITY[id] && PRIORITY[id].level) || (card && card.dataset.priority) || extra.prio || 'low';
  const P = V6_PRIO[lvl] || V6_PRIO.low, cs = v6Case(id);
  const reason = PRIORITY[id] ? PRIORITY[id].reason : '';
  const closeBtn = head && head.querySelector('[data-close-panel]');
  const closeAttr = closeBtn ? closeBtn.getAttribute('onclick') : 'closeInvestigatePanel(true)';
  const newHead = document.createElement('div'); newHead.className = 'v6-head'; newHead.dataset.v6Head = id;
  newHead.innerHTML = `<div class="v6-chips"><span class="v6-chip prio ${P[0]}" title="${v6Esc(reason)}">${P[1]}</span><span class="v6-chip">${v6Esc((kindTxt||'').trim())}</span>${cs.chip ? `<span class="v6-chip st ${cs.k}" data-v6-case-chip>${cs.chip}</span>` : ''}
      <span class="sp"></span>${opts.full ? `<button class="iconbtn" title="Open full page" onclick="v3Full(this)">${V3_SVG.full}</button>` : ''}<button class="iconbtn" data-close-panel onclick="${closeAttr}">${V3_SVG.x}</button></div>
    <h3>${v6Esc(title)}</h3>${summary ? `<p class="v6-sum">${v6Esc(summary)}</p>` : ''}`;
  if(head) head.replaceWith(newHead); else f.prepend(newHead);
  if(acts) acts.remove();
  if(prioP && prioP.parentNode) prioP.remove();
  kids.filter(n=>n.classList && n.classList.contains('ret-note')).forEach(n=>n.remove());
  if(body){
    body.classList.add('v3d','v6-body'); body.dataset.v3Id = id;
    const intro = document.createElement('div');
    intro.innerHTML = `<div class="v6-case ${cs.k}" data-v6-case="${cs.k}">${v6Esc(cs.text)}</div>${v6Metrics(id)}${reason ? `<p class="v6-why"><b>Why it is ranked ${P[1].toLowerCase()}:</b> ${v6Esc(reason)}</p>` : ''}`;
    // "What we found": the long summary paragraph, as its own section
    const sumBox = body.querySelector('[data-v3-summary]');
    const lede = (sumBox && sumBox.querySelector('.id-lede')) || body.querySelector(':scope > .id-lede');
    const found = document.createElement('div'); found.className = 'id-sect v6-found'; found.dataset.v3Summary = '1';
    found.innerHTML = `<div class="v6-sh"><b>What we found</b><span>Summary</span></div>`;
    if(lede) found.appendChild(lede);
    if(sumBox) sumBox.replaceWith(found); else body.insertBefore(found, body.firstChild);
    // nothing more to say than the header already does: drop the section
    if(!lede || lede.textContent.trim()===summary.trim()){ found.remove(); if(lede && sumBox===null) lede.remove(); }
    // old case notes are replaced by the one case line
    body.querySelectorAll('[data-fol-why],[data-v4-endnote]').forEach(n=>n.remove());
    body.insertBefore(intro, body.firstChild); intro.replaceWith(...intro.childNodes);
    // followed-only and ended panels: their "since you followed" and history become plain sections
    body.querySelectorAll('[data-since-followed]').forEach(s=>s.classList.add('id-sect'));
    body.querySelectorAll('.id-sect').forEach(s=>{
      v6SectionHead(s);
      const h = s.querySelector(':scope > .v6-sh b'), name = h ? h.textContent : '';
      if(name==='Next steps') v6NextSteps(s);
      if(name==='Customer voice') v6Voice(s);
    });
    body.querySelectorAll('details.v3-col, details[data-v4-history]').forEach(d=>d.classList.add('v6-det'));
    const illus = body.querySelector('.illus-banner'); if(illus){ illus.classList.add('v6-illus'); }
  }
  // pinned bottom: suggestions, Ask Copilot, action bar
  let dock = f.querySelector('[data-v3-dock]');
  if(!dock){
    dock = document.createElement('div'); dock.className = 'v3-dock'; dock.id = 'v3-dock-'+id; dock.dataset.v3Dock = id;
    dock.innerHTML = `<div class="dthread"><div id="copilot-thread-${id}" class="space-y-2">${copilotThreadHTML(id)}</div></div>${suggestedQuestionsHTML(id)}
      <div class="flex items-center gap-2"><input id="copilot-input-${id}" class="flex-1 text-[13px] border border-line rounded-md px-3 h-9 focus:outline-none" placeholder="Ask Copilot about this insight…" onkeydown="if(event.key==='Enter')askCopilot('${id}')"><button class="btn-pri" onclick="askCopilot('${id}')">Send</button></div>`;
    f.appendChild(dock);
  }
  dock.classList.add('v6-dock');
  const dh = dock.querySelector('.dh'); if(dh) dh.classList.add('v6-dh');
  const send = [...dock.querySelectorAll('button.btn-pri')].pop();
  if(send){ send.className = 'v6-send'; send.title = 'Send'; send.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5l18-8.5L3 3.5v6.6l12 1.9-12 1.9z"/></svg>'; }
  dock.insertAdjacentHTML('beforeend', v6Footer(id, opts));
  const out = document.createElement('div'); out.appendChild(f); return out.innerHTML;
}
// feed and Followed/Shared drill-downs
const _v6Inv = investigateHTML;
investigateHTML = function(srcBtn){
  const card = srcBtn ? srcBtn.closest('.insight-card') : null, id = card ? card.dataset.id : null;
  const html = _v6Inv(srcBtn);
  return id ? v6Shape(html, id, {full:true}) : html;
};
// followed insights that are no longer significant
v5OpenFollowed = function(id){
  const card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  if(typeof openedIds!=='undefined') openedIds.add(id);
  panelUserClosed = false;
  document.getElementById('insights-split').classList.add('has-panel');
  document.querySelectorAll('.insight-card').forEach(c=>c.classList.remove('active'));
  if(card) card.classList.add('active');
  const panel = document.getElementById('investigate-panel');
  const raw = followOnlyPanelHTML(id, 'feed').replace(`closeTabPanel('feed')`, 'closeInvestigatePanel(true)')
    .replace(/,? ?and (it )?is not in the feed/g, '').replace(/whether or not it is in the feed/g, 'for as long as you follow it').replace(/not in the feed/g, 'kept because you follow it');
  panel.innerHTML = v6Shape(raw, id, {full:true});
  panel.classList.remove('hidden'); panel.scrollTop = 0;
};
// insights that left the feed
const _v6Ended = v4OpenEnded;
v4OpenEnded = function(id){
  _v6Ended(id);
  const panel = document.getElementById('investigate-panel');
  panel.innerHTML = v6Shape(panel.innerHTML, id, {full:false});
};
// keep the card wording in step after any re-render
const _v6Fresh = renderFreshness;
renderFreshness = function(){ v6FixCardText(); _v6Fresh(); };

// welcome back line: only the counts that are not zero
const _v6Catch = renderCatchup;
renderCatchup = function(){
  _v6Catch();
  const sp = document.querySelector('[data-catchup] .cu-head span'); if(!sp) return;
  const c = {new:0, upd:0, missed:0};
  EDITIONS[0].ids.forEach(i=>{ if(document.querySelector('#card-grid .insight-card[data-id="'+i+'"]')){ const l = v4Label(i); if(l) c[l]++; } });
  const parts = [['new','new'],['upd','updated'],['missed','missed']].filter(([k])=>c[k]).map(([k,w])=>c[k]+' '+w);
  sp.textContent = `· since your last visit on ${LAST_VISIT}: ${parts.join(', ') || 'nothing new'}`;
};
