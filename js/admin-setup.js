/* ═══ Admin setup (flow prefix dja): per survey and user group, the admin briefs the AI, marks insight fields
   (Prefer / Restrict, unmarked = allowed) and sets delivery. Opens as a layer in the CFM shell from a prototype-bar button.
   Startup call djaInit() lives in js/main.js. No real customer data: every name below is illustrative. ═══ */

const DJA_STEPS = [['target','1 User group'],['objective','2 Objective'],['scope','3 Insight fields'],['delivery','4 Delivery frequency'],['review','5 Review and save']];
const DJA_GROUPS = [['Store Manager','Sees own store',214],['Area Manager','Sees own region',38],['Central CX team','Sees all stores',6],['CX head','Sees all stores',4]];
const DJA_PRESETS = [
  {k:'store', name:'Store Manager, weekly', sub:'Own-store view · checkout, staff, cleanliness first', p:3, r:2, used:'Used by 1 setup', group:'Store Manager'},
  {k:'area', name:'Area Manager, weekly', sub:'Region view · compares stores, flags outliers', p:5, r:1, used:'Used by 1 setup', group:'Area Manager'},
  {k:'cx', name:'Central CX, monthly', sub:'All-store view · themes and trends', p:6, r:0, used:'Used by 1 setup', group:'Central CX team'},
  {k:'cc', name:'Contact-centre lead', sub:'Agent and call fields first', p:4, r:3, used:'Not used yet', group:''}];
const DJA_Q = [['q1','Overall satisfaction','Rating 1 to 5'],['q2','Likelihood to recommend','NPS 0 to 10'],['q3','What could we improve?','Open text'],['q4','Checkout speed','Rating 1 to 5'],['q5','Staff helpfulness','Rating 1 to 5'],['q6','Store cleanliness','Rating 1 to 5'],['q7','Contact me about my feedback','Yes or no',1]];
const DJA_M = [
  ['Case',[['m1','Case status','Open, resolved, escalated',0]]],
  ['Profile',[['m2','Customer tier','Gold, Silver, Standard',1],['m3','Email address','Personal data',0]]],
  ['Transaction',[['m4','Purchase channel','In store, online, app',0],['m5','Basket value','Amount in local currency',1]]],
  ['Response',[['m6','Response channel','Email, QR, kiosk',0],['m7','Survey language','Language answered in',0]]],
  ['Hierarchy',[['m8','Store','Store name and code',0],['m9','Region','Sales region',1]]]];
const DJA_DAYS = ['M','T','W','T','F','S','S'], DJA_DAYN = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DJA_EX = ['Fix issues in my store','Coach my team','Compare stores in my area','Report to the CX head'];

function djaFresh(){
  return {screen:'empty', tab:'q', preset:null, group:'Store Manager', toast:'', setups:[], collapsed:{}, confirm:null, max:0,
    brief:{role:'They run one store day to day and answer to an area manager.',
      resp:'Fixing issues at the till and on the shop floor, scheduling shifts, recognising staff. Anything bigger, like pricing or supplier problems, goes to their area manager.',
      extra:'Keep it short. Weekends are our busiest days, so flag anything that affects Saturday and Sunday trading.'},
    fields:{}, freq:'weekly', every:1, days:[0], time:'08:00', digest:true, digestOwn:false, inc:{top3:true,alerts:true,bright:false}, savePreset:true};
}
var djaS = djaFresh();
function djaSeedSetups(){ djaS.setups = [
  {g:'Store Manager', sees:'Sees own store', n:214, preset:'Store Manager, weekly', when:'2 days ago', live:true},
  {g:'Area Manager', sees:'Sees own region', n:38, preset:'Area Manager, weekly', when:'1 week ago', live:true},
  {g:'Central CX team', sees:'Sees all stores', n:6, preset:'', when:'Today', live:false, missing:['Insight fields','Delivery frequency']},
  {g:'CX head', sees:'Sees all stores', n:4, preset:null, when:'', live:null}]; }
function djaMarks(k){ return Object.keys(djaS.fields).filter(function(x){return djaS.fields[x]===k;}).length; }
function djaApplyPreset(p){
  djaS.preset = p;
  djaS.fields = {}; if(p && p.k==='store'){ djaS.fields = {q1:'p',q2:'p',q3:'p',q7:'r',m3:'r'}; djaS.group = 'Store Manager'; djaS.days = [0,3]; djaS.freq = 'custom'; }
  else if(p){ djaS.group = p.group || djaS.group; }
}
function djaGroupN(){ var g = DJA_GROUPS.filter(function(x){return x[0]===djaS.group;})[0]; return g ? g[2] : 0; }
function djaFreqText(){
  var s = djaS, d = s.days.slice().sort().map(function(i){return DJA_DAYN[i];});
  if(s.freq==='daily') return 'every day, '+s.time;
  if(s.freq==='fortnightly') return 'every two weeks on '+(d[0]||'Monday')+', '+s.time;
  if(s.freq==='monthly') return 'on the first workday of each month, '+s.time;
  if(s.freq==='custom') return 'every '+(s.every>1?s.every+' weeks':'week')+' on '+d.join(' and ')+', '+s.time+' (custom)';
  return 'every week on '+(d[0]||'Monday')+', '+s.time;
}

