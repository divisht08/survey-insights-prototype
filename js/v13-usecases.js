/* ═══ v13 — Use cases page from the hypothesis sheet (Survey_Intelligence_feed_3.xlsx, Summary tab), and
   the Option 2 journey cards made identical to the feed's. ═══ */

/* ── Use cases: Hypothesis | Validated | Result | Validated By | Validation Notes | In the product ── */
// [hypothesis, validated, result, validated by, validation notes, in the product], copied from the sheet
const V13_UC = [
[
"CX teams already have a regular routine for finding issues in survey data and then acting on them or passing them on.",
"Validated with customer",
"No change",
"Bosch, Redtag, ID.me",
"Bosch managers combine dashboards, NPS, comments and Widget Summarizer to find issues, then send technician issues to training and systemic issues to central teams. Redtag prepares weekly and monthly management views by hand. ID.me reviews the previous day's metrics and comments every morning and routes findings to owners.",
"The feed is built around this routine: find (feed) → investigate (drill-down, Copilot) → act (Recommended actions: action plan, share with a group, agents)."
],
[
"The hardest part of finding insights is the manual work of putting metrics, comments and charts together into one finding, not a lack of data or charts.",
"Validated with customer",
"No change",
"Bosch, Redtag, ID.me",
"Bosch managers piece together dashboard charts, NPS, comments and Widget Summarizer. Redtag turns survey data and comments into weekly and monthly summaries by hand. ID.me runs a Sigma/Snowflake agent, then reviews its output and the comments to decide what is worth calling out.",
"Each insight card brings the metric, the customer comments and the evidence together in one place."
],
[
"Some customers already use outside AI or analytics tools to do parts of this work.",
"Validated with customer",
"No change",
"Redtag, ID.me",
"Redtag uses AI to turn Sprinklr data into short management-ready outputs. ID.me runs a Sigma agent calling a Snowflake agent each morning, then reviews the analysis by hand. This shows the job exists today; it does not validate a specific Sprinklr design.",
"Not a feature. Confirms the need the feed is built for."
],
[
"Users will act on AI recommendations that are based on survey data alone.",
"Validated with customer",
"Partly wrong: recommendations can sound right but be wrong without business context. Keep them to what the evidence shows unless the customer adds that context.",
"ID.me",
"ID.me showed a plausible recommendation that was wrong: some failed self-service attempts are tolerated on purpose because agent-assisted verification costs much more. Nadav also flagged response-bias risk.",
"Recommended actions are checks and next steps, not instructions. Every drill-down has Evidence limitations. Setup asks what else the AI should know."
],
[
"An insight is only worth showing when a key metric moves significantly, for example an NPS drop.",
"Validated with customer",
"Wrong: users also want recurring and newly emerging issues on a regular schedule, even without a big metric movement. A metric move can raise priority but is not required.",
"Bosch; supported by ID.me",
"Bosch wants useful insights on a cadence even without an NPS drop, including recurring and systemic issues, and said generation should not depend on an event. ID.me checks every morning for broken integrations and new themes, which matter before they show up as a big KPI change.",
"Recurring and emerging themes are insight types alongside metric changes. Insights arrive on the user's cadence. Priority labels rank them."
],
[
"Different roles need different insights, not just a filtered copy of the same list.",
"Validated with customer",
"No change",
"Bosch, Redtag, ID.me",
"Bosch: Regional Managers need local and technician issues; Country Managers need systemic and country themes. Redtag: Store Manager, Area Manager and Country Head need different scopes. ID.me: Nadav, contact-centre ops and product or journey owners need different depth and focus.",
"Setup starts from the user's role. Store Manager and Area Manager (30 stores, Day 50) feeds show different insights."
],
[
"People beyond the survey admin or CX analyst, such as store, area and country managers or ops and product owners, will use survey insights.",
"Validated with customer",
"No change",
"Bosch, Redtag, ID.me",
"Bosch named Regional and Country Managers. Redtag described Store Managers, Area Managers and Country Heads. ID.me described contact-centre ops and product owners of specific verification steps. No senior leader has been interviewed yet.",
"Role-based setup, email digests and the Area Manager view."
],
[
"Senior leaders want a short summary of insights, on their own cadence.",
"Not validated yet",
"Pending",
"None yet",
"No senior leader was interviewed in this cycle. ID.me's request for an executive TLDR is Nadav's expectation for leaders, not their own.",
"Example only: a Leadership monthly summary in Email digests."
],
[
"Users value insights that tell them something new more than accurate summaries of what they already know.",
"Validated with customer",
"No change",
"ID.me",
"ID.me said the generated insights were accurate but often already known, and asked for new, emerging and trending findings. One customer so far; confirm with others before making novelty the main ranking rule.",
"Feed is ordered by date with unread insights in bold; emerging themes are an insight type; Copilot answers \"Has this happened before?\"."
],
[
"Users look for insights across the whole survey to improve CX, not question by question.",
"Validated with customer",
"No change",
"Redtag, ID.me; supported by Bosch",
"Redtag wants a prioritised view built around main KPIs, customer comments and actions, not a question-by-question list. ID.me questioned question-level focus and wants specific issues by journey step; its product owners also look across several surveys, so one survey is a starting boundary, not the end state.",
"Insights are generated for the whole survey and prioritised; a small set is shown, not one per question."
],
[
"Analysts only trust an insight after reading the actual customer comments behind it.",
"Validated with customer",
"No change",
"ID.me; supported by Redtag and Bosch",
"ID.me said representative comments are necessary because customer language is more human and explains the insight. Redtag's preferred reporting combines KPIs with what customers say. Bosch needs the evidence to investigate further.",
"Every drill-down has \"What customers say\" with example comments and See all."
],
[
"Once an insight is found, users usually look into it further before acting on it or assigning it to someone.",
"Validated with customer",
"No change",
"Bosch, Redtag, ID.me",
"Bosch: technician issue → training; systemic issue → escalation. Redtag: find the store or area, then decide the action. ID.me: repeated agent comments → training; journey-step issue → responsible PM. Supports guided next steps, not AI acting on its own.",
"Drill-down (evidence, comments, Copilot) comes before Recommended actions; action plans have an owner and status."
],
[
"Users can only trust a number when they know which survey, period and stores it covers and what it is compared with.",
"Validated with customer",
"No change",
"Redtag; supported by Bosch and ID.me",
"Redtag repeatedly needed the survey, period, stores and comparison before a number made sense. Bosch stressed the right scope; ID.me needs the right journey step or product.",
"The facts column in every drill-down shows the update, what it compares and the responses."
],
[
"Users want to know what changed and why, the specific driver, not just a metric or a broad theme.",
"Validated with customer",
"No change",
"ID.me, Redtag, Bosch",
"ID.me wants what is new, rising, falling or newly relevant, and said \"people cannot get verified\" is not enough without why, how and which method. Redtag wants KPI movement plus the main pain point. Bosch mainly needs to understand why a score changed.",
"\"What happened\" explains the change in words; key-driver insights name the driver."
],
[
"Users want a short, prioritised list first, with the detail only when they open an insight.",
"Validated with customer",
"No change",
"Redtag, ID.me",
"Redtag rejected paragraph-heavy output and asked for short, presentation-ready points. ID.me said long analysis helps analysts, while executives want a TLDR.",
"Light cards ordered by date, then priority; the depth sits in the drill-down."
],
[
"Users want their insights in a dedicated insights feed.",
"Not validated yet",
"Pending",
"None yet",
"Customers validated the job, the content and the workflow, not where insights should live. Feed, dashboard, Copilot, a separate hub or a tab inside the survey are all still open.",
"Feed (own entry point) and, for comparison, the Option 2 journey with insights inside the survey program."
],
[
"Users want important insights to come to them, for example by email, instead of having to look or ask for them.",
"Validated with customer",
"No change",
"Bosch, ID.me; Redtag directional",
"Bosch strongly liked proactive email and said surfacing insights beats prompting Copilot and wondering whether you asked the right question. ID.me wants email delivery and already runs daily automated analysis. Redtag was open to recurring automated pre-review outputs.",
"Email digests and alerts bring insights to the user; Copilot is for follow-up questions on an insight."
],
[
"An email or alert should take users to the full insight in Sprinklr rather than carry all the analysis itself.",
"Validated with customer",
"No change",
"Bosch, ID.me",
"Bosch validated email that drives users into Sprinklr to investigate and act. ID.me described email with a link to a dashboard where users explore what the AI flagged.",
"Each insight in the email links to its drill-down."
],
[
"Survey data looks back at what already happened, so analysts review it on a fixed schedule (weekly, monthly or quarterly); daily monitoring is not useful.",
"Validated with customer",
"Partly wrong: the right frequency depends on the role. Some users do check daily, for example for survey health or a broken step.",
"Bosch, Redtag, ID.me",
"ID.me: daily for Nadav (survey health, broken integrations), weekly or biweekly for ops. Redtag: quick weekly views plus monthly reporting. Bosch: recurring monitoring plus twice-yearly strategic NPS reviews.",
"Each user picks a daily, weekly or monthly cadence, recommended from response volume; alerts cover what cannot wait."
],
[
"Users need insights that combine several surveys, for example across a customer journey.",
"Validated with customer",
"Only one customer needs this so far (ID.me); not seen at Bosch or Redtag, so not a general need yet.",
"ID.me",
"ID.me's ownership follows journey and product steps that span several surveys. Not repeated by Bosch or Redtag.",
"Not in the prototype. The feed lists insights from several surveys but does not combine their data."
],
[
"Users want to compare their results with other stores, regions or countries.",
"Validated with customer",
"Only one customer uses this so far (Bosch, in twice-yearly reviews); not a general need yet.",
"Bosch",
"Bosch uses country benchmarking in twice-yearly strategic NPS reviews. Not yet repeated by other customers.",
"Partly: the Area Manager view compares stores within the area (sample data). No external benchmarks."
]
];
var v13UcFilter = 'all';
const v13Kind = r=>r[1]!=='Validated with customer' ? 'pending' : (r[2]==='No change' ? 'same' : 'changed');
ucHTML = function(){
  const e = s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const cnt = k=>k==='all' ? V13_UC.length : V13_UC.filter(r=>v13Kind(r)===k).length;
  const rows = V13_UC.filter(r=>v13UcFilter==='all' || v13Kind(r)===v13UcFilter);
  const chips = [['all','All'],['same','Validated, no change'],['changed','Validated, result changed'],['pending','Not validated yet']];
  return `<div class="hm-proto"><b>Prototype · Use cases</b><button style="margin-left:auto" data-uc-close onclick="closeUseCases()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap v13-uc">
      <h1>Hypotheses and what customers told us</h1>
      <p class="lo-lede">What we expected users to need, whether we checked it with customers (Bosch, Redtag, ID.me, Sep 2026), what we found, and how the prototype handles it. Result says "No change" when the hypothesis held.</p>
      <div class="uc-filter">${chips.map(([k,l])=>`<button class="v3-chip${v13UcFilter===k?' on':''}" data-uc-filter="${k}" onclick="v13UcFilter='${k}';openUseCases()">${l}<span class="n">${cnt(k)}</span></button>`).join('')}</div>
      <table class="uc-tbl" data-uc-table><thead><tr><th style="width:21%">Hypothesis</th><th style="width:128px">Validated</th><th style="width:15%">Result</th><th style="width:112px">Validated By</th><th style="width:28%">Validation Notes</th><th>In the product</th></tr></thead>
      <tbody>${rows.map(r=>{ const k = v13Kind(r); return `<tr data-uc-row="${k}"><td><b style="font-weight:600">${e(r[0])}</b></td>
        <td><span class="uc-st ${r[1]==='Validated with customer' ? 'y' : 'h'}">${e(r[1])}</span></td>
        <td class="${k==='changed' ? 'v13-chg' : k==='pending' ? 'v13-pend' : ''}">${e(r[2])}</td><td>${e(r[3])}</td>
        <td style="color:#42474f">${e(r[4])}</td><td style="color:#42474f">${e(r[5])}</td></tr>`; }).join('')}</tbody></table>
      <p class="uc-h">Parked flows</p>
      <p class="lo-lede">Thought through, but not validated with a customer and adding weight to the cards. Still openable here.</p>
      <div class="flex gap-2 flex-wrap" style="margin-bottom:30px"><button class="btn-sec" data-parked="layouts" onclick="closeUseCases();openCardLayouts()">Card layout options</button><button class="btn-sec" data-parked="journeys" onclick="closeUseCases();openCardJourneys()">How cards change</button></div>
    </div></div>`;
};

