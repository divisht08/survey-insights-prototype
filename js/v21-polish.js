/* ═══ v21 (3 Nov) — Pradeep's review of Nadav's feedback:
   1. Drill-down uses its white space: the facts column goes; its facts become one line at the top and the
      content takes the full width. Copilot dock is more compact.
   2. "What happened" opens with the % change, the score impact and the count, and bolds the key points.
   3. The cross-survey Copilot moves from a bar above the feed to a button in the Feed header.
   4. Three cards are finished end to end: payment spike (INS-05), cleanliness driver (INS-04), late deliveries (AL-03).
   Figures are sample data, consistent with what each insight already states. ═══ */

const V21_HERO = {
  'INS-05': {
    kpis:[['Change vs a usual week','▲ 12×','12 mentions that week, against ~1 in a usual week','bad'],
          ['Score on 14–15 Sep','▼ 1.7','7.9 out of 10, against ~9.6 on other days','bad'],
          ['Respondents affected','11','They rated the visit 4.2 on average','']],
    what:'On <b>14–15 Sep, 11 respondents</b> said their card or phone payment <b>failed at the till</b>, against ~1 a week normally. Mentions <b>stopped after the 15th</b>, which points to a one-off outage rather than an ongoing problem. Most came from <b>Till 3 (6 of 11)</b>, and most were card payments.',
    card:{sum:'<b>11 respondents</b> in 2 days said card or wallet payments <b>failed at the till</b>, against ~1 a week normally.',
      stat:'<p class="ic-num" style="color:#c5221f">▲ 12×</p><p class="ic-unit">mentions vs a usual week</p><p class="ic-delta down">▼ 1.7<small>score</small></p>'},
    where:{unit:'Count of mentions, 14–15 Sep', segs:[{t:'Till',rows:[['Till 3',6],['Till 1',3],['Self-checkout',2]]},{t:'Payment method',rows:[['Card',8],['Phone wallet',3]]}]},
    qa:[['Which till was it?','Mostly Till 3, with 6 of the 11 mentions. Till 1 had 3 and self-checkout 2. A problem on one till plus a few elsewhere fits a provider outage that hit Till 3 hardest.','Where it happened'],
        ['How much did it pull the score down?','On 14–15 Sep the store scored 7.9 out of 10, against ~9.6 on other days, a drop of 1.7. Over the whole period it lowers the score by 0.24: 9.63, against 9.87 without these 11 shoppers.','What happened · Evidence']]
  },
  'INS-04': {
    kpis:[['Cleanliness score','▼ 7.5%','7.4 out of 10, against 8.0 last period','bad'],
          ['Link with overall satisfaction','31%','Of the variation, the most of the 5 factors',''],
          ['Low-score comments','36','23 of them about fitting rooms','']],
    what:'<b>Cleanliness of the store and fitting rooms</b> moves most closely with overall satisfaction: shoppers who rate it low usually rate the whole visit low. It is also the <b>lowest-rated of the 5 factors, at 7.4 out of 10, down 7.5%</b>. Most low-score comments are about <b>fitting rooms (23 of 36)</b>, and more come <b>at weekends</b>. This is a link, not proof that cleaning more will raise scores.',
    card:{sum:'Of 5 factors, <b>cleanliness</b> is most linked with overall satisfaction, and it is the <b>lowest-rated, down 7.5%</b>.',
      deltaAfterUnit:'<p class="ic-delta down">▼ 7.5%<small>score</small></p>'}
  },
  'AL-03': {
    kpis:[['Change vs the 12 weeks before','▲ 17%','173 detractor comments, against 148','bad'],
          ['Share of detractor comments','34%','The top reason detractors give',''],
          ['Weeks it came up','12 of 12','~14 comments a week','']],
    what:'<b>Late or missed deliveries</b> came up in detractor comments <b>every week for 12 weeks</b>, more than any other reason, and <b>17% more</b> than in the 12 weeks before. <b>Missed delivery windows</b> are the larger part (97 of 173), and <b>Riyadh</b> has half of them. Because it appears every week, it is a standing delivery problem, not a one-off.',
    card:{sum:'Late or missed deliveries came up in detractor comments <b>every week for 12 weeks</b>, <b>17% more</b> than the 12 weeks before.',
      stat:'<p class="ic-num" style="color:#c5221f">▲ 17%</p><p class="ic-unit">vs the 12 weeks before</p><p class="ic-delta flat">34%<small>of detractors</small></p>'},
    qa:[['Which region is worst?','Riyadh, with 88 of the 173 comments (51%). Jeddah has 52 and Dammam 33.','Where it happened'],
        ['Is it getting worse?','Yes, slowly. There were 173 comments in the last 12 weeks, 17% more than the 148 in the 12 weeks before, and it came up every week.','What happened']]
  }
};

