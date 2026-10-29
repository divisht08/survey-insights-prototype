/* ═══ v15 — Admin setup in global settings (replaces js/admin-setup.js).
   A persona is defined once (user group + objective) and applied to many surveys, each with
   "All questions" or "Only these". Row access comes from existing permissions. Personal-data fields
   are excluded once for the whole account. Opens from the settings gear in the left rail
   (journey state "Day 0 · Admin setup") and from a survey's Settings tab. All data is illustrative. ═══ */

const V15_SURVEYS = [
  {k:'store', name:'Store experience survey', resp:261, qs:[['s1','Overall satisfaction','Rating'],['s2','Likelihood to recommend','NPS'],['s3','Checkout speed','Rating'],['s4','Staff helpfulness','Rating'],['s5','Store cleanliness','Rating'],['s6','What could we improve?','Open text']]},
  {k:'online', name:'Online experience survey', resp:184, qs:[['o1','Overall satisfaction','Rating'],['o2','Ease of finding products','Rating'],['o3','Checkout and payment','Rating'],['o4','Delivery speed','Rating'],['o5','What could we improve?','Open text']]},
  {k:'returns', name:'Returns & exchanges survey', resp:97, qs:[['r1','Ease of return','Rating'],['r2','Refund speed','Rating'],['r3','Staff helpfulness','Rating'],['r4','What could we improve?','Open text']]},
  {k:'care', name:'Customer care survey', resp:0, draft:true, qs:[['c1','Issue resolved','Yes or no'],['c2','Wait time','Rating'],['c3','Agent helpfulness','Rating'],['c4','What could we improve?','Open text']]}
];
const V15_GROUPS = [['Store managers','Sees own store',214],['Area managers','Sees own region',38],['Checkout & payments team','Sees all stores',5],['Central CX team','Sees all stores',6],['CX head','Sees all stores',4]];
const V15_PII = [['Email address','Online experience survey'],['Phone number','Customer care survey'],['Customer name','Store experience survey'],['Contact me about my feedback','Store experience survey']];
const V15_SEED = [
  {id:'sm', name:'Store manager', group:'Store managers', role:'Runs one store day to day and reports to an area manager.',
    resp:'Tills and the shop floor, shift schedules, staff coaching and recognition. Pricing and supplier issues go to the area manager.',
    extra:'Weekends are our busiest days, so flag anything that affects Saturday and Sunday trading.',
    scope:{store:'all', returns:'all'}, freq:'weekly', email:true, status:'live'},
  {id:'am', name:'Area manager', group:'Area managers', role:'Looks after 8 to 12 stores in one region.',
    resp:'Spotting stores that need help, comparing stores, deciding where to send support.',
    extra:'Compare each store with the rest of the region, not with last year.',
    scope:{store:'all', returns:'all'}, freq:'weekly', email:true, status:'live'},
  {id:'cp', name:'Checkout & payments', group:'Checkout & payments team', role:'Product team that owns tills, card and wallet payments in store and online.',
    resp:'Payment failures, checkout speed, the payment steps in the app and website.',
    extra:'Only checkout and payment problems. Other parts of the visit are not theirs to fix.',
    scope:{store:['s3','s6'], online:['o3','o5']}, freq:'daily', email:true, status:'live'},
  {id:'cx', name:'Central CX', group:'Central CX team', role:'Runs the survey programs and reports to the CX head.',
    resp:'Themes and trends across stores and channels, what to raise with other teams.',
    extra:'',
    scope:{store:'all', online:'all', returns:'all', care:'all'}, freq:'weekly', email:true, status:'draft'}
];
// what the AI would answer for each suggested persona's questions, if the admin picks "Only these"
const V15_SUGGEST = {cp:{store:['s3','s6'], online:['o3','o5']}};
const V15_DIRS = {
  sm:['Speak to someone who runs one store and reports to an area manager','Lead with what they can fix: tills, shop floor, shifts, recognition','Pass pricing and supplier issues up, as something to raise, not to fix','Flag anything that affects weekend trading'],
  am:['Compare each store with the rest of the region','Lead with stores that need help, then stores doing well','Suggest where to send support, not how to run a store'],
  cp:['Only use checkout and payment questions, and comments about paying','Lead with payment failures and slow checkouts, in store and online','Leave the rest of the visit out'],
  cx:['Look across all stores and channels','Lead with themes that grow or spread','Point out what other teams should hear about']
};
const V15_SAMPLE = {
  sm:['Fix this first','Saturday evening queues are pulling your checkout score down','Checkout speed averaged 3.6 on Saturdays 5 to 8pm, against 4.2 on weekdays. 18 of the 41 low-scoring comments mention waiting for a free till.','Store 14 · last 4 weeks'],
  am:['Needs attention','Store 9 is now the lowest-rated store in North','Overall satisfaction at Store 9 fell from 4.3 to 3.8 while the region held at 4.2. Most low scores mention fitting rooms.','North region · last 4 weeks'],
  cp:['Needs attention','Card payment failures spiked on 14–15 Sep','11 people over 2 days described card or wallet payments failing at the till, against about 1 a week normally. Online checkout scores did not move.','Store and online · last 2 weeks'],
  cx:['Recurring theme','Offer clarity comes up in stores and online','Comments about unclear discounts appear in both the store and online surveys this month, in 6 of 9 stores.','All channels · last 4 weeks']
};

