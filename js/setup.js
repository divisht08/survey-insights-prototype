/* ═══ SETUP — AI-guided Day 0 onboarding. Two content packs (Redtag, Generic) on one engine. Prefix dj. ═══
   Globals exposed: djSetupInit (called from main.js), djSetupView. Everything else is private to this file.
   The AI is simulated: it reacts, suggests and parses free text with fixed rules, so the prototype needs no backend. */
(function(){
var SPARK='<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"/></svg>';
var CHECK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
var REDUCE=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
var REVIEW=7,LAST=8;

var FREQ=[['daily','Daily','Every day at 08:00'],['weekly','Weekly','First day of your workweek, 08:00'],['monthly','Monthly','First workday of the month, 08:00']];
var ALLOW=[['focused','Only my list','Nothing beyond what I chose'],['balanced','A few extras','Mostly my topics, plus some surprises'],['curious','Look widely','Tell me anything that stands out']];
var OTHER_STORES=['RT DEIRA CITY CENTER','RT SHUWAIKH','RT NAJDA','RT BISHA','RT RIYADH GALLERY','RT ANDALUS - NEW','RT SERAFI MEGA MALL','RT TAMIMI','RT PARK AVENUE','RT DALMA'];

/* ── content pack 1: Redtag. Figures come from the RT ATYAF MALL sample data; the payment spike, cleanliness driver, staff helpfulness, queue topic and extras are the prototype's placeholders ── */
var REDTAG={
 key:'redtag',label:'Redtag',
 known:[['Brand','Redtag, fashion retail'],['Survey','Store visit survey: two satisfaction ratings, service factors, one comment'],['Your access','RT ATYAF MALL'],['Responses','261 from 01 Jun to 23 Sep, and 568 from 14 Feb to 31 May'],['Themes','Cleanliness, staff, checkout, fitting rooms, promotions, pricing']],
 obs:{text:'Responses fell from about 37 a week to about 16 since June, so I will be careful with small groups. Separately, complaints about offer clarity show up in both periods.',watch:'Keep an eye on offer clarity',flag:'recurring'},
 decisions:[
  {id:'fix',name:'What to fix in my store this week',sub:'Cleanliness, fitting rooms, tills',short:'What to fix in store',title:'Store operations',pins:['overall','topissue','service'],find:'ins04',kw:['fix','clean','fitting','till','queue','repair','problem','issue','floor'],persona:'You act on what you can change yourself in the store.'},
  {id:'recognise',name:'Which team members or habits to recognise',sub:'Staff helpfulness and bright spots',short:'Who to recognise',title:'Team and service',pins:['staff','service'],find:'ins06',kw:['recogni','praise','reward','staff','team','thank','morale'],persona:'You care about recognising good service on your team.'},
  {id:'raise',name:'What to raise beyond the store',sub:'Offers, pricing, payments, staffing',short:'What to raise beyond the store',title:'Escalations',pins:['topissue','volume'],find:'ins05',kw:['raise','escalat','head office','area','central','payment','price','pricing','offer','staffing','report to'],persona:'You pass on what is not yours to fix, so I will prepare the evidence.'},
  {id:'change',name:'Whether a change I made worked',sub:'A new routine, layout or rota',short:'Whether changes worked',title:'Change tracking',pins:['overall','service'],find:'ins01',kw:['change','worked','trial','rota','layout','before','after','new routine'],persona:'You test changes and want a clear before and after.'}
 ],
 pins:[
  {id:'overall',name:'Overall satisfaction',sub:'Average out of 10',unit:'out of 10',min:0,max:10,ph:'9.5',val:9.63,disp:'9.63',per:'/10',delta:'+0.40 vs 9.23',kw:['overall','satisfaction']},
  {id:'service',name:'Service satisfaction',sub:'Average out of 10',unit:'out of 10',min:0,max:10,ph:'9.5',val:9.67,disp:'9.67',per:'/10',delta:'+0.37 vs 9.30',kw:['service']},
  {id:'staff',name:'Staff helpfulness',sub:'Service factor rating out of 10',unit:'out of 10',min:0,max:10,ph:'9.5',val:9.1,disp:'9.1',per:'/10',delta:'+0.3 vs 8.8',kw:['staff','helpful']},
  {id:'topissue',name:'Most-mentioned complaint',sub:'The theme customers raise most',disp:'Offer clarity',small:true,delta:'In both periods',kw:['complaint','issue','theme']},
  {id:'volume',name:'Responses per week',sub:'How many customers answered',disp:'16',per:' a week',delta:'Down from about 37 a week',kw:['response','volume','how many']}
 ],
 scope:{type:'confirm',mine:'RT ATYAF MALL',others:OTHER_STORES,q:'You have access to RT ATYAF MALL. Is that everything you look after?',why:'I will only show what is relevant to the stores you own.',noticed:'Your login gives you one store. You can add others if you look after more.'},
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
 escLabel:'To raise beyond the store',
 volume:{level:'low',rec:'weekly',note:'About 16 responses a week',why:{daily:'At about 16 responses a week, most days would have nothing new, and one answer could swing a daily average.',weekly:'About 16 responses a week gives each weekly edition enough to say something. I recommend this.',monthly:'Monthly gives the most responses per edition, but a fast problem could wait up to four weeks.'}},
 guard:'With about 16 responses a week I do not compare groups of fewer than 10 responses, and I say so when a group is too small.',
 asks:[['Why did overall satisfaction go up?','It rose 0.40 to 9.63. The strongest link is service: service satisfaction rose 0.37, and staff helpfulness rose 0.3. With 261 responses I can say the two moved together, not that one caused the other.'],['Can I trust the payment spike?','The 11 mentions in two days are well above the usual one a week, so it is unlikely to be chance. 11 is still a small number, so I would confirm with IT before acting.']],
 ctxPh:'For example: we changed the fitting-room rota in September, and the mall had a power cut on 20 Sep',
 sayPh:{1:'Or tell me in your own words, for example “I run the store and report to an area manager”',2:'Or say it your way, for example “mostly satisfaction and what customers complain about”',5:'Or say it your way, for example “tell me about sudden problems first”'}
};

/* ── content pack 2: Generic. A retail fashion enterprise running post-contact-center surveys. All figures are illustrative ── */
var GENERIC={
 key:'generic',label:'Generic',
 known:[['Survey','Sent after a contact with the contact center (voice, chat, email or messaging)'],['Questions','CSAT, NPS, effort, first-contact resolution and one comment'],['Your access','All brands and regions'],['Responses','1,240 in the last four weeks, 1,180 in the four weeks before'],['Themes','Delivery, returns and refunds, order status, sizing, payments, product quality, agent behaviour']],
 obs:{text:'Refund-delay mentions have tripled in the last two weeks and are now the top reason for low scores. Separately, voice customers score lower than chat customers.',watch:'Keep an eye on refund delays',flag:'recurring'},
 decisions:[
  {id:'coach',name:'Which agents or teams to coach',sub:'Behaviours customers praise or criticise',short:'Who to coach',title:'Team coaching',pins:['csat','ces','fcr'],find:'agent',kw:['coach','agent','team','train','behaviour','behavior'],persona:'You work on how your people handle contacts.'},
  {id:'process',name:'Which contact-center processes to change',sub:'Scripts, routing, wait times, authority to resolve',short:'Processes to change',title:'Contact-center processes',pins:['fcr','ces','reason'],find:'driver',kw:['process','script','routing','wait','queue','resolve','workflow'],persona:'You change how the contact center works.'},
  {id:'upstream',name:'Which problems to fix outside the contact center',sub:'Delivery, returns, product, payments, policy',short:'Problems to fix upstream',title:'Cross-functional issues',pins:['reason','nps','volume'],find:'spike',kw:['upstream','outside','delivery','return','refund','product','payment','policy','logistics'],persona:'You take customer problems to the teams that cause them.'},
  {id:'attention',name:'Which brands, regions or channels need attention',sub:'Places that fall behind the rest',short:'Where to focus',title:'Brand and channel focus',pins:['csat','nps'],find:'channel',kw:['brand','region','channel','compare','portfolio','market','behind'],persona:'You look across brands, regions or channels to decide where to focus.'},
  {id:'change',name:'Whether a recent change worked',sub:'A new script, policy, carrier or campaign',short:'Whether changes worked',title:'Change tracking',pins:['csat','fcr'],find:'score',kw:['change','worked','launch','campaign','trial','before','after'],persona:'You test changes and want a clear before and after.'}
 ],
 pins:[
  {id:'csat',name:'Customer satisfaction (CSAT)',sub:'Share of customers who were satisfied',unit:'percent',min:0,max:100,ph:'85',val:82,disp:'82%',delta:'+3 points vs previous period',kw:['csat','satisfaction']},
  {id:'nps',name:'Net Promoter Score (NPS)',sub:'Promoters minus detractors',unit:'points',min:-100,max:100,ph:'40',val:34,disp:'34',delta:'+5 vs previous period',kw:['nps','promoter']},
  {id:'fcr',name:'First-contact resolution',sub:'Share of issues solved in one contact',unit:'percent',min:0,max:100,ph:'75',val:71,disp:'71%',delta:'-2 points vs previous period',kw:['first contact','resolution','fcr','resolved']},
  {id:'ces',name:'Customer effort',sub:'How easy it was to get help, out of 7',unit:'out of 7',min:1,max:7,ph:'5.5',val:5.2,disp:'5.2',per:'/7',delta:'+0.2 vs previous period',kw:['effort','easy']},
  {id:'reason',name:'Top reason for low scores',sub:'The contact reason linked to the most unhappy customers',disp:'Refund delays',small:true,delta:'Up from third place',kw:['reason','complaint','low score']},
  {id:'volume',name:'Survey responses',sub:'How many customers answered',disp:'1,240',delta:'Response rate down 3 points',kw:['response','volume','how many']}
 ],
 scope:{type:'dims',q:'Do you look after the whole business, or only part of it?',why:'If it is only part, I will leave the rest out of your feed and show only the brands, regions and teams you own.',noticed:'Your login covers every brand and region. Your survey records brand, region, channel and team.',dims:[
  {id:'brand',name:'Brand',vals:['Brand A','Brand B','Brand C','Brand D']},
  {id:'region',name:'Region',vals:['North America','Europe','Middle East','Asia Pacific']},
  {id:'channel',name:'Channel',vals:['Voice','Chat','Email','Messaging']},
  {id:'team',name:'Team or queue',vals:['Orders and delivery','Returns and refunds','Product and sizing','Payments','Loyalty']}
 ]},
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
 ctxPh:'For example: we switched delivery carrier in September, and 20–22 Oct had a system outage',
 sayPh:{1:'Or tell me in your own words, for example “I lead the returns team and report to the head of CX”',2:'Or say it your way, for example “mostly CSAT and why people are unhappy”',5:'Or say it your way, for example “tell me about sudden problems first”'}
};

var PACKS={redtag:REDTAG,generic:GENERIC};
var P=REDTAG,S=null,view='redtag',host=null,legacy=null,root=null,tmr=[];

function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function byId(a,id){for(var k=0;k<a.length;k++){if(a[k].id===id)return a[k];}return null;}
function pair(a,id){for(var k=0;k<a.length;k++){if(a[k][0]===id)return a[k];}return a[0];}
function fresh(){return {i:0,max:0,mode:'chat',decisions:[],pins:[],targets:{},sc:{ans:null,stores:[],dims:[],vals:{}},flags:[],context:'',notes:[],allow:'balanced',freq:null,react:'',free:{},tasks:[],watch:false,asked:[]};}

/* ── derived state ── */
function numPins(){return S.pins.map(function(id){return byId(P.pins,id);}).filter(function(p){return p&&p.unit;});}
function tState(p){var v=(S.targets[p.id]||'').trim();if(!v)return 'empty';if(!/^-?\d+(\.\d+)?$/.test(v))return 'bad';var n=parseFloat(v);return(n<p.min||n>p.max)?'bad':'ok';}
function scopeOk(){
 var s=S.sc;if(s.ans===null)return false;
 if(P.scope.type==='confirm')return s.ans==='mine'||s.stores.length>0;
 if(s.ans==='all')return true;
 return s.dims.length>0&&s.dims.every(function(d){return (s.vals[d]||[]).length>0;});
}
function scopeText(){
 var s=S.sc;
 if(P.scope.type==='confirm')return s.ans==='more'?[P.scope.mine].concat(s.stores).join(', '):P.scope.mine;
 if(s.ans!=='part')return 'The whole business';
 return s.dims.map(function(id){return byId(P.scope.dims,id).name+': '+(s.vals[id]||[]).join(', ');}).join(' · ');
}
function canNext(){
 var i=S.i;
 if(i===1)return S.decisions.length>0;
 if(i===2)return S.pins.length>0;
 if(i===3)return numPins().every(function(p){return tState(p)!=='bad';});
 if(i===4)return scopeOk();
 if(i===5)return S.flags.length>0;
 return true;
}
function needText(){
 if(canNext())return '';
 if(S.i===3)return 'Fix the targets to continue';
 if(S.i===4)return S.sc.ans===null?'Choose one to continue':'Pick at least one value';
 return 'Pick at least one to continue';
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
function parse(i,text){
 var t=text.toLowerCase(),defs=i===1?P.decisions:i===2?P.pins:P.flags,max=i===1?3:i===2?4:3,key=i===1?'decisions':i===2?'pins':'flags',hit=[];
 defs.forEach(function(d){if(d.kw.some(function(w){return t.indexOf(w)>-1;}))hit.push(d.id);});
 var added=[];hit.forEach(function(id){if(S[key].indexOf(id)<0&&S[key].length<max){S[key].push(id);added.push(id);}});
 if(!hit.length)return 'I could not match that to an option. Pick from the list, or say it another way.';
 var names=added.map(function(id){return byId(defs,id).short||byId(defs,id).name;});
 if(!added.length)return 'Those are already chosen.';
 return 'From what you wrote I chose: '+names.join(', ')+'. Change it if I got it wrong.';
}
function parseContext(text){
 var t=text.toLowerCase(),n=[];
 if(/outage|down|incident|power cut|failure/.test(t))n.push('I will treat the days you mention carefully and say when a result depends on them.');
 if(/launch|campaign|promo|sale|offer/.test(t))n.push('I will compare before and after the launch or campaign you mention.');
 if(/carrier|supplier|vendor|policy|rota|roster|layout|switch|changed/.test(t))n.push('I will check for a shift in results after the change you mention.');
 return n;
}
function persona(){
 var l=S.decisions.map(function(id){return byId(P.decisions,id).persona;});
 if(S.max>=2&&S.pins.length)l.push('You read '+byId(P.pins,S.pins[0]).name+' first.');
 if(S.max>=4&&scopeOk())l.push('You own: '+scopeText()+'.');
 if(S.max>=5&&S.flags.length)l.push('You want to hear first about '+byId(P.flags,S.flags[0]).short.toLowerCase()+'.');
 if(S.max>=6&&S.notes.length)l.push('You gave me context I will use to explain changes.');
 return l.slice(-5);
}
function addTask(t){
 var o={t:t,done:REDUCE};S.tasks.push(o);
 if(!REDUCE){var id=setTimeout(function(){o.done=true;if(root)paintRail();},1300);tmr.push(id);}
}
function reactAfter(i){
 if(i===1){var ls=persona();return 'Got it. '+ls.join(' ')+' I will build the rest of your feed around that.';}
 if(i===2)return 'I will put '+byId(P.pins,S.pins[0]).name.toLowerCase()+' first.'+(numPins().length?' Next you can set targets, or skip.':'');
 if(i===3){var ok=numPins().filter(function(p){return tState(p)==='ok';}).length;return ok?'Targets saved. I will say how far above or below each one you are.':'No targets for now. I will show change against the previous period instead.';}
 if(i===4)return 'Everything I show will be limited to '+scopeText()+'.';
 if(i===5)return 'I will check for '+S.flags.map(function(id){return byId(P.flags,id).short.toLowerCase();}).join(', ')+' first. I also check the rest quietly and only tell you when something is clearly unusual.';
 if(i===6)return S.notes.length?'Noted. '+S.notes.join(' '):'Nothing to note. I will watch for unusual days myself and tell you.';
 return '';
}
var TASKS={1:'Reading comments linked to your decisions',2:'Calculating your numbers for the last two periods',4:'Limiting every insight to your scope',5:'Checking for the changes you chose',6:'Scanning for patterns you did not ask about (Exploratory)'};

/* ── rendering ── */
function opt(o){
 var mk=o.mk==='radio'?'<span class="radio'+(o.on?' sel':'')+'"></span>':o.mk==='ord'?'<span class="dj-ord">'+(o.on?o.n:'')+'</span>':'<span class="chk'+(o.on?' sel':'')+'">'+(o.on?CHECK:'')+'</span>';
 return '<button type="button" class="dj-opt" data-dj="'+o.act+'"'+(o.k?' data-k="'+esc(o.k)+'"':'')+' data-v="'+esc(o.v)+'"'+(o.max?' data-max="'+o.max+'"':'')+' aria-pressed="'+(o.on?'true':'false')+'"'+(o.dis?' disabled':'')+'>'+mk+'<span>'+esc(o.label)+(o.tag?'<span class="tag acc">'+esc(o.tag)+'</span>':'')+(o.sub?'<small>'+esc(o.sub)+'</small>':'')+'</span></button>';
}
function multi(label,key,defs,max,ordered,sug){
 var arr=S[key],h='<div class="dj-opts'+(defs.length>4&&key==='pins'?' two':'')+'" role="group" aria-label="'+esc(label)+'">';
 defs.forEach(function(d){var at=arr.indexOf(d.id),on=at>-1;h+=opt({act:'multi',k:key,v:d.id,label:d.name,sub:d.sub,on:on,dis:!on&&arr.length>=max,mk:ordered?'ord':'chk',n:on?at+1:0,max:max,tag:(sug&&sug.indexOf(d.id)>-1&&!on)?'Suggested':''});});
 return h+'</div><p class="dj-hint">'+arr.length+' of '+max+' chosen'+(ordered?'. The number shows reading order.':'')+'</p>';
}
function aiBox(html,actions){return '<div class="dj-ai"><span class="dj-g">'+SPARK+'</span><div>'+html+(actions||'')+'</div></div>';}
function sayBox(i){
 var f=S.free[i],h='';
 if(f)h+='<div class="dj-you">'+esc(f.you)+'</div>'+aiBox('<p>'+esc(f.reply)+'</p>');
 return h+'<div class="dj-say"><input type="text" class="dj-inp" id="dj-say" autocomplete="off" aria-label="Tell the AI in your own words" placeholder="'+esc(P.sayPh[i]||'')+'"><button type="button" class="btn-sec" data-dj="send">Send</button></div>';
}
function sugBlock(i){
 var ids=suggest(i);if(!ids.length)return '';
 var cur=i===2?S.pins:S.flags,missing=ids.filter(function(id){return cur.indexOf(id)<0;});
 return aiBox('<p><b>My suggestion.</b> '+esc(suggestWhy(i))+'</p>',missing.length?'<div class="dj-ai-actions"><button type="button" class="btn-sec suggest" data-dj="sugg">Use my suggestion</button></div>':'');
}
function stepBody(){
 var i=S.i,h='';
 if(i===0){
  h+='<dl class="dj-known">'+P.known.map(function(r){return '<dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd>';}).join('')+'</dl>';
  h+=aiBox('<p><b>What I noticed in your latest responses.</b> '+esc(P.obs.text)+'</p>','<div class="dj-ai-actions"><button type="button" class="btn-sec'+(S.watch?' on':'')+'" data-dj="watch" aria-pressed="'+(S.watch?'true':'false')+'">'+(S.watch?'I will watch it':esc(P.obs.watch))+'</button></div>');
  return h;
 }
 if(i===1)return multi('Decisions','decisions',P.decisions,3,false)+sayBox(1);
 if(i===2)return sugBlock(2)+multi('Top numbers','pins',P.pins,4,true,suggest(2))+sayBox(2);
 if(i===3){
  numPins().forEach(function(p){var st=tState(p);h+='<div class="dj-field"><label class="eyebrow dj-lbl2" style="margin-top:0" for="dj-t-'+p.id+'">'+esc(p.name)+'</label><div class="dj-frow"><input type="text" class="dj-inp" id="dj-t-'+p.id+'" data-t="'+p.id+'" inputmode="decimal" autocomplete="off" placeholder="e.g. '+esc(p.ph)+'" value="'+esc(S.targets[p.id]||'')+'" aria-invalid="'+(st==='bad'?'true':'false')+'"><span class="dj-unit">'+esc(p.unit)+'</span></div><p class="dj-err" id="dj-e-'+p.id+'"'+(st==='bad'?'':' hidden')+'>Enter a number from '+p.min+' to '+p.max+'.</p></div>';});
  return h+'<p class="dj-hint">Leave any empty if you have no target for it.</p>';
 }
 if(i===4){
  var sc=P.scope,s=S.sc;
  if(sc.type==='confirm'){
   h+='<div class="dj-opts" role="group" aria-label="Scope">'+opt({act:'scope',v:'mine',label:'Just '+sc.mine,on:s.ans==='mine',mk:'radio'})+opt({act:'scope',v:'more',label:'I look after other stores too',sub:'Pick the others',on:s.ans==='more',mk:'radio'})+'</div>';
   if(s.ans==='more'){h+='<span class="eyebrow dj-lbl2">Which other stores?</span><div class="dj-opts two" role="group" aria-label="Other stores">';sc.others.forEach(function(n){h+=opt({act:'store',v:n,label:n,on:s.stores.indexOf(n)>-1});});h+='</div>';}
   return h;
  }
  h+='<div class="dj-opts" role="group" aria-label="Scope">'+opt({act:'scope',v:'all',label:'The whole business',sub:'Every brand, region, channel and team',on:s.ans==='all',mk:'radio'})+opt({act:'scope',v:'part',label:'Only part of it',sub:'For example one brand, one region, or one team',on:s.ans==='part',mk:'radio'})+'</div>';
  if(s.ans==='part'){
   h+='<span class="eyebrow dj-lbl2">What defines your part? Pick one or more.</span><div class="dj-opts two" role="group" aria-label="Dimensions">';
   sc.dims.forEach(function(d){h+=opt({act:'dim',v:d.id,label:d.name,on:s.dims.indexOf(d.id)>-1});});
   h+='</div>';
   s.dims.forEach(function(id){var d=byId(sc.dims,id);h+='<span class="eyebrow dj-lbl2">'+esc(d.name)+': which ones?</span><div class="dj-opts two" role="group" aria-label="'+esc(d.name)+'">';d.vals.forEach(function(v){h+=opt({act:'val',k:id,v:v,label:v,on:(s.vals[id]||[]).indexOf(v)>-1});});h+='</div>';});
  }
  return h;
 }
 if(i===5)return sugBlock(5)+multi('Changes to flag','flags',P.flags,3,false,suggest(5))+sayBox(5);
 if(i===6)return '<label class="eyebrow dj-lbl2" style="margin-top:0" for="dj-ctx">What should I know? (optional)</label><textarea class="dj-ta" id="dj-ctx" placeholder="'+esc(P.ctxPh)+'">'+esc(S.context)+'</textarea>';
 if(i===REVIEW){
  var rec=P.volume.rec;
  h+=aiBox('<p><b>My recommendation: '+esc(pair(FREQ,rec)[1])+'.</b> '+esc(P.volume.why[rec])+'</p>');
  h+='<span class="eyebrow dj-lbl2" style="margin-top:0">How often should a new edition arrive?</span><div class="dj-cad" role="group" aria-label="Frequency">';
  FREQ.forEach(function(f){h+=opt({act:'pick',k:'freq',v:f[0],label:f[1],sub:f[2],on:S.freq===f[0],mk:'radio',tag:f[0]===rec?'Recommended':''});});
  h+='</div>';
  if(S.freq!==rec)h+='<p class="dj-hint">'+esc(P.volume.why[S.freq])+'</p>';
  h+='<span class="eyebrow dj-lbl2">How many extras should I look for beyond your list?</span><div class="dj-opts" role="group" aria-label="Extras">';
  ALLOW.forEach(function(a){h+=opt({act:'pick',k:'allow',v:a[0],label:a[1],sub:a[2],on:S.allow===a[0],mk:'radio'});});
  h+='</div>';
  return h+aiBox('<p><b>I keep learning.</b> In your first edition I will ask one question about what was useful, and I will adjust from what you follow, dismiss or rate. I will check in again after 30 days.</p>');
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
 S.pins.forEach(function(id){
  var p=byId(P.pins,id),t=(S.targets[id]||'').trim(),tt='';
  if(p.unit&&tState(p)==='ok'){var d=Math.round((p.val-parseFloat(t))*100)/100;tt=d===0?'<div class="t ok">On target of '+esc(t)+'</div>':d<0?'<div class="t">'+Math.abs(d)+' below target of '+esc(t)+'</div>':'<div class="t ok">'+d+' above target of '+esc(t)+'</div>';}
  h+='<div class="dj-tile"><div class="k">'+esc(p.name)+'</div><div class="big v'+(p.small?' sm':'')+'">'+esc(p.disp)+(p.per?'<small>'+esc(p.per)+'</small>':'')+'</div><div class="d">'+esc(p.delta)+'</div>'+tt+'</div>';
 });
 h+='</div><p class="dj-hint" style="margin:-4px 0 12px">Showing '+esc(scopeText())+'. '+esc(P.guard)+'</p>';
 var seen={},k0=byId(P.decisions,S.decisions[0]).find;seen[k0]=1;
 h+=findHtml(P.find[k0],'From your decisions','acc');
 var n=0;S.flags.forEach(function(id){var k=byId(P.flags,id).key;if(seen[k]||n>=2)return;seen[k]=1;n++;h+=findHtml(P.find[k],'From your list','acc');});
 if(S.context.trim())h+='<div class="dj-find wrn"><span class="tag wrn">Noted</span><h4 class="h4">I will keep this in mind: “'+esc(S.context.trim())+'”</h4><p>I will use it to explain changes and to be careful with the days it affects.</p></div>';
 if(S.allow==='focused')h+='<div class="dj-find dash"><span class="tag wrn">Exploratory</span><h4 class="h4">Switched off</h4><p>You chose Only my list, so I am not looking beyond it. You can change this in your plan.</p></div>';
 else{
  h+='<div class="dj-find wrn"><span class="tag wrn">Exploratory</span><h4 class="h4">'+esc(P.explor[0][0])+'</h4><p>'+esc(P.explor[0][1])+'</p><p class="nx"><b>Suggested next step:</b> No action yet. I will tell you if it holds.</p></div>';
  if(S.allow==='curious')h+='<div class="dj-find wrn"><span class="tag wrn">Exploratory</span><h4 class="h4">'+esc(P.explor[1][0])+'</h4><p>'+esc(P.explor[1][1])+'</p><p class="nx"><b>Suggested next step:</b> No action yet. I will tell you if it holds.</p></div>';
 }
 h+=aiBox('<p><b>Ask me anything about this edition.</b></p>','<div class="dj-chips">'+P.asks.map(function(a,k){return '<button type="button" class="btn-sec" data-dj="ask" data-v="'+k+'">'+esc(a[0])+'</button>';}).join('')+'</div>');
 S.asked.forEach(function(k){h+='<div class="dj-you">'+esc(P.asks[k][0])+'</div>'+aiBox('<p>'+esc(P.asks[k][1])+'</p>');});
 return h+'<p class="dj-hint">Next edition: '+esc(pair(FREQ,S.freq)[1].toLowerCase())+'. I will check in after 30 days.</p>';
}

var COPY=function(i){
 var sc=P.scope,gen=P.key==='generic';
 return [
  {q:'Let’s set up your insights feed. I have already read your post-contact survey, so I will only ask how you plan to use the results.'.replace('post-contact survey',gen?'post-contact survey':'store visit survey'),why:'About three minutes. Each answer shapes the next question, and you can change everything later.'},
  {q:'Which decisions will you make with this feed?',why:'Pick up to three. This tells me what your work is, so I can ask only what matters for it.'},
  {q:'Which numbers matter most to you?',why:'Pick up to four, in the order you would read them. I mark the ones that fit your decisions.',seen:'Your survey has '+(gen?'CSAT, NPS, effort and first-contact resolution, plus an open comment.':'two satisfaction ratings out of 10, five service factors and an open comment.')},
  {q:'Do you have a target for any of these?',why:'Optional. With a target I can say how far above or below you are. You can skip this.'},
  {q:sc.q,why:sc.why,seen:sc.noticed},
  {q:'Which changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed.',seen:'You have two periods to compare: '+(gen?'the last four weeks and the four weeks before.':'01 Jun – 23 Sep and 14 Feb – 31 May.')},
  {q:'Is there anything recent or unusual about your business that the numbers will not show?',why:'For example a launch, a policy change, a supplier switch or an outage. I use it to explain changes and to be careful with distorted days. Optional.'},
  {q:'Here is the feed I will build. Change anything, then confirm.',why:'Everything on the right is editable. I will ask again after 30 days.'},
  {q:'Your feed is live. Here is what the last edition looks like.',why:'Built on sample figures. All numbers are illustrative.'}
 ][i];
};
function stage(){
 var i=S.i,c=COPY(i),h='',k;
 h+='<div class="dj-head"><div class="dj-head-l"><span class="dj-ava">'+SPARK+'</span><div><div class="eyebrow">Survey Insights setup</div></div></div><div class="dj-mode" role="group" aria-label="Conversation mode"><button type="button" data-dj="mode" data-v="chat" aria-pressed="'+(S.mode==='chat')+'">Chat</button><button type="button" data-dj="mode" data-v="voice" aria-pressed="'+(S.mode==='voice')+'">Voice preview</button></div></div>';
 if(i>=1&&i<=6){var b='';for(k=1;k<=6;k++)b+='<i class="'+(k<=i?'on':'')+'"></i>';h+='<div class="dj-prog" aria-hidden="true">'+b+'</div><p class="dj-step">Question '+i+' of 6'+((i===3||i===6)?' · optional':'')+'</p>';}
 else h+='<p class="dj-step">'+(i===0?'Welcome':i===REVIEW?'Review':'First edition')+'</p>';
 if(S.react&&i>=2&&i<=REVIEW)h+=aiBox('<p>'+esc(S.react)+'</p>');
 h+='<h2 class="d3 dj-q" id="dj-q" tabindex="-1">'+esc(c.q)+'</h2>';
 if(c.why)h+='<p class="dj-why">'+esc(c.why)+'</p>';
 if(c.seen)h+='<p class="dj-seen"><b>What I can see</b><span>'+esc(c.seen)+'</span></p>';
 if(S.mode==='voice')h+='<div class="dj-voice"><span class="dj-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Voice preview. Tap the answer you would say out loud.</span></div>';
 h+=stepBody()+'<div class="dj-nav">';
 if(i===LAST){h+='<button type="button" class="btn-sec" data-dj="restart">Start over</button><button type="button" class="btn-pri" data-dj="finish">Open my feed</button>';}
 else{
  h+=i>0?'<button type="button" class="btn-sec" data-dj="back">Back</button>':'<button type="button" class="dj-link" data-dj="defaults">Skip and use a recommended setup</button>';
  var lab=i===0?'Start':i===REVIEW?'Build my feed':'Next';
  if(i===3&&!numPins().some(function(p){return tState(p)==='ok';}))lab='Skip';
  if(i===6&&!S.context.trim())lab='Skip';
  h+='<span class="dj-navr"><span class="dj-hint" style="margin:0" id="dj-navhint">'+needText()+'</span><button type="button" class="btn-pri" id="dj-next" data-dj="next"'+(canNext()?'':' disabled')+'>'+lab+'</button></span>';
 }
 return h+'</div>';
}
function brow(l,html,step){return '<div class="dj-brow"><div class="dj-bl">'+l+'</div><div class="dj-bv">'+(html||'<span class="dj-mut">Not yet</span>')+'</div>'+(html&&S.i>0&&S.i<LAST?'<button type="button" class="dj-edit" data-dj="go" data-v="'+step+'" aria-label="Edit '+esc(l.toLowerCase())+'">Edit</button>':'<span></span>')+'</div>';}
function ls(a){return a.map(function(t){return '<div>'+t+'</div>';}).join('');}
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
 var pins=S.pins.map(function(id,n){var p=byId(P.pins,id),t=(S.targets[id]||'').trim();return '<div><span class="dj-mut">'+(n+1)+'</span> '+esc(p.name)+(p.unit&&tState(p)==='ok'?'<span class="tag acc">Target '+esc(t)+'</span>':'')+'</div>';}).join('');
 h+='<div class="dj-box"><span class="eyebrow">Your feed plan</span>'+brow('Decisions',ls(S.decisions.map(function(id){return esc(byId(P.decisions,id).short);})),1)+brow('Top numbers',pins,2)+brow('Looks at',S.max>=4&&scopeOk()?esc(scopeText()):'',4)+brow('Tells you first',ls(S.flags.map(function(id){return esc(byId(P.flags,id).short);})),5)+brow('Context',S.max>=6?(S.context.trim()?esc(S.context.trim()):'<span class="dj-mut">Nothing added</span>'):'',6)+brow('Delivery',S.max>=REVIEW&&S.freq?esc(pair(FREQ,S.freq)[1])+', '+esc(pair(ALLOW,S.allow)[1].toLowerCase()):'',REVIEW)+'</div>';
 el.innerHTML=h;
}
function fidOf(el){return ['data-dj','data-k','data-v'].map(function(n){return el.getAttribute(n)||'';}).join(':');}
function paint(focus){
 if(!root)return;
 var ae=document.activeElement,fid=(ae&&ae.getAttribute&&ae.getAttribute('data-dj')&&root.contains(ae))?fidOf(ae):null;
 root.innerHTML='<div class="dj-wrap"><section class="dj-main" id="dj-main">'+stage()+'</section><aside class="dj-rail" id="dj-rail" aria-label="What the AI has learned"></aside></div>';
 paintRail();
 var tg=root.querySelectorAll('[data-t]');
 for(var k=0;k<tg.length;k++)(function(el){el.addEventListener('input',function(){S.targets[el.getAttribute('data-t')]=el.value;navUI();paintRail();});})(tg[k]);
 var cx=document.getElementById('dj-ctx');
 if(cx)cx.addEventListener('input',function(){S.context=cx.value;var nb=document.getElementById('dj-next');if(nb)nb.textContent=S.context.trim()?'Next':'Skip';paintRail();});
 var sy=document.getElementById('dj-say');
 if(sy)sy.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();send();}});
 if(focus){var q=document.getElementById('dj-q');if(q)q.focus({preventScroll:true});var m=document.getElementById('dj-main');if(m&&m.scrollIntoView)m.scrollIntoView({block:'nearest'});}
 else if(fid){var els=root.querySelectorAll('[data-dj]');for(var j=0;j<els.length;j++){if(fidOf(els[j])===fid){els[j].focus({preventScroll:true});break;}}}
}
function navUI(){
 var nb=document.getElementById('dj-next'),nh=document.getElementById('dj-navhint');
 if(nb){nb.disabled=!canNext();if(S.i===3)nb.textContent=numPins().some(function(p){return tState(p)==='ok';})?'Next':'Skip';}
 if(nh)nh.textContent=needText();
 numPins().forEach(function(p){var e=document.getElementById('dj-e-'+p.id),t=document.getElementById('dj-t-'+p.id),b=tState(p)==='bad';if(e)e.hidden=!b;if(t)t.setAttribute('aria-invalid',b?'true':'false');});
}

