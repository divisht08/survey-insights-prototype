/* ═══ v16 (30 Oct) — less clutter:
   1. Action plans leave the Survey Insights menu. They belong to the Action Plans capability; an insight still
      creates one from its drill-down.
   2. The feed header drops the "Weekly updates · compares …" line. The update date stays; the comparison
      window is explained in Configure. ═══ */

(function v16Nav(){
  const p = document.getElementById('v3-nav-plans'); if(p) p.remove();
})();

const _v16Bar = renderEditionBar;
renderEditionBar = function(){
  _v16Bar.apply(this, arguments);
  document.querySelectorAll('#edition-bar [data-v8-window]').forEach(n=>n.remove());
};
renderEditionBar();