var v15S = null;
function v15Fresh(mode){
  return {screen:'home', tab: mode==='first' ? 'suggest' : 'personas', personas: mode==='first' ? [] : JSON.parse(JSON.stringify(V15_SEED)),
    edit:null, step:1, toast:'', confirm:false, pii:{}, origin:null};
}
const v15E = s=>v12Esc(s);
const v15Grp = n=>V15_GROUPS.filter(g=>g[0]===n)[0] || ['', '', 0];
const v15Srv = k=>V15_SURVEYS.filter(s=>s.k===k)[0];
function v15ScopeText(p, k){ const v = p.scope[k]; if(!v) return ''; return v==='all' ? 'All questions' : v.length+' question'+(v.length===1?'':'s'); }
function v15FreqText(p){ return p.freq==='daily' ? 'Daily, 08:00' : p.freq==='monthly' ? 'Monthly, first Monday 08:00' : 'Weekly, Monday 08:00'; }

/* ── shell: global settings ── */
function v15Shell(inner, bar){
  const I = V14_I, mode = v15S.personas.length ? 'exist' : 'first';
  return `<div class="hm-proto"><b>Prototype · Admin setup in global settings</b>
      <button class="${mode==='first'?'on':''}" data-v15-mode="first" onclick="v15Reset('first')">First visit</button><button class="${mode==='exist'?'on':''}" data-v15-mode="exist" onclick="v15Reset('exist')">Personas exist</button>
      <button style="margin-left:auto" data-v15-close onclick="v15Close()">✕ Back to Survey Insights</button></div>
    <div class="v14-app"><nav class="v14-rail"><span class="v14-logo">✱</span><a title="Programs">${I.doc}</a><a title="Reporting">${I.bars}</a><a title="Survey Insights">${I.ins}</a>
      <span class="v14-rail-end"><a class="on" title="Settings">${I.gear}</a><a title="Notifications">${I.bell}</a><span class="v14-me">D</span></span></nav>
      <div class="v15-set"><nav class="v15-snav"><p>Settings</p>${['General','Users and groups','Data governance','Survey Insights','Notifications'].map(n=>`<a class="${n==='Survey Insights'?'on':''}" ${n==='Survey Insights'?`onclick="v15Home()"`:`onclick="toast('Not part of this prototype')"`}>${n}</a>`).join('')}</nav>
        <div class="v15-col"><div class="v15-page"><div class="v15-wrap">${inner}</div></div>${bar||''}</div></div></div>
    ${v15S.toast ? `<div class="v15-toast">${v15E(v15S.toast)}</div>` : ''}`;
}

