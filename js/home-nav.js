/* ═══ NAVIGATION PATH: Sprinklr home (launchpad) → Customer Feedback Management → Survey Insights (last rail item) ═══ */
const SPR_LOGO = '<svg viewBox="0 0 32 32" width="24" height="24"><g fill="#1f2329"><ellipse cx="16" cy="13" rx="3.2" ry="9"/><ellipse cx="16" cy="13" rx="3.2" ry="9" transform="rotate(-48 16 22)"/><ellipse cx="16" cy="13" rx="3.2" ry="9" transform="rotate(48 16 22)"/></g></svg>';
const CFM_RAIL = {"programs": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M7 3h7l5 5v13H7z\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M10 12h2v2h-2zM14 12h2v2h-2zM10 16h2v2h-2z\"/></svg>", "people": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z\"/></svg>", "window": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M4 5h16v14H4zM4 9h16\"/></svg>", "tray": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M12 4v9m0 0l-3.5-3.5M12 13l3.5-3.5M5 17h14v3H5z\"/></svg>", "chart": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M5 20V10M10 20V5M15 20v-7M20 20H4\"/></svg>", "store": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M4 9l1.5-5h13L20 9M4 9h16M5 9v11h14V9M9 20v-5h6v5\"/></svg>", "ticket": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M4 7h16v3a2 2 0 000 4v3H4v-3a2 2 0 000-4z\"/></svg>", "list": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01\"/></svg>", "bulb": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M9.5 18h5M10.5 21h3M12 3a6 6 0 00-3.5 10.9V16h7v-2.1A6 6 0 0012 3z\"/></svg>", "spark": "<svg fill=\"currentColor\" viewBox=\"0 0 20 20\"><path d=\"M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z\"/></svg>", "gear": "<svg fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z\"/></svg>"};
let homeScreen = 'launchpad';
let cfmTabOpen = false;
let coachSeen = false;
const outside = ()=>{};   // other Sprinklr apps are not part of this walkthrough

