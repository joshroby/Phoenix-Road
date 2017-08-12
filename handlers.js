var handlers = {

	newGame: function() {
		console.log('---');
		model.newGame();
	},
	
	displaySiteDetails: function(siteIndex) {
		console.log(siteIndex);
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

};