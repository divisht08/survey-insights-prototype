/* ═══ v23 (3 Nov) — "Customise my feed": the user's 3 steps on top of the admin's setup.
   Pradeep: admin does the major lift, the user does basic edits, in a flow like the admin's 3 steps.
   Add only (Nadav: add, don't restrict): what the admin set is shown locked; the user adds a focus note,
   topics to watch, breakdowns, and chooses how often and where. Matches the admin setup's own copy:
   people add a line about their goals and change delivery; they can't change surveys or questions.
   Replaces the old Configure drawer. ═══ */

const V23_TOPICS = ['Checkout & payments','Cleanliness','Fitting rooms','Staff','Stock & sizes','Promotions','Pricing','Delivery','Refunds','Parking'];
const V23_FIELDS = [['Store',true],['Country',true],['Product category',true],['City',false],['Visit type',false],['Loyalty tier',false]];
const V23_HINTS = [[/weekend|saturday|sunday/i,'Weekend trading'],[/staff|team|rota|shift|cover/i,'Staff'],[/fitting/i,'Fitting rooms'],[/clean|tidy|mess/i,'Cleanliness'],
  [/checkout|till|queue|pay/i,'Checkout & payments'],[/size|stock/i,'Stock & sizes'],[/offer|promo|discount/i,'Promotions'],[/price|expensive/i,'Pricing'],
  [/deliver/i,'Delivery'],[/refund|return/i,'Refunds'],[/park/i,'Parking'],[/new|first|emerging/i,'New issues first']];
const V23_STARTERS = ['Weekend staffing matters most to me','I’m fixing fitting-room cleanliness this month','Tell me about anything new first'];
let v23 = null;
function v23Fresh(){
  return {step:1, msgs:[], topics:[], fields:V23_FIELDS.filter(f=>f[1]).map(f=>f[0]), freq:'weekly', day:'Sunday', time:'08:00',
    email:true, slack:false, teams:false, slackCh:'#rt-atyaf-store', saved:false};
}
let v23Saved = null;   // what the user last saved; shown under the feed header
function v23Admin(){ return (typeof V15_SEED!=='undefined' && V15_SEED.find(p=>p.id==='sm')) || {name:'Store manager', role:'', resp:'', extra:''}; }
function v23Surveys(){ if(typeof v20Surveys==='function'){ const l = v20Surveys().map(o=>o[1]); if(l.length) return l; } return ['Store experience survey']; }
const v23E = s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const V23_LOCK = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>';

function v23Open(){
  v23 = v23Saved ? JSON.parse(JSON.stringify(v23Saved)) : v23Fresh(); v23.step = 1;
  if(!v23.msgs.length){ const a = v23Admin();
    v23.msgs.push({r:'ai', t:`Your admin set you up as <b>${v23E(a.name)}</b>: ${v23E(a.resp)} That decides your surveys and questions. Is there anything you want your insights to focus on as well?`}); }
  let l = document.getElementById('v23-layer');
  if(!l){ l = document.createElement('div'); l.id = 'v23-layer'; document.body.appendChild(l); }
  l.classList.add('show'); v23Render();
}
function v23Close(){ const l = document.getElementById('v23-layer'); if(l){ l.classList.remove('show'); l.innerHTML = ''; } }
function v23Step(n){ v23.step = n; v23Render(); const pg = document.querySelector('#v23-layer .v23-page'); if(pg) pg.scrollTop = 0; }

/* step 1: your focus, as a chat */
function v23Send(text){
  const t = String(text||'').trim(); if(!t) return;
  v23.msgs.push({r:'me', t:v23E(t)});
  const found = V23_HINTS.filter(([re])=>re.test(t)).map(h=>h[1]).filter(x=>v23.topics.indexOf(x)<0);
  found.forEach(x=>v23.topics.push(x));
  v23.msgs.push({r:'ai', t: found.length
    ? `Got it. On top of your admin's setup, I'll also watch <b>${found.map(v23E).join('</b> and <b>')}</b> and put insights about ${found.length>1?'them':'it'} first. You can change this in the next step.`
    : `Noted. I'll keep that in mind when I write your insights. If there's a topic you want to watch, name it, for example “checkout” or “fitting rooms”.`});
  v23.note = (v23.note ? v23.note + ' ' : '') + t;
  v23Render();
}
function v23Step1(){
  const a = v23Admin();
  const msgs = v23.msgs.map(m=>`<div class="v23-m ${m.r}">${m.r==='ai'?'<span class="v23-ai">✦</span>':''}<p>${m.t}</p></div>`).join('');
  return `<div class="v15-cols"><div class="v15-main">
    <div class="v15-card v15-pad"><h3>Your focus</h3><p class="v15-note">Tell Copilot what matters to you right now. It adds to what your admin set; it doesn't replace it.</p>
      <div class="v23-chat">${msgs}</div>
      <div class="v23-starters">${V23_STARTERS.map(s=>`<button onclick="v23Send(this.textContent)">${v23E(s)}</button>`).join('')}</div>
      <div class="v23-in"><input id="v23-in" placeholder="For example: weekends are my busiest days" onkeydown="if(event.key==='Enter')v23Send(this.value)"><button class="v14-b pri" onclick="v23Send(document.getElementById('v23-in').value)">Send</button></div>
      ${v23.topics.length ? `<p class="v23-got">Added to your focus: ${v23.topics.map(x=>`<span class="v23-tag">${v23E(x)}</span>`).join('')}</p>` : ''}</div></div>
    <aside class="v15-aside"><div class="v15-card v15-pad"><div class="v15-flex"><h3>Your role</h3><span class="v23-lock">${V23_LOCK} Set by your admin</span></div><p><b>${v23E(a.name)}</b></p><p>${v23E(a.role)}</p><p>${v23E(a.resp)}</p>${a.extra?`<p class="v15-note">${v23E(a.extra)}</p>`:''}</div>
      <div class="v15-card v15-pad"><h3>What you can change</h3><p>Add your own focus, topics to watch and how insights are broken down, and choose how and when you get them.</p><p class="v15-note">Your surveys and questions come from your admin. To change them, ask your admin.</p></div></aside></div>`;
}

