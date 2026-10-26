/* ═══ v14 — Option 2 journey in the real CFM layout: Programs page, survey header with its tab bar
   (Builder · Translations · Distribution · Responses · Analytics · Insights · Automation · Settings) ═══ */

const V14_I = {
  doc:'<svg viewBox="0 0 16 16" width="16" height="16"><path d="M4 1.5h5.5L13 5v9.5H4z" fill="currentColor" opacity=".9"/><path d="M6 8h5M6 10.5h5" stroke="#fff" stroke-width="1.2"/></svg>',
  people:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><circle cx="5.5" cy="5" r="2.3"/><circle cx="11" cy="5.5" r="2"/><path d="M1 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4zM10 13c0-1.6-.5-2.8-1.4-3.6 2.8-.5 5.4.8 5.4 3.6z"/></svg>',
  cal:'<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12"/></svg>',
  down:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M7 1.5h2v6h2.5L8 11 4.5 7.5H7z"/><rect x="2" y="12.5" width="12" height="2" rx=".5"/></svg>',
  bars:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><rect x="2" y="3" width="2.6" height="11" rx=".5"/><rect x="6.7" y="7" width="2.6" height="7" rx=".5"/><rect x="11.4" y="10" width="2.6" height="4" rx=".5"/></svg>',
  store:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M2 2.5h12l1 4H1z"/><path d="M2 7.5h12v6H2z" opacity=".85"/><rect x="6" y="9.5" width="4" height="4" fill="#fff"/></svg>',
  ticket:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M1.5 4h13v2.5a1.5 1.5 0 000 3V12h-13V9.5a1.5 1.5 0 000-3z"/></svg>',
  list:'<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2.5" width="12" height="11" rx="1.5"/><path d="M5 6h6M5 8.5h6M5 11h6"/></svg>',
  gear:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 5.2A2.8 2.8 0 108 10.8 2.8 2.8 0 008 5.2zm6.3 3.8l-1.5.3a5 5 0 01-.5 1.2l.9 1.3-1.4 1.4-1.3-.9a5 5 0 01-1.2.5L9 14.3H7l-.3-1.5a5 5 0 01-1.2-.5l-1.3.9-1.4-1.4.9-1.3a5 5 0 01-.5-1.2L1.7 9V7l1.5-.3a5 5 0 01.5-1.2l-.9-1.3 1.4-1.4 1.3.9a5 5 0 011.2-.5L7 1.7h2l.3 1.5a5 5 0 011.2.5l1.3-.9 1.4 1.4-.9 1.3a5 5 0 01.5 1.2l1.5.3z"/></svg>',
  bell:'<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M8 1.5a4 4 0 014 4v3l1.5 2.5h-11L4 8.5v-3a4 4 0 014-4zM6.3 12.5h3.4a1.7 1.7 0 01-3.4 0z"/></svg>',
  // tab icons
  builder:'<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M4 2h8v12H4z" opacity=".9"/><path d="M6 6l1.3 1.3L10 4.6" stroke="#fff" stroke-width="1.3" fill="none"/></svg>',
  transl:'<svg viewBox="0 0 16 16" width="13" height="13"><text x="0" y="12" font-size="10" font-weight="700" fill="currentColor">A</text><text x="7" y="13" font-size="7.5" font-weight="700" fill="currentColor">A</text></svg>',
  send:'<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M14.5 1.5L1.5 7l5 1.5 1.5 5z"/></svg>',
  resp:'<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><rect x="1.5" y="3" width="13" height="10" rx="1"/><path d="M4 6.5h8M4 9.5h8" stroke="#fff" stroke-width="1.2"/></svg>',
  anal:'<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><rect x="2" y="7" width="2.5" height="7"/><rect x="6.7" y="3" width="2.5" height="11"/><rect x="11.4" y="9" width="2.5" height="5"/></svg>',
  ins:'<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M7 1l1.3 3.7L12 6 8.3 7.3 7 11 5.7 7.3 2 6l3.7-1.3zM12.5 9.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8L10 12l1.8-.7z"/></svg>',
  auto:'<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 8a5 5 0 11-1.5-3.6M13 2v3h-3"/></svg>',
  wrench:'<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M2 12.5L6.5 8 8 9.5 3.5 14zM10.5 1.5a3.5 3.5 0 00-3 5.2L9.3 8.5a3.5 3.5 0 005.2-3l-2 1-1.8-1.8z"/></svg>',
  caret:'<svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor"><path d="M1.5 3.5h7L5 7.5z"/></svg>',
  right:'<svg viewBox="0 0 10 10" width="9" height="9" fill="currentColor"><path d="M3.5 1.5v7L7.5 5z"/></svg>',
  search:'<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/></svg>',
  filter:'<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M1.5 2h13L9.5 8v5.5l-3 1.5V8z"/></svg>',
  cols:'<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="2" y="2" width="3" height="12"/><rect x="6.5" y="2" width="3" height="9"/><rect x="11" y="2" width="3" height="6"/></svg>',
  refresh:'<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M13.5 8A5.5 5.5 0 113 5M3 1.5V5h3.5"/></svg>',
  dots:'<svg viewBox="0 0 4 14" width="4" height="13" fill="currentColor"><circle cx="2" cy="2" r="1.3"/><circle cx="2" cy="7" r="1.3"/><circle cx="2" cy="12" r="1.3"/></svg>',
  prog:'<svg viewBox="0 0 16 16" width="15" height="15"><path d="M3 1.5h7l3 3v10H3z" fill="#9b6fe0"/><path d="M5.5 8h5M5.5 10.5h5" stroke="#fff" stroke-width="1.2"/></svg>',
  surv:'<svg viewBox="0 0 16 16" width="15" height="15"><rect x="2.5" y="1.5" width="11" height="13" rx="1.5" fill="#d14fa8"/><path d="M5 8l2 2 4-4" stroke="#fff" stroke-width="1.5" fill="none"/></svg>',
  lock:'<svg viewBox="0 0 16 16" width="11" height="11" fill="#6b7280"><rect x="3" y="7" width="10" height="7.5" rx="1"/><path d="M5 7V5a3 3 0 016 0v2" stroke="#6b7280" stroke-width="1.6" fill="none"/></svg>'
};

