/* ═══ wizard (guided objectives setup) ═══ */
const wizSteps = [
  {
    q:"What's your role at Redtag?",
    type:'radio',
    options:['Store Manager','Area Manager','Central Team'],
    sel:0
  },
  {
    q:'Which store(s) do you want insights for?',
    type:'checkbox',
    options:['RT DEIRA CITY CENTER','RT ATYAF MALL','RT SHUWAIKH','RT NAJDA','RT BISHA','RT RIYADH GALLERY','RT ANDALUS - NEW','RT SERAFI MEGA MALL','RT TAMIMI','RT PARK AVENUE','RT DALMA'],
    sel:[1]
  },
  {
    q:'Select objectives that are relevant to you',
    type:'checkbox',
    options:['Satisfaction & service quality','Promotions & pricing clarity','Store operations & consistency'],
    sel:[0,1]
  }
];
let wizIdx=0;

function openWizard(){
  wizIdx=0;
  document.getElementById('wizard').classList.remove('hidden');
  document.body.style.overflow='hidden';
  renderWiz();
}
function closeWizard(){
  document.getElementById('wizard').classList.add('hidden');
  document.body.style.overflow = document.getElementById('drawer').classList.contains('open') ? 'hidden' : '';
}
function renderWiz(){
  const step = wizSteps[wizIdx];
  const isLast = wizIdx===wizSteps.length-1;
  let optsHTML='';
  step.options.forEach((o,i)=>{
    const isSel = step.type==='radio' ? step.sel===i : step.sel.includes(i);
    optsHTML += `<div class="flex items-center gap-3 py-3 border-b border-line2 last:border-0 cursor-pointer" onclick="wizPick(${i})">
      <span class="${step.type==='radio'?'radio':'chk'} ${isSel?'sel':''}">${step.type==='checkbox'&&isSel?'<svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>':''}</span>
      <span class="text-[14.5px] ${step.type==='radio' && !isSel ? 'text-txt-1' : 'font-500 text-txt-1'}">${o}</span>
    </div>`;
  });
  document.getElementById('wiz-card').innerHTML = `
    <p class="text-[16px] font-600 text-txt-1 mb-3">${step.q}</p>
    <div class="max-h-[320px] overflow-y-auto pr-1">${optsHTML}</div>
    <div class="flex items-center gap-2 py-3 text-txt-4 cursor-pointer">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 4v16m8-8H4"/></svg>
      <span class="text-[13.5px]">Something else…</span>
    </div>
    <div class="flex items-center justify-between mt-2 pt-3 border-t border-line2">
      <span class="text-[12.5px] text-txt-3">Question ${wizIdx+1} of ${wizSteps.length}</span>
      <div class="flex items-center gap-2">
        <button class="iconbtn ${wizIdx===0?'opacity-30 pointer-events-none':''}" onclick="wizNav(-1)"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>
        ${isLast
          ? `<button class="btn-pri" onclick="wizFinish()">Finish</button>`
          : `<button class="iconbtn" style="background:#eef4ff;color:#1967d2" onclick="wizNav(1)"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>`
        }
      </div>
    </div>
  `;
}
function wizPick(i){
  const step = wizSteps[wizIdx];
  if(step.type==='radio'){ step.sel=i; }
  else {
    const pos = step.sel.indexOf(i);
    if(pos>-1) step.sel.splice(pos,1); else step.sel.push(i);
  }
  renderWiz();
}
function wizNav(dir){
  wizIdx = Math.max(0, Math.min(wizSteps.length-1, wizIdx+dir));
  renderWiz();
}
function wizFinish(){
  const role = wizSteps[0].options[wizSteps[0].sel];
  const stores = wizSteps[1].sel.map(i=>wizSteps[1].options[i]);
  const objs = wizSteps[2].sel.map(i=>wizSteps[2].options[i]);
  const storeText = stores.length===0 ? 'no stores selected'
    : stores.length===1 ? stores[0]
    : stores.length<=2 ? stores.join(' & ')
    : stores[0] + ' + ' + (stores.length-1) + ' more stores';
  const desc = 'Insights on ' + storeText + (objs.length ? ' — ' + objs.join(', ').toLowerCase() : '');
  document.getElementById('obj-title').textContent = role;
  document.getElementById('obj-desc').textContent = desc;
  const dt = document.getElementById('drawer-obj-title'); if(dt) dt.textContent = role;
  const dd = document.getElementById('drawer-obj-desc'); if(dd) dd.textContent = desc;
  const wt = document.getElementById('w-obj-title'); if(wt) wt.textContent = role;
  const wd = document.getElementById('w-obj-desc'); if(wd) wd.textContent = desc;

  const wasEmptyState = !document.getElementById('journey-not-setup').classList.contains('hidden');
  closeWizard();
  if(wasEmptyState){
    setJourney('waiting');
    toast('Objectives saved — monitoring started');
  } else {
    toast('Objectives updated');
  }
}

// feed is ordered by priority, so the first card is always the one most worth a manager's time
function sortFeedByPriority(){
  const grid = document.getElementById('card-grid');
  const rank = {high:0, med:1, pos:2, low:3};
  [...grid.querySelectorAll('.insight-card')]
    .sort((a,b)=> (rank[a.dataset.priority]??3) - (rank[b.dataset.priority]??3))
    .forEach(c=>grid.appendChild(c));
}
// run last: depends on cfgState, which is declared further down this script
