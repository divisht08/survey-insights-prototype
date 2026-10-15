/* ═══ CARD LAYOUT OPTIONS — a review page opened from the prototype bar; not a product screen ═══ */
/* ═══ QUIET EDITION — nothing new or significantly changed. The edition says so in one line, then lists
   what is still true from earlier editions in compact rows, so the same cards are not repeated in full. ═══ */
const QUIET_ED = {short:'Sun 4 Oct', next:'Sun 11 Oct', since:'Sun 27 Sep'};
// still true this week: [id, editions in a row including this one]
const QUIET_STILL = [['INS-04',3],['INS-02',5],['INS-06',2],['INS-01',6],['INS-03',6]];
var quietOn = false, quietSel = null, quietPanelClosed = false;   // var: read by handlers that can run before this line (deep links on load)
function quietRowHTML([id, n]){
  const m = INSIGHT_META[id] || {}, lvl = (PRIORITY[id]||{}).level || 'low';
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  const num = card ? ((card.querySelector('.ic-num')||{}).textContent || '') : (m.statBig || '');
  const nag = (n>=3 && !hasAction(id)) ? `<span class="fresh-tag stale">${n} editions · no action</span>` : '';
  return `<button class="qrow${quietSel===id?' active':''}" data-quiet-row="${id}" data-priority="${lvl}" onclick="openQuiet('${id}')">
      <span class="qdot" style="background:${PRIO_DOT[lvl]}"></span>
      <span class="qmain"><span class="qt">${m.title}</span><span class="qm">${PRIO_LABEL[lvl]} · ${kindText(id)} · in ${n} editions in a row${followed[id] ? ' · Following' : ''}</span></span>
      ${nag}<span class="qnum">${num}</span></button>`;
}
function quietHTML(){
  const fol = Object.keys(followed), folChanged = fol.filter(id=>followed[id].updated).length;
  return `<div class="flex gap-5 items-start" id="quiet-split">
    <div class="flex-1 min-w-0">
      <div class="ed-line" data-edition-bar><span class="ed-pick static">${NEWS_ICON}<b>${QUIET_ED.short} edition</b><span class="ed-latest">Latest</span></span><span class="ed-next" data-edition-tag>Next edition ${QUIET_ED.next}</span></div>
      <div class="quiet-box spr-card" data-quiet-box>
        <div class="qb-icon"><svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M20.35 15.35A9 9 0 018.65 3.65 9 9 0 1020.35 15.35z"/></svg></div>
        <div class="min-w-0">
          <p class="qb-t">No new findings this week</p>
          <p class="qb-s">Responses came in at your usual level, about 16 a week. None of them showed anything new or changed what is already known since the ${QUIET_ED.since} edition.</p>
          <p class="qb-f"><span>${QUIET_STILL.length} findings still true</span><span>${fol.length ? fol.length + ' followed · ' + (folChanged ? folChanged + ' changed' : 'no change') : 'Nothing followed'}</span><span>Next edition ${QUIET_ED.next}</span></p>
        </div>
      </div>
      <p class="q-h">Still true from earlier editions</p>
      <div class="qlist" data-quiet-list>${QUIET_STILL.map(quietRowHTML).join('')}</div>
      <p class="q-foot">A finding stays in the edition while it is still true. It is shown here in one line because nothing about it has changed; open it for the full card details.</p>
      <div id="quiet-held"></div>
    </div>
    <div id="quiet-panel" class="hidden flex-shrink-0 spr-card" style="width:460px;position:sticky;top:16px;max-height:calc(100vh - 32px);overflow-y:auto"></div>
  </div>`;
}
function renderQuiet(){
  const el = document.getElementById('journey-quiet'); if(!el) return;
  el.innerHTML = quietHTML();
  const held = document.getElementById('quiet-held');
  if(held) held.innerHTML = SUPPRESSED.map(x=>`<div class="ed-foot" data-suppressed="${x.id}"><span style="flex:1"><b style="color:#42474f">Held back from this edition:</b> ${metaOf(x.id).title} — ${x.why}. It comes back only if it gets materially worse.</span></div>`).join('');
  renderQuietPanel();
}
function renderQuietPanel(){
  const panel = document.getElementById('quiet-panel'), split = document.getElementById('quiet-split');
  if(!panel) return;
  const card = quietSel && !quietPanelClosed ? document.querySelector('#card-grid .insight-card[data-id="'+quietSel+'"]') : null;
  const top = panel.dataset.key===quietSel ? panel.scrollTop : 0;
  panel.innerHTML = card ? investigateHTML(card).replace('closeInvestigatePanel(true)', 'closeQuietPanel()') : '';
  panel.dataset.key = quietSel || '';
  panel.classList.toggle('hidden', !card); split.classList.toggle('has-panel', !!card);
  panel.scrollTop = top;
  document.querySelectorAll('[data-quiet-row]').forEach(r=>r.classList.toggle('active', !!card && r.dataset.quietRow===quietSel));
}
function openQuiet(id){ quietSel = id; quietPanelClosed = false; renderQuietPanel(); }
function closeQuietPanel(){ quietPanelClosed = true; renderQuietPanel(); }
function enterQuiet(){
  quietOn = true; quietSel = null; quietPanelClosed = false;
  // only one drill-down holds content at a time, so element ids never clash
  closeInvestigatePanel(); const ip = document.getElementById('investigate-panel'); if(ip) ip.innerHTML = '';
  renderQuiet();
}
function leaveQuiet(){
  if(!quietOn) return;
  quietOn = false; const el = document.getElementById('journey-quiet'); if(el) el.innerHTML = '';
}
