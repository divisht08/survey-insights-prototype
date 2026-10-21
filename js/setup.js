/* ═══ SETUP — AI-guided Day 0 onboarding. Two content packs (Redtag, Generic) on one engine. Prefix dj. ═══
   Globals exposed: djSetupInit (called from main.js), djSetupView. Everything else is private to this file.
   The AI is simulated: it reacts, suggests and parses free text with fixed rules, so the prototype needs no backend. */
(function(){
var SPARK='<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"/></svg>';
var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
var MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>';
var REDUCE=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var REVIEW=7,LAST=8;

var FREQ=[['daily','Daily','Every day at 08:00'],['weekly','Weekly','Start of the workweek, 08:00'],['monthly','Monthly','First workday of the month, 08:00']];
var ALLOW=[['focused','Stay on my list','I only look at the topics and numbers you chose'],['balanced','My list, plus related finds','I stay mostly on your topics and flag a few related things I notice'],['curious','Look across everything','I explore your whole survey and tell you anything that stands out']];


/* ── content pack 1: Redtag. Figures come from the RT ATYAF MALL sample data; the payment spike, cleanliness driver, staff helpfulness, queue topic and extras are the prototype's placeholders ── */
var REDTAG={
 key:'redtag',label:'Redtag',
 known:[['Brand','Redtag, fashion retail'],['Survey','Store visit survey: two satisfaction ratings, service factors, one comment'],['Your access','RT ATYAF MALL. Set by your administrator, so I only show what you can see'],['Responses','261 from 01 Jun to 23 Sep, and 568 from 14 Feb to 31 May'],['Themes','Cleanliness, staff, checkout, fitting rooms, promotions, pricing']],
 obs:{text:'Responses fell from about 37 a week to about 16 since June, so I will be careful with small groups. Separately, complaints about offer clarity show up in both periods.',watch:'Keep an eye on offer clarity',flag:'recurring'},
 decisions:[
  {id:'fix',name:'What to fix in my store this week',sub:'Cleanliness, fitting rooms, tills',short:'What to fix in store',title:'Store operations',pins:['overall','topissue','service'],find:'ins04',kw:['fix','clean','fitting','till','queue','repair','problem','issue','floor','unhappy','complain','wait','dirty','broken','wrong','improve'],persona:'You act on what you can change yourself in the store.'},
  {id:'recognise',name:'Which team members or habits to recognise',sub:'Staff helpfulness and bright spots',short:'Who to recognise',title:'Team and service',pins:['staff','service'],find:'ins06',kw:['recogni','praise','reward','staff','team','thank','morale','good','best','proud','happy'],persona:'You care about recognising good service on your team.'},
  {id:'raise',name:'What to raise beyond the store',sub:'Offers, pricing, payments, staffing',short:'What to raise beyond the store',title:'Escalations',pins:['topissue','volume'],find:'ins05',kw:['raise','escalat','head office','area','central','payment','price','pricing','offer','staffing','report to','manager','boss','senior','pass on','others','supplier'],persona:'You pass on what is not yours to fix, so I will prepare the evidence.'},
  {id:'change',name:'Whether a change I made worked',sub:'A new routine, layout or rota',short:'Whether changes worked',title:'Change tracking',pins:['overall','service'],find:'ins01',kw:['change','worked','trial','rota','layout','before','after','new routine','tried','started','since'],persona:'You test changes and want a clear before and after.'}
 ],
 pins:[
  {id:'overall',name:'Overall satisfaction',sub:'Average out of 10',unit:'out of 10',min:0,max:10,ph:'9.5',val:9.63,disp:'9.63',per:'/10',delta:'+0.40 vs 9.23',kw:['overall','satisfaction']},
  {id:'service',name:'Service satisfaction',sub:'Average out of 10',unit:'out of 10',min:0,max:10,ph:'9.5',val:9.67,disp:'9.67',per:'/10',delta:'+0.37 vs 9.30',kw:['service']},
  {id:'staff',name:'Staff helpfulness',sub:'Service factor rating out of 10',unit:'out of 10',min:0,max:10,ph:'9.5',val:9.1,disp:'9.1',per:'/10',delta:'+0.3 vs 8.8',kw:['staff','helpful']},
  {id:'topissue',name:'Most-mentioned complaint',sub:'The theme customers raise most',disp:'Offer clarity',small:true,delta:'In both periods',kw:['complaint','issue','theme']},
  {id:'volume',name:'Responses per week',sub:'How many customers answered',disp:'16',per:' a week',delta:'Down from about 37 a week',kw:['response','volume','how many']}
 ],
 access:'RT ATYAF MALL',depth:'detailed',depthBasis:'You can switch to the short one at any time.',depthWhy:{simple:'I ask two questions and make the other choices for you. You can review them at the end.',detailed:'I also ask which numbers should lead, whether you have targets, and which changes to flag.'},
 flags:[
  {id:'volume',name:'Fewer survey responses than usual',short:'Low response volume',key:'volume',kw:['fewer','response','volume','low sample']},
  {id:'comparison',name:'A score rising or falling against the previous period',short:'Score changes',key:'ins01',kw:['score','rise','fall','improve','drop','change']},
  {id:'anomaly',name:'A sudden spike in complaints',short:'Complaint spikes',key:'ins05',kw:['spike','sudden','payment','outage']},
  {id:'recurring',name:'A complaint that keeps coming back',short:'Recurring complaints',key:'ins02',kw:['recurring','keeps','offer','again','repeat']},
  {id:'bright',name:'Something going better than before',short:'Bright spots',key:'ins06',kw:['better','bright','praise','good']},
  {id:'segment',name:'One group of shoppers scoring lower than another',short:'Group gaps',key:'fol02',kw:['group','first-time','loyalty','segment','gap']},
  {id:'emerging',name:'A new topic appearing in comments',short:'New topics',key:'queue',kw:['new topic','emerging','queue','weekend']}
 ],
 find:{
  ins01:{title:'Overall store satisfaction improved meaningfully',body:'9.63 out of 10, up 0.40 from 9.23. Based on 261 responses, against 568 in 14 Feb – 31 May.',act:'Review what improved and standardise it across shifts.'},
  ins02:{title:'Offer clarity complaints remain visible',body:'They appear in comments in both periods, with no sign of getting worse.',act:'Audit promo signage and how staff explain offers.',esc:{to:'raise',text:'If the offer rules themselves are unclear, ask for clearer campaign rules and wording.'}},
  ins04:{title:'Store and fitting-room cleanliness is most linked to low satisfaction',body:'About 31% of the variation in satisfaction, and within the store’s control. Based on 261 responses.',voice:'Comments describe clothes left in fitting rooms and a dirty floor near the kids section.',act:'Add a fitting-room reset and a queue check to each shift checklist at peak hours.',esc:{to:'raise',text:'If weekend cover is set centrally, raise the staffing question.'}},
  ins05:{title:'Payment-failure complaints spiked on 14–15 Sep',body:'11 mentions in two days, a sharp break from the usual one a week, from customers who scored very low.',act:'Check with IT whether the card terminals or payment gateway had an outage on those days.',esc:{to:'raise',text:'Ask whether neighbouring stores saw the same spike. If they did, it is likely a network-wide payment issue.'}},
  ins06:{title:'Staff helpfulness is the most-praised part of the visit, and still rising',body:'9.1 out of 10, up 0.3 from 8.8. Friendly, helpful staff is the theme promoters mention most.',voice:'Customers praise being greeted at the door and help finding sizes.',act:'Name what customers praise in the next team briefing, and recognise the shifts behind it.'},
  fol02:{title:'First-time shoppers rated fitting-room help 1.1 points lower than returning shoppers',body:'From the Sun 20 Sep edition. Too few first-time shoppers have answered since to compare again.',act:'Review how first-time shoppers are greeted and guided to the fitting rooms.',esc:{to:'raise',text:'Share what you find before the next edition.'}},
  queue:{title:'Weekend shoppers mention checkout queues more than before',body:'A new topic in comments this period.',voice:'“Only two counters open on the weekend”',act:'Check weekend till cover against footfall.',esc:{to:'raise',text:'If staffing is fixed centrally, raise the cover question.'}},
  volume:{title:'Responses fell from about 37 to 16 a week',body:'568 responses in 14 Feb – 31 May, 261 in 01 Jun – 23 Sep. Small groups may be too thin to compare.',act:'Watch the weekly count. A few quiet weeks can hide real changes.',esc:{to:'raise',text:'Ask whether the survey invitation changed in June.'}}
 },
 explor:[['Comments that mention both fitting rooms and tills score lower','Not on your list. Based on 23 responses, so I will confirm when more arrive.'],['Weekend shoppers mention queues more than weekday shoppers','Not on your list. Not enough responses yet to call it a pattern.']],
 prefill:{decisions:['raise','fix','recognise'],pins:['overall','service','topissue','volume'],targets:{overall:'9.5',service:'9.5'},flags:['anomaly','recurring','bright'],context:'We changed the fitting-room rota in September. Card terminals were reported down on 14\u201315 Sep.',allow:'balanced',freq:'weekly',watch:true},
 prefillNote:'I have filled in each answer to match what this store\u2019s feed shows. Change anything you like.',
 finish:{title:'Store Manager',obj:{recognise:'satisfaction & service quality',raise:'promotions & pricing clarity',fix:'store operations & consistency'},order:['recognise','raise','fix']},
 escLabel:'To raise beyond the store',
 volume:{level:'low',rec:'weekly',note:'About 16 responses a week',why:{daily:'At about 16 responses a week, most days would have nothing new, and one answer could swing a daily average.',weekly:'About 16 responses a week gives each weekly edition enough to say something. I recommend this.',monthly:'Monthly gives the most responses per edition, but a fast problem could wait up to four weeks.'}},
 guard:'With about 16 responses a week I do not compare groups of fewer than 10 responses, and I say so when a group is too small.',
 asks:[['Why did overall satisfaction go up?','It rose 0.40 to 9.63. The strongest link is service: service satisfaction rose 0.37, and staff helpfulness rose 0.3. With 261 responses I can say the two moved together, not that one caused the other.'],['Can I trust the payment spike?','The 11 mentions in two days are well above the usual one a week, so it is unlikely to be chance. 11 is still a small number, so I would confirm with IT before acting.']],
 ctxPh:'For example: keep an eye on fitting-room waits, we changed the rota in September, and the mall had a power cut on 20 Sep',
 sayPh:{0:'For example: “I manage the store and want to know what to fix each week and who to thank”',1:'For example: “I want to know what to fix this week and what to pass to head office”',2:'For example: “mostly satisfaction and what customers complain about”',3:'For example: “aim for 9.5 on overall satisfaction and 9.5 on service”',5:'For example: “tell me about sudden problems first”',7:'For example: “send it every Monday and keep to my list”',8:'Ask anything about this edition, for example: “why did satisfaction go up?”'}
};

/* ── content pack 2: Generic. A retail fashion enterprise running post-contact-center surveys. All figures are illustrative ── */
var GENERIC={
 key:'generic',label:'Generic',
 known:[['Survey','Sent after a contact with the contact center (voice, chat, email or messaging)'],['Questions','CSAT, NPS, effort, first-contact resolution and one comment'],['Your access','All brands and regions. Set by your administrator, so I only show what you can see'],['Responses','1,240 in the last four weeks, 1,180 in the four weeks before'],['Themes','Delivery, returns and refunds, order status, sizing, payments, product quality, agent behaviour']],
 obs:{text:'Refund-delay mentions have tripled in the last two weeks and are now the top reason for low scores. Separately, voice customers score lower than chat customers.',watch:'Keep an eye on refund delays',flag:'recurring'},
 decisions:[
  {id:'coach',name:'Which agents or teams to coach',sub:'Behaviours customers praise or criticise',short:'Who to coach',title:'Team coaching',pins:['csat','ces','fcr'],find:'agent',kw:['coach','agent','team','train','behaviour','behavior','people','staff'],persona:'You work on how your people handle contacts.'},
  {id:'process',name:'Which contact-center processes to change',sub:'Scripts, routing, wait times, authority to resolve',short:'Processes to change',title:'Contact-center processes',pins:['fcr','ces','reason'],find:'driver',kw:['process','script','routing','wait','queue','resolve','workflow','slow','long'],persona:'You change how the contact center works.'},
  {id:'upstream',name:'Which problems to fix outside the contact center',sub:'Delivery, returns, product, payments, policy',short:'Problems to fix upstream',title:'Cross-functional issues',pins:['reason','nps','volume'],find:'spike',kw:['upstream','outside','delivery','return','refund','product','payment','policy','logistics','complain','unhappy'],persona:'You take customer problems to the teams that cause them.'},
  {id:'attention',name:'Which brands, regions or channels need attention',sub:'Places that fall behind the rest',short:'Where to focus',title:'Brand and channel focus',pins:['csat','nps'],find:'channel',kw:['brand','region','channel','compare','portfolio','market','behind','where','worst'],persona:'You look across brands, regions or channels to decide where to focus.'},
  {id:'change',name:'Whether a recent change worked',sub:'A new script, policy, carrier or campaign',short:'Whether changes worked',title:'Change tracking',pins:['csat','fcr'],find:'score',kw:['change','worked','launch','campaign','trial','before','after','tried','started'],persona:'You test changes and want a clear before and after.'}
 ],
 pins:[
  {id:'csat',name:'Customer satisfaction (CSAT)',sub:'Share of customers who were satisfied',unit:'percent',min:0,max:100,ph:'85',val:82,disp:'82%',delta:'+3 points vs previous period',kw:['csat','satisfaction']},
  {id:'nps',name:'Net Promoter Score (NPS)',sub:'Promoters minus detractors',unit:'points',min:-100,max:100,ph:'40',val:34,disp:'34',delta:'+5 vs previous period',kw:['nps','promoter']},
  {id:'fcr',name:'First-contact resolution',sub:'Share of issues solved in one contact',unit:'percent',min:0,max:100,ph:'75',val:71,disp:'71%',delta:'-2 points vs previous period',kw:['first contact','resolution','fcr','resolved']},
  {id:'ces',name:'Customer effort',sub:'How easy it was to get help, out of 7',unit:'out of 7',min:1,max:7,ph:'5.5',val:5.2,disp:'5.2',per:'/7',delta:'+0.2 vs previous period',kw:['effort','easy']},
  {id:'reason',name:'Top reason for low scores',sub:'The contact reason linked to the most unhappy customers',disp:'Refund delays',small:true,delta:'Up from third place',kw:['reason','complaint','low score']},
  {id:'volume',name:'Survey responses',sub:'How many customers answered',disp:'1,240',delta:'Response rate down 3 points',kw:['response','volume','how many']}
 ],
 access:'All brands and regions',depth:'detailed',depthBasis:'Your login covers every brand and region.',depthWhy:{simple:'I ask two questions and make the other choices for you. You can review them at the end.',detailed:'I also ask which numbers should lead, whether you have targets, and which changes to flag.'},
 flags:[
  {id:'comparison',name:'A score rising or falling against the previous period',short:'Score changes',key:'score',kw:['score','rise','fall','improve','drop','change']},
  {id:'anomaly',name:'A sudden spike in a contact reason or complaint',short:'Complaint spikes',key:'spike',kw:['spike','sudden','outage','jump']},
  {id:'recurring',name:'A complaint that keeps coming back',short:'Recurring complaints',key:'refunds',kw:['recurring','keeps','again','repeat','refund']},
  {id:'bright',name:'A team or process doing better than before',short:'Bright spots',key:'bright',kw:['better','bright','praise','good']},
  {id:'segment',name:'One group of customers scoring lower than another',short:'Group gaps',key:'channel',kw:['group','channel','gap','segment','voice']},
  {id:'emerging',name:'A new topic appearing in comments',short:'New topics',key:'emerging',kw:['new topic','emerging','new']},
  {id:'volume',name:'Fewer survey responses than usual',short:'Low response volume',key:'resp',kw:['fewer','response','volume','low sample']}
 ],
 find:{
  score:{title:'Customer satisfaction improved meaningfully',body:'82%, up 3 points from 79%. Based on 1,240 responses against 1,180 in the previous period.',act:'Find what changed in the best-scoring teams and spread it.'},
  refunds:{title:'Refund-delay complaints keep coming back',body:'They appear in comments in every period of the last quarter, and they are the top reason for low scores.',act:'Review how refund requests are explained and tracked.',esc:{to:'upstream',text:'If delays come from payment or warehouse processing, raise them with the team that owns refunds.'}},
  driver:{title:'Not solving the issue in the first contact is most linked to low satisfaction',body:'About 38% of the variation in satisfaction, and within the contact center’s control. Based on 1,240 responses.',voice:'“I had to call three times before anyone could change my delivery address.”',act:'Give agents authority to resolve address changes and exchanges without a transfer.',esc:{to:'upstream',text:'If agents cannot resolve it because the order system blocks it, raise it with the system owner.'}},
  spike:{title:'Delivery-delay complaints spiked in the last week',body:'41 mentions in 5 days, a sharp break from the normal rate, mostly from customers who scored very low.',act:'Check whether a carrier or warehouse issue started that week and add a delay message to the order-status flow.',esc:{to:'upstream',text:'Ask logistics whether a carrier change or backlog started then.'}},
  bright:{title:'The chat team’s handling of size exchanges is the most praised experience, and rising',body:'Satisfaction for exchanges handled in chat is 91%, up 4 points.',voice:'“She found my size in another store and held it for me.”',act:'Write down what these agents do and share it in the next team briefing.'},
  channel:{title:'Voice customers are 9 points less satisfied than chat customers',body:'The gap is widest for returns and refunds, and mostly about waiting to reach an agent.',act:'Review voice wait times and callback options at peak hours.',esc:{to:'upstream',text:'If staffing is set elsewhere, share the wait-time numbers with whoever plans it.'}},
  emerging:{title:'Customers are starting to ask about gift receipts',body:'A new topic in comments this period.',voice:'“Can I return a gift without telling the sender?”',act:'Check whether agents have a clear answer, and add one if not.'},
  agent:{title:'Satisfaction differs by 14 points between the highest and lowest teams',body:'The gap is mostly in how often customers say they were transferred.',act:'Compare how the top and bottom teams handle transfers, then coach on the difference.'},
  resp:{title:'The share of customers who answer the survey fell by 3 points',body:'Small teams or brands may now have too few answers to compare.',act:'Watch the response rate. A few weeks of low answers can hide real changes.',esc:{to:'upstream',text:'Ask whether the survey invitation changed.'}}
 },
 explor:[['Contacts that mention both a return and a delivery delay score lower','Not on your list. Based on 57 responses, so I will confirm when more arrive.'],['Contacts after 6 pm score lower','Not on your list. Evening contacts mention waiting longer. Not enough yet to call it a pattern.']],
 escLabel:'For the team that owns it',
 volume:{level:'ok',rec:'weekly',note:'About 310 responses a week',why:{daily:'At about 310 responses a week, a daily edition would split findings into groups too small to trust.',weekly:'About 310 responses a week is plenty for a weekly edition. I recommend this.',monthly:'Monthly is the most stable, but a spike like delivery delays could wait weeks to reach you.'}},
 guard:'I do not compare groups of fewer than 30 responses, and I say so when a group is too small.',
 asks:[['Why did CSAT go up?','It rose 3 points to 82%. The biggest movement is in chat, where size exchanges improved by 4 points. With 1,240 responses I can say they moved together, not that one caused the other.'],['Is the delivery-delay spike real?','41 mentions in 5 days is far above the normal rate, so it is unlikely to be chance. I would confirm with logistics whether a carrier change started that week.']],
 ctxPh:'For example: watch refund delays, we switched delivery carrier in September, and 20–22 Oct had a system outage',
 sayPh:{0:'For example: “I lead returns and want to know what to change and what to pass to other teams”',1:'For example: “I need to know which teams to coach and which problems to take to logistics”',2:'For example: “mostly CSAT and why people are unhappy”',3:'For example: “aim for 85 on CSAT and 40 on NPS”',5:'For example: “tell me about sudden problems first”',7:'For example: “send it every Monday and keep to my list”',8:'Ask anything about this edition, for example: “why did CSAT go up?”'}
};

var PACKS={redtag:REDTAG,generic:GENERIC};
var P=REDTAG,S=null,view='redtag',host=null,legacy=null,root=null,tmr=[];

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function byId(a,id){for(var k=0;k<a.length;k++){if(a[k].id===id)return a[k];}return null;}
function pair(a,id){for(var k=0;k<a.length;k++){if(a[k][0]===id)return a[k];}return a[0];}
function fresh(){return {i:0,max:0,depth:P.depth,depthBy:'auto',decisions:[],pins:[],targets:{},flags:[],context:'',notes:[],said:[],draft:{},allow:'balanced',freq:null,react:'',free:{},tasks:[],watch:false,asked:[]};}

/* ── derived state ── */
var ORDER=[0,1,2,3,5,6,7,8];
var JARGON=/\b(nps|csat|ces|fcr|cohort\w*|segment\w*|significan\w*|regression|driver analysis|cross[- ]?tab\w*|benchmark\w*|statistic\w*|attribution|root cause|kpi|confidence interval)\b/i;
function seq(){return S.depth==='detailed'?[0,1,2,3,5,6,7,8]:[0,1,6,7,8];}
function leadPins(){return S.pins.length?S.pins:suggest(2).slice(0,3);}
function flagList(){return S.flags.length?S.flags:suggest(5);}
function numPins(){return leadPins().map(function(id){return byId(P.pins,id);}).filter(function(p){return p&&p.unit;});}
function tState(p){var v=(S.targets[p.id]||'').trim();if(!v)return 'empty';if(!/^-?\d+(\.\d+)?$/.test(v))return 'bad';var n=parseFloat(v);return(n<p.min||n>p.max)?'bad':'ok';}
function scopeText(){return P.access;}
function stepFrom(from,d){var at=ORDER.indexOf(from),q=seq();for(var k=at+d;k>=0&&k<ORDER.length;k+=d){var id=ORDER[k];if(q.indexOf(id)>-1&&!(id===3&&!numPins().length))return id;}return from;}
function canNext(){
 var i=S.i;
 if(i===1)return S.decisions.length>0||S.said.length>0||!!(S.draft[1]||'').trim();
 if(i===3)return numPins().every(function(p){return tState(p)!=='bad';});
 return true;
}
function needText(){
 if(canNext())return '';
 return S.i===3?'Fix the targets to continue':'Say it in your own words or pick one to continue';
}

/* ── the active AI: suggestions, reactions, free-text parsing, background work, what it has learned ── */
function suggest(i){
 var out=[],seen={};
 if(i===2){S.decisions.forEach(function(d){byId(P.decisions,d).pins.forEach(function(p){if(!seen[p]){seen[p]=1;out.push(p);}});});return out.slice(0,4);}
 if(i===5){
  if(P.volume.level==='low'){out.push('volume');seen.volume=1;}
  if(S.watch)P.flags.forEach(function(f){if(f.id===P.obs.flag&&!seen[f.id]){seen[f.id]=1;out.push(f.id);}});
  S.decisions.forEach(function(d){var key=byId(P.decisions,d).find;P.flags.forEach(function(f){if(f.key===key&&!seen[f.id]){seen[f.id]=1;out.push(f.id);}});});
  P.flags.forEach(function(f){if(f.id==='anomaly'&&!seen.anomaly){seen.anomaly=1;out.push('anomaly');}});
  return out.slice(0,3);
 }
 return out;
}
function suggestWhy(i){
 if(i===2)return 'These fit the decisions you picked.';
 if(i===5)return (P.volume.level==='low'?'Low response volume comes first because it changes how much I can trust everything else. ':'')+'The rest connect to your decisions.';
 return '';
}
function whyOne(i,id){
 if(i===2){var ds=S.decisions.filter(function(d){return byId(P.decisions,d).pins.indexOf(id)>-1;}).map(function(d){return '“'+byId(P.decisions,d).short+'”';});return ds.length?'Fits what you want to do: '+ds.join(', ')+'.':'Fits what you want to do.';}
 if(i===5){
  if(id===P.obs.flag&&S.watch)return 'You asked me to keep an eye on this.';
  if(id==='volume'&&P.volume.level==='low')return 'With few responses, every other result is less certain, so I check this first.';
  var ds2=S.decisions.filter(function(d){return byId(P.flags,id)&&byId(P.decisions,d).find===byId(P.flags,id).key;}).map(function(d){return '“'+byId(P.decisions,d).short+'”';});
  if(ds2.length)return 'Connects to '+ds2.join(', ')+'.';
  if(id==='anomaly')return 'A sudden spike is worth knowing about quickly.';
 }
 return suggestWhy(i);
}
function parse(i,text){
 var t=text.toLowerCase(),defs=i===1?P.decisions:i===2?P.pins:P.flags,max=i===1?3:i===2?4:3,key=i===1?'decisions':i===2?'pins':'flags',hit=[];
 defs.forEach(function(d){if(d.kw.some(function(w){return t.indexOf(w)>-1;}))hit.push(d.id);});
 var added=[];hit.forEach(function(id){if(S[key].indexOf(id)<0&&S[key].length<max){S[key].push(id);added.push(id);}});
 if(!hit.length)return 'I could not match that to an option, so I saved your words and will use them to understand what you need. Pick from the list if you want something specific.';
 if(!added.length)return 'Those are already chosen. I saved your words too.';
 var names=added.map(function(id){return byId(defs,id).short||byId(defs,id).name;});
 return 'From what you wrote I chose: '+names.join(', ')+'. I also saved your words. Change it if I got it wrong.';
}
function parseContext(text){
 var t=text.toLowerCase(),n=[];
 if(/outage|down|incident|power cut|failure/.test(t))n.push('I will treat the days you mention carefully and say when a result depends on them.');
 if(/launch|campaign|promo|sale|offer/.test(t))n.push('I will compare before and after the launch or campaign you mention.');
 if(/carrier|supplier|vendor|policy|rota|roster|layout|switch|changed/.test(t))n.push('I will check for a shift in results after the change you mention.');
 return n;
}
function parseTargets(text){
 var got=[],cl=text.toLowerCase().split(/[,;\n]| and |\. /);
 numPins().forEach(function(p){cl.forEach(function(c){
  if(got.indexOf(p.name)>-1||!p.kw.some(function(w){return c.indexOf(w)>-1;}))return;
  var m=c.match(/-?\d+(\.\d+)?/);if(!m)return;var n=parseFloat(m[0]);
  if(n>=p.min&&n<=p.max){S.targets[p.id]=m[0];got.push(p.name);}
 });});
 return got.length?'I set targets for: '+got.join(', ')+'. Check the boxes above and change anything.':'I could not match a number to one of your numbers, so I saved your words. You can type it in the boxes above, or say for example “aim for '+(numPins()[0]?numPins()[0].ph+' on '+numPins()[0].name.toLowerCase():'9.5')+'”.';
}
function parseDelivery(text){
 var t=text.toLowerCase(),o=[];
 if(/daily|every day/.test(t)){S.freq='daily';o.push('daily');}
 else if(/weekly|every week|once a week|every (mon|tue|wed|thu|fri)/.test(t)){S.freq='weekly';o.push('weekly');}
 else if(/monthly|every month|once a month/.test(t)){S.freq='monthly';o.push('monthly');}
 if(/only my list|stay on my list|stick to my list|nothing else|no extras|focused/.test(t)){S.allow='focused';o.push('only your list');}
 else if(/look wide|look across|everything|anything|surprise|curious/.test(t)){S.allow='curious';o.push('look widely');}
 return o.length?'Updated: '+o.join(', ')+'. I also saved your words.':'I could not match that to delivery options, so I saved your words. Choose from the options above if you want to change how often or how wide I look.';
}
function askAnswer(text){
 var w=text.toLowerCase();
 for(var k=0;k<P.asks.length;k++){var ws=P.asks[k][0].toLowerCase().replace(/[^a-z ]/g,' ').split(' ').filter(function(x){return x.length>3;});if(ws.some(function(x){return w.indexOf(x)>-1;}))return P.asks[k][1];}
 return 'In the live product I answer from your actual responses. In this example edition, try one of the questions above.';
}
function respond(i,text){
 S.said.push(text);
 var r=(i===0||i===1)?parse(1,text):i===2?parse(2,text):i===3?parseTargets(text):i===5?parse(5,text):i===REVIEW?parseDelivery(text):askAnswer(text);
 if(i<LAST&&S.depth==='simple'&&JARGON.test(text)){S.depth='detailed';S.depthBy='text';r+=' I switched to the detailed setup so you can set more yourself. Use the link at the top to go back to the short one.';}
 return r;
}
function persona(){
 var l=S.max<1?[]:S.decisions.map(function(id){return byId(P.decisions,id).persona;});
 if(S.max>=1)l.push('Your access: '+P.access+'.');
 if(S.max>=2&&leadPins().length)l.push('You read '+byId(P.pins,leadPins()[0]).name+' first.');
 if(S.max>=5&&flagList().length)l.push('You want to hear first about '+byId(P.flags,flagList()[0]).short.toLowerCase()+'.');
 if(S.max>=6&&S.notes.length)l.push('You gave me context I will use to explain changes.');
 return l;
}
function addTask(t){
 var o={t:t,done:REDUCE};S.tasks.push(o);
 if(!REDUCE){var id=setTimeout(function(){o.done=true;if(root)paintRail();},1300);tmr.push(id);}
}
function reactAfter(i){
 if(i===1){return 'Got it. '+S.decisions.map(function(id){return byId(P.decisions,id).persona;}).join(' ')+' I will build the rest of your feed around that.'+(S.depth==='simple'?' I will choose the numbers and changes to watch myself and show them at the end.':'');}
 if(i===2)return 'I will lead with '+byId(P.pins,leadPins()[0]).name+'. Every other number stays in your feed.'+(numPins().length?' Next you can set targets, or skip.':'');
 if(i===3){var ok=numPins().filter(function(p){return tState(p)==='ok';}).length;return ok?'Targets saved. I will say how far above or below each one you are.':'No targets for now. I will show change against the previous period instead.';}
 if(i===5)return 'I will check for '+flagList().map(function(id){return byId(P.flags,id).short.toLowerCase();}).join(', ')+' first. I also check the rest quietly and only tell you when something is clearly unusual.';
 if(i===6)return S.notes.length?'Noted. '+S.notes.join(' '):'Nothing to note. I will watch for unusual days myself and tell you.';
 return '';
}
var TASKS={1:'Reading comments linked to what you want to do',2:'Calculating all your numbers for the last two periods',5:'Checking for the changes you chose',6:'Scanning for patterns you did not ask about (Exploratory)'};

/* ── rendering ── */
function opt(o){
 var mk=o.mk==='radio'?'<span class="radio'+(o.on?' sel':'')+'"></span>':o.mk==='ord'?'<span class="dj-ord">'+(o.on?o.n:'')+'</span>':'<span class="chk'+(o.on?' sel':'')+'">'+(o.on?CHECK:'')+'</span>';
 return '<button type="button" class="dj-opt" data-dj="'+o.act+'"'+(o.k?' data-k="'+esc(o.k)+'"':'')+' data-v="'+esc(o.v)+'"'+(o.max?' data-max="'+o.max+'"':'')+' aria-pressed="'+(o.on?'true':'false')+'"'+(o.dis?' disabled':'')+'>'+mk+'<span>'+esc(o.label)+(o.tag?'<span class="tag acc"'+(o.tip?' data-tip="'+esc(o.tip)+'"':'')+'>'+(o.star?SPARK:'')+esc(o.tag)+(o.tip?'<span class="dj-sr">. '+esc(o.tip)+'</span>':'')+'</span>':'')+(o.sub?'<small>'+esc(o.sub)+'</small>':'')+'</span></button>';
}
function multi(label,key,defs,max,ordered,sug){
 var arr=S[key],h='<div class="dj-opts'+(defs.length>4&&key==='pins'?' two':'')+'" role="group" aria-label="'+esc(label)+'">';
 defs.forEach(function(d){var at=arr.indexOf(d.id),on=at>-1;h+=opt({act:'multi',k:key,v:d.id,label:d.name,sub:d.sub,on:on,dis:!on&&arr.length>=max,mk:ordered?'ord':'chk',n:on?at+1:0,max:max,tag:(sug&&sug.indexOf(d.id)>-1)?'Suggested':'',star:true,tip:(sug&&sug.indexOf(d.id)>-1)?whyOne(S.i,d.id):''});});
 var miss=sug?sug.filter(function(id){return arr.indexOf(id)<0;}):[];
 return h+'</div><p class="dj-hint">'+arr.length+' of '+max+' chosen'+(ordered?'. The number shows reading order.':'')+(miss.length&&arr.length<max?' <button type="button" class="dj-link" data-dj="sugg">Select the suggested ones</button>':'')+'</p>';
}
function aiBox(html,actions){return '<div class="dj-ai"><span class="dj-g">'+SPARK+'</span><div>'+html+(actions||'')+'</div></div>';}
function micRow(t,compact){
 var on=REC.on&&REC.t===t,h='<div class="dj-mrow"><button type="button" class="dj-mic'+(on?' on':'')+'" data-dj="mic" data-v="'+t+'" aria-pressed="'+(on?'true':'false')+'"'+(SR?'':' disabled')+'>'+MIC+'<span>'+(on?'Stop':'Speak')+'</span></button>';
 if(on)h+='<span class="dj-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="dj-lis" role="status">Listening… speak naturally, then tap Stop.</span>';
 else if(!SR)h+='<span class="dj-hint" style="margin:0">Voice typing is not supported in this browser. Try Chrome, Edge or Safari, or type.</span>';
 else if(REC.err&&REC.t===t)h+='<span class="dj-err" style="margin:0" role="alert">'+esc(REC.err)+'</span>';
 else if(!compact)h+='<span class="dj-hint" style="margin:0">Tap Speak to dictate. You can edit the text before you send it.</span>';
 return h+'</div>';
}
function talkBox(i,compact){
 var f=S.free[i],h='';
 if(f)h+='<div class="dj-you">'+esc(f.you)+'</div>'+aiBox('<p>'+esc(f.reply)+'</p>');
 var lab=i===LAST?'Ask in your own words':'In your own words';
 var ta='<textarea class="dj-ta dj-say-ta" id="dj-say" rows="'+(compact?1:2)+'" placeholder="'+esc(P.sayPh[i]||'')+'">'+esc(S.draft[i]||'')+'</textarea>';
 if(compact)return h+'<div class="dj-talk dj-talk-c"><label class="eyebrow" for="dj-say">'+lab+'</label><div class="dj-crow">'+ta+micRow('dj-say',true)+'<button type="button" class="btn-sec" data-dj="send">Send</button></div></div>';
 return h+'<div class="dj-talk"><label class="eyebrow" for="dj-say">'+lab+'</label>'+ta+'<div class="dj-tbar">'+micRow('dj-say')+'<button type="button" class="btn-sec" data-dj="send">Send</button></div></div>';
}
function stepBody(){
 var i=S.i,h='',sim=S.depth==='simple';
 if(i===0){
  h+=aiBox('<p><b>What I noticed in your latest responses.</b> '+esc(P.obs.text)+'</p>','<div class="dj-ai-actions"><button type="button" class="btn-sec'+(S.watch?' on':'')+'" data-dj="watch" aria-pressed="'+(S.watch?'true':'false')+'">'+(S.watch?'I will watch it':esc(P.obs.watch))+'</button></div>');
  return h;
 }
 if(i===1)return talkBox(1)+'<span class="eyebrow dj-lbl2">Or pick from the list</span>'+multi('Decisions','decisions',P.decisions,3,false);
 if(i===2)return talkBox(2)+aiBox('<p><b>Nothing is left out.</b> I track every number in your survey. This only decides what comes first.</p>')+'<span class="eyebrow dj-lbl2">Or pick from the list</span>'+multi('Numbers that lead','pins',P.pins,4,true,suggest(2));
 if(i===3){
  numPins().forEach(function(p){var st=tState(p);h+='<div class="dj-field"><label class="eyebrow dj-lbl2" style="margin-top:0" for="dj-t-'+p.id+'">'+esc(p.name)+'</label><div class="dj-frow"><input type="text" class="dj-inp" id="dj-t-'+p.id+'" data-t="'+p.id+'" inputmode="decimal" autocomplete="off" placeholder="e.g. '+esc(p.ph)+'" value="'+esc(S.targets[p.id]||'')+'" aria-invalid="'+(st==='bad'?'true':'false')+'"><span class="dj-unit">'+esc(p.unit)+'</span></div><p class="dj-err" id="dj-e-'+p.id+'"'+(st==='bad'?'':' hidden')+'>Enter a number from '+p.min+' to '+p.max+'.</p></div>';});
  return talkBox(3)+'<span class="eyebrow dj-lbl2">Or type them here</span>'+h+'<p class="dj-hint">Leave any empty if you have no target for it.</p>';
 }
 if(i===5)return talkBox(5)+'<span class="eyebrow dj-lbl2">Or pick from the list</span>'+multi('Changes to flag','flags',P.flags,3,false,suggest(5));
 if(i===6)return '<label class="eyebrow dj-lbl2" style="margin-top:0" for="dj-ctx">What else should I track or focus on? (optional)</label><textarea class="dj-ta" id="dj-ctx" placeholder="'+esc(P.ctxPh)+'">'+esc(S.context)+'</textarea><div class="dj-tbar">'+micRow('dj-ctx')+'</div>';
 if(i===REVIEW){
  var rec=P.volume.rec;
  h+=talkBox(7,true)+uTable();
  h+='<span class="eyebrow dj-lbl2">How often should a new edition arrive?</span><div class="dj-cad" role="group" aria-label="Frequency">';
  FREQ.forEach(function(f){h+=opt({act:'pick',k:'freq',v:f[0],label:f[1],sub:f[2],on:S.freq===f[0],mk:'radio',tag:f[0]===rec?'Recommended':'',star:f[0]===rec});});
  h+='</div><p class="dj-hint">'+esc(P.volume.why[S.freq])+'</p>';
  if(sim)h+='<p class="dj-hint">I will mostly stay on your list and flag a few related things I notice, marked Exploratory. Switch to the detailed setup to change how widely I look.</p>';
  else{h+='<span class="eyebrow dj-lbl2">How widely should I look for insights?</span><p class="dj-hint" style="margin:2px 0 10px">This sets how far my analysis goes. I always cover your list. Choose whether I also explore beyond it.</p><div class="dj-cad" role="group" aria-label="How widely I look">';
  ALLOW.forEach(function(a){h+=opt({act:'pick',k:'allow',v:a[0],label:a[1],sub:a[2],on:S.allow===a[0],mk:'radio'});});
  h+='</div>';}
  return h+'<p class="dj-hint">I keep learning from what you follow, dismiss or rate, and I will check in again after 30 days.</p>';
 }
 return findings();
}
function nextHtml(f){
 var h='<p class="nx"><b>Suggested next step:</b> '+esc(f.act)+'</p>';
 if(f.esc&&S.decisions.indexOf(f.esc.to)>-1)h+='<p class="nx2"><b>'+esc(P.escLabel)+':</b> '+esc(f.esc.text)+'</p>';
 return h;
}
function findHtml(f,pill,cls){return '<div class="dj-find '+(cls||'')+'"><span class="tag acc">'+pill+'</span><h4 class="h4">'+esc(f.title)+'</h4><p>'+esc(f.body)+'</p>'+(f.voice?'<p class="q">'+esc(f.voice)+'</p>':'')+nextHtml(f)+'</div>';}
function findings(){
 var h='<div class="dj-banner">Example edition on sample figures. All numbers are illustrative.</div><div class="dj-tiles">';
 var lead=leadPins(),order=lead.concat(P.pins.map(function(p){return p.id;}).filter(function(id){return lead.indexOf(id)<0;}));
 order.forEach(function(id){
  var p=byId(P.pins,id),t=(S.targets[id]||'').trim(),tt='';
  if(p.unit&&tState(p)==='ok'){var d=Math.round((p.val-parseFloat(t))*100)/100;tt=d===0?'<div class="t ok">On target of '+esc(t)+'</div>':d<0?'<div class="t">'+Math.abs(d)+' below target of '+esc(t)+'</div>':'<div class="t ok">'+d+' above target of '+esc(t)+'</div>';}
  h+='<div class="dj-tile"><div class="k">'+esc(p.name)+(lead.indexOf(id)>-1?'<span class="tag acc">Leads</span>':'')+'</div><div class="big v'+(p.small?' sm':'')+'">'+esc(p.disp)+(p.per?'<small>'+esc(p.per)+'</small>':'')+'</div><div class="d">'+esc(p.delta)+'</div>'+tt+'</div>';
 });
 h+='</div><p class="dj-hint" style="margin:-4px 0 12px">Showing '+esc(scopeText())+', from your access. Every number is tracked; the ones marked Leads come first. '+esc(P.guard)+'</p>';
 var seen={},n=0;
 S.decisions.forEach(function(id){var k=byId(P.decisions,id).find;if(seen[k])return;seen[k]=1;n++;h+=findHtml(P.find[k],'From what you want to do','acc');});
 flagList().forEach(function(id){var k=byId(P.flags,id).key;if(seen[k]||n>=4)return;seen[k]=1;n++;h+=findHtml(P.find[k],'From your list','acc');});
 if(S.context.trim())h+='<div class="dj-find wrn"><span class="tag wrn">Noted</span><h4 class="h4">I will keep this in mind: “'+esc(S.context.trim())+'”</h4><p>I will use it to explain changes and to be careful with the days it affects.</p></div>';
 if(S.allow==='focused')h+='<div class="dj-find dash"><span class="tag wrn">Exploratory</span><h4 class="h4">Switched off</h4><p>You chose Stay on my list, so I am not looking beyond it. You can change this in your plan.</p></div>';
 else{
  h+='<div class="dj-find wrn"><span class="tag wrn">Exploratory</span><h4 class="h4">'+esc(P.explor[0][0])+'</h4><p>'+esc(P.explor[0][1])+'</p><p class="nx"><b>Suggested next step:</b> No action yet. I will tell you if it holds.</p></div>';
  if(S.allow==='curious')h+='<div class="dj-find wrn"><span class="tag wrn">Exploratory</span><h4 class="h4">'+esc(P.explor[1][0])+'</h4><p>'+esc(P.explor[1][1])+'</p><p class="nx"><b>Suggested next step:</b> No action yet. I will tell you if it holds.</p></div>';
 }
 h+=aiBox('<p><b>Ask me anything about this edition.</b></p>','<div class="dj-chips">'+P.asks.map(function(a,k){return '<button type="button" class="btn-sec" data-dj="ask" data-v="'+k+'">'+esc(a[0])+'</button>';}).join('')+'</div>');
 S.asked.forEach(function(k){h+='<div class="dj-you">'+esc(P.asks[k][0])+'</div>'+aiBox('<p>'+esc(P.asks[k][1])+'</p>');});
 return h+talkBox(8)+'<p class="dj-hint">Next edition: '+esc(pair(FREQ,S.freq)[1].toLowerCase())+'. I will check in after 30 days.</p>';
}

var COPY=function(i){
 var gen=P.key==='generic',sim=S.depth==='simple';
 return {
  0:{q:'Let’s set up your insights feed. I have already read your '+(gen?'post-contact':'store visit')+' survey, so I only need to know what you want from it.',why:sim?'About a minute. I ask two questions and set up the rest myself. You can change everything later.':'About three minutes. Each answer shapes the next question, and you can change everything later.'},
  1:{q:'What do you want this feed to help you do?',why:'Say it in your own words, speak it, or pick from the list. Up to three. This is all I need to start. I set up the rest.'},
  2:{q:'Which numbers should lead your feed?',why:'I track every number in your survey. This only decides what comes first. Skip it and I will choose from what you want to do.',seen:'Your survey has '+(gen?'CSAT, NPS, effort and first-contact resolution, plus an open comment.':'two satisfaction ratings out of 10, five service factors and an open comment.')},
  3:{q:'Do you have a target for any of these?',why:'Optional. With a target I can say how far above or below you are. You can skip this.'},
  5:{q:'Which changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.',seen:'You have two periods to compare: '+(gen?'the last four weeks and the four weeks before.':'01 Jun – 23 Sep and 14 Feb – 31 May.')},
  6:{q:'Tell me anything else you want to track, or anything I should focus on.',why:'For example something you want watched, a launch, a policy change, a supplier switch or an outage. I use it to keep an eye on what matters to you and to explain changes. Optional. You can type or speak.'},
  7:{q:'Check what I understood, then build your feed.',why:'Each row shows what you told me and how I understood it. Change anything with Edit, or tell me in your own words.'},
  8:{q:'Your feed is live. Here is what the last edition looks like.',why:'Built on sample figures. All numbers are illustrative.'}
 }[i];
};
function srcNote(i){
 var g=P===GENERIC,sv=g?'post-contact survey':'store-visit survey';
 return {
  1:['Everything else hangs off the job this feed does. It decides which numbers lead and which changes are flagged.','AI builds the list of jobs from your survey context: its questions, your industry and brand, and the responses so far. Your own words are matched against that list. In this mock-up the list is hand-written for the '+sv+'.'],
  2:['This decides what sits at the top of every edition. All numbers are still tracked.','The choices come from the rating, score and response-count questions that actually exist in your survey. Suggestions come from linking the jobs you picked to those numbers. In this mock-up the numbers are sample figures.'],
  3:['A target lets the feed say how far above or below you are, instead of only showing a number.','Targets are typed in by you and saved with your feed. The platform has no goals setting today, so nothing is filled in for you. The current value comes from your responses. In this mock-up it is sample data.'],
  5:['This decides which changes reach the top of the feed. I still check for all of them.','These are fixed checks that run on every survey: change against the last period, sudden spikes, repeating complaints, new topics, group gaps and low volume. A check only appears if your survey has the data for it, such as comments or two periods to compare.'],
  6:['Numbers cannot know about a launch, an outage or something you care about. This lets me watch it and explain changes.','What you write is saved with your feed. I turn it into topics to watch and notes on the dates it affects, and you can edit them later. In this mock-up I match a few keywords to show the idea.'],
  7:['So you can check I understood you before anything is built.','This is the saved setup for your feed. It is the same list of choices I use to build every edition, and you can reopen it any time.']
 }[i]||null;
}
function srcBlock(i){
 var n=srcNote(i);if(!n)return '';
 return '<div class="dj-src"><span class="dj-info" tabindex="0" role="note" aria-label="Mock-up note. Why this question: '+esc(n[0])+' Where it comes from in the live product: '+esc(n[1])+'"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.2v4M8 4.8v.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>Mock-up note<span class="dj-pop" aria-hidden="true"><b>Why this question</b>'+esc(n[0])+'<b>Where it comes from in the live product</b>'+esc(n[1])+'</span></span></div>';
}
function stage(){
 var i=S.i,c=COPY(i),h='',k,qs=seq().filter(function(x){return x>=1&&x<=6;}),at=qs.indexOf(i);
 h+='<div class="dj-body"><div class="dj-head"><div class="dj-head-l"><span class="dj-ava">'+SPARK+'</span><div><div class="eyebrow">Survey Insights setup</div></div></div>';
 if(i===1)h+='<button type="button" class="dj-link" data-dj="depth">'+(S.depth==='simple'?'Want more control? Use detailed setup':'Prefer fewer questions? Use short setup')+'</button>';
 h+='</div>';
 if(at>-1){var b='';for(k=0;k<qs.length;k++)b+='<i class="'+(k<=at?'on':'')+'"></i>';h+='<div class="dj-prog" aria-hidden="true">'+b+'</div><p class="dj-step">Question '+(at+1)+' of '+qs.length+((i===3||i===5||i===6)?' · optional':'')+'</p>';}
 else h+='<p class="dj-step">'+(i===0?'Welcome':i===REVIEW?'Review':i===LAST?'First edition':'Editing')+'</p>';
 if(S.react&&i>=2&&i<REVIEW)h+=aiBox('<p>'+esc(S.react)+'</p>');
 h+='<h2 class="d3 dj-q" id="dj-q" tabindex="-1">'+esc(c.q)+'</h2>';
 if(c.why)h+='<p class="dj-why">'+esc(c.why)+'</p>';
 h+=srcBlock(i);
 if(c.seen)h+='<p class="dj-seen"><b>What I can see</b><span>'+esc(c.seen)+'</span></p>';
 h+=stepBody()+'</div><div class="dj-foot"><p class="dj-hint dj-needs" id="dj-navhint" role="status">'+(i>0&&i<LAST?needText():'')+'</p><div class="dj-nav">';
 if(i===LAST){h+='<button type="button" class="btn-sec" data-dj="restart">Start over</button><button type="button" class="btn-pri" data-dj="finish">Open my feed</button>';}
 else{
  h+=i>0?'<button type="button" class="btn-sec" data-dj="back">Back</button>':'<button type="button" class="dj-link" data-dj="defaults">Skip and use a recommended setup</button>';
  var lab=i===0?'Start':i===REVIEW?'Build my feed':'Next';
  if(i===3&&!numPins().some(function(p){return tState(p)==='ok';}))lab='Skip';
  if(i===2&&!S.pins.length)lab='Skip';
  if(i===5&&!S.flags.length)lab='Skip';
  if(i===6&&!S.context.trim())lab='Skip';
  h+='<span class="dj-navr"><button type="button" class="btn-pri" id="dj-next" data-dj="next"'+(canNext()?'':' disabled')+'>'+lab+'</button></span>';
 }
 return h+'</div></div>';
}
function brow(l,html,step){return '<div class="dj-brow"><div class="dj-bl">'+l+'</div><div class="dj-bv">'+(html||'<span class="dj-mut">Not yet</span>')+'</div>'+(html&&step!==null&&step!==S.i&&S.i>0&&S.i<LAST?'<button type="button" class="dj-edit" data-dj="go" data-v="'+step+'" aria-label="Edit '+esc(l.toLowerCase())+'">Edit</button>':'<span></span>')+'</div>';}
function ls(a){return a.map(function(t){return '<div>'+t+'</div>';}).join('');}
function trunc(t){return t.length>70?t.slice(0,67)+'…':t;}
function qt(t){t=String(t);return '<div class="dj-say-q">“'+esc(t.length>150?t.slice(0,147)+'…':t)+'”</div>';}
function mut(t){return '<div class="dj-mut">'+esc(t)+'</div>';}
function chip(){return '<span class="tag acc">'+SPARK+'I chose this for you</span>';}
function uRows(){
 var R=[],sim=S.depth==='simple',fq=pair(FREQ,S.freq||P.volume.rec),al=pair(ALLOW,S.allow);
 var dq=[S.free[0],S.free[1]].filter(Boolean).map(function(f){return qt(f.you);}).join('');
 R.push({l:'What you want to do',s:1,y:dq+(S.guessed?chip():'')+ls(S.decisions.map(function(id){return esc(byId(P.decisions,id).short);})),a:ls(S.decisions.map(function(id){return esc(byId(P.decisions,id).persona);}))});
 var lp=leadPins().map(function(id){return byId(P.pins,id).name;});
 R.push({l:'Numbers that lead',s:2,y:(S.free[2]?qt(S.free[2].you):'')+(S.pins.length?ls(S.pins.map(function(id,n){return (n+1)+' '+esc(byId(P.pins,id).name);})):chip()),a:esc('I will lead with '+lp[0]+(lp.length>1?', then '+lp.slice(1).join(', '):'')+'. Every other number in your survey stays in your feed.')});
 var ok=numPins().filter(function(p){return tState(p)==='ok';});
 R.push({l:'Targets',s:3,y:(S.free[3]?qt(S.free[3].you):'')+(ok.length?ls(ok.map(function(p){return esc(p.name+': '+S.targets[p.id].trim());})):mut('None set')),a:esc(ok.length?'I will say how far above or below each target you are.':'I will show change against the previous period instead.')});
 var fl=flagList().map(function(id){return byId(P.flags,id).short;});
 R.push({l:'Changes to tell you first',s:5,y:(S.free[5]?qt(S.free[5].you):'')+(S.flags.length?ls(S.flags.map(function(id){return esc(byId(P.flags,id).short);})):chip()),a:esc('I will check '+fl.join(', ').toLowerCase()+' first. I check everything else quietly and tell you only when something is clearly unusual.')});
 R.push({l:'Anything else to track',s:6,y:S.context.trim()?qt(S.context.trim()):mut('Nothing added'),a:esc(S.notes.length?S.notes.join(' '):S.context.trim()?'I will keep this in mind when I explain changes.':'Nothing to adjust. I will watch for unusual days myself and tell you.')});
 R.push({l:'Delivery',s:null,y:(S.free[7]?qt(S.free[7].you):'')+esc(fq[1]+' · '+al[1]),a:esc('A new edition arrives '+fq[2].toLowerCase().replace(/^start/,'at the start')+'. '+(S.allow==='focused'?'I will report only what is on your list.':S.allow==='curious'?'I will explore your whole survey and tell you anything that stands out, marked Exploratory.':'I will stay mostly on your list and flag a few related things I notice, marked Exploratory.'))});
 R.push({l:'Who can see it',s:null,y:mut('Set by your administrator'),a:esc('I will only show '+P.access+'.')});
 return R;
}
function uTable(){
 var h='<div class="dj-und" role="table" aria-label="What you told me and what I understood"><div class="dj-und-h" aria-hidden="true"><span></span><span class="eyebrow">You told me</span><span class="eyebrow dj-und-ai">'+SPARK+'What I understood</span><span></span></div>';
 uRows().forEach(function(r){h+='<div class="dj-und-r" role="row"><div class="dj-und-l eyebrow" role="rowheader">'+esc(r.l)+'</div><div class="dj-und-y" role="cell" data-h="You told me">'+r.y+'</div><div class="dj-und-a" role="cell" data-h="What I understood">'+r.a+'</div><div class="dj-und-e">'+(r.s?'<button type="button" class="dj-edit" data-dj="go" data-v="'+r.s+'" aria-label="Edit '+esc(r.l.toLowerCase())+'">Edit</button>':'')+'</div></div>';});
 return h+'</div>';
}
function planRows(lean){
 var pins=S.max<1?'':leadPins().map(function(id,n){var p=byId(P.pins,id),t=(S.targets[id]||'').trim();return '<div><span class="dj-mut">'+(n+1)+'</span> '+esc(p.name)+(p.unit&&tState(p)==='ok'?'<span class="tag acc">Target '+esc(t)+'</span>':'')+'</div>';}).join('');
 return brow('Decisions',S.max<1?'':ls(S.decisions.map(function(id){return esc(byId(P.decisions,id).short);})),1)+brow(S.depth==='simple'?'I will lead with':'Numbers that lead',pins,2)+brow('Your access',S.max>=1?esc(scopeText()):'',null)+brow('Tells you first',S.max<1?'':ls(flagList().map(function(id){return esc(byId(P.flags,id).short);})),5)+brow('Context',S.max>=6?(S.context.trim()?esc(S.context.trim()):'<span class="dj-mut">Nothing added</span>'):'',6)+(lean?'':brow('In your own words',S.said.length?ls(S.said.slice(-2).map(function(t){return esc(trunc(t));})):'',null)+brow('Delivery',S.max>=REVIEW&&S.freq?esc(pair(FREQ,S.freq)[1])+', '+esc(pair(ALLOW,S.allow)[1].toLowerCase()):'',REVIEW));
}
function paintRail(){
 var el=document.getElementById('dj-rail');if(!el)return;
 var per=persona(),conf=S.max?Math.min(90,15+S.max*13):5;
 var h='<div class="dj-box"><span class="eyebrow">What I am learning about you</span>';
 h+=per.length?'<ul class="dj-know">'+per.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>':'<p class="dj-hint" style="margin:0">Nothing yet. Your first answer tells me the most.</p>';
 h+='<div class="dj-conf"><div class="dj-conf-t"><span>How sure I am</span><span class="num">'+conf+'%</span></div><div class="dj-conf-b"><i style="width:'+conf+'%"></i></div></div></div>';
 var tasks=S.tasks.slice(-4);
 h+='<div class="dj-box"><span class="eyebrow">Working in the background</span>';
 h+=tasks.length?tasks.map(function(t){return '<div class="dj-task'+(t.done?' done':'')+'"><span class="dj-dot'+(t.done?'':' dj-run')+'"></span><span>'+esc(t.t)+(t.done?'. Done':'…')+'</span></div>';}).join(''):'<p class="dj-hint" style="margin:0">I start as soon as you answer.</p>';
 h+='</div>';
 h+='<div class="dj-box"><span class="eyebrow">Your feed plan</span>'+planRows()+'</div>';
 el.innerHTML=h;
}
function fidOf(el){return ['data-dj','data-k','data-v'].map(function(n){return el.getAttribute(n)||'';}).join(':');}
function emptyCard(){
 var sv=P===GENERIC?'post-contact survey':'store visit survey';
 return '<div class="dj-empty"><div class="dj-empty-card"><span class="dj-empty-ico">'+SPARK+'</span><h2 class="d3" id="dj-q" tabindex="-1">Your feed is not set up yet</h2><p>Tell me what you want from your '+sv+' and I will build the feed around it. It takes about two minutes.</p><div class="dj-empty-act"><button type="button" class="btn-pri" data-dj="begin">Set up my feed</button><button type="button" class="btn-sec" data-dj="defaults">Use a recommended setup</button></div></div></div>';
}
function paint(focus){
 if(!root)return;
 if(S.i===0){micAbort();root.innerHTML=emptyCard();return;}
 var ae=document.activeElement,fid=(ae&&ae.getAttribute&&ae.getAttribute('data-dj')&&root.contains(ae))?fidOf(ae):null;
 root.innerHTML='<div class="dj-wrap '+(S.i===REVIEW?'dj-wide':'dj-narrow')+'"><section class="dj-main" id="dj-main">'+stage()+'</section></div>';
 paintRail();
 var tg=root.querySelectorAll('[data-t]');
 for(var k=0;k<tg.length;k++)(function(el){el.addEventListener('input',function(){S.targets[el.getAttribute('data-t')]=el.value;navUI();paintRail();});})(tg[k]);
 var cx=document.getElementById('dj-ctx');
 if(cx)cx.addEventListener('input',function(){S.context=cx.value;var nb=document.getElementById('dj-next');if(nb)nb.textContent=S.context.trim()?'Next':'Skip';paintRail();});
 var sy=document.getElementById('dj-say');
 if(sy){sy.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});sy.addEventListener('input',function(){S.draft[S.i]=sy.value;navUI();});}
 if(focus){var q=document.getElementById('dj-q');if(q)q.focus({preventScroll:true});var mm=document.getElementById('dj-main');if(mm){var rt=mm.getBoundingClientRect();if(rt.top<0||rt.top>innerHeight*0.6)window.scrollTo({top:Math.max(0,rt.top+window.scrollY-12)});}}
 else if(fid){var els=root.querySelectorAll('[data-dj]');for(var j=0;j<els.length;j++){if(fidOf(els[j])===fid){els[j].focus({preventScroll:true});break;}}}
 placeFoot();
}
function placeFoot(){
 var m=document.getElementById('dj-main'),f=m&&m.querySelector('.dj-foot');if(!f)return;
 var r=m.getBoundingClientRect();if(!r.width)return;
 f.style.left=Math.round(r.left)+'px';f.style.width=Math.round(r.width)+'px';
 m.style.minHeight=Math.max(480,Math.round(window.innerHeight-(r.top+window.scrollY)-8))+'px';
 f.style.display=(r.bottom<0||r.top>window.innerHeight-60)?'none':'';
}
function navUI(){
 var nb=document.getElementById('dj-next'),nh=document.getElementById('dj-navhint');
 if(nb){nb.disabled=!canNext();if(S.i===3)nb.textContent=numPins().some(function(p){return tState(p)==='ok';})?'Next':'Skip';}
 if(nh)nh.textContent=needText();
 numPins().forEach(function(p){var e=document.getElementById('dj-e-'+p.id),t=document.getElementById('dj-t-'+p.id),b=tState(p)==='bad';if(e)e.hidden=!b;if(t)t.setAttribute('aria-invalid',b?'true':'false');});
}

