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
	
	toggleOptions: function() {
		var optionsDiv = document.getElementById('optionsDiv');
		if (optionsDiv.innerHTML == '') {
			optionsDiv.className = 'optionsDivOpened';
			var optionsHead = document.createElement('h3');
			optionsHead.innerHTML = 'Options';
			optionsDiv.appendChild(optionsHead);
			
			var tutorialsP = document.createElement('p');
			var tutorialsCheck = document.createElement('input');
			tutorialsCheck.id = 'tutorialsCheck';
			tutorialsCheck.setAttribute('type','checkbox');
			tutorialsCheck.setAttribute('onclick','handlers.toggleOption("tutorials")');
			if (model.options.tutorials) {tutorialsCheck.setAttribute('checked','checked')};
			tutorialsP.appendChild(tutorialsCheck);
			tutorialsP.innerHTML += "Tutorial Quests"
			optionsDiv.appendChild(tutorialsP);
			
			var autoplayP = document.createElement('p');
			var autoplayCheck = document.createElement('input');
			autoplayCheck.id = 'autoplayCheck';
			autoplayCheck.setAttribute('type','checkbox');
			autoplayCheck.setAttribute('onclick','handlers.toggleOption("autoplay")');
			if (model.options.autoplay) {autoplayCheck.setAttribute('checked','checked')};
			autoplayP.appendChild(autoplayCheck);
			autoplayP.innerHTML += "Autoplay when all units are busy"
			optionsDiv.appendChild(autoplayP);
			
			var autosaveP = document.createElement('p');
			var autosaveCheck = document.createElement('input');
			autosaveCheck.id = 'autosaveCheck';
			autosaveCheck.setAttribute('type','checkbox');
			autosaveCheck.setAttribute('onclick','handlers.toggleOption("autosave")');
			if (model.options.autosave) {autosaveCheck.setAttribute('checked','checked')};
			autosaveP.appendChild(autosaveCheck);
			autosaveP.innerHTML += "Autosave every fortnight"
			optionsDiv.appendChild(autosaveP);
			
			var zoomOptionsDiv = document.createElement('div');
			zoomOptionsDiv.id = 'zoomOptionsDiv';
			zoomOptionsDiv.className = 'optionsSubDiv';
			optionsDiv.appendChild(zoomOptionsDiv);
			
			var zoomHead = document.createElement('h4');
			zoomHead.innerHTML = 'Zoom Options';
			zoomOptionsDiv.appendChild(zoomHead);
			
			var zoomP = document.createElement('p');
			var zoomCheck = document.createElement('input');
			zoomCheck.id = 'zoomCheck';
			zoomCheck.setAttribute('type','checkbox');
			zoomCheck.setAttribute('onclick','handlers.toggleOption("zoom")');
			if (model.options.zoom) {zoomCheck.setAttribute('checked','checked')};
			zoomP.appendChild(zoomCheck);
			zoomP.innerHTML += "Map Zoom via Mouse Wheel"
			zoomOptionsDiv.appendChild(zoomP);
			
			var zoomFactorP = document.createElement('p');
			zoomOptionsDiv.appendChild(zoomFactorP);
			
			var zoomSlider = document.createElement('input');
			zoomSlider.id = 'zoomSlider';
			zoomSlider.className = 'optionsSlider';
			zoomSlider.setAttribute('type','range');
			zoomSlider.setAttribute('name','zoom');
			zoomSlider.setAttribute('min',-100);
			zoomSlider.setAttribute('max',100);
			var zoomFactor = 0
			if (model.options.zoomFactor > 1) {
				zoomFactor = model.options.zoomFactor * 10;
			} else if (model.options.zoomFactor < 1) {
				zoomFactor = 100 * model.options.zoomFactor - 100;
			};
			zoomSlider.setAttribute('value',zoomFactor);
			zoomSlider.setAttribute('onchange','handlers.updateZoomFactor()');
			zoomFactorP.appendChild(zoomSlider);
			
			var zoomLabel = document.createElement('span');
			zoomLabel.id = 'zoomLabel';
			zoomLabel.innerHTML = Math.floor( model.options.zoomFactor * 100) + "%";
			zoomFactorP.appendChild(zoomLabel);
			
			var newGameOptionsDiv = document.createElement('div');
			newGameOptionsDiv.id = 'newGameOptionsDiv';
			newGameOptionsDiv.className = 'optionsSubDiv';
			optionsDiv.appendChild(newGameOptionsDiv);
			
			var newGameOptionsHead = document.createElement('h4');
			newGameOptionsHead.innerHTML = 'New Game Options';
			newGameOptionsDiv.appendChild(newGameOptionsHead);
			
			var newGameOptions = [
				{option:'mapSize',label:'Map Size',min:400,max:1000,},
				{option:'totalSites',label:'Towns',min:20,max:100,},
				{option:'minDist',label:'Minimum Route Length',min:10,max:100,},
				{option:'totalThreats',label:'Threats',min:1,max:10,},
				{option:'volatility',label:'Value Volatility',min:1,max:10,},
				{option:'ghostTowns',label:'Ghost Towns',min:0,max:10,},
			];
			for (var option of newGameOptions) {
				var newGameOption = document.createElement('p');
				var newGameOptionSlider = document.createElement('input');
				newGameOptionSlider.id = option.option + 'OptionsSlider';
				newGameOptionSlider.className = 'optionsSlider';
				newGameOptionSlider.setAttribute('type','range');
				newGameOptionSlider.setAttribute('name',option.option);
				newGameOptionSlider.setAttribute('min',option.min);
				newGameOptionSlider.setAttribute('max',option.max);
				newGameOptionSlider.setAttribute('value',model.options.newGame[option.option]);
				newGameOptionSlider.setAttribute('onchange','handlers.updateNewGameOption("'+option.option+'")');
				newGameOption.appendChild(newGameOptionSlider);
				var newGameOptionNumber = document.createElement('span');
				newGameOptionNumber.id = option.option + 'OptionsNumber';
				newGameOptionNumber.innerHTML = newGameOptionSlider.value;
				newGameOption.appendChild(newGameOptionNumber);
				newGameOption.innerHTML += " " + option.label;
				newGameOptionsDiv.appendChild(newGameOption);
			};
			
		} else {
			optionsDiv.className = '';
			optionsDiv.innerHTML = '';
		};
	},

	
	clearDetailsDivs: function() {
		document.getElementById('introDiv').style.display = 'none';
		document.getElementById('detailsUnitDiv').style.display = 'block';
		document.getElementById('detailsUnitDiv').innerHTML = '&nbsp;';
		document.getElementById('detailsSiteDiv').style.display = 'block';
		document.getElementById('detailsSiteDiv').innerHTML = '&nbsp;';
		document.getElementById('centerColumn').style.display = 'block';
		document.getElementById('saveGameButton').disabled = false;
		document.getElementById('loadGameDiv').style.display = 'none';
		
	},
	
	refreshGameDisplay: function() {
		view.clearDetailsDivs();
		view.displayMap();
		view.displayUnit(view.focus.unit);
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
		var clockSpeedSlider = document.createElement('input');
		clockSpeedSlider.id = 'clockSpeedSlider';
		clockSpeedSlider.setAttribute('type','range');
		clockSpeedSlider.setAttribute('min',1);
		clockSpeedSlider.setAttribute('max',100);
		clockSpeedSlider.setAttribute('value',10000/model.clock.tick);
		clockSpeedSlider.setAttribute('onchange','handlers.setClockSpeed()');
		clockDiv.appendChild(clockSpeedSlider);
		var clockPauseBtn = document.createElement('span');
		clockPauseBtn.id = 'clockPauseBtn';
		if (model.clock.running) {
			clockPauseBtn.className = 'fa fa-pause';
		} else {
			clockPauseBtn.className = 'fa fa-play';
		};
		clockPauseBtn.setAttribute('onclick','handlers.clockPause()');
		clockDiv.appendChild(clockPauseBtn);
		mapDiv.appendChild(clockDiv);
		
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		var viewboxString = view.zoom.viewbox.minX + ' ' + view.zoom.viewbox.minY + ' ' + view.zoom.viewbox.height + ' ' + view.zoom.viewbox.width;
		svg.setAttribute('viewBox',viewboxString);
		svg.id = 'mapSVG';
		
		svg.setAttribute('xmlns',"http://www.w3.org/2000/svg");
		svg.setAttribute('xmlns:xlink','http://www.w3.org/1999/xlink');
		
		var defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
		svg.appendChild(defs);
		
		var greenGradient = document.createElementNS('http://www.w3.org/2000/svg','radialGradient');
		greenGradient.id = 'greenGradient';
		defs.appendChild(greenGradient);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','20%');
		stop.setAttribute('stop-color','green');
		stop.setAttribute('stop-opacity',1);
		greenGradient.appendChild(stop);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','80%');
		stop.setAttribute('stop-color','green');
		stop.setAttribute('stop-opacity',0.2);
		greenGradient.appendChild(stop);
		var stop = document.createElementNS('http://www.w3.org/2000/svg','stop');
		stop.setAttribute('offset','100%');
		stop.setAttribute('stop-color','green');
		stop.setAttribute('stop-opacity',0);
		greenGradient.appendChild(stop);
		
		for (var i in data.units) {
			if (draw[i] !== undefined) {
				var svgNodes = draw[i]();
				defs.appendChild(svgNodes);
			};
		};
		
		var landmarkTypes = ['arch','cactus','cowSkull','dunes','hillock','saltFlats','spire'];
		for (var i of landmarkTypes) {
			if (draw[i] !== undefined) {
				var svgNodes = draw[i]();
				defs.appendChild(svgNodes);
			};
		};
		
		var selectedAura = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
		selectedAura.id = 'selectedAura';
		selectedAura.setAttribute('cx',view.zoom.z * 0.005);
		selectedAura.setAttribute('cy',view.zoom.z * 0.015);
		selectedAura.setAttribute('rx',view.zoom.z * 0.04);
		selectedAura.setAttribute('ry',view.zoom.z * 0.015);
		selectedAura.setAttribute('opacity',0.8);
		selectedAura.setAttribute('fill','cyan');
		defs.appendChild(selectedAura);
				
		var background = document.createElementNS('http://www.w3.org/2000/svg','rect');
		background.setAttribute('fill','darkorange');
		background.setAttribute('x','-1000');
		background.setAttribute('y','-1000');
		background.setAttribute('width','3000');
		background.setAttribute('height','3000');
		svg.appendChild(background);
		
		var terrainFilter = document.createElementNS('http://www.w3.org/2000/svg','filter');
		defs.appendChild(terrainFilter);
		terrainFilter.id = 'terrainFilter';
		var feTurbulence = document.createElementNS('http://www.w3.org/2000/svg','feTurbulence');
		terrainFilter.appendChild(feTurbulence);
		feTurbulence.setAttribute('type','fractalNoise');
		feTurbulence.setAttribute('baseFrequency',0.01);
		feTurbulence.setAttribute('numOctaves',1);
		feTurbulence.setAttribute('result','noise');
		var feDiffuseLighting = document.createElementNS('http://www.w3.org/2000/svg','feDiffuseLighting');
		terrainFilter.appendChild(feDiffuseLighting);
		feDiffuseLighting.setAttribute('in','noise');
		feDiffuseLighting.setAttribute('lighting-color','#FFAA00');
		feDiffuseLighting.setAttribute('surfaceScale',5);
		feDiffuseLighting.setAttribute('result','diffLight');
		var feDistantLight = document.createElementNS('http://www.w3.org/2000/svg','feDistantLight');
		feDiffuseLighting.appendChild(feDistantLight);
		feDistantLight.setAttribute('azimuth',45);
		feDistantLight.setAttribute('elevation',35);

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
					r += needs[n].completion / needs.length;
				};
				players.p1.knownSites[i].needsCompletion = r;
				newCarpet.setAttribute('opacity',r/5);
				r *= 300;
				r = Math.min(r,players.p1.knownSites[i].population*2);
				
				newCarpet.setAttribute('rx',(0.5 * players.p1.knownSites[i].carpet[c].squish + 0.25) * r);
				newCarpet.setAttribute('ry',(1 - (0.5 * players.p1.knownSites[i].carpet[c].squish + 0.25)) * r);
				newCarpet.setAttribute('transform','rotate('+ players.p1.knownSites[i].carpet[c].tilt*360+' '+players.p1.knownSites[i].x+' '+players.p1.knownSites[i].y+')');
				carpetGroup.appendChild(newCarpet);
			};
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
		
		var riversGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		riversGroup.id = 'riversGroup';
		svg.appendChild(riversGroup);
		
		for (r of players.p1.knownRivers) {
			var riverSegment = document.createElementNS('http://www.w3.org/2000/svg','path');
			riverSegment.setAttribute('fill','none');
			riverSegment.setAttribute('stroke','#B4B482');
			riverSegment.setAttribute('stroke-width',r.width);
			riverSegment.setAttribute('stroke-linecap','round');
			var d = 'M' + r.x1 + ',' + r.y1 + ' C ' + r.c1x + ' ' + r.c1y + ' ' + r.c2x + ' ' + r.c2y + ' ' + r.x2 + ' ' + r.y2;
			riverSegment.setAttribute('d',d);
			riversGroup.appendChild(riverSegment);
		};

		var landmarksGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		landmarksGroup.id = 'landmarksGroup';
		svg.appendChild(landmarksGroup);
		
		var landmarkTypes = ['arch','cactus','cowSkull','dunes','hillock','saltFlats','spire','dunes','hillock','saltFlats','hillock','saltFlats','dunes','dunes'];

		for (var i in players.p1.knownLandmarks) {
			var landmark = landmarkTypes[players.p1.knownLandmarks[i].type * landmarkTypes.length << 0];
			var newLandmark = document.createElementNS('http://www.w3.org/2000/svg','use');
			newLandmark.setAttribute('href','#'+landmark);
			newLandmark.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#'+landmark);
			newLandmark.setAttribute('x',players.p1.knownLandmarks[i].x);
			newLandmark.setAttribute('y',players.p1.knownLandmarks[i].y);
			var scale = (0.5 + players.p1.knownLandmarks[i].size);
			var tx = -players.p1.knownLandmarks[i].x * (scale - 1);
			var ty = -players.p1.knownLandmarks[i].y * (scale - 1);
			newLandmark.setAttribute('transform','translate('+tx+','+ty+') scale('+scale+')');
			landmarksGroup.appendChild(newLandmark);

		};
		
		var sitesGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		sitesGroup.id = 'sitesGroup';
		svg.appendChild(sitesGroup);

		for (var i in players.p1.knownSites) {
			var siteIndex = sites.indexOf(players.p1.knownSites[i]);

			var newSiteGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
			newSiteGroup.setAttribute('onmouseenter','handlers.displaySiteDetails('+siteIndex+')');
			newSiteGroup.setAttribute('onclick','handlers.selectSite('+siteIndex+')');
			newSiteGroup.setAttribute('onmouseout','handlers.displaySiteDetails(-1)');
			sitesGroup.appendChild(newSiteGroup);
			
			var newSite = document.createElementNS('http://www.w3.org/2000/svg','circle');
			newSite.id = 'site_' + i;
			if (players.p1.knownSites[i].hasVisited.p1 && players.p1.knownSites[i].population > 0) {
				newSite.setAttribute('fill','black');
			} else if (players.p1.knownSites[i].hasVisited.p1) {
				newSite.setAttribute('fill','#FFAA00');
			} else {
				newSite.setAttribute('fill','dimgray');
			};
			newSite.setAttribute('paint-order','stroke fill');
			var siteRep = players.p1.knownSites[i].reputation.p1;
			var repWidth;
			if (Math.abs(siteRep) < 50) {
				repWidth = 1;
			} else if (Math.abs(siteRep) < 100) {
				repWidth = 2;
			} else if (Math.abs(siteRep) < 300) {
				repWidth = 3;
			} else if (Math.abs(siteRep) < 600) {
				repWidth = 4;
			} else {
				repWidth = 5;
			};
			newSite.setAttribute('stroke-width',view.zoom.z * 0.0015 * repWidth);
			if (players.p1.knownSites[i].population == 0) {
				newSite.setAttribute('stroke','yellow');
			} else if (siteRep > 10) {
				newSite.setAttribute('stroke','lime');
			} else if (siteRep < 0) {
				newSite.setAttribute('stroke','red');
			} else {
				newSite.setAttribute('stroke','yellow');
			};
			newSite.setAttribute('cx',players.p1.knownSites[i].x);
			newSite.setAttribute('cy',players.p1.knownSites[i].y);
			var radius;
			if (players.p1.knownSites[i].population < 50) {
				radius = 2;
			} else if (players.p1.knownSites[i].population < 100) {
				radius = 3;
			} else if (players.p1.knownSites[i].population < 200) {
				radius = 4;
			} else if (players.p1.knownSites[i].population < 400) {
				radius = 5;
			} else {
				radius = 6;
			};
			newSite.setAttribute('r',view.zoom.z * 0.0015 * radius);
			newSiteGroup.appendChild(newSite);

			var siteLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			if (players.p1.knownSites[i].hasVisited.p1) {
				siteLabel.setAttribute('fill','black');
			} else {
				siteLabel.setAttribute('fill','dimgray');
			};
			siteLabel.setAttribute('x',players.p1.knownSites[i].x);
			siteLabel.setAttribute('y',players.p1.knownSites[i].y - view.zoom.z * .015);
			siteLabel.setAttribute('text-anchor','middle');
			siteLabel.setAttribute('font-size',view.zoom.z * .02);
			siteLabel.innerHTML = players.p1.knownSites[i].name;
			newSiteGroup.appendChild(siteLabel);
			
			var fuelStation = false;
			for (var infrastructure of players.p1.knownSites[i].infrastructure) {
				if (infrastructure.outputs !== undefined && infrastructure.outputs.indexOf('fuel') !== -1 && players.p1.knownSites[i].population > 0) {
					fuelStation = true;
				};
			};
			if (fuelStation && players.p1.knownSites[i].hasVisited.p1) {
				var leftSiteIcons = document.createElementNS('http://www.w3.org/2000/svg','text');
				leftSiteIcons.setAttribute('x',players.p1.knownSites[i].x - view.zoom.z * .01);
				leftSiteIcons.setAttribute('y',players.p1.knownSites[i].y + view.zoom.z * .005);
				leftSiteIcons.setAttribute('text-anchor','end');
				leftSiteIcons.setAttribute('font-weight','bold');
				leftSiteIcons.setAttribute('font-size',view.zoom.z * .015);
				leftSiteIcons.innerHTML = 'F';
				newSiteGroup.appendChild(leftSiteIcons);
			};
			
			var buildUnits = '';
			for (infrastructure of players.p1.knownSites[i].infrastructure) {
				if (infrastructure.initial !== undefined) {
					buildUnits += infrastructure.initial;
				};
			};
			if (buildUnits !== '' && players.p1.knownSites[i].hasVisited.p1) {
				var rightSiteIcons = document.createElementNS('http://www.w3.org/2000/svg','text');
				rightSiteIcons.setAttribute('x',players.p1.knownSites[i].x + view.zoom.z * .01);
				rightSiteIcons.setAttribute('y',players.p1.knownSites[i].y + view.zoom.z * .005);
				rightSiteIcons.setAttribute('text-anchor','start');
				rightSiteIcons.setAttribute('font-weight','bold');
				rightSiteIcons.setAttribute('font-size',view.zoom.z * .015);
				rightSiteIcons.innerHTML = buildUnits;
				newSiteGroup.appendChild(rightSiteIcons);
			};

		};
		
		var unitsGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		unitsGroup.id = 'unitsGroup';
		svg.appendChild(unitsGroup);

		var unitSize = view.zoom.z * 0.001;
		for (var i in units) {
			if (units[i].inTransit) {
				unitX = units[i].route[0].x;
				unitY = units[i].route[0].y;
			} else {
				unitX = units[i].location.x;
				unitY = units[i].location.y + 10;
			};
			var unitsAtSite = [];
			for (var c in units) {
				if (units[c].location == units[i].location) {
					unitsAtSite.push(units[c]);
				};
			};
			if (units[i].location !== undefined && unitsAtSite.length > 1) {
				var unitOrder = unitsAtSite.indexOf(units[i]);
				var offSet = unitOrder * (20/(unitsAtSite.length-1)) - 10;
				unitX += offSet;
			};
			var newUnit = document.createElementNS('http://www.w3.org/2000/svg','use');
			newUnit.setAttribute('href','#'+units[i].type.symbol);
			newUnit.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#'+units[i].type.symbol);
			newUnit.setAttribute('x',unitX - 25);
			newUnit.setAttribute('y',unitY - 5);
			newUnit.setAttribute('transform','translate('+(1*unitX)+' '+(1*unitY)+') scale('+unitSize+') translate('+(-1*unitX)+' '+(-1*unitY)+')');
			newUnit.setAttribute('onclick','handlers.selectUnit('+i+')');
			newUnit.setAttribute('paint-order','stroke fill');
			newUnit.setAttribute('stroke-width','40');
			if (units[i].inTransit) {
// 				newUnit.setAttribute('stroke','#006400');
				newUnit.setAttribute('stroke','lime');
			} else if (units[i].isBuilding) {
				newUnit.setAttribute('stroke','#F0E68C');
			} else if (units[i].isSurveying) {
				newUnit.setAttribute('stroke','#AFEEEE');
			} else {
				newUnit.setAttribute('stroke','red');
			};
			unitsGroup.appendChild(newUnit);
		};

		var frameGroup = document.createElementNS('http://www.w3.org/2000/svg','g');
		frameGroup.id = 'frameGroup';
		svg.appendChild(frameGroup);

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','darkorange');
		rect.setAttribute('x','-1000');
		rect.setAttribute('y','-1000');
		rect.setAttribute('width','3000');
		rect.setAttribute('height','1000');
		frameGroup.appendChild(rect);

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','darkorange');
		rect.setAttribute('x','-1000');
		rect.setAttribute('y','-1000');
		rect.setAttribute('width','1000');
		rect.setAttribute('height','3000');
		frameGroup.appendChild(rect);

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','darkorange');
		rect.setAttribute('x','1000');
		rect.setAttribute('y','-1000');
		rect.setAttribute('width','1000');
		rect.setAttribute('height','3000');
		frameGroup.appendChild(rect);

		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','darkorange');
		rect.setAttribute('x','-1000');
		rect.setAttribute('y','1000');
		rect.setAttribute('width','3000');
		rect.setAttribute('height','1000');
		frameGroup.appendChild(rect);

		
		svg.addEventListener('mousedown',view.mapDragStart);
		svg.addEventListener('mousemove',view.mapDragGo);
		svg.addEventListener('mouseup',view.mapDragEnd);
		svg.addEventListener('mouseleave',view.mapDragEnd);
		svg.addEventListener('wheel',view.mapZoom);
		
