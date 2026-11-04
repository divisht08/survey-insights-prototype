/* ═══ v24 (4 Nov) — from the review with Pradeep on 3 Nov (notes: claude/pradeep-call-2026-11-03.md):
   1. Copilot on every page again: the header "Ask Copilot" opens beside the page and answers about it;
      "Summarise this week's insights" replaces a summary block at the top. No separate Ask page.
   2. Cards: one clear, named metric each; plain wording; no mini charts.
   3. Customise my feed: 2 steps. Step 1 shows the admin's setup (scope read-only), lets the user edit
      their focus, pick topics to show first and topics not to show. Step 2 is delivery. No custom fields
      (they move to the admin setup). "Configure" is renamed "Customise".
   4. Day 0 for a store manager: a welcome pop-up, then a short walk-through of the page. ═══ */

/* ── 1. Copilot on every page ── */
document.head.insertAdjacentHTML('beforeend', '<style>#v3-ask{display:inline-flex!important}#v21-ask{display:none!important}</style>');
V3_STARTERS.insights = ['Summarise this week’s insights','What needs my action today?','What are customers saying about checkout?'];
const V24_METRIC = {
  'INS-05':'12× the usual weekly mentions', 'INS-04':'cleanliness score down 7.5%', 'AL-03':'17% more complaints than the 12 weeks before',
  'AL-04':'new in the last 3 weeks', 'INS-02':'a few comments, both periods', 'INS-03':'a few comments this period', 'INS-06':'9.1 out of 10, up 0.3', 'INS-01':'9.63 out of 10, up 0.40'
};
function v24Summary(){
  const cs = v3FeedCards(), t = c=>v3esc(v3T(c)), m = c=>V24_METRIC[c.dataset.id] ? ` (${V24_METRIC[c.dataset.id]})` : '';
  const hi = cs.filter(c=>c.dataset.priority==='high'), pos = cs.filter(c=>c.dataset.priority==='pos');
  const fresh = cs.filter(c=>/emerging/i.test(c.dataset.type||'') || c.dataset.id==='AL-04');
  return `<p><b>This week: ${cs.length} insights, ${hi.length} need your attention.</b></p>
    ${hi.length ? `<ul>${hi.map(c=>`<li><b>${t(c)}</b>${m(c)}</li>`).join('')}</ul>` : ''}
    ${fresh.length ? `<p style="margin-top:8px"><b>New:</b> ${fresh.map(t).join('; ')}.</p>` : ''}
    ${pos.length ? `<p style="margin-top:6px"><b>Going well:</b> ${pos.map(t).join('; ')}.</p>` : ''}
    <p style="margin-top:6px">Start with the first one: it hit checkout on two days, and the cause is likely outside the store.</p>`;
}
const _v24Answer = v3PageAnswer;
v3PageAnswer = function(q){
  const s = String(q||'');
  if(/summar/i.test(s) && /week|insight|this page|update/i.test(s) && v3PageCtx()==='insights') return v24Summary();
  if(/saying|customers say|complain|checkout|payment|refund|deliver|staff|price|clean|fitting|offer/i.test(s) && typeof v17AnswerFor==='function'){
    const a = v17AnswerFor(s); if(a && a.a) return a.a;
  }
  return _v24Answer.apply(this, arguments);
};

