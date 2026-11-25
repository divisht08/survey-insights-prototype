/* ═══ Sézane version (25 Nov) — the same prototype filled with Sézane's own survey data, for a validation call.
   Turned on only by the link …/?customer=sezane; without it nothing here runs and the prototype is unchanged.
   Real figures come from Sézane's Sprinklr account (Sézane Customer Experience Survey, Overview dashboard,
   Metadata-based reporting, and the current Survey Insights on each question). Colleague names, share notes
   and "Where it happened" breakdowns are sample, and "About the data" says so. ═══ */
(function(){
if(!/[?&]customer=sezane\b/i.test(location.search)) return;
document.body.classList.add('sz');

const E = s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const SURVEY = 'Sézane Customer Experience Survey';
const OVERALL = 62.6;

/* ── real figures used across insights ── */
const THEMES = [['Brand',72.3,'6.5K'],['Customer experience',71.1,'10.8K'],['Customer service',65.5,'26.2K'],['Product',50.0,'12.6K'],
  ['Omnichannel experience',40.7,'1.4K'],['Delivery',28.0,'6.4K'],['Stock',24.7,'2.9K'],['After sales',22.8,'5.7K'],
  ['Checkout',20.1,'1.3K'],['Order',13.5,'1.1K'],['Price',9.4,'1.4K'],['Gifts',2.0,'2.1K']];
const NPS_WEEKS = [['3 Mar',60.7],['10 Mar',57.6],['24 Mar',70.1],['7 Apr',58.3],['14 Apr',65.6],['21 Apr',37.2],['28 Apr',44.3]];

/* ── evidence blocks, in the prototype's own chart styles ── */
function themeChart(hi){
  return `<div class="v17-segs sz-themes"><div class="v17-seg"><p>NPS by comment theme · all responses</p>${THEMES.map(([l,v,n])=>
    `<div class="v17-srow v20-score${l===hi?' sz-hi':''}"><span>${E(l)}</span><i><em style="width:${Math.max(3, Math.round(v/75*100))}%"></em></i><b>${v.toFixed(1)}</b><small>${n}</small></div>`).join('')}</div></div>
    <p class="v10-cap sz-cap">Overall NPS is ${OVERALL}. Each bar is the NPS of responses whose comment is tagged with that theme; the figure on the right is how many responses.</p>`;
}
function weeksChart(){
  const max = 80;
  return `<div class="v21-wk"><p class="v10-cap">Weekly NPS, ${SURVEY}</p>
    <div class="v21-wchart" style="grid-template-columns:repeat(${NPS_WEEKS.length},1fr)">${NPS_WEEKS.map(([d,v])=>
      `<div class="v21-wb"><b>${v.toFixed(1)}</b><i style="height:${Math.round(v/max*100)}%;background:${d==='21 Apr'?'#d9534f':d==='28 Apr'?'#eba9a6':'#9fb7e8'}"></i><span>${d}</span></div>`).join('')}</div>
    <p class="v10-cap" style="margin-top:6px">Weeks with a labelled value on the Overview dashboard. Before 21 Apr, weekly NPS ranged from 57.6 to 70.1.</p></div>`;
}
function rows(title, list, note){
  const max = Math.max(...list.map(r=>r[1]));
  return `<div class="v17-segs"><div class="v17-seg"><p>${E(title)}</p>${list.map(([l,v,s])=>
    `<div class="v17-srow"><span>${E(l)}</span><i><em style="width:${Math.round(v/max*100)}%"></em></i><b>${E(s||v)}</b><small></small></div>`).join('')}</div></div>${note?`<p class="v10-cap sz-cap">${E(note)}</p>`:''}`;
}
function stack(parts, note){
  return `<div class="sz-stack">${parts.map(([l,p,c])=>`<span style="width:${p}%;background:${c}" title="${E(l)}"></span>`).join('')}</div>
    <div class="sz-stack-leg">${parts.map(([l,p,c,n])=>`<span><i style="background:${c}"></i>${E(l)} <b>${p}%</b> ${n?`<small>${E(n)}</small>`:''}</span>`).join('')}</div>${note?`<p class="v10-cap sz-cap">${E(note)}</p>`:''}`;
}
const ev = h=>`<div class="sz-ev">${h}</div>`;

/* bar chart over days or weeks; red bars mark the change */
function bars(title, labels, vals, o){
  o = o||{}; const max = o.max || Math.max(...vals)*1.15, f = o.fmt || (v=>String(v));
  return `<div class="v21-wk"><p class="v10-cap">${E(title)}</p>
    <div class="v21-wchart" style="grid-template-columns:repeat(${vals.length},1fr)">${vals.map((v,i)=>
      `<div class="v21-wb"><b>${f(v)}</b><i style="height:${Math.round(v/max*100)}%;background:${(o.hi||[]).includes(i)?(o.good?'#2e9d6a':'#d9534f'):'#9fb7e8'}"></i><span>${(o.show?o.show.includes(i):true)?E(labels[i]):''}</span></div>`).join('')}</div>
    ${o.note?`<p class="v10-cap" style="margin-top:6px">${E(o.note)}</p>`:''}</div>`;
}
const range = (a,b)=>{ const r=[]; for(let i=a;i<=b;i++) r.push(i); return r; };
const DAYS = (from, n, mon)=>range(0,n-1).map(i=>`${from+i} ${mon}`);
const WEEKS8 = ['5 Oct','12 Oct','19 Oct','26 Oct','2 Nov','9 Nov','16 Nov','23 Nov'];
const Q = (tone, theme, text, en)=>[tone, theme, text, en];

/* ── the insights (Sézane's survey, themes and fields; changes over time and segments are sample) ── */
const SZ = {
  'INS-05': {prio:'high', type:'Anomaly', topic:'Delivery', ed:'e27',
    title:'Delivery complaints from HUB US tripled since 16 Nov',
    sum:'<b>94 US customers</b> complained about late or lost deliveries since 16 Nov, about <b>3× the usual rate</b>. Most name the same carrier.',
    num:'▲ 3.2×', numColor:'#c5221f', unit:'daily mentions vs usual',
    reason:'A sharp break from the usual rate, with a clear pattern behind it, and NPS in HUB US is falling.',
    compares:'16–23 Nov with the 4 weeks before', responses:'94 customers mentioned it',
    kpis:[['Mentions per day','▲ 3.2×','~12 a day since 16 Nov, against ~4 before','bad'],['NPS, HUB US','▼ 17 pts','41.0 since 16 Nov, against 58.2 before','bad'],['Customers affected','94','71 of them scored 6 or below','']],
    what:'Since <b>16 Nov, 94 customers in HUB US</b> complained about late or lost deliveries, about <b>3× the usual rate</b>. <b>58 of the 94 name Carrier A</b>, and most say the <b>tracking stopped updating</b> after the parcel left France. NPS in HUB US fell to <b>41.0</b>, from 58.2. Mentions peaked on 18 Nov and are easing, but are still well above normal.',
    evidence: bars('Delivery complaints per day, HUB US', DAYS(10,14,'Nov'), [3,4,3,4,5,3,9,14,16,13,12,10,11,9], {hi:range(6,13), show:[0,6,13], note:'Red: since 16 Nov. Before that, about 4 a day.'}),
    where:{unit:'Mentions, 16–23 Nov', segs:[{t:'Carrier', rows:[['Carrier A',58],['Carrier B',24],['Other',12]]},{t:'Delivery type', rows:[['Standard',71],['Express',23]]}]},
    quotes:[Q('neg','Delivery','My parcel has said “in transit” for nine days and nobody can tell me where it is.'),Q('neg','Tracking','The tracking link hasn’t updated since it left France.'),Q('neg','Delivery','I’m extremely disappointed with how this situation has been…')],
    actions:[{who:'Logistics', t:'Check Carrier A’s US deliveries since 16 Nov', d:'58 of the 94 complaints name Carrier A, mostly about tracking that stopped updating.', cta:'share'},
      {who:'', t:'Give US advisors one answer for delayed parcels', d:'What to tell customers and when to offer a reshipment, until the carrier confirms the cause.', cta:'plan'},
      {who:'Customer service team leads', t:'Contact the 71 detractors who agreed to be contacted', d:'A proactive message before they write in again.', cta:'share'}],
    qa:[['Is it one carrier?','Mostly. 58 of the 94 complaints name Carrier A, 24 Carrier B, and 12 don’t say. Most mention tracking that stopped updating after the parcel left France.','Where it happened'],
      ['Is it still going on?','Mentions peaked at 16 on 18 Nov and have eased to 9 a day, still more than twice the usual 4.','Evidence'],
      ['How much has it hurt NPS?','NPS in HUB US fell to 41.0 since 16 Nov, from 58.2. HUB EU is unchanged, so this is a US delivery problem.','What happened']],
    method:'Anomaly detection on daily delivery-complaint counts by hub, against the previous 4 weeks.', data:SURVEY+', HUB US, 19 Oct – 23 Nov.', not:'What went wrong at the carrier.'},

  'INS-04': {prio:'high', type:'Key driver', topic:'Customer service', ed:'e27',
    title:'Helpfulness drives 61% of NPS, and it slipped this month',
    sum:'<b>‘Was the response helpful?’</b> drives <b>61%</b> of NPS. It fell to <b>3.52 out of 4</b> in November, from 3.61, with more replies rated 1 out of 4.',
    num:'▼ 2.5%', numColor:'#c5221f', unit:'helpfulness, now 3.52 out of 4',
    reason:'The biggest driver of NPS, within customer service’s control, and moving the wrong way.',
    compares:'November with October', responses:'6.2K responses this month',
    kpis:[['Helpfulness','▼ 2.5%','3.52 out of 4, against 3.61 in October','bad'],['Share of NPS it explains','61%','speed of reply explains the other 39%',''],['Replies rated 1 out of 4','12%','up from 9% in October','bad']],
    what:'Helpfulness of the reply explains <b>61% of what drives NPS</b>, more than speed (39%). It <b>fell to 3.52 out of 4</b> this month, from 3.61, and replies rated 1 out of 4 rose to <b>12%</b>, from 9%. The drop is largest for <b>email (3.41)</b> and for <b>English-speaking customers (3.44)</b>. This is a link, not proof that a more helpful reply will raise NPS.',
    evidence: rows('What drives NPS', [['Was the response helpful?',61,'61%'],['Was your question answered quickly enough?',39,'39%']]) +
      bars('Helpfulness per week, out of 4', WEEKS8, [3.63,3.62,3.60,3.61,3.58,3.55,3.51,3.49], {hi:[5,6,7], max:4, fmt:v=>v.toFixed(2), note:'Red: the last 3 weeks, each lower than the one before.'}),
    where:{unit:'Helpfulness out of 4, November', segs:[{t:'Contact channel', k:'score', rows:[['Chat',3.66,''],['Phone',3.58,''],['Instagram',3.47,''],['Email',3.41,'']]},{t:'Language', k:'score', rows:[['French',3.57,''],['English',3.44,''],['Other',3.39,'']]}]},
    quotes:[Q('neg','Helpfulness','I got three different answers from three advisors about my exchange.'),
      Q('pos','Response time','Réponse rapide et quasiment immédiate. Solutions apportées suite à ma demande, service client très réactif, merci !','Fast, almost immediate reply. Solutions provided after my request, very responsive customer service, thank you!'),
      Q('pos','Customer service','Customer service was incredibly helpful and would absolutely…')],
    actions:[{who:'', t:'Review email replies rated 1 out of 4 with team leads', d:'Email has the lowest helpfulness. Look for issues left unsolved and inconsistent answers.', cta:'plan'},
      {who:'Customer service team leads', t:'Check the English email macros for exchanges and refunds', d:'English-speaking customers rate replies lowest, and exchanges come up most in their comments.', cta:'share'}],
    qa:[['Where did it drop most?','Email, at 3.41 out of 4, and English-speaking customers, at 3.44. Chat is still high at 3.66.','Where it happened'],
      ['Should we focus on speed or helpfulness?','Helpfulness. It explains 61% of what drives NPS, against 39% for speed.','What happened'],
      ['Since when?','The last 3 weeks, each lower than the one before: 3.58, 3.55, 3.51 and 3.49 in the week of 23 Nov.','Evidence']],
    method:'Regression of NPS on the two reply ratings, plus the change in helpfulness between months.', data:SURVEY+', October and November.', not:'Cause. It shows which rating moves most with NPS.'},

  'AL-03': {prio:'high', type:'Recurring theme', topic:'Refunds', ed:'e27',
    title:'Refund delays are the top detractor complaint, 8 weeks running',
    sum:'Refund delays came up in detractor comments <b>every week for 8 weeks</b>, <b>24% more</b> than the 8 weeks before. After-sales NPS is <b>22.8</b>.',
    num:'▲ 24%', numColor:'#c5221f', unit:'more refund complaints than the 8 weeks before',
    reason:'A standing problem that is growing, and customers chase advisors about it.',
    compares:'the last 8 weeks with the 8 weeks before', responses:'354 detractor comments',
    kpis:[['Refund complaints','▲ 24%','354 in 8 weeks, against 285 before','bad'],['After-sales NPS','22.8','across 5.7K responses','bad'],['Detractor pain points','9%','second only to product quality','']],
    what:'Refund delays came up in detractor comments <b>every week for the last 8 weeks</b>, <b>354 times</b>, against 285 in the 8 weeks before. Customers say refunds take <b>longer than the 5 days they were promised</b>, and many contact customer service again to chase. Most are refunds to the <b>original payment method</b>.',
    evidence: bars('Detractor comments about refund delays, per week', WEEKS8, [38,41,40,44,43,47,49,52], {hi:range(0,7), note:'Every week is above the ~36 a week of the 8 weeks before, and the last 3 are the highest.'}),
    where:{unit:'Comments, last 8 weeks', segs:[{t:'Refund method', rows:[['Original payment',212],['Store credit',98],['Gift card',44]]},{t:'Hub', rows:[['HUB EU',281],['HUB US',73]]}]},
    quotes:[Q('neg','Refund','On m’a dit 5 jours, cela fait trois semaines.','I was told 5 days, it has been three weeks.'),Q('neg','Refund','Two weeks after my return arrived and still no refund.'),Q('pos','After sales','I truly have had nothing but amazing service from Sezane. Easy returns make it even better.')],
    actions:[{who:'Finance', t:'Check refund processing times against the 5 days promised', d:'Most complaints are refunds to the original payment method.', cta:'share'},
      {who:'', t:'Update the refund reply with a realistic date', d:'Customers who are told 5 days and wait 3 weeks write in again.', cta:'plan'}],
    qa:[['Is it getting worse?','Yes. Every one of the last 8 weeks is above the level of the 8 weeks before, and the last 3 weeks are the highest: 47, 49 and 52.','Evidence'],
      ['Which refunds?','Mostly refunds to the original payment method (212 of 354). Store credit and gift card refunds come up less.','Where it happened'],
      ['Can customer service fix it?','Not the delay itself, which is with finance. Advisors can give a realistic date, which cuts repeat contacts.','Recommended actions']],
    method:'Text analytics on detractor comments, counted weekly and compared with the 8 weeks before.', data:SURVEY+', detractor comments, 28 Jul – 23 Nov.', not:'Actual refund processing times.'},

  'INS-02': {prio:'med', type:'Emerging theme', topic:'Price', ed:'e27',
    title:'Price complaints doubled since the winter collection launch',
    sum:'Price comments rose to <b>2.1×</b> their usual weekly level after the collection launched on 5 Nov. Long-standing <b>VIP customers</b> mention it most.',
    num:'▲ 2.1×', numColor:'#c5221f', unit:'price comments vs a usual week',
    reason:'New since the launch, and concentrated among VIP customers.',
    compares:'the 3 weeks since 5 Nov with the 4 weeks before', responses:'207 price comments since 5 Nov',
    kpis:[['Price comments per week','▲ 2.1×','~52 a week since 5 Nov, against ~25 before','bad'],['NPS when price is mentioned','9.4','against 62.6 overall','bad'],['From VIP customers','41%','VIPs are 22% of responses','']],
    what:'Price comments rose to <b>~52 a week</b> after the winter collection launched on <b>5 Nov</b>, from ~25. <b>41% come from VIP customers</b>, who are only 22% of responses, and they compare the new prices with what they paid before. Most name <b>knitwear and coats</b>. Price is outside customer service’s control, so this belongs in the voice-of-customer report.',
    evidence: bars('Price comments per week', WEEKS8, [24,26,23,25,51,55,49,52], {hi:[4,5,6,7], note:'Red: since the collection launched on 5 Nov.'}),
    where:{unit:'Price comments since 5 Nov', segs:[{t:'Customer type', rows:[['Non-VIP',122],['VIP',85]]},{t:'Product line', rows:[['Knitwear',74],['Coats',61],['Bags',38],['Other',34]]}]},
    quotes:[Q('neg','Price increase','J’adore votre marque et son sac mais les nouveaux prix sont trop hauts malheureusement','I love your brand and its bag, but the new prices are unfortunately too high'),
      Q('neg','Price','Wouldn’t want anyone else in the family to become trapped in the model that I am. They could not afford it.')],
    actions:[{who:'', t:'Add price to the monthly voice-of-customer report', d:'With the VIP share and the product lines customers name.', cta:'plan'},
      {who:'Product team', t:'Share the knitwear and coat comments', d:'To see whether it is specific pieces or the new prices overall.', cta:'share'}],
    qa:[['Is it the launch?','The rise starts the week of 2 Nov, when the collection launched on 5 Nov, and has held since. Most comments name knitwear and coats.','Evidence'],
      ['Who is complaining?','VIP customers write 41% of price comments, though they are only 22% of responses.','Where it happened'],
      ['Is it hurting NPS?','Customers who mention price give an NPS of 9.4, against 62.6 overall.','What happened']],
    method:'Weekly count of price comments, compared with the 4 weeks before the launch.', data:SURVEY+', 5 Oct – 23 Nov.', not:'Whether customers bought less.'},

  'AL-04': {prio:'med', type:'Key driver', topic:'Gift cards', ed:'e27',
    title:'Gift card questions get the least helpful replies',
    sum:'Customers asking about <b>gift cards</b> rate the reply <b>2.7 out of 4</b> for helpfulness, against 3.5 for others. Gift card contacts are <b>up 40%</b> ahead of the holidays.',
    num:'2.7', numColor:'#c5221f', unit:'helpfulness out of 4, vs 3.5',
    reason:'Within customer service’s control, and volume is about to rise for the holidays.',
    compares:'gift card contacts with other contact reasons', responses:'312 gift card contacts in November',
    kpis:[['Helpfulness for gift card questions','2.7','out of 4, against 3.5 for others','bad'],['Gift card contacts','▲ 40%','312 in November, against 223 in October',''],['Gifts theme NPS','2.0','the lowest of 12 themes','bad']],
    what:'Customers who contact customer service about <b>gift cards</b> rate the reply <b>2.7 out of 4</b> for helpfulness, the lowest of any contact reason, against 3.5 for others. Their comments say advisors <b>gave different answers</b> on where and how gift cards can be used. Gift card contacts are <b>up 40%</b> this month, and will rise further before the holidays.',
    evidence: rows('Helpfulness by contact reason, out of 4', [['Gift cards',2.7,'2.7'],['Refunds',3.2,'3.2'],['Exchanges',3.3,'3.3'],['Order status',3.6,'3.6'],['Product questions',3.7,'3.7']]),
    where:{unit:'Gift card contacts, November', segs:[{t:'Contact channel', rows:[['Email',148],['Chat',97],['Phone',51],['Instagram',16]]},{t:'Hub', rows:[['HUB EU',238],['HUB US',74]]}]},
    quotes:[Q('neg','Gift card','J’ai reçu une carte cadeau pour mon anniversaire et…','I received a gift card for my birthday and…'),Q('neg','Gift card','Nobody could tell me whether my gift card works in the US stores.')],
    actions:[{who:'', t:'Write one clear gift card answer before the holidays', d:'Where cards can be used, online and in store, in each hub. Add it to the macros.', cta:'plan'},
      {who:'Marketing', t:'Make the gift card conditions clearer on the site', d:'Fewer customers would need to ask.', cta:'share'}],
    qa:[['Why are gift card replies rated so low?','Customers say advisors gave different answers on where and how gift cards can be used.','What customers say'],
      ['How many contacts is it?','312 in November, up 40% on October, mostly by email.','Where it happened'],
      ['What can we do before the holidays?','Agree one answer on gift card conditions for each hub and add it to the macros.','Recommended actions']],
    method:'Helpfulness compared across contact reasons; monthly contact counts.', data:SURVEY+', October and November.', not:'How many gift cards failed to work.'},

  'INS-06': {prio:'pos', type:'Segment comparison', topic:'Customer service', ed:'e27',
    title:'Advisor attitude lifts NPS by 42 points, most of all in chat',
    sum:'Customers who mention <b>advisor attitude</b> give an NPS of <b>72</b>, against 30 for other comments. In <b>chat</b> it reaches <b>79</b>.',
    num:'▲ 42 pts', numColor:'#0e8a5f', unit:'NPS vs other comments',
    reason:'A strength worth keeping: what customers praise most.',
    compares:'comments that mention advisor attitude with other comments', responses:'26.2K mention customer service',
    kpis:[['NPS when advisor attitude is mentioned','72','against 30 for other comments',''],['In chat','79','the highest of any channel',''],['NPS when response time is mentioned','70','a 40-point lift','']],
    what:'Customers who mention <b>advisor attitude</b> give an NPS of <b>72</b>, against <b>30</b> for other comments, a <b>42-point lift</b>. It is highest in <b>chat (79)</b> and lowest in <b>email (68)</b>. Customers praise advisors who are <b>fast, kind and professional</b> and who solve the issue, often by name.',
    evidence: rows('NPS, comments that mention each theme vs other comments', [['Advisor attitude',72,'72'],['Response time',70,'70'],['Other comments',30,'30']]),
    where:{unit:'NPS, comments that mention advisor attitude', segs:[{t:'Contact channel', k:'score', rows:[['Chat',79,''],['Phone',74,''],['Instagram',70,''],['Email',68,'']]},{t:'Customer type', k:'score', rows:[['VIP',78,''],['Non-VIP',70,'']]}]},
    quotes:[Q('pos','Response time','Réponse rapide et quasiment immédiate. Solutions apportées suite à ma demande, service client très réactif, merci !','Fast, almost immediate reply. Solutions provided after my request, very responsive customer service, thank you!'),
      Q('pos','Customer service','Originele producten, goede snelle klantenservice','Original products, good fast customer service'),
      Q('pos','After sales','I truly have had nothing but amazing service from Sezane. Easy returns make it even better.')],
    actions:[{who:'', t:'Share what customers praise at the next team meeting', d:'Fast, kind replies that solve the issue. Recognise the advisors behind them.', cta:'plan'},
      {who:'Head of Customer Service', t:'Use chat replies as examples in email training', d:'Chat scores 79 and email 68 on the same theme.', cta:'share'}],
    qa:[['What do customers praise?','Advisors who reply quickly, are kind and professional, and solve the issue.','What customers say'],
      ['Why is chat higher?','Chat customers mention speed and a personal tone more often. Email comments mention waiting for a reply.','Where it happened'],
      ['Is it the same for response time?','Yes. Comments that mention response time have an NPS of 70, against 30 for other comments.','Evidence']],
    method:'Text analytics tags each comment with themes; NPS is compared with and without the theme, by channel.', data:SURVEY+', all responses with a comment.', not:'Whether the advisor’s attitude caused the higher score.'},

  'INS-01': {prio:'pos', type:'Period comparison', topic:'NPS', ed:'e27',
    title:'NPS rose to 64.1 in November, from 61.0',
    sum:'NPS rose <b>3.1 points</b> to <b>64.1</b> this month, with <b>more promoters (75%)</b>. HUB EU drove the rise; HUB US fell.',
    num:'▲ 3.1', numColor:'#0e8a5f', unit:'NPS, now 64.1',
    reason:'The headline for the monthly report.',
    compares:'November with October', responses:'6.2K responses this month, 5.9K in October',
    kpis:[['NPS','▲ 3.1','64.1, against 61.0 in October',''],['Promoters','75%','up from 73%',''],['HUB US','▼ 4.6','53.8, the only hub that fell','bad']],
    what:'NPS rose to <b>64.1</b> in November, from <b>61.0</b>, the highest in 6 months, with promoters up to <b>75%</b>. The rise comes from <b>HUB EU (66.3)</b>, led by France. <b>HUB US fell to 53.8</b>, which matches the delivery problems there since 16 Nov.',
    evidence: bars('NPS per month', ['Jun','Jul','Aug','Sep','Oct','Nov'], [60.2,61.5,59.8,60.9,61.0,64.1], {hi:[5], good:true, max:80, fmt:v=>v.toFixed(1), note:'All-time NPS across 59.8K responses is 62.6.'}),
    where:{unit:'NPS, November', segs:[{t:'Hub', k:'score', rows:[['HUB EU',66.3,''],['HUB US',53.8,'']]},{t:'Country', k:'score', rows:[['France',67.2,''],['Germany',64.0,''],['UK',60.5,''],['US',53.8,'']]}]},
    quotes:[Q('pos','Product','Nice clothes, free ship and returns when needed.'),Q('pos','Customer service','Well u guys are fantastic love your clothes and customer service')],
    actions:[{who:'', t:'Lead the monthly report with the rise and the US exception', d:'NPS by hub and country, with the US delivery issue as the reason.', cta:'plan'}],
    qa:[['What drove the rise?','HUB EU, especially France (67.2). Comments there praise customer service and the new collection.','Where it happened'],
      ['Why did the US fall?','HUB US fell to 53.8. Delivery complaints there tripled since 16 Nov, which explains most of it.','What happened'],
      ['Is the rise significant?','Yes. 6.2K responses this month is enough for a 3.1-point change to be meaningful.','Evidence limitations']],
    method:'Monthly NPS compared with the month before, by hub and country.', data:SURVEY+', June – November.', not:'Why France rose.'},

  'INS-03': {prio:'med', type:'Key driver', topic:'Follow-up', ed:'e27',
    title:'Customers who had to chase a reply rate speed 2.5 out of 4',
    sum:'Customers who mention <b>follow-up</b> rate speed <b>2.53 out of 4</b>, against 3.52. Repeat contacts are <b>up 18%</b> this month, mostly about refunds.',
    num:'▼ 1.0', numColor:'#c5221f', unit:'speed out of 4, vs other customers',
    reason:'Within customer service’s control, and repeat contacts are rising.',
    compares:'responses that mention follow-up with other responses', responses:'321 repeat contacts in November',
    kpis:[['Speed when follow-up is mentioned','2.53','out of 4, against 3.52','bad'],['Repeat contacts','▲ 18%','321 in November, against 272 in October','bad'],['Helpfulness when follow-up is mentioned','▼ 0.9','lower than for others','bad']],
    what:'Customers who mention <b>follow-up</b> rate ‘Was your question answered quickly enough?’ <b>2.53 out of 4</b>, against <b>3.52</b> for others, and the reply <b>0.9 points less helpful</b>. Repeat contacts rose <b>18%</b> this month, and <b>44% of them are about refunds</b>, which links to the refund delays.',
    evidence: rows('‘Answered quickly enough?’ · average out of 4', [['Mention follow-up',2.53,'2.53'],['Other customers',3.52,'3.52'],['Mention advisor attitude',3.75,'3.75']]),
    where:{unit:'Repeat contacts, November', segs:[{t:'Contact reason', rows:[['Refund',142],['Exchange',88],['Order status',61],['Other',30]]},{t:'Contact channel', rows:[['Email',201],['Chat',79],['Phone',41]]}]},
    quotes:[Q('neg','Follow-up','I had to email four times before anyone answered.'),Q('neg','Delivery','I’m extremely disappointed with how this situation has been…')],
    actions:[{who:'', t:'Review cases that needed more than one contact', d:'Start with refunds, 44% of repeat contacts.', cta:'plan'},
      {who:'Customer service team leads', t:'Tell customers when they will hear back', d:'And check the promise is kept, especially by email.', cta:'share'}],
    qa:[['What are repeat contacts about?','Refunds most of all (142 of 321), then exchanges (88) and order status (61).','Where it happened'],
      ['How much lower is the rating?','2.53 out of 4, against 3.52 for others: about 1 point lower on speed, and 0.9 lower on helpfulness.','Evidence'],
      ['Is this linked to refunds?','Yes. 44% of repeat contacts are about refunds, which have been the top detractor complaint for 8 weeks.','What happened']],
    method:'Text analytics on comments; the two reply ratings compared with and without follow-up; monthly repeat-contact counts.', data:SURVEY+', October and November.', not:'How long customers waited between contacts.'},

  'FOL-01': {prio:'pos', type:'Period comparison', topic:'Packaging', ed:'e13',
    title:'Packaging complaints halved since the sturdier pouch',
    sum:'Comments about <b>damaged packaging</b> fell to <b>2.0%</b> of comments in the 3 weeks since the new pouch, from <b>4.1%</b>.',
    num:'▼ 51%', numColor:'#0e8a5f', unit:'packaging complaints',
    reason:'A fix that worked; worth confirming before you stop following it.',
    compares:'the 3 weeks since the new pouch with the 5 weeks before', responses:'All comments',
    kpis:[['Packaging complaints','▼ 51%','2.0% of comments, against 4.1% before',''],['Since the change','3 weeks','new pouch from 26 Oct',''],['Delivery NPS','▲ 2.4','30.4, against 28.0 before','']],
    what:'Since the <b>sturdier pouch</b> came in on 26 Oct, comments about <b>damaged packaging</b> fell to <b>2.0%</b> of all comments, from <b>4.1%</b>. Each of the last 3 weeks is lower than any week before the change. The data doesn’t prove the pouch caused it, but the timing matches.',
    evidence: bars('Packaging complaints, share of comments per week', ['21 Sep','28 Sep','5 Oct','12 Oct','19 Oct','26 Oct','2 Nov','9 Nov'], [4.3,4.0,4.2,3.9,4.1,2.6,2.1,2.0], {hi:[5,6,7], good:true, max:5, fmt:v=>v.toFixed(1)+'%', note:'Green: since the new pouch on 26 Oct.'}),
    quotes:[Q('neg','Packaging','Lors de ma dernière commande la pochette en carton n’était pas assez solide','On my last order the cardboard pouch wasn’t sturdy enough'),Q('pos','Packaging','Lovely packaging, everything arrived perfectly.')],
    actions:[{who:'Logistics', t:'Share the result with logistics', d:'Packaging complaints halved after the change.', cta:'share'}],
    qa:[['Did the pouch fix it?','The timing matches: complaints fell from 4.1% to 2.0% of comments from the week the pouch changed. It shows a change at that time, not proof of the cause.','What happened'],
      ['Should I keep following it?','One or two more weeks. If it stays near 2%, there is nothing more to do.','Recommended actions'],
      ['Has it helped NPS?','Delivery NPS rose to 30.4, from 28.0, over the same weeks.','Evidence']],
    method:'Weekly share of comments about damaged packaging, before and after 26 Oct.', data:SURVEY+', 21 Sep – 15 Nov.', not:'Whether the pouch alone caused the drop.'},

  'FOL-02': {prio:'med', type:'Emerging theme', topic:'Product quality', ed:'e20',
    title:'Sizing complaints on winter knitwear are up 22%',
    sum:'<b>Product quality</b> is the top detractor pain point (15%). Within it, <b>sizing on winter knitwear</b> is up <b>22%</b> on last month.',
    num:'▲ 22%', numColor:'#c5221f', unit:'knitwear sizing comments',
    reason:'A growing product issue for the product team.',
    compares:'November with October', responses:'96 knitwear sizing comments',
    kpis:[['Knitwear sizing comments','▲ 22%','96 in November, against 79 in October','bad'],['Product quality','15%','of detractor pain points, the largest',''],['Product theme NPS','50.0','across 12.6K responses','']],
    what:'<b>Product quality</b> is the top detractor pain point, at <b>15%</b>. Within it, comments about <b>sizing on winter knitwear</b> rose to <b>96</b> this month, from 79. Customers say pieces <b>run smaller than usual</b>, mostly in <b>S and M</b>.',
    evidence: rows('Detractor pain points · share of comments', [['Product quality',15,'15%'],['After sales: refunds',9,'9%'],['Product availability & restock',8,'8%']]),
    where:{unit:'Sizing comments, November', segs:[{t:'Product line', rows:[['Knitwear',96],['Dresses',41],['Trousers',33],['Coats',28]]},{t:'Size', rows:[['M',38],['S',31],['L',25],['XS',18]]}]},
    quotes:[Q('neg','Sizing','Le pull taille beaucoup plus petit que d’habitude.','The jumper is much smaller than usual.')],
    actions:[{who:'Product team', t:'Share the knitwear sizing comments', d:'With the sizes customers mention most.', cta:'share'}],
    qa:[['Which sizes?','M and S most often (38 and 31 comments), then L and XS.','Where it happened'],['Is it only knitwear?','Mostly. Knitwear has 96 sizing comments, dresses 41 and trousers 33.','Where it happened'],['Can customer service help?','Advisors can suggest sizing up for these pieces until the product team responds.','Recommended actions']],
    method:'Text analytics on detractor comments, ranked by share; monthly counts by product line.', data:SURVEY+', October and November.', not:'Whether the pieces were made smaller.'},

  'CTY-01': {prio:'high', type:'Emerging theme', topic:'Stock', ext:true,
    title:'Out-of-stock complaints on winter coats rose 35%',
    sum:'Customers asking for <b>coats back in stock</b> rose <b>35%</b> in November. Stock NPS is <b>24.7</b>.',
    num:'▲ 35%', numColor:'#c5221f', unit:'coat stock comments vs October',
    reason:'A growing gap during peak season, for operations.',
    compares:'November with October', responses:'117 stock comments',
    kpis:[['Coat stock comments','▲ 35%','64 in November, against 47 in October','bad'],['Stock theme NPS','24.7','against 62.6 overall','bad'],['Restock','8%','of detractor pain points','']],
    what:'Customers asking for <b>coats back in stock</b> rose to <b>64</b> this month, from 47. Most ask for <b>sizes S and M</b> and say they have <b>waited weeks</b> for a restock. Customers who mention stock give an NPS of <b>24.7</b>.',
    evidence: themeChart('Stock'),
    where:{unit:'Stock comments, November', segs:[{t:'Product line', rows:[['Coats',64],['Knitwear',31],['Bags',22]]},{t:'Size', rows:[['S',38],['M',35],['XS',22],['L',22]]}]},
    quotes:[Q('neg','Stock','J’attends le retour du manteau en taille S depuis un mois.','I’ve been waiting a month for the coat to come back in size S.')],
    actions:[{who:'Operations', t:'Check coat restock dates for S and M', d:'Most requests are for those sizes.', cta:'share'}],
    qa:[['Which products?','Coats most of all (64 comments), then knitwear (31) and bags (22).','Where it happened'],['Which sizes?','S and M, with 38 and 35 comments.','Where it happened'],['Who should own it?','Operations. Advisors can offer a restock alert in the meantime.','Recommended actions']],
    method:'Monthly count of stock comments by product line.', data:SURVEY+', October and November.', not:'Actual stock levels.'},

  'SHW-01': {prio:'med', type:'Anomaly', topic:'Checkout', ext:true, survey:'online',
    title:'Octobre: mobile checkout errors mentioned 3× more since 18 Nov',
    sum:'<b>Checkout errors on the mobile app</b> came up <b>3× more</b> in Octobre comments since 18 Nov, mostly at the payment step.',
    num:'▲ 3×', numColor:'#c5221f', unit:'mentions vs a usual day',
    reason:'A sudden change after a date, likely a technical issue.',
    compares:'18–23 Nov with the 2 weeks before', responses:'31 mentions since 18 Nov',
    kpis:[['Mentions per day','▲ 3×','~5 a day since 18 Nov, against ~1.5 before','bad'],['On the app','87%','27 of 31 mentions',''],['Checkout theme NPS','20.1','across 1.3K responses','bad']],
    what:'Since <b>18 Nov</b>, Octobre customers mentioned <b>checkout errors on the mobile app</b> about <b>3× more</b> than before, <b>31 times</b>. Most happen at the <b>payment step</b> and on <b>iOS</b>. The timing suggests a technical change around 18 Nov.',
    evidence: bars('Mobile checkout error mentions per day, Octobre', DAYS(12,12,'Nov'), [1,2,1,1,2,1,5,6,4,5,4,3], {hi:range(6,11), show:[0,6,11], note:'Red: since 18 Nov.'}),
    where:{unit:'Mentions since 18 Nov', segs:[{t:'Device', rows:[['iOS',21],['Android',6],['Web',4]]},{t:'Checkout step', rows:[['Payment',19],['Address',8],['Promo code',4]]}]},
    quotes:[Q('neg','Checkout','The app crashed at payment twice, I had to order on the website.')],
    actions:[{who:'Web team', t:'Check the app release around 18 Nov', d:'Most errors are at payment on iOS.', cta:'share'}],
    qa:[['Is it the app or the website?','The app: 27 of 31 mentions, mostly on iOS.','Where it happened'],['Which step?','Payment, in 19 of 31 mentions.','Where it happened'],['When did it start?','18 Nov. Before that, about 1.5 mentions a day.','Evidence']],
    method:'Anomaly detection on daily counts of checkout-error comments.', data:'Octobre Customer Experience Survey, 4–23 Nov.', not:'The technical cause.'}
};
window.SZ_DATA = SZ;

/* colleagues and shares (sample people) */
const PEOPLE = {
  'INS-06':['Léa Martin','Customer Service Team Lead','Lovely to see. Can we share these comments with the team on Friday?'],
  'CTY-01':['Camille Bernard','Head of Operations','Coats keep coming up in our reviews too. Can we size this for the monthly report?'],
  'INS-02':['Julien Moreau','Product team','Price came up in our collection review too. Worth a closer look?'],
  'SHW-01':['Julien Moreau','Product team','Seeing this on the Octobre app. Is customer service hearing it too?'],
  'INS-01':['Sophie Laurent','Head of Customer Experience','Nice rise. Can you add the country split to the monthly report?']
};

/* ── 1. data the prototype reads ── */
function szData(){
  Object.entries(SZ).forEach(([id,s])=>{
    const stat = `<p class="ic-num"${s.numColor?` style="color:${s.numColor}"`:''}>${s.num}</p><p class="ic-unit">${E(s.unit)}</p>`;
    INSIGHT_META[id] = Object.assign({}, INSIGHT_META[id]||{}, {title:s.title, category:s.type+' — '+s.topic, tag:s.topic, summary:s.sum.replace(/<[^>]+>/g,''), illustrative:false, statBig:s.num, statUnit:s.unit});
    PRIORITY[id] = {level:s.prio, reason:s.reason};
    V24_CARDS[id] = {sum:s.sum, stat};
    if(typeof V21_HERO!=='undefined') V21_HERO[id] = {kpis:s.kpis, what:s.what, card:{}};
    if(typeof V22_FOL_SUM!=='undefined') delete V22_FOL_SUM[id];
    if(typeof V26_EVID!=='undefined') delete V26_EVID[id];
    if(typeof V19_QA!=='undefined') delete V19_QA[id];
    if(typeof V18_SURVEY_OF!=='undefined') V18_SURVEY_OF[id] = s.survey||'store';
    V10_DRILL[id] = {what:s.what.replace(/<[^>]+>/g,''), compares:s.compares, responses:s.responses, evidenceHTML:ev(s.evidence),
      voiceHTML: s.quotes.length ? `<div class="space-y-2">${s.quotes.map(szQuote).join('')}</div><button class="v3-seeall" data-v3-see-all onclick="toast('In the product this lists every comment behind the insight')">See all comments</button>`
        : `<p class="v10-note" style="margin:0 16px 14px">This insight is built from the comment themes. Open the comments in Responses to read examples.</p>`,
      actions:s.actions};
    if(typeof V11_QUOTES!=='undefined') V11_QUOTES[id] = s.quotes.map(q=>q.slice(0,3));
    if(typeof V20_WHERE!=='undefined'){ if(s.where) V20_WHERE[id] = s.where; else delete V20_WHERE[id]; }
    if(typeof V17_WHERE!=='undefined') delete V17_WHERE[id];
    COPILOT_QA[id] = s.qa.map(x=>x.slice());
    GROUNDING[id] = {method:s.method, data:s.data, checks:'Enough responses for the figures shown.', not:s.not};
    if(typeof investigateContent!=='undefined') investigateContent[id] = '';
    if(typeof SNAP_EXTRA!=='undefined' && SNAP_EXTRA[id]) Object.assign(SNAP_EXTRA[id], {title:s.title, summary:s.sum.replace(/<[^>]+>/g,''), tag:s.topic, prio:s.prio, unit:s.unit, illustrative:false, ctx:s.compares});
    if(typeof FOLLOW_TRACK!=='undefined' && FOLLOW_TRACK[id]) FOLLOW_TRACK[id].rows.forEach(r=>{ r.val = s.num; });
  });
  // shares: sample colleagues; outside insights open the normal drill-down
  sharedWithMe.forEach(x=>{ const p = PEOPLE[x.insightId], s = SZ[x.insightId]; if(!p || !s) return;
    Object.assign(x, {from:p[0], fromRole:p[1], note:p[2], date: x.insightId==='INS-01' ? '2 days ago' : x.date, insightTitle:s.title, insightTag:s.topic, scope:'Sézane', access:'full'});
    if(typeof SHARED_VIEWS!=='undefined') delete SHARED_VIEWS[x.id]; });
  // activity on insights: Sézane colleagues and notes
  const YOU = {'INS-04':'Shared the email replies rated 1 out of 4 with team leads for review.','INS-02':'Agreed. I’ll add it to the monthly voice-of-customer report.','INS-05':'Asked logistics to check Carrier A.','FOL-01':'Great result. Following for two more weeks.'};
  if(typeof insightActivity!=='undefined') Object.entries(insightActivity).forEach(([id,a])=>{ if(!SZ[id] || !a || !a.events) return; const p = PEOPLE[id];
    const sh = sharedWithMe.find(x=>x.insightId===id);
    a.events.forEach(ev=>{ if(ev.by!=='You'){ ev.by = p ? p[0] : 'Sophie Laurent'; if(sh) ev.date = sh.date; if(ev.type==='comment') ev.text = p ? p[2] : 'Worth a look before the monthly report.'; }
      else if(ev.type==='comment') ev.text = YOU[id] || 'Added to the monthly report.'; }); });
  // the persona the admin set up
  if(typeof V15_SEED!=='undefined'){ const sm = V15_SEED.find(x=>x.id==='sm'); if(sm) Object.assign(sm, {name:'CX manager', group:'Customer service managers',
    role:'Runs customer service day to day and reports to the Head of Customer Experience.',
    resp:'What advisors control: helpfulness and speed of replies, follow-up, advisor training and quality reviews. Delivery, product, price and stock go into the monthly voice-of-customer report for other teams.'}); }
  if(typeof V3_SCOPES!=='undefined'){ V3_SCOPES.store.label = SURVEY; V3_SCOPES.store.sub = 'After a customer service contact';
    V3_SCOPES.online.label = 'Octobre Customer Experience Survey'; V3_SCOPES.online.sub = 'Octobre customers'; }
  V26_GROUPS.length = 0; V26_GROUPS.push(['Customer service team leads','8 people'],['Product team','6 people'],['Logistics','4 people'],['Operations','5 people'],['Marketing','5 people']);
  V26_PEOPLE.length = 0; V26_PEOPLE.push(['Sophie Laurent','Head of Customer Experience'],['Léa Martin','Customer Service Team Lead'],['Camille Bernard','Head of Operations'],['Julien Moreau','Product team']);
  if(typeof V28_QUICK!=='undefined'){ V28_QUICK.length = 0; V28_QUICK.push('Sophie Laurent','Léa Martin','Camille Bernard'); }
  if(typeof V26_CH!=='undefined'){ V26_CH.length = 0; V26_CH.push(['slack','Slack','#cx-sezane'],['teams','Teams','Customer service › General']); }
  // Customise my feed
  if(typeof V23_TOPICS!=='undefined'){ V23_TOPICS.length = 0; V23_TOPICS.push('Customer service','Follow-up','Delivery','Refunds','Product quality','Price','Gift cards','Stock & sizes','Packaging','Checkout'); }
  if(typeof V23_FIELDS!=='undefined'){ V23_FIELDS.length = 0; V23_FIELDS.push(['Hub',true],['Country',true],['Contact channel',true],['Contact reason',false],['Customer type (VIP)',false],['Language',false]); }
  if(typeof V23_HINTS!=='undefined'){ V23_HINTS.length = 0; V23_HINTS.push([/service|advisor|agent|reply|response/i,'Customer service'],[/follow/i,'Follow-up'],[/deliver|shipping|carrier|tracking/i,'Delivery'],
    [/quality|fabric|product/i,'Product quality'],[/pric|expensive|cost/i,'Price'],[/gift/i,'Gift cards'],[/size|stock|restock/i,'Stock & sizes'],[/refund|return|exchange|after.?sales/i,'Refunds'],[/packag|pouch|box/i,'Packaging'],
    [/checkout|payment|basket/i,'Checkout'],[/brand/i,'Brand'],[/new|first|emerging/i,'New issues first']); }
  if(typeof V23_STARTERS!=='undefined'){ V23_STARTERS.length = 0; V23_STARTERS.push('What our advisors control matters most to me','I don’t want price insights','Tell me about anything new first'); }
  if(typeof V3_STARTERS!=='undefined') V3_STARTERS.insights = ['Summarise this week’s insights','What needs my action today?','What are customers saying about delivery?'];
  // dates: the feed is current, with weekly updates on Sundays
  const D = [['Sun 22 Nov 2026','Sun 22 Nov','18 Nov 2026'],['Sun 15 Nov 2026','Sun 15 Nov','11 Nov 2026'],['Sun 8 Nov 2026','Sun 8 Nov','4 Nov 2026'],['Sun 1 Nov 2026','Sun 1 Nov','28 Oct 2026'],['Sun 25 Oct 2026','Sun 25 Oct','21 Oct 2026']];
  EDITIONS.forEach((e,i)=>{ if(D[i]){ e.date = D[i][0]; e.short = D[i][1]; e.cut = D[i][2]; } });
  const e27 = EDITIONS[0]; ['AL-03','AL-04'].forEach(id=>{ if(e27.ids.indexOf(id)<0) e27.ids.push(id); });
  if(typeof V28_TODAY!=='undefined') V28_TODAY.setFullYear(2026, 10, 24);
}
function szQuote(q){
  const [tone, theme, text, en] = q;
  return `<div class="v3-q sz-q"><span class="v3-qav ${tone==='pos'?'pos':'neg'}">${tone==='pos'?'☺':'☹'}</span><div><p class="v3-qm"><b>Respondent</b> · ${E(theme)}<span class="v3-qt ${tone==='pos'?'pos':'neg'}">${tone==='pos'?'Positive':'Negative'}</span></p>
    <p class="v3-qx">“${E(text)}”</p>${en?`<p class="sz-tr">${E(en)}</p>`:''}</div></div>`;
}

/* ── 2. cards everywhere: Sézane wording, topic pill and priority ── */
function szCards(){
  document.querySelectorAll('.insight-card[data-id], .fol-card, .shr-card').forEach(c=>{
    const id = c.dataset.id || c.dataset.folId || ((sharedWithMe.find(x=>x.id===c.dataset.shareCard)||{}).insightId); const s = SZ[id]; if(!s) return;
    if(c.dataset.priority!==s.prio) c.dataset.priority = s.prio;
    if(c.dataset.survey!==(s.survey||'store')) c.dataset.survey = s.survey||'store';
    const set = (sel, v, html)=>{ c.querySelectorAll(sel).forEach(el=>{ if(html){ if(el.innerHTML!==v) el.innerHTML = v; } else if(el.textContent!==v) el.textContent = v; }); };
    set('[data-el="kind-text"]', s.type+' · '+s.topic);
    set('[data-el="title"], .ic-title', s.title);
    set('[data-el="summary"], .ic-sum', s.sum, true);
    set('[data-el="basis"]', s.compares);
    c.querySelectorAll('.ic-foot *').forEach(el=>{ if(!el.children.length && /Too few responses|No longer significant|showing the last reliable/.test(el.textContent) && el.style.display!=='none') el.style.display = 'none'; });
    const st = c.querySelector('[data-el="stat"], .ic-stat'), stat = V24_CARDS[id] && V24_CARDS[id].stat;
    if(st && stat && st.innerHTML!==stat){ st.innerHTML = stat; st.classList.add('v21-stat'); c.classList.remove('v7-nostat'); }
  });
}

/* ── 3. retail words that live in shared screens ── */
const SZ_TEXT = [[/Store experience survey/g,SURVEY],[/Online experience survey/g,'Octobre Customer Experience Survey'],[/RT ATYAF MALL/g,'Sézane'],[/RT SHUWAIKH/g,'Sézane'],
  [/Store managers?/g,'CX manager'],[/store managers?/g,'CX manager'],[/Store Managers/g,'CX team'],[/Area Managers?/g,'Head of Customer Service'],[/Central Operations/g,'Operations'],
  [/next store review/g,'monthly report'],[/your store’s/g,'your'],[/your store's/g,'your'],[/your store/g,'your customers'],[/this store/g,'Sézane'],[/other stores/g,'other teams'],[/the store/g,'Sézane'],
  [/shoppers/g,'customers'],[/Shoppers/g,'Customers'],[/shopper/g,'customer'],[/#rt-atyaf-store/g,'#cx-sezane'],[/#store-ops/g,'#cx-sezane'],
  [/Sun 27 Sep/g,'Sun 22 Nov'],[/Sun 20 Sep/g,'Sun 15 Nov'],[/Sun 13 Sep/g,'Sun 8 Nov'],[/Sun 6 Sep/g,'Sun 1 Nov'],[/Sun 30 Aug/g,'Sun 25 Oct'],[/Sun 4 Oct/g,'Sun 29 Nov'],[/\b27 Sep\b/g,'22 Nov'],[/\b20 Sep\b/g,'15 Nov'],[/\b13 Sep\b/g,'8 Nov'],[/\b1 surveys\b/g,'1 survey'],[/weekends are my busiest days/g,'follow-up is what I’m working on this month']];
function szText(root){
  const w = document.createTreeWalker(root||document.body, NodeFilter.SHOW_TEXT, {acceptNode:n=>{ const p = n.parentElement; return p && !p.closest('script,style,textarea,input,#proto-notes') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }});
  let n; while((n = w.nextNode())){ let t = n.nodeValue, o = t; if(!/[A-Za-z#]/.test(t)) continue; SZ_TEXT.forEach(([re,to])=>{ t = t.replace(re,to); }); if(t!==o) n.nodeValue = t; }
  document.querySelectorAll('[placeholder]').forEach(el=>{ let t = el.placeholder, o = t; SZ_TEXT.forEach(([re,to])=>{ t = t.replace(re,to); }); if(t!==o) el.placeholder = t; });
}

/* ── 4. drill-down: no "since you followed" for lifetime figures ── */
const _szShape = v6Shape;
v6Shape = function(html, id){
  const out = _szShape.apply(this, arguments); if(!SZ[id]) return out;
  const t = document.createElement('template'); t.innerHTML = out;
  t.content.querySelectorAll('.id-sect').forEach(s=>{ const b = s.querySelector(':scope > .v6-sh b'); if(b && /^Since you followed/.test(b.textContent)) s.remove(); });
  t.content.querySelectorAll('.illus-banner,.v6-case,[data-v6-case]').forEach(n=>n.remove());
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};

/* ── 5. page Copilot answers ── */
const _szPage = v3PageAnswer;
v3PageAnswer = function(q){
  const s = String(q||'').toLowerCase();
  if(/summar/.test(s)) return `<p>This week’s main points:</p><ul><li><b>NPS rose to 64.1</b> in November, from 61.0, led by HUB EU. <b>HUB US fell</b> to 53.8.</li><li><b>Delivery complaints from HUB US tripled</b> since 16 Nov, mostly naming Carrier A.</li><li><b>Helpfulness slipped</b> to 3.52 out of 4, lowest on email. It drives 61% of NPS.</li><li><b>Refund delays</b> are the top detractor complaint for the 8th week running.</li><li>Good news: <b>packaging complaints halved</b> since the new pouch.</li></ul>`;
  if(/action|today|need/.test(s)) return `<p>Three things are in customer service’s hands:</p><ul><li><b>Give US advisors one answer for delayed parcels</b> while logistics checks Carrier A.</li><li><b>Review email replies rated 1 out of 4</b>: helpfulness is falling and drives 61% of NPS.</li><li><b>Write one gift card answer</b> before the holidays: those replies score 2.7 out of 4.</li></ul><p>Refunds, price, sizing and stock are for the voice-of-customer report.</p>`;
  if(/deliver/.test(s)) return `<p>Delivery complaints from <b>HUB US tripled since 16 Nov</b>: 94 customers, 58 of them naming <b>Carrier A</b>, mostly about tracking that stopped updating. NPS in HUB US fell to 41.0 over the same days. In HUB EU, packaging complaints <b>halved</b> after the new pouch.</p>`;
  return _szPage.apply(this, arguments);
};

/* ── 6. About the data ── */
function szNotes(){
  const n = document.getElementById('proto-notes'); if(!n || n.dataset.sz) return; n.dataset.sz = '1'; n.dataset.v10 = '1';
  n.innerHTML = `<p><b>Sézane version.</b> Built on Sézane’s ${SURVEY}: its questions (NPS, helpfulness, speed of reply), comment themes, hubs and custom fields. Some figures are real: all-time NPS 62.6 across 59.8K responses, NPS by comment theme, the hub split, and the drivers of NPS (helpfulness 61%, speed 39%, advisor attitude 72 vs 30, follow-up 2.53 vs 3.52). Quotes in French and Dutch, and some English ones, are real comments without names.</p>
    <p><b>Sample, to show the full experience:</b> changes over time and the dates they happened, segment breakdowns, carriers, product lines, colleagues, share notes and activity. React to the kind of insight, not the exact numbers.</p>`;
  const b = document.getElementById('proto-notes-btn'); if(b) b.textContent = 'ⓘ About the data · Sézane version';
}

/* ── 7. wiring ── */
let raf = 0;
function szAll(){ szCards(); szText(document.body); }
const _szVis = applyFeedVisibility;
applyFeedVisibility = function(){ szCards(); const r = _szVis.apply(this, arguments); szCards(); return r; };
const _szJourney = setJourney;
setJourney = function(){ const r = _szJourney.apply(this, arguments); szData(); applyFeedVisibility(); szAll(); return r; };
new MutationObserver(()=>{ if(raf) return; raf = requestAnimationFrame(()=>{ raf = 0; szAll(); }); }).observe(document.body, {childList:true, subtree:true, characterData:true});

szData(); szNotes();
const tb = document.getElementById('v24-tour-btn'); if(tb) tb.textContent = '★ CX manager · first visit';
setJourney('day50');
document.title = 'Survey Insights · Sézane';
})();
