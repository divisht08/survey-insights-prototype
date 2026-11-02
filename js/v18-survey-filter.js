/* ═══ v18 (3 Nov) — no survey switcher: the admin sets each persona's surveys, so the feed holds insights from
   all of them, and Survey is a filter next to Type, Priority and Topic. Cards are not marked with their survey.
   The other surveys' insights (sample) join the feed as ordinary cards with the same drill-down. ═══ */

const V18_SURVEY_OF = {'AL-03':'online', 'AL-04':'returns'};
const v18SurveyOf = c=>c.dataset.survey || V18_SURVEY_OF[c.dataset.id] || 'store';

// the other surveys' insights, in the shape the feed's own card and drill-down builders use
(function v18Register(){
  ['AL-03','AL-04'].forEach(id=>{
    const c = v3FindScopeCard(id); if(!c || V9_AM_BY[id]) return;
    const a = {id, ed:EDITIONS[0].id, prio:c.prio, type:/emerging/i.test(c.type) ? 'emerging' : 'recurring', kind:c.type, title:c.title, sum:c.sum,
      num:c.num, unit:c.unit, basis:c.basis, sig:true, unread:true, th:c.tableHead, rows:c.table,
      steps:c.steps.map(s=>[s[0].replace(/\.$/,''), s[1], s[2]==='share' ? 'share:Merchandising' : s[2]==='central' ? 'share:Central Operations' : 'plan'])};
    V9_AM_BY[id] = a;
    INSIGHT_META[id] = INSIGHT_META[id] || {title:c.title, summary:c.sum, category:c.type, tag:c.type.split(' · ')[1]||'', type:a.type, ctx:c.basis};
    PRIORITY[id] = PRIORITY[id] || {level:c.prio, reason:''};
    COPILOT_QA[id] = COPILOT_QA[id] || [['Has this happened before?','Not in this survey\'s earlier updates. This is the first time it has come up.','Earlier updates of this survey']];
  });
})();
function v18EnsureCards(){
  const grid = document.getElementById('card-grid'); if(!grid) return;
  Object.keys(V18_SURVEY_OF).forEach(id=>{
    if(grid.querySelector(`.insight-card[data-id="${id}"]`)) return;
    const a = V9_AM_BY[id]; if(!a) return;
    const t = document.createElement('template'); t.innerHTML = v9AMCardHTML(a).trim();
    const el = t.content.firstElementChild; el.classList.remove('v9-am'); el.dataset.survey = V18_SURVEY_OF[id];
    const il = el.querySelector('.illus'); if(il) il.remove();
    grid.appendChild(el);
  });
  if(typeof v3DecorateCards==='function') v3DecorateCards();
}

/* Survey filter */
v9F.survey = new Set();
const _v18Match = v9Match;
v9Match = function(c){ if(v9F.survey.size && !v9F.survey.has(v18SurveyOf(c))) return false; return _v18Match.apply(this, arguments); };
const _v18Count = v9FilterCount;
v9FilterCount = function(){ return _v18Count() + v9F.survey.size; };
const _v18Clear = v9ClearFilters;
v9ClearFilters = function(){ v9F.survey.clear(); return _v18Clear.apply(this, arguments); };
const _v18Opts = v9Options;
v9Options = function(key){
  if(key!=='survey') return _v18Opts.apply(this, arguments);
  const cards = v9Cards().filter(c=>c.dataset.state==='active');
  return Object.entries(V3_SCOPES).map(([k,s])=>[k, s.label, cards.filter(c=>v18SurveyOf(c)===k).length]).filter(o=>o[2]);
};
function v18Pill(){
  const sel = [...v9F.survey].map(k=>(V3_SCOPES[k]||{}).label || k);
  const txt = sel.length===0 ? 'Survey' : sel.length===1 ? `Survey: ${sel[0].replace(/ survey$/,'')}` : `Survey: ${sel.length}`;
  return `<button class="v9-pill${sel.length?' on':''}" data-v9-pill="survey" onclick="v9OpenMenu(event,'survey')">${v9Esc(txt)}${V9_ICON.caret}</button>`;
}
const _v18Filters = v9RenderFilters;
v9RenderFilters = function(){
  _v18Filters.apply(this, arguments);
  const bar = document.getElementById('v9-filters'), type = bar && bar.querySelector('[data-v9-pill="type"]');
  if(type && !bar.querySelector('[data-v9-pill="survey"]')) type.insertAdjacentHTML('beforebegin', v18Pill());
};

/* the switcher next to the Feed title goes; the feed already spans the person's surveys */
document.head.insertAdjacentHTML('beforeend', '<style>#page-head [data-scope-pill]{display:none!important}</style>');
if(typeof v3Scope!=='undefined' && v3Scope!=='store') v3SetScope('store', true);

/* keep the cards in place whatever the journey state */
const _v18Journey = setJourney;
setJourney = function(){ const r = _v18Journey.apply(this, arguments); v18EnsureCards(); applyFeedVisibility(); return r; };
v18EnsureCards(); applyFeedVisibility();