/* ── voice typing: the browser's speech recognition fills the text box; nothing is sent until the person presses Send ── */
var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
var REC={r:null,on:false,t:null,base:'',err:''};
function micAbort(){if(REC.r){var r=REC.r;REC.r=null;r.onresult=r.onend=r.onerror=null;try{r.abort();}catch(e){}}REC.on=false;}
function micToggle(t){
 if(REC.on){var same=REC.t===t;if(REC.r){try{REC.r.stop();}catch(e){}}REC.on=false;if(same){paint(false);return;}}
 var el=document.getElementById(t);if(!el||!SR)return;
 REC.err='';REC.t=t;REC.base=el.value?el.value.replace(/\s+$/,'')+' ':'';
 var r=new SR();r.lang=navigator.language||'en-US';r.continuous=true;r.interimResults=true;
 r.onresult=function(ev){
  var fin='',live='',k;for(k=0;k<ev.results.length;k++){var tx=ev.results[k][0].transcript;if(ev.results[k].isFinal)fin+=tx;else live+=tx;}
  var e2=document.getElementById(REC.t);if(!e2)return;e2.value=REC.base+fin+live;e2.dispatchEvent(new Event('input',{bubbles:true}));
 };
 r.onerror=function(ev){
  var c=ev&&ev.error;REC.err=(c==='not-allowed'||c==='service-not-allowed')?'Microphone access is blocked. Allow it in your browser settings, or type instead.':c==='no-speech'?'I did not hear anything. Tap Speak and try again.':'Voice typing stopped. You can type instead.';
  REC.on=false;if(root)paint(false);
 };
 r.onend=function(){if(REC.on){REC.on=false;if(root)paint(false);}};
 REC.r=r;REC.on=true;
 try{r.start();}catch(e){REC.on=false;REC.err='Voice typing could not start. You can type instead.';}
 paint(false);
}

