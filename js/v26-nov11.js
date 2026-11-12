/* ═══ v26 (12 Nov) — Pradeep's feedback of 11 Nov (CFM Insights Reimagined doc), as agreed with Dipit:
   1/3/4  Walk-through: no "update" in step 1, clearer Customise step; welcome pop-up has one button.
   5      Less "update" language: the "Updated … next update" line goes; next update shows on hover
          over "Latest update"; friendlier first-day banner.
   6/7    Cards and drill-down: three pills (topic, coloured like the card edge · type · survey).
   8      Drill-down facts line replaced by one comparison line.
   9      The repeated number boxes under the Evidence chart become a plain-language summary.
   10     Smaller Share pop-up: Groups and People dropdowns, quick picks, channels.
   2/11-14 Persona app: no "Customer Feedback Management" tab; labelled app menu with placeholders;
          Insights menu with back, My insights, Followed, Shared with me, Shared by me, Archived,
          Customise at the bottom; My email removed. Insights shared with me are tagged in the feed. ═══ */

const v26E = s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const V26_IC = {
  survey:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6"/></svg>',
  back:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>',
  home:'<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  bell:'<path d="M6 16V11a6 6 0 1112 0v5l2 2H4zM10 20a2 2 0 004 0"/>',
  chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  ticket:'<path d="M4 7h16v4a2 2 0 000 4v4H4v-4a2 2 0 000-4z"/>',
  check:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 12l3 3 5-6"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.5-2.5 2-2.5 3.5M12 17h.01"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
  out:'<path d="M4 12h12M12 6l6 6-6 6"/>', in:'<path d="M20 12H8M12 6l-6 6 6 6"/>', box:'<path d="M3 7h18v13H3zM3 7l2-4h14l2 4M9 12h6"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>', sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'
};
const v26Svg = (k,s)=>`<svg width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${V26_IC[k]}</svg>`;

/* ── 1/3/4 walk-through and welcome ── */
V24_TOUR.length = 0;
V24_TOUR.push(
  ['#card-grid .insight-card','Your insights','Each card is one finding from your customers’ survey responses, with the number that changed. Newest first.'],
  ['#card-grid .insight-card .btn-pri','Open an insight','See what happened, where it happened, what customers said and what to do next.'],
  ['#v3-ask','Ask Copilot','Ask anything about the page you’re on, for example “Summarise this week’s insights”.'],
  ['#seg-followed','Followed insights','Follow an insight to keep an eye on how it changes over the coming weeks.'],
  ['#seg-shared','Shared with me','Insights colleagues sent you. Ones you send are in “Shared by me”.'],
  ['#open-configure','Customise your feed','Choose which topics to see first or not at all, and how you get your insights: here, by email, Slack or Teams.']
);
v24Welcome = function(){
  let m = document.getElementById('v24-welcome');
  if(!m){ m = document.createElement('div'); m.id = 'v24-welcome'; document.body.appendChild(m); }
  window.v24Pick = [];
  m.innerHTML = `<div class="v24-pop"><h2>Welcome to your insights</h2>
    <p>Each week, Copilot reads your customers’ survey responses and shows you what changed and what needs your attention.</p>
    <p>Open any insight to see why it happened, and ask Copilot about anything you see.</p>
    <div class="v24-acts"><button class="v14-b pri" onclick="v24WelcomeDone(false)">Show my feed</button></div></div>`;
  m.classList.add('show');
};

/* ── 5 less "update" wording ── */
function v26Wording(){
  const fr = document.querySelector('#first-ready-banner p');
  if(fr && !fr.dataset.v26){ fr.dataset.v26 = '1';
    fr.innerHTML = `<span class="font-600">Your insights feed is ready.</span> New insights arrive every week. You can <a class="v26-link" onclick="openDrawer('configure')">customise your feed</a> any time.`; }
  document.querySelectorAll('.v7-date .lt').forEach(t=>{ if(!t.dataset.tip){ t.dataset.tip = 'Next insights: Sun 4 Oct'; t.classList.add('v26-tip'); } });
}