/* ── actions ── */
function go(n){S.i=n;if(n>S.max)S.max=n;if(n===REVIEW&&!S.freq)S.freq=P.volume.rec;paint(true);}
function advance(d){
 var from=S.i;
 if(d>0){
  if(from===6)S.notes=S.context.trim()?parseContext(S.context):[];
  S.react=reactAfter(from);if(TASKS[from])addTask(TASKS[from]);
 }
 var n=from+d;if(n===3&&!numPins().length)n+=d;
 go(Math.max(0,Math.min(LAST,n)));
}
function toggle(a,v,max){var at=a.indexOf(v);if(at>-1)a.splice(at,1);else if(!max||a.length<max)a.push(v);}
function send(){
 var el=document.getElementById('dj-say');if(!el)return;
 var t=el.value.trim();if(!t)return;
 S.free[S.i]={you:t,reply:parse(S.i,t)};paint(false);
 var again=document.getElementById('dj-say');if(again)again.focus({preventScroll:true});
}
function finish(){
 var d0=byId(P.decisions,S.decisions[0]),title=d0?d0.title:'My insights';
 var desc='Insights on '+scopeText()+' — '+S.decisions.map(function(id){return byId(P.decisions,id).short.toLowerCase();}).join(', ');
 ['obj-title','drawer-obj-title','w-obj-title'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=title;});
 ['obj-desc','drawer-obj-desc','w-obj-desc'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=desc;});
 var m=S.mode;S=fresh();S.mode=m;
 if(typeof setJourney==='function'){setJourney('waiting');if(typeof toast==='function')toast('Setup saved — monitoring started');}
 else{root.innerHTML='<div class="dj-end">Setup saved. Monitoring has started: <b>'+esc(title)+'</b>. '+esc(desc)+'</div><p style="margin-top:12px"><button type="button" class="btn-sec" data-dj="restart">Start over</button></p>';}
 if(root&&typeof setJourney==='function')paint(false);
}
function onClick(e){
 var el=e.target.closest('[data-dj]');if(!el||!root.contains(el))return;
 var a=el.getAttribute('data-dj'),v=el.getAttribute('data-v'),k=el.getAttribute('data-k');
 if(a==='mode'){S.mode=v;paint(false);}
 else if(a==='next'){if(canNext())advance(1);}
 else if(a==='back'){advance(-1);}
 else if(a==='go'){go(parseInt(v,10));}
 else if(a==='pick'){S[k]=v;paint(false);}
 else if(a==='multi'){toggle(S[k],v,parseInt(el.getAttribute('data-max'),10));paint(false);}
 else if(a==='scope'){S.sc.ans=v;if(v==='mine'||v==='all'){S.sc.stores=[];S.sc.dims=[];S.sc.vals={};}paint(false);}
 else if(a==='store'){toggle(S.sc.stores,v);paint(false);}
 else if(a==='dim'){toggle(S.sc.dims,v);if(S.sc.dims.indexOf(v)<0)delete S.sc.vals[v];paint(false);}
 else if(a==='val'){S.sc.vals[k]=S.sc.vals[k]||[];toggle(S.sc.vals[k],v);paint(false);}
 else if(a==='sugg'){var ids=suggest(S.i),key=S.i===2?'pins':'flags',mx=S.i===2?4:3;ids.forEach(function(id){if(S[key].indexOf(id)<0&&S[key].length<mx)S[key].push(id);});paint(false);}
 else if(a==='send'){send();}
 else if(a==='watch'){S.watch=!S.watch;var fl=P.obs.flag;if(S.watch&&S.flags.indexOf(fl)<0&&S.flags.length<3)S.flags.push(fl);if(!S.watch)S.flags=S.flags.filter(function(x){return x!==fl;});paint(false);}
 else if(a==='ask'){var q=parseInt(v,10);if(S.asked.indexOf(q)<0)S.asked.push(q);paint(false);}
 else if(a==='defaults'){
  S.decisions=[P.decisions[0].id,P.decisions[2].id];S.pins=suggest(2).length?suggest(2):[P.pins[0].id];S.pins=S.pins.slice(0,3);
  S.sc.ans=P.scope.type==='confirm'?'mine':'all';S.flags=suggest(5);S.freq=P.volume.rec;S.max=REVIEW;
  S.react='I chose a recommended setup from what I can see in your survey. Check it, change anything, then build.';
  addTask(TASKS[1]);addTask(TASKS[5]);go(REVIEW);
 }
 else if(a==='finish'){finish();}
 else if(a==='restart'){var m=S.mode;S=fresh();S.mode=m;tmr.forEach(clearTimeout);tmr=[];paint(true);}
}

/* ── the switcher on the Day 0 screen: current wizard, Redtag AI setup, Generic AI setup ── */
function setView(v){
 view=v;
 var cur=v==='current';
 if(legacy)legacy.classList.toggle('hidden',!cur);
 if(root)root.hidden=cur;
 var bs=host?host.querySelectorAll('[data-djv]'):[];
 for(var k=0;k<bs.length;k++)bs[k].setAttribute('aria-pressed',bs[k].getAttribute('data-djv')===v?'true':'false');
 if(!cur){P=PACKS[v];S=fresh();tmr.forEach(clearTimeout);tmr=[];paint(false);}
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
 setView('redtag');
};
})();
