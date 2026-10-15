/* ═══ SHARING — send insights to colleagues, and see what's shared with you ═══ */
// each contact's data access, relative to this insight's scope (RT ATYAF MALL)
const shareContacts = [
  {name:'Anish', role:'VP, Customer Experience', access:'full', accessLabel:'All stores'},
  {name:'Fatima Al-Rashid', role:'Store Manager — RT SHUWAIKH', access:'none', accessLabel:'RT SHUWAIKH only'},
  {name:'Omar Hassan', role:'Area Manager — Central Region', access:'full', accessLabel:'Central Region (incl. RT ATYAF MALL)'},
  {name:'CX Ops Team', role:'Shared inbox', access:'full', accessLabel:'All stores'}
];
// pre-seeded so the receiver experience is inspectable immediately, without needing a user-switcher
let sharedWithMe = [
  {id:'sw3', insightId:'CTY-01', insightTitle:'Payment-failure complaints spiked across KSA stores on 14–15 Sep', insightTag:'Anomaly — payments', from:'Khalid Al-Mansour', fromRole:'Country Manager — KSA', note:'Seeing this across 9 KSA stores. Can each store confirm what happened on their side?', date:'1 day ago', unread:true, reviewed:false, external:true, scope:'KSA · 42 stores', access:'partial'},
  {id:'sw1', insightId:'INS-02', insightTitle:'Offer clarity complaints remain visible', insightTag:'Promotion communication', from:'Fatima Al-Rashid', fromRole:'Store Manager — RT SHUWAIKH', note:'Seeing the same thing at our store — worth a network-wide look?', date:'2 days ago', unread:true, reviewed:false},
  {id:'sw4', insightId:'SHW-01', insightTitle:'Fitting-room waits are the top complaint among detractors at RT SHUWAIKH', insightTag:'Key driver', from:'Fatima Al-Rashid', fromRole:'Store Manager — RT SHUWAIKH', note:'Fitting rooms are our biggest pain point — worth checking at yours?', date:'3 days ago', unread:false, reviewed:false, external:true, scope:'RT SHUWAIKH', access:'none'},
  {id:'sw2', insightId:'INS-01', insightTitle:'Overall store satisfaction improved meaningfully', insightTag:'Overall satisfaction', from:'Anish', fromRole:'VP, Customer Experience', note:'', date:'5 days ago', unread:false, reviewed:true}
];
/* ═══ INSIGHT JOURNEY — status + activity timeline (shares, comments, status changes) per insight ═══
   This is the "ticket-like" layer: once an insight is shared, it needs a status and a place
   for the conversation about it to live, not just a one-off notification. */
