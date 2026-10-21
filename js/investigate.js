/* ═══ Investigate — persistent docked panel, not a modal ═══
   Clicking a different card while the panel is open just swaps its content in place. */
let panelUserClosed = false;   // respect it if the user deliberately closes the pane
// keep exactly one insight selected: if the selected one has left the feed, move to the top remaining one
function ensureSelection(){
  if(panelUserClosed) return;
  if(typeof viewingEdition!=='undefined' && viewingEdition!==CURRENT_EDITION) return;   // past editions are read-only
  const vi = document.getElementById('view-insights'), jr = document.getElementById('journey-returning');
  if(!vi || vi.classList.contains('hidden') || !jr || jr.classList.contains('hidden')) return;
  const first = [...document.querySelectorAll('#card-grid .insight-card')].find(c=>c.style.display!=='none');
  if(!first){ closeInvestigatePanel(); return; }   // nothing left to review: "all caught up", no pane
  // the pane is never opened on the user's behalf; once they open it, it stays docked and moves to the next card
  if(document.getElementById('investigate-panel').classList.contains('hidden')) return;
  const active = document.querySelector('#card-grid .insight-card.active');
  // an insight opened on purpose from Followed stays open even though it isn't in the feed list
  if(active && (active.style.display!=='none' || active.dataset.state==='followed')) return;
  openInvestigate(first);
}
function openInvestigate(el){
  const id = typeof el === 'string' ? el : el.closest('.insight-card').getAttribute('data-id');
  if(window.event && window.event.type==='click' && !openedIds.has(id)){ openedIds.add(id); setTimeout(renderEditionBar, 0); }
  const card = document.querySelector('.insight-card[data-id="'+id+'"]');
  if(!card) return;
  panelUserClosed = false;
  document.getElementById('insights-split').classList.add('has-panel');
  document.querySelectorAll('.insight-card').forEach(c=>c.classList.remove('active'));
  card.classList.add('active');
  const panel = document.getElementById('investigate-panel');
  panel.innerHTML = investigateHTML(card);
  panel.classList.remove('hidden');
}
function closeInvestigatePanel(byUser){
  if(byUser===true) panelUserClosed = true;
  document.getElementById('insights-split').classList.remove('has-panel');
  document.getElementById('investigate-panel').classList.add('hidden');
  document.querySelectorAll('.insight-card').forEach(c=>c.classList.remove('active'));
}

function investigateHTML(srcBtn){
  const card = srcBtn ? srcBtn.closest('.insight-card') : null;
  const id = card ? card.getAttribute('data-id') : null;
  const title = card ? card.querySelector('[data-el="title"]').textContent : 'Insight';
  const category = (INSIGHT_META[id] && INSIGHT_META[id].category) || (card ? card.querySelector('[data-el="kind-text"]')?.textContent : '');
  const body = investigateContent[id] || '<p class="text-[12.5px] text-txt-3">No additional detail available for this insight.</p>';
  const currentStatus = (insightActivity[id] && insightActivity[id].status) || 'open';
  return `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <div class="min-w-0">
        <p class="text-[10.5px] font-600 uppercase tracking-wide text-txt-4 mb-0.5">${category}</p>
        <p class="text-[14.5px] font-600 text-txt-1 leading-snug">${title}</p>
      </div>
      <button class="iconbtn flex-shrink-0" data-close-panel onclick="closeInvestigatePanel(true)"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>
    <div class="px-5 pt-3.5 flex items-center gap-2 flex-wrap">
      <button class="btn-sec" onclick="openShareModal('${id}')"><svg class="w-3.5 h-3.5 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg>Share this insight</button>
      ${actionPlans[id] ? planChipHTML(id) : `<button class="btn-sec" data-panel-plan onclick="openActionPlan('${id}')">${PLAN_ICON}Create action plan</button>`}
      ${followed[id] ? `<span class="tag acc">In Followed</span><button class="btn-sec" data-panel-done onclick="doneFromFollowed('${id}')"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/></svg>Mark as done</button>`
        : (typeof doneFeed!=='undefined' && doneFeed.has(id)) ? `<button class="btn-sec" data-panel-reopen onclick="reopenInsight('${id}')">Reopen</button>`
        : `<button class="btn-sec" data-panel-done onclick="markDone('${id}')"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/></svg>Mark as done</button>`}
      <span class="flex items-center gap-1 text-[11.5px] text-txt-4" style="margin-left:auto">Useful? ${feedbackHTML(id)}</span>
    </div>
    ${(typeof retiredFeed!=='undefined' && retiredFeed.has(id)) ? `<div class="ret-note" data-ret-note><b>No longer in your feed.</b> ${(RETIRED_REASON[id]||'Retired by the latest data.')} Kept here for the record.</div>` : ''}
    ${(PRIORITY[id] && !(typeof retiredFeed!=='undefined' && retiredFeed.has(id))) ? `<p class="px-5 pt-3 text-[12px] text-txt-3 leading-snug">${prioHTML(id)} <span class="text-txt-4">—</span> ${PRIORITY[id].reason}</p>` : ''}
    <div class="px-5 py-4">
      ${followed[id] ? sinceFollowedHTML(id) : ''}
      ${(INSIGHT_META[id] && INSIGHT_META[id].illustrative) ? `<div class="illus-banner"><svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span><b style="color:#42474f">Illustrative example.</b> Figures, quotes and dates below show what this type of analysis looks like. They are placeholders, not RT ATYAF MALL survey data.</span></div>` : ''}
      ${body}
      ${groundingHTML(id)}
      <div class="id-sect">
        <p class="eyebrow" style="margin-bottom:8px">Activity</p>
        ${renderActivitySection(id)}
      </div>
      <div class="mt-5 pt-4 border-t border-line2">
        <p class="text-[10px] font-600 uppercase tracking-wide text-txt-4 mb-2">Ask Copilot a follow-up</p>
        <div id="copilot-thread-${id}" class="space-y-2 mb-2.5">${copilotThreadHTML(id)}</div>
        ${suggestedQuestionsHTML(id)}
      </div>
    </div>
    <div class="border-t border-line2 px-5 py-3.5 flex items-center gap-2 sticky bottom-0 bg-white">
      <input id="copilot-input-${id}" class="flex-1 text-[13px] border border-line rounded-md px-3 h-9 focus:outline-none focus:border-spr-blue" placeholder="Ask a follow-up about this insight…" onkeydown="if(event.key==='Enter')askCopilot('${id}')">
      <button class="btn-pri" onclick="askCopilot('${id}')">Send</button>
    </div>
  `;
}