// sample programs: the store survey is the one the journey opens
const V14_PROGRAMS = [
  {name:'Retail CX program', count:4, owner:'Dipit Sharma', mod:'Oct 22, 2026 6:10PM', open:true, surveys:[
    {k:'store', name:'Store experience survey', status:'Active', resp:'261', owner:'Dipit Sharma', mod:'Oct 22, 2026 6:10PM'},
    {k:'online', name:'Online experience survey', status:'Active', resp:'184', owner:'Dipit Sharma', mod:'Oct 14, 2026 11:32AM'},
    {k:'returns', name:'Returns & exchanges survey', status:'Active', resp:'97', owner:'Dipit Sharma', mod:'Oct 9, 2026 4:05PM'},
    {k:'care', name:'Customer care survey', status:'Draft', resp:'0', owner:'Dipit Sharma', mod:'Sep 30, 2026 2:47PM'}]},
  {name:'Loyalty program', count:2, owner:'Dipit Sharma', mod:'Sep 18, 2026 9:20AM', open:false, surveys:[]},
  {name:'Employee pulse', count:1, owner:'Dipit Sharma', mod:'Aug 27, 2026 3:12PM', open:false, surveys:[]}
];
var v14Open = {0:true};
const v14Av = n=>`<span class="v14-av">${v12Esc(n[0])}</span>`;

