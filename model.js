var sites = [];
var units = [];
var p1 = {};

var model = {

	newGame: function() {
		model.newMap();
		units = [];
		p1 = {};
		
		p1.vision = 200;
		p1.knownSites = [];
		
		var startUnit = new Unit(p1,undefined,data.units.wagon);
		for (i in sites) {
			if (Math.pow(Math.pow(startUnit.location.x - sites[i].x,2) + Math.pow(startUnit.location.y - sites[i].y,2),.5) < p1.vision) {
				p1.knownSites.push(sites[i]);
			};
		};
		startUnit.location.reputation.p1 = 100;
		
		view.displayMap();
	},

	newMap: function(totalSites,minDist,maxDist,minAngle) {
		if (totalSites == undefined) { totalSites = 50 };
		if (minDist == undefined) {  minDist = 20 };
		if (maxDist == undefined) {  maxDist = 2.6 };
		if (minAngle == undefined) {  minAngle = 30 };
	
		sites = [];
		for (i=0;i<totalSites*3;i++) {
			var newSite = new Site();
		};
		
		// Remove too-close sites, reduce to totalSites
		for (i in sites) {
			for (t in sites) {
				var distance = Math.pow(Math.pow(sites[i].x - sites[t].x,2) + Math.pow(sites[i].y - sites[t].y,2),.5);
				if (distance < minDist) {
					sites.splice(t,1);
				};
			};
		};
		sites.splice(totalSites);
		
		// Find Neighbors
		
		var total = 0;
		for (i in sites) {
			var shortestDistance = Infinity;
			var nearestSite = 0;
			for (t in sites) {
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
		for (i in sites) {
			sites[i].neighbors = [];
			for (t in sites) {
				var distance = Math.pow(Math.pow(sites[i].x - sites[t].x,2) + Math.pow(sites[i].y - sites[t].y,2),.5);
				if (distance < avgDist * maxDist && distance >= minDist) {
					sites[i].neighbors.push(sites[t]);
				};
			};
		};
		
		// Remove neighbors on too-similar vectors
		var removeList = [];
		for (i in sites) {
			neighborAngles = [];
			for (n in sites[i].neighbors) {
				neighborAngles.push(Math.atan2(sites[i].neighbors[n].y - sites[i].y,sites[i].neighbors[n].x - sites[i].x) * 180 / Math.PI);
			}
			for (a in neighborAngles) {
				for (n in neighborAngles) {
					var angleDiff = Math.abs(neighborAngles[a] - neighborAngles[n]);
					if ((360 - minAngle < angleDiff || angleDiff < minAngle) && angleDiff !== 0) {
						removeList.push([sites[i],sites[i].neighbors[n],sites[i].neighbors[a]]);
					} else {
// 						console.log('big angle');
					};
				};
			};
		};
		
		for (i in removeList) {
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
	},
	
	siteName: function() {
		var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
		var vowels = ['a','e','i','o','u'];
		var syllables = 1 + Math.random() * 4 << 0;
		var string = '';
		for (s=0;s<syllables;s++) {
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

};

function Site() {
	this.x = 25 + Math.random() * 950 << 0;
	this.y = 25 + Math.random() * 950 << 0;
	this.name = model.siteName();
	
	this.population = Math.random() * Math.random() * 1000 << 0;
	this.wages = Math.random() * Math.random();
	
	this.reputation = {p1:0};
	
	this.infrastructure = [];
	
	this.commodities = {};
	for (c in data.commodities) {
		this.commodities[c] = Math.random() * Math.random() * data.commodities[c].rarity;
	};
	
	this.needs = function() {
		return ['hungry','cold','parched','bored'];
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
	} else {
		this.location = sites[Math.random() * sites.length << 0];
	};
	if (type == undefined) {
		type = data.units.wagon;
	};
	
	var num = units.length + 1;
	this.name = type.name + " #" + num;
	
	this.type = type;
	
	this.commodities = {
		food: 100,
		water: 100,
	};
	
	this.currentTrade = {
		unitStuff: [],
		siteStuff: [],
	};
	
	this.move = function(site) {
		site = sites[site];
		if (this.location.neighbors.indexOf(site) !== -1) {
			this.location = site;
			for (i in sites) {
				if (Math.pow(Math.pow(sites[i].x - this.location.x,2) + Math.pow(sites[i].y - this.location.y,2),.5) < this.owner.vision && this.owner.knownSites.indexOf(sites[i]) == -1) {
					this.owner.knownSites.push(sites[i]);
				};
			};
			view.displaySiteDetails(sites.indexOf(site));
			view.displayMap();
		} else {
			console.log('cannot move to',site);
		};
	};
	
	this.addFromSite = function(commodity) {
		this.currentTrade.siteStuff.push({commodity:commodity,qty:100});
	};
	
	this.addFromUnit = function(commodity) {
		this.currentTrade.unitStuff.push({commodity:commodity,qty:100});
	};
	
	this.clearTrade = function(commodity) {
		this.currentTrade = {unitStuff: [], siteStuff: []};
		view.updateTradeDiv();
	};
	
	this.makeTrade = function() {
		console.log(this.currentTrade);
		
		console.log('move goods');
		
		console.log('adjust site values');
		
		console.log('convert tradebalance into reputation');
				
		view.displayUnit(units.indexOf(view.focus.unit));
		view.displaySite(sites.indexOf(view.focus.unit.location));
	};
	
	units.push(this);
};