/* Where it happened: Nadav asked for the till; the payment spike splits by till and payment method */
if(typeof V20_WHERE!=='undefined') V20_WHERE['INS-05'] = V21_HERO['INS-05'].where;
if(typeof V17_WHERE!=='undefined') V17_WHERE['INS-05'] = {unit:'mentions', kpi:[], segs:V21_HERO['INS-05'].where.segs.map(g=>[g.t, g.rows])};
/* late deliveries: an action the reader can take, and one more customer comment */
if(V10_DRILL['AL-03'] && !V10_DRILL['AL-03'].v21){
  V10_DRILL['AL-03'].v21 = 1;
  V10_DRILL['AL-03'].actions.unshift({who:'', t:'Find out which delivery slots and partners the missed windows came from', d:'Missed windows are 97 of the 173 comments, and half of all comments are from Riyadh.', cta:'plan'});
}
if(typeof V11_QUOTES!=='undefined' && V11_QUOTES['AL-03'] && V11_QUOTES['AL-03'].length<3) V11_QUOTES['AL-03'].push(['neg','Missed window','Waited in all evening and the order showed as delivered the next day.']);
/* Copilot quotes "What happened" in its answers: keep it the same text as the drill-down */
Object.entries(V21_HERO).forEach(([id,h])=>{ if(V10_DRILL[id]) V10_DRILL[id].what = h.what.replace(/<[^>]+>/g,''); });
if(V10_DRILL['AL-03']) V10_DRILL['AL-03'].responses = V10_DRILL['AL-03'].responses || '173 detractor comments in 12 weeks';
/* Copilot: hero questions first, answers consistent with the figures above */
Object.entries(V21_HERO).forEach(([id,h])=>{
  if(!h.qa || !COPILOT_QA[id]) return;
  const have = new Set(COPILOT_QA[id].map(x=>x[0]));
  COPILOT_QA[id] = h.qa.filter(x=>!have.has(x[0])).concat(COPILOT_QA[id]);
});
(COPILOT_QA['INS-05']||[]).forEach(x=>{ if(x[0]==='How did it affect satisfaction?') x[1] = 'The 11 respondents who mentioned it rated the visit 4.2 on average, against 9.63 for the store. On 14–15 Sep the store scored 7.9, against ~9.6 on other days. Over the period it lowers the score by 0.24. With 11 mentions, treat this as a signal rather than a measurement.'; });