let insightActivity = {
  'INS-02': {
    status: 'in-progress',
    events: [
      {type:'share', by:'Fatima Al-Rashid', text:'shared this with you', date:'2 days ago'},
      {type:'comment', by:'Fatima Al-Rashid', text:'Seeing the same thing at our store — worth a network-wide look?', date:'2 days ago'},
      {type:'comment', by:'You', text:"Agreed. I'll flag it to the Central team so we can check promo signage across stores.", date:'1 day ago'},
      {type:'plan', by:'You', text:'created an action plan', date:'1 day ago'}
    ]
  },
  'INS-01': {
    status: 'resolved',
    events: [
      {type:'follow', by:'You', text:'started following this insight', date:'28 days ago'},
      {type:'share', by:'Anish', text:'shared this with you', date:'5 days ago'}
    ]
  },
  'CTY-01': {
    status: 'open',
    events: [
      {type:'share', by:'Khalid Al-Mansour', text:'shared this with you', date:'1 day ago'},
      {type:'comment', by:'Khalid Al-Mansour', text:'Seeing this across 9 KSA stores. Can each store confirm what happened on their side?', date:'1 day ago'}
    ]
  },
  'SHW-01': {
    status: 'open',
    events: [
      {type:'share', by:'Fatima Al-Rashid', text:'shared this with you', date:'3 days ago'},
      {type:'comment', by:'Fatima Al-Rashid', text:'Fitting rooms are our biggest pain point — worth checking at yours?', date:'3 days ago'}
    ]
  },
};
const STATUS_META = {
  'open':        {cls:'acc', label:'Open',        dot:'#1a73e8', desc:'New — nobody has looked at it yet'},
  'reviewed':    {cls:'',    label:'Reviewed',    dot:'#7a8394', desc:'Seen and understood, no action started'},
  'in-progress': {cls:'wrn', label:'In Progress', dot:'#b0730a', desc:'Someone is actively acting on it'},
  'resolved':    {cls:'pos', label:'Resolved',    dot:'#0e8a5f', desc:'Action taken — kept for the record'}
};
const STATUS_ORDER = ['open','reviewed','in-progress','resolved'];
function initials(name){ return name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase(); }
function statusTag(status){ const s = STATUS_META[status]||STATUS_META['open']; return `<span class="tag ${s.cls}">${s.label}</span>`; }
function updateCardStatusPill(id){ updatePlanChip(id); }      // kept as an alias for older callers
function updateAllCardStatusPills(){ updateAllPlanChips(); }
function refreshInvestigatePanel(id){
  if(typeof currentViewerShare!=='undefined' && currentViewerShare){
    const vs = sharedWithMe.find(x=>x.id===currentViewerShare);
    if(vs && vs.insightId===id) refreshSharedViewer();
  }
  const activeCard = document.querySelector('.insight-card.active');
  if(activeCard && activeCard.getAttribute('data-id')===id && !activeTab()){
    document.getElementById('investigate-panel').innerHTML = investigateHTML(activeCard);
  }
  renderTabPanel();
  if(quietOn && quietSel===id) renderQuietPanel();
}
function activityLine(e){
  if(e.type==='comment'){
    return `<div class="flex gap-2.5 py-1.5">
      <span class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[9.5px] font-600 text-white" style="background:${e.by==='You'?'#1a73e8':'#7e57c2'}">${initials(e.by)}</span>
      <div class="flex-1 min-w-0 rounded-md px-3 py-2" style="background:var(--surface-2);border:1px solid var(--line-soft)">
        <div class="flex items-center gap-2"><span class="text-[12px] font-600 text-txt-1">${e.by}</span><span class="text-[10.5px] text-txt-4">${e.date}</span></div>
        <p class="text-[12.5px] text-txt-2 mt-0.5 leading-snug">${e.text}</p>
      </div>
    </div>`;
  }
  const icon = e.type==='plan' ? PLAN_ICON.replace('class="plan-ico"','class="plan-ico" style="width:13px;height:13px"')
    : e.type==='follow'
    ? '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>'
    : e.type==='share'
    ? '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg>'
    : '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
  return `<div class="flex items-center gap-2 py-1 pl-1 text-[11.5px] text-txt-4">
    <span class="flex-shrink-0 text-txt-4">${icon}</span>
    <span><span class="font-500 text-txt-2">${e.by}</span> ${e.text}</span>
    <span class="text-txt-4">&middot; ${e.date}</span>
  </div>`;
}
function renderActivitySection(id){
  const a = insightActivity[id];
  const log = (a && a.events.length) ? `<div class="mb-2 mt-2">${a.events.map(activityLine).join('')}</div>`
    : `<p class="text-[12px] text-txt-3 mt-2 mb-2">No activity yet. Comments, shares and action plans on this insight show here.</p>`;
  return `${log}
    <div class="flex items-center gap-2 mt-2">
      <input id="comment-input-${id}" class="flex-1 text-[12.5px] border border-line rounded-md px-3 h-8 focus:outline-none focus:border-spr-blue" placeholder="Add a comment for your team…" onkeydown="if(event.key==='Enter')addComment('${id}')">
      <button class="btn-sec" style="padding:6px 11px;font-size:12px" onclick="addComment('${id}')">Post</button>
    </div>`;
}
function addComment(id){
  const input = document.getElementById('comment-input-'+id);
  const text = input.value.trim();
  if(!text) return;
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  insightActivity[id].events.push({type:'comment', by:'You', text, date:'just now'});
  input.value='';
  refreshInvestigatePanel(id);
  if(typeof renderFreshness==='function') renderFreshness();
  renderFollowedTab();
}
function setInsightStatus(id, status){
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  if(insightActivity[id].status===status) return;
  insightActivity[id].status = status;
  insightActivity[id].events.push({type:'status', by:'You', text:'set status to '+STATUS_META[status].label, date:'just now'});
  updateCardStatusPill(id);
  refreshInvestigatePanel(id);
  renderSharedTab();
  renderFollowedTab();
}
let currentShareId = null;

