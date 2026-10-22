/* ═══ v10 — manager feedback of 21 Oct
   Drill-down: words first (2–3 lines on what happened), then Evidence with every number and one chart, then what customers
   say, then Recommended actions. No metrics strip, no "why it is ranked" line, no repeated subtitle, no Illustrative banner
   (one note in "About the data" instead). A slim facts column on the right holds first found, what it compares, responses,
   evidence and status. Four drill-downs are rewritten in full: INS-01, INS-05, INS-04, INS-06.
   Cards: date right-aligned in the top row and replaced by the actions on hover (Outlook); no grey comparison line;
   engagement icons bottom-left; status (Following) and Investigate bottom-right. ═══ */

const v10Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ── the four drill-downs, written to be read ── */
const V10_DRILL = {
  'INS-01': {
    what:'Overall satisfaction at RT ATYAF MALL rose from 9.23 to 9.63 out of 10 between the two periods. Service satisfaction rose by almost the same amount, from 9.30 to 9.67, and this period\'s comments describe staff as welcoming, smooth and respectful. The two moved together; the data does not show which one caused the other.',
    compares:'01 Jun – 23 Sep vs 14 Feb – 31 May 2026', responses:'261 this period, 568 before', comparing:true,
    chart:{title:'Average score out of 10', min:8, max:10, rows:[['Overall satisfaction',9.23,9.63],['Service satisfaction',9.30,9.67]], legend:['14 Feb – 31 May','01 Jun – 23 Sep']},
    stats:[['Overall satisfaction','9.63','up 0.40 from 9.23'],['Service satisfaction','9.67','up 0.37 from 9.30'],['Responses','261','568 in the previous period']],
    note:'Fewer people answered this period, but 261 responses are enough for the change to be statistically significant.',
    actions:[
      {who:'', t:'Find out what the team is doing differently since June', d:'Start with greeting and helping customers, which this period\'s comments praise most.', cta:'plan'},
      {who:'Area Managers', t:'Compare with other stores', d:'If other stores did not improve as much, share what this store does.', cta:'share'}]
  },
  'INS-05': {
    what:'On 14 and 15 September, 11 respondents said their card or phone payment failed at the till. Usually about 1 respondent a week mentions this, and nobody did in the 89 days before. Mentions stop after the 15th, which looks like a one-off outage rather than an ongoing problem. These 11 respondents rated the visit 4.2 out of 10 on average, against 9.63 for the store.',
    compares:'14–15 Sep vs the previous 89 days', responses:'11 respondents mentioned it',
    keepChart:/^Daily payment-problem mentions/i, chartTitle:'Payment-problem mentions per day, 27 Aug – 23 Sep',
    stats:[['Mentions on 14–15 Sep','11','in 2 days'],['Usual rate','about 1','a week'],['How these 11 rated the visit','4.2','out of 10 · store average 9.63']],
    actions:[
      {who:'', t:'Ask IT whether the card terminals failed on 14–15 Sep', d:'Check the terminals and the payment provider for an outage on those two days.', cta:'plan'},
      {who:'Area Managers', t:'Check whether other stores saw the same spike', d:'If they did, it is a network-wide payment problem rather than this store\'s.', cta:'share'},
      {who:'Central Operations', t:'Contact customers who could not pay', d:'If an outage is confirmed, consider reaching out to the respondents who left without buying.', cta:'share'}]
  },
  'INS-04': {
    what:'Of the 5 parts of the visit that customers rate, cleanliness of the store and fitting rooms moves most closely with overall satisfaction: shoppers who rate cleanliness low usually rate the whole visit low. It is also the lowest-rated of the 5, at 7.4 out of 10, down 0.6 on the previous period. That makes it the clearest place to act, although it shows a link, not proof that cleaning more will raise scores.',
    compares:'01 Jun – 23 Sep 2026', responses:'261',
    keepChart:/^How each factor relates/i, chartTitle:'How closely each part of the visit moves with overall satisfaction',
    stats:[['Cleanliness score','7.4','out of 10 · down 0.6'],['Detractor comments about cleanliness','38%','of their comments'],['Promoter comments about cleanliness','6%','of their comments']],
    actions:[
      {who:'', t:'Add a fitting-room reset to every shift checklist', d:'Especially at peak hours. Check the cleanliness score again in the next update.', cta:'plan'},
      {who:'Area Managers', t:'Compare cleanliness across stores', d:'To see whether this is this store\'s issue or happens across the network.', cta:'share'}]
  },
  'INS-06': {
    what:'Staff helpfulness is rated 9.1 out of 10, the highest of the 5 parts of the visit that customers rate, and up 0.3 on the previous period. When promoters explain their score, friendly and helpful staff is the reason they give most often.',
    compares:'01 Jun – 23 Sep vs 14 Feb – 31 May 2026', responses:'261 this period', comparing:true,
    chart:{title:'Staff helpfulness, out of 10', min:8, max:10, rows:[['Staff helpfulness',8.8,9.1]], legend:['14 Feb – 31 May','01 Jun – 23 Sep']},
    stats:[['Staff helpfulness','9.1','out of 10 · up 0.3'],['Promoter comments that mention helpful staff','44%','the most common reason'],['Detractor comments that mention it','7%','']],
    actions:[
      {who:'', t:'Name the behaviours customers praise at the next team briefing', d:'Greeting at the door, finding sizes, checking the stock room. Recognise the shifts behind them.', cta:'plan'},
      {who:'Area Managers', t:'Share what works with other stores', d:'Ask stores with lower staff scores to try the same habits.', cta:'share'}]
  }
};
// insights that compare two periods keep the period on their quotes
const v10Compares = id=>{ const c = V10_DRILL[id]; if(c) return !!c.comparing; const t = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`); return !!(t && t.dataset.type==='comparison'); };

function v10Chart(c){
  const pct = v=>Math.max(2, (v - c.min) / (c.max - c.min) * 100);
  return `<div class="v10-chart" data-v10-chart><p class="v10-cap">${v10Esc(c.title)}</p>
    ${c.rows.map(([l,a,b])=>`<div class="v10-cr"><span class="l">${v10Esc(l)}</span><div class="bars"><div class="b prev" style="width:${pct(a)}%"><i>${a.toFixed(2).replace(/0$/,'')}</i></div><div class="b now" style="width:${pct(b)}%"><i>${b.toFixed(2).replace(/0$/,'')}</i></div></div></div>`).join('')}
    <p class="v10-leg"><span><i class="prev"></i>${v10Esc(c.legend[0])}</span><span><i class="now"></i>${v10Esc(c.legend[1])}</span><span class="axis">Scale shown from ${c.min} to ${c.max}</span></p></div>`;
}
function v10Stats(stats){
  return `<div class="v10-stats">${stats.map(([l,v,s])=>`<div><span>${v10Esc(l)}</span><b>${v10Esc(v)}</b>${s ? `<small>${v10Esc(s)}</small>` : ''}</div>`).join('')}</div>`;
}
function v10Facts(id){
  const c = V10_DRILL[id], card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`);
  const am = typeof V9_AM_BY!=='undefined' ? V9_AM_BY[id] : null, x = (typeof SNAP_EXTRA!=='undefined' && SNAP_EXTRA[id]) || {}, m = INSIGHT_META[id] || {};
  const basis = c ? c.compares : am ? am.basis : card ? ((card.querySelector('[data-el="basis"]')||{}).dataset?.v10Basis || (card.querySelector('[data-el="basis"]')||{}).textContent || '') : (x.ctx || m.ctx || '');
  const t = FOLLOW_TRACK[id], last = t ? t.rows[t.rows.length-1] : null;
  const ev = inCurrentEdition(id) ? 'Significant' : (last && last.ev==='thin' ? 'Too few responses' : 'Not significant');
  const st = [];
  if(followed[id]) st.push('Following');
  const a = typeof v9ActOf==='function' ? v9ActOf(id) : {};
  if(a.shared) st.push('Shared'); if(actionPlans[id]) st.push('Action plan · ' + actionPlans[id].status);
  if(dismissedFeed.has(id)) st.push('Deleted');
  const row = (k,v)=>v ? `<div><dt>${k}</dt><dd>${v10Esc(v)}</dd></div>` : '';
  return `<aside class="v10-facts" data-v10-facts><dl>
    ${row('Update', (v7DateOf(id)||{}).short || '')}
    ${row('Compares', String(basis).replace(/\s*·\s*New this period/,'').trim())}
    ${row('Responses', c ? c.responses : '')}
    ${row('Evidence', ev + ' in the latest update')}
    ${row('Status', st.join(' · ') || 'Open')}</dl></aside>`;
}
function v10ActionRow(id, a){
  const btn = a.cta==='share'
    ? `<button class="btn-sec" data-v10-share="${v10Esc(a.who)}" onclick="v9ShareGroup('${id}','${v10Esc(a.who)}')">Share</button>`
    : (actionPlans[id] ? `<button class="btn-sec" data-v10-plan onclick="openActionPlan('${id}')">Open action plan</button>` : `<button class="btn-sec" data-v10-plan onclick="openActionPlan('${id}')">Add to action plan</button>`);
  return `<div class="v6-row v10-act"><span class="ri"><svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></span>
    <div class="rt">${a.who ? `<span class="v10-who">For ${v10Esc(a.who)}</span>` : ''}<b>${v10Esc(a.t)}</b><p>${v10Esc(a.d)}</p></div><div class="rb">${btn}</div></div>`;
}
// a generic action row from the older wording: "Recommended action. add a fitting-room reset…, especially…"
function v10Tidy(row){
  const b = row.querySelector('.rt > b'), p = row.querySelector('.rt > p'); if(!b || !p || row.classList.contains('agent')) return;
  const who = b.textContent.match(/^For (?:your |the )?(.+)$/i);
  const txt = p.textContent.trim().replace(/^\w/, ch=>ch.toUpperCase());
  const cut = txt.search(/,|\s—\s|;|\.\s/);
  const head = cut>12 ? txt.slice(0, cut) : txt, rest = cut>12 ? txt.slice(cut).replace(/^[,;—.\s]+/,'') : '';
  b.textContent = head.replace(/\.$/,'');
  p.textContent = rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : '';
  if(!rest) p.remove();
  if(who){ const g = who[1].replace(/^Area Manager.*$/i,'Area Managers').replace(/^Central team$/i,'Central Operations'); b.insertAdjacentHTML('beforebegin', `<span class="v10-who">For ${v10Esc(g)}</span>`); }
  row.classList.add('v10-act');
  row.querySelectorAll('.rb button').forEach(btn=>{
    if(/^Share with /.test(btn.textContent)){ btn.textContent = 'Share'; }
    if(/^Add to action plan|Open action plan/.test(btn.textContent)) btn.dataset.v10Plan = '1';
  });
}