const investigateContent = {
  'INS-06': `
                <p class="id-lede">Staff helpfulness is the <b>highest-scoring of the 5 service factors</b> this period at 9.1/10, up 0.3 on the previous period. In open comments, friendly and helpful staff is the theme promoters mention most. This is good news worth protecting: the behaviours behind it can be named, recognised and repeated on every shift.</p>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">The evidence</p><div class="ev mb-3.5"><p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Staff helpfulness score (10-point scale)</p><div class="ev-tiles"><div class="ev-tile"><div class="k">Current period</div><div class="v good">9.1</div></div><div class="ev-tile"><div class="k">Previous period</div><div class="v ">8.8</div></div><div class="ev-tile"><div class="k">Change</div><div class="v good">▲ +0.3</div></div></div><p class="text-[10.5px] text-txt-4 px-3 pb-2">Same 5-factor analysis as the cleanliness driver insight</p></div><div class="ev mb-3.5"><p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Staff in open comments</p><div class="ev-tiles"><div class="ev-tile"><div class="k">Promoter comments</div><div class="v good">44%</div></div><div class="ev-tile"><div class="k">Detractor comments</div><div class="v ">7%</div></div><div class="ev-tile"><div class="k">Rank among praise themes</div><div class="v ">#1</div></div></div><p class="text-[10.5px] text-txt-4 px-3 pb-2">Share of comments mentioning helpful or friendly staff, current period</p></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Customer voice</p><p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding. Staff names are removed.</p>
                <div class="space-y-2"><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)"><p class="text-[13px] text-txt-1 leading-snug">&ldquo;The lady at the kids section helped me find every size I needed.&rdquo;</p><p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Helpful staff</p></div><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)"><p class="text-[13px] text-txt-1 leading-snug">&ldquo;Staff greeted us at the door and were patient with all our questions.&rdquo;</p><p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Friendly staff</p></div><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)"><p class="text-[13px] text-txt-1 leading-snug">&ldquo;[Staff member] went and checked the stock room for me — great service.&rdquo;</p><p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Helpful staff</p></div></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>Recommended action.</b> name the specific behaviours customers praise — greeting at the door, finding sizes, checking stock — in the next team briefing, and recognise the shifts behind them.</div></div><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>For your Area Manager.</b> share what is working at RT ATYAF MALL with other CRN stores where staff helpfulness scores lower.</div></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Evidence limitations</p><ul class="id-why"><li>Promoters comment on staff more often than other respondents, so comment shares overstate how often staff come up across all visits.</li><li>The score rise shows staff helpfulness moved <b>with</b> satisfaction, not that it caused the overall improvement.</li><li>Praise is reported at team level: individual staff names are removed, and this insight should not be used to rank or assess individuals.</li></ul></div>`,
  'INS-04': `
                <p class="id-lede">Across 5 service factors rated in the survey, <b>store and fitting-room cleanliness</b> has the strongest association with overall satisfaction, at 31% of the explained variation. It is also the lowest-scoring factor this period and fell versus the previous period. That combination makes it the most useful place to focus. It shows an association, not proof that cleaning more will lift scores.</p>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">How each factor relates to satisfaction</p><div class="ev" style="padding:12px 14px">
    <div class="drv-head"><span>Factor</span><span>Share of satisfaction variation</span><span style="text-align:right">Score · vs prev.</span></div>
    <div class="drv-row" data-driver="0">
      <div class="drv-lbl">Store &amp; fitting-room cleanliness</div>
      <div class="flex items-center"><div class="drv-track" style="flex:1"><div class="drv-bar top" style="width:100%"></div></div><span class="drv-pct">31%</span></div>
      <div class="drv-score">7.4/10 <span class="dn">▼ 0.6</span></div>
    </div><div class="drv-row" data-driver="1">
      <div class="drv-lbl">Staff helpfulness</div>
      <div class="flex items-center"><div class="drv-track" style="flex:1"><div class="drv-bar" style="width:77%"></div></div><span class="drv-pct">24%</span></div>
      <div class="drv-score">9.1/10 <span class="up">▲ 0.3</span></div>
    </div><div class="drv-row" data-driver="2">
      <div class="drv-lbl">Checkout wait time</div>
      <div class="flex items-center"><div class="drv-track" style="flex:1"><div class="drv-bar" style="width:58%"></div></div><span class="drv-pct">18%</span></div>
      <div class="drv-score">8.2/10 <span class="dn">▼ 0.2</span></div>
    </div><div class="drv-row" data-driver="3">
      <div class="drv-lbl">Size &amp; stock availability</div>
      <div class="flex items-center"><div class="drv-track" style="flex:1"><div class="drv-bar" style="width:48%"></div></div><span class="drv-pct">15%</span></div>
      <div class="drv-score">8.6/10 <span class="fl">— 0.0</span></div>
    </div><div class="drv-row" data-driver="4">
      <div class="drv-lbl">Promotion clarity</div>
      <div class="flex items-center"><div class="drv-track" style="flex:1"><div class="drv-bar" style="width:39%"></div></div><span class="drv-pct">12%</span></div>
      <div class="drv-score">7.9/10 <span class="up">▲ 0.1</span></div>
    </div>
    <p class="text-[10.5px] text-txt-4 mt-2 leading-snug">Relative importance: how much of the variation in overall satisfaction is associated with each factor&rsquo;s rating. Shares sum to 100%.</p>
  </div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Where to act first</p><div class="ev" style="padding:10px 12px"><svg viewBox="0 0 380 226" width="100%" style="display:block;font-family:Inter,system-ui,sans-serif">
    <rect x="172.0" y="106.7" width="192.0" height="89.3" fill="#fce8e6" opacity=".7"/>
    <rect x="44" y="16" width="320" height="180" fill="none" stroke="#e4e7ee"/>
    <line x1="172.0" y1="16" x2="172.0" y2="196" stroke="#c7cbd1" stroke-dasharray="3 3"/>
    <line x1="44" y1="106.7" x2="364" y2="106.7" stroke="#c7cbd1" stroke-dasharray="3 3"/>
    <text x="358" y="29" font-size="10" fill="#9aa0a8" text-anchor="end" font-weight="600">PROTECT</text>
    <text x="358" y="189" font-size="10" fill="#c5221f" text-anchor="end" font-weight="700">FIX FIRST</text>
    <text x="50" y="29" font-size="10" fill="#9aa0a8" font-weight="600">MAINTAIN</text>
    <text x="50" y="189" font-size="10" fill="#9aa0a8" font-weight="600">MONITOR</text>
    <circle cx="312.8" cy="167.2" r="6" fill="#42474f" stroke="#fff" stroke-width="1.5"/><text x="303.8" y="171.2" font-size="10.5" fill="#111318" font-weight="700" text-anchor="end">Cleanliness</text><circle cx="223.2" cy="44.8" r="4.5" fill="#c7cbd1" stroke="#fff" stroke-width="1.5"/><text x="231.2" y="48.8" font-size="10.5" fill="#42474f" font-weight="500" text-anchor="start">Staff help</text><circle cx="146.4" cy="109.6" r="4.5" fill="#c7cbd1" stroke="#fff" stroke-width="1.5"/><text x="154.4" y="113.6" font-size="10.5" fill="#42474f" font-weight="500" text-anchor="start">Checkout</text><circle cx="108.0" cy="80.8" r="4.5" fill="#c7cbd1" stroke="#fff" stroke-width="1.5"/><text x="116.0" y="84.8" font-size="10.5" fill="#42474f" font-weight="500" text-anchor="start">Availability</text><circle cx="69.6" cy="131.2" r="4.5" fill="#c7cbd1" stroke="#fff" stroke-width="1.5"/><text x="77.6" y="135.2" font-size="10.5" fill="#42474f" font-weight="500" text-anchor="start">Promo clarity</text>
    <text x="204" y="216" font-size="10" fill="#6b7280" text-anchor="middle">Association with satisfaction →</text>
    <text x="16" y="106" font-size="10" fill="#6b7280" text-anchor="middle" transform="rotate(-90 16 106)">Current score →</text>
  </svg></div>
  <p class="text-[11px] text-txt-3 mt-1.5 leading-snug">Cleanliness is the only factor that is both strongly associated with satisfaction and scoring below the store average — the clearest place to act.</p></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">The evidence</p><div class="ev mb-3.5"><p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Cleanliness in open comments</p><div class="ev-tiles"><div class="ev-tile"><div class="k">Detractor comments</div><div class="v bad">38%</div></div><div class="ev-tile"><div class="k">Promoter comments</div><div class="v ">6%</div></div><div class="ev-tile"><div class="k">Factor score change</div><div class="v bad">▼ 0.6</div></div></div><p class="text-[10.5px] text-txt-4 px-3 pb-2">Share of comments mentioning cleanliness or messy fitting rooms, current period</p></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Customer voice</p>
                <p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding.</p>
                <div class="space-y-2"><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug">&ldquo;Fitting rooms were messy with clothes left everywhere.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Fitting-room cleanliness</p>
            </div><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug">&ldquo;The floor near the kids section was dirty.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Store cleanliness</p>
            </div><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug">&ldquo;Had to wait because there was no clean fitting room free.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Fitting-room cleanliness</p>
            </div></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>Recommended action.</b> add a fitting-room reset to each shift checklist, especially at peak hours, then re-check this factor next period.</div></div><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>For your Area Manager.</b> compare cleanliness scores across stores to see whether this is specific to RT ATYAF MALL or network-wide.</div></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Evidence limitations</p><ul class="id-why"><li>Relative importance shows how strongly each factor moves <b>with</b> satisfaction, not what causes it.</li><li>Factors overlap — messy fitting rooms can also reflect staffing levels at peak times.</li><li>Needs factor-level rating questions (or reliable theme tagging) in the survey; respondents who skip those questions are not included.</li></ul></div>`,
  'INS-05': `
                <p class="id-lede">On <b>14 and 15 September</b>, 11 respondents described card or digital-wallet payments failing at the till. Normally this comes up about once a week, and it did not appear at all in the previous 89 days. The spike is concentrated on two days and then falls away, which fits a <b>single operational incident</b> better than a lasting trend.</p>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Daily payment-problem mentions · 27 Aug – 23 Sep</p><div class="ev" style="padding:12px 14px">
    <div class="anom-chart"><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="1 mention" style="height:13px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="1 mention" style="height:13px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b spike" title="6 mentions" style="height:80px"></div><div class="b spike" title="5 mentions" style="height:67px"></div><div class="b" title="1 mention" style="height:13px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="b" title="0 mentions" style="height:0px"></div><div class="anom-base" style="bottom:13px"></div></div>
    <div style="display:flex;gap:3px;margin-top:4px"><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:left">27 Aug</span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center">14 Sep</span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:center"></span><span style="flex:1;font-size:9.5px;color:#9aa0a8;white-space:nowrap;text-align:right">23 Sep</span></div>
    <p class="text-[10.5px] text-txt-4 mt-2 leading-snug">Dashed line: top of the normal range (up to 1 mention a day). Red: days well above it.</p>
  </div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">The evidence</p><div class="ev mb-3.5"><p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Scale and impact</p><div class="ev-tiles"><div class="ev-tile"><div class="k">Mentions, 14–15 Sep</div><div class="v bad">11</div></div><div class="ev-tile"><div class="k">Typical week</div><div class="v ">~1</div></div><div class="ev-tile"><div class="k">Avg satisfaction, these respondents</div><div class="v bad">4.2</div></div></div><p class="text-[10.5px] text-txt-4 px-3 pb-2">Store average this period: 9.63/10</p></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Customer voice</p>
                <p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding.</p>
                <div class="space-y-2"><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug">&ldquo;My card was declined twice at the till but the bank says the payment never reached them.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: 14 Sep &middot; Theme: Payment failure</p>
            </div><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug">&ldquo;Apple Pay wasn&rsquo;t working, I had to leave the items.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: 14 Sep &middot; Theme: Payment failure</p>
            </div><div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug">&ldquo;Waited ten minutes at checkout because the card machine kept failing.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: 15 Sep &middot; Theme: Payment failure / wait</p>
            </div></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>Recommended action.</b> check with IT or the POS provider whether card terminals or the payment gateway had an outage on 14–15 Sep.</div></div><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>For your Area Manager.</b> check whether other stores saw the same spike on those dates — if they did, it is likely a network-wide payment issue.</div></div><div class="id-means" style="margin-top:9px"><span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span><div><b>For the Central team.</b> if an outage is confirmed, consider reaching out to affected customers who left without completing a purchase.</div></div></div>
                <div class="id-sect"><p class="eyebrow" style="margin-bottom:8px">Evidence limitations</p><ul class="id-why"><li>Counts are small — a jump from about one to eleven mentions is notable but not statistically robust.</li><li>Comments describe the symptom (payment failing), not the technical cause.</li><li>Whether it has fully stopped can only be confirmed as more responses arrive.</li></ul></div>`,
  'INS-01': `
                <p class="id-lede">Overall store satisfaction improved versus the equivalent prior period, and service satisfaction improved as well. This is a validated score change on the same store, survey, and date logic. It shows stronger reported experience levels, but it does not prove what operational change caused the uplift.</p>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">The evidence</p>
                <div class="ev mb-3.5">
                  <p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Overall satisfaction average (10-point scale)</p>
                  <div class="ev-tiles">
                    <div class="ev-tile"><div class="k">Current period</div><div class="v">9.63</div></div>
                    <div class="ev-tile"><div class="k">Previous period</div><div class="v">9.23</div></div>
                    <div class="ev-tile"><div class="k">Change</div><div class="v good">+0.40</div></div>
                  </div>
                  <p class="text-[10.5px] text-txt-4 px-3 pb-2">Total responses: 261 vs 568 &middot; precise values 9.6322 / 9.2342 / +0.3980</p>
                </div>
                <div class="ev mb-3.5">
                  <p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Service satisfaction average (10-point scale)</p>
                  <div class="ev-tiles">
                    <div class="ev-tile"><div class="k">Current period</div><div class="v">9.67</div></div>
                    <div class="ev-tile"><div class="k">Previous period</div><div class="v">9.30</div></div>
                    <div class="ev-tile"><div class="k">Change</div><div class="v good">+0.37</div></div>
                  </div>
                  <p class="text-[10.5px] text-txt-4 px-3 pb-2">Total responses: 261 vs 568 &middot; precise values 9.6743 / 9.3046 / +0.3698</p>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Customer voice</p>
                <p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding.</p>
                <p class="text-[10.5px] font-600 text-txt-3 uppercase tracking-wide mb-1.5">Current period</p>
                <div class="space-y-2 mb-3">
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;متعاونين سلسين مبتسمين ترحابيين&rdquo;</p>
              <p class="text-[11.5px] text-txt-3 mt-1"><span class="font-500">English translation:</span> &ldquo;Cooperative, smooth, smiling, welcoming.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Positive staff interaction</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;perfect servivce&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Positive service</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;الخيارات في ملابس المنزل جيدة&rdquo;</p>
              <p class="text-[11.5px] text-txt-3 mt-1"><span class="font-500">English translation:</span> &ldquo;The options in homewear are good.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Product choice</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;جيد ومحترم&rdquo;</p>
              <p class="text-[11.5px] text-txt-3 mt-1"><span class="font-500">English translation:</span> &ldquo;Good and respectful.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Respectful service</p>
            </div>
                </div>
                <p class="text-[10.5px] font-600 text-txt-3 uppercase tracking-wide mb-1.5">Previous period</p>
                <div class="space-y-2">
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Because of the discount and friendly of the team&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Promotion plus team friendliness</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;أستاذ زياد ربنا يبارك تعامل احترافي محترم&rdquo;</p>
              <p class="text-[11.5px] text-txt-3 mt-1"><span class="font-500">English translation:</span> &ldquo;Mr. Ziad, may God bless him; professional and respectful تعامل.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Positive staff interaction</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;High quality and suitable price&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Value / product quality</p>
            </div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p>
                <div class="id-means" style="margin-top:9px">
                  <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
                  <div><b>Recommended action.</b> identify the repeatable behaviors or conditions behind the stronger current scores, especially service interactions that customers explicitly described as welcoming or respectful.</div>
                </div>
                <div class="id-means" style="margin-top:9px">
                  <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
                  <div><b>For your Area Manager.</b> if this store's uplift is ahead of peers, compare operating practices and replicate what is working elsewhere.</div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Evidence limitations</p>
                <ul class="id-why"><li>The score comparison is solid for this store and period, but the score fetch does not separately expose valid-answer bases per score question in the result used here.</li><li>Comment examples support context, not causation.</li><li>This insight intentionally avoids claiming a specific operational cause because the data does not evidence one.</li></ul>
                </div>`,
  'INS-02': `
                <p class="id-lede">Current-period comments include specific complaints about how offers were communicated, especially where &ldquo;buy/get&rdquo; or discount mechanics were not understood as presented. This is distinct from pure affordability: these comments point to promotion clarity, not just high prices. The evidence shows the issue is still present; it does not establish how widespread it is across all shoppers beyond the comments retrieved.</p>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">The evidence</p>
                <div class="ev mb-3.5">
                  <p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Overall satisfaction average (10-point scale)</p>
                  <div class="ev-tiles">
                    <div class="ev-tile"><div class="k">Current period</div><div class="v">9.63</div></div>
                    <div class="ev-tile"><div class="k">Previous period</div><div class="v">9.23</div></div>
                    <div class="ev-tile"><div class="k">Change</div><div class="v good">+0.40</div></div>
                  </div>
                  <p class="text-[10.5px] text-txt-4 px-3 pb-2">Total responses: 261 vs 568 &middot; precise values 9.6322 / 9.2342 / +0.3980</p>
                </div>
                <div class="rounded-md" style="border:1px solid var(--line-soft);background:var(--surface-2)">
                  <div class="flex items-center justify-between px-3 py-2 border-b" style="border-color:var(--line-soft)">
                    <span class="text-[11.5px] font-500 text-txt-2">Promotion / discount clarity comments</span>
                    <span class="text-[10.5px] text-txt-4">Not stated as meaningful movement</span>
                  </div>
                  <div class="px-3 py-2 text-[11px] text-txt-3">
                    <span class="font-500 text-txt-2">Current:</span> 1 clear example shown &nbsp;&middot;&nbsp; <span class="font-500 text-txt-2">Previous:</span> 1 clear example shown
                  </div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Customer voice</p>
                <p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding.</p>
                <p class="text-[10.5px] font-600 text-txt-3 uppercase tracking-wide mb-1.5">Current period</p>
                <div class="space-y-2 mb-3">
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;لان عروضكم كذابه اجل ٢ و٢ مجانا مستقبلتنا من عند الباب وآخر شي على بضائع معينه كان المفروض التوضيح&rdquo;</p>
              <p class="text-[11.5px] text-txt-3 mt-1"><span class="font-500">English translation:</span> &ldquo;Because your offers are misleading &mdash; we were welcomed at the door with '2+2 free' and in the end it was only on certain items; this should have been clarified.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Promotion / offer clarity</p>
            </div>
                </div>
                <p class="text-[10.5px] font-600 text-txt-3 uppercase tracking-wide mb-1.5">Previous period</p>
                <div class="space-y-2">
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;لأن العرض الموجود كات خصم ٤٠ ريال علي الفاتورة وعند الدفع علي الكاشير قال ان الخصم يكون في الشراء مره اخري وليس في هذه الفاتورة فرضا انني لن اشتري مره اخري لما هذا الخداع في التسويق هذه تعتبر عروض وهميه تحاسب عليها وزارة التجارة&rdquo;</p>
              <p class="text-[11.5px] text-txt-3 mt-1"><span class="font-500">English translation:</span> &ldquo;Because the offer said 40 SAR off the bill, but at checkout they said the discount applies on a future purchase, not this bill. If I never buy again, why this deceptive marketing? These are fake offers.&rdquo;</p>
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Promotion / discount clarity</p>
            </div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p>
                <div class="id-means" style="margin-top:9px">
                  <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
                  <div><b>Recommended action.</b> walk the store and checkout journey for every active offer to verify that signage, verbal explanation, and POS expectations all match.</div>
                </div>
                <div class="id-means" style="margin-top:9px">
                  <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
                  <div><b>For the Central team or your Area Manager.</b> if the wording or mechanics of the offer itself is confusing, escalate for clearer campaign rules and creative.</div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Evidence limitations</p>
                <ul class="id-why"><li>I am not presenting a full-theme total here because the current request explicitly required caution about theme coverage and disputed earlier counts; I could validate presence and specific examples, but I am not treating a manually reclassified subset as an audited full-population theme total.</li><li>Promotion-clarity and affordability can overlap in a single response; they should not be merged operationally.</li></ul>
                </div>`,
  'INS-03': `
                <p class="id-lede">A separate set of comments points to affordability/value, not promotion mechanics. This matters because the corrective action differs: price-value messaging in-store may help, but if shoppers are reacting to actual price points, that likely needs escalation beyond store control. The evidence shows the issue exists in comments; it does not prove that price concerns drove the score change.</p>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">The evidence</p>
                <div class="ev mb-3.5">
                  <p class="text-[11px] font-500 text-txt-3 px-3 pt-2.5">Overall satisfaction average (10-point scale)</p>
                  <div class="ev-tiles">
                    <div class="ev-tile"><div class="k">Current period</div><div class="v">9.63</div></div>
                    <div class="ev-tile"><div class="k">Previous period</div><div class="v">9.23</div></div>
                    <div class="ev-tile"><div class="k">Change</div><div class="v good">+0.40</div></div>
                  </div>
                  <p class="text-[10.5px] text-txt-4 px-3 pb-2">Total responses: 261 vs 568 &middot; precise values 9.6322 / 9.2342 / +0.3980</p>
                </div>
                <div class="rounded-md" style="border:1px solid var(--line-soft);background:var(--surface-2)">
                  <div class="flex items-center justify-between px-3 py-2 border-b" style="border-color:var(--line-soft)">
                    <span class="text-[11.5px] font-500 text-txt-2">Affordability / high-price comments</span>
                    <span class="text-[10.5px] text-txt-4">Not stated as meaningful movement</span>
                  </div>
                  <div class="px-3 py-2 text-[11px] text-txt-3">
                    <span class="font-500 text-txt-2">Current:</span> 1 clear example shown &nbsp;&middot;&nbsp; <span class="font-500 text-txt-2">Previous:</span> 2 clear examples shown
                  </div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Customer voice</p>
                <p class="text-[11px] text-txt-4 italic mb-2.5">Displayed quotes are examples, not the full basis for the finding.</p>
                <p class="text-[10.5px] font-600 text-txt-3 uppercase tracking-wide mb-1.5">Current period</p>
                <div class="space-y-2 mb-3">
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Plz less the price&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Affordability</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Prices and discount can be more understandable&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Current &middot; Theme: Mixed affordability / promo clarity</p>
            </div>
                </div>
                <p class="text-[10.5px] font-600 text-txt-3 uppercase tracking-wide mb-1.5">Previous period</p>
                <div class="space-y-2">
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Affordable&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Positive value</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;Nice and affordable&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Positive value</p>
            </div>
                <div class="rounded-md p-2.5" style="background:var(--surface-2);border:1px solid var(--line-soft)">
              <p class="text-[13px] text-txt-1 leading-snug" dir="auto">&ldquo;High quality and suitable price&rdquo;</p>
              
              <p class="text-[11px] text-txt-4 mt-1">Period: Previous &middot; Theme: Positive value</p>
            </div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Suggested next steps</p>
                <div class="id-means" style="margin-top:9px">
                  <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
                  <div><b>Recommended action.</b> check whether price complaints cluster around specific categories or high-visibility items, and ensure staff can explain value, quality, and current offers clearly.</div>
                </div>
                <div class="id-means" style="margin-top:9px">
                  <span class="g"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></span>
                  <div><b>For the Central team.</b> if repeated complaints are about actual price levels rather than confusion, escalate pricing or assortment concerns.</div>
                </div>
                </div>

                <div class="id-sect">
                <p class="eyebrow" style="margin-bottom:8px">Evidence limitations</p>
                <ul class="id-why"><li>The current-period affordability evidence is based on a small number of clearly relevant comments, so this should be treated as a focused signal, not a proven broad shift.</li><li>One displayed current quote overlaps affordability and promotion clarity; responses can belong to more than one theme, but should be counted once within each theme.</li><li>I have avoided claiming a meaningful period-over-period theme movement because that would require a stricter audited classification pass than I could validate here.</li></ul>
                </div>`
};

