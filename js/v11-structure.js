/* ═══ v11 — one structure for every drill-down, wherever it opens (feed, Followed, Shared, other surveys, Day 50 area, Deleted)
   Header: chips · title · Follow / Share / action plan / Delete (or Mark as done when followed)
   [case line when there is something to say: followed, no longer significant, shared with you, deleted]
   1 What happened · 2 Evidence · 3 What customers say · 4 Recommended actions (agents last)
   5 Since you followed (only when followed) · 6 Activity and comments · Evidence limitations · How this insight was found
   Facts column on the right · Copilot pinned at the bottom. ═══ */

const V11_ORDER = ['What happened','Evidence','What customers say','Recommended actions','Since you followed','Activity and comments'];

/* sample comments for insights that had none (sample content, see "About the data") */
const V11_QUOTES = {
  'FOL-01':[['neg','Weekend checkout','Only one till open on Saturday and the queue went round the store.'],['pos','Weekend checkout','Much quicker at the till this weekend.']],
  'FOL-02':[['neg','Fitting-room help','First time here and nobody offered to help with sizes.'],['pos','Fitting-room help','The staff brought me another size without me asking.']],
  'AM-01':[['neg','Checkout','Twenty minutes at the till with only two counters open.'],['neg','Checkout','The queue was long and the cashier had to call for help.']],
  'AM-02':[['neg','Fitting rooms','Waited ages for a fitting room, all of them were full.'],['neg','Fitting rooms','Gave up on trying things on because of the queue.']],
  'AM-03':[['neg','Cleanliness','Clothes on the fitting-room floor again.'],['pos','Cleanliness','The store was tidy and the fitting rooms were clean.']],
  'AM-04':[['pos','Overall','Always a good experience at this branch.'],['pos','Staff','Staff are friendly and know where everything is.']],
  'AM-05':[['neg','Parking','Could not find parking at the mall, nearly left.'],['neg','Parking','Parking is now paid, which it never was before.']],
  'AM-06':[['neg','Staff, weekend','On Saturday there was no one to ask for help.'],['pos','Staff, weekday','During the week the staff are very helpful.']],
  'AM-07':[['neg','Payment failure','My card did not work at the till.'],['neg','Payment failure','Payment machine was down, had to pay cash.']],
  'AM-08':[['neg','Offer clarity','The sign said 50% off but the till charged full price.'],['neg','Offer clarity','The offer was only for some items but that was not clear.']],
  'AM-09':[['neu','Survey invitation','I never got the survey link on my receipt.'],['neu','Survey invitation','The QR code on the receipt was blank.']],
  'AM-10':[['neg','Pricing','Prices went up again.'],['neg','Pricing','A bit expensive compared to other shops.']],
  'AM-11':[['pos','Loyalty','Members get a better deal, worth joining.'],['pos','Loyalty','The member discount was applied straight away.']],
  'AM-12':[['neg','Store comfort','It was very hot inside the store.'],['neg','Store comfort','The air conditioning was not working.']],
  'AM-13':[['neg','Size availability','They never have my size in this branch.'],['neg','Size availability','Had to order online because my size was missing.']],
  'AM-14':[['neg','Online return','Returning my online order took forever at the till.'],['neg','Online return','Staff did not know how to process an online return.']],
  'AM-15':[['pos','Staff','The staff member was so helpful and kind.'],['pos','Staff','Friendly team, made shopping easy.']],
  'AL-03':[['neg','Late delivery','My order arrived two days after the delivery window.'],['neg','Late delivery','Nobody came in the time slot I booked.']],
  'AL-04':[['neg','Refund delay','Still waiting for my refund after two weeks.'],['neg','Refund delay','The refund took much longer than promised.']]
};
const V11_SENT = {neg:['neg','Negative'], pos:['pos','Positive'], neu:['neu','Neutral']};
const v11Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function v11Quote([s,tag,text]){
  const [cls,label] = V11_SENT[s] || V11_SENT.neu;
  return `<div class="rounded-md p-2.5 v3-q ${cls}" style="background:var(--surface-2);border:1px solid var(--line-soft)"><span class="av ${cls}"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z"></path></svg></span><div class="qb"><div class="qm"><b>Respondent</b><span></span><span>· ${v11Esc(tag)}</span></div>
    <p class="text-[13px] text-txt-1 leading-snug">“${v11Esc(text)}”</p></div><span class="v3-sent ${cls} v6-sent">${label}</span></div>`;
}
const v11Sect = (name, inner, hint)=>`<div class="id-sect" data-v11-sect="${name}"><div class="v6-sh"><b>${name}</b><span>${hint||''}</span></div>${inner}</div>`;
function v11Agents(id, neg){
  const row = (k,n,d)=>`<div class="v6-row agent v9-agent" data-v3-agent="${k}"><span class="ri ag">${V9_ICON.agent}</span><div class="rt"><b>${n}</b><p>${d}</p></div><div class="rb"><button class="btn-sec" data-v9-send-agent="${k}" onclick="v3Agent('${k}','${id}')">Send to agent</button></div></div>`;
  return row('review','Review pack agent','Drafts a one-page summary of this insight for your next review.')
    + (neg ? row('followup','Detractor follow-up agent','Lists the respondents behind this insight who agreed to be contacted, and creates follow-up tasks.') : '')
    + `<p class="v9-hint">Agents are set up in Sprinklr. They prepare drafts and tasks, and nothing is sent until you approve it.</p>`;
}
function v11Method(id){
  const t = (document.querySelector(`#card-grid .insight-card[data-id="${id}"]`)||{dataset:{}}).dataset.type || (INSIGHT_META[id]||{}).type || '';
  return /anomaly/.test(t) ? 'Anomaly detection against the normal daily range' : /driver/.test(t) ? 'Key-driver analysis of the factor ratings' : /recurring|emerging/.test(t) ? 'Text analytics on open comments, compared across periods' : 'Comparison of scores between groups or periods, with a significance test';
}

