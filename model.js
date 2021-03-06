var map = {};
var sites = [];
var landmarks = [];
var rivers = [];
var units = [];
var players = {};
players.p1 = {};

var errors = {};

var model = {

	gameTitle: 'Down the Phoenix Road',
	gameSavePrefix: 'PhoenixRoad',
	gameSaveDefault: function() {
		var saveName = players.p1.hometown.name;
		if (model.oldSaveName !== undefined) {
			saveName = model.oldSaveName;
		};
		return saveName;
	},
	supportLink: 'http://patreon.com/joshroby',
	supportLinkLabel: 'Patreon',

	options: {
		autoplay: true,
		autosave: true,
		autosaveCountdown: 20,
		tutorials: true,
		zoom: true,
		zoomFactor: 1,
		newGame: {
			mapSize: 750,
			totalSites: 30,
			minDist: 40,
			maxDist: 2.6,
			totalThreats: 5,
			ghostTowns: 2,
			volatility: 5,
		},
	},
	
	gameDivContents: function() {
		var result = [];
		
		var optionsDiv = document.createElement('div');
		optionsDiv.id = 'optionsDiv';
		result.push(optionsDiv);
		
		var introDiv = document.createElement('div');
		introDiv.id = 'introDiv';
		introDiv.innerHTML = data.introText;
		result.push(introDiv);
		
		var loadGameDiv = document.createElement('div');
		loadGameDiv.id = 'loadGameDiv';
		introDiv.appendChild(loadGameDiv);
		
		var detailsUnitDiv = document.createElement('div');
		detailsUnitDiv.id = 'detailsUnitDiv';
		result.push(detailsUnitDiv);
		
		var centerColumn = document.createElement('div');
		centerColumn.id = 'centerColumn';
		result.push(centerColumn);
		
			var mapDiv = document.createElement('div');
			mapDiv.id = 'mapDiv';
			centerColumn.appendChild(mapDiv);
		
				var mapSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
				mapSVG.id = 'mapSVG';
				mapDiv.appendChild(mapSVG);
		
			var tradeDiv = document.createElement('div');
			tradeDiv.id = 'tradeDiv';
			centerColumn.appendChild(tradeDiv);
		
				var unitStuffDiv = document.createElement('div');
				unitStuffDiv.id = 'unitStuffDiv';
				unitStuffDiv.className = 'tradeDiv';
				tradeDiv.appendChild(unitStuffDiv);
		
				var tradeControlsDiv = document.createElement('div');
				tradeControlsDiv.id = 'tradeControlsDiv';
				tradeControlsDiv.className = 'tradeDiv';
				tradeDiv.appendChild(tradeControlsDiv);
		
					var balanceDiv = document.createElement('div');
					balanceDiv.id = 'balanceDiv';
					tradeControlsDiv.appendChild(balanceDiv);
				
					var button = document.createElement('button');
					button.id = 'tradeBtn';
					button.innerHTML = 'Trade';
					button.setAttribute('onclick','handlers.makeTrade()');
					button.setAttribute('disabled','true');
					tradeControlsDiv.appendChild(button);
				
					var button = document.createElement('button');
					button.id = 'clearBtn';
					button.innerHTML = 'Clear';
					button.setAttribute('onclick','handlers.clearTrade()');
					tradeControlsDiv.appendChild(button);
		
				var siteStuffDiv = document.createElement('div');
				siteStuffDiv.id = 'siteStuffDiv';
				siteStuffDiv.className = 'tradeDiv';
				tradeDiv.appendChild(siteStuffDiv);
		
		var detailsSiteDiv = document.createElement('div');
		detailsSiteDiv.id = 'detailsSiteDiv';
		result.push(detailsSiteDiv);
		
		return result;
	},

	newGame: function() {
	
		model.oldSaveName = undefined;
		
		model.clock = new Clock(new Date(new Date().getTime() + 3.154e+12 + 3.154e+12 * Math.random() ));
		gamen.clocks = [model.clock];
		model.clock.timeStep = 8.64e+7;
		model.clock.logEventIn(8.64e+7,'eachDay');
		model.clock.logEventIn(8.64e+7*10*Math.random(),'randomEvent');
		
		var safeIndex = model.newMap();
		
		var nameSeedsList = ['Dune','Green','Cold','Hope','Faith','Ruin','Desolation','Old','New','Family','Prudence','Rossum','Nyarly','Signal','Temple','Dust','King','Queen','Sovereign','Prince',"People's",'Public'];
		var nameSeeds = [];
		for (var i = 0;i<nameSeedsList.length;i++) {
			var num = Math.random() * nameSeedsList.length << 0;
			if (nameSeeds.indexOf(num) == -1) {
				nameSeeds.push(num);
			};
		};
		for (i in nameSeeds) {
			nameSeeds[i] = nameSeedsList[nameSeeds[i]];
		};
		for (i=0;i<nameSeeds.length;i++) {
			var site = sites[Math.random() * sites.length << 0];
			site.nameSeed = nameSeeds[i];
			for (var n in site.neighbors) {
				var distance = Math.pow(Math.pow(site.x - site.neighbors[n].x,2)+Math.pow(site.y - site.neighbors[n].y,2),0.5);
				if (distance < 75) {
					site.neighbors[0].nameSeed = nameSeeds[i];
				};
			};
		};
		for (i in sites) {
			sites[i].upgradeName();
		};
		
		units = [];
		players.p1 = {unitsUnlocked:{},eventLog:{}};
		
		players.p1.vision = 1;
		players.p1.selfDefense = 1;
		players.p1.foraging = 1;
		players.p1.knownSites = [];
		players.p1.knownLandmarks = [];
		players.p1.knownRivers = [];
		players.p1.recruitProgress = {};
		players.p1.eventStack = [];
		
		model.globalEventStack = ["respawnInfrastructure"];
		model.globalSequesteredEvents = ["respawnInfrastructure","respawnInfrastructure","respawnInfrastructure","respawnInfrastructure","loadEvents"];
		
		var startUnit = new Unit(players.p1,sites[Math.random() * safeIndex << 0],data.units.donkeyCart);
		if (startUnit.location.neighbors.length == 0) {
			startUnit.location = sites[Math.random() * sites.length << 0];
		};
		players.p1.hometown = startUnit.location;
		
		startUnit.look();
		startUnit.location.reputation.p1 = 100;
		
		view.zoom = {
			z: 500,
			viewbox: {
				minX: startUnit.location.x-250,
				minY: startUnit.location.y-250,
				height: 500,
				width: 500,
			},
		};
		
		var startCargo = undefined;
		var cheapestValue = Infinity;
		var tradingHere = startUnit.location.trading();
		for (c in startUnit.location.commodities) {
			if (startUnit.location.commodities[c] < cheapestValue && data.commodities[c].common && c !== 'food' && c !== 'water') {
				startCargo = c;
				cheapestValue = startUnit.location.commodities[c];
			};
		};
		startUnit.commodities.push({commodity:startCargo,qty:100});
		startUnit.location.reputation.p1 -= cheapestValue * 100;
		startUnit.name = "Grams' Old Donkey Cart";
		
		// Testing Cheats
// 		startUnit.location.infrastructure.push(data.infrastructure.scrapyard);
// 		startUnit.location.infrastructure.push(data.infrastructure.lensmeister);
// 		startUnit.location.infrastructure.push(data.infrastructure.naturalist);
// 		startUnit.location.infrastructure.push(data.infrastructure.arena);
// 		startUnit.location.infrastructure.push(data.infrastructure.cartwright);
// 		var dowser = new Unit(players.p1,startUnit.location,data.units.dowser);
// 		var tinker = new Unit(players.p1,startUnit.location,data.units.tinkersCart);
// 		var horseCart = new Unit(players.p1,startUnit.location,data.units.horseCart);
// 		var oxCart = new Unit(players.p1,startUnit.location,data.units.oxCart);
// 		var bicycle = new Unit(players.p1,startUnit.location,data.units.bicycle);
// 		var buggy = new Unit(players.p1,startUnit.location,data.units.buggy);
// 		var wagon = new Unit(players.p1,startUnit.location,data.units.wagon);
// 		var bus = new Unit(players.p1,startUnit.location,data.units.bus);
// 		var truck = new Unit(players.p1,startUnit.location,data.units.truck);
// 		var semi = new Unit(players.p1,startUnit.location,data.units.semi);
// 		var zeppelin = new Unit(players.p1,startUnit.location,data.units.zeppelin);
		
		var localArea = [startUnit.location];
		for (var i=0;i<4;i++) {
			for (s in localArea) {
				for (n in localArea[s].neighbors) {
					if (localArea.indexOf(localArea[s].neighbors[n]) == -1) {
						localArea.push(localArea[s].neighbors[n]);
					};
				};
			};
		};
		var distantArea = [];
		for (var s in sites) {
			if (localArea.indexOf(sites[s]) == -1) {
				distantArea.push(sites[s]);
			};
		};
		
		localArea.shift();
		var cartwrightIndex = Math.random() * localArea.length << 0;
		if (localArea[cartwrightIndex].infrastructure.indexOf(data.infrastructure.cartwright) == -1) {
			localArea[cartwrightIndex].infrastructure.push(data.infrastructure.cartwright);
		};
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.lensmeister);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.kidOnABike);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.tinkerCamp);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.arena);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.nakedDowser);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.mechanic);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.hangar);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.burntOutBus);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.naturalist);
		view.focus.unit = startUnit;
		view.displayMap();
		
		players.p1.startScore = model.victoryProgress();
		
	},

	newMap: function(mapSize,totalSites,minDist,maxDist,minAngle,totalThreats,ghostTowns) {
		if (mapSize == undefined) { mapSize = model.options.newGame.mapSize };
		if (totalSites == undefined) { totalSites = model.options.newGame.totalSites };
		if (minDist == undefined) {  minDist = model.options.newGame.minDist };
		if (maxDist == undefined) {  maxDist = 2.6 };
		if (minAngle == undefined) {  minAngle = 30 };
		if (totalThreats == undefined) {totalThreats = model.options.newGame.totalThreats};
		if (ghostTowns == undefined) {ghostTowns = model.options.newGame.ghostTowns};
	
		sites = [];
		for (var i=0;i<totalSites*4;i++) {
			var newSite = new Site(mapSize);
		};
		
		// Blot out sites 
		var blots = (Math.random()+Math.random()) * 4 << 0;
		for (var i=0;i<blots;i++) {
			var blot = {
				x: (1000 - mapSize)/2 + Math.random() * mapSize << 0,
				y: (1000 - mapSize)/2 + Math.random() * mapSize << 0,
				r: Math.random() * mapSize * 0.2 + mapSize * 0.1,
			};
			for (var t in sites) {
				if (Math.pow(Math.pow(blot.x - sites[t].x,2) + Math.pow(blot.y - sites[t].y,2),.5) < blot.r) {
					sites.splice(t,1);
				};
			};
		};
		
		// Remove too-close sites, reduce to totalSites
		for (var i in sites) {
			for (var t=sites.length-1;t>0;t--) {
				var distance = Math.pow(Math.pow(sites[i].x - sites[t].x,2) + Math.pow(sites[i].y - sites[t].y,2),0.5);
				if (distance < minDist && distance > 0) {
					sites.splice(t,1);
				};
			};
		};
		sites.splice(totalSites);
		
		// Find Neighbors
		
		var total = 0;
		for (var i in sites) {
			var shortestDistance = Infinity;
			var nearestSite = undefined;
			for (var t in sites) {
				var distance = Math.pow(Math.pow(sites[i].x - sites[t].x,2) + Math.pow(sites[i].y - sites[t].y,2),.5);
				if (distance < shortestDistance && t !== i) {
					shortestDistance = distance;
					nearestSite = t;
				};
			};
			sites[i].neighbors = [sites[nearestSite]];
			total += shortestDistance;
		};
		var avgDist = total / sites.length;
		for (var i in sites) {
			sites[i].neighbors = [];
			for (var t in sites) {
				var distance = Math.pow(Math.pow(sites[i].x - sites[t].x,2) + Math.pow(sites[i].y - sites[t].y,2),.5);
				if (distance < avgDist * maxDist && distance >= minDist) {
					sites[i].neighbors.push(sites[t]);
				};
			};
		};
		
		// Remove neighbors on too-similar vectors
		var removeList = [];
		for (var i in sites) {
			neighborAngles = [];
			for (var n in sites[i].neighbors) {
				neighborAngles.push(Math.atan2(sites[i].neighbors[n].y - sites[i].y,sites[i].neighbors[n].x - sites[i].x) * 180 / Math.PI);
			}
			for (var a in neighborAngles) {
				for (var n in neighborAngles) {
					var angleDiff = Math.abs(neighborAngles[a] - neighborAngles[n]);
					if ((360 - minAngle < angleDiff || angleDiff < minAngle) && angleDiff !== 0) {
						removeList.push([sites[i],sites[i].neighbors[n],sites[i].neighbors[a]]);
					} else {
// 						console.log('big angle');
					};
				};
			};
		};
		
		for (var i in removeList) {
			var removeLink = [];
			var a = removeList[i][0];
			var b = removeList[i][1];
			var c = removeList[i][2];
			var abDist = Math.pow(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2),0.5);
			var acDist = Math.pow(Math.pow(a.x - c.x,2) + Math.pow(a.y - c.y,2),0.5);
			var bcDist = Math.pow(Math.pow(c.x - b.x,2) + Math.pow(c.y - b.y,2),0.5);
			if (abDist > acDist && abDist > bcDist) {
				removeLink = [a,b];
			} else if (acDist > abDist && acDist > bcDist) {
				removeLink = [a,c];
			} else {
				removeLink = [b,c];
			};
			if (removeLink[0].neighbors.indexOf(removeLink[1]) !== -1) {
				removeLink[0].neighbors.splice(removeLink[0].neighbors.indexOf(removeLink[1]),1);
			};
			if (removeLink[1].neighbors.indexOf(removeLink[0]) !== -1) {
				removeLink[1].neighbors.splice(removeLink[1].neighbors.indexOf(removeLink[0]),1);
			};
		};
		
		// Landmarks
		landmarks = [];
		for (var x=-50;x<1050;x += 65) {
			for (var y=-50;y<1050;y += 65) {
				var farFromSites = true;
				for (s in sites) {
					if (Math.pow(Math.pow(sites[s].x - x,2) + Math.pow(sites[s].y - y,2),0.5) < avgDist * maxDist * 0.5) {
						farFromSites = false;
					};
				};
				if (farFromSites) {
					landmarks.push({x:x+Math.random() * 50 - 25,y:y+Math.random() * 50 - 25,type:Math.random(),size:Math.random()});
				};
			};
		};
		
		// Rivers
		riverSites = [];
		rivers = [];
		for (var s in sites) {
			if (sites[s].resources.indexOf(data.resources.river) !== -1) {
				riverSites.push(sites[s]);
			};
		};
		for (var i=0;i<100;i++) {
			riverSites.push(landmarks[Math.random() * landmarks.length << 0]);
		};
		for (s in riverSites) {
				riverSites[s].portX = riverSites[s].x + Math.random() * 40 - 20;
				riverSites[s].portY = riverSites[s].y + Math.random() * 40 - 20;
		};
		for (var s in riverSites) {
			if (riverSites[s].population !== undefined) {
				riverSites[s].riverNeighbors = [];
				var riverNeighbors = [];
				for (var r in riverSites) {
					var distance = Math.pow(Math.pow(riverSites[s].x - riverSites[r].x,2)+Math.pow(riverSites[s].y - riverSites[r].y,2),0.5);
					if (r !== s) {
						riverNeighbors.push({site:riverSites[r],distance:distance});
					}
				}; 
				var smallest = {site:undefined,distance:Infinity};
				var secondSmallest = {site:undefined,distance:Infinity};
				for (var r in riverNeighbors) {
					if (riverNeighbors[r].distance < smallest.distance) {
						smallest = riverNeighbors[r];
					} else if (riverNeighbors[r].distance < secondSmallest.distance) {
						secondSmallest = riverNeighbors[r]
					};
				};
				var smallestAngle = Math.atan2(riverSites[s].y - smallest.site.y,riverSites[s].x - smallest.site.x) * 180 / Math.PI;
				var secondSmallestAngle = Math.atan2(riverSites[s].y - secondSmallest.site.y,riverSites[s].x - secondSmallest.site.x) * 180 / Math.PI;
				var angleDiff = smallestAngle - secondSmallestAngle;
				if ((360 - minAngle < angleDiff || angleDiff < minAngle) && angleDiff !== 0) {
					riverSites[s].riverNeighbors = [smallest];
					rivers.push({x1:riverSites[s].portX,y1:riverSites[s].portY,x2:smallest.site.portX,y2:smallest.site.portY});
				} else {
					riverSites[s].riverNeighbors = [smallest,secondSmallest];
					rivers.push({x1:riverSites[s].portX,y1:riverSites[s].portY,x2:smallest.site.portX,y2:smallest.site.portY});
					rivers.push({x1:riverSites[s].portX,y1:riverSites[s].portY,x2:secondSmallest.site.portX,y2:secondSmallest.site.portY});
				};
			};
		};
		for (r in rivers) {
			for (s=r;s<rivers.length;s++) {
				if (rivers[r].x1 == rivers[s].x2 && rivers[r].y1 == rivers[s].y2 && rivers[r].x2 == rivers[s].x1 && rivers[r].y2 == rivers[s].y1) {
					rivers.splice(s,1);
				};
			};
		};
		var controlMargin = mapSize / 50;
		for (r of rivers) {
			r.c1x = r.x1 - controlMargin + Math.random() * (r.x2-r.x1 + controlMargin*2);
			r.c1y = r.y1 - controlMargin + Math.random() * (r.y2-r.y1 + controlMargin*2);
			r.c2x = r.x2 - controlMargin + Math.random() * (r.x1-r.x2 + controlMargin*2);
			r.c2y = r.y2 - controlMargin + Math.random() * (r.y1-r.y2 + controlMargin*2);
			r.width = 5 + Math.random() * 5 << 0;
		};
		
		// Threats
		var threats = [];
		for (var i=sites.length-1;i>sites.length-totalThreats-1;i--) {
			threats.push(sites[i]);
			sites[i].wages *= Math.random()/2+0.5;
			sites[i].threat = {
				name: model.threatName(sites[i]),
				strength: 3 + Math.random() * 7 << 0,
				targets: [],
			};
		};
		for (var s in sites) {
			var nearestThreatDist = Infinity;
			var nearestThreat = undefined;
			var distance;
			for (var t in threats) {
				distance = Math.pow(Math.pow(threats[t].x - sites[s].x,2) + Math.pow(threats[t].y - sites[s].y,2) ,0.5)
				if (distance < nearestThreatDist) {
					nearestThreatDist = distance;
					nearestThreat = threats[t];
				};
			};
			sites[s].nearestThreat = nearestThreat;
			nearestThreat.threat.targets.push({siteIndex:s,distance:nearestThreatDist});
		};
		
		// Ghost Towns
		for (i=i;i>sites.length-totalThreats-1-ghostTowns;i--) {
			sites[i].ghost();
		};
		
		// Pile into Map Object
		map.sites = sites;
		map.landmarks = landmarks;
		map.threats = threats;
		
		return i;
		
	},
	
	threatName: function(site) {
		var prefices = ["","Howling ","Hell's ","The ","Great ","The Supreme ","69th ","Furious ","Faithful ","Pure ","Stone Cold ","Flaming ","Killer "];
		var roots = ["",site.name + " ",site.name + " ",site.name + " ","Jackal ","Peacekeeping ","White ","Demon ","Angel ","Highway ","Chopper ","Fury "];
		var suffices = ["Kings","Queens","Sovereigns","Gang","Army","Nation","Division","Legion","Militia","Horde","Riders"];
		return prefices[Math.random() * prefices.length >> 0] + roots[Math.random() * roots.length >> 0] + suffices[Math.random() * suffices.length >> 0]
	},
	
	nearestThreat: function(x,y) {
		var threat = undefined;
		var threatDistance = Infinity;
		for (var i in sites) {
			var distance = Math.pow(Math.pow(sites[i].x - x,2) + Math.pow(sites[i].y - y,2),0.5);
			if (sites[i].threat !== undefined && distance < threatDistance) {
				threatDistance = distance;
				threat = sites[i];
			};
		};
		return threat;
	},
	
	selfDefense: function(unit,odds) {
		var defenders = unit.type.crew;
		if (unit.caravan !== undefined) {
			defenders = 0;
			for (var i of unit.caravan) {
				defenders += i.type.crew;
			};
		};
		var selfDefenseIndex = players.p1.selfDefense;
		var selfDefenseDescriptor = data.selfDefense[Math.min(selfDefenseIndex,6)];
		if (odds == 'display') {
			return defenders + ' ' + selfDefenseDescriptor + ' drivers (' + Math.round(defenders * players.p1.selfDefense * 10)/10 + ' <span class="fa fa-hand-rock-o"></span>)';
		} else {
			return defenders * ( 0.5 + players.p1.selfDefense * 0.2 ) * Math.random();
		};
	},
	
	knownValues: function() {
		var knownValues = {};
		var totalSites = {};
		for (var c in data.commodities) {
			knownValues[c] = 0;
			totalSites[c] = 0;
		};
		for (var s in players.p1.knownSites) {
			if (players.p1.knownSites[s].hasVisited.p1 && players.p1.knownSites[s].infrastructure.length > 0) {
				for (var c in knownValues) {
					var traded = players.p1.knownSites[s].trading();
					if (traded[c] !== undefined) {
						totalSites[c]++;
						knownValues[c] += players.p1.knownSites[s].commodities[c];
					};
				};
			};
		};
		for (var c in knownValues) {
			knownValues[c] /= totalSites[c];
		};
		return knownValues;
	},
	
	checkClock: function() {
		if (model.options.autoplay) {
			var allBusy = true;
			for (var u in units) {
				if (!units[u].inTransit && !units[u].isSurveying && !units[u].isBuilding ) {
					allBusy = false;
				};
			};
			if (allBusy && !model.clock.running) {
				model.clock.running = true;
				model.clock.go();
			};
		};
	},
	
	eachDay: function() {
		
		model.clock.logEventIn(8.64e+7,'eachDay');
		
		model.options.autosaveCountdown--;
		if (model.options.autosaveCountdown == 0 && model.options.autosave) {
			model.options.autosaveCountdown = 20;
			gamen.autosave();
			console.log('autosaved');
		};
		
		for (var unit of units) {
			if (unit.inTransit) {
				unit.moveStep();
			} else if (unit.surveyComplete <= model.clock.time) {
				unit.surveyResult();
			} else if (unit.buildComplete <= model.clock.time) {
				unit.buildResult();
			};
			unit.eat();
		};
		
		for (var s in sites) {
			for (var g in sites[s].goodwill) {
				sites[s].reputation[g] += sites[s].goodwill[g]/20;
			};
			if (Object.keys(sites[s].adjustment).length > 0) {
				var tradingHere = sites[s].trading();
				var buyingHere = sites[s].buying();
				for (var b in buyingHere) {
					tradingHere[b] = buyingHere[b];
				};
				for (var a in sites[s].adjustment) {
					var magnitude = 0.995;
					for (var i in sites[s].infrastructure) {
						if (sites[s].infrastructure[i].outputs !== undefined && sites[s].infrastructure[i].outputs.indexOf(a) !== -1) {
							magnitude = 0.997;
						};
					};
					if (sites[s].adjustment[a] > 0.09) {
						sites[s].adjustment[a] -= 0.1;
						sites[s].commodities[a] /= magnitude;
					} else if (sites[s].adjustment[a] < -0.09) {
						sites[s].adjustment[a] += 0.1;
						sites[s].commodities[a] *= magnitude;
					} else if (sites[s].adjustment[a] == 'return to set point') {
						if (sites[s].commodities[a] > sites[s].commoditiesSetPoints[a] + 0.01) {
							sites[s].commodities[a] *= 0.9987;
						} else if (sites[s].commodities[a] < sites[s].commoditiesSetPoints[a] - 0.01) {
							sites[s].commodities[a] /= 0.9987;
						} else {
							sites[s].commodities[a] = sites[s].commoditiesSetPoints[a];
							delete sites[s].adjustment[a];
						};
					} else if (tradingHere[a] !== undefined) { // common, produced, and consumed goods return to set point
						sites[s].adjustment[a] = 'return to set point';
					} else { // exotic goods (pulled from or added to stockpiles) remain changed
						delete sites[s].adjustment[a];
					};
				};
			};
			if (sites[s].trash.length > 0 && Math.random() < 0.05) {
				sites[s].trash.splice(sites[s].trash.length * Math.random() >> 0,1);
			};
			if (sites[s].infrastructure.length == 0 && sites[s].trash.length == 0 && sites[s].threat == undefined) {
				if (sites[s].population > 0) {
					if (Math.random() < 0.05) {
						sites[s].population -= Math.random() * Math.random() * 50 << 0;
					};
				} else {
					var unitsAtSite = [];
					for (var i in units) {
						if (units[i].location == sites[s]) {
							unitsAtSite.push(units[i]);
						};
					};
					if (unitsAtSite.length == 0) {
						console.log(sites[s]);
						for (var i in sites) {
							var neighborIndex = sites[i].neighbors.indexOf(sites[s]);
							if (neighborIndex !== -1) {
								sites[i].neighbors.splice(neighborIndex,1);
							};
						}
						if (players.p1.knownSites.indexOf(sites[s]) !== -1 && sites[s].resources.length > 0) {
							gamen.displayPassage(new Passage('The town of '+sites[s].name+', abandoned and empty, is claimed by the wasteland.'));
						};
						players.p1.knownSites.splice(players.p1.knownSites.indexOf(sites[s]),1);
						sites.splice(sites.indexOf(sites[s]),1);
					};
				};
			};
		};
		
		if (model.victoryProgress() > .99) {
			model.clock.running = false;
			gamen.displayPassage(new Passage("Holy shit, you won the game!"));
		};
		
		view.displayUnit(view.focus.unit,false);
		view.displayMap();
		view.markSelectedUnit();
	},
	
	buildUnit: function(index,unitType) {
		unitType = data.units[unitType];
		var unitsHere = [];
		for (var i in units) {
			if (units[i].location == view.focus.unit.location) {
				unitsHere.push(units[i]);
			};
		};
		
		var buildCost = [];
		for (var i in unitType.buildCost) {
			for (q=0;q<unitType.buildCost[i];q++) {
				buildCost.push(i);
			};
		};
		for (var i in buildCost) {
			var unpaid = true;
			for (var u in unitsHere) {
				for (var c in unitsHere[u].commodities) {
					if (unitsHere[u].commodities[c].commodity == buildCost[i] && unitsHere[u].commodities[c].qty == 100 && unpaid) {
						unitsHere[u].commodities.splice(c,1);
						unpaid = false;
					};
				};
			};
			for (var w in view.focus.unit.location.warehouse.p1) {
				if (unpaid && view.focus.unit.location.warehouse.p1[w].commodity == buildCost[i] && view.focus.unit.location.warehouse.p1[w].qty == 100) {
					view.focus.unit.location.warehouse.p1.splice(w,1);
					unpaid = false;
				};
			};
			if (unpaid) {
				view.focus.unit.location.reputation.p1 -= 100 * view.focus.unit.location.commodities[buildCost[i]];
			};
		};
		
		// spawning the unit
		var newUnit = new Unit(players.p1,view.focus.unit.location,unitType);
		view.focus.unit = newUnit;
		view.displayUnit(newUnit);
	},
	
	upgrade: function(stat,cost) {
		var passageString, prettyStat;
		players.p1[stat]++;
		if (stat == 'vision') {
			for (u in units) {
				units[u].look();
			};
			passageString = 'The elder gifts you with a set of precision lenses, along with the goggles, rangefinders, and stands you will need to use with them.  You should be able to see a lot farther across the wasteland with all this!';
			prettyStat = "Vision";
		} else if (stat == 'selfDefense') {
			passageString = "You sit down and watch a night's worth of fights ranging from the tactical to the elegant to the brutal.  There's a few moves you're sure you can teach the rest of the drivers.";
			prettyStat = "Self Defense";
		} else if (stat == 'foraging') {
			passageString = "The naturalist spends the better part of a day scattering their own notes as they share with you bits and pieces of their understanding of the wasteland's ecosystem.";
			prettyStat = "Foraging";
			if (players.p1.foraging > 9) {
				passageString += "<p>Confident in their abilities, your drivers will no longer insist on stocking up on Food and Water before leaving town.";
			};
		};
		view.focus.unit.location.reputation.p1 -= cost;
		passageString += '<p />Your '+prettyStat+' has been raised to '+players.p1[stat]+' ('+data[stat][Math.min(players.p1[stat],data[stat].length)-1]+').';
		gamen.displayPassage(new Passage(passageString));
	},
	
	victoryProgress: function() {
		var count = 0;
		var num = 0;
		var populatedSites = 0;
		for (s in sites) {
			if (sites[s].population > 0) {
				var needs = sites[s].needs();
				for (var n in needs) {
					count += needs[n].completion;
				};
				num = needs.length;
				populatedSites++;
			};
		};
		return count / (populatedSites * num);
	},
	
	payRecruitCost: function(unitKey,commodityKey) {
		if (players.p1.recruitProgress[unitKey] == undefined) {
			players.p1.recruitProgress[unitKey] = {};
		};
		if (players.p1.recruitProgress[unitKey][commodityKey] !== undefined) {
			players.p1.recruitProgress[unitKey][commodityKey]++;
		} else {
			players.p1.recruitProgress[unitKey][commodityKey] = 1;
		};
		var outstanding = true;
		for (var c in view.focus.unit.commodities) {
			if (outstanding && view.focus.unit.commodities[c].commodity == commodityKey && view.focus.unit.commodities[c].qty == 100) {
				outstanding = false;
				view.focus.unit.commodities.splice(c,1);
			};
		};		
	},
	
	recruit: function(infrastructure) {
		var newUnit = new Unit(players.p1,view.focus.unit.location,data.units[infrastructure.recruit]);
		newUnit.name = infrastructure.unitName;
		players.p1.unitsUnlocked[infrastructure.recruit] = true;
		var location = view.focus.unit.location;
		location.infrastructure.splice(location.infrastructure.indexOf(infrastructure),1);
		view.focus.unit = newUnit;
		view.displayUnit(newUnit);
		view.displayMap();
	},
	
	flatGame: function() {
		var flatGame = {};
		flatGame.saveDate = new Date();
		flatGame.clock = model.clock;
		flatGame.eventQueue = [];
		for (var e in model.clock.events) {
			flatGame.eventQueue.push({time:e,events:model.clock.events[e]});
		};
		
		flatGame.globalEventStack = model.globalEventStack;
		flatGame.globalSequesteredEvents = model.globalSequesteredEvents;
		flatGame.landmarks = landmarks;
		flatGame.rivers = rivers;
		
		var nextPlayer;
		flatGame.players = {};
		for (var player in players) {
			nextPlayer = {};
			nextPlayer.startScore = players[player].startScore;
			nextPlayer.unitsUnlocked = players[player].unitsUnlocked;
			nextPlayer.foraging = players[player].foraging;
			nextPlayer.selfDefense = players[player].selfDefense;
			nextPlayer.vision = players[player].vision;
			nextPlayer.hometown = sites.indexOf(players[player].hometown);
			nextPlayer.eventStack = players[player].eventStack;
			nextPlayer.knownSiteIndices = [];
			for (var i of players[player].knownSites) {
				for (var s in sites) {
					if (sites[s] == i) {
						nextPlayer.knownSiteIndices.push(s)
					};
				};
			};
			nextPlayer.knownLandmarkIndices = [];
			for (var i of players[player].knownLandmarks) {
				for (var s in landmarks) {
					if (landmarks[s] == i) {
						nextPlayer.knownLandmarkIndices.push(s)
					};
				};
			};
			nextPlayer.knownRiverIndices = [];
			for (var i of players[player].knownRivers) {
				for (var s in rivers) {
					if (rivers[s] == i) {
						nextPlayer.knownRiverIndices.push(s)
					};
				};
			};
			nextPlayer.eventLog = players[player].eventLog;
			nextPlayer.recruitProgress = players[player].recruitProgress;
			flatGame.players[player] = nextPlayer;
		};
		
		flatGame.sites = [];
		for (var site in sites) {
			flatGame.sites.push(sites[site].flat());
		};
		
		flatGame.units = [];
		for (var unit in units) {
			flatGame.units.push(units[unit].flat());
		};
		
		return flatGame;
	},
	
	unflattenGame: function(saveGame) {
	
		model.oldSaveName = saveGame.saveName;

		model.clock = new Clock();
		model.clock.time = new Date(saveGame.clock.time);
		model.clock.timeStep = saveGame.clock.timeStep;
		for (var e in saveGame.eventQueue) {
			for (var f of saveGame.eventQueue[e].events) {
				model.clock.logEventWhen(new Date(parseInt(saveGame.eventQueue[e].time)),f);
			};
		};
		gamen.clocks = [model.clock];
		
		model.globalEventStack = saveGame.globalEventStack;
		model.globalSequesteredEvents = saveGame.globalSequesteredEvents;

		landmarks = saveGame.landmarks;
		rivers = saveGame.rivers;
		
		sites = [];
		for (var s in saveGame.sites) {
			var newSite = new Site();
		};
		var simples = ['name','adjustment','arrivalEventsList','carpet','commodities','commoditiesSetPoints','goodwill','hasVisited','hasSurveyed','population','reputation','surveys','threat','trash','wages','warehouse','x','y'];
		for (var s in saveGame.sites) {
			for (var d of simples) {
				sites[s][d] = saveGame.sites[s][d];
			};
			if (sites[s].warehouse == undefined) {sites[s].warehouse = {p1:[]}};
			sites[s].neighbors = [];
			for (var n of saveGame.sites[s].neighborIndices) {
				sites[s].neighbors.push(sites[n]);
			};
			delete sites[s].neighborIndices;
			
			sites[s].resources = [];
			for (var r of saveGame.sites[s].resourceKeys) {
				sites[s].resources.push(data.resources[r]);
			};
			
			sites[s].infrastructure = [];
			for (var i of saveGame.sites[s].infrastructureKeys) {
				sites[s].infrastructure.push(data.infrastructure[i]);
			};
			
			sites[s].nearestThreat = sites[saveGame.sites[s].nearestThreatIndex];
		};
		
		players = saveGame.players;
		for (var p in players) {
			players[p].knownSites = [];
			for (s of players[p].knownSiteIndices) {
				players[p].knownSites.push(sites[s]);
			};
			delete players[p].knownSiteIndices ;
			players[p].knownLandmarks = [];
			for (l of players[p].knownLandmarkIndices) {
				players[p].knownLandmarks.push(landmarks[l]);
			};
			delete players[p].knownLandmarkIndices ;
			players[p].knownRivers = [];
			for (l of players[p].knownRiverIndices) {
				players[p].knownRivers.push(rivers[l]);
			};
			delete players[p].knownRiverIndices ;
			players[p].hometown = sites[players[p].hometown];
		};
		
		units = [];
		var simples = ['name','commodities','departed','inTransit','route','isSurveying','surveyComplete','surveyPotentials','isBuilding','buildComplete','buildProject'];
		for (var u of saveGame.units) {
			var newUnit = new Unit(players[u.ownerKey],sites[u.locationIndex],data.units[u.typeKey]);
			for (var s of simples) {
				newUnit[s] = u[s];
			};
			if (u.caravan !== undefined) {
				newUnit.caravan = [];
				for (var p of u.caravan) {
					newUnit.caravan.push(units[p]);
				};
			};
			if (u.route !== undefined) {
				for (var r in u.route) {
					u.route[r].to = sites[u.route[r].toIndex];
					u.route[r].from = sites[u.route[r].fromIndex];
					delete u.route[r].toIndex;
					delete u.route[r].fromIndex;
				};
				u.route.splice(u.route.length-1,1,sites[u.route[u.route.length-1]]);
			} else {
				u.location = undefined;
			};
			if (u.buildComplete !== undefined) {
				newUnit.buildComplete = new Date(u.buildComplete);
			};
			if (u.surveyComplete !== undefined) {
				newUnit.surveyComplete = new Date(u.surveyComplete);
			};
		};
		view.focus.unit = units[0];
		
	},

};