/* ── Option 2 journey: the Insights tab uses the feed's own cards, header, filters and date groups ── */
const v13F = {type:new Set(), prio:new Set(), topic:new Set()};
function v13Match(c){
  if(v13F.type.size && !v13F.type.has(v3TypeOf(c))) return false;
  if(v13F.prio.size && !v13F.prio.has(c.dataset.priority)) return false;
  if(v13F.topic.size && !v13F.topic.has(v9TopicOf(c))) return false;
  return true;
}
// a copy of the feed card: same markup and styles, opened in the survey's own drill-down;
// a survey-level view is the same for everyone, so per-person marks (unread, mark as unread, delete) are left out
v12CardHTML = function(c){
  const id = c.dataset.id, x = c.cloneNode(true);
  // whatever the feed hides on its cards stays hidden here too (the feed's rules are scoped to its own list)
  const a = [...c.querySelectorAll('*')], b = [...x.querySelectorAll('*')];
  a.forEach((n, i)=>{ if(getComputedStyle(n).display==='none' && b.at(i)) b.at(i).dataset.v13Gone = '1'; });
  x.querySelectorAll('[data-v13-gone]').forEach(n=>n.remove());
  x.classList.remove('active','v7-unread'); x.classList.add('v13-card'); x.classList.toggle('active', v12Sel===id);
  x.removeAttribute('style'); x.setAttribute('onclick', `v12Open('${id}')`); x.dataset.v12Card = id;
  x.querySelectorAll('.v10-hover,.v9-mu,.v3-x').forEach(n=>n.remove());
  x.querySelectorAll('.ic-acts .btn-pri').forEach(b=>b.setAttribute('onclick', `event.stopPropagation();v12Open('${id}')`));
  x.querySelectorAll('[onclick*="follow(this)"]').forEach(b=>b.remove());
  return x.outerHTML;
};
function v13Pill(key, label){
  const src = key==='type' ? V3_TYPES : key==='prio' ? V9_PRIO : null;
  const sel = [...v13F[key]].map(v=>{ const f = src && src.find(s=>s[0]===v); return f ? f[1] : v; });
  const txt = sel.length===0 ? label : sel.length===1 ? `${label}: ${sel[0]}` : `${label}: ${sel.length}`;
  return `<button class="v9-pill${sel.length?' on':''}" data-v13-pill="${key}" onclick="v13OpenMenu(event,'${key}')">${v12Esc(txt)}${V9_ICON.caret}</button>`;
}
function v13OpenMenu(ev, key){
  ev.stopPropagation();
  let m = document.getElementById('v9-menu');
  if(!m){ m = document.createElement('div'); m.id = 'v9-menu'; document.body.appendChild(m); }
  const cs = v12Cards(), cnt = fn=>cs.filter(fn).length;
  let opts = [];
  if(key==='type') opts = V3_TYPES.filter(t=>t[0]!=='all').map(t=>[t[0], t[1], cnt(c=>v3TypeOf(c)===t[0])]).filter(o=>o[2]);
  if(key==='prio') opts = V9_PRIO.map(p=>[p[0], p[1], cnt(c=>c.dataset.priority===p[0])]).filter(o=>o[2]);
  if(key==='topic'){ const t = {}; cs.forEach(c=>{ const k = v9TopicOf(c); if(k) t[k] = (t[k]||0) + 1; }); opts = Object.keys(t).sort().map(k=>[k,k,t[k]]); }
  m.innerHTML = opts.map(([v,l,n])=>`<label class="v9-opt"><input type="checkbox" ${v13F[key].has(v)?'checked':''} onchange="v13Toggle('${key}','${v12Esc(v)}',this.checked)"><span>${v12Esc(l)}</span><small>${n}</small></label>`).join('');
  const r = ev.currentTarget.getBoundingClientRect();
  m.style.display = 'block'; m.style.zIndex = '200'; m.style.top = (r.bottom + 6) + 'px'; m.style.left = Math.min(r.left, innerWidth - 260) + 'px';
}
function v13Toggle(key, v, on){ if(on) v13F[key].add(v); else v13F[key].delete(v); v12Render(); }
function v13Clear(){ v13F.type.clear(); v13F.prio.clear(); v13F.topic.clear(); v12Render(); }
v12InsightsHTML = function(){
  const all = v12Cards(), cs = all.filter(v13Match), hi = cs.filter(c=>c.dataset.priority==='high').length;
  const groups = [];
  cs.forEach(c=>{ const e = v7DateOf(c.dataset.id); let g = groups.find(x=>x.e===e); if(!g){ g = {e, cards:[]}; groups.push(g); } g.cards.push(c); });
  groups.sort((a,b)=>EDITIONS.indexOf(a.e) - EDITIONS.indexOf(b.e));
  const nf = v13F.type.size + v13F.prio.size + v13F.topic.size;
  const sch = (EDITION_SCHEDULE[editionFreq]||EDITION_SCHEDULE.Weekly).next.split(',')[0];
  return v12Shell(`${v12TabsHTML('insights')}
    <div class="v12-split${v12Sel?' open':''}"><div class="v12-list v13-list">
      <div class="v3-upd" style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:#5f6672;margin:0"><span>Updated <b style="color:#1f2329">${EDITIONS[0].short}</b> · next update ${sch}</span></div>
      <div id="v13-filters">${v13Pill('type','Type')}${v13Pill('prio','Priority')}${v13Pill('topic','Topic')}${nf ? `<button class="v9-clear" onclick="v13Clear()">Clear filters</button>` : ''}</div>
      <div class="feed-head"><p class="text-[13.5px] font-600 text-txt-1" data-v13-count>${cs.length} ${cs.length===1?'insight':'insights'}${hi ? ` <span style="color:#c5221f;font-weight:600">· ${hi} need${hi===1?'s':''} attention</span>` : ''}</p></div>
      <div class="v13-grid">${groups.map(g=>`<div class="v7-date"><b>${g.e.short}</b>${g.e.id===CURRENT_EDITION ? '<span class="lt">Latest update</span>' : ''}<span class="n">${g.cards.length}</span></div>${g.cards.map(v12CardHTML).join('')}`).join('') || '<p class="v10-note">No insights match these filters.</p>'}</div>
    </div>
      <div class="v12-panel" id="v12-panel">${v12Sel ? v12PanelHTML(v12Sel) : ''}</div></div>`,
    `<a onclick="v12Go('surveys')">Surveys</a> › <a onclick="v12Go('overview')">Store experience survey</a> › Insights`);
};
// copy the cards from the full feed, not its compact list: close any open feed drill-down first
const _v13OpenIn = openInSurvey;
openInSurvey = function(){ if(typeof closeInvestigatePanel==='function'){ closeInvestigatePanel(true); const ip = document.getElementById('investigate-panel'); if(ip) ip.innerHTML = ''; } v13Clear && (v13F.type.clear(), v13F.prio.clear(), v13F.topic.clear()); return _v13OpenIn(); };
