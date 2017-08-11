var handlers = {

	newGame: function() {
		console.log('---');
		model.newGame();
	},
	
	displaySiteDetails: function(site) {
		view.displaySiteDetails(site);
	},
	
	selectUnit: function(unit) {
		view.displayUnit(unit);
		view.focus.unit = units[unit];
	},
	
	selectSite: function(site) {
		if (view.focus.unit !== undefined) {
			view.focus.unit.move(site);
		};
	},
	
	addFromSite: function(commodity) {
		view.focus.unit.addFromSite(commodity);
		view.updateTradeDiv();
	},
	
	addFromUnit: function(commodity) {
		view.focus.unit.addFromUnit(commodity);
		view.updateTradeDiv();
	},
	
	makeTrade: function() {
		view.focus.unit.makeTrade();
		handlers.clearTrade();
	},
	
	clearTrade: function() {
		view.focus.unit.clearTrade();
		view.hideTradeDiv();
	},

};