/* ── home: personas, surveys, data rules ── */
function v15HomeHTML(){
  const t = v15S.tab, n = v15S.personas.length;
  const tabs = (n ? [['personas',`Personas · ${n}`],['surveys',`Surveys · ${V15_SURVEYS.length}`]] : [['suggest','Suggested personas']]).concat([['rules','Data rules']]);
  const body = t==='surveys' ? v15SurveysHTML() : t==='rules' ? v15RulesHTML() : t==='suggest' ? v15SuggestHTML() : v15PersonasHTML();
  return `<div class="v15-hd"><div><h1>Survey Insights</h1><p class="v15-sub">Set up who gets insights, about what, and from which surveys. Each persona is set up once and can cover many surveys.</p></div>
      ${n ? `<button class="v14-b pri" data-v15-new onclick="v15New()">+ New persona</button>` : ''}</div>
    <div class="v15-tabs">${tabs.map(([k,l])=>`<button class="${t===k?'on':''}" data-v15-tab="${k}" onclick="v15Tab('${k}')">${l}</button>`).join('')}</div>${body}`;
}
function v15SuggestHTML(){
  return `<div class="v15-callout"><b>No personas yet, so nobody gets insights.</b> We read the questions in your 4 surveys and your user groups and suggest these personas. Review one to set it up, or start from scratch.</div>
    <div class="v15-sgrid">${V15_SEED.map(p=>{ const g = v15Grp(p.group);
      return `<div class="v15-scard" data-v15-suggest="${p.id}"><span class="v15-tag ai">Suggested</span><h3>${v15E(p.name)}</h3><p>${v15E(p.resp)}</p>
        <dl><dt>User group</dt><dd>${v15E(p.group)} · ${g[2]} people</dd><dt>Surveys</dt><dd>${Object.keys(p.scope).map(k=>v15E(v15Srv(k).name.replace(' survey',''))+(p.scope[k]==='all'?'':' (some questions)')).join(', ')}</dd></dl>
        <button class="v14-b" onclick="v15Edit('${p.id}',true)">Review and set up</button></div>`; }).join('')}</div>
    <p class="v15-note">Or <a onclick="v15New()">create a persona from scratch</a>. People who aren't in any persona don't get a feed or emails.</p>`;
}
function v15PersonasHTML(){
  const rows = v15S.personas.map(p=>{ const g = v15Grp(p.group), ks = Object.keys(p.scope);
    return `<tr data-v15-persona="${p.id}" onclick="v15Edit('${p.id}')"><td><b>${v15E(p.name)}</b><small>${v15E(p.resp.split('.')[0])}</small></td>
      <td>${v15E(p.group)}<small>${g[2]} people · ${v15E(g[1].toLowerCase())}</small></td>
      <td>${ks.length} survey${ks.length===1?'':'s'}<small>${ks.some(k=>p.scope[k]!=='all') ? 'Some questions only' : 'All questions'}</small></td>
      <td>${v15FreqText(p)}<small>${p.email?'Email on':'Feed only'}</small></td>
      <td><span class="v15-st ${p.status}">${p.status==='live'?'Live':'Draft'}</span></td></tr>`; }).join('');
  const people = v15S.personas.filter(p=>p.status==='live').reduce((a,p)=>a+v15Grp(p.group)[2],0);
  return `<p class="v15-note">${people} people get insights from live personas.</p>
    <div class="v15-card"><table class="v15-tbl" data-v15-personas><thead><tr><th>Persona</th><th>User group</th><th>Surveys</th><th>Delivery</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>${v15MoreHTML()}`;
}
// suggestions not set up yet stay visible under the list until they're used
function v15MoreHTML(){
  const left = V15_SEED.filter(x=>!v15S.personas.some(p=>p.id===x.id)); if(!left.length) return '';
  return `<div class="v15-card" data-v15-more><div class="v15-ch"><h3>Suggested personas not set up yet</h3><p>From the questions in your surveys and your user groups.</p></div>
    ${left.map(p=>`<div class="v15-srow v15-flex"><span><b>${v15E(p.name)}</b> <span class="v15-tag ai">Suggested</span><small>${v15E(p.group)} · ${v15Grp(p.group)[2]} people · ${Object.keys(p.scope).length} surveys</small></span><button class="v14-b" data-v15-more-go="${p.id}" onclick="v15Edit('${p.id}',true)">Review and set up</button></div>`).join('')}</div>`;
}
// one row per survey: who gets insights from it, and surveys nobody does sort to the top
function v15SurveysHTML(){
  const ps = v15S.personas, q = (v15S.q||'').toLowerCase();
  const live = s=>ps.filter(p=>p.status==='live' && p.scope[s.k]);
  const rows = V15_SURVEYS.filter(s=>!q || s.name.toLowerCase().indexOf(q)>-1).slice().sort((x,y)=>(live(x).length?1:0)-(live(y).length?1:0));
  const gaps = V15_SURVEYS.filter(s=>!live(s).length);
  return `${gaps.length ? `<div class="v15-callout warn" data-v15-gaps><b>${gaps.length} of ${V15_SURVEYS.length} surveys ${gaps.length===1?'has':'have'} no live persona.</b> Nobody gets insights from ${gaps.length===1?'it':'them'} yet.</div>` : ''}
    <div class="v15-card"><div class="v15-th"><h3>Surveys</h3><input class="v15-search" data-v15-search placeholder="Search surveys" value="${v15E(v15S.q||'')}" oninput="v15S.q=this.value;v15Render();const i=document.querySelector('[data-v15-search]');i.focus();i.setSelectionRange(i.value.length,i.value.length)"></div>
    <table class="v15-tbl" data-v15-surveys><thead><tr><th>Survey</th><th>Personas using it</th><th>People</th><th></th></tr></thead><tbody>
    ${rows.map(s=>{ const all = ps.filter(p=>p.scope[s.k]), lv = live(s), ppl = lv.reduce((a,p)=>a+v15Grp(p.group)[2],0);
      return `<tr data-v15-srv="${s.k}"><td><b>${v15E(s.name)}</b><small>${s.draft ? 'Draft survey · no responses yet' : s.resp+' responses'}</small></td>
        <td>${all.length ? `<span class="v15-pchips">${all.map(p=>`<button class="v15-pchip ${p.status}" onclick="v15Edit('${p.id}',false,2)">${v15E(p.name)} · ${v15ScopeText(p,s.k).replace('All questions','all questions')}${p.status==='live'?'':' · Draft'}</button>`).join('')}</span>` : '<span class="v15-note">None</span>'}
          ${lv.length ? '' : '<small class="v15-warn">No live persona</small>'}</td>
        <td>${ppl ? ppl : '<span class="v15-note">0</span>'}</td>
        <td class="v15-r"><button class="v14-b" data-v15-addto="${s.k}" onclick="v15AddPick('${s.k}')">Add a persona</button></td></tr>`; }).join('') || '<tr><td colspan="4" class="v15-note">No surveys match.</td></tr>'}</tbody></table></div>
    <p class="v15-note">People counts include live personas only. Which responses each person sees comes from their own access.</p>`;
}
// pick which persona to add a survey to; it opens at step 2 with the survey already ticked
function v15PickHTML(){
  const k = v15S.pick, s = v15Srv(k), opts = v15S.personas.filter(p=>!p.scope[k]);
  return `<div class="v15-scrim" data-v15-pick onclick="if(event.target===this){v15S.pick=null;v15Render()}"><div class="v15-pop"><h3>Add ${v15E(s.name)} to a persona</h3>
    ${opts.length ? `<div class="v15-plist">${opts.map(p=>`<button data-v15-pick-go="${p.id}" onclick="v15AddTo('${k}','${p.id}')"><b>${v15E(p.name)}</b><small>${v15E(p.group)} · ${v15Grp(p.group)[2]} people</small></button>`).join('')}</div>` : '<p>Every persona already uses this survey.</p>'}
    <div class="v15-flex"><a onclick="v15S.pick=null;v15New();v15S.edit.scope['${k}']='all';v15Render()">Create a new persona</a><button class="v14-b" onclick="v15S.pick=null;v15Render()">Cancel</button></div></div></div>`;
}
function v15AddPick(k){ v15S.pick = k; v15Render(); }
function v15AddTo(k, id){ v15S.pick = null; v15Edit(id, false, 2); v15S.edit.scope[k] = 'all'; v15Render(); }
function v15RulesHTML(){
  return `<div class="v15-card v15-pad"><h3>Personal data is never used in insights</h3><p>These fields were found in your surveys. They're kept out of every insight, for every persona and survey. Answers stay available in Responses for people allowed to see them.</p>
    <table class="v15-tbl" data-v15-pii><thead><tr><th>Field</th><th>Found in</th><th>In insights</th></tr></thead><tbody>${V15_PII.map(([f,s],i)=>`<tr><td><b>${v15E(f)}</b></td><td>${v15E(s)}</td><td><span class="v15-st never">Never used</span></td></tr>`).join('')}</tbody></table>
    <p class="v15-note">New surveys are checked when they're published, and any personal-data fields are added here.</p></div>
    <div class="v15-card v15-pad"><h3>Which responses each person sees</h3><p>Not set here. Insights only use responses a person can already see, from your data governance. A store manager at Store 14 gets insights from Store 14's responses only.</p></div>`;
}

