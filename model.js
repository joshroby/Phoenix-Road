var sites = [];
var landmarks = [];
var units = [];
var p1 = {};
var players;

var errors = {};

var model = {

	options: {
		dayLength: 1000,
		paused: true,
	},

	newGame: function() {
		model.currentDay = 1;
		model.newMap();
		units = [];
		p1 = {};
		
		p1.vision = 60;
		p1.knownSites = [];
		p1.knownLandmarks = [];
		players = {p1:p1};
		
		var startUnit = new Unit(p1,undefined,data.units.donkeyCart);
// 		var dowser = new Unit(p1,startUnit.location,data.units.dowser);
// 		var tinker = new Unit(p1,startUnit.location,data.units.tinkersCart);
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
// 		startUnit.location.infrastructure.push(data.infrastructure.cartwright);
		
		var localArea = [startUnit.location];
		for (var i=0;i<5;i++) {
			for (s in localArea) {
				for (n in localArea[s].neighbors) {
					if (localArea.indexOf(localArea[s].neighbors[n]) == -1) {
						localArea.push(localArea[s].neighbors[n]);
					};
				};
			};
		};
		localArea.shift();
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.cartwright);
		localArea[Math.random() * localArea.length << 0].infrastructure.push(data.infrastructure.lensmeister);
		sites[Math.random() * sites.length << 0].infrastructure.push(data.infrastructure.kidOnABike);
		sites[Math.random() * sites.length << 0].infrastructure.push(data.infrastructure.mechanic);
		sites[Math.random() * sites.length << 0].infrastructure.push(data.infrastructure.hangar);
		view.focus.unit = startUnit;
		view.displayMap();
	},

	newMap: function(totalSites,minDist,maxDist,minAngle) {
		if (totalSites == undefined) { totalSites = 50 };
		if (minDist == undefined) {  minDist = 30 };
		if (maxDist == undefined) {  maxDist = 2.6 };
		if (minAngle == undefined) {  minAngle = 30 };
	
		sites = [];
		for (var i=0;i<totalSites*3;i++) {
			var newSite = new Site();
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
	
	knownValues: function() {
		var knownValues = {};
		var totalSites = 0;
		for (var c in data.commodities) {
			knownValues[c] = 0;
		};
		for (var s in p1.knownSites) {
			if (p1.knownSites[s].hasVisited.p1) {
				totalSites++;
				for (var c in knownValues) {
					knownValues[c] += p1.knownSites[s].commodities[c];
				};
			};
		};
		for (var c in knownValues) {
			knownValues[c] /= totalSites;
		};
		return knownValues;
	},
	
	checkClock: function() {
		var allBusy = true;
		for (var u in units) {
			if (!units[u].inTransit && !units[u].isSurveying && !units[u].isBuilding ) {
				allBusy = false;
			};
		};
		if (allBusy && model.options.paused) {
			model.options.paused = false;
			model.advanceClock();
		};
	},
	
	advanceClock: function() {
		model.currentDay++;
		
		for (var q in units) {
			units[q].eat();
			if (units[q].inTransit) {
				units[q].moveStep();
			} else if (units[q].surveyComplete == model.currentDay) {
				units[q].surveyResult();
			} else if (units[q].buildComplete == model.currentDay) {
				units[q].buildResult();
			};
		};
		
		for (var s in sites) {
			for (var g in sites[s].goodwill) {
				sites[s].reputation[g] += sites[s].goodwill[g]/20;
			};
		};
		
		view.displayUnit(view.focus.unit);
		view.displayMap();
		
		if (!model.options.paused) {
			var timedEvent = setTimeout(model.advanceClock,model.options.dayLength);
		};
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
					};
				};
			};
			if (unpaid) {
				view.focus.unit.location.reputation.p1 -= 100 * view.focus.unit.location.commodities[buildCost[i]];
			};
		};
		
		// spawning the unit
		var newUnit = new Unit(p1,view.focus.unit.location,unitType);
		view.focus.unit = newUnit;
		view.displayUnit(newUnit);
	},
	
	victoryProgress: function() {
		var count = 0;
		var num = 0;
		for (s in sites) {
			var needs = sites[s].needs();
			for (var n in needs) {
				count += needs[n].completion;
			};
			num = needs.length;
		};
		return count / (sites.length * num);
	},
	
	recruit: function(infrastructure) {
		var newUnit = new Unit(players.p1,view.focus.unit.location,data.units[infrastructure.recruit]);
		newUnit.name = infrastructure.name;
		var location = view.focus.unit.location;
		location.infrastructure.splice(location.infrastructure.indexOf(infrastructure));
		view.displayUnit(newUnit);
	},

};