function Site(mapSize) {
	// Name
	var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
	var vowels = ['a','e','i','o','u','a','e','i','o','u','a','e','i','o','u','a','e','i','o','u','a','e','i','o','u','ae','ai','au','ea','ee','ei','eu','ia','ie','io','iu','oa','oe','oi','oo','ou','ua','ue','ui','uo'];
	var syllables = 2 + Math.random() * Math.random() * Math.random() * 4 << 0;
	if (syllables == 5) { syllables = 1 }
	var string = '';
	for (var s=0;s<syllables;s++) {
		if (Math.random() > 0.2) {
			string += consonants[Math.random() * consonants.length << 0];
		};
		string += vowels[Math.random() * vowels.length << 0];
		if (Math.random() > 0.5) {
			string += consonants[Math.random() * consonants.length << 0];
		};
	};
	this.name = string.charAt(0).toUpperCase() + string.slice(1);

	if (mapSize == undefined) {mapSize = 1000};
	var trimmed = mapSize - 50;
	var min = (1000 - trimmed ) / 2;
	this.x = min + Math.random() * trimmed << 0;
	this.y = min + Math.random() * trimmed << 0;
	
	this.carpet = [{tilt:Math.random(),squish:Math.random()},{tilt:Math.random(),squish:Math.random()},{tilt:Math.random(),squish:Math.random()}];
	
	this.hasVisited = {};
	
	this.population = 4 + Math.random() * Math.random() * 496 << 0;
	this.wages = (Math.random() + 0.5) * (data.commodities.food.baseValue + data.commodities.water.baseValue);
	
	this.commodities = {};
	this.commoditiesSetPoints = {};
	for (var c in data.commodities) {
		this.commodities[c] = data.commodities[c].baseValue;
		var randomFactor = 0;
		for (var r=0;r<data.commodities[c].stability;r++) {
			randomFactor += Math.random();
		};
		randomFactor = 2 * randomFactor / data.commodities[c].stability;
		this.commodities[c] *= randomFactor / 100;
		this.commoditiesSetPoints[c] = this.commodities[c];
	};
	this.adjustment = {};
	
	this.reputation = {p1:0};
	this.goodwill = {p1:0};
	
	this.warehouse = {p1:[]}
	this.trash = [];
	
	this.resources = [];
	this.hasSurveyed = {};
	this.hasSurveyed.p1 = [];
	this.surveys = {p1:[]};
	if (this.commodities.water < 0.1) {
		this.resources.push(data.resources.river);
	};
	var resourcesNum = 1 + Math.random() * Math.random() * 5 << 0;
	for (var r=0;r<resourcesNum;r++) {
		var resources = Object.keys(data.resources);
		var newResource = data.resources[resources[Math.random() * resources.length << 0]];
		if (this.resources.indexOf(newResource) == -1) {
			this.resources.push(newResource)
			this.hasSurveyed.p1.push(false);
		};
	};
	
	this.infrastructure = [];
	
	// Basic Agriculture
	if ((this.commodities.food < 0.1 || this.commodities.fiber < 0.15) && (this.resources.indexOf(data.resources.river) !== -1 || this.resources.indexOf(data.resources.spring) !== -1)) {
		this.infrastructure.push(data.infrastructure.fields);
	};
	if (this.commodities.food < 0.07 && this.resources.indexOf(data.resources.river) !== -1 && this.infrastructure.indexOf(data.infrastructure.fields) == -1) {
		this.infrastructure.push(data.infrastructure.seine);
	};
	if (this.commodities.food < 0.2 && this.resources.indexOf(data.resources.pasture) !== -1) {
		this.infrastructure.push(data.infrastructure.corral);
	};
	if (this.commodities.food < 0.1 && this.resources.indexOf(data.resources.forest) !== -1) {
		this.infrastructure.push(data.infrastructure.orchards);
	};

	// Basic Industry
	var industry = undefined;
	if (this.commodities.stone < 0.3 && this.resources.indexOf(data.resources.outcropping) == -1 && Math.random() < 0.1) {
		industry = data.infrastructure.quarry;
	};
	if (this.commodities.ore < 0.3 && this.resources.indexOf(data.resources.mineralVein) == -1 && Math.random() < 0.1 && industry == undefined) {
		industry = data.infrastructure.openPitMine;
	};
	if (this.commodities.lumber < 0.3 && this.resources.indexOf(data.resources.forest) == -1 && Math.random() < 0.1 && industry == undefined) {
		industry = data.infrastructure.lumbermill;
	};
	if (this.commodities.crudeOil < 0.6 && this.resources.indexOf(data.resources.oilReservoir) == -1 && Math.random() < 0.05 && industry == undefined) {
		industry = data.infrastructure.oilWell;
	};
	if (this.commodities.furniture < 0.5 && industry == undefined) {
		industry = data.infrastructure.carpenter;
	};
	if (this.commodities.cloth < 0.5 && industry == undefined) {
		industry = data.infrastructure.loom;
	};
	if (this.commodities.leather < 0.4 && industry == undefined) {
		industry = data.infrastructure.tannery;
	};
	if (this.commodities.clothing < 0.4 && industry == undefined) {
		industry = data.infrastructure.seamstress;
	};
	if (this.commodities.tack < 0.6 && industry == undefined) {
		industry = data.infrastructure.saddler;
	};
	if (this.commodities.metals < 0.8 && industry == undefined) {
		industry = data.infrastructure.foundry;
	};
	if (this.commodities.fuel < 0.8 && industry == undefined) {
		industry = data.infrastructure.refinery;
	};
	if (industry == undefined && Math.random() < 0.2) {
		industry = data.infrastructure.cartwright;
	}
	if (industry !== undefined ) {
		this.infrastructure.push(industry);
	};

	// Basic Housing and Defense
	if (this.commodities.stone < 0.5) {
		this.infrastructure.push(data.infrastructure.bunker);
	};
	if (this.commodities.stone < 0.3) {
		this.infrastructure.push(data.infrastructure.stoneWall);
	};
	if (this.commodities.stone < 0.2) {
		this.infrastructure.push(data.infrastructure.fortress);
	};
	if (this.commodities.lumber < 0.3 && this.commodities.stone >= 0.3) {
		this.infrastructure.push(data.infrastructure.woodenPalisade);
	};
	if (this.commodities.lumber + this.commodities.stone < 0.2) {
		this.infrastructure.push(data.infrastructure.tenements);
	} else if (this.commodities.lumber + this.commodities.stone < 0.4) {
		this.infrastructure.push(data.infrastructure.barracks);
	} else if (this.commodities.lumber + this.commodities.stone < 0.6) {
		this.infrastructure.push(data.infrastructure.manorHouse);
	};
	if (this.commodities.stone >= 0.5 && this.commodities.lumber >= 0.1) {
		this.infrastructure.push(data.infrastructure.hovels);
	};
	
	this.flat = function() {
		var flat = {};
		
		var simples = ['name','adjustment','arrivalEventsList','carpet','commodities','commoditiesSetPoints','goodwill','hasVisited','hasSurveyed','population','reputation','surveys','threat','trash','wages','warehouse','x','y'];
		for (var i of simples) {
			flat[i] = this[i];
		};
		
		flat.neighborIndices = [];
		for (i of this.neighbors) {
			flat.neighborIndices.push(sites.indexOf(i));
		};
		flat.infrastructureKeys = [];
		for (i of this.infrastructure) {
			for (d in data.infrastructure) {
				if (i == data.infrastructure[d]) {
					flat.infrastructureKeys.push(d);
				};
			};
		};
		flat.resourceKeys = [];
		for (i of this.resources) {
			for (d in data.resources) {
				if (i == data.resources[d]) {
					flat.resourceKeys.push(d);
				};
			};
		};
		
		flat.nearestThreatIndex = sites.indexOf(this.nearestThreat);

		return flat;
	};
	
	this.upgradeName = function() {
		if (this.nameSeed !== undefined || Math.random() < 0.5) {
			var upgradeName = this.nameSeed;
			if (this.nameSeed == undefined) {
				upgradeName = this.name.slice(0,3 + Math.random() * 3 <<0);
				// Denomative Suffices
				if (Math.random() < 0.2) {
					var suffices = ['son','sdot','skid'];
					upgradeName += suffices[Math.random() * suffices.length << 0];
				};
				if (Math.random() < 0.3 && upgradeName.substr(-1) !== 's') {
					upgradeName += "'s";
				};
			};
			
			// Compounding
			var suffices = ['ton','ville','burg','borg',' Village',' Town',' Outpost',' Station',' Hollow','s End',' Place'];
			for (var i in this.resources) {
				if (this.resources[i].suffices !== undefined) {
					suffices = suffices.concat(this.resources[i].suffices);
				};
			};
			for (var i in this.infrastructure) {
				if (this.infrastructure[i].suffices !== undefined) {
					suffices = suffices.concat(this.infrastructure[i].suffices);
				};
			};
			upgradeName += suffices[Math.random() * suffices.length << 0];
			if (upgradeName.indexOf(' ') == -1) {
				upgradeName = upgradeName.replace("'","");
			};
			
			var uniqueName = true;
			for (var i in sites) {
				if (sites[i].name == upgradeName) {
					uniqueName = false;
				};
			};
			if (uniqueName) {
				this.name = upgradeName;
			};
		};
	};
	
	this.ghost = function() {
		this.population = 0;
		var production = ['water'];
		for (var i in this.infrastructure) {
			if (this.infrastructure[i].outputs !== undefined) {
				production = production.concat(this.infrastructure[i].outputs);
			};
		};
		var abandoned = Math.random() * 5 << 0;
		for (var a=0;a<abandoned;a++) {
			this.trash.push({commodity:production[Math.random() * production.length << 0],qty:100});
		};
	};
		
	this.needs = function() {
		var housing = 0;
		var defense = 0;
		var jobs = 0;
		var i;
		for (var i in this.infrastructure) {
			if (this.infrastructure[i].housing > 0) {
				housing += this.infrastructure[i].housing;
			};
			if (this.infrastructure[i].defense > 0) {
				defense += this.infrastructure[i].defense;
			};
			if (this.infrastructure[i].jobs > 0) {
				jobs += this.infrastructure[i].jobs;
			};
		};

		var array = [];
		var hunger = Math.min(1,(jobs * this.wages) / (this.population * 100 * (this.commodities.food + this.commodities.water)) );
		if (isNaN(hunger)) {hunger = 0};
		var hungerLabels = [
			'half-starved',
			'hungry',
			'sated',
			'well-fed'
		];
		var prettyWage = Math.round(this.wages,0);
		var prettyGDP = Math.round(this.wages*jobs,0);
		var foodAndWaterIcon = view.commodityIcon('food') + "+" + view.commodityIcon('water');
		var prettyFoodCost = Math.round(100 * this.commodities.food,0);
		var prettyWaterCost = Math.round(100 * this.commodities.water,0);
		var provisionsCost = Math.round(100 * this.population * (this.commodities.food + this.commodities.water),0);
		var hungerDesc = '<strong>Hunger</strong><br />'+prettyGDP+' income / ' + provisionsCost + ' ' + foodAndWaterIcon + 'costs<br />(income = '+jobs+' jobs @ '+prettyWage+' wage)<br />('+foodAndWaterIcon+' = ('+prettyFoodCost+' + '+prettyWaterCost+') x '+this.population+' pop)';
		array.push({label:hungerLabels[hungerLabels.length * hunger * 0.99 << 0],completion:hunger,desc:hungerDesc});
		
		var housingRatio = Math.min(1,housing / this.population);
		if (isNaN(housingRatio)) {housingRatio = 0};
		var housingLabels = [
			'cold',
			'crowded',
			'comfy'
		];
		var housingDesc = '<strong>Housing</strong><br />'+housing+' beds for '+this.population+' souls ';
		array.push({label:housingLabels[housingLabels.length * housingRatio * 0.99 << 0],completion:housingRatio,desc:housingDesc});
		if (this.nearestThreat == undefined) {this.nearestThreat = model.nearestThreat(this.x,this.y);};
		var safety = Math.min(1,defense / this.nearestThreat.threat.strength);
		if (isNaN(safety)) {safety = 0;};
		var safetyLabels = [
			'scared',
			'cowering',
			'vigilant',
			'bold'
		];
		var safetyDesc = '<strong>Safety</strong><br />'+defense+' defense against '+this.nearestThreat.threat.strength+' danger';
		safetyDesc += '<br />('+this.nearestThreat.threat.name+' territory)';
		array.push({label:safetyLabels[safetyLabels.length * safety * 0.99 << 0],completion:safety,desc:safetyDesc});
		
		if (this.population < 1) {array = [{label:'ghost town',completion:0,desc:'Ghost Town'}];};
		
		return array;
	};
	
	this.defenses = function() {
		var defense = 0;
		for (var i in this.infrastructure) {
			if (this.infrastructure[i].defense > 0) {
				defense += this.infrastructure[i].defense;
			};
		};
		return defense;
	};

	this.arrivalEvents = function() {
		if (!players.p1.eventLog.tutorialStarted && model.options.tutorials) {
			events.tutorial_001();
		} else if (!players.p1.eventLog.firstArrival && model.options.tutorials) {
			events.tutorial_firstArrival();
		};
		for (var i of this.infrastructure) {
			if (i.passage !== undefined) {
				gamen.displayPassage(new Passage(i.passage,undefined,undefined,this.name));
			};
		};
		if (!players.p1.eventLog.cartwright && model.options.tutorials && this.infrastructure.indexOf(data.infrastructure.cartwright) !== -1) {
			events.tutorial_cartwright();
		};
		if (this.arrivalEventsList !== undefined) {
			for (var i in this.arrivalEventsList) {
				events[this.arrivalEventsList[i]](this);
			};
		};
	};
	
	this.hometown = function() {
		if (!players.p1.eventLog.returnHome && model.options.tutorials) {
			events.tutorial_returnHome();
		};
	};	
	
	this.trading = function() {
		var commodities = {};
		if (this.population > 0) {
			var industrial = [];
			for (var b in this.infrastructure) {
				industrial = industrial.concat(this.infrastructure[b].outputs);
			};
			for (var d in this.commodities) {
				if (data.commodities[d].common) {
					commodities[d] = this.commodities[d];
				};
			};
			for (var d in this.commodities) {
				if (industrial.indexOf(d) !== -1) {
					commodities[d] = this.commodities[d];
				};
			};
		};
		return commodities;
	};
	
	this.buying = function() {
		var commodities = {};
		var industrial = [];
		if (this.population > 0) {
			for (var b in this.infrastructure) {
				industrial = industrial.concat(this.infrastructure[b].inputs);
			};
			for (var d in this.commodities) {
				if (industrial.indexOf(d) !== -1) {
					commodities[d] = this.commodities[d];
				};
			};
		};
		return commodities;
	};
	
	this.buyingPower = function(player) {
		if (player == undefined) {player = 'p1'};
		var buyingPower = this.reputation[player];
		var unitsAtSite = [];
		var trading = this.trading();
		for (var u in units) {
			if (units[u].location == this && units[u].owner == players[player]) {
				unitsAtSite.push(units[u]);
			};
		};
		for (var u in unitsAtSite) {
			for (c in unitsAtSite[u].commodities) {
				if (trading[unitsAtSite[u].commodities[c].commodity] !== undefined) {
					buyingPower += trading[unitsAtSite[u].commodities[c].commodity] * unitsAtSite[u].commodities[c].qty;
				};
			};
		};
		return buyingPower;
	};
	
	this.costInRep = function(buildCost) {
		var cost = 0;
		var requirements
		var trading = this.trading();
		for (var b in buildCost) {
			if (b == 'reputation') {
				cost += buildCost[b];
			} else if (trading[b] !== undefined) {
				cost += buildCost[b] * this.commodities[b] * 100;
			} else {
				cost += Infinity;
			};
		};
		return cost;
	};
	
	this.buildInfrastructure = function(infrastructure) {
		for (var c in infrastructure.inputs) {
			this.commoditiesSetPoints[infrastructure.inputs[c]] /= 0.8;
			if (this.adjustment[infrastructure.inputs[c]] == undefined) {
				this.adjustment[infrastructure.inputs[c]] = 'return to set point';
			};
		};
		for (var c in infrastructure.outputs) {
			this.commoditiesSetPoints[infrastructure.outputs[c]] *= 0.8;
			if (this.adjustment[infrastructure.outputs[c]] == undefined) {
				this.adjustment[infrastructure.outputs[c]] = 'return to set point';
			};
		};
		for (var i in infrastructure.replaces) {
			for (b in this.infrastructure) {
				if (this.infrastructure[b] == data.infrastructure[infrastructure.replaces[i]]) {
					this.infrastructure.splice(b,1);
				};
			};
		};
		for (var i of this.infrastructure) {
			if (infrastructure.outputs !== undefined) {
				for (var c of infrastructure.outputs) {
					if (i.inputs !== undefined && i.outputs !== undefined && i.inputs.indexOf(c) !== -1) {
						for (o of i.outputs) {
							this.commoditiesSetPoints[o] *= 0.9
							this.logTransaction(o,-0.5);
						};
					};
				};
			};
		};
		if (infrastructure.goodwill !== undefined) {
			this.goodwill.p1 += infrastructure.goodwill;
		};
		this.infrastructure.push(infrastructure);
	};
	
	this.destroyInfrastructure = function(infrastructure) {
		if (this.infrastructure.indexOf(infrastructure) !== -1) {
			for (var c in infrastructure.inputs) {
				this.commoditiesSetPoints[infrastructure.inputs[c]] *= 0.8;
				this.logTransaction(infrastructure.inputs[c],-1);
			};
			for (var c in infrastructure.outputs) {
				this.commoditiesSetPoints[infrastructure.outputs[c]] /= 0.8;
				this.logTransaction(infrastructure.outputs[c],1);
			};
			this.infrastructure.splice(this.infrastructure.indexOf(infrastructure),1);
		};
		if (infrastructure.warehousing) {
			this.warehouse = {p1:[]};
		};
	};
	
	this.useCommodities = function(useList) {
		var unitsAtSite = [view.focus.unit];
		for (var u in units) {
			if (units[u].location == view.focus.unit.location && units[u] !== view.focus.unit) {
				unitsAtSite.push(units[u]);
			};
		};
		var flatList = [];
		for (var c in useList) {
			for (q=0;q<useList[c];q++) {
				flatList.push(c);
			};
		};
		for (var c in flatList) {
			var outstanding = true;
			for (var u in unitsAtSite) {
				for (var i in unitsAtSite[u].commodities) {
					if (unitsAtSite[u].commodities[i].commodity == flatList[c] && unitsAtSite[u].commodities[i].qty == 100 && outstanding) {
						unitsAtSite[u].commodities.splice(i,1);
						outstanding = false;
					};
				};
			};
			for (var i in this.warehouse.p1) {
				if (this.warehouse.p1[i].commodity == flatList[c] && this.warehouse.p1[i].qty == 100 && outstanding) {
					this.warehouse.p1.splice(i,1);
					outstanding = false;
				};
			};
			if (outstanding) {
				view.focus.unit.location.reputation.p1 -= view.focus.unit.location.commodities[flatList[c]] * 100 ;
			};
		};
	};
	
	this.logTransaction = function(commodityKey,adjustment) {
		if (this.adjustment[commodityKey] !== undefined && this.adjustment[commodityKey] !== 'return to set point') {
			this.adjustment[commodityKey] += adjustment;
		} else {
			this.adjustment[commodityKey] = adjustment;
		};
		for (var i in this.infrastructure) {
			if (this.infrastructure[i].inputs !== undefined && this.infrastructure[i].outputs !== undefined && this.infrastructure[i].inputs.indexOf(commodityKey) !== -1) {
				for (o of this.infrastructure[i].outputs) {
					this.logTransaction(o,adjustment/2);
				};
			};
		};
	};
	
	this.desirability = function() {

		var localNeeds = this.needs();
		var desirability = 0;
		for (var n in localNeeds) {
			desirability += localNeeds[n].completion;
		};
		desirability /= localNeeds.length;
		
		desirability *= desirability * 0.5;

		desirability = Math.max(0,(500 - this.population) * desirability,0);

		if (this.population == 0) {
			desirability = 0;
			for (var n in this.infrastructure) {
				if (this.infrastructure[n].goodwill !== undefined) {
					desirability += this.infrastructure[n].goodwill;
				};
			};
			desirability *= 50;
		};
	
		return desirability;
	};
	
	this.pathTo = function(destinationSite) {
		var startKey = this.x + '_' + this.y;
		var routes = {};
		routes[startKey] = {site:this,route:[{x:this.x,y:this.y,site:this}],distance:0};
		for (var i=0;i<15;i++) {
			for (var s in routes) {
				if (routes[s].site.hasVisited.p1) {
					for (n in routes[s].site.neighbors) {
						var destination = routes[s].site.neighbors[n];
						var destinationKey = destination.x + '_' + destination.y;
						var newRoute = [];
						for (var r in routes[s].route) {
							newRoute.push(routes[s].route[r]);
						};
						newRoute.push({x:destination.x,y:destination.y,site:destination});
						var distance = routes[s].distance + Math.pow(Math.pow(destination.x - routes[s].site.x,2) + Math.pow(destination.y - routes[s].site.y,2),0.5);
						if (routes[destinationKey] == undefined || distance < routes[destinationKey].distance) {
							routes[destinationKey] = {site:destination,route:newRoute,distance:distance};
						};
					};
				};
			};
		};
		var destinationKey = destinationSite.x + '_' + destinationSite.y;
		return routes[destinationKey];
	};
	
	sites.push(this);
};

