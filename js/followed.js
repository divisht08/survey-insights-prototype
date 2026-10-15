/* ═══ FOLLOWED INSIGHTS — tracking model ═══ */
// each card's trackable metric definition, keyed by data-id.
// c1 is genuinely quantifiable (two measured periods). c2/c3 are recurring
// comment themes the source data explicitly says cannot be reliably counted
// period-on-period — so they're tracked qualitatively, not with an invented number.
const metricDefs = {
  'INS-01': {quantifiable:true,  metric:'Overall satisfaction average (/10)', unit:'', history:[9.63]},
  'INS-02': {quantifiable:false, note:'Present in retrieved comments in both periods — not stated as a meaningful period-on-period movement.'},
  'INS-03': {quantifiable:false, note:'Present in retrieved comments in both periods — not stated as a meaningful period-on-period movement.'},
  'INS-04': {quantifiable:false, note:'Tracked as each factor\'s share of satisfaction variation — re-ranked every refresh.'},
  'INS-05': {quantifiable:false, note:'Tracked as daily mentions against the normal rate — watch whether it falls back.'},
  'INS-06': {quantifiable:false, note:'Tracked as the staff-helpfulness score each period — watch that it holds.'},
  'CTY-01': {quantifiable:false, note:'Shared snapshot from the KSA view — your store\'s part is tracked in your own anomaly insight.'},
  'SHW-01': {quantifiable:false, note:'Shared snapshot from RT SHUWAIKH — not enough evidence of the same pattern at your store yet.'}
};
// pre-seeded as already-followed. INS-01 (resolved) and INS-03 (open) come from the user's own feed;
// INS-02 is deliberately NOT followed so the "follow something shared with me" path can be tried live.
const followed = {};
followed['INS-01'] = {daysAgo:28, on:'Tue 1 Sep', atVal:'9.63', since:{same:true}, source:'feed', sharedBy:null, history:[9.23,9.63]};

