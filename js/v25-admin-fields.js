/* ═══ v25 (4 Nov) — custom fields move from the user's Customise flow to the admin setup (Pradeep, 3 Nov).
   In step 2 of the persona setup: every custom field is considered by default, AI says which are useful
   for insights, and the admin can add a short description so the AI reads the field correctly
   (e.g. what a "high" basket value means for this business). ═══ */

const V25_FIELDS = [
  ['Store', true, 'Used to tell one store from another', ''],
  ['Country', true, 'Used to compare countries', ''],
  ['City', true, 'Used to spot city-level patterns', ''],
  ['Product category', true, 'Used to find which products comments are about', ''],
  ['Visit type', true, 'In store, click & collect or return', ''],
  ['Loyalty tier', true, 'Members often score differently from other shoppers', 'Gold and Platinum are our top tiers'],
  ['Basket value', true, 'Useful once you say what counts as a big basket', 'Over 400 SAR is a big basket for us'],
  ['Customer ID', false, 'Not useful: a different value for every respondent', '']
];
function v25Fields(p){
  if(!p.fields) p.fields = V25_FIELDS.map(([n,on,why,desc])=>({n, on, desc: p.isNew ? '' : desc}));
  return p.fields;
}
function v25Set(i, key, val){ const f = v25Fields(v15S.edit)[i]; f[key] = val; if(key==='on') v15Render(); }
function v25CardHTML(){
  const fs = v25Fields(v15S.edit), on = fs.filter(f=>f.on).length;
  return `<div class="v15-card v25-card" data-v25-fields><div class="v15-ch"><h3>Custom fields to break insights down by</h3>
      <p>Every field is used by default. Copilot marks the ones that won't help. Add a short description where the field needs business context.</p></div>
    ${fs.map((f,i)=>{ const why = V25_FIELDS[i][2], bad = !V25_FIELDS[i][1];
      return `<div class="v25-row${f.on?'':' off'}"><label class="v15-chk"><input type="checkbox" ${f.on?'checked':''} onchange="v25Set(${i},'on',this.checked)"><span><b>${v15E(f.n)}</b><small class="${bad?'v25-warn':''}">✦ ${v15E(why)}</small></span></label>
        ${f.on ? `<input class="v25-desc" placeholder="Add a description (optional)" value="${v15E(f.desc)}" oninput="v25Set(${i},'desc',this.value)">` : ''}</div>`; }).join('')}
    <div class="v15-sum">${on} of ${fs.length} fields used</div></div>`;
}
const _v25S2 = v15Step2;
v15Step2 = function(){
  const html = _v25S2.apply(this, arguments);
  const t = document.createElement('template'); t.innerHTML = html;
  const main = t.content.querySelector('.v15-main'); if(main) main.insertAdjacentHTML('beforeend', v25CardHTML());
  const box = document.createElement('div'); box.appendChild(t.content); return box.innerHTML;
};
// the step is now about surveys, questions and fields
if(typeof V15_STEPS!=='undefined'){ V15_STEPS.forEach(s=>{ if(s[0]===2) s[1] = 'Surveys, questions and fields'; }); }
// the review in step 3 lists the fields too
const _v25S3 = v15Step3;
v15Step3 = function(){
  const html = _v25S3.apply(this, arguments), fs = v25Fields(v15S.edit).filter(f=>f.on);
  const row = `<div class="v15-rv"><div><h4>Custom fields</h4>${fs.map(f=>v15E(f.n)).join(', ')}</div><a onclick="v15Step(2)">Edit</a></div>`;
  return html.replace(/(<div class="v15-rv"><div><h4>Delivery<\/h4>)/, row + '$1');
};
document.head.insertAdjacentHTML('beforeend', `<style>
.v25-card{margin-top:14px}
.v25-row{display:flex;align-items:center;gap:12px;padding:10px 16px;border-top:1px solid #f0f1f4}
.v25-row .v15-chk{flex:0 0 46%;min-width:0}
.v25-row .v15-chk span{display:flex;flex-direction:column}
.v25-row small{font-size:12px;color:#5b3fd1;font-weight:400}
.v25-row small.v25-warn{color:#9f2a20}
.v25-row.off b{color:#8a9099}
.v25-desc{flex:1;font:inherit;font-size:12.5px;border:1px solid #d7dae0;border-radius:6px;padding:6px 9px;min-width:0}
</style>`);
