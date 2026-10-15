/* ═══ CARD JOURNEYS — step-by-step walk-throughs of how a card changes; a review page, not a product screen ═══ */
let jrTab = 'followed';
const JR_LOCK = '<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>';
const JR_X = '<span class="iconbtn dismiss-x"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"/></svg></span>';
const JR_SHARE = '<span class="iconbtn"><svg class="w-4 h-4 text-txt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6" d="M8.68 13.34a3 3 0 100-2.68m0 2.68a3 3 0 110-2.68m0 2.68l6.64 3.98m0-9.98a3 3 0 100-2.68 3 3 0 000 2.68zm0 0L8.68 10.66m6.64 6.66a3 3 0 100 2.68 3 3 0 000-2.68z"/></svg></span>';
const JR_CHECK = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M5 13l4 4L19 7"/></svg>';
const jrH = (on, html)=> on ? `<span class="jr-chg">${html}</span>` : html;
const jrTag = { new:'<span class="fresh-tag new">New</span>', back:'<span class="fresh-tag upd">Back</span>',
  stale:n=>`<span class="fresh-tag stale">${n} editions · no action</span>`,
  plan:(st, owner)=>`<span class="plan-chip${st==='Completed'?' done':''}">${planChipInner({status:st, owner:owner||'You'})}</span>`,
  sharedBy:n=>`<span class="tag">${SHARE_ICON}Shared by ${n}</span>`,
  scope:t=>`<span class="tag">Scope: ${t}</span>`,
  access:t=>`<span class="tag wrn">${JR_LOCK}${t}</span>`,
  requested:'<span class="tag">Access requested</span>' };
function jrActs(c){
  const g = c.chg || {};
  const thumbs = feedbackHTML('JR');
  const planBtn = jrH(g.planBtn, `<span class="iconbtn${c.hasPlan?' has-plan':''}">${PLAN_ICON}</span>`);
  const done = `<button class="btn-sec${c.suggestDone?' suggest':''}">${JR_CHECK}Mark as done</button>`;
  if(c.variant==='followed') return `${thumbs}${JR_SHARE}${planBtn}${jrH(g.following, `<button class="btn-sec on">${FOLLOW_ON_HTML}</button>`)}${jrH(g.done, done)}<button class="btn-pri">${STAR_ICON}Investigate</button>`;
  if(c.variant==='shared') return `${planBtn}${jrH(g.follow, `<button class="btn-sec${c.following?' on':''}">${c.following ? FOLLOW_ON_HTML : FOLLOW_OFF_HTML}</button>`)}${done}<button class="btn-pri">${STAR_ICON}View insight</button>`;
  const cta = 'investigate';
  const inv = `<button class="${cta==='investigate'?'btn-pri':'btn-sec'}">${STAR_ICON}Investigate</button>`;
  const main = cta==='plan' ? `<button class="btn-pri">${PLAN_ICON}Create action plan</button>` : cta==='share' ? `<button class="btn-pri">${SHARE_ICON}Share</button>` : '';
  return `${thumbs}${cta==='share' ? '' : jrH(g.share, JR_SHARE)}${cta==='plan' ? '' : planBtn}${jrH(g.follow, `<button class="btn-sec">${FOLLOW_OFF_HTML}</button>`)}${jrH(g.done, done)}${inv}${main}`;
}
function jrCard(c){
  const g = c.chg || {};
  const tags = (c.tags||[]).map(t=>jrH(t.chg, t.html)).join('');
  const right = (c.right||[]).map(t=>jrH(t.chg, t.html)).join('');
  const f = c.from;
  const from = f ? `<div class="ic-from${f.chg?' jr-chg-b':''}"><span class="ic-av">${f.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}</span>
      <div class="ic-from-text"><p><b>${f.name}</b><span>${f.role} · shared ${f.when}</span>${f.isNew?'<span class="fresh-tag new">New</span>':''}</p>${f.note?`<p class="ic-note">&ldquo;${f.note}&rdquo;</p>`:''}</div></div>` : '';
  return `<div class="sample-card jr-card ic spr-card" data-priority="${c.prio}">${from}
    <div class="ic-body">
      <div class="ic-head"><div class="ic-kind">${jrH(g.prio, `<span class="prio ${c.prio}"><i></i>${PRIO_LABEL[c.prio]}</span>`)}<span class="ic-type">${TYPE_PILL[c.type].icon}<span>${c.kind}</span></span>${tags}</div><div class="ic-tags">${right}</div></div>
      <div class="ic-main">
        <div class="ic-text"><p class="ic-title">${jrH(g.title, c.title)}</p><p class="ic-sum">${jrH(g.sum, c.sum)}</p>
          <p class="ic-next">${NEXT_ARROW}<span>${jrH(g.next, c.next)}</span></p>${c.meta ? `<p class="ic-meta">${jrH(g.meta, c.meta)}</p>` : ''}${c.extra ? jrH(g.extra, c.extra) : ''}</div>
        <div class="ic-stat${c.muted?' muted':''}${g.stat?' jr-chg-b':''}">${c.stat}</div>
      </div>
    </div>
    <div class="ic-foot"><p class="ic-basis">${jrH(g.basis, c.basis)}</p><div class="ic-acts">${jrActs(c)}</div></div>
  </div>`;
}
const jrTiles = arr=>`<div class="ev"><div class="ev-tiles">${arr.map(([k,v,cl])=>`<div class="ev-tile"><div class="k">${k}</div><div class="v ${cl||''}">${v}</div></div>`).join('')}</div></div>`;
const SM = '<span class="font-600">Recommended action:</span> ';