function hmIcon(p){ return `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="${p}"/></svg>`; }
function homeTopbar(){
  const tabs = [];
  if(cfmTabOpen) tabs.push(`<div class="hm-tab${homeScreen==='programs'?' on':''}" data-hm-tab="cfm" onclick="goToInsights()"><span style="color:#e8762b">${hmIcon('M16 11a4 4 0 10-8 0M4 20v-1a5 5 0 015-5h6a5 5 0 015 5v1')}</span><span>Customer Feedback Management</span><span class="x">×</span></div>`);
  tabs.push(`<div class="hm-tab${homeScreen==='launchpad'?' on blue':''}" data-hm-tab="new" onclick="openHome('launchpad')"><span style="color:#2451d6">${hmIcon('M4 5h16v14H4zM8 9h8M8 13h5')}</span><span>New Page</span><span class="x">×</span></div>`);
  return `<div class="hm-top">
    <span class="hm-logo" onclick="openHome('launchpad')" title="Sprinklr home">${SPR_LOGO}</span>
    ${tabs.join('')}
    <span class="hm-ib" style="font-size:20px;font-weight:300">+</span>
    <div class="hm-icons">
      <span class="hm-ib">${hmIcon('M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z')}</span>
      <span class="hm-ib" onclick="openHome('launchpad')" title="Sprinklr home"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg></span>
      <span class="hm-ib">${hmIcon('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.4-9.4a2 2 0 112.8 2.8L11 19l-4 1 1-4 9.6-9.6z')}</span>
      <span class="hm-ib">${hmIcon('M8 7V3m8 4V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z')}</span>
      <span class="hm-ib">${hmIcon('M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9')}</span>
      <span class="hm-av">D</span>
    </div></div>`;
}
function homeProtoBar(){
  const c = (n,l)=>`<span class="hm-crumb${n===1?' on':''}">${n} · ${l}</span>`;
  return `<div class="hm-proto"><b>Prototype · Navigation path (Store Manager)</b>
    ${c(1,'Sprinklr home')} → ${c(2,'Customer Feedback Management → opens on Survey Insights')}
    <span style="margin-left:auto"></span>
    <button onclick="goToInsights()">Skip to Survey Insights</button>
    <button onclick="closeHome()">Close</button></div>`;
}
function launchpadHTML(){
  const apps = [
    {id:'cfm', name:'Customer Feedback Management', desc:'Optimize your customer journey with seamless feedback collection and analysis.', hl:true,
     icon:hmIcon('M16 11a4 4 0 10-8 0M4 20v-1a5 5 0 015-5h6a5 5 0 015 5v1')},
    {id:'llm', name:'LLM Insights', desc:'LLM Insights persona app.', icon:hmIcon('M4 5h16v14H4zM8 9h8M8 13h5')},
    {id:'bench', name:'Benchmarking', desc:'Monitor social media performance of your brand, competitors.', icon:hmIcon('M5 20V10M10 20V5M15 20v-7M20 20H4')},
    {id:'uvoc', name:'Unified VOC', desc:'Optimize your customer journey with Unified VOC.', icon:hmIcon('M11 5L6 9H3v6h3l5 4V5zM16 9a4 4 0 010 6')}
  ];
  const col = (t,d,groups)=>`<div><h4>${t}</h4><p>${d}</p>${groups.map(([h,links])=>`<h5>${h}</h5>${links.map(l=>`<a onclick="outside()">${l}</a>`).join('')}`).join('')}</div>`;
  return `<div class="lp">
    <div class="lp-search"><div class="in">${hmIcon('M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z').replace('<svg ','<svg width="16" height="16" ')}Search for Features, Dashboards and more...</div>
      <div class="lp-star"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"/></svg></div></div>
    <div class="lp-fav">☆ <span style="flex:1">You don't have any favorites, yet. Look for the "star" in dashboards to store your favorites here.</span><span style="cursor:pointer;color:#6b7280">✕</span></div>
    <div class="lp-card">
      <div class="lp-prod">
        <div onclick="outside()"><span style="color:#8b5cf6">♥</span>Sprinklr Service</div>
        <div class="on"><span style="color:#e8762b">●</span>Sprinklr Insights</div>
        <div onclick="outside()"><span style="color:#2e9d4a">▮</span>Sprinklr Marketing</div>
        <div onclick="outside()"><span style="color:#2f86c9">●</span>Sprinklr Social</div>
      </div>
      <p class="lp-new"><b>NEW!</b> Introducing Persona Apps for a simplified user experience, with all features you need one click away</p>
      <div class="lp-apps">${apps.map(a=>`<div class="lp-app${a.hl?' hl':''}" data-app="${a.id}" onclick="${a.id==='cfm'?'openCFM()':'outside()'}">
          ${a.id==='cfm'?'<span class="lp-hint">Click to continue</span>':''}
          <span class="ic">${a.icon.replace('<svg ','<svg width="20" height="20" ')}</span><div><b>${a.name}</b><small>${a.desc}</small></div></div>`).join('')}</div>
      <div class="lp-cols">
        ${col('Listen','Listen to billions of conversations by leveraging the largest repository of public digital data',[['Listening',['Topics','Themes','Keyword Lists']],['Explorer',['Quick Search','Trend Discovery','Smart Quick Insights']]])}
        ${col('Learn','Turn data into actionable insights across the enterprise',[['Insights',['Audience Insights','Smart Theme Explorer','Conversation Insights']],['Custom',['Listening Dashboards']]])}
        ${col('Act','Take real-time decisions and actions by leveraging unified platform',[['Alerts',['Listening Smart Alerts Dashboard']],['Distribute',['Presentations','Exports','Action Plan']]])}
      </div>
    </div></div>`;
}
function renderHome(){
  const L = document.getElementById('home-layer');
  L.innerHTML = homeProtoBar() + homeTopbar() + `<div class="hm-body">${launchpadHTML()}</div>`;
}
function openHome(screen){
  homeScreen = screen;
  renderHome();
  document.getElementById('home-layer').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function openCFM(){ cfmTabOpen = true; goToInsights(); }
function closeHome(){
  document.getElementById('home-layer').classList.remove('show');
  document.body.style.overflow = '';
}
function goToInsights(){ coachSeen = true; closeHome(); setRailMode('insights'); window.scrollTo(0,0); }
function goToAnalytics(){ coachSeen = true; closeHome(); setRailMode('analytics'); window.scrollTo(0,0); }