/* ── 2. Cards: one named metric, plain wording, no charts ── */
const V24_CARDS = {
  'INS-05': {sum:'<b>11 shoppers</b> said card or wallet payments <b>failed at the till</b> on 14–15 Sep. Usually about 1 shopper a week mentions this.',
    stat:'<p class="ic-num" style="color:#c5221f">12×</p><p class="ic-unit">the usual weekly mentions</p>'},
  'INS-04': {sum:'<b>Cleanliness</b> is the part of the visit most linked with overall satisfaction, and it is the <b>lowest-rated</b> of the 5.',
    stat:'<p class="ic-num" style="color:#c5221f">▼ 7.5%</p><p class="ic-unit">cleanliness score, now 7.4 out of 10</p>'},
  'AL-03': {sum:'Late or missed deliveries were the top complaint from unhappy online shoppers in <b>every one of the last 12 weeks</b>.',
    stat:'<p class="ic-num" style="color:#c5221f">▲ 17%</p><p class="ic-unit">more complaints than the 12 weeks before</p>'}
};
function v24Cards(){
  Object.entries(V24_CARDS).forEach(([id,c])=>{
    document.querySelectorAll(`.insight-card[data-id="${id}"]`).forEach(card=>{
      card.classList.remove('v7-nostat');
      const sum = card.querySelector('[data-el="summary"]'), st = card.querySelector('[data-el="stat"]');
      if(sum && sum.innerHTML!==c.sum) sum.innerHTML = c.sum;
      if(st && st.innerHTML!==c.stat){ st.innerHTML = c.stat; st.classList.add('v21-stat'); }
    });
  });
}
document.head.insertAdjacentHTML('beforeend', '<style>.insight-card .ic-stat .ic-bars,.insight-card .ic-stat svg,.fol-card .ic-stat .ic-bars,.fol-card .ic-stat svg{display:none!important}.v21-stat .ic-unit{white-space:normal!important;max-width:170px;margin-left:auto}</style>');
// the drill-down says what each number is
V21_HERO['INS-05'].kpis = [['Mentions vs a usual week','12×','12 that week, against ~1 in a usual week','bad'],
  ['Overall satisfaction, 14–15 Sep','▼ 1.7 points','7.9 out of 10, against ~9.6 on other days','bad'],
  ['Shoppers affected','11','They rated the visit 4.2 out of 10 on average','']];
V21_HERO['INS-04'].kpis[1] = ['Link with overall satisfaction','31%','Explains 31% of the variation, more than any other factor',''];
V21_HERO['AL-03'].kpis[1] = ['Share of complaints from unhappy shoppers','34%','The most common reason they give',''];

