/* ═══ segmented tab nav ═══ */
function segNav(v){
  ['insights','report','resp','followed','shared'].forEach(x=>{
    const view = document.getElementById('view-'+x);
    const seg = document.getElementById('seg-'+x);
    if(view) view.classList.add('hidden');
    if(seg) seg.classList.remove('active');
  });
  document.getElementById('view-'+v).classList.remove('hidden');
  document.getElementById('view-'+v).classList.add('fade');
  const activeSeg = document.getElementById('seg-'+v);
  if(activeSeg) activeSeg.classList.add('active');
  ['followed','shared'].forEach(t=>{ if(t!==v){ const p = document.getElementById(t+'-panel'); if(p) p.innerHTML = ''; } });
  if(typeof quietOn!=='undefined' && quietOn){ const qp = document.getElementById('quiet-panel'); if(qp){ if(v!=='insights') qp.innerHTML = ''; else renderQuietPanel(); } }
  const ip = document.getElementById('investigate-panel');
  if(ip && typeof investigateHTML==='function' && !(typeof quietOn!=='undefined' && quietOn)){
    if(v!=='insights') ip.innerHTML = '';
    else if(!ip.classList.contains('hidden') && !ip.innerHTML.trim()){
      const a = document.querySelector('#card-grid .insight-card.active');
      if(typeof snapOpenId!=='undefined' && snapOpenId) ip.innerHTML = snapshotPanelHTML(snapOpenId);
      else if(a) ip.innerHTML = investigateHTML(a);
    }
  }
  if(v==='followed') renderFollowedTab();
  if(v==='shared') renderSharedTab();
  if(v==='insights' && typeof ensureSelection==='function') ensureSelection();
  const h1 = document.getElementById('page-h1');
  const titles = {insights:'Feed', followed:'Followed', shared:'Shared'};
  if(h1 && titles[v]) h1.textContent = titles[v];
}

/* ═══ Followed and Shared: list + docked drill-down, the same as the feed. The top card is open by default. ═══ */
const tabSel = {followed:null, shared:null};            // followed: insight id · shared: share id
const tabPanelClosed = {followed:true, shared:true};    // closed until the user opens an insight
function activeTab(){ return ['followed','shared'].find(t=>{ const v = document.getElementById('view-'+t); return v && !v.classList.contains('hidden'); }) || null; }
function tabPanelHTML(tab){
  const key = tabSel[tab]; if(!key) return '';
  const share = tab==='shared' ? sharedWithMe.find(x=>x.id===key) : null;
  const id = tab==='shared' ? (share && share.insightId) : key;
  // an insight from outside the user's scope has no drill-down of its own: show the shared view, adapted to their data
  const extId = tab==='shared' ? key : (INSIGHT_META[id] || {}).shareId;
  const ext = extId && SHARED_VIEWS[extId] ? sharedWithMe.find(x=>x.id===extId) : null;
  if(ext) return sharedViewerHTML(ext, tab);
  const card = document.querySelector('#card-grid .insight-card[data-id="'+id+'"]');
  if(!card) return (followed[id] && FOLLOW_TRACK[id]) ? followOnlyPanelHTML(id, tab) : '';
  return investigateHTML(card).replace('closeInvestigatePanel(true)', "closeTabPanel('"+tab+"')");
}
function renderTabPanel(tab){
  tab = tab || activeTab(); if(!tab) return;
  const panel = document.getElementById(tab+'-panel'), split = document.getElementById(tab+'-split');
  if(!panel || !split) return;
  if(activeTab()!==tab){ panel.innerHTML = ''; return; }
  const html = tabPanelClosed[tab] ? '' : tabPanelHTML(tab);
  const top = panel.dataset.key===tabSel[tab] ? panel.scrollTop : 0;
  const inner = panel.querySelector('#shared-viewer'), innerTop = (inner && panel.dataset.key===tabSel[tab]) ? inner.scrollTop : 0;
  panel.innerHTML = html; panel.dataset.key = tabSel[tab] || '';
  panel.classList.toggle('hidden', !html); split.classList.toggle('has-panel', !!html);
  panel.scrollTop = top; const inner2 = panel.querySelector('#shared-viewer'); if(inner2) inner2.scrollTop = innerTop;
  document.querySelectorAll('#'+tab+'-list [data-sel-key]').forEach(c=>c.classList.toggle('active', !!html && c.dataset.selKey===tabSel[tab]));
}
function selectTabCard(tab, key){
  tabSel[tab] = key; tabPanelClosed[tab] = false;
  if(tab==='followed' && followed[key] && followed[key].updated){ followed[key].updated = false; updateFollowedBadge(); renderFollowedTab(); return; }
  if(tab==='shared'){
    const sh = sharedWithMe.find(x=>x.id===key);
    if(sh && sh.unread){ sh.unread = false; updateSharedBadge(); }
    renderSharedTab();
  } else renderTabPanel(tab);
}
function closeTabPanel(tab){ tabPanelClosed[tab] = true; renderTabPanel(tab); }

/* ═══ rail-level mode: Survey Insights (entry point) vs Analytics ═══ */
function openCareConsole(){
  /* Care console is a separate module; nothing to show here */
}
function setRailMode(mode){
  document.getElementById('rail-insights').classList.toggle('active', mode==='insights');
  document.getElementById('rail-analytics').classList.toggle('active', mode==='analytics');
  const h1 = document.getElementById('page-h1');
  const segWrap = document.getElementById('seg-wrap-main');
  const subnav = document.getElementById('si-subnav');
  if(subnav) subnav.style.display = mode==='insights' ? '' : 'none';
  segWrap.style.display = mode==='insights' ? 'none' : '';
  if(mode==='insights'){
    segWrap.innerHTML = '';
    segNav('insights');
    updateFollowedBadge();
    updateSharedBadge();
  } else {
    h1.textContent = 'Custom dashboards';
    segWrap.innerHTML = `
      <span class="seg" onclick="segNav('report')" id="seg-report">RT ATYAF MALL · Store dashboard</span>
    `;
    segNav('report');
  }
}
