var handlers = {

	newGame: function() {
		view.clearDetailsDivs();
		model.newGame();
	},
	
	toggleOptions: function() {
		view.toggleOptions();
	},
	
	toggleOption: function(option) {
		model.options[option] = !model.options[option];
	},
	
	updateZoomFactor: function() {
		var zoomSlider = document.getElementById('zoomSlider');
		var zoomFactor = 1;
		if (zoomSlider.value > 0) {
			zoomFactor = zoomSlider.value * 10 / 100;
		} else {
			zoomFactor = (100 + parseInt(zoomSlider.value)) / 100 ;
		};
		model.options.zoomFactor = zoomFactor;
		document.getElementById('zoomLabel').innerHTML = Math.floor( model.options.zoomFactor * 100) + "%";
	},
	
	updateNewGameOption: function(option) {
		var optionInput = document.getElementById(option + 'OptionsSlider');
		model.options.newGame[option] = parseInt(optionInput.value);
		document.getElementById(option + 'OptionsNumber').innerHTML = optionInput.value;
	},
	
	clockPause: function() {
		if (model.clock.running) {
			model.clock.running = false;
			document.getElementById('clockPauseBtn').className = 'fa fa-play';
		} else {
			var eachDay = false;
			for (event in model.clock.events) {
				console.log(model.clock.events[event]);
				if (model.clock.events[event].indexOf('eachDay') !== -1) {
					eachDay = true;
				};
			};
			console.log(eachDay);
			if (!eachDay) {
				model.clock.logEventIn(0,'eachDay');
			};
			model.clock.running = true;
			document.getElementById('clockPauseBtn').className = 'fa fa-pause';
			model.clock.go();
		};
	},
	
	setClockSpeed: function() {
		var clockSpeedSlider = document.getElementById('clockSpeedSlider');
		model.clock.tick = 10000/clockSpeedSlider.value;
		model.clock.go();
	},
	
	displaySiteDetails: function(siteIndex) {
		if (siteIndex == -1) {
			site = view.focus.unit.location;
			view.focus.site = undefined;
		} else {
			site = sites[siteIndex];
			view.focus.site = site;
		};
		if (site !== undefined) {
			view.displaySiteDetails(site);
		};
	},
	
	selectSite: function(siteIndex) {
		site = sites[siteIndex];
		if (view.focus.unit !== undefined && view.focus.unit.location !== undefined) {
			view.focus.unit.move(site);
		};
		view.displayMap();
	},
	
	selectUnit: function(unitIndex) {
		view.focus.unit = units[unitIndex];
		view.displayUnit(view.focus.unit,true);
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
		view.displayUnit(units[unitIndex]);
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
		view.displayMap();
	},
	
	scuttle: function() {
		view.focus.unit.scuttle();
	},
	
	takePassengers: function(repCost) {
		view.focus.unit.takePassengers(repCost);
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
		view.displayMap();
	},
	
	dropPassengers: function(repCost) {
		view.focus.unit.dropPassengers(repCost);
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
		view.displayMap();
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
	
	warehouseFromUnit: function(paneIndex,commodityIndex) {
		view.focus.unit.warehouseFromUnit(commodityIndex);
		view.displayUnit(view.focus.unit);
// 		view.displaySiteDetails(view.focus.unit.location);
	},
	
	pickupWarehouse: function(warehouseIndex) {
		view.focus.unit.pickupWarehouse(warehouseIndex);
		view.displayUnit(view.focus.unit);
// 		view.displaySiteDetails(view.focus.unit.location);
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
		view.displayMap();
	},
	
	upgrade: function(stat,cost) {
		model.upgrade(stat,cost);
		view.displayMap();
		view.displaySiteDetails(view.focus.unit.location);
	},
	
	makeTrade: function() {
		view.focus.unit.makeTrade();
		handlers.clearTrade();
		view.displayMap();
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
	
	roadside: function(unitIndex) {
		units[unitIndex].roadside();
		view.displayMap();
		view.displayUnit(units[unitIndex]);
	},
	
	salvage: function(infrastructureIndex) {
		var commodityList = view.focus.unit.location.infrastructure[infrastructureIndex].potentialCommodities;
		view.focus.unit.salvage(commodityList);
	},
	
	recruit: function(infrastructureIndex) {
		var infrastructure = view.focus.unit.location.infrastructure[infrastructureIndex];
		model.recruit(infrastructure);
	},
	
	payRecruitCost: function(unitKey,commodityKey) {
		model.payRecruitCost(unitKey,commodityKey);
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
	},
	
	revealMap: function() {
		players.p1.knownSites = sites;
		players.p1.knownLandmarks = landmarks;
		players.p1.knownRivers = rivers;
		for (i in sites) {
			sites[i].hasVisited.p1 = true;
		};
		view.displayMap();
	},

};