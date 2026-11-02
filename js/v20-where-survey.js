/* ═══ v20 (3 Nov) — "Where it happened" on every drill-down (Nadav: segment it), and the Survey filter
   starts with every survey ticked; untick to hide one.
   Segment figures are sample data, kept consistent with the numbers each insight already states. ═══ */

/* ── 1. Where it happened ──
   group: {t:title, k:'count'|'score', rows:[[label, value, note?]], suf?}
   count groups show each row's share; score groups show the row's note (usually the change) */
const V20_WHERE = {
  /* your store */
  'INS-01': {unit:'Overall satisfaction, out of 10',
    kpi:[['Against the usual','Up 0.40, to 9.63','9.23 in the previous period'],['Biggest lift','Weekend visits, up 0.58','Weekdays up 0.31']],
    segs:[{t:'Shopper',k:'score',rows:[['Returning',9.68,'▲ 0.35'],['First-time',9.55,'▲ 0.48']]},
          {t:'Day',k:'score',rows:[['Weekday',9.66,'▲ 0.31'],['Weekend',9.59,'▲ 0.58']]},
          {t:'Loyalty',k:'score',rows:[['Members',9.72,'▲ 0.30'],['Other shoppers',9.54,'▲ 0.49']]}]},
  'INS-06': {unit:'Staff helpfulness, out of 10',
    kpi:[['Against the usual','9.1 out of 10, up 0.3','8.8 in the previous period'],['Effect on the score','Top reason promoters give','In 38% of promoter comments']],
    segs:[{t:'Shopper',k:'score',rows:[['Returning',9.2,'▲ 0.3'],['First-time',8.9,'▲ 0.4']]},
          {t:'Day',k:'score',rows:[['Weekday',9.2,'▲ 0.2'],['Weekend',9.0,'▲ 0.4']]}]},
  'INS-02': {unit:'Count of comments',
    kpi:[['Against the usual','About the same as before','7 comments this period, 6 in the previous one'],['Effect on the score','Too few to measure','These shoppers rated the visit 8.1 on average']],
    segs:[{t:'Offer',rows:[['2+2 free',4],['40 SAR off',3]]},{t:'Where it was noticed',rows:[['At the till',5],['On the shop floor',2]]},{t:'Shopper',rows:[['First-time',4],['Returning',3]]}]},
  'INS-03': {unit:'Count of comments',
    kpi:[['Against the usual','5 comments call prices high','Last period, price comments were mostly positive'],['Effect on the score','Too few to measure','Price levels are set outside the store']],
    segs:[{t:'Department',rows:[['Footwear',2],['Kids',2],['Women’s',1]]},{t:'Shopper',rows:[['First-time',3],['Returning',2]]}]},
  'FOL-01': {unit:'Weekend checkout, out of 10',
    kpi:[['Against the usual','8.0, up from 7.4 in early September','Weekdays are at 8.3'],['Status','Within normal variation','No longer clearly lower']],
    segs:[{t:'Weekend day',k:'score',rows:[['Friday',7.9,'▲ 0.5'],['Saturday',8.1,'▲ 0.7']]},
          {t:'Time of visit',k:'score',rows:[['Afternoon',8.2,'▲ 0.6'],['Evening',7.8,'▲ 0.5']]}]},
  'FOL-02': {unit:'Fitting-room help, out of 10',
    kpi:[['Gap','1.1 points in the 20 Sep update','1.3 in mid-September'],['Responses','18 first-time shoppers in the latest update','30 are needed to check the gap again']],
    segs:[{t:'Shopper',k:'score',rows:[['Returning',9.0],['First-time',7.9]]},
          {t:'First-time shoppers, by day',k:'score',rows:[['Weekday',8.2],['Weekend',7.6]]}]},
  /* other surveys */
  'AL-03': {unit:'Count of detractor comments, last 12 weeks',
    kpi:[['Against the usual','Every week for 12 weeks','About 14 detractor comments a week'],['Effect on the score','Top reason detractors give','In 34% of detractor comments']],
    segs:[{t:'Problem',rows:[['Missed delivery window',97],['Late by a day or more',76]]},
          {t:'Region',rows:[['Riyadh',88],['Jeddah',52],['Dammam',33]]},
          {t:'Delivery type',rows:[['Home delivery',142],['Click & collect',31]]}]},
  'AL-04': {unit:'Count of comments, last 3 weeks',
    kpi:[['Against the usual','New: none in the 6 months before','19 comments in 3 weeks, more each week'],['Effect on the score','Returns rated 3.9 out of 10 by these shoppers','7.8 for other returns']],
    segs:[{t:'Week',rows:[['Week 1',3],['Week 2',6],['Week 3',10]]},
          {t:'How it was returned',rows:[['By courier',11],['In store',8]]},
          {t:'Refunded to',rows:[['Card',13],['Phone wallet',6]]}]},
  /* your area */
  'AM-01': {unit:'Checkout, out of 10 · 4 stores',
    kpi:[['Against the area','7.6 to 7.8, against 8.6','Each store has more than 100 responses'],['What low scorers mention','Queues at the till','In 46% of their checkout comments']],
    segs:[{t:'Day',k:'score',rows:[['Weekday',8.0],['Weekend',7.4]]},
          {t:'Shopper',k:'score',rows:[['Returning',7.9],['First-time',7.5]]},
          {t:'Low-score checkout comments',rows:[['Long queue',58],['Offer not applied',41],['Card or wallet issue',27]]}]},
  'AM-02': {unit:'Count of mentions, last 4 weeks · 5 stores',
    kpi:[['Against the usual','2 to 3 times the earlier level','76 mentions in 4 weeks; 31 in the 12 weeks before'],['How widespread','5 of 30 stores','The other 25 show no change']],
    segs:[{t:'Region',rows:[['Riyadh · 3 stores',53],['Hail · 1 store',12],['Qassim · 1 store',11]]},
          {t:'Day',rows:[['Weekend',49],['Weekday',27]]},
          {t:'Time of visit',rows:[['Evening',44],['Afternoon',25],['Morning',7]]}]},
  'AM-03': {unit:'Count of stores where it is the top factor',
    kpi:[['How widespread','Top factor in 18 of 30 stores','Second in 7 more'],['Effect on the score','Most linked with overall satisfaction','Across the area']],
    segs:[{t:'Region',rows:[['Riyadh',9],['Qassim',5],['Hail',4]]},{t:'Store size',rows:[['Large',8],['Medium',6],['Small',4]]}]},
  'AM-04': {unit:'Overall satisfaction, out of 10 · 5 stores',
    kpi:[['How long','Above 9.5 every week since September','4 weeks running'],['How widespread','5 of 30 stores','The highest in the area']],
    segs:[{t:'Region',k:'score',rows:[['Riyadh · 3 stores',9.60],['Hail · 1 store',9.58],['Qassim · 1 store',9.52]]},
          {t:'Shopper',k:'score',rows:[['Returning',9.65],['First-time',9.49]]}]},
  'AM-05': {unit:'Count of mentions, last 3 weeks',
    kpi:[['Against the usual','New: none in the 12 weeks before','14 mentions in 3 weeks'],['How widespread','3 of 30 stores','All inside malls']],
    segs:[{t:'What was said',rows:[['No spaces free',9],['Parking fees',5]]},{t:'Day',rows:[['Weekend',10],['Weekday',4]]}]},
  'AM-06': {unit:'Staff helpfulness, out of 10 · 7 stores',
    kpi:[['Against the usual','About 0.6 lower at weekends','In the other stores the gap is 0.1'],['How widespread','7 of 30 stores','Weekday scores are normal']],
    segs:[{t:'Day',k:'score',rows:[['Weekday',9.1],['Weekend',8.5]]},
          {t:'Weekend, by time of visit',k:'score',rows:[['Morning',8.9],['Afternoon',8.5],['Evening',8.2]]}]},
  'AM-07': {unit:'Count of mentions, 14–15 Sep · 6 stores',
    kpi:[['Against the usual','About 25 times the normal rate','51 mentions in 2 days'],['How widespread','6 of 30 stores','All on 14–15 Sep, none after']],
    segs:[{t:'Payment method',rows:[['Card',38],['Phone wallet',13]]},{t:'Day',rows:[['Mon 14 Sep',31],['Tue 15 Sep',20]]}]},
  'AM-08': {unit:'Count of comments this period',
    kpi:[['Against the usual','Steady, most weeks','About 12 comments a week across the area'],['How widespread','22 of 30 stores','At a similar rate in each']],
    segs:[{t:'Offer',rows:[['Buy 2, get 2 free',96],['SAR off a next purchase',61],['% off selected items',38]]},
          {t:'Region',rows:[['Riyadh',88],['Qassim',63],['Hail',44]]}]},
  'AM-09': {unit:'Count of responses lost, last 4 weeks · 9 stores',
    kpi:[['Against the usual','At least 30% fewer responses','About 250 fewer across the 9 stores'],['Effect on the results','Less reliable in these stores','3 now have fewer than 50 responses']],
    segs:[{t:'How the invitation reached shoppers',rows:[['Receipt QR code',212],['Email invite',31],['In-store tablet',9]]},
          {t:'Region',rows:[['Riyadh · 4 stores',118],['Qassim · 3 stores',83],['Hail · 2 stores',51]]}]},
  'AM-10': {unit:'Count of price comments this period',
    kpi:[['Against the usual','11% of comments, against 12%','About the same'],['How widespread','Similar in most stores','No one store or week stands out']],
    segs:[{t:'Department',rows:[['Footwear',38],['Women’s',36],['Kids',31],['Men’s',27]]},{t:'Region',rows:[['Riyadh',62],['Qassim',41],['Hail',29]]}]},
  'AM-11': {unit:'Overall satisfaction, out of 10',
    kpi:[['Gap','0.5 points, June to mid-September','0.3 in the latest update'],['How widespread','24 of 30 stores','No longer significant in the latest update']],
    segs:[{t:'June to mid-September',k:'score',rows:[['Loyalty members',9.4],['Other shoppers',8.9]]},
          {t:'Latest update',k:'score',rows:[['Loyalty members',9.3],['Other shoppers',9.0]]}]},
  'AM-12': {unit:'Count of comments, week of 30 Aug · 2 stores',
    kpi:[['Against the usual','18 in one week','About 1 a month before'],['How widespread','2 of 30 stores','Stopped the next week']],
    segs:[{t:'Where in the store',rows:[['Fitting rooms',8],['Shop floor',7],['At the till',3]]},{t:'Time of visit',rows:[['Afternoon',13],['Evening',5]]}]},
  'AM-13': {unit:'Count of stores where it is second',
    kpi:[['How widespread','Second factor in 11 stores','After cleanliness'],['Which stores','8 of the 11 are small stores','Small stores may run out of sizes more often']],
    segs:[{t:'Region',rows:[['Riyadh',4],['Qassim',4],['Hail',3]]},{t:'Store size',rows:[['Small',8],['Medium',2],['Large',1]]}]},
  'AM-14': {unit:'Count of comments from online returns, June to August',
    kpi:[['Against other visits','0.7 lower: 8.4 against 9.1','June to August'],['Latest update','Too few rated visits to confirm it','']],
    segs:[{t:'What they mention',rows:[['Waiting at the till',19],['Refund not instant',14],['Staff unsure of the process',11]]},
          {t:'Region',rows:[['Riyadh',23],['Qassim',12],['Hail',9]]}]},
  'AM-15': {unit:'Share of promoter comments mentioning staff',
    kpi:[['How widespread','All 30 stores','From 18% to 46% of promoter comments'],['Effect on the score','The top reason promoters give','31% on average']],
    segs:[{t:'Region',k:'score',suf:'%',rows:[['Riyadh',34],['Qassim',29],['Hail',27]]},{t:'Shopper',k:'score',suf:'%',rows:[['Returning',33],['First-time',27]]}]}
};
// insights already covered in v17 keep their figures; convert them to the group shape
Object.entries(V17_WHERE).forEach(([id,w])=>{ V20_WHERE[id] = V20_WHERE[id] || {unit:`Count of ${w.unit}`, kpi:w.kpi, segs:w.segs.map(([t,rows])=>({t, rows}))}; });
// a shared insight from a store you can't access has no breakdown to show
delete V20_WHERE['SHW-01'];