/* ═══ COPILOT IN THE DRILL-DOWN — suggested questions ask Copilot directly; answers use only this insight's evidence ═══ */
const COPILOT_QA = {
  'INS-05': [
    ['Has it stopped?', 'Mentions are concentrated on 14 and 15 Sep and then fall away, which fits a single incident rather than a lasting trend. Whether it has fully stopped can only be confirmed as more responses arrive.', 'Daily payment-problem mentions · Evidence limitations'],
    ['How did it affect satisfaction?', 'The respondents who mentioned payment failures averaged 4.2, against a store average of 9.63/10 this period. That shows those visits went badly. With 11 mentions it is not statistically robust, and it does not show how many shoppers were affected overall.', 'The evidence · Evidence limitations'],
    ['Did other stores see the same spike?', 'I can only see RT ATYAF MALL\'s responses, so I can\'t tell. The suggested next step is to ask your Area Manager whether other stores saw it on the same dates; if they did, it is likely a network-wide payment issue.', 'Suggested next steps']],
  'INS-04': [
    ['Why start with cleanliness?', 'It has the strongest association with overall satisfaction, at 31% of the explained variation, and it is the lowest-scoring factor at 7.4/10, down 0.6. No other factor is both strongly associated with satisfaction and below the store average.', 'How each factor relates to satisfaction · Where to act first'],
    ['What do customers say about it?', '38% of detractor comments mention cleanliness or messy fitting rooms, against 6% of promoter comments. The examples describe clothes left in fitting rooms, a dirty floor near the kids section, and waiting for a clean fitting room.', 'The evidence · Customer voice'],
    ['Will cleaning more raise the score?', 'This data can\'t tell you that. It shows how strongly each factor moves with satisfaction, not what causes it, and factors overlap: messy fitting rooms can also reflect staffing at peak times. The way to find out is to make the change and re-check this factor next period.', 'Evidence limitations']],
  'INS-01': [
    ['What is behind the improvement?', 'The data does not show a specific cause. The score rose from 9.23 to 9.63 on 261 vs 568 responses, and current comments describe staff as welcoming, smooth and respectful. That is context, not proof of what caused the change.', 'The evidence · Customer voice · Evidence limitations'],
    ['Did service satisfaction improve too?', 'Yes. Service satisfaction went from 9.30 to 9.67, up 0.37, on the same 261 vs 568 responses.', 'The evidence'],
    ['How many responses is this based on?', '261 responses in the current period and 568 in the previous period (14 Feb – 31 May 2026).', 'The evidence']],
  'INS-02': [
    ['How many shoppers complained about offers?', 'I can\'t give a reliable total. The evidence confirms the theme is present, with one clear example in the current period and one in the previous period, but a full count across all comments has not been validated.', 'The evidence · Evidence limitations'],
    ['Is this about prices or how offers are explained?', 'How offers are explained. The comments describe offers such as "2+2 free" or "40 SAR off the bill" that turned out to apply only to certain items or to a future purchase. Affordability is a separate theme with its own insight.', 'Customer voice'],
    ['Should I escalate this?', 'If the offer rules or the campaign wording are themselves confusing, the suggestion is to escalate to the Central team. If the gap is in signage or how staff explain offers, it is within the store\'s control.', 'Suggested next steps']],
  'INS-03': [
    ['Are price complaints growing?', 'There is no evidence of that: one clear example in the current period against two in the previous period, and the change is not stated as meaningful. Treat it as a focused signal, not a broad shift.', 'The evidence · Evidence limitations'],
    ['Is this about prices or confusing discounts?', 'Mostly about affordability. One current comment mixes price and discount clarity; a response can belong to both themes but is counted once in each.', 'Customer voice · Evidence limitations'],
    ['Can the store act on this?', 'Partly. Staff can explain value, quality and current offers clearly. If complaints are about actual price levels, that needs escalation to the Central team.', 'Suggested next steps']],
  'INS-06': [
    ['Which behaviours do customers praise?', 'Greeting customers at the door, helping them find sizes, and checking the stock room. Friendly, helpful staff is the most-mentioned theme in promoter comments, at 44%.', 'The evidence · Customer voice'],
    ['Did staff helpfulness cause the overall improvement?', 'The data doesn\'t show that. Staff helpfulness rose from 8.8 to 9.1 alongside overall satisfaction. Moving together is not proof that one caused the other.', 'Evidence limitations'],
    ['Which staff members were praised?', 'I can\'t show that. Praise is reported at team level and staff names are removed, so this insight is not used to rank or assess individuals.', 'Evidence limitations']]
};
const copilotAsked = {};
const copilotLog = {};   // the conversation survives the drill-down being redrawn
const cpTurn = t=>`
    <div class="rounded-md px-3 py-2 ml-8" style="background:#eef4ff"><p class="text-[12.5px] text-txt-1">${t.q.replace(/</g,'&lt;')}</p></div>
    <div class="rounded-md px-3 py-2" style="background:#f7f8fa" data-cp-answer><p class="text-[12.5px] text-txt-2 leading-[1.5]">${t.a}</p>${t.src ? `<p class="cp-src">From this insight: ${t.src}</p>` : ''}</div>`;