function Site() {
	this.x = 25 + Math.random() * 950 << 0;
	this.y = 25 + Math.random() * 950 << 0;
	this.name = model.siteName();
	
	this.carpet = [{tilt:Math.random(),squish:Math.random()},{tilt:Math.random(),squish:Math.random()},{tilt:Math.random(),squish:Math.random()}];
	
	this.hasVisited = {};
	
	this.population = 4 + Math.random() * Math.random() * 496 << 0;
	this.wages = (Math.random() * Math.random() + 0.25) * (data.commodities.food.baseValue + data.commodities.water.baseValue);
	this.danger = 20;
	
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
	var foodInfrastructure = 0;
	if (this.commodities.food < 0.05) {
		foodInfrastructure = 3;
	} else if (this.commodities.food < 0.08) {
		foodInfrastructure = 2;
	} else if (this.commodities.food < 0.1) {
		foodInfrastructure = 1;
	};
	var foodList = ['pens','fields','orchards'];
	for (var f=0;f<foodInfrastructure;f++) {
		var num = Math.random() * foodList.length << 0;
		this.infrastructure.push(data.infrastructure[foodList[num]]);
		foodList.splice(num,1);
	};
	if (this.commodities.fiber < 0.15 && this.infrastructure.indexOf(data.infrastructure.fields) == -1) {
		this.infrastructure.push(data.infrastructure.fields);
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
	
	// Basic Industry
	if (Math.random() < 0.2) {
		var industry = undefined;
		if (this.commodities.stone < 0.3 && this.resources.indexOf(data.resources.outcropping) == -1 && Math.random() < 0.1) {
			industry = data.infrastructure.mine;
		};
		if (this.commodities.ore < 0.3 && this.resources.indexOf(data.resources.mineralVein) == -1 && Math.random() < 0.1 && industry == undefined) {
			industry = data.infrastructure.mine;
		};
		if (this.commodities.crudeOil < 0.6 && this.resources.indexOf(data.resources.oilReservoir) == -1 && Math.random() < 0.05 && industry == undefined) {
			industry = data.infrastructure.oilWell;
		};
		if (industry == undefined) {
			var buildings = ['cartwright','foundry','loom','refinery','saddler','seamstress','tannery'];
			industry = data.infrastructure[buildings[Math.random() * buildings.length << 0]];
			for (c in industry.inputs) {
				this.commodities[industry.inputs[c]] /= 0.8;
			};
			for (c in industry.outputs) {
				this.commodities[industry.outputs[c]] *= 0.8;
			};
		};
		if (industry !== undefined) {
			this.infrastructure.push(industry);
		}
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
		var housingLabels = [
			'cold',
			'crowded',
			'comfy'
		];
		var housingDesc = '<strong>Housing</strong><br />'+housing+' beds / '+this.population+' souls ';
		array.push({label:housingLabels[housingLabels.length * housingRatio * 0.99 << 0],completion:housingRatio,desc:housingDesc});
		
		var safety = Math.min(1,defense / this.danger);
		var safetyLabels = [
			'scared',
			'cowering',
			'vigilant',
			'bold'
		];
		var safetyDesc = '<strong>Safety</strong><br />'+defense+' defense / '+this.danger+' danger';
		array.push({label:safetyLabels[safetyLabels.length * safety * 0.99 << 0],completion:safety,desc:safetyDesc});
		
		return array;
	};
	
	this.trading = function() {
		var commodities = {};
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
	
	sites.push(this);
};

function Unit(owner,startLoc,type) {
	if (owner !== undefined) {
		this.owner = owner;
	} else {
		this.owner = p1;
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
		{commodity:'water',qty:100}
	];
	
	this.currentTrade = {
		unitStuff: [],
		siteStuff: [],
		balance: 0,
	};
	
	this.rename = function(newName) {
		this.name = newName;
		view.displayUnit(this);
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
		var speed = this.type.speed;
		if (this.offroad) {
			speed = this.type.offroadSpeed;
		};
		var distance = Math.pow(Math.pow(this.location.x - site.x,2) + Math.pow(this.location.y - site.y,2),.5);
		var foodEaten = distance / speed * this.type.crew;
		var waterDrank = distance / speed * this.type.crew;
		var foodStore = 0;
		var waterStore = 0;
		var cargo = 0;
		for (var i in this.commodities) {
			if (this.commodities[i].commodity == 'food') {
				foodStore += this.commodities[i].qty;
			} else if (this.commodities[i].commodity == 'water') {
				waterStore += this.commodities[i].qty;
			};
			if (data.commodities[this.commodities[i].commodity].cargo) {
				cargo++;
			};
		};
				
		if ((this.location.neighbors.indexOf(site) !== -1 || this.offroad == true) && waterStore >= waterDrank && foodStore >= foodEaten && cargo <= this.type.cargo && !this.isBuilding && !this.isSurveying) {
			var diffX = site.x - this.location.x;
			var diffY = site.y - this.location.y;
			if (this.offroad) {
				var speed = this.type.offroadSpeed;
			} else {
				var speed = this.type.speed;
			};
			var steps = distance / speed;
			this.route = [];
			this.inTransit = true;
			this.departed = false;
			for (s=0;s<steps;s++) {
				this.route.push({x:this.location.x + s*diffX/steps,y:this.location.y + s*diffY/steps});
			};
			this.route[0].y += 10; // So unit doesn't overlap site
			this.route.push(site);
			model.checkClock();
		} else if (this.location.neighbors.indexOf(site) == -1 && this.offroad == false) {
			view.displayError('No path to ' + site.name + '.');
		} else if (waterStore < waterDrank) {
			view.displayError('Not enough water!');
		} else if (foodStore < foodEaten) {
			view.displayError('Not enough food!');
		} else if (cargo > this.type.cargo) {
			view.displayError('Overburdened!');
		} else if (this.isBuilding) {
			view.displayError('Busy building!');
		} else if (this.isSurveying) {
			view.displayError('Busy surveying!');
		} else {
			console.log(this.location.neighbors.indexOf(site),this.offroad,waterStore,waterDrank,foodStore,foodEaten,cargo,this.type.cargo);
		};
		view.displayUnit(this);
	};
	
	this.moveStep = function() {
		if (load > this.type.cargo) {
			view.displayError(this.name + ' is overburdened!');
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
				model.options.paused = true;
				document.getElementById('clockPauseBtn').innerHTML = '>';
				view.focus.unit = this;
				view.displayUnit(this);
			};
			view.displayMap();
		};
	};
	
	this.eat = function() {
		var foodEaten = this.type.crew;
		var waterDrank = this.type.crew;
		for (var i in this.commodities) {
			if (this.commodities[i].commodity == 'food') {
				var temp = this.commodities[i].qty;
				this.commodities[i].qty = Math.round(Math.max(this.commodities[i].qty - foodEaten,0),0);
				foodEaten = Math.max(foodEaten - temp,0);
				if (this.commodities[i].qty == 0) {
					this.commodities.splice(i,1);
				};
			} else if (this.commodities[i].commodity == 'water') {
				var temp = this.commodities[i].qty;
				this.commodities[i].qty = Math.round(Math.max(this.commodities[i].qty - waterDrank,0),0);
				waterDrank = Math.max(waterDrank - temp,0);
				if (this.commodities[i].qty == 0) {
					this.commodities.splice(i,1);
				};
			};
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
		if (this.location !== undefined) {
			this.location.hasVisited.p1 = true;
		};
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
		this.surveyComplete = model.currentDay + this.type.surveyTime;
		view.displayUnit(this);
		model.checkClock();
	};
	
	this.surveyResult = function() {
		this.isSurveying = false;
		var foundResource = this.surveyPotentials[Math.random() * this.surveyPotentials.length << 0];
		if (foundResource !== -1) {
			this.location.hasSurveyed.p1[foundResource] = true;
			view.displayNotification(this.name + ' found a ' + this.location.resources[foundResource].name + " in " + this.location.name);
			view.displaySiteDetails(this.location);
		} else {
			view.displayError(this.name + ' found nothing in ' + this.location.name + '.');
		};
		this.surveyPotentials = [];
		this.surveyComplete = undefined;
		model.options.paused = true;
		view.focus.unit = this;
		view.displayUnit(this);
	};
	
	this.build = function(infrastructure) {
		this.isBuilding = true;
		this.buildProject = infrastructure;
		this.buildComplete = model.currentDay + infrastructure.buildTime;
		this.location.useCommodities(infrastructure.buildCost);
		view.displayUnit(this);
		model.checkClock();
	};
	
	this.buildResult = function() {
		this.location.buildInfrastructure(this.buildProject);
		view.displayNotification(this.name + ' built a ' + this.buildProject.name + " in " + this.location.name);
		this.isBuilding = false;
		this.buildProject = undefined;
		this.buildComplete = undefined;
		model.options.paused = true;
		view.focus.unit = this;
		view.displayUnit(this);
	};

	this.cancelRoute = function() {
		this.route = [];
		this.inTransit = false;
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
		
		// Move Goods, Adjust Site Values
		for (var i in this.currentTrade.unitStuff) {
			this.commodities.splice(this.commodities.indexOf(this.currentTrade.unitStuff[i]),1);
			this.location.commodities[this.currentTrade.unitStuff[i].commodity] *= 0.95;
		};
		for (var i in this.currentTrade.siteStuff) {
			this.commodities.push(this.currentTrade.siteStuff[i]);
			this.location.commodities[this.currentTrade.siteStuff[i].commodity] *= 1;
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
		};
		units.splice(units.indexOf(this),1);
		view.displayUnit(units[0]);
	};
	
	this.canAfford = function(buildCost) {
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
				var commodity = unitsAtSite[u].commodities[c].commodity;
				if (outstanding[commodity] > 0) {
					outstanding[commodity] -= unitsAtSite[u].commodities[c].qty / 100;
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
		
		return result;
	};
	
	units.push(this);
};