/* ── persona editor: 3 steps ── */
const V15_STEPS = [[1,'Who and what for'],[2,'Surveys and questions'],[3,'Delivery and review']];
function v15EditHTML(){
  const p = v15S.edit, st = v15S.step;
  const head = `<div class="v15-hd"><div><p class="v15-crumb"><a onclick="v15Home()">Survey Insights</a> › ${p.isNew ? 'New persona' : v15E(p.name||'Persona')}</p><h1>${v15E(p.name||'New persona')}</h1></div>
      ${p.status==='live' && !p.isNew ? '<span class="v15-st live">Live</span>' : ''}</div>
    <div class="v15-steps">${V15_STEPS.map(([n,l])=>`<button class="${st===n?'on':''}${st>n?' done':''}" data-v15-step="${n}" onclick="v15Step(${n})"><span>${st>n?'✓':n}</span>${l}</button>`).join('')}</div>`;
  const body = st===1 ? v15Step1() : st===2 ? v15Step2() : v15Step3();
  return head + body;
}
function v15Step1(){
  const p = v15S.edit, g = v15Grp(p.group), dirs = V15_DIRS[p.id] || ['Follow the role and responsibilities above'], sm = V15_SAMPLE[p.id];
  return `<div class="v15-cols"><div class="v15-main">
    <div class="v15-card v15-pad"><label class="v15-f">Persona name<input value="${v15E(p.name)}" placeholder="For example, Store manager" oninput="v15S.edit.name=this.value"></label>
      <div class="v15-f">User group<span class="v15-chips" data-v15-groups>${V15_GROUPS.map(x=>`<button class="v15-chip${p.group===x[0]?' on':''}" onclick="v15S.edit.group='${v15E(x[0])}';v15Render()">${v15E(x[0])} · ${x[2]}</button>`).join('')}</span>
      <small>Everyone in the group gets this persona's insights. ${g[0] ? `${v15E(g[0])}: ${g[2]} people, ${v15E(g[1].toLowerCase())}.` : ''}</small></div></div>
    <div class="v15-card v15-pad" data-v15-brief><div class="v15-flex"><h3>What should their insights help with?</h3>${p.role ? '<span class="v15-tag ai">Drafted from your surveys and this group</span>' : ''}</div>
      <label class="v15-f">Their role<textarea rows="2" placeholder="Who they are and who they report to" oninput="v15S.edit.role=this.value">${v15E(p.role)}</textarea></label>
      <label class="v15-f">What they're responsible for<textarea rows="3" placeholder="The decisions and actions that sit with them, so insights stick to what they can act on" oninput="v15S.edit.resp=this.value">${v15E(p.resp)}</textarea></label>
      <label class="v15-f"><span>Anything else <i>(optional)</i></span><textarea rows="2" placeholder="Anything the AI should keep in mind for this group" oninput="v15S.edit.extra=this.value">${v15E(p.extra)}</textarea></label></div></div>
    <aside class="v15-aside"><div class="v15-card v15-pad"><h3>How the AI will write for them</h3><ul class="v15-dirs">${dirs.map(d=>`<li>${v15E(d)}</li>`).join('')}</ul><p class="v15-note">Updates when you change the answers.</p></div>
      ${sm ? `<div class="v15-card v15-pad"><h3>A sample insight they'd get</h3><div class="v15-sample"><b class="k">${v15E(sm[0])}</b><b>${v15E(sm[1])}</b><span>${v15E(sm[2])}</span><small>${v15E(sm[3])}</small></div><p class="v15-note">Sample wording. Real insights use real responses.</p></div>` : ''}
      <div class="v15-card v15-pad"><h3>People can add their own note</h3><p>Each person can add a line about their own goals on top of this. They can't change the surveys or questions.</p></div></aside></div>`;
}
function v15Step2(){
  const p = v15S.edit, sug = V15_SUGGEST[p.id] || {};
  const rows = V15_SURVEYS.map(s=>{ const v = p.scope[s.k], on = !!v, only = on && v!=='all';
    const qs = only ? `<div class="v15-qs" data-v15-qs="${s.k}">${s.qs.map(([id,l,t])=>`<label class="v15-q${v.indexOf(id)>-1?' on':''}"><input type="checkbox" ${v.indexOf(id)>-1?'checked':''} onchange="v15Q('${s.k}','${id}',this.checked)"><span>${v15E(l)}<small>${v15E(t)}</small></span>${(sug[s.k]||[]).indexOf(id)>-1?'<span class="v15-tag ai">Suggested</span>':''}</label>`).join('')}</div>` : '';
    return `<div class="v15-srow${on?' on':''}" data-v15-survey="${s.k}"><div class="v15-sh"><label class="v15-chk"><input type="checkbox" ${on?'checked':''} onchange="v15Use('${s.k}',this.checked)"><span><b>${v15E(s.name)}</b><small>${s.draft ? 'Draft survey · no responses yet' : s.resp+' responses · '+s.qs.length+' questions'}</small></span></label>
      ${on ? `<span class="v15-seg" data-v15-mode="${s.k}"><button class="${!only?'on':''}" onclick="v15Mode('${s.k}','all')">All questions</button><button class="${only?'on':''}" onclick="v15Mode('${s.k}','only')">Only these</button></span>` : ''}</div>${qs}</div>`; }).join('');
  const n = Object.keys(p.scope).length;
  return `<div class="v15-cols"><div class="v15-main"><div class="v15-card"><div class="v15-ch"><h3>Which surveys should their insights come from?</h3><p>Pick every survey this persona cares about. For each one, use all its questions or only some.</p></div>${rows}
      <div class="v15-sum" data-v15-sum>${n} survey${n===1?'':'s'} selected</div></div></div>
    <aside class="v15-aside"><div class="v15-card v15-pad"><h3>When to use "Only these"</h3><p>When a team owns a few questions in a longer survey, like a checkout team in a store survey. Their insights then come only from those questions, so the rest of the visit isn't in their feed.</p></div>
      <div class="v15-card v15-pad"><h3>Already handled for you</h3><p><b>Responses:</b> each person only gets insights from responses they can already see.</p><p><b>Personal data:</b> never used, for every persona. <a onclick="v15S.edit=null;v15Tab('rules')">See data rules</a></p></div></aside></div>`;
}
function v15Step3(){
  const p = v15S.edit, g = v15Grp(p.group), sm = V15_SAMPLE[p.id], ks = Object.keys(p.scope);
  const ed = n=>`<a onclick="v15Step(${n})">Edit</a>`;
  return `<div class="v15-cols"><div class="v15-main">
    <div class="v15-card v15-pad"><h3>How often</h3><span class="v15-seg" data-v15-freq>${[['daily','Daily'],['weekly','Weekly'],['monthly','Monthly']].map(([k,l])=>`<button class="${p.freq===k?'on':''}" onclick="v15S.edit.freq='${k}';v15Render()">${l}</button>`).join('')}</span>
      <p class="v15-note">${v15FreqText(p)}, in each person's time zone. People can change this for themselves.</p>
      <div class="v15-flex"><span><b>Email digest</b><small>The top insights by email, linking back to the feed. People can turn it off.</small></span><button class="v15-toggle${p.email?' on':''}" data-v15-email onclick="v15S.edit.email=!v15S.edit.email;v15Render()" aria-label="Email digest"></button></div></div>
    <div class="v15-card" data-v15-review><div class="v15-rv"><div><h4>Persona</h4><b>${v15E(p.name||'Untitled')}</b> · ${v15E(p.group||'No user group')} · ${g[2]} people</div>${ed(1)}</div>
      <div class="v15-rv"><div><h4>Helps them with</h4>${v15E(p.resp||'Not set')}</div>${ed(1)}</div>
      <div class="v15-rv"><div><h4>Surveys</h4>${ks.length ? ks.map(k=>`${v15E(v15Srv(k).name)}: ${v15ScopeText(p,k)}`).join('<br>') : 'None selected'}</div>${ed(2)}</div>
      <div class="v15-rv"><div><h4>Delivery</h4>${v15FreqText(p)} · email ${p.email?'on':'off'}</div></div></div></div>
    <aside class="v15-aside"><div class="v15-card v15-pad"><h3>Preview as one person</h3><p class="v15-note">${v15E(p.group==='Store managers'?'Store manager, Store 14':p.group==='Area managers'?'Area manager, North':'Someone in '+(p.group||'this group'))}</p>
      ${sm ? `<div class="v15-sample"><b class="k">${v15E(sm[0])}</b><b>${v15E(sm[1])}</b><span>${v15E(sm[2])}</span><small>${v15E(sm[3])}</small></div>` : '<p>A preview appears once a user group and surveys are chosen.</p>'}
      ${p.email ? `<p><b>Email subject</b> Your Survey Insights: ${sm ? v15E(sm[1].charAt(0).toLowerCase()+sm[1].slice(1)) : 'this week'}</p>` : ''}<p class="v15-note">Sample wording. Real insights use real responses.</p></div></aside></div>`;
}
function v15BarHTML(){
  const st = v15S.step, p = v15S.edit, ok = p.name && p.group && Object.keys(p.scope).length;
  const back = st===1 ? `<button class="v14-b" onclick="v15Home()">Cancel</button>` : `<button class="v14-b" onclick="v15Step(${st-1})">Back</button>`;
  const next = st<3 ? `<button class="v14-b pri" data-v15-next onclick="v15Step(${st+1})">Continue</button>`
    : `<button class="v14-b" data-v15-draft onclick="v15Save('draft')">Save as draft</button><button class="v14-b pri" data-v15-live onclick="v15AskLive()" ${ok?'':'disabled title="Add a name, a user group and at least one survey"'}>${p.status==='live'&&!p.isNew?'Save changes':'Go live'}</button>`;
  return `<div class="v15-bar">${back}<span>${next}</span></div>`;
}
function v15ConfirmHTML(){
  const p = v15S.edit, g = v15Grp(p.group);
  return `<div class="v15-scrim" data-v15-confirm><div class="v15-pop"><h3>Go live for ${g[2]} people?</h3><p>${v15E(p.group)} start getting insights from the next update, ${v15FreqText(p).toLowerCase()}${p.email?', by email and in their feed':', in their feed'}. You can switch back to draft at any time.</p>
    <div class="v15-flex end"><button class="v14-b" onclick="v15S.confirm=false;v15Render()">Cancel</button><button class="v14-b pri" data-v15-go onclick="v15Save('live')">Go live</button></div></div></div>`;
}