/* ── 6/7 pills ── */
const V26_PRIO = {high:'v26-hi', med:'v26-md', low:'v26-lo', pos:'v26-ok'};
function v26Parts(id, card){
  const meta = INSIGHT_META[id] || {}, kt = card && card.querySelector('[data-el="kind-text"]');
  const kind = (kt ? kt.textContent : (meta.category||'')).split(' · ');
  const type = kind[0] || '', topic = kind[1] || meta.tag || '';
  const sk = (card && card.dataset.survey) || (typeof V18_SURVEY_OF!=='undefined' && V18_SURVEY_OF[id]) || 'store';
  const survey = (typeof V3_SCOPES!=='undefined' && V3_SCOPES[sk] && V3_SCOPES[sk].label) || 'Store experience survey';
  const prio = (card && card.dataset.priority) || (PRIORITY[id] && PRIORITY[id].level) || 'low';
  return {type, topic, survey, prio};
}
function v26PillsHTML(id, card, extra){
  const p = v26Parts(id, card), sh = v26SharedFrom(id);
  return `<span class="v26-pills" data-v26-pills="${id}">
    ${p.topic ? `<span class="v26-pill v26-topic ${V26_PRIO[p.prio]||'v26-lo'}"><i></i>${v26E(p.topic)}</span>` : ''}
    ${p.type ? `<span class="v26-pill">${v26E(p.type)}</span>` : ''}
    <span class="v26-pill">${V26_IC.survey}${v26E(p.survey.replace(/ survey$/i,' survey'))}</span>
    ${sh && extra!=='noshare' ? `<span class="v26-pill v26-shared" title="Shared with you">Shared by ${v26E(sh.split(' ')[0])}</span>` : ''}</span>`;
}
function v26SharedFrom(id){
  if(typeof sharedWithMe==='undefined') return '';
  const s = sharedWithMe.find(x=>x.insightId===id && !x.dismissed && !x.external); return s ? s.from : '';
}
function v26Cards(){
  document.querySelectorAll('.insight-card, .fol-card, .shr-card').forEach(card=>{
    const id = card.dataset.id || card.dataset.folId || (card.dataset.shareCard && (sharedWithMe.find(s=>s.id===card.dataset.shareCard)||{}).insightId);
    const row = card.querySelector('.ic-kind'); if(!id || !row) return;
    const p = v26Parts(id, card), sig = [id,p.prio,p.topic,p.type,p.survey,v26SharedFrom(id)].join('|');
    const cur = row.querySelector('[data-v26-pills]');
    if(cur && cur.dataset.sig===sig) return;
    if(cur) cur.remove();
    row.insertAdjacentHTML('beforeend', v26PillsHTML(id, card, card.classList.contains('shr-card') ? 'noshare' : ''));
    row.querySelector('[data-v26-pills]').dataset.sig = sig; row.classList.add('v26-row');
    card.classList.add('v26-card');
  });
}
// drill-down: the same pills, a comparison line, and a plain summary under the chart
const V26_EVID = {
  'INS-01':'Overall satisfaction rose to 9.63 from 9.23, and service satisfaction rose by about the same, to 9.67. Based on 261 responses this period.',
  'INS-05':'11 mentions in two days, against about 1 a week normally. The 11 shoppers who mentioned it rated their visit 4.2 out of 10; the store average is 9.63.',
  'INS-04':'Cleanliness scored 7.4 out of 10, down 0.6. It comes up in 38% of comments from unhappy shoppers, but only 6% from happy ones.',
  'INS-06':'Staff helpfulness scored 9.1, up 0.3. It is the most common reason happy shoppers give (44% of their comments) and rarely a complaint (7%).',
  'INS-02':'Offer clarity came up in both periods, with one clear example in each. There are too few comments to say whether it is changing.',
  'INS-03':'Price comments are negative this period (1 example) but were mostly positive before (2 examples). Too few to measure a change.',
  'FOL-01':'Weekend checkout now scores 8.0 out of 10, up from 7.4 when you followed it.',
  'FOL-02':'The last reliable gap was 1.1 points (20 Sep). Only 18 first-time shoppers responded this week, and 30 are needed to compare.'
};
function v26Drill(){
  ['investigate-panel','followed-panel','shared-panel'].forEach(pid=>{
    const p = document.getElementById(pid); if(!p) return;
    const head = p.querySelector('[data-v6-head]'); if(!head) return;
    const id = head.dataset.v6Head;
    const chips = head.querySelector('.v6-chips');
    if(chips && !chips.querySelector('[data-v26-pills]')){
      chips.querySelectorAll('.v6-chip').forEach(c=>c.style.display='none');
      const card = document.querySelector(`.insight-card[data-id="${id}"]`);
      chips.insertAdjacentHTML('afterbegin', v26PillsHTML(id, card));
    }
    const meta = p.querySelector('.v21-meta');
    if(meta && !p.querySelector('.v26-cmp')){
      const get = k=>{ const s = [...meta.querySelectorAll('span')].find(x=>(x.querySelector('i')||{}).textContent===k); return s ? s.textContent.replace(k,'').trim() : ''; };
      const cmp = get('Compares'), resp = get('Responses');
      const txt = [cmp ? 'Compares ' + cmp : '', resp].filter(Boolean).join(' · ');
      meta.insertAdjacentHTML('beforebegin', txt ? `<p class="v26-cmp">${v26E(txt)}</p>` : '');
      meta.remove();
    }
    const side = p.querySelector('.v22-det'); if(side) side.remove();
    const st = p.querySelector('.v10-stats');
    if(st){ const line = V26_EVID[id]; st.outerHTML = line ? `<p class="v26-sumline">${v26E(line)}</p>` : ''; }
  });
}