/* ── actions ── */
function go(n){micAbort();REC.err='';S.i=n;if(n>S.max)S.max=n;if(n===REVIEW&&!S.freq)S.freq=P.volume.rec;paint(true);}
function advance(d){
 var from=S.i;
 if(d>0){
  if(from===6)S.notes=S.context.trim()?parseContext(S.context):[];
  var guess=false;
  if(from===1&&!S.decisions.length){S.decisions=[P.decisions[0].id,P.decisions[2].id];guess=true;S.guessed=true;}
  S.react=(guess?'I was not sure which option fits what you wrote, so I started with “'+byId(P.decisions,S.decisions[0]).short+'” and “'+byId(P.decisions,S.decisions[1]).short+'”. You can change them from the plan on the right. ':'')+reactAfter(from);if(TASKS[from])addTask(TASKS[from]);
 }
 go(stepFrom(from,d));
}
function applyPrefill(){
 var f=P.prefill;if(!f)return;
 S.decisions=f.decisions.slice();S.pins=f.pins.slice();S.targets=JSON.parse(JSON.stringify(f.targets||{}));
 S.flags=f.flags.slice();S.context=f.context||'';S.allow=f.allow;S.freq=f.freq;S.watch=!!f.watch;
 S.notes=S.context?parseContext(S.context):[];
}
function toggle(a,v,max){var at=a.indexOf(v);if(at>-1)a.splice(at,1);else if(!max||a.length<max)a.push(v);}
function flush(){
 var el=document.getElementById('dj-say');if(!el)return false;
 var t=el.value.trim();if(!t)return false;
 micAbort();
 var i=S.i;S.free[i]={you:t,reply:respond(i,t)};S.draft[i]='';return true;
}
function send(){
 if(!flush())return;
 paint(false);
 var again=document.getElementById('dj-say');if(again)again.focus({preventScroll:true});
}
function finish(to){
 var d0=byId(P.decisions,S.decisions[0]),title=d0?d0.title:'My insights';
 var desc='Insights on '+scopeText()+' — '+S.decisions.map(function(id){return byId(P.decisions,id).short.toLowerCase();}).join(', ');
 if(P.finish){title=P.finish.title;var ob=P.finish.order.filter(function(id){return S.decisions.indexOf(id)>-1;}).map(function(id){return P.finish.obj[id];});desc='Insights on '+scopeText()+(ob.length?' — '+ob.join(', '):'');}
 ['obj-title','drawer-obj-title','w-obj-title'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=title;});
 ['obj-desc','drawer-obj-desc','w-obj-desc'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=desc;});
 micAbort();S=fresh();
 if(typeof setJourney==='function'){setJourney(to||'waiting');if(typeof toast==='function')toast(to==='first-ready'?'Your feed is built — first insights are ready':'Setup saved — monitoring started');}
 else{root.innerHTML='<div class="dj-end">Setup saved. Monitoring has started: <b>'+esc(title)+'</b>. '+esc(desc)+'</div><p style="margin-top:12px"><button type="button" class="btn-sec" data-dj="restart">Start over</button></p>';}
 if(root&&typeof setJourney==='function')paint(false);
}
function onClick(e){
 var el=e.target.closest('[data-dj]');if(!el||!root.contains(el))return;
 var a=el.getAttribute('data-dj'),v=el.getAttribute('data-v'),k=el.getAttribute('data-k');
 if(a==='next'){flush();if(S.i===REVIEW){finish('first-ready');}else if(canNext())advance(1);}
 else if(a==='begin'){advance(1);}
 else if(a==='back'){advance(-1);}
 else if(a==='go'){go(parseInt(v,10));}
 else if(a==='pick'){S[k]=v;paint(false);}
 else if(a==='multi'){toggle(S[k],v,parseInt(el.getAttribute('data-max'),10));paint(false);}
 else if(a==='sugg'){var ids=suggest(S.i),key=S.i===2?'pins':'flags',mx=S.i===2?4:3;ids.forEach(function(id){if(S[key].indexOf(id)<0&&S[key].length<mx)S[key].push(id);});paint(false);}
 else if(a==='send'){send();}
 else if(a==='mic'){micToggle(v);}
 else if(a==='depth'){S.depth=S.depth==='simple'?'detailed':'simple';S.depthBy='user';if(seq().indexOf(S.i)<0)go(stepFrom(S.i,1));else paint(false);}
 else if(a==='watch'){S.watch=!S.watch;var fl=P.obs.flag;if(S.watch&&S.flags.indexOf(fl)<0&&S.flags.length<3)S.flags.push(fl);if(!S.watch)S.flags=S.flags.filter(function(x){return x!==fl;});paint(false);}
 else if(a==='ask'){var q=parseInt(v,10);if(S.asked.indexOf(q)<0)S.asked.push(q);paint(false);}
 else if(a==='defaults'){
  if(P.prefill)applyPrefill();
  else{S.decisions=[P.decisions[0].id,P.decisions[2].id];S.pins=suggest(2).slice(0,3);S.flags=suggest(5);S.freq=P.volume.rec;}
  S.max=REVIEW;
  S.react=P.prefill?'I used the answers that match this store\u2019s feed. Check them, change anything, then build.':'I chose a recommended setup from what I can see in your survey. Check it, change anything, then build.';
  addTask(TASKS[1]);addTask(TASKS[5]);go(REVIEW);
 }
 else if(a==='finish'){finish();}
 else if(a==='restart'){micAbort();S=fresh();tmr.forEach(clearTimeout);tmr=[];paint(true);}
}

