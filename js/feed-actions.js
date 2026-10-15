/* ═══ card interactions ═══ */
/* ═══ DISMISS — one X affordance on every surface, scoped to the list you're looking at, always undoable ═══ */
const dismissedFeed = new Set();
// edition state (declared here: the feed's first render reads it)
// The feed is published as EDITIONS on the user's frequency; each one replaces the feed, so stale insights
// clear by construction. A light topic key gives memory across editions (repeat labels, suppression, follows).
const LAST_VISIT = '8 Sep';
const EDITIONS = [   // newest first · weekly (first day of the workweek, 08:00 AST)
  {id:'e27', date:'Sun 27 Sep 2026', short:'Sun 27 Sep', cut:'23 Sep 2026', ids:['INS-05','INS-04','INS-02','INS-06','INS-01','INS-03']},
  {id:'e20', date:'Sun 20 Sep 2026', short:'Sun 20 Sep', cut:'16 Sep 2026', ids:['INS-05','INS-04','INS-02','INS-01','FOL-02','INS-03']},
  {id:'e13', date:'Sun 13 Sep 2026', short:'Sun 13 Sep', cut:'9 Sep 2026', ids:['INS-02','INS-01','FOL-01','FOL-02','INS-03','TOP-QUEUE']},
  {id:'e06', date:'Sun 6 Sep 2026',  short:'Sun 6 Sep',  cut:'2 Sep 2026', ids:['INS-02','INS-01','FOL-01','INS-03','TOP-QUEUE']},
  {id:'e30', date:'Sun 30 Aug 2026', short:'Sun 30 Aug', cut:'26 Aug 2026', ids:['INS-01','INS-03']}
];
const CURRENT_EDITION = 'e27';
const EXTRA_TOPICS = {'TOP-QUEUE': {title:'Weekend checkout queues drew complaints', category:'Recurring theme', prio:'med'}};
// held back by the topic key: the user marked it Done on 14 Sep and it has not got worse since
const SUPPRESSED = [{id:'TOP-QUEUE', why:'you marked it Done on 14 Sep, and it hasn\'t got worse', lastIn:'e13'}];
const EDITION_SCHEDULE = {
  Daily:   {label:'Daily edition',   current:'Mon 28 Sep 2026', next:'Tue 29 Sep, 08:00 AST'},
  Weekly:  {label:'Weekly edition',  current:'Sun 27 Sep 2026', next:'Sun 4 Oct, 08:00 AST'},
  Monthly: {label:'Monthly edition', current:'Tue 1 Sep 2026',  next:'Thu 1 Oct, 08:00 AST'}
};
let editionFreq = 'Weekly';    // the frequency that produced the current edition
let pendingFreq = null;        // a frequency change only applies from the next edition
let viewingEdition = CURRENT_EDITION;
const retiredFeed = new Set();  // kept for compatibility; editions replace per-insight retirement
const RETIRED_REASON = {};
let awayMode = false; let snapOpenId = null;
let firstEditionMode = false, steadyState = null;   // Day 0: one edition, nothing followed, shared or acted on yet
const EDITION_BAR_MAX = 4;            // the bar shows the latest few; older ones are under "All editions"
const EDITION_RETENTION = '12 months'; // editions are kept this long, then deleted
let allEditionsOpen = false;


const doneFeed = new Set();
let feedView = 'active';   // active | done | dismissed
function feedStateOf(id){
  if(retiredFeed.has(id)) return 'earlier';
  if(dismissedFeed.has(id)) return 'dismissed';
  if(doneFeed.has(id)) return 'done';
  if(followed[id]) return 'followed';
  return 'active';
}
function setFeedView(v){ feedView = v; applyFeedVisibility(); }
// "Sun 4 Oct" from the schedule's "Sun 4 Oct, 08:00 AST"
function nextEditionShort(){ return EDITION_SCHEDULE[editionFreq].next.split(',')[0]; }

