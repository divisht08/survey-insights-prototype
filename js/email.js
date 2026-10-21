/* ═══ DEEP LINKS FROM EMAIL — survey-insights-feed.html?src=email&insight=…&action=… ═══
   Actions run here, after the page has loaded and the user is signed in — never on the link itself,
   because email security scanners pre-open links and would otherwise follow/close insights by accident. */
function showEmailBanner(html){
  const header = document.getElementById('page-h1').parentElement;
  const old = document.getElementById('email-landing-banner'); if(old) old.remove();
  const b = document.createElement('div');
  b.id = 'email-landing-banner';
  b.style.cssText = 'margin:14px 24px 0;padding:10px 14px;border-radius:10px;background:#e9f2ff;border:1px solid #d6e7ff;color:#0b3d82;font-size:12.5px;line-height:1.5;display:flex;gap:10px;align-items:flex-start';
  b.innerHTML = `<span style="flex:none">✉</span><span style="flex:1">${html}</span><button onclick="this.parentElement.remove()" style="border:0;background:none;color:#0b3d82;cursor:pointer;font-size:14px;line-height:1">×</button>`;
  header.parentElement.insertBefore(b, header);
}
function handleDeepLink(q){
  q = q || new URLSearchParams(location.search);
  if(!q.get('src') && !q.get('insight')) return;
  const id = q.get('insight'), action = q.get('action') || 'investigate', view = q.get('view');
  const digestKey = q.get('digest');
  const digestName = {'store-weekly':'Store Manager weekly digest', 'area-weekly':'Area Manager weekly regional digest', 'leadership-monthly':'Leadership monthly summary'}[digestKey] || 'your email digest';
  const back = 'email';
  const edId = q.get('ed'), edObj = edId ? EDITIONS.find(e=>e.id===edId) : null;
  const oldEd = edObj && edId!==CURRENT_EDITION;
  const sentTxt = q.get('sent') ? (q.get('sent')==='Preview' ? ' · preview' : ' · sent '+q.get('sent')) : '';
  let msg = `Opened from your email · <b>${digestName}</b>${sentTxt}.`;
  if(q.get('updated')) msg += ' <b>Updated since your email:</b> this insight has been refreshed — you\'re seeing the latest figures, which may differ from the email.';
  if(q.get('fwd')) msg += ' This link was forwarded to you — access is checked for <b>you</b>, the person opening it, not the original recipient.';
  if(q.get('sso')) msg += ' You signed in first, and were brought straight back to the insight from the email.';
  const gone = id && oldEd && !inCurrentEdition(id) && edObj.ids.includes(id);
  if(oldEd && !gone){ 
    msg += ` You're seeing this insight as it is now.`; }
  if(gone) msg += ` You're seeing this insight as it is now. It is not significant in the latest update.`;
  else if(id && !INSIGHT_META[id]) msg = `Opened from your email · <b>${digestName}</b>. <b>The insight in that email is no longer available.</b> Here is your current feed.`;
  if(q.get('src')==='email') showEmailBanner(msg + ` <a href="#" data-back-email onclick="openJourney('${back}');return false" style="color:#1a73e8;font-weight:600;margin-left:4px">← Back to email</a>`);
  if(gone){ segNav('insights'); openInvestigate(id); return; }

  if(view && view!=='feed') segNav(view);
  if(!id || !INSIGHT_META[id]) return;
  if(action==='follow'){
    if(followed[id]){ toast('You already follow this insight'); segNav('followed'); return; }
    addToFollowed(id, {source:'feed'});
    segNav('followed');
    toastAction('Followed from your email — it\'s now in Followed', 'Undo', ()=>{
      removeFromFollowed(id);
      const ev = insightActivity[id] && insightActivity[id].events;
      if(ev){ for(let k=0;k<2;k++){ if(ev.length && ev[ev.length-1].type==='follow') ev.pop(); } }
    });
    return;
  }
  if(action==='done'){
    if(doneFeed.has(id)){ toast('Already marked done'); setFeedView('done'); return; }
    markDone(id);
    setTimeout(()=>setFeedView('done'), 200);
    return;
  }
  openInsightInFeed(id);
}
// not signed in → Sprinklr SSO first, then the deep link runs exactly as if the user had been signed in
function gateDeepLink(q){
  if(!q.get('sso')){ handleDeepLink(q); return; }
  const o = document.createElement('div');
  o.id = 'sso-gate';
  o.style.cssText = 'position:fixed;inset:0;z-index:200;background:#f0f1f2;display:flex;align-items:center;justify-content:center;font-family:Inter,system-ui,sans-serif';
  o.innerHTML = `<div style="background:#fff;border:1px solid #e4e7ee;border-radius:14px;box-shadow:0 10px 30px rgba(11,14,20,.08);padding:30px 32px;width:380px;text-align:center">
    <div style="font-family:Manrope,system-ui;font-weight:800;font-size:18px;color:#111318">Sign in to Sprinklr</div>
    <p style="font-size:12.5px;color:#6b7280;line-height:1.55;margin:8px 0 18px">You opened a link from your Survey Insights email. Sign in and we'll take you straight to that insight.</p>
    <button data-sso-continue style="width:100%;background:#111318;color:#fff;border:0;border-radius:8px;padding:10px;font-size:13px;font-weight:600;cursor:pointer">Continue with company SSO</button>
    <p style="font-size:11px;color:#9aa0a8;margin:12px 0 0">redtag.example · Single sign-on</p></div>`;
  document.body.appendChild(o);
  o.querySelector('[data-sso-continue]').onclick = ()=>{ o.remove(); handleDeepLink(q); };
}