/* ── drill-down: facts line, KPIs, bold "What happened" ── */
function v21Kpis(id){
  const h = V21_HERO[id]; if(!h) return '';
  return `<div class="v21-kpis">${h.kpis.map(([k,v,s,tone])=>`<div class="v21-kpi${tone?' '+tone:''}"><span>${k}</span><b>${v}</b><small>${s}</small></div>`).join('')}</div>`;
}
const V21_WEEKS = [11,12,13,12,14,14,15,14,16,15,18,19]; // 173 in 12 weeks; 148 in the 12 before (~12 a week)
function v21WeeksHTML(){
  const max = 20, before = 148/12;
  const bars = V21_WEEKS.map((n,i)=>`<div class="v21-wb"><b>${n}</b><i style="height:${Math.round(n/max*100)}%"></i><span>${i===0?'6 Jul':i===11?'21 Sep':''}</span></div>`).join('');
  return `<div class="v21-wk"><p class="v10-cap">Detractor comments about late or missed deliveries, per week</p>
    <div class="v21-wchart"><div class="v21-wline" style="bottom:calc(${(before/max*100).toFixed(1)}% + 18px)"></div>${bars}</div>
    <p class="v10-cap" style="margin-top:6px">Dashed line: ~12 a week in the 12 weeks before. Every week is above it, and the last 2 weeks are the highest.</p></div>`;
}
const _v21Shape = v6Shape;
v6Shape = function(html, id, opts){
  const out = _v21Shape.apply(this, arguments);
  const t = document.createElement('template'); t.innerHTML = out;
  // facts column → one line at the top of the content
  const aside = t.content.querySelector('aside.v10-facts'), main = t.content.querySelector('.v10-main');
  if(aside && main && !t.content.querySelector('.v21-meta')){
    const items = [...aside.querySelectorAll('dl > div')].map(d=>{ const k = d.querySelector('dt'), v = d.querySelector('dd'); return k && v ? `<span><i>${k.textContent}</i> ${v.innerHTML}</span>` : ''; }).join('');
    main.insertAdjacentHTML('afterbegin', `<div class="v21-meta">${items}</div>`);
    aside.remove();
  }
  // late deliveries: a weekly chart instead of a one-row table
  const ev = id==='AL-03' && t.content.querySelector('[data-v10-evidence]');
  if(ev && !ev.querySelector('.v21-wk')){ const sh = ev.querySelector(':scope > .v6-sh'); [...ev.children].forEach(ch=>{ if(ch!==sh) ch.remove(); }); ev.insertAdjacentHTML('beforeend', v21WeeksHTML()); }
  // every Copilot dock gets the same header
  const dock = t.content.querySelector('[data-v3-dock]');
  if(dock && !dock.querySelector('.dh')) dock.insertAdjacentHTML('afterbegin', `<div class="dh v6-dh"><b><span style="color:#5b3fd1">${V17_ICON.spark}</span>Copilot</b><span class="v3-note">Answers from this insight's evidence</span><span class="sp"></span></div>`);
  // hero: KPIs first, then the bolded summary
  const h = V21_HERO[id], what = t.content.querySelector('.v10-what, [data-v3-summary] .id-lede');
  if(h && what && !t.content.querySelector('.v21-kpis')){ what.innerHTML = h.what; what.insertAdjacentHTML('beforebegin', v21Kpis(id)); }
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};

/* ── feed cards ── */
function v21Cards(){
  Object.entries(V21_HERO).forEach(([id,h])=>{
    document.querySelectorAll(`.insight-card[data-id="${id}"]`).forEach(c=>{
      c.classList.remove('v7-nostat');
      if(c.dataset.v21) return; c.dataset.v21 = '1';
      const sum = c.querySelector('[data-el="summary"]'); if(sum && h.card.sum) sum.innerHTML = h.card.sum;
      const st = c.querySelector('[data-el="stat"]');
      if(st && h.card.stat) st.innerHTML = h.card.stat;
      if(st && h.card.deltaAfterUnit){ const u = st.querySelector('.ic-unit'); if(u && !st.querySelector('.ic-delta')) u.insertAdjacentHTML('afterend', h.card.deltaAfterUnit); }
      if(st) st.classList.add('v21-stat');
      c.classList.add('v21-hero');
    });
  });
}
const _v21Vis = applyFeedVisibility;
applyFeedVisibility = function(){ const r = _v21Vis.apply(this, arguments); v21Cards(); return r; };

/* ── Ask about your surveys: a button in the Feed header, not a bar above the feed ── */
function v21AskBtn(){
  const right = document.querySelector('#page-head > div:last-child'); if(!right) return;
  let b = document.getElementById('v21-ask');
  if(!b){ right.insertAdjacentHTML('afterbegin', `<button id="v21-ask" class="v21-ask" onclick="segNav('ask')">${V17_ICON.spark}<span>Ask about your surveys</span></button>`); b = document.getElementById('v21-ask'); }
  const h1 = document.getElementById('page-h1');
  b.style.display = h1 && /^Feed$/.test(h1.textContent.trim()) ? '' : 'none';
}
const _v21Seg = segNav;
segNav = function(){ const r = _v21Seg.apply(this, arguments); v21AskBtn(); return r; };

v21AskBtn(); applyFeedVisibility();