function applyFeedVisibility(){
  const counts = {active:0, done:0, dismissed:0, followed:0};
  let visible = 0, needAttn = 0;
  document.querySelectorAll('#card-grid .insight-card').forEach(card=>{
    const id = card.getAttribute('data-id');
    const st = feedStateOf(id);
    card.dataset.state = st;
    counts[st]++;
    const show = st===feedView;
    card.style.display = show ? '' : 'none';
    card.style.opacity = ''; card.style.transform = '';
    if(show){ visible++; if(card.dataset.priority==='high' && feedView==='active') needAttn++; }
  });
  const countLabel = document.getElementById('feed-count-label');
  if(countLabel){
    if(feedView==='active') countLabel.innerHTML = visible + (visible===1 ? ' insight' : ' insights') + ' to review'
      + (needAttn ? ` <span style="color:#c5221f;font-weight:600">· ${needAttn} need${needAttn===1?'s':''} attention</span>` : '');
    else if(feedView==='done') countLabel.textContent = visible + (visible===1 ? ' insight' : ' insights') + ' marked done in this edition';
    else countLabel.textContent = visible + ' dismissed ' + (visible===1 ? 'insight' : 'insights');
  }
  const note = document.getElementById('feed-dismissed-note');
  if(note) note.innerHTML = (feedView==='done' && viewingEdition===CURRENT_EDITION) ? `<span data-done-note>Closed in this edition. This list starts empty when the next edition publishes on ${nextEditionShort()}.</span>` : '';
  const chips = document.getElementById('feed-state-chips');
  if(chips){
    const chip = (v,l)=>`<button class="fchip${feedView===v?' on':''}" data-feed-view="${v}" onclick="setFeedView('${v}')">${l}${counts[v] ? `<span class="n">${counts[v]}</span>` : ''}</button>`;
    chips.innerHTML = chip('active','Active') + chip('done','Done');
  }
  const past = viewingEdition!==CURRENT_EDITION;
  const snapEl = document.getElementById('earlier-list');
  if(snapEl) snapEl.classList.toggle('hidden', !past);
  if(chips) chips.style.display = past ? 'none' : '';
  const footEl = document.getElementById('edition-foot');
  if(footEl) footEl.classList.toggle('hidden', past || feedView!=='active');
  if(past){
    document.querySelectorAll('#card-grid .insight-card').forEach(c=>{ c.style.display='none'; });
    renderEditionSnapshot();
    const ed = EDITIONS.find(e=>e.id===viewingEdition);
    if(countLabel) countLabel.textContent = ed.ids.length + ' insights in this edition';
    const em = document.getElementById('feed-empty'); if(em) em.classList.add('hidden');
    return;
  }
  const emptyEl = document.getElementById('feed-empty');
  if(emptyEl){
    emptyEl.classList.toggle('hidden', visible>0);
    const t = document.getElementById('feed-empty-title'), sub = document.getElementById('feed-empty-sub');
    if(feedView==='active'){
      t.textContent = "You're all caught up";
      sub.innerHTML = 'Everything in this edition has been followed or marked done. The next edition publishes on ' + nextEditionShort() + '.';
    } else if(feedView==='done'){
      t.textContent = 'Nothing marked done in this edition';
      sub.innerHTML = 'Insights you close in this edition are listed here until the next one publishes. Insights closed earlier are in the past edition they appeared in.';
    } else {
      t.textContent = 'No dismissed insights';
      sub.innerHTML = 'Insights you dismiss land here, so nothing is lost by accident.';
    }
  }
  // if the selected insight was dismissed, drop the selection;
  // ensureSelection() then moves to the top remaining insight so one is always open
  const activeCard = document.querySelector('.insight-card.active');
  if(activeCard){
    const aid = activeCard.getAttribute('data-id');
    if(dismissedFeed.has(aid)) activeCard.classList.remove('active');
  }
  ensureSelection();
}