function v10Reshape(html, id){
  const t = document.createElement('template'); t.innerHTML = html;
  const f = t.content, head = f.querySelector('.v6-head'), body = f.querySelector('.v6-body');
  const c = V10_DRILL[id];
  // header: title and actions only; the facts go in the side column
  if(head) head.querySelectorAll('.v6-sum,[data-v7-found]').forEach(n=>n.remove());
  if(!body){ const box = document.createElement('div'); box.appendChild(f); return box.innerHTML; }
  body.querySelectorAll('.illus-banner,[data-v6-metrics],.v9-why,.v6-why').forEach(n=>n.remove());
  // 1. What happened: 2–3 lines in words
  const found = body.querySelector('.v6-found');
  let blocks = [];
  if(found){
    const h = found.querySelector('.v6-sh b'); if(h) h.textContent = 'What happened';
    blocks = [...found.querySelectorAll('.v9-block')]; blocks.forEach(b=>b.remove());
    if(c){ found.querySelectorAll('.id-lede').forEach(l=>l.remove()); found.insertAdjacentHTML('beforeend', `<p class="id-lede v10-what">${v10Esc(c.what)}</p>`); }
    found.querySelectorAll('.id-lede').forEach(l=>l.classList.add('v10-what'));
  }
  // 2. Evidence: the numbers and one chart, with plain labels
  const ev = document.createElement('div'); ev.className = 'id-sect v10-ev'; ev.dataset.v10Evidence = id;
  ev.innerHTML = '<div class="v6-sh"><b>Evidence</b><span></span></div>';
  if(c){
    if(c.chart) ev.insertAdjacentHTML('beforeend', v10Chart(c.chart));
    if(c.keepChart){ const k = blocks.find(b=>c.keepChart.test((b.querySelector('.v9-cap')||{}).textContent||'')); if(k){ const cap = k.querySelector('.v9-cap'); if(cap){ cap.className = 'v10-cap'; cap.textContent = c.chartTitle; } k.className = 'v10-chart'; ev.appendChild(k); } }
    ev.insertAdjacentHTML('beforeend', v10Stats(c.stats) + (c.note ? `<p class="v10-note">${v10Esc(c.note)}</p>` : ''));
  } else {
    blocks.forEach(b=>{ b.className = 'v10-chart'; const cap = b.querySelector('.v9-cap'); if(cap) cap.className = 'v10-cap'; ev.appendChild(b); });
    body.querySelectorAll(':scope > .id-sect').forEach(s=>{ const hb = s.querySelector(':scope > .v6-sh b'); if(hb && hb.textContent.trim()==='The evidence'){ s.querySelector(':scope > .v6-sh').remove(); while(s.firstChild) ev.appendChild(s.firstChild); s.remove(); } });
  }
  // plainer labels wherever they appear
  ev.querySelectorAll('*').forEach(n=>{ if(n.children.length) return; n.textContent = n.textContent
    .replace(/^Same 5-factor analysis as the cleanliness driver insight$/,'').replace(/^Staff in open comments$/,'How often comments mention staff')
    .replace(/^Rank among praise themes$/,'Rank among the reasons promoters give').replace(/^SHARE OF SATISFACTION VARIATION$/i,'How closely it moves with satisfaction')
    .replace(/^SCORE · VS PREV\.$/i,'Score, change'); });
  ev.querySelectorAll('thead').forEach(th=>{ if(!th.textContent.trim()) th.remove(); });
  if(ev.children.length>1){ if(found) found.after(ev); else body.prepend(ev); }
  // 3. What customers say: the period only when the insight compares two periods
  const secs = [...body.querySelectorAll(':scope > .id-sect')];
  const name = s=>((s.querySelector(':scope > .v6-sh b')||{}).textContent||'').trim();
  const voice = secs.find(s=>name(s)==='Customer voice');
  if(voice){
    voice.querySelector(':scope > .v6-sh b').textContent = 'What customers say';
    const hint = voice.querySelector(':scope > .v6-sh span'); if(hint) hint.textContent = 'Examples';
    voice.querySelectorAll('p.italic').forEach(p=>p.remove());
    const both = /Current period/.test(voice.textContent) && /Previous period/.test(voice.textContent);
    if(!both){ voice.querySelectorAll('.v3-q *').forEach(n=>{ if(!n.children.length) n.textContent = n.textContent.replace(/^·\s*(Current|Previous) period\s*$/,'').replace(/^·\s*(\d+ \w{3}) period\s*$/,'· $1'); });
      voice.querySelectorAll('p.eyebrow').forEach(p=>{ if(/period/i.test(p.textContent)) p.remove(); }); }
    const all = voice.querySelector('[data-v3-see-all]'); if(all){ all.setAttribute('onclick', "toast('In the product this lists every comment behind the insight')"); all.textContent = 'See all comments'; }
  }
  // 4. Recommended actions
  const next = secs.find(s=>name(s)==='Next steps');
  if(next){
    next.querySelector(':scope > .v6-sh b').textContent = 'Recommended actions';
    const hint = next.querySelector(':scope > .v6-sh span'); if(hint) hint.textContent = '';
    const rows = [...next.querySelectorAll(':scope > .v6-row:not(.agent)')];
    if(c){ rows.forEach(r=>r.remove()); next.querySelector(':scope > .v6-sh').insertAdjacentHTML('afterend', c.actions.map(a=>v10ActionRow(id,a)).join('')); }
    else rows.forEach(v10Tidy);
  }
  // Since you followed comes before the activity
  const since = secs.find(s=>/^Since you followed/.test(name(s))), act = secs.find(s=>/^Activity/.test(name(s)));
  if(since && act) act.before(since);
  // the facts column
  const main = document.createElement('div'); main.className = 'v10-main';
  while(body.firstChild) main.appendChild(body.firstChild);
  const cols = document.createElement('div'); cols.className = 'v10-cols'; cols.appendChild(main);
  cols.insertAdjacentHTML('beforeend', v10Facts(id));
  body.appendChild(cols);
  const box = document.createElement('div'); box.appendChild(f); return box.innerHTML;
}
const _v10Shape = v6Shape;
v6Shape = function(html, id, opts){ return v10Reshape(_v10Shape(html, id, opts), id); };