/* ── shell ── */
function djaEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function djaShell(inner){
  var I = V14_I, nav = [['Feed',0],['Followed',0],['Shared',0],['-'],['Configure',0],['My email',0],['Admin setup',1]];
  return '<div class="hm-proto"><b>Prototype · Admin setup</b>'
    +'<button data-dja-go="empty" onclick="djaReset(\'empty\')">First visit</button><button data-dja-go="matrix" onclick="djaReset(\'matrix\')">Setups exist</button>'
    +'<button style="margin-left:auto" data-dja-close onclick="djaClose()">✕ Back to Survey Insights</button></div>'
    +'<div class="v14-app"><nav class="v14-rail"><span class="v14-logo">✱</span><a>'+I.bars+'</a><a>'+I.list+'</a><a>'+I.ticket+'</a><a class="on" title="Survey Insights">'+I.ins+'</a>'
    +'<span class="v14-rail-end"><a>'+I.gear+'</a><a>'+I.bell+'</a><span class="v14-me">D</span></span></nav>'
    +'<div class="dja-set"><nav class="dja-snav" data-dja-subnav><p class="dja-snh">Survey Insights</p>'+nav.map(function(x){return x[0]==='-'?'<hr>':'<a class="'+(x[1]?'on':'')+'">'+x[0]+(x[1]?'<small>Admins</small>':'')+'</a>';}).join('')+'</nav>'
    +'<div class="dja-page"><div class="dja-wrap">'+inner+'</div></div></div></div>'
    +(djaS.toast?'<div class="dja-toast">'+djaEsc(djaS.toast)+'</div>':'');
}
function djaStepBar(cur){
  return '<div class="dja-hd"><h1>Admin setup</h1><span class="dja-pill">Store experience · '+djaEsc(djaS.group)+' ▾</span><span class="dja-hact">'+djaNeed()+'<button class="dja-b dja-sm" data-dja-savedraft onclick="djaPublish(true)">Save as draft</button><button class="dja-b pri dja-sm" data-dja-golive onclick="djaAskLive()" '+(djaMissing().length?'disabled title="Finish the remaining steps first"':'')+'>Go live</button><button class="dja-link" onclick="djaGo(\'matrix\')">Back to setups</button></span></div>'
    +'<div class="dja-steps">'+DJA_STEPS.map(function(s){return '<button class="'+(s[0]===cur?'on':'')+'" data-dja-step="'+s[0]+'" onclick="djaGo(\''+s[0]+'\')">'+s[1]+'</button>';}).join('')+'</div>';
}
function djaFoot(back, next, nextLabel, extra){
  return '<div class="dja-foot"><button class="dja-b" onclick="djaGo(\''+back+'\')">'+(back==='matrix'?'Cancel':'Back')+'</button><span>'+(extra||'')+'<button class="dja-b pri" onclick="djaGo(\''+next+'\')">'+nextLabel+'</button></span></div>';
}

