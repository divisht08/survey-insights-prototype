const LAYOUT_SAMPLES = ['INS-05','INS-01','INS-02'];      // a spike with a chart, a score with a change, a theme with no number
const LAYOUT_OPTIONS = [
  {id:'a', name:'Finding first', what:'The finding reads on the left; the key figure sits in its own column on the right.',
   lands:'The headline', best:'People read the sentence first. Figures line up down the feed, so numbers are easy to compare across cards.',
   cost:'The figure is secondary. The right column looks empty when an insight has no number.'},
  {id:'b', name:'Figure first', what:'The key figure sits in a tile on the left; the finding and next step sit beside it.',
   lands:'The number', best:'People scan by numbers, like a KPI dashboard. Suits leaders skimming many stores.',
   cost:'A theme with no reliable count shows a word in the tile, which feels weaker than a number.'},
  {id:'c', name:'Top to bottom', what:'One column: the finding, then a figure strip, then the next step as a highlighted callout.',
   lands:'The headline, then the next step', best:'Narrow screens, email and mobile. The next step is the most prominent of the three.',
   cost:'Taller cards, so fewer insights fit on one screen.'}
];
let cardLayout = 'a', loFilter = 'all', loContent = 'typical';
// Stress test: made-up insights, deliberately longer and more complicated than the card rules allow
const STRESS_SAMPLES = [
  {from:'INS-05', prio:'high', keepChart:true, plan:{status:'In progress', owner:'You'},
   kind:'Anomaly · Checkout, payments &amp; loyalty-app redemption',
   title:'Payment-failure and loyalty-point redemption complaints spiked together across three consecutive weekends at the ground-floor tills',
   summary:'64 respondents over 6 weekend days described card, wallet or loyalty-point payments failing at the till, against ~4 a week normally; most of them also gave a low score for checkout speed, and several mentioned leaving without completing the purchase.',
   action:'check with IT whether the card terminals, the payment gateway or the loyalty-app integration had an outage on those days, and ask the Area Manager whether neighbouring stores saw the same pattern.',
   stat:'<p class="ic-num" style="color:#c5221f">64</p><p class="ic-unit">mentions across six weekend days</p><p class="ic-unit">usual: ~4 a week</p>',
   tags:'<span class="fresh-tag stale">3 editions · no action</span>',
   basis:'New this period — not seen in the previous 89 days · 1,284 responses in the period · In 3 editions in a row'},
  {from:'INS-04', prio:'med',
   kind:'Key driver · Fitting rooms &amp; store cleanliness',
   title:'Fitting-room availability and cleanliness together are most associated with low satisfaction among weekend shoppers',
   summary:'Of 7 service factors, fitting-room availability has the strongest association with overall satisfaction, followed closely by store cleanliness; both are also among the 3 lowest-scoring factors this period, and the association is stronger for weekend visits than for weekday visits.',
   action:'add a fitting-room reset and a queue check to each shift checklist at peak hours; raise the staffing question with the Area Manager if weekend cover is fixed centrally.',
   stat:'<p class="ic-num">38%</p><p class="ic-unit">of satisfaction variation</p><div class="ic-bars"><div class="top"><span>Fitting-room availability</span><i style="width:48px"></i></div><div><span>Store cleanliness</span><i style="width:44px"></i></div><div><span>Staff helpfulness</span><i style="width:30px"></i></div><div><span>Checkout speed</span><i style="width:24px"></i></div><div><span>Price clarity</span><i style="width:15px"></i></div></div>',
   tags:'',
   basis:'Rolling 90 days · 01 Jul – 28 Sep 2026 · 1,284 responses · In 6 editions in a row'},
  {from:'INS-01', prio:'med',
   kind:'Period comparison · Likelihood to recommend',
   title:'Likelihood to recommend fell among first-time shoppers while it held steady for returning shoppers',
   summary:'The recommend score for first-time shoppers is lower than in the previous period, while returning shoppers are unchanged; the first-time group is small, so the change should be read as a signal to check, not as a confirmed decline.',
   action:'review how first-time shoppers are greeted and guided to the fitting rooms and tills; share what you find with the Central team before the next edition.',
   stat:'<p class="ic-num">41.0</p><p class="ic-unit">recommend score, first-time shoppers</p><p class="ic-delta down">▼ −12.4<small>vs 53.4</small></p>',
   tags:'<span class="fresh-tag new">New</span>',
   basis:'Last 8 weeks vs the 8 weeks before · 03 Aug – 27 Sep vs 08 Jun – 02 Aug 2026 · 96 vs 118 first-time responses'}
];
function stressCard(sp){
  const holder = document.createElement('div'); holder.innerHTML = sampleCard(sp.from);
  const c = holder.firstElementChild; if(!c) return '';
  c.dataset.priority = sp.prio; c.dataset.stress = '1';
  const set = (sel, html)=>{ const e = c.querySelector(sel); if(e) e.innerHTML = html; };
  const pl = c.querySelector('[data-prio-label]'); if(pl){ pl.className = 'prio '+sp.prio; pl.innerHTML = '<i></i>'+PRIO_LABEL[sp.prio]; }
  set('[data-el="kind-text"]', sp.kind); set('[data-el="title"]', sp.title); set('[data-el="summary"]', sp.summary);
  set('[data-el="action"]', '<span class="font-600">Recommended action:</span> ' + sp.action);
  set('[data-el="basis"]', sp.basis);
  const st = c.querySelector('[data-el="stat"]');
  if(st){ const chart = st.querySelector('div[style*="height:26px"]'); st.innerHTML = sp.stat + (sp.keepChart && chart ? chart.outerHTML : ''); }
  const row = c.querySelector('[data-el="kind-row"]');
  if(row){ row.querySelectorAll('.illus,.fresh-tag').forEach(e=>e.remove()); row.insertAdjacentHTML('beforeend', '<span class="illus" title="Made-up content for the stress test">Illustrative</span>' + (sp.tags||'')); }
  const chip = c.querySelector('[data-el="tags"] .plan-chip');
  if(chip){ if(sp.plan){ chip.style.display = ''; chip.className = 'plan-chip'; chip.innerHTML = planChipInner(sp.plan); } else { chip.style.display = 'none'; chip.innerHTML = ''; } }
  c.querySelectorAll('[data-plan-btn]').forEach(b=>b.classList.toggle('has-plan', !!sp.plan));
  return c.outerHTML;
}
// what the stress test shows for each option (written from the rendered result)
const STRESS_FINDINGS = {
  a:'The headline wraps to two lines and is never cut. The supporting sentence is cut off after three lines, and the next step runs long. Long chart labels are shortened and the figure label wraps.',
  b:'Text behaves as in A. The tile is the tightest space: most chart labels are shortened, and the tile stretches tall beside long text.',
  c:'Copes best with long text: the next step takes fewer lines and chart labels show in full. It is also the tallest of the three.'
};
function sampleCard(id){
  const src = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]'); if(!src) return '';
  const c = src.cloneNode(true);
  c.className = 'sample-card ic spr-card';
  ['data-id','data-state','style','onclick'].forEach(a=>c.removeAttribute(a));
  const fol = c.querySelector('button[onclick*="follow(this)"]'); if(fol){ fol.classList.remove('on'); fol.innerHTML = FOLLOW_OFF_HTML; }
  c.querySelectorAll('.act-closed').forEach(e=>e.remove());
  c.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));
  c.querySelectorAll('[onclick]').forEach(e=>e.removeAttribute('onclick'));
  c.querySelectorAll('.fb-btn.on').forEach(e=>e.classList.remove('on'));
  c.querySelectorAll('button').forEach(b=>{ b.tabIndex = -1; });
  return c.outerHTML;
}
function cardLayoutsHTML(){
  const seg = [['all','All three'],['a','A'],['b','B'],['c','C']].map(([v,l])=>`<button class="${loFilter===v?'on':''}" data-lo-filter="${v}" onclick="loFilter='${v}';renderCardLayouts()">${l}</button>`).join('');
  const rows = LAYOUT_OPTIONS.map(o=>`<tr><td>${o.id.toUpperCase()} · ${o.name}</td><td>${o.lands}</td><td>${o.best}</td><td>${o.cost}</td></tr>`).join('');
  const sections = LAYOUT_OPTIONS.filter(o=>loFilter==='all' || loFilter===o.id).map(o=>`
    <section class="lo-opt" data-lo-opt="${o.id}">
      <div class="lo-side">
        <span class="lo-letter">${o.id.toUpperCase()}</span>
        <h2>${o.name}</h2>
        <p>${o.what}</p>
        <dl><dt>Works best when</dt><dd>${o.best}</dd><dt>Trade-off</dt><dd>${o.cost}</dd>${loContent==='stress' && STRESS_FINDINGS[o.id] ? `<dt>Under stress</dt><dd data-lo-stress="${o.id}">${STRESS_FINDINGS[o.id]}</dd>` : ''}</dl>
        <p class="lo-height" data-lo-height="${o.id}"></p>
        ${cardLayout===o.id
          ? `<span class="tag acc" data-lo-current>Showing in the feed now</span>`
          : `<button class="btn-sec" data-lo-apply="${o.id}" onclick="applyCardLayout('${o.id}', true)">See it in the feed →</button>`}
      </div>
      <div class="lo-cards lay-${o.id}">${loContent==='stress' ? STRESS_SAMPLES.map(stressCard).join('') : LAYOUT_SAMPLES.map(sampleCard).join('')}</div>
    </section>`).join('');
  return `<div class="hm-proto"><b>Prototype · Card layout options</b>
      <span class="lo-seg">${seg}</span>
      <button style="margin-left:auto" data-lo-close onclick="closeCardLayouts()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap">
      <h1>Card layout options</h1>
      <p class="lo-lede">Three ways to arrange the same insight card. Every option shows the same three insights with the same content: priority, type and topic, headline, supporting sentence, next step, key figure, basis and actions. Only the arrangement changes.</p>
      <table class="lo-table"><thead><tr><th>Option</th><th>The eye lands on</th><th>Works best when</th><th>Trade-off</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="lo-bar"><b>Sample content</b>
        <span class="lo-pick"><button class="${loContent==='typical'?'on':''}" data-lo-content="typical" onclick="loContent='typical';renderCardLayouts()">Typical insights</button><button class="${loContent==='stress'?'on':''}" data-lo-content="stress" onclick="loContent='stress';renderCardLayouts()">Stress test · long, complicated insights</button></span></div>
      ${loContent==='stress' ? `<div class="lo-note" data-lo-stress-note><b>Stress test.</b> These three insights are made up to push the layouts. Each has a headline of about 15 to 20 words, a supporting sentence of about 40 to 45 words, a two-part next step, long labels and a long basis line: more than the card rules allow. Look at what wraps, what gets cut off and how much taller each layout becomes.</div>` : ''}
      ${sections}
    </div></div>`;
}
function renderCardLayouts(){
  const layer = document.getElementById('layout-layer');
  const sc = layer.querySelector('.lo-scroll'), top = sc ? sc.scrollTop : 0;
  layer.innerHTML = cardLayoutsHTML();
  const sc2 = layer.querySelector('.lo-scroll'); if(sc2) sc2.scrollTop = top;
  measureLayoutHeights();
}
// card height of each option compared with option A, measured from what is on the page
function measureLayoutHeights(){
  const avg = id=>{ const cs = [...document.querySelectorAll('[data-lo-opt="'+id+'"] .sample-card')]; return cs.length ? cs.reduce((t,c)=>t+c.getBoundingClientRect().height,0)/cs.length : 0; };
  const base = avg('a');
  ['a','b','c'].forEach(id=>{
    const el = document.querySelector('[data-lo-height="'+id+'"]'); if(!el) return;
    const h = avg(id);
    if(!h || !base || loFilter!=='all'){ el.textContent = ''; return; }
    const pct = Math.round((h/base-1)*100);
    el.textContent = id==='a' ? 'Card height: the baseline' : ('Card height: ' + (Math.abs(pct)<3 ? 'about the same as A' : (pct>0 ? pct+'% taller than A' : Math.abs(pct)+'% shorter than A')));
  });
}
function openCardLayouts(){
  loFilter = 'all';
  document.getElementById('layout-layer').classList.add('show');
  renderCardLayouts();
  document.body.style.overflow = 'hidden';
}
function closeCardLayouts(){
  document.getElementById('layout-layer').classList.remove('show');
  document.body.style.overflow = '';
}
// show one of the layouts in the real feed, Followed and past editions
function applyCardLayout(l, goToFeed){
  cardLayout = l;
  ['view-insights','view-followed','view-shared'].forEach(id=>{ const el = document.getElementById(id); if(el){ el.classList.remove('lay-a','lay-b','lay-c'); el.classList.add('lay-'+l); } });
  const btn = document.getElementById('open-card-layouts');
  if(btn) btn.textContent = '▦ Card layout options' + (l==='a' ? '' : ' · ' + l.toUpperCase() + ' in feed');
  if(goToFeed){ closeCardLayouts(); setJourney('returning'); window.scrollTo(0,0); }
}