/* ── cards: date on the right, actions replace it on hover; footer = activity left, status + Investigate right ── */
const V10_ICON = {
  fol:'<svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>',
  folOn:'<svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>'
};
function v10PaintCard(c){
  const id = c.dataset.id, head = c.querySelector('.ic-head'); if(!head) return;
  let right = head.querySelector('.v10-right');
  if(!right){ right = document.createElement('div'); right.className = 'v10-right'; head.appendChild(right); }
  const when = head.querySelector('.v9-when'); if(when && when.parentNode!==right) right.appendChild(when);
  let hv = right.querySelector('.v10-hover');
  if(!hv){ hv = document.createElement('span'); hv.className = 'v10-hover'; right.appendChild(hv); }
  let fb = hv.querySelector('.v10-fol');
  if(!fb){ fb = document.createElement('button'); fb.className = 'v10-fol'; fb.dataset.v10Fol = id; fb.setAttribute('onclick', `event.stopPropagation();v3FollowToggle('${id}');applyFeedVisibility()`); hv.appendChild(fb); }
  fb.innerHTML = followed[id] ? V10_ICON.folOn : V10_ICON.fol; fb.title = followed[id] ? 'Unfollow' : 'Follow'; fb.classList.toggle('on', !!followed[id]);
  const mu = head.querySelector('.v9-mu'); if(mu && mu.parentNode!==hv) hv.appendChild(mu);
  const x = head.querySelector('.v3-x'); if(x && x.parentNode!==hv) hv.appendChild(x);
  // footer: activity on the left; status and Investigate on the right
  const foot = c.querySelector('.ic-foot'), acts = c.querySelector('.ic-acts');
  const basis = c.querySelector('.ic-foot [data-el="basis"]'); if(basis && !basis.dataset.v10Basis) basis.dataset.v10Basis = basis.textContent.trim();
  const live = acts && acts.querySelector('.act-live') || acts;
  if(live){
    let st = live.querySelector('.v10-status');
    if(followed[id] && !st){ live.insertAdjacentHTML('afterbegin', `<span class="v10-status" data-v10-status>${V10_ICON.folOn}Following</span>`); }
    if(!followed[id] && st) st.remove();
  }
  if(foot){ const a = foot.querySelector('.v7-act'); if(a && foot.firstElementChild!==a) foot.prepend(a); }
}
const _v10Apply = applyFeedVisibility;
applyFeedVisibility = function(){
  _v10Apply();
  document.querySelectorAll('#card-grid .insight-card').forEach(v10PaintCard);
};
// the area cards lose their Illustrative tag; one note in "About the data" covers it
document.querySelectorAll('#card-grid .v9-am .illus').forEach(n=>n.remove());
const _v10AMCard = v9AMCardHTML;
v9AMCardHTML = function(a){ return _v10AMCard(a).replace('<span class="illus" style="display:inline-flex!important">Illustrative</span>',''); };