/* ── screens ── */
function djaEmptyHTML(){
  return '<div class="dja-hd"><h1>Insights setup</h1></div><div class="dja-card"><div class="dja-empty"><h2>Nothing is set up yet</h2>'
    +'<p>Pick the user group this survey is for, tell the AI their role and responsibilities, then choose which fields it may use. It takes a few minutes per setup.</p>'
    +'<button class="dja-b pri" data-dja-first onclick="djaGo(\'start\')">Start your first setup</button></div></div>';
}
function djaMatrixHTML(){
  var rows = djaS.setups.map(function(s,i){
    var pr = s.preset ? djaEsc(s.preset)+'<small>Preset used to prefill</small>' : (s.preset===''?'No preset<small>Set up from scratch</small>':'<span class="dja-note">None yet</span>');
    return '<tr><td class="num">'+(i+1)+'</td><td><b>'+djaEsc(s.g)+'</b><small>'+djaEsc(s.sees)+'</small></td><td>'+s.n+'</td><td>'+pr+'</td><td>'+(s.when?djaEsc(s.when):(s.preset===null?'<button class="dja-b dja-sm" onclick="djaStartFor(\''+djaEsc(s.g)+'\')">+ Set up</button>':''))+'</td><td>'+(s.live===null?'':'<span class="dja-state"><button class="dja-toggle'+(s.live?' on':'')+'" data-dja-live="'+i+'" onclick="djaSetLive('+i+')" '+(!s.live&&s.missing&&s.missing.length?'style="opacity:.45"':'')+' aria-label="Live or draft"></button><b class="'+(s.live?'l':'')+'">'+(s.live?'Live':'Draft')+'</b>'+(!s.live&&s.missing&&s.missing.length?'<small class="dja-inc">Finish '+s.missing.length+' step'+(s.missing.length>1?'s':'')+' to go live</small>':'')+'</span>')+'</td></tr>';
  }).join('');
  return '<div class="dja-hd"><h1>Setups in this survey</h1><span class="dja-pill">Store experience ▾</span><button class="dja-b pri" style="margin-left:auto" data-dja-new onclick="djaGo(\'start\')">New setup</button></div>'
    +'<p class="dja-sub">One survey, one setup per user group. Each group gets its own insight fields, and sees only the responses it already has access to.</p>'
    +'<div class="dja-card"><table class="dja-tbl" data-dja-matrix><thead><tr><th>#</th><th>User group</th><th>People</th><th>Started from</th><th>Updated</th><th>Status</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}
function djaStartHTML(){
  return (djaS.setups.length?djaMatrixHTML():djaEmptyHTML())
    +'<div class="dja-scrim" data-dja-start onclick="if(event.target===this)djaGo(\''+(djaS.setups.length?'matrix':'empty')+'\')"><div class="dja-pop"><h3>How do you want to start?</h3><div class="dja-pick">'
    +'<button data-dja-pick="preset" onclick="djaGo(\'presets\')"><b>Start using a preset</b><span>Begin from a saved setup. It prefills the objective, metadata fields and frequency, and you can change anything.</span></button>'
    +'<button data-dja-pick="scratch" onclick="djaApplyPreset(null);djaGo(\'target\')"><b>Start from scratch</b><span>Set the brief, fields and delivery yourself, for this survey only.</span></button></div></div></div>';
}
function djaPresetsHTML(){
  var rows = DJA_PRESETS.map(function(p){ var on = djaS.preset && djaS.preset.k===p.k;
    return '<div class="dja-prow'+(on?' on':'')+'" data-dja-preset="'+p.k+'" onclick="djaPickPreset(\''+p.k+'\')"><span class="dja-radio"></span><span><b>'+p.name+'</b><small>'+p.sub+'</small>'
      +'<span class="dja-meta"><span class="tag acc">'+p.p+' preferred</span><span class="tag neg">'+p.r+' restricted</span><span>'+p.used+'</span></span></span></div>'; }).join('');
  return '<div class="dja-hd"><h1>Choose a preset</h1></div><p class="dja-sub">A preset is a saved starting point. It prefills the setup. The setup is then its own copy, so editing either one later does not change the other.</p>'
    +'<div class="dja-cols"><div class="dja-main"><div class="dja-card"><div class="dja-tabs"><div><button class="on">Suggested for '+djaEsc(djaS.group)+'</button><button>All</button><button>Recently used</button></div><input class="dja-search" placeholder="Search presets"></div>'
    +rows+'<div class="dja-prow'+(djaS.preset===null&&djaS.blank?' on':'')+'" data-dja-preset="blank" onclick="djaS.blank=1;djaApplyPreset(null);djaRender()"><span class="dja-radio"></span><span><b>Start blank</b><small>Set the fields yourself, for this survey only</small></span></div></div></div>'
    +'<aside class="dja-aside"><div class="dja-card dja-pad"><h3>What this preset carries</h3><p class="dja-note">Store Manager, weekly · updated 2 days ago</p>'
    +'<p><b>Brief</b> Role and responsibilities for Store Managers</p><p><b>Frequency</b> Weekly</p><p><b>Metadata fields</b> always carried over.</p><p><b>Question choices</b> carried over only when this is the same survey the preset was saved from. Otherwise you pick questions in step 3.</p>'
    +'<p class="dja-note">Prefilled copy: later edits to the preset do not change this setup, and the reverse. Fields it names that this survey does not have are flagged in step 3.</p></div></aside></div>'
    +'<div class="dja-foot"><button class="dja-b" onclick="djaGo(\'start\')">Back</button><button class="dja-b pri" data-dja-use onclick="djaGo(\'target\')" '+(djaS.preset||djaS.blank?'':'disabled')+'>Use this preset</button></div>';
}
function djaTargetHTML(){
  var info = djaS.preset ? '<div class="dja-info" data-dja-onpreset>This setup is prefilled from the preset <b>'+djaEsc(djaS.preset.name)+'</b>. Adjust anything. Your changes stay in this setup and do not change the preset.</div>' : '';
  return djaStepBar('target')+info+'<div class="dja-cols"><div class="dja-main"><h2 class="dja-h2">Who is this setup for?</h2>'
    +'<p class="dja-sub">You are setting this up inside the Store experience survey, so a setup is for one user group in this survey. Everyone in the group gets the same objective, fields and schedule, each seeing only the rows they already have access to.</p>'
    +'<div class="dja-card dja-pad"><div class="dja-kv"><span>Survey</span><span><b>Store experience</b><br><span class="dja-note">14 questions · 9 metadata fields (6 standard, 3 custom)</span></span>'
    +'<span>User group</span><span><span class="dja-groups">'+DJA_GROUPS.map(function(g){return '<button class="dja-chip'+(djaS.group===g[0]?' on':'')+'" data-dja-group="'+g[0]+'" onclick="djaS.group=\''+g[0]+'\';djaRender()">'+g[0]+'</button>';}).join('')+'</span>'
    +'<br><span class="dja-note">Groups come from your existing user groups and access. '+djaGroupN()+' people are in '+djaEsc(djaS.group)+'.</span></span></div></div>'
    +djaFoot('matrix','objective','Continue to objective')+'</div>'
    +'<aside class="dja-aside"><div class="dja-card dja-pad"><h3>Data access is automatic</h3><p>You do not set who sees which responses. It is based on the granular data governance set for this survey.</p>'
    +'<p><b>Store Manager</b> at Store 14 sees responses from Store 14 only.</p><p><b>Area Manager</b> for North region sees all stores in North.</p><p class="dja-note">Mock-up note: in the product these examples are taken from the survey\'s real data governance and this setup\'s user groups, not typed in.</p></div>'
    +'<div class="dja-card dja-pad"><h3>What you will set next</h3><p>Their role and what they are responsible for</p><p>Which fields the AI may use</p><p>Review, preview as a user, save</p></div></aside></div>';
}
function djaObjectiveHTML(){
  var g = djaEsc(djaS.group), b = djaS.brief;
  return djaStepBar('objective')+'<div class="dja-cols"><div class="dja-main"><h2 class="dja-h2">Brief the AI on '+g+'s</h2>'
    +'<p class="dja-sub">Three short questions, answered in your own words. The AI turns your answers into standing directives for this group and saves them in the preset.</p>'
    +'<div class="dja-card"><div class="dja-chat">'
    +'<div class="dja-ai">I will generate insights for <b style="display:inline">'+g+'s</b> on the Store experience survey. I only need two things from you, and a third if you want to add more.</div>'
    +'<div class="dja-ai"><b>1. What is their role?</b></div><div class="dja-me" data-dja-a="role">'+djaEsc(b.role)+'</div>'
    +'<div class="dja-ai"><b>2. What are they responsible for in how your organisation runs?</b>Tell me the actions or decisions that sit with them, so I only share insights they can act on.</div><div class="dja-me" data-dja-a="resp">'+djaEsc(b.resp)+'</div>'
    +'<div class="dja-ai"><b>3. Is there anything else you would like to add?</b>Anything I should know or keep in mind for this group. You can skip this.</div><div class="dja-me" data-dja-a="extra">'+djaEsc(b.extra)+'</div>'
    +'<div class="dja-groups">'+DJA_EX.map(function(x){return '<button class="dja-chip" onclick="djaS.brief.resp=\''+x+'.\';djaRender()">'+x+'</button>';}).join('')+'</div></div>'
    +'<div class="dja-comp"><input id="dja-in" placeholder="Type or speak your answer" onkeydown="if(event.key===\'Enter\')djaSay()"><button class="dja-b pri dja-sm" onclick="djaSay()">Send</button></div></div>'
    +'<div class="dja-card dja-pad"><h3>What the AI will do for '+g+'s</h3><ul class="dja-dirs"><li><b>Speak to</b> someone who runs a single store and reports to an area manager</li><li><b>Lead with</b> issues they can fix themselves: tills, shop floor, shifts, recognition</li><li><b>Recommend only</b> actions within their control</li><li><b>Pass up</b> pricing and supplier issues as something to raise with the area manager, not as a fix</li><li><b>Keep it</b> short, and flag anything affecting weekend trading</li></ul><p class="dja-note">Not right? Change your answers above and these update.</p></div>'
    +djaFoot('target','scope','Continue to insight fields')+'</div>'
    +'<aside class="dja-aside"><div class="dja-card dja-pad"><h3>Sample insight, as a Store Manager would see it</h3>'
    +'<div class="dja-sample"><b class="k">Fix this first</b><b>Saturday evening queues are pulling your checkout score down</b><span>Checkout speed averaged 3.6 on Saturdays 5 to 8pm, against 4.2 on weekdays. 18 of the 41 low-scoring comments mention waiting for a free till.</span><span><b>Try:</b> open a second till on Saturday evenings and check next Saturday\'s score.</span><span class="dja-note">Store 14 · last 4 weeks · 41 comments</span></div>'
    +'<div class="dja-sample"><b class="k w">Passed up to your area manager</b><span>Shelf prices not matching the till came up 9 times. This is outside store control, so it is shared with your Area Manager instead of listed as your fix.</span></div>'
    +'<p class="dja-note">Illustrative wording. Real insights use real responses and follow the brief you gave.</p></div>'
    +'<div class="dja-card dja-pad"><h3>Users can add to this</h3><p>Each Store Manager can add personal goals on top. The objective you set here stays the default for the whole group.</p></div></aside></div>';
}
function djaSeg(key, restrictOnly){
  var v = djaS.fields[key];
  return '<span class="dja-seg" data-dja-seg="'+key+'"><button class="'+(v==='p'?'on':'')+'" onclick="djaMark(\''+key+'\',\'p\')">Prefer</button><button class="'+(v==='r'?'on neg':'')+'" onclick="djaMark(\''+key+'\',\'r\')">Restrict</button></span>';
}
function djaScopeHTML(){
  var q = djaS.tab==='q', rows;
  var bulk = '<div class="dja-bulk" data-dja-bulk><button class="dja-b dja-sm" onclick="djaRestrictPersonal()">Restrict all personal data</button><button class="dja-b dja-sm" onclick="djaClear()">Clear</button><span class="dja-note">2 personal-data fields found: Email address, Contact me about my feedback</span></div>';
  if(q) rows = DJA_Q.map(function(r){ return '<tr><td><b>'+r[1]+'</b><small>'+r[2]+'</small></td><td>'+djaSeg(r[0])+'</td></tr>'; }).join('');
  else rows = DJA_M.map(function(g){ var cl = djaS.collapsed[g[0]]; return '<tr class="dja-ph dja-click" data-dja-group-row="'+g[0]+'" onclick="djaFold(\''+g[0]+'\')"><td colspan="2"><span class="dja-car">'+(cl?'▸':'▾')+'</span>'+g[0]+' · '+g[1].length+'</td></tr>'
      +(cl?[]:g[1]).map(function(r){ return '<tr><td><b>'+r[1]+(r[3]?'<span class="dja-tag">Custom</span>':'')+'</b><small>'+r[2]+'</small></td><td>'+djaSeg(r[0])+'</td></tr>'; }).join(''); }).join('');
  var np = djaMarks('p'), nr = djaMarks('r');
  return djaStepBar('scope')+'<div class="dja-cols"><div class="dja-main"><h2 class="dja-h2">Which columns can the AI use?</h2>'
    +'<p class="dja-sub">Prefer the fields that matter most for this group, restrict the ones it must never use. Anything you leave unmarked is allowed by default.</p>'
    +'<div class="dja-legend"><span class="p"><b>Prefer</b> look here first</span><span><b>Unmarked</b> allowed by default</span><span class="r"><b>Restrict</b> never used in insights</span></div>'
    +'<div class="dja-card"><div class="dja-tabs"><div><button data-dja-tab="q" class="'+(q?'on':'')+'" onclick="djaS.tab=\'q\';djaRender()">Questions · 7</button><button data-dja-tab="m" class="'+(q?'':'on')+'" onclick="djaS.tab=\'m\';djaRender()">Metadata · 9</button></div><input class="dja-search" placeholder="Search fields"></div>'
    +bulk+'<table class="dja-tbl"><thead><tr><th>Field</th><th>For insights</th></tr></thead><tbody>'+rows+'</tbody></table>'
    +'<div class="dja-sumbar" data-dja-sum>'+np+' preferred · '+nr+' restricted · the rest allowed by default</div></div>'
    +djaFoot('objective','delivery','Continue to delivery frequency')+'</div>'
    +'<aside class="dja-aside"><div class="dja-card dja-pad"><h3>Suggested for this user group</h3><p>Based on this survey and the Store Manager group.</p>'
    +'<div class="dja-sample"><span><b>Prefer</b> Checkout speed, because it is the most discussed service factor.</span></div><div class="dja-sample"><span><b>Restrict</b> Email address and Contact me, personal data a store manager does not need.</span></div>'
    +'<span class="dja-foot" style="justify-content:flex-start;gap:8px"><button class="dja-b pri dja-sm" onclick="djaS.fields.q4=\'p\';djaS.fields.m3=\'r\';djaS.fields.q7=\'r\';djaRender()">Apply suggestions</button><button class="dja-b dja-sm" onclick="djaToast(\'Suggestions ignored\')">Ignore</button></span></div>'
    +'<div class="dja-card dja-pad"><h3>Rows are not set here</h3><p>Columns decide what the AI looks at. Which responses it reads, such as one store only, comes from each user\'s access.</p></div></aside></div>';
}
function djaDeliveryHTML(){
  var s = djaS, f = [['daily','Daily'],['weekly','Weekly'],['fortnightly','Fortnightly'],['monthly','Monthly'],['custom','Custom']];
  var custom = s.freq==='custom' ? '<div class="dja-box" data-dja-custom><div class="dja-row"><label class="dja-field">Repeat every<input type="number" min="1" max="8" value="'+s.every+'" onchange="djaS.every=Math.max(1,+this.value||1);djaRender()"></label><span class="dja-note" style="padding-bottom:10px">week(s) on</span><div class="dja-days">'
    +DJA_DAYS.map(function(d,i){return '<button class="'+(s.days.indexOf(i)>-1?'on':'')+'" onclick="djaDay('+i+')">'+d+'</button>';}).join('')+'</div></div></div>' : '';
  var nx = s.days.slice().sort(), nextTxt = nx.length ? 'Next refresh: '+DJA_DAYN[nx[0]]+' '+s.time+(nx.length>1?', then '+DJA_DAYN[nx[1]]+' '+s.time+'…':'.') : 'Pick at least one day.';
  var g = djaEsc(djaS.group);
  return djaStepBar('delivery')+'<div class="dja-cols"><div class="dja-main"><h2 class="dja-h2">When do '+g+'s get their insights?</h2>'
    +'<p class="dja-sub">Set how often the feed refreshes and whether a digest also goes by email. Both are saved in the preset.</p>'
    +'<div class="dja-card dja-pad"><h3>Delivery frequency</h3><p>How often new insights are delivered to the feed, and to email if the digest is on.</p>'
    +'<span class="dja-seg" data-dja-freq>'+f.map(function(x){return '<button class="'+(s.freq===x[0]?'on':'')+'" onclick="djaS.freq=\''+x[0]+'\';djaRender()">'+x[1]+'</button>';}).join('')+'</span>'+custom
    +'<div class="dja-row"><label class="dja-field">Time<select onchange="djaS.time=this.value;djaRender()">'+['06:00','08:00','12:00','17:00'].map(function(t){return '<option'+(t===s.time?' selected':'')+'>'+t+'</option>';}).join('')+'</select></label><label class="dja-field">Time zone<select><option>Each user\'s own</option></select></label></div>'
    +'<p class="dja-note" data-dja-next>'+nextTxt+' Users see the latest insights in their feed from then.</p></div>'
    +'<div class="dja-card dja-pad"><div class="dja-flex"><span><h3>Email digest</h3><p>A short email that links back to the feed.</p></span><button class="dja-toggle'+(s.digest?' on':'')+'" data-dja-digest onclick="djaS.digest=!djaS.digest;djaRender()" aria-label="Email digest"></button></div>'
    +(s.digest?'<div class="dja-box"><label class="dja-line" onclick="djaS.digestOwn=false;djaRender()"><span class="dja-radio" style="'+(!s.digestOwn?'border-color:var(--accent)':'')+'">'+(!s.digestOwn?'<i style="width:8px;height:8px;border-radius:50%;background:var(--accent)"></i>':'')+'</span><span><b>Same schedule as the feed</b><small>Sent right after each refresh.</small></span></label>'
      +'<label class="dja-line" onclick="djaS.digestOwn=true;djaRender()"><span class="dja-radio" style="'+(s.digestOwn?'border-color:var(--accent)':'')+'">'+(s.digestOwn?'<i style="width:8px;height:8px;border-radius:50%;background:var(--accent)"></i>':'')+'</span><span><b>Its own schedule</b><small>Choose a different day and time for the email.</small></span></label>'
      +'<div><b style="font-size:12.5px">Include</b><div class="dja-groups" style="margin-top:6px">'+[['top3','Top 3 insights'],['alerts','Alerts raised since the last email'],['bright','Bright spots']].map(function(x){return '<button class="dja-chip'+(s.inc[x[0]]?' on':'')+'" onclick="djaS.inc.'+x[0]+'=!djaS.inc.'+x[0]+';djaRender()">'+(s.inc[x[0]]?'✓ ':'')+x[1]+'</button>';}).join('')+'</div></div>'
      +'<p class="dja-note">Goes to the '+djaGroupN()+' people in this group. Each person can turn the email off or move its day.</p></div>':'')+'</div>'
    +djaFoot('scope','review','Continue to review')+'</div>'
    +'<aside class="dja-aside"><div class="dja-card dja-pad"><h3>Email preview, as a Store Manager would get it</h3><p><b>Subject</b> Your Store experience insights · Store 14</p>'
    +'<div class="dja-sample"><b>3 things for your store</b><span>1. Saturday evening queues are pulling your checkout score down</span><span>2. Staff helpfulness held steady</span><span>3. Weekend trading: 2 low scores on Sunday</span><span><b>Open your feed</b></span></div><p class="dja-note">Illustrative wording. Real emails use real responses and follow the brief.</p></div>'
    +'<div class="dja-card dja-pad"><h3>Users can adjust</h3><p>Each person can turn their email off or change its day. The feed refresh time stays as you set it.</p></div></aside></div>';
}
function djaMissing(){ // steps the admin has not passed yet (user group and review are not counted)
  if(djaS.screen==='review') return [];
  return DJA_STEPS.filter(function(x,i){ return i>0 && i<4 && i>=djaS.max; }).map(function(x){ return x[1].replace(/^\d /,''); });
}
function djaAskLive(){ var m = djaMissing(); if(m.length){ djaToast('Finish '+m.join(', ')+' before going live'); return; } djaS.confirm = {row:null, missing:[]}; djaRender(); }
function djaNeed(){ var m = djaMissing(); return m.length ? '<span class="dja-need" data-dja-need>Finish to go live: '+m.map(djaEsc).join(', ')+'</span>' : ''; }
function djaConfirmHTML(){
  var c = djaS.confirm, r = c.row!==null ? djaS.setups[c.row] : null, g = r ? r.g : djaS.group, n = r ? r.n : djaGroupN(), m = c.missing||[];
  var inc = '';
  return '<div class="dja-scrim" data-dja-confirm><div class="dja-pop"><h3>Go live for '+n+' people?</h3>'+inc+'<p class="dja-sub">'+djaEsc(g)+'s will start getting insights from the next refresh, '+DJA_DAYN[djaS.days.slice().sort()[0]||0]+' '+djaS.time+'. You can switch this setup back to Draft from the list at any time.</p><div class="dja-foot" style="justify-content:flex-end"><button class="dja-b" onclick="djaS.confirm=null;djaRender()">Cancel</button><button class="dja-b pri" data-dja-confirm-go onclick="'+(r?'djaLiveRow('+c.row+')':'djaPublish()')+'">Publish</button></div></div></div>';
}
function djaReviewHTML(){
  var s = djaS, b = s.brief, np = djaMarks('p'), nr = djaMarks('r'), pr = s.preset;
  var edit = function(k){ return '<a onclick="djaGo(\''+k+'\')">Edit</a>'; };
  return djaStepBar('review')+'<div class="dja-cols"><div class="dja-main"><h2 class="dja-h2">Review your setup</h2><p class="dja-sub">Check each part, then see what two different people in this group would get.</p>'
    +'<div class="dja-card"><div class="dja-rv"><div><h4>For</h4><b>Store experience · '+djaEsc(s.group)+'</b> · '+djaGroupN()+' people</div>'+edit('target')+'</div>'
    +'<div class="dja-rv"><div><h4>Brief for the AI</h4><b>Role:</b> '+djaEsc(b.role.toLowerCase())+'<br><b>Responsible for:</b> '+djaEsc(b.resp.charAt(0).toLowerCase()+b.resp.slice(1))+'<br><b>Also:</b> '+djaEsc(b.extra.charAt(0).toLowerCase()+b.extra.slice(1))+'</div>'+edit('objective')+'</div>'
    +'<div class="dja-rv"><div><h4>Insight fields</h4><span class="tag acc">'+np+' preferred</span> <span class="tag neg">'+nr+' restricted</span><br><span class="dja-note">Restrict is a hard wall users cannot override. Prefer is a default users can adjust.</span></div>'+edit('scope')+'</div>'
    +'<div class="dja-rv"><div><h4>Delivery</h4><b>Delivery frequency:</b> '+djaFreqText()+'<br><b>Email digest:</b> '+(s.digest?'on, '+(s.digestOwn?'own schedule':'same schedule')+', to everyone in the group':'off')+'</div>'+edit('delivery')+'</div>'
    +(pr?'<div class="dja-rv" data-dja-linked><div><h4>Started from preset: '+djaEsc(pr.name)+'</h4>Used only to prefill this setup. This setup is its own copy, so editing it does not change the preset.</div></div>':'')+'</div>'
    +'<div class="dja-card dja-pad"><div class="dja-flex"><span><h3>Save as a preset</h3><p>'+(pr?djaEsc(pr.name):djaEsc(s.group)+', '+(s.freq==='custom'?'custom':s.freq))+'</p></span><button class="dja-toggle'+(s.savePreset?' on':'')+'" onclick="djaS.savePreset=!djaS.savePreset;djaRender()" aria-label="Save as a preset"></button></div>'
    +'<p class="dja-note">Saves a copy of the brief, metadata fields and delivery settings. Question choices are saved too and carry over only when a setup uses the same survey. The preset only prefills future setups. Editing it later does not change setups already made.</p></div>'
    +'<div class="dja-foot"><button class="dja-b" onclick="djaGo(\'delivery\')">Back</button><span><button class="dja-b" data-dja-draft onclick="djaPublish(true)">Save as draft</button><button class="dja-b pri" data-dja-publish onclick="djaAskLive()" '+(djaMissing().length?'disabled':'')+'>Publish and start creating insights</button></span></div></div>'
    +'<aside class="dja-aside"><div class="dja-card dja-pad"><h3>Preview as a user</h3><span class="dja-groups"><button class="dja-chip on">Store Manager, Store 14</button><button class="dja-chip">Area Manager, North</button></span>'
    +'<p class="dja-note">Built from Store 14\'s actual responses, last 7 days</p>'
    +'<div class="dja-sample"><span class="dja-note">Insight 1 of 3</span><b>Checkout wait is your biggest drag this week</b><span>Checkout speed fell from 4.1 to 3.6 in your store. Fix it first, then check next week.</span></div>'
    +'<div class="dja-sample"><span class="dja-note">Insight 2 of 3</span><b>Staff helpfulness held steady</b><span>No change worth acting on. Keep doing what you did last week.</span></div>'
    +'<div class="dja-ok">Rows: Store 14 only, from this person\'s access</div><div class="dja-ok">Columns: '+(djaS.fields.m3==='r'?'Email address ':'')+(djaS.fields.q7==='r'?'and Contact me ':'')+'never used</div><div class="dja-ok">Switch to Area Manager to see the same survey across North region</div></div></aside></div>';
}

/* ── behaviour ── */
function djaRender(){
  var l = document.getElementById('dja-layer'); if(!l) return;
  var sc = djaS.screen, h = {empty:djaEmptyHTML, matrix:djaMatrixHTML, start:djaStartHTML, presets:djaPresetsHTML, target:djaTargetHTML, objective:djaObjectiveHTML, scope:djaScopeHTML, delivery:djaDeliveryHTML, review:djaReviewHTML}[sc]();
  var keep = (l.querySelector('.dja-page')||{}).scrollTop || 0;
  l.innerHTML = djaShell(h + (djaS.confirm ? djaConfirmHTML() : ''));
  var pg = l.querySelector('.dja-page'); if(pg) pg.scrollTop = keep;
  l.querySelectorAll('[data-dja-go]').forEach(function(b){ b.classList.toggle('on', (b.dataset.djaGo==='empty') === (djaS.setups.length===0)); });
}
function djaGo(s){ var ix = DJA_STEPS.map(function(x){return x[0];}).indexOf(s); if(ix>djaS.max) djaS.max = ix; djaS.screen = s; djaS.toast = ''; djaRender(); var p = document.querySelector('#dja-layer .dja-page'); if(p) p.scrollTop = 0; }
function djaReset(mode){ var keep = djaS.screen; djaS = djaFresh(); if(mode==='matrix') djaSeedSetups(); djaS.screen = mode; djaRender(); }
function djaLiveRow(i){ var r = djaS.setups[i]; r.live = true; djaS.confirm = null; djaToast('Live for '+r.n+' people'); }
function djaSetLive(i){ var r = djaS.setups[i]; if(!r) return; if(!r.live){ if(r.missing&&r.missing.length){ djaToast('Finish '+r.missing.join(', ')+' before going live'); return; } djaS.confirm = {row:i, missing:[]}; djaRender(); return; } r.live = false; djaToast(r.live ? 'Live for '+r.n+' people' : 'Switched to Draft'); }
function djaFold(g){ djaS.collapsed[g] = !djaS.collapsed[g]; djaRender(); }
function djaRestrictPersonal(){ djaS.fields.m3 = 'r'; djaS.fields.q7 = 'r'; djaRender(); }
function djaClear(){ var m = djaS.tab==='q' ? /^q/ : /^m/; Object.keys(djaS.fields).forEach(function(k){ if(m.test(k)) delete djaS.fields[k]; }); djaRender(); }
function djaPickPreset(k){ djaS.blank = 0; djaApplyPreset(DJA_PRESETS.filter(function(p){return p.k===k;})[0]); djaRender(); }
function djaStartFor(g){ djaS.group = g; djaGo('start'); }
function djaMark(k, v){ if(djaS.fields[k]===v) delete djaS.fields[k]; else djaS.fields[k] = v; djaRender(); }
function djaDay(i){ var a = djaS.days, at = a.indexOf(i); if(at>-1){ if(a.length>1) a.splice(at,1); } else a.push(i); djaRender(); }
function djaSay(){
  var i = document.getElementById('dja-in'); if(!i || !i.value.trim()) return;
  djaS.brief.extra = i.value.trim(); djaRender();
}
function djaToast(t){ djaS.toast = t; djaRender(); setTimeout(function(){ djaS.toast=''; var l=document.getElementById('dja-layer'); if(l&&l.classList.contains('show')) djaRender(); }, 1800); }
function djaPublish(draft){
  var g = DJA_GROUPS.filter(function(x){return x[0]===djaS.group;})[0], rec = {g:g[0], sees:g[1], n:g[2], preset:djaS.preset?djaS.preset.name:'', when:'Today', live:!draft, missing:djaMissing()};
  djaS.setups = djaS.setups.filter(function(x){return x.g!==rec.g;}); djaS.setups.push(rec);
  djaS.confirm = null; djaS.screen = 'matrix'; djaS.toast = draft ? 'Draft saved' : 'Published to '+g[2]+' people'; djaRender();
  setTimeout(function(){ djaS.toast=''; var l=document.getElementById('dja-layer'); if(l&&l.classList.contains('show')) djaRender(); }, 1800);
}
function djaOpen(){
  var l = document.getElementById('dja-layer');
  if(!l){ l = document.createElement('div'); l.id = 'dja-layer'; document.body.appendChild(l); }
  djaS = djaFresh(); djaRender(); l.classList.add('show'); document.body.style.overflow = 'hidden';
}
function djaClose(){ var l = document.getElementById('dja-layer'); if(l){ l.classList.remove('show'); l.innerHTML = ''; } document.body.style.overflow = ''; }
function djaOpenSetups(){ djaOpen(); djaSeedSetups(); djaS.screen = 'matrix'; djaRender(); }
function djaInit(){ // entry point: "Admin setup" in the Survey Insights left menu, below Configure and My email (admins only in product)
  var nav = document.getElementById('si-subnav');
  if(nav && !document.getElementById('dja-nav')){
    nav.insertAdjacentHTML('beforeend','<hr><button class="sn-i dim" id="dja-nav" onclick="djaOpenSetups()"><svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 12l2 2 4-4"/></svg><span class="sn-t">Admin setup</span><span class="dja-adm">Admins</span></button>');
  }
  var ref = document.getElementById('open-in-survey') || document.getElementById('open-card-types');
  if(!ref || document.getElementById('open-admin-setup')) return;
  ref.insertAdjacentHTML('beforebegin', '<button class="journey-btn" id="open-admin-setup" onclick="djaOpen()">⚙ Admin setup</button>');
}
