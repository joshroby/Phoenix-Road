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
		document.getElementById('introDiv').style.display = 'none';
		document.getElementById('detailsUnitDiv').style.display = 'block';
		document.getElementById('detailsUnitDiv').innerHTML = '&nbsp;';
		document.getElementById('detailsSiteDiv').style.display = 'block';
		document.getElementById('detailsSiteDiv').innerHTML = '&nbsp;';
		document.getElementById('centerColumn').style.display = 'block';
		document.getElementById('saveButton').disabled = false;
		
	},
	
	refreshGameDisplay: function() {
		view.clearDetailsDivs();
		view.displayMap();
		view.displayUnit(view.focus.unit);
// 		view.displaySiteDetails(view.focus.unit.location);
		model.clock.logEventIn(8.64e+7,'refreshGameDisplay');
	},

	displayMap: function() {
		
		var mapDiv = document.getElementById('mapDiv');
		mapDiv.innerHTML = '';
		
		var clockDiv = document.createElement('div');
		clockDiv.id = 'clockDiv';
		var clockSpan = document.createElement('span');
		clockSpan.id = 'clockSpan';
		clockSpan.innerHTML =
			['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][model.clock.time.getDay()] + ', ' +
			['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][model.clock.time.getMonth()] + ' ' +
			model.clock.time.getDate() + ', ' + 
			model.clock.time.getFullYear()
			;
		clockDiv.appendChild(clockSpan);
		var clockSlowDownBtn = document.createElement('button');
		clockSlowDownBtn.innerHTML = '<span class="fa fa-backward"></span>';
		clockSlowDownBtn.setAttribute('onclick','handlers.clockSlowDown()');
		clockDiv.appendChild(clockSlowDownBtn);
		var clockPauseBtn = document.createElement('button');
		clockPauseBtn.id = 'clockPauseBtn';
		if (model.clock.running) {
			clockPauseBtn.innerHTML = '<span class="fa fa-pause"></span>';
		} else {
			clockPauseBtn.innerHTML = '<span class="fa fa-play"></span>';
		};
		clockPauseBtn.setAttribute('onclick','handlers.clockPause()');
		clockDiv.appendChild(clockPauseBtn);
		var clockSpeedUpBtn = document.createElement('button');
		clockSpeedUpBtn.innerHTML = '<span class="fa fa-forward"></span>';
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
		
		var landmarkGradient = document.createElementNS('http://www.w3.org/2000/svg','radialGradient');
		landmarkGradient.id = 'landmarkGradient';
		defs.appendChild(landmarkGradient);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','10%');
		stop.setAttribute('stop-color','darkorange');
		stop.setAttribute('stop-opacity',1);
		landmarkGradient.appendChild(stop);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-color','darkorange');
		stop.setAttribute('stop-opacity',0.1);
		landmarkGradient.appendChild(stop);
		
		var landmarkShadow = document.createElementNS('http://www.w3.org/2000/svg','clipPath');
		landmarkShadow.id = 'landmarkShadow';
		defs.appendChild(landmarkShadow);
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',0);
		rect.setAttribute('y',0);
		rect.setAttribute('width',20);
		rect.setAttribute('height',20);
// 		rect.setAttribute('transform','rotate(45)');
		landmarkShadow.appendChild(rect);
		
		for (var i in data.units) {
			if (draw[i] !== undefined) {
				var svgNodes = draw[i]();
				defs.appendChild(svgNodes);
			};
		};
				
		var background = document.createElementNS('http://www.w3.org/2000/svg','rect');
		background.setAttribute('fill','#FFAA00');
		background.setAttribute('x','0');
		background.setAttribute('y','0');
		background.setAttribute('width','1000');
		background.setAttribute('height','1000');
		svg.appendChild(background);
		
		var carpetGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		carpetGroup.id = 'carpetGroup';
		svg.appendChild(carpetGroup);
		
		for (var i in players.p1.knownSites) {
			for (var c in players.p1.knownSites[i].carpet) {
				var newCarpet = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
				newCarpet.setAttribute('fill','url(#greenGradient)');
				newCarpet.setAttribute('stroke','none');
				newCarpet.setAttribute('cx',players.p1.knownSites[i].x);
				newCarpet.setAttribute('cy',players.p1.knownSites[i].y);
				var r = 0;
				var needs = players.p1.knownSites[i].needs();
				for (var n in needs) {
					r += needs[n].completion * ( 400 / needs.length);
				};
				
				errors['view118'] = players.p1.knownSites[i];
				newCarpet.setAttribute('rx',(0.5 * players.p1.knownSites[i].carpet[c].squish + 0.25) * r);
				newCarpet.setAttribute('ry',(1 - (0.5 * players.p1.knownSites[i].carpet[c].squish + 0.25)) * r);
				newCarpet.setAttribute('transform','rotate('+ players.p1.knownSites[i].carpet[c].tilt*360+' '+players.p1.knownSites[i].x+' '+players.p1.knownSites[i].y+')');
				carpetGroup.appendChild(newCarpet);
			};
		};
		
		var landmarksGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		landmarksGroup.id = 'landmarksGroup';
		svg.appendChild(landmarksGroup);

		for (var i in players.p1.knownLandmarks) {
			var newLandmark = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
			newLandmark.setAttribute('fill','darkorange');
			newLandmark.setAttribute('cx',players.p1.knownLandmarks[i].x);
			newLandmark.setAttribute('cy',players.p1.knownLandmarks[i].y);
			newLandmark.setAttribute('rx',(0.5 * players.p1.knownLandmarks[i].size + 0.25) * 100);
			newLandmark.setAttribute('ry',(1 - (0.5 * players.p1.knownLandmarks[i].size + 0.25)) * 100);
			newLandmark.setAttribute('transform','rotate('+ players.p1.knownLandmarks[i].type*360+' '+players.p1.knownLandmarks[i].x+' '+players.p1.knownLandmarks[i].y+')');
			landmarksGroup.appendChild(newLandmark);
		};
		
		var routesGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		routesGroup.id = 'routesGroup';
		svg.appendChild(routesGroup);

		for (var i in players.p1.knownSites) {
			for (var n in players.p1.knownSites[i].neighbors) {
				var newRoute = document.createElementNS('http://www.w3.org/2000/svg','path');
				newRoute.setAttribute('fill','none');
				newRoute.setAttribute('stroke','yellow');
				var d = 'M' + players.p1.knownSites[i].x + ',' + players.p1.knownSites[i].y;
				var dx = players.p1.knownSites[i].neighbors[n].x - players.p1.knownSites[i].x;
				var dy = players.p1.knownSites[i].neighbors[n].y - players.p1.knownSites[i].y;
				var dc1x = dx // * Math.random();
				var dc1y = dy // * Math.random();
				var dc2x = dx // * Math.random();
				var dc2y = dy // * Math.random();
				d += ' c ' + dc1x + ' ' + dc1y + ' ' + dc2x + ' ' + dc2y + ' ' + dx + ' ' + dy;
				newRoute.setAttribute('d',d);
				routesGroup.appendChild(newRoute);
			};
		};
		
		var sitesGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		sitesGroup.id = 'sitesGroup';
		svg.appendChild(sitesGroup);

		for (var i in players.p1.knownSites) {
			var siteIndex = sites.indexOf(players.p1.knownSites[i]);
			
			var siteLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			if (players.p1.knownSites[i].hasVisited.p1) {
				siteLabel.setAttribute('fill','black');
			} else {
				siteLabel.setAttribute('fill','dimgray');
			};
			siteLabel.setAttribute('x',players.p1.knownSites[i].x + 10);
			siteLabel.setAttribute('y',players.p1.knownSites[i].y + 5);
			siteLabel.setAttribute('onmouseover','handlers.displaySiteDetails('+siteIndex+')');
			siteLabel.innerHTML = players.p1.knownSites[i].name;
			sitesGroup.appendChild(siteLabel);

			var newSite = document.createElementNS('http://www.w3.org/2000/svg','circle');
			newSite.id = 'site_' + i;
			if (players.p1.knownSites[i].hasVisited.p1) {
				newSite.setAttribute('fill','black');
			} else {
				newSite.setAttribute('fill','dimgray');
			};
			newSite.setAttribute('stroke','yellow');
			newSite.setAttribute('cx',players.p1.knownSites[i].x);
			newSite.setAttribute('cy',players.p1.knownSites[i].y);
			if (players.p1.knownSites[i].population < 100) {
				newSite.setAttribute('r',4);
			} else if (players.p1.knownSites[i].population < 400) {
				newSite.setAttribute('r',5);
			} else {
				newSite.setAttribute('r',6);
			};
			newSite.setAttribute('onclick','handlers.selectSite('+siteIndex+')');
			sitesGroup.appendChild(newSite);
		};
		
		var unitsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		unitsGroup.id = 'unitsGroup';
		svg.appendChild(unitsGroup);

		for (var i in units) {
			if (units[i].inTransit) {
				unitX = units[i].route[0].x;
				unitY = units[i].route[0].y;
			} else {
				unitX = units[i].location.x;
				unitY = units[i].location.y + 10;
			};
			var newUnit = document.createElementNS('http://www.w3.org/2000/svg','use');
			newUnit.setAttribute('href','#'+units[i].type.symbol);
			newUnit.setAttribute('x',unitX - 25);
			newUnit.setAttribute('y',unitY - 5);
			newUnit.setAttribute('onclick','handlers.selectUnit('+i+')');
// 			newUnit.setAttribute('paint-order','stroke fill');
// 			newUnit.setAttribute('stroke-width','50');
			if (units[i].inTransit) {
// 				newUnit.setAttribute('stroke','#006400');
				newUnit.setAttribute('fill','#006400');
			} else if (units[i].isBuilding) {
// 				newUnit.setAttribute('stroke','#F0E68C');
				newUnit.setAttribute('fill','#F0E68C');
			} else if (units[i].isSurveying) {
// 				newUnit.setAttribute('stroke','#AFEEEE');
				newUnit.setAttribute('fill','#AFEEEE');
			} else {
// 				newUnit.setAttribute('stroke','red');
				newUnit.setAttribute('fill','red');
			};
			unitsGroup.appendChild(newUnit);
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
		progressExploreBar.className = 'progressBar bigProgressBar';
		var progressExploreDoneBar = document.createElement('div');
		progressExploreDoneBar.className = 'progressBarDone';
		var percentage = Math.round(players.p1.knownSites.length/sites.length * 100,0);
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
		progressRebuildBar.className = 'progressBar bigProgressBar';
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
		
		// coordinates relative to map contents
		var relX = (e.pageX - mapRect.left)/mapRect.width;
		var relY = (e.pageY - mapRect.top)/mapRect.height;
		
		// coordinates relative to viewbox / map borders
		var viewX = 1000*relX;
		var viewY = 1000*relY;
		
		var mapX = viewbox.minX + view.zoom.z*relX;
		var mapY = viewbox.minY + view.zoom.z*relY;
		
// 		console.log('view',viewX,viewY);
// 		console.log('map',mapX,mapY);
// 		console.log('zoom',view.zoom.z);
				
		viewbox.minX = Math.min(1000-view.zoom.z,Math.max(0,mapX - view.zoom.z / 2));
		viewbox.minY = Math.min(1000-view.zoom.z,Math.max(0,mapY - view.zoom.z / 2));
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
		view.focus.site = site;
		
		var detailsSiteDiv = document.getElementById('detailsSiteDiv');
		detailsSiteDiv.innerHTML = '';

		var siteCharacterDiv = document.createElement('div');
		siteCharacterDiv.id = 'siteCharacterDiv';
		siteCharacterDiv.className = 'sidebarTop';
		detailsSiteDiv.appendChild(siteCharacterDiv);
		var siteCommoditiesDiv = document.createElement('div');
		siteCommoditiesDiv.id = 'siteCommoditiesDiv';
		siteCommoditiesDiv.className = 'sidebarMiddle';
		detailsSiteDiv.appendChild(siteCommoditiesDiv);
		var siteInfrastructureDiv = document.createElement('div');
		siteInfrastructureDiv.id = 'siteInfrastructureDiv';
		siteInfrastructureDiv.className = 'sidebarBottom';
		detailsSiteDiv.appendChild(siteInfrastructureDiv);

		var siteHead = document.createElement('h2');
		siteHead.innerHTML = site.name;
		siteHead.className = 'siteHead';
		siteCharacterDiv.appendChild(siteHead);

		if (site.hasVisited.p1) {
			var sitePopulationP = document.createElement('p');
			if (site.population > 0) {
				sitePopulationP.innerHTML = site.population + " souls";
			} else {
				sitePopulationP.innerHTML = "Ghost Town";
			};
			sitePopulationP.className = 'narrowMargin';
			siteCharacterDiv.appendChild(sitePopulationP);
		};
		if (site.hasVisited.p1 && site.population > 0) {
			var siteNeedsDiv = document.createElement('div');
			siteNeedsDiv.id = 'siteNeedsDiv';
			siteCharacterDiv.appendChild(siteNeedsDiv);
			var siteNeeds = site.needs();
			for (var i in siteNeeds) {
				var siteNeedDiv = document.createElement('div');
				siteNeedDiv.className = 'siteNeedDiv';
				var siteNeedsBar = document.createElement('div');
				siteNeedsBar.className = 'progressBar';
				var siteNeedsBarDone = document.createElement('div');
				siteNeedsBarDone.className = 'progressBarDone';
				var width = siteNeeds[i].completion * 100;
				siteNeedsBarDone.style.width = width + "%";
				siteNeedsBarDone.style.backgroundColor = view.progressColor(width);
	// 			siteNeedsBarDone.innerHTML = siteNeeds[i].label;
				var siteNeedsBarLabel = document.createElement('a');
				siteNeedsBarLabel.className = 'tipAnchor';
				siteNeedsBarLabel.innerHTML = siteNeeds[i].label;
				siteNeedsBarDone.appendChild(siteNeedsBarLabel);
				var tooltipSpan = document.createElement('span');
				tooltipSpan.className = 'tooltip';
				tooltipSpan.innerHTML = siteNeeds[i].desc;
				siteNeedsBarLabel.prepend(tooltipSpan);
				siteNeedsBar.appendChild(siteNeedsBarDone);
				siteNeedDiv.appendChild(siteNeedsBar);
				siteNeedsDiv.appendChild(siteNeedDiv);
			};
		} else if (!site.hasVisited.p1) {
			var sitePopulationP = document.createElement('p');
			sitePopulationP.innerHTML = 'From a distance, you can see:';
			siteCharacterDiv.appendChild(sitePopulationP);
		};
		var siteFeatureList = document.createElement('ul');
		siteFeatureList.id = 'siteFeatureList';
		siteFeatureList.className = 'narrowMargin';
		siteCharacterDiv.appendChild(siteFeatureList);
		var list = [];
		for (var i in site.resources) {
			if (site.resources[i].visible || site.hasSurveyed.p1[i]) {
				list.push(site.resources[i]);
			};
		};
		for (var i in site.infrastructure) {
			if (site.infrastructure[i].visible || site.hasVisited.p1) {
				list.push(site.infrastructure[i]);
			};
		};
		list.sort(function(a,b){
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		});
		for (var i in list) {
			var siteFeatureItem = document.createElement('a');
			siteFeatureItem.className = 'siteFeatureItem tipAnchor';
			siteFeatureItem.innerHTML = list[i].name;
			siteFeatureList.appendChild(siteFeatureItem);
			var siteFeatureItemTooltip = document.createElement('span');
			siteFeatureItemTooltip.className = 'tooltip';
			siteFeatureItemTooltip.innerHTML = "<strong>" + list[i].name + "</strong><br>" + view.infrastructureDescription(list[i]);
			siteFeatureItem.prepend(siteFeatureItemTooltip);
		};
	
		var siteReputationP = document.createElement('a');
		siteReputationP.id = 'siteReputationP';
		var siteReputationTooltip = document.createElement('span');
		siteReputationTooltip.className = 'tooltip';
		siteReputationTooltip.innerHTML = Math.round(site.reputation.p1,4) + '<br />You earn ' + site.goodwill.p1 + ' reputation here each fortnight.';
		siteReputationP.appendChild(siteReputationTooltip);
		if (site.reputation.p1 > 0) {
			siteReputationP.innerHTML += 'Your reputation here: +' + Math.round(site.reputation.p1,0);
			siteReputationP.className = 'positive';
		} else if (site.reputation.p1 < 0) {
			siteReputationP.innerHTML += 'You reputation here: ' + Math.round(site.reputation.p1,0);
			siteReputationP.className = 'negative';
		} else if (site.hasVisited.p1) {
			siteReputationP.innerHTML += 'You have no reputation here.';
			siteReputationP.className = '';
		} else {
			siteReputationP.innerHTML += 'You have no reputation there.';
			siteReputationP.className = '';
		};
		siteReputationP.className += ' tipAnchor';
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
			for (var c in commoditiesTraded) {
				var siteCommoditiesItem = document.createElement('tr');
				siteCommoditiesTable.appendChild(siteCommoditiesItem);
				var siteCommoditiesNameCell = document.createElement('td');
				var icon = view.commodityIcon(c);
				siteCommoditiesNameCell.innerHTML = icon + ' ' + data.commodities[c].name;
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
				for (var u in units) {
					if (units[u].location == site) {
						unitPresent = true;
					};
				};
				if (unitPresent) {
					var siteCommoditiesTradeCell = document.createElement('td');
					siteCommoditiesTradeCell.innerHTML = '<span class="fa fa-cart-plus"></span>';
					siteCommoditiesTradeCell.setAttribute('onclick','handlers.addFromSite("'+c+'")');
					siteCommoditiesItem.appendChild(siteCommoditiesTradeCell);
				} else {
					var siteCommoditiesTradeCell = document.createElement('td');
					siteCommoditiesTradeCell.innerHTML += "&nbsp;";
					siteCommoditiesItem.appendChild(siteCommoditiesTradeCell);
				};
			};
		};
		
		var pathByRoad = false;
		var travelTime;
		var roadTravelTime;
		var offroadTravelTime;
		var travelMeansString;
		if (view.focus.unit.location !== undefined && view.focus.unit.type.speed > 0) {
			var path = view.focus.unit.location.pathTo(site);
		};
		
		if (path !== undefined) {
			roadTravelTime = Math.ceil(path.distance / view.focus.unit.type.speed);
		};
		
		if (view.focus.unit.location !== undefined) {
			var unitX = view.focus.unit.location.x;
			var unitY = view.focus.unit.location.y;
		} else {
			var unitX = view.focus.unit.route[0].x;
			var unitY = view.focus.unit.route[0].y;
		};
		offroadTravelTime = Math.ceil(Math.pow(Math.pow(unitX - site.x,2) + Math.pow(unitY - site.y,2),0.5) / view.focus.unit.type.offroadSpeed);
		
		if (offroadTravelTime < roadTravelTime || roadTravelTime == undefined) {
			travelMeansString = ' days offroad';
			travelTime = offroadTravelTime;
		} else {
			travelMeansString = ' days by road';
			travelTime = roadTravelTime;
		};
		
		if (view.focus.unit.location !== site) {
			var travelTimeP = document.createElement('p');
			travelTimeP.innerHTML = '<strong>Travel Time:</strong> ' + travelTime + travelMeansString;
			siteInfrastructureDiv.appendChild(travelTimeP);
		};
		
			
		if (site.hasVisited.p1) {
			for (var i in site.infrastructure) {
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
					var lockedOption = document.createElement('option');
					lockedOption.innerHTML = 'Select unit...';
					lockedOption.disabled = true;
					lockedOption.selected = true;
					buildSelect.appendChild(lockedOption);
					for (var u in site.infrastructure[i].buildUnits) {
						var buildOption = document.createElement('option');
						buildOption.innerHTML = data.units[site.infrastructure[i].buildUnits[u]].name;
						buildOption.value = site.infrastructure[i].buildUnits[u];
						buildSelect.appendChild(buildOption);
					};
					infrastructureDiv.appendChild(buildSelect);
					var buildBtn = document.createElement('button');
					buildBtn.id = 'siteBuildBtn_'+i;
					buildBtn.className = 'buildBtn';
					buildBtn.setAttribute('onclick','handlers.buildUnit('+i+')');
					buildBtn.innerHTML = 'Build';
					infrastructureDiv.appendChild(buildBtn);
					var buildInfoDiv = document.createElement('div');
					buildInfoDiv.id = 'buildInfoDiv_'+i;
					buildInfoDiv.className = 'buildInfoDiv';
					infrastructureDiv.appendChild(buildInfoDiv);
				} else if (site.infrastructure[i].upgrade !== undefined) {
					var upgrade = site.infrastructure[i].upgrade;
					var upgradeString = upgrade.charAt(0).toUpperCase() + upgrade.slice(1);
					var current = players.p1[upgrade] / 60;
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
				} else if (site.infrastructure[i].recruit !== undefined) {
					var infrastructureDiv = document.createElement('div');
					infrastructureDiv.innerHTML = site.infrastructure[i].text + '<br />';
					var recruitBtn = document.createElement('button');
					recruitBtn.innerHTML = 'Recruit ' + site.infrastructure[i].name;
					recruitBtn.setAttribute('onclick','handlers.recruitKidOnBike('+i+')');
					infrastructureDiv.appendChild(recruitBtn);
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				};
			};
		};
		
		// Trash Pile
		var unitPresent = false;
		for (var u in units) {
			if (units[u].location == site && units[u].owner == players.p1) {
				unitPresent = true;
			};
		};
		if (site.trash.length > 0 && unitPresent) {
			var trashTable = document.createElement('table');
			trashTable.className = 'commoditiesTable';
			siteInfrastructureDiv.appendChild(trashTable);
			var trashHead = document.createElement('caption');
			trashHead.innerHTML = "Trash Pile";
			trashTable.appendChild(trashHead);
			for (var i in site.trash) {
				var trashRow = document.createElement('tr');
				trashTable.appendChild(trashRow);
				var trashNameCell = document.createElement('td');
				var icon = view.commodityIcon(site.trash[i].commodity);
				trashNameCell.innerHTML = icon + ' ' + data.commodities[site.trash[i].commodity].name;
				if (site.trash[i].qty < 100) {
					trashNameCell.innerHTML += ' (' + site.trash[i].qty + '%)';
				};
				trashRow.appendChild(trashNameCell);
				var trashPickupCell = document.createElement('td');
				trashPickupCell.innerHTML = '<span class="fa fa-hand-paper-o fa-rotate-90"></span>';
				trashPickupCell.setAttribute('onclick','handlers.pickupTrash('+i+')');
				trashRow.appendChild(trashPickupCell);
			};
		};
			
		view.displayMap();
	},
	
	displayBuildUnit: function(infrastructureIndex,unitName) {
		var unitType = data.units[unitName];
		var buildInfoDiv = document.getElementById('buildInfoDiv_' + infrastructureIndex);
		buildInfoDiv.innerHTML = '';
		
		var buildItem = document.createElement('li');
		buildItem.className = 'narrowBuildInfoItem';
		buildItem.innerHTML = "<strong>Crew:</strong> " + unitType.crew + " <span class='fa fa-users'></span> ";
		buildInfoDiv.appendChild(buildItem);
		var buildItem = document.createElement('li');
		buildItem.className = 'narrowBuildInfoItem';
		buildItem.innerHTML = "<strong>Uses:</strong> " + view.displayCommodityList(unitType.fuel);
		buildInfoDiv.appendChild(buildItem);
		var buildItem = document.createElement('li');
		buildItem.className = 'narrowBuildInfoItem';
		buildItem.innerHTML = "<strong>Speed:</strong> " + unitType.speed + " <span class='fa fa-tachometer'></span> ";
		buildInfoDiv.appendChild(buildItem);
		var buildItem = document.createElement('li');
		buildItem.className = 'narrowBuildInfoItem';
		buildItem.innerHTML += "<strong>Offroad:</strong> " + unitType.offroadSpeed + " <span class='fa fa-tachometer'></span> ";
		buildInfoDiv.appendChild(buildItem);
		var buildItem = document.createElement('li');
		buildItem.className = 'narrowBuildInfoItem';
		buildItem.innerHTML += "<strong>Cargo:</strong> " + unitType.cargo + " <span class='fa fa-cubes'></span> ";
		buildInfoDiv.appendChild(buildItem);
		
		if (unitType.canBuild) {
			var buildList = [];
			for (var i in unitType.buildInfrastructures) {
				buildList.push(data.infrastructure[unitType.buildInfrastructures[i]].name);
			};
			var buildItem = document.createElement('li');
			buildItem.innerHTML = "<strong>Builds:</strong> " + gamen.prettyList(buildList);
			buildInfoDiv.appendChild(buildItem);
		};
		
		if (unitType.canSurvey) {
			var surveyList = [];
			for (var i in unitType.surveyResources) {
				surveyList.push(data.resources[unitType.surveyResources[i]].name);
			};
			var buildItem = document.createElement('li');
			buildItem.innerHTML = "<strong>Surveys for:</strong> " + gamen.prettyList(surveyList);
			buildInfoDiv.appendChild(buildItem);
		};
		
		if (unitType.canPassenger) {
			var buildItem = document.createElement('li');
			buildItem.innerHTML = "Can take passengers";
			buildInfoDiv.appendChild(buildItem);
		};
		
		var materialsList = [];
		for (var i in unitType.buildCost) {
			materialsList.push(unitType.buildCost[i] + " " + data.commodities[i].name);
		};
		var buildItem = document.createElement('li');
		buildItem.innerHTML += "<strong>Materials:</strong> " + gamen.prettyList(materialsList);
		var repCost = view.focus.unit.canAfford(unitType.buildCost,'rep');
		if (repCost == Infinity) {
			buildItem.innerHTML += "<br />(requires exotic materials you do not have)";
		} else {
			buildItem.innerHTML += "<br />(" + repCost + " reputation for the materials you don't already have)";
		};
		buildInfoDiv.appendChild(buildItem);		
		
		
		// Enable/disable the Build button
		if (view.focus.unit.canAfford(unitType.buildCost)) {
			document.getElementById('siteBuildBtn_'+infrastructureIndex).disabled = false;
		} else {
			document.getElementById('siteBuildBtn_'+infrastructureIndex).disabled = true;
		};
	},
	
	displayUnit: function(unit) {
		var selectedUnit = unit;
		var detailsUnitDiv = document.getElementById('detailsUnitDiv');
		detailsUnitDiv.innerHTML = '';
		
		var unitsAtSite = [];
		for (var i in units) {
			if (units[i].location == unit.location && !units[i].departed) {
				unitsAtSite.push(units[i]);
			} else if (units[i] == unit) {
				unitsAtSite.push(units[i]);
			};
		};
	
		for (var u in unitsAtSite) {
			unit = unitsAtSite[u];
			unitIndex = units.indexOf(unit);
			var unitPane = document.createElement('div');
			unitPane.id = 'unitPane_' + u;
			unitPane.className = 'unitPane';
			unitPane.style.display = 'none';
			detailsUnitDiv.appendChild(unitPane);
			
			var unitHeaderDiv = document.createElement('div');
			unitHeaderDiv.className = 'unitHeaderDiv sidebarTop';
			unitPane.appendChild(unitHeaderDiv);
			var unitCargoDiv = document.createElement('div');
			unitCargoDiv.className = 'unitCargoDiv';
			unitPane.appendChild(unitCargoDiv);
			var unitActionsDiv = document.createElement('div');
			unitActionsDiv.className = 'unitActionsDiv';
			unitPane.appendChild(unitActionsDiv);
			
			var unitPic = document.createElementNS('http://www.w3.org/2000/svg','svg');
			unitPic.setAttribute('class','unitPic');
			unitPic.setAttribute('width','100%');
			unitPic.setAttribute('fill','black');
			unitPic.setAttribute('viewbox','0 0 100 100');
			unitPic.appendChild(draw[unitsAtSite[u].type.symbol]());
			unitHeaderDiv.appendChild(unitPic);
			
			var unitHead = document.createElement('h2');
			unitHead.id = 'unitHead_'+u;
			unitHead.className = 'unitHead';
			unitHead.innerHTML = unit.name;
			unitHead.setAttribute('onclick','handlers.revealRename()');
			unitHeaderDiv.appendChild(unitHead);
		
			var unitRenameDiv = document.createElement('h2');
			unitHead.className = 'unitHead';
			unitRenameDiv.id = 'unitRenameDiv_'+u;
			unitRenameDiv.style.display = 'none';
			unitHeaderDiv.appendChild(unitRenameDiv);
			var unitRenameInput = document.createElement('input');
			unitRenameInput.setAttribute('type','text');
			unitRenameInput.id = 'unitRenameInput_' + u;
			unitRenameDiv.appendChild(unitRenameInput);
			var unitRenameBtn = document.createElement('button');
			unitRenameBtn.innerHTML = 'Rename';
			unitRenameBtn.setAttribute('onclick','handlers.renameUnit()');
			unitRenameDiv.appendChild(unitRenameBtn);
		
			var unitModelP = document.createElement('p');
			unitModelP.className = 'stat';
			if (unit.offroad) {
				unitModelP.innerHTML = "Offroad Speed " + unit.type.offroadSpeed;
			} else {
				unitModelP.innerHTML = "Speed " + unit.type.speed;
			};
			unitModelP.innerHTML += ' <span class="fa fa-tachometer"></span> ';
			unitHeaderDiv.appendChild(unitModelP);
			unitModelP = document.createElement('p');
			unitModelP.className = 'stat';
			unitModelP.innerHTML += "Cargo: " + unit.type.cargo + " <span class='fa fa-cubes'></span>"
			unitHeaderDiv.appendChild(unitModelP);
		
			var unitProvisionsP = document.createElement('p');
			unitProvisionsP.className = 'stat';
			unitHeaderDiv.appendChild(unitProvisionsP);
			var provisionsFood = 0;
			var provisionsWater = 0;
			var provisionsFuel = 0;
			for (var c in unit.commodities) {
				if (unit.commodities[c].commodity == 'food') {
					provisionsFood += unit.commodities[c].qty;
				} else if (unit.commodities[c].commodity == 'water') {
					provisionsWater += unit.commodities[c].qty;
				} else if (unit.commodities[c].commodity == 'fuel') {
					provisionsFuel += unit.commodities[c].qty;
				};
			};
			provisionsFood /= unit.type.crew;
			if (unit.type.fuel.water == undefined) {
				provisionsWater = Infinity
			} else {
				provisionsWater /= unit.type.fuel.water;
			};
			if (unit.type.fuel.fuel == undefined) {
				provisionsFuel = Infinity
			} else {
				provisionsFuel /= unit.type.fuel.fuel;
			};
			var provisions = Math.floor(Math.min(provisionsFood,provisionsWater,provisionsFuel));
			unitProvisionsP.innerHTML = provisions + " days provisions";
		
			var unitConsumesP = document.createElement('p');
			unitConsumesP.className = 'perDiem';
			unitConsumesP.innerHTML = "( ";
			for (var i=0;i<unit.type.crew;i++) {
				unitConsumesP.innerHTML += view.commodityIcon('food');
			};
			for (var i=0;i<unit.type.fuel.water;i++) {
				unitConsumesP.innerHTML += view.commodityIcon('water');
			};
			for (var i=0;i<unit.type.fuel.fuel;i++) {
				unitConsumesP.innerHTML += view.commodityIcon('fuel');
			};
			unitConsumesP.innerHTML += " / day )";
			unitHeaderDiv.appendChild(unitConsumesP);
			
			if (unitsAtSite.length > 1) {
				var unitCaravanDiv = document.createElement('div');
				unitCaravanDiv.className = 'unitCaravanDiv';
				unitHeaderDiv.appendChild(unitCaravanDiv);
				
				if (unit.caravan == undefined) {
					var unitCreateCaravanBtn = document.createElement('button');
					unitCreateCaravanBtn.innerHTML = 'Create Caravan';
					unitCreateCaravanBtn.setAttribute('onclick','handlers.createCaravan()');
					unitCaravanDiv.appendChild(unitCreateCaravanBtn);
				};
				
				if (unit.caravan !== undefined) {
					var unitCaravanP = document.createElement('p');
					unitCaravanP.innerHTML = 'In Caravan with';
					var caravanNamesList = [];
					for (var u in unit.caravan) {
						if (unit.caravan[u] !== unit) {
							caravanNamesList.push(unit.caravan[u].name);
						};
					};
					unitCaravanP.innerHTML = 'In Caravan with' + gamen.prettyList(caravanNamesList);
					unitCaravanDiv.appendChild(unitCaravanP);
					
					var unitLeaveCaravanBtn = document.createElement('button');
					unitLeaveCaravanBtn.innerHTML = 'Leave Caravan';
					unitLeaveCaravanBtn.setAttribute('onclick','handlers.leaveCaravan()');
					unitCaravanDiv.appendChild(unitLeaveCaravanBtn);
				};
				
			};

			var unitCommoditiesTable = document.createElement('table');
			unitCommoditiesTable.className = 'commoditiesTable';
			unitCargoDiv.appendChild(unitCommoditiesTable);
			var unitCommoditiesTableTitle = document.createElement('caption');
			unitCommoditiesTable.appendChild(unitCommoditiesTableTitle);
			var cargo = 0;
			if (unit.location !== undefined) {
				var trading = unit.location.trading();
			} else {
				var trading = {};
			};
			for (var c in unit.commodities) {
				var unitCommoditiesItem = document.createElement('tr');
				unitCommoditiesTable.appendChild(unitCommoditiesItem);
				var unitCommoditiesNameCell = document.createElement('td');
				unitCommoditiesNameCell.className = 'unitCommoditiesNameCell';
				var icon = view.commodityIcon(unit.commodities[c].commodity);
				unitCommoditiesNameCell.innerHTML = icon + ' ' + data.commodities[unit.commodities[c].commodity].name;
				if (unit.commodities[c].qty < 100) {
					unitCommoditiesNameCell.innerHTML += ' (' + unit.commodities[c].qty + '%)';
				};
				unitCommoditiesItem.appendChild(unitCommoditiesNameCell);
				if (unit.location !== undefined && trading[unit.commodities[c].commodity] !== undefined) {
					var unitCommoditiesValueCell = document.createElement('td');
					unitCommoditiesValueCell.innerHTML = Math.round(100 * unit.location.commodities[unit.commodities[c].commodity],0);
					unitCommoditiesItem.appendChild(unitCommoditiesValueCell);
					
					var unitCommoditiesTradeCell = document.createElement('td');
					unitCommoditiesTradeCell.id = 'unitAddBtn_' + u + '_' + c;
					unitCommoditiesTradeCell.innerHTML = '<span class="fa fa-cart-arrow-down"></span>';
					if (unit.currentTrade.unitStuff.indexOf(unit.commodities[c]) == -1) {
						unitCommoditiesTradeCell.setAttribute('onclick','handlers.addFromUnit('+u+',"'+c+'")');
					} else {
						unitCommoditiesTradeCell.style.color = 'lightgrey';
					}
					unitCommoditiesItem.appendChild(unitCommoditiesTradeCell);
					
					var resupplyCell = document.createElement('td');
					var resupplyCost = (100 - unit.commodities[c].qty) * unit.location.commodities[unit.commodities[c].commodity];
					if (unit.commodities[c].qty < 100 && resupplyCost < unit.location.reputation.p1) {
						resupplyCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-refresh"></span><span class="tooltip">Resupply: '+Math.ceil(resupplyCost)+' reputation</span></a>';
						resupplyCell.setAttribute('onclick','handlers.resupply('+c+')');
					} else if (unit.commodities[c].qty < 100) {
						resupplyCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-refresh"></span><span class="tooltip">Resupply: '+Math.ceil(resupplyCost)+' reputation</span></a>';
						resupplyCell.style.color = 'lightgrey';
					};
					unitCommoditiesItem.appendChild(resupplyCell);
					
				} else {
					var cell = document.createElement('td');
					unitCommoditiesItem.appendChild(cell);
					var cell = document.createElement('td');
					unitCommoditiesItem.appendChild(cell);
					var cell = document.createElement('td');
					unitCommoditiesItem.appendChild(cell);
				};
				var unitCommoditiesTrashCell = document.createElement('td');
				unitCommoditiesTrashCell.innerHTML = '<span class="fa fa-trash"></span>';
				unitCommoditiesTrashCell.setAttribute('onclick','handlers.trashFromUnit('+u+',"'+c+'")');
				unitCommoditiesItem.appendChild(unitCommoditiesTrashCell);
					
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
			if (unit.isSurveying) {
				var surveyingP = document.createElement('p');
				var eta = Math.round(( unit.surveyComplete.getTime() - model.clock.time.getTime() ) / 8.64e+7,0);
				surveyingP.innerHTML = "Surveying (" + eta + " days)";
				unitPane.appendChild(surveyingP);
			};
		
			// Action Buttons
		
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
				unitBuildHead.className = 'infrastructureHead';
				unitPane.appendChild(unitBuildHead);
				
				// Busy Building Countdown
				if (unit.isBuilding) {
					var unitBuildProjectP = document.createElement('p');
					var eta = Math.round((unit.buildComplete.getTime() - model.clock.time.getTime() ) / 8.64e+7,0);
					unitBuildProjectP.innerHTML = 'Currently building ' + unit.buildProject.name + ' (' + eta + ' days)';
					unitPane.appendChild(unitBuildProjectP);
				};
				
				var unitBuildSelect = document.createElement('select');
				unitBuildSelect.id = 'unitBuildSelect_' + u;
				unitBuildSelect.className = 'buildSelect';
				unitBuildSelect.setAttribute('onchange','handlers.displayInfrastructurePreview('+u+')');
				var unitBuildOption = document.createElement('option');
				unitBuildOption.innerHTML = 'Select...';
				unitBuildOption.selected = true;
				unitBuildOption.disabled = true;
				unitBuildSelect.appendChild(unitBuildOption);
				for (var b in unit.type.buildInfrastructures) {
					var requirements = data.infrastructure[unit.type.buildInfrastructures[b]].requiredResource;
					var requirementsFulfilled = false;
					for (var r in requirements) {
						var index = unit.location.resources.indexOf(data.resources[requirements[r]])
						if (index !== -1 && (unit.location.hasSurveyed.p1[index] || unit.location.resources[index].visible)) {
							requirementsFulfilled = true;
						};
					};
					var replaced = false;
					for (var r in unit.location.infrastructure) {
						if (unit.location.infrastructure[r].replaces !== undefined && unit.location.infrastructure[r].replaces.indexOf(unit.type.buildInfrastructures[b]) !== -1) {
							replaced = true;
						};
					};
					if ((requirements == undefined || requirementsFulfilled) && !replaced && unit.location.infrastructure.indexOf(data.infrastructure[unit.type.buildInfrastructures[b]]) == -1) {
						var unitBuildOption = document.createElement('option');
						unitBuildOption.innerHTML = data.infrastructure[unit.type.buildInfrastructures[b]].name;
						unitBuildOption.value = unit.type.buildInfrastructures[b];
						unitBuildSelect.appendChild(unitBuildOption);
					};
				};
				unitPane.appendChild(unitBuildSelect);
				
				var unitBuildBtn = document.createElement('button');
				unitBuildBtn.id = 'unitBuildBtn_' + u;
				unitBuildBtn.className = 'buildBtn';
				unitBuildBtn.innerHTML = 'Build';
				unitBuildBtn.disabled = true;
				unitBuildBtn.setAttribute('onclick','handlers.buildInfrastructure('+u+')');
				unitPane.appendChild(unitBuildBtn);
				
				var unitBuildPreviewDiv = document.createElement('div');
				unitBuildPreviewDiv.id = 'unitBuildPreviewDiv_' + u;
				unitBuildPreviewDiv.className = 'unitBuildPreviewDiv';
				unitPane.appendChild(unitBuildPreviewDiv);
			};
			
			// Passengers
			if (unit.type.canPassenger && unit.location !== undefined) {
				unitPassengersDiv = document.createElement('div');
				unitPassengersDiv.className = 'unitPassengersDiv';
				unitPane.appendChild(unitPassengersDiv);
				
				var takePassengersCost = unit.location.desirability();
				var dropPassengersCost = takePassengersCost * 0.8;
				
				if (unit.location.population == 0) {takePassengersCost = 0};
				
				unitPassengersHead = document.createElement('h3');
				unitPassengersHead.innerHTML = 'Passengers';
				unitPassengersDiv.appendChild(unitPassengersHead);
				
				unitTakePassengersBtn = document.createElement('button');
				unitTakePassengersBtn.innerHTML = 'Take On ( -' + Math.round(takePassengersCost,0) + ' rep )';
				unitTakePassengersBtn.setAttribute('onclick','handlers.takePassengers(' + takePassengersCost + ')');
				if (takePassengersCost > unit.location.reputation.p1 || unit.location.population == 0) {
					unitTakePassengersBtn.disabled = true;
				};
				unitPassengersDiv.appendChild(unitTakePassengersBtn);
				
				unitTakePassengersBtn = document.createElement('button');
				unitTakePassengersBtn.innerHTML = 'Drop Off ( +'+ Math.round(dropPassengersCost,0)+' rep )';
				unitTakePassengersBtn.setAttribute('onclick','handlers.dropPassengers('+dropPassengersCost+')');
				unitPassengersDiv.appendChild(unitTakePassengersBtn);
				var hasPassengers = false;
				for (var c in unit.commodities) {
					if (unit.commodities[c].commodity == 'passengers') {hasPassengers = true;};
				};
				if (!hasPassengers) {
					unitTakePassengersBtn.disabled = true;
				};
			};
		
		};
		
		// Unit Tabs
		if (unitsAtSite.length > 1) {
			var unitTabsDiv = document.createElement('div');
			unitTabsDiv.id = 'unitTabsDiv';
			detailsUnitDiv.appendChild(unitTabsDiv);
			for (var u in unitsAtSite ) {
				var unitTab = document.createElement('span');
				unitTab.className = 'unitTab';
				unitTab.innerHTML = unitsAtSite[u].name + ' (' + unitsAtSite[u].commodities.length + '/' + unitsAtSite[u].type.cargo + ')';
				unitTab.setAttribute('onclick','handlers.switchUnitPane('+units.indexOf(unitsAtSite[u])+','+u+')');
				if (unitsAtSite[u].inTransit) {
					unitTab.style.backgroundColor = '#AAAA00';
					unitTab.innerHTML += ' <span class="fa-stack"><span class="fa fa-circle-o fa-stack-2x fa-spin"></span><span class="fa fa-arrows-alt fa-stack-1x fa-spin"></span></span>';
				} else if (unitsAtSite[u].isBuilding) {
					unitTab.style.backgroundColor = '#F0E68C';
					unitTab.innerHTML += ' <span class="fa fa-2x fa-cog fa-spin"></span>';
				} else if (unitsAtSite[u].isSurveying) {
					unitTab.style.backgroundColor = '#AFEEEE';
					unitTab.innerHTML += ' <span class="fa fa-2x fa-spinner fa-pulse"></span>';
				};
				unitTabsDiv.appendChild(unitTab);
			};
		};

		if (unit.location !== undefined) {
			view.displaySiteDetails(unit.location);
			view.updateTradeDiv();	
		};
		view.focus.unitPane = unitsAtSite.indexOf(selectedUnit);
		document.getElementById('unitPane_' + view.focus.unitPane ).style.display = 'block';
	},
	
	displayInfrastructurePreview: function(pane,key) {
		var infrastructure = data.infrastructure[key];
		var unitBuildPreviewDiv = document.getElementById('unitBuildPreviewDiv_' + pane);
		unitBuildPreviewDiv.innerHTML = '';
		
		var unitBuildPreviewDesc = document.createElement('p');
		unitBuildPreviewDesc.innerHTML = view.infrastructureDescription(data.infrastructure[key]);
		unitBuildPreviewDiv.appendChild(unitBuildPreviewDesc);
		
		var unitBuildCostP = document.createElement('p');
		var buildCost = [];
		for (var b in infrastructure.buildCost) {
			buildCost.push(infrastructure.buildCost[b] + " " + data.commodities[b].name);
		};
		unitBuildCostP.innerHTML = '<strong>Materials:</strong> ' + gamen.prettyList(buildCost);
		if (view.focus.unit.location !== undefined) {
			var repCost = view.focus.unit.canAfford(infrastructure.buildCost,'rep')
			if (repCost == Infinity) {
				unitBuildCostP.innerHTML += "<br />(requires exotic materials you do not have)";
			} else {
				unitBuildCostP.innerHTML += "<br />(" + repCost + " reputation for the materials you don't already have)";
			};
		};
		unitBuildPreviewDiv.appendChild(unitBuildCostP);
		
		var unitBuildTimeP = document.createElement('p');
		unitBuildTimeP.innerHTML = '<strong>Construction Time:</strong> ' + infrastructure.buildTime + ' days';
		unitBuildPreviewDiv.appendChild(unitBuildTimeP);
		
		if (infrastructure.requiredResource !== undefined) {
			var unitBuildRequirementP = document.createElement('p');
			unitBuildRequirementP.innerHTML = '<strong>Requires:</strong> ' + gamen.prettyList(infrastructure.requiredResource,'or');
			unitBuildPreviewDiv.appendChild(unitBuildRequirementP);
		};
		
		if (infrastructure.replaces !== undefined) {
			var replaceList = [];
			for (var i in infrastructure.replaces) {
				replaceList.push(data.infrastructure[infrastructure.replaces[i]].name);
			};
			var unitBuildReplaceP = document.createElement('p');
			unitBuildReplaceP.innerHTML = "<strong>Replaces:</strong> " + gamen.prettyList(replaceList);
			unitBuildPreviewDiv.appendChild(unitBuildReplaceP);
		};
		
		if (view.focus.unit.canAfford(infrastructure.buildCost) && !view.focus.unit.isBuilding && !view.focus.unit.inTransit) {
			document.getElementById('unitBuildBtn_'+pane).disabled = false;
		} else {
			document.getElementById('unitBuildBtn_'+pane).disabled = true;
		};
		
	},
	
	infrastructureDescription: function(infrastructure) {
		var string = '';
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
			string += 'Produces ' + gamen.prettyList(infrastructure.outputs) + '. ';
		};
		if (infrastructure.inputs !== undefined) {
			string += 'Increases value of ' + gamen.prettyList(infrastructure.inputs) + '. ';
		};
		if (infrastructure.jobs !== undefined) {
			string += 'Provides ' + infrastructure.jobs + ' jobs. ';
		};
		if (infrastructure.goodwill > 0) {
			string += 'Gains the builder ' + infrastructure.goodwill + ' reputation each fortnight.';
		} else if (infrastructure.goodwill < 0) {
			string += 'Costs the builder ' + infrastructure.goodwill + ' reputation each fortnight.';

		};
		return string;
	},
	
	switchUnitPane: function(paneIndex,unitIndex) {
		var panes = document.getElementById('detailsUnitDiv').children;
		for (var i=0;i<panes.length-1;i++) {
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
			for (var i in currentTrade.unitStuff) {
				var unitStuffItem = document.createElement('li');
				var icon = view.commodityIcon(currentTrade.unitStuff[i].commodity);
				unitStuffItem.innerHTML = icon + ' ' + data.commodities[currentTrade.unitStuff[i].commodity].name + ' ';
				var unitStuffRemoveBtn = document.createElement('button');
				unitStuffRemoveBtn.innerHTML = '<span class="fa fa-times"></span>';
				unitStuffRemoveBtn.setAttribute('onclick','handlers.removeUnitStuff('+i+')');
				unitStuffItem.appendChild(unitStuffRemoveBtn);
				unitStuffList.appendChild(unitStuffItem);
				currentTrade.balance += currentTrade.unitStuff[i].qty * view.focus.unit.location.commodities[currentTrade.unitStuff[i].commodity];
			};
		
			var siteStuffDiv = document.getElementById('siteStuffDiv');
			siteStuffDiv.innerHTML = '';
			var siteStuffList = document.createElement('ul');
			siteStuffDiv.appendChild(siteStuffList);
			for (var i in currentTrade.siteStuff) {
				var siteStuffItem = document.createElement('li');
				var icon = view.commodityIcon(currentTrade.siteStuff[i].commodity);
				siteStuffItem.innerHTML = icon + ' ' + data.commodities[currentTrade.siteStuff[i].commodity].name + ' ';
				var siteStuffRemoveBtn = document.createElement('button');
				siteStuffRemoveBtn.innerHTML = '<span class="fa fa-times"></span>';
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
		
	progressColor: function(percentage) {
		var red = Math.round(255 - (percentage*2.55)/2,0);
		var green = Math.round(107 + (percentage*2.55)/2,0);
		var blue = Math.round(Math.max(percentage*2.55 - 127,0),0);
		red = red.toString(16).toUpperCase();
		green = green.toString(16).toUpperCase();
		blue = blue.toString(16).toUpperCase();
		if (blue.length == 1) {blue = '0' + blue;};
		var hexcode = '#' + red + green + blue;
		return hexcode;
	},
	
	commodityIcon: function(commodityKey) {
		var string = '<span ';
		if (data.commodities[commodityKey].iconColor !== undefined) {
			string += 'style="color:' + data.commodities[commodityKey].iconColor + '" ';
		};
		string += ' class="fa fa-fw ';
		if (data.commodities[commodityKey].icon !== undefined) {
			string += 'fa-'+data.commodities[commodityKey].icon;
		} else {
			string += 'fa-cubes';
		};
		string += '"></span>';
		return string;
	},
	
	displayCommodityList: function(list) {
		var iconList = '';
		for (var c in list) {
			for (var i=0;i<list[c];i++) {
				iconList += view.commodityIcon(c);
			};
		};
		return iconList;
	},

};