/* ── behaviour ── */
function v15Render(){
  const l = document.getElementById('v15-layer'); if(!l) return;
  const pg = l.querySelector('.v15-page'), keep = pg ? pg.scrollTop : 0;
  l.innerHTML = v15S.screen==='edit' ? v15Shell(v15EditHTML(), v15BarHTML()) + (v15S.confirm ? v15ConfirmHTML() : '') : v15Shell(v15HomeHTML()) + (v15S.pick ? v15PickHTML() : '');
  const np = l.querySelector('.v15-page'); if(np) np.scrollTop = keep;
}
function v15Top(){ const p = document.querySelector('#v15-layer .v15-page'); if(p) p.scrollTop = 0; }
function v15Home(){ v15S.screen = 'home'; v15S.edit = null; v15S.confirm = false; if(!v15S.personas.length && v15S.tab!=='rules') v15S.tab = 'suggest'; v15Render(); v15Top(); }
function v15Tab(t){ v15S.screen = 'home'; v15S.tab = t; v15Render(); v15Top(); }
function v15Step(n){ v15S.step = n; v15Render(); v15Top(); }
function v15Edit(id, fromSuggest, step){
  const src = v15S.personas.filter(p=>p.id===id)[0] || (fromSuggest ? V15_SEED.filter(p=>p.id===id)[0] : null); if(!src) return;
  v15S.edit = JSON.parse(JSON.stringify(src)); if(fromSuggest){ v15S.edit.isNew = true; v15S.edit.status = 'draft'; }
  v15S.screen = 'edit'; v15S.step = step || 1; v15Render(); v15Top();
}
function v15New(){ v15S.edit = {id:'n'+Date.now(), isNew:true, name:'', group:'', role:'', resp:'', extra:'', scope:{}, freq:'weekly', email:true, status:'draft'}; v15S.screen = 'edit'; v15S.step = 1; v15Render(); v15Top(); }
function v15Use(k, on){ const s = v15S.edit.scope; if(on) s[k] = 'all'; else delete s[k]; v15Render(); }
function v15Mode(k, m){ const sug = (V15_SUGGEST[v15S.edit.id]||{})[k]; v15S.edit.scope[k] = m==='all' ? 'all' : (sug ? sug.slice() : []); v15Render(); }
function v15Q(k, id, on){ const a = v15S.edit.scope[k]; if(!Array.isArray(a)) return; const i = a.indexOf(id); if(on && i<0) a.push(id); if(!on && i>-1) a.splice(i,1); v15Render(); }
function v15AskLive(){ if(v15S.edit.status==='live' && !v15S.edit.isNew){ v15Save('live'); return; } v15S.confirm = true; v15Render(); }
function v15Save(status){
  const p = v15S.edit; p.status = status; const isNew = p.isNew; delete p.isNew;
  const i = v15S.personas.findIndex(x=>x.id===p.id); if(i>-1) v15S.personas[i] = p; else v15S.personas.push(p);
  v15S.confirm = false; v15S.screen = 'home'; v15S.tab = 'personas'; v15S.edit = null;
  v15Toast(status==='live' ? `${p.name} is live for ${v15Grp(p.group)[2]} people` : `${p.name||'Persona'} saved as draft`);
}
function v15Toast(t){ v15S.toast = t; v15Render(); setTimeout(()=>{ if(v15S && v15S.toast===t){ v15S.toast = ''; v15Render(); } }, 2200); }
function v15Reset(mode){ v15S = v15Fresh(mode); v15Render(); v15Top(); }
function v15Open(mode, tab){
  let l = document.getElementById('v15-layer');
  if(!l){ l = document.createElement('div'); l.id = 'v15-layer'; document.body.appendChild(l); }
  v15S = v15Fresh(mode||'exist'); if(tab) v15S.tab = tab;
  v15Render(); l.classList.add('show'); document.body.style.overflow = 'hidden';
}
function v15Close(){ const l = document.getElementById('v15-layer'); if(l){ l.classList.remove('show'); l.innerHTML = ''; } if(!document.querySelector('#v12-layer.show')) document.body.style.overflow = ''; }