/* ── 10 Share pop-up ── */
const V26_GROUPS = [['Store Managers','30 people'],['Area Managers','4 people'],['Central Operations','6 people'],['Merchandising','5 people']];
const V26_PEOPLE = [['Anish','VP, Customer Experience'],['Fatima Al-Rashid','Store Manager — RT SHUWAIKH'],['Omar Hassan','Area Manager — Central Region'],['Khalid Al-Mansour','Country Manager — KSA'],['CX Ops Team','Shared inbox'],['Central team','Central operations']];
const V26_QUICK = ['Anish','Fatima Al-Rashid','Omar Hassan','Store Managers'];
const V26_CH = [['slack','Slack','#store-ops'],['teams','Teams','Store managers › General']];
let v26Sh = null;
openShareModal = function(id){
  currentShareId = id;
  v26Sh = {id, to:[], ch:[], open:'', q:''};
  let m = document.getElementById('v26-share');
  if(!m){ m = document.createElement('div'); m.id = 'v26-share'; document.body.appendChild(m); }
  m.classList.add('show'); v26ShRender();
};
function v26ShClose(){ const m = document.getElementById('v26-share'); if(m){ m.classList.remove('show'); m.innerHTML = ''; } v26Sh = null; }
function v26ShToggle(n){ const a = v26Sh.to, i = a.indexOf(n); if(i<0) a.push(n); else a.splice(i,1); v26ShRender(); }
function v26ShCh(k){ const a = v26Sh.ch, i = a.indexOf(k); if(i<0) a.push(k); else a.splice(i,1); v26ShRender(); }
function v26ShOpen(w){ v26Sh.open = v26Sh.open===w ? '' : w; v26Sh.q = ''; v26ShRender(); }
function v26ShRender(){
  const m = document.getElementById('v26-share'); if(!m || !v26Sh) return;
  const s = v26Sh, title = (INSIGHT_META[s.id]||{}).title || '';
  const list = (rows, kind)=>{
    const q = s.q.toLowerCase(), f = rows.filter(r=>!q || r[0].toLowerCase().includes(q));
    return `<div class="v26-dd-menu">${kind==='people' ? `<input class="v26-dd-q" placeholder="Search people" value="${v26E(s.q)}" oninput="v26Sh.q=this.value;v26ShRender();setTimeout(()=>{const i=document.querySelector('.v26-dd-q');if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length)}},0)">` : ''}
      ${f.map(([n,sub])=>`<label class="v26-dd-opt"><input type="checkbox" ${s.to.indexOf(n)>-1?'checked':''} onchange="v26ShToggle('${v26E(n)}')"><span><b>${v26E(n)}</b><small>${v26E(sub)}</small></span></label>`).join('') || '<p class="v26-dd-none">No matches</p>'}</div>`;
  };
  const noAccess = s.to.indexOf('Fatima Al-Rashid')>-1;
  m.innerHTML = `<div class="v26-sh-box" role="dialog" aria-label="Share insight">
    <div class="v26-sh-hd"><b>Share insight</b><button class="iconbtn" onclick="v26ShClose()" title="Close">✕</button></div>
    <p class="v26-sh-title">${v26E(title)}</p>
    <p class="v26-sh-lbl">Send to</p>
    <div class="v26-dds">
      <div class="v26-dd"><button class="v26-dd-btn${s.open==='groups'?' on':''}" onclick="v26ShOpen('groups')">Groups<span>▾</span></button>${s.open==='groups'?list(V26_GROUPS,'groups'):''}</div>
      <div class="v26-dd"><button class="v26-dd-btn${s.open==='people'?' on':''}" onclick="v26ShOpen('people')">People<span>▾</span></button>${s.open==='people'?list(V26_PEOPLE,'people'):''}</div>
    </div>
    <div class="v26-quick"><span>Quick picks</span>${V26_QUICK.map(n=>`<button class="v26-qp${s.to.indexOf(n)>-1?' on':''}" onclick="v26ShToggle('${v26E(n)}')">${s.to.indexOf(n)>-1?'✓ ':''}${v26E(n)}</button>`).join('')}</div>
    ${s.to.length ? `<div class="v26-to">${s.to.map(n=>`<span class="v26-chip">${v26E(n)}<button onclick="v26ShToggle('${v26E(n)}')" title="Remove">×</button></span>`).join('')}</div>` : ''}
    ${noAccess ? `<p class="v26-warn">Fatima Al-Rashid can’t see RT ATYAF MALL data, so she’ll get the summary only.</p>` : ''}
    <p class="v26-sh-lbl">Or post to a channel</p>
    <div class="v26-quick">${V26_CH.map(([k,l,c])=>`<button class="v26-qp${s.ch.indexOf(k)>-1?' on':''}" onclick="v26ShCh('${k}')">${s.ch.indexOf(k)>-1?'✓ ':''}<b>${l}</b> ${v26E(c)}</button>`).join('')}</div>
    <textarea id="v26-sh-note" rows="2" placeholder="Add a note (optional)"></textarea>
    <div class="v26-sh-ft"><button class="v14-b" onclick="v26ShClose()">Cancel</button><button class="v14-b pri" onclick="v26ShSend()">Share</button></div></div>`;
}
function v26ShSend(){
  const s = v26Sh; if(!s) return;
  const chans = s.ch.map(k=>{ const c = V26_CH.find(x=>x[0]===k); return c[1]+' '+c[2]; });
  const to = s.to.concat(chans);
  if(!to.length){ toast('Choose who to share with'); return; }
  const note = (document.getElementById('v26-sh-note')||{}).value || '';
  if(!insightActivity[s.id]) insightActivity[s.id] = {status:'open', events:[]};
  to.forEach(n=>insightActivity[s.id].events.push({type:'share', by:'You', text:'shared this with '+n, date:'just now'}));
  if(note.trim()) insightActivity[s.id].events.push({type:'comment', by:'You', text:note.trim(), date:'just now'});
  V26_BYME.unshift({id:s.id, to:to.join(', '), date:'just now', note:note.trim()});
  v26ShClose(); toast('Shared with ' + to.join(', '));
  if(typeof refreshInvestigatePanel==='function') try{ refreshInvestigatePanel(s.id); }catch(e){}
  v26Counts();
}