/* ═══ EMAIL DIGEST JOURNEY — a review page opened from the prototype bar. Tabs follow permissions:
   a CX admin assigns digests; each user manages their own email within what the admin allows. ═══ */
let emTab = 'admin', emDigest = 'store-weekly', emVariant = 'edition', emPreviewAs = 'sara';
const EM_SENT = '2026-09-27';
const DIGESTS = [
  {id:'store-weekly', name:'Store Manager weekly digest', to:'Role · Store Manager', scope:"Each recipient's own store",
   when:"When the recipient's edition publishes", lang:"Each recipient's language", status:'Active', last:'Sun 27 Sep, 08:00 AST',
   sections:{edition:true, followed:true, shared:true}, quiet:'short', can:{pause:true, language:true, sections:true, off:false}},
  {id:'area-weekly', name:'Area Manager weekly regional digest', to:'Role · Area Manager', scope:"Each recipient's region",
   when:"When the recipient's edition publishes", lang:"Each recipient's language", status:'Active', last:'Sun 27 Sep, 08:00 AST',
   sections:{edition:true, followed:true, shared:true}, quiet:'short', can:{pause:true, language:true, sections:false, off:false}},
  {id:'leadership-monthly', name:'Leadership monthly summary', to:'User · Anish (VP, Customer Experience)', scope:'All stores',
   when:'First workday of the month, 08:00', lang:'English', status:'Active', last:'Tue 1 Sep, 08:00 AST',
   sections:{edition:true, followed:false, shared:false}, quiet:'skip', can:{pause:true, language:true, sections:true, off:true}}
];
const PREVIEW_AS = {sara:'Sara · Store Manager · RT ATYAF MALL', fatima:'Fatima Al-Rashid · Store Manager · RT SHUWAIKH'};
// the user's own settings for the digest assigned to her role, within what the admin allows
let myEmail = {paused:false, pausedUntil:'', language:'English', sections:{followed:true, shared:true}, personal:null};
let personalDraft = null;

const emToggle = (on, attrs, disabled)=>`<span class="em-tg${on?' on':''}${disabled?' dis':''}" ${attrs||''}><i></i></span>`;
const emLink = (label, qs, primary)=>`<a href="#" class="em-a${primary?' pri':''}" data-em-link="${qs}" onclick="openDeepLink('${qs}');return false">${label}</a>`;
function emQs(o){ return '?' + Object.entries(Object.assign({src:'email', digest:'store-weekly', sent:EM_SENT, ed:'e27'}, o)).map(([k,v])=>k+'='+encodeURIComponent(v)).join('&'); }

