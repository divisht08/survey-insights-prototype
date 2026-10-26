/* ═══ v12 — Option 2 as a journey: insights live inside the survey program (a tab next to Responses and Reports)
   plus a page with the pros and cons of that approach, now and later. Both open from the prototype bar. ═══ */

const v12Esc = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
var v12Step = 'surveys', v12Sel = null;
const V12_SURVEYS = [
  {k:'store', name:'Store experience survey', sub:'RT ATYAF MALL · in-store visits', responses:'261 this period', insights:6, attn:2},
  {k:'online', name:'Online experience survey', sub:'Website and app orders', responses:'—', insights:1, attn:1},
  {k:'returns', name:'Returns & exchanges survey', sub:'After a return or exchange', responses:'—', insights:1, attn:0},
  {k:'care', name:'Customer care survey', sub:'After a contact-centre call', responses:'—', insights:0, attn:0}
];
const V12_PRIO = {high:['high','Needs attention'], med:['med','Worth a look'], pos:['pos','Bright spot'], low:['low','For awareness']};

// the store survey's insights, read from the feed's own cards so the two never disagree
function v12Cards(){
  return [...document.querySelectorAll('#card-grid .insight-card')]
    .filter(c=>/^INS-/.test(c.dataset.id) && !dismissedFeed.has(c.dataset.id))
    .sort((a,b)=>(V7_RANK[a.dataset.priority]??4) - (V7_RANK[b.dataset.priority]??4));
}
function v12CardHTML(c){
  const id = c.dataset.id, t = s=>((c.querySelector(s)||{}).textContent||'').trim();
  const num = c.querySelector('.ic-stat .ic-num'), unit = c.querySelector('.ic-stat .ic-unit');
  const showStat = num && !c.classList.contains('v7-nostat');
  const p = V12_PRIO[c.dataset.priority] || V12_PRIO.low;
  return `<button class="v12-card${v12Sel===id?' on':''}" data-v12-card="${id}" data-priority="${c.dataset.priority}" onclick="v12Open('${id}')">
    <span class="v12-k"><span class="v12-p ${p[0]}">${p[1]}</span>${v12Esc(t('[data-el="kind-text"]'))}</span>
    <span class="v12-row"><span class="v12-tx"><b>${v12Esc(t('[data-el="title"]'))}</b>${v12Sel ? '' : `<span>${v12Esc(t('[data-el="summary"]'))}</span>`}</span>
    ${showStat && !v12Sel ? `<span class="v12-st"><b>${v12Esc(num.textContent.trim())}</b><small>${v12Esc(unit ? unit.textContent.trim() : '')}</small></span>` : ''}</span></button>`;
}
function v12Shell(inner, crumbs){
  return `<div class="hm-proto"><b>Prototype · Option 2: insights inside the survey program</b>
      <span class="v12-steps">${[['surveys','1 Surveys'],['overview','2 Open a survey'],['insights','3 Insights tab']].map(([k,l])=>`<button class="${v12Step===k?'on':''}" data-v12-step="${k}" onclick="v12Go('${k}')">${l}</button>`).join('')}</span>
      <button style="margin-left:auto" data-v12-close onclick="closeInSurvey()">✕ Back to Survey Insights</button></div>
    <div class="v12-app"><div class="v12-top"><span class="v12-logo">✱</span><span class="v12-tabname">Customer Feedback Management</span></div>
      <div class="v12-body"><nav class="v12-rail"><p>CFM</p><a>Home</a><a class="on" onclick="v12Go('surveys')">Surveys</a><a>Response analytics</a><a>Distribution</a><a>Settings</a></nav>
        <main class="v12-main"><p class="v12-crumbs">${crumbs}</p>${inner}</main></div></div>`;
}
function v12SurveysHTML(){
  return v12Shell(`<div class="v12-h"><h1>Surveys</h1><span class="v12-btn">+ New survey</span></div>
    <table class="v12-tbl" data-v12-surveys><thead><tr><th>Survey</th><th>Status</th><th>Responses</th><th>Insights</th></tr></thead><tbody>
    ${V12_SURVEYS.map(s=>`<tr data-v12-survey="${s.k}" onclick="${s.k==='store' ? "v12Go('overview')" : "toast('In this prototype, open the Store experience survey')"}"><td><b>${s.name}</b><small>${s.sub}</small></td><td><span class="v12-live">Live</span></td><td>${s.responses}</td>
      <td>${s.insights ? `${s.insights} ${s.insights===1?'insight':'insights'}${s.attn ? ` <span class="v12-attn">${s.attn} need attention</span>` : ''}` : '<span class="v12-q">None yet</span>'}</td></tr>`).join('')}
    </tbody></table>`, 'Surveys');
}
function v12TabsHTML(active){
  const n = v12Cards().length;
  return `<div class="v12-sh"><div><h1>Store experience survey</h1><p>RT ATYAF MALL · in-store visits · Live</p></div><span class="v12-btn">Edit survey</span></div>
    <div class="v12-tabs">${[['overview','Overview'],['build','Build'],['distribute','Distribute'],['responses','Responses'],['reports','Reports'],['insights',`Insights <span class="n">${n}</span>`]].map(([k,l])=>`<button class="${active===k?'on':''}" data-v12-tab="${k}" onclick="${k==='insights' ? "v12Go('insights')" : k==='overview' ? "v12Go('overview')" : "toast('Not part of this prototype')"}">${l}</button>`).join('')}</div>`;
}
function v12OverviewHTML(){
  const cs = v12Cards(), hi = cs.filter(c=>c.dataset.priority==='high');
  return v12Shell(`${v12TabsHTML('overview')}
    <div class="v12-ov"><div class="v12-tile"><span>Responses</span><b>261</b><small>01 Jun – 23 Sep 2026</small></div><div class="v12-tile"><span>Overall satisfaction</span><b>9.63</b><small>out of 10 · 9.23 before</small></div><div class="v12-tile"><span>Service satisfaction</span><b>9.67</b><small>out of 10 · 9.30 before</small></div></div>
    <div class="v12-teaser" data-v12-teaser><div><b>${cs.length} insights in the latest update</b><span>${hi.length} need attention: ${hi.map(c=>v12Esc(c.querySelector('[data-el="title"]').textContent.trim())).join(' · ')}</span></div><button class="btn-pri" onclick="v12Go('insights')">Open Insights</button></div>`,
    `<a onclick="v12Go('surveys')">Surveys</a> › Store experience survey`);
}
function v12InsightsHTML(){
  const cs = v12Cards();
  return v12Shell(`${v12TabsHTML('insights')}
    <div class="v12-split${v12Sel?' open':''}"><div class="v12-list">
      <div class="v12-lh"><span>Updated <b>${EDITIONS[0].short}</b> · next update ${(EDITION_SCHEDULE[editionFreq]||EDITION_SCHEDULE.Weekly).next.split(',')[0]}</span></div>
      <div class="v12-filters"><span class="v9-pill">Type ▾</span><span class="v9-pill">Priority ▾</span><span class="v9-pill">Topic ▾</span></div>
      ${cs.map(v12CardHTML).join('')}</div>
      <div class="v12-panel" id="v12-panel">${v12Sel ? v12PanelHTML(v12Sel) : ''}</div></div>`,
    `<a onclick="v12Go('surveys')">Surveys</a> › <a onclick="v12Go('overview')">Store experience survey</a> › Insights`);
}
// the same drill-down as the feed, for a survey-level view: actions that only make sense per person are left out
function v12PanelHTML(id){
  const card = document.querySelector(`#card-grid .insight-card[data-id="${id}"]`); if(!card) return '';
  const t = document.createElement('template'); t.innerHTML = investigateHTML(card);
  t.content.querySelectorAll('[data-close-panel]').forEach(b=>b.setAttribute('onclick','v12Close()'));
  t.content.querySelectorAll('[data-v3-dismiss-panel],[data-panel-done],.v6-chips button[title="Open full page"]').forEach(b=>b.remove());
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
}
function v12Render(){
  const l = document.getElementById('v12-layer'); if(!l) return;
  l.innerHTML = v12Step==='surveys' ? v12SurveysHTML() : v12Step==='overview' ? v12OverviewHTML() : v12InsightsHTML();
}
function v12Go(step){ v12Step = step; if(step!=='insights') v12Sel = null; v12Render(); }
function v12Open(id){
  v12Sel = id;
  // one drill-down on screen at a time, so element ids never clash
  const ip = document.getElementById('investigate-panel'); if(ip){ closeInvestigatePanel(true); ip.innerHTML = ''; }
  v12Render();
  const p = document.getElementById('v12-panel'); if(p) p.scrollTop = 0;
}
function v12Close(){ v12Sel = null; v12Render(); }
function openInSurvey(){
  if(typeof setJourney==='function' && !document.querySelector('.journey-btn.active[data-state="returning"]')) setJourney('returning');
  if(typeof v3Scope!=='undefined' && v3Scope!=='store') v3SetScope('store', true);
  let l = document.getElementById('v12-layer');
  if(!l){ l = document.createElement('div'); l.id = 'v12-layer'; document.body.appendChild(l); }
  v12Step = 'surveys'; v12Sel = null; v12Render();
  l.classList.add('show'); document.body.style.overflow = 'hidden';
}
function closeInSurvey(){
  const l = document.getElementById('v12-layer'); if(l){ l.classList.remove('show'); l.innerHTML = ''; }
  document.body.style.overflow = '';
}
// keep the open drill-down in step when Follow, Share or an action plan changes it
const _v12Refresh = refreshInvestigatePanel;
refreshInvestigatePanel = function(id){
  const l = document.getElementById('v12-layer');
  if(l && l.classList.contains('show') && v12Step==='insights'){ v12Render(); return; }
  return _v12Refresh.apply(this, arguments);
};

