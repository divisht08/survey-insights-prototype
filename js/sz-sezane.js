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

/* ── the insights ── */
const SZ = {
  'INS-05': {prio:'high', type:'Anomaly', topic:'NPS', ed:'e27',
    title:'NPS fell to 37 in the week of 21 Apr',
    sum:'<b>NPS dropped to 37.2</b> in the week of 21 Apr, from 65.6 the week before. <b>Responsiveness CSAT</b> fell the same week, to 8.55.',
    num:'▼ 28 pts', numColor:'#c5221f', unit:'NPS vs the week before',
    reason:'A sharp break from the usual weekly range, and the speed-of-reply score fell the same week.',
    compares:'the week of 21 Apr with the 8 weeks before', responses:'weekly NPS and Responsiveness CSAT',
    kpis:[['NPS, week of 21 Apr','▼ 28 pts','37.2, against 65.6 the week before','bad'],['Responsiveness CSAT','▼ 0.65','8.55 out of 10, against 9.2 the week before','bad'],['Week of 28 Apr','44.3','Partly recovered, still below the usual range','']],
    what:'NPS fell to <b>37.2 in the week of 21 Apr</b>, from 65.6 the week before and well below its usual range of <b>57.6–70.1</b>. <b>Responsiveness CSAT fell the same week</b>, from 9.2 to 8.55 out of 10, so the speed of replies is the first place to look. NPS <b>partly recovered to 44.3</b> the week after.',
    evidence: weeksChart(),
    where:{unit:'NPS, week of 21 Apr', segs:[{t:'Hub', k:'score', rows:[['HUB EU',35.8,''],['HUB US',43.9,'']]},{t:'Customer type', k:'score', rows:[['VIP',48.2,''],['Non-VIP',34.6,'']]}]},
    quotes:[['neg','Delivery','I’m extremely disappointed with how this situation has been…']],
    actions:[{who:'', t:'Check the customer service queue in the week of 21 Apr', d:'Volumes, response times and staffing that week. Responsiveness CSAT fell at the same time.', cta:'plan'},
      {who:'Operations', t:'Ask whether anything happened outside customer service that week', d:'A delivery delay, a stock problem or a site issue would pull NPS down more than CSAT.', cta:'share'}],
    qa:[['Has NPS recovered?','Partly. It rose to 44.3 in the week of 28 Apr, from 37.2, but it is still below the 57.6–70.1 range of the weeks before. Watch the next update.','Evidence'],
      ['Was it customer service?','Responsiveness CSAT fell the same week, from 9.2 to 8.55, so slower replies are probably part of it. NPS fell further than CSAT, so something else may have contributed too.','What happened'],
      ['Which customers were most affected?','The breakdown by hub and customer type is in Where it happened. Open the comments from that week to see what customers mention most.','Where it happened']],
    method:'Anomaly detection on weekly NPS and Responsiveness CSAT, against the previous 8 weeks.', data:SURVEY+', weekly figures to 28 Apr.', not:'The cause of the drop.'},

  'INS-04': {prio:'med', type:'Key driver', topic:'Customer service', ed:'e27',
    title:'A helpful reply drives NPS more than a fast one',
    sum:'<b>‘Was the response helpful?’</b> explains <b>61%</b> of what drives NPS, and speed of reply 39%. No comment theme had a comparable effect.',
    num:'61%', unit:'of NPS explained by helpfulness',
    reason:'The strongest driver of NPS, and within customer service’s control.',
    compares:'NPS with the two reply ratings', responses:'59.8K responses',
    kpis:[['Helpfulness','61%','of what drives NPS, of the two reply ratings',''],['Speed of reply','39%','‘Was your question answered quickly enough?’',''],['Rate the reply 1 or 2 out of 4','15%','about 8.9K responses','bad']],
    what:'Of the two customer service ratings, <b>helpfulness of the reply moves most with NPS (61%)</b>; speed accounts for the other <b>39%</b>. No comment theme had a comparable effect. <b>77%</b> rate the reply fully helpful, but <b>15%</b> give it 1 or 2 out of 4. This shows a link, not proof that a more helpful reply will raise NPS.',
    evidence: rows('What drives NPS', [['Was the response helpful?',61,'61%'],['Was your question answered quickly enough?',39,'39%']]) +
      rows('‘Was the response helpful?’ · all responses', [['4 out of 4',76.6,'76.6%'],['3',8.5,'8.5%'],['2',5.5,'5.5%'],['1',9.4,'9.4%']], '45.8K responses gave 4 out of 4; 5.6K gave 1.'),
    quotes:[['pos','Response time','Réponse rapide et quasiment immédiate. Solutions apportées suite à ma demande, service client très réactif, merci !','Fast, almost immediate reply. Solutions provided after my request, very responsive customer service, thank you!'],
      ['pos','Response time','La question a été très vite prise en compte et j’ai obtenu satisfaction…','My question was dealt with very quickly and I got what I needed…'],
      ['pos','Customer service','Customer service was incredibly helpful and would absolutely…']],
    actions:[{who:'', t:'Review conversations rated 1 out of 4 for helpfulness with team leads', d:'Look for issues left unsolved rather than slow replies.', cta:'plan'},
      {who:'Customer service team leads', t:'Add “was the issue solved?” to quality reviews', d:'Helpfulness matters more than speed, so check resolution, not only response time.', cta:'share'}],
    qa:[['Should we focus on speed or helpfulness?','Helpfulness. It explains 61% of what drives NPS, against 39% for speed. Both matter, but solving the issue counts for more.','What happened'],
      ['How many rate the reply as unhelpful?','15%: 9.4% gave 1 out of 4 and 5.5% gave 2. That is about 8.9K responses.','Evidence'],
      ['Does this prove cause?','No. It shows which rating moves most with NPS, not that improving it will raise NPS.','Evidence limitations']],
    method:'Regression of NPS on the two customer service ratings; the explained variation is split between them.', data:SURVEY+', all responses.', not:'Cause. It shows which rating moves most with NPS.'},

  'AL-03': {prio:'high', type:'Recurring theme', topic:'Delivery', ed:'e27',
    title:'Delivery comments have an NPS of 28',
    sum:'Customers who mention <b>delivery</b> give an NPS of <b>28</b>, against 62.6 overall, across <b>6.4K responses</b>.',
    num:'▼ 35 pts', numColor:'#c5221f', unit:'below overall NPS',
    reason:'A large theme with an NPS far below the overall score.',
    compares:'responses that mention delivery with all responses', responses:'6.4K mention delivery',
    kpis:[['NPS when delivery is mentioned','28.0','against 62.6 overall','bad'],['Responses that mention it','6.4K','11% of all responses',''],['Rank among 12 themes','6th lowest','Stock, after sales, checkout, order, price and gifts score lower','']],
    what:'Customers who mention <b>delivery</b> give an NPS of <b>28.0</b>, against <b>62.6</b> overall, across <b>6.4K responses</b>. Comments describe <b>delays, tracking problems</b> and <b>damaged or incomplete orders</b>, especially for time-sensitive purchases. Delivery is outside customer service’s control, so this is one for the logistics team.',
    evidence: themeChart('Delivery'),
    where:{unit:'Responses that mention delivery', segs:[{t:'Hub', rows:[['HUB EU',5210],['HUB US',1150]]},{t:'Customer type', rows:[['Non-VIP',4980],['VIP',1380]]}]},
    quotes:[['neg','Packaging','Lors de ma dernière commande la pochette en carton n’était pas assez solide','On my last order the cardboard pouch wasn’t sturdy enough'],
      ['neg','Delivery','I’m extremely disappointed with how this situation has been…']],
    actions:[{who:'', t:'Add delivery to the voice-of-customer report for logistics', d:'Share the NPS gap and the comments with the logistics team.', cta:'plan'},
      {who:'Logistics', t:'Check delays and tracking problems by carrier', d:'Comments mention delays and tracking. Compare with carrier performance for the same weeks.', cta:'share'}],
    qa:[['Is this getting worse?','This insight covers all responses, not a change over time. Follow it to see how the delivery NPS moves in each update.','Evidence limitations'],
      ['What do customers complain about?','Delays, tracking problems and damaged or incomplete orders, and packaging that is not sturdy enough.','What customers say'],
      ['Can customer service fix this?','Mostly not. It is a logistics issue, so the useful step is to pass the comments to the logistics team.','Recommended actions']],
    method:'Text analytics tags each comment with themes; NPS is compared between responses with and without the theme.', data:SURVEY+', all responses with a comment.', not:'Whether delivery problems caused the low scores.'},

  'INS-02': {prio:'med', type:'Recurring theme', topic:'Price', ed:'e27',
    title:'Price comments have an NPS of 9',
    sum:'Customers who mention <b>price</b> give an NPS of <b>9.4</b> across 1.4K responses. Comments link it to <b>recent price increases</b>.',
    num:'9.4', unit:'NPS, 1.4K responses',
    reason:'One of the lowest-scoring themes, and outside customer service’s control.',
    compares:'responses that mention price with all responses', responses:'1.4K mention price',
    kpis:[['NPS when price is mentioned','9.4','against 62.6 overall','bad'],['Responses that mention it','1.4K','2% of all responses',''],['Rank among 12 themes','2nd lowest','only gifts scores lower','']],
    what:'Customers who mention <b>price</b> give an NPS of <b>9.4</b>, against 62.6 overall, across 1.4K responses. Comments say <b>recent price increases</b> are not always matched by quality, and some long-standing customers compare Sézane with brands they see as better value. Price is outside customer service’s control, so this belongs in the voice-of-customer report.',
    evidence: themeChart('Price'),
    where:{unit:'Responses that mention price', segs:[{t:'Hub', rows:[['HUB EU',1180],['HUB US',260]]},{t:'Customer type', rows:[['Non-VIP',1010],['VIP',430]]}]},
    quotes:[['neg','Price increase','J’adore votre marque et son sac mais les nouveaux prix sont trop hauts malheureusement','I love your brand and its bag, but the new prices are unfortunately too high'],
      ['neg','Price','Wouldn’t want anyone else in the family to become trapped in the model that I am. They could not afford it.']],
    actions:[{who:'', t:'Include price in the monthly voice-of-customer report', d:'Share the NPS gap and examples with the product and pricing teams.', cta:'plan'},
      {who:'Product team', t:'Check which products the price comments name', d:'To see whether it is the new collection or prices overall.', cta:'share'}],
    qa:[['Is this new?','Comments mention recent price increases, but this insight covers all responses. Follow it to see whether price comments grow.','Evidence limitations'],
      ['How many customers mention price?','About 1.4K responses, or 2% of all responses.','Evidence'],
      ['What do they compare it with?','Some long-standing customers say quality has not kept up with price, and compare Sézane with brands they see as better value.','What customers say']],
    method:'Text analytics tags each comment with themes; NPS is compared between responses with and without the theme.', data:SURVEY+', all responses with a comment.', not:'Whether price caused the low scores.'},

  'AL-04': {prio:'med', type:'Recurring theme', topic:'Gifts', ed:'e27',
    title:'Gifts have the lowest NPS of any theme: 2',
    sum:'Customers who mention <b>gifts</b> give an NPS of <b>2.0</b> across 2.1K responses. <b>Gift conditions</b> also lower the helpfulness rating.',
    num:'2.0', unit:'NPS, lowest of 12 themes',
    reason:'The lowest-scoring theme, and partly within customer service’s control.',
    compares:'responses that mention gifts with all responses', responses:'2.1K mention gifts',
    kpis:[['NPS when gifts are mentioned','2.0','lowest of 12 themes','bad'],['Responses that mention it','2.1K','3% of all responses',''],['Helpfulness when gift conditions come up','▼ 0.9','lower than for other customers','bad']],
    what:'Customers who mention <b>gifts</b> give an NPS of <b>2.0</b>, the lowest of 12 themes, across 2.1K responses. Comments mention <b>missing promotional gifts</b> and <b>gift card conditions</b>. When gift conditions come up, customers also rate the reply <b>0.9 points less helpful</b>, so part of this is in customer service’s hands: explaining the conditions clearly.',
    evidence: themeChart('Gifts'),
    where:{unit:'Responses that mention gifts', segs:[{t:'Hub', rows:[['HUB EU',1760],['HUB US',310]]},{t:'Customer type', rows:[['Non-VIP',1590],['VIP',480]]}]},
    quotes:[['neg','Gift card','J’ai reçu une carte cadeau pour mon anniversaire et…','I received a gift card for my birthday and…']],
    actions:[{who:'', t:'Give advisors one clear answer on gift and gift card conditions', d:'Gift conditions lower the helpfulness rating by 0.9. A standard reply would help.', cta:'plan'},
      {who:'Marketing', t:'Check how promotional gift conditions are explained', d:'Missing promotional gifts come up often. Clearer conditions at checkout may prevent contacts.', cta:'share'}],
    qa:[['Why is it so low?','Comments mention promotional gifts that did not arrive and confusion about gift card conditions.','What happened'],
      ['Can customer service do anything?','Yes. When gift conditions come up, the reply is rated 0.9 points less helpful, so a clearer standard answer would help.','Recommended actions'],
      ['How many responses mention gifts?','About 2.1K, or 3% of all responses.','Evidence']],
    method:'Text analytics tags each comment with themes; NPS and the helpfulness rating are compared with and without the theme.', data:SURVEY+', all responses with a comment.', not:'How many orders were missing a gift.'},

  'INS-06': {prio:'pos', type:'Segment comparison', topic:'Customer service', ed:'e27',
    title:'Advisor attitude lifts NPS by 42 points',
    sum:'Customers who mention <b>advisor attitude</b> give an NPS of <b>72</b>, against 30 for other comments. Mentions of <b>response time</b> show a similar lift.',
    num:'▲ 42 pts', numColor:'#0e8a5f', unit:'NPS vs other comments',
    reason:'A strength worth keeping: what customers praise most.',
    compares:'comments that mention advisor attitude with other comments', responses:'26.2K mention customer service',
    kpis:[['NPS when advisor attitude is mentioned','72','against 30 for other comments',''],['NPS when response time is mentioned','70','a 40-point lift',''],['Customer service theme','65.5','NPS across 26.2K responses, the largest theme','']],
    what:'Customers who mention <b>advisor attitude</b> give an NPS of <b>72</b>, against <b>30</b> for other comments, a <b>42-point lift</b>. Mentions of <b>response time</b> show a similar lift (70 against 30). Customers praise advisors who are <b>fast, kind and professional</b> and who solve the issue, often by name.',
    evidence: rows('NPS, comments that mention each theme vs other comments', [['Advisor attitude',72,'72'],['Response time',70,'70'],['Other comments',30,'30']]),
    where:{unit:'NPS, comments that mention advisor attitude', segs:[{t:'Hub', k:'score', rows:[['HUB EU',73.1,''],['HUB US',67.4,'']]},{t:'Customer type', k:'score', rows:[['VIP',78.0,''],['Non-VIP',70.2,'']]}]},
    quotes:[['pos','Response time','Réponse rapide et quasiment immédiate. Solutions apportées suite à ma demande, service client très réactif, merci !','Fast, almost immediate reply. Solutions provided after my request, very responsive customer service, thank you!'],
      ['pos','Customer service','Originele producten, goede snelle klantenservice','Original products, good fast customer service'],
      ['pos','After sales','I truly have had nothing but amazing service from Sezane. Easy returns make it even better.']],
    actions:[{who:'', t:'Share what customers praise at the next team meeting', d:'Fast, kind replies that solve the issue. Recognise the advisors behind them.', cta:'plan'},
      {who:'Head of Customer Service', t:'Use these comments in advisor training', d:'Real examples of what customers value most.', cta:'share'}],
    qa:[['What do customers praise?','Advisors who reply quickly, are kind and professional, and solve the issue.','What customers say'],
      ['Is it the same for response time?','Yes. Comments that mention response time have an NPS of 70, against 30 for other comments.','Evidence'],
      ['Is it the same in both hubs?','The split by hub is in Where it happened.','Where it happened']],
    method:'Text analytics tags each comment with themes; NPS is compared between comments with and without the theme.', data:SURVEY+', all responses with a comment.', not:'Whether the advisor’s attitude caused the higher score.'},

  'INS-01': {prio:'low', type:'Overview', topic:'NPS', ed:'e27',
    title:'NPS is 62.6 across 59.8K responses',
    sum:'<b>44.1K promoters</b>, 9K passives and <b>6.7K detractors</b> since the survey started, from 145.8K invitations.',
    num:'62.6', unit:'NPS, all responses',
    reason:'The baseline for everything else in the feed.',
    compares:'promoters, passives and detractors across all responses', responses:'59.8K responses',
    kpis:[['NPS','62.6','all 59.8K responses',''],['Promoters','74%','44.1K responses',''],['Detractors','11%','6.7K responses','bad']],
    what:'Sézane’s NPS is <b>62.6</b> across <b>59.8K responses</b>: <b>74% promoters</b>, 15% passives and <b>11% detractors</b>. That is a <b>41% response rate</b> from 145.8K invitations. <b>Brand (72.3)</b> and <b>customer experience (71.1)</b> are the best-rated themes; <b>gifts (2.0)</b> and <b>price (9.4)</b> the lowest.',
    evidence: stack([['Promoters',74,'#2e9d6a','44.1K'],['Passives',15,'#e2a93b','9K'],['Detractors',11,'#d9534f','6.7K']]) + themeChart(''),
    where:{unit:'Responses, in thousands', segs:[{t:'Hub', rows:[['HUB EU',49.9],['HUB US',9.9]]}]},
    quotes:[['pos','Product','Nice clothes, free ship and returns when needed.'],['pos','Customer service','Well u guys are fantastic love your clothes and customer service']],
    actions:[{who:'', t:'Use this as the baseline in the monthly report', d:'NPS by theme and by hub, as in the current report.', cta:'plan'}],
    qa:[['Which themes pull NPS down?','Gifts (2.0), price (9.4), order (13.5), checkout (20.1) and after sales (22.8).','Evidence'],
      ['How big is HUB US?','17% of responses: 9.9K, against 49.9K for HUB EU.','Where it happened'],
      ['What is the response rate?','41%: 59.8K responses from 145.8K invitations.','What happened']],
    method:'Descriptive analysis of all NPS responses, with NPS by comment theme.', data:SURVEY+', all responses to date.', not:'How NPS has changed over time; see the weekly NPS insight.'},

  'INS-03': {prio:'med', type:'Key driver', topic:'Follow-up', ed:'e27',
    title:'Follow-up issues cut the speed rating to 2.5 out of 4',
    sum:'Customers who mention <b>follow-up</b> rate ‘answered quickly enough’ <b>2.53 out of 4</b>, against 3.52 for others.',
    num:'▼ 1.0', numColor:'#c5221f', unit:'out of 4, vs other customers',
    reason:'Fully within customer service’s control, and the largest gap on speed.',
    compares:'responses that mention follow-up with other responses', responses:'all responses with a comment',
    kpis:[['Speed rating when follow-up is mentioned','2.53','out of 4','bad'],['Other customers','3.52','out of 4',''],['Helpfulness when follow-up is mentioned','▼ 0.9','lower than for others','bad']],
    what:'Customers who mention <b>follow-up</b> rate ‘Was your question answered quickly enough?’ <b>2.53 out of 4</b>, against <b>3.52</b> for others, and rate the reply <b>0.9 points less helpful</b>. This is within customer service’s control: customers who had to <b>chase an answer</b> are the least satisfied with speed.',
    evidence: rows('‘Answered quickly enough?’ · average out of 4', [['Mention follow-up',2.53,'2.53'],['Other customers',3.52,'3.52'],['Mention advisor attitude',3.75,'3.75']]),
    quotes:[['neg','Delivery','I’m extremely disappointed with how this situation has been…']],
    actions:[{who:'', t:'Review cases that needed more than one contact', d:'Find where customers had to chase: refunds, exchanges or order problems.', cta:'plan'},
      {who:'Customer service team leads', t:'Tell customers when they will hear back', d:'And check the promise is kept.', cta:'share'}],
    qa:[['What does follow-up mean here?','Comments where customers say they had to chase an answer or did not hear back.','What happened'],
      ['How much lower is the rating?','2.53 out of 4, against 3.52 for others: about 1 point lower on speed, and 0.9 lower on helpfulness.','Evidence'],
      ['Can we act on it?','Yes. It is about how customer service follows up, so it can be acted on directly.','Recommended actions']],
    method:'Text analytics tags each comment with themes; the two reply ratings are compared with and without the theme.', data:SURVEY+', all responses with a comment.', not:'How many cases needed a follow-up.'},

  'FOL-01': {prio:'med', type:'Recurring theme', topic:'After sales', ed:'e13',
    title:'After-sales comments have an NPS of 23',
    sum:'Customers who mention <b>after sales</b> give an NPS of <b>22.8</b> across 5.7K responses. <b>Refunds</b> are 9% of what detractors complain about.',
    num:'22.8', unit:'NPS, 5.7K responses',
    reason:'A large theme with a low score, partly within customer service’s control.',
    compares:'responses that mention after sales with all responses', responses:'5.7K mention after sales',
    kpis:[['NPS when after sales is mentioned','22.8','against 62.6 overall','bad'],['Responses that mention it','5.7K','9% of all responses',''],['Refunds','9%','of detractor pain points, second after product quality','']],
    what:'Customers who mention <b>after sales</b> give an NPS of <b>22.8</b>, against 62.6 overall, across 5.7K responses. Among detractors, <b>refunds</b> are 9% of pain points, second only to product quality. Comments also mention <b>returns and exchanges</b> that were not handled well.',
    evidence: themeChart('After sales'),
    quotes:[['pos','After sales','I truly have had nothing but amazing service from Sezane. Easy returns make it even better.']],
    actions:[{who:'', t:'Check refund handling times', d:'Refunds are the second-biggest detractor pain point.', cta:'plan'}],
    qa:[['What do customers mention?','Refunds most of all, then returns and exchanges.','What happened'],['Is it all negative?','No. Easy returns are also praised; the NPS is low overall.','What customers say'],['How big is it?','5.7K responses, or 9% of all responses.','Evidence']],
    method:'Text analytics tags each comment with themes; NPS is compared with and without the theme.', data:SURVEY+', all responses with a comment.', not:'Refund processing times.'},

  'FOL-02': {prio:'med', type:'Key driver', topic:'Product', ed:'e20',
    title:'Product quality is the top reason detractors give',
    sum:'<b>11%</b> of customers are detractors. Their top pain points are <b>product quality (15%)</b>, refunds (9%) and restock (8%).',
    num:'15%', unit:'of detractor pain points',
    reason:'The biggest detractor pain point, for the product team.',
    compares:'detractor comments by pain point', responses:'6.7K detractors',
    kpis:[['Detractors','11%','of all responses','bad'],['Product quality','15%','of detractor pain points','bad'],['Product theme','50.0','NPS across 12.6K responses','']],
    what:'<b>11%</b> of customers are detractors. In their comments, <b>product quality</b> is the top pain point at <b>15%</b>, ahead of <b>refunds (9%)</b> and <b>product availability and restock (8%)</b>. Comments mention <b>fabric quality, sizing</b> and <b>damaged or incomplete orders</b>.',
    evidence: rows('Detractor pain points · share of comments', [['Product quality',15,'15%'],['After sales: refunds',9,'9%'],['Product availability & restock',8,'8%']]),
    quotes:[],
    actions:[{who:'Product team', t:'Share the product-quality comments with the product team', d:'Fabric, sizing and damaged items, with examples.', cta:'share'}],
    qa:[['What about product quality?','Fabric quality, sizing and items that arrive damaged or incomplete.','What happened'],['How many detractors are there?','11% of responses, about 6.7K.','Evidence'],['Is this controllable?','Not by customer service. It belongs in the voice-of-customer report for the product team.','Recommended actions']],
    method:'Text analytics on detractor comments (bottom-2-box NPS), ranked by share of comments.', data:SURVEY+', detractor comments.', not:'Which products are affected.'},

  'CTY-01': {prio:'high', type:'Recurring theme', topic:'Stock', ext:true,
    title:'Stock comments have an NPS of 25',
    sum:'Customers who mention <b>stock</b> give an NPS of <b>24.7</b> across 2.9K responses. They ask for <b>more sizes</b> and <b>more reliable restocks</b>.',
    num:'24.7', unit:'NPS, 2.9K responses',
    reason:'A low-scoring theme for operations and product.',
    compares:'responses that mention stock with all responses', responses:'2.9K mention stock',
    kpis:[['NPS when stock is mentioned','24.7','against 62.6 overall','bad'],['Responses that mention it','2.9K','5% of all responses',''],['Restock','8%','of detractor pain points','']],
    what:'Customers who mention <b>stock</b> give an NPS of <b>24.7</b>, against 62.6 overall, across 2.9K responses. They ask for <b>more size options</b> and <b>more reliable restocks</b>; product availability and restock is <b>8%</b> of detractor pain points.',
    evidence: themeChart('Stock'),
    quotes:[],
    actions:[{who:'Operations', t:'Add stock to the monthly voice-of-customer report', d:'With the sizes and products customers ask for.', cta:'share'}],
    qa:[['What do customers ask for?','More size options and more reliable restocks.','What happened'],['How big is it?','2.9K responses, 5% of all responses.','Evidence'],['Who should own it?','Operations and product. It is outside customer service’s control.','Recommended actions']],
    method:'Text analytics tags each comment with themes; NPS is compared with and without the theme.', data:SURVEY+', all responses with a comment.', not:'Which products were out of stock.'},

  'SHW-01': {prio:'med', type:'Recurring theme', topic:'Checkout', ext:true,
    title:'Checkout comments have an NPS of 20',
    sum:'Customers who mention <b>checkout</b> give an NPS of <b>20.1</b> across 1.3K responses.',
    num:'20.1', unit:'NPS, 1.3K responses',
    reason:'A low-scoring theme for the web team.',
    compares:'responses that mention checkout with all responses', responses:'1.3K mention checkout',
    kpis:[['NPS when checkout is mentioned','20.1','against 62.6 overall','bad'],['Responses that mention it','1.3K','2% of all responses',''],['Rank among 12 themes','4th lowest','','']],
    what:'Customers who mention <b>checkout</b> give an NPS of <b>20.1</b>, against 62.6 overall, across 1.3K responses. It is one of the smaller themes but among the lowest-scoring.',
    evidence: themeChart('Checkout'),
    quotes:[],
    actions:[{who:'Web team', t:'Share the checkout comments with the web team', d:'To see which step customers mention.', cta:'share'}],
    qa:[['How big is it?','1.3K responses, 2% of all responses.','Evidence'],['How does it compare?','Its NPS of 20.1 is the 4th lowest of 12 themes.','Evidence'],['Who should own it?','The web team.','Recommended actions']],
    method:'Text analytics tags each comment with themes; NPS is compared with and without the theme.', data:SURVEY+', all responses with a comment.', not:'Which checkout step is the problem.'}
};
window.SZ_DATA = SZ;