v12Shell = function(inner){
  const inSurvey = v12Step!=='surveys';
  return `<div class="hm-proto"><b>Prototype · Option 2: insights inside the survey program</b>
      <span class="v12-steps">${[['surveys','1 Programs'],['overview','2 Open a survey'],['insights','3 Insights tab']].map(([k,l])=>`<button class="${v12Step===k?'on':''}" data-v12-step="${k}" onclick="v12Go('${k}')">${l}</button>`).join('')}</span>
      <button style="margin-left:auto" data-v12-close onclick="closeInSurvey()">✕ Back to Survey Insights</button></div>
    <div class="v14-app">
      <nav class="v14-rail"><span class="v14-logo">✱</span>
        <a class="on" title="Programs" data-v14-programs onclick="v12Go('surveys')">${V14_I.doc}</a><a title="Audiences">${V14_I.people}</a><a title="Calendar">${V14_I.cal}</a><a title="Imports">${V14_I.down}</a><a title="Reporting">${V14_I.bars}</a><a title="Locations">${V14_I.store}</a><a title="Cases">${V14_I.ticket}</a><a title="Lists">${V14_I.list}</a>
        <span class="v14-rail-end"><a title="Settings">${V14_I.gear}</a><a title="Notifications">${V14_I.bell}</a><span class="v14-me">D</span></span></nav>
      <div class="v14-main">${inSurvey ? v14SurveyBar() : ''}<div class="v14-page">${inner}</div></div></div>`;
};
function v14SurveyBar(){
  return `<header class="v14-sbar"><span class="v14-sname">Store experience survey <i class="v14-dot" title="Active"></i></span>${v12TabsHTML(v12Step==='insights' ? 'insights' : 'overview')}</header>`;
}

v12SurveysHTML = function(){
  const rows = V14_PROGRAMS.map((p,i)=>{
    const open = !!v14Open[i];
    return `<tr class="v14-prog"><td><span class="v14-nm"><span class="v14-dots">${V14_I.dots}</span><button class="v14-car" onclick="v14Toggle(${i})">${open ? V14_I.caret : V14_I.right}</button>${V14_I.prog}${v12Esc(p.name)}</span></td><td>—</td><td>${p.count}</td><td>0</td><td>${v14Av(p.owner)}${v12Esc(p.owner)}</td><td>${p.mod}</td></tr>`
      + (open ? p.surveys.map(s=>`<tr class="v14-surv" data-v12-survey="${s.k}" onclick="${s.k==='store' ? "v12Go('overview')" : "toast('In this prototype, open the Store experience survey')"}"><td><span class="v14-nm v14-in"><span class="v14-dots">${V14_I.dots}</span>${V14_I.surv}${v12Esc(s.name)}</span></td><td><span class="v14-st ${s.status==='Active'?'on':'dr'}"><i></i>${s.status}</span></td><td>—</td><td>${s.resp}</td><td>${v14Av(s.owner)}${v12Esc(s.owner)}</td><td>${s.mod}</td></tr>`).join('') : '');
  }).join('');
  return v12Shell(`<div class="v14-ph"><h1>Programs</h1><label class="v14-search">${V14_I.search}<input placeholder="Search with 3 letter or more"><kbd>/</kbd></label>
      <span class="v14-acts"><button class="v14-ib on" title="Filters">${V14_I.filter}</button><button class="v14-ib" title="Columns">${V14_I.cols}</button><button class="v14-ib" title="Refresh">${V14_I.refresh}</button><button class="v14-b">Create Program</button><button class="v14-b pri">Create Survey</button></span></div>
    <div class="v14-fbar"><button class="v14-dd">Owner ${V14_I.caret}</button><button class="v14-dd">Type ${V14_I.caret}</button><button class="v14-dd sq">+</button></div>
    <div class="v14-seg"><button class="on">All</button><button>Favorites</button></div>
    <table class="v14-tbl" data-v12-surveys><thead><tr><th>Name ${V14_I.lock}</th><th>Status ${V14_I.caret}</th><th>Survey Count ${V14_I.caret}</th><th>Responses ${V14_I.caret}</th><th>Owner ${V14_I.caret}</th><th>Last Modified ${V14_I.caret}</th></tr></thead><tbody>${rows}</tbody></table>`);
};
function v14Toggle(i){ v14Open[i] = !v14Open[i]; v12Render(); }

