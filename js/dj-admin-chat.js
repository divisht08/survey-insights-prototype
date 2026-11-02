/* js/dj-admin-chat.js */
/* Conversational admin setup — step 1 "Who and what for" as a chat (flow: admin-chat, prefix djc).
   Adds a third prototype-bar mode, "Conversational". Steps 2 and 3 are the existing v15 forms.
   Simulated AI: fixed rules decide what to ask next; there is no backend.
   Loads before main.js, so it patches js/v15-admin.js on window 'load' (djcInit is called from main.js). */
(function(){
var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, live = false;
var KEY = {'Store managers':'sm','Area managers':'am','Checkout & payments team':'cp','Central CX team':'cx'};
var SPARK = '<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1l2.2 6.3L18.5 10l-6.3 2.7L10 19l-2.2-6.3L1.5 10l6.3-2.7z"/></svg>';
var CLIP = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3.5 3.5 0 015 5l-9 9a2 2 0 01-3-3l8-8"/></svg>';
var MIC = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/></svg>';
var UP = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
var FILE = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></svg>';
var ASK = 'What do they decide and act on each week? You can type, talk, or add a report you use today.';
var LABEL = {name:'Persona name', role:'Their role', resp:'What they are responsible for', extra:'Anything else'};

function esc(s){ return v15E(s == null ? '' : String(s)); }
function dot(t){ t = String(t || '').trim(); return !t ? '' : /[.!?]$/.test(t) ? t : t + '.'; }
function key(p){ return V15_DIRS[p.id] ? p.id : KEY[p.group]; }
function words(t){ return String(t).trim().split(/\s+/).filter(Boolean).length; }
function ai(t, o){ var m = {r:'ai', t:t}; for(var k in (o||{})) m[k] = o[k]; return m; }
function me(t, file){ return {r:'me', t:t, file:file || ''}; }

/* A realistic first run for the suggested Store manager persona (a clothing retail admin). Other personas start with an empty chat. */
var PREFILL = {sm:{
  role:'Runs one store of 20 to 30 staff and reports to an area manager.',
  resp:'Queues at the tills, fitting rooms and floor cover, sizes out of stock, and who to recognise for good service. Pricing, promotions and supplier problems go to the area manager.',
  extra:'Saturdays and the week before a sale are our busiest times, so flag anything that affects those. New season drops land every other Thursday, so stock and display comments right after matter. Do not tell them to change prices or promotions.',
  a1:'Store managers run one store each, with around 20 to 30 staff, and report to an area manager. Every week they decide what to fix first: queues at the tills, fitting rooms that are untidy or short of cover, sizes out of stock. They also pick who to recognise for good service. Pricing, promotions and supplier problems are not theirs. They raise those with their area manager.',
  a2:'Saturdays and the week before a sale are our busiest times, so flag anything that affects those. New season drops land every other Thursday, so stock and display comments right after matter. Please do not tell them to change prices or promotions.',
  file:'Weekly store report.xlsx'
}};
function opening(p){ return 'I will set this up for ' + p.group.toLowerCase() + ', using what I read in your surveys. ' + ASK; }
function init(p){
  var s = {pid:p.id, phase:'chat', stage:'ask', msgs:[], draft:'', chg:'', tgt:null, enough:false, scratch:false, src:{}};
  if(!p.isNew && p.status){ s.phase = 'review'; s.stage = 'done'; s.enough = true; }
  else if(!p.group){ s.stage = 'who'; s.scratch = true; s.msgs.push(ai('Who is this persona for? Pick a user group, or describe the team.', {chips:true})); }
  else if(PREFILL[p.id] && p.isNew){
    var f = PREFILL[p.id]; p.role = f.role; p.resp = f.resp; p.extra = f.extra;
    s.src = {role:'Your answer', resp:'Your answer', extra:'Your reply'}; s.enough = true; s.stage = 'ready';
    s.msgs = [ai(opening(p)), me(f.a1),
      ai('Thanks, that is enough to start. You can see how I will write for them on the right.', {t2:'Is there anything else I should keep in mind, or a report you use today?'}),
      me(f.a2, f.file), ai('Thanks. I read the report too, and I have what I need.', {cta:'check'})];
  }
  else s.msgs.push(ai(opening(p)));
  v15S.djcS = s; return s;
}
function S(){ var p = v15S.edit; return v15S.djcS && v15S.djcS.pid === p.id ? v15S.djcS : init(p); }

/* ── chat screen ── */
function msgHTML(m, last, s){
  if(m.r === 'me') return '<div class="djc-me">' + esc(m.t) + (m.file ? '<span class="djc-file">' + FILE + esc(m.file) + '</span>' : '') + '</div>';
  var p = v15S.edit, ctas = '';
  if(last && m.chips) ctas = '<div class="djc-chips" data-djc-groups>' + V15_GROUPS.map(function(g){ return '<button class="djc-chip" onclick="djc.pick(\'' + esc(g[0]) + '\')">' + esc(g[0]) + ' · ' + g[2] + '</button>'; }).join('') + '</div>';
  if(last && m.cta === 'enough') ctas = '<div class="djc-ctas"><button class="v14-b pri" data-djc-nothing onclick="djc.nothing()">Nothing else</button><button class="v14-b" onclick="djc.pickFile()">Add a report</button></div>';
  if(last && m.cta === 'check') ctas = '<div class="djc-ctas"><button class="v14-b pri" data-djc-check onclick="djc.check()">Check what I understood</button></div>';
  return '<div class="djc-ai"><span class="djc-av">' + SPARK + '</span><div class="djc-bd"><p>' + esc(m.t) + '</p>' + (m.t2 ? '<p>' + esc(m.t2) + '</p>' : '') + ctas + '</div></div>';
}
function composerHTML(id, ph, val, send){
  return '<div class="djc-comp"><input id="' + id + '" placeholder="' + esc(ph) + '" value="' + esc(val) + '" oninput="djc.type(\'' + id + '\',this.value)" onkeydown="if(event.key===\'Enter\'){djc.' + send + '()}" aria-label="' + esc(ph) + '">'
    + (id === 'djc-in' ? '<button class="djc-ib" aria-label="Add a file" onclick="djc.pickFile()">' + CLIP + '</button>' : '')
    + (SR ? '<button class="djc-ib" aria-label="Speak" data-djc-mic onclick="djc.mic(\'' + id + '\')">' + MIC + '</button>' : '')
    + '<button class="djc-send" aria-label="Send" onclick="djc.' + send + '()">' + UP + '</button></div>';
}
function panelHTML(p, s){
  if(!s.enough){
    return '<div class="v15-card v15-pad" data-djc-help><h3>What helps me most</h3><ul class="v15-dirs"><li>What they decide or fix each week</li><li>What they pass up to someone else</li><li>Anything that should shape what I flag, like busy weekends, a new system or a campaign</li></ul></div>'
      + '<div class="v15-card v15-pad"><h3>Ways to answer</h3><p>Talk instead of typing, or add a report, spreadsheet or slides you use today. PDF, Excel, CSV, Word or PowerPoint.</p></div>'
      + '<p class="v15-note">Next, I will show how I will write for them, and you check what I understood before moving on.</p>';
  }
  var k = key(p), dirs = V15_DIRS[k] || ['Follow what you told me about their role and responsibilities'], sm = V15_SAMPLE[k];
  return '<div class="v15-card v15-pad" data-djc-dirs><h3>How the AI will write for them</h3><ul class="v15-dirs">' + dirs.map(function(d){ return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><p class="v15-note">Updates when you change the answers.</p></div>'
    + (sm ? '<div class="v15-card v15-pad"><h3>A sample insight they\'d get</h3><div class="v15-sample"><b class="k">' + esc(sm[0]) + '</b><b>' + esc(sm[1]) + '</b><span>' + esc(sm[2]) + '</span><small>' + esc(sm[3]) + '</small></div><p class="v15-note">Sample wording. Real insights use real responses.</p></div>' : '');
}
function chatHTML(p, s){
  return '<div class="djc-wrap"><div class="djc-main"><div class="djc-thread" data-djc-thread>' + s.msgs.map(function(m, i){ return msgHTML(m, i === s.msgs.length - 1, s); }).join('') + '</div>'
    + composerHTML('djc-in', 'Reply to the AI', s.draft, 'send') + '</div><aside class="v15-aside djc-aside">' + panelHTML(p, s) + '</aside></div>'
    + '<input type="file" id="djc-file" hidden accept=".pdf,.xlsx,.xls,.csv,.docx,.pptx" onchange="djc.file(this)">';
}

/* ── review screen: what the AI understood ── */
function u(f, t){ return '<a class="djc-u" data-djc-u="' + f + '" onclick="djc.target(\'' + f + '\')">' + esc(t) + '</a>'; }
function reviewHTML(p, s){
  var g = v15Grp(p.group), k = key(p), sm = V15_SAMPLE[k];
  var para = 'I will write for ' + esc(p.group.toLowerCase()) + ' (' + g[2] + ' people, ' + esc(g[1].toLowerCase()) + '). '
    + (p.role ? u('role', dot(p.role)) + ' ' : '') + (p.resp ? u('resp', dot(p.resp)) + ' ' : '') + (p.extra ? u('extra', dot(p.extra)) : '');
  var row = function(f, lab, val, src){ return '<div class="djc-lr"><b>' + lab + '</b><span>' + esc(val) + '</span><small>' + esc(src) + ' · <a data-djc-change="' + f + '" onclick="djc.target(\'' + f + '\')">Change</a></small></div>'; };
  var from = function(f, dflt){ return s.src[f] || dflt; };
  var learned = row('name', 'Persona name', p.name || 'Not named yet', s.src.name || (s.scratch ? 'Suggested from the user group' : 'Suggested from your surveys'))
    + '<div class="djc-lr"><b>Who it is for</b><span>' + esc(p.group) + ' · ' + g[2] + ' people</span><small>' + (s.scratch ? 'Your choice' : 'Suggested from your surveys') + '</small></div>'
    + (p.role ? row('role', LABEL.role, p.role, from('role', 'Drafted from your surveys')) : '')
    + row('resp', LABEL.resp, p.resp || 'Not set', from('resp', p.resp ? 'Drafted from your surveys' : ''))
    + (p.extra ? row('extra', LABEL.extra, p.extra, from('extra', 'Drafted from your surveys')) : '');
  var ph = s.tgt ? 'Change: ' + LABEL[s.tgt].toLowerCase() : 'Or tell me what to change';
  return '<div class="djc-wrap"><div class="djc-col"><div class="djc-main djc-rv"><span class="djc-eyebrow">Who and what for · ' + esc(p.name || 'New persona') + '</span><h2>Here is what I understood</h2>'
    + '<div class="djc-para" data-djc-para>' + para + '</div><p class="v15-note">Tap any underlined part to change it.</p>' + composerHTML('djc-chg', ph, s.chg, 'change') + '</div>'
    + (sm ? '<div class="v15-card v15-pad"><h3>A sample insight they\'d get</h3><div class="v15-sample"><b class="k">' + esc(sm[0]) + '</b><b>' + esc(sm[1]) + '</b><span>' + esc(sm[2]) + '</span><small>' + esc(sm[3]) + '</small></div><p class="v15-note">Sample wording. Real insights use real responses.</p></div>' : '') + '</div>'
    + '<aside class="v15-aside djc-aside"><div class="v15-card v15-pad" data-djc-learned><h3>What I have learned so far</h3>' + learned + '</div></aside></div>';
}
function step1(){
  var p = v15S.edit, s = S();
  return s.phase === 'review' ? reviewHTML(p, s) : chatHTML(p, s);
}

/* ── behaviour ── */
function after(id){
  var pg = document.querySelector('#v15-layer .v15-page'), i = id && document.getElementById(id);
  if(pg && !(S().phase === 'review')) pg.scrollTop = pg.scrollHeight; else if(pg) pg.scrollTop = 0;
  if(i){ i.focus(); i.setSelectionRange && i.setSelectionRange(i.value.length, i.value.length); }
}
function say(m){ S().msgs.push(m); }
function ready(s, p, text){
  s.stage = 'ready'; s.enough = true;
  say(ai(text + (s.scratch && p.name ? ' I will call this persona ' + p.name + '.' : ''), {cta:'check'}));
}
function nameFrom(g){ return g.replace(/ managers$/, ' manager').replace(/ team$/, ''); }
var djc = {
  type: function(id, v){ var s = S(); if(id === 'djc-chg') s.chg = v; else s.draft = v; },
  pick: function(g){
    var p = v15S.edit, s = S(), x = v15Grp(g); if(!x[0]) return;
    p.group = g; if(!p.name) p.name = nameFrom(g);
    say(me(g + ' · ' + x[2])); s.stage = 'ask';
    say(ai('Got it, ' + g.toLowerCase() + ': ' + x[2] + ' people, ' + x[1].toLowerCase() + '. ' + ASK));
    v15Render(); after('djc-in');
  },
  send: function(){
    var p = v15S.edit, s = S(), t = (s.draft || '').trim(); if(!t) return;
    s.draft = ''; say(me(t));
    if(s.stage === 'who'){
      var g = V15_GROUPS.filter(function(x){ return t.toLowerCase().indexOf(x[0].toLowerCase().split(' ')[0]) > -1; })[0];
      if(g){ s.msgs.pop(); return djc.pick(g[0]); }
      say(ai('Which user group should get these insights? Pick one below.', {chips:true}));
    } else if(s.stage === 'ask'){
      var good = words(t) >= 6 && /decid|fix|recogni|schedul|shift|queue|till|stock|train|coach|escalat|raise|support|plan|review|own|responsib|improv/i.test(t);
      if(!good) say(ai('Thanks. What do they decide or fix each week? I need that before we move on.'));
      else {
        p.resp = t; s.src.resp = 'Your answer'; s.enough = true;
        if(words(t) >= 25) ready(s, p, 'That covers it, and I have what I need.');
        else { s.stage = 'more'; say(ai('Thanks, that is enough to start. You can see how I will write for them on the right.', {t2:'Is there anything else I should keep in mind, or a report you use today?', cta:'enough'})); }
      }
    } else {
      p.extra = s.src.extra === 'Your reply' ? p.extra + ' ' + t : t; s.src.extra = 'Your reply';
      ready(s, p, 'Thanks, I have what I need.');
    }
    v15Render(); after('djc-in');
  },
  nothing: function(){ var p = v15S.edit, s = S(); say(me('Nothing else')); ready(s, p, 'Thanks, I have what I need.'); v15Render(); after('djc-in'); },
  pickFile: function(){ var f = document.getElementById('djc-file'); if(f) f.click(); },
  file: function(el){
    var f = el.files && el.files[0]; if(!f) return;
    var p = v15S.edit, s = S(); say(me('', f.name));
    if(s.stage === 'who') say(ai('Thanks, I read it. Which user group is it for? Pick one below.', {chips:true}));
    else if(s.stage === 'ask') say(ai('Thanks, I read the report. I still need to know what they decide or fix each week. A sentence is enough.'));
    else ready(s, p, 'Thanks. I read the report too, and I have what I need.');
    v15Render(); after('djc-in');
  },
  check: function(){ S().phase = 'review'; v15Render(); after(); },
  back: function(){ S().phase = 'chat'; v15Render(); after('djc-in'); },
  target: function(f){ var s = S(); s.tgt = f; s.chg = ''; v15Render(); after('djc-chg'); },
  change: function(){
    var p = v15S.edit, s = S(), t = (s.chg || '').trim(); if(!t) return;
    var f = s.tgt || 'extra';
    p[f] = f === 'extra' && !s.tgt && p.extra ? p.extra + ' ' + t : t; s.src[f] = 'Your edit'; s.tgt = null; s.chg = '';
    v15Render(); after('djc-chg');
  },
  mic: function(id){
    if(!SR) return; var el = document.getElementById(id), s = S(); if(!el) return;
    if(rec && live){ rec.stop(); return; }
    var base = el.value; rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.continuous = false;
    rec.onresult = function(e){ var t = Array.prototype.map.call(e.results, function(r){ return r[0].transcript; }).join(''); el.value = (base ? base + ' ' : '') + t; djc.type(id, el.value); };
    rec.onend = function(){ live = false; el.classList.remove('djc-live'); };
    live = true; el.classList.add('djc-live'); rec.start();
  },
  reset: function(){ v15Reset('first'); v15S.djc = true; v15Render(); }
};
window.djc = djc;

/* ── patch v15-admin.js once everything has loaded ── */
function decorate(){
  var bar = document.querySelector('#v15-layer .hm-proto'); if(!bar || typeof v15S === 'undefined' || !v15S) return;
  var mine = bar.querySelector('[data-djc-mode]');
  if(!mine){ var ex = bar.querySelector('[data-v15-mode="exist"]'); if(!ex) return; ex.insertAdjacentHTML('afterend', '<button data-djc-mode onclick="djc.reset()">Conversational</button>'); mine = bar.querySelector('[data-djc-mode]'); }
  if(v15S.djc){ bar.querySelectorAll('[data-v15-mode]').forEach(function(b){ b.classList.remove('on'); }); mine.classList.add('on'); } else mine.classList.remove('on');
}
function hook(){
  if(window.__djcHooked || typeof v15Step1 !== 'function') return; window.__djcHooked = true;
  var s1 = v15Step1, bar = v15BarHTML, ren = v15Render;
  window.v15Step1 = function(){ return v15S.djc ? step1() : s1(); };
  window.v15BarHTML = function(){
    if(!v15S.djc || v15S.step !== 1) return bar();
    return S().phase === 'review' ? '<div class="v15-bar"><button class="v14-b" onclick="djc.back()">Back</button><span><button class="v14-b pri" data-djc-next onclick="v15Step(2)">Continue</button></span></div>' : '';
  };
  window.v15Render = function(){ ren(); decorate(); };
}
window.djcInit = function(){ window.addEventListener('load', function(){ hook(); if(window.v15Render) decorate(); }); };
})();