function updateSharedBadge(){
  const b=document.getElementById('shared-badge');
  if(b){ const n = sharedWithMe.filter(s=>s.unread && !s.dismissed).length; b.textContent = n; b.dataset.n = n; b.style.display = n ? '' : 'none'; b.title = n + ' new'; }
}

function renderSharedTab(){
  const list = document.getElementById('shared-list');
  if(!list) return;
  const live = sharedWithMe.filter(s=>!s.dismissed);
  const nDismissed = sharedWithMe.length - live.length;
  const restoreNote = nDismissed ? `<p class="restore-link mb-3">${nDismissed} done · <button onclick="restoreAllShared()">Restore</button></p>` : '';
  if(!live.some(x=>x.id===tabSel.shared)) tabSel.shared = live.length ? live[0].id : null;   // the top card is open by default
  if(live.length===0){
    renderTabPanel('shared');
    list.innerHTML = restoreNote + `<div class="spr-card p-8 text-center">
      <svg class="w-7 h-7 mx-auto mb-2 text-txt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg>
      <p class="text-[13.5px] font-600 text-txt-1">Nothing shared with you yet</p>
      <p class="text-[12.5px] text-txt-3 mt-1">When a colleague shares an insight with you, it'll show up here.</p>
    </div>`;
    return;
  }
  list.innerHTML = restoreNote + live.map(s=>{
    const id = s.insightId, p = cardParts(id);
    const initials = s.from.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
    const scopeTags = (s.external ? `<span class="tag" data-share-scope>Scope: ${s.scope}</span><span class="tag wrn" data-share-access="${s.access}"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>${s.access==='none' ? 'No access to underlying data' : 'Partial access — your store only'}</span>` : '')
      + (accessRequested.has(s.id) ? '<span class="tag">Access requested</span>' : '');
    return `<div class="shr-card ic spr-card" data-share-card="${s.id}" data-sel-key="${s.id}" data-priority="${p.level}" onclick="if(!event.target.closest('button,a'))openInvestigateFromShare('${s.id}')">
      <div class="ic-from">
        <span class="ic-av">${initials}</span>
        <div class="ic-from-text">
          <p><b>${s.from}</b><span>${s.fromRole} · shared ${s.date}</span>${s.unread ? '<span class="fresh-tag new" data-share-unread>New</span>' : ''}</p>
          ${s.note ? `<p class="ic-note">&ldquo;${s.note}&rdquo;</p>` : ''}
        </div>
      </div>
      ${cardBodyHTML(id, p, scopeTags, planChipHTML(id), '')}
      <div class="ic-foot">
        <p class="ic-basis">${p.basis}</p>
        <div class="ic-acts">
          ${planBtnHTML(id)}
          <button class="btn-sec${followed[id]?' on':''}" data-share-follow="${s.id}" onclick="toggleFollowFromShare('${s.id}')">${followed[id] ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>
          <button class="btn-sec" data-share-done="${s.id}" title="Clear it from Shared" onclick="dismissShare('${s.id}')"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/></svg>Mark as done</button>
          <button class="btn-pri" onclick="openInvestigateFromShare('${s.id}')">${STAR_ICON}View insight</button>
        </div>
      </div>
    </div>`;
  }).join('');
  renderTabPanel('shared');
}

function markShareReviewed(shareId){
  const s = sharedWithMe.find(x=>x.id===shareId);
  if(!s) return;
  s.reviewed = true; s.unread = false;
  // "mark as reviewed" on a share is the same act as marking the insight Reviewed — one status, not two
  if(statusOf(s.insightId)==='open') setInsightStatus(s.insightId, 'reviewed');
  renderSharedTab();
  updateSharedBadge();
}

