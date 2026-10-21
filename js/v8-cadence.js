/* ═══ v8 — frequency, made explicit (follow-up to the 19 Oct review)
   Three separate things, each with one owner:
   · cadence: when you hear (daily / weekly / monthly) — the user picks it, to match how often they act
   · window: what each update compares — follows the cadence by default; longer periods are added when they close
     (a daily user still sees a month-on-month drop on the 1st), and sudden spikes show up whatever the cadence
   · volume: the shortest window that can ever be significant — the system decides, and says so ═══ */

const V8_WINDOW = {
  Daily:   {now:'the latest day',   base:'the 28 days before',  closes:'week and month'},
  Weekly:  {now:'the latest week',  base:'the 12 weeks before', closes:'month and quarter'},
  Monthly: {now:'the latest month', base:'the 3 months before', closes:'quarter and year'}
};
// responses a week, from the setup data for this store (P.volume.note: "About 16 responses a week")
const V8_PER_WEEK = 16;
const V8_VOLUME = {
  Daily:   `This store gets about ${V8_PER_WEEK} responses a week, too few to compare single days reliably. Most daily updates will carry only spikes, plus the week and month comparisons when those periods close.`,
  Weekly:  `This store gets about ${V8_PER_WEEK} responses a week, enough for a weekly comparison. Recommended.`,
  Monthly: `Monthly gives each comparison the most responses, but a slow problem could wait up to a month. Spikes still show up in the next update.`
};
function v8WindowText(f){
  const w = V8_WINDOW[f] || V8_WINDOW.Weekly;
  return `Each update compares <b>${w.now}</b> with ${w.base}. When a ${w.closes.split(' and ')[0]} or ${w.closes.split(' and ')[1]} ends, that update also compares it with the one before. Sudden spikes appear in the next update whatever you choose.`;
}

/* the feed says what it compares, with a way to change it */
const _v8Bar = renderEditionBar;
renderEditionBar = function(){
  _v8Bar();
  const el = document.getElementById('edition-bar'); if(!el) return;
  const f = (typeof editionFreq!=='undefined' && V8_WINDOW[editionFreq]) ? editionFreq : 'Weekly', w = V8_WINDOW[f];
  el.querySelectorAll('[data-v8-window]').forEach(n=>n.remove());
  const bar = el.querySelector('[data-edition-bar]');
  if(bar) bar.insertAdjacentHTML('afterend', `<p class="v8-win" data-v8-window>${f} updates · compares ${w.now} with ${w.base}, and each ${w.closes} when it ends · <a href="#" onclick="openDrawer('configure');return false">Change</a></p>`);
};

/* Configure: the frequency section explains the window and the volume for the option picked */
const _v8Cfg = configureHTML;
configureHTML = function(){
  let h = _v8Cfg();
  h = h.replace('We choose the kinds of insight and the comparison period for you.', 'We choose the kinds of insight for you.')
       .replace('How often a new edition of insights is published. Your feed only changes when a new edition arrives.', 'How often you get an update. This also sets what each update compares.')
       .replace('A change takes effect from your next edition — the current one stays as it is.', 'A change takes effect from your next update.')
       .replace('Every workday at 08:00. Best for high-volume stores, or for catching problems the next morning.', 'Every workday at 08:00. Best for high-volume surveys.');
  const f = cfgState.frequency || 'Weekly';
  h = h.replace(/<p class="freq-vol" data-freq-volume>[\s\S]*?<\/p>/, `<div class="v8-cmp" data-v8-cmp><span>What each update compares</span><p>${v8WindowText(f)}</p></div><p class="freq-vol" data-freq-volume>${V8_VOLUME[f]}</p>`);
  return h;
};
const _v8Pick = pickRadio;
pickRadio = function(el, groupId){
  _v8Pick(el, groupId);
  if(groupId!=='freq-list') return;
  const f = el.dataset.freq, cmp = document.querySelector('[data-v8-cmp] p'), vol = document.querySelector('[data-freq-volume]');
  if(cmp) cmp.innerHTML = v8WindowText(f);
  if(vol) vol.innerHTML = V8_VOLUME[f];
};

/* use cases: replace the v7 cadence row with the rule */
(function(){
  const i = UC_ROWS.findIndex(r=>r[0]==='Cadence' && /sets the comparison window/.test(r[1]));
  const row = ['Cadence','Cadence is when you hear; the comparison window follows it; longer periods are added when they close; spikes always show; response volume sets the shortest window','h','—','Answers the 19 Oct question "does a daily user ever see a monthly NPS drop?" (yes, when the month closes). The 28-day, 12-week and 3-month baselines are proposed defaults, not validated.','Configure → Frequency; the line under "Updated" in the feed'];
  if(i>-1) UC_ROWS[i] = row; else UC_ROWS.push(row);
})();

/* a quiet update: nothing new, so the feed stays as it was with one line saying so (no separate "still true" view) */
var v8Quiet = false;
V7_READ_SEED.quiet = V7_READ_SEED.quiet.concat(['FOL-01','FOL-02']);   // nothing new, so nothing unread
enterQuiet = function(){
  v8Quiet = true;
  const q = document.getElementById('journey-quiet'); if(q){ q.classList.add('hidden'); q.innerHTML = ''; }
  const r = document.getElementById('journey-returning'); if(r) r.classList.remove('hidden');
  renderEditionBar(); applyFeedVisibility();
};
const _v8Leave = leaveQuiet;
leaveQuiet = function(){ v8Quiet = false; _v8Leave(); };
const _v8Bar2 = renderEditionBar;
renderEditionBar = function(){
  _v8Bar2();
  const g = document.getElementById('card-grid'); if(g) g.classList.toggle('v8-q', v8Quiet);
  if(!v8Quiet || typeof QUIET_ED==='undefined') return;
  const el = document.getElementById('edition-bar'); if(!el) return;
  const tag = el.querySelector('[data-edition-tag]');
  if(tag) tag.innerHTML = `Updated <b style="color:#1f2329">${QUIET_ED.short}</b> · next update ${QUIET_ED.next}`;
  const bar = el.querySelector('[data-edition-bar]');
  if(bar && !el.querySelector('[data-v8-quiet]')) bar.insertAdjacentHTML('afterend', `<div class="v8-quiet" data-v8-quiet><b>Nothing new in the ${QUIET_ED.short} update.</b> Responses came in at the usual level, about ${V8_PER_WEEK} a week, and nothing in them was significant. Your insights from earlier updates are below.</div>`);
};

renderEditionBar();
