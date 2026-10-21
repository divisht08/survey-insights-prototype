/* ═══ SETUP SMART — shows that the Generic AI setup adapts to what the customer says, instead of picking from a fixed list. Prefix djn. ═══
   When the customer's own words describe a job that is not on the list, the AI reads the words, checks what the survey can and cannot
   support, and builds a new job plus the numbers, changes and wording around it. The AI is simulated: a small concept lexicon stands in
   for the model. Globals: djnInterpret, djnCopy, djnReset (called from js/setup.js), djnLast and djnExamples (read by js/setup-notes.js). */
(function(){
var EXAMPLES=['I want to manage the purchasing for my store on the basis of what is being bought and liked the most.','I need to decide when to put more people on, based on when customers wait the longest.','I set our prices and offers and want to know if customers understand them.'];
var FAM=[
 {id:'dynbuy',
  obj:/purchas|\bbuy(ing|er)?\b|bought|\bstock|assortment|\brange\b|merchandis|inventory|procure/,
  sig:[['liked',/\blik(e|ed|es)\b|love|prefer|popular|praise|favou?rite|best/,'what customers like'],['bought',/bought|\bsell|\bsold|selling|demand|buying/,'what is bought']],
  d:{name:'What to buy more of for my store',sub:'The products and fits customers like most',short:'What to buy more of',title:'Buying and range',pins:['liked','disliked','csat'],find:'dynbuy',persona:'You decide what to buy and stock, so I will show what customers like and dislike about products.',kw:['purchas','stock','range']},
  pins:[{id:'liked',name:'What customers like most',sub:'The product theme promoters mention most in comments',disp:'Fit and sizing',small:true,delta:'Up from second place',kw:['liked','like most','praise']},{id:'disliked',name:'What customers complain about most',sub:'The product theme linked to the lowest scores',disp:'Product quality',small:true,delta:'Steady against the previous period',kw:['complain','dislike']}],
  flag:{id:'dynliked',name:'A product theme customers like more than before',short:'Liked more',key:'dynbuy',kw:['liked','popular','product']},
  card:{title:'Fit and sizing is what customers like most about products, and it is rising',body:'Mentioned in 38% of happy comments, up 6 points, with product quality next. Based on 1,240 responses.',voice:'“The jeans fit exactly right, I ordered two more.”',act:'Lean your next buy towards the fits customers praise. This survey does not record what was bought, so check it against your sales numbers before you commit.'},
  copy:{
   2:{q:'Which numbers should show you what customers like most?',why:'Your survey does not record what was bought, so I use what customers say about products in their comments. Every other number is still tracked.',seen:'I found product themes in 1,240 comments: fit and sizing, product quality and returns. I can rank them by how much customers like them.'},
   5:{q:'Which product changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.'},
   6:{q:'Which product groups do you buy for, or anything else I should focus on?',why:'For example a range you launched, a supplier you switched or a season you are planning. I use it to tie product comments to the right range. Optional. You can type or speak.'}},
  ctx:'For example: I buy womenswear and kids, and the autumn range launched on 1 Oct',
  reply:'That is not on my list, so I made a new option from your words: “What to buy more of for my store”. I will use what customers say about products in comments. Your survey does not record what was bought, so I will say that where it matters. I changed the next questions to fit.',
  read:'Job: decide what to buy and stock for the store. Success: buying more of what customers like.',
  checks:[[1,'What customers like','Product themes appear in 1,240 comments: fit and sizing, product quality, returns.'],[0,'What was bought','This survey is sent after a contact, so it holds no purchase data. It needs sales data.']],
  built:'A new job, two new numbers (most-liked and most-complained product theme), one new change to flag, and reworded questions 2, 5 and 6.',
  adapt:{2:'Reworded to ask which numbers show what customers like. Two new numbers are offered, both from comments. Purchase counts are not offered, because the survey does not hold them.',3:'Only CSAT can take a target here. The product themes are topics, not scores, so there is nothing to set a target on.',5:'Reworded for products. A new change is suggested first: a product theme customers like more than before.',6:'Reworded to ask which product groups you buy for, so the AI ties comments to the right range. The example changes too.',7:'The new job is shown in your own words, with Edit beside it like every other row. Below is the first insight this job would lead with.'}},
 {id:'dynstaff',
  obj:/\brota|roster|schedul|\bshifts?\b|staffing|headcount|put more people|more people on|\bcover\b/,
  sig:[['peak',/busy|peak|longest|wait|queue|evening|weekend|time of day/,'when help is hardest to get']],
  d:{name:'When to put more people on',sub:'The times customers wait longest',short:'When to add people',title:'Staffing and cover',pins:['peak','ces','csat'],find:'dynstaff',persona:'You decide when to put more people on, so I will show when customers wait longer and score lower.',kw:['rota','roster','shift']},
  pins:[{id:'peak',name:'Hardest time to get help',sub:'The time of day with the lowest scores',disp:'After 6 pm',small:true,delta:'Waits mentioned twice as often',kw:['hardest','peak','evening']}],
  flag:{id:'dynpeak',name:'A time of day where customers score lower',short:'Timing gaps',key:'dynstaff',kw:['time','evening','peak']},
  card:{title:'Customers who contact after 6 pm wait longer and score 9 points lower',body:'Comments from evening contacts mention waiting to reach someone twice as often. Based on 212 evening contacts.',voice:'“I waited 25 minutes after work and gave up.”',act:'Compare evening cover with contact volume, and test one extra person for two weeks. This survey does not hold your rota, so add it to see the full picture.'},
  copy:{
   2:{q:'Which numbers should show you when help is hardest to get?',why:'I use the time of each contact, effort scores and what customers say about waiting. Every other number is still tracked.',seen:'I found a time of day for every response and waiting mentioned in comments. I can compare daytime and evening.'},
   5:{q:'Which timing changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.'},
   6:{q:'What are your usual shifts, or anything that changes cover?',why:'For example weekend cover, a sale or a planned absence. I use it to explain why waits change. Optional. You can type or speak.'}},
  ctx:'For example: weekend cover drops to two people, and the sale starts on 1 Nov',
  reply:'That is not on my list, so I made a new option from your words: “When to put more people on”. I will compare times of day and what customers say about waiting. Your survey does not hold your rota, so I will say that where it matters. I changed the next questions to fit.',
  read:'Job: decide when to put more people on. Success: shorter waits when customers need help most.',
  checks:[[1,'When help is hardest to get','Every response has a contact time, and waiting is mentioned in comments.'],[0,'Who was working','The survey does not hold your rota. It needs staffing data.']],
  built:'A new job, one new number (hardest time to get help), one new change to flag, and reworded questions 2, 5 and 6.',
  adapt:{2:'Reworded to ask which numbers show when help is hardest to get. A new number is offered: the time of day with the lowest scores.',3:'Only CSAT and effort can take a target here. The time of day is a topic, not a score.',5:'Reworded for timing. A new change is suggested first: a time of day where customers score lower.',6:'Reworded to ask about shifts and anything that changes cover. The example changes too.',7:'The new job is shown in your own words, with Edit beside it. Below is the first insight this job would lead with.'}},
 {id:'dynprice',
  obj:/\bpric(e|es|ing)\b|\boffers?\b|promo|discount|markdown|voucher|coupon|\bsales?\b/,
  sig:[['clear',/understand|clear|confus|unclear|know/,'whether customers understand it']],
  d:{name:'Whether prices and offers are landing',sub:'What customers say about prices and offers',short:'Prices and offers',title:'Pricing and offers',pins:['offertalk','reason','csat'],find:'dynprice',persona:'You set prices and offers, so I will show what customers say about them and whether satisfaction moves with them.',kw:['price','offer','promo']},
  pins:[{id:'offertalk',name:'Customers who mention prices or offers',sub:'Share of comments that talk about prices or offers',disp:'14%',delta:'Up 4 points',kw:['offer','price','promo']}],
  flag:{id:'dynoffer',name:'Customers confused by an offer or price',short:'Offer confusion',key:'dynprice',kw:['offer','price','confus']},
  card:{title:'Questions about offer terms are rising, and customers who ask score 11 points lower',body:'Offers and prices appear in 14% of comments, up 4 points. Most are about what the offer covers. Based on 1,240 responses.',voice:'“The email said free delivery but I was charged at checkout.”',act:'State the terms where the offer is shown and in the order email. This survey does not record sales, so check any lift against your sales numbers.'},
  copy:{
   2:{q:'Which numbers should show you whether offers and prices are landing?',why:'I use what customers say about prices and offers, and how satisfied they are. Every other number is still tracked.',seen:'I found prices and offers mentioned in 14% of comments. I can compare satisfaction for customers who mention them.'},
   5:{q:'Which price and offer changes do you want to hear about first?',why:'I check for all of these. Your picks go to the top of the feed. Optional.'},
   6:{q:'Which offers or price changes are running?',why:'For example a sale, a voucher or a price change. I use the dates to compare before and after. Optional. You can type or speak.'}},
  ctx:'For example: free delivery over 50 ran from 1 to 15 Oct, and prices rose on 20 Oct',
  reply:'That is not on my list, so I made a new option from your words: “Whether prices and offers are landing”. I will use what customers say about prices and offers. Your survey does not record sales, so I will say that where it matters. I changed the next questions to fit.',
  read:'Job: decide whether prices and offers work. Success: customers understand them and are not annoyed.',
  checks:[[1,'Whether customers understand it','Prices and offers appear in 14% of comments, with the lowest scores where terms are unclear.'],[0,'Whether it sold more','This survey does not record sales. It needs sales data.']],
  built:'A new job, one new number (customers who mention prices or offers), one new change to flag, and reworded questions 2, 5 and 6.',
  adapt:{2:'Reworded to ask which numbers show whether offers land. A new number is offered: the share of comments about prices or offers.',3:'Only CSAT and NPS can take a target here. The share of comments is not a score.',5:'Reworded for prices and offers. A new change is suggested first: customers confused by an offer or price.',6:'Reworded to ask which offers are running, so the AI compares before and after. The example changes too.',7:'The new job is shown in your own words, with Edit beside it. Below is the first insight this job would lead with.'}}
];
var orig=null,added=[];
window.djnExamples=EXAMPLES;
window.djnLast=null;
function strip(P){
 P.decisions=P.decisions.filter(function(d){return !d.dyn;});
 P.pins=P.pins.filter(function(p){return !p.dyn;});
 P.flags=P.flags.filter(function(f){return !f.dyn;});
 added.forEach(function(k){delete P.find[k];});added=[];
 if(orig!==null){P.ctxPh=orig;orig=null;}
 window.djnLast=null;
}
window.djnReset=function(P){strip(P);};
window.djnInterpret=function(text,P){
 if(!P||P.key!=='generic')return null;
 var t=text.toLowerCase(),f=null,k;
 for(k=0;k<FAM.length;k++){if(FAM[k].obj.test(t)){f=FAM[k];break;}}
 if(!f)return null;
 strip(P);
 var d={id:f.id,dyn:true,copy:f.copy};for(k in f.d)d[k]=f.d[k];
 P.decisions.push(d);
 f.pins.forEach(function(p){var o={dyn:true};for(var q in p)o[q]=p[q];P.pins.push(o);});
 var fl={dyn:true};for(k in f.flag)fl[k]=f.flag[k];P.flags.push(fl);
 P.find[f.d.find]=f.card;added.push(f.d.find);
 orig=P.ctxPh;P.ctxPh=f.ctx;
 var found=f.sig.filter(function(s){return s[1].test(t);}).map(function(s){return s[2];});
 window.djnLast={card:f.card,id:f.id,said:text.trim(),read:f.read,signals:found,checks:f.checks,built:f.built,adapt:f.adapt};
 return {id:f.id,reply:f.reply};
};
window.djnCopy=function(i,c,S){
 window.djnCur=i;
 if(!window.djnLast||!S||!S.decisions)return c;
 var o=null;
 S.decisions.forEach(function(id){if(id===window.djnLast.id){var f=FAM.filter(function(x){return x.id===id;})[0];if(f)o=f.copy[i];}});
 if(!o)return c;
 var r={};for(var k in c)r[k]=c[k];for(k in o)r[k]=o[k];
 return r;
};
})();