// one registry of insight display data, so a followed card renders the same way whether the insight
// came from the feed or was shared with you — and still renders if its feed card was dismissed
const INSIGHT_META = {
  'INS-01': {title:'Overall store satisfaction improved meaningfully', category:'Overall satisfaction', tag:'Satisfaction', type:'comparison', ctx:'vs 14 Feb – 31 May 2026 · 261 vs 568 responses', stat:'9.63', statSub:'out of 10'},
  'INS-02': {title:'Offer clarity complaints remain visible', category:'Promotion communication', tag:'Promotions', type:'recurring', ctx:'vs 14 Feb – 31 May 2026'},
  'INS-03': {title:'Some shoppers still see prices as high', category:'Price affordability', tag:'Pricing', type:'recurring', ctx:'vs 14 Feb – 31 May 2026'},
  'INS-04': {title:'Store & fitting-room cleanliness is most associated with low satisfaction', category:'Key driver', tag:'Cleanliness', type:'driver', ctx:'Current period · 01 Jun – 23 Sep 2026', statBig:'31%', statSub:'of satisfaction variation', illustrative:true},
  'INS-05': {title:'Payment-failure complaints spiked on 14–15 Sep', category:'Anomaly — payments', tag:'Checkout & payments', type:'anomaly', ctx:'New this period', statBig:'11', statSub:'mentions on 14–15 Sep', illustrative:true},
  'INS-06': {title:'Staff helpfulness is the most-praised part of the visit — and still rising', category:'Staff helpfulness', tag:'Staff', type:'comparison', ctx:'vs 14 Feb – 31 May 2026', statBig:'9.1', statSub:'out of 10 · ▲ +0.3', illustrative:true, positive:true},
  // shared with me from outside my scope — not in my feed, opened in the shared-insight viewer
  // followed insights that are not in the current edition's feed: still recalculated every edition for the follower
  'FOL-01': {title:'Weekend checkout score is no longer clearly lower than before', thenTitle:"Weekend shoppers' checkout score fell", category:'Checkout speed', tag:'Checkout', type:'comparison',
             ctx:'Weekend visits · vs previous period', statBig:'8.0', statSub:'out of 10, weekend visits', illustrative:true,
             summary:'Weekend checkout scores have moved back towards their earlier level. The difference from the previous period is now within normal variation.',
             action:'no new action while the score stays in its usual range.'},
  'FOL-02': {title:'First-time shoppers rate fitting-room help lower than returning shoppers', category:'Fitting-room help', tag:'Fitting rooms', type:'segment',
             ctx:'First-time vs returning shoppers', statBig:'−1.1', statSub:'points vs returning shoppers', illustrative:true,
             summary:'Too few first-time shoppers responded this edition to compare the two groups. The last reliable comparison, in the Sun 20 Sep edition, showed a 1.1-point gap.',
             action:'no new action until enough first-time shoppers respond.'},
  'CTY-01': {title:'Payment-failure complaints spiked across KSA stores on 14–15 Sep', category:'Anomaly — payments', tag:'Checkout & payments', type:'anomaly', ctx:'Shared · KSA · 42 stores', statBig:'64', statSub:'mentions, 9 stores', illustrative:true, shareId:'sw3',
             summary:'64 respondents across 9 KSA stores described payments failing at the till on the same two days. The same spike is visible at your store.',
             action:'confirm what happened at your tills on those days and reply to the Country Manager.'},
  'SHW-01': {title:'Fitting-room waits are the top complaint among detractors at RT SHUWAIKH', category:'Key driver', tag:'Fitting rooms', type:'driver', ctx:'Shared · RT SHUWAIKH', statBig:'41%', statSub:'of detractors there', illustrative:true, shareId:'sw4',
             summary:'At RT SHUWAIKH, waiting for a fitting room is the most-mentioned complaint among detractors. There is not enough evidence of the same pattern at your store.',
             action:'check your own fitting-room comments before acting on this.'}
};
// priority is a ranking judgment, so every label carries its reason (shown in Investigate)
const PRIORITY = {
  'INS-05': {level:'high', reason:'New this period, a sharp break from the normal rate, and the respondents involved scored very low.'},
  'INS-04': {level:'high', reason:'Strongest association with satisfaction and the lowest-scoring factor — and it is within the store\'s control.'},
  'INS-02': {level:'med',  reason:'Recurring and within store control, but there is no evidence it is getting worse.'},
  'INS-01': {level:'pos',  reason:'A validated improvement — worth finding what drove it and repeating it across shifts.'},
  'INS-06': {level:'pos',  reason:'Your strongest service factor and still rising — worth recognising and spreading before it slips.'},
  'INS-03': {level:'low',  reason:'Recurring, and mostly about price levels outside store control — better escalated than actioned locally.'},
  // priority is judged from the recipient's point of view, not copied from the sender
  'CTY-01': {level:'high', reason:'Sent by your Country Manager, and the same spike is visible at your store.'},
  'FOL-01': {level:'low', reason:'Not a significant change this edition. It is still tracked because you follow it.'},
  'FOL-02': {level:'med', reason:'A significant gap in the last two editions; this edition has too few responses to confirm it.'},
  'SHW-01': {level:'low',  reason:'About another store — there is not enough evidence of the same pattern at yours.'}
};
const PRIO_LABEL = {high:'Needs attention', med:'Worth a look', pos:'Bright spot', low:'For awareness'};
const TYPE_LABEL = {comparison:'Period comparison', recurring:'Recurring theme', anomaly:'Anomaly', driver:'Key driver', segment:'Segment comparison', trend:'Trend', seasonal:'Seasonal pattern', emerging:'Emerging theme'};
function kindText(id){ const m = INSIGHT_META[id] || {}; return (TYPE_LABEL[m.type] || 'Insight') + (m.tag ? ' · ' + m.tag : ''); }
function prioHTML(id){ const p = PRIORITY[id]; return p ? `<span class="prio ${p.level}"><i></i>${PRIO_LABEL[p.level]}</span>` : ''; }
const TYPE_PILL = {
  comparison: {bg:'#f1f3f7', fg:'#42474f', icon:'<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>'},
  driver:     {bg:'#f1f3f7', fg:'#42474f', icon:'<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h10M4 12h16M4 18h6"/></svg>'},
  anomaly:    {bg:'#f1f3f7', fg:'#42474f', icon:'<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'},
  recurring:  {bg:'#f1f3f7', fg:'#42474f', icon:'<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.6M20 20v-5h-.6M5 19A9 9 0 0119 5"/></svg>'}
};
const FOLLOW_ON_HTML  = '<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>Following';
const FOLLOW_OFF_HTML = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>Follow';

function updateFollowedBadge(){
  const b=document.getElementById('followed-badge');
  const u = document.getElementById('followed-upd');
  const n = Object.keys(followed).length, upd = Object.keys(followed).filter(id=>followed[id].updated).length;
  if(u){ u.textContent = upd ? upd + ' updated' : ''; u.dataset.n = upd; u.style.display = upd ? '' : 'none'; }
  if(b){ b.textContent = n; b.style.display = (n && !upd) ? '' : 'none'; }
}