/* put every drill-down into the same sections, in the same order */
function v11Normalize(html, id){
  const t = document.createElement('template'); t.innerHTML = html;
  const f = t.content, main = f.querySelector('.v10-main'); if(!main){ const b = document.createElement('div'); b.appendChild(f); return b.innerHTML; }
  const c = V10_DRILL[id] || {}, neg = /high|med/.test((PRIORITY[id]||{}).level || (document.querySelector(`#card-grid .insight-card[data-id="${id}"]`)||{dataset:{}}).dataset.priority || '');
  const nameOf = s=>{ const b = s.querySelector(':scope > .v6-sh b'); return b ? b.textContent.trim() : ''; };
  const found = {};
  [...main.querySelectorAll(':scope > .id-sect')].forEach(s=>{
    let n = nameOf(s);
    if(n==='Activity' || n==='Discussion') n = 'Activity and comments';
    if(/^Since you followed/.test(n)) n = 'Since you followed';
    if(n==='Customer voice') n = 'What customers say';
    if(n==='Next steps') n = 'Recommended actions';
    const b = s.querySelector(':scope > .v6-sh b'); if(b) b.textContent = n;
    if(V11_ORDER.includes(n) && !found[n]) found[n] = s; else s.remove();
  });
  // "Since you followed" that arrived as a collapsible becomes a section
  main.querySelectorAll(':scope > details').forEach(d=>{
    const sm = d.querySelector(':scope > summary');
    if(sm && /^Since you followed/.test(sm.textContent.trim())){
      if(!found['Since you followed']){ const s = document.createElement('div'); s.className = 'id-sect'; s.innerHTML = '<div class="v6-sh"><b>Since you followed</b><span>How the figure moved</span></div>';
        sm.remove(); while(d.firstChild) s.appendChild(d.firstChild); found['Since you followed'] = s; }
      d.remove();
    }
  });
  const mk = h=>{ const x = document.createElement('template'); x.innerHTML = h.trim(); return x.content.firstElementChild; };
  if(!found['What happened']) found['What happened'] = mk(v11Sect('What happened', `<p class="id-lede v10-what">${v11Esc(c.what || (INSIGHT_META[id]||{}).summary || '')}</p>`));
  if(c.evidenceHTML){ found['Evidence'] = mk(v11Sect('Evidence', c.evidenceHTML)); found['Evidence'].classList.add('v10-ev'); }
  if(!found['Evidence']) found['Evidence'] = mk(v11Sect('Evidence', `<p class="v10-note" style="margin:0 16px 14px">${v11Esc((V10_DRILL[id]||{}).compares || '')}</p>`));
  if(!found['What customers say']){
    const q = V11_QUOTES[id];
    found['What customers say'] = mk(v11Sect('What customers say', c.voiceHTML ? c.voiceHTML : q ? `<div class="space-y-2">${q.map(v11Quote).join('')}</div><button class="v3-seeall" data-v3-see-all onclick="toast('In the product this lists every comment behind the insight')">See all comments</button>` : `<p class="v10-note" style="margin:0 16px 14px">No comments are matched to this insight.</p>`, 'Examples'));
  }
  if(!found['Recommended actions']){
    found['Recommended actions'] = mk(v11Sect('Recommended actions', (c.actions||[]).map(a=>v10ActionRow(id,a)).join('') + v11Agents(id, neg)));
  } else if(!found['Recommended actions'].querySelector('.v9-agent')){
    found['Recommended actions'].insertAdjacentHTML('beforeend', v11Agents(id, neg));
  }
  if(!found['Activity and comments']){
    found['Activity and comments'] = mk(v11Sect('Activity and comments', `<p class="v3-cmnote">Comments are visible to everyone with access to these insights. Sharing only notifies someone.</p>${typeof renderActivitySection==='function' ? renderActivitySection(id) : ''}`, 'Visible to everyone with access'));
  }
  // the two collapsibles, always both, always last
  let lim = main.querySelector(':scope > details[data-v3-limits]'), how = main.querySelector(':scope > details[data-grounding], :scope > details.how-found');
  [...main.querySelectorAll(':scope > details')].forEach(d=>{ if(d!==lim && d!==how) d.remove(); });
  if(!lim) lim = mk(`<details class="v9-det" data-v3-limits><summary>Evidence limitations</summary><ul class="id-why"><li>Comment themes are matched by AI and can include some unrelated comments.</li><li>Groups with too few responses are left out of comparisons.</li></ul></details>`);
  if(!how) how = mk(`<details class="v9-det" data-grounding><summary>How this insight was found</summary><dl><dt>Method</dt><dd>${v11Method(id)}</dd><dt>Data used</dt><dd>${v11Esc(c.compares || '')}</dd></dl></details>`);
  lim.className = how.className = 'v9-det';
  // rebuild in order; case lines and anything above the first section stay on top
  const lead = [...main.childNodes].filter(n=>n.nodeType===1 && (n.matches('.v6-case,[data-v6-case]') || n.matches('.v11-from')));
  main.innerHTML = '';
  lead.forEach(n=>main.appendChild(n));
  V11_ORDER.forEach(n=>{ const s = found[n]; if(!s) return; if(n==='Since you followed' && !followed[id]) return; s.classList.add('id-sect'); main.appendChild(s); });
  main.appendChild(lim); main.appendChild(how);
  const box = document.createElement('div'); box.appendChild(f); return box.innerHTML;
}
const _v11Shape = v6Shape;
v6Shape = function(html, id, opts){ return v11Normalize(_v11Shape(html, id, opts), id); };

