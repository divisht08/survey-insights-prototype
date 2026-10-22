/* ═══ SETUP NOTES — "For discussion" panel on the Generic AI setup. Prefix djn. ═══
   Sits above each step of the Generic conversational flow (js/setup-brief.js) and shows what the AI assumes before it asks,
   what the question is for, and how the same question changes by customer. When the customer describes a goal that is not on
   the standard list, it also shows how the AI read it and which questions it changed. Read-only; it never changes the flow.
   Globals: djnInit (called from main.js), djbAfter (called by setup-brief.js after each paint). */
(function(){
var NOTES={
 start:{t:'Before it asks anything',
  assume:['The survey type and its questions: sent after a contact with the contact center, with CSAT, NPS, effort, first-contact resolution and one comment.','Your access: all brands and regions, set by your administrator. It only shows what you can see.','How much data there is: about 310 responses a week, and a previous period to compare with.','What customers write about: delivery, returns and refunds, order status, sizing, payments, product quality, agent behaviour.'],
  aim:'Ask as little as possible. Because the AI has read the survey, the customer is only asked what they want from the feed, not to configure it.',
  by:[['Redtag store manager','One mall, about 16 responses a week, two satisfaction ratings and five service factors.'],['Generic contact center','All brands, about 310 responses a week, four score questions.'],['Another survey','The AI reads that survey’s questions, industry and volume instead, and everything below is rebuilt from them.']]},
 say:{t:'What are you responsible for here, and what do you want to know?',
  assume:['The customer acts on feedback and does not want to build a report.','The customer can say anything. The AI maps the words to a job, and where the job is not one it knows, it builds new questions around it.','A short sentence is enough. The AI asks only about what is still missing.'],
  aim:'Learn the job in the customer’s own words. Everything after this follows from it: the numbers that lead, the alerts and the wording of the feed. It is the one question that is not a list.',
  by:[['Redtag store manager','What to fix in my store, who to recognise, whether a change worked.'],['Generic contact center','Which agents to coach, which processes to change, which brands need attention.'],['Someone who buys for a store','Which products to buy more of. Nothing on a standard list matches, so the AI changes the questions after this one.']]},
 decide:{t:'What should this feed help you decide?',
  assume:['The AI has already taken a first read of the decisions from the sentence, so they arrive ticked. The customer confirms or changes them, and does not start from a blank list.','The options come from the survey, the industry and the role. They are not a fixed list. For a store buyer they are about buying, for a contact-center lead they are about coaching and processes.','Anything typed that is not on the list is added as a new decision.'],
  aim:'Confirm the job before configuring anything. Every later choice, the numbers that lead, the alerts and the wording of the feed, follows from what the customer says they decide.',
  by:[['Redtag store manager','What to fix each week, who to recognise, what to raise with head office.'],['Generic contact center','Which agents or teams to coach, which processes to change, which brands need attention.'],['Someone who buys for a store','What to buy more of, what to stop buying, what to start stocking. The numbers and alerts that follow are about products.']]},
 metrics:{t:'Which numbers should lead your feed?',
  assume:['Only numbers that exist as questions in this survey are offered: CSAT, NPS, effort, first-contact resolution and response count.','All numbers are still tracked. This only decides what comes first.','Suggestions come from the job. Coaching suggests CSAT, effort and first-contact resolution.','An aim is optional. The allowed range follows the question: 0 to 100 for percentages, minus 100 to 100 for NPS, 1 to 7 for effort.'],
  aim:'Decide what sits at the top of every update, and turn a number into a verdict when the customer gives an aim.',
  by:[['Redtag store manager','Overall satisfaction, service satisfaction, staff helpfulness, all out of 10.'],['Generic contact center','CSAT, NPS, effort out of 7, first-contact resolution.'],['Another survey','An NPS-only survey would offer only NPS and response count. The AI never offers a number the survey cannot produce.']]},
 freq:{t:'How often should I update you?',
  assume:['Frequency is recommended from response volume. About 310 a week is plenty for weekly.','Daily would split findings into groups too small to trust.','The same schedule is used for the email.'],
  aim:'Set the rhythm of the feed. It is the last plain choice and is set by how much data arrives, so the customer is not guessing.',
  by:[['Redtag store manager','About 16 a week. Weekly is recommended, because daily would mostly have nothing new.'],['Generic contact center','About 310 a week. Weekly is recommended, and daily is possible but thin per group.'],['Another survey','The recommendation is recalculated from that survey’s own response volume.']]},
 alerts:{t:'Which alerts should tell you straight away?',
  assume:['Only checks the data can support are offered. No comments means no spike or new-topic alerts.','Thresholds start from the aims given and from how much the survey normally moves.','Everything else still appears in the feed. Alerts only decide what interrupts.'],
  aim:'Separate what can wait for the next update from what needs to interrupt. It also sets how loud each alert is, in the app and by email.',
  by:[['Redtag store manager','Small groups, so low response volume is offered first.'],['Generic contact center','About 310 a week, so volume is not first. Score drops and complaint spikes lead.'],['Someone who buys for a store','Score thresholds are dropped. Product alerts replace them: liked more, complaint spikes, unmet requests.']]},
 preview:{t:'Your feed is ready to build',
  assume:['The sample feed is built only from the survey’s own responses, never from examples.','The first update is not generated until the customer confirms.','The setup is saved and can be reopened. Tuning a card changes how similar cards appear later.'],
  aim:'Let the customer see what they will get, and tune it, before anything is built. A sample is more honest than a description.',
  by:[['Redtag store manager','Cards about the store, with the numbers that lead.'],['Generic contact center','Cards about delivery, refunds and the chat team.'],['Someone who buys for a store','Cards about products: quality complaints, what customers like, what they ask for.']]}
};
var ADAPT={
 dynbuy:{metrics:'The standard number list was replaced. The survey records no purchase data, so products are ranked by what customers say, and no aims are asked for.',alerts:'Score thresholds were dropped and product alerts were offered instead.',preview:'Sample cards are about products. Two of them say that the survey does not record what was bought.'},
 dynstaff:{metrics:'The standard number list was replaced with timing signals from the time of each contact and what customers say about waiting.',alerts:'Score thresholds were dropped and timing alerts were offered instead.',preview:'Sample cards are about timing and waiting. They say that the survey does not hold your rota.'},
 dynprice:{metrics:'The standard number list was replaced with what customers say about prices and offers.',alerts:'Score thresholds were dropped and offer and price alerts were offered instead.',preview:'Sample cards are about prices and offers. They say that the survey does not record sales.'}
};
var on=true,btn=null,top=null;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function isGeneric(){var b=document.querySelector('#dj-setup [data-djv="generic"]');return !!b&&b.getAttribute('aria-pressed')==='true';}
function smartHTML(step){
 var L=window.djbLast,h='';
 if(step==='say'){
  var ex=(window.djbPacks&&window.djbPacks.generic&&window.djbPacks.generic.examples)||[];
  h+='<div class="djn-try"><span class="djn-h">Try a goal that is not on the standard list</span>'+ex.map(function(x,k){return '<button type="button" class="btn-sec djn-ex" data-djn-ex="'+k+'">'+esc(x)+'</button>';}).join('')+'</div>';
  return h;
 }
 if(!L)return '';
 if(step==='decide'){
  h+='<div class="djn-smart"><p class="djn-h">How the AI read what you said</p><div class="djn-by">';
  h+='<div class="djn-row"><b>You said</b><span>“'+esc(L.said)+'”</span></div>';
  h+='<div class="djn-row"><b>It understood</b><span>'+esc(L.read)+'</span></div>';
  h+='<div class="djn-row"><b>Checked against your survey</b><span>'+L.checks.map(function(c){return '<span class="djn-chk'+(c[0]?' ok':' no')+'"><i>'+(c[0]?'Can use':'Not in survey')+'</i> <u>'+esc(c[1])+'.</u> '+esc(c[2])+'</span>';}).join('')+'</span></div>';
  h+='<div class="djn-row"><b>Questions it asks for this goal</b><span>'+L.qs.map(function(q){return '<span class="djn-q2 '+q[0]+'"><i>'+(q[0]==='same'?'Same':'Changed')+'</i> <u>'+esc(q[1])+'</u> '+esc(q[2])+'</span>';}).join('')+'</span></div>';
  h+='<div class="djn-row"><b>A fixed list would have said</b><span>“I could not match that to an option.”</span></div>';
  h+='</div></div>';
  return h;
 }
 var a=ADAPT[L.id]&&ADAPT[L.id][step];
 return a?'<div class="djn-smart"><p class="djn-h">Adapted because of what you said</p><p class="djn-aim">'+esc(a)+'</p></div>':'';
}
function cardHTML(n,step){
 var h='<div class="djn-card" data-djn-step="'+esc(step)+'" role="note" aria-label="For discussion: how the AI decides this step">';
 h+='<p class="djn-eye"><span class="djn-tag">For discussion</span>How the AI decides this step</p>';
 h+=smartHTML(step)+'<div class="djn-cols"><div class="djn-col"><p class="djn-h">What the AI assumes</p><ul>'+n.assume.map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ul></div>';
 h+='<div class="djn-col"><p class="djn-h">What this question is for</p><p class="djn-aim">'+esc(n.aim)+'</p></div></div>';
 h+='<p class="djn-h djn-h2">How it changes by customer</p><div class="djn-by">'+n.by.map(function(b){return '<div class="djn-row"><b>'+esc(b[0])+'</b><span>'+esc(b[1])+'</span></div>';}).join('')+'</div></div>';
 return h;
}
function syncBtn(){if(!btn)return;btn.hidden=!isGeneric();btn.setAttribute('aria-pressed',on?'true':'false');btn.textContent=on?'Hide AI assumptions':'Show AI assumptions';}
/* start and say are short, so the notes go above; the chat steps and the preview are long, so the notes go below them */
function place(root,card,step){if(step==='start'||step==='say')root.insertBefore(card,root.firstChild);else root.appendChild(card);}
window.djbAfter=function(root,pack,step){
 var old=root.querySelector('.djn-card');if(old)old.remove();
 syncBtn();
 if(pack!=='generic'||!on||!NOTES[step])return;
 var d=document.createElement('div');d.innerHTML=cardHTML(NOTES[step],step);
 place(root,d.firstChild,step);
};
window.djnInit=function(){
 top=document.querySelector('#dj-setup .dj-top');if(!top||btn)return;
 btn=document.createElement('button');btn.type='button';btn.className='btn-sec djn-toggle';btn.hidden=true;
 btn.addEventListener('click',function(){
  on=!on;syncBtn();var root=document.getElementById('dj-root'),old=root&&root.querySelector('.djn-card');
  if(old)old.remove();
  if(on&&root&&root.getAttribute('data-djb-pack')==='generic'){var st=root.getAttribute('data-djb-step');if(NOTES[st]){var d=document.createElement('div');d.innerHTML=cardHTML(NOTES[st],st);place(root,d.firstChild,st);}}
 });
 document.getElementById('dj-root').addEventListener('click',function(e){var b=e.target.closest('[data-djn-ex]');if(!b)return;var ta=document.getElementById('djb-ta');if(!ta)return;var ex=window.djbPacks.generic.examples;ta.value=ex[+b.getAttribute('data-djn-ex')]||'';ta.dispatchEvent(new Event('input',{bubbles:true}));ta.focus();});
 top.appendChild(btn);syncBtn();
};
/* the toggle must follow the switcher (Current / Redtag / Generic) */
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-djv]'))setTimeout(syncBtn,0);});
})();