// Done: "read it, it's good, nothing more to do" — the positive way to clear an insight from the feed
function markDone(id){
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  if(card && feedView==='active'){ card.style.transition='opacity .15s,transform .15s'; card.style.opacity='0'; card.style.transform='scale(.98)'; }
  doneFeed.add(id);
  if(!insightActivity[id]) insightActivity[id] = {status:'open', events:[]};
  insightActivity[id].events.push({type:'done', by:'You', text:'marked this done', date:'just now'});
  const active = document.querySelector('.insight-card.active');
  if(active && active.getAttribute('data-id')===id) active.classList.remove('active');
  setTimeout(applyFeedVisibility, 150);
  toastAction('Marked as done', 'Undo', ()=>{
    doneFeed.delete(id);
    const ev = insightActivity[id].events;
    if(ev.length && ev[ev.length-1].text==='marked this done') ev.pop();
    applyFeedVisibility();
  });
}
function reopenInsight(id){
  doneFeed.delete(id);
  if(insightActivity[id]) insightActivity[id].events.push({type:'done', by:'You', text:'reopened this insight', date:'just now'});
  applyFeedVisibility(); refreshInvestigatePanel(id);
  toast('Reopened — back in your active feed');
}

function dismissFromFeed(id){
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  if(card){ card.style.transition='opacity .15s,transform .15s'; card.style.opacity='0'; card.style.transform='scale(.98)'; }
  dismissedFeed.add(id);
  setTimeout(applyFeedVisibility, 150);
  const kept = followed[id] ? ' — still in Followed' : '';
  toastAction('Dismissed from feed' + kept, 'Undo', ()=>restoreToFeed(id));
}
function restoreToFeed(id){
  dismissedFeed.delete(id);
  applyFeedVisibility();
  if(feedView==='dismissed') toast('Restored to your active feed');
}
function restoreAllFeed(){
  const n = dismissedFeed.size;
  dismissedFeed.clear();
  applyFeedVisibility();
  toast(n + (n===1 ? ' insight' : ' insights') + ' restored to your feed');
}
// kept for backwards compatibility with any older markup still calling dismiss(btn)
function dismiss(btn){ dismissFromFeed(btn.closest('.insight-card').getAttribute('data-id')); }

// Followed: X means "stop tracking this" (unfollow) — undo puts back the exact same entry, history intact
function dismissFromFollowed(id){
  if(!followed[id]) return;
  const saved = Object.assign({}, followed[id]);
  removeFromFollowed(id);
  toastAction('Removed from Followed', 'Undo', ()=>{
    followed[id] = saved;
    const ev = insightActivity[id] && insightActivity[id].events;
    if(ev && ev.length && ev[ev.length-1].text==='stopped following this insight') ev.pop();
    afterFollowChange(id);
  });
}

// Shared: X clears the item from your shared-with-me inbox only — it does not unfollow or touch the feed
function dismissShare(shareId){
  const s = sharedWithMe.find(x=>x.id===shareId);
  if(!s) return;
  const wasUnread = s.unread;
  s.dismissed = true; s.unread = false;
  renderSharedTab(); updateSharedBadge();
  toastAction('Marked as done', 'Undo', ()=>{
    s.dismissed = false; s.unread = wasUnread;
    renderSharedTab(); updateSharedBadge();
  });
}
function restoreAllShared(){
  sharedWithMe.forEach(s=>{ s.dismissed=false; });
  renderSharedTab(); updateSharedBadge();
  toast('Restored to Shared');
}
function follow(btn){
  const id = btn.closest('.insight-card').getAttribute('data-id');
  if(followed[id]){ removeFromFollowed(id); toast('Unfollowed'); return; }
  const card = btn.closest('.insight-card');
  card.style.transition='opacity .15s,transform .15s'; card.style.opacity='0'; card.style.transform='scale(.98)';
  setTimeout(()=>{
    card.classList.remove('active');
    addToFollowed(id, {source:'feed'});
    toastAction('Moved to Followed', 'Undo', ()=>{
      removeFromFollowed(id);
      const ev = insightActivity[id] && insightActivity[id].events;
      // undo leaves no trace: drop both the follow and the unfollow entries
      if(ev){ for(let k=0;k<2;k++){ if(ev.length && ev[ev.length-1].type==='follow') ev.pop(); } }
      refreshInvestigatePanel(id);
    });
  },150);
}

