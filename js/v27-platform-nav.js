/* ═══ v27 (12 Nov) — navigation matches the platform (Dipit, 12 Nov):
   the platform's icon rail stays on the far left, showing icons only and labels on hover, with
   Global Settings, Notifications and the profile at the bottom. Inside Insights, the Insights menu sits
   next to it. The rail's items are the store manager's modules (Pradeep, 11 Nov). The top bar goes:
   its logo, notifications and profile now live in the rail, as in the platform. ═══ */

const V27_IC = {
  insights:'<path d="M12 2l2.3 6.2L20.5 10l-6.2 2.3L12 18.5l-2.3-6.2L3.5 10l6.2-1.8z" fill="currentColor"/>',
  alerts:'<path d="M12 22a2.5 2.5 0 002.4-2h-4.8A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5.5-6.8V3.5a1.5 1.5 0 00-3 0v.7A7 7 0 005 11v5l-2 2v1h18v-1z" fill="currentColor"/>',
  dashboards:'<path d="M4 20h3V10H4zm6.5 0h3V4h-3zM17 20h3v-7h-3z" fill="currentColor"/>',
  cases:'<path d="M3 6h18v4a2 2 0 000 4v4H3v-4a2 2 0 000-4zm5 1v10h2V7z" fill="currentColor"/>',
  plans:'<path d="M4 4h16v16H4zm3 3v2h10V7zm0 4v2h10v-2zm0 4v2h6v-2z" fill="currentColor"/>',
  responses:'<path d="M4 5h3v3H4zm5 0h11v3H9zM4 10.5h3v3H4zm5 0h11v3H9zM4 16h3v3H4zm5 0h11v3H9z" fill="currentColor"/>',
  settings:'<path fill="currentColor" d="M19.4 13a7.5 7.5 0 000-2l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 00-1.7-1L15 3h-4l-.4 2.7a7.6 7.6 0 00-1.7 1l-2.5-1-2 3.5L6.6 11a7.5 7.5 0 000 2l-2.2 1.6 2 3.5 2.5-1a7.6 7.6 0 001.7 1L11 21h4l.4-2.7a7.6 7.6 0 001.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" transform="translate(-1 0)"/>',
  bell:'<path d="M12 22a2.5 2.5 0 002.4-2h-4.8A2.5 2.5 0 0012 22zm7-6V11a7 7 0 00-5.5-6.8V3.5a1.5 1.5 0 00-3 0v.7A7 7 0 005 11v5l-2 2v1h18v-1z" fill="currentColor"/>'
};
const V27_ITEMS = [['insights','Insights'],['alerts','Alerts'],['dashboards','Dashboards'],['cases','Cases'],['plans','Action Plans'],['responses','All Responses']];
const v27Svg = k=>`<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">${V27_IC[k]}</svg>`;

function v27Build(){
  if(document.getElementById('v27-rail')) return;
  const sub = document.getElementById('si-subnav'); if(!sub) return;
  const logo = (typeof SPR_LOGO!=='undefined') ? SPR_LOGO : '';
  sub.insertAdjacentHTML('beforebegin', `<aside id="v27-rail" aria-label="Main menu">
    <div class="v27-in">
      <button class="v27-i v27-home" data-v27="home" onclick="v27Go('home')"><span class="v27-ic v27-logo">${logo}</span><span class="v27-l">Home</span></button>
      ${V27_ITEMS.map(([k,l])=>`<button class="v27-i${k==='insights'?' active':''}" data-v27="${k}" onclick="v27Go('${k}')"><span class="v27-ic">${v27Svg(k)}</span><span class="v27-l">${l}</span></button>`).join('')}
      <div class="v27-foot">
        <button class="v27-i" data-v27="settings" onclick="v27Go('settings')"><span class="v27-ic">${v27Svg('settings')}</span><span class="v27-l">Global Settings</span></button>
        <button class="v27-i" data-v27="notifications" onclick="v27Go('notifications')"><span class="v27-ic">${v27Svg('bell')}<em>3</em></span><span class="v27-l">Notifications</span></button>
        <button class="v27-i" data-v27="profile" onclick="v27Go('profile')"><span class="v27-ic"><i class="v27-av">D</i></span><span class="v27-l">Store manager</span></button>
      </div></div></aside>`);
  // the earlier labelled app menu and the "Back to menu" link give way to the rail
  const m = document.getElementById('v26-menu'); if(m) m.remove();
  const back = sub.querySelector('.v26-back'); if(back) back.remove();
  // the top bar goes: its logo, notifications and profile are in the rail
  const top = document.getElementById('spr-logo'); const bar = top && top.closest('.bg-white.border-b'); if(bar) bar.style.display = 'none';
  v27Fit();
}
function v27Active(k){ document.querySelectorAll('#v27-rail [data-v27]').forEach(b=>b.classList.toggle('active', b.dataset.v27===k)); }
V26_PH.notifications = ['Notifications','Your notifications.'];
function v27Go(k){
  const rail = document.getElementById('v27-rail'); if(rail) rail.classList.remove('open');
  const sub = document.getElementById('si-subnav');
  if(k==='insights'){ v26Ph(null); if(sub) sub.style.display = ''; v27Active('insights'); segNav('insights'); v27Fit(); return; }
  if(k==='settings' && typeof v15Open==='function'){ v15Open('exist', null, true); return; }   // admin setup lives in Global Settings
  if(sub) sub.style.display = 'none';
  v26Ph(k); v27Active(k);
}
// returning to Insights from a placeholder (its button, or any Insights menu action) brings the Insights menu back
v26App = function(k){ v27Go(k); };
v26Menu = function(){};
const _v27Seg = segNav;
segNav = function(){ const sub = document.getElementById('si-subnav'); if(sub && sub.style.display==='none'){ sub.style.display = ''; v27Active('insights'); } return _v27Seg.apply(this, arguments); };
// labels show on hover, over the page, as in the platform
document.addEventListener('mouseover', e=>{ const r = document.getElementById('v27-rail'); if(r) r.classList.toggle('open', !!e.target.closest('#v27-rail')); });
function v27Fit(){ ['v27-rail','si-subnav'].forEach(id=>{ const n = document.getElementById(id); if(!n || n.style.display==='none') return; n.style.height = Math.max(320, innerHeight - Math.max(0, n.getBoundingClientRect().top)) + 'px'; }); }
v26Fit = v27Fit;
addEventListener('scroll', v27Fit, {passive:true}); addEventListener('resize', v27Fit);
// the walk-through's Customise step still points at the Insights menu; nothing else to change there
v27Build();
addEventListener('load', v27Fit); setTimeout(v27Fit, 400);