/* ── tab 1: admin assigns digests ── */
function emAdminHTML(){
  const d = DIGESTS.find(x=>x.id===emDigest) || DIGESTS[0];
  const rows = DIGESTS.map(x=>`<button class="em-row${x.id===d.id?' on':''}" data-em-digest="${x.id}" onclick="emDigest='${x.id}';renderEmail()">
      <span class="n">${x.name}</span><span>${x.to}</span><span>${x.when}</span><span class="st">${x.status}</span></button>`).join('');
  const sec = (k, label, sub, locked)=>`<label class="em-chk"><input type="checkbox" ${d.sections[k]?'checked':''} ${locked?'disabled':''} onchange="DIGESTS.find(x=>x.id==='${d.id}').sections['${k}']=this.checked"><span><b>${label}</b>${sub?`<small>${sub}</small>`:''}</span></label>`;
  const can = (k, label, sub)=>`<div class="em-can"><span><b>${label}</b>${sub?`<small>${sub}</small>`:''}</span>${emToggle(d.can[k], `data-em-can="${k}" onclick="DIGESTS.find(x=>x.id==='${d.id}').can['${k}']=!DIGESTS.find(x=>x.id==='${d.id}').can['${k}'];renderEmail()"`)}</div>`;
  return `<div class="em-perm" data-em-perm>Who sees this: <b>CX admins</b> with the Manage email digests permission. Store and area managers never see this page.</div>
    <div class="em-crumb">Settings › Survey Insights › Email digests</div>
    <div class="em-head"><h2>Email digests</h2><button class="btn-sec" onclick="toast('A new digest starts from the same settings below')">+ New digest</button></div>
    <div class="em-table"><div class="em-row hd"><span>Digest</span><span>Sent to</span><span>When</span><span>Status</span></div>${rows}</div>
    <div class="em-ed spr-card" data-em-editor="${d.id}">
      <h3>${d.name}</h3>
      <div class="em-grid">
        <div>
          <p class="em-l">Recipients</p>
          <div class="em-box"><span class="em-chip">${d.to}</span><button class="em-add" onclick="toast('Add a role or named users')">+ Add role or user</button></div>
          <p class="em-hint">${d.scope}. One digest, many recipients: Sara gets RT ATYAF MALL, Fatima gets RT SHUWAIKH, each limited to the data they can access.</p>
          <p class="em-l">What's in it</p>
          ${sec('edition', "This edition's insights", 'Up to 5, highest priority first', true)}
          ${sec('followed', 'Followed insights that changed', 'Only the ones with a new figure, evidence state or comment')}
          ${sec('shared', 'Shared with them', 'New shares since the last email')}
        </div>
        <div>
          <p class="em-l">When</p>
          <div class="em-box col"><b>${d.when}</b><small>${d.id==='leadership-monthly' ? 'A fixed schedule for a summary across stores.' : 'Follows each recipient\'s feed frequency, so the email always matches an edition.'}</small></div>
          <p class="em-l">In a quiet week</p>
          <div class="em-radio">
            <label><input type="radio" name="em-quiet" ${d.quiet==='short'?'checked':''} onchange="DIGESTS.find(x=>x.id==='${d.id}').quiet='short'"> Send a short "nothing new" email</label>
            <label><input type="radio" name="em-quiet" ${d.quiet==='skip'?'checked':''} onchange="DIGESTS.find(x=>x.id==='${d.id}').quiet='skip'"> Skip the email that week</label>
          </div>
          <p class="em-l">Language</p>
          <div class="em-box col"><b>${d.lang}</b><small>English or Arabic, from each user's profile.</small></div>
          <p class="em-l">What recipients can change</p>
          ${can('pause','Pause it','For a set time, for holidays or leave')}
          ${can('language','Change the language','')}
          ${can('sections','Choose sections','The edition\'s insights always stay in')}
          ${can('off','Turn it off','Off for role-assigned digests, so a role always gets its insights')}
        </div>
      </div>
      <div class="em-foot">
        <label class="em-prev">Preview as <select onchange="emPreviewAs=this.value">${Object.entries(PREVIEW_AS).map(([k,v])=>`<option value="${k}" ${emPreviewAs===k?'selected':''}>${v}</option>`).join('')}</select></label>
        <button class="btn-sec" data-em-preview onclick="emTab='email';renderEmail(true)">Preview email</button>
        <button class="btn-pri" data-em-save onclick="toast('Saved. Changes apply from the next email.')">Save</button>
        <span class="em-last">Last sent ${d.last}</span>
      </div>
    </div>`;
}

