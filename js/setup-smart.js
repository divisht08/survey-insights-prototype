/* ═══ SETUP SMART — the Generic AI setup changes its questions to fit what the customer says, instead of picking from a fixed list. Prefix djn. ═══
   When the customer's own words describe a job that is not on the list, the AI reads the words, checks what the survey can and cannot
   support, and builds a new job. It also replaces the questions that follow: what to rank by, what changes to flag, what to ask for context.
   Questions that make no sense for the job (such as targets on a score) are dropped. The AI is simulated: a small concept lexicon stands
   in for the model. Globals: djnInterpret, djnCopy, djnReset, djnExtra (called from js/setup.js), djnLast and djnExamples (read by js/setup-notes.js). */
(function(){
var EXAMPLES=['I want to manage the purchasing for my store on the basis of what is being bought and liked the most.','I need to decide when to put more people on, based on when customers wait the longest.','I set our prices and offers and want to know if customers understand them.'];
var STD=['Which numbers should lead your feed?','Do you have a target for any of these?','Which changes do you want to hear about first?','Tell me anything else you want to track, or anything I should focus on.'];
var FAM=[
 {id:'dynbuy',
  obj:/purchas|\bbuy(ing|er)?\b|bought|\bstock|assortment|\brange\b|merchandis|inventory|procure/,
  sig:[['liked',/\blik(e|ed|es)\b|love|prefer|popular|praise|favou?rite|best/,'what customers like'],['bought',/bought|\bsell|\bsold|selling|demand|buying/,'what is bought']],
  d:{name:'What to buy more of for my store',sub:'The products and fits customers like most',short:'What to buy more of',title:'Buying and range',pins:['liked','disliked','asked'],find:'dynbuy',persona:'You decide what to buy and stock, so I will show what customers like and dislike about products.',kw:['purchas','stock','range']},
  pins:[
   {id:'liked',name:'What customers like most',sub:'The product theme promoters mention most',disp:'Fit and sizing',small:true,delta:'Up from second place',kw:['liked','like most','praise']},
   {id:'disliked',name:'What customers complain about most',sub:'The product theme linked to the lowest scores',disp:'Product quality',small:true,delta:'Steady against the previous period',kw:['complain','dislike']},
   {id:'asked',name:'What customers ask for that you do not stock',sub:'Requests in comments for products or sizes',disp:'Petite sizes',small:true,delta:'Mentioned 23 times',kw:['ask','request','stock']},
   {id:'returns',name:'Why products come back',sub:'The reason given most often in return comments',disp:'Runs small',small:true,delta:'41% of return comments',kw:['return','back']}],
  flags:[
   {id:'dynliked',name:'A product theme customers like more than before',short:'Liked more',key:'dynbuy',kw:['liked','popular','like']},
   {id:'anomaly',name:'A sudden spike in complaints about a product',short:'Product complaint spikes',key:'dynspike',kw:['spike','sudden','complaint']},
   {id:'dynask',name:'Something customers keep asking for that you do not stock',short:'Unmet requests',key:'dynask',kw:['ask','request','stock']},
   {id:'dynfit',name:'A size or fit problem in a product group',short:'Size and fit problems',key:'dynfit',kw:['size','fit']},
   {id:'dynret',name:'Returns rising for a product group',short:'Returns rising',key:'dynret',kw:['return']}],
  card:{title:'Fit and sizing is what customers like most about products, and it is rising',body:'Mentioned in 38% of happy comments, up 6 points, with product quality next. Based on 1,240 responses.',voice:'“The jeans fit exactly right, I ordered two more.”',act:'Lean your next buy towards the fits customers praise. This survey does not record what was bought, so check it against your sales numbers before you commit.'},
  copy:{
   2:{q:'What should I rank your products by?',why:'Your survey does not record what was bought, so I rank products by what customers say in their comments. Every signal is still tracked.',seen:'I found product themes in 1,240 comments: fit and sizing, product quality and returns. I can rank them by how much customers like them.'},
   5:{q:'Which product changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.'},
   6:{q:'Which product groups do you buy for?',why:'Tap the groups you buy for, or write anything else, such as a range you launched or a supplier you switched. I use it to tie product comments to the right range. Optional. You can type or speak.'}},
  groups:['Womenswear','Menswear','Kids','Footwear','Accessories'],groupsLabel:'Product groups I found in comments',
  ctx:'For example: the autumn range launched on 1 Oct, and we switched denim supplier in September',
  reply:'That is not on my list, so I made a new option from your words: “What to buy more of for my store”. I will use what customers say about products in comments. Your survey does not record what was bought, so I will say that where it matters. The questions that follow now fit this job.',
  read:'Job: decide what to buy and stock for the store. Success: buying more of what customers like.',
  checks:[[1,'What customers like','Product themes appear in 1,240 comments: fit and sizing, product quality, returns.'],[0,'What was bought','This survey is sent after a contact, so it holds no purchase data. It needs sales data.']],
  qs:[['same','Standard question 1','What do you want this feed to help you do?','Your own words, as asked'],['changed','Standard question 2',STD[0],'What should I rank your products by? Four signals from comments, no scores'],['dropped','Standard question 3',STD[1],'Dropped. Product themes are topics, so there is nothing to set a target on'],['changed','Standard question 4',STD[2],'Product changes: liked more, complaint spikes, unmet requests, fit problems, returns'],['changed','Standard question 5',STD[3],'Which product groups do you buy for? Tappable groups first']],
  adapt:{2:'A different question. It asks what to rank products by, and offers four signals from comments. Scores such as CSAT are not offered, because the job is about products, not contact quality. Purchase counts are not offered, because the survey does not hold them.',3:'This question is dropped. It asks for a target on a score, and none of the signals here is a score.',5:'A different list of changes: a product theme customers like more than before, complaint spikes, unmet requests, size and fit problems, and returns rising. The standard list is not shown.',6:'A different question. It asks which product groups you buy for, with the groups found in comments as tappable choices. The example changes too.',7:'The new job is shown in your own words, with Edit beside it. Below is the first insight this job would lead with.'}},
 {id:'dynstaff',
  obj:/\brota|roster|schedul|\bshifts?\b|staffing|headcount|put more people|more people on|\bcover\b/,
  sig:[['peak',/busy|peak|longest|wait|queue|evening|weekend|time of day/,'when help is hardest to get']],
  d:{name:'When to put more people on',sub:'The times customers wait longest',short:'When to add people',title:'Staffing and cover',pins:['peak','waitshare','lowday'],find:'dynstaff',persona:'You decide when to put more people on, so I will show when customers wait longer and score lower.',kw:['rota','roster','shift']},
  pins:[
   {id:'peak',name:'Hardest time to get help',sub:'The time of day with the lowest scores',disp:'After 6 pm',small:true,delta:'Waits mentioned twice as often',kw:['hardest','peak','evening']},
   {id:'waitshare',name:'Comments that mention waiting',sub:'Share of comments about waiting to reach someone',disp:'19%',delta:'Up 5 points',kw:['wait']},
   {id:'lowday',name:'Day with the lowest scores',sub:'The weekday where customers are least satisfied',disp:'Saturday',small:true,delta:'9 points below the average day',kw:['day','weekend']}],
  flags:[
   {id:'dynpeak',name:'A time of day where customers score lower',short:'Timing gaps',key:'dynstaff',kw:['time','evening','peak']},
   {id:'anomaly',name:'A sudden jump in waiting complaints',short:'Waiting spikes',key:'dynspike',kw:['spike','sudden','wait']},
   {id:'dynwk',name:'Weekend scores falling against weekdays',short:'Weekend gap',key:'dynwk',kw:['weekend']},
   {id:'dynshift',name:'Scores changing after a change in cover',short:'After a cover change',key:'dynshift',kw:['change','cover','shift']}],
  card:{title:'Customers who contact after 6 pm wait longer and score 9 points lower',body:'Comments from evening contacts mention waiting to reach someone twice as often. Based on 212 evening contacts.',voice:'“I waited 25 minutes after work and gave up.”',act:'Compare evening cover with contact volume, and test one extra person for two weeks. This survey does not hold your rota, so add it to see the full picture.'},
  copy:{
   2:{q:'What should I use to show when help is hardest to get?',why:'I use the time of each contact and what customers say about waiting. Every signal is still tracked.',seen:'I found a time of day for every response and waiting mentioned in comments. I can compare daytime and evening.'},
   5:{q:'Which timing changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.'},
   6:{q:'When are your usual shifts?',why:'Tap the shifts you run, or write anything else that changes cover, such as a sale or a planned absence. I use it to explain why waits change. Optional. You can type or speak.'}},
  groups:['Weekday days','Evenings','Weekends','Public holidays'],groupsLabel:'Times I can compare',
  ctx:'For example: weekend cover drops to two people, and the sale starts on 1 Nov',
  reply:'That is not on my list, so I made a new option from your words: “When to put more people on”. I will compare times of day and what customers say about waiting. Your survey does not hold your rota, so I will say that where it matters. The questions that follow now fit this job.',
  read:'Job: decide when to put more people on. Success: shorter waits when customers need help most.',
  checks:[[1,'When help is hardest to get','Every response has a contact time, and waiting is mentioned in comments.'],[0,'Who was working','The survey does not hold your rota. It needs staffing data.']],
  qs:[['same','Standard question 1','What do you want this feed to help you do?','Your own words, as asked'],['changed','Standard question 2',STD[0],'What should I use to show when help is hardest to get? Time of day, waiting comments, weekday'],['dropped','Standard question 3',STD[1],'Dropped. These signals are not scores, so there is nothing to set a target on'],['changed','Standard question 4',STD[2],'Timing changes: time-of-day gaps, waiting spikes, weekend gap, after a cover change'],['changed','Standard question 5',STD[3],'When are your usual shifts? Tappable shifts first']],
  adapt:{2:'A different question. It asks what to use to show when help is hardest to get, and offers the time of day, waiting in comments and the weekday. Scores such as CSAT are not offered.',3:'This question is dropped. None of the signals here is a score, so there is nothing to set a target on.',5:'A different list of changes: a time of day where customers score lower, waiting spikes, a weekend gap, and scores after a change in cover.',6:'A different question. It asks when your usual shifts are, with times as tappable choices. The example changes too.',7:'The new job is shown in your own words, with Edit beside it. Below is the first insight this job would lead with.'}},
 {id:'dynprice',
  obj:/\bpric(e|es|ing)\b|\boffers?\b|promo|discount|markdown|voucher|coupon|\bsales?\b/,
  sig:[['clear',/understand|clear|confus|unclear|know/,'whether customers understand it']],
  d:{name:'Whether prices and offers are landing',sub:'What customers say about prices and offers',short:'Prices and offers',title:'Pricing and offers',pins:['offertalk','unclear','feel'],find:'dynprice',persona:'You set prices and offers, so I will show what customers say about them and whether satisfaction moves with them.',kw:['price','offer','promo']},
  pins:[
   {id:'offertalk',name:'Customers who mention prices or offers',sub:'Share of comments that talk about prices or offers',disp:'14%',delta:'Up 4 points',kw:['offer','price','promo']},
   {id:'unclear',name:'The offer customers find most unclear',sub:'The offer with the most confused comments',disp:'Free delivery',small:true,delta:'Mentioned 31 times',kw:['unclear','confus']},
   {id:'feel',name:'How customers feel about prices',sub:'Share of price comments that are negative',disp:'62% negative',small:true,delta:'Up 7 points',kw:['feel','sentiment','negative']}],
  flags:[
   {id:'dynoffer',name:'Customers confused by an offer or price',short:'Offer confusion',key:'dynprice',kw:['offer','price','confus']},
   {id:'anomaly',name:'A sudden jump in price complaints',short:'Price complaint spikes',key:'dynspike',kw:['spike','sudden','complaint']},
   {id:'dynchg',name:'Scores moving after a price or offer change',short:'After a price change',key:'dynchg',kw:['change','after']},
   {id:'dynrival',name:'Customers comparing your prices with others',short:'Price comparisons',key:'dynrival',kw:['compare','cheaper','competitor']}],
  card:{title:'Questions about offer terms are rising, and customers who ask score 11 points lower',body:'Offers and prices appear in 14% of comments, up 4 points. Most are about what the offer covers. Based on 1,240 responses.',voice:'“The email said free delivery but I was charged at checkout.”',act:'State the terms where the offer is shown and in the order email. This survey does not record sales, so check any lift against your sales numbers.'},
  copy:{
   2:{q:'What should I use to show whether offers and prices are landing?',why:'I use what customers say about prices and offers. Every signal is still tracked.',seen:'I found prices and offers mentioned in 14% of comments. I can compare satisfaction for customers who mention them.'},
   5:{q:'Which price and offer changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.'},
   6:{q:'Which offers or price changes are running?',why:'Tap what is running, or write the details and dates. I use them to compare before and after. Optional. You can type or speak.'}},
  groups:['A running sale','A voucher','A delivery offer','A price change'],groupsLabel:'What I can compare',
  ctx:'For example: free delivery over 50 ran from 1 to 15 Oct, and prices rose on 20 Oct',
  reply:'That is not on my list, so I made a new option from your words: “Whether prices and offers are landing”. I will use what customers say about prices and offers. Your survey does not record sales, so I will say that where it matters. The questions that follow now fit this job.',
  read:'Job: decide whether prices and offers work. Success: customers understand them and are not annoyed.',
  checks:[[1,'Whether customers understand it','Prices and offers appear in 14% of comments, with the lowest scores where terms are unclear.'],[0,'Whether it sold more','This survey does not record sales. It needs sales data.']],
  qs:[['same','Standard question 1','What do you want this feed to help you do?','Your own words, as asked'],['changed','Standard question 2',STD[0],'What should I use to show whether offers and prices are landing? Mentions, unclear offers, how customers feel'],['dropped','Standard question 3',STD[1],'Dropped. These signals are not scores, so there is nothing to set a target on'],['changed','Standard question 4',STD[2],'Price and offer changes: confusion, complaint spikes, after a price change, comparisons'],['changed','Standard question 5',STD[3],'Which offers or price changes are running? Tappable choices first']],
  adapt:{2:'A different question. It asks what to use to show whether offers land, and offers the share of price comments, the most unclear offer and how customers feel. Scores such as CSAT are not offered.',3:'This question is dropped. None of the signals here is a score, so there is nothing to set a target on.',5:'A different list of changes: offer confusion, price complaint spikes, scores after a price change, and comparisons with others.',6:'A different question. It asks which offers or price changes are running, with the common ones as tappable choices. The example changes too.',7:'The new job is shown in your own words, with Edit beside it. Below is the first insight this job would lead with.'}}
];
var origPins=null,origFlags=null,origCtx=null,added=[],chosen={};
window.djnExamples=EXAMPLES;
window.djnLast=null;
function strip(P){
 P.decisions=P.decisions.filter(function(d){return !d.dyn;});
 if(origPins){P.pins=origPins;P.flags=origFlags;origPins=origFlags=null;}
 added.forEach(function(k){delete P.find[k];});added=[];
 if(origCtx!==null){P.ctxPh=origCtx;origCtx=null;}
 chosen={};window.djnLast=null;
}
function cp(o,x){var r={},k;for(k in o)r[k]=o[k];for(k in (x||{}))r[k]=x[k];return r;}
window.djnReset=function(P){strip(P);};
window.djnInterpret=function(text,P){
 if(!P||P.key!=='generic')return null;
 var t=text.toLowerCase(),f=null,k;
 for(k=0;k<FAM.length;k++){if(FAM[k].obj.test(t)){f=FAM[k];break;}}
 if(!f)return null;
 strip(P);
 P.decisions.push(cp(f.d,{id:f.id,dyn:true,copy:f.copy}));
 origPins=P.pins;origFlags=P.flags;
 /* the job's own signals and changes lead; the standard ones stay in the pack but hidden, so a standard job picked alongside still works */
 P.pins=f.pins.map(function(p){return cp(p,{dyn:true});}).concat(origPins.map(function(p){return cp(p,{hide:true,dyn:true});}));
 P.flags=f.flags.map(function(x){return cp(x,{dyn:true});}).concat(origFlags.filter(function(x){return !f.flags.some(function(y){return y.id===x.id;});}).map(function(x){return cp(x,{hide:true,dyn:true});}));
 P.find[f.d.find]=f.card;added.push(f.d.find);
 origCtx=P.ctxPh;P.ctxPh=f.ctx;
 var found=f.sig.filter(function(s){return s[1].test(t);}).map(function(s){return s[2];});
 window.djnLast={card:f.card,id:f.id,said:text.trim(),read:f.read,signals:found,checks:f.checks,qs:f.qs,adapt:f.adapt};
 return {id:f.id,reply:f.reply};
};
function fam(S){var o=null;if(!window.djnLast||!S||!S.decisions)return null;S.decisions.forEach(function(id){if(id===window.djnLast.id)o=FAM.filter(function(x){return x.id===id;})[0]||o;});return o;}
window.djnCopy=function(i,c,S){
 window.djnCur=i;
 var f=fam(S);if(!f||!f.copy[i])return c;
 return cp(c,f.copy[i]);
};
window.djnExtra=function(i,S){
 var f=fam(S);if(i!==6||!f)return '';
 return '<div class="djn-groups" role="group" aria-label="'+f.groupsLabel+'"><span class="eyebrow dj-lbl2" style="margin-top:0">'+f.groupsLabel+'</span><div class="djn-gr">'+f.groups.map(function(g){var on=!!chosen[g];return '<button type="button" class="btn-sec djn-chip'+(on?' on':'')+'" data-djn-chip="'+g+'" aria-pressed="'+(on?'true':'false')+'">'+g+'</button>';}).join('')+'</div></div>';
};
document.addEventListener('click',function(e){
 var b=e.target.closest&&e.target.closest('[data-djn-chip]');if(!b)return;
 var g=b.getAttribute('data-djn-chip'),ta=document.getElementById('dj-ctx');if(!ta)return;
 var on=!chosen[g];chosen[g]=on;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');
 var cur=ta.value.split(/,\s*/).filter(function(x){return x&&x!==g;});if(on)cur.push(g);
 ta.value=cur.join(', ');ta.dispatchEvent(new Event('input',{bubbles:true}));
});
})();