/* ── entry 1: settings gear in the left rail, shown to admins (journey state "Day 0 · Admin setup") ── */
function v15AdminMode(on){
  const rail = document.getElementById('rail-insights'), host = rail && rail.parentElement; if(!host) return;
  let g = document.getElementById('rail-settings');
  if(on && !g){ host.insertAdjacentHTML('beforeend', `<div class="rail-ico" id="rail-settings" style="margin-top:auto" title="Settings" onclick="v15Open('first')">${V14_I.gear}</div>`); }
  if(!on && g) g.remove();
  const j = document.getElementById('v15-journey'); if(j) j.classList.toggle('active', !!on);
}
function v15Journey(){
  setJourney('returning');
  document.querySelectorAll('.journey-btn[data-state]').forEach(b=>b.classList.remove('active'));
  v15AdminMode(true); v15Open('first');
}
(function v15Init(){
  const first = document.querySelector('.journey-btn[data-state="not-setup"]');
  if(first && !document.getElementById('v15-journey')){
    first.insertAdjacentHTML('beforebegin', '<button class="journey-btn" id="v15-journey" onclick="v15Journey()">Day 0 · Admin setup</button>');
    document.addEventListener('click', e=>{ if(e.target.closest && e.target.closest('.journey-btn[data-state]')) v15AdminMode(false); }, true);
  }
})();