// ── the three journeys ────────────────────────────────────────────────────────────────────────────
function jrFollowedSteps(){
  const bars = `<div class="ic-bars"><div class="top"><span>Cleanliness</span><i style="width:48px"></i></div><div><span>Staff help</span><i style="width:37px"></i></div><div><span>Checkout</span><i style="width:28px"></i></div></div>`;
  const drv = (pct, extra)=>`<p class="ic-num">${pct}</p><p class="ic-unit">of satisfaction variation</p>${bars}${extra||''}`;
  const since = (d, dir)=>`<p class="ic-since">${dir==='down'?'▼':'▲'} ${d}<small>since you followed</small></p>`;
  const base = {type:'driver', prio:'high', kind:'Key driver · Cleanliness',
    title:'Store &amp; fitting-room cleanliness is most associated with low satisfaction',
    sum:'Of 5 service factors, cleanliness has the strongest association with overall satisfaction — and it is also the lowest-scoring one.',
    next: SM + 'add a fitting-room reset to each shift checklist, especially at peak hours.'};
  const fol = (o)=>Object.assign({}, base, {variant:'followed'}, o);
  const latest = t=>`<span class="font-600" style="color:#42474f">Latest:</span> ${t}`;
  const meta = (t, n)=>'Followed Mon 21 Sep at 28% · ' + latest(t) + (n ? ' · ' + n + (n===1?' comment':' comments') : '');
  const upd = {html:'<span class="fresh-tag upd">Updated</span>'};
  const quiet = {title:'Cleanliness is no longer clearly ahead of the other factors',
    sum:'Cleanliness is still among the factors most associated with satisfaction, but its lead over staff helpfulness is within normal variation this edition.',
    next: SM + 'no new action; keep the fitting-room reset in the shift checklist.'};
  const ev = t=>`<span class="fol-out">${t}</span>`;
  const panel = (rows, thenTitle)=>`<div class="jr-panel spr-card">${sinceSectionHTML({on:'Mon 21 Sep', thenVal:'28%', thenTitle:thenTitle||'', nowEd:rows[rows.length-1].ed, nowVal:rows[rows.length-1].now || rows[rows.length-1].val, nowEv:rows[rows.length-1].ev, rows})}</div>`;
  const R = {
    s20:{ed:'Sun 20 Sep', val:'28%', ev:'sig', feed:true, what:'You followed it'},
    s27:{ed:'Sun 27 Sep', val:'31%', ev:'sig', feed:true, what:'You created an action plan and commented'},
    o4: {ed:'Sun 4 Oct',  val:'29%', ev:'nosig', feed:false, what:'Omar Hassan commented'},
    o11:{ed:'Sun 11 Oct', val:'—', ev:'thin', feed:false, what:'41 of 60 responses needed', now:'29% <small>as of Sun 4 Oct</small>'},
    o18:{ed:'Sun 18 Oct', val:'25%', ev:'nosig', feed:false, what:'Action plan completed'}};
  return [
    {when:'Sun 20 Sep · new edition', where:'Feed', title:'The insight appears in the feed, and Sara follows it',
     text:'A normal feed card. Sara, the Store Manager, wants to keep watching it, so she clicks Follow.',
     changes:['Nothing yet: this is the starting point. The figure at this moment, 28%, is remembered.'],
     blocks:[jrCard(Object.assign({}, base, {variant:'feed', tags:[{html:jrTag.new}], stat:drv('28%'), basis:'Current period · New this edition', chg:{follow:true}}))]},
    {when:'Mon 21 Sep', where:'Followed', title:'Following moves the card to Followed, where it stays',
     text:'The card leaves the feed and lives in Followed until Sara unfollows it or marks it Done. Nothing removes it on its own, whatever happens to the data.',
     changes:['The activity line records <b>when she followed it and the figure then</b>: "Followed Mon 21 Sep at 28%".','No edition label: being current is the normal case.','Follow becomes <b>Following</b>. <b>Done</b> stays on the card.'],
     blocks:[jrCard(fol({stat:drv('28%'), meta:'Followed Mon 21 Sep at 28%', basis:'Current period', chg:{meta:true, following:true}}))]},
    {when:'Thu 24 Sep', where:'Followed', title:'Sara creates an action plan and leaves a comment',
     text:'The plan is created in Action Plans with the insight\'s headline, evidence and next step. From here the plan holds the owner and the status.',
     changes:['An <b>action plan</b> chip shows the plan\'s status and owner, read-only.','The activity line shows the <b>latest action</b> and the comment count.'],
     blocks:[jrCard(fol({hasPlan:true, right:[{html:jrTag.plan('Not started'), chg:true}], stat:drv('28%'), meta:meta('You commented, today', 1), basis:'Current period', chg:{meta:true, planBtn:true}}))]},
    {when:'Sun 27 Sep · new edition', where:'Followed', title:'A new edition recalculates it: the card shows now, and the change since following',
     text:'Every edition recalculates a followed insight with the same definition. The card always shows the current figure. Opening it shows the full context: what it was when she followed, what it is now, and every edition in between.',
     changes:['The <b>key figure</b> is the current one: 31%.','<b>▲ +3 pts since you followed</b> sits under it.','An <b>Updated</b> tag, and the card moves to the top of Followed. Opening it clears the tag.','In the drill-down, <b>Since you followed</b>: then and now, and one row per edition.'],
     changesTitle:'What changes',
     blocks:[jrCard(fol({hasPlan:true, tags:[Object.assign({chg:true}, upd)], right:[{html:jrTag.plan('In progress')}], stat:drv('31%', since('+3 pts')), meta:meta('You commented, 3 days ago', 1), basis:'Current period', chg:{stat:true}})),
             panel([R.s20, Object.assign({hl:true}, R.s27)])]},
    {when:'Sun 4 Oct · new edition', where:'Followed', title:'The finding is no longer significant',
     text:'Cleanliness is no longer clearly ahead of the other factors, so this is not a finding this edition and it is not in the feed. It stays in Followed, recalculated, and says so plainly. It does not say "resolved": not significant is not the same as fixed.',
     changes:['The <b>headline, sentence and next step are rewritten</b> to the current finding. The headline from when she followed stays in the drill-down.','A label replaces the basis: <b>Not a significant change · not in the feed</b>.','The figure, 29%, is shown <b>greyed</b>, so it is not read as a finding, and priority drops to <b>For awareness</b>.'],
     blocks:[jrCard(fol(Object.assign({}, quiet, {prio:'low', hasPlan:true, tags:[upd], right:[{html:jrTag.plan('In progress')}], muted:true, stat:drv('29%', since('+1 pt')), meta:meta('Omar Hassan commented, today', 2), basis:ev('Not a significant change · not in the feed'), chg:{prio:true, title:true, sum:true, next:true, stat:true, basis:true}})))]},
    {when:'Sun 11 Oct · new edition', where:'Followed', title:'Too few responses to say',
     text:'Fewer surveys came in this week. With 41 responses, below the 60 needed to rank the factors, the system does not publish a new figure. It shows the last reliable one, dated.',
     changes:['The label says <b>Too few responses this edition · 41 of 60 needed</b>.','The figure is the <b>last reliable one</b>, marked "as of Sun 4 Oct".'],
     blocks:[jrCard(fol(Object.assign({}, quiet, {sum:'Too few responses this edition to rank the factors. The last reliable figure is from the Sun 4 Oct edition.'}, {prio:'low', hasPlan:true, tags:[upd], right:[{html:jrTag.plan('In progress')}], stat:drv('29%', '<p class="ic-unit">as of Sun 4 Oct</p>' + since('+1 pt')), meta:meta('Omar Hassan commented, 7 days ago', 2), basis:ev('Too few responses this edition · 41 of 60 needed · showing the last reliable figure'), chg:{sum:true, stat:true, basis:true}})))]},
    {when:'Sun 18 Oct · new edition', where:'Followed', title:'It looks settled, so the card suggests closing it',
     text:'The action plan was completed in Action Plans, and there has been no significant finding for three editions in a row. The card suggests marking it Done. It is only a suggestion: the card stays until Sara decides.',
     changes:['A line under the activity says <b>Looks settled</b>, and why.','<b>Done</b> is highlighted.','The drill-down shows what the insight said when she followed it, what it says now, and every edition in between.'],
     blocks:[jrCard(fol(Object.assign({}, quiet, {sum:'Its share has fallen, and for the second edition with enough responses it is not clearly ahead of the other factors.'}, {prio:'low', hasPlan:true, suggestDone:true, tags:[upd], right:[{html:jrTag.plan('Completed'), chg:true}], muted:true, stat:drv('25%', since('−3 pts', 'down')), meta:meta('Action plan completed, today', 2),
       extra:'<p class="ic-settle"><span class="jr-chg">Looks settled: the action plan is completed. Mark it as done if there is nothing more to watch.</span></p>', basis:ev('Not a significant change · not in the feed'), chg:{done:true}}))),
             panel([R.s20, R.s27, R.o4, R.o11, Object.assign({hl:true}, R.o18)], 'Store &amp; fitting-room cleanliness is most associated with low satisfaction')]},
    {when:'Mon 19 Oct', where:'Done', title:'Sara marks it Done, and it leaves Followed',
     text:'Done closes the insight in one step. Its history, comments and action plan are kept with the topic.',
     changesTitle:'What happens next',
     changes:['The card <b>leaves Followed</b>.','The topic is <b>held back</b> from later editions.','If it gets materially worse, it returns to the <b>feed</b>, labelled Back, with its history. She can follow it again from there.'],
     blocks:[`<div class="ed-foot jr-chg-b" style="margin-top:0"><span style="flex:1"><b style="color:#42474f">Marked as done — removed from Followed.</b> Store &amp; fitting-room cleanliness is held back from later editions, and comes back to the feed only if it gets materially worse.</span></div>`]}
  ];
}
function jrEditionSteps(){
  const word = '<p class="ic-num word">Recurring</p><p class="ic-unit">seen in both periods</p>';
  const base = {variant:'feed', type:'recurring', prio:'med', kind:'Recurring theme · Promotions',
    title:'Offer clarity complaints remain visible',
    sum:'Comments about discount or offer clarity were still present this period, despite stronger satisfaction overall.',
    next: SM + 'audit promo signage and staff explanations; escalate if offer rules are unclear.', stat:word};
  const card = o=>jrCard(Object.assign({}, base, o));
  const drvBase = {variant:'feed', type:'driver', prio:'high', kind:'Key driver · Cleanliness',
    title:'Store &amp; fitting-room cleanliness is most associated with low satisfaction',
    sum:'Of 5 service factors, cleanliness has the strongest association with overall satisfaction — and it is also the lowest-scoring one.',
    next: SM + 'add a fitting-room reset to each shift checklist, especially at peak hours.'};
  const drv = pct=>`<p class="ic-num">${pct}</p><p class="ic-unit">of satisfaction variation</p><div class="ic-bars"><div class="top"><span>Cleanliness</span><i style="width:48px"></i></div><div><span>Staff help</span><i style="width:37px"></i></div><div><span>Checkout</span><i style="width:28px"></i></div></div>`;
  return [
    {when:'Sun 6 Sep · edition', where:'Feed', title:'The insight appears for the first time',
     text:'The system has not published this topic before, so the card is marked as new.',
     changes:['A <b>New</b> tag.','The basis says <b>New this edition</b>.'],
     blocks:[card({tags:[{html:jrTag.new, chg:true}], basis:'vs previous period · <span>New this edition</span>', chg:{basis:true}})]},
    {when:'Sun 13 Sep · edition', where:'Feed', title:'A week later it is still true',
     text:'The new edition finds the same topic again. It is the same card, recognised by its topic, not a second card. Its text and figures are recalculated from this edition\'s data.',
     changes:['The New tag goes.','The basis counts the repeat: <b>In 2 editions in a row</b>.'],
     blocks:[card({basis:'vs previous period · In 2 editions in a row', chg:{basis:true}})]},
    {when:'Sun 20 Sep · edition', where:'Feed', title:'Third edition, and nobody has acted',
     text:'Nobody has created an action plan from it, shared it, commented on it, followed it or closed it. A problem that keeps repeating without action should get louder. Priority would also rise one step if mentions were growing; here they are not, so it stays at Worth a look.',
     changes:['A <b>3 editions · no action</b> tag appears.','The basis now says <b>In 3 editions in a row</b>.'],
     blocks:[card({tags:[{html:jrTag.stale(3), chg:true}], basis:'vs previous period · In 3 editions in a row', chg:{basis:true}})]},
    {when:'Sun 27 Sep · edition', where:'Feed', title:'Sara has created an action plan',
     text:'During the week she created an action plan from the insight and added a comment. The next edition\'s card carries both over, because they attach to the topic, not to one edition.',
     changes:['An <b>action plan</b> chip shows the plan\'s status and owner, read-only.','The "no action" tag goes.','The basis says <b>In 4 editions in a row</b>.'],
     blocks:[card({hasPlan:true, right:[{html:jrTag.plan('In progress'), chg:true}], basis:'vs previous period · In 4 editions in a row', chg:{basis:true, planBtn:true}})]},
    {when:'Sun 4 Oct · edition', where:'Below the feed', title:'She marks it Done, so it is held back',
     text:'On 30 Sep the plan is completed and Sara marks the insight Done. Done is the one way to close an insight. For the rest of the 27 Sep edition the card sits under Done, where she can reopen it. When the 4 Oct edition publishes, the topic is still in the data, but the edition does not repeat something she has already dealt with.',
     changes:['<b>No card</b> in this edition.','The <b>Done list starts empty</b>: it only holds what was closed in the current edition. The closed card stays in the 27 Sep edition\'s record.','A <b>held-back note</b> at the end of the feed says why, so nothing vanishes silently. <b>Bring it back</b> undoes the Done from the next edition.'],
     blocks:[`<div class="ed-foot jr-chg-b" style="margin-top:0"><span style="flex:1"><b style="color:#42474f">Held back from this edition:</b> Offer clarity complaints remain visible — you marked it Done on 30 Sep, and it hasn't got worse. It comes back only if it gets materially worse.</span><span style="font-weight:600;color:#1a73e8;flex:none">See where it last appeared</span><span style="font-weight:600;color:#1a73e8;flex:none">Bring it back</span></div>`]},
    {when:'Sun 18 Oct · edition', where:'Feed', title:'It gets materially worse, so it comes back',
     text:'Mentions rise well above their earlier level. The same card returns, with its history, not a new card.',
     changes:['A <b>Back</b> tag, and the basis names the last edition it was in.','<b>Priority</b> is recalculated for this edition and rises to Needs attention.','The <b>sentence</b> is rewritten to say what changed.','Its comments and its earlier action plan come back with it.'],
     blocks:[card({prio:'high', hasPlan:true, tags:[{html:jrTag.back, chg:true}], right:[{html:jrTag.plan('Completed')}],
       sum:'Comments about discount or offer clarity rose sharply this period, after two editions in which the theme was held back.',
       basis:'vs previous period · Back — last in the Sun 27 Sep edition', chg:{prio:true, sum:true, basis:true}})]},
    {when:'Also', where:'Feed', title:'When the card has a number, the number is recalculated every edition',
     text:'A theme has no reliable count, so its figure reads "Recurring". For an insight with a number, each edition shows that edition\'s value. The card never carries an old figure forward.',
     changes:['Sun 20 Sep edition: <b>28%</b>.','Sun 27 Sep edition: <b>31%</b>, on the same card.'],
     blocks:[jrCard(Object.assign({}, drvBase, {tags:[{html:jrTag.new}], stat:drv('28%'), basis:'Current period · New this edition'})),
             jrCard(Object.assign({}, drvBase, {stat:drv('31%'), basis:'Current period · In 2 editions in a row', chg:{stat:true, basis:true}}))]}
  ];
}
function jrSharedSteps(){
  const cty = {type:'anomaly', kind:'Anomaly · Checkout &amp; payments',
    title:'Payment-failure complaints spiked across KSA stores on 14–15 Sep',
    stat:'<p class="ic-num" style="color:#c5221f">64</p><p class="ic-unit">mentions, 9 stores</p>'};
  const sara = Object.assign({}, cty, {variant:'shared', prio:'high',
    sum:'64 respondents across 9 KSA stores described payments failing at the till on the same two days. The same spike is visible at your store.',
    next: SM + 'confirm what happened at your tills on those days and reply to the Country Manager.',
    basis:'Shared · KSA · 42 stores',
    from:{name:'Khalid Al-Mansour', role:'Country Manager — KSA', when:'today', isNew:true, note:'Seeing this across 9 KSA stores. Can each store confirm what happened on their side?'}});
  const how = {same:'<span class="jr-how same">Same for both</span>', adapt:'<span class="jr-how adapt">Adapted to her data</span>', hide:'<span class="jr-how hide">Hidden from her</span>'};
  const quote = '<p class="jr-quote">&ldquo;My card was declined twice at the till but the bank says the payment never reached them.&rdquo;</p>';
  const row = (label, snd, me)=>`<div class="lb">${label}</div><div class="snd">${snd}</div><div class="me">${me}</div>`;
  const cmp = `<div class="jr-cmp" data-jr-cmp>
      <div class="hd"></div>
      <div class="hd snd"><b>Khalid · Country Manager</b>Can see KSA · all 42 stores</div>
      <div class="hd me"><b>Sara · Store Manager</b>Can see RT ATYAF MALL only</div>
      ${row('Headline',
        '<p style="color:#111318;font-weight:600">Payment-failure complaints spiked across KSA stores on 14–15 Sep</p>',
        how.same + '<p style="color:#111318;font-weight:600">Payment-failure complaints spiked across KSA stores on 14–15 Sep</p><p class="jr-muted">Shown with its scope: KSA · 42 stores.</p>')}
      ${row('What was found',
        '<p>Across KSA, <b>64 respondents in 9 of 42 stores</b> described card or digital-wallet payments failing at the till on 14–15 Sep, against ~6 mentions a week country-wide normally.</p>',
        how.same + '<p>The same country-wide summary, kept as Khalid shared it.</p>' + how.adapt + '<p class="jr-chg-b" style="padding:7px 9px">RT ATYAF MALL shows the same two-day spike and accounts for <b>11 of the 64</b> country mentions.</p>')}
      ${row('Key figures',
        jrTiles([['Mentions, 14–15 Sep','64','bad'],['Stores affected','9 of 42',''],['Typical week','~6','']]),
        how.same + jrTiles([['Mentions, all KSA','64',''],['Stores affected','9 of 42',''],['Typical week','~6','']]) + '<p></p>' + how.adapt + '<div class="jr-chg-b" style="padding:3px">' + jrTiles([['Your mentions','11','bad'],['Share of total','17%',''],['Your typical week','~1','']]) + '</div>')}
      ${row('Store breakdown',
        '<ul class="jr-list"><li><span>RT ATYAF MALL</span><b>11</b></li><li><span>8 other affected stores</span><b>53</b></li><li><span>33 stores with no spike</span><b>0</b></li></ul>',
        how.adapt + '<ul class="jr-list"><li><span>RT ATYAF MALL (your store)</span><b>11</b></li></ul>' + how.hide + '<p class="jr-muted">The other 41 stores, by name and count.</p>')}
      ${row('Customer comments',
        '<p class="jr-muted">Comments from all 9 affected stores, for example:</p>' + quote,
        how.adapt + '<p class="jr-muted">Comments from RT ATYAF MALL only, for example:</p>' + quote + how.hide + '<p class="jr-muted">Comments and individual responses from the other stores.</p>')}
      ${row('Suggested next step',
        '<p><b>Country Manager:</b> ask each affected store to confirm what happened at their tills on those days.</p>',
        how.adapt + '<p class="jr-chg-b" style="padding:7px 9px"><b>Recommended action:</b> confirm what happened at your tills on those days and reply to the Country Manager.</p>')}
      ${row('Copilot follow-ups',
        '<p>Answers from all KSA data.</p>',
        how.adapt + '<p>Answers only from RT ATYAF MALL data, through her own store\'s payment insight.</p>')}
      ${row('Discussion and action plans',
        '<p>One shared comment thread. He can create an action plan for the country.</p>',
        how.same + '<p>The same comment thread. Each sees the other\'s comments.</p>' + how.adapt + '<p>An action plan she creates covers her own store.</p>')}
    </div>`;
  return [
    {when:'Step 1 · the sender', where:'Country Manager\'s feed · KSA, 42 stores', title:'Khalid sees an insight across all of KSA',
     text:'Khalid, the Country Manager, has access to every store in KSA. His card is built on all 42 stores. He decides the store managers should see it and clicks Share.',
     changes:['Nothing yet: this is the card as the sender sees it.'],
     blocks:[jrCard(Object.assign({}, cty, {variant:'feed', prio:'high',
       sum:'Across KSA, 64 respondents in 9 of 42 stores described card or digital-wallet payments failing at the till on 14–15 Sep, against ~6 mentions a week country-wide normally.',
       next:'<span class="font-600">Country Manager:</span> ask each affected store to confirm what happened at their tills on those days.',
       basis:'KSA · 42 stores', chg:{share:true}}))]},
    {when:'Step 2 · sharing', where:'Share dialog', title:'He shares it with a store manager who can see less',
     text:'Sara manages one store. Before sending, the system checks what she can access and tells Khalid what she will and will not see.',
     changes:['The sender is <b>told about the access gap</b> before sending.','Sharing never widens the recipient\'s data access.'],
     blocks:[`<div class="jr-panel"><h5>Share this insight</h5><div class="jr-row"><span class="k">To</span><span class="v">Sara · Store Manager, RT ATYAF MALL</span><span class="k">Note</span><span class="v">&ldquo;Seeing this across 9 KSA stores. Can each store confirm what happened on their side?&rdquo;</span></div>
        <div class="acc-note jr-chg-b" style="margin:12px 0 0">${JR_LOCK.replace('w-3 h-3','w-4 h-4 flex-shrink-0')}<span><b>Sara can see RT ATYAF MALL only.</b> She will get this insight with its country-wide context, and with the evidence adapted to her own store. Comments and responses from the other 41 stores stay hidden from her.</span></div></div>`]},
    {when:'Step 3 · the recipient', where:'Sara\'s Shared tab', title:'The card arrives in Sara\'s Shared tab',
     text:'It is the same card as in the feed, with a strip saying who sent it and why. Three things are adapted to Sara.',
     changes:['A <b>sender strip</b>: who, their role, when, and their note.','Two tags: the insight\'s <b>scope</b> (KSA, 42 stores) and <b>her access</b> (her store only).','<b>Priority is judged for Sara</b>, not copied from Khalid: it is high because the same spike shows at her store.','The <b>next step</b> is written for her role.'],
     blocks:[jrCard(Object.assign({}, sara, {tags:[{html:jrTag.scope('KSA · 42 stores'), chg:true},{html:jrTag.access('Partial access — your store only'), chg:true}], chg:{prio:true, next:true}, from:Object.assign({}, sara.from, {chg:true})}))]},
    {when:'Step 4 · the drill-down', where:'Drill-down, side by side', title:'The drill-down keeps the insight\'s context and adapts the evidence to her data',
     text:'Sara opens the insight. She sees the same finding Khalid shared, so the two of them are talking about the same thing. Every part that rests on data is rebuilt from the data she is allowed to see, using the same definition and period, so the two views can be compared like for like.',
     changesTitle:'What changes in the drill-down',
     changes:['<b>Kept:</b> the headline, the country-wide summary and figures, and the comment thread.','<b>Adapted:</b> her store\'s part of the finding, her figures, her customers\' comments, her next step, and what Copilot can answer from.','<b>Hidden:</b> other stores\' names, counts, comments and responses.'],
     blocks:[cmp]},
    {when:'Step 5 · acting on it', where:'Followed', title:'Sara follows the shared insight and creates an action plan',
     text:'Following and action plans work the same as for her own insights. Her plan covers her own store; the comment thread is visible to Khalid as well.',
     changes:['The card moves to Followed with a <b>Shared by</b> tag.','It gains the <b>activity line</b>.','Her <b>action plan</b> shows on the card with its status and owner.','The scope stays on the basis line, so it is always clear this insight is wider than her store.'],
     blocks:[jrCard(Object.assign({}, cty, {variant:'followed', prio:'high', sum:sara.sum, next:sara.next,
       hasPlan:true, right:[{html:jrTag.sharedBy('Khalid Al-Mansour'), chg:true},{html:jrTag.plan('Not started'), chg:true}],
       meta:'Followed 1 day ago · <span class="font-600" style="color:#42474f">Latest:</span> You created an action plan, today', basis:'Shared · KSA · 42 stores', chg:{meta:true}}))]}
  ];
}
const JR_TABS = [
  {id:'followed', label:'1 · A followed card over time', title:'How a followed card changes over time',
   lede:'One insight, from the moment Sara follows it to the moment she closes it. A followed card stays until she unfollows it or marks it Done. Every edition recalculates it, so the card always shows the current figure, how far it has moved since she followed, and whether the evidence still holds: significant, not significant, or too few responses.', steps:jrFollowedSteps},
  {id:'editions', label:'2 · One card across editions', title:'How the same card changes from edition to edition',
   lede:'One recurring insight followed across seven weekly editions. Each edition recalculates the insight; the system recognises it as the same topic, so its labels, comments and action plan carry over.', steps:jrEditionSteps},
  {id:'shared', label:'3 · Shared with limited access', title:'How a shared card works when the recipient can see less than the sender',
   lede:'A Country Manager shares a country-wide insight with a Store Manager who can only see one store. The insight keeps its context, its evidence is rebuilt from the data she can access, and nothing she is not allowed to see is revealed.', steps:jrSharedSteps}
];
function cardJourneysHTML(){
  const tab = JR_TABS.find(t=>t.id===jrTab) || JR_TABS[0];
  const seg = JR_TABS.map(t=>`<button class="${t.id===tab.id?'on':''}" data-jr-tab="${t.id}" onclick="jrTab='${t.id}';renderCardJourneys(true)">${t.label}</button>`).join('');
  const steps = tab.steps().map((st,i)=>`
    <section class="jr-step" data-jr-step="${i+1}">
      <div class="jr-side">
        <div><span class="jr-num">${i+1}</span><span class="jr-when">${st.when}</span></div>
        <h3>${st.title}</h3>
        <p>${st.text}</p>
        <h4>${st.changesTitle || 'What changes on the card'}</h4>
        <ul>${st.changes.map(c=>`<li>${c}</li>`).join('')}</ul>
      </div>
      <div class="jr-right lay-${cardLayout}"><span class="jr-where">${st.where}</span>${st.blocks.join('')}</div>
    </section>`).join('');
  return `<div class="hm-proto"><b>Prototype · How cards change</b>
      <span class="lo-seg">${seg}</span>
      <button style="margin-left:auto" data-jr-close onclick="closeCardJourneys()">✕ Back to Survey Insights</button></div>
    <div class="lo-scroll"><div class="jr-wrap">
      <h1>${tab.title}</h1>
      <p class="lo-lede">${tab.lede}</p>
      <p class="jr-legend"><span><span class="jr-key"></span>Highlighted: what changed in that step</span><span>Dates, figures and comments on this page are examples chosen to show the behaviour.</span></p>
      ${steps}
    </div></div>`;
}
function renderCardJourneys(toTop){
  const layer = document.getElementById('journeys-layer');
  layer.innerHTML = cardJourneysHTML();
  if(toTop){ const sc = layer.querySelector('.lo-scroll'); if(sc) sc.scrollTop = 0; }
}
function openCardJourneys(){
  document.getElementById('journeys-layer').classList.add('show');
  document.body.style.overflow = 'hidden';
  renderCardJourneys(true);
}
function closeCardJourneys(){
  document.getElementById('journeys-layer').classList.remove('show');
  document.body.style.overflow = '';
}