/* colleagues and shares (sample people) */
const PEOPLE = {
  'INS-06':['Léa Martin','Customer Service Team Lead','Lovely to see. Can we share these comments with the team on Friday?'],
  'CTY-01':['Camille Bernard','Head of Operations','Stock keeps coming up in our reviews too. Can we size it for the monthly report?'],
  'INS-02':['Julien Moreau','Product team','Price came up in our collection review too. Worth a closer look?'],
  'SHW-01':['Julien Moreau','Product team','Checkout feedback for the web team. Seen anything similar in customer service?'],
  'INS-01':['Sophie Laurent','Head of Customer Experience','Good baseline for the monthly report.']
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
    if(typeof V18_SURVEY_OF!=='undefined') V18_SURVEY_OF[id] = 'store';
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
  const YOU = {'INS-04':'Shared the conversations rated 1 out of 4 with team leads for review.','INS-02':'Agreed. I’ll add it to the monthly voice-of-customer report.','INS-05':'Checking queue volumes for that week with the team leads.'};
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
  if(typeof V23_TOPICS!=='undefined'){ V23_TOPICS.length = 0; V23_TOPICS.push('Customer service','Follow-up','Delivery','Product quality','Price','Gifts','Stock & sizes','After sales & refunds','Checkout','Brand'); }
  if(typeof V23_FIELDS!=='undefined'){ V23_FIELDS.length = 0; V23_FIELDS.push(['Hub',true],['Customer type (VIP)',true],['Language',false],['Fraud scoring',false]); }
  if(typeof V23_HINTS!=='undefined'){ V23_HINTS.length = 0; V23_HINTS.push([/service|advisor|agent|reply|response/i,'Customer service'],[/follow/i,'Follow-up'],[/deliver|shipping|carrier|tracking/i,'Delivery'],
    [/quality|fabric|product/i,'Product quality'],[/pric|expensive|cost/i,'Price'],[/gift/i,'Gifts'],[/size|stock|restock/i,'Stock & sizes'],[/refund|return|exchange|after.?sales/i,'After sales & refunds'],
    [/checkout|payment|basket/i,'Checkout'],[/brand/i,'Brand'],[/new|first|emerging/i,'New issues first']); }
  if(typeof V23_STARTERS!=='undefined'){ V23_STARTERS.length = 0; V23_STARTERS.push('What our advisors control matters most to me','I don’t want price insights','Tell me about anything new first'); }
  if(typeof V3_STARTERS!=='undefined') V3_STARTERS.insights = ['Summarise this week’s insights','What needs my action today?','What are customers saying about delivery?'];
  // dates: Sézane's data runs to the week of 28 Apr, so the feed's updates are in late April and May
  const D = [['Sun 3 May 2026','Sun 3 May','28 Apr 2026'],['Sun 26 Apr 2026','Sun 26 Apr','21 Apr 2026'],['Sun 19 Apr 2026','Sun 19 Apr','14 Apr 2026'],['Sun 12 Apr 2026','Sun 12 Apr','7 Apr 2026'],['Sun 5 Apr 2026','Sun 5 Apr','31 Mar 2026']];
  EDITIONS.forEach((e,i)=>{ if(D[i]){ e.date = D[i][0]; e.short = D[i][1]; e.cut = D[i][2]; } });
  const e27 = EDITIONS[0]; ['AL-03','AL-04'].forEach(id=>{ if(e27.ids.indexOf(id)<0) e27.ids.push(id); });
  if(typeof V28_TODAY!=='undefined') V28_TODAY.setFullYear(2026, 4, 5);
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
    if(c.dataset.survey && c.dataset.survey!=='store') c.dataset.survey = 'store';
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
  [/Sun 27 Sep/g,'Sun 3 May'],[/Sun 20 Sep/g,'Sun 26 Apr'],[/Sun 13 Sep/g,'Sun 19 Apr'],[/Sun 6 Sep/g,'Sun 12 Apr'],[/Sun 30 Aug/g,'Sun 5 Apr'],[/Sun 4 Oct/g,'Sun 10 May'],[/\b27 Sep\b/g,'3 May'],[/\b20 Sep\b/g,'26 Apr'],[/\b13 Sep\b/g,'19 Apr'],[/\b1 surveys\b/g,'1 survey'],[/weekends are my busiest days/g,'follow-up is what I’m working on this month']];
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
  if(/summar/.test(s)) return `<p>This week’s main points from the ${SURVEY}:</p><ul><li><b>NPS fell to 37.2 in the week of 21 Apr</b>, from 65.6, and partly recovered to 44.3. Responsiveness CSAT fell the same week.</li><li><b>A helpful reply drives NPS more than a fast one</b>: 61% against 39%.</li><li><b>Delivery (28), price (9.4) and gifts (2.0)</b> are the lowest-scoring themes.</li><li>Good news: <b>advisor attitude lifts NPS by 42 points</b>.</li></ul>`;
  if(/action|today|need/.test(s)) return `<p>Two insights are within customer service’s control:</p><ul><li><b>Check the queue in the week of 21 Apr</b>, when NPS and Responsiveness CSAT both fell.</li><li><b>Review cases that needed a follow-up</b>: these customers rate speed 2.53 out of 4, against 3.52.</li></ul><p>Delivery, price and stock are for the voice-of-customer report.</p>`;
  if(/deliver/.test(s)) return `<p>Customers who mention <b>delivery</b> give an NPS of <b>28</b>, against 62.6 overall, across 6.4K responses. They describe <b>delays, tracking problems</b> and <b>damaged or incomplete orders</b>. It is mostly outside customer service’s control, so the next step is to share it with logistics.</p>`;
  return _szPage.apply(this, arguments);
};

/* ── 6. About the data ── */
function szNotes(){
  const n = document.getElementById('proto-notes'); if(!n || n.dataset.sz) return; n.dataset.sz = '1'; n.dataset.v10 = '1';
  n.innerHTML = `<p><b>Sézane version.</b> Insight figures come from Sézane’s Sprinklr account: the ${SURVEY} (59.8K responses), the Overview and Metadata dashboards (NPS, weekly NPS and Responsiveness CSAT, NPS by comment theme, hub split) and the current AI insights on each question (drivers of NPS, advisor attitude, follow-up, detractor pain points). Quotes are real comments, shown without names.</p>
    <p><b>Sample:</b> colleague names and share notes, the “Where it happened” breakdowns by hub and customer type (except the hub split on the NPS overview, which is real), and activity on insights. Weekly updates are dated to match the data, which runs to the week of 28 Apr.</p>`;
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
