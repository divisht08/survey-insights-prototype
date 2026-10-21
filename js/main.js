/* Boot: runs last, after every module has loaded. Keep startup calls here (original order preserved). */
updateFollowedBadge();
updateSharedBadge();
updateAllCardStatusPills();
Object.keys(INSIGHT_META).forEach(syncFeedFollowButton);

sortFeedByPriority();
applyFeedVisibility();
renderFeedbackSlots();

document.getElementById('spr-logo').innerHTML = SPR_LOGO;

new MutationObserver(syncPaneLayout).observe(document.body, {subtree:true, attributes:true, attributeFilter:['class']});

updateAllCardStatusPills();
renderEditionBar(); renderFreshness(); renderEditionFoot(); applyFeedVisibility();
syncPaneLayout();

djSetupInit(); // Day 0 setup screen switcher (js/setup.js)
djnInit(); // Generic setup 'For discussion' notes (js/setup-notes.js)

// deep links from email links run last
gateDeepLink(new URLSearchParams(location.search));