// Insights sits right after Analytics: the AI read of the same data
var v14Skip = 0;
v12TabsHTML = function(active){
  if(v14Skip){ v14Skip = 0; return ''; }
  const n = v12Cards().length;
  const tabs = [['builder','Builder',V14_I.builder],['transl','Translations',V14_I.transl],['dist','Distribution',V14_I.send],['responses','Responses',V14_I.resp],['overview','Analytics',V14_I.anal],['insights',`Insights <span class="n">${n}</span>`,V14_I.ins],['auto','Automation',V14_I.auto],['settings','Settings',V14_I.wrench]];
  return `<div class="v14-tabs">${tabs.map(([k,l,ic])=>`<button class="${active===k?'on':''}" data-v12-tab="${k}" onclick="${k==='insights' ? "v12Go('insights')" : k==='overview' ? "v12Go('overview')" : "toast('Not part of this prototype')"}">${ic}${l}</button>`).join('')}</div>`;
};

// step 2: the survey opens on Analytics as it does today; a line points to the new tab
const V14_Q = [['CSAT Rating','Please rate your experience in the store for the following aspects'],['NPS','How likely are you to recommend this store to friends or family?'],['CSAT Rating','How satisfied were you with the service you received?'],['Text Field','Tell us more about your visit'],['Multiple Choice Question','Which store did you visit?'],['Multiple Choice Question','How often do you shop with us?']];
const V14_DIST = [['Store cleanliness',[1,2,6,24,67]],['Staff service',[1,1,4,20,74]],['Product availability',[3,4,10,28,55]],['Checkout speed',[2,3,9,26,60]],['Fitting rooms',[2,3,11,30,54]],['Value for money',[3,5,14,31,47]]];
const V14_COL = ['#5ab4e8','#9b59b6','#6cc6c0','#ee9a5d','#5b8be0'];
v12OverviewHTML = function(){
  const cs = v12Cards(), hi = cs.filter(c=>c.dataset.priority==='high').length;
  return v12Shell(`<div class="v14-ph"><h1>Analytics</h1><button class="v14-dd v14-life">${V14_I.cal} Lifetime ${V14_I.caret}</button><span class="v14-acts"><button class="v14-ib" title="Filters">${V14_I.filter}</button></span></div>
    <div class="v14-banner" data-v12-teaser>${V14_I.ins}<span><b>${cs.length} insights in the latest update</b>${hi ? ` · ${hi} need attention` : ''}. Insights now have their own tab.</span><button class="v14-b pri" onclick="v12Go('insights')">Open Insights</button></div>
    <div class="v14-an"><aside class="v14-ql"><label class="v14-search sm">${V14_I.search}<input placeholder="Search"></label>
      ${V14_Q.map(([t,q],i)=>`<div class="v14-q${i===0?' on':''}"><small>${v12Esc(t)}</small><b>${v12Esc(q)}</b></div>`).join('')}</aside>
      <section class="v14-qc"><small>CSAT Rating</small><h2>${v12Esc(V14_Q[0][1])}</h2>
        <p class="v14-rd">Response Distribution ${V14_I.caret}</p>
        <div class="v14-lg">${[1,2,3,4,5].map((n,i)=>`<span><i style="background:${V14_COL[i]}"></i>${n}</span>`).join('')}</div>
        ${V14_DIST.map(([l,v])=>`<div class="v14-bar"><span>${l}</span><div>${v.map((x,i)=>`<i style="flex:${x};background:${V14_COL[i]}"></i>`).join('')}</div></div>`).join('')}
        <p class="v14-ax">Share of responses (%)</p></section></div>`);
};

// step 3: the insights tab gets a page header like the other tabs
const _v14Ins = v12InsightsHTML;
v12InsightsHTML = function(){
  v14Skip = 1; let h = _v14Ins.apply(this, arguments); v14Skip = 0;   // the tabs already sit in the survey bar
  let upd = '';
  h = h.replace(/<div class="v3-upd"[^>]*>([\s\S]*?)<\/div>/, (m, x)=>{ upd = x; return ''; });
  return h.replace('<div class="v14-page">', `<div class="v14-page"><div class="v14-ph"><h1>Insights</h1><span class="v14-upd">${upd}</span></div>`);
};