function copilotThreadHTML(id){ return (copilotLog[id]||[]).map(cpTurn).join(''); }
function suggestedQuestionsHTML(id){
  const qa = COPILOT_QA[id]; if(!qa) return '';
  const asked = copilotAsked[id] || [];
  const left = qa.filter(x=>!asked.includes(x[0]));
  if(!left.length) return '';
  return `<div class="cp-sugg" id="copilot-sugg-${id}"><span class="cp-sugg-l">Suggested questions</span>${left.map(x=>`<button class="cp-q" data-cp-q="${id}" onclick="askCopilot('${id}', this.textContent)">${x[0]}</button>`).join('')}</div>`;
}
function copilotAnswer(id, q){
  const qa = COPILOT_QA[id] || [];
  const exact = qa.find(x=>x[0]===q);
  if(exact) return exact;
  // a typed question: match it to the closest suggested question by shared words
  const words = s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>3);
  const qw = words(q);
  let best = null, score = 0;
  qa.forEach(x=>{ const n = words(x[0]).filter(w=>qw.includes(w)).length; if(n>score){ score = n; best = x; } });
  if(best && score>=1) return best;
  return [q, 'I can only answer from the evidence behind this insight, and it doesn\'t cover that. Try one of the suggested questions, or ask your CX team for a wider analysis.', ''];
}
function askCopilot(id, preset){
  const input = document.getElementById('copilot-input-'+id);
  const q = (preset || (input ? input.value : '')).trim();
  if(!q) return;
  const thread = document.getElementById('copilot-thread-'+id);
  const ans = copilotAnswer(id, q);
  if(ans[0] && COPILOT_QA[id] && COPILOT_QA[id].some(x=>x[0]===ans[0])){ copilotAsked[id] = copilotAsked[id] || []; if(!copilotAsked[id].includes(ans[0])) copilotAsked[id].push(ans[0]); }
  const turn = {q, a:ans[1], src:ans[2]};
  (copilotLog[id] = copilotLog[id] || []).push(turn);
  thread.insertAdjacentHTML('beforeend', cpTurn(turn));
  if(input) input.value = '';
  const sg = document.getElementById('copilot-sugg-'+id);
  if(sg){ const html = suggestedQuestionsHTML(id); if(html) sg.outerHTML = html; else sg.remove(); }
  thread.scrollIntoView({behavior:'smooth', block:'end'});
}

