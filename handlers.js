var handlers = {

	newGame: function() {
		view.clearDetailsDivs();
		model.newGame();
	},
	
	clockPause: function() {
		if (model.clock.running) {
			model.clock.running = false;
			document.getElementById('clockPauseBtn').innerHTML = '<span class="fa fa-play"></span>';
		} else {
			model.clock.running = true;
			document.getElementById('clockPauseBtn').innerHTML = '<span class="fa fa-pause"></span>';
			model.clock.go();
		};
	},
	
	clockSpeedUp: function() {
		model.clock.tick = Math.max(model.clock.tick / 2,100);
		if (!model.clock.running) {
			model.clock.running = true;
			document.getElementById('clockPauseBtn').innerHTML = '<span class="fa fa-pause"></span>';
			model.clock.go();
		};
	},
	
	clockSlowDown: function() {
		model.clock.tick = Math.min(model.clock.tick * 2,4000);
		if (!model.clock.running) {
			model.clock.running = true;
			document.getElementById('clockPauseBtn').innerHTML = '<span class="fa fa-pause"></span>';
			model.clock.go();
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
		view.focus.unit.build(data.infrastructure[key]);
	},
	
	switchUnitPane: function(unitIndex,paneIndex) {
		view.switchUnitPane(paneIndex);
		view.focus.unit = units[unitIndex];
		view.updateTradeDiv();
	},
	
	createCaravan: function() {
		view.focus.unit.createCaravan();
		view.displayUnit(view.focus.unit);
	},
	
	leaveCaravan: function() {
		view.focus.unit.leaveCaravan();
		view.displayUnit(view.focus.unit);
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
	
	takePassengers: function(repCost) {
		view.focus.unit.takePassengers(repCost);
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
	},
	
	dropPassengers: function(repCost) {
		view.focus.unit.dropPassengers(repCost);
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
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
		view.displayUnit(view.focus.unit);
		view.updateTradeDiv();
	},
	
	trashFromUnit: function(paneIndex,commodityIndex) {
		view.focus.unit.trashFromUnit(commodityIndex);
		view.displayUnit(view.focus.unit);
	},
	
	pickupTrash: function(trashIndex) {
		view.focus.unit.pickup(trashIndex);
		view.displayUnit(view.focus.unit);
	},
	
	removeUnitStuff: function(tradeIndex) {
		view.focus.unit.removeUnitStuff(tradeIndex);
		view.updateTradeDiv();
		view.displayUnit(view.focus.unit);
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
		view.hideTradeDiv();
		view.displayUnit(view.focus.unit);
	},
	
	resupply: function(commodityIndex) {
		view.focus.unit.resupply(commodityIndex);
	},
	
	revealRename: function() {
		view.revealRename(view.focus.unitPane);
	},
	
	renameUnit: function() {
		var newName = document.getElementById('unitRenameInput_'+view.focus.unitPane).value;
		if (newName !== '') {
			view.focus.unit.rename(newName);
		} else {
			view.focus.unit.rename(view.focus.unit.name);
		};
	},
	
	cancelRoute: function() {
		view.focus.unit.cancelRoute();
	},
	
	recruitKidOnBike: function(infrastructureIndex) {
		var infrastructure = view.focus.unit.location.infrastructure[infrastructureIndex];
		model.recruit(infrastructure);
	},
	
	revealMap: function() {
		p1.knownSites = sites;
		p1.knownLandmarks = landmarks;
		view.displayMap();
	},

};