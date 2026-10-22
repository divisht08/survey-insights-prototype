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
    // no staff names in quotes
    const tw = document.createTreeWalker(voice, NodeFilter.SHOW_TEXT); let tn;
    while((tn = tw.nextNode())) tn.nodeValue = tn.nodeValue.replace('أستاذ زياد','[اسم الموظف]').replace(/Mr\. Ziad/g,'[Staff member]');
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