/* ── tab 2: a user manages her own email ── */
function emUserHTML(){
  const d = DIGESTS[0], m = myEmail;
  const sec = (k, label)=>`<label class="em-chk"><input type="checkbox" ${m.sections[k]?'checked':''} ${d.can.sections?'':'disabled'} onchange="myEmail.sections['${k}']=this.checked;toast('Saved')"><span><b>${label}</b></span></label>`;
  const pers = m.personal;
  const draft = personalDraft;
  return `<div class="em-perm" data-em-perm>Who sees this: <b>every user</b>, for their own email. What they can change is set by the admin.</div>
    <div class="em-crumb">Profile › Email · signed in as Sara, Store Manager, RT ATYAF MALL</div>
    <div class="em-head"><h2>My email</h2></div>
    <div class="em-card spr-card" data-em-assigned>
      <div class="em-ct"><div><h3>${d.name}</h3><p class="em-sub">Assigned by your CX team · arrives when your edition publishes, Sundays at 08:00 AST</p></div>
        <span class="tag ${m.paused?'wrn':'acc'}" data-em-state>${m.paused ? 'Paused until ' + m.pausedUntil : 'Active'}</span></div>
      <div class="em-cols">
        <div><p class="em-l">Sections</p>
          <label class="em-chk"><input type="checkbox" checked disabled><span><b>This edition's insights</b><small>Always included</small></span></label>
          ${sec('followed','Followed insights that changed')}${sec('shared','Shared with me')}</div>
        <div><p class="em-l">Language</p>
          <select class="em-sel" data-em-lang ${d.can.language?'':'disabled'} onchange="myEmail.language=this.value;toast('Your next email will be in '+this.value)">${['English','Arabic'].map(l=>`<option ${m.language===l?'selected':''}>${l}</option>`).join('')}</select>
          <p class="em-l">Pause</p>
          ${!d.can.pause ? `<p class="em-hint">Your CX team has not allowed pausing this email.</p>` : m.paused ? `<button class="btn-sec" data-em-resume onclick="myEmail.paused=false;renderEmail();toast('Resumed. Your next email arrives with the next edition.')">Resume now</button>`
            : `<div class="em-pause">${['1 week','2 weeks','Until I resume'].map(p=>`<button class="btn-sec" data-em-pause="${p}" onclick="myEmail.paused=true;myEmail.pausedUntil='${p==='1 week'?'Sun 11 Oct':p==='2 weeks'?'Sun 18 Oct':'you resume'}';renderEmail();toast('Paused')">${p}</button>`).join('')}</div>`}
          <p class="em-l">Turn off</p>
          <button class="btn-sec" data-em-off ${d.can.off?'':'disabled'} title="${d.can.off?'Stop this email':'Assigned to your role'}" onclick="toast('Turned off. You can turn it back on here.')">Turn off</button>
          <p class="em-hint">${d.can.off ? 'Your CX team allows turning this email off.' : 'This email is assigned to your role, so it can be paused but not turned off. Ask your CX team if you need it changed.'}</p></div>
      </div>
    </div>
    <div class="em-card spr-card" data-em-personal>
      ${pers ? `<div class="em-ct"><div><h3>My followed insights</h3><p class="em-sub">Personal digest · ${pers.when} · quiet weeks: ${pers.quiet==='skip'?'skipped':'one short email'}</p></div><span class="tag acc">Active</span></div>
          <p class="em-hint">Only the insights you follow, and only when one of them changes. <button class="em-inline" onclick="myEmail.personal=null;renderEmail();toast('Personal digest removed')">Remove</button></p>`
      : draft ? `<h3>New personal digest</h3>
          <p class="em-l">Include</p><label class="em-chk"><input type="checkbox" checked disabled><span><b>Followed insights that changed</b><small>Personal digests cover what you follow</small></span></label>
          <p class="em-l">How often</p><div class="em-radio">${['With each edition','Once a week','Once a month'].map(w=>`<label><input type="radio" name="em-pw" ${draft.when===w?'checked':''} onchange="personalDraft.when='${w}'"> ${w}</label>`).join('')}</div>
          <p class="em-l">In a quiet week</p><div class="em-radio"><label><input type="radio" name="em-pq" ${draft.quiet==='short'?'checked':''} onchange="personalDraft.quiet='short'"> One short email</label><label><input type="radio" name="em-pq" ${draft.quiet==='skip'?'checked':''} onchange="personalDraft.quiet='skip'"> Skip it</label></div>
          <div class="em-foot"><button class="btn-pri" data-em-create onclick="myEmail.personal=Object.assign({},personalDraft);personalDraft=null;renderEmail();toast('Personal digest created')">Create</button><button class="btn-sec" onclick="personalDraft=null;renderEmail()">Cancel</button></div>`
      : `<div class="em-ct"><div><h3>Personal digest</h3><p class="em-sub">Optional. An extra email about the insights you follow, on your own schedule.</p></div></div>
          <button class="btn-sec" data-em-new-personal onclick="personalDraft={when:'With each edition', quiet:'skip'};renderEmail()">+ Create a personal digest</button>`}
    </div>`;
}