/* ── the one place that says what is sample data ── */
(function v10Notes(){
  const btn = document.getElementById('proto-notes-btn'); if(btn) btn.textContent = 'ⓘ About the data · some is sample';
  const n = document.getElementById('proto-notes'); if(!n || n.dataset.v10) return; n.dataset.v10 = '1';
  n.innerHTML = `<b>Real data:</b> overall and service satisfaction (9.63 vs 9.23; 9.67 vs 9.30), response counts (261 vs 568), the offer-clarity and price themes and their quotes come from RT ATYAF MALL survey responses.
    <b>Sample content:</b> the payment-failure spike, the cleanliness driver, the staff helpfulness insight, the weekend checkout and fitting-room comparisons, the Day 50 Area Manager feed (store names and figures) and the alert are placeholders that show how these insights would read. The Illustrative notes on screens are removed for now; this is the one place that says so.`;
})();

/* ── start ── */
(function v10Init(){ applyFeedVisibility(); })();

/* ═══ every other drill-down, rewritten the same way ═══ */
Object.assign(V10_DRILL, {
  'INS-02': {
    what:'Shoppers in both periods said offers were not what they seemed: a "2+2 free" that turned out to apply only to some items, and "40 SAR off" that applied to a future purchase rather than the bill in hand. These are complaints about how offers are explained, not about prices being high. There are only a few such comments, so the data cannot say how many shoppers are affected.',
    compares:'01 Jun – 23 Sep vs 14 Feb – 31 May 2026', responses:'261 this period, 568 before',
    stats:[['Seen in','Both periods','14 Feb – 31 May and 01 Jun – 23 Sep'],['Clear examples','1 each','one in each period'],['Change between periods','Not measured','too few comments to compare']],
    actions:[
      {who:'', t:'Walk each active offer from the door to the till', d:'Check that the sign, what staff say and what the till applies all match.', cta:'plan'},
      {who:'Central Operations', t:'Ask for clearer wording on offer mechanics', d:'If the offer itself is confusing, the fix is in the campaign, not the store.', cta:'share'}]
  },
  'INS-03': {
    what:'Some comments this period say prices are too high, for example "Plz less the price". In the previous period, comments about price were mostly positive, such as "Affordable" and "High quality and suitable price". There are only a few comments either way, so this is worth watching rather than acting on, and price levels are set outside the store.',
    compares:'01 Jun – 23 Sep vs 14 Feb – 31 May 2026', responses:'261 this period, 568 before',
    stats:[['Seen in','Both periods','negative now, mostly positive before'],['Clear examples','1 now, 2 before',''],['Change between periods','Not measured','too few comments to compare']],
    actions:[
      {who:'', t:'Check whether price comments point to particular products', d:'And make sure staff can explain value and the current offers.', cta:'plan'},
      {who:'Central Operations', t:'Pass repeated price complaints to pricing', d:'Price levels are set centrally, not by the store.', cta:'share'}]
  },
  'FOL-01': {
    what:'In early September, weekend shoppers rated checkout 7.4 out of 10, lower than in the period before. The score has risen in each update since, to 8.0 in the latest one, and the difference is now within normal variation. A third till was added on Saturdays from 12 Sep, as noted in the activity on this insight.',
    compares:'Weekend visits vs the previous period',
    stats:[['Weekend checkout score','8.0','out of 10 · 7.4 when you followed']],
    actions:[{who:'', t:'Keep the third Saturday till for another update', d:'If the score holds, mark this insight as done.', cta:'plan'}]
  },
  'FOL-02': {
    what:'In mid-September, first-time shoppers rated fitting-room help 1.3 points lower than returning shoppers, and 1.1 lower in the 20 Sep update. In the latest update only 18 first-time shoppers responded, fewer than the 30 needed to compare the two groups, so the gap could not be checked again.',
    compares:'First-time vs returning shoppers',
    stats:[['Gap, last reliable figure','−1.1','points · Sun 20 Sep update'],['First-time shoppers who responded','18','30 needed to compare']],
    actions:[{who:'', t:'Offer fitting-room help to first-time shoppers', d:'Check the gap again when enough first-time shoppers have responded.', cta:'plan'}]
  },
  // Day 50 · Area Manager (sample content)
  'AM-01': {what:'Checkout is rated lower in 4 of your 30 stores than anywhere else in the area: between 7.6 and 7.8 out of 10, against an area average of 8.6. Each of the 4 has more than 100 responses, so the gap is not down to a few unhappy shoppers. Store 07 in Riyadh is furthest behind, a full point below the area.',
    table:'Checkout score by store', actions:[{who:'',t:'Compare till cover at peak hours with your best checkout stores',d:'Start with Store 07, a full point behind the area.',cta:'plan'},{who:'Store Managers',t:'Show each manager their store against the area',d:'Each of the 4 sees their checkout score next to the area average.',cta:'share'}]},
  'AM-02': {what:'Comments about waiting for a fitting room have grown every week for 4 weeks in 5 stores, to two or three times the level of the 12 weeks before. The other 25 stores show no change, so this is about these stores rather than the season. Store 03 in Riyadh has the most, 21 mentions in 4 weeks.',
    table:'Fitting-room wait mentions by store', actions:[{who:'',t:'Check fitting-room staffing in these 5 stores',d:'Compare the rota with the days and times the comments were left.',cta:'plan'}]},
  'AM-03': {what:'In 18 of your 30 stores, fitting-room cleanliness is the part of the visit that moves most closely with overall satisfaction, and in 7 more it is second. Only 5 stores have it outside their top 3. Because it shows up almost everywhere, one area standard is likely to help more than store-by-store fixes.',
    table:'Where cleanliness ranks, by store', actions:[{who:'',t:'Make a fitting-room reset part of the area shift standard',d:'Then check whether cleanliness scores move in the next update.',cta:'plan'}]},
  'AM-04': {what:'RT ATYAF MALL and Stores 05, 09, 14 and 28 have each scored above 9.5 out of 10 every week since the start of September, the highest in the area. Four weeks in a row makes a one-off good week unlikely.',
    table:'Overall score, week of 21 Sep', actions:[{who:'Store Managers',t:'Ask these 5 managers what they do differently',d:'Use the next area call, and pass it on to the stores below the area average.',cta:'share'}]},
  'AM-05': {what:'Parking had not come up in comments for 12 weeks. In the last 3 weeks it came up 14 times, all at stores inside malls: Stores 03, 14 and 21. The numbers are small so far, but a new topic appearing in 3 stores at once is worth a check.',
    table:'Parking mentions, last 3 weeks', actions:[{who:'',t:'Ask the mall operators whether parking changed',d:'For example roadworks or new paid parking in the last 3 weeks.',cta:'plan'}]},
  'AM-06': {what:'In 7 stores, staff helpfulness is rated about 0.6 lower at weekends than on weekdays, for example 9.2 on weekdays and 8.4 at weekends in Store 02. Across the other stores the gap is only 0.1. Weekday scores in these 7 stores are normal, so weekend staffing is the place to look.',
    table:'Staff helpfulness, weekday vs weekend', actions:[{who:'',t:'Compare weekend and weekday staffing in these 7 stores',d:'Look at how many staff are on the floor at peak weekend hours.',cta:'plan'}]},
  'AM-07': {what:'On 14 and 15 September, payment-failure complaints jumped in 6 stores at once, 51 mentions between them in two days. Because the spike hit 6 stores on the same 2 days, it points to one shared cause, such as the payment provider, rather than a problem in each store. Mentions went back to normal afterwards, so it is no longer significant.',
    table:'Payment-failure mentions on 14–15 Sep', actions:[{who:'Central Operations',t:'Ask IT or the payment provider about an outage on 14–15 Sep',d:'One answer covers all 6 stores.',cta:'share'}]},
  'AM-08': {what:'Comments saying an offer was unclear at the till appear in 22 of your 30 stores: every week in 9 of them and most weeks in another 13. The rate is similar from store to store, which suggests the offers themselves are confusing rather than how each store explains them.',
    table:'How often stores see offer-clarity comments', actions:[{who:'Central Operations',t:'Ask for clearer offer signage across the network',d:'A pattern this wide needs one central fix.',cta:'share'}]},
  'AM-09': {what:'9 stores received at least 30% fewer survey responses in the last 4 weeks than in the 4 weeks before, for example 41 instead of 77 at Store 08. This often means the invitation is not reaching shoppers, such as the QR code on receipts not printing. Fewer responses also make these stores\' other results less reliable.',
    table:'Responses by store', actions:[{who:'',t:'Check that the receipt QR code prints in these 9 stores',d:'Start with Store 08, which lost almost half its responses.',cta:'plan'}]},
  'AM-10': {what:'About 11% of comments mention high prices this period, against 12% in the period before, and the share is similar in most stores. Nothing points to one store or one week, so this is a steady background view of pricing rather than something new.',
    table:'Share of comments about price', actions:[{who:'Central Operations',t:'Share it with the pricing team for awareness',d:'Prices are set centrally, so there is little for stores to change.',cta:'share'}]},
  'AM-11': {what:'Between June and mid-September, loyalty members rated their visit 9.4 out of 10 against 8.9 for other shoppers, and the gap appeared in 24 of 30 stores. In the latest update the gap is no longer large enough to be significant, so it may be narrowing.',
    table:'Overall score by group', actions:[{who:'',t:'Look at what members get at the till that others do not',d:'If it is the offer itself, consider showing it to every shopper.',cta:'plan'}]},
  'AM-12': {what:'In the week of 30 August, 18 comments said the store was too hot, 11 at Store 17 and 7 at Store 24, against about 1 a month before. The comments stopped the next week, so it is no longer significant, but it is worth confirming the air conditioning was fixed.',
    table:'Comments about heat, week of 30 Aug', actions:[{who:'Central Operations',t:'Check with facilities that the air conditioning was repaired',d:'At Stores 17 and 24.',cta:'share'}]},
  'AM-13': {what:'After cleanliness, finding your size is the part of the visit that moves most with satisfaction in 11 stores. 8 of these 11 are small stores, which suggests smaller stores run out of sizes more often.',
    table:'Stores where size availability ranks second', actions:[{who:'Merchandising',t:'Review size allocation for smaller stores',d:'8 of the 11 stores are small.',cta:'share'}]},
  'AM-14': {what:'Shoppers who came in to return an online order rated the visit 0.7 lower than other shoppers, 8.4 against 9.1, between June and August. In the latest update too few of these visits were rated to confirm it again.',
    table:'Overall score by visit type', actions:[{who:'',t:'Time how long an online return takes at the till',d:'Compare it with a normal purchase.',cta:'plan'}]},
  'AM-15': {what:'In all 30 stores, friendly and helpful staff is the reason promoters give most often for their score. It ranges from 18% of promoter comments in the lowest store to 46% in the highest, with 31% on average.',
    table:'Promoter comments that mention staff', actions:[{who:'Store Managers',t:'Recognise it on the next area call',d:'Ask the stores at the top of the range what they do.',cta:'share'}]},
  // other surveys (sample content)
  'AL-03': {what:'Late or missed delivery windows came up in detractor comments in every one of the last 12 weeks, more than any other reason detractors give. Because it appears every week, it is a standing delivery problem rather than a one-off.',
    table:'Weeks with the theme', actions:[{who:'Central Operations',t:'Share the delivery comments with whoever owns the delivery partner',d:'Every week of the period has them.',cta:'share'}]},
  'AL-04': {what:'Comments about refunds taking too long appeared in the last 3 weeks. They were not seen at all in the 6 months before, so this is new.',
    table:'When the theme appeared', actions:[{who:'',t:'Check refund processing times with finance',d:'Compare the last 3 weeks with the months before.',cta:'plan'}]}
});
// sample insights keep their store-level table as the evidence
Object.keys(V10_DRILL).forEach(k=>{ const c = V10_DRILL[k]; if(c.table){ c.keepChart = /^The evidence$/i; c.chartTitle = c.table; c.stats = c.stats || []; } });
const _v10Stats = v10Stats;
v10Stats = function(stats){ return stats && stats.length ? _v10Stats(stats) : ''; };
const _v10Facts = v10Facts;
v10Facts = function(id){ const c = V10_DRILL[id]; if(c && !c.compares){ const am = (typeof V9_AM_BY!=='undefined' && V9_AM_BY[id]) || (typeof v3FindScopeCard==='function' && v3FindScopeCard(id)); if(am) c.compares = am.basis; } return _v10Facts(id); };