/* step 2: what's in your feed */
function v23Toggle(list, v){ const a = v23[list], i = a.indexOf(v); if(i<0) a.push(v); else a.splice(i,1); v23Render(); }
function v23Step2(){
  const topics = V23_TOPICS.concat(v23.topics.filter(t=>V23_TOPICS.indexOf(t)<0));
  return `<div class="v15-cols"><div class="v15-main">
    <div class="v15-card v15-pad"><div class="v15-flex"><h3>Surveys and questions</h3><span class="v23-lock">${V23_LOCK} Set by your admin</span></div>
      ${v23Surveys().map(s=>`<div class="v23-row v23-lk"><span>${v23E(s)}</span><small>All questions</small></div>`).join('')}</div>
    <div class="v15-card v15-pad"><h3>Topics to watch</h3><p class="v15-note">Insights about these come first in your feed. Everything else your admin set still appears.</p>
      <div class="v15-chips">${topics.map(t=>`<button class="v15-chip${v23.topics.indexOf(t)>-1?' on':''}" onclick="v23Toggle('topics','${v23E(t).replace(/'/g,'&#39;')}')">${v23.topics.indexOf(t)>-1?'✓ ':''}${v23E(t)}</button>`).join('')}</div></div>
    <div class="v15-card v15-pad"><h3>Break insights down by</h3><p class="v15-note">Used in “Where it happened” and when Copilot looks for patterns.</p>
      ${V23_FIELDS.map(([f,adm])=>adm
        ? `<label class="v23-chk v23-lk"><input type="checkbox" checked disabled><span>${v23E(f)}</span><small>${V23_LOCK} Set by your admin</small></label>`
        : `<label class="v23-chk"><input type="checkbox" ${v23.fields.indexOf(f)>-1?'checked':''} onchange="v23Toggle('fields','${v23E(f)}')"><span>${v23E(f)}</span></label>`).join('')}</div></div>
    <aside class="v15-aside"><div class="v15-card v15-pad"><h3>Add, not remove</h3><p>You can add topics and breakdowns. Anything your admin set stays in your feed, so nobody misses an issue that matters to the team.</p></div></aside></div>`;
}