function toggleFollowFromShare(shareId){
  const s = sharedWithMe.find(x=>x.id===shareId);
  if(!s) return;
  if(followed[s.insightId]){ removeFromFollowed(s.insightId); toast('Unfollowed'); }
  else { addToFollowed(s.insightId, {source:'shared', sharedBy:s.from}); toast('Added to Followed'); }
  refreshSharedViewer();
}

// a shared card opens its drill-down beside the Shared list (and counts as read)
function openInvestigateFromShare(shareId){
  const s = sharedWithMe.find(x=>x.id===shareId);
  if(!s) return;
  selectTabCard('shared', shareId);
}


/* ═══ SHARED INSIGHT VIEWER — for insights shared from outside my data scope ═══
   Two rules:
   (A) No access to the underlying data → you get the sender's snapshot (headline, summary, aggregates),
       respondent-level data stays locked, and you can request access. Collaboration still works.
   (B) Broader scope shared down (country → store) → same definition, different scope: the insight is
       recomputed on YOUR data using the shared insight's metric, period and comparison (not your own
       Configure settings), and resolves to consistent / not observed / not enough evidence. */
const SHARED_VIEWS = {
  sw3: {
    scope:'KSA · 42 stores', period:'01 Jun – 23 Sep 2026 vs 14 Feb – 31 May 2026', snapshot:'23 Sep 2026',
    yourAccess:'RT ATYAF MALL only', accessGap:'the other 41 KSA stores',
    summary:'Across KSA, <b>64 respondents in 9 of 42 stores</b> described card or digital-wallet payments failing at the till on 14–15 Sep, against ~6 mentions a week country-wide normally.',
    tiles:[['Mentions, 14–15 Sep','64','bad'],['Stores affected','9 of 42',''],['Typical week, all KSA','~6','']],
    locked:'Customer comments and individual responses from the other 41 KSA stores are hidden — you don\'t have access to that data.',
    yours:{ outcome:'consistent', label:'Consistent with the shared insight',
      text:'RT ATYAF MALL shows the same two-day spike and accounts for <b>11 of the 64</b> country mentions.',
      tiles:[['Your mentions, 14–15 Sep','11','bad'],['Share of country total','17%',''],['Your typical week','~1','']],
      link:{id:'INS-05', label:'Open your store\'s payment insight'} }
  },
  sw4: {
    scope:'RT SHUWAIKH', period:'01 Jun – 23 Sep 2026 vs 14 Feb – 31 May 2026', snapshot:'21 Sep 2026',
    yourAccess:'RT ATYAF MALL only', accessGap:'RT SHUWAIKH',
    summary:'At RT SHUWAIKH, <b>waiting for a free fitting room</b> is the most common complaint among detractors this period, mentioned by 41% of them.',
    tiles:[['Detractors mentioning waits','41%','bad'],['Detractor responses','56',''],['Change vs previous','▲ 12 pts','bad']],
    locked:'Customer comments, individual responses and Copilot answers for RT SHUWAIKH are hidden — you don\'t have access to that store\'s data.',
    yours:{ outcome:'insufficient', label:'Not enough evidence at your store',
      text:'Using the same definition and period, <b>2 of your 14 detractor comments</b> mention fitting-room waits — below the minimum of 5 needed to call a pattern, so there is no store-level finding yet.',
      tiles:[['Your detractor mentions','2',''],['Minimum for a pattern','5',''],['Your detractor responses','14','']],
      link:{id:'INS-04', label:'Related: your cleanliness driver insight'} }
  }
};
const accessRequested = new Set();
let currentViewerShare = null;

