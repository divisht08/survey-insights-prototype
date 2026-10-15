/* ═══ NAVIGATION OPTIONS — where Survey Insights lives and how Feed, Followed and Shared are reached.
   A review page opened from the prototype bar; not a product screen. ═══ */
const NAV_OPTIONS = [
  {id:'a', name:'Tabs on the page',
   where:'One Survey Insights page in the CFM left rail, with Feed, Followed and Shared as tabs at the top.',
   best:'Most people use only the feed. Everything stays on one page.',
   cost:'Followed and Shared are easy to miss, and a count on a tab only says how many there are, not what needs you.',
   counts:'Followed and Shared show a number only when it is above zero.'},
  {id:'b', name:'Left navigation', now:true,
   where:'Survey Insights opens a second-level menu in the left rail: Feed, Followed and Shared, each with its own count.',
   best:'People who follow and share regularly. Each list is one click away from anywhere in CFM.',
   cost:'Adds a menu level to the CFM rail, which other modules would need to fit.',
   counts:'Each count says what needs you: Feed, insights needing attention you haven\'t opened; Followed, insights that changed; Shared, new shares.'},
  {id:'c', name:'Insights home',
   where:'The CFM home page opens with a Survey Insights summary: what needs you this edition, what changed in Followed, what is new in Shared, and the top insights.',
   best:'Store managers who visit occasionally, often from email. The home page answers "what needs me today?" before they open anything.',
   cost:'The CFM home page is shared with other modules, so this needs agreement with their owners. It is the most work to build.',
   counts:'Counts become sentences on the summary, e.g. "2 need your attention".'}
];
let navPick = 'all';
function navMockHTML(id){
  const rail = (extra)=>`<div class="nv-rail"><i></i><i></i><i class="on"></i><i></i>${extra||''}</div>`;
  const card = (c, w)=>`<div class="nv-card" style="border-left-color:${c}"><span style="width:${w}%"></span><span style="width:${w-25}%"></span></div>`;
  const cards = card('#c5221f',70)+card('#c5221f',62)+card('#d9900f',66)+card('#0e8a5f',58);
  const top = '<div class="nv-top"><b>Sprinklr</b><span></span></div>';
  if(id==='a') return `<div class="nv-mock">${top}<div class="nv-body">${rail()}
      <div class="nv-main"><div class="nv-h"><b>Survey Insights</b><span class="nv-scope">RT ATYAF MALL</span><span class="nv-tabs"><em class="on">Feed</em><em>Followed <u>6</u></em><em>Shared <u class="r">1</u></em></span></div>
        <div class="nv-ed">Latest edition · Sun 27 Sep</div>${cards}</div></div></div>`;
  if(id==='b') return `<div class="nv-mock">${top}<div class="nv-body">${rail()}
      <div class="nv-sub"><p>Survey Insights</p><a class="on">Feed <u class="r">2</u></a><a>Followed <u>3 updated</u></a><a>Shared <u class="r">1 new</u></a><hr><a class="dim">Configure</a><a class="dim">Email</a></div>
      <div class="nv-main"><div class="nv-h"><b>Feed</b><span class="nv-scope">RT ATYAF MALL</span></div><div class="nv-ed">Latest edition · Sun 27 Sep</div>${cards}</div></div></div>`;
  return `<div class="nv-mock">${top}<div class="nv-body">${rail()}
      <div class="nv-main"><div class="nv-h"><b>Good morning, Sara</b><span class="nv-scope">RT ATYAF MALL</span></div>
        <div class="nv-tiles"><div><small>This edition · Sun 27 Sep</small><b>2 need your attention</b><em>Open feed →</em></div><div><small>Followed</small><b>3 changed</b><em>See what changed →</em></div><div><small>Shared with you</small><b>1 new</b><em>Open →</em></div></div>
        <p class="nv-sh">Top insights this edition</p>${card('#c5221f',72)}${card('#c5221f',60)}
        <div class="nv-other"><span>Survey responses</span><span>Response rate</span><span>Other CFM widgets</span></div></div></div></div>`;
}
function navOptionsHTML(){
  const seg = [['all','All three'],['a','A'],['b','B'],['c','C']].map(([v,l])=>`<button class="${navPick===v?'on':''}" data-nav-pick="${v}" onclick="navPick='${v}';renderNavOptions()">${l}</button>`).join('');
  const rows = NAV_OPTIONS.map(o=>`<tr><td>${o.id.toUpperCase()} · ${o.name}${o.now?' <span class="tag acc">In the prototype</span>':''}</td><td>${o.best}</td><td>${o.cost}</td></tr>`).join('');
  const secs = NAV_OPTIONS.filter(o=>navPick==='all'||navPick===o.id).map(o=>`
    <section class="lo-opt" data-nav-opt="${o.id}">
      <div class="lo-side"><span class="lo-letter">${o.id.toUpperCase()}</span><h2>${o.name}</h2><p>${o.where}</p>
        <dl><dt>Works best when</dt><dd>${o.best}</dd><dt>Trade-off</dt><dd>${o.cost}</dd><dt>Counts</dt><dd>${o.counts}</dd></dl></div>
      <div>${navMockHTML(o.id)}</div>
    </section>`).join('');
  return `<div class="hm-proto"><b>Prototype · Navigation options</b><span class="lo-seg">${seg}</span>
      <button style="margin-left:auto" data-nav-close onclick="closeNavOptions()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap">
      <h1>Navigation options</h1>
      <p class="lo-lede">Three ways to place Survey Insights in CFM and reach Feed, Followed and Shared. The sketches show the same data as Day 50 in the prototype. In every option a count only appears when it is above zero, and it says what needs the user, not just how many items there are.</p>
      <table class="lo-table"><thead><tr><th>Option</th><th>Works best when</th><th>Trade-off</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="lo-note"><b>Chosen: B, left navigation.</b> It is what the prototype now uses. Followed and Shared are always visible, and each count says what needs attention. A and C stay here for comparison; C remains a candidate for a later release because it depends on the CFM home page.</div>
      ${secs}
    </div></div>`;
}
function renderNavOptions(){ const l = document.getElementById('nav-layer'); l.innerHTML = navOptionsHTML(); }
function openNavOptions(){ navPick = 'all'; const l = document.getElementById('nav-layer'); l.classList.add('show'); document.body.style.overflow = 'hidden'; renderNavOptions(); const sc = l.querySelector('.lo-scroll'); if(sc) sc.scrollTop = 0; }
function closeNavOptions(){ document.getElementById('nav-layer').classList.remove('show'); document.body.style.overflow = ''; }