function Unit(owner,startLoc,type) {
	if (owner !== undefined) {
		this.owner = owner;
	} else {
		this.owner = players.p1;
	};
	if (startLoc !== undefined) {
		this.location = startLoc;
	} else if (units.length > 0) {
		this.location = units[0].location;
	} else {
		this.location = sites[Math.random() * sites.length << 0];
	};
	if (type == undefined) {
		type = data.units.donkeyCart;
	};
	
	this.inTransit = false;
	
	if (type.speed > 0) {
		this.offroad = false;
	} else {
		this.offroad = true;
	};
	
	this.name = 'Unnamed ' + type.name;
	var num = 0;
	for (var u in units) {
		if (units[u].name.substring(0,7) == 'Unnamed' && units[u].type == type) {
			num++;
		};
	};
	if (num > 0) {
		num++;
		this.name += ' #' + num;
	};
	
	this.type = type;
	
	this.commodities = [
		{commodity:'food',qty:100},
	];
	for (var f in type.fuel) {
		this.commodities.push({commodity:f,qty:100});
	};
	
	this.currentTrade = {
		unitStuff: [],
		siteStuff: [],
		balance: 0,
	};
	
	// Functions
	
	this.flat = function() {
		var flat = {};
		
		var simples = ['name','commodities','departed','inTransit','isSurveying','surveyComplete','surveyPotentials','isBuilding','buildComplete','buildProject'];
		for (var i of simples) {
			flat[i] = this[i];
		};
		if (this.route !== undefined) {
			flat.route = [];
			for (var i=0;i<this.route.length-1;i++) {
				var entry = {
					x: this.route[i].x,
					y: this.route[i].y,
					toIndex: sites.indexOf(this.route[i].to),
					fromIndex: sites.indexOf(this.route[i].from),
				};
				flat.route.push(entry);
			};
			flat.route.push(sites.indexOf(this.route[this.route.length-1]));
		};
		
		// owner, type, caravan, location
		flat.locationIndex = sites.indexOf(this.location);
		flat.caravanIndices = [];
		if (this.caravan !== undefined) {
			for (var i of this.caravan) {
				flat.caravanIndices.push(units.indexOf(i));
			};
		};
		for (i in players) {
			if (this.owner == players[i]) {
				flat.ownerKey = i;
			};
		};
		for (i in data.units) {
			if (this.type == data.units[i]) {
				flat.typeKey = i;
			};
		};

		return flat;
	};
	
	this.rename = function(newName) {
		this.name = newName;
		view.displayUnit(this);
	};
	
	this.createCaravan = function() {
		var unitsAtSite = [];
		for (var u in units) {
			if (units[u].location == this.location) {
				unitsAtSite.push(units[u]);
			};
		};
		for (var u in unitsAtSite) {
			unitsAtSite[u].caravan = unitsAtSite;
		};
	};
	
	this.leaveCaravan = function() {
		this.caravan.splice(this.caravan.indexOf(this),1);
		if (this.caravan.length == 1) {
			this.caravan[0].caravan = undefined;
		};
		this.caravan = undefined;
	};
	
	this.toggleRoad = function() {
		if (this.offroad) {
			this.offroad = false;
		} else {
			this.offroad = true;
		};
		view.displayUnit(this);
	};
	
	this.move = function(site) {
		if (this.caravan == undefined) {
			var displayName = this.name;
			var caravan = [this];
			var roadSpeed = this.type.speed;
			var offroadSpeed = this.type.offroadSpeed;
		} else {
			var displayName = this.name + "'s caravan";
			var caravan = this.caravan;
			var roadSpeed = Infinity;
			var offroadSpeed = Infinity;
			for (var u in this.caravan) {
				roadSpeed = Math.min(roadSpeed,this.caravan[u].type.speed);
				offroadSpeed = Math.min(offroadSpeed,this.caravan[u].type.offroadSpeed);
			};
		};
		if (this.offroad) {
			var speed=offroadSpeed;
			var distance = Math.pow(Math.pow(this.location.x - site.x,2) + Math.pow(this.location.y - site.y,2),.5);
			var route = [{x:this.location.x,y:this.location.y},{x:site.x,y:site.y}];
		} else {
			var speed=roadSpeed;
			var route = this.location.pathTo(site);
			if (route == undefined) {
				var distance = 1;
				var route = undefined;
			} else {
				var distance = route.distance;
				var route = route.route;
			};
		};
		var steps = distance / speed;
		var cargoCapacity = 0;
		var cargo = 0;
		var foodStore = 0;
		var waterStore = 0;
		var fuelStore = 0;
		var foodEaten = 0;
		var waterDrank = 0;
		var fuelBurned = 0;
		var isBuilding = false;
		var isSurveying = false;
		for (var u in caravan) {
			cargoCapacity += caravan[u].type.cargo;
			foodEaten += distance / speed * caravan[u].type.crew;
			if (caravan[u].type.fuel.water !== undefined) {waterDrank += distance / speed * caravan[u].type.fuel.water};
			if (caravan[u].type.fuel.fuel !== undefined) {fuelBurned += distance / speed * caravan[u].type.fuel.fuel};
			for (var i in caravan[u].commodities) {
				if (caravan[u].commodities[i].commodity == 'food') {
					foodStore += caravan[u].commodities[i].qty;
				} else if (caravan[u].commodities[i].commodity == 'water') {
					waterStore += caravan[u].commodities[i].qty;
				} else if (caravan[u].commodities[i].commodity == 'fuel') {
					fuelStore += caravan[u].commodities[i].qty;
				};
				if (data.commodities[caravan[u].commodities[i].commodity].cargo) {
					cargo++;
				};
			};
			if (caravan[u].isBuilding) {isBuilding = true};
			if (caravan[u].isSurveying) {isSurveying = true};
		};
		if (this.location.name == "Roadside" || this.location.name == "Nowhere" || this.owner.foraging > 9) {
			waterStore = Infinity;
			foodStore = Infinity;
		};
				
		if (route !== undefined && waterStore >= waterDrank && foodStore >= foodEaten && fuelStore >= fuelBurned && cargo <= cargoCapacity && !isBuilding && !isSurveying) {
			this.inTransit = true;
			this.departed = false;
			this.departedFrom = this.location;
			var diffX = undefined;
			var diffY = undefined;
			var waypointsToGo = route;
			this.route = [];
			var stepsThisLeg = 1;
			var stepsInLeg = 0;
			for (s=0;s<steps;s++) {
				if (stepsThisLeg > stepsInLeg) {
					var lastWaypoint = waypointsToGo.shift();
					var nextWaypoint = waypointsToGo[0];
					stepsThisLeg = 0;
					stepsInLeg = Math.pow(Math.pow(nextWaypoint.x - lastWaypoint.x,2) + Math.pow(nextWaypoint.y - lastWaypoint.y,2),0.5) / speed;
					var stepX = (nextWaypoint.x - lastWaypoint.x)/stepsInLeg;
					var stepY = (nextWaypoint.y - lastWaypoint.y)/stepsInLeg;
				};
				this.route.push({x:lastWaypoint.x + stepsThisLeg*stepX,y:lastWaypoint.y + stepsThisLeg*stepY,from:lastWaypoint.site,to:nextWaypoint.site});
				stepsThisLeg++;
			};
			this.route[0].y += 10; // So unit doesn't overlap site
			this.route.push(site);
			if (this.caravan !== undefined) {
				for (var i in this.caravan) {
					if (this.caravan[i] !== this) {
						this.caravan[i].route = [];
						for (var s in this.route) {
							this.caravan[i].route.push(this.route[s]);
						};
						this.caravan[i].inTransit = true;
					};
				};
			};
			model.checkClock();
		} else if (route == undefined) {
			gamen.displayPassage(new Passage('No path from ' + this.name + ' to ' + site.name + ". You'll have to go offroad."));
		} else if (foodStore < foodEaten) {
			gamen.displayPassage(new Passage(displayName + " needs "+Math.ceil(foodEaten)+"% load of food for the " + Math.round(steps,0) + "-day trip to " + site.name + "!"));
		} else if (waterStore < waterDrank) {
			gamen.displayPassage(new Passage(displayName + " needs "+Math.ceil(waterDrank)+"% load of water for the " + Math.round(steps,0) + "-day trip to " + site.name + "!"));
		} else if (fuelStore < fuelBurned) {
			gamen.displayPassage(new Passage(displayName + " needs "+Math.ceil(fuelBurned)+"% load of fuel for the " + Math.round(steps,0) + "-day trip to " + site.name + "!"));
		} else if (cargo > cargoCapacity) {
			gamen.displayPassage(new Passage(displayName + ' is overburdened and cannot travel.'));
		} else if (isBuilding) {
			gamen.displayPassage(new Passage(displayName + ' is busy building.'));
		} else if (isSurveying) {
			gamen.displayPassage(new Passage(displayName + ' is busy surveying.'));
		} else {
			console.log(this.location.neighbors.indexOf(site),this.offroad,waterStore,waterDrank,foodStore,foodEaten,cargo,this.type.cargo);
		};
		view.displayUnit(this);
	};
	
	this.moveStep = function() {
		var load = 0;
		var foodStore = 0;
		var waterStore = 0;
		var fuelStore = 0;
		var caravan = [];
		for (var i in this.commodities) {
			if (data.commodities[this.commodities[i].commodity].cargo) {
				load++;
			};
		};
		if (this.caravan == undefined) {
			caravan = [this];
		} else {
			caravan = this.caravan;
		};
		for (var c in caravan) {
			for (var i in caravan[c].commodities) {
				if (caravan[c].commodities[i].commodity == 'food') {
					foodStore += caravan[c].commodities[i].qty;
				} else if (caravan[c].commodities[i].commodity == 'water') {
					waterStore += caravan[c].commodities[i].qty;
				} else if (caravan[c].commodities[i].commodity == 'fuel') {
					fuelStore += caravan[c].commodities[i].qty;
				};
			};
		};
		if (load > this.type.cargo) {
			gamen.displayPassage(new Passage(this.name + ' is overburdened and cannot travel.'));
			model.clock.stop();
			view.focus.unit = this;
			view.displayUnit(this);
		} else if (foodStore == 0) {
			if (this.caravan !== undefined) {this.leaveCaravan()};
			gamen.displayPassage(new Passage(this.name + " loses a day foraging for food in the wasteland."));
			this.commodities.push({commodity:'food',qty:Math.min(100,Math.floor(Math.random()*10*this.owner.foraging))});
		} else if (waterStore == 0 && this.type.fuel.water !== undefined) {
			if (this.caravan !== undefined) {this.leaveCaravan()};
			gamen.displayPassage(new Passage(this.name + " loses a day foraging for water in the wasteland."));
			this.commodities.push({commodity:'water',qty:Math.min(100,Math.floor(Math.random()*10*this.owner.foraging))});
		} else if (fuelStore == 0 && this.type.fuel.fuel !== undefined && this.route.length > 1) {
			if (this.caravan !== undefined) {this.leaveCaravan()};
			gamen.displayPassage(new Passage(this.name + " has run out of fuel."));
			var roadside = this.roadside();
			if (this.caravan !== undefined) {
				for (var c in this.caravan) {
					this.caravan[c].inTransit = false;
					this.caravan[c].departed = false;
					this.caravan[c].route = undefined;
					this.caravan[c].location = roadside;
				};
			};
		} else {
			var currentStep = this.route.shift();
			this.departed = true;
			this.location = undefined;
			var load = 0;
			this.clearTrade();
			for (var c in this.commodities) {
				if (data.commodities[this.commodities[c].commodity].cargo) {
					load++;
				};
			};
			if (currentStep.name == undefined) {
				this.look();
			} else {
				// arrived
				this.location = currentStep;
				this.route = [];
				this.inTransit = false;
				this.departed = false;
				if (!this.type.airborne && this.location.neighbors.length > 0) {this.offroad = false;};
				this.look();
				model.clock.running = false;
				document.getElementById('clockPauseBtn').innerHTML = '<span class="fa fa-play"></span>';
				view.focus.unit = this;
				view.displayUnit(this,true);
			};
			view.displayMap();
		};
	};
	
	this.roadside = function() {
		console.log(this);
		var roadside = new Site();
		players.p1.knownSites.push(roadside);
		roadside.hasVisited.p1 = true;
		roadside.population = 0;
		roadside.infrastructure = [];
		roadside.resources = [];
		roadside.x = this.route[0].x;
		roadside.y = this.route[0].y;
		if (this.offroad) {
			roadside.name = 'Nowhere';
			roadside.neighbors = [];
		} else {
			roadside.name = 'Roadside';
			roadside.neighbors = [this.route[0].to,this.route[0].from];
			this.route[0].to.neighbors.push(roadside);
			this.route[0].from.neighbors.push(roadside);
		};
		roadside.nearestThreat = model.nearestThreat(roadside.x,roadside.y);
		this.location = roadside;
		this.route = undefined;
		this.inTransit = false;
		if (this.caravan !== undefined) {
			for (var c in this.caravan) {
				this.caravan[c].inTransit = false;
				this.caravan[c].departed = false;
				this.caravan[c].route = undefined;
				this.caravan[c].location = roadside;
			};
		};

		model.clock.running = false;
		view.displayMap();
		
		return roadside;
	};
	
	this.eat = function() {
		var foodEaten = this.type.crew;
		var waterDrank = 0;
		if (this.type.fuel.water !== undefined && this.inTransit) {waterDrank += this.type.fuel.water};
		var fuelBurned = 0;
		if (this.type.fuel.fuel !== undefined && this.inTransit) {fuelBurned += this.type.fuel.fuel};
		var caravanCommodities = [];
		if (this.caravan !== undefined) {
			for (var i in this.caravan) {
				caravanCommodities = caravanCommodities.concat(this.caravan[i].commodities);
			};
		} else {
			caravanCommodities = this.commodities;
		};
		for (var i in caravanCommodities) {
			if (caravanCommodities[i].commodity == 'food') {
				var temp = caravanCommodities[i].qty;
				caravanCommodities[i].qty = Math.round(Math.max(caravanCommodities[i].qty - foodEaten,0),0);
				foodEaten = Math.max(foodEaten - temp,0);
				if (caravanCommodities[i].qty == 0) {
					caravanCommodities.splice(i,1);
				};
			} else if (caravanCommodities[i].commodity == 'water') {
				var temp = caravanCommodities[i].qty;
				caravanCommodities[i].qty = Math.round(Math.max(caravanCommodities[i].qty - waterDrank,0),0);
				waterDrank = Math.max(waterDrank - temp,0);
				if (caravanCommodities[i].qty == 0) {
					caravanCommodities.splice(i,1);
				};
			} else if (caravanCommodities[i].commodity == 'fuel') {
				var temp = caravanCommodities[i].qty;
				caravanCommodities[i].qty = Math.round(Math.max(caravanCommodities[i].qty - fuelBurned,0),0);
				fuelBurned = Math.max(fuelBurned - temp,0);
				if (caravanCommodities[i].qty == 0) {
					caravanCommodities.splice(i,1);
				};
			};
		};

		if (foodEaten > 0) {
			if (!this.isOddJobbing && this.location !== undefined) {
				var resupplyDisabled = false;
				if (this.location.commodities.food * 100 > this.location.reputation.p1) {
					resupplyDisabled = true;
				};
				var choiceArray = [new Choice('Resupply ('+Math.ceil(this.location.commodities.food * 100)+' rep)',this.resupplyFromPassage,[this],resupplyDisabled),new Choice()];
				gamen.displayPassage(new Passage(this.name + ' has run out of food.  The crew has taken on odd jobs in ' + this.location.name + ' to put food in their mouths.</p><p>If they are not resupplied soon, they might just settle down!',choiceArray));
				this.isOddJobbing = true;
				model.clock.running = false;
				view.displayUnit(this,true);
			};
			if (Math.random() < 0.01 && this.isOddJobbing) {
				gamen.displayPassage(new Passage('The crew of ' + this.name + ' have found sweethearts in ' + this.location.name + ".  They've been accepted into the families there and have put the road behind them.  </p><p>" + this.name + " has been scuttled."));
				this.scuttle();
				if (units.length == 0) {
					var rebuildScore = Math.round((model.victoryProgress() - players.p1.startScore) * 100,0);
					model.clock.running = false;
					gamen.displayPassage(new Passage("As your last crew leaves the road behind them, you find yourself a place out among the scattered towns to live out the rest of your life.</p><p><strong>Final Score:</strong> You rebuilt " + rebuildScore + "% of Civilization." ));
				};
			};
		} else {
			this.isOddJobbing = false;
		};
	};

	this.look = function() {
		if (this.inTransit) {
			unitX = this.route[0].x;
			unitY = this.route[0].y;
		} else {
			unitX = this.location.x;
			unitY = this.location.y;
		};
		for (var i in sites) {
			if (( (this.location !== undefined && this.location.neighbors.indexOf(sites[i]) !== -1) || Math.pow(Math.pow(sites[i].x - unitX,2) + Math.pow(sites[i].y - unitY,2),.5) < this.owner.vision * 60 ) && this.owner.knownSites.indexOf(sites[i]) == -1) {
				this.owner.knownSites.push(sites[i]);
			};
		};
		if (this.location !== undefined && !this.location.hasVisited.p1) {
			this.location.hasVisited.p1 = true;
			this.location.arrivalEvents();
		};
		if (this.location !== undefined && this.location == players.p1.hometown) {
			this.location.hometown();
		}
		for (var i in landmarks) {
			if (( Math.pow(Math.pow(landmarks[i].x - unitX,2) + Math.pow(landmarks[i].y - unitY,2),.5) < this.owner.vision * 60 + 60 ) && this.owner.knownLandmarks.indexOf(landmarks[i]) == -1) {
				this.owner.knownLandmarks.push(landmarks[i]);
				this.owner.knownLandmarks = this.owner.knownLandmarks.sort(function(a,b) {return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0);});
			};
		};
		for (var i in rivers) {
			if ( ( Math.pow(Math.pow(rivers[i].x1 - unitX,2) + Math.pow(rivers[i].y1 - unitY,2),0.5) < this.owner.vision * 60 + 60 || Math.pow(Math.pow(rivers[i].x2 - unitX,2) + Math.pow(rivers[i].y2 - unitY,2),0.5) < this.owner.vision * 60 + 60 ) && this.owner.knownRivers.indexOf(rivers[i]) == -1) {
				this.owner.knownRivers.push(rivers[i]);
			};
		};
	};
	
	this.survey = function() {
		this.isSurveying = true;
		var resources = [];
		for (var r in this.location.resources) {
			for (var c in this.type.surveyResources) {
				if ( this.location.resources[r] == data.resources[this.type.surveyResources[c]] && this.location.hasSurveyed.p1[r] !== true) {
					resources.push(r);
				};
			}
		};
		resources = resources.concat(resources);
		resources.push(-1);
		
		this.surveyPotentials = resources;
		this.surveyComplete = new Date(model.clock.time.getTime() + (this.type.surveyTime * 8.64e+7));
		view.displayUnit(this);
		model.checkClock();
	};
	
	this.surveyResult = function() {
		this.isSurveying = false;
		var string;
		var foundResource = this.surveyPotentials[Math.random() * this.surveyPotentials.length << 0];
		var choiceArray = [new Choice(),new Choice('Survey Again!',this.survey.bind(this))];
		if (foundResource !== -1) {
			this.location.hasSurveyed.p1[foundResource] = true;
			string = this.name + ' found a ' + this.location.resources[foundResource].name + " in " + this.location.name;
			view.displaySiteDetails(this.location);
			this.location.surveys.p1.push(this.location.resources[foundResource]);
		} else {
			string = this.name + ' found nothing in ' + this.location.name + '.';
			this.location.surveys.p1.push('nothing');
		};
		var foundNothing = 0;
		for (var s in this.location.surveys.p1) {
			if (this.location.surveys.p1[s] == 'nothing') {
				foundNothing++;
			};
		};
		string += "<p />You have surveyed here "+this.location.surveys.p1.length+" times and found nothing "+foundNothing+" times.";
		gamen.displayPassage(new Passage(string,choiceArray));
		this.surveyPotentials = [];
		this.surveyComplete = undefined;
		model.clock.running = false;
		view.focus.unit = this;
		view.displayUnit(this,true);
	};
	
	this.build = function(infrastructure) {
		var projectStarted = false;
		for (var u in units) {
			if (units[u].location !== undefined && units[u].location == this.location && units[u].isBuilding && units[u].buildProject == infrastructure) {
				projectStarted = true;
				var otherUnit = units[u];
			};
		}
		if (!projectStarted) {
			this.isBuilding = true;
			this.buildProject = infrastructure;
			this.buildComplete = new Date(model.clock.time.getTime() + (infrastructure.buildTime * 8.64e+7));
			this.location.useCommodities(infrastructure.buildCost);
			view.displayUnit(this);
			view.displayMap();
			model.checkClock();
		} else {
			gamen.displayPassage(new Passage(otherUnit.name + ' is already building that here.'));
		};
	};
	
	this.buildResult = function() {
		this.location.buildInfrastructure(this.buildProject);
		view.displayUnit(this);
		gamen.displayPassage(new Passage(this.name + ' built a ' + this.buildProject.name + " in " + this.location.name));
		this.isBuilding = false;
		this.buildProject = undefined;
		this.buildComplete = undefined;
		model.clock.running = false;
		view.focus.unit = this;
		view.displayUnit(this,true);
	};

	this.cancelRoute = function() {
		if (this.caravan == undefined) {
			this.route = [];
			this.inTransit = false;
		} else {
			for (var i in this.caravan) {
				this.caravan[i].route = [];
				this.caravan[i].inTransit = false;
			};
		};
		view.displayUnit(this);
	};
	
	this.addFromSite = function(commodity) {
		this.currentTrade.siteStuff.push({commodity:commodity,qty:100});
	};
	
	this.addFromUnit = function(commodityIndex) {
		this.currentTrade.unitStuff.push(this.commodities[commodityIndex]);
	};
	
	this.warehouseFromUnit = function(commodityIndex) {
		if (this.location !== undefined) {
			this.location.warehouse.p1.push(this.commodities[commodityIndex]);
		};
		this.commodities.splice(commodityIndex,1);
	};
	
	this.pickupWarehouse = function(warehouseIndex) {
		this.commodities.push(this.location.warehouse.p1[warehouseIndex]);
		this.location.warehouse.p1.splice(warehouseIndex,1);
		this.consolidate();
	};
	
	this.trashFromUnit = function(commodityIndex) {
		if (this.location !== undefined) {
			this.location.trash.push(this.commodities[commodityIndex]);
		};
		this.commodities.splice(commodityIndex,1);
	};
	
	this.pickup = function(trashIndex) {
		this.commodities.push(this.location.trash[trashIndex]);
		this.location.trash.splice(trashIndex,1);
		this.consolidate();
	};
	
	this.clearTrade = function(commodity) {
		this.currentTrade = {unitStuff: [], siteStuff: []};
		view.updateTradeDiv();
	};
	
	this.removeUnitStuff = function(tradeIndex) {
		var commodityIndex = this.commodities.indexOf(this.currentTrade.unitStuff[tradeIndex]);
		this.currentTrade.unitStuff.splice(tradeIndex,1);
	};
	
	this.removeSiteStuff = function(tradeIndex) {
		this.currentTrade.siteStuff.splice(tradeIndex,1);
	};
	
	this.makeTrade = function() {
		
		// Move Goods, Log Transactions
		for (var i in this.currentTrade.unitStuff) {
			this.commodities.splice(this.commodities.indexOf(this.currentTrade.unitStuff[i]),1);
			this.location.logTransaction(this.currentTrade.unitStuff[i].commodity,-1);
		};
		for (var i in this.currentTrade.siteStuff) {
			this.commodities.push(this.currentTrade.siteStuff[i]);
			this.location.logTransaction(this.currentTrade.siteStuff[i].commodity,1);
		};
		
		this.location.reputation.p1 += this.currentTrade.balance;
		
		this.consolidate();
		
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
	};
	
	this.resupply = function(commodityIndex) {
		this.location.reputation.p1 -= (100 - this.commodities[commodityIndex].qty) * this.location.commodities[this.commodities[commodityIndex].commodity];
		this.commodities[commodityIndex].qty = 100;
		view.displayUnit(this);
		view.displaySiteDetails(view.focus.unit.location);
	};
	
	this.resupplyFromPassage = function(unit) {
		unit.commodities.push({commodity:'food',qty:0});
		var commodityIndex = unit.commodities.length - 1;
		unit.resupply(commodityIndex);
		model.clock.start();
	};
	
	this.scuttle = function() {
		if (this.location !== undefined) {
			var warehousing = false;
			for (var infrastructure of this.location.infrastructure) {
				if (infrastructure.warehousing) {
					warehousing = true;
				};
			};
			for (c in this.commodities) {
				if (warehousing) {
					this.location.warehouse.p1.push(this.commodities[c]);
				} else {
					this.location.reputation.p1 += this.location.commodities[this.commodities[c].commodity] * this.commodities[c].qty;
				};
			};
			this.location.population += this.type.crew;
		};
		units.splice(units.indexOf(this),1);
		view.clearDetailsDivs();
		if (units.length > 0) {view.displayUnit(units[0]);};
		view.displayMap();
	};
	
	this.takePassengers = function(repCost) {
		var passengerQty;
		if (this.location.population > 10) {
			passengerQty = 100;
		} else {
			passengerQty = this.location.population * 10;
		};
		this.commodities.push({commodity:'passengers',qty:passengerQty});
		this.location.population -= passengerQty/10;
		this.location.reputation.p1 -= repCost;
		if (this.location.population == 0) {
			this.location.reptuation.p1 = 0;
		};
	};
	
	this.dropPassengers = function(repCost) {
		if (this.location.population == 0 && this.location.neighbors.length == 0) {
			var nearestDist = Infinity;
			var nearestSite = undefined;
			for (var s in sites) {
				var distance = Math.pow(Math.pow(this.location.x-sites[s].x,2)+Math.pow(this.location.y - sites[s].y,2),0.5);
				if (distance < nearestDist && distance > 0) {
					nearestDist = distance;
					nearestSite = sites[s];
				};
			};
			this.location.neighbors.push(nearestSite);
			nearestSite.neighbors.push(this.location);
		};
		var commodityIndex;
		for (var c in this.commodities) {
			if (this.commodities[c].commodity == 'passengers') {
				commodityIndex = c;
			};
		};
		this.location.population += this.commodities[commodityIndex].qty / 10;
		this.commodities.splice(commodityIndex,1);
		this.location.reputation.p1 += repCost;
	};
	
	this.salvage = function(commodityList) {
		var repCost = 0;
		for (c of commodityList) {
			repCost += this.location.commodities[c];
		};
		repCost = Math.floor(repCost * 100 / commodityList.length);
		this.location.reputation.p1 -= repCost;
		var commodity = commodityList[Math.random() * commodityList.length << 0];
		var passageString = "The locals working here dredge up a load of " + view.commodityIcon(commodity) + " " + data.commodities[commodity].name + ".";
		gamen.displayPassage(new Passage(passageString));
		this.commodities.push({commodity:commodity,qty:100});
		view.displaySiteDetails(this.location);
		view.displayUnit(this);
	};
	
	this.canAfford = function(buildCost,output) {
		var result = false;
		var trading = this.location.trading();
		var unitsAtSite = [];
		for (var u in units) {
			if (units[u].location == this.location) {
				unitsAtSite.push(units[u]);
			};
		};
		var outstanding = {};
		for (var c in buildCost) {
			outstanding[c] = buildCost[c];
		};
		// Count up cargo that can be used
		for (var u in unitsAtSite) {
			for (var c in unitsAtSite[u].commodities) {
				if (unitsAtSite[u].commodities[c].qty == 100) {
					var commodity = unitsAtSite[u].commodities[c].commodity;
					if (outstanding[commodity] > 0) {
						outstanding[commodity] -= unitsAtSite[u].commodities[c].qty / 100;
					};
				};
			};
		};
		for (var w in this.location.warehouse.p1) {
			var commodity = this.location.warehouse.p1[w].commodity;
			if (outstanding[commodity] > 0) {
				outstanding[commodity] -= this.location.warehouse.p1[w].qty / 100;
			};
		};
		// Convert remaining requirements to reputation
		var repCost = 0;
		for (var c in outstanding) {
			if (trading[c] !== undefined) {
				repCost += outstanding[c] * this.location.commodities[c] * 100;
			} else if (outstanding[c] > 0) {
				repCost = Infinity;
			};
		};
		if (repCost <= this.location.reputation.p1) {
			result = true;
		}
		
		if (output == 'bool' || output == undefined) {
			return result;
		} else if (output == 'rep') {
			return Math.ceil(repCost);
		};
	};
	
	this.consolidate = function() {
		var partialLoads = [], totalQty;
		for (var commodity of this.commodities) {
			if (commodity.qty < 100) {
				partialLoads.push(commodity);
			};
		};
		for (var load of partialLoads) {
			for (var potential of partialLoads) {
				if (load.commodity == potential.commodity && load !== potential) {
					totalQty = load.qty + potential.qty;
					if (totalQty <= 100) {
						load.qty = totalQty;
						potential.qty = 0;
					} else {
						load.qty = 100;
						potential.qty = totalQty - 100;
					};
				};
			};
		};
	};
	
	units.push(this);
};

var gamenEventPointers = {

	eachDay: function() {
		model.eachDay();
	},
	
	refreshGameDisplay: function() {
		view.refreshGameDisplay();
	},
	
	randomEvent: function() {
		var randomEventList = model.globalEventStack;
		var eventIndex = Math.random() * randomEventList.length << 0;
		var event = randomEventList[eventIndex];
		if (events.globalEvents.indexOf(event) !== -1) {
			model.globalSequesteredEvents.push(event);
		};
		model.globalEventStack.splice(model.globalEventStack.indexOf(event),1);
		model.globalEventStack.push(model.globalSequesteredEvents.shift());
		events[event]();
		model.clock.logEventIn( 8.64e+7 * ( 10 * Math.random() + 10 ),'randomEvent');		
	},
	
	refugeeMoveFamily: function() {events.refugeeMoveFamily()},
	
};