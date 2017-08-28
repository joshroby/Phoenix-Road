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
		model.options.dayLength = Math.max(model.options.dayLength / 2,100);
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
		if (site !== undefined) {
			view.displaySiteDetails(site);
		};
	},
	
	selectUnit: function(unitIndex) {
		view.focus.unit = units[unitIndex];
		view.displayUnit(view.focus.unit);
	},
	
	displayInfrastructurePreview: function(pane) {
		var key = document.getElementById('unitBuildSelect_'+pane).value;
		view.displayInfrastructurePreview(pane,key);
	},
	
	buildInfrastructure:function(pane) {
		var key = document.getElementById('unitBuildSelect_'+pane).value;
		view.focus.unit.location.buildInfrastructure(key);
		view.displaySiteDetails(view.focus.unit.location);
		view.displayUnit(view.focus.unit)
	},
	
	switchUnitPane: function(unitIndex,paneIndex) {
		view.switchUnitPane(paneIndex);
		view.focus.unit = units[unitIndex];
		view.updateTradeDiv();
	},
	
	toggleRoad: function() {
		view.focus.unit.toggleRoad();
	},
	
	survey: function() {
		view.focus.unit.survey();
	},
	
	scuttle: function() {
		view.focus.unit.scuttle();
	},
	
	selectSite: function(siteIndex) {
		site = sites[siteIndex];
		if (view.focus.unit !== undefined && view.focus.unit.location !== undefined) {
			view.focus.unit.move(site);
		};
	},
	
	addFromSite: function(commodity) {
		view.focus.unit.addFromSite(commodity);
		view.updateTradeDiv();
	},
	
	addFromUnit: function(paneIndex,commodityIndex) {
		view.focus.unit.addFromUnit(commodityIndex);
		view.disableUnitAddBtn(paneIndex,commodityIndex);
		view.updateTradeDiv();
	},
	
	removeUnitStuff: function(tradeIndex) {
		view.focus.unit.removeUnitStuff(tradeIndex);
		view.updateTradeDiv();
	},
	
	removeSiteStuff: function(tradeIndex) {
		view.focus.unit.removeSiteStuff(tradeIndex);
		view.updateTradeDiv();
	},
	
	displayBuildUnit: function(index) {
		var buildUnit = document.getElementById('buildSelect_' + index).value;
		view.displayBuildUnit(index,buildUnit);
	},
	
	buildUnit: function(index) {
		var buildUnit = document.getElementById('buildSelect_' + index).value;
		model.buildUnit(index,buildUnit);
	},
	
	upgrade: function(stat) {
		p1[stat] *= 2;
		for (u in units) {
			units[u].look();
		};
		view.displayMap();
		view.displaySiteDetails(view.focus.unit.location);
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
		view.revealRename(view.focus.unitPane);
	},
	
	renameUnit: function() {
		var newName = document.getElementById('unitRenameInput_'+view.focus.unitPane).value;
		view.focus.unit.rename(newName);
	},
	
	cancelRoute: function() {
		view.focus.unit.cancelRoute();
	},
	
	revealMap: function() {
		p1.knownSites = sites;
		p1.knownLandmarks = landmarks;
		view.displayMap();
	},

};