function v20WhereHTML(id){
  const w = V20_WHERE[id]; if(!w) return '';
  const segs = w.segs.slice(0,2).map(g=>{
    const vals = g.rows.map(r=>r[1]), max = Math.max(...vals), tot = vals.reduce((a,b)=>a+b,0);
    if(g.k==='score'){
      const dp = Math.max(...vals.map(v=>(String(v).split('.')[1]||'').length)), fmt = n=>g.suf ? n : n.toFixed(Math.max(1, dp));
      const lo = Math.min(...vals), floor = g.suf ? 0 : Math.max(0, lo - (max - lo || 1) * 2);
      return `<div class="v17-seg"><p>${g.t}</p>${g.rows.map(([l,n,note])=>`<div class="v17-srow v20-score"><span>${v17Esc(l)}</span><i><em style="width:${Math.max(6, Math.round((n-floor)/(max-floor)*100))}%"></em></i><b>${fmt(n)}${g.suf||''}</b><small>${note ? v17Esc(note) : ''}</small></div>`).join('')}</div>`;
    }
    return `<div class="v17-seg"><p>${g.t}</p>${g.rows.map(([l,n])=>`<div class="v17-srow"><span>${v17Esc(l)}</span><i><em style="width:${Math.round(n/max*100)}%"></em></i><b>${n}</b><small>${Math.round(n/tot*100)}%</small></div>`).join('')}</div>`;
  }).join('');
  return `<div class="id-sect" data-v11-sect="Where it happened" data-v17-where><div class="v6-sh"><b>Where it happened</b><span>${v17Esc(w.unit)}</span></div>
    <div class="v17-segs">${segs}</div></div>`;
}
v17WhereHTML = v20WhereHTML;
const _v20Shape = v6Shape;
v6Shape = function(html, id, opts){
  const out = _v20Shape.apply(this, arguments); if(!V20_WHERE[id] || V17_WHERE[id]) return out;
  const t = document.createElement('template'); t.innerHTML = out;
  if(!t.content.querySelector('[data-v17-where]')){
    const ev = [...t.content.querySelectorAll('.id-sect')].find(s=>{ const b = s.querySelector(':scope > .v6-sh b'); return b && b.textContent.trim()==='Evidence'; });
    if(ev) ev.insertAdjacentHTML('afterend', v20WhereHTML(id));
  }
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};
document.head.insertAdjacentHTML('beforeend', '<style>.v17-srow.v20-score{grid-template-columns:minmax(90px,1.2fr) 1fr 38px 44px}</style>');

