/* ═══ v19 (3 Nov) — QA pass: Copilot answers that make sense everywhere, and content fixes.
   1. Copilot in a drill-down: a suggested question gets its answer; a typed question is matched to what it asks
      (why, what to do, how many responses, trend, where, what customers say, history) and answered from that
      insight's own evidence; anything else gets a clear "here is what I can answer".
   2. Every insight has at least three suggested questions; area answers read as sentences.
   3. "Ask about your surveys" answers more topics across the surveys in the feed.
   4. Content: the payment-failure insight no longer says both "about 1 a week" and "nobody in 89 days". ═══ */

const v19Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const v19First = (s, n)=>String(s||'').split(/(?<=[.!?])\s+(?=[A-Z“"])/).slice(0, n||1).join(' ').trim();

/* ── 4. content fixes ── */
if(V10_DRILL['INS-05']) V10_DRILL['INS-05'].what = V10_DRILL['INS-05'].what.replace(', and nobody did in the 89 days before', '');
const _v19Shape = v6Shape;
v6Shape = function(){ return String(_v19Shape.apply(this, arguments)).replace(' (up to 1 mention a day)', ''); };

/* ── 2. suggested questions for insights that had one or none ── */
const V19_QA = {
  'AL-03': [
    ['Has this happened before?', 'Yes. Late or missed deliveries have come up in detractor comments in every one of the last 12 weekly updates. It is a standing problem, not a new one.', 'The evidence'],
    ['Is it one delivery partner or all of them?', 'The comments don\'t name a partner often enough to say. Sharing them with whoever owns the delivery partners is the quickest way to find out.', 'Recommended actions'],
    ['How much does it hurt satisfaction?', 'It is the reason detractors give most often in the online survey. This insight doesn\'t measure the score effect, so treat it as the top complaint rather than a measured drag on the score.', 'What happened · Evidence limitations']],
  'AL-04': [
    ['Has this happened before?', 'No. Refund-delay comments were not seen at all in the 6 months before the last 3 weeks, so this is new.', 'The evidence'],
    ['What changed 3 weeks ago?', 'The survey data can\'t tell you that. Checking refund processing times with finance for the last 3 weeks against the months before is the way to find out.', 'Recommended actions'],
    ['How many people mentioned it?', 'A small number so far. The insight shows the theme is new, not how many returns it affects, so watch whether it keeps appearing.', 'Evidence limitations']],
  'FOL-01': [
    ['Is the problem fixed?', 'It looks that way. Weekend checkout rose from 7.4 to 8.0 over the updates since you followed, and the gap is now within normal variation.', 'Since you followed'],
    ['What did customers complain about?', 'Only one till open on Saturdays and long queues. Recent comments describe a quicker checkout at the weekend.', 'What customers say'],
    ['Should I keep following this?', 'For one more update. If the score holds at 8.0, there is nothing more to do and you can stop following it.', 'Recommended actions']],
  'FOL-02': [
    ['Why can\'t the gap be checked now?', 'Only 18 first-time shoppers responded in the latest update, and at least 30 are needed to compare the two groups reliably.', 'The evidence'],
    ['What was the gap last time?', 'In the 20 Sep update, first-time shoppers rated fitting-room help 1.1 points lower than returning shoppers.', 'The evidence'],
    ['What can I do meanwhile?', 'Offer fitting-room help to first-time shoppers, and check the gap again once enough of them have responded.', 'Recommended actions']]
};
Object.entries(V19_QA).forEach(([id, qs])=>{
  const cur = COPILOT_QA[id] = COPILOT_QA[id] || [];
  qs.forEach(q=>{ const i = cur.findIndex(x=>x[0]===q[0]); if(i>-1) cur[i] = q; else cur.push(q); });
});
// area insights: the store list as a sentence, and no sample-data note inside an answer
(typeof V9_AM!=='undefined' ? V9_AM : []).forEach(a=>{
  const qa = COPILOT_QA[a.id]; if(!qa) return;
  const head = a.th || [], rows = (a.rows||[]).filter(r=>r[0] && !/^\+/.test(r[0]));
  const more = (a.rows||[]).find(r=>/^\+/.test(r[0]||''));
  const part = r=>{ const vals = r.slice(1).map((v,i)=>v ? `${head[i+1] ? head[i+1].replace(/^vs /,'vs ') + ' ' : ''}${v}` : '').filter(Boolean); return vals.length ? `${r[0]} (${vals.join(', ')})` : r[0]; };
  const s = /store/i.test(head[0]||'') ? `${rows.map(part).join('; ')}${more ? `, plus ${more[0].replace(/^\+\s*/,'')}` : ''}.` : rows.map(r=>`${r[0]} ${r[1]}`).join('; ') + '.';
  const i = qa.findIndex(x=>x[0]==='Which stores are behind this?'); if(i>-1) qa[i] = ['Which stores are behind this?', s, 'The evidence'];
  if(qa.length<3) qa.push(['What should I do first?', '', 'Recommended actions']);
});

/* ── 1. typed questions in a drill-down ── */
function v19Actions(id){
  const c = V10_DRILL[id];
  if(c && c.actions && c.actions.length) return c.actions.map(a=>[a.t, a.d]);
  const a = typeof V9_AM_BY!=='undefined' && V9_AM_BY[id];
  return a && a.steps ? a.steps.map(s=>[s[0], s[1]]) : [];
}
function v19Intent(id, q){
  const s = q.toLowerCase(), c = V10_DRILL[id] || {}, meta = INSIGHT_META[id] || {};
  const what = c.what || meta.summary || '', compares = c.compares || meta.ctx || '';
  const act = v19Actions(id), w = typeof V17_WHERE!=='undefined' && V17_WHERE[id], quotes = (typeof V11_QUOTES!=='undefined' && V11_QUOTES[id]) || [];
  const qa = COPILOT_QA[id] || [];
  const has = re=>re.test(s);
  if(has(/before|again|previous|history|first time|recur/)){ const b = qa.find(x=>x[0]==='Has this happened before?'); if(b) return b; }
  if(has(/what should|do first|next step|\bfix\b|recommend|action|what can (i|we) do|how (do|can) (i|we)|what do i do/)){
    if(act.length) return [q, `Start with: ${act[0][0].replace(/\.$/,'')}. ${act[0][1] || ''}${act[1] ? ` Then: ${act[1][0].replace(/\.$/,'')}.` : ''}`.trim(), 'Recommended actions'];
  }
  if(has(/\bwhy\b|cause|reason|behind|explain/)){
    const quote = quotes[0] ? ` In customers' own words: “${quotes[0][2]}”` : '';
    return [q, `The data shows what changed, not why it changed. ${v19First(what, 2)}${quote} Use What customers say for the reasons people give.`, 'What happened · What customers say'];
  }
  if(has(/where|which store|stores|segment|channel|which day|location|who is|concentrat/)){
    if(w) return [q, `Most of it sits in: ${w.segs.map(([g,rows])=>{ const tot = rows.reduce((x,r)=>x+r[1],0), top = rows.slice().sort((x,y)=>y[1]-x[1])[0]; return `${g.toLowerCase()}: ${top[0]} (${top[1]} of ${tot})`; }).join('; ')}.`, 'Where it happened'];
    const st = qa.find(x=>x[0]==='Which stores are behind this?'); if(st) return st;
    return [q, `This insight covers ${compares || 'the data in this update'}. It isn't broken down further.`, 'Facts'];
  }
  if(has(/how many|responses|based on|sample|enough|reliable|significant|data|how sure|confiden/)){
    return [q, `It compares ${compares || 'the latest update with the period before'}.${c.responses ? ` Responses: ${c.responses}.` : ''} Groups with too few responses are left out, and comment themes are matched by AI, so treat small counts as a signal rather than a measurement.`, 'Facts · Evidence limitations'];
  }
  if(has(/worse|better|trend|getting|improv|stop|still|chang|grow|rising|falling/)){
    return [q, `${v19First(what, 2)} Each update looks at its own period, so follow this insight to see how it moves; later figures then show under Since you followed.`, 'What happened'];
  }
  if(has(/say|comment|quote|customer|people|feedback|mention|complain/)){
    if(quotes.length) return [q, quotes.slice(0,2).map(x=>`“${x[2]}”`).join(' ') + ' See What customers say for more.', 'What customers say'];
  }
  return null;
}
const _v19Answer = copilotAnswer;
copilotAnswer = function(id, q){
  const qa = COPILOT_QA[id] || [];
  const exact = qa.find(x=>x[0]===q);
  if(exact){ if(!exact[1] && exact[0]==='What should I do first?'){ const r = v19Intent(id, q); if(r) return [exact[0], r[1], r[2]]; } return exact; }
  // a typed question close to a suggested one (at least 2 shared words) gets that answer
  const words = s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3);
  const qw = words(q); let best = null, score = 0;
  qa.forEach(x=>{ if(!x[1]) return; const n = words(x[0]).filter(w=>qw.includes(w)).length; if(n>score){ score = n; best = x; } });
  if(best && score>=2) return best;
  const r = v19Intent(id, q); if(r) return r;
  return [q, 'I answer from this insight\'s evidence: what happened, why it may have happened, the figures behind it, where it is concentrated, what customers say and what to do next. For anything wider, use "Ask about your surveys" at the top of the Feed.', ''];
};

/* ── 3. Ask about your surveys: more topics ── */
const V19_ASK = [
  [/lowest|worst|weakest/, 3], [/first[- ]time|returning shoppers|new shoppers|new customers/, 2], [/checkout|payment|card|till|queue|wallet/, 0],
  [/deliver|courier|shipping|late order/, {a:'<p><b>Late or missed deliveries</b> are the top reason online detractors give, and they have come up in every one of the last 12 weeks. It is a standing problem rather than a one-off.</p>', src:'Online experience survey · 01 Jul – 23 Sep', ins:['AL-03']}],
  [/refund|\breturns?\b|exchange/, {a:'<p><b>Refund delays</b> are new: comments about refunds taking too long appeared in the last 3 weeks and were not seen at all in the 6 months before.</p>', src:'Returns & exchanges survey · last 3 weeks vs 6 months before', ins:['AL-04']}],
  [/staff|helpful|service|team|employee/, {a:'<p><b>Staff helpfulness is the most-praised part of the visit</b>, at 9.1 out of 10 and up 0.3. Friendly, helpful staff is the reason promoters give most often (44% of their comments). Service satisfaction also rose, from 9.30 to 9.67.</p>', src:'Store experience survey · 261 responses, 01 Jun – 23 Sep', ins:['INS-06','INS-01']}],
  [/price|expensive|cost|afford|offer|discount|promo|deal/, {a:'<ul><li><b>Offers:</b> a few shoppers said offers were not what they seemed, such as a "2+2 free" that applied only to some items. That is about how offers are explained, not price.</li><li><b>Prices:</b> a few comments this period say prices are too high, after mostly positive price comments before. Too few to act on yet.</li></ul>', src:'Store experience survey · 01 Jun – 23 Sep vs 14 Feb – 31 May', ins:['INS-02','INS-03']}],
  [/clean|fitting|tidy|mess/, {a:'<p><b>Cleanliness of the store and fitting rooms</b> is the lowest-rated part of the visit at 7.4 out of 10, down 0.6, and the one most closely linked with overall satisfaction. Fitting rooms account for most of the low-score comments.</p>', src:'Store experience survey · 261 responses, 01 Jun – 23 Sep', ins:['INS-04']}],
  [/overall|satisfaction|nps|score|csat|improv|doing/, {a:'<p><b>Overall satisfaction rose</b> from 9.23 to 9.63 out of 10, with service satisfaction up by about the same. The lowest-rated part of the visit is cleanliness, at 7.4.</p>', src:'Store experience survey · 261 vs 568 responses', ins:['INS-01','INS-04']}],
  [/unhappy|detractor|complain|negative|problem|issue|bad/, 1]
];
const _v19AskFor = v17AnswerFor;
v17AnswerFor = function(q){
  if(V17_ANS[q]) return V17_ANS[q];
  const s = String(q).toLowerCase();
  for(const [re, ans] of V19_ASK){ if(re.test(s)) return typeof ans==='number' ? V17_ANS[V17_STARTERS[ans]] : ans; }
  return {a:`<p>I couldn't find that in your surveys. I can answer about topics people mention (checkout, payments, cleanliness, staff, offers, prices, deliveries, refunds), how a score has changed, or how groups of shoppers compare. Try one of those, or rephrase your question.</p>`, src:'All surveys you can see', ins:[]};
};

/* ── 4. Copilot on insights shared from outside your data: it works, but answers only from the
   shared snapshot and your own store's data (respondent-level data you can't access stays out) ── */
Object.assign(COPILOT_QA, {
  'CTY-01': [
    ['Did my store see it too?', 'Yes. RT ATYAF MALL shows the same two-day spike on 14–15 Sep, with 11 of the 64 mentions across KSA (17%). Your store normally gets about 1 such mention a week.', 'Your store’s responses, same definition and period'],
    ['Is this one outage or a store problem?', 'The shared snapshot points to something common: 9 of 42 KSA stores spiked on the same two days. That pattern fits one outage, such as the payment provider, more than 9 separate store problems. Central Operations can confirm it.', 'Shared snapshot · KSA, 23 Sep'],
    ['What should I do first?', 'Confirm what happened at your store on 14–15 Sep, such as which payment types failed and for how long, then ask Central Operations whether one outage explains all 9 stores.', 'Suggested actions'],
    ['Can I see the other stores’ comments?', 'No. You can see the shared figures, but comments and responses from the other 41 KSA stores need access. Use “Request access” in this panel to ask for it.', 'Your data access']
  ],
  'SHW-01': [
    ['Does my store have the same problem?', 'Not enough to call it yet. 2 of your 14 detractor comments mention fitting-room waits, and 5 are needed to call a pattern. Follow this to see if it grows.', 'Your store’s responses, same definition and period'],
    ['How big is it at RT SHUWAIKH?', '41% of its 56 detractor responses mention waiting for a free fitting room, up 12 points on the previous period.', 'Shared snapshot · RT SHUWAIKH, 21 Sep'],
    ['What should I do first?', 'Keep an eye on fitting-room waits at your store. Your related insight on cleanliness of the store and fitting rooms is the better place to act now.', 'Suggested actions'],
    ['Can I see what their customers said?', 'No. Comments and responses from RT SHUWAIKH need access to that store’s data. Use “Request access” in this panel to ask for it.', 'Your data access']
  ]
});
const _v19Shared = sharedViewerHTML;
sharedViewerHTML = function(s, tab){
  const out = _v19Shared.apply(this, arguments), id = s.insightId;
  if(out.includes(`copilot-input-${id}`)) return out;
  const t = document.createElement('template'); t.innerHTML = out;
  const dock = t.content.querySelector('[data-v3-dock]'); if(!dock) return out;
  dock.innerHTML = `<p class="v10-note" style="margin:0 0 8px">Copilot answers from the shared figures and your own store’s data.</p>
    <div class="dthread"><div id="copilot-thread-${id}" class="space-y-2">${copilotThreadHTML(id)}</div></div>${suggestedQuestionsHTML(id)}
    <div class="flex items-center gap-2"><input id="copilot-input-${id}" class="flex-1 text-[13px] border border-line rounded-md px-3 h-9 focus:outline-none" placeholder="Ask Copilot about this insight…" onkeydown="if(event.key==='Enter')askCopilot('${id}')"><button class="v6-send" title="Send" onclick="askCopilot('${id}')"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5l18-8.5L3 3.5v6.6l12 1.9-12 1.9z"/></svg></button></div>`;
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};