/* ── pros and cons of Option 2, now and later ── */
const V12_PC = {
  now:{
    pros:[
      ['Familiar place', 'Survey Insights already lives in Survey Analytics. Nothing new to learn or promote.'],
      ['Clear context', 'One survey, its questions, its data and its permissions. Every insight reads against that survey.'],
      ['Simple and cheap', 'One insight run per survey per update, the same for everyone. No per-user generation.'],
      ['Fits survey owners and CX analysts', 'They already work inside the survey program every day.'],
      ['Fewer open questions', 'No access rules across surveys and no merging of insights to design.']],
    cons:[
      ['No single place for people with many surveys or stores', 'A CX manager with 40 survey projects opens 40 programs; an area manager with 30 stores has no combined view.'],
      ['Same view for everyone', 'A store manager and a country head see the same list. Read/unread, Delete and role relevance do not fit a shared tab.'],
      ['Misses the people who act', 'Store, area and country managers rarely open survey programs, so they depend on email.'],
      ['No home for alerts, the digest or Copilot across insights', 'Each would need its own place outside the survey.'],
      ['Feels like another report', 'Insights become a tab you visit, not something that comes to you.']]
  },
  later:{
    pros:[
      ['Easy to build on', 'A personal home across surveys can be added later on the same per-survey engine, if customers ask for it.'],
      ['Close to the fix', 'A finding can link straight to the question, distribution or follow-up settings in the same survey.'],
      ['Lower running cost', 'Useful while AI cost and quality are still settling.']],
    cons:[
      ['Personalisation is hard to add later', 'Once people learn a shared tab, making it different per person confuses them.'],
      ['Cross-survey needs stay unserved', 'Area managers across stores and owners of many touchpoints keep stitching insights together by hand.'],
      ['The experience splits', 'Follow, unread and alerts end up living somewhere else anyway, so insights sit in two places.'],
      ['Adoption drops as surveys grow', 'The more programs a customer runs, the more places there are to check.']]
  }
};
function v12ProsConsHTML(){
  const list = (arr, cls)=>`<ul class="v12-pc ${cls}">${arr.map(([h,d])=>`<li><b>${h}</b><span>${d}</span></li>`).join('')}</ul>`;
  const block = (title, d)=>`<section class="v12-pcs"><h2>${title}</h2><div class="v12-pcg"><div><p class="v12-pch pro">Pros</p>${list(d.pros,'pro')}</div><div><p class="v12-pch con">Cons</p>${list(d.cons,'con')}</div></div></section>`;
  return `<div class="hm-proto"><b>Prototype · Option 2: pros and cons</b><button data-v12pc-journey onclick="closeProsCons();openInSurvey()">Open the journey</button><button style="margin-left:auto" data-v12pc-close onclick="closeProsCons()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap">
      <h1>Insights inside the survey program</h1>
      <p class="lo-lede">Option 2: Survey Insights is a tab in each survey program, next to Responses and Reports, and shows the same insights to everyone with access to that survey.</p>
      ${block('Now', V12_PC.now)}${block('In the future', V12_PC.later)}</div></div>`;
}
function openProsCons(){
  let l = document.getElementById('v12pc-layer');
  if(!l){ l = document.createElement('div'); l.id = 'v12pc-layer'; document.body.appendChild(l); }
  l.innerHTML = v12ProsConsHTML(); l.classList.add('show'); document.body.style.overflow = 'hidden';
}
function closeProsCons(){ const l = document.getElementById('v12pc-layer'); if(l) l.classList.remove('show'); document.body.style.overflow = ''; }

(function v12ProtoBar(){
  const ref = document.getElementById('open-use-cases') || document.getElementById('open-card-types');
  if(!ref || document.getElementById('open-in-survey')) return;
  ref.insertAdjacentHTML('beforebegin', `<button class="journey-btn" id="open-in-survey" onclick="openInSurvey()">▣ Option 2 · Inside the survey</button><button class="journey-btn" id="open-in-survey-pc" onclick="openProsCons()">⚖ Option 2 · Pros and cons</button>`);
})();