/* ── 11 no "Customer Feedback Management" tab ── */
(function(){
  const t = [...document.querySelectorAll('span')].find(e=>e.textContent==='Customer Feedback Ma...' && !e.closest('#v12-layer'));
  const pill = t && t.parentElement; if(pill){ pill.style.display = 'none'; const plus = pill.nextElementSibling; if(plus && plus.tagName==='BUTTON') plus.style.display = 'none'; }
})();

/* ── 12-14 persona app navigation ── */
const V26_APP = [['home','Home','home'],['insights','Insights','spark'],['alerts','Alerts','bell'],['dashboards','Dashboards','chart'],['cases','Cases','ticket'],['plans','Action plans','check'],['responses','All responses','list']];
const V26_BYME = [
  {id:'INS-05', to:'Omar Hassan', date:'1 day ago', note:'Card payments failed at our tills on 14–15 Sep. Did other stores in the region see this?'},
  {id:'INS-04', to:'Store Managers', date:'3 days ago', note:'Fitting rooms are our weak spot. Sharing in case it helps.'}
];
function v26BuildNav(){
  const sub = document.getElementById('si-subnav'); if(!sub || document.getElementById('v26-menu')) return;
  const rail = document.getElementById('rail-insights'); if(rail && rail.parentElement) rail.parentElement.classList.add('v26-hide');
  // the app menu
  sub.insertAdjacentHTML('beforebegin', `<nav id="v26-menu" class="v26-nav" aria-label="Menu" style="display:none">
    <div class="v26-brand"><span>${v26Svg('spark',18)}</span><div><b>RT ATYAF MALL</b><small>Store manager</small></div></div>
    ${V26_APP.map(([k,l,ic])=>`<button class="v26-ni" data-v26-app="${k}" onclick="v26App('${k}')">${v26Svg(ic)}<span>${l}</span>${k==='insights'?'<em id="v26-ins-n"></em>':''}</button>`).join('')}
    <div class="v26-foot"><button class="v26-ni" onclick="v26App('help')">${v26Svg('help')}<span>Help & tutorials</span></button>
      <button class="v26-ni" data-v26-app="settings" onclick="v26App('settings')">${v26Svg('gear')}<span>Settings</span></button>
      <button class="v26-ni" data-v26-app="profile" onclick="v26App('profile')"><i class="v26-av">SM</i><span>Store manager</span></button></div></nav>`);
  // the Insights menu
  sub.classList.add('v26-nav','v26-sub');
  const h = sub.querySelector('.sn-h');
  if(h) h.outerHTML = `<button class="v26-back" onclick="v26Menu(true)">${V26_IC.back}<span>Back to menu</span></button>
    <div class="v26-sec"><b>Insights</b><small>From your customers’ survey responses</small></div>`;
  const ren = (id, t, ic)=>{ const b = document.getElementById(id); if(!b) return; const s = b.querySelector('.sn-t'); if(s) s.textContent = t; if(ic && !b.querySelector('svg')) b.insertAdjacentHTML('afterbegin', `<span class="v26-ic">${v26Svg(ic)}</span>`); };
  ren('seg-insights','My insights','spark'); ren('seg-followed','Followed insights','bookmark'); ren('seg-shared','Shared with me','in');
  const sh = document.getElementById('seg-shared');
  if(sh && !document.getElementById('seg-sharedby')) sh.insertAdjacentHTML('afterend', `<button class="sn-i" id="seg-sharedby" onclick="v26SharedBy()"><span class="v26-ic">${v26Svg('out')}</span><span class="sn-t">Shared by me</span><span class="sn-c" id="v26-byme-n"></span></button>`);
  ren('v3-nav-bin','Archived','box');
  ['v9-nav-alerts','open-my-email'].forEach(id=>{ const b = document.getElementById(id); if(b) b.style.display = 'none'; });
  sub.querySelectorAll('hr').forEach(hr=>hr.style.display = 'none');
  const cfg = document.getElementById('open-configure');
  if(cfg){ ren('open-configure','Customise feed','sliders'); cfg.classList.add('v26-bottom'); sub.appendChild(cfg); }
  const bin = document.getElementById('v3-nav-bin'); if(bin) bin.classList.remove('dim');
  v26Counts();
}
function v26Menu(show){
  const a = document.getElementById('v26-menu'), b = document.getElementById('si-subnav');
  if(a) a.style.display = show ? '' : 'none'; if(b) b.style.display = show ? 'none' : '';
  if(show) v26Active(document.getElementById('v26-ph') && document.getElementById('v26-ph').style.display!=='none' ? (document.getElementById('v26-ph').dataset.k) : 'insights');
}
function v26Active(k){ document.querySelectorAll('#v26-menu [data-v26-app]').forEach(b=>b.classList.toggle('active', b.dataset.v26App===k)); }
const V26_PH = {home:['Home','Your start page for the store.'], alerts:['Alerts','Alerts set up for your store.'], dashboards:['Dashboards','Your store’s dashboards.'],
  cases:['Cases','Customer cases from Care Console.'], plans:['Action plans','Action plans you own or follow.'], responses:['All responses','Every survey response for your store.'],
  settings:['Settings','Your account settings.'], profile:['Store manager','Your profile.']};