/* ── tab 3: the email itself ── */
function emItem(id){
  const m = INSIGHT_META[id] || {}, lvl = (PRIORITY[id]||{}).level || 'low', p = cardParts(id);
  const num = (()=>{ const d = document.createElement('div'); d.innerHTML = p.stat; const n = d.querySelector('.ic-num'); const u = d.querySelector('.ic-unit'); return n ? `<b>${n.textContent}</b>${u ? ' ' + u.textContent : ''}` : ''; })();
  const sum = (()=>{ const d = document.createElement('div'); d.innerHTML = p.summary; return d.textContent.trim(); })();
  return `<div class="em-ins" data-em-item="${id}" style="border-left-color:${PRIO_DOT[lvl]}">
      <p class="em-k">${PRIO_LABEL[lvl]} · ${kindText(id)}</p>
      <p class="em-t">${m.title}</p><p class="em-s">${sum}</p>${num?`<p class="em-n">${num}</p>`:''}
      <p class="em-ls">${emLink('View insight', emQs({insight:id, action:'investigate'}), true)} ${emLink('Follow', emQs({insight:id, action:'follow'}))} ${emLink('Mark as done', emQs({insight:id, action:'done'}))}</p></div>`;
}
function emEmailHTML(){
  const who = emPreviewAs==='fatima' ? 'Fatima' : 'Sara', store = emPreviewAs==='fatima' ? 'RT SHUWAIKH' : 'RT ATYAF MALL';
  const variants = [['edition','A normal edition'],['quiet','A quiet week']].map(([v,l])=>`<button class="${emVariant===v?'on':''}" data-em-variant="${v}" onclick="emVariant='${v}';renderEmail()">${l}</button>`).join('');
  if(emPreviewAs==='fatima') return `<div class="em-perm" data-em-perm>Preview of what each recipient receives. Links open the app as that person.</div>
    <div class="lo-bar"><b>Preview as</b><span class="lo-pick">${Object.entries(PREVIEW_AS).map(([k,v])=>`<button class="${emPreviewAs===k?'on':''}" onclick="emPreviewAs='${k}';renderEmail()">${v.split(' · ')[0]}</button>`).join('')}</span></div>
    <div class="em-mail spr-card"><div class="em-mh"><p><b>Subject:</b> Your Sun 27 Sep insights · RT SHUWAIKH</p><p><b>To:</b> Fatima Al-Rashid</p></div>
      <div class="em-mb"><p class="em-hello">Hi Fatima,</p><p class="em-p">The same digest, built from RT SHUWAIKH's own edition. This prototype only has data for RT ATYAF MALL, so her insights are not shown here.</p></div></div>`;
  const order = ['INS-05','INS-04','INS-02','INS-06','INS-03'];
  const head = `<div class="em-perm" data-em-perm>Preview of what each recipient receives. Every link opens the app; try them.</div>
    <div class="lo-bar"><b>Preview as</b><span class="lo-pick">${Object.entries(PREVIEW_AS).map(([k,v])=>`<button class="${emPreviewAs===k?'on':''}" onclick="emPreviewAs='${k}';renderEmail()">${v.split(' · ')[0]}</button>`).join('')}</span>
      <b style="margin-left:14px">Email</b><span class="lo-pick">${variants}</span></div>`;
  if(emVariant==='quiet'){
    return head + `<div class="em-mail spr-card" data-em-mail="quiet">
      <div class="em-mh"><p><b>Subject:</b> No new findings this week · ${store} · Sun 4 Oct</p><p><b>From:</b> Sprinklr Survey Insights · <b>To:</b> ${who}</p></div>
      <div class="em-mb">
        <p class="em-edl">${store} · Sun 4 Oct edition</p>
        <p class="em-hello">Hi ${who},</p>
        <p class="em-p">Nothing new this week. Responses came in at your usual level, and none of them changed what is already known.</p>
        <p class="em-p">5 findings from earlier editions are still true, and your followed insight has not changed.</p>
        <p class="em-ls">${`<a href="#" class="em-a pri" data-em-open-quiet onclick="closeJourney();setJourney('quiet');return false">Open the edition</a>`}</p>
        <div class="em-ft">This email is a copy of the Sun 4 Oct edition and won't change. Store Manager weekly digest, assigned by your CX team. <a href="#" class="em-a" onclick="emTab='user';renderEmail(true);return false">Manage my email</a></div>
      </div></div>`;
  }
  const fol = Object.keys(followed).filter(id=>INSIGHT_META[id]);
  return head + `<div class="em-mail spr-card" data-em-mail="edition">
    <div class="em-mh"><p><b>Subject:</b> Your Sun 27 Sep insights · ${store} · 2 need attention</p><p><b>From:</b> Sprinklr Survey Insights · <b>To:</b> ${who}</p></div>
    <div class="em-mb">
      <p class="em-edl">${store} · Sun 27 Sep edition</p>
      <p class="em-hello">Hi ${who},</p>
      <p class="em-p">5 insights in this edition, 2 need attention. Next edition Sun 4 Oct.</p>
      ${order.map(emItem).join('')}
      ${fol.length ? `<p class="em-sh">Your followed insights</p>${fol.map(id=>{ const f = followed[id]; return `<div class="em-fol" data-em-followed="${id}"><span>${INSIGHT_META[id].title}</span><span class="em-fd">${f.since ? (f.since.same ? 'No change since you followed' : (f.since.dir==='down'?'▼ ':'▲ ') + f.since.delta + ' since you followed') : 'Followed'}</span>${emLink('View', emQs({insight:id, action:'investigate', view:'followed'}))}</div>`; }).join('')}` : ''}
      ${sharedWithMe.filter(s=>!s.dismissed).length ? `<p class="em-sh">Shared with you</p>${sharedWithMe.filter(s=>!s.dismissed).slice(0,2).map(s=>`<div class="em-fol"><span><b>${s.from}</b> shared: ${s.insightTitle}</span>${emLink('View', emQs({view:'shared'}))}</div>`).join('')}` : ''}
      <div class="em-ft">This email is a copy of the Sun 27 Sep edition and won't change; links open the latest edition. Store Manager weekly digest, assigned by your CX team. <a href="#" class="em-a" onclick="emTab='user';renderEmail(true);return false">Manage my email</a></div>
    </div></div>`;
}