/* step 3: how you get it, and review */
function v23Step3(){
  const ch = (k,l,sub)=>`<div class="v15-flex v23-ch"><span><b>${l}</b><small>${sub}</small></span><button class="v15-toggle${v23[k]?' on':''}" onclick="v23.${k}=!v23.${k};v23Render()"></button></div>`;
  const added = v23.topics.length ? v23.topics.map(v23E).join(', ') : 'None';
  const fieldsAdded = v23.fields.filter(f=>!V23_FIELDS.find(x=>x[0]===f && x[1]));
  return `<div class="v15-cols"><div class="v15-main">
    <div class="v15-card v15-pad"><h3>How often</h3>
      <span class="v15-seg">${[['daily','Daily'],['weekly','Weekly']].map(([k,l])=>`<button class="${v23.freq===k?'on':''}" onclick="v23.freq='${k}';v23Render()">${l}${k==='weekly'?' · admin default':''}</button>`).join('')}</span>
      <div class="v23-when">${v23.freq==='weekly' ? `<label>Day<select onchange="v23.day=this.value">${['Sunday','Monday','Thursday'].map(d=>`<option ${v23.day===d?'selected':''}>${d}</option>`).join('')}</select></label>` : ''}
        <label>Time<select onchange="v23.time=this.value">${['07:00','08:00','09:00'].map(t=>`<option ${v23.time===t?'selected':''}>${t}</option>`).join('')}</select></label></div>
      <p class="v15-note">Each update compares with the ${v23.freq==='daily'?'average of the previous 7 days':'previous period of the same length'}.</p></div>
    <div class="v15-card v15-pad"><h3>Where you get them</h3>
      <div class="v15-flex v23-ch"><span><b>Survey Insights feed</b><small>Always on</small></span><span class="v23-lock">${V23_LOCK}</span></div>
      ${ch('email','Email digest','Your top insights, linking back to the feed')}
      ${ch('slack','Slack','Posts your top insights to a channel or to you')}
      ${v23.slack ? `<input class="v23-sl" value="${v23E(v23.slackCh)}" oninput="v23.slackCh=this.value">` : ''}
      ${ch('teams','Microsoft Teams','Posts your top insights to a channel or chat')}</div>
    <div class="v15-card"><div class="v15-rv"><div><h4>Your focus</h4>${v23.note ? v23E(v23.note) : 'Nothing added'}</div><a onclick="v23Step(1)">Edit</a></div>
      <div class="v15-rv"><div><h4>Topics to watch</h4>${added}</div><a onclick="v23Step(2)">Edit</a></div>
      <div class="v15-rv"><div><h4>Extra breakdowns</h4>${fieldsAdded.length ? fieldsAdded.map(v23E).join(', ') : 'None'}</div><a onclick="v23Step(2)">Edit</a></div>
      <div class="v15-rv"><div><h4>Delivery</h4>${v23.freq==='daily'?'Daily':'Weekly on '+v23.day} at ${v23.time} · feed${v23.email?', email':''}${v23.slack?', Slack':''}${v23.teams?', Teams':''}</div></div></div></div>
    <aside class="v15-aside"><div class="v15-card v15-pad"><h3>When it applies</h3><p>From your next update. Insights already in your feed don't change.</p><p class="v15-note">You can come back here any time from Configure.</p></div></aside></div>`;
}

function v23Save(){
  v23.saved = true; v23Saved = JSON.parse(JSON.stringify(v23)); v23Close();
  v23Line();
  if(typeof toast==='function') toast('Saved. Your changes apply from your next update.');
}
function v23Line(){
  const bar = document.getElementById('edition-bar'); if(!bar) return;
  let l = document.getElementById('v23-line');
  if(!v23Saved || (!v23Saved.topics.length && !v23Saved.note)){ if(l) l.remove(); return; }
  const txt = v23Saved.topics.length ? `Watching first: ${v23Saved.topics.map(v23E).join(', ')}` : 'Your focus note is applied';
  if(!l){ bar.insertAdjacentHTML('afterend', `<p id="v23-line" class="v23-line"></p>`); l = document.getElementById('v23-line'); }
  l.innerHTML = `${txt} · from your next update <a onclick="v23Open()">Edit</a>`;
}

const V23_STEPS = [[1,'Your focus'],[2,'What’s in your feed'],[3,'How you get it']];
function v23Render(){
  const l = document.getElementById('v23-layer'); if(!l || !v23) return;
  const st = v23.step;
  const body = st===1 ? v23Step1() : st===2 ? v23Step2() : v23Step3();
  const back = st===1 ? `<button class="v14-b" onclick="v23Close()">Cancel</button>` : `<button class="v14-b" onclick="v23Step(${st-1})">Back</button>`;
  const next = st<3 ? `<button class="v14-b pri" onclick="v23Step(${st+1})">Continue</button>` : `<button class="v14-b pri" data-v23-save onclick="v23Save()">Save</button>`;
  l.innerHTML = `<div class="v23-page"><div class="v15-wrap">
      <div class="v15-hd"><div><p class="v15-crumb"><a onclick="v23Close()">Survey Insights</a> › Configure</p><h1>Customise my feed</h1>
        <p class="v15-sub">Your admin set up your insights. Add what matters to you on top.</p></div><button class="v23-x" onclick="v23Close()" title="Close">✕</button></div>
      <div class="v15-steps">${V23_STEPS.map(([n,t])=>`<button class="${st===n?'on':''}${st>n?' done':''}" onclick="v23Step(${n})"><span>${st>n?'✓':n}</span>${t}</button>`).join('')}</div>
      ${body}</div></div>
    <div class="v15-bar v23-bar">${back}<span>${next}</span></div>`;
  const inp = document.getElementById('v23-in'); if(inp && st===1) inp.focus();
  const chat = l.querySelector('.v23-chat'); if(chat) chat.scrollTop = chat.scrollHeight;
}

/* Configure opens this flow instead of the old drawer */
const _v23Drawer = openDrawer;
openDrawer = function(name){ if(name==='configure') return v23Open(); return _v23Drawer.apply(this, arguments); };
const _v23Vis = applyFeedVisibility;
applyFeedVisibility = function(){ const r = _v23Vis.apply(this, arguments); v23Line(); return r; };