function v26App(k){
  if(k==='insights'){ v26Ph(null); v26Menu(false); segNav('insights'); return; }
  if(k==='help'){ v26Ph(null); v26Menu(false); segNav('insights'); setTimeout(()=>v24Tour(0), 300); return; }
  v26Ph(k); v26Active(k);
}
function v26Ph(k){
  const main = document.getElementById('main-col'); if(!main) return;
  let ph = document.getElementById('v26-ph');
  if(!ph){ main.insertAdjacentHTML('beforeend', `<div id="v26-ph" style="display:none"></div>`); ph = document.getElementById('v26-ph'); }
  const kids = [...main.children].filter(c=>c!==ph);
  if(!k){ ph.style.display = 'none'; kids.forEach(c=>{ if(c.dataset.v26Hid){ c.style.display = c.dataset.v26Was||''; delete c.dataset.v26Hid; } }); return; }
  kids.forEach(c=>{ if(!c.dataset.v26Hid){ c.dataset.v26Was = c.style.display; c.dataset.v26Hid = '1'; c.style.display = 'none'; } });
  const [t,d] = V26_PH[k] || [k,''];
  ph.dataset.k = k; ph.style.display = '';
  ph.innerHTML = `<div class="v26-ph"><h1>${t}</h1><div class="v26-ph-box"><p><b>${t}</b></p><p>${d}</p><p class="v26-ph-n">A placeholder in this prototype. The work here is on Insights.</p>
    <button class="v14-b" onclick="v26App('insights')">Go to Insights</button></div></div>`;
}
// Shared by me
function v26SharedBy(){
  segNav('shared');
  const vs = document.getElementById('view-shared'); if(vs) vs.classList.add('hidden');
  let v = document.getElementById('view-sharedby');
  if(!v){ vs.insertAdjacentHTML('afterend', `<div id="view-sharedby" class="cx px-6 pb-10"></div>`); v = document.getElementById('view-sharedby'); }
  v.classList.remove('hidden');
  document.querySelectorAll('#si-subnav .sn-i').forEach(b=>b.classList.remove('active'));
  document.getElementById('seg-sharedby').classList.add('active');
  const h1 = document.getElementById('page-h1'); if(h1) h1.textContent = 'Shared by me';
  v.innerHTML = `<p class="v26-lede">Insights you sent to colleagues, with who you sent them to.</p>` + (V26_BYME.length ? V26_BYME.map(s=>{
    const meta = INSIGHT_META[s.id] || {}, card = document.querySelector(`.insight-card[data-id="${s.id}"]`);
    const sum = card && card.querySelector('[data-el="summary"]');
    return `<div class="v26-by spr-card"><div class="v26-by-to">Sent to <b>${v26E(s.to)}</b> · ${v26E(s.date)}</div>
      ${s.note ? `<p class="v26-by-note">“${v26E(s.note)}”</p>` : ''}
      <div class="v26-by-body">${v26PillsHTML(s.id, card, 'noshare')}<p class="ic-title">${v26E(meta.title||'')}</p>${sum ? `<p class="ic-sum">${sum.innerHTML}</p>` : ''}</div>
      <div class="v26-by-ft"><button class="btn-pri" onclick="v26View('${s.id}')">View insight</button></div></div>`; }).join('')
    : `<div class="spr-card p-8 text-center"><p class="text-[13.5px] font-600">You haven’t shared anything yet</p></div>`);
}
function v26View(id){ segNav('insights'); setTimeout(()=>{ try{ openInvestigate(id); }catch(e){} }, 50); }
function v26Counts(){
  const n = document.getElementById('v26-byme-n'); if(n) n.textContent = V26_BYME.length || '';
  const f = document.getElementById('feed-need'), i = document.getElementById('v26-ins-n'); if(i && f) i.textContent = f.textContent || '';
}
// titles follow the menu names
(function(){
  const h1 = document.getElementById('page-h1'); if(!h1) return;
  const map = {'Feed':'My insights','Followed':'Followed insights','Shared':'Shared with me'};
  const fix = ()=>{ const t = h1.textContent.trim(); if(map[t]) h1.textContent = map[t]; };
  new MutationObserver(fix).observe(h1, {childList:true, characterData:true, subtree:true}); fix();
})();
const _v26Seg = segNav;
segNav = function(v){
  const sb = document.getElementById('view-sharedby'); if(sb) sb.classList.add('hidden');
  const b = document.getElementById('seg-sharedby'); if(b) b.classList.remove('active');
  if(document.getElementById('v26-ph') && document.getElementById('v26-ph').style.display!=='none'){ v26Ph(null); v26Menu(false); }
  return _v26Seg.apply(this, arguments);
};