/* ═══ GROUNDING — how an insight was found. Collapsed and low in the drill-down: there for anyone who wants it. ═══ */
const GROUNDING = {
  'INS-01': {method:'Compared the average overall satisfaction score in the current period with the previous period.',
    data:'261 responses (01 Jun – 23 Sep 2026) against 568 (14 Feb – 31 May 2026), on a 10-point scale. Same store, survey and date logic.',
    checks:'Both periods meet the response minimum, and the change is a validated score change, not noise.',
    not:'It does not identify what caused the change.'},
  'INS-02': {method:'Text analytics grouped open comments into themes, then checked that this theme appears in both periods.',
    data:'Open comments from the same 261 and 568 responses.',
    checks:'The theme is present in both periods. A full count of the theme has not been validated, so no total is shown.',
    not:'How widespread the issue is across all shoppers.'},
  'INS-03': {method:'Text analytics grouped open comments into themes, then checked that this theme appears in both periods.',
    data:'Open comments from the same 261 and 568 responses.',
    checks:'The theme is present in both periods. The movement between periods is not stated as meaningful.',
    not:'Whether price concerns drove the score change.'},
  'INS-04': {method:'Relative-importance analysis: overall satisfaction is modelled on the 5 factor ratings, and the explained variation is split between the factors.',
    data:'Responses that rated all five factors in the current period, 01 Jun – 23 Sep 2026.',
    checks:'Every factor has enough ratings and the ranking is stable.',
    not:'Cause. It shows which factor moves most with satisfaction.'},
  'INS-05': {method:'Anomaly detection on the daily count of payment-problem comments, against their normal range.',
    data:'Daily comment counts, with the trailing 90 days as the baseline.',
    checks:'Two days are well outside the normal range. The counts are small, so the spike is notable but not statistically robust.',
    not:'The technical cause of the failures.'},
  'INS-06': {method:'Compared the staff helpfulness rating between periods, and measured how often staff come up in promoter and detractor comments.',
    data:'The 5 factor ratings and open comments, current and previous period.',
    checks:'The rise passes the period-comparison check. Comment shares are reported at team level.',
    not:'Whether staff helpfulness caused the overall improvement.'}
};
function groundingHTML(id){
  const g = GROUNDING[id]; if(!g) return '';
  return `<details class="how-found" data-grounding>
      <summary>How this insight was found</summary>
      <dl><dt>Method</dt><dd>${g.method}</dd><dt>Data used</dt><dd>${g.data}</dd><dt>Checks it passed</dt><dd>${g.checks}</dd><dt>What it can't tell you</dt><dd>${g.not}</dd></dl>
      <p class="hf-note">Exact tests and thresholds are set with data science.</p>
    </details>`;
}