/* ═══ DAY 0 journey states ═══ */
function setJourney(state){
  document.querySelectorAll('.journey-btn').forEach(b=>b.classList.toggle('active', b.dataset.state===state));
  const oldLanding = document.getElementById('email-landing-banner');
  if(oldLanding && oldLanding.dataset.expiredEdition) oldLanding.remove();

  document.getElementById('journey-not-setup').classList.add('hidden');
  document.getElementById('journey-waiting').classList.add('hidden');
  document.getElementById('journey-returning').classList.add('hidden');
  document.getElementById('first-ready-banner').classList.add('hidden');
  leaveQuiet();

  if(state==='not-setup'){
    document.getElementById('journey-not-setup').classList.remove('hidden');
  } else if(state==='waiting'){
    document.getElementById('journey-waiting').classList.remove('hidden');
  } else if(state==='quiet'){
    document.getElementById('journey-quiet').classList.remove('hidden');
  } else if(state==='first-ready'){
    document.getElementById('journey-returning').classList.remove('hidden');
    document.getElementById('first-ready-banner').classList.remove('hidden');
  } else {
    document.getElementById('journey-returning').classList.remove('hidden');
  }
  setScenario(state==='first-ready' ? 'first' : state==='day50' ? 'day50' : 'steady');
  setAway(state==='away');
  segNav('insights');
  if(state==='returning' || state==='first-ready' || state==='day50' || state==='away' || state==='expired-link') ensureSelection();
  if(state==='expired-link') showExpiredEditionLanding();
  if(state==='quiet') enterQuiet();
}
function useDefaults(){
  const title = 'Store Manager';
  const desc = 'Insights on RT ATYAF MALL — satisfaction &amp; service quality, promotions &amp; pricing clarity, store operations &amp; consistency';
  const plain = desc.replace(/&amp;/g, '&');
  document.getElementById('obj-title').textContent = title;
  document.getElementById('obj-desc').textContent = plain;
  const dt = document.getElementById('drawer-obj-title'); if(dt) dt.textContent = title;
  const dd = document.getElementById('drawer-obj-desc'); if(dd) dd.textContent = plain;
  const wt = document.getElementById('w-obj-title'); if(wt) wt.textContent = title;
  const wd = document.getElementById('w-obj-desc'); if(wd) wd.textContent = plain;
  setJourney('waiting');
  toast('Smart defaults applied — monitoring started');
}

/* ═══ toast ═══ */
let toastT;
let toastActionFn = null;
function toast(msg){
  const t=document.getElementById('toast');
  toastActionFn = null;
  t.classList.remove('has-action');
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastT);
  toastT=setTimeout(()=>t.classList.remove('show'),2200);
}
// toast with an action (Undo / Restore) — stays up longer so there's time to use it
function toastAction(msg, label, fn){
  const t=document.getElementById('toast');
  toastActionFn = fn;
  t.innerHTML = `<span>${msg}</span><button class="toast-act" onclick="runToastAction()">${label}</button>`;
  t.classList.add('show','has-action');
  clearTimeout(toastT);
  toastT=setTimeout(()=>{ t.classList.remove('show','has-action'); toastActionFn=null; },5000);
}
function runToastAction(){
  const fn = toastActionFn; toastActionFn = null;
  const t=document.getElementById('toast'); t.classList.remove('show','has-action');
  clearTimeout(toastT);
  if(fn) fn();
}
function openDrawer(mode, srcBtn){
  const d=document.getElementById('drawer');
  const scrim=document.getElementById('scrim');
  d.innerHTML = configureHTML();
  d.classList.add('open'); scrim.classList.add('show');
  document.body.style.overflow='hidden';
}
function closeDrawer(){
  currentViewerShare = null;
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('scrim').classList.remove('show');
  document.body.style.overflow='';
}