/* ── 3. Customise my feed: 2 steps ── */
V23_STEPS.length = 0; V23_STEPS.push([1,'Your focus'],[2,'How you get it']);
V23_STARTERS.length = 0; V23_STARTERS.push('Weekend staffing matters most to me','I don’t want pricing insights','Tell me about anything new first');
const V24_NEG = /\b(don['’]?t|do not|no|not interested|stop|hide|less|skip|without)\b/i;
v23Send = function(text){
  const t = String(text||'').trim(); if(!t) return;
  v23.msgs.push({r:'me', t:v23E(t)});
  v23.hidden = v23.hidden || [];
  const found = V23_HINTS.filter(([re])=>re.test(t)).map(h=>h[1]).filter(x=>x!=='New issues first' || !V24_NEG.test(t));
  let reply;
  if(V24_NEG.test(t) && found.length){
    found.forEach(x=>{ if(v23.hidden.indexOf(x)<0) v23.hidden.push(x); const i = v23.topics.indexOf(x); if(i>-1) v23.topics.splice(i,1); });
    reply = `OK. I won't show you insights about <b>${found.map(v23E).join('</b> or <b>')}</b>. You can bring ${found.length>1?'them':'it'} back below at any time.`;
  } else if(found.length){
    found.forEach(x=>{ if(v23.topics.indexOf(x)<0) v23.topics.push(x); const i = v23.hidden.indexOf(x); if(i>-1) v23.hidden.splice(i,1); });
    reply = `Got it. I'll show insights about <b>${found.map(v23E).join('</b> and <b>')}</b> first.`;
  } else reply = `Noted. I'll keep that in mind when I write your insights.`;
  v23.msgs.push({r:'ai', t:reply});
  v23.note = (v23.note ? v23.note + ' ' : '') + t;
  v23Render();
};
function v24Toggle(list, other, v){
  v23[list] = v23[list] || []; v23[other] = v23[other] || [];
  const a = v23[list], i = a.indexOf(v); if(i<0){ a.push(v); const j = v23[other].indexOf(v); if(j>-1) v23[other].splice(j,1); } else a.splice(i,1);
  v23Render();
}
function v24Side(){
  const a = v23Admin(), focus = v23.focus!=null && v23.focus!==a.resp;
  const list = (arr, none)=>arr && arr.length ? arr.map(v23E).join(', ') : none;
  return `<aside class="v15-aside"><div class="v15-card v15-pad v24-sum"><h3>Your feed</h3>
    <dl><dt>Set up by your admin</dt><dd>${v23E(a.name)} · ${v23Surveys().length} surveys</dd>
      <dt>Your focus</dt><dd>${focus ? 'Edited by you' : 'As your admin set it'}${v23.note ? ' · plus your note' : ''}</dd>
      <dt>Shown first</dt><dd>${list(v23.topics,'Nothing chosen')}</dd>
      <dt>Not shown</dt><dd>${list(v23.hidden,'Nothing hidden')}</dd>
      <dt>Delivery</dt><dd>${v23.freq==='daily'?'Daily':'Weekly on '+v23.day} at ${v23.time} · feed${v23.email?', email':''}${v23.slack?', Slack':''}${v23.teams?', Teams':''}</dd></dl>
    <p class="v15-note">Changes apply from your next update.</p></div></aside>`;
}
v23Step1 = function(){
  const a = v23Admin(); v23.hidden = v23.hidden || [];
  if(v23.focus==null) v23.focus = a.resp;
  const msgs = v23.msgs.map(m=>`<div class="v23-m ${m.r}">${m.r==='ai'?'<span class="v23-ai">✦</span>':''}<p>${m.t}</p></div>`).join('');
  const topics = V23_TOPICS.concat(v23.topics.concat(v23.hidden).filter(t=>V23_TOPICS.indexOf(t)<0));
  const chip = (list, other, t, mark)=>`<button class="v15-chip${v23[list].indexOf(t)>-1?' on'+(list==='hidden'?' v24-off':''):''}" onclick="v24Toggle('${list}','${other}','${v23E(t).replace(/'/g,'&#39;')}')">${v23[list].indexOf(t)>-1?mark+' ':''}${v23E(t)}</button>`;
  return `<div class="v15-cols"><div class="v15-main">
    <div class="v15-card v15-pad"><div class="v15-flex"><h3>Set up by your admin</h3><span class="v23-lock">${V23_LOCK} Surveys and questions can't be changed here</span></div>
      <p><b>${v23E(a.name)}</b> · ${v23E(a.role)}</p>
      <p class="v15-note">From ${v23Surveys().map(v23E).join(', ')} · all questions</p>
      <label class="v15-f" style="margin-top:10px"><span>Your focus ${v23.focus!==a.resp ? `<a class="v24-reset" onclick="v23.focus=null;v23Render()">Reset to your admin's</a>` : ''}</span>
        <textarea rows="3" oninput="v23.focus=this.value" onblur="v23Render()">${v23E(v23.focus)}</textarea></label></div>
    <div class="v15-card v15-pad"><h3>Tell Copilot what matters to you</h3>
      <div class="v23-chat">${msgs}</div>
      <div class="v23-starters">${V23_STARTERS.map(s=>`<button onclick="v23Send(this.textContent)">${v23E(s)}</button>`).join('')}</div>
      <div class="v23-in"><input id="v23-in" placeholder="For example: weekends are my busiest days" onkeydown="if(event.key==='Enter')v23Send(this.value)"><button class="v14-b pri" onclick="v23Send(document.getElementById('v23-in').value)">Send</button></div></div>
    <div class="v15-card v15-pad"><h3>Topics</h3><p class="v15-note">Topics Copilot found in your customers' comments.</p>
      <p class="v24-lbl">Show first</p><div class="v15-chips">${topics.map(t=>chip('topics','hidden',t,'✓')).join('')}</div>
      <p class="v24-lbl">Don't show</p><div class="v15-chips">${topics.map(t=>chip('hidden','topics',t,'⊘')).join('')}</div></div></div>
    ${v24Side()}</div>`;
};
v23Step2 = function(){
  const html = v23Step3();
  const t = document.createElement('template'); t.innerHTML = html;
  const rv = t.content.querySelector('.v15-main > .v15-card:last-child'); if(rv && rv.querySelector('.v15-rv')) rv.remove();
  const aside = t.content.querySelector('.v15-aside'); if(aside) aside.outerHTML = v24Side();
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};
v23Render = function(){
  const l = document.getElementById('v23-layer'); if(!l || !v23) return;
  const st = Math.min(v23.step, 2);
  const body = st===1 ? v23Step1() : v23Step2();
  const back = st===1 ? `<button class="v14-b" onclick="v23Close()">Cancel</button>` : `<button class="v14-b" onclick="v23Step(1)">Back</button>`;
  const next = st<2 ? `<button class="v14-b pri" onclick="v23Step(2)">Continue</button>` : `<button class="v14-b pri" data-v23-save onclick="v23Save()">Save</button>`;
  l.innerHTML = `<div class="v23-page"><div class="v15-wrap">
      <div class="v15-hd"><div><p class="v15-crumb"><a onclick="v23Close()">Survey Insights</a> › Customise</p><h1>Customise my feed</h1>
        <p class="v15-sub">Your admin set up your insights. Change what matters to you.</p></div><button class="v23-x" onclick="v23Close()" title="Close">✕</button></div>
      <div class="v15-steps">${V23_STEPS.map(([n,tt])=>`<button class="${st===n?'on':''}${st>n?' done':''}" onclick="v23Step(${n})"><span>${st>n?'✓':n}</span>${tt}</button>`).join('')}</div>
      ${body}</div></div>
    <div class="v15-bar v23-bar">${back}<span>${next}</span></div>`;
  const chat = l.querySelector('.v23-chat'); if(chat) chat.scrollTop = chat.scrollHeight;
};
v23Line = function(){
  const bar = document.getElementById('edition-bar'); if(!bar) return;
  let l = document.getElementById('v23-line');
  const s = v23Saved;
  if(!s || (!s.topics.length && !(s.hidden||[]).length && !s.note && (s.focus==null || s.focus===v23Admin().resp))){ if(l) l.remove(); return; }
  const parts = [];
  if(s.topics.length) parts.push(`Showing first: ${s.topics.map(v23E).join(', ')}`);
  if((s.hidden||[]).length) parts.push(`Not shown: ${s.hidden.map(v23E).join(', ')}`);
  if(!parts.length) parts.push('Your focus is applied');
  if(!l){ bar.insertAdjacentHTML('afterend', `<p id="v23-line" class="v23-line"></p>`); l = document.getElementById('v23-line'); }
  l.innerHTML = `${parts.join(' · ')} · from your next update <a onclick="v23Open()">Edit</a>`;
};
// the menu item and the admin's note say what users can now change
(function(){ const b = document.getElementById('open-configure'), t = b && b.querySelector('.sn-t'); if(t) t.textContent = 'Customise'; else if(b){ [...b.childNodes].forEach(n=>{ if(n.nodeType===3 && /Configure/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('Configure','Customise'); }); } })();
if(typeof v15Step1==='function'){
  const _v24S1 = v15Step1;
  v15Step1 = function(){ return _v24S1.apply(this, arguments).replace(/Each person can add a line about their own goals on top of this\. They can't change the surveys or questions\./, 'Each person can change their own focus, choose topics to see first or not at all, and pick how they get insights. They can\'t change the surveys or questions.'); };
}

/* ── 4. Day 0: welcome pop-up, then a walk-through ── */
const V24_TOUR = [
  ['#card-grid .insight-card','Your insights','Each card is one finding from your surveys, with the number that changed. Newest update first.'],
  ['#card-grid .insight-card .btn-pri','Open an insight','See what happened, where it happened, what customers said and what to do next.'],
  ['#v3-ask','Ask Copilot','Ask anything about the page you’re on, for example “Summarise this week’s insights”.'],
  ['#seg-followed','Followed','Follow an insight to keep tracking it in later updates.'],
  ['#seg-shared','Shared','Insights colleagues sent you, and ones you shared.'],
  ['#open-configure','Customise','Change your focus and how you get insights, any time.']
];
let v24TourI = -1;
function v24Welcome(){
  const a = v23Admin(), pick = [];
  let m = document.getElementById('v24-welcome');
  if(!m){ m = document.createElement('div'); m.id = 'v24-welcome'; document.body.appendChild(m); }
  window.v24Pick = pick;
  m.innerHTML = `<div class="v24-pop"><h2>Welcome to your insights feed</h2>
    <p>Each week, Copilot reads your customers’ survey responses and shows you what changed and what needs your attention.</p>
    <p>Open any insight to see why it happened, and ask Copilot about anything you see.</p>
    <div class="v24-acts"><button class="v14-b" onclick="v24WelcomeDone(true)">Customise my feed</button><button class="v14-b pri" onclick="v24WelcomeDone(false)">Show my feed</button></div></div>`;
  m.classList.add('show');
}
function v24WelcomeDone(more){
  const m = document.getElementById('v24-welcome'); if(m) m.classList.remove('show');
  const pick = window.v24Pick || [];
  if(pick.length){ const s = v23Saved ? v23Saved : v23Fresh(); s.topics = Array.from(new Set((s.topics||[]).concat(pick))); s.hidden = s.hidden || []; v23Saved = s; v23Line(); }
  if(more) v23Open(); else v24Tour(0);
}
function v24Tour(i){
  v24TourI = i;
  let o = document.getElementById('v24-tour');
  if(i<0 || i>=V24_TOUR.length){ if(o) o.remove(); v24TourI = -1; return; }
  const [sel, title, text] = V24_TOUR[i];
  const el = [...document.querySelectorAll(sel)].find(e=>e.offsetParent!==null);
  if(!el){ return v24Tour(i+1); }
  el.scrollIntoView({block:'center'});
  const r = el.getBoundingClientRect(), pad = 6;
  if(!o){ o = document.createElement('div'); o.id = 'v24-tour'; document.body.appendChild(o); }
  const below = r.bottom + 200 < innerHeight, left = Math.max(16, Math.min(r.left, innerWidth - 336));
  o.innerHTML = `<div class="v24-hole" style="top:${r.top-pad}px;left:${r.left-pad}px;width:${r.width+pad*2}px;height:${r.height+pad*2}px"></div>
    <div class="v24-tip" style="left:${left}px;${below ? `top:${r.bottom+14}px` : `top:${Math.max(16, r.top-180)}px`}">
      <p class="v24-k">${i+1} of ${V24_TOUR.length}</p><b>${title}</b><p>${text}</p>
      <div class="v24-acts"><button class="v24-skip" onclick="v24Tour(-1)">Skip</button>${i>0?`<button class="v14-b" onclick="v24Tour(${i-1})">Back</button>`:''}<button class="v14-b pri" onclick="v24Tour(${i+1})">${i===V24_TOUR.length-1?'Done':'Next'}</button></div></div>`;
}
addEventListener('resize', ()=>{ if(v24TourI>-1) v24Tour(v24TourI); });
const _v24Journey = setJourney;
setJourney = function(state){
  const r = _v24Journey.apply(this, arguments);
  if(state==='first-ready'){ if(typeof closeInvestigatePanel==='function') closeInvestigatePanel(true); setTimeout(v24Welcome, 250); }
  return r;
};
// a way for reviewers to replay it
(function(){ const bar = document.getElementById('open-email-journey'); if(bar && !document.getElementById('v24-tour-btn')) bar.insertAdjacentHTML('beforebegin', `<button class="journey-btn" id="v24-tour-btn" onclick="setJourney('first-ready')">★ Store manager · first visit</button>`); })();

const _v24Vis = applyFeedVisibility;
applyFeedVisibility = function(){ const r = _v24Vis.apply(this, arguments); v24Cards(); return r; };
v24Cards();

/* matcher and opening line */
V23_HINTS.forEach(h=>{ if(h[1]==='Pricing') h[0] = /pric|expensive|cost/i; if(h[1]==='Weekend trading') h[1] = 'Weekends'; });
const _v24Open = v23Open;
v23Open = function(){
  _v24Open.apply(this, arguments);
  if(v23 && v23.msgs.length && v23.msgs[0].r==='ai' && /Your admin set you up/.test(v23.msgs[0].t)){
    v23.msgs[0].t = 'Is there anything you want to see more of, or less of? For example a topic you’re working on, or one that isn’t yours to fix.';
    v23Render();
  }
};