/* insights shared from outside your data (Khalid's KSA spike, Fatima's store) use the same drill-down */
Object.assign(V10_DRILL, {
  'CTY-01': {
    what:'Across KSA, 64 respondents in 9 of 42 stores said their card or phone payment failed at the till on 14–15 Sep, against about 6 mentions a week across the country normally. Your store shows the same two-day spike, with 11 of the 64 mentions, so it is consistent with what was shared.',
    compares:'01 Jun – 23 Sep 2026 vs 14 Feb – 31 May 2026',
    actions:[{who:'', t:'Confirm what happened at your store on 14–15 Sep', d:'Khalid asked each store to check its side.', cta:'plan'},
             {who:'Central Operations', t:'Ask whether one outage explains all 9 stores', d:'If it does, the fix is with the payment provider.', cta:'share'}]
  },
  'SHW-01': {
    what:'At RT SHUWAIKH, waiting for a free fitting room is the most common complaint among detractors this period, mentioned by 41% of them, up 12 points. At your store only 2 of 14 detractor comments mention it, below the 5 needed to call it a pattern, so there is no finding for your store yet.',
    compares:'01 Jun – 23 Sep 2026 vs 14 Feb – 31 May 2026',
    actions:[{who:'', t:'Keep an eye on fitting-room waits at your store', d:'Follow this to see whether your store reaches 5 mentions.', cta:'plan'}]
  }
});
const V11_EXT = {'CTY-01':'sw3', 'SHW-01':'sw4'};
const _v11InCur = inCurrentEdition;
inCurrentEdition = function(id){ return V11_EXT[id] ? true : _v11InCur(id); };
const _v11Case = v6Case;
v6Case = function(id){
  const sid = V11_EXT[id], s = sid && sharedWithMe.find(x=>x.id===sid);
  if(s && !dismissedFeed.has(id)) return {k:'fol', chip:'Shared with you', text:`${s.from} (${s.fromRole}) shared this ${s.date}${s.note ? `: “${s.note}”` : '.'}`};
  return _v11Case(id);
};
const _v11Facts = v10Facts;
v10Facts = function(id){
  const sid = V11_EXT[id], v = sid && SHARED_VIEWS[sid];
  if(!v) return _v11Facts(id);
  const row = (k,val)=>`<div><dt>${k}</dt><dd>${v11Esc(val)}</dd></div>`;
  return `<aside class="v10-facts" data-v10-facts><dl>${row('Shared snapshot', v.snapshot + ' · won’t update')}${row('Compares', v.period)}${row('Scope', v.scope)}${row('Your data access', v.yourAccess)}${row('Status', followed[id] ? 'Following' : 'Open')}</dl></aside>`;
};
sharedViewerHTML = function(s, tab){
  const v = SHARED_VIEWS[s.id], id = s.insightId, c = V10_DRILL[id] || {};
  const closeFn = tab ? `closeTabPanel('${tab}')` : 'closeDrawer()';
  const tiles = arr=>v10Stats(arr.map(([k,val])=>[k,val,'']));
  const req = accessRequested.has(s.id) ? `<span class="v10-note" data-access-state="requested">Access requested, pending</span>` : `<button class="btn-sec" data-access-state="none" onclick="requestAccess('${s.id}')">Request access to ${v11Esc(v.accessGap)}</button>`;
  const oc = v.yours.outcome;
  c.evidenceHTML = `<p class="v10-cap">As shared · ${v11Esc(v.scope)}</p>${tiles(v.tiles)}
    <p class="v10-cap" style="margin-top:14px">At your store · same definition, same period</p>
    <p class="v11-outcome ${oc}" data-outcome="${oc}">${oc==='consistent' ? '✓' : '–'} ${v11Esc(v.yours.label)}</p>
    ${tiles(v.yours.tiles)}
    <p style="margin-top:10px"><button class="btn-sec" onclick="closeTabPanel && segNav('insights');openInsightInFeed('${v.yours.link.id}')">${v11Esc(v.yours.link.label)} →</button></p>`;
  c.voiceHTML = `<p class="v10-note" style="margin:0 16px 10px">${v11Esc(v.locked)}</p><p style="margin:0 16px 14px">${req}</p>`;
  const raw = `<div class="flex items-center justify-between px-5 py-4 border-b border-line2"><div class="min-w-0"><p>${v11Esc(s.insightTag)}</p><p>${v11Esc(s.insightTitle)}</p></div><button class="iconbtn" data-close-panel onclick="${closeFn}">${V3_SVG.x}</button></div>
    <div class="px-5 py-4"><div data-v3-summary><p class="id-lede">${v11Esc(c.what || '')}</p></div>
      <div class="id-sect"><p class="eyebrow">Activity and comments</p>${renderActivitySection(id)}</div></div>`;
  INSIGHT_META[id] = INSIGHT_META[id] || {title:s.insightTitle, category:s.insightTag, type:'anomaly'};
  if(!INSIGHT_META[id].title) INSIGHT_META[id].title = s.insightTitle;
  let out = v6Shape(raw, id, {full:false});
  // Delete clears it from Shared; Copilot only answers from data you can access
  out = out.replace(new RegExp(`v3DismissMenu\\(event,'${id}'\\)`, 'g'), `dismissShare('${s.id}')`);
  const t = document.createElement('template'); t.innerHTML = out;
  const dock = t.content.querySelector('[data-v3-dock]');
  if(dock) dock.innerHTML = `<p class="v10-note" style="margin:0">Copilot follow-ups are off for this insight: Copilot can only answer from data you can access. Ask about your store's view from your own insight instead.</p>`;
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};