// 		svg.setAttribute('onmouseout','handlers.displaySiteDetails(-1)');
		
		mapDiv.appendChild(svg);
		
		var progressDiv = document.createElement('div');
		progressDiv.id = 'progressDiv';
		mapDiv.appendChild(progressDiv);
		
		var progressExploreDiv = document.createElement('div');
		progressExploreDiv.className = 'progressDiv';
		progressDiv.appendChild(progressExploreDiv);
		var progressExploreP = document.createElement('p');
		progressExploreP.innerHTML = "Explore: &nbsp;";
		progressExploreP.className = 'progressLabel';
		progressExploreDiv.appendChild(progressExploreP);
		var progressExploreBar = document.createElement('div');
		progressExploreBar.className = 'progressBar bigProgressBar';
		var progressExploreDoneBar = document.createElement('div');
		progressExploreDoneBar.className = 'progressBarDone';
		var visitedSites = 0, populatedSites = 0;
		for (s of sites) {
			if (s.population > 0) {populatedSites++};
			if (s.hasVisited.p1) {visitedSites++};
		};
		var percentage = Math.min(Math.round(visitedSites/populatedSites * 100,0),100);
		var caption = percentage + "%";
		progressExploreDoneBar.innerHTML = caption;
		progressExploreDoneBar.style.width = percentage + '%';
		progressExploreBar.appendChild(progressExploreDoneBar);
		progressExploreDiv.appendChild(progressExploreBar);		
		
		var progressRebuildDiv = document.createElement('div');
		progressRebuildDiv.className = 'progressDiv';
		progressDiv.appendChild(progressRebuildDiv);
		var progressRebuildP = document.createElement('p');
		progressRebuildP.innerHTML = "Rebuild: &nbsp;";
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
	
	markSelectedUnit: function() {
		if (units.length > 1) {
			var oldSelected = document.getElementById('selectionMarker');
			if (oldSelected !== null) {
				oldSelected.remove();
			};
			var selected = document.createElementNS('http://www.w3.org/2000/svg','use');
			selected.id = 'selectionMarker';
			var selectedLocation = {x:0,y:0};
			if (view.focus.unit.location == undefined) {
				selectedLocation.x = view.focus.unit.route[0].x;
				selectedLocation.y = view.focus.unit.route[0].y;
			} else {
				selectedLocation.x=view.focus.unit.location.x;
				selectedLocation.y=view.focus.unit.location.y + 12;
				var unitsAtSite = [];
				for (var c in units) {
					if (units[c].location == view.focus.unit.location) {
						unitsAtSite.push(units[c]);
					};
				};
				if (unitsAtSite.length > 1) {
					var unitOrder = unitsAtSite.indexOf(view.focus.unit);
					var offSet = unitOrder * (20/(unitsAtSite.length-1)) - 10;
					selectedLocation.x += offSet;
				};
			};
			selected.setAttribute('x',selectedLocation.x);
			selected.setAttribute('y',selectedLocation.y);
			selected.setAttribute('href','#selectedAura');
			selected.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#selectedAura');
			document.getElementById('sitesGroup').appendChild(selected);
		};
	},
	
	mapZoom: function(e) {
		if (model.options.zoom) {
			var zoomFactor = e.deltaY;
			zoomFactor *= model.options.zoomFactor;
			if (view.zoom.z == 1000 && zoomFactor > 0) {
				var viewbox = view.zoom.viewbox;
				viewbox.minX = (100-zoomFactor)*viewbox.minX/100;
				viewbox.minY = (100-zoomFactor)*viewbox.minY/100;

				var viewboxString = viewbox.minX + ' ' + viewbox.minY + ' ' + viewbox.width + ' ' + viewbox.height;
				view.zoom.viewbox = viewbox;
			} else {
				view.zoom.z += zoomFactor * 2;
				view.zoom.z = Math.min(Math.max(view.zoom.z,100),1000);

				var viewbox = view.zoom.viewbox;
				viewbox.minX = viewbox.minX + viewbox.width/2 - view.zoom.z/2;
				viewbox.minY = viewbox.minY + viewbox.height/2 - view.zoom.z/2;
				viewbox.width = view.zoom.z;
				viewbox.height = view.zoom.z;

				var viewboxString = viewbox.minX + ' ' + viewbox.minY + ' ' + viewbox.width + ' ' + viewbox.height;
				view.zoom.viewbox = viewbox;
			};
			view.displayMap();
			view.markSelectedUnit();
		};
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
			var zoomFactor = view.zoom.z / 800;
			var newMinX = viewbox.minX - diffX*zoomFactor;
			var newMinY = viewbox.minY - diffY*zoomFactor;
			if ((newMinX > 0 && newMinX + viewbox.width < 1000) || (newMinX < 0 && newMinX > viewbox.minX) || (newMinX+viewbox.width > 1000 && newMinX+viewbox.width < viewbox.minX + viewbox.width)) {
				view.zoom.dragStartX = e.pageX;
				viewbox.minX = newMinX;
			};
			if ((newMinY > 0 && newMinY + viewbox.height < 1000) || (newMinY < 0 && newMinY > viewbox.minY) || (newMinY+viewbox.height > 1000 && newMinY+viewbox.height < viewbox.minY + viewbox.height)) {
				view.zoom.dragStartY = e.pageY;
				viewbox.minY = newMinY;
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

		var siteCharacterDiv = document.createElement('div');
		siteCharacterDiv.id = 'siteCharacterDiv';
		detailsSiteDiv.appendChild(siteCharacterDiv);
		var siteCommoditiesDiv = document.createElement('div');
		siteCommoditiesDiv.id = 'siteCommoditiesDiv';
		detailsSiteDiv.appendChild(siteCommoditiesDiv);
		var siteInfrastructureDiv = document.createElement('div');
		siteInfrastructureDiv.id = 'siteInfrastructureDiv';
		detailsSiteDiv.appendChild(siteInfrastructureDiv);

		var siteHead = document.createElement('h2');
		siteHead.innerHTML = site.name;
		siteHead.className = 'siteHead';
		siteCharacterDiv.appendChild(siteHead);

		if (site.hasVisited.p1) {
			var sitePopulationP = document.createElement('p');
			if (site.population > 200) {
				sitePopulationP.innerHTML = "a city of ";
			} else if (site.population > 80) {
				sitePopulationP.innerHTML = "a town of ";
			} else if (site.population > 40) {
				sitePopulationP.innerHTML = "a village of ";
			} else if (site.population > 20) {
				sitePopulationP.innerHTML = "a hamlet of ";
			} else if (site.population > 0) {
				sitePopulationP.innerHTML = "a haven for ";
			} else if (site.infrastructure.length > 0) {
				sitePopulationP.innerHTML = "Ghost Town";
			} else {
				sitePopulationP.innerHTML = "the middle of nowhere";
			};
			if (site.population > 0) {
				sitePopulationP.innerHTML += site.population + " souls";
			}
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
	
		if (site.hasVisited.p1) {
			var commoditiesTraded = site.trading();
			var commoditiesBought = site.buying();
			var commoditiesListed = site.trading();
			for (var b in commoditiesBought) {
				if (commoditiesListed[b] == undefined) {
					commoditiesListed[b] = commoditiesBought[b];
				};
			};
			var siteCommoditiesTable = document.createElement('table');
			siteCommoditiesTable.className = 'commoditiesTable';
			siteCommoditiesDiv.appendChild(siteCommoditiesTable);
			var siteCommoditiesTableTitle = document.createElement('caption');
			siteCommoditiesTableTitle.innerHTML = 'Commodity Values';
			siteCommoditiesTable.appendChild(siteCommoditiesTableTitle);
			var knownValues = model.knownValues();
			var localValuesRanked = [];
			for (var commodity in site.trading()) {
				localValuesRanked.push(commodity);
			};
			for (var commodity in site.buying()) {
				if (localValuesRanked.indexOf(commodity) == -1) {
					localValuesRanked.push(commodity);
				};
			};
			localValuesRanked.sort(function(a,b) {return ( (site.commodities[a]>site.commodities[b]) ? -1 : 1 )});
			for (var c in commoditiesListed) {
				var siteCommoditiesItem = document.createElement('tr');
				siteCommoditiesTable.appendChild(siteCommoditiesItem);
				var siteCommoditiesNameCell = document.createElement('td');
				var icon = view.commodityIcon(c);
				siteCommoditiesNameCell.innerHTML = icon + ' ' + data.commodities[c].name;
				siteCommoditiesItem.appendChild(siteCommoditiesNameCell);
				var siteCommoditiesValueCell = document.createElement('td');
				siteCommoditiesValueCell.innerHTML = Math.round(100 * commoditiesListed[c],0);
// 				if (commoditiesListed[c] > knownValues[c]*2) {
// 					siteCommoditiesValueCell.innerHTML += ' (+++)';
// 				} else if (commoditiesListed[c] > knownValues[c]*1.5) {
// 					siteCommoditiesValueCell.innerHTML += ' (++)';
// 				} else if (commoditiesListed[c] > knownValues[c]*1.25) {
// 					siteCommoditiesValueCell.innerHTML += ' (+)';
// 				} else if (commoditiesListed[c] < knownValues[c]*.8) {
// 					siteCommoditiesValueCell.innerHTML += ' (-)';
// 				} else if (commoditiesListed[c] < knownValues[c]*.66) {
// 					siteCommoditiesValueCell.innerHTML += ' (--)';
// 				} else if (commoditiesListed[c] < knownValues[c]*.5) {
// 					siteCommoditiesValueCell.innerHTML += ' (---)';
// 				};
				if (localValuesRanked.indexOf(c) < 3) {
// 					siteCommoditiesValueCell.innerHTML += ' +';
					siteCommoditiesValueCell.className = 'localHighValue';
				} else if (localValuesRanked.indexOf(c) > localValuesRanked.length - 1 - 3) {
// 					siteCommoditiesValueCell.innerHTML += ' -';
					siteCommoditiesValueCell.className = 'localLowValue';
				} else {
					siteCommoditiesValueCell.className = 'localMidValue';
				};
				for (var i in site.infrastructure) {
					if (site.infrastructure[i].outputs !== undefined && site.infrastructure[i].outputs.indexOf(c) !== -1) {
						siteCommoditiesItem.className = 'localCommodity';
					} else if (commoditiesTraded[c] == undefined) {
						siteCommoditiesItem.className = 'marketCommodity';
					};
				};
				siteCommoditiesItem.appendChild(siteCommoditiesValueCell);
				var unitPresent = false;
				for (var u in units) {
					if (units[u].location == site) {
						unitPresent = true;
					};
				};
				if (unitPresent && commoditiesTraded[c] !== undefined) {
					var siteCommoditiesTradeCell = document.createElement('td');
					siteCommoditiesTradeCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-cart-plus"></span><span class="tooltip">Request <br />'+data.commodities[c].name+'</span></a>';
					siteCommoditiesTradeCell.setAttribute('onclick','handlers.addFromSite("'+c+'")');
					siteCommoditiesItem.appendChild(siteCommoditiesTradeCell);
				} else {
					var siteCommoditiesTradeCell = document.createElement('td');
					siteCommoditiesTradeCell.innerHTML += "&nbsp;";
					siteCommoditiesItem.appendChild(siteCommoditiesTradeCell);
				};
			};
		};
		var siteReputationP = document.createElement('a');
		siteReputationP.id = 'siteReputationP';
		var mechanicFound = false;
		for (var s in sites) {
			if (sites[s].infrastructure.indexOf(data.infrastructure.mechanic) !== -1 && sites[s].hasVisited.p1) {
				mechanicFound = true;
			};
		};
		if (players.p1.unitsUnlocked.tinkersCart || mechanicFound) {
			var siteReputationTooltip = document.createElement('span');
			siteReputationTooltip.className = 'tooltip';
			siteReputationTooltip.innerHTML = Math.round(site.reputation.p1,4) + '<br />You gain ' + site.goodwill.p1 + ' reputation here each fortnight.';
			siteReputationP.appendChild(siteReputationTooltip);
		};
		if (site.population == 0) {
		} else if (site.reputation.p1 > 0) {
			siteReputationP.innerHTML += 'Your reputation here: +' + Math.floor(site.reputation.p1,0);
			siteReputationP.className = 'positive';
		} else if (site.reputation.p1 < 0) {
			siteReputationP.innerHTML += 'You reputation here: ' + Math.floor(site.reputation.p1,0);
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
		
		// Infrastructure
		if (site.hasVisited.p1 && site.population > 0) {
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
						if (data.units[site.infrastructure[i].buildUnits[u]].unlockable == undefined || players.p1.unitsUnlocked[site.infrastructure[i].buildUnits[u]]) {
							var buildOption = document.createElement('option');
							if (view.focus.unit.location == site) {
								var canBuild = view.focus.unit.canAfford(data.units[site.infrastructure[i].buildUnits[u]].buildCost,'rep');
								if (canBuild == Infinity) {
									buildOption.innerHTML = '&#10060; ';
								} else if (canBuild > site.reputation.p1)  {
									buildOption.innerHTML = '&#10060; ';
								} else {
									buildOption.innerHTML = '&#10024; ';
								};
							};
							buildOption.innerHTML += data.units[site.infrastructure[i].buildUnits[u]].name;
							buildOption.value = site.infrastructure[i].buildUnits[u];
							buildSelect.appendChild(buildOption);
						};
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
					var cost = (players.p1[site.infrastructure[i].upgrade] - 1 ) * 100;
					var infrastructureDiv = document.createElement('div');
					infrastructureDiv.className = 'infrastructureDiv';
					var infrastructureHead = document.createElement('h3');
					infrastructureHead.className = 'infrastructureHead';
					infrastructureHead.innerHTML = site.infrastructure[i].name;
					infrastructureDiv.appendChild(infrastructureHead);
					var infrastructureUpgradeText = document.createElement('p');
					infrastructureUpgradeText.innerHTML = site.infrastructure[i].text;
					infrastructureDiv.appendChild(infrastructureUpgradeText);
					var infrastructureUpgradeButton = document.createElement('button');
					infrastructureUpgradeButton.innerHTML = 'Upgrade ' + site.infrastructure[i].upgradeDisplay + " (" +cost+ " rep)";
					infrastructureUpgradeButton.setAttribute('onclick','handlers.upgrade("'+site.infrastructure[i].upgrade+'",'+cost+')');
					if(cost > site.reputation.p1) {
						infrastructureUpgradeButton.disabled = true;
					};
					infrastructureDiv.appendChild(infrastructureUpgradeButton);
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				} else if (site.infrastructure[i].valuables !== undefined) {
					var infrastructureDiv = document.createElement('div');
					infrastructureDiv.innerHTML = 'Trade for Valuables';
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				} else if (site.infrastructure[i].potentialCommodities !== undefined) {
					var infrastructureDiv = document.createElement('div');
					siteInfrastructureDiv.appendChild(infrastructureDiv);
					infrastructureDiv.className = 'infrastructureDiv';
					var infrastructureHead = document.createElement('h3');
					infrastructureHead.innerHTML = site.infrastructure[i].name;
					infrastructureDiv.appendChild(infrastructureHead);
					var infrastructureDescription = document.createElement('p');
					infrastructureDescription.innerHTML = site.infrastructure[i].text;
					var potentialCommodities = [];
					var totalValue = 0;
					for (var p of site.infrastructure[i].potentialCommodities) {
						potentialCommodities.push(view.commodityIcon(p) + ' ' + data.commodities[p].name);
						totalValue += site.commodities[p];
					};
					totalValue = Math.floor(totalValue * 100/potentialCommodities.length);
					infrastructureDescription.innerHTML += 'Chance of ' + gamen.prettyList(potentialCommodities,'or') + '.';
					infrastructureDiv.appendChild(infrastructureDescription);
					var potentialBtn = document.createElement('button');
					potentialBtn.innerHTML = 'Salvage ('+totalValue+' rep)';
					potentialBtn.setAttribute('onclick','handlers.salvage('+i+')');
					if (totalValue > site.reputation.p1) {
						potentialBtn.disabled = true;
					};
					infrastructureDiv.appendChild(potentialBtn);
					
				} else if (site.infrastructure[i].recruit !== undefined) {
					var infrastructureDiv = document.createElement('div');
					infrastructureDiv.className = 'infrastructureDiv';
					var infrastructureHead = document.createElement('h3');
					infrastructureHead.innerHTML = site.infrastructure[i].name;
					infrastructureDiv.appendChild(infrastructureHead);
					var infrastructureDescription = document.createElement('p');
					infrastructureDescription.innerHTML = site.infrastructure[i].text + '<br />';
					infrastructureDiv.appendChild(infrastructureDescription);
					var recruitCostP = document.createElement('p');
					var recruitCostOutstandingList = [];
					var recruitCostOutstandingItems = [];
					var recruitCostMet = true;
					for (var c in site.infrastructure[i].recruitCost) {
						var progress = 0;
						if (players.p1.recruitProgress[site.infrastructure[i].recruit] !== undefined && players.p1.recruitProgress[site.infrastructure[i].recruit][c] !== undefined) {
							progress = players.p1.recruitProgress[site.infrastructure[i].recruit][c];
						};
						if (site.infrastructure[i].recruitCost[c] > progress) {
							var num =  site.infrastructure[i].recruitCost[c] - progress ;
							recruitCostOutstandingList.push(num + " " + view.commodityIcon(c) + data.commodities[c].name);
							recruitCostOutstandingItems.push(c);
							recruitCostMet = false;
						};
					};
					if (recruitCostOutstandingItems.length > 0) {
						recruitCostP.innerHTML = "Needs: " + gamen.prettyList(recruitCostOutstandingList);
						infrastructureDiv.appendChild(recruitCostP);
						for (c of recruitCostOutstandingItems) {
							var recruitCostBtn = document.createElement('button');
							recruitCostBtn.innerHTML = 'Give ' + view.commodityIcon(c) + data.commodities[c].name;
							recruitCostBtn.setAttribute('onclick','handlers.payRecruitCost("'+site.infrastructure[i].recruit+'","'+c+'")');
							recruitCostBtn.disabled = true;
							for (var d in view.focus.unit.commodities) {
								if (view.focus.unit.commodities[d].commodity == c && view.focus.unit.commodities[d].qty == 100) {
									recruitCostBtn.disabled = false;
								};
							};
							infrastructureDiv.appendChild(recruitCostBtn);
						};
					};
					var recruitBtn = document.createElement('button');
					recruitBtn.innerHTML = 'Recruit ' + site.infrastructure[i].name;
					recruitBtn.setAttribute('onclick','handlers.recruit('+i+')');
					if (!recruitCostMet) {
						recruitBtn.disabled = true;
					};
					infrastructureDiv.appendChild(recruitBtn);
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				} else if (site.infrastructure[i].turnIn !== undefined) {
					var infrastructureDiv = document.createElement('div');
					infrastructureDiv.className = 'infrastructureDiv';
					var infrastructureHead = document.createElement('h3');
					infrastructureHead.className = 'infrastructureHead';
					infrastructureHead.innerHTML = site.infrastructure[i].name;
					infrastructureDiv.appendChild(infrastructureHead);
					var infrastructureUpgradeText = document.createElement('p');
					infrastructureUpgradeText.innerHTML = site.infrastructure[i].text;
					infrastructureDiv.appendChild(infrastructureUpgradeText);
					var infrastructureUpgradeButton = document.createElement('button');
					infrastructureUpgradeButton.innerHTML = site.infrastructure[i].buttonLabel;
					infrastructureUpgradeButton.setAttribute('onclick','events.'+site.infrastructure[i].onTurnIn+"()");
					var hasTurnIn = false;
					for (var unit of units) {
						if (unit.location == site) {
							for (var commodity of unit.commodities) {
								if (site.infrastructure[i].turnIn.indexOf(commodity.commodity) !== -1) {
									hasTurnIn = true;
								};
							};
						};
					};
					if (!hasTurnIn) {
						infrastructureUpgradeButton.disabled = true;
					};
					infrastructureDiv.appendChild(infrastructureUpgradeButton);
					siteInfrastructureDiv.appendChild(infrastructureDiv);
				};
			};
		};
		
		// Warehouse
		if (site.warehouse.p1.length > 0) {
			var warehouseTable = document.createElement('table');
			warehouseTable.className = 'commoditiesTable';
			siteInfrastructureDiv.appendChild(warehouseTable);
			var warehouseHead = document.createElement('caption');
			warehouseHead.innerHTML = "Warehouse";
			warehouseTable.appendChild(warehouseHead);
			for (var i in site.warehouse.p1) {
				var warehouseRow = document.createElement('tr');
				warehouseTable.appendChild(warehouseRow);
				var warehouseNameCell = document.createElement('td');
				var icon = view.commodityIcon(site.warehouse.p1[i].commodity);
				warehouseNameCell.innerHTML = icon + ' ' + data.commodities[site.warehouse.p1[i].commodity].name;
				if (site.warehouse.p1[i].qty < 100) {
					warehouseNameCell.innerHTML += ' (' + site.warehouse.p1[i].qty + '%)';
				};
				warehouseRow.appendChild(warehouseNameCell);
				var warehousePickupCell = document.createElement('td');
				warehousePickupCell.innerHTML = '<span class="fa fa-hand-paper-o fa-rotate-90"></span>';
				warehousePickupCell.setAttribute('onclick','handlers.pickupWarehouse('+i+')');
				warehouseRow.appendChild(warehousePickupCell);
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
			trashHead.innerHTML = "Side of the Road";
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
			
// 		view.displayMap();
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
	
	displayUnit: function(unit,zoom) {
		var selectedUnit = unit;
		view.focus.unit = unit;
		
		if (zoom) {
			if (unit.location !== undefined) {
				var unitX = unit.location.x;
				var unitY = unit.location.y;
			} else {
				var unitX = unit.route[0].x;
				var unitY = unit.route[0].y;
			};
		
			var inScreen = view.zoom.viewbox.minX+view.zoom.viewbox.width*0.2 < unitX && unitX < view.zoom.viewbox.minX+view.zoom.viewbox.width*0.8 && view.zoom.viewbox.minY+view.zoom.viewbox.height*0.2 < unitY && unitY < view.zoom.viewbox.minY+view.zoom.viewbox.height*0.8;
			if (!inScreen) {
				view.zoom = {
					z: view.zoom.z,
					viewbox: {
						minX: unitX-view.zoom.z/2,
						minY: unitY-view.zoom.z/2,
						height: view.zoom.z,
						width: view.zoom.z,
					},
				};
			};
		};
		
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
			unitHeaderDiv.className = 'unitHeaderDiv';
			unitPane.appendChild(unitHeaderDiv);
			var unitCargoDiv = document.createElement('div');
			unitCargoDiv.className = 'unitCargoDiv';
			unitPane.appendChild(unitCargoDiv);
			var unitActionsDiv = document.createElement('div');
			unitActionsDiv.className = 'unitActionsDiv';
			unitPane.appendChild(unitActionsDiv);
			
			var unitPic = document.createElementNS('http://www.w3.org/2000/svg','svg');
			unitPic.setAttribute('class','unitPic');
			unitPic.setAttribute('fill','#eeeeee');
			unitPic.setAttribute('viewBox','0 0 60 40');
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
			
			unitRenameInput.addEventListener('keyup',function(event) {
				if (event.key == "Enter") {
					handlers.renameUnit();
				};
			})
		
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
			if (unit.caravan == undefined) {
				unitsInCaravan = [unit];
			} else {
				unitsInCaravan = unit.caravan;
			};
			var provisionsFood = 0;
			var provisionsWater = 0;
			var provisionsFuel = 0;
			var consumptionFood = 0;
			var consumptionWater = 0;
			var consumptionFuel = 0;
			for (var d in unitsInCaravan) {
				for (var c in unitsInCaravan[d].commodities) {
					if (unitsInCaravan[d].commodities[c].commodity == 'food') {
						provisionsFood += unitsInCaravan[d].commodities[c].qty;
					} else if (unitsInCaravan[d].commodities[c].commodity == 'water') {
						provisionsWater += unitsInCaravan[d].commodities[c].qty;
					} else if (unitsInCaravan[d].commodities[c].commodity == 'fuel') {
						provisionsFuel += unitsInCaravan[d].commodities[c].qty;
					};
				};
				consumptionFood += unitsInCaravan[d].type.crew;
				if (unitsInCaravan[d].type.fuel.water !== undefined) {
					consumptionWater += unitsInCaravan[d].type.fuel.water;
				};
				if (unitsInCaravan[d].type.fuel.fuel !== undefined) {
					consumptionFuel += unitsInCaravan[d].type.fuel.fuel;
				};
			};
			provisionsFood /= consumptionFood;
			if (consumptionWater > 0) {
				provisionsWater /= consumptionWater;
			} else {
				provisionsWater = Infinity;
			};
			if (consumptionFuel > 0) {
				provisionsFuel /= consumptionFuel;
			} else {
				provisionsFuel = Infinity;
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
					for (var d in unit.caravan) {
						if (unit.caravan[d] !== unit) {
							caravanNamesList.push(unit.caravan[d].name);
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
				var buyable = unit.location.trading();
				var buying = unit.location.buying();
				for (var c in buying) {
					if (trading[c] == undefined) {
						trading[c] = buying[c];
					};
				};
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
					unitCommoditiesValueCell.innerHTML = Math.round(unit.commodities[c].qty * unit.location.commodities[unit.commodities[c].commodity],0);
					unitCommoditiesItem.appendChild(unitCommoditiesValueCell);
					
					var unitCommoditiesTradeCell = document.createElement('td');
					unitCommoditiesTradeCell.id = 'unitAddBtn_' + u + '_' + c;
					unitCommoditiesTradeCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-cart-arrow-down"></span><span class="tooltip">Add '+data.commodities[unit.commodities[c].commodity].name+' to Offer</span></a>';
					if (unit.currentTrade.unitStuff.indexOf(unit.commodities[c]) == -1) {
						unitCommoditiesTradeCell.setAttribute('onclick','handlers.addFromUnit('+u+',"'+c+'")');
					} else {
						unitCommoditiesTradeCell.style.color = 'lightgrey';
					}
					unitCommoditiesItem.appendChild(unitCommoditiesTradeCell);
					
					var resupplyCell = document.createElement('td');
					var resupplyCost = (100 - unit.commodities[c].qty) * unit.location.commodities[unit.commodities[c].commodity];
					if (unit.commodities[c].qty < 100 && resupplyCost < unit.location.reputation.p1 && buyable[unit.commodities[c].commodity] !== undefined) {
						resupplyCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-refresh"></span><span class="tooltip">Resupply '+data.commodities[unit.commodities[c].commodity].name+': '+Math.ceil(resupplyCost)+' reputation</span></a>';
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
				var warehousing = false;
				if (unit.inTransit == false) {
					for (var infrastructure of unit.location.infrastructure) {
						if (infrastructure.warehousing) {
							warehousing = true;
						};
					};
				};
				if (warehousing) {
					var unitCommoditiesWarehouseCell = document.createElement('td');
					unitCommoditiesWarehouseCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-building"></span><span class="tooltip">Warehouse '+data.commodities[unit.commodities[c].commodity].name+'</span></a>';
					unitCommoditiesWarehouseCell.setAttribute('onclick','handlers.warehouseFromUnit('+u+',"'+c+'")');
					unitCommoditiesItem.appendChild(unitCommoditiesWarehouseCell);
				} else if (unit.inTransit !== true) {
					var unitCommoditiesTrashCell = document.createElement('td');
					unitCommoditiesTrashCell.innerHTML = '<a class="tipAnchor"><span class="fa fa-road"></span><span class="tooltip">Unload '+data.commodities[unit.commodities[c].commodity].name+' to Road</span></a>';
					unitCommoditiesTrashCell.setAttribute('onclick','handlers.trashFromUnit('+u+',"'+c+'")');
					unitCommoditiesItem.appendChild(unitCommoditiesTrashCell);
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
					cancelRouteBtn.innerHTML = 'Cancel Route';
					cancelRouteBtn.setAttribute('onclick','handlers.cancelRoute('+unitIndex+')');
					unitPane.appendChild(cancelRouteBtn);
				} else {
					var cancelRouteBtn = document.createElement('button');
					cancelRouteBtn.innerHTML = 'Stop Here';
					cancelRouteBtn.setAttribute('onclick','handlers.roadside('+unitIndex+')');
					unitPane.appendChild(cancelRouteBtn);					
				};
			};
			if (unit.isSurveying) {
				var surveyingP = document.createElement('p');
				var eta = Math.round(( unit.surveyComplete.getTime() - model.clock.time.getTime() ) / 8.64e+7,0);
				surveyingP.innerHTML = "Surveying "+unit.location.name+" (" + eta + " days)";
				unitPane.appendChild(surveyingP);
			};
		
			// Action Buttons
		
			var unitOffroadButton = document.createElement('button');
			if (unit.type.airborne) {
				unitOffroadButton.hidden = true;
			} else if (unit.offroad == false) {
				unitOffroadButton.innerHTML = 'Go Offroad';
			} else if (unit.location == undefined) {
				unitOffroadButton.innerHTML = 'Reach a Site';
				unitOffroadButton.disabled = true;
			} else {
				unitOffroadButton.innerHTML = 'Return to Road';
			};
			unitOffroadButton.setAttribute('onclick','handlers.toggleRoad()');
			unitActionsDiv.appendChild(unitOffroadButton);
		
			var unitScuttleButton = document.createElement('button');
			unitScuttleButton.innerHTML = 'Scuttle';
			unitScuttleButton.setAttribute('onclick','handlers.scuttle()');
			if (units.length == 1) {unitScuttleButton.disabled = true;};
			unitActionsDiv.appendChild(unitScuttleButton);
			
			// Building Infrastructure
			if (unit.type.canBuild && unit.location !== undefined) {
				var unitBuildDiv = document.createElement('div');
				unitBuildDiv.id = 'unitBuildDiv_'+u;
				unitBuildDiv.className = 'infrastructureDiv';
				unitPane.appendChild(unitBuildDiv);
				var unitBuildHead = document.createElement('h3');
				unitBuildHead.innerHTML = 'Build';
				unitBuildHead.className = 'infrastructureHead';
				unitBuildDiv.appendChild(unitBuildHead);
				
				// Busy Building Countdown
				if (unit.isBuilding) {
					var unitBuildProjectP = document.createElement('p');
					var eta = Math.round((unit.buildComplete.getTime() - model.clock.time.getTime() ) / 8.64e+7,0);
					unitBuildProjectP.innerHTML = 'Currently building ' + unit.buildProject.name + ' (' + eta + ' days)';
					unitBuildDiv.appendChild(unitBuildProjectP);
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
						var canBuild = unit.canAfford(data.infrastructure[unit.type.buildInfrastructures[b]].buildCost,'rep');
						if (canBuild == Infinity) {
							unitBuildOption.innerHTML = '&#10060; ';
						} else if (canBuild > unit.location.reputation.p1)  {
							unitBuildOption.innerHTML = '&#10060; ';
						} else {
							unitBuildOption.innerHTML = '&#10024; ';
						};
						unitBuildOption.innerHTML += data.infrastructure[unit.type.buildInfrastructures[b]].name;
						unitBuildOption.value = unit.type.buildInfrastructures[b];
						unitBuildSelect.appendChild(unitBuildOption);
					};
				};
				unitBuildDiv.appendChild(unitBuildSelect);
				
				var unitBuildBtn = document.createElement('button');
				unitBuildBtn.id = 'unitBuildBtn_' + u;
				unitBuildBtn.className = 'buildBtn';
				unitBuildBtn.innerHTML = 'Build';
				unitBuildBtn.disabled = true;
				unitBuildBtn.setAttribute('onclick','handlers.buildInfrastructure('+u+')');
				unitBuildDiv.appendChild(unitBuildBtn);
				
				var unitBuildPreviewDiv = document.createElement('div');
				unitBuildPreviewDiv.id = 'unitBuildPreviewDiv_' + u;
				unitBuildPreviewDiv.className = 'unitBuildPreviewDiv';
				unitBuildDiv.appendChild(unitBuildPreviewDiv);
			};
			
			// Passengers
			if (unit.type.canPassenger && unit.location !== undefined) {
				var unitPassengersDiv = document.createElement('div');
				unitPassengersDiv.className = 'unitPassengersDiv_'+u;
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
				if (takePassengersCost > unit.location.reputation.p1 || unit.location.population == 0 || unit.commodities.length >= unit.type.cargo) {
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
			
			// Survey
			
			if (unit.type.canSurvey && unit.location !== undefined) {
				var unitSurveyDiv = document.createElement('div');
				unitSurveyDiv.id = 'unitSurveyDiv_'+u;
				unitPane.appendChild(unitSurveyDiv);

				unitSurveyHead = document.createElement('h3');
				unitSurveyHead.innerHTML = 'Surveying';
				unitSurveyDiv.appendChild(unitSurveyHead);
				
				var unitSurveyP = document.createElement('p');
				unitSurveyDiv.appendChild(unitSurveyP);
				if (unit.location.surveys.p1.length > 0) {
					unitSurveyP.innerHTML = 'You have surveyed ' + unit.location.name + ' ' + gamen.prettyNumber(unit.location.surveys.p1.length) + ' times.  ';
					var foundNothing = 0;
					for (var s in unit.location.surveys.p1) {
						if (unit.location.surveys.p1[s] == 'nothing') {
							foundNothing++;
						};
					};
					unitSurveyP.innerHTML += 'The surveys found nothing ' + gamen.prettyNumber(foundNothing) + ' times.';
					unitSurveyP.innerHTML += '';
				} else {
					unitSurveyP.innerHTML = 'You have never surveyed ' + unit.location.name + '.';
				};
				
				var unitSurveyButton = document.createElement('button');
				unitSurveyButton.innerHTML = 'Survey';
				unitSurveyButton.setAttribute('onclick','handlers.survey()');
				if (!unit.type.canSurvey || unit.isSurveying || unit.location == undefined) {unitSurveyButton.disabled = true;};
				unitSurveyDiv.appendChild(unitSurveyButton);
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
				if (unitsAtSite[u] == view.focus.unit) {
					unitTab.className += ' unitTabSelect';
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
		view.markSelectedUnit();
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
			var requirements = [];
			for (var i of infrastructure.requiredResource) {
				requirements.push(data.resources[i].name);
			};
			unitBuildRequirementP.innerHTML = '<strong>Requires:</strong> ' + gamen.prettyList(requirements,'or');
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
		if (infrastructure.description == undefined) {
			if (infrastructure.requiredResource !== undefined) {
				var requirements = [];
				for (var i of infrastructure.requiredResource) {
					requirements.push(data.resources[i].name);
				};
				string += 'Requires a ' + gamen.prettyList(requirements,'or') + '. ';
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
			if (infrastructure.potentialCommodities !== undefined) {
				string += 'An unreliable source of '+gamen.prettyList(infrastructure.potentialCommodities) + '. ';
			};
			if (infrastructure.jobs !== undefined) {
				string += 'Employs ' + infrastructure.jobs + ' people. ';
			};
			if (infrastructure.provides !== undefined) {
				string += 'Provides ' + gamen.prettyList(infrastructure.provides) + '. ';
			};
			if (infrastructure.wageIncrease !== undefined) {
				string += 'Slowly increases local wages. ';
			};
			if (infrastructure.warehousing) {
				string += 'Allows you to warehouse commodities here. ';
			};
			if (infrastructure.goodwill > 0) {
				string += 'Gains the builder ' + infrastructure.goodwill + ' reputation each fortnight.';
			} else if (infrastructure.goodwill < 0) {
				string += 'Costs the builder ' + Math.abs(infrastructure.goodwill) + ' reputation each fortnight.';

			};
		} else {
			string += infrastructure.description;
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