function sharedViewerHTML(s, tab){   // tab is set when it is shown in the Followed or Shared pane
  const closeFn = tab ? "closeTabPanel('"+tab+"')" : 'closeDrawer()';
  const v = SHARED_VIEWS[s.id];
  const meta = INSIGHT_META[s.insightId] || {};
  const pill = TYPE_PILL[meta.type] || TYPE_PILL.recurring;
  const tiles = arr => `<div class="ev"><div class="ev-tiles">${arr.map(([k,val,c])=>`<div class="ev-tile"><div class="k">${k}</div><div class="v ${c}">${val}</div></div>`).join('')}</div></div>`;
  const lockIcon = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>';
  const requested = accessRequested.has(s.id);
  const reqBtn = requested
    ? `<span class="text-[12px] text-txt-3 inline-flex items-center gap-1" data-access-state="requested"><svg class="w-3.5 h-3.5" style="color:#0e8a5f" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Access requested — pending admin approval</span>`
    : `<button class="btn-sec" style="padding:5px 11px;font-size:12px" data-access-state="none" onclick="requestAccess('${s.id}')">Request access to ${v.accessGap}</button>`;
  const oc = v.yours.outcome;
  const ocIcon = oc==='consistent' ? '✓' : (oc==='insufficient' ? '–' : '○');
  return `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <div class="min-w-0">
        <div class="flex items-center gap-2 flex-wrap mb-1">${prioHTML(s.insightId)}<span class="pill" style="background:${pill.bg};color:${pill.fg}">${pill.icon}${meta.category||s.insightTag}</span><span class="illus">Illustrative</span></div>
        <p class="text-[14.5px] font-600 text-txt-1 leading-snug" style="font-family:var(--font-d);letter-spacing:-.012em">${s.insightTitle}</p>
      </div>
      <button class="iconbtn flex-shrink-0" data-close-panel onclick="${closeFn}"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    <div class="flex-1 overflow-y-auto px-5 py-4" id="shared-viewer" data-share="${s.id}">
      <div class="flex items-start gap-2.5 mb-3">
        <span class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-600 text-white flex-shrink-0" style="background:#7e57c2">${initials(s.from)}</span>
        <div class="min-w-0"><p class="text-[12.5px] text-txt-1"><span class="font-600">${s.from}</span> <span class="text-txt-4">· ${s.fromRole} · ${s.date}</span></p>
        ${s.note ? `<p class="text-[12.5px] text-txt-2 italic mt-0.5">&ldquo;${s.note}&rdquo;</p>` : ''}</div>
      </div>
      <div class="illus-banner"><span><b style="color:#42474f">Illustrative example.</b> The figures below are placeholders, not survey data.</span></div>
      <div class="scope-box mb-4">
        <span class="k">Insight scope</span><span class="v" data-scope>${v.scope}</span>
        <span class="k">Period</span><span class="v">${v.period}</span>
        <span class="k">Your data access</span><span class="v">${v.yourAccess}</span>
      </div>

      <div class="flex items-center justify-between mb-2"><p class="eyebrow">As shared</p><span class="snap" title="Frozen at the moment it was shared">Snapshot · ${v.snapshot} · won't update</span></div>
      <p class="id-lede mb-3">${v.summary}</p>
      ${tiles(v.tiles)}
      <div class="locked mt-3" data-locked="${s.id}"><span class="lk">${lockIcon}</span><div class="flex-1"><p>${v.locked}</p><div class="mt-2">${reqBtn}</div></div></div>

      <div class="id-sect" data-your-scope>
        <p class="eyebrow" style="margin-bottom:6px">At your store · same definition, same period</p>
        <p class="text-[11.5px] text-txt-4 mb-2.5 leading-snug">Recomputed on RT ATYAF MALL data with the shared insight's metric, period and comparison — not your own Configure settings — so the two views can be compared like for like.</p>
        <span class="outcome ${oc}" data-outcome="${oc}">${ocIcon} ${v.yours.label}</span>
        <p class="id-lede mt-2.5 mb-3">${v.yours.text}</p>
        ${tiles(v.yours.tiles)}
        <button class="btn-sec mt-3" onclick="closeDrawer();openInsightInFeed('${v.yours.link.id}')">${v.yours.link.label} →</button>
      </div>

      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">Discussion</p>
        ${renderActivitySection(s.insightId)}
      </div>
      <div class="locked mt-4"><span class="lk">${lockIcon}</span><p>Copilot follow-ups are off for this insight — Copilot can only answer from data you can access. Ask about your store's view from your own insight instead.</p></div>
    </div>
    <div class="border-t border-line2 px-5 py-3.5 flex items-center gap-2${tab ? ' sticky bottom-0 bg-white' : ''}">
      <button class="btn-sec${followed[s.insightId]?' on':''}" data-viewer-follow onclick="toggleFollowFromShare('${s.id}')">${followed[s.insightId] ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>
      ${actionPlans[s.insightId] ? planChipHTML(s.insightId) : `<button class="btn-sec" data-viewer-plan onclick="closeDrawer();openActionPlan('${s.insightId}')">${PLAN_ICON}Create action plan</button>`}
      ${tab ? '' : '<button class="btn-sec ml-auto" onclick="closeDrawer()">Close</button>'}
    </div>`;
}
function openSharedViewer(shareId){
  const s = sharedWithMe.find(x=>x.id===shareId);
  if(!s || !SHARED_VIEWS[shareId]) return;
  // it opens beside the list: in Shared, or in Followed if the share itself was already cleared
  if(s.dismissed && followed[s.insightId]){ segNav('followed'); selectTabCard('followed', s.insightId); return; }
  if(s.dismissed){ s.dismissed = false; }
  segNav('shared'); selectTabCard('shared', shareId);
}
function refreshSharedViewer(){
  renderTabPanel();
  if(!currentViewerShare) return;
  const d = document.getElementById('drawer');
  if(!d.classList.contains('open')) return;
  const s = sharedWithMe.find(x=>x.id===currentViewerShare);
  if(s){ const st = d.querySelector('#shared-viewer')?.scrollTop||0; d.innerHTML = sharedViewerHTML(s); const b=d.querySelector('#shared-viewer'); if(b) b.scrollTop = st; }
}
function requestAccess(shareId){
  const s = sharedWithMe.find(x=>x.id===shareId);
  if(!s) return;
  accessRequested.add(shareId);
  if(!insightActivity[s.insightId]) insightActivity[s.insightId] = {status:'open', events:[]};
  insightActivity[s.insightId].events.push({type:'status', by:'You', text:'requested access to '+SHARED_VIEWS[shareId].accessGap+' data', date:'just now'});
  refreshSharedViewer(); renderSharedTab();
  toast('Access request sent to your CFM admin — ' + s.from + ' will be notified');
}