/* ── 2 shared-with-me insights tagged in the feed, with a filter to hide them ── */
let v26HideShared = false;
const _v26Match = v9Match;
v9Match = function(c){ if(v26HideShared && v26SharedFrom(c.dataset.id)) return false; return _v26Match.apply(this, arguments); };
const _v26Filters = v9RenderFilters;
v9RenderFilters = function(){
  _v26Filters.apply(this, arguments);
  const bar = document.getElementById('v9-filters'); if(!bar || bar.querySelector('[data-v26-hs]')) return;
  const anchor = bar.querySelector('[data-v9-pill="activity"]') || bar.lastElementChild;
  if(anchor) anchor.insertAdjacentHTML('afterend', `<button class="v9-pill${v26HideShared?' on':''}" data-v26-hs onclick="v26HideShared=!v26HideShared;v9RenderFilters();applyFeedVisibility()">${v26HideShared?'Shared hidden':'Hide shared'}</button>`);
};

/* the menus fill the visible height, so their bottom items are always on screen */
function v26Fit(){ ['v26-menu','si-subnav'].forEach(id=>{ const n = document.getElementById(id); if(!n || n.style.display==='none') return; const t = Math.max(0, n.getBoundingClientRect().top); n.style.height = (innerHeight - t) + 'px'; }); }
addEventListener('scroll', v26Fit, {passive:true}); addEventListener('resize', v26Fit);
const _v26Menu = v26Menu; v26Menu = function(){ const r = _v26Menu.apply(this, arguments); v26Fit(); return r; };

/* keep everything in place as the page re-renders */
const _v26Vis = applyFeedVisibility;
applyFeedVisibility = function(){ const r = _v26Vis.apply(this, arguments); v26Cards(); v26Wording(); v26Counts(); return r; };
let v26Raf = 0;
new MutationObserver(()=>{ if(v26Raf) return; v26Raf = requestAnimationFrame(()=>{ v26Raf = 0; v26Cards(); v26Drill(); v26Wording(); }); })
  .observe(document.body, {childList:true, subtree:true});
v26BuildNav(); v26Fit(); v26Wording(); v26Cards(); if(typeof v9RenderFilters==='function') v9RenderFilters();

/* the walk-through measures after the menu has resized to the scrolled page */
const _v26Tour = v24Tour;
v24Tour = function(i){
  const st = V24_TOUR[i];
  if(st){ const el = [...document.querySelectorAll(st[0])].find(e=>e.offsetParent!==null); if(el){ el.scrollIntoView({block:'center'}); v26Fit(); } }
  return _v26Tour.apply(this, arguments);
};
