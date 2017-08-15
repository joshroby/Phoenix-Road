var view = {

	focus: {},

	displayMap: function() {
		
		var mapDiv = document.getElementById('mapDiv');
		mapDiv.innerHTML = '';
		
		var clockDiv = document.createElement('div');
		clockDiv.id = 'clockDiv';
		var clockSpan = document.createElement('span');
		clockSpan.id = 'clockSpan';
		clockSpan.innerHTML = 'Day ' + model.currentDay;
		clockDiv.appendChild(clockSpan);
		var clockSlowDownBtn = document.createElement('button');
		clockSlowDownBtn.innerHTML = '<<';
		clockSlowDownBtn.setAttribute('onclick','handlers.clockSlowDown()');
		clockDiv.appendChild(clockSlowDownBtn);
		var clockPauseBtn = document.createElement('button');
		clockPauseBtn.id = 'clockPauseBtn';
		if (model.options.paused) {
			clockPauseBtn.innerHTML = '>';
		} else {
			clockPauseBtn.innerHTML = '||';
		};
		clockPauseBtn.setAttribute('onclick','handlers.clockPause()');
		clockDiv.appendChild(clockPauseBtn);
		var clockSpeedUpBtn = document.createElement('button');
		clockSpeedUpBtn.innerHTML = '>>';
		clockSpeedUpBtn.setAttribute('onclick','handlers.clockSpeedUp()');
		clockDiv.appendChild(clockSpeedUpBtn);
		mapDiv.appendChild(clockDiv);
		
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.setAttribute('viewBox','0 0 1000 1000');
		svg.id = 'mapSVG';
		
		var background = document.createElementNS('http://www.w3.org/2000/svg','rect');
		background.setAttribute('fill','#FF9900');
		background.setAttribute('x','0');
		background.setAttribute('y','0');
		background.setAttribute('width','100%');
		background.setAttribute('height','100%');
		svg.appendChild(background);
		
		for (i in p1.knownSites) {
			for (n in p1.knownSites[i].neighbors) {
				var newRoute = document.createElementNS('http://www.w3.org/2000/svg','path');
				newRoute.setAttribute('fill','none');
				newRoute.setAttribute('stroke','yellow');
				var d = 'M' + p1.knownSites[i].x + ',' + p1.knownSites[i].y;
				var dx = p1.knownSites[i].neighbors[n].x - p1.knownSites[i].x;
				var dy = p1.knownSites[i].neighbors[n].y - p1.knownSites[i].y;
				var dc1x = dx // * Math.random();
				var dc1y = dy // * Math.random();
				var dc2x = dx // * Math.random();
				var dc2y = dy // * Math.random();
				d += ' c ' + dc1x + ' ' + dc1y + ' ' + dc2x + ' ' + dc2y + ' ' + dx + ' ' + dy;
				newRoute.setAttribute('d',d);
				svg.appendChild(newRoute);
			};
		};
		
		for (i in p1.knownSites) {
			var siteIndex = sites.indexOf(p1.knownSites[i]);
			
			var siteLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			siteLabel.setAttribute('stroke','black');
			siteLabel.setAttribute('x',p1.knownSites[i].x + 10);
			siteLabel.setAttribute('y',p1.knownSites[i].y + 5);
			siteLabel.setAttribute('onmouseover','handlers.displaySiteDetails('+siteIndex+')');
			siteLabel.setAttribute('onmouseout','handlers.displaySiteDetails(-1)');
// 			siteLabel.addEventListener('mouseenter',handlers.displaySiteDetails.bind(this,siteIndex),false);
// 			siteLabel.addEventListener('mouseleave',handlers.displaySiteDetails.bind(this,-1),false);
			siteLabel.innerHTML = p1.knownSites[i].name;
			svg.appendChild(siteLabel);
			
			var newSite = document.createElementNS('http://www.w3.org/2000/svg','circle');
			newSite.id = 'site_' + i;
			newSite.setAttribute('fill','black');
			newSite.setAttribute('stroke','white');
			newSite.setAttribute('cx',p1.knownSites[i].x);
			newSite.setAttribute('cy',p1.knownSites[i].y);
			newSite.setAttribute('r',5);
			newSite.setAttribute('onclick','handlers.selectSite('+siteIndex+')');
			svg.appendChild(newSite);
		};
		
		for (i in units) {
			if (units[i].inTransit) {
				unitX = units[i].route[0].x;
				unitY = units[i].route[0].y;
			} else {
				unitX = units[i].location.x;
				unitY = units[i].location.y;
			};
			var newUnit = document.createElementNS('http://www.w3.org/2000/svg','rect');
			newUnit.setAttribute('fill','red');
			newUnit.setAttribute('x',unitX - 10);
			newUnit.setAttribute('y',unitY - 10);
			newUnit.setAttribute('width',20);
			newUnit.setAttribute('height',20);
			newUnit.setAttribute('onclick','handlers.selectUnit('+i+')');
			svg.appendChild(newUnit);
		};
		mapDiv.appendChild(svg);
	},
	
	displaySiteDetails: function(site) {
		var detailsSiteDiv = document.getElementById('detailsSiteDiv');
		detailsSiteDiv.innerHTML = '';
		var siteHead = document.createElement('h3');
		siteHead.innerHTML = site.name;
		detailsSiteDiv.appendChild(siteHead);
// 		var siteCoords = document.createElement('p');
// 		siteCoords.innerHTML = "( " + site.x + " , " + site.y + " )";
// 		detailsSiteDiv.appendChild(siteCoords);
		var siteNeedsDiv = document.createElement('div');
		siteNeedsDiv.id = 'siteNeedsDiv';
		detailsSiteDiv.appendChild(siteNeedsDiv);
		var siteNeeds = site.needs();
		for (i in siteNeeds) {
			var siteNeedDiv = document.createElement('div');
			siteNeedDiv.className = 'siteNeedDiv';
			siteNeedDiv.innerHTML = siteNeeds[i].label;
			siteNeedDiv.style.backgroundColor = siteNeeds[i].color;
			siteNeedsDiv.appendChild(siteNeedDiv);
		};
		var sitePopulationP = document.createElement('p');
		sitePopulationP.innerHTML = site.population + " souls";
		detailsSiteDiv.appendChild(sitePopulationP);
		var siteInfrastructureList = document.createElement('ul');
		siteInfrastructureList.id = 'siteInfrastructureList';
		detailsSiteDiv.appendChild(siteInfrastructureList);
		for (i in site.infrastructure) {
			if (site.infrastructure[i].visible || site.hasVisited.p1) {
				var siteInfrastructureItem = document.createElement('li');
				siteInfrastructureItem.innerHTML = site.infrastructure[i].name;
				siteInfrastructureList.appendChild(siteInfrastructureItem);
			};
		};
		
		if (site.hasVisited.p1) {
			var siteCommoditiesTable = document.createElement('table');
			siteCommoditiesTable.className = 'commoditiesTable';
			detailsSiteDiv.appendChild(siteCommoditiesTable);
			var siteCommoditiesTableTitle = document.createElement('caption');
			siteCommoditiesTableTitle.innerHTML = 'Commodity Values';
			siteCommoditiesTable.appendChild(siteCommoditiesTableTitle);
			for (c in site.commodities) {
				var siteCommoditiesItem = document.createElement('tr');
				siteCommoditiesTable.appendChild(siteCommoditiesItem);
				var siteCommoditiesNameCell = document.createElement('td');
				siteCommoditiesNameCell.innerHTML = data.commodities[c].name;
				siteCommoditiesItem.appendChild(siteCommoditiesNameCell);
				var siteCommoditiesValueCell = document.createElement('td');
				siteCommoditiesValueCell.innerHTML = Math.round(100 * site.commodities[c],0);
				siteCommoditiesItem.appendChild(siteCommoditiesValueCell);
				var unitPresent = false;
				for (u in units) {
					if (units[u].location == site) {
						unitPresent = true;
					};
				};
				if (unitPresent) {
					var siteCommoditiesTradeCell = document.createElement('td');
					var siteCommoditiesTradeBtn = document.createElement('button');
					siteCommoditiesTradeBtn.innerHTML = "+";
					siteCommoditiesTradeBtn.setAttribute('onclick','handlers.addFromSite("'+c+'")');
					siteCommoditiesTradeCell.appendChild(siteCommoditiesTradeBtn);
					siteCommoditiesItem.appendChild(siteCommoditiesTradeCell);
				} else {
					var siteCommoditiesTradeCell = document.createElement('td');
					siteCommoditiesTradeCell.innerHTML += "&nbsp;";
					siteCommoditiesItem.appendChild(siteCommoditiesTradeCell);
				};
			};
		};
		
		var siteReputationP = document.createElement('p');
		if (site.reputation.p1 > 0) {
			siteReputationP.innerHTML += 'You have a positive reputation here. (' + Math.round(site.reputation.p1,0) + ')';
			siteReputationP.className = 'positive';
		} else if (site.reputation.p1 < 0) {
			siteReputationP.innerHTML += 'You have a negative reputation here. (' + Math.round(site.reputation.p1,0) + ')';
			siteReputationP.className = 'negative';
		} else {
			siteReputationP.innerHTML += 'You have no reputation here.';
			siteReputationP.className = '';
		};
		detailsSiteDiv.appendChild(siteReputationP);
		view.displayMap();
	},
	
	displayUnit: function(unit) {
		var detailsUnitDiv = document.getElementById('detailsUnitDiv');
		detailsUnitDiv.innerHTML = '';
		var unitHead = document.createElement('h3');
		unitHead.id = 'unitHead';
		unitHead.innerHTML = unit.name;
		unitHead.setAttribute('onclick','handlers.revealRename()');
		detailsUnitDiv.appendChild(unitHead);
		
		var unitRenameDiv = document.createElement('div');
		unitRenameDiv.id = 'unitRenameDiv';
		unitRenameDiv.style.display = 'none';
		detailsUnitDiv.appendChild(unitRenameDiv);
		var unitRenameInput = document.createElement('input');
		unitRenameInput.setAttribute('type','text');
		unitRenameInput.id = 'unitRenameInput';
		unitRenameDiv.appendChild(unitRenameInput);
		var unitRenameBtn = document.createElement('button');
		unitRenameBtn.innerHTML = 'Rename';
		unitRenameBtn.setAttribute('onclick','handlers.renameUnit()');
		unitRenameDiv.appendChild(unitRenameBtn);
		
		var unitModelP = document.createElement('p');
		unitModelP.innerHTML = unit.type.crew + " Crew, Speed " + unit.type.speed;
		detailsUnitDiv.appendChild(unitModelP);
		
		var unitProvisionsP = document.createElement('p');
		detailsUnitDiv.appendChild(unitProvisionsP);
		var provisionsFood = 0;
		var provisionsWater = 0;
		for (c in unit.commodities) {
			if (unit.commodities[c].commodity == 'food') {
				provisionsFood += unit.commodities[c].qty;
			} else if (unit.commodities[c].commodity == 'water') {
				provisionsWater += unit.commodities[c].qty;
			};
		};
		var provisions = Math.min(provisionsFood/unit.type.crew,provisionsWater/unit.type.crew);
		unitProvisionsP.innerHTML = provisions + " days provisions";
		
		var unitCommoditiesTable = document.createElement('table');
		unitCommoditiesTable.className = 'commoditiesTable';
		detailsUnitDiv.appendChild(unitCommoditiesTable);
		var unitCommoditiesTableTitle = document.createElement('caption');
		unitCommoditiesTable.appendChild(unitCommoditiesTableTitle);
		var cargo = 0;
		for (c in unit.commodities) {
			var unitCommoditiesItem = document.createElement('tr');
			unitCommoditiesTable.appendChild(unitCommoditiesItem);
			var unitCommoditiesNameCell = document.createElement('td');
			unitCommoditiesNameCell.innerHTML = data.commodities[unit.commodities[c].commodity].name;
			if (unit.commodities[c].commodity == 'food' || unit.commodities[c].commodity == 'water') {
				unitCommoditiesNameCell.innerHTML += ' (' + unit.commodities[c].qty + '%)';
			};
			unitCommoditiesItem.appendChild(unitCommoditiesNameCell);
			var unitCommoditiesValueCell = document.createElement('td');
			unitCommoditiesValueCell.innerHTML = Math.round(100 * unit.location.commodities[unit.commodities[c].commodity],0);
			unitCommoditiesItem.appendChild(unitCommoditiesValueCell);
			var unitCommoditiesTradeCell = document.createElement('td');
			var unitCommoditiesTradeBtn = document.createElement('button');
			unitCommoditiesTradeBtn.innerHTML = "+";
			unitCommoditiesTradeBtn.setAttribute('onclick','handlers.addFromUnit("'+c+'")');
			unitCommoditiesTradeBtn.id = 'unitAddBtn_' + c;
			unitCommoditiesTradeCell.appendChild(unitCommoditiesTradeBtn);
			if (unit.commodities[c].commodity == 'food' || unit.commodities[c].commodity == 'water') {
				var resupplyBtn = document.createElement('button');
				resupplyBtn.innerHTML = 'R';
				resupplyBtn.setAttribute('onclick','handlers.resupply('+c+')');
				var resupplyCost = (100 - unit.commodities[c].qty ) * unit.location.commodities[unit.commodities[c].commodity];
				if (unit.commodities[c].qty == 100 || resupplyCost > unit.location.reputation.p1) {
					resupplyBtn.disabled = true;
				} else {
					resupplyBtn.disabled = false;
				};
				unitCommoditiesTradeCell.appendChild(resupplyBtn);
			};
			unitCommoditiesItem.appendChild(unitCommoditiesTradeCell);
			if (data.commodities[unit.commodities[c].commodity].cargo) {
				cargo++;
			};
		};
		unitCommoditiesTableTitle.innerHTML = 'Cargo ' + cargo + "/" + unit.type.cargo;
		if (cargo > unit.type.cargo) {
			unitCommoditiesTableTitle.innerHTML += ' <span class="negative">Overburdened!</span>';
		};
		
		if (unit.inTransit) {
			var enRouteP = document.createElement('p');
			enRouteP.innerHTML = 'En route to ' + unit.route[unit.route.length-1].name + " (" + unit.route.length + " days)";
			detailsUnitDiv.appendChild(enRouteP);
			if (!unit.departed) {
				var cancelRouteBtn = document.createElement('button');
				cancelRouteBtn.innerHTML = 'cancel';
				cancelRouteBtn.setAttribute('onclick','handlers.cancelRoute()');
				detailsUnitDiv.appendChild(cancelRouteBtn);
			};
		};
		
		view.displaySiteDetails(unit.location);
		view.updateTradeDiv();
	},
	
	revealRename: function() {
		document.getElementById('unitRenameDiv').style.display = 'block';
		document.getElementById('unitHead').style.display = 'none';
	},
	
	updateTradeDiv: function() {
		var currentTrade = view.focus.unit.currentTrade;
		
		document.getElementById('tradeDiv').style.display = 'block';
		
		currentTrade.balance = 0;
		
		var unitStuffDiv = document.getElementById('unitStuffDiv');
		unitStuffDiv.innerHTML = '';
		var unitStuffList = document.createElement('ul');
		unitStuffDiv.appendChild(unitStuffList);
		for (i in currentTrade.unitStuff) {
			var unitStuffItem = document.createElement('li');
			unitStuffItem.innerHTML = data.commodities[currentTrade.unitStuff[i].commodity].name;
			unitStuffList.appendChild(unitStuffItem);
			currentTrade.balance += currentTrade.unitStuff[i].qty * view.focus.unit.location.commodities[currentTrade.unitStuff[i].commodity];
		};
		
		var siteStuffDiv = document.getElementById('siteStuffDiv');
		siteStuffDiv.innerHTML = '';
		var siteStuffList = document.createElement('ul');
		siteStuffDiv.appendChild(siteStuffList);
		for (i in currentTrade.siteStuff) {
			var siteStuffItem = document.createElement('li');
			siteStuffItem.innerHTML = data.commodities[currentTrade.siteStuff[i].commodity].name;
			siteStuffList.appendChild(siteStuffItem);
			currentTrade.balance -= currentTrade.siteStuff[i].qty * view.focus.unit.location.commodities[currentTrade.siteStuff[i].commodity];
		};
		
		var balanceDiv = document.getElementById('balanceDiv');
		balanceDiv.innerHTML = Math.round(currentTrade.balance , 0);
		if (currentTrade.balance >=  -1 * view.focus.unit.location.reputation.p1) {
			balanceDiv.className = 'balancePositive';
		} else {
			balanceDiv.className = 'balanceNegative';
		};
		
		if (currentTrade.balance >= -1 * view.focus.unit.location.reputation.p1 && Object.keys(view.focus.unit.commodities).length - currentTrade.unitStuff.length + currentTrade.siteStuff.length) {
			document.getElementById('tradeBtn').disabled = false;
		} else {
			document.getElementById('tradeBtn').disabled = true;
		};
	},
	
	hideTradeDiv: function() {
		document.getElementById('tradeDiv').style.display = 'hidden';
	},
	
	disableUnitAddBtn: function(index) {
		document.getElementById('unitAddBtn_' + index).disabled = true;
	},
	
	enableUnitAddBtns: function() {
		for (i in view.focus.unit.commodities) {
			document.getElementById('unitAddBtn_' + i).disabled = false;
		};
	},
	
	displayError: function(message) {
		console.log(message);		
	},

};