var view = {

	focus: {
		unitPane: 0,
	},
	
	clearDetailsDivs: function() {
		document.getElementById('detailsUnitDiv').innerHTML = '&nbsp;';
		document.getElementById('detailsSiteDiv').innerHTML = '&nbsp;';
	},

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
			if (p1.knownSites[i].hasVisited.p1) {
				siteLabel.setAttribute('stroke','black');
			} else {
				siteLabel.setAttribute('stroke','dimgray');
			};
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
			if (p1.knownSites[i].hasVisited.p1) {
				newSite.setAttribute('fill','black');
			} else {
				newSite.setAttribute('fill','dimgray');
			};
			newSite.setAttribute('stroke','yellow');
			newSite.setAttribute('cx',p1.knownSites[i].x);
			newSite.setAttribute('cy',p1.knownSites[i].y);
			if (p1.knownSites[i].population < 100) {
				newSite.setAttribute('r',4);
			} else if (p1.knownSites[i].population < 400) {
				newSite.setAttribute('r',5);
			} else {
				newSite.setAttribute('r',6);
			};
			newSite.setAttribute('onclick','handlers.selectSite('+siteIndex+')');
			svg.appendChild(newSite);
		};
		
		for (i in units) {
			if (units[i].inTransit) {
				unitX = units[i].route[0].x;
				unitY = units[i].route[0].y;
			} else {
				unitX = units[i].location.x;
				unitY = units[i].location.y + 10;
			};
			var newUnit = document.createElementNS('http://www.w3.org/2000/svg','rect');
			newUnit.setAttribute('fill','red');
			newUnit.setAttribute('x',unitX - 5);
			newUnit.setAttribute('y',unitY - 5);
			newUnit.setAttribute('width',10);
			newUnit.setAttribute('height',10);
			newUnit.setAttribute('onclick','handlers.selectUnit('+i+')');
			svg.appendChild(newUnit);
		};
		mapDiv.appendChild(svg);
	},
	
	displaySiteDetails: function(site) {
		var detailsSiteDiv = document.getElementById('detailsSiteDiv');
		detailsSiteDiv.innerHTML = '';
		var siteHead = document.createElement('h2');
		siteHead.innerHTML = site.name;
		detailsSiteDiv.appendChild(siteHead);

		var siteCharacterDiv = document.createElement('div');
		siteCharacterDiv.id = 'siteCharacterDiv';
		detailsSiteDiv.appendChild(siteCharacterDiv);
		var siteCommoditiesDiv = document.createElement('div');
		siteCommoditiesDiv.id = 'siteCommoditiesDiv';
		detailsSiteDiv.appendChild(siteCommoditiesDiv);
		var siteInfrastructureDiv = document.createElement('div');
		siteInfrastructureDiv.id = 'siteInfrastructureDiv';
		detailsSiteDiv.appendChild(siteInfrastructureDiv);

		var sitePopulationP = document.createElement('p');
		sitePopulationP.innerHTML = site.population + " souls";
		sitePopulationP.className = 'narrowMargin';
		siteCharacterDiv.appendChild(sitePopulationP);
		var siteNeedsDiv = document.createElement('div');
		siteNeedsDiv.id = 'siteNeedsDiv';
		siteCharacterDiv.appendChild(siteNeedsDiv);
		var siteNeeds = site.needs();
		for (i in siteNeeds) {
			var siteNeedDiv = document.createElement('div');
			siteNeedDiv.className = 'siteNeedDiv';
			siteNeedDiv.innerHTML = siteNeeds[i].label;
			siteNeedDiv.style.backgroundColor = siteNeeds[i].color;
			siteNeedsDiv.appendChild(siteNeedDiv);
		};
		var siteFeatureList = document.createElement('ul');
		siteFeatureList.id = 'siteFeatureList';
		siteFeatureList.className = 'narrowMargin';
		siteCharacterDiv.appendChild(siteFeatureList);
		var list = [];
		for (i in site.resources) {
			if (site.resources[i].visible || site.hasVisited.p1) {
				list.push(site.resources[i]);
			};
		};
		for (i in site.infrastructure) {
			if (site.infrastructure[i].visible || site.hasVisited.p1) {
				list.push(site.infrastructure[i]);
			};
		};
		list.sort(function(a,b){
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		});
		for (i in list) {
			var siteFeatureItem = document.createElement('li');
			siteFeatureItem.innerHTML = list[i].name;
			siteFeatureList.appendChild(siteFeatureItem);
		};
		
		if (site.hasVisited.p1) {
			var siteCommoditiesTable = document.createElement('table');
			siteCommoditiesTable.className = 'commoditiesTable';
			siteCommoditiesDiv.appendChild(siteCommoditiesTable);
			var siteCommoditiesTableTitle = document.createElement('caption');
			siteCommoditiesTableTitle.innerHTML = 'Commodity Values';
			siteCommoditiesTable.appendChild(siteCommoditiesTableTitle);
			var knownValues = model.knownValues();
			for (c in site.commodities) {
				var siteCommoditiesItem = document.createElement('tr');
				siteCommoditiesTable.appendChild(siteCommoditiesItem);
				var siteCommoditiesNameCell = document.createElement('td');
				siteCommoditiesNameCell.innerHTML = data.commodities[c].name;
				siteCommoditiesItem.appendChild(siteCommoditiesNameCell);
				var siteCommoditiesValueCell = document.createElement('td');
				siteCommoditiesValueCell.innerHTML = Math.round(100 * site.commodities[c],0);
				if (site.commodities[c] > knownValues[c]*2) {
					siteCommoditiesValueCell.innerHTML += ' (+++)';
				} else if (site.commodities[c] > knownValues[c]*1.5) {
					siteCommoditiesValueCell.innerHTML += ' (++)';
				} else if (site.commodities[c] > knownValues[c]*1.25) {
					siteCommoditiesValueCell.innerHTML += ' (+)';
				} else if (site.commodities[c] < knownValues[c]*.8){
					siteCommoditiesValueCell.innerHTML += ' (-)';
				} else if (site.commodities[c] < knownValues[c]*.66){
					siteCommoditiesValueCell.innerHTML += ' (--)';
				} else if (site.commodities[c] < knownValues[c]*.5){
					siteCommoditiesValueCell.innerHTML += ' (---)';
				};
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
		siteCommoditiesDiv.appendChild(siteReputationP);
		
		for (i in site.infrastructure) {
			if (site.infrastructure[i].buildUnits !== undefined) {
				var infrastructureDiv = document.createElement('div');
				infrastructureDiv.className = 'infrastructureDiv';
				siteInfrastructureDiv.appendChild(infrastructureDiv);
				var infrastructureHead = document.createElement('h3');
				infrastructureHead.className = 'infrastructureHead';
				infrastructureHead.innerHTML = site.infrastructure[i].name;
				infrastructureDiv.appendChild(infrastructureHead);
				var buildSelect = document.createElement('select');
				buildSelect.className = 'buildSelect';
				buildSelect.id = 'buildSelect_' + i;
				buildSelect.setAttribute('onchange','handlers.displayBuildUnit('+i+')');
				if (site.reputation.p1 < site.infrastructure[i].unlock) {
					var lockedOption = document.createElement('option');
					lockedOption.innerHTML = 'Unlocks at ' + site.infrastructure[i].unlock + ' reputation.';
					lockedOption.disabled = true;
					lockedOption.selected = true;
					buildSelect.appendChild(lockedOption);
				};
				for (u in site.infrastructure[i].buildUnits) {
					var buildOption = document.createElement('option');
					buildOption.innerHTML = data.units[site.infrastructure[i].buildUnits[u]].name;
					buildOption.value = site.infrastructure[i].buildUnits[u];
					buildSelect.appendChild(buildOption);
				};
				infrastructureDiv.appendChild(buildSelect);
				var buildBtn = document.createElement('button');
				buildBtn.setAttribute('onclick','handlers.buildUnit('+i+')');
				if (site.reputation.p1 >= site.infrastructure[i].unlock) {
					buildBtn.innerHTML = 'Build';
				} else {
					buildBtn.innerHTML = 'Locked';
					buildBtn.disabled = true;
				};
				infrastructureDiv.appendChild(buildBtn);
				var buildInfoTable = document.createElement('table');
				buildInfoTable.id = 'buildInfoTable_'+i;
				infrastructureDiv.appendChild(buildInfoTable);
			} else if (site.infrastructure[i].valuables !== undefined) {
				var infrastructureDiv = document.createElement('div');
				infrastructureDiv.innerHTML = 'Trade for Valuables';
				siteInfrastructureDiv.appendChild(infrastructureDiv);
			};
		};
				
		view.displayMap();
	},
	
	displayBuildUnit: function(i,unitName) {
		var buildInfoTable = document.getElementById('buildInfoTable_' + i);
		buildInfoTable.innerHTML = '';
		buildInfoTable.className = 'buildInfoTable';
		var unitType = data.units[unitName];
		var stats = ['cargo','crew','speed','offroadSpeed'];
		for (s in stats) {
			var buildUnitStatP = document.createElement('tr');
			buildUnitStatP.innerHTML = "<td class='buildInfoStatCell'>" + stats[s] + "</td><td>" + unitType[stats[s]] + "</td>";
			buildInfoTable.appendChild(buildUnitStatP);
		};
		var costString = "<td class='buildInfoStatCell'>Build Cost</td><td>";
		var costRep = 0;
		for (b in unitType.buildCost) {
			costString += unitType.buildCost[b] + " " + b;
			if (Object.keys(unitType.buildCost).indexOf(b) < Object.keys(unitType.buildCost).length-1) {
				costString += ", ";
			};
			costRep += Math.round(100 * unitType.buildCost[b] * view.focus.unit.location.commodities[b],1);
		};
		costString += " (~" + costRep + " reputation)</td>";
		var buildCostP = document.createElement('tr');
		buildCostP.innerHTML = costString;
		buildInfoTable.appendChild(buildCostP);
		
		// Here is where we can enable and disable the Build button per unit
	},
	
	displayUnit: function(unit) {
		var selectedUnit = unit;
		var detailsUnitDiv = document.getElementById('detailsUnitDiv');
		detailsUnitDiv.innerHTML = '';
		
		var unitsAtSite = [];
		for (i in units) {
			if (units[i].location == unit.location && !units[i].departed) {
				unitsAtSite.push(units[i]);
			} else if (units[i] == unit) {
				unitsAtSite.push(units[i]);
			};
		};
	
		for (u in unitsAtSite) {
			unit = unitsAtSite[u];
			unitIndex = units.indexOf(unit);
			var unitPane = document.createElement('div');
			unitPane.id = 'unitPane_' + u;
			unitPane.className = 'unitPane';
			unitPane.style.display = 'none';
			detailsUnitDiv.appendChild(unitPane);
			
			var unitHead = document.createElement('h2');
			unitHead.id = 'unitHead_'+u;
			unitHead.innerHTML = unit.name;
			unitHead.setAttribute('onclick','handlers.revealRename()');
			unitPane.appendChild(unitHead);
		
			var unitRenameDiv = document.createElement('div');
			unitRenameDiv.id = 'unitRenameDiv_'+u;
			unitRenameDiv.style.display = 'none';
			unitPane.appendChild(unitRenameDiv);
			var unitRenameInput = document.createElement('input');
			unitRenameInput.setAttribute('type','text');
			unitRenameInput.id = 'unitRenameInput_' + u;
			unitRenameDiv.appendChild(unitRenameInput);
			var unitRenameBtn = document.createElement('button');
			unitRenameBtn.innerHTML = 'Rename';
			unitRenameBtn.setAttribute('onclick','handlers.renameUnit()');
			unitRenameDiv.appendChild(unitRenameBtn);
		
			var unitModelP = document.createElement('p');
			unitModelP.innerHTML = unit.type.crew + " Crew, Speed " + unit.type.speed;
			unitPane.appendChild(unitModelP);
		
			var unitProvisionsP = document.createElement('p');
			unitPane.appendChild(unitProvisionsP);
			var provisionsFood = 0;
			var provisionsWater = 0;
			for (c in unit.commodities) {
				if (unit.commodities[c].commodity == 'food') {
					provisionsFood += unit.commodities[c].qty;
				} else if (unit.commodities[c].commodity == 'water') {
					provisionsWater += unit.commodities[c].qty;
				};
			};
			var provisions = Math.floor(Math.min(provisionsFood/unit.type.crew,provisionsWater/unit.type.crew));
			unitProvisionsP.innerHTML = provisions + " days provisions";
		
			var unitCommoditiesTable = document.createElement('table');
			unitCommoditiesTable.className = 'commoditiesTable';
			unitPane.appendChild(unitCommoditiesTable);
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
				if (unit.location !== undefined) {
					var unitCommoditiesValueCell = document.createElement('td');
					unitCommoditiesValueCell.innerHTML = Math.round(100 * unit.location.commodities[unit.commodities[c].commodity],0);
					unitCommoditiesItem.appendChild(unitCommoditiesValueCell);
					var unitCommoditiesTradeCell = document.createElement('td');
					var unitCommoditiesTradeBtn = document.createElement('button');
					unitCommoditiesTradeBtn.innerHTML = "+";
					unitCommoditiesTradeBtn.setAttribute('onclick','handlers.addFromUnit('+u+',"'+c+'")');
					unitCommoditiesTradeBtn.id = 'unitAddBtn_' + u + '_' + c;
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
				};
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
				unitPane.appendChild(enRouteP);
				if (!unit.departed) {
					var cancelRouteBtn = document.createElement('button');
					cancelRouteBtn.innerHTML = 'cancel';
					cancelRouteBtn.setAttribute('onclick','handlers.cancelRoute('+unitIndex+')');
					unitPane.appendChild(cancelRouteBtn);
				};
			};
		
			if (unit.location !== undefined) { view.displaySiteDetails(unit.location); };
			view.updateTradeDiv();
		};
		
		if (unitsAtSite.length > 1) {
			var unitTabsDiv = document.createElement('div');
			unitTabsDiv.id = 'unitTabsDiv';
			detailsUnitDiv.appendChild(unitTabsDiv);
			for ( u in unitsAtSite ) {
				var unitTab = document.createElement('span');
				unitTab.className = 'unitTab';
				unitTab.innerHTML = unitsAtSite[u].name;
				unitTab.setAttribute('onclick','handlers.switchUnitPane('+units.indexOf(unitsAtSite[u])+','+u+')');
				unitTabsDiv.appendChild(unitTab);
			};
		};
		
		view.focus.unitPane = unitsAtSite.indexOf(selectedUnit);
		document.getElementById('unitPane_' + view.focus.unitPane ).style.display = 'block';
	},
	
	switchUnitPane: function(paneIndex,unitIndex) {
		var panes = document.getElementById('detailsUnitDiv').children;
		for (i=0;i<panes.length-1;i++) {
			panes[i].style.display = 'none';
		};
		document.getElementById('unitPane_'+paneIndex).style.display = 'block';
		view.focus.unit = units[unitIndex];
		view.focus.unitPane = paneIndex;
	},
	
	revealRename: function() {
		document.getElementById('unitRenameDiv_'+view.focus.unitPane).style.display = 'block';
		document.getElementById('unitHead_'+view.focus.unitPane).style.display = 'none';
	},
	
	updateTradeDiv: function() {
		var currentTrade = view.focus.unit.currentTrade;
		
		if (currentTrade.unitStuff.length + currentTrade.siteStuff.length == 0) {
			document.getElementById('tradeDiv').style.display = 'none';
		} else {
			document.getElementById('tradeDiv').style.display = 'block';
		
			currentTrade.balance = 0;
		
			var unitStuffDiv = document.getElementById('unitStuffDiv');
			unitStuffDiv.innerHTML = '';
			var unitStuffList = document.createElement('ul');
			unitStuffDiv.appendChild(unitStuffList);
			for (i in currentTrade.unitStuff) {
				var unitStuffItem = document.createElement('li');
				unitStuffItem.innerHTML = data.commodities[currentTrade.unitStuff[i].commodity].name + ' ';
				var unitStuffRemoveBtn = document.createElement('button');
				unitStuffRemoveBtn.innerHTML = '-';
				unitStuffRemoveBtn.setAttribute('onclick','handlers.removeUnitStuff('+i+')');
				unitStuffItem.appendChild(unitStuffRemoveBtn);
				unitStuffList.appendChild(unitStuffItem);
				currentTrade.balance += currentTrade.unitStuff[i].qty * view.focus.unit.location.commodities[currentTrade.unitStuff[i].commodity];
			};
		
			var siteStuffDiv = document.getElementById('siteStuffDiv');
			siteStuffDiv.innerHTML = '';
			var siteStuffList = document.createElement('ul');
			siteStuffDiv.appendChild(siteStuffList);
			for (i in currentTrade.siteStuff) {
				var siteStuffItem = document.createElement('li');
				siteStuffItem.innerHTML = data.commodities[currentTrade.siteStuff[i].commodity].name + ' ';
				var siteStuffRemoveBtn = document.createElement('button');
				siteStuffRemoveBtn.innerHTML = '-';
				siteStuffRemoveBtn.setAttribute('onclick','handlers.removeSiteStuff('+i+')');
				siteStuffItem.appendChild(siteStuffRemoveBtn);
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
		};
	},
	
	hideTradeDiv: function() {
		document.getElementById('tradeDiv').style.display = 'hidden';
	},
	
	disableUnitAddBtn: function(paneIndex,commodityIndex) {
		document.getElementById('unitAddBtn_' + paneIndex + '_' + commodityIndex).disabled = true;
	},
	
	enableUnitAddBtn: function(commodityIndex) {
		console.log('unitAddBtn_' + view.focus.unitPane + '_' + commodityIndex);
		document.getElementById('unitAddBtn_' + view.focus.unitPane + '_' + commodityIndex).disabled = false;
	},
	
	enableUnitAddBtns: function() {
		for (i in view.focus.unit.commodities) {
			document.getElementById('unitAddBtn_' + view.focus.unitPane + '_' + i).disabled = false;
		};
	},
	
	displayError: function(message) {
		console.log(message);		
	},

};