// persistent configuration state — survives closing/reopening the drawer
let cfgState = {
  fields: {'Store':true, 'Country':true, 'City':false, 'Product Category':true, 'Visit Type':false, 'Loyalty Tier':false},
  frequency: 'Weekly',
  format: 'Card feed',
  subscribed: true,
  recipients: ['Dipit Sharma','Anish (VP)','CX Ops Team']
};

function configureHTML(){
  const curTitle = document.getElementById('obj-title')?.textContent || 'Store Manager';
  const curDesc = document.getElementById('obj-desc')?.textContent || 'Insights on RT ATYAF MALL — satisfaction & service quality, promotions & pricing clarity, store operations & consistency';
  return `
    <div class="flex items-center justify-between px-5 py-4 border-b border-line2">
      <div>
        <p class="text-[15px] font-600 text-txt-1">Configure Insights</p>
        <p class="text-[12px] text-txt-3 mt-0.5">Set your focus and how insights reach you</p>
      </div>
      <button class="iconbtn" onclick="closeDrawer()"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></button>
    </div>

    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6">

      <!-- Objectives -->
      <div>
        <p class="text-[12.5px] font-600 text-txt-1 mb-2">Objectives</p>
        <div class="opt-card sel mb-2.5" style="cursor:default">
          <p class="text-[13.5px] font-600 text-txt-1" id="drawer-obj-title">${curTitle}</p>
          <p class="text-[12px] text-txt-3 mt-0.5 leading-snug" id="drawer-obj-desc">${curDesc}</p>
        </div>
        <button class="btn-sec w-full justify-center" onclick="openWizard()"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 00.95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 00-.36 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 00-1.18 0l-2.8 2.03c-.79.57-1.84-.2-1.54-1.12l1.07-3.29a1 1 0 00-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 00.95-.69l1.07-3.29z"/></svg>Set up with guided AI</button>
      </div>

      <div class="border-t border-line2"></div>

      <!-- Insight types are chosen by the system, not configured by the user -->
      <div data-auto-types style="display:flex;gap:9px;align-items:flex-start;padding:10px 12px;border-radius:10px;background:#f6f8fb;border:1px solid #e4e7ee">
        <svg class="w-4 h-4 flex-shrink-0" style="color:#6b7280;margin-top:1px" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p class="text-[12px] text-txt-3 leading-snug"><span class="font-600 text-txt-2">We choose the kinds of insight and the comparison period for you.</span> Changes, recurring themes, spikes and key drivers are surfaced whenever your data supports them, and every card states the dates it compares. Use 👍 / 👎 on any card to tell us what's useful.</p>
      </div>

      <div class="border-t border-line2"></div>

      <!-- Custom fields -->
      <div>
        <p class="text-[12.5px] font-600 text-txt-1 mb-0.5">Custom fields</p>
        <p class="text-[11.5px] text-txt-3 mb-2.5">Factor these into how insights are found and grouped</p>
        <div class="space-y-1.5" id="fields-list">
          ${fieldRow('Store', cfgState.fields['Store'])}
          ${fieldRow('Country', cfgState.fields['Country'])}
          ${fieldRow('City', cfgState.fields['City'])}
          ${fieldRow('Product Category', cfgState.fields['Product Category'])}
          ${fieldRow('Visit Type', cfgState.fields['Visit Type'])}
          ${fieldRow('Loyalty Tier', cfgState.fields['Loyalty Tier'])}
        </div>
      </div>

      <div class="border-t border-line2"></div>

      <!-- Frequency -->
      <div>
        <p class="text-[12.5px] font-600 text-txt-1 mb-0.5">Frequency</p>
        <p class="text-[11.5px] text-txt-3 mb-2.5">How often a new edition of insights is published. Your feed only changes when a new edition arrives.</p>
        <div class="space-y-1.5" id="freq-list">
          ${freqRow('Daily','Every workday at 08:00. Best for high-volume stores, or for catching problems the next morning.',cfgState.frequency==='Daily')}
          ${freqRow('Weekly','First day of your workweek at 08:00.',cfgState.frequency==='Weekly', 'Recommended for your store')}
          ${freqRow('Monthly','First workday of the month at 08:00.',cfgState.frequency==='Monthly')}
        </div>
        <p class="freq-vol" data-freq-volume>Your store gets about 16 responses a week. With daily editions, most days will have nothing new; those editions say so in one line instead of repeating the same cards.</p>
        <p class="text-[11px] text-txt-4 mt-2 leading-snug">A change takes effect from your next edition — the current one stays as it is.</p>
      </div>

      <div class="border-t border-line2"></div>

      <!-- Email: assigned by the CX admin; the user manages it within what the admin allows -->
      <div data-cfg-email>
        <p class="text-[12.5px] font-600 text-txt-1 mb-0.5">Email</p>
        <p class="text-[11.5px] text-txt-3 mb-2.5">Store Manager weekly digest · assigned by your CX team · arrives with each edition</p>
        <div class="flex items-center gap-3 text-[12px]">
          <a href="#" data-jlink="user" onclick="closeDrawer();openJourney('user');return false" style="color:#1a73e8;font-weight:500">Manage my email →</a>
          <a href="#" data-jlink="email" onclick="closeDrawer();openJourney('email');return false" style="color:#1a73e8">Preview the email →</a>
        </div>
      </div>

      <div class="border-t border-line2"></div>

      <!-- Feed format -->
      <div>
        <p class="text-[12.5px] font-600 text-txt-1 mb-0.5">Feed format</p>
        <p class="text-[11.5px] text-txt-3 mb-2.5">How insights are laid out on this page and in your digest</p>
        <div class="space-y-1.5" id="format-list">
          ${formatRow('Card feed','Full insight cards with evidence and actions — like this page.',cfgState.format==='Card feed')}
          ${formatRow('Compact list','One line per insight for a fast scan.',cfgState.format==='Compact list')}
          ${formatRow('Executive summary','A single AI-written paragraph highlighting only what changed.',cfgState.format==='Executive summary')}
        </div>
      </div>

    </div>

    <div class="border-t border-line2 px-5 py-3.5 flex items-center gap-2">
      <button class="btn-pri" onclick="saveConfig()">Save configuration</button>
      <button class="btn-sec" onclick="closeDrawer()">Cancel</button>
    </div>
  `;
}