function sparkline(history, color, w=132, h=36){
  const pad=4;
  const min=Math.min(...history), max=Math.max(...history);
  const range = (max-min)||1;
  const step = (w-pad*2)/(history.length-1||1);
  const pts = history.map((v,i)=>{
    const x = pad + i*step;
    const y = h-pad - ((v-min)/range)*(h-pad*2);
    return x.toFixed(1)+','+y.toFixed(1);
  }).join(' ');
  const lastX = pad + (history.length-1)*step;
  const lastY = h-pad - ((history[history.length-1]-min)/range)*(h-pad*2);
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="2.6" fill="${color}"/>
  </svg>`;
}

/* ── follow model helpers: one code path for following from the feed AND from a share ── */
function syncFeedFollowButton(id){
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  if(!card) return;
  const btn = card.querySelector('button[onclick*="follow(this)"]');
  if(!btn) return;
  const on = !!followed[id];
  btn.classList.toggle('on', on);
  btn.innerHTML = on ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML;
}
function afterFollowChange(id){
  if(typeof renderEditionBar==='function' && typeof openedIds!=='undefined') renderEditionBar();
  if(typeof applyFeedVisibility==='function' && typeof cfgState!=='undefined') applyFeedVisibility();
  updateFollowedBadge();
  renderFollowedTab();
  syncFeedFollowButton(id);
  renderSharedTab();
  refreshInvestigatePanel(id);
}
function addToFollowed(id, opts={}){
  if(followed[id]) return;
  const def = metricDefs[id] || {quantifiable:false};
  const num = (document.querySelector('#card-grid .insight-card[data-id="'+id+'"] .ic-num:not(.word)')||{}).textContent || (INSIGHT_META[id]||{}).statBig || null;
  followed[id] = {daysAgo:0, on:'today', atVal:num, source:opts.source||'feed', sharedBy:opts.sharedBy||null, history: def.quantifiable ? def.history.slice() : null};
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  insightActivity[id].events.push({type:'follow', by:'You', text:'started following this insight' + (opts.sharedBy ? ' (shared by '+opts.sharedBy+')' : '') + (opts.fromEd ? ' from the '+opts.fromEd+' edition' : ''), date:'just now'});
  afterFollowChange(id);
}
function removeFromFollowed(id){
  if(!followed[id]) return;
  delete followed[id];
  if(insightActivity[id]) insightActivity[id].events.push({type:'follow', by:'You', text:'stopped following this insight', date:'just now'});
  afterFollowChange(id);
}

/* ── status control: click the status on a followed card → pick from a small menu ── */
let statusMenuFor = null;
function openStatusMenu(ev, btn, id){
  ev.stopPropagation();
  const m = document.getElementById('status-menu');
  if(statusMenuFor===id && m.style.display!=='none'){ closeStatusMenu(); return; }
  statusMenuFor = id;
  const cur = (insightActivity[id] && insightActivity[id].status) || 'open';
  m.innerHTML = `<p class="eyebrow" style="padding:6px 9px 5px">Mark as</p>` + STATUS_ORDER.map(s=>{
    const meta = STATUS_META[s];
    return `<div class="st-opt" data-status="${s}" onclick="pickStatus('${id}','${s}')">
      <span class="st-dot" style="background:${meta.dot}"></span>
      <div class="flex-1 min-w-0"><p class="text-[12.5px] font-600 text-txt-1">${meta.label}</p><p class="text-[11px] text-txt-4 leading-snug">${meta.desc}</p></div>
      ${s===cur ? '<svg class="w-3.5 h-3.5 flex-shrink-0 mt-1" style="color:#1a73e8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M5 13l4 4L19 7"/></svg>' : ''}
    </div>`;
  }).join('');
  const r = btn.getBoundingClientRect();
  m.style.display = 'block';
  m.style.top = (r.bottom + 6) + 'px';
  m.style.left = Math.max(8, Math.min(window.innerWidth - 236, r.right - 228)) + 'px';
}
function closeStatusMenu(){
  const m = document.getElementById('status-menu');
  if(m) m.style.display = 'none';
  statusMenuFor = null;
}
function pickStatus(id, s){
  closeStatusMenu();
  const was = (insightActivity[id] && insightActivity[id].status) || 'open';
  if(was===s) return;
  setInsightStatus(id, s);
  toast('Marked as ' + STATUS_META[s].label);
}
document.addEventListener('click', e=>{ if(!e.target.closest('#status-menu')) closeStatusMenu(); });
window.addEventListener('scroll', closeStatusMenu, true);

/* ── filters ── */
let folEditionFilter = 'all';     // all | in (still in the current edition) | out
let folSourceFilter = 'all';
function setFolFilter(kind, val){
  if(kind==='edition') folEditionFilter = val; else folSourceFilter = val;
  renderFollowedTab();
}
function statusOf(id){ return (insightActivity[id] && insightActivity[id].status) || 'open'; }
function folInEdition(id){ return typeof inCurrentEdition==='function' && inCurrentEdition(id); }

function renderFollowedFilters(ids){
  const el = document.getElementById('followed-filters');
  if(!el) return;
  if(ids.length===0){ el.innerHTML=''; return; }
  const srcScoped = ids.filter(id=> folSourceFilter==='all' || followed[id].source===folSourceFilter);
  const srcOpts = [['all','All sources'],['feed','From my feed'],['shared','Shared with me']];
  const srcChips = srcOpts.map(([v,l])=>`<button class="fchip${folSourceFilter===v?' on':''}" data-filter-source="${v}" onclick="setFolFilter('source','${v}')">${l}</button>`).join('');
  el.innerHTML = `<div class="flex items-center gap-2 flex-wrap">
      <span class="text-[12px] text-txt-3 mr-0.5">Source</span>${srcChips}
    </div>`;
}


/* ═══ FOLLOWED INSIGHTS — the behaviour model ═══
   1. A followed insight stays in Followed until the user unfollows it or marks it Done. Nothing removes it automatically.
   2. It is recalculated every edition with the same definition, whether or not it is published in the feed, so the card
      always shows the current figure and headline, plus the context from when it was followed.
   3. Each edition gives it an evidence state: significant (no label), not significant, or too few responses.
   4. "Updated" marks a card whose figure, evidence, plan or discussion changed since the user last opened it; those sort first.
   5. When its action plan is completed, or there has been no significant finding for 3 editions in a row, the card suggests
      marking it Done. It is only a suggestion. */
const SETTLE_AFTER = 3;
const EV_LABEL = {sig:'Significant', nosig:'Not significant', thin:'Too few responses'};
// what the system recalculated for each followed insight, edition by edition (oldest first). Values are examples.
const FOLLOW_TRACK = {
  'INS-04': {rows:[
    {ed:'Sun 20 Sep', val:'28%', ev:'sig', feed:true, what:'You followed it'},
    {ed:'Sun 27 Sep', val:'31%', ev:'sig', feed:true, what:'You created an action plan and commented'}]},
  'INS-02': {rows:[
    {ed:'Sun 6 Sep',  val:'Recurring', ev:'sig', evText:'Above the mention minimum', feed:true, what:'You followed it'},
    {ed:'Sun 13 Sep', val:'Recurring', ev:'sig', evText:'Above the mention minimum', feed:true, what:''},
    {ed:'Sun 20 Sep', val:'Recurring', ev:'sig', evText:'Above the mention minimum', feed:true, what:''},
    {ed:'Sun 27 Sep', val:'Recurring', ev:'sig', evText:'Above the mention minimum', feed:true, what:'Fatima Al-Rashid shared and commented; you created an action plan'}]},
  'INS-01': {rows:[
    {ed:'Sun 30 Aug', val:'9.63', ev:'sig', feed:true, what:''},
    {ed:'Sun 6 Sep',  val:'9.63', ev:'sig', feed:true, what:'You followed it (Tue 1 Sep) and created an action plan'},
    {ed:'Sun 13 Sep', val:'9.63', ev:'sig', feed:true, what:''},
    {ed:'Sun 20 Sep', val:'9.63', ev:'sig', feed:true, what:''},
    {ed:'Sun 27 Sep', val:'9.63', ev:'sig', feed:true, what:'Anish shared it with you; the action plan was completed'}],
    note:'In this prototype, past editions reuse the latest figures for real survey data.'},
  'FOL-01': {why:'The change from the previous period is within normal variation, so it is not a finding and is not in the feed.', rows:[
    {ed:'Sun 6 Sep',  val:'7.4', ev:'sig', feed:true, what:'You followed it (Wed 9 Sep)'},
    {ed:'Sun 13 Sep', val:'7.6', ev:'sig', feed:true, what:''},
    {ed:'Sun 20 Sep', val:'7.9', ev:'nosig', feed:false, what:''},
    {ed:'Sun 27 Sep', val:'8.0', ev:'nosig', feed:false, what:''}]},
  'FOL-02': {why:'18 first-time shoppers responded this edition; 30 are needed to compare the two groups. The figure shown is the last reliable one.', thin:'18 of 30 needed', rows:[
    {ed:'Sun 13 Sep', val:'−1.3', ev:'sig', feed:true, what:'You followed it (Mon 14 Sep)'},
    {ed:'Sun 20 Sep', val:'−1.1', ev:'sig', feed:true, what:''},
    {ed:'Sun 27 Sep', val:'—', ev:'thin', feed:false, what:''}]}
};
// the follower's view of a followed insight this edition
function followState(id){
  const t = FOLLOW_TRACK[id], m = INSIGHT_META[id] || {};
  if(!t || m.shareId) return {ev:'sig', run:0, quiet:0};
  const rows = t.rows, last = rows[rows.length-1];
  let run = 0; for(let i=rows.length-1;i>=0 && rows[i].ev===last.ev;i--) run++;
  let quiet = 0; for(let i=rows.length-1;i>=0 && rows[i].ev!=='sig';i--) quiet++;
  const reliable = [...rows].reverse().find(r=>r.ev!=='thin');
  return {ev:last.ev, run, quiet, lastReliable:reliable, why:t.why, thin:t.thin};
}
function settleReason(id){
  if(actionPlans[id] && actionPlans[id].status==='Completed') return 'the action plan is completed';
  const st = followState(id);
  if(st.quiet >= SETTLE_AFTER) return 'no significant finding for ' + st.quiet + ' editions';
  return '';
}
// "Since you followed": then and now, and one row per edition. Shared by the drill-down and the journeys page.
function sinceSectionHTML(o){
  const evTag = (ev, txt)=>`<span class="fh-ev ${ev}">${txt || EV_LABEL[ev]}</span>`;
  const rows = o.rows.slice().reverse().map(r=>`<tr${r.hl?' class="jr-chg-row"':''}><td>${r.ed}</td><td class="num">${r.val}</td><td>${evTag(r.ev, r.evText)}${r.feed===false?'<span class="fh-nf">not in the feed</span>':''}</td><td>${r.what||''}</td></tr>`).join('');
  return `<div class="id-sect fol-hist" data-since-followed>
      <p class="eyebrow" style="margin-bottom:8px">Since you followed</p>
      <div class="fh-tn">
        <div><span class="k">When you followed · ${o.on}</span><span class="v">${o.thenVal || '—'}</span>${o.thenTitle ? `<span class="t">It said: &ldquo;${o.thenTitle}&rdquo;</span>` : ''}</div>
        <div><span class="k">Now · ${o.nowEd} edition</span><span class="v">${o.nowVal}</span>${evTag(o.nowEv, o.nowEvText)}</div>
      </div>
      <table class="fh-table"><thead><tr><th>Edition</th><th>Figure</th><th>Evidence</th><th>What happened</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="fh-note">A followed insight is recalculated every edition, whether or not it is in the feed.${o.note ? ' ' + o.note : ''}</p>
    </div>`;
}
function sinceFollowedHTML(id){
  const f = followed[id], t = FOLLOW_TRACK[id]; if(!f || !t) return '';
  const st = followState(id), last = t.rows[t.rows.length-1], m = INSIGHT_META[id] || {};
  const nowVal = st.ev==='thin' ? `${st.lastReliable ? st.lastReliable.val : '—'} <small>as of ${st.lastReliable ? st.lastReliable.ed : ''}</small>` : last.val;
  return sinceSectionHTML({on:f.on || 'today', thenVal:f.atVal, thenTitle:(m.thenTitle && m.thenTitle!==m.title) ? m.thenTitle : '',
    nowEd:last.ed, nowVal, nowEv:st.ev, nowEvText:last.evText, rows:t.rows, note:t.note});
}
// drill-down for a followed insight that is not in the current edition's feed
function followOnlyPanelHTML(id, tab){
  const m = INSIGHT_META[id] || {}, st = followState(id);
  return `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <div class="min-w-0">
        <p class="text-[10.5px] font-600 uppercase tracking-wide text-txt-4 mb-0.5">${m.category||''}</p>
        <p class="text-[14.5px] font-600 text-txt-1 leading-snug">${m.title}</p>
      </div>
      <button class="iconbtn flex-shrink-0" data-close-panel onclick="closeTabPanel('${tab}')"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    <div class="px-5 pt-3.5 flex items-center gap-2 flex-wrap">
      <button class="btn-sec" onclick="openShareModal('${id}')">${SHARE_ICON}Share this insight</button>
      ${actionPlans[id] ? planChipHTML(id) : `<button class="btn-sec" data-panel-plan onclick="openActionPlan('${id}')">${PLAN_ICON}Create action plan</button>`}
      ${followed[id] ? `<span class="tag acc">In Followed</span><button class="btn-sec" data-panel-done onclick="doneFromFollowed('${id}')">${JR_CHECK}Mark as done</button>` : ''}
    </div>
    ${PRIORITY[id] ? `<p class="px-5 pt-3 text-[12px] text-txt-3 leading-snug">${prioHTML(id)} <span class="text-txt-4">—</span> ${PRIORITY[id].reason}</p>` : ''}
    <div class="px-5 py-4">
      ${m.illustrative ? `<div class="illus-banner"><span><b style="color:#42474f">Illustrative example.</b> Figures and dates below show the behaviour; they are placeholders, not RT ATYAF MALL survey data.</span></div>` : ''}
      <div class="fol-why" data-fol-why><b>${EV_LABEL[st.ev]} this edition.</b> ${st.why || ''}</div>
      <p class="id-lede">${m.summary || ''}</p>
      ${sinceFollowedHTML(id)}
      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">Activity</p>
        ${renderActivitySection(id)}
      </div>
    </div>`;
}

const PLAN_ICON = '<svg class="plan-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5 3h11a2 2 0 012 2v7h-5.5v6H5a2 2 0 01-2-2V5a2 2 0 012-2zm1 3.5V8h1.5V6.5H6zm2.5 0V8h7V6.5h-7zM6 9.75v1.5h1.5v-1.5H6zm2.5 0v1.5h7v-1.5h-7zM6 13v1.5h1.5V13H6zm2.5 0v1.5h3V13h-3z"/><path d="M16.25 13.5H18v2.75h2.75V18H18v2.75h-1.75V18H13.5v-1.75h2.75V13.5z"/></svg>';
// Action plans live in the Action Plans capability (owner, status, due date). Survey Insights only creates one
// from an insight and then shows its status and owner, read-only.
let actionPlans = { 'INS-02': {status:'In progress', owner:'You'} };
function planChipInner(pl){ return `${PLAN_ICON}Action plan<span class="st">· ${pl.status} · ${pl.owner}</span>`; }
function planChipHTML(id){ const pl = actionPlans[id]; return pl ? `<span class="plan-chip${pl.status==='Completed'?' done':''}" data-plan-chip="${id}" title="Managed in Action Plans">${planChipInner(pl)}</span>` : ''; }
function planBtnHTML(id){ const has = !!actionPlans[id]; return `<button class="iconbtn${has?' has-plan':''}" data-plan-btn="${id}" title="${has?'Action plan created':'Create action plan'}" aria-label="${has?'Action plan created':'Create action plan'}" onclick="event.stopPropagation();openActionPlan('${id}')">${PLAN_ICON}</button>`; }
// The card's main button depends on what the insight needs: something to fix gets "Create action plan",
// a bright spot gets "Share", everything else gets "Investigate". Investigate stays on every card.
function primaryCTA(id){ return 'investigate'; }
function renderCTA(id){
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]'); if(!card) return;
  const live = card.querySelector('.act-live'); if(!live) return;
  const cta = primaryCTA(id);
  const old = live.querySelector('[data-cta]'); if(old) old.remove();
  const inv = [...live.querySelectorAll('button')].find(b=>/Investigate/.test(b.textContent));
  const planBtn = live.querySelector('[data-plan-btn]'), shareBtn = live.querySelector('button[title="Share this insight"]');
  if(planBtn) planBtn.style.display = cta==='plan' ? 'none' : '';
  if(shareBtn) shareBtn.style.display = cta==='share' ? 'none' : '';
  if(inv) inv.className = cta==='investigate' ? 'btn-pri' : 'btn-sec';
  card.dataset.cta = cta;
  if(cta==='investigate') return;
  const b = document.createElement('button');
  b.className = 'btn-pri'; b.dataset.cta = cta;
  b.innerHTML = cta==='plan' ? PLAN_ICON + 'Create action plan' : SHARE_ICON + 'Share';
  b.setAttribute('onclick', `event.stopPropagation();${cta==='plan' ? 'openActionPlan' : 'openShareModal'}('${id}')`);
  live.appendChild(b);
}
function updatePlanChip(id){
  renderCTA(id);
  const pl = actionPlans[id];
  const el = document.getElementById('plan-'+id);
  if(el){ el.style.display = pl ? '' : 'none'; el.className = 'plan-chip' + (pl && pl.status==='Completed' ? ' done' : ''); el.title = 'Managed in Action Plans'; el.innerHTML = pl ? planChipInner(pl) : ''; }
  document.querySelectorAll('#card-grid [data-plan-btn="'+id+'"]').forEach(b=>{ b.classList.toggle('has-plan', !!pl); b.title = pl ? 'Action plan created' : 'Create action plan'; b.setAttribute('aria-label', b.title); });
}
function updateAllPlanChips(){ Object.keys(INSIGHT_META).forEach(updatePlanChip); }
// has anyone acted on this insight? (used by the "N editions · no action" label)
function hasAction(id){
  if(actionPlans[id] || followed[id] || (typeof doneFeed!=='undefined' && doneFeed.has(id))) return true;
  const ev = (insightActivity[id] && insightActivity[id].events) || [];
  return ev.some(e=>e.by==='You' && (e.type==='share' || e.type==='comment' || e.type==='plan'));
}
let currentPlanId = null;
function openActionPlan(id){
  if(actionPlans[id]){ toast('This insight already has an action plan'); return; }
  currentPlanId = id;
  const p = cardParts(id);
  const strip = h=>{ const d = document.createElement('div'); d.innerHTML = h; return d.textContent.trim(); };
  const step = strip(p.action).replace(/^[^:]{0,30}:\s*/, '');
  const firstStep = step ? step.charAt(0).toUpperCase() + step.slice(1) : '';
  const m = document.getElementById('plan-modal');
  m.innerHTML = `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <p class="text-[14.5px] font-600 text-txt-1 flex items-center gap-2">${PLAN_ICON}Create action plan</p>
      <button class="iconbtn" onclick="closeActionPlan()" aria-label="Close"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    <div class="px-5 py-4">
      <div class="from-ins" data-plan-from><b>From this insight:</b> ${p.summary || p.title}${p.basis ? ` <span style="color:#5f6672">(${strip(p.basis)})</span>` : ''}</div>
      <label for="plan-title">Plan title</label>
      <input id="plan-title" value="${strip(p.title).replace(/"/g,'&quot;')}">
      <label for="plan-step">First step</label>
      <textarea id="plan-step" rows="2">${firstStep}</textarea>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><label for="plan-owner">Owner</label><select id="plan-owner"><option>You</option><option>Fatima Al-Rashid</option><option>Omar Hassan</option></select></div>
        <div><label for="plan-due">Due</label><select id="plan-due"><option>In 1 week</option><option>In 2 weeks</option><option>End of month</option></select></div>
      </div>
      <p class="text-[12px] text-txt-3" style="margin-top:12px;line-height:1.5">The plan is created in Action Plans, where its owner tracks it. Its status shows on this insight.</p>
    </div>
    <div class="border-t border-line2 px-5 py-3.5 flex items-center gap-2">
      <button class="btn-pri" data-plan-create onclick="createActionPlan()">Create action plan</button>
      <button class="btn-sec" onclick="closeActionPlan()">Cancel</button>
    </div>`;
  m.classList.remove('hidden');
  document.getElementById('scrim').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeActionPlan(){
  document.getElementById('plan-modal').classList.add('hidden');
  document.getElementById('scrim').classList.remove('show');
  document.body.style.overflow = '';
}
function createActionPlan(){
  const id = currentPlanId; if(!id) return;
  const owner = document.getElementById('plan-owner').value;
  actionPlans[id] = {status:'Not started', owner};
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  insightActivity[id].events.push({type:'plan', by:'You', text:'created an action plan' + (owner==='You' ? '' : ' for ' + owner), date:'just now'});
  closeActionPlan();
  afterPlanChange(id);
  toast('Action plan created');
}
function afterPlanChange(id){
  renderEditionBar();
  updatePlanChip(id);
  if(typeof renderFreshness==='function') renderFreshness();
  renderFollowedTab(); renderSharedTab(); refreshInvestigatePanel(id);
}
const NEXT_ARROW = '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>';
const SHARE_ICON = '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg>';
const STAR_ICON = '<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"/></svg>';
// The parts of an insight card (headline, supporting sentence, next step, key figure, basis), read from the
// feed card when the insight has one, so Followed and Shared always show exactly what the feed shows.
function cardParts(id){
  const m = INSIGHT_META[id] || {};
  const el = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  const g = sel=>{ const e = el && el.querySelector(sel); return e ? e.innerHTML : ''; };
  let basis = m.ctx || '';
  if(el){ const bEl = el.querySelector('[data-el="basis"]'); if(bEl){ const c = bEl.cloneNode(true); c.querySelectorAll('[data-fresh],[data-snap-fate]').forEach(x=>x.remove()); basis = c.innerHTML; } }
  let stat;
  if(el) stat = g('[data-el="stat"]');
  else if(m.statBig) stat = `<p class="ic-num" style="color:${m.type==='anomaly'?'#c5221f':'#111318'}">${m.statBig}</p><p class="ic-unit">${m.statSub||''}</p>`;
  else stat = '<p class="ic-num word">Recurring</p><p class="ic-unit">seen in both periods</p>';
  return {
    title: m.title || g('[data-el="title"]') || id,
    summary: el ? g('[data-el="summary"]') : (m.summary || ''),
    action: el ? g('[data-el="action"]') : (m.action ? '<span class="font-600">Recommended action:</span> ' + m.action : ''),
    stat, basis,
    icon: (TYPE_PILL[m.type] || TYPE_PILL.recurring).icon,
    level: (PRIORITY[id] && PRIORITY[id].level) || 'low',
    illus: m.illustrative ? '<span class="illus" title="Illustrative example — not real RT ATYAF MALL data">Illustrative</span>' : ''
  };
}
function cardBodyHTML(id, p, extraTags, rightTags, extraLine){
  return `<div class="ic-body">
      <div class="ic-head">
        <div class="ic-kind">${prioHTML(id)}<span class="ic-type">${p.icon}<span>${kindText(id)}</span></span>${p.illus}${extraTags||''}</div>
        <div class="ic-tags">${rightTags||''}</div>
      </div>
      <div class="ic-main">
        <div class="ic-text">
          <p class="ic-title">${p.title}</p>
          ${p.summary ? `<p class="ic-sum">${p.summary}</p>` : ''}
          ${p.action ? `<p class="ic-next">${NEXT_ARROW}<span>${p.action}</span></p>` : ''}
          ${extraLine||''}
        </div>
        <div class="ic-stat">${p.stat}</div>
      </div>
    </div>`;
}
// Followed card = the feed card, plus a status control and one line of activity
function followedCardHTML(id){
  const f = followed[id];
  const meta = INSIGHT_META[id] || {title:id, category:'Insight', tag:'Insight', type:'recurring', ctx:''};
  const p = cardParts(id);
  const events = (insightActivity[id] && insightActivity[id].events) || [];
  const comments = events.filter(e=>e.type==='comment').length;
  const last = events.length ? events[events.length-1] : null;
  const sourceBadge = f.source==='shared' ? `<span class="tag" title="Shared with you">${SHARE_ICON}Shared by ${f.sharedBy}</span>` : '';
  const when = f.on ? f.on : (f.daysAgo===0 ? 'just now' : (f.daysAgo===1 ? '1 day ago' : f.daysAgo+' days ago'));
  const activity = `<p class="ic-meta" data-fol-activity>Followed ${when}${f.atVal ? ` at ${f.atVal}` : ''}${last ? ` · <span class="font-600" style="color:#42474f">Latest:</span> ${last.by} ${last.type==='comment' ? 'commented' : last.text}, ${last.date}` : ''}${comments ? ` · ${comments} comment${comments>1?'s':''}` : ''}</p>`;
  // evidence this edition: no label while it is significant; otherwise say so, plainly, and never "resolved"
  const st = followState(id);
  let evLabel = '';
  if(st.ev==='nosig') evLabel = `<span class="fol-out" data-fol-ev="nosig">Not a significant change${st.run>1 ? ' · ' + st.run + ' editions in a row' : ''} · not in the feed</span>`;
  if(st.ev==='thin'){
    evLabel = `<span class="fol-out" data-fol-ev="thin">Too few responses this edition${st.thin ? ' · ' + st.thin : ''} · showing the last reliable figure</span>`;
    p.stat += `<p class="ic-unit" data-fol-asof>as of ${st.lastReliable ? st.lastReliable.ed : ''}</p>`;
  }
  const settle = settleReason(id);
  const settleLine = settle ? `<p class="ic-settle" data-fol-settle>Looks settled: ${settle}. Mark it as done if there is nothing more to watch.</p>` : '';
  const updTag = f.updated ? '<span class="fresh-tag upd" data-fol-updated title="Changed since you last opened it">Updated</span>' : '';
  // shown only when the key figure has changed since the user followed the insight
  if(f.since) p.stat += f.since.same ? `<p class="ic-since flat" data-since>No change<small>since you followed</small></p>`
    : `<p class="ic-since" data-since title="${f.since.from} when you followed">${f.since.dir==='down'?'▼':'▲'} ${f.since.delta}<small>since you followed</small></p>`;
  return `<div class="fol-card ic spr-card" data-fol-id="${id}" data-sel-key="${id}" data-type="${meta.type}" data-priority="${p.level}" onclick="if(!event.target.closest('button,a,textarea,input'))selectTabCard('followed','${id}')">
    ${cardBodyHTML(id, p, updTag, sourceBadge + planChipHTML(id), activity + settleLine).replace('<div class="ic-stat">', '<div class="ic-stat' + (st.ev==='nosig' ? ' muted' : '') + '">')}
    <div class="ic-foot">
      <p class="ic-basis">${evLabel || p.basis}</p>
      <div class="ic-acts">${feedbackHTML(id)}
        <button class="iconbtn" title="Share this insight" aria-label="Share this insight" onclick="openShareModal('${id}')"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg></button>
        ${planBtnHTML(id)}
        <button class="btn-sec on" data-unfollow="${id}" title="Stop following — it goes back to your feed if it is still in the edition" onclick="unfollowFromTab('${id}')">${FOLLOW_ON_HTML}</button>
        <button class="btn-sec${settle ? ' suggest' : ''}" data-fol-done="${id}" title="Close it — it leaves Followed and is held back from later editions" onclick="doneFromFollowed('${id}')"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/></svg>Mark as done</button>
        <button class="btn-pri" data-fol-open="${id}" onclick="selectTabCard('followed','${id}')">${STAR_ICON}Investigate</button>
      </div>
    </div>
  </div>`;
}

function renderFollowedTab(){
  const list = document.getElementById('followed-list');
  if(!list) return;
  const ids = Object.keys(followed);
  renderFollowedFilters(ids);
  if(ids.length===0){
    tabSel.followed = null; renderTabPanel('followed');
    list.innerHTML = `<div class="spr-card p-8 text-center">
      <svg class="w-7 h-7 mx-auto mb-2 text-txt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
      <p class="text-[13.5px] font-600 text-txt-1">You're not following any insights yet</p>
      <p class="text-[12.5px] text-txt-3 mt-1">Tap Follow on any insight in your feed, or on anything a colleague shares with you.</p>
    </div>`;
    return;
  }
  const visible = ids
    .filter(id=> folSourceFilter==='all' || followed[id].source===folSourceFilter)
    .sort((a,b)=> (followed[b].updated?1:0) - (followed[a].updated?1:0) || followed[a].daysAgo - followed[b].daysAgo);
  if(!visible.includes(tabSel.followed)) tabSel.followed = visible[0] || null;   // always one open: the top card by default
  if(visible.length===0){
    renderTabPanel('followed');
    list.innerHTML = `<div class="spr-card p-8 text-center">
      <p class="text-[13.5px] font-600 text-txt-1">No followed insights match these filters</p>
      <p class="text-[12.5px] text-txt-3 mt-1 mb-3">Try a different filter.</p>
      <button class="btn-sec" onclick="folSourceFilter='all';renderFollowedTab()">Clear filters</button>
    </div>`;
    return;
  }
  list.innerHTML = visible.map(followedCardHTML).join('');
  renderTabPanel('followed');
}

function unfollowFromTab(id){
  removeFromFollowed(id);
  toast('Unfollowed');
}
// Done on a followed insight: it leaves Followed and is closed, in one step. Unfollow only stops watching it.
function doneFromFollowed(id){
  const f = followed[id]; if(!f) return;
  const saved = Object.assign({}, f);
  delete followed[id];
  doneFeed.add(id);
  // an insight from outside the user's scope lives only as a share, so closing it clears that share too
  const sid = (INSIGHT_META[id] || {}).shareId;
  const share = sid ? sharedWithMe.find(x=>x.id===sid) : null;
  const shareWas = share ? {dismissed:!!share.dismissed, unread:!!share.unread} : null;
  if(share){ share.dismissed = true; share.unread = false; }
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  insightActivity[id].events.push({type:'done', by:'You', text:'marked this done', date:'just now'});
  afterFollowChange(id); updateSharedBadge();
  toastAction('Marked as done — removed from Followed', 'Undo', ()=>{
    doneFeed.delete(id); followed[id] = saved;
    const ev = insightActivity[id].events;
    if(ev.length && ev[ev.length-1].text==='marked this done') ev.pop();
    if(share){ share.dismissed = shareWas.dismissed; share.unread = shareWas.unread; }
    afterFollowChange(id); updateSharedBadge();
  });
}

// jump from Followed or Shared into the feed with that insight's investigate panel open
function openInsightInFeed(id){
  if(typeof viewingEdition!=='undefined' && viewingEdition!==CURRENT_EDITION){ viewingEdition = CURRENT_EDITION; renderEditionBar(); applyFeedVisibility(); }
  const m = INSIGHT_META[id];
  if(m && m.shareId){ openSharedViewer(m.shareId); return; }
  if(dismissedFeed.has(id)){
    toastAction('You dismissed this from your feed', 'Restore & open', ()=>{ restoreToFeed(id); openInsightInFeed(id); });
    return;
  }
  segNav('insights');
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  if(card){
    const st = feedStateOf(id);
    if(st==='active' || st==='done'){ if(feedView!==st) setFeedView(st); card.style.display=''; card.scrollIntoView({behavior:'smooth', block:'nearest'}); }
    openInvestigate(card);   // followed insights open in the panel without returning to the feed list
  } else {
    toast('This insight is no longer in your feed');
  }
}
