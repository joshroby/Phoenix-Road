var map = {};
var sites = [];
var landmarks = [];
var units = [];
var players = {};
players.p1 = {};

var errors = {};

var model = {

	gameTitle: 'Down the Phoenix Road',
	gameSavePrefix: 'PhoenixRoad',

	options: {
		tutorials: true,
		autoplay: true,
		zoom: true,
		newGame: {
			mapSize: 1000,
			totalSites: 50,
			minDist: 40,
			maxDist: 2.6,
			totalThreats: 5,
			ghostTowns: 2,
			volatility: 5,
		},
	},

	newGame: function() {
		
		model.clock = new Clock(new Date(new Date().getTime() + 3.154e+12 + 3.154e+12 * Math.random() ));
		gamen.clocks = [model.clock];
		model.clock.timeStep = 8.64e+7;
		model.clock.logEventIn(8.64e+7,'eachDay');
		model.clock.logEventIn(8.64e+7*10*Math.random(),'randomEvent');
		
		var safeIndex = model.newMap();
		units = [];
		players.p1 = {unitsUnlocked:{},eventLog:{}};
		
		players.p1.vision = 60;
		players.p1.knownSites = [];
		players.p1.knownLandmarks = [];
		players.p1.recruitProgress = {};
		
		var startUnit = new Unit(players.p1,sites[Math.random() * safeIndex << 0],data.units.donkeyCart);
		if (startUnit.location.neighbors.length == 0) {
			startUnit.location = sites[Math.random() * sites.length << 0];
		};
		players.p1.hometown = startUnit.location;
		
		startUnit.look();
		startUnit.location.reputation.p1 = 100;
		
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
// 		startUnit.location.infrastructure.push(data.infrastructure.burntOutBus);
// 		startUnit.location.infrastructure.push(data.infrastructure.cartwright);
// 		startUnit.location.infrastructure.push(data.infrastructure.mechanic);
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
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.cartwright);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.lensmeister);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.kidOnABike);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.tinkerCamp);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.nakedDowser);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.mechanic);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.hangar);
		distantArea[Math.random() * distantArea.length << 0].infrastructure.push(data.infrastructure.burntOutBus);
		view.focus.unit = startUnit;
		view.displayMap();
		
		model.startScore = model.victoryProgress();
		
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
		for (var i=0;i<totalSites*3;i++) {
			var newSite = new Site(mapSize);
		};
		
		// Remove too-close sites, reduce to totalSites
		for (var i in sites) {
			for (var t in sites) {
				var distance = Math.pow(Math.pow(sites[i].x - sites[t].x,2) + Math.pow(sites[i].y - sites[t].y,2),.5);
				if (distance < minDist) {
					sites.splice(t,1);
				};
			};
		};
		sites.splice(totalSites);
		
		// Find Neighbors
		
		var total = 0;
		for (var i in sites) {
			var shortestDistance = Infinity;
			var nearestSite = 0;
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
		for (var x=-50;x<1050;x += 50) {
			for (var y=-50;y<1050;y += 50) {
				var farFromSites = true;
				for (s in sites) {
					if (Math.pow(Math.pow(sites[s].x - x,2) + Math.pow(sites[s].y - y,2),0.5) < avgDist * maxDist * 0.5) {
						farFromSites = false;
					};
				};
				if (farFromSites) {
					landmarks.push({x:x,y:y,type:Math.random(),size:Math.random()});
				};
			};
		};
		
		// Threats
		var threats = [];
		for (var i=sites.length-1;i>sites.length-totalThreats-1;i--) {
// 			threats.push({x:-100 + Math.random() * 1200 >> 0,y:-100 + Math.random() * 1200 >> 0});
			threats.push(sites[i]);
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
	
	siteName: function() {
		var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
		var vowels = ['a','e','i','o','u'];
		var syllables = 2 + Math.random() * Math.random() * 4 << 0;
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
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	
	threatName: function(site) {
		var prefices = ["","Howling","Hell's","The","Great","The Supreme"];
		var roots = ["","Jackal","Unitarian-Universalist","White","Demon","Angel"];
		var suffices = ["Kings","Queens","Sovereigns","Gang","Army","Nation","Division","Militia","Horde"];
		return prefices[Math.random() * prefices.length >> 0] + " " + roots[Math.random() * roots.length >> 0] + " " + suffices[Math.random() * suffices.length >> 0]
	},
	
	knownValues: function() {
		var knownValues = {};
		var totalSites = {};
		for (var c in data.commodities) {
			knownValues[c] = 0;
			totalSites[c] = 0;
		};
		for (var s in players.p1.knownSites) {
			if (players.p1.knownSites[s].hasVisited.p1) {
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
		
		for (var q in units) {
			units[q].eat();
			if (units[q].inTransit) {
				units[q].moveStep();
			} else if (units[q].surveyComplete <= model.clock.time) {
				units[q].surveyResult();
			} else if (units[q].buildComplete <= model.clock.time) {
				units[q].buildResult();
			};
		};
		
		for (var s in sites) {
			for (var g in sites[s].goodwill) {
				sites[s].reputation[g] += sites[s].goodwill[g]/20;
			};
			if (Object.keys(sites[s].adjustment).length > 0) {
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
					} else {
						delete sites[s].adjustment[a];
					};
				};
			};
			if (sites[s].trash.length > 0 && Math.random() < 0.05) {
				sites[s].trash.splice(sites[s].trash.length * Math.random() >> 0,1);
			};
			if (sites[s].infrastructure.length == 0 && sites[s].resources.length == 0 && sites[s].trash.length == 0) {
				if (sites[s].population > 0) {
					if (Math.random() < 0.05) {
						sites[s].population -= Math.random() * Math.random() * 50 << 0;
					};
				} else {
					players.p1.knownSites.splice(players.p1.knownSites.indexOf(sites[s]),1);
					sites.splice(sites.indexOf(sites[s]),1);
				};
			};
		};
		
		if (model.victoryProgress() > .99) {
			model.clock.running = false;
			gamen.displayPassage(new Passage("Holy shit, you won the game!"));
		};
		
		view.displayUnit(view.focus.unit);
		view.displayMap();
		
		model.clock.logEventIn(8.64e+7,'eachDay');
		
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
			if (unpaid) {
				view.focus.unit.location.reputation.p1 -= 100 * view.focus.unit.location.commodities[buildCost[i]];
			};
		};
		
		// spawning the unit
		var newUnit = new Unit(players.p1,view.focus.unit.location,unitType);
		view.focus.unit = newUnit;
		view.displayUnit(newUnit);
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
	},
	
	flatGame: function() {
		var flatGame = {};
		flatGame.saveDate = new Date();
		flatGame.clock = model.clock;
		flatGame.eventQueue = [];
		for (var e in model.clock.events) {
			flatGame.eventQueue.push({time:e,events:model.clock.events[e]});
		};
		
		flatGame.landmarks = landmarks;
		
		flatGame.players = {};
		for (var player in players) {
			nextPlayer = {};
			nextPlayer.unitsUnlocked = players[player].unitsUnlocked;
			nextPlayer.vision = players[player].vision;
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

		model.clock = new Clock();
		model.clock.time = new Date(saveGame.clock.time);
		model.clock.timeStep = saveGame.clock.timeStep;
		for (var e in saveGame.eventQueue) {
			for (var f of saveGame.eventQueue[e].events) {
				model.clock.logEventWhen(new Date(parseInt(saveGame.eventQueue[e].time)),f);
			};
		};

		landmarks = saveGame.landmarks;
		
		sites = [];
		for (var s in saveGame.sites) {
			var newSite = new Site();
		};
		var simples = ['name','adjustment','carpet','commodities','goodwill','hasVisited','hasSurveyed','population','reputation','threat','trash','wages','x','y'];
		for (var s in saveGame.sites) {
			for (var d of simples) {
				sites[s][d] = saveGame.sites[s][d];
			};
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
		};
		
		units = [];
		var simples = ['name','commodities','inTransit','route','isSurveying','surveyComplete','surveyPotentials','isBuilding','buildComplete','buildProject'];
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
				u.route.splice(u.route.length-1,1,sites[u.route[u.route.length-1]])
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
	if (mapSize == undefined) {mapSize = 1000};
	var trimmed = mapSize - 50;
	var min = (1000 - trimmed ) / 2;
	this.x = min + Math.random() * trimmed << 0;
	this.y = min + Math.random() * trimmed << 0;
	this.name = model.siteName();
	
	this.carpet = [{tilt:Math.random(),squish:Math.random()},{tilt:Math.random(),squish:Math.random()},{tilt:Math.random(),squish:Math.random()}];
	
	this.hasVisited = {};
	
	this.population = 4 + Math.random() * Math.random() * 496 << 0;
	this.wages = (Math.random() * Math.random() + 0.25) * (data.commodities.food.baseValue + data.commodities.water.baseValue);
	
	this.commodities = {};
	for (var c in data.commodities) {
		this.commodities[c] = data.commodities[c].baseValue;
		var randomFactor = 0;
		for (var r=0;r<data.commodities[c].stability;r++) {
			randomFactor += Math.random();
		};
		randomFactor = 2 * randomFactor / data.commodities[c].stability;
		this.commodities[c] *= randomFactor / 100;
	};
	this.adjustment = {};
	
	this.reputation = {p1:0};
	this.goodwill = {p1:0};
	
	this.trash = [];
	
	this.resources = [];
	this.hasSurveyed = {};
	this.hasSurveyed.p1 = [];
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
	if (this.commodities.food < 0.1 && this.resources.indexOf(data.resources.pasture) !== -1) {
		this.infrastructure.push(data.infrastructure.corral);
	};
	if (this.commodities.food < 0.1 && this.resources.indexOf(data.resources.forest) !== -1) {
		this.infrastructure.push(data.infrastructure.orchards);
	};

	// Basic Industry
	if (Math.random() < 0.9 - this.infrastructure.length * 0.4) {
		var industry = undefined;
		if (this.commodities.stone < 0.3 && this.resources.indexOf(data.resources.outcropping) == -1 && Math.random() < 0.1) {
			industry = data.infrastructure.quarry;
		};
		if (this.commodities.ore < 0.3 && this.resources.indexOf(data.resources.mineralVein) == -1 && Math.random() < 0.1 && industry == undefined) {
			industry = data.infrastructure.mine;
		};
		if (this.commodities.crudeOil < 0.6 && this.resources.indexOf(data.resources.oilReservoir) == -1 && Math.random() < 0.05 && industry == undefined) {
			industry = data.infrastructure.oilWell;
		};
		if (industry == undefined) {
			var buildings = ['cartwright','foundry','refinery','loom','saddler','seamstress','tannery','loom','saddler','seamstress','tannery'];
			industry = data.infrastructure[buildings[Math.random() * buildings.length << 0]];
			var totalInputs = 0;
			var totalOutputs = 0;
			for (c in industry.inputs) {
				this.commodities[industry.inputs[c]] /= 0.8;
				totalInputs += this.commodities[industry.inputs[c]];
			};
			for (c in industry.outputs) {
				this.commodities[industry.outputs[c]] *= 0.8;
				totalOutputs += this.commodities[industry.outputs[c]];
			};
			if (industry.inputs !== undefined && industry.outputs !== undefined) {
				totalInputs /= industry.inputs.length;
				totalOutputs /= industry.outputs.length;
				if (totalInputs > totalOutputs * 0.8) {
					for (c in industry.outputs) {
						this.commodities[industry.outputs[c]] *= totalInputs / ( totalOutputs * 0.8 );
					};
				};
			};
		};
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
	if (this.commodities.lumber < 0.4 && this.commodities.stone >= 0.3) {
		this.infrastructure.push(data.infrastructure.woodenPallisade);
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
		
		var simples = ['name','adjustment','carpet','commodities','goodwill','hasVisited','hasSurveyed','population','reputation','threat','trash','wages','x','y'];
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
		var housingDesc = '<strong>Housing</strong><br />'+housing+' beds / '+this.population+' souls ';
		array.push({label:housingLabels[housingLabels.length * housingRatio * 0.99 << 0],completion:housingRatio,desc:housingDesc});
		
		var safety = Math.min(1,defense / this.nearestThreat.threat.strength);
		var safetyLabels = [
			'scared',
			'cowering',
			'vigilant',
			'bold'
		];
		var safetyDesc = '<strong>Safety</strong><br />'+defense+' defense / '+this.nearestThreat.threat.strength+' danger';
		safetyDesc += '<br />('+this.nearestThreat.threat.name+' territory)';
		array.push({label:safetyLabels[safetyLabels.length * safety * 0.99 << 0],completion:safety,desc:safetyDesc});
		
		return array;
	};

	this.arrivalEvents = function() {
		if (!players.p1.eventLog.tutorialStarted && model.options.tutorials) {
			events.tutorial_001();
		} else if (!players.p1.eventLog.firstArrival && model.options.tutorials) {
			events.tutorial_firstArrival();
		};
		for (var i of this.infrastructure) {
			if (i.passage !== undefined) {
				gamen.displayPassage(new Passage(i.passage));
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
				industrial = industrial.concat(this.infrastructure[b].inputs);
				industrial = industrial.concat(this.infrastructure[b].outputs);
			};
			for (var d in this.commodities) {
				errors.v426 = d;
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
			this.commodities[infrastructure.inputs[c]] /= 0.8;
		};
		for (var c in infrastructure.outputs) {
			this.commodities[infrastructure.outputs[c]] *= 0.8;
		};
		for (var i in infrastructure.replaces) {
			for (b in this.infrastructure) {
				if (this.infrastructure[b] == data.infrastructure[infrastructure.replaces[i]]) {
					this.infrastructure.splice(b,1);
				};
			};
		};
		this.goodwill.p1 += infrastructure.goodwill;
		this.infrastructure.push(infrastructure);
	};
	
	this.useCommodities = function(useList) {
		var unitsAtSite = [view.focus.unit];
		for (var u in units) {
			if (units[u].location == view.focus.unit && units[u] !== view.focus.unit) {
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
			if (outstanding) {
				view.focus.unit.location.reputation.p1 -= view.focus.unit.location.commodities[flatList[c]] * 100 ;
			};
		};
	};
	
	this.logTransaction = function(commodityKey,adjustment) {
		if (this.adjustment[commodityKey] !== undefined) {
			this.adjustment[commodityKey] += adjustment;
		} else {
			this.adjustment[commodityKey] = adjustment;
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
		routes[startKey] = {site:this,route:[{x:this.x,y:this.y}],distance:0};
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
						newRoute.push({x:destination.x,y:destination.y});
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
		
		var simples = ['name','commodities','inTransit','route','isSurveying','surveyComplete','surveyPotentials','isBuilding','buildComplete','buildProject'];
		for (var i of simples) {
			flat[i] = this[i];
		};
		if (flat.route !== undefined) {
			flat.route[flat.route.length-1] = sites.indexOf(flat.route[flat.route.length-1]);
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
				
		if (route !== undefined && waterStore >= waterDrank && foodStore >= foodEaten && fuelStore >= fuelBurned && cargo <= cargoCapacity && !isBuilding && !isSurveying) {
			this.inTransit = true;
			this.departed = false;
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
				this.route.push({x:lastWaypoint.x + stepsThisLeg*stepX,y:lastWaypoint.y + stepsThisLeg*stepY});
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
		if (load > this.type.cargo) {
			gamen.displayPassage(new Passage(this.name + ' is overburdened and cannot travel.'));
			view.focus.unit = this;
			view.displayUnit(this);
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
				this.look();
				model.clock.running = false;
				document.getElementById('clockPauseBtn').innerHTML = '<span class="fa fa-play"></span>';
				view.focus.unit = this;
				view.displayUnit(this);
			};
			view.displayMap();
		};
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
				gamen.displayPassage(new Passage(this.name + ' has run out of food.  The crew has taken on odd jobs in ' + this.location.name + ' to put food in their mouths.</p><p>If they are not resupplied soon, they might just settle down!'));
				this.isOddJobbing = true;
				model.clock.running = false;
			};
			if (Math.random() < 0.01) {
				gamen.displayPassage(new Passage('The crew of ' + this.name + ' have found sweethearts in ' + this.location.name + ".  They've been accepted into the families there and have put the road behind them.  </p><p>" + this.name + " has been scuttled."));
				this.scuttle();
				if (units.length == 0) {
					var rebuildScore = Math.round((model.victoryProgress() - model.startScore) * 100,0);
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
			if (( (this.location !== undefined && this.location.neighbors.indexOf(sites[i]) !== -1) || Math.pow(Math.pow(sites[i].x - unitX,2) + Math.pow(sites[i].y - unitY,2),.5) < this.owner.vision ) && this.owner.knownSites.indexOf(sites[i]) == -1) {
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
			if (( Math.pow(Math.pow(landmarks[i].x - unitX,2) + Math.pow(landmarks[i].y - unitY,2),.5) < this.owner.vision + 60 ) && this.owner.knownLandmarks.indexOf(landmarks[i]) == -1) {
				this.owner.knownLandmarks.push(landmarks[i]);
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
		var foundResource = this.surveyPotentials[Math.random() * this.surveyPotentials.length << 0];
		var choiceArray = [new Choice(),new Choice('Survey Again!',this.survey.bind(this))];
		if (foundResource !== -1) {
			this.location.hasSurveyed.p1[foundResource] = true;
			gamen.displayPassage(new Passage(this.name + ' found a ' + this.location.resources[foundResource].name + " in " + this.location.name,choiceArray));
			view.displaySiteDetails(this.location);
		} else {
			
			gamen.displayPassage(new Passage(this.name + ' found nothing in ' + this.location.name + '.',choiceArray));
		};
		this.surveyPotentials = [];
		this.surveyComplete = undefined;
		model.clock.running = false;
		view.focus.unit = this;
		view.displayUnit(this);
	};
	
	this.build = function(infrastructure) {
		this.isBuilding = true;
		this.buildProject = infrastructure;
		this.buildComplete = new Date(model.clock.time.getTime() + (infrastructure.buildTime * 8.64e+7));
		this.location.useCommodities(infrastructure.buildCost);
		view.displayUnit(this);
		model.checkClock();
	};
	
	this.buildResult = function() {
		this.location.buildInfrastructure(this.buildProject);
		gamen.displayPassage(new Passage(this.name + ' built a ' + this.buildProject.name + " in " + this.location.name));
		this.isBuilding = false;
		this.buildProject = undefined;
		this.buildComplete = undefined;
		model.clock.running = false;
		view.focus.unit = this;
		view.displayUnit(this);
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
	
	this.trashFromUnit = function(commodityIndex) {
		if (this.location !== undefined) {
			this.location.trash.push(this.commodities[commodityIndex]);
		};
		this.commodities.splice(commodityIndex,1);
	};
	
	this.pickup = function(trashIndex) {
		this.commodities.push(this.location.trash[trashIndex]);
		this.location.trash.splice(trashIndex,1);
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
				
		view.displayUnit(view.focus.unit);
		view.displaySiteDetails(view.focus.unit.location);
	};
	
	this.resupply = function(commodityIndex) {
	
		this.location.reputation.p1 -= (100 - this.commodities[commodityIndex].qty) * this.location.commodities[this.commodities[commodityIndex].commodity];
		this.commodities[commodityIndex].qty = 100;
		view.displayUnit(this);
		view.displaySiteDetails(view.focus.unit.location);
	
	};
	
	this.scuttle = function() {
		if (this.location !== undefined) {
			for (c in this.commodities) {
				this.location.reputation.p1 += this.location.commodities[this.commodities[c].commodity] * this.commodities[c].qty;
			};
			this.location.population += this.type.crew;
		};
		units.splice(units.indexOf(this),1);
		view.focus.unit = units[0];
		view.clearDetailsDivs();
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
	};
	
	this.dropPassengers = function(repCost) {
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
		var randomEventList = Object.keys(events.randomEvents);
		var event = randomEventList[Math.random() * randomEventList.length << 0];
		console.log(event);
		events.randomEvents[event]();
		model.clock.logEventIn( 8.64e+7 * ( 10 * Math.random() + 5 ),'randomEvent');		
	},
	
};