/* ── 2. Survey filter: every survey ticked by default; untick to hide ── */
v9F.surveyOff = new Set();
const v20Surveys = ()=>{ const cards = v9Cards().filter(c=>c.dataset.state==='active');
  return Object.entries(V3_SCOPES).map(([k,s])=>[k, s.label, cards.filter(c=>v18SurveyOf(c)===k).length]).filter(o=>o[2]); };
v9Match = (function(prev){ return function(c){ if(v9F.surveyOff.has(v18SurveyOf(c))) return false; return prev.apply(this, arguments); }; })(_v18Match);
v9FilterCount = function(){ return _v18Count() + (v9F.surveyOff.size ? 1 : 0); };
v9ClearFilters = (function(prev){ return function(){ v9F.surveyOff.clear(); v9F.survey.clear(); return prev.apply(this, arguments); }; })(v9ClearFilters);
v18Pill = function(){
  const all = v20Surveys(), on = all.filter(o=>!v9F.surveyOff.has(o[0]));
  const txt = on.length===all.length ? 'Survey: All' : on.length===1 ? `Survey: ${on[0][1].replace(/ survey$/,'')}` : `Survey: ${on.length} of ${all.length}`;
  return `<button class="v9-pill${on.length<all.length?' on':''}" data-v9-pill="survey" onclick="v9OpenMenu(event,'survey')">${v9Esc(txt)}${V9_ICON.caret}</button>`;
};
// re-render the pill (v18 only inserts it when missing)
const _v20Filters = v9RenderFilters;
v9RenderFilters = function(){
  _v20Filters.apply(this, arguments);
  const p = document.querySelector('#v9-filters [data-v9-pill="survey"]'); if(p) p.outerHTML = v18Pill();
};
const _v20Open = v9OpenMenu;
v9OpenMenu = function(ev, key){
  _v20Open.apply(this, arguments);
  if(key!=='survey') return;
  const m = document.getElementById('v9-menu'); if(!m || m.style.display!=='block') return;
  m.innerHTML = v20Surveys().map(([v,l,n])=>`<label class="v9-opt"><input type="checkbox" name="v9-survey" ${v9F.surveyOff.has(v)?'':'checked'} onchange="v9Toggle('survey','${v9Esc(v)}',this.checked)"><span>${v9Esc(l)}</span><small>${n}</small></label>`).join('');
};
const _v20Toggle = v9Toggle;
v9Toggle = function(key, v, on){
  if(key!=='survey') return _v20Toggle.apply(this, arguments);
  if(on) v9F.surveyOff.delete(v); else v9F.surveyOff.add(v);
  applyFeedVisibility();
};
if(typeof applyFeedVisibility==='function') applyFeedVisibility();

/* ── 3. Copilot's "where" answers read the same breakdown ── */
const _v20Intent = v19Intent;
v19Intent = function(id, q){
  const w = V20_WHERE[id], s = String(q).toLowerCase();
  if(w && /where|which store|stores|segment|channel|which day|location|who is|concentrat|break.?down|split/.test(s)){
    const parts = w.segs.slice(0,2).map(g=>{
      const top = g.rows.slice().sort((x,y)=>y[1]-x[1]);
      if(g.k==='score'){ const lo = top[top.length-1], f = n=>g.suf ? n+g.suf : (Number.isInteger(n) ? n.toFixed(1) : n); return `${g.t}: ${top[0][0]} ${f(top[0][1])}, ${lo[0]} ${f(lo[1])}`; }
      const tot = g.rows.reduce((x,r)=>x+r[1],0); return `${g.t}: ${top[0][0]} (${top[0][1]} of ${tot})`;
    });
    return [q, `${parts.join('. ')}.`, 'Where it happened'];
  }
  return _v20Intent.apply(this, arguments);
};