/* ── the switcher on the Day 0 screen: current wizard, Redtag AI setup, Generic AI setup ── */
function setView(v){
 view=v;
 var cur=v==='current';
 if(v==='redtag'&&window.djbMount){micAbort();P=PACKS[v];S=fresh();applyPrefill();tmr.forEach(clearTimeout);tmr=[];if(legacy)legacy.classList.add('hidden');root.hidden=false;var bt=host?host.querySelectorAll('[data-djv]'):[];for(var q=0;q<bt.length;q++)bt[q].setAttribute('aria-pressed',bt[q].getAttribute('data-djv')===v?'true':'false');window.djbMount(root,{prefill:!!P.prefill,done:function(){S.decisions=['fix','recognise'];finish('first-ready');}});return;}
 if(window.djbUnmount)window.djbUnmount();
 if(legacy)legacy.classList.toggle('hidden',!cur);
 if(root)root.hidden=cur;
 var bs=host?host.querySelectorAll('[data-djv]'):[];
 for(var k=0;k<bs.length;k++)bs[k].setAttribute('aria-pressed',bs[k].getAttribute('data-djv')===v?'true':'false');
 if(!cur){micAbort();P=PACKS[v];S=fresh();applyPrefill();tmr.forEach(clearTimeout);tmr=[];paint(false);}
}
window.djSetupView=setView;
window.djSetupInit=function(){
 var mount=document.getElementById('journey-not-setup');
 if(!mount||document.getElementById('dj-setup'))return;
 host=mount;legacy=mount.firstElementChild;
 var wrap=document.createElement('div');wrap.id='dj-setup';
 wrap.innerHTML='<div class="dj-top"><span class="dj-lbl">Setup screen</span><div class="dj-switch" role="group" aria-label="Setup screen version"><button type="button" class="dj-tab" data-djv="current" aria-pressed="false">Current</button><button type="button" class="dj-tab" data-djv="redtag" aria-pressed="true">Redtag AI setup</button><button type="button" class="dj-tab" data-djv="generic" aria-pressed="false">Generic AI setup</button></div></div><div id="dj-root"></div>';
 mount.insertBefore(wrap,mount.firstChild);
 root=document.getElementById('dj-root');
 wrap.querySelector('.dj-switch').addEventListener('click',function(e){var b=e.target.closest('[data-djv]');if(b)setView(b.getAttribute('data-djv'));});
 root.addEventListener('click',onClick);
 window.addEventListener('resize',placeFoot);window.addEventListener('scroll',placeFoot,{passive:true});
 if(window.ResizeObserver)new ResizeObserver(placeFoot).observe(root);
 setView('redtag');
};
})();
