var handlers = {

	newGame: function() {
		view.clearDetailsDivs();
		model.newGame();
	},
	
	clockPause: function() {
		if (model.options.paused) {
			model.options.paused = false;
			document.getElementById('clockPauseBtn').innerHTML = '||';
			model.advanceClock();
		} else {
			model.options.paused = true;
			document.getElementById('clockPauseBtn').innerHTML = '>';
		};
	},
	
	clockSpeedUp: function() {
		model.options.dayLength = Math.max(model.options.dayLength / 2,250);
		if (model.options.paused) {
			model.options.paused = false;
			document.getElementById('clockPauseBtn').innerHTML = '||';
			model.advanceClock();
		};
	},
	
	clockSlowDown: function() {
		model.options.dayLength = Math.min(model.options.dayLength * 2,2500);
		if (model.options.paused) {
			model.options.paused = false;
			document.getElementById('clockPauseBtn').innerHTML = '||';
			model.advanceClock();
		};
	},
	
	displaySiteDetails: function(siteIndex) {
		if (siteIndex == -1) {
			site = view.focus.unit.location;
		} else {
			site = sites[siteIndex];
		};
		view.displaySiteDetails(site);
	},
	
	selectUnit: function(unitIndex) {
		view.focus.unit = units[unitIndex];
		view.displayUnit(view.focus.unit);
	},
	
	selectSite: function(siteIndex) {
		site = sites[siteIndex];
		if (view.focus.unit !== undefined) {
			view.focus.unit.move(site);
		};
	},
	
	addFromSite: function(commodity) {
		view.focus.unit.addFromSite(commodity);
		view.updateTradeDiv();
	},
	
	addFromUnit: function(commodityIndex) {
		view.focus.unit.addFromUnit(commodityIndex);
		view.updateTradeDiv();
	},
	
	makeTrade: function() {
		view.focus.unit.makeTrade();
		handlers.clearTrade();
	},
	
	clearTrade: function() {
		view.focus.unit.clearTrade();
		view.enableUnitAddBtns();
		view.hideTradeDiv();
	},
	
	resupply: function(commodityIndex) {
		view.focus.unit.resupply(commodityIndex);
	},
	
	revealRename: function() {
		view.revealRename();
	},
	
	renameUnit: function() {
		var newName = document.getElementById('unitRenameInput').value;
		view.focus.unit.rename(newName);
	},
	
	cancelRoute: function() {
		view.focus.unit.cancelRoute();
	},

};