/* ── tab 4: where each link lands ── */
const EM_LANDINGS = [
  ['View insight', 'The feed, with that insight\'s drill-down open and a note naming the email.', {insight:'INS-05', action:'investigate'}],
  ['Follow', 'Followed, with the insight added and an Undo.', {insight:'INS-06', action:'follow'}],
  ['Mark as done', 'The Done list of the current edition, with an Undo.', {insight:'INS-03', action:'done'}],
  ['A link in an older email, insight still current', 'The latest edition, with the insight open and a note: "This email is from the Sun 13 Sep edition; you\'re viewing the latest one."', {insight:'INS-02', action:'investigate', ed:'e13', sent:'2026-09-13'}],
  ['A link in an older email, insight no longer current', 'The read-only copy from that email\'s edition, with why it is no longer shown.', {insight:'TOP-QUEUE', action:'investigate', ed:'e13', sent:'2026-09-13'}],
  ['A link in an email older than 12 months', 'The latest edition, with a note that the old edition is no longer available.', null],
  ['Not signed in', 'Company sign-in first, then straight to the same place.', {insight:'INS-04', action:'investigate', sso:'1'}],
  ['Forwarded to a colleague', 'Opens for the person clicking, with their own access, not the recipient\'s.', {insight:'INS-05', action:'investigate', fwd:'1'}]
];
function emLinksHTML(){
  return `<div class="em-perm" data-em-perm>How every link in the email behaves. The same rules apply to every digest.</div>
    <table class="lo-table em-lt"><thead><tr><th>Link</th><th>Where it lands</th><th></th></tr></thead><tbody>
    ${EM_LANDINGS.map(([l,w,o],i)=>`<tr><td>${l}</td><td>${w}</td><td><button class="btn-sec" data-em-try="${i}" onclick="${o ? `openDeepLink('${emQs(o)}')` : `closeJourney();setJourney('expired-link')`}">Try it</button></td></tr>`).join('')}
    </tbody></table>`;
}