/* ── entry 2: a survey's Settings tab (Option 2 journey) shows the personas that use this survey ── */
const _v15Tabs = v12TabsHTML;
v12TabsHTML = function(active){
  return _v15Tabs.apply(this, arguments).replace(`data-v12-tab="settings" onclick="toast('Not part of this prototype')"`, `data-v12-tab="settings" onclick="v12Go('settings')"`);
};
v14SurveyBar = function(){
  const a = v12Step==='insights' ? 'insights' : v12Step==='settings' ? 'settings' : 'overview';
  return `<header class="v14-sbar"><span class="v14-sname">Store experience survey <i class="v14-dot" title="Active"></i></span>${v12TabsHTML(a)}</header>`;
};
function v15SurveySettingsHTML(){
  const ps = V15_SEED.filter(p=>p.scope.store);
  return v12Shell(`<div class="v14-ph"><h1>Settings</h1></div>
    <div class="v15-ss"><nav class="v15-ssnav">${['General','Notifications','Survey Insights','Data retention'].map(n=>`<a class="${n==='Survey Insights'?'on':''}" ${n==='Survey Insights'?'':`onclick="toast('Not part of this prototype')"`}>${n}</a>`).join('')}</nav>
      <div class="v15-card v15-pad" data-v15-survey-settings><div class="v15-flex"><span><h3>Who gets insights from this survey</h3><p>Personas are set up in global settings and can cover many surveys. These ${ps.length} use this one.</p></span>
        <span class="v15-flex" style="gap:8px"><button class="v14-b" data-v15-manage onclick="v15Open('exist','surveys')">Manage in settings</button><button class="v14-b pri" onclick="v15Open('exist','surveys')">Add a persona</button></span></div>
        <table class="v15-tbl"><thead><tr><th>Persona</th><th>People</th><th>Questions used</th><th>Status</th></tr></thead><tbody>
        ${ps.map(p=>`<tr><td><b>${v15E(p.name)}</b></td><td>${v15Grp(p.group)[2]}</td><td>${p.scope.store==='all' ? 'All questions' : p.scope.store.map(id=>v15E(V15_SURVEYS[0].qs.filter(q=>q[0]===id)[0][1])).join(', ')}</td><td><span class="v15-st ${p.status}">${p.status==='live'?'Live':'Draft'}</span></td></tr>`).join('')}</tbody></table></div></div>`);
}
const _v15Render = v12Render;
v12Render = function(){
  const l = document.getElementById('v12-layer');
  if(l && v12Step==='settings'){ l.innerHTML = v15SurveySettingsHTML(); return; }
  return _v15Render.apply(this, arguments);
};
