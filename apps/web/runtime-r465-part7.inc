for(const o of [window.__ctR399,window.__ctR461,window.__ctR464,window.__ctR309,window.__ctR309Api])if(o&&typeof o==='object'){if('loadForYou'in o)o.loadForYou=loadFY;if('paintForYou'in o)o.paintForYou=paintFY;if('renderForYou'in o)o.renderForYou=paintFY;if('buildForYou'in o)o.buildForYou=loadFY;if('swap'in o)o.swap=swapFY}
window.__ctR465={version:'1.0.255',scope:'home+discover-foryou+profile-lists+daily-history-undo',enterHome,loadForYou:loadFY,paintForYou:paintFY,swap:swapFY,applyProfile,openDay,undoHistory,waitAuth};
queueMicrotask(()=>{bindHistoryOwner();if(routeNow()==='home')void enterHome('series',true);if(routeNow()==='discover'&&fyActive())void loadFY(true);if(routeNow()==='profile')scheduleProfile()});
})();
