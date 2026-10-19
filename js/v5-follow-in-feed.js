/* ═══ v5 — following is explicit, so nothing you follow is ever removed from the feed automatically.
   If a followed insight stops being significant, its card stays, says so, keeps updating,
   and its drill-down tells the story since you followed. ═══ */
function v5FollowedOutIds(){
  return Object.keys(followed).filter(id=>!inCurrentEdition(id) && !(INSIGHT_META[id]||{}).shareId && FOLLOW_TRACK[id]
    && !doneFeed.has(id) && !dismissedFeed.has(id));
}
function v5SyncFollowedCards(){
  const grid = document.getElementById('card-grid'); if(!grid) return;
  const want = v5FollowedOutIds();
  grid.querySelectorAll('.v5-fol').forEach(c=>{ if(!want.includes(c.dataset.id)) c.remove(); });
  want.forEach(id=>{
    const t = document.createElement('template'); t.innerHTML = followedCardHTML(id).trim();
    const c = t.content.firstElementChild;
    c.className = 'insight-card ic spr-card v5-fol';
    c.dataset.id = id; c.dataset.priority = 'fol'; c.removeAttribute('data-sel-key');
    c.setAttribute('onclick', `if(!event.target.closest('button,a,textarea,input'))v5OpenFollowed('${id}')`);
    c.querySelectorAll('.btn-pri').forEach(b=>b.setAttribute('onclick', `event.stopPropagation();v5OpenFollowed('${id}')`));
    // say it plainly: no longer significant, still followed, still updating
    const ev = c.querySelector('[data-fol-ev]');
    if(ev) ev.innerHTML = ev.dataset.folEv==='thin'
      ? 'Too few responses in the latest update · showing the last reliable figure'
      : 'No longer significant · still updating because you follow it';
    const kind = c.querySelector('.ic-kind');
    if(kind && !kind.querySelector('[data-v5-nosig]')) kind.insertAdjacentHTML('beforeend', `<span class="fresh-tag v5-nosig" data-v5-nosig>${ev && ev.dataset.folEv==='thin' ? 'Too few responses' : 'No longer significant'}</span>`);
    const old = grid.querySelector(`.v5-fol[data-id="${id}"]`);
    if(old){ c.className = old.className; old.replaceWith(c); } else grid.appendChild(c);
  });
}
function v5OpenFollowed(id){
  const card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  if(window.event && window.event.type==='click' && typeof openedIds!=='undefined') openedIds.add(id);
  panelUserClosed = false;
  document.getElementById('insights-split').classList.add('has-panel');
  document.querySelectorAll('.insight-card').forEach(c=>c.classList.remove('active'));
  if(card) card.classList.add('active');
  const panel = document.getElementById('investigate-panel');
  panel.innerHTML = followOnlyPanelHTML(id, 'feed').replace(`closeTabPanel('feed')`, 'closeInvestigatePanel(true)')
    .replace('<span class="tag acc">In Followed</span>', `<button class="btn-sec on" data-v3-follow="${id}" onclick="v3FollowToggle('${id}')">${FOLLOW_ON_HTML}</button>`)
    .replace(/,? ?and (it )?is not in the feed/g, '').replace(/<span class="fh-nf">not in the feed<\/span>/g, '<span class="fh-nf">kept because you follow it</span>')
    .replace(/whether or not it is in the feed/g, 'for as long as you follow it').replace(/not in the feed/g, 'kept because you follow it');
  panel.classList.remove('hidden'); panel.scrollTop = 0;
}
// a followed insight with no feed card of its own opens its story in the feed too
const _v5Open = openInvestigate;
openInvestigate = function(el){
  const id = typeof el==='string' ? el : (el.closest && el.closest('.insight-card') ? el.closest('.insight-card').dataset.id : null);
  if(id && document.querySelector(`#card-grid .v5-fol[data-id="${id}"]`)) return v5OpenFollowed(id);
  return _v5Open(el);
};
// keep the cards in step with following / unfollowing
const _v5After = afterFollowChange;
afterFollowChange = function(id){ v5SyncFollowedCards(); _v5After(id); if(!followed[id] && document.querySelector('#investigate-panel [data-fol-why]')) closeInvestigatePanel(); };
// labels: these cards carry their own note instead of New / Updated / Missed
const _v5Fresh = renderFreshness;
renderFreshness = function(){ _v5Fresh(); document.querySelectorAll('#card-grid .v5-fol').forEach(c=>{ c.dataset.v4Label = ''; c.querySelectorAll('[data-fresh-tag],[data-v4-since]').forEach(e=>e.remove()); }); };
// the "No longer supported" list only holds topics you do not follow
const _v5Ended = v4EndedIds;
v4EndedIds = function(){ return _v5Ended().filter(id=>!followed[id]); };
// a section of their own, after the significant insights
const _v5Apply = applyFeedVisibility;
applyFeedVisibility = function(){
  v5SyncFollowedCards();
  _v5Apply();
  const grid = document.getElementById('card-grid'); if(!grid) return;
  grid.querySelectorAll('.v5-sec').forEach(h=>h.remove());
  const fol = [...grid.querySelectorAll('.v5-fol')];
  if(feedView==='active' && fol.length){
    fol.forEach(c=>grid.appendChild(c));
    const vis = fol.filter(c=>c.style.display!=='none').length;
    if(vis){ const h = document.createElement('div'); h.className = 'v3-sec v5-sec'; h.dataset.sec = 'fol';
      h.innerHTML = `<i style="background:#b8bec8"></i>You follow · no longer significant<span class="n">${vis}</span>`; grid.insertBefore(h, fol[0]); }
  }
};
applyFeedVisibility();
