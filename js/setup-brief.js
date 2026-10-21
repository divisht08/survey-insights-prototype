/* ═══ SETUP BRIEF — conversational Day 0 onboarding for the Redtag AI setup option. Prefix djb. Mounted by js/setup.js (setView). ═══
   Screens: 1 start card · 2 talk it through · 3 the AI asks the rest · 4 check and build (real feed cards) · 5 tune a card by talking to the AI */
(function(){
'use strict';
var PRE='I run the RT ATYAF MALL store. Each week I decide what to fix, who to recognise and what to raise with head office. We changed the fitting-room rota in September, and the card terminals were down on 14\u201315 Sep.';
var root=null,cb=null,bound=false,S=null,SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null;
var SP='<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"/></svg>';
var CK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
var MIC='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 8a5 5 0 0010 0M8 13v2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
var UP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
var INFO='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="8" cy="8" r="6.2"/><path d="M8 7.2v4M8 4.9v.1"/></svg>';
var STEPS=['Your role','What you decide','Numbers that lead','How often','Alerts'];
var STARTERS=[['Run a store','I run a store. Each week I decide what to fix and which staff to recognise.'],['Cover several stores','I cover several stores and decide where to send support each week.'],['Own one area, like checkout','I own checkout. I decide what to fix in payments and queues.'],['Check a change worked','I made a change in the store and want to know whether it worked.']];
var METRICS=[{id:'overall',n:'Overall satisfaction',now:'9.63 out of 10',aim:true},{id:'service',n:'Service satisfaction',now:'9.67 out of 10',aim:true},{id:'staff',n:'Staff helpfulness',now:'9.1 out of 10',aim:true},{id:'vol',n:'Responses a week',now:'about 16'}];
var FREQ=[['weekly','Weekly · recommended'],['daily','Daily'],['monthly','Monthly']];
var FREQ_TXT={weekly:'weekly, by email too',daily:'daily, by email too',monthly:'monthly, by email too'};
var CARDS=[
 {id:'INS-05',prio:'high',type:'anomaly',kind:'Anomaly · Checkout &amp; payments',topic:'payment-failure complaints',title:'Payment-failure complaints spiked on 14–15 Sep',sum:'11 respondents over 2 days described card or wallet payments failing at the till, against ~1 a week normally.',next:'<span class="font-600">Recommended action:</span> check with IT whether card terminals or the payment gateway had an outage on those days.',stat:'<p class="ic-num" style="color:#c5221f">11</p><p class="ic-unit">mentions on 14–15 Sep</p><p class="ic-unit">usual: ~1 a week</p>',basis:'14–15 Sep vs the previous 89 days',data:['New this period: 11 mentions in 2 days against about 1 a week','The customers involved scored very low'],link:'fix'},
 {id:'INS-04',prio:'med',type:'driver',kind:'Key driver · Cleanliness',topic:'cleanliness cards',title:'Store &amp; fitting-room cleanliness is most associated with low satisfaction',sum:'Of 5 service factors, cleanliness has the strongest association with overall satisfaction — and it is also the lowest-scoring one.',next:'<span class="font-600">Recommended action:</span> add a fitting-room reset to each shift checklist, especially at peak hours.',stat:'<p class="ic-num">31%</p><p class="ic-unit">of satisfaction variation</p>',basis:'Current period · 01 Jun – 23 Sep 2026',data:['It has the strongest link to low satisfaction','It is also the lowest-scoring service factor'],link:'fix'},
 {id:'INS-06',prio:'pos',type:'comparison',kind:'Period comparison · Staff',topic:'staff praise cards',title:'Staff helpfulness is the most-praised part of the visit — and still rising',sum:'The highest-scoring of 5 service factors this period, up on the previous period. Promoters mention friendly, helpful staff more than anything else.',next:'<span class="font-600">Recommended action:</span> name what customers praise in the next team briefing, and recognise the shifts behind it.',stat:'<p class="ic-num" style="color:#0b7a53">9.1</p><p class="ic-unit">out of 10</p><p class="ic-delta up">▲ +0.3<small>vs 8.8</small></p>',basis:'vs 14 Feb – 31 May 2026',data:['It is the most-praised part of the visit','It rose to 9.1, up 0.3 on the previous period'],link:'recognise'}
];
var AL=[{id:'overall',t:'Overall satisfaction falls below your aim',m:'overall'},{id:'service',t:'Service satisfaction falls below your aim',m:'service'},{id:'vol',t:'Responses a week drop sharply',sub:'Usual about 16 \u00b7 a sign the survey itself has a problem'},{id:'theme',t:'A complaint theme spikes',sub:'Like the card-payment failures on 14\u201315 Sep'}];
var CHEV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
var BELL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg>';
var TUNE_PILLS=[['Show me this less','less'],['Not my area','area'],['Tell me sooner','sooner'],['I already know about this','known']];

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function fresh(){var m={};METRICS.forEach(function(x){m[x.id]={on:x.id==='overall'||x.id==='service',aim:'9.5'};});
 return {step:'start',text:'',role:'store manager',decides:['what to fix each week','who to recognise'],m:m,phase:'metrics',sent:false,freq:'weekly',tab:'insights',alOpen:null,al:{overall:{on:true,sig:true,email:true,app:true},service:{on:true,sig:true,email:true,app:true},vol:{on:true,th:'8',sig:true,email:true,app:true},theme:{on:false,th:'3',sig:true,email:true,app:true}},hidden:{},tuned:{},popId:null,tune:null,notes:[]};}
function byId(id){for(var i=0;i<CARDS.length;i++)if(CARDS[i].id===id)return CARDS[i];return null;}

/* ── understanding what was said (keyword stand-in for the real model) ── */
function parseSay(t){
 var l=t.toLowerCase(),role='store manager',d=[];
 if(/several|multiple|region|area manager|cluster/.test(l))role='area manager';
 else if(/checkout|payment|till|queue/.test(l))role='checkout owner';
 else if(/made a change|launch|pilot|trial/.test(l))role='owner of a store change';
 if(/fix|improv|problem|complain|issue|support|payment|queue/.test(l))d.push('what to fix each week');
 if(/recogni|praise|reward|staff|team/.test(l))d.push('who to recognise');
 if(/head office|escalat|raise/.test(l))d.push('what to raise with head office');
 if(/made a change|whether .*(worked|change)|check.* change|trial|pilot/.test(l))d.push('whether a change worked');
 if(!d.length)d=['what to fix each week','who to recognise'];
 S.role=role;S.decides=d;
}
function parseMetrics(t){
 var l=t.toLowerCase();if(!l.trim())return;
 var any=false;
 [['overall',/overall/],['service',/service/],['staff',/staff|helpful/],['vol',/respon|volume/]].forEach(function(p){if(p[1].test(l)){S.m[p[0]].on=true;any=true;}});
 if(any){METRICS.forEach(function(x){if(!new RegExp({overall:'overall',service:'service',staff:'staff|helpful',vol:'respon|volume'}[x.id]).test(l))S.m[x.id].on=false;});}
 var n=l.match(/\d+(\.\d+)?/);if(n&&parseFloat(n[0])<=10)METRICS.forEach(function(x){if(x.aim&&S.m[x.id].on)S.m[x.id].aim=n[0];});
}
function parseFreq(t){var l=t.toLowerCase();if(/daily|every day/.test(l))return 'daily';if(/month/.test(l))return 'monthly';if(/week/.test(l))return 'weekly';return null;}
function onList(){return METRICS.filter(function(x){return S.m[x.id].on;});}
function metricSummary(){
 var on=onList();if(!on.length)return 'No numbers in particular.';
 var names=on.map(function(x){return x.n.replace(' satisfaction','').replace(' helpfulness','');});
 var txt=names.length>1?names.slice(0,-1).join(', ')+' and '+names[names.length-1]:names[0];
 txt=txt.charAt(0).toUpperCase()+txt.slice(1);
 var aims=on.filter(function(x){return x.aim&&S.m[x.id].aim;}).map(function(x){return S.m[x.id].aim;});
 var same=aims.length>1&&aims.every(function(a){return a===aims[0];});
 return txt+'.'+(aims.length?(same?' Aim for '+aims[0]+' on '+(aims.length>2?'all':'both')+'.':' Aims: '+aims.join(', ')+'.'):'');
}

/* ── pieces ── */
function progress(){
 var done=S.step==='preview'?5:S.step==='chat'?(S.phase==='metrics'?2:S.phase==='freq'?3:4):0,act=S.step==='chat'?done:-1;
 if(S.step==='say')act=0;
 return '<div class="djb-prog" role="list" aria-label="Setup progress">'+STEPS.map(function(n,i){
  var st=i<done?'done':i===act?'act':'';
  return '<div class="djb-pi '+st+'" role="listitem"><i class="djb-bar"></i><span class="djb-pl"><i class="djb-dot">'+(st==='done'?CK:'')+'</i>'+n+'<span class="dj-sr">'+(st==='done'?', done':st==='act'?', current':'')+'</span></span></div>';}).join('')+'</div>';
}
function head(){return '<span class="eyebrow">Survey Insights setup · Store experience survey</span>'+progress();}
function ai(inner){return '<div class="djb-m ai"><span class="djb-av">'+SP+'</span><div class="djb-mb">'+inner+'</div></div>';}
function you(t){return '<div class="djb-m you"><div class="djb-yb">'+esc(t)+'</div></div>';}
function composer(ph,btn){
 var lis=rec&&rec.on;
 return '<div class="djb-comp"><div class="djb-cin'+(lis?' lis':'')+'">'+(lis?'<span class="dj-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>':'')+'<label class="dj-sr" for="djb-in">Your answer</label><input id="djb-in" type="text" autocomplete="off" placeholder="'+(lis?'Listening…':ph)+'" value="'+esc(S.draft||'')+'"></div>'+(SR?'<button type="button" class="djb-ib'+(lis?' on':'')+'" data-djb="mic" data-t="djb-in" aria-label="'+(lis?'Stop listening':'Speak your answer')+'" aria-pressed="'+(lis?'true':'false')+'">'+MIC+'</button>':'')+'<button type="button" class="djb-ib pri" data-djb="chatsend" aria-label="Send">'+UP+'</button></div>'+(S.micErr?'<p class="dj-err" style="margin:0 0 8px">'+esc(S.micErr)+'</p>':'');
}

/* ── screens ── */
function sStart(){
 return '<div class="dj-empty"><div class="dj-empty-card"><span class="dj-empty-ico">'+SP+'</span><h2 class="d3" id="djb-h" tabindex="-1">Your feed is not set up yet</h2><p>Tell me what you are responsible for and what you want to know. I have already read your survey, so a sentence or two is enough.</p><div class="dj-empty-act"><button type="button" class="btn-pri" data-djb="begin">Set up my feed</button><button type="button" class="btn-sec" data-djb="defaults">Use a recommended setup</button></div><p class="dj-hint" style="margin-top:14px">About two minutes. You can change everything later in My feed setup.</p></div></div>';
}
function sSay(){
 return '<div class="djb-shell"><div class="djb-top">'+head()+'</div><div class="djb-say"><span class="dj-empty-ico">'+SP+'</span><h2 class="djb-h" id="djb-h" tabindex="-1">What are you responsible for here, and what do you want to know?</h2><p class="djb-sub">I have read your store experience survey, so a sentence or two is enough. I will ask only about what is still missing.</p>'
 +'<div class="djb-box"><label class="dj-sr" for="djb-ta">Your answer</label><textarea id="djb-ta" rows="3" placeholder="'+(rec&&rec.on?'Listening…':'Tell me about your role and what you want from this feed')+'">'+esc(S.text)+'</textarea><div class="djb-boxbar"><span class="djb-boxnote">'+(rec&&rec.on?'<span class="dj-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span> Listening':(SR?'Speak or type':'Type your answer'))+'</span>'+(SR?'<button type="button" class="djb-ib'+(rec&&rec.on?' on':'')+'" data-djb="mic" data-t="djb-ta" aria-label="'+(rec&&rec.on?'Stop listening':'Speak your answer')+'" aria-pressed="'+(rec&&rec.on?'true':'false')+'">'+MIC+'</button>':'')+'<button type="button" class="djb-ib pri" id="djb-go" data-djb="saysend" aria-label="Send"'+(S.text.trim()?'':' disabled')+'>'+UP+'</button></div></div>'
 +(S.micErr?'<p class="dj-err">'+esc(S.micErr)+'</p>':'')
 +(S.prefilled?'<p class="dj-banner" style="margin:12px 0 0;text-align:left">I filled this in to match what this store\u2019s feed shows. Check it and change anything.</p>':'')
 +'<div class="djb-pills">'+STARTERS.map(function(p,i){return '<button type="button" class="djb-pill" data-djb="starter" data-v="'+i+'">'+p[0]+'</button>';}).join('')+'</div><p class="dj-hint" style="text-align:center">Tap one to fill in a starting sentence, then change it to fit you.</p>'
 +'<p class="djb-skip"><button type="button" class="dj-link" data-djb="defaults">Skip and use a recommended setup</button></p></div></div>';
}
function sChat(){
 var h='<div class="djb-shell"><div class="djb-top">'+head()+'</div>';
 h+='<div class="djb-earlier"><span>Earlier</span><b>'+esc(S.role.charAt(0).toUpperCase()+S.role.slice(1))+'</b>'+S.decides.map(function(d){return '<b>'+esc(d.charAt(0).toUpperCase()+d.slice(1))+'</b>';}).join('')+'<button type="button" class="dj-link" data-djb="edit-say">Change</button></div>';
 h+='<div class="djb-thread" id="djb-thread" aria-live="polite">';
 var list='<div class="djb-list">'+METRICS.map(function(x){var on=S.m[x.id].on;
  return '<div class="djb-li'+(on?' on':'')+'"><button type="button" class="djb-lb" data-djb="tm" data-v="'+x.id+'" aria-pressed="'+(on?'true':'false')+'" '+(S.sent?'disabled':'')+'><span class="djb-cb">'+(on?CK:'')+'</span><span class="djb-ln">'+x.n+' <em>· now '+x.now+'</em></span></button>'+(x.aim&&on?'<label class="djb-aim">Aim <input type="text" inputmode="decimal" data-djb-aim="'+x.id+'" value="'+esc(S.m[x.id].aim)+'" aria-label="Aim for '+x.n.toLowerCase()+' out of 10" '+(S.sent?'disabled':'')+'></label>':'')+'</div>';}).join('')+'</div>';
 h+=ai('<p>Which numbers should lead your feed? Add an aim if you have a figure in mind.</p>'+list+'<p class="dj-hint" style="margin:8px 0 0">These come first. I still analyse the rest of your survey and tell you what stands out.</p>'+(S.sent?'':'<div class="dj-ai-actions"><button type="button" class="btn-pri" data-djb="usemetrics">Use these</button></div>'));
 if(S.sent){
  h+=you(metricSummary());
  h+=ai('<p>Next, how often should I update you? With about 16 responses a week, weekly works best. I will email each update too.</p><div class="dj-hint" style="margin:8px 0 0">This also sets the period I analyse: each week against the weeks before it, each day against earlier days, and so on. I show only changes that are statistically significant.</div><div class="djb-pills left">'+FREQ.map(function(f){return '<button type="button" class="djb-pill'+(f[0]===S.freq?' on':'')+'" data-djb="freq" data-v="'+f[0]+'"'+(S.phase==='alerts'?' disabled':'')+'>'+f[1]+'</button>';}).join('')+'</div>');
  if(S.phase==='alerts'){h+=you(FREQ.filter(function(f){return f[0]===S.freq;})[0][1].replace(' \u00b7 recommended','')+' is fine');h+=alChat();}
 }
 h+='</div>'+composer(S.phase==='alerts'?'Or say which alerts you want':S.sent?'Or type or say how often':'Or type or say which numbers and what aim')+'</div>';
 return h;
}
function cardHTML(c){
 var cur=S.tuned[c.id],open=S.popId===c.id;
 return '<div class="djb-cw" data-id="'+c.id+'"><div class="insight-card ic spr-card djb-ic" data-priority="'+c.prio+'"><div class="ic-body"><div class="ic-head"><div class="ic-kind"><span class="ic-type">'+TYPE_PILL[c.type].icon+'<span>'+c.kind+'</span></span><span class="djb-sc">Sample</span>'+(cur?'<span class="djb-sc djb-tuned">Tuned</span>':'')+'</div></div>'
 +'<div class="ic-main"><div class="ic-text"><p class="ic-title">'+c.title+'</p><p class="ic-sum">'+c.sum+'</p></div><div class="ic-stat">'+c.stat+'</div></div></div>'
 +'<div class="ic-foot"><p class="ic-basis">'+c.basis+'</p><div class="ic-acts"><button type="button" class="btn-sec" data-djb="why" data-v="'+c.id+'" aria-expanded="'+(open?'true':'false')+'">'+INFO+'Why is this here?</button><button type="button" class="btn-pri" data-djb="tune" data-v="'+c.id+'">'+SP+'Tune with AI</button></div></div></div>'
 +(open?'<div class="djb-pop" role="dialog" aria-label="Why this is here">'+whyHTML(c)+'<div class="djb-pa"><button type="button" class="btn-pri" data-djb="tune" data-v="'+c.id+'">Tune this with the AI</button><button type="button" class="btn-sec" data-djb="notuseful" data-v="'+c.id+'">Not relevant to me</button></div></div>':'')+'</div>';
}
function sayQuote(re_){var t=S.text||'',parts=t.split(/[.!?]+\s+|,\s+(?:and\s+)?|\s+and\s+(?=the\b)/);for(var i=0;i<parts.length;i++)if(re_.test(parts[i]))return parts[i].replace(/[.!?]+$/,'').trim();return '';}
function decided(re_,fallback){for(var i=0;i<S.decides.length;i++)if(re_.test(S.decides[i]))return S.decides[i];return fallback;}
function youSaid(c){
 var out=[],q,d;
 if(c.link==='fix'){d=decided(/fix/,'');out.push(d?'You said you decide <b>'+esc(d)+'</b>, so problems customers report come first':'You did not mention fixing problems, so I used the usual focus for a '+esc(S.role));}
 if(c.link==='recognise'){d=decided(/recogni/,'');out.push(d?'You said you decide <b>'+esc(d)+'</b>, so praise is shown too':'You did not mention recognition, so I show praise as a bright spot');}
 if(c.id==='INS-04'){q=sayQuote(/rota|fitting|clean/i);if(q)out.push('You said \u201c'+esc(q)+'\u201d, so I check whether cleanliness moved');}
 if(c.id==='INS-05'){q=sayQuote(/terminal|payment|till/i);if(q)out.push('You said \u201c'+esc(q)+'\u201d. Tune this card if it is the same event');}
 var on=onList().filter(function(x){return x.aim;});
 if(on.length&&(c.id==='INS-06'||c.id==='INS-04'))out.push('You asked for <b>'+esc(on.map(function(x){return x.n.toLowerCase();}).join(' and '))+'</b> to lead, with an aim of '+esc(S.m[on[0].id].aim));
 return out;
}
function whyHTML(c){
 return '<p class="djb-pt">Why this is here</p><p class="djb-pg">What the survey shows</p><ul>'+c.data.map(function(w){return '<li>'+w+'</li>';}).join('')+'</ul><p class="djb-pg">What you told me</p><ul class="djb-you">'+youSaid(c).map(function(w){return '<li>'+w+'</li>';}).join('')+'</ul>';
}
var SECS=[['high','Needs attention','#c5221f'],['med','Worth a look','#d9900f'],['pos','Bright spots','#0e8a5f']];
function feedHTML(vis){
 return '<div class="djb-grid">'+SECS.map(function(x){var cs=vis.filter(function(c){return c.prio===x[0];});if(!cs.length)return '';
  return '<div class="v3-sec"><i style="background:'+x[2]+'"></i>'+x[1]+'<span class="n">'+cs.length+'</span></div>'+cs.map(cardHTML).join('');}).join('')+'</div>';
}
function alTitle(a){return a.t;}
function alSub(a){return a.m?'Aim '+esc(S.m[a.m].aim)+' \u00b7 now '+(a.m==='overall'?'9.63':'9.67'):a.sub;}
function alOnN(){return AL.filter(function(a){return S.al[a.id].on;}).length;}
function alRec(){return AL.filter(function(a){return a.id==='vol'||(a.m&&S.m[a.m].on);}).map(function(a){return a.id;});}
function syncAl(){AL.forEach(function(a){if(a.m)S.al[a.id].on=!!S.m[a.m].on;});S.al.vol.on=true;S.al.theme.on=false;}
function swH(on){return '<span class="djb-sw'+(on?' on':'')+'" aria-hidden="true"><i></i></span>';}
function parseAlerts(t){var l=t.toLowerCase();if(/\b(no|none|not now|skip|nothing)\b/.test(l)){AL.forEach(function(a){S.al[a.id].on=false;});return;}
 var K=[['overall',/overall/],['service',/service/],['vol',/respon|volume|survey/],['theme',/complain|theme|spike|payment/]],any=K.some(function(x){return x[1].test(l);});
 if(any)K.forEach(function(x){S.al[x[0]].on=x[1].test(l);});}
function alChat(){
 var rec=alRec(),cur=AL.filter(function(a){return S.al[a.id].on;}).map(function(a){return a.id;});
 var same=rec.length===cur.length&&rec.every(function(x){return cur.indexOf(x)>-1;});
 var rows='<div class="djb-list">'+AL.map(function(a){var on=S.al[a.id].on;return '<div class="djb-li'+(on?' on':'')+'"><button type="button" class="djb-lb djb-alb" data-djb="alt" data-v="'+a.id+'" role="switch" aria-checked="'+(on?'true':'false')+'"><span class="djb-ln"><b>'+alTitle(a)+'</b><em>'+alSub(a)+'</em></span>'+swH(on)+'</button></div>';}).join('')+'</div>';
 return ai('<p>One last thing. Insights arrive '+esc(FREQ_TXT[S.freq].split(',')[0])+', but some things should not wait. Which of these should I tell you about straight away?</p>'+rows+'<div class="dj-hint" style="margin:8px 0 0">Alerts are separate from your insights. They tell you straight away, by email and in the app, and you can change them any time in My feed setup.</div><div class="djb-pills left"><button type="button" class="djb-pill on" data-djb="alok">'+(cur.length?(same?'Turn on the '+cur.length+' recommended':'Use my selection ('+cur.length+')'):'Continue without alerts')+'</button>'+(cur.length?'<button type="button" class="djb-pill" data-djb="alnone">Not now</button>':'')+'</div>');
}
function tabsH(n){return '<div class="djb-tabs" role="tablist"><button type="button" role="tab" class="djb-tab'+(S.tab==='insights'?' on':'')+'" data-djb="tab" data-v="insights" aria-selected="'+(S.tab==='insights'?'true':'false')+'">Insights <span>'+n+'</span></button><button type="button" role="tab" class="djb-tab'+(S.tab==='alerts'?' on':'')+'" data-djb="tab" data-v="alerts" aria-selected="'+(S.tab==='alerts'?'true':'false')+'"><i class="djb-ti">'+BELL+'</i>Alerts <span class="djb-badge">'+alOnN()+' on</span></button></div>';}
function chk(on){return '<span class="djb-cb">'+(on?CK:'')+'</span>';}
function alPanel(a){
 var v=S.al[a.id],f;
 if(a.m)f='<p class="djb-al-s">Alert me when <b>'+(a.m==='overall'?'overall':'service')+' satisfaction</b> falls below <input class="djb-th" type="text" inputmode="decimal" data-djb-aim="'+a.m+'" value="'+esc(S.m[a.m].aim)+'" aria-label="Alert below this score"></p>';
 else if(a.id==='vol')f='<p class="djb-al-s">Alert me when responses a week fall below <input class="djb-th" type="text" inputmode="numeric" data-djb-th="vol" value="'+esc(v.th)+'" aria-label="Alert below this many responses a week"> (usual about 16)</p>';
 else f='<p class="djb-al-s">Alert me when a complaint theme is mentioned <input class="djb-th" type="text" inputmode="numeric" data-djb-th="theme" value="'+esc(v.th)+'" aria-label="Alert at this many times the usual rate"> times more than usual</p>';
 var ex=a.m?'With about 16 responses a week, a drop below '+esc(S.m[a.m].aim)+' this size would have fired once in the last 8 weeks (example).':a.id==='vol'?'A week this quiet has not happened in the last 8 weeks (example).':'This would have fired once: the payment failures on 14\u201315 Sep (example).';
 var opt=function(k,t){return '<button type="button" class="djb-opt" data-djb="alopt" data-v="'+a.id+':'+k+'" role="checkbox" aria-checked="'+(v[k]?'true':'false')+'">'+chk(v[k])+t+'</button>';};
 return '<div class="djb-alp">'+f+'<div class="djb-alo">'+opt('sig','Only when the change is statistically significant')+opt('email','Send by email')+opt('app','Show in the app')+'</div><p class="dj-hint" style="margin:10px 0 0">'+ex+(a.m?' The aim stays linked to the number you chose to lead your feed.':'')+'</p></div>';
}
function alSample(){
 var a=AL.filter(function(x){return S.al[x.id].on;})[0];
 if(!a)return '<p class="djb-note">No alerts are on. Turn one on to see a sample alert.</p>';
 var subj=a.id==='overall'?'overall satisfaction fell to 9.21, below your aim of '+esc(S.m.overall.aim):a.id==='service'?'service satisfaction fell to 9.31, below your aim of '+esc(S.m.service.aim):a.id==='vol'?'responses this week fell to 4, well below the usual 16':'payment-failure complaints are 11 times the usual rate';
 var body=a.m?'RT ATYAF MALL \u00b7 week to Sunday. Down 0.4 on the week before, across 17 responses. This change is statistically significant.':a.id==='vol'?'RT ATYAF MALL \u00b7 this week so far. Check the survey link and the till prompt are working.':'RT ATYAF MALL \u00b7 14\u201315 Sep. 11 respondents described card or wallet payments failing at the till.';
 var why=a.m?'you asked to hear straight away when '+(a.m==='overall'?'overall':'service')+' satisfaction falls below your aim of '+esc(S.m[a.m].aim)+'.':a.id==='vol'?'you asked to hear straight away when responses a week drop sharply.':'you asked to hear straight away when a complaint theme spikes.';
 return '<div class="djb-mail"><div class="djb-mailh"><i>'+BELL+'</i><span>Sample alert, sent by email and shown in the app</span><span class="djb-samp">Sample</span></div><div class="djb-mailb"><p class="djb-mlab">Subject</p><p class="djb-msub">Alert: '+subj+'</p><p>'+body+'</p><p><b>Why you got this:</b> '+why+'</p><div class="djb-pa"><button type="button" class="btn-pri" tabindex="-1">Open in Survey Insights</button><button type="button" class="btn-sec" data-djb="alt" data-v="'+a.id+'">Turn off this alert</button></div></div></div>';
}
function alertsTab(){
 return '<div class="djb-first"><p class="djb-fh">Tell me straight away when</p><p class="dj-hint" style="margin:0 0 10px">Alerts are separate from your insights. They arrive as soon as a change is statistically significant, by email and in the app.</p>'
 +'<div class="djb-alt"><div class="djb-alth"><span>Alert</span><span>On</span></div>'+AL.map(function(a){var on=S.al[a.id].on,open=S.alOpen===a.id;
  return '<div class="djb-ar'+(open?' open':'')+'"><div class="djb-arh"><button type="button" class="djb-arb" data-djb="alopen" data-v="'+a.id+'" aria-expanded="'+(open?'true':'false')+'"><span class="djb-ln"><b>'+alTitle(a)+'</b><em>'+alSub(a)+'</em></span><i class="djb-chev">'+CHEV+'</i></button><button type="button" class="djb-swb" data-djb="alt" data-v="'+a.id+'" role="switch" aria-checked="'+(on?'true':'false')+'" aria-label="'+esc(alTitle(a))+'">'+swH(on)+'</button></div>'+(open?alPanel(a):'')+'</div>';}).join('')+'</div>'
 +'<p class="djb-fh" style="margin-top:18px">What an alert looks like</p>'+alSample()+'<p class="djb-note" style="margin-top:12px">Alerts also appear at the top of your feed, marked with a bell.</p></div>';
}
function link(k,t){return '<button type="button" class="djb-ed" data-djb="'+k+'">'+t+'</button>';}
function sPreview(){
 var dec=S.decides.map(function(d,i){return link('edit-say',d);});
 var aims=onList().filter(function(x){return x.aim;});
 var lead=onList().map(function(x){return x.n.replace(' satisfaction','').replace(' helpfulness','').toLowerCase();});
 var leadTxt=lead.length>1?lead.slice(0,-1).join(', ')+' and '+lead[lead.length-1]:(lead[0]||'');
 var sent='You are a '+link('edit-say',esc(S.role))+' at RT ATYAF MALL. You decide '+(dec.length>1?dec.slice(0,-1).join(', ')+' and '+dec[dec.length-1]:dec[0])+'. '
  +(leadTxt?(leadTxt.charAt(0).toUpperCase()+leadTxt.slice(1)+(lead.length>1?' lead':' leads')+' your feed'+(aims.length?', with an aim of '+link('edit-metrics',esc(S.m[aims[0].id].aim)):'')+'. '):'')
  +'I will update you '+link('edit-freq',FREQ_TXT[S.freq])+'.';
 var vis=CARDS.filter(function(c){return !S.hidden[c.id];});
 var h='<div class="djb-shell"><div class="djb-top">'+head()+'</div><div class="djb-pv"><h2 class="djb-h left" id="djb-h" tabindex="-1">Your feed is ready to build</h2><p class="djb-sub left">Here is what I understood, and a sample of both parts of your feed.</p>'
 +'<div class="djb-und"><p>'+sent+'</p><p class="dj-hint" style="margin:8px 0 0">Tap any underlined part to change it.</p></div>'
 +tabsH(CARDS.filter(function(c){return !S.hidden[c.id];}).length)+(S.tab==='alerts'?alertsTab():'<div class="djb-first"><p class="djb-fh">Sample feed <span class="djb-samp">Sample</span></p><div class="djb-sbn"><b>This is a sample feed, not your real insights.</b> It shows how cards will look and why they appear, using example figures. Your real feed is created when you build it. On every card, <b>Why is this here?</b> explains why it appears and <b>Tune with AI</b> lets you change it by typing or talking.</div>'
 +(vis.length?feedHTML(vis):'<p class="dj-banner">All three sample cards were tuned away. Your real feed will follow what you told me.</p>')
 +S.notes.map(function(n){return '<p class="djb-note">'+n+'</p>';}).join('')+'</div>')+'</div>'
 +'<div class="djb-foot"><button type="button" class="btn-sec" data-djb="back-chat">Back</button><button type="button" class="btn-pri" data-djb="build">Build my feed</button></div></div>';
 return h+tuneHTML();
}
function tuneHTML(){
 var t=S.tune;if(!t)return '';var c=byId(t.id);
 var h='<div class="djb-scrim" data-djb="tclose"></div><aside class="djb-dr" role="dialog" aria-modal="true" aria-label="Tune this card"><div class="djb-drh"><span class="eyebrow">Tune this card</span><button type="button" class="djb-x" data-djb="tclose" aria-label="Close">×</button></div>'
 +'<div class="djb-mini"><div><span class="prio '+c.prio+'"><i></i>'+PRIO_LABEL[c.prio]+'</span><span class="djb-minik">'+c.kind+' · Sample</span></div><p>'+c.title+'</p></div><div class="djb-thread djb-tt" id="djb-tt" aria-live="polite">'
 +ai('<p>This is here because '+tuneWhy(c)+' What would you like to change?</p>'+(t.msgs.length?'':'<div class="djb-pills left">'+TUNE_PILLS.map(function(p){return '<button type="button" class="djb-pill" data-djb="tpill" data-v="'+p[1]+'">'+p[0]+'</button>';}).join('')+'</div>'));
 t.msgs.forEach(function(m){
  if(m.who==='you')h+=you(m.t);
  else h+=ai('<p>Understood. This is what I would change:</p><div class="djb-chg"><p>'+m.t+'</p>'+(m.state==='applied'?'<p class="djb-ok">Applied. It takes effect from the next update. You can undo it any time in My feed setup.</p>':m.state==='open'?'<div class="djb-pa"><button type="button" class="btn-pri" data-djb="tapply">Apply</button><button type="button" class="btn-sec" data-djb="tno">Not quite</button></div><p class="dj-hint" style="margin:8px 0 0">Applies from the next update. You can undo it any time in My feed setup.</p>':'<p class="dj-hint" style="margin:0">Okay, tell me what to change instead.</p>')+'</div>');
 });
 h+='</div><div class="djb-comp djb-dc"><div class="djb-cin'+(rec&&rec.on?' lis':'')+'">'+(rec&&rec.on?'<span class="dj-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>':'')+'<label class="dj-sr" for="djb-tin">Tell the AI what to change</label><input id="djb-tin" type="text" autocomplete="off" placeholder="'+(rec&&rec.on?'Listening…':'Say or type what else to change about this card')+'" value="'+esc(S.draft||'')+'"></div>'+(SR?'<button type="button" class="djb-ib'+(rec&&rec.on?' on':' pri')+'" data-djb="mic" data-t="djb-tin" aria-label="'+(rec&&rec.on?'Stop listening':'Speak')+'" aria-pressed="'+(rec&&rec.on?'true':'false')+'">'+MIC+'</button>':'')+'<button type="button" class="djb-ib pri" data-djb="tsend" aria-label="Send">'+UP+'</button></div></aside>';
 return h;
}
function tuneWhy(c){var y=youSaid(c).map(function(x){return x.replace(/<[^>]*>/g,'');});return c.data.map(function(x){return x.charAt(0).toLowerCase()+x.slice(1);}).join(' and ')+(y.length?', and '+y[0].charAt(0).toLowerCase()+y[0].slice(1):'')+'.';}

/* ── tune logic ── */
function changeFor(kind,c,raw){
 var drop=false,txt;
 if(kind==='known'){txt='Treat the latest '+c.topic+' as explained, and drop this card from the feed.<br>Flag it again only if it happens a second time.';drop=true;}
 else if(kind==='area'){txt='Stop showing cards from this area in your feed.<br>Your other areas stay as they are.';drop=true;}
 else if(kind==='sooner'){txt='Flag this kind of change as soon as it appears, not only at the weekly update.';}
 else if(kind==='less'){txt='Show '+c.topic+' less often. Only show them when the change is large.';}
 else txt='Adjust this card as you described: “'+esc(raw)+'”.';
 return {t:txt,drop:drop};
}
function tuneKind(t){var l=t.toLowerCase();if(/know|explained|terminal|down|already|outage/.test(l))return 'known';if(/not my|area|never|ignore|remove|stop/.test(l))return 'area';if(/sooner|earlier|immediately|right away|daily/.test(l))return 'sooner';if(/less|fewer|rarely|only if|big/.test(l))return 'less';return 'other';}
function tuneSay(kind,raw,label){
 var tn=S.tune,c=byId(tn.id);tn.msgs.push({who:'you',t:esc(label||raw)});
 var ch=changeFor(kind,c,raw);tn.msgs.push({who:'ai',t:ch.t,drop:ch.drop,state:'open'});
}

/* ── render ── */
function render(focus){
 if(!root)return;
 var keep=null,ae=document.activeElement;
 if(ae&&ae.id&&root.contains(ae)&&/^djb-(in|ta|tin)$/.test(ae.id))keep={id:ae.id,s:ae.selectionStart};
 root.className='djb-root';
 root.innerHTML=S.step==='start'?sStart():S.step==='say'?sSay():S.step==='chat'?sChat():sPreview();
 var th=document.getElementById('djb-thread');if(th&&S.step==='chat'){var last=th.lastElementChild;if(last&&focus)last.scrollIntoView({block:'nearest',behavior:'smooth'});}
 var tt=document.getElementById('djb-tt');if(tt)tt.scrollTop=tt.scrollHeight;
 var el=keep&&document.getElementById(keep.id);
 if(el){el.focus({preventScroll:true});try{el.setSelectionRange(keep.s,keep.s);}catch(e){}}
 else if(focus){var f=S.tune?document.getElementById('djb-tin'):document.getElementById('djb-h')||document.getElementById('djb-in');if(f)f.focus({preventScroll:true});}
}
function micStop(){if(rec){try{rec.stop();}catch(e){}rec.on=false;}}
function mic(tid){
 S.micErr='';
 if(rec&&rec.on){micStop();render(false);return;}
 var el=document.getElementById(tid);if(!el||!SR)return;
 var base=el.value?el.value.replace(/\s+$/,'')+' ':'';
 var r=new SR();r.lang=navigator.language||'en-US';r.continuous=true;r.interimResults=true;
 r.onresult=function(ev){var fin='',live='',k;for(k=0;k<ev.results.length;k++){var x=ev.results[k][0].transcript;if(ev.results[k].isFinal)fin+=x;else live+=x;}
  var e2=document.getElementById(tid);if(!e2)return;e2.value=base+fin+live;e2.dispatchEvent(new Event('input',{bubbles:true}));};
 r.onerror=function(ev){var c=ev&&ev.error;S.micErr=(c==='not-allowed'||c==='service-not-allowed')?'Microphone access is blocked. Allow it in your browser settings, or type instead.':c==='no-speech'?'I did not hear anything. Tap the microphone and try again.':'Voice typing stopped. You can type instead.';r.on=false;render(false);};
 r.onend=function(){if(r.on){r.on=false;render(false);}};
 rec=r;r.on=true;try{r.start();}catch(e){r.on=false;S.micErr='Voice typing could not start. You can type instead.';}
 render(false);
}
function finishUp(){micStop();var f=cb&&cb.done;S=fresh();if(f)f();}

/* ── actions ── */
function chatSend(){
 var inp=document.getElementById('djb-in');var v=inp?inp.value.trim():'';micStop();
 if(!v){return;}
 S.draft='';
 if(S.phase==='alerts'){parseAlerts(v);S.step='preview';render(true);return;}
 if(!S.sent||S.phase==='metrics'&&!S.sent){parseMetrics(v);syncAl();S.sent=true;S.phase='freq';render(true);return;}
 var f=parseFreq(v);if(f){S.freq=f;S.phase='alerts';render(true);}else{S.micErr='I did not catch how often. Pick one of the options, or say weekly, daily or monthly.';render(false);}
}
function onClick(e){
 if(!S||!root)return;
 if(S.popId&&!e.target.closest('.djb-pop,[data-djb="why"]')){S.popId=null;render(false);}
 var el=e.target.closest('[data-djb]');if(!el||!root.contains(el))return;
 var a=el.getAttribute('data-djb'),v=el.getAttribute('data-v');
 if(a==='begin'){S.step='say';render(true);}
 else if(a==='defaults'){S.role='store manager';S.decides=['what to fix each week','who to recognise'];S.step='preview';render(true);}
 else if(a==='starter'){S.text=STARTERS[+v][1];render(false);var ta=document.getElementById('djb-ta');if(ta){ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);}}
 else if(a==='saysend'){var t=document.getElementById('djb-ta');S.text=t?t.value:S.text;if(!S.text.trim())return;micStop();parseSay(S.text);S.phase='metrics';S.sent=false;S.step='chat';render(true);}
 else if(a==='mic')mic(el.getAttribute('data-t'));
 else if(a==='tm'){S.m[v].on=!S.m[v].on;render(false);}
 else if(a==='usemetrics'){syncAl();S.sent=true;S.phase='freq';render(true);}
 else if(a==='chatsend')chatSend();
 else if(a==='freq'){S.freq=v;S.phase='alerts';render(true);}
 else if(a==='alt'){S.al[v].on=!S.al[v].on;render(false);}
 else if(a==='alok'){S.step='preview';render(true);}
 else if(a==='alnone'){AL.forEach(function(x){S.al[x.id].on=false;});S.step='preview';render(true);}
 else if(a==='tab'){S.tab=v;render(false);}
 else if(a==='alopen'){S.alOpen=S.alOpen===v?null:v;render(false);}
 else if(a==='alopt'){var pr=v.split(':');S.al[pr[0]][pr[1]]=!S.al[pr[0]][pr[1]];render(false);}
 else if(a==='edit-say'){S.step='say';render(true);}
 else if(a==='edit-metrics'){S.step='chat';S.sent=false;S.phase='metrics';render(true);}
 else if(a==='edit-freq'){S.step='chat';S.sent=true;S.phase='freq';render(true);}
 else if(a==='back-chat'){S.step='chat';S.sent=true;S.phase='alerts';render(true);}
 else if(a==='why'){S.popId=S.popId===v?null:v;render(false);var b=root.querySelector('.djb-why.open');if(b)b.focus({preventScroll:true});}
 else if(a==='notuseful'){S.hidden[v]=true;S.popId=null;S.notes.push('Got it. I will show fewer cards like “'+byId(v).title+'”. <button type="button" class="dj-link" data-djb="undo" data-v="'+v+'">Undo</button>');render(false);}
 else if(a==='undo'){delete S.hidden[v];S.notes=S.notes.filter(function(n){return n.indexOf('data-v="'+v+'"')<0;});render(false);}
 else if(a==='tune'){S.tune={id:v,msgs:[]};S.popId=null;S.draft='';render(true);}
 else if(a==='tclose'){micStop();S.tune=null;S.draft='';render(false);}
 else if(a==='tpill'){var p=TUNE_PILLS.filter(function(x){return x[1]===v;})[0];tuneSay(v,p[0],p[0]);render(true);}
 else if(a==='tsend'){var ti=document.getElementById('djb-tin'),tv=ti?ti.value.trim():'';micStop();if(!tv)return;S.draft='';tuneSay(tuneKind(tv),tv);render(true);}
 else if(a==='tapply'){var tn=S.tune,m=tn.msgs[tn.msgs.length-1];m.state='applied';S.tuned[tn.id]=true;if(m.drop){S.hidden[tn.id]=true;}render(false);if(typeof toast==='function')toast(m.drop?'Card removed from your feed':'Card tuned');}
 else if(a==='tno'){var tn2=S.tune;tn2.msgs[tn2.msgs.length-1].state='declined';render(true);}
 else if(a==='build')finishUp();
}
function onKey(e){
 if(!S||!root)return;
 if(e.key==='Escape'){if(S.tune){micStop();S.tune=null;render(false);}else if(S.popId){S.popId=null;render(false);}return;}
 if(e.key==='Enter'&&!e.shiftKey){
  if(e.target.id==='djb-in'){e.preventDefault();chatSend();}
  else if(e.target.id==='djb-tin'){e.preventDefault();var b=root.querySelector('[data-djb="tsend"]');if(b)b.click();}
  else if(e.target.id==='djb-ta'&&(e.metaKey||e.ctrlKey)){e.preventDefault();var g=document.getElementById('djb-go');if(g)g.click();}
 }
}
function onInput(e){
 var t=e.target;if(!S)return;
 if(t.id==='djb-ta'){S.text=t.value;var g=document.getElementById('djb-go');if(g)g.disabled=!t.value.trim();}
 else if(t.id==='djb-in'||t.id==='djb-tin')S.draft=t.value;
 else if(t.hasAttribute&&t.hasAttribute('data-djb-aim'))S.m[t.getAttribute('data-djb-aim')].aim=t.value;
 else if(t.hasAttribute&&t.hasAttribute('data-djb-th'))S.al[t.getAttribute('data-djb-th')].th=t.value;
}

window.djbMount=function(rt,opts){
 root=rt;cb=opts||{};S=fresh();if(cb.prefill){S.text=PRE;S.prefilled=true;}
 if(!bound){bound=true;root.addEventListener('click',onClick);root.addEventListener('keydown',onKey);root.addEventListener('input',onInput);}
 render(false);
};
window.djbUnmount=function(){micStop();S=null;if(root)root.className='';};
})();