/* ═══ MICRO-FEEDBACK — 👍 / 👎 on every insight; 👎 asks one quick "why" so the engine can learn.
   Kept separate from Follow/Done/Dismiss: usefulness and what-I-did-with-it are different signals. ═══ */
const insightFeedback = {};   // id -> {vote:'up'|'down', reasons:[], comment:''}  (sent to the insights engine)
const FB_REASONS = [
  ['not-relevant','Not relevant to my role or store'],
  ['inaccurate','Inaccurate or looks wrong'],
  ['known','Already knew this'],
  ['vague','Too vague — no clear driver or action'],
  ['evidence','Not enough evidence'],
  ['other','Something else']
];
const THUMB_SVG = '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"/></svg>';
function feedbackHTML(id){
  const v = insightFeedback[id] && insightFeedback[id].vote;
  return `<span class="fb" data-fb="${id}"><button class="fb-btn up${v==='up'?' on':''}" title="Useful" data-vote="up" onclick="event.stopPropagation();voteInsight('${id}','up',this)">${THUMB_SVG}</button><button class="fb-btn down${v==='down'?' on':''}" title="Not useful" data-vote="down" onclick="event.stopPropagation();voteInsight('${id}','down',this)">${THUMB_SVG}</button></span>`;
}
function renderFeedbackSlots(){
  document.querySelectorAll('[data-fb-slot]').forEach(el=>{ el.innerHTML = feedbackHTML(el.dataset.fbSlot); });
}
function afterFeedbackChange(id){
  renderFeedbackSlots(); renderFollowedTab(); refreshInvestigatePanel(id);
}
function voteInsight(id, v, btn){
  const rect = btn.getBoundingClientRect();   // capture before re-render replaces the clicked button
  const cur = insightFeedback[id] && insightFeedback[id].vote;
  if(cur===v){ delete insightFeedback[id]; closeFbMenu(); afterFeedbackChange(id); toast('Feedback removed'); return; }
  if(v==='up'){
    insightFeedback[id] = {vote:'up', reasons:[], comment:''};
    closeFbMenu(); afterFeedbackChange(id);
    toast('Thanks — marked as useful');
  } else {
    // record the 👎 immediately so it isn't lost if the form is closed; the form only adds the "why"
    insightFeedback[id] = {vote:'down', reasons:[], comment:''};
    afterFeedbackChange(id);
    openFbMenu(id, rect);
  }
}
let fbMenuFor = null;
function openFbMenu(id, r){
  const m = document.getElementById('fb-menu');
  fbMenuFor = id;
  const inActiveFeed = feedStateOf(id)==='active' && !!document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  m.innerHTML = `
    <p class="eyebrow" style="margin-bottom:4px">Help improve your insights</p>
    <p class="text-[13px] font-600 text-txt-1 mb-2.5">What wasn't useful about this insight?</p>
    <div id="fb-reasons">${FB_REASONS.map(([k,l])=>`<button class="rchip" data-reason="${k}" onclick="this.classList.toggle('on')">${l}</button>`).join('')}</div>
    <textarea id="fb-comment" rows="2" class="w-full text-[12.5px] border border-line rounded-md px-2.5 py-1.5 mt-1 focus:outline-none" placeholder="Anything else? (optional)"></textarea>
    ${inActiveFeed ? `<label class="flex items-center gap-2 mt-2 text-[12px] text-txt-2 cursor-pointer"><input type="checkbox" id="fb-hide"> Also remove this insight from my feed</label>` : ''}
    <div class="flex items-center gap-2 mt-3">
      <button class="btn-pri" style="padding:6px 12px;font-size:12px" onclick="submitFb()">Send feedback</button>
      <button class="btn-sec" style="padding:6px 12px;font-size:12px" onclick="closeFbMenu();toast('Thanks — your 👎 was recorded')">Skip</button>
    </div>`;
  m.style.display='block';
  const h = m.offsetHeight;
  const top = (r.bottom + 8 + h > window.innerHeight) ? Math.max(8, r.top - h - 8) : r.bottom + 8;
  m.style.top = top + 'px';
  m.style.left = Math.max(8, Math.min(window.innerWidth - 326, r.left - 20)) + 'px';
}
function closeFbMenu(){ const m=document.getElementById('fb-menu'); if(m) m.style.display='none'; fbMenuFor=null; }
function submitFb(){
  const id = fbMenuFor; if(!id) return;
  const reasons = [...document.querySelectorAll('#fb-reasons .rchip.on')].map(b=>b.dataset.reason);
  const comment = (document.getElementById('fb-comment').value||'').trim();
  const hide = document.getElementById('fb-hide') && document.getElementById('fb-hide').checked;
  insightFeedback[id] = {vote:'down', reasons, comment};
  closeFbMenu(); afterFeedbackChange(id);
  if(hide){
    doneFeed.add(id); applyFeedVisibility();
    toastAction('Thanks — feedback sent and insight marked done', 'Undo', ()=>{ doneFeed.delete(id); applyFeedVisibility(); });
  } else {
    toast('Thanks — this helps tune future insights');
  }
}
document.addEventListener('click', e=>{ if(!e.target.closest('#fb-menu') && !e.target.closest('.fb')) closeFbMenu(); });
window.addEventListener('scroll', ()=>closeFbMenu(), true);