function fieldRow(label, checked){
  return `<div class="flex items-center gap-2.5 py-1 cursor-pointer" onclick="toggleChk(this)">
    <span class="chk ${checked?'sel':''}">${checked?'<svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>':''}</span>
    <span class="text-[13px] text-txt-1">${label}</span>
  </div>`;
}
function toggleChk(row){
  const chk = row.querySelector('.chk');
  const on = chk.classList.toggle('sel');
  chk.innerHTML = on ? '<svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : '';
}

function freqRow(label, sub, sel, badge){
  return `<div class="opt-card ${sel?'sel':''}" data-freq="${label}" onclick="pickRadio(this,'freq-list')">
    <div class="flex items-center gap-2.5">
      <span class="radio ${sel?'sel':''}"></span>
      <div><p class="text-[13px] font-500 text-txt-1">${label}${badge ? `<span class="freq-rec">${badge}</span>` : ''}</p><p class="text-[11.5px] text-txt-3">${sub}</p></div>
    </div>
  </div>`;
}
function formatRow(label, sub, sel){
  return `<div class="opt-card ${sel?'sel':''}" onclick="pickRadio(this,'format-list')">
    <div class="flex items-center gap-2.5">
      <span class="radio ${sel?'sel':''}"></span>
      <div><p class="text-[13px] font-500 text-txt-1">${label}</p><p class="text-[11.5px] text-txt-3">${sub}</p></div>
    </div>
  </div>`;
}
function pickRadio(el, groupId){
  document.getElementById(groupId).querySelectorAll('.opt-card').forEach(o=>{
    o.classList.remove('sel'); o.querySelector('.radio').classList.remove('sel');
  });
  el.classList.add('sel'); el.querySelector('.radio').classList.add('sel');
}

