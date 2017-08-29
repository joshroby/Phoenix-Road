var view = {

	focus: {
		unitPane: 0,
	},
	
	errorMessage: '',
	
	zoom: {
		z: 1000,
		viewbox: {
			minX: 0,
			minY: 0,
			height: 1000,
			width: 1000,
		}
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
		var notifySpan = document.createElement('span');
		notifySpan.id = 'notifySpan';
		notifySpan.innerHTML = view.errorMessage;
		if (view.errorMessage !== '') {
			notifySpan.className = 'errorMessage';
		} else {
			notifySpan.className = 'empty';
		};
		clockDiv.appendChild(notifySpan);
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
		var viewboxString = view.zoom.viewbox.minX + ' ' + view.zoom.viewbox.minY + ' ' + view.zoom.viewbox.height + ' ' + view.zoom.viewbox.width;
		svg.setAttribute('viewBox',viewboxString);
		svg.id = 'mapSVG';
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		svg.appendChild(defs);
		var greenGradient = document.createElementNS('http://www.w3.org/2000/svg','radialGradient');
		greenGradient.id = 'greenGradient';
		defs.appendChild(greenGradient);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','20%');
		stop.setAttribute('stop-color','green');
		stop.setAttribute('stop-opacity',0.05);
		greenGradient.appendChild(stop);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','80%');
		stop.setAttribute('stop-color','green');
		stop.setAttribute('stop-opacity',0.02);
		greenGradient.appendChild(stop);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-color','green');
		stop.setAttribute('stop-opacity',0);
		greenGradient.appendChild(stop);
				
		var background = document.createElementNS('http://www.w3.org/2000/svg','rect');
		background.setAttribute('fill','#FFAA00');
		background.setAttribute('x','0');
		background.setAttribute('y','0');
		background.setAttribute('width','1000');
		background.setAttribute('height','1000');
		svg.appendChild(background);
		
		for (i in p1.knownSites) {
			for (c in p1.knownSites[i].carpet) {
				var newCarpet = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
// 				if (p1.knownSites[i].hasVisited.p1) {
					newCarpet.setAttribute('fill','url(#greenGradient)');
// 				} else {
// 					newCarpet.setAttribute('fill','none');
// 				};
				newCarpet.setAttribute('stroke','none');
				newCarpet.setAttribute('cx',p1.knownSites[i].x);
				newCarpet.setAttribute('cy',p1.knownSites[i].y);
				var r = 0;
				var needs = p1.knownSites[i].needs();
				for (n in needs) {
					r += needs[n].completion * ( 400 / needs.length);
				};

				newCarpet.setAttribute('rx',(0.5 * p1.knownSites[i].carpet[c].squish + 0.25) * r);
				newCarpet.setAttribute('ry',(1 - (0.5 * p1.knownSites[i].carpet[c].squish + 0.25)) * r);
				newCarpet.setAttribute('transform','rotate('+p1.knownSites[i].carpet[c].tilt*360+' '+p1.knownSites[i].x+' '+p1.knownSites[i].y+')');
				svg.appendChild(newCarpet);
			};
		};
		
		for (i in p1.knownLandmarks) {
			var newLandmark = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			newLandmark.setAttribute('fill','darkorange');
			newLandmark.setAttribute('cx',p1.knownLandmarks[i].x);
			newLandmark.setAttribute('cy',p1.knownLandmarks[i].y);
			newLandmark.setAttribute('rx',(0.5 * p1.knownLandmarks[i].size + 0.25) * 100);
			newLandmark.setAttribute('ry',(1 - (0.5 * p1.knownLandmarks[i].size + 0.25)) * 100);
			newLandmark.setAttribute('transform','rotate('+p1.knownLandmarks[i].type*360+' '+p1.knownLandmarks[i].x+' '+p1.knownLandmarks[i].y+')');
			svg.appendChild(newLandmark);
		};
		
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
				siteLabel.setAttribute('fill','black');
			} else {
				siteLabel.setAttribute('fill','dimgray');
			};
			siteLabel.setAttribute('x',p1.knownSites[i].x + 10);
			siteLabel.setAttribute('y',p1.knownSites[i].y + 5);
			siteLabel.setAttribute('onmouseover','handlers.displaySiteDetails('+siteIndex+')');
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
		
		svg.addEventListener('mousedown',view.mapDragStart);
		svg.addEventListener('mousemove',view.mapDragGo);
		svg.addEventListener('mouseup',view.mapDragEnd);
		svg.addEventListener('mouseleave',view.mapDragEnd);
		svg.addEventListener('wheel',view.mapZoom);
		
		svg.setAttribute('onmouseout','handlers.displaySiteDetails(-1)');
		
		mapDiv.appendChild(svg);
		
		var progressDiv = document.createElement('div');
		mapDiv.appendChild(progressDiv);
		
		var progressExploreDiv = document.createElement('div');
		progressExploreDiv.className = 'progressDiv';
		progressDiv.appendChild(progressExploreDiv);
		var progressExploreP = document.createElement('p');
		progressExploreP.innerHTML = "Explore: ";
		progressExploreP.className = 'progressLabel';
		progressExploreDiv.appendChild(progressExploreP);
		var progressExploreBar = document.createElement('div');
		progressExploreBar.className = 'progressBar';
		var progressExploreDoneBar = document.createElement('div');
		progressExploreDoneBar.className = 'progressBarDone';
		var percentage = Math.round(p1.knownSites.length/sites.length * 100,0);
		var caption = percentage + "%";
		progressExploreDoneBar.innerHTML = caption;
		progressExploreDoneBar.style.width = percentage + '%';
		progressExploreBar.appendChild(progressExploreDoneBar);
		progressExploreDiv.appendChild(progressExploreBar);		
		
		var progressRebuildDiv = document.createElement('div');
		progressRebuildDiv.className = 'progressDiv';
		progressDiv.appendChild(progressRebuildDiv);
		var progressRebuildP = document.createElement('p');
		progressRebuildP.innerHTML = "Rebuild: ";
		progressRebuildP.className = 'progressLabel';
		progressRebuildDiv.appendChild(progressRebuildP);
		var progressRebuildBar = document.createElement('div');
		progressRebuildBar.className = 'progressBar';
		var progressRebuildDoneBar = document.createElement('div');
		progressRebuildDoneBar.className = 'progressBarDone';
		var percentage = Math.round(model.victoryProgress() * 100,0);
		var caption = percentage + "%";
		progressRebuildDoneBar.innerHTML = caption;
		progressRebuildDoneBar.style.width = percentage + '%';
		progressRebuildBar.appendChild(progressRebuildDoneBar);
		progressRebuildDiv.appendChild(progressRebuildBar);

	},
	
	mapZoom: function(e) {
		view.zoom.z += e.deltaY * 2;
		view.zoom.z = Math.min(Math.max(view.zoom.z,1),1000);
		
		var mapSVG = document.getElementById('mapSVG');
		var mapRect = mapSVG.getBoundingClientRect();
		var viewbox = view.zoom.viewbox;
		
		var relX = (e.pageX - mapRect.left)/mapRect.width;
		var relY = (e.pageY - mapRect.top)/mapRect.height;
		
		var viewX = 1000*relX;
		var viewY = 1000*relY;
		
		var mapX = viewbox.minX + view.zoom.z*relX;
		var mapY = viewbox.minY + view.zoom.z*relY;
		
// 		console.log('view',viewX,viewY);
// 		console.log('map',mapX,mapY);
// 		console.log('zoom',view.zoom.z);
				
		viewbox.minX = Math.min(1000-view.zoom.z,Math.max(0,viewX - view.zoom.z / 2));
		viewbox.minY = Math.min(1000-view.zoom.z,Math.max(0,viewY - view.zoom.z / 2));
		viewbox.width = view.zoom.z;
		viewbox.height = view.zoom.z;

		var viewboxString = viewbox.minX + ' ' + viewbox.minY + ' ' + viewbox.width + ' ' + viewbox.height;
		mapSVG.setAttribute('viewBox',viewboxString);
		view.zoom.viewbox = viewbox;
	},
	
	mapDragStart: function(e) {
		view.zoom.dragging = true;
		view.zoom.dragStartX = e.pageX;
		view.zoom.dragStartY = e.pageY;
	},
	
	mapDragGo: function(e) {
		if (view.zoom.dragging) {
			var viewbox = view.zoom.viewbox;
			var diffX = e.pageX - view.zoom.dragStartX;
			var diffY = e.pageY - view.zoom.dragStartY;
			if (diffX < viewbox.minX && viewbox.minX - diffX + viewbox.width < 1000) {
				view.zoom.dragStartX = e.pageX;
				viewbox.minX -= diffX;
			};
			if (diffY < viewbox.minY && viewbox.minY - diffY + viewbox.height < 1000) {
				view.zoom.dragStartY = e.pageY;
				viewbox.minY -= diffY;
			};
			var viewboxString = viewbox.minX + ' ' + viewbox.minY + ' ' + viewbox.width + ' ' + viewbox.height;
			mapSVG.setAttribute('viewBox',viewboxString);
		};
	},
	
	mapDragEnd: function(e) {
		view.zoom.dragging = false;
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
			if (site.resources[i].visible || site.hasSurveyed.p1[i]) {
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
	
		var siteReputationP = document.createElement('p');
		siteReputationP.id = 'siteReputationP';
		if (site.reputation.p1 > 0) {
			siteReputationP.innerHTML += 'Your reputation here: +' + Math.round(site.reputation.p1,0);
			siteReputationP.className = 'positive';
		} else if (site.reputation.p1 < 0) {
			siteReputationP.innerHTML += 'You reputation here: ' + Math.round(site.reputation.p1,0);
			siteReputationP.className = 'negative';
		} else {
			siteReputationP.innerHTML += 'You have no reputation here.';
			siteReputationP.className = '';
		};
		siteCommoditiesDiv.appendChild(siteReputationP);
	
		if (site.hasVisited.p1) {
			var commoditiesTraded = site.trading();
			var siteCommoditiesTable = document.createElement('table');
			siteCommoditiesTable.className = 'commoditiesTable';
			siteCommoditiesDiv.appendChild(siteCommoditiesTable);
			var siteCommoditiesTableTitle = document.createElement('caption');
			siteCommoditiesTableTitle.innerHTML = 'Commodity Values';
			siteCommoditiesTable.appendChild(siteCommoditiesTableTitle);
			var knownValues = model.knownValues();
			for (c in commoditiesTraded) {
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
			
		if (site.hasVisited.p1) {
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
						lockedOption.innerHTML = 'Select unit...';
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
					buildBtn.id = 'siteBuildBtn';
					buildBtn.setAttribute('onclick','handlers.buildUnit('+i+')');
					buildBtn.innerHTML = 'Build';
					infrastructureDiv.appendChild(buildBtn);
					var buildInfoTable = document.createElement('table');
					buildInfoTable.id = 'buildInfoTable_'+i;
					infrastructureDiv.appendChild(buildInfoTable);
				} else if (site.infrastructure[i].upgrade !== undefined) {
					var upgrade = site.infrastructure[i].upgrade;
					var upgradeString = upgrade.charAt(0).toUpperCase() + upgrade.slice(1);
					var current = p1[upgrade] / 60;
					var cost = current*500;
					var infrastructureDiv = document.createElement('div');
					var infrastructureHead = document.createElement('h3');
					infrastructureHead.className = 'infrastructureHead';
					infrastructureHead.innerHTML = site.infrastructure[i].name;
					infrastructureDiv.appendChild(infrastructureHead);
					infrastructureUpgradeButton = document.createElement('button');
					infrastructureUpgradeButton.innerHTML = 'Upgrade ' + upgradeString + " (" +cost+ ")";
					infrastructureUpgradeButton.setAttribute('onclick','handlers.upgrade("'+upgrade+'")');
					if(cost > site.reputation.p1) {
						infrastructureUpgradeButton.disabled = true;
					};
					infrastructureDiv.appendChild(infrastructureUpgradeButton);
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				} else if (site.infrastructure[i].valuables !== undefined) {
					var infrastructureDiv = document.createElement('div');
					infrastructureDiv.innerHTML = 'Trade for Valuables';
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				};
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
		
		// Enable/disable the Build button
		if (view.focus.unit.canAfford(unitType.buildCost)) {
			document.getElementById('siteBuildBtn').disabled = false;
		} else {
			document.getElementById('siteBuildBtn').disabled = true;
		};
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
			if (unit.offroad) {
				unitModelP.innerHTML = unit.type.crew + " Crew, Offroad Speed " + unit.type.offroadSpeed;
			} else {
				unitModelP.innerHTML = unit.type.crew + " Crew, Speed " + unit.type.speed;
			};
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
			if (unit.location !== undefined) {
				var trading = unit.location.trading();
			} else {
				var trading = {};
			};
			for (c in unit.commodities) {
				var unitCommoditiesItem = document.createElement('tr');
				unitCommoditiesTable.appendChild(unitCommoditiesItem);
				var unitCommoditiesNameCell = document.createElement('td');
				unitCommoditiesNameCell.innerHTML = data.commodities[unit.commodities[c].commodity].name;
				if (unit.commodities[c].commodity == 'food' || unit.commodities[c].commodity == 'water') {
					unitCommoditiesNameCell.innerHTML += ' (' + unit.commodities[c].qty + '%)';
				};
				unitCommoditiesItem.appendChild(unitCommoditiesNameCell);
				if (unit.location !== undefined && trading[unit.commodities[c].commodity] !== undefined) {
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
		
			// Action Buttons
			var unitActionsDiv = document.createElement('div');
			unitActionsDiv.className = 'unitActionsDiv';
			unitPane.appendChild(unitActionsDiv);
		
			var unitOffroadButton = document.createElement('button');
			if (unit.offroad == false) {
				unitOffroadButton.innerHTML = 'Go Offroad';
			} else if (unit.location == undefined) {
				unitOffroadButton.innerHTML = 'Reach a Site';
				unitOffroadButton.disabled = true;
			} else {
				unitOffroadButton.innerHTML = 'Return to Road';
			};
			unitOffroadButton.setAttribute('onclick','handlers.toggleRoad()');
			unitActionsDiv.appendChild(unitOffroadButton);
		
			var unitSurveyButton = document.createElement('button');
			unitSurveyButton.innerHTML = 'Survey';
			unitSurveyButton.setAttribute('onclick','handlers.survey()');
			if (!unit.type.canSurvey || unit.isSurveying || unit.location == undefined) {unitSurveyButton.disabled = true;};
			unitActionsDiv.appendChild(unitSurveyButton);
		
			var unitScuttleButton = document.createElement('button');
			unitScuttleButton.innerHTML = 'Scuttle';
			unitScuttleButton.setAttribute('onclick','handlers.scuttle()');
			if (units.length == 1) {unitScuttleButton.disabled = true;};
			unitActionsDiv.appendChild(unitScuttleButton);
			
			// Building Infrastructure
			if (unit.type.canBuild && unit.location !== undefined) {
				var unitBuildHead = document.createElement('h3');
				unitBuildHead.innerHTML = 'Build';
				unitPane.appendChild(unitBuildHead);
				
				var unitBuildSelect = document.createElement('select');
				unitBuildSelect.id = 'unitBuildSelect_' + u;
				unitBuildSelect.className = 'buildSelect';
				unitBuildSelect.setAttribute('onchange','handlers.displayInfrastructurePreview('+u+')');
				var unitBuildOption = document.createElement('option');
				unitBuildOption.innerHTML = 'Select...';
				unitBuildOption.selected = true;
				unitBuildOption.disabled = true;
				unitBuildSelect.appendChild(unitBuildOption);
				for (b in unit.type.buildInfrastructures) {
					var requirements = data.infrastructure[unit.type.buildInfrastructures[b]].requiredResource;
					var requirementsFulfilled = false;
					for (r in requirements) {
						if (unit.location.resources.indexOf(data.resources[requirements[r]]) !== -1) {
							requirementsFulfilled = true;
						};
					};
					if ((requirements == undefined || requirementsFulfilled) && unit.location.infrastructure.indexOf(data.infrastructure[unit.type.buildInfrastructures[b]]) == -1) {
						var unitBuildOption = document.createElement('option');
						unitBuildOption.innerHTML = data.infrastructure[unit.type.buildInfrastructures[b]].name;
						unitBuildOption.value = unit.type.buildInfrastructures[b];
						unitBuildSelect.appendChild(unitBuildOption);
					};
				};
				unitPane.appendChild(unitBuildSelect);
				
				var unitBuildBtn = document.createElement('button');
				unitBuildBtn.id = 'unitBuildBtn_' + u;
				unitBuildBtn.innerHTML = 'Build';
				unitBuildBtn.setAttribute('onclick','handlers.buildInfrastructure('+u+')');
				unitPane.appendChild(unitBuildBtn);
				
				var unitBuildPreviewDiv = document.createElement('div');
				unitBuildPreviewDiv.id = 'unitBuildPreviewDiv_' + u;
				unitBuildPreviewDiv.className = 'unitBuildPreviewDiv';
				unitPane.appendChild(unitBuildPreviewDiv);
			};
		
		};
		
		// Unit Tabs
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

		if (unit.location !== undefined) { view.displaySiteDetails(unit.location); };
		view.updateTradeDiv();		
		view.focus.unitPane = unitsAtSite.indexOf(selectedUnit);
		document.getElementById('unitPane_' + view.focus.unitPane ).style.display = 'block';
	},
	
	displayInfrastructurePreview: function(pane,key) {
		var infrastructure = data.infrastructure[key];
		var unitBuildPreviewDiv = document.getElementById('unitBuildPreviewDiv_' + pane);
		unitBuildPreviewDiv.innerHTML = '';
		
		var unitBuildPreviewHead = document.createElement('h4');
		unitBuildPreviewHead.innerHTML = infrastructure.name;
		unitBuildPreviewDiv.appendChild(unitBuildPreviewHead);
		
		var unitBuildPreviewDesc = document.createElement('p');
		unitBuildPreviewDesc.innerHTML = view.infrastructureDescription(key);
		unitBuildPreviewDiv.appendChild(unitBuildPreviewDesc);
		
		var unitBuildCostP = document.createElement('p');
		unitBuildCostP.innerHTML = 'Materials: ';
		for (b in infrastructure.buildCost) {
			unitBuildCostP.innerHTML += infrastructure.buildCost[b] + " " + b + ", ";
		};
		if (view.focus.unit.location !== undefined) {
			unitBuildCostP.innerHTML += " (~" + Math.round(view.focus.unit.location.costInRep(infrastructure.buildCost),0) + " reputation)";
		};
		unitBuildPreviewDiv.appendChild(unitBuildCostP);
		
		if (view.focus.unit.canAfford(infrastructure.buildCost)) {
			document.getElementById('unitBuildBtn_'+pane).disabled = false;
		} else {
			document.getElementById('unitBuildBtn_'+pane).disabled = true;
		};
		
	},
	
	infrastructureDescription: function(key) {
		var string = '';
		var infrastructure = data.infrastructure[key];
		if (infrastructure.requiredResource !== undefined) {
			string += 'Upgrades a ' + infrastructure.requiredResource + '. ';
		};
		if (infrastructure.housing > 0) {
			string += 'Provides housing for ' + infrastructure.housing + '. ';
		};
		if (infrastructure.defense > 0) {
			string += 'Provides defense of ' + infrastructure.defense + '. ';
		};
		if (infrastructure.outputs !== undefined) {
			string += 'Produces '
		};
		for (p in infrastructure.outputs) {
			string += infrastructure.outputs[p] + ' ';
		};
		if (infrastructure.outputs !== undefined) {
			string += '. '
		};
		if (infrastructure.inputs !== undefined) {
			string += 'Increases value of '
		};
		for (p in infrastructure.inputs) {
			string += infrastructure.inputs[p] + ' ';
		};
		if (infrastructure.inputs !== undefined) {
			string += '. '
		};
		return string;
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
				balanceDiv.className = 'positive';
			} else {
				balanceDiv.className = 'negative';
			};
		
			if (currentTrade.balance >= -1 * view.focus.unit.location.reputation.p1) {
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
// 		console.log('unitAddBtn_' + view.focus.unitPane + '_' + commodityIndex);
		document.getElementById('unitAddBtn_' + view.focus.unitPane + '_' + commodityIndex).disabled = false;
	},
	
	enableUnitAddBtns: function() {
		var trading = undefined;
		if (view.focus.unit.location !== undefined) {
			trading = view.focus.unit.location.trading();
		};
		for (i in view.focus.unit.commodities) {
			if (trading[view.focus.unit.commodities[i].commodity] !== undefined) {
				document.getElementById('unitAddBtn_' + view.focus.unitPane + '_' + i).disabled = false;
			};
		};
	},
	
	displayError: function(message) {
		console.log('error:',message);
		document.getElementById('notifySpan').innerHTML = message;
		document.getElementById('notifySpan').className = 'errorMessage';
		view.errorMessage = message;
		var timedEvent = setTimeout(view.clearError,5000);
	},
	
	clearError: function() {
		document.getElementById('notifySpan').innerHTML = '';
		document.getElementById('notifySpan').className = 'empty';
		view.errorMessage = '';
	},
	
	displayNotification: function(message) {
		console.log('notification:',message);
		document.getElementById('notifySpan').innerHTML = message;
		document.getElementById('notifySpan').className = 'notifyMessage';
		view.errorMessage = message;
		var timedEvent = setTimeout(view.clearError,5000);
	},

};