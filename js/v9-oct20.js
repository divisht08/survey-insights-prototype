/* ═══ v9 — manager feedback of 20 Oct
   Feed: pinned filters (Unread stays one click), date on every card, hover Delete + Mark as unread, a new Investigate icon,
         "Similar issues" = the same topic, newest first (no links between insights).
   Drill-down: takes the whole right side, actions pinned at the top, four sections instead of eight, agents as rows.
   Pages: unread on Followed and Shared, Action plans and Alerts in their own group, share groups come from platform roles.
   Day 50: an Area Manager view of 30 stores, so the feed can be seen with many insights. All of it is illustrative. ═══ */

const V9_ICON = {
  open:'<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="16" rx="2" stroke-width="1.8"/><path stroke-linecap="round" stroke-width="1.8" d="M14 4v16M8 10l2 2-2 2"/></svg>',
  trash:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>',
  unread:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" stroke-width="1.8"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 7l9 6 9-6"/></svg>',
  read:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10l9-6 9 6v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 10l9 6 9-6"/></svg>',
  caret:'<svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor"><path d="M5 7l5 6 5-6z"/></svg>',
  bell:'<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"/></svg>',
  agent:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 3h6M12 3v3m-6 4a6 6 0 0112 0v5a3 3 0 01-3 3H9a3 3 0 01-3-3v-5zm3 2h.01M15 12h.01M9 21h6"/></svg>'
};
const v9Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ════════ Day 50 · Area Manager: 30 stores, many insights over several updates (all illustrative) ════════ */
var v9Area = false;
const V9_AM = [
  // [id, update, prio, type, kind, title, summary, num, unit, basis, still significant, unread, table head, table rows, steps, before]
  {id:'AM-01', ed:'e27', prio:'high', type:'segment', kind:'Segment comparison · Checkout', title:'Checkout satisfaction trails in 4 of your 30 stores',
   sum:'4 stores score at least 0.8 below the area average on checkout, each with 100+ responses this period.', num:'4 of 30', unit:'stores below the area', basis:'CRN area · 01 Jun – 23 Sep 2026 · stores with 100+ responses', sig:true, unread:true,
   th:['Store','Checkout','vs area 8.6'], rows:[['Store 07 · Riyadh','7.6','−1.0'],['Store 12 · Riyadh','7.8','−0.8'],['Store 19 · Qassim','7.8','−0.8'],['Store 23 · Qassim','7.7','−0.9']],
   steps:[['Recommended action','Compare till cover at peak hours in these 4 stores with the area\'s best checkout stores.','plan'],['For Store Managers','Share it so each manager sees their own store against the area.','share:Store Managers']]},
  {id:'AM-02', ed:'e27', prio:'high', type:'recurring', kind:'Recurring theme · Fitting rooms', title:'Fitting-room wait complaints rose for 4 weeks in 5 stores',
   sum:'In 5 stores, comments about waiting for a fitting room grew every week for 4 weeks. The other 25 stores are flat.', num:'5 of 30', unit:'stores, 4 weeks rising', basis:'CRN area · last 4 weeks vs the 12 weeks before', sig:true, unread:true,
   th:['Store','Mentions, last 4 weeks','12 weeks before'], rows:[['Store 03 · Riyadh','21','9'],['Store 07 · Riyadh','17','6'],['Store 14 · Riyadh','15','7'],['Store 21 · Hail','12','4'],['Store 26 · Qassim','11','5']],
   steps:[['Recommended action','Check fitting-room staffing on weekend afternoons in these 5 stores.','plan']]},
  {id:'AM-03', ed:'e27', prio:'med', type:'driver', kind:'Key driver · Cleanliness', title:'Fitting-room cleanliness is the top factor in 18 of your 30 stores',
   sum:'Across the area, cleanliness moves most with overall satisfaction. In 18 stores it is also the top factor on its own.', num:'18 of 30', unit:'stores', basis:'CRN area · 01 Jun – 23 Sep 2026', sig:true, unread:false,
   th:['Cleanliness is',''], rows:[['Top factor in','18 stores'],['Second factor in','7 stores'],['Not in the top 3 in','5 stores']],
   steps:[['Recommended action','Make a fitting-room reset part of the area\'s shift standard.','plan']]},
  {id:'AM-04', ed:'e27', prio:'pos', type:'comparison', kind:'Period comparison · Overall', title:'5 stores scored above 9.5 for the 4th week running',
   sum:'Overall satisfaction at these 5 stores has stayed above 9.5 every week since the start of September.', num:'9.5+', unit:'5 stores', basis:'CRN area · week of 21 Sep 2026', sig:true, unread:true,
   th:['Store','Overall'], rows:[['RT ATYAF MALL','9.63'],['Store 05 · Riyadh','9.61'],['Store 09 · Hail','9.58'],['Store 14 · Riyadh','9.55'],['Store 28 · Qassim','9.52']],
   steps:[['For your area call','Ask these Store Managers what they do differently.','share:Store Managers']]},
  {id:'AM-05', ed:'e27', prio:'low', type:'emerging', kind:'Emerging theme · Parking', title:'Parking comments appeared at 3 mall stores',
   sum:'Parking was not mentioned in the 12 weeks before. In the last 3 weeks it came up 14 times, all at stores inside malls.', num:'', unit:'', basis:'CRN area · last 3 weeks vs the 12 weeks before', sig:true, unread:false,
   th:['Store','Mentions, last 3 weeks'], rows:[['Store 03 · Riyadh','6'],['Store 14 · Riyadh','5'],['Store 21 · Hail','3']],
   steps:[['Recommended action','Ask the mall operators whether parking capacity changed.','plan']]},
  {id:'AM-06', ed:'e27', prio:'med', type:'segment', kind:'Segment comparison · Staff', title:'Weekend staff-helpfulness scores are lower in 7 stores',
   sum:'In 7 stores, staff helpfulness scores 0.6 lower on weekends than on weekdays. Across the area the gap is 0.1.', num:'−0.6', unit:'weekend vs weekday, 7 stores', basis:'CRN area · 01 Jun – 23 Sep 2026', sig:true, unread:true,
   th:['Store','Weekday','Weekend'], rows:[['Store 02 · Riyadh','9.2','8.4'],['Store 07 · Riyadh','9.0','8.3'],['Store 11 · Qassim','9.1','8.6'],['+ 4 more stores','','']],
   steps:[['Recommended action','Compare weekend rota cover with weekday cover in these 7 stores.','plan']]},
  {id:'AM-07', ed:'e20', prio:'high', type:'anomaly', kind:'Anomaly · Checkout & payments', title:'Payment-failure complaints spiked in 6 stores on 14–15 Sep',
   sum:'The same 2 days show the spike in 6 stores, which points to one shared cause rather than store issues.', num:'6 of 30', unit:'stores, same 2 days', basis:'CRN area · daily comments · 14–15 Sep 2026', sig:false, unread:false,
   th:['Store','Mentions'], rows:[['Store 03 · Riyadh','14'],['RT ATYAF MALL','11'],['Store 12 · Riyadh','9'],['+ 3 more stores','17']],
   steps:[['For the Central team','Ask IT or the payment provider about an outage on 14–15 Sep.','share:Central Operations']]},
  {id:'AM-08', ed:'e20', prio:'med', type:'recurring', kind:'Recurring theme · Promotions', title:'Offer-clarity complaints come up in 22 of your 30 stores',
   sum:'Comments that an offer was unclear at the till appear in 22 stores, at a similar rate in each.', num:'22 of 30', unit:'stores', basis:'CRN area · 01 Jun – 23 Sep 2026', sig:true, unread:false,
   th:['Mentioned in',''], rows:[['Every week','9 stores'],['Most weeks','13 stores'],['Rarely or never','8 stores']],
   steps:[['For the Central team','A network-wide pattern usually needs a central fix to offer signage.','share:Central Operations']]},
  {id:'AM-09', ed:'e20', prio:'low', type:'comparison', kind:'Period comparison · Responses', title:'Responses fell by a third or more in 9 stores',
   sum:'9 stores received at least 30% fewer responses than in the previous period. The survey invitation may not be reaching shoppers there.', num:'9 of 30', unit:'stores, −30% or more', basis:'CRN area · last 4 weeks vs the 4 weeks before', sig:true, unread:true,
   th:['Store','Last 4 weeks','4 weeks before'], rows:[['Store 08 · Hail','41','77'],['Store 16 · Riyadh','58','96'],['Store 22 · Qassim','37','60'],['+ 6 more stores','','']],
   steps:[['Recommended action','Check that the receipt QR code is printing in these stores.','plan']]},
  {id:'AM-10', ed:'e13', prio:'med', type:'recurring', kind:'Recurring theme · Pricing', title:'Price complaints are steady across the area',
   sum:'Comments that prices are high appear in most stores at about the same rate as last period. Nothing points to one store or one week.', num:'', unit:'', basis:'CRN area · 01 Jun – 23 Sep vs 14 Feb – 31 May 2026', sig:true, unread:false,
   th:['Period','Share of comments'], rows:[['01 Jun – 23 Sep','11%'],['14 Feb – 31 May','12%']],
   steps:[['For the Central team','Pricing is set centrally; share it for awareness.','share:Central Operations']]},
  {id:'AM-11', ed:'e13', prio:'pos', type:'segment', kind:'Segment comparison · Loyalty', title:'Loyalty members score 0.5 higher than other shoppers in 24 stores',
   sum:'In 24 of 30 stores, loyalty members rated the visit higher. The gap is no longer significant in the latest update.', num:'+0.5', unit:'members vs others', basis:'CRN area · 01 Jun – 13 Sep 2026', sig:false, unread:false,
   th:['Group','Overall'], rows:[['Loyalty members','9.4'],['Other shoppers','8.9']],
   steps:[['Recommended action','Look at what members get at the till that other shoppers do not.','plan']]},
  {id:'AM-12', ed:'e06', prio:'high', type:'anomaly', kind:'Anomaly · Store comfort', title:'Air-conditioning complaints jumped at 2 stores in early September',
   sum:'18 comments about the store being too hot in one week at 2 stores, against about 1 a month before.', num:'18', unit:'comments, 1 week', basis:'Stores 17 and 24 · week of 30 Aug 2026', sig:false, unread:false,
   th:['Store','Comments'], rows:[['Store 17 · Qassim','11'],['Store 24 · Hail','7']],
   steps:[['For the Central team','Raise it with facilities if it is not already fixed.','share:Central Operations']]},
  {id:'AM-13', ed:'e06', prio:'med', type:'driver', kind:'Key driver · Product availability', title:'Size availability is the second factor in 11 stores',
   sum:'After cleanliness, finding your size moves most with satisfaction in 11 stores, most of them smaller stores.', num:'11 of 30', unit:'stores', basis:'CRN area · 01 Jun – 06 Sep 2026', sig:true, unread:false,
   th:['Store size','Stores where it is 2nd'], rows:[['Small','8'],['Medium','2'],['Large','1']],
   steps:[['For the Central team','Share it with merchandising for size allocation to smaller stores.','share:Central Operations']]},
  {id:'AM-14', ed:'e30', prio:'low', type:'segment', kind:'Segment comparison · Returns', title:'Returning an online order in store rates lower than other visits',
   sum:'Shoppers returning an online order rated the visit 0.7 lower. Too few such visits in the latest update to confirm it again.', num:'−0.7', unit:'vs other visits', basis:'CRN area · 01 Jun – 30 Aug 2026', sig:false, unread:false,
   th:['Visit','Overall'], rows:[['Online return','8.4'],['Other visits','9.1']],
   steps:[['Recommended action','Check how long online returns take at the till.','plan']]},
  {id:'AM-15', ed:'e30', prio:'pos', type:'recurring', kind:'Recurring theme · Staff', title:'Praise for helpful staff appears in every store',
   sum:'Promoters in all 30 stores mention friendly, helpful staff, more than any other reason.', num:'30 of 30', unit:'stores', basis:'CRN area · 01 Jun – 30 Aug 2026', sig:true, unread:false,
   th:['Promoters mentioning staff',''], rows:[['Highest store','46%'],['Area average','31%'],['Lowest store','18%']],
   steps:[['For your area call','Recognise it, and ask the strongest stores what they do.','share:Store Managers']]}
];
const V9_AM_BEFORE = {'AM-08':'Yes. Offer clarity has come up in every area update since 30 Aug.', 'AM-10':'Yes. Price complaints have come up in every area update since 30 Aug at a similar rate.', 'AM-03':'Yes. Cleanliness was also the top factor in the 13 Sep update.'};
const V9_AM_BY = Object.fromEntries(V9_AM.map(a=>[a.id,a]));
const v9IsAM = id=>!!V9_AM_BY[id];
const V9_TYPEKEY = {segment:'segment', comparison:'comparison', recurring:'recurring', emerging:'emerging', driver:'driver', anomaly:'anomaly'};
// register the area insights so Follow, Share and action plans work on them too
V9_AM.forEach(a=>{
  const tag = a.kind.split(' · ')[1] || '';
  INSIGHT_META[a.id] = {title:a.title, summary:a.sum, category:a.kind.split(' · ')[0], tag, type:a.type, ctx:a.basis, statBig:a.num || undefined, statSub:a.unit, illustrative:true};
  COPILOT_QA[a.id] = [
    ['Which stores are behind this?', a.rows.filter(r=>r[0] && !/^\+/.test(r[0])).map(r=>r.filter(Boolean).join(': ')).join('; ') + '. Figures are illustrative.', 'The evidence'],
    ['Has this happened before?', V9_AM_BEFORE[a.id] || 'Not in this area\'s earlier updates. This is the first time it has come up.', 'Earlier updates of this survey']
  ];
});
function v9AMCardHTML(a){
  const stat = a.num ? `<p class="ic-num${/^[\d+−]/.test(a.num)?'':' word'}">${a.num}</p><p class="ic-unit">${a.unit}</p>` : '';
  return `<div class="insight-card ic spr-card v9-am" data-id="${a.id}" data-type="${a.type}" data-priority="${a.prio}" onclick="openInvestigate(this)">
    <div class="ic-body"><div class="ic-head"><div class="ic-kind" data-el="kind-row"><span class="ic-type" data-el="kind"><span data-el="kind-text">${a.kind}</span></span><span class="illus" style="display:inline-flex!important">Illustrative</span></div><div class="ic-tags" data-el="tags"></div></div>
      <div class="ic-main"><div class="ic-text"><p class="ic-title" data-el="title">${a.title}</p><p class="ic-sum" data-el="summary">${a.sum}</p><p data-el="action" hidden>${a.steps[0][1]}</p></div>
        <div class="ic-stat" data-el="stat">${stat}</div></div></div>
    <div class="ic-foot"><p class="ic-basis" data-el="basis">${a.basis}</p><div class="ic-acts"><div class="flex items-center gap-1.5 act-live">
      <button class="btn-sec" onclick="event.stopPropagation();follow(this)">${FOLLOW_OFF_HTML}</button>
      <button class="btn-pri" onclick="event.stopPropagation();openInvestigate(this)">Investigate</button></div></div></div></div>`;
}
function v9EnsureAMCards(){
  const grid = document.getElementById('card-grid'); if(!grid) return;
  V9_AM.forEach(a=>{ if(!grid.querySelector(`.v9-am[data-id="${a.id}"]`)){ const t = document.createElement('template'); t.innerHTML = v9AMCardHTML(a).trim(); grid.appendChild(t.content.firstElementChild); } });
}
// the area insights' dates and significance
const _v9DateOf = v7DateOf;
v7DateOf = function(id){ const a = V9_AM_BY[id]; return a ? (EDITIONS.find(e=>e.id===a.ed) || EDITIONS[0]) : _v9DateOf(id); };
const _v9InCur = inCurrentEdition;
inCurrentEdition = function(id){ const a = V9_AM_BY[id]; return a ? a.sig : _v9InCur(id); };
const _v9Case = v6Case;
v6Case = function(id){
  const a = V9_AM_BY[id];
  if(a && !dismissedFeed.has(id) && !doneFeed.has(id)){
    if(!a.sig) return {k:'nosig', chip:'', text:`Not significant in the latest update (${EDITIONS[0].short}).${followed[id] ? ' ' + v6FollowLine(id) + ' It keeps updating while you follow it.' : ''}`};
    return followed[id] ? {k:'fol', chip:'Following', text:v6FollowLine(id)} : {k:'', chip:'', text:''};
  }
  return _v9Case(id);
};
// drill-down for an area insight, built in the same shape as the others
function v9AMPanelRaw(a){
  const neg = a.prio==='high' || a.prio==='med';
  const btn = s=>{ if(s.startsWith('share:')){ const g = s.slice(6); return `<button class="btn-sec" data-v9-share-group="${v9Esc(g)}" onclick="v9ShareGroup('${a.id}','${v9Esc(g)}')">Share with ${v9Esc(g)}</button>`; }
    return actionPlans[a.id] ? `<button class="btn-sec" onclick="openActionPlan('${a.id}')">Open action plan</button>` : `<button class="btn-sec" onclick="openActionPlan('${a.id}')">Add to action plan</button>`; };
  return `<div class="flex items-center justify-between px-5 py-4 border-b border-line2"><div class="min-w-0"><p>${v9Esc(a.kind)}</p><p>${v9Esc(a.title)}</p></div><button class="iconbtn" data-close-panel onclick="closeInvestigatePanel(true)">${V3_SVG.x}</button></div>
    <div class="px-5 py-4">
      <div class="illus-banner"><span><b style="color:#42474f">Illustrative example.</b> An Area Manager's feed across 30 stores. Store names and figures are placeholders.</span></div>
      <div data-v3-summary><p class="id-lede">${v9Esc(a.sum)} <span style="color:#6b7280">${v9Esc(a.basis)}.</span></p></div>
      <div class="id-sect"><p class="eyebrow">The evidence</p><table class="v3-tbl"><thead><tr>${a.th.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${a.rows.map(r=>`<tr>${r.map((x,i)=>`<td class="${i && /^−/.test(x)?'bad':''}">${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <div class="id-sect"><p class="eyebrow">Next steps</p>${a.steps.map(s=>`<div class="id-means"><div><b>${v9Esc(s[0])}.</b> ${v9Esc(s[1])}<div class="v3-cta">${btn(s[2])}</div></div></div>`).join('')}
        <p class="eyebrow">Let an agent do it</p>
        <div class="v3-agent" data-v3-agent="review"><span class="ai">${V3_SVG.agent}</span><div class="at"><b>Review pack agent</b> · drafts a one-page summary of this insight for your next area review.</div><button class="btn-sec" onclick="v3Agent('review','${a.id}')">Draft it</button></div>
        ${neg ? `<div class="v3-agent" data-v3-agent="followup"><span class="ai">${V3_SVG.agent}</span><div class="at"><b>Detractor follow-up agent</b> · lists the respondents behind this insight who agreed to be contacted, and creates follow-up tasks.</div><button class="btn-sec" onclick="v3Agent('followup','${a.id}')">Find respondents</button></div>` : ''}
        <p class="v3-note">Agents prepare drafts and tasks. Nothing is sent until you approve it.</p></div>
      <details class="id-sect v3-col" data-v3-limits><summary>Evidence limitations</summary><ul class="id-why"><li>Stores with fewer than 100 responses in the period are left out of store comparisons.</li><li>Comment themes are matched by AI and can include some unrelated comments.</li></ul></details>
      <details class="how-found" data-grounding><summary>How this insight was found</summary><dl><dt>Method</dt><dd>${/anomaly/.test(a.type)?'Anomaly detection against each store\'s normal daily range':/driver/.test(a.type)?'Key-driver analysis per store':/recurring|emerging/.test(a.type)?'Text analytics on open comments, compared across periods':'Comparison of scores between groups or periods, with a significance test'}</dd><dt>Data used</dt><dd>${v9Esc(a.basis)}</dd></dl></details>
    </div>`;
}
function v9OpenAM(id){
  const a = V9_AM_BY[id]; if(!a) return;
  const card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  panelUserClosed = false;
  document.getElementById('insights-split').classList.add('has-panel');
  document.querySelectorAll('.insight-card').forEach(c=>c.classList.toggle('active', c===card));
  const panel = document.getElementById('investigate-panel');
  panel.innerHTML = v6Shape(v9AMPanelRaw(a), id, {full:true});
  panel.classList.remove('hidden'); panel.scrollTop = 0;
}

/* ════════ Feed: pinned filters, Unread one click away ════════ */
const v9F = {type:new Set(), prio:new Set(), topic:new Set(), act:new Set(), date:'any'};
const V9_PRIO = [['high','Needs attention'],['med','Worth a look'],['pos','Bright spot'],['low','For awareness']];
const V9_DATES = [['any','Any time'],['latest','Latest update'],['2w','Last 2 updates'],['4w','Last 4 updates']];
const V9_ACT = [['followed','Followed'],['shared','Shared'],['plan','Has an action plan'],['comments','Has comments']];
var v9Menu = null;
const v9TopicOf = c=>{ const k = (c.querySelector('[data-el="kind-text"]') || c.querySelector('.ic-type') || {}).textContent || ''; return (k.split(' · ')[1] || k).trim(); };
function v9ActOf(id){
  const ev = (insightActivity[id] && insightActivity[id].events) || [];
  return {followed:!!followed[id], shared:ev.some(e=>e.type==='share') || sharedWithMe.some(s=>s.insightId===id && !s.dismissed), plan:!!actionPlans[id], comments:ev.some(e=>e.type==='comment')};
}
function v9Match(c){
  const id = c.dataset.id;
  if(v9F.type.size && !v9F.type.has(v3TypeOf(c))) return false;
  if(v9F.prio.size && !v9F.prio.has(c.dataset.priority)) return false;
  if(v9F.topic.size && !v9F.topic.has(v9TopicOf(c))) return false;
  if(v9F.act.size){ const a = v9ActOf(id); if(![...v9F.act].every(k=>a[k])) return false; }
  if(v9F.date!=='any'){ const i = EDITIONS.indexOf(v7DateOf(id)), lim = {latest:0,'2w':1,'4w':3}[v9F.date]; if(i>lim) return false; }
  return true;
}
const v9InMode = c=>v9Area ? c.classList.contains('v9-am') : !c.classList.contains('v9-am');
function v9Cards(){ return [...document.querySelectorAll('#card-grid .insight-card')].filter(v9InMode); }
v7Unread = function(){ return v9Cards().filter(c=>c.dataset.state==='active' && v7IsUnread(c.dataset.id)).length; };
function v9FilterCount(){ return v9F.type.size + v9F.prio.size + v9F.topic.size + v9F.act.size + (v9F.date!=='any' ? 1 : 0); }
function v9Pill(key, label){
  const sel = key==='date' ? (v9F.date!=='any' ? [V9_DATES.find(d=>d[0]===v9F.date)[1]] : []) : [...v9F[key]].map(v=>{
    const src = key==='type' ? V3_TYPES : key==='prio' ? V9_PRIO : key==='act' ? V9_ACT : null; const f = src && src.find(x=>x[0]===v); return f ? f[1] : v; });
  const txt = sel.length===0 ? label : sel.length===1 ? `${label}: ${sel[0]}` : `${label}: ${sel.length}`;
  return `<button class="v9-pill${sel.length?' on':''}" data-v9-pill="${key}" onclick="v9OpenMenu(event,'${key}')">${v9Esc(txt)}${V9_ICON.caret}</button>`;
}
function v9RenderFilters(){
  const col = document.getElementById('feed-col'); if(!col) return;
  let bar = document.getElementById('v9-filters');
  const head = col.querySelector('.feed-head');
  if(!bar){ bar = document.createElement('div'); bar.id = 'v9-filters'; if(head) head.parentNode.insertBefore(bar, head); else col.prepend(bar); }
  if(feedView!=='active'){ bar.style.display = 'none'; return; }
  bar.style.display = '';
  const n = v7Unread();
  bar.innerHTML = `<button class="v9-unread${v7UnreadOnly?' on':''}" data-v7-unread onclick="v7UnreadOnly=!v7UnreadOnly;applyFeedVisibility()"><i></i>Unread<span class="n">${n}</span></button><span class="v9-sep"></span>
    ${v9Pill('type','Type')}${v9Pill('prio','Priority')}${v9Pill('topic','Topic')}${v9Pill('date','Date')}${v9Pill('act','Activity')}
    ${v9FilterCount() ? `<button class="v9-clear" data-v9-clear onclick="v9ClearFilters()">Clear filters</button>` : ''}`;
}
function v9ClearFilters(){ v9F.type.clear(); v9F.prio.clear(); v9F.topic.clear(); v9F.act.clear(); v9F.date='any'; v7UnreadOnly = false; applyFeedVisibility(); }
function v9Options(key){
  const cards = v9Cards().filter(c=>c.dataset.state==='active');
  const cnt = fn=>cards.filter(fn).length;
  if(key==='type') return V3_TYPES.filter(t=>t[0]!=='all').map(t=>[t[0], t[1], cnt(c=>v3TypeOf(c)===t[0])]).filter(o=>o[2]);
  if(key==='prio') return V9_PRIO.map(p=>[p[0], p[1], cnt(c=>c.dataset.priority===p[0])]).filter(o=>o[2]);
  if(key==='topic'){ const m = {}; cards.forEach(c=>{ const t = v9TopicOf(c); if(t) m[t] = (m[t]||0) + 1; }); return Object.keys(m).sort().map(t=>[t,t,m[t]]); }
  if(key==='act') return V9_ACT.map(a=>[a[0], a[1], cnt(c=>v9ActOf(c.dataset.id)[a[0]])]);
  if(key==='date') return V9_DATES.map(d=>[d[0], d[1], '']);
}
function v9OpenMenu(ev, key){
  ev.stopPropagation();
  let m = document.getElementById('v9-menu');
  if(!m){ m = document.createElement('div'); m.id = 'v9-menu'; document.body.appendChild(m); }
  if(v9Menu===key && m.style.display==='block'){ m.style.display = 'none'; v9Menu = null; return; }
  v9Menu = key;
  const radio = key==='date';
  m.innerHTML = (key==='topic' ? '<p class="v9-mh">Similar issues share a topic</p>' : '') + v9Options(key).map(([v,l,n])=>{
    const on = radio ? v9F.date===v : v9F[key].has(v);
    return `<label class="v9-opt"><input type="${radio?'radio':'checkbox'}" name="v9-${key}" ${on?'checked':''} onchange="v9Toggle('${key}','${v9Esc(v)}',this.checked)"><span>${v9Esc(l)}</span>${n!=='' ? `<small>${n}</small>` : ''}</label>`;
  }).join('');
  const r = ev.currentTarget.getBoundingClientRect();
  m.style.display = 'block'; m.style.top = (r.bottom + 6) + 'px'; m.style.left = Math.min(r.left, innerWidth - 260) + 'px';
}
function v9Toggle(key, v, on){
  if(key==='date') v9F.date = v; else if(on) v9F[key].add(v); else v9F[key].delete(v);
  applyFeedVisibility();
  const m = document.getElementById('v9-menu'); if(m && key==='date'){ m.style.display = 'none'; v9Menu = null; }
}
document.addEventListener('click', e=>{ const m = document.getElementById('v9-menu'); if(m && m.style.display==='block' && !e.target.closest('#v9-menu')){ m.style.display = 'none'; v9Menu = null; } });
// "Similar issues": the same topic, newest first, from the drill-down
function v9Similar(topic){
  segNav('insights'); if(feedView!=='active'){ feedView = 'active'; }
  v9F.topic.clear(); v9F.topic.add(topic); v9F.type.clear(); v9F.prio.clear(); v9F.act.clear(); v9F.date = 'any'; v7UnreadOnly = false;
  applyFeedVisibility();
  toast(`Showing insights on ${topic}, newest first`);
}

/* ════════ Cards: date, hover Delete + Mark as unread, new Investigate icon ════════ */
const v9Short = e=>(e && e.short ? e.short.replace(/^[A-Z][a-z]{2}\s/,'') : '');
function v9PaintCard(c){
  const id = c.dataset.id, head = c.querySelector('.ic-head'); if(!head) return;
  let when = head.querySelector('.v9-when');
  if(!when){ when = document.createElement('span'); when.className = 'v9-when'; when.dataset.v9When = id; head.insertBefore(when, head.querySelector('.v3-x')); }
  when.textContent = v9Short(v7DateOf(id));
  let mu = head.querySelector('.v9-mu');
  if(!mu){ mu = document.createElement('button'); mu.className = 'v9-mu'; mu.dataset.v9Mu = id; mu.setAttribute('onclick', `event.stopPropagation();v9ToggleRead('${id}')`); head.insertBefore(mu, head.querySelector('.v3-x')); }
  const unread = v7IsUnread(id);
  mu.innerHTML = unread ? V9_ICON.read : V9_ICON.unread; mu.title = unread ? 'Mark as read' : 'Mark as unread';
  const x = head.querySelector('.v3-x'); if(x && x.dataset.v9!=='1'){ x.dataset.v9 = '1'; x.innerHTML = V9_ICON.trash; x.title = 'Delete'; }
  if(x) head.appendChild(x);
  c.querySelectorAll('.ic-acts .btn-pri').forEach(b=>{ if(/Investigate/.test(b.textContent) && !b.dataset.v9){ b.dataset.v9 = '1'; b.innerHTML = V9_ICON.open + 'Investigate'; } });
}
function v9ToggleRead(id){
  if(v7Read.has(id)) v7Read.delete(id); else v7Read.add(id);
  applyFeedVisibility();
}

/* ════════ applyFeedVisibility: mode, filters, date groups, counts ════════ */
const _v9Apply = applyFeedVisibility;
applyFeedVisibility = function(){
  v9EnsureAMCards();
  _v9Apply();
  const grid = document.getElementById('card-grid'); if(!grid) return;
  const all = [...grid.querySelectorAll('.insight-card')];
  all.forEach(c=>{ if(!v9InMode(c)) c.style.display = 'none'; });
  if(feedView==='active') all.forEach(c=>{ if(c.style.display!=='none' && !v9Match(c)) c.style.display = 'none'; });
  all.forEach(c=>{ v7PaintCard(c); v9PaintCard(c); });
  // regroup by date with counts that respect the filters
  grid.querySelectorAll('.v7-date').forEach(h=>h.remove());
  if(feedView==='active'){
    const cards = all.filter(c=>c.style.display!=='none');
    const idx = c=>EDITIONS.indexOf(v7DateOf(c.dataset.id));
    cards.sort((a,b)=>idx(a)-idx(b) || (V7_RANK[a.dataset.priority]??4) - (V7_RANK[b.dataset.priority]??4));
    let cur = null;
    cards.forEach(c=>{
      const e = v7DateOf(c.dataset.id);
      if(e!==cur){ cur = e; const n = cards.filter(x=>v7DateOf(x.dataset.id)===e).length;
        const h = document.createElement('div'); h.className = 'v7-date'; h.dataset.v7Date = e.id;
        h.innerHTML = `<b>${e.short}</b>${e.id===CURRENT_EDITION && !(typeof v8Quiet!=='undefined' && v8Quiet) ? '<span class="lt">Latest update</span>' : ''}<span class="n">${n}</span>`;
        grid.appendChild(h); }
      grid.appendChild(c);
    });
  }
  const unread = v7Unread();
  const label = document.getElementById('feed-count-label');
  if(label && feedView==='active'){
    const vis = all.filter(c=>c.style.display!=='none').length;
    label.innerHTML = `${vis} ${vis===1?'insight':'insights'}${unread ? ` <span style="color:#1a73e8;font-weight:600">· ${unread} unread</span>` : ''}`;
  }
  if(label && feedView==='closed'){ const vis = all.filter(c=>c.style.display!=='none').length; label.textContent = `${vis} deleted ${vis===1?'insight':'insights'}`; }
  const et = document.getElementById('feed-empty-title'); if(et && feedView==='closed') et.textContent = 'Nothing deleted';
  v9RenderFilters();
  updateFeedNeed();
};
v7RefreshCounts = function(){ applyFeedVisibility(); };

/* ════════ Deleted (was Dismissed): trash icon, same reason prompt ════════ */
const _v9Toast = toastAction;
toastAction = function(msg, ...rest){ return _v9Toast(String(msg).replace(/^Dismissed/,'Deleted').replace('under Dismissed','under Deleted'), ...rest); };
const _v9Dm = v3DismissMenu;
v3DismissMenu = function(ev, id){ _v9Dm(ev, id); const m = document.getElementById('v3-dm'); if(!m) return;
  const p = m.querySelector('p'); if(p) p.textContent = 'Why are you deleting this?';
  const go = m.querySelector('[data-v7-dismiss-go]'); if(go) go.textContent = 'Delete'; };
const _v9Dismiss = v3Dismiss;
v3Dismiss = function(id, reason){ _v9Dismiss(id, reason); const ev = insightActivity[id] && insightActivity[id].events; const l = ev && ev[ev.length-1]; if(l && /^dismissed this/.test(l.text)) l.text = l.text.replace(/^dismissed/,'deleted'); };
const _v9Case2 = v6Case;
v6Case = function(id){ const c = _v9Case2(id); if(c && c.chip==='Dismissed'){ c.chip = 'Deleted'; c.text = c.text.replace('You dismissed this','You deleted this'); } return c; };
const _v9Bin = v3OpenBin;
v3OpenBin = function(){ _v9Bin(); const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Deleted'; };

/* ════════ Drill-down: whole right side, actions on top, four sections, agents as rows ════════ */
const V9_KEEP = ['Customer voice','Next steps','Activity and comments','Activity','Since you followed','What we found'];
function v9Reshape(html, id){
  const t = document.createElement('template'); t.innerHTML = html;
  const f = t.content, head = f.querySelector('.v6-head'), bar = f.querySelector('[data-v6-bar]'), body = f.querySelector('.v6-body');
  // 1. actions at the top: Follow, Share, Create action plan, Delete (trash)
  if(head && bar){
    const acts = document.createElement('div'); acts.className = 'v9-acts'; acts.dataset.v9Acts = id;
    const fol = bar.querySelector('[data-v3-follow]'), share = bar.querySelector('[data-v6-share]'), pri = bar.querySelector('.v6-pri'),
          del = bar.querySelector('[data-v3-dismiss-panel]'), done = bar.querySelector('[data-panel-done]');
    [fol, share].forEach(b=>{ if(b){ b.className = 'v9-b' + (b.classList.contains('on') ? ' on' : ''); acts.appendChild(b); } });
    if(pri){ pri.className = 'v9-pri'; acts.appendChild(pri); }
    const sp = document.createElement('span'); sp.className = 'sp'; acts.appendChild(sp);
    if(done){ done.className = 'v9-b'; acts.appendChild(done); }
    if(del){ del.className = 'v9-ib'; del.title = 'Delete'; del.innerHTML = V9_ICON.trash; acts.appendChild(del); }
    head.appendChild(acts);
    bar.remove();
  }
  // the topic chip opens "similar issues"
  if(head){
    const fullIc = head.querySelector('.v6-chips button[title="Open full page"]'); if(fullIc) fullIc.dataset.v3Full = '1';
    const chip = [...head.querySelectorAll('.v6-chip')].find(c=>!c.classList.contains('prio') && !c.classList.contains('st'));
    const topic = chip ? (chip.textContent.split(' · ')[1] || '').trim() : '';
    if(chip && topic){ const b = document.createElement('button'); b.className = 'v6-chip v9-topic'; b.title = 'Show similar issues: every insight on this topic, newest first'; b.dataset.v9Similar = topic;
      b.setAttribute('onclick', `v9Similar('${v9Esc(topic).replace(/'/g,"\\'")}')`); b.innerHTML = `${v9Esc(chip.textContent.trim())}<span>Similar issues</span>`; chip.replaceWith(b); }
  }
  if(body){
    // 2. one "What we found" section: the figures, why it is ranked, the summary, and the charts and tables behind it
    let found = body.querySelector('.v6-found');
    const metrics = body.querySelector('[data-v6-metrics]'), why = body.querySelector('.v6-why');
    if(!found){ found = document.createElement('div'); found.className = 'id-sect v6-found'; found.innerHTML = '<div class="v6-sh"><b>What we found</b><span></span></div>'; }
    const sh = found.querySelector('.v6-sh span'); if(sh) sh.textContent = '';
    const shHead = found.querySelector('.v6-sh');
    if(metrics) shHead.after(metrics);
    if(why){ why.classList.add('v9-why'); (metrics || shHead).after(why); }
    const anchor = body.querySelector('[data-v6-case]') || null;
    const illus = body.querySelector('.illus-banner');
    if(anchor) anchor.after(found); else body.prepend(found);
    if(illus) found.before(illus);
    [...body.querySelectorAll(':scope > .id-sect')].forEach(s=>{
      if(s===found) return;
      const h = s.querySelector(':scope > .v6-sh b'), name = h ? h.textContent.trim() : '';
      if(!name || V9_KEEP.includes(name) || /^Since you followed/.test(name)) return;
      const cap = document.createElement('p'); cap.className = 'v9-cap'; cap.textContent = name;
      const block = document.createElement('div'); block.className = 'v9-block'; block.appendChild(cap);
      s.querySelector(':scope > .v6-sh').remove();
      while(s.firstChild) block.appendChild(s.firstChild);
      found.appendChild(block); s.remove();
    });
    // 3. agents: same rows as next steps — name, description, "Send to agent"
    body.querySelectorAll('.v3-agent').forEach(a=>{
      const at = a.querySelector('.at'), kind = a.dataset.v3Agent || 'review';
      const name = at && at.querySelector('b') ? at.querySelector('b').textContent : 'Agent';
      const desc = at ? at.textContent.replace(name,'').replace(/^\s*·\s*/,'').trim() : '';
      const row = document.createElement('div'); row.className = 'v6-row agent v9-agent'; row.dataset.v3Agent = kind;
      row.innerHTML = `<span class="ri ag">${V9_ICON.agent}</span><div class="rt"><b>${v9Esc(name)}</b><p>${v9Esc(desc.charAt(0).toUpperCase() + desc.slice(1))}</p></div><div class="rb"><button class="btn-sec" data-v9-send-agent="${kind}" onclick="v3Agent('${kind}','${id}')">Send to agent</button></div>`;
      a.replaceWith(row);
    });
    body.querySelectorAll('.id-sect p.eyebrow').forEach(p=>{ if(/let an agent do it/i.test(p.textContent)) p.remove(); });
    body.querySelectorAll('.v9-agent ~ .v3-note, .v6-row ~ p.v3-note').forEach(n=>{ n.className = 'v9-hint'; n.textContent = 'Agents are set up in Sprinklr. They prepare drafts and tasks, and nothing is sent until you approve it.'; });
    // next-step share buttons name the group, not a person
    body.querySelectorAll('[data-v3-cta="share-am"]').forEach(b=>{ b.textContent = 'Share with Area Managers'; b.setAttribute('onclick', `v9ShareGroup('${id}','Area Managers')`); });
    body.querySelectorAll('[data-v3-cta="share-central"]').forEach(b=>{ b.textContent = 'Share with Central Operations'; b.setAttribute('onclick', `v9ShareGroup('${id}','Central Operations')`); });
    // 4. the two collapsibles look the same and sit at the end
    const details = [...body.querySelectorAll(':scope > details[data-v3-limits], :scope > details.v6-det, :scope > details.how-found')];
    details.forEach(d=>{ d.className = 'v9-det'; body.appendChild(d); });
  }
  const box = document.createElement('div'); box.appendChild(f); return box.innerHTML;
}
const _v9Shape = v6Shape;
v6Shape = function(html, id, opts){ return v9Reshape(_v9Shape(html, id, opts), id); };
// the header shrinks to one row while you scroll the insight
document.addEventListener('scroll', e=>{
  const p = e.target; if(!p || !p.id || !/^(investigate|followed|shared)-panel$/.test(p.id)) return;
  const h = p.querySelector('.v6-head'); if(h) h.classList.toggle('v9-compact', p.scrollTop > 60);
}, true);

// area insights open their own drill-down; everything else as before
const _v9Open = openInvestigate;
openInvestigate = function(el){
  const id = typeof el==='string' ? el : (el && el.closest && el.closest('.insight-card') ? el.closest('.insight-card').dataset.id : null);
  if(id && v9IsAM(id)){
    v9OpenAM(id);
    if(!v7Read.has(id)){ v7Read.add(id); applyFeedVisibility(); }
    return;
  }
  return _v9Open(el);
};

/* the drill-down takes the whole right side, from the page title down; Ask Copilot stays with the list */
function v9Place(){
  const head = document.getElementById('page-head');
  let open = null;
  ['investigate-panel','followed-panel','shared-panel','v3-scope-panel'].forEach(pid=>{
    const p = document.getElementById(pid); if(!p) return;
    const vis = !p.closest('.hidden') && p.getClientRects().length>0 && p.innerHTML.trim();
    if(vis) open = p; else if(p.dataset.v9Fixed){ p.style.position = p.style.left = p.style.right = p.style.top = p.style.width = ''; delete p.dataset.v9Fixed; }
  });
  document.querySelectorAll('[data-v9-narrow]').forEach(n=>{ if(!open || !open.closest('[id^="view-"]').contains(n)){ n.style.maxWidth = ''; n.style.marginLeft = ''; delete n.dataset.v9Narrow; } });
  if(!open){ if(head){ head.style.maxWidth = ''; head.style.marginLeft = ''; } document.body.classList.remove('v9-open'); return; }
  document.body.classList.add('v9-open');
  const split = open.parentElement, list = split.firstElementChild, full = split.classList.contains('v3-fullpage');
  const lr = list.getBoundingClientRect(), sr = split.getBoundingClientRect();
  const top = Math.max(8, head ? head.getBoundingClientRect().top + 8 : 16);
  const left = full ? sr.left : lr.right + 20;
  Object.assign(open.style, {position:'fixed', top:top+'px', left:left+'px', right:'16px', width:'auto', height:(innerHeight - top - 16)+'px', maxHeight:'none'});
  open.dataset.v9Fixed = '1';
  if(head){ const ml = head.parentElement.getBoundingClientRect().left;
    head.style.maxWidth = full ? '' : Math.max(320, lr.right - ml + 24) + 'px'; head.style.marginLeft = full ? '' : '0'; }
  // anything in the page above the list stays within the list's width
  const view = open.closest('[id^="view-"]');
  if(view && !full) [...view.children].forEach(ch=>{ if(!ch.contains(open) && ch.offsetParent!==null){ ch.style.maxWidth = (lr.width) + 'px'; ch.style.marginLeft = '0'; ch.dataset.v9Narrow = '1'; } });
}
addEventListener('scroll', ()=>requestAnimationFrame(v9Place), {passive:true});
addEventListener('resize', ()=>requestAnimationFrame(v9Place));
new MutationObserver(()=>requestAnimationFrame(v9Place)).observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});

/* ════════ Sharing with groups from platform roles and teams ════════ */
const V9_GROUPS = [
  {name:'Store Managers', src:'Role', n:30, on:true},
  {name:'Area Managers', src:'Role', n:4, on:true},
  {name:'Central Operations', src:'Team', n:6, on:true},
  {name:'Country Head', src:'Role', n:1, on:false},
  {name:'Merchandising', src:'Team', n:5, on:false}
];
// groups sit at the top of the share list; only the ones turned on in Configure
V9_GROUPS.forEach(g=>shareContacts.push({name:g.name, role:`Group · ${g.src} · ${g.n} ${g.n===1?'person':'people'}`, access:'full', v9Group:true}));
const _v9OpenShare = openShareModal;
openShareModal = function(id){
  _v9OpenShare(id);
  const box = document.getElementById('share-contacts'); if(!box) return;
  const rows = [...box.querySelectorAll('[data-contact]')];
  const groups = rows.filter(r=>(shareContacts[+r.dataset.contact]||{}).v9Group);
  groups.forEach(r=>{ const g = V9_GROUPS.find(x=>x.name===shareContacts[+r.dataset.contact].name); if(!g || !g.on) r.remove(); else r.classList.add('v9-grow'); });
  const live = groups.filter(r=>r.isConnected);
  if(live.length){
    box.insertAdjacentHTML('afterbegin', '<p class="v9-shl">Groups</p>');
    let after = box.firstElementChild; live.forEach(r=>{ after.after(r); after = r; });
    after.insertAdjacentHTML('afterend', '<p class="v9-shl">People</p>');
  }
};
function v9ShareGroup(id, group){
  openShareModal(id);
  if(typeof v3Prefill==='function') v3Prefill(group);
}
const _v9Cfg = configureHTML;
configureHTML = function(){
  let h = _v9Cfg();
  const sect = `<div class="border-t border-line2"></div>
      <div data-v9-groups>
        <p class="text-[12.5px] font-600 text-txt-1 mb-0.5">Share suggestions</p>
        <p class="text-[11.5px] text-txt-3 mb-2.5">Groups that next steps can suggest sharing with. They come from your Sprinklr roles and teams, so they work for any business.</p>
        <div class="v9-groups">${V9_GROUPS.map((g,i)=>`<label class="v9-grp"><input type="checkbox" ${g.on?'checked':''} onchange="V9_GROUPS[${i}].on=this.checked"><span><b>${g.name}</b><small>${g.src} · ${g.n} ${g.n===1?'person':'people'}</small></span></label>`).join('')}</div>
        <p class="text-[11px] text-txt-4 mt-2 leading-snug">Example groups. Roles and teams are managed in Sprinklr settings, not here.</p>
      </div>`;
  return h.replace('<!-- Email: assigned by the CX admin', sect + '\n      <!-- Email: assigned by the CX admin');
};

/* ════════ Followed and Shared: unread is bold with a dot, no labels ════════ */
function v9PaintTabCards(){
  document.querySelectorAll('#followed-list .fol-card').forEach(c=>{
    const id = c.dataset.folId, f = followed[id] || {};
    c.classList.toggle('v7-unread', !!f.updated);
    c.querySelectorAll('[data-fol-updated]').forEach(x=>x.remove());
    c.querySelectorAll('[data-fol-ev]').forEach(x=>{ x.textContent = x.dataset.folEv==='thin' ? 'Too few responses in the latest update · showing the last reliable figure' : 'No longer significant · still updating because you follow it'; });
    c.querySelectorAll('.btn-pri').forEach(b=>{ if(/Investigate/.test(b.textContent)) b.innerHTML = V9_ICON.open + 'Investigate'; });
  });
  document.querySelectorAll('#shared-list .shr-card').forEach(c=>{
    const s = sharedWithMe.find(x=>x.id===c.dataset.shareCard) || {};
    c.classList.toggle('v7-unread', !!s.unread);
    c.querySelectorAll('[data-share-unread]').forEach(x=>x.remove());
    c.querySelectorAll('.btn-pri').forEach(b=>{ if(/Investigate|View insight/.test(b.textContent)) b.innerHTML = V9_ICON.open + 'Investigate'; });
  });
}
const _v9Fol = renderFollowedTab;
renderFollowedTab = function(){ const r = _v9Fol.apply(this, arguments); v9PaintTabCards(); return r; };
const _v9Shr = renderSharedTab;
renderSharedTab = function(){ const r = _v9Shr.apply(this, arguments); v9PaintTabCards(); return r; };
updateFollowedBadge = function(){
  const b = document.getElementById('followed-badge'), u = document.getElementById('followed-upd');
  const n = Object.keys(followed).length, upd = Object.keys(followed).filter(id=>followed[id].updated).length;
  if(u){ u.textContent = upd || ''; u.dataset.n = upd; u.title = upd ? upd + ' unread' : ''; u.style.display = upd ? '' : 'none'; }
  if(b){ b.textContent = n; b.style.display = (n && !upd) ? '' : 'none'; }
};

/* ════════ Left nav: Action plans and Alerts in their own group; Alerts page ════════ */
function v9Nav(){
  const nav = document.getElementById('si-subnav'); if(!nav || nav.dataset.v9) return; nav.dataset.v9 = '1';
  const hr = nav.querySelector('hr'), plans = document.getElementById('v3-nav-plans');
  const grp = document.createElement('hr'); grp.className = 'v9-hr';
  hr.before(grp);
  if(plans) grp.after(plans);
  (plans || grp).insertAdjacentHTML('afterend', `<button class="sn-i" id="v9-nav-alerts" onclick="segNav('alerts')">${V9_ICON.bell}<span class="sn-t">Alerts</span><span class="sn-c" id="v9-alerts-n"></span></button>`);
  const bin = document.getElementById('v3-nav-bin'); if(bin){ const t = bin.querySelector('.sn-t'); if(t) t.textContent = 'Deleted'; const ic = bin.querySelector('svg'); if(ic) ic.outerHTML = V9_ICON.trash; }
}
function v9AlertsHTML(){
  // the same alert rules the AI setup offers (setup-brief.js)
  const rules = [{id:'overall',t:'Overall satisfaction falls below your aim'},{id:'service',t:'Service satisfaction falls below your aim'},
    {id:'vol',t:'Responses a week drop sharply',sub:'Usual about 16 · a sign the survey itself has a problem'},{id:'theme',t:'A complaint theme spikes',sub:'Like the card-payment failures on 14–15 Sep'}];
  const on = ()=>true;
  return `<div class="v9-alerts" data-v9-alerts>
    <p class="v9-al-intro">Alerts tell you straight away when something cannot wait for your next update. They arrive by email and are listed here.</p>
    <div class="spr-card v9-al-box"><p class="v9-al-h">Recent alerts</p>
      <div class="v9-al-row"><span class="v9-al-ic">${V9_ICON.bell}</span><div><b>A complaint theme spiked: card and wallet payments failing</b><p>11 comments on 14–15 Sep at RT ATYAF MALL, against about 1 a week normally. Sent by email on 15 Sep, 09:00.</p></div>
        <button class="btn-sec" onclick="segNav('insights');openInvestigate('INS-05')">Open insight</button></div>
      <p class="v9-hint">Example. Alerts are not designed yet; this page holds their place.</p></div>
    <div class="spr-card v9-al-box"><p class="v9-al-h">Alert me when</p>
      ${rules.map(r=>`<div class="v9-al-rule"><div><b>${v9Esc(r.t)}</b>${r.sub ? `<p>${v9Esc(r.sub)}</p>` : ''}</div><span class="v9-al-st ${on(r.id)?'on':''}">${on(r.id)?'On':'Off'}</span></div>`).join('')}
      <p class="v9-hint">Set up during onboarding. Change them in Configure.</p></div></div>`;
}
const _v9Seg = segNav;
segNav = function(v){
  let view = document.getElementById('view-alerts');
  if(v==='alerts'){
    _v9Seg('insights');
    if(!view){ view = document.createElement('div'); view.id = 'view-alerts'; view.className = 'px-6 pb-14'; const vi = document.getElementById('view-insights'); vi.parentNode.insertBefore(view, vi.nextSibling); }
    document.getElementById('view-insights').classList.add('hidden');
    closeInvestigatePanel && closeInvestigatePanel();
    view.innerHTML = v9AlertsHTML(); view.classList.remove('hidden');
    document.querySelectorAll('#si-subnav .sn-i').forEach(b=>b.classList.toggle('active', b.id==='v9-nav-alerts'));
    const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Alerts';
    return;
  }
  if(view) view.classList.add('hidden');
  const a = document.getElementById('v9-nav-alerts'); if(a) a.classList.remove('active');
  return _v9Seg(v);
};

/* ════════ Update line: no "Your first insights"; no Welcome back card ════════ */
const _v9Bar = renderEditionBar;
renderEditionBar = function(){ _v9Bar(); const t = document.querySelector('#edition-bar [data-edition-tag]'); if(t) t.innerHTML = t.innerHTML.replace('Your first insights · ',''); };
renderCatchup = function(){ const el = document.getElementById('catchup'); if(el){ el.classList.add('hidden'); el.innerHTML = ''; } };

/* ════════ Day 50 · Area Manager journey ════════ */
const _v9Journey = setJourney;
setJourney = function(state){
  const area = state==='day50-area';
  v9Area = area;
  _v9Journey(area ? 'day50' : state);
  document.querySelectorAll('.journey-btn').forEach(b=>b.classList.toggle('active', b.dataset.state===state));
  if(area){ V9_AM.forEach(a=>{ if(a.unread) v7Read.delete(a.id); else v7Read.add(a.id); }); closeInvestigatePanel(); }
  const pill = document.querySelector('[data-scope-pill]');
  if(pill) pill.textContent = area ? 'CRN area · 30 stores' : V3_SCOPES[v3Scope].label;
  v9ClearFilters();
};
(function v9AddJourney(){
  const d50 = document.querySelector('.journey-btn[data-state="day50"]'); if(!d50 || document.querySelector('[data-state="day50-area"]')) return;
  d50.insertAdjacentHTML('afterend', `<button class="journey-btn" data-state="day50-area" onclick="setJourney('day50-area')">Day 50 · Area Manager, 30 stores</button>`);
})();

/* ════════ Use cases ════════ */
UC_ROWS.push(
  ['Feed','"Similar issues": every insight on the same topic, newest first, instead of linking insights to each other','h','—','Needs a stable topic list per survey: if the AI names a topic differently from one update to the next, the filter breaks.','Topic filter; topic chip in the drill-down'],
  ['Sharing','Share suggestions use groups from Sprinklr roles and teams (Area Managers, Central Operations), so they work in any industry','h','—','From the 20 Oct review. Groups are read from the platform, not set up in Survey Insights.','Configure → Share suggestions; next-step share buttons'],
  ['Agents','Agents are set up in the platform; an insight is sent to an agent with one generic action','h','—','From the 20 Oct review. Each agent\'s description must say what comes back.','Next steps: agent rows with "Send to agent"']
);

/* ── start ── */
(function v9Init(){
  v9Nav(); v9EnsureAMCards(); v3DecorateCards(); renderEditionBar(); renderCatchup(); applyFeedVisibility(); updateFollowedBadge();
  if(document.getElementById('followed-list')) renderFollowedTab();
  if(document.getElementById('shared-list')) renderSharedTab();
})();

/* page Copilot answers about the feed you are looking at (store or area) */
const _v9FeedCards = v3FeedCards;
v3FeedCards = function(){ return _v9FeedCards().filter(v9InMode); };