function chip(name){
  return `<span class="chip-x">${name}<svg class="w-3 h-3 cursor-pointer text-txt-4" onclick="this.closest('.chip-x').remove()" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12"/></svg></span>`;
}
function addRecipient(){
  const inp=document.getElementById('recipient-input');
  if(!inp.value.trim())return;
  document.getElementById('recipients').insertAdjacentHTML('beforeend', chip(inp.value.trim()));
  inp.value='';
}

function saveConfig(){
  // read current DOM selections
  const freqSel = document.querySelector('#freq-list .opt-card.sel p.font-500');
  const fmtSel = document.querySelector('#format-list .opt-card.sel p.font-500');
  const subEl0 = document.getElementById('sub-toggle');
  const subOn = subEl0 ? subEl0.classList.contains('on') : cfgState.subscribed;
  const recipEls = document.getElementById('recipients') ? [...document.querySelectorAll('#recipients .chip-x')].map(c=>c.childNodes[0].textContent.trim()) : cfgState.recipients;
  const fieldEls = [...document.querySelectorAll('#fields-list > div')];
  const fieldLabels = ['Store','Country','City','Product Category','Visit Type','Loyalty Tier'];

  // persist into cfgState so reopening Configure shows what was actually saved, not defaults
  fieldEls.forEach((r,i)=>{ if(fieldLabels[i]) cfgState.fields[fieldLabels[i]] = r.querySelector('.chk').classList.contains('sel'); });
  if(freqSel) cfgState.frequency = freqSel.closest('[data-freq]').dataset.freq;
  pendingFreq = (cfgState.frequency!==editionFreq) ? cfgState.frequency : null;   // never refreshes now
  if(fmtSel) cfgState.format = fmtSel.textContent;
  cfgState.subscribed = subOn;
  cfgState.recipients = recipEls;

  // reflect selections back where they're still shown (sidebar summary stats were removed
  // when Insight Objectives was demoted to a slim line, so these are now best-effort/no-op
  // if their old display elements aren't present).
  const cfgFreq = document.getElementById('cfg-freq'); if(freqSel && cfgFreq) cfgFreq.textContent = cfgState.frequency;
  const cfgFields = document.getElementById('cfg-fields'); if(cfgFields) cfgFields.textContent = Object.values(cfgState.fields).filter(Boolean).length + ' factored in';
  const cfgFormat = document.getElementById('cfg-format'); if(fmtSel && cfgFormat) cfgFormat.textContent = fmtSel.textContent;
  const subEl = document.getElementById('cfg-sub');
  if(subEl){
    subEl.innerHTML = subOn
      ? `<span class="w-1.5 h-1.5 rounded-full" style="background:#34a853"></span>${recipEls.length} subscribed`
      : `<span class="w-1.5 h-1.5 rounded-full" style="background:#9aa0a8"></span>Not subscribed`;
    subEl.style.color = subOn ? '#137333' : '#6b7280';
  }

  // dismissed, done and followed insights stay out of the active feed — one visibility rule
  applyFeedVisibility();

  closeDrawer();
  renderEditionBar();
  toast(pendingFreq ? ('Saved — ' + pendingFreq.toLowerCase() + ' editions start ' + EDITION_SCHEDULE[pendingFreq].next.replace(', 08:00 AST','') + '. Your current edition stays as it is until then.') : 'Insights configuration saved');
}
