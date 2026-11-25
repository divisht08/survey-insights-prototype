/* ═══ v29 (25 Nov) — QA fixes found while preparing the Sézane test (apply to every version).
   1. The walk-through closes when you switch to another journey state, instead of staying on top of the new screen.
   2. The walk-through's highlight follows the page when you scroll.
   3. The welcome pop-up only belongs to "First insights ready"; it closes on any other state. ═══ */
(function(){
  const close = ()=>{ if(typeof v24TourI!=='undefined' && v24TourI>-1) v24Tour(-1); const t = document.getElementById('v24-tour'); if(t) t.remove(); };
  const _j = setJourney;
  setJourney = function(state){
    close();
    if(state!=='first-ready') document.querySelectorAll('#v24-welcome,.v24-wel').forEach(e=>e.remove());
    return _j.apply(this, arguments);
  };
  // the admin setup opens over the feed: no walk-through behind it
  if(typeof v15Open==='function'){ const _o = v15Open; v15Open = function(){ close(); return _o.apply(this, arguments); }; }
  let raf = 0;
  addEventListener('scroll', ()=>{
    if(typeof v24TourI==='undefined' || v24TourI<0 || raf) return;
    raf = requestAnimationFrame(()=>{ raf = 0; const keep = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function(){};
      try{ v24Tour(v24TourI); } finally { Element.prototype.scrollIntoView = keep; } });
  }, {passive:true, capture:true});
})();