const EM_TABS = [['admin','1 · Admin assigns digests'],['user','2 · A user manages their email'],['email','3 · The email'],['links','4 · Where links go']];
function renderEmail(toTop){
  const layer = document.getElementById('email-layer'); if(!layer) return;
  const sc = layer.querySelector('.lo-scroll'), top = (sc && !toTop) ? sc.scrollTop : 0;
  const body = emTab==='admin' ? emAdminHTML() : emTab==='user' ? emUserHTML() : emTab==='email' ? emEmailHTML() : emLinksHTML();
  layer.innerHTML = `<div class="hm-proto"><b>Prototype · Email digests</b>
      <span class="lo-seg">${EM_TABS.map(([k,l])=>`<button class="${emTab===k?'on':''}" data-em-tab="${k}" onclick="emTab='${k}';renderEmail(true)">${l}</button>`).join('')}</span>
      <button style="margin-left:auto" data-em-close onclick="closeJourney()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap em-wrap">${body}</div></div>`;
  const sc2 = layer.querySelector('.lo-scroll'); if(sc2) sc2.scrollTop = top;
}
function openJourney(target){
  const map = {admin:'admin', user:'user', subscribe:'user', email:'email', 'inbox-store':'email', 'inbox-area':'email', 'inbox-country':'email', links:'links'};
  emTab = map[target] || 'admin';
  document.getElementById('email-layer').classList.add('show');
  document.body.style.overflow = 'hidden';
  renderEmail(true);
}
function closeJourney(){
  const l = document.getElementById('email-layer'); if(l) l.classList.remove('show');
  document.body.style.overflow = '';
}
function openDeepLink(qs){
  closeJourney();
  if(typeof closeHome==='function') closeHome();
  closeDrawer(); closeShareModal && closeShareModal();
  setRailMode('insights');
  if(typeof quietOn!=='undefined' && quietOn) setJourney('returning');
  window.scrollTo(0,0);
  gateDeepLink(new URLSearchParams(qs));
}
