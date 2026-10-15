/* ═══ CARDS BY INSIGHT TYPE — one sample card per type; a review page, not a product screen ═══ */
const TY_ICON = d=>`<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d}"/></svg>`;
['segment','trend','seasonal','emerging'].forEach((k,i)=>{ if(!TYPE_PILL[k]) TYPE_PILL[k] = {bg:'#f1f3f7', fg:'#42474f', icon:TY_ICON([
  'M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m8-5.13a3 3 0 11-6 0 3 3 0 016 0zM9 10a3 3 0 11-6 0 3 3 0 016 0z',
  'M3 17l6-6 4 4 8-8m0 0h-5m5 0v5',
  'M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z',
  'M12 3v3m0 12v3m9-9h-3M6 12H3m14.5-6.5l-2 2m-7 7l-2 2m0-11l2 2m7 7l2 2'][i])}; });
const tySpark = hs=>`<div style="display:flex;align-items:flex-end;justify-content:flex-end;gap:3px;height:26px;margin-top:8px">${hs.map(([h,on])=>`<span style="display:inline-block;width:6px;height:${h}px;border-radius:1px;background:${on?'#42474f':'#d7dae0'}"></span>`).join('')}</div>`;
// Built from the Sprinklr Copilot's analysis of the full Redtag survey (all stores, data to 16 Aug 2026).
// Each card says whether it is real data, partly real or improvised, and what was corrected.
const TY_BARS = rows=>`<div class="ic-bars">${rows.map(([l,w,top])=>`<div${top?' class="top"':''}><span>${l}</span><i style="width:${w}px"></i></div>`).join('')}</div>`;
const TYPE_SAMPLES = [
  {type:'comparison', release:'First release', q:'Did a score move against the baseline period?',
   figure:'The score, the change, and the value it is compared with', chart:'None',
   basisTxt:'The two periods compared and their response counts', labels:'New · In N editions in a row · Back',
   src:'real', srcNote:'Means, SDs, counts and the share of low scores come from the Copilot. Significance was computed from them: p < 0.0001 for both the average and the low-score share.',
   fix:'The Copilot\'s baseline was 16 weeks (23 Feb – 14 Jun), not 8, and it includes Ramadan. The figures are shown as returned; the comparison needs an equal 8-week re-run before it is published. Headline moved to the low-score share, which is easier to act on at scores near 9.',
   card:{prio:'pos', kind:'Period comparison · Overall satisfaction', title:'Fewer customers gave low scores in the last 8 weeks',
     sum:'9.0% of customers scored their visit 6 or below, down from 11.2%. The average rose to 9.08 from 8.89 across all stores.',
     next:'find out what changed in stores since mid-June before assuming it will last.',
     stat:'<p class="ic-num" style="color:#0e8a5f">9.0%</p><p class="ic-unit">scored 6 or below</p><p class="ic-delta up">▼ 2.2 pts<small>vs 11.2%</small></p>',
     basis:'All stores · 15 Jun – 9 Aug 2026 vs 23 Feb – 14 Jun 2026 · 9,077 vs 21,650 responses'}},
  {type:'recurring', release:'First release', q:'Which issues keep showing up in comments?',
   figure:'The word "Recurring" when there is no reliable count; a mention count when there is one', chart:'None',
   basisTxt:'The two periods the theme was seen in', labels:'In N editions in a row · N editions · no action · Back',
   src:'partial', srcNote:'Real: the Copilot found helpful, friendly service in comments from both periods, with dated quotes such as "Good service" (10 Jul) and "عملاء ممتازين" (29 Jul).',
   fix:'Text analytics counts were not available, so the card shows "Recurring" instead of a number, as the card rules require. A staff name in the Copilot\'s quotes was removed.',
   card:{prio:'pos', kind:'Recurring theme · Service', title:'Helpful, friendly service keeps coming up in comments',
     sum:'Customers praise polite, helpful and fast service in comments from both periods. A count is not shown because theme counts were not available.',
     next:'name the service behaviours customers praise in the next team briefing.',
     stat:'<p class="ic-num word">Recurring</p><p class="ic-unit">seen in both periods</p>',
     basis:'All stores · 15 Jun – 9 Aug 2026 and the period before'}},
  {type:'anomaly', release:'First release', q:'Did something break sharply from normal?',
   figure:'The value on the days of the event, with the usual level beside it', chart:'Day by day, with the drop picked out',
   basisTxt:'The days affected, their responses, and the normal range', labels:'New · Ended (date) · not opened. Never gets louder with age',
   src:'real', srcNote:'Daily averages and counts come from the Copilot: 8.45 on 7 Jul (157 responses) and 8.29 on 8 Jul (176), against a 90-day daily average of 9.24 (SD 0.39). Both are more than 4 standard errors below normal.',
   fix:'The Copilot first said 3 days crossed the threshold; only 2 do. 9 Jul (8.50) is close but above it. The Copilot\'s baseline window started on the anomaly itself; the drop holds either way.',
   card:{prio:'high', kind:'Anomaly · Overall satisfaction', title:'Satisfaction dropped sharply on 7–8 Jul across all stores',
     sum:'Daily averages fell to 8.45 and 8.29 on 7–8 Jul, across 333 responses, then recovered the following week to 9.07.',
     next:'check whether a promotion, system issue or staffing change links these 2 days.',
     stat:'<p class="ic-num" style="color:#c5221f">8.29</p><p class="ic-unit">on 8 Jul</p><p class="ic-unit">usual: 9.24</p>' + tySpark([[19],[18],[20],[19],[9,1],[6,1],[10],[18],[20],[19]]),
     basis:'All stores · daily averages · 157 and 176 responses on 7–8 Jul · normal range from the last 90 days'}},
  {type:'driver', release:'First release', q:'Which factor is most associated with the score?',
   figure:'The top factor\'s share of the variation in the score', chart:'The factors ranked, top one picked out',
   basisTxt:'The window the ranking was calculated over', labels:'In N editions in a row · "Previously: (factor)" when the top factor changes',
   src:'improv', srcNote:'Real: the 7 factor questions in the Redtag survey, used as named here.',
   fix:'The Copilot\'s model used 11 rows and returned R² 1.00, so it is not valid and its ranking is not used. The shares and scores on this card are placeholders until a regression on individual responses runs.',
   card:{prio:'med', kind:'Key driver · Store factors', title:'Appearance of the store is most associated with overall satisfaction',
     sum:'Of 7 store factors, appearance of the store moves most with overall satisfaction, followed by how easy it is to find things.',
     next:'review store appearance standards in the lowest-scoring stores first.',
     stat:'<p class="ic-num">28%</p><p class="ic-unit">of satisfaction variation</p>' + TY_BARS([['Appearance',48,1],['Easy to find',38],['Ease of checkout',30],['Size availability',22],['Value for money',17]]),
     basis:'All stores · last 90 days · placeholder figures'}},
  {type:'segment', release:'First release', q:'Is one group\'s experience different from another\'s?',
   figure:'The gap between the groups', chart:'The groups side by side',
   basisTxt:'The period, the groups compared, and that each has enough responses', labels:'New · In N editions in a row · Back',
   src:'real', srcNote:'Region means, SDs and counts come from the Copilot. QRO vs DRO: gap 0.95, p < 0.0001. Also real and significant: Gold members 8.71 vs Silver 9.14 (p < 0.0001).',
   fix:'The Copilot called DRO "Dubai"; region codes are shown as they appear in the data until their names are confirmed. Segment counts add to 9,066 of 9,077 because 11 responses have no region.',
   card:{prio:'high', kind:'Segment comparison · Region', title:'Satisfaction in QRO and ORO trails the other regions',
     sum:'QRO averaged 8.46 from 282 responses and ORO 8.48 from 438, against 9.42 in DRO from 809. The gap is statistically significant.',
     next:'compare store operations in QRO and ORO with the highest-scoring regions.',
     stat:'<p class="ic-num">−0.95</p><p class="ic-unit">points, QRO vs DRO</p>' + TY_BARS([['DRO',45],['WRO',41],['ORO',15,1],['QRO',15,1]]),
     basis:'All stores · 15 Jun – 9 Aug 2026 · regions with 100+ responses'}},
  {type:'trend', release:'Proposed', q:'Is a score or theme drifting steadily over several periods?',
   figure:'How many periods in a row it has moved the same way', chart:'The last 8 periods, with the run picked out',
   basisTxt:'The number of periods looked at', labels:'N weeks running · Trend ended · Back',
   src:'real', srcNote:'Weekly averages come from the Copilot: 9.17, 9.16, 9.12 and 9.04 for the weeks of 20 Jul to 10 Aug.',
   fix:'The Copilot reported no trend, which is right under the 4-week rule: this is a 3-week slide. It would not be published yet, and is shown so the type has a real example.',
   card:{prio:'low', kind:'Trend · Overall satisfaction', title:'Weekly satisfaction has slipped 3 weeks running',
     sum:'The weekly average eased from 9.17 to 9.04 over 3 weeks. This is below the 4-week rule, so it would not yet be published.',
     next:'watch next week\'s average before acting.',
     stat:'<p class="ic-num">3</p><p class="ic-unit">weeks running, down</p>' + tySpark([[25],[17],[7],[19],[23],[22,1],[21,1],[18,1]]),
     tags:'<span class="fresh-tag upd">3 weeks running</span>',
     basis:'All stores · weeks of 22 Jun – 10 Aug 2026 · 644 to 1,296 responses a week'}},
  {type:'seasonal', release:'Proposed', q:'Does this happen at the same point in every cycle?',
   figure:'How many earlier cycles showed it', chart:'None',
   basisTxt:'Which moment of the season it is, and the earlier cycles it draws on', labels:'Before the season · During the season · Season review · Last seen: previous season',
   src:'real', srcNote:'Means, SDs and counts for both Ramadans come from the Copilot. 2025: 8.49 vs 8.81 (p = 0.02). 2026: 8.78 vs 8.93 (p = 0.23, not significant).',
   fix:'The Copilot headline said 2026 was "flat"; it was lower, but not significantly. With 2 cycles and one not significant, this is a heads-up, not a pattern.',
   card:{prio:'med', kind:'Seasonal pattern · Ramadan', title:'Satisfaction dipped during Ramadan in both of the last 2 years',
     sum:'Scores were lower in Ramadan than in the 4 weeks before, in 2025 (8.49 vs 8.81) and 2026 (8.78 vs 8.93). Only the 2025 drop is significant.',
     next:'plan checkout and floor cover for the Ramadan weeks.',
     stat:'<p class="ic-num word">2 of 2</p><p class="ic-unit">Ramadans scored lower</p>',
     tags:'<span class="fresh-tag upd">Before the season</span>',
     basis:'All stores · Ramadan 2025 and 2026 vs the 4 weeks before each · 827 and 619 responses in Ramadan'}},
  {type:'emerging', release:'Proposed', q:'Is there a new topic in comments we have not seen before?',
   figure:'How many different respondents mentioned it', chart:'None',
   basisTxt:'The recent weeks looked at, and the earlier months it was absent from', labels:'New theme, for at most 3 editions. After that it becomes a Recurring theme',
   src:'improv', srcNote:'Real: fitting-room requests appear in real comments the Copilot returned, e.g. "الرجاء عمل غرفه للقياس" (please make a fitting room) and "A fitting room would be an incredible addition".',
   fix:'Text analytics counts were not available, so whether the theme is new could not be tested. The counts on this card are placeholders.',
   card:{prio:'med', kind:'Emerging theme · Fitting rooms', title:'Requests for fitting rooms appear in recent comments',
     sum:'Customers ask for fitting rooms in recent comments, a request not seen in the 6 months before.',
     next:'check which stores lack fitting rooms and share the requests with the Central team.',
     stat:'<p class="ic-num">14</p><p class="ic-unit">respondents, last 4 weeks</p><p class="ic-unit">none in the 6 months before</p>',
     tags:'<span class="fresh-tag new">New theme</span>',
     basis:'All stores · last 4 weeks of comments vs the 6 months before · placeholder counts'}}
];
const SRC_LABEL = {real:'Real Redtag data', partial:'Partly real', improv:'Improvised'};
function typeSampleCard(t){
  const c = t.card;
  const srcTag = `<span class="src-tag ${t.src}" data-src="${t.src}">${SRC_LABEL[t.src]}</span>`;
  return jrCard({variant:'feed', type:t.type, prio:c.prio, kind:c.kind, title:c.title, sum:c.sum, next:SM + c.next, stat:c.stat, basis:c.basis,
    tags:(c.tags ? [{html:c.tags}] : []).concat([{html:srcTag}])});
}
function cardTypesHTML(){
  const rows = TYPE_SAMPLES.map(t=>`<tr><td>${TYPE_LABEL[t.type]}</td><td>${t.figure}</td><td>${t.chart}</td><td>${t.labels}</td><td>${t.release}</td><td><span class="src-tag ${t.src}">${SRC_LABEL[t.src]}</span></td></tr>`).join('');
  const sections = TYPE_SAMPLES.map((t,i)=>`
    <section class="lo-opt" data-ty-type="${t.type}">
      <div class="lo-side ty-side">
        <span class="lo-letter">${i+1}</span>
        <h2>${TYPE_LABEL[t.type]}</h2>
        <span class="tag${t.release==='Proposed'?' wrn':''}">${t.release}</span>
        <dl><dt>Question it answers</dt><dd>${t.q}</dd>
          <dt>Key figure</dt><dd>${t.figure}</dd>
          <dt>Basis line</dt><dd>${t.basisTxt}</dd>
          <dt>Labels it can carry</dt><dd>${t.labels}</dd></dl>
        <div class="ty-data ${t.src}" data-ty-data><b>${SRC_LABEL[t.src]}.</b> ${t.srcNote}</div>
        <div class="ty-fix"><b>What was corrected or filled in.</b> ${t.fix}</div>
      </div>
      <div class="lo-cards lay-${cardLayout}">${typeSampleCard(t)}
        <p class="ty-src" data-ty-src>${t.src==='real' ? 'Real data from the Redtag survey, all stores.' : t.src==='partial' ? 'Partly real: see what was filled in.' : 'Improvised: placeholders where the data was not available.'}</p></div>
    </section>`).join('');
  const bright = '';
  return `<div class="hm-proto"><b>Prototype · Cards by insight type</b>
      <button style="margin-left:auto" data-ty-close onclick="closeCardTypes()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="lo-wrap">
      <h1>Cards by insight type</h1>
      <p class="lo-lede">One card for each of the 8 types, built from the Sprinklr Copilot's analysis of the full Redtag survey: all stores, data to 16 Aug 2026. 5 cards use real data, 1 is partly real and 2 are improvised where the Copilot could not compute the analysis. Each card says which, and what was corrected. The card structure is the same for every type.</p>
      <p class="ty-h">The same on every card</p>
      <div class="ty-same"><span>Priority</span><span>Type and topic</span><span>Headline</span><span>Supporting sentence</span><span>Suggested next step</span><span>Key figure</span><span>Basis</span><span>Actions</span></div>
      <p class="ty-h">What changes by type</p>
      <table class="lo-table"><thead><tr><th>Type</th><th>Key figure</th><th>Small chart</th><th>Labels across editions</th><th>Release</th><th>Data</th></tr></thead><tbody>${rows}</tbody></table>
      ${sections}${bright}
    </div></div>`;
}
function openCardTypes(){
  const layer = document.getElementById('types-layer');
  layer.innerHTML = cardTypesHTML();
  layer.classList.add('show');
  const sc = layer.querySelector('.lo-scroll'); if(sc) sc.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}
function closeCardTypes(){
  document.getElementById('types-layer').classList.remove('show');
  document.body.style.overflow = '';
}

function syncPaneLayout(){
  const open = ['investigate-panel','followed-panel','shared-panel','quiet-panel'].some(id=>{ const p = document.getElementById(id); return p && !p.classList.contains('hidden') && p.offsetParent!==null; });
  document.body.classList.toggle('no-pane', !open);
}
