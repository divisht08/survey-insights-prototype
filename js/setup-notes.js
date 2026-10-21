/* ═══ SETUP NOTES — "For discussion" panel on the Generic AI setup screens. Prefix djn. ═══
   Shows, under each question, what the AI assumes before it asks, what the question is for, and how
   the same question changes for another customer. Read-only; it never changes the setup flow.
   Global exposed: djnInit (called from main.js). Reads the DOM that js/setup.js paints. */
(function(){
var NOTES={
 0:{t:'Before it asks anything',
  assume:['The survey type and its questions: sent after a contact with the contact center, with CSAT, NPS, effort, first-contact resolution and one comment.','Your access: all brands and regions, set by your administrator. It only shows what you can see.','How much data there is: 1,240 responses in the last four weeks (about 310 a week) and 1,180 in the four weeks before, so two periods can be compared.','What customers write about: delivery, returns and refunds, order status, sizing, payments, product quality, agent behaviour.','Something it already noticed: refund-delay mentions tripled in two weeks.'],
  aim:'Ask as little as possible. Because it has read the survey, the customer is only asked what they want from the feed, not to configure it. Setup is detailed here because the login covers every brand and region.',
  by:[['Redtag store manager','One mall, about 16 responses a week, two satisfaction ratings and five service factors. Same detailed setup, but it plans around small groups.'],['Generic contact center','All brands, about 310 responses a week, four score questions.'],['Another survey','The AI reads that survey’s questions, industry and volume instead, and everything below is rebuilt from them.']]},
 1:{t:'What do you want this feed to help you do?',
  assume:['The customer is a contact-center or CX lead who acts on feedback, not someone who wants to build a report.','The list of jobs is built from the survey’s questions, the industry and the responses so far. In this mock-up it is hand-written.','Up to three jobs. Free text, voice or a pick from the list all land on the same list.'],
  aim:'Learn the job. This is the one question everything else hangs off: the numbers that lead, the changes that are flagged and the wording of the feed all follow from it, so the customer states a goal in their own words and the AI does the configuring.',
  by:[['Redtag store manager','What to fix in my store, who to recognise, what to raise beyond the store, whether a change worked.'],['Generic contact center','Which agents to coach, which processes to change, which problems to fix outside the contact center, which brands or channels need attention, whether a change worked.'],['Another survey','A different list, generated from its own questions. A bank branch might get complaints to resolve and products to review.']]},
 2:{t:'Which numbers should lead your feed?',
  assume:['Only numbers that exist as questions in this survey are offered: CSAT, NPS, effort, first-contact resolution, top reason for low scores and response count.','All numbers are still tracked. This only decides what comes first in each update.','Suggestions come from the jobs picked. Coaching suggests CSAT, effort and first-contact resolution.'],
  aim:'Decide what sits at the top of every update. It turns the job into a short list of numbers the customer will see first, and it can be skipped, in which case the AI chooses from the job.',
  by:[['Redtag store manager','Overall satisfaction, service satisfaction, staff helpfulness, the top issue, all out of 10.'],['Generic contact center','CSAT, NPS, effort out of 7, first-contact resolution.'],['Another survey','An NPS-only survey would offer only NPS and response count. The AI never offers a number the survey cannot produce.']]},
 3:{t:'Do you have a target for any of these?',
  assume:['The platform has no goals setting today, so nothing is filled in for the customer.','Only numbers with a scale can take a target. The allowed range follows the question: 0 to 100 for percentages, minus 100 to 100 for NPS, 1 to 7 for effort.','The current value comes from the responses, so the feed can say how far above or below the target it is.'],
  aim:'Turn a number into a verdict. Without a target the feed shows a figure. With one it can say whether the customer is on track, and alerts can later use the same target.',
  by:[['Redtag store manager','Targets on a 0 to 10 scale, for example 9.5.'],['Generic contact center','Targets as a percentage or NPS points, for example 85 on CSAT and 40 on NPS.'],['Another survey','The scale and the example both follow that survey’s own question.']]},
 5:{t:'Which changes do you want to hear about first?',
  assume:['The same fixed checks run on every survey: change against the last period, sudden spikes, complaints that keep coming back, new topics, group gaps and low response volume.','A check is only offered if the data exists. No comments means no spike, recurring or new-topic checks. One period means no comparison.','Suggestions come from the jobs picked, and from anything the AI noticed, such as refund delays.'],
  aim:'Decide what reaches the top. The AI still checks for everything, so this orders the feed rather than filtering it. The customer says what they most want to be told about.',
  by:[['Redtag store manager','About 16 responses a week, so low response volume is suggested first. It changes how far every other result can be trusted.'],['Generic contact center','About 310 a week, so volume is not suggested first. Delivery spikes and recurring refund complaints lead instead.'],['Another survey','A survey with no open comment would not be offered spikes, recurring complaints or new topics.']]},
 6:{t:'Anything else to track or focus on',
  assume:['The numbers cannot know about a launch, a policy change, a supplier switch or an outage.','It has already noticed one thing worth watching and offers it as a suggestion.','What the customer writes is saved with the feed, turned into topics to watch and notes on the dates it affects, and can be edited later.'],
  aim:'Capture what the data cannot hold, so the AI can explain a change instead of only reporting it. This is the only question that is fully in the customer’s own words, and it is optional.',
  by:[['Redtag store manager','For example: we changed the fitting-room rota in September.'],['Generic contact center','For example: watch refund delays, we switched delivery carrier in September, and there was a system outage 20 to 22 Oct.'],['Another survey','Whatever that business changed or launched. The AI does not assume it.']]},
 7:{t:'Check what I understood',
  assume:['Every earlier answer becomes one saved setup. It is the same list of choices used to build every update, and the customer can reopen it later.','The update frequency is recommended from response volume. About 310 a week is plenty for weekly. Daily would split findings into groups too small to trust.'],
  aim:'Let the customer confirm the AI understood before anything is built. Each row shows what they said and how it was understood, with Edit beside it. The frequency is the last choice, set by how much data arrives.',
  by:[['Redtag store manager','About 16 a week. Weekly is recommended. Daily would mostly have nothing new, and one answer could swing the average.'],['Generic contact center','About 310 a week. Weekly is recommended, and daily is possible but thin per group.'],['Another survey','The recommendation is recalculated from that survey’s own response volume.']]}
};
var KEYS=[['Your feed is not set up yet',0],['What do you want this feed to help you do',1],['Which numbers should lead',2],['Do you have a target',3],['Which changes do you want to hear about',5],['Tell me anything else',6],['Check what I understood',7]];
var on=true,btn=null,mo=null,top=null;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function isGeneric(){var b=document.querySelector('#dj-setup [data-djv="generic"]');return !!b&&b.getAttribute('aria-pressed')==='true';}
function stepOf(){var q=document.getElementById('dj-q');if(!q)return null;if(window.djnCur!==undefined&&NOTES[window.djnCur]&&!q.closest('.dj-empty-card'))return window.djnCur;var t=q.textContent;for(var k=0;k<KEYS.length;k++){if(t.indexOf(KEYS[k][0])===0)return KEYS[k][1];}return null;}
function lastId(){return window.djnLast?window.djnLast.id:'';}
function smartHTML(step){
 var L=window.djnLast,h='';
 if(step===1){
  if(L){
   h+='<div class="djn-smart"><p class="djn-h">How the AI read what you said</p><div class="djn-by">';
   h+='<div class="djn-row"><b>You said</b><span>\u201c'+esc(L.said)+'\u201d</span></div>';
   h+='<div class="djn-row"><b>It understood</b><span>'+esc(L.read)+'</span></div>';
   h+='<div class="djn-row"><b>Checked against your survey</b><span>'+L.checks.map(function(c){return '<span class="djn-chk'+(c[0]?' ok':' no')+'"><i>'+(c[0]?'Can use':'Not in survey')+'</i> <u>'+esc(c[1])+'.</u> '+esc(c[2])+'</span>';}).join('')+'</span></div>';
   h+='<div class="djn-row"><b>Questions it asks for this goal</b><span>'+L.qs.map(function(q){return '<span class="djn-q2 '+q[0]+'"><i>'+(q[0]==='same'?'Same':q[0]==='changed'?'Changed':'Dropped')+'</i> <u>'+esc(q[1])+'.</u> '+(q[0]==='same'?esc(q[3]):q[0]==='dropped'?'<s>'+esc(q[2])+'</s> '+esc(q[3]):'<s>'+esc(q[2])+'</s> '+esc(q[3]))+'</span>';}).join('')+'</span></div>';
   h+='<div class="djn-row"><b>A fixed list would have said</b><span>\u201cI could not match that to an option.\u201d</span></div>';
   h+='</div></div>';
  }
  h+='<div class="djn-try"><span class="djn-h">Try a different goal</span>'+(window.djnExamples||[]).map(function(x,k){return '<button type="button" class="btn-sec djn-ex" data-djn-ex="'+k+'">'+esc(x)+'</button>';}).join('')+'</div>';
 }else if(L&&L.adapt&&L.adapt[step]){
  h+='<div class="djn-smart"><p class="djn-h">Adapted because of what you said</p><p class="djn-aim">'+esc(L.adapt[step])+'</p>';
  if(step===7&&L.card){var c=L.card;h+='<div class="djn-ins"><span class="djn-tag">Sample insight it would lead with</span><p class="djn-it">'+esc(c.title)+'</p><p>'+esc(c.body)+'</p>'+(c.voice?'<p class="djn-q">'+esc(c.voice)+'</p>':'')+'<p><b>Suggested next step:</b> '+esc(c.act)+'</p></div>';}
  h+='</div>';
 }
 return h;
}
function cardHTML(n,step){
 var h='<div class="djn-card" data-djn-step="'+esc(n.t)+'" data-djn-v="'+esc(lastId())+'" role="note" aria-label="For discussion: how the AI decides this step">';
 h+='<p class="djn-eye"><span class="djn-tag">For discussion</span>How the AI decides this step</p>';
 h+=smartHTML(step)+'<div class="djn-cols"><div class="djn-col"><p class="djn-h">What the AI assumes</p><ul>'+n.assume.map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ul></div>';
 h+='<div class="djn-col"><p class="djn-h">What this question is for</p><p class="djn-aim">'+esc(n.aim)+'</p></div></div>';
 h+='<p class="djn-h djn-h2">How it changes by customer</p><div class="djn-by">'+n.by.map(function(b){return '<div class="djn-row"><b>'+esc(b[0])+'</b><span>'+esc(b[1])+'</span></div>';}).join('')+'</div></div>';
 return h;
}
function place(card){
 var root=document.getElementById('dj-root');if(!root)return;
 var body=root.querySelector('.dj-body'),empty=root.querySelector('.dj-empty-card');
 if(body){var after=body.querySelector('.dj-seen')||body.querySelector('.dj-src')||body.querySelector('.dj-why')||body.querySelector('#dj-q');if(after)after.insertAdjacentElement('afterend',card);else body.appendChild(card);}
 else if(empty)empty.insertAdjacentElement('afterend',card);
}
function sync(){
 if(mo)mo.disconnect();
 var gen=isGeneric(),root=document.getElementById('dj-root');
 if(btn){btn.hidden=!gen;btn.setAttribute('aria-pressed',on?'true':'false');btn.textContent=on?'Hide AI assumptions':'Show AI assumptions';}
 var old=root?root.querySelector('.djn-card'):null,s=gen&&on?stepOf():null;
 if(old&&(s===null||NOTES[s].t!==old.getAttribute('data-djn-step')||lastId()!==old.getAttribute('data-djn-v'))){old.remove();old=null;}
 if(s!==null&&!old){var d=document.createElement('div');d.innerHTML=cardHTML(NOTES[s],s);place(d.firstChild);}
 watch();
}
function watch(){var t=document.getElementById('dj-setup');if(mo&&t)mo.observe(t,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-pressed']});}
window.djnInit=function(){
 top=document.querySelector('#dj-setup .dj-top');if(!top||btn)return;
 btn=document.createElement('button');btn.type='button';btn.className='btn-sec djn-toggle';btn.hidden=true;
 btn.addEventListener('click',function(){on=!on;sync();});
 document.getElementById('dj-root').addEventListener('click',function(e){var b=e.target.closest('[data-djn-ex]');if(!b)return;var ta=document.getElementById('dj-say');if(!ta)return;ta.value=(window.djnExamples||[])[+b.getAttribute('data-djn-ex')]||'';ta.dispatchEvent(new Event('input',{bubbles:true}));ta.focus();});
 top.appendChild(btn);
 mo=new MutationObserver(function(m){for(var k=0;k<m.length;k++){var t=m[k].target;if(t.closest&&t.closest('.djn-card'))continue;if(m[k].type==='childList'&&[].every.call(m[k].addedNodes,function(n){return n.classList&&n.classList.contains('djn-card');})&&[].every.call(m[k].removedNodes,function(n){return n.classList&&n.classList.contains('djn-card');}))continue;sync();return;}});
 sync();
};
})();