/* other surveys: the same drill-down as the feed */
const V10_SCOPE_IDS = ['AL-01','AL-02','AL-03','AL-04','AR-01','AR-02','AR-03','AR-04'];
const _v10InCur = inCurrentEdition;
inCurrentEdition = function(id){ return V10_SCOPE_IDS.includes(id) ? true : _v10InCur(id); };
v3OpenScopeCard = function(cid){
  const c = v3FindScopeCard(cid); if(!c) return;
  const list = document.getElementById('v3-scope-list'), panel = document.getElementById('v3-scope-panel');
  INSIGHT_META[cid] = INSIGHT_META[cid] || {title:c.title, summary:c.sum, category:c.type, tag:c.type.split(' · ')[1]||'', type:'recurring', ctx:c.basis};
  PRIORITY[cid] = PRIORITY[cid] || {level:c.prio, reason:''};
  COPILOT_QA[cid] = COPILOT_QA[cid] || [['Has this happened before?','Not in this survey\'s earlier updates. This is the first time it has come up.','Earlier updates of this survey']];
  list.style.maxWidth = '460px'; list.style.flex = '0 0 460px'; list.style.margin = '0';
  list.querySelectorAll('.v3-card').forEach(x=>x.classList.toggle('active', x.dataset.v3Card===cid));
  list.querySelectorAll('.ic-sum,.ic-foot,.ic-stat').forEach(x=>x.style.display='none');
  const a = {id:cid, kind:c.type, title:c.title, sum:c.sum, basis:c.basis, prio:c.prio, type:'recurring', th:c.tableHead, rows:c.table,
    review:'review', steps:c.steps.map(s=>[s[0].replace(/\.$/,''), s[1], s[2]==='central' ? 'share:Central Operations' : s[2]==='share' ? 'share:Area Managers' : 'plan'])};
  panel.innerHTML = v6Shape(v9AMPanelRaw(a).replace(/closeInvestigatePanel\(true\)/g,'v3CloseScopeCard()'), cid, {full:false});
  panel.classList.remove('hidden'); panel.scrollTop = 0;
};
{ const g = V9_GROUPS.find(x=>x.name==='Merchandising'); if(g) g.on = true; }
// the old sample-data banners stay off everywhere, including shared views
document.head.insertAdjacentHTML('beforeend','<style>.illus-banner{display:none!important}</style>');
// other surveys' lists: no Illustrative tag, no urgency sections (same as the feed)
const _v10ScopeCard = v3ScopeCardHTML;
v3ScopeCardHTML = function(c){ return _v10ScopeCard(c).replace('<span class="illus" style="display:inline-flex!important">Illustrative</span>',''); };
document.head.insertAdjacentHTML('beforeend','<style>#v3-scope-list .v3-sec{display:none!important}</style>');