function openShareModal(id){
  currentShareId = id;
  const card = document.querySelector('.insight-card[data-id="'+id+'"]');
  const title = card ? card.querySelector('[data-el="title"]').textContent : ((INSIGHT_META[id] && INSIGHT_META[id].title) || id);
  const modal = document.getElementById('share-modal');
  modal.innerHTML = `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <p class="text-[14.5px] font-600 text-txt-1">Share insight</p>
      <button class="iconbtn" onclick="closeShareModal()"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    <div class="px-5 py-4">
      <div class="rounded-md p-2.5 mb-3.5" style="background:#f7f8fa">
        <p class="text-[13px] font-600 text-txt-1 leading-snug">${title}</p>
      </div>
      <p class="text-[11.5px] font-600 text-txt-1 mb-2">Send to</p>
      <div class="space-y-0.5 mb-3.5" id="share-contacts">
        ${shareContacts.map((c,i)=>`
          <div class="flex items-center gap-2.5 py-1.5 cursor-pointer" data-contact="${i}" onclick="toggleShareContact(this)">
            <span class="chk"></span>
            <div class="flex-1 min-w-0"><p class="text-[13px] text-txt-1">${c.name}</p><p class="text-[11px] text-txt-4">${c.role}</p></div>
            ${c.access==='none' ? '<span class="tag wrn" style="font-size:10.5px" title="Cannot see this store\'s data">No data access</span>' : ''}
          </div>`).join('')}
      </div>
      <div id="share-access-note"></div>
      <p class="text-[11.5px] font-600 text-txt-1 mb-1.5">Add a note (optional)</p>
      <textarea id="share-note" class="w-full text-[13px] border border-line rounded-md px-3 py-2 focus:outline-none focus:border-spr-blue" rows="2" placeholder="Say why this is worth their time…"></textarea>
    </div>
    <div class="border-t border-line2 px-5 py-3.5 flex items-center gap-2">
      <button class="btn-pri" onclick="sendShare()">Share</button>
      <button class="btn-sec" onclick="closeShareModal()">Cancel</button>
    </div>
  `;
  modal.classList.remove('hidden');
  document.getElementById('scrim').classList.add('show');
  document.body.style.overflow='hidden';
}
function closeShareModal(){
  document.getElementById('share-modal').classList.add('hidden');
  document.getElementById('scrim').classList.remove('show');
  document.body.style.overflow='';
}
function closeAnyModal(){
  if(document.getElementById('drawer').classList.contains('open')) closeDrawer();
  if(!document.getElementById('share-modal').classList.contains('hidden')) closeShareModal();
  if(!document.getElementById('plan-modal').classList.contains('hidden')) closeActionPlan();
}
function toggleShareContact(row){
  const chk = row.querySelector('.chk');
  const on = chk.classList.toggle('sel');
  chk.innerHTML = on ? '<svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : '';
  updateShareAccessNote();
}
// before sending, tell the sender exactly what a recipient without data access will and won't see
function updateShareAccessNote(){
  const el = document.getElementById('share-access-note');
  if(!el) return;
  const blocked = [...document.querySelectorAll('#share-contacts [data-contact]')]
    .filter(r=>r.querySelector('.chk').classList.contains('sel'))
    .map(r=>shareContacts[+r.dataset.contact]).filter(c=>c.access==='none');
  el.innerHTML = blocked.length ? `<div class="acc-note"><svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg><span><b>${blocked.map(c=>c.name).join(', ')}</b> ${blocked.length>1?"don't":"doesn't"} have access to RT ATYAF MALL data. They'll get a snapshot of the summary and charts, but not customer comments or individual responses — and can request access.</span></div>` : '';
}
function sendShare(){
  const selected = [...document.querySelectorAll('#share-contacts > div')]
    .filter(r=>r.querySelector('.chk').classList.contains('sel'))
    .map(r=>r.querySelector('p.text-\\[13px\\]').textContent);
  if(selected.length===0){ toast('Choose at least one recipient'); return; }
  const note = document.getElementById('share-note').value.trim();
  const id = currentShareId;
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  selected.forEach(name=>{
    insightActivity[id].events.push({type:'share', by:'You', text:'shared this with '+name, date:'just now'});
  });
  if(note) insightActivity[id].events.push({type:'comment', by:'You', text:note, date:'just now'});
  closeShareModal();
  toast('Shared with ' + selected.join(', '));
  refreshInvestigatePanel(id);
}
