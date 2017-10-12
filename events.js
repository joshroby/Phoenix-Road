var events = {

	// Tutorial Events

	disableTutorial: function() {
		model.options.tutorials = false;
		players.p1.eventLog.firstArrival = true;
		gamen.passageQueue = [];
	},

	tutorial_001: function() {
		players.p1.eventLog.tutorialStarted = true;
		var roadsOut = units[0].location.neighbors.length;
		if (roadsOut > 1) {
			roadsOut = 'are ' + ['no','one','two','three','four','five','six'][roadsOut] + ' roads';
		} else {
			roadsOut += 'is just one road';
		};
		var passageText = "You start your journey from your hometown of "+units[0].location.name+".  You can see your donkey cart marked in red on the map above, just below the town.<p>There "+roadsOut+" out of town.  There are little more than rumors about what you'll find down each one.  The townsfolk are pretty sure on the names of the towns out there, but no one's quite sure what you'll find down each road.";
		var choiceArray = [new Choice('Continue',events.tutorial_002),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray,false));
	},

	tutorial_002: function() {
		gamen.passageQueue = [];
		view.displaySiteDetails(units[0].location);
		var passageText = "Since you grew up here, you have a respectable reputation as a trustworthy individual.  Townsfolk will just give you most of what you ask for, trusting you to do something worthwhile with the materials.  You've spent your whole life doing the same, sharing what you have with townsfolk who need it.<p>Of course, your reputation has its limits.  If you ask for too much, you'll get turned down. Some things, too, are more valuable than your reputation merits.  You can see a measure of your reputation in the town on the right, in green.  Your reputation here is "+Math.floor(units[0].location.reputation.p1)+".";
		var choiceArray = [new Choice('Continue',events.tutorial_003),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray,false));
	},

	tutorial_003: function() {
		gamen.passageQueue = [];
		var passageText = "A number of different commodities are available in your hometown.  Most of them are scavenged from old caches of goods or pried out of the surrounding wilderness.";
		var production = [];
		for (var i in units[0].location.infrastructure) {
			if (units[0].location.infrastructure[i].outputs !== undefined) {
				production.push(units[0].location.infrastructure[i]);
			};
		};
		if (production.length > 0) {
			for (i of production) {
				var outputs = [];
				for (var o of i.outputs) {
					outputs.push(view.commodityIcon(o) + " " + data.commodities[o].name);
				};
				passageText += "<p>Your town does boast a "+i.name+", which produces "+gamen.prettyList(outputs)+".  Consequently, these commodities are a little more plentiful, less valuable, and folks are more likely to hand them over.";
			};
		} else {
			passageText += "<p>There's no organized industry in your hometown.  Everyone's just too desperate to scrounge up enough food to eat.  Nobody has the time or resources to organize a going concern.";
		};
		view.displaySiteDetails(units[0].location);
		var choiceArray = [new Choice('Continue',events.tutorial_004),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray,false));
	},

	tutorial_004: function() {
		gamen.passageQueue = [];
		var cargo = units[0].commodities[2].commodity;
		view.displayUnit(units[0],true);
		var passageText = "You've loaded up your Grams' old donkey cart with " +view.commodityIcon('food')+ " Food and " +view.commodityIcon('water')+ " Water for the journey, plus a load of your town's most plentiful commodity: " + view.commodityIcon(cargo) + data.commodities[cargo].name + ".<p>The food is for you and your friend.  The water is for the donkey.  The " + view.commodityIcon(cargo) + data.commodities[cargo].name + " is for somebody out there who needs it more than you do.  Maybe they'll have something they don't need, something plentiful in their town, for which the people here have a dire need.";
		var choiceArray = [new Choice('Continue',events.tutorial_005),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray,false));
	},
	
	tutorial_005: function() {
		gamen.passageQueue = [];
		var cargo = units[0].commodities[2].commodity;
		gamen.displayPassage(new Passage("It's time to hit the road.  After you've dismissed this message, click on your donkey cart to select it.<p>You can then click on another town on the map and you'll start heading there.<p>Before you go, though, you might want to request another load of a commodity.  Click on any of the <span class='fa fa-cart-plus'></span> icons next to the commodity you want to ask for and then click on the Trade button below the map.  Your cart can carry one more load.  Do you want another " + view.commodityIcon(cargo) + data.commodities[cargo].name + ", or something different? "+data.commodities[units[0].commodities[2].commodity].name+" is cheap, but carrying two different commodities increases the chances that the people out there will find what you've got useful.",undefined,false));
	},
	
	tutorial_firstArrival: function() {
		if (units[0].location.population == 0) {
			gamen.displayPassage(new Passage("You made it to "+units[0].location.name+" but have only discovered a Ghost Town.  There's nothing here but abandoned buildings and forgotten memories.  You'll have to find trading partners somewhere else."));
		} else {
			players.p1.eventLog.firstArrival = true;
			var cargo = [units[0].commodities[2],units[0].commodities[3]];
			var tradedHere = units[0].location.trading();
			var tradedThere = players.p1.hometown.trading();
			var cargoValueHere = tradedHere[cargo[0].commodity];
			var cargoValueThere = tradedThere[cargo[0].commodity];
			if (cargo[1] !== undefined) {
				cargoValueHere += tradedHere[cargo[1].commodity];
				cargoValueThere += tradedThere[cargo[1].commodity];
			};
			cargoValueHere = Math.floor(cargoValueHere * 100);
			cargoValueThere = Math.floor(cargoValueThere * 100);
			var canBuyOne = {};
			var canBuyTwo = {};
			for (var i in tradedHere) {
				if (tradedHere[i] * 100 < cargoValueHere) {
					canBuyOne[i] = tradedHere[i];
				};
				if (tradedHere[i] * 200 < cargoValueHere) {
					canBuyTwo[i] = tradedHere[i];
				};
			};
			var potentialTrades = [];
			for (i in canBuyOne) {
				if (tradedThere[i] * 100 > cargoValueThere) {
					potentialTrades.push('one ' + view.commodityIcon(i) + data.commodities[i].name + ", worth " + Math.floor(tradedThere[i]*100) + " back home");
				}
			};
			for (i in canBuyTwo) {
				if (tradedThere[i] * 200 > cargoValueThere) {
					potentialTrades.push("two " + view.commodityIcon(i) + data.commodities[i].name + ", worth " + Math.floor(tradedThere[i]*200) + " back home");
				}
			};
			var passageString = "You made it to "+units[0].location.name+"!<p>The people here can use the cargo you've brought.  If you give it to them, your reputation here will rise by "+cargoValueHere+".<p>";
			if (cargoValueHere < cargoValueThere) {
				passageString += "The people of "+units[0].location.name+" do not value your cargo as much as your neighbors back home (they'd value it around "+cargoValueThere+").  ";
			} else {
				passageString += "The people of "+units[0].location.name+" value your cargo more than your neighbors back home (who'd value it around "+cargoValueThere+").  ";
			};
			passageString += "That doesn't especially matter, however.  What matters is if you can bring back something that the people in "+players.p1.hometown.name+" value highly.<p>";
			if (potentialTrades.length == 0) {
				passageString += "It doesn't appear that the townsfolk of "+units[0].location.name+" have anything that fits the bill, though.  Maybe the next town will have something that will make a good trade.";
			players.p1.eventLog.firstArrival = false;
			} else {
				passageString += "You could trade your cargo for " + gamen.prettyList(potentialTrades,'or') + ".";
			};
			gamen.displayPassage(new Passage(passageString,undefined,false));
			if (potentialTrades.length > 0) {
				events.tutorial_howToTrade();
			};
		};
	},
	
	tutorial_howToTrade: function() {
		gamen.displayPassage(new Passage('To set up a trade, click on the <span class="fa fa-cart-arrow-down"></span> on your cart display on the left and the <span class="fa fa-cart-plus"></span> icons in the town display on the right.<p>This will send those commodities down to the Trade Window underneath the map.  The change in your reputation that the trade will produce is displayed in the center of the Trade Window.  As long as that number is green, the people here will make the trade.<p>After the trade is complete, the values for the traded commodities will slowly change in this town.  Commodities that you delivered will reduce in value.  Commodities that you took will rise in value.<p>Dismiss this message and make your trade, then head back home with your treasures.',undefined,false));
	},
	
	tutorial_returnHome: function() {
		var cargo = [units[0].commodities[2],units[0].commodities[3]];
		var tradedHere = units[0].location.trading();
		if (cargo[0] !== undefined) {
			var cargoValueHere = tradedHere[cargo[0].commodity];
		};
		if (cargo[1] !== undefined) {
			cargoValueHere += units[0].location.trading()[cargo[1].commodity];
		};
		cargoValueHere = Math.floor(cargoValueHere * 100);
		var passageString = "You have returned home ";
		if (cargoValueHere + units[0].location.reputation.p1 > 100) {
			players.p1.eventLog.returnHome = true;
			passageString += "with a cart full of valuables your community can make good use of.<p>To give these commodities to your community, click on the <span class='fa fa-cart-arrow-down'></span> icons in your cart display on the left and hit the Trade button.<p>Your reputation here will rise by " + cargoValueHere + ".  By delivering valuable commodities to more than one community, your reputation grows.  This will allow you to move more necessary goods between even more communities.<p>Maintaining a good reputation will also allow you to resupply your provisions by clicking on the <span class='fa fa-refresh'></span> icons in your cart display on the left.  Your project runs on the bellies of you and your friends, so don't forget to top off your stocks of provisions whenever you can.";
			var further = true;
		} else {
			passageString += "without much to show for your troubles.<p>Never fear, however.  You can swap out your cargo for something else.  While you're here, you can also click on the <span class='fa fa-refresh'></span> icons to resupply your food and water.  Then head back out there and find somebody who needs what you've got."
		};
		gamen.displayPassage(new Passage(passageString,undefined,false));
		if (further) {events.tutorial_further()};
	},
	
	tutorial_further: function() {
		gamen.displayPassage(new Passage("Your first trip down the Phoenix Road has proven that you can connect the disparate towns of the wasteland together with trade and mutual support.  You <em>can</em> make this blasted world a better place.<p>Take a look at the progress bars in the upper right hand corner of your screen. These bars track the needs of your community: Hunger, Shelter, and Safety.  As you continue to move commodities and better living conditions, you may notice these progress bars shift, both in your hometown and in the places your travels take you.<p>Pushing those progress bars to completion indicates that you have recreated the security and comforts of the world before.  Completing all progress bars in all towns indicates that you have rebuilt civilization.<p>The power is in your hands.  A world of plenty and safety is waiting for you... down the Phoenix Road.",undefined,false));
	},
	
	tutorial_cartwright: function() {
		players.p1.eventLog.cartwright = true;
		gamen.displayPassage(new Passage("This town boasts a cartwright, a builder of carts and wagons.  If you provide the right materials -- or have a great enough reputation in town to acquire them locally -- the cartwright will build you another cart.  Recruiting some eager young people from the town should be easy, and then you'll have two carts moving materials down the Phoenix Road."));
	},
	
	// Core Random Events
	
	globalEvents: ["aurochs", "drought", "fire", "flood", "mysteriousSite", "oldWorldCache", "plague", "raid", "refugees", "respawnInfrastructure", "roadRefugees", "threat", "war"],
	appendEventsAtStart: ['threat','raid','war'],
	
	loadEvents: function() {
		var startEvents = [];
		for (var e of events.globalEvents) {
			if (events.appendEventsAtStart.indexOf(e) == -1) {
				startEvents.push(e);
			};
		};
		var half = Math.floor(startEvents.length/2);
		model.globalEventStack = startEvents.slice(0,half);
		model.globalSequesteredEvents = startEvents.slice(half);
		model.globalSequesteredEvents = model.globalSequesteredEvents.concat(events.appendEventsAtStart);
	},
		
	aurochs: function() {
		var unit = units[Math.random() * units.length << 0];
		if (unit.inTransit && !unit.airborne) {
			view.displayUnit(unit,true);
			var passageString = unit.name + " encounters a wandering aurochs.  This huge bovine beast stands as tall as a small hut, and has horns bigger than a farmer's thigh (~4<span class='fa fa-hand-rock-o'></span>).";
			passageString += "<p>Your "+model.selfDefense(unit,'display')+" drivers do enjoy a good steak...";
			var choiceArray = [new Choice("Fire up the Barbeque!",events.aurochsAttack),new Choice('Avoid The Beast')];
			gamen.displayPassage(new Passage(passageString,choiceArray,false));
		};
	},
	
	aurochsAttack: function(unitIndex) {
		var unit = view.focus.unit;
		var passageString = "Your crew chases down the beast until it's cornered.";
		var defenseScore = model.selfDefense(unit);
		var attackScore = 4 * Math.random();
		if (defenseScore > attackScore) {
			passageString += "<p>The aurochs fights like the bovine monster it is, but your crew prevails.  They carve up the carcass and add it to their provisions.";
			unit.commodities.push({commodity:'food',qty:100});
		} else {
			var lostCommodityIndex = Math.random * unit.commodities.length << 0;
			unit.commodities[lostCommodityIndex].qty /= 2;
			view.displayUnit(unit,true);
			passageString += "<p>The two-ton animal then turns on you, bellowing and stomping, its huge horns swinging left and right.  Your crew scatters, and barely manage to escape with their lives.";
			passageString += "<p>In the chaos and confusion, the beast smashes into the "+unit.type.name+", destroying half a load of " + view.commodityIcon(unit.commodities[lostCommodityIndex].commodity) + " " + data.commodities[unit.commodities[lostCommodityIndex].commodity].name+ ".";
		};
		gamen.displayPassage(new Passage(passageString));
	},
		
	bandits: function() {
		var unit = units[Math.random() * units.length << 0];
		if ( ( unit.location == undefined  && !unit.airborne ) || unit.location.infrastructure.length == 0) {
			view.focus.unit = unit;
			view.displayUnit(unit,true);
			var threat = model.nearestThreat(unit.route[0].x,unit.route[0].y).threat;
			var cargoIndex = Math.random() * unit.commodities.length << 0;
			var passageString = unit.name + " is beset by bandits from "+threat.name+"!<p>They demand you turn over your load of "+view.commodityIcon(unit.commodities[cargoIndex].commodity)+" "+data.commodities[unit.commodities[cargoIndex].commodity].name+" or face the consequences.";
			passageString += "<p>It is your "+model.selfDefense(unit,'display')+" drivers against "+threat.strength+" dangerous bandits. ("+threat.strength+"<span class='fa fa-hand-rock-o'></span>)";
			var choiceArray = [new Choice('Surrender the Goods',events.banditsSurrender,[cargoIndex,unit]),new Choice('Defend the Cargo',events.banditsDefend,[threat,unit])];
			gamen.displayPassage(new Passage(passageString,choiceArray,false));
		};
	},
	
	banditsSurrender: function(cargoIndex,unit) {
// 		var unit = view.focus.unit;
		gamen.displayPassage(new Passage("The cackling bandits quickly and efficiently offload the "+view.commodityIcon(unit.commodities[cargoIndex].commodity)+" "+data.commodities[unit.commodities[cargoIndex].commodity].name+" and you get the hell out of there."));
		unit.commodities.splice(cargoIndex,1);
		view.displayUnit(unit,true);
	},
	
	banditsDefend: function(threat,unit) {
// 		var unit = view.focus.unit;
		var defenseScore = model.selfDefense(unit);
		var attackScore = threat.strength * Math.random();
		if (defenseScore > attackScore) {
			passageString = "<p>With a bit of quick thinking, the crew manages to overcome their would-be attackers and make an escape.";
		} else {
			passageString = "<p>The fight is short, vicious, and not in your favor.  The bandits quickly overwhelm the crew and ransack the " + unit.type.name + ".  The crew escapes with their lives and tatters of their cargo.";
			for (var i in unit.commodities) {
				unit.commodities[i].qty = Math.ceil(unit.commodities[i].qty * (20 + Math.random() * 30)/100);
			};
			view.displayUnit(unit,true);
		};
		gamen.displayPassage(new Passage(passageString));
	},

	drought: function()  {
		var site = sites[Math.random() * sites.length << 0];
		if (site.population > 0) {
			var infrastructureList = [];
			if (site.resources.indexOf(data.resources.river) !== -1) {
				infrastructureList.push(data.resources.river.name);
			};
			for (var i of ['cisterns','well','aqueduct']) {
				if (site.infrastructure.indexOf(data.infrastructure[i]) !== -1) {
					infrastructureList.push(data.infrastructure[i].name);
				};
			};
			if (infrastructureList.length > 0) {
				site.commodities.water *= 1.25;
				site.commodities.food *= 1.25;
				passageString = "A severe drought hits " + site.name + ", but its effects are mitigated by their " + gamen.prettyList(infrastructureList) + '.';
			} else {
				site.commodities.water *= 2;
				site.commodities.food *= 2;
				passageString = "Drought in " + site.name + ".  "+view.commodityIcon('food')+" Food and "+view.commodityIcon('water')+" Water become scarse and valuable.";
			};
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage(passageString));
			};
		};
	},
	
	fire: function()  {
		var site = sites[Math.random() * sites.length << 0];
		if (site.population > 0) {
			var index = Math.random() * site.infrastructure.length << 0;
			var outputs = [];
			var passageString = "A terrible fire rips through " + site.name + ".  Their " + site.infrastructure[index].name + " is completely destroyed.";
			if (site.infrastructure[index].outputs !== undefined) {
				for (var o of site.infrastructure[index].outputs) {
					site.logTransaction(o,5);
					outputs.push(view.commodityIcon(o)+" "+data.commodities[o].name);
				};
				passageString += " The value of " + gamen.prettyList(outputs) + " rises.";
			};
			site.destroyInfrastructure(site.infrastructure[index]);
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage(passageString));
			};
		} else {
			site.infrastructure = [];
			site.trash.push({commodity:'lumber',qty:Math.random()*90});
			site.trash.push({commodity:'stone',qty:Math.random()*90});
			passageString = "The ghost town of "+site.name+" goes up in flames.  Nothing is left but a charred husk.";
			gamen.displayPassage(new Passage(passageString));
		};
	},
	
	flood: function()  {
		var site = sites[Math.random() * sites.length << 0];
		if (site.resources.indexOf(data.resources.river) !== -1) {
			var index = Math.random() * site.infrastructure.length << 0;
			var outputs = [];
			var passageString = "The river floods in " + site.name + ".  The " + site.infrastructure[index].name + " is completely destroyed.";
			if (site.infrastructure[index].outputs !== undefined) {
				for (var o of site.infrastructure[index].outputs) {
					site.logTransaction(o,5);
					outputs.push(view.commodityIcon(o)+" "+data.commodities[o].name);
				};
				passageString += " The value of " + gamen.prettyList(outputs) + " rises.";
			};
			site.destroyInfrastructure(site.infrastructure[index]);
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage(passageString));
			};
		};
	},
	
	mysteriousSite: function()  {
		var unit = units[Math.random() * units.length << 0];
		if (unit.inTransit) {
			var randomX = (Math.random() * 30 + 30);
			var randomY = (Math.random() * 30 + 30);
			if (Math.random() > 0.5) {randomX *= -1};
			if (Math.random() > 0.5) {randomY *= -1};
			mysteryX = Math.round(unit.route[0].x + randomX,0);
			mysteryY = Math.round(unit.route[0].y + randomY,0);
			var tooClose = false;
			for (var s in sites) {
				if (Math.pow(Math.pow(sites[s].x - mysteryX,2) + Math.pow(sites[s].y - mysteryY,2),0.5) < model.options.newGame.minDist) {
					tooClose = true;
				};
			};
			if (!tooClose) {
				gamen.displayPassage(new Passage(unit.name + " sights a mysterious shape on the horizon."));
				var mysteriousSite = new Site();
				mysteriousSite.name = "??";
				mysteriousSite.x = mysteryX;
				mysteriousSite.y = mysteryY;
				mysteriousSite.neighbors = [];
				mysteriousSite.nearestThreat = model.nearestThreat(mysteriousSite.x,mysteriousSite.y);
				players.p1.knownSites.push(mysteriousSite);
				var mysteryTypes = ['ghostTown','forgottenCache','refugeeCamp','ghostTown','forgottenCache','refugeeCamp','crashSite'];
				var mysteryType = mysteryTypes[Math.random() * mysteryTypes.length << 0];
				mysteriousSite.arrivalEventsList = [mysteryType];
				if (mysteryType == 'ghostTown') {
					mysteriousSite.ghost();
				} else if (mysteryType == 'forgottenCache') {
					mysteriousSite.ghost();
					mysteriousSite.infrastructure = [];
					mysteriousSite.resources = [];
					mysteriousSite.trash = [];
					for (var i=0;i<10;i++) {
						var randomCommodity = Object.keys(data.commodities)[Math.random() * Object.keys(data.commodities).length << 0];
						if (randomCommodity == 'passengers') {randomCommodity = 'ore'};
						if (randomCommodity == 'scrip') {randomCommodity = 'fuel'};
						if (randomCommodity == 'mail') {randomCommodity = 'metals'};
						mysteriousSite.trash.push({commodity:randomCommodity,qty:Math.ceil(Math.random()*100)});
					};
				} else if (mysteryType == 'crashSite') {
					mysteriousSite.ghost();
					mysteriousSite.infrastructure = [];
					mysteriousSite.resources = [];
					mysteriousSite.trash = [];
					for (var i=0;i<6;i++) {
						var randomCommodity = ['metals','metals','cloth','cloth','cloth','fuel','fuel','mail'][Math.random() * 5 << 0]
						mysteriousSite.trash.push({commodity:randomCommodity,qty:100});
					};
				} else if (mysteryType == 'refugeeCamp') {
					mysteriousSite.population = Math.ceil(Math.random() * 80 + 20);
					mysteriousSite.infrastructure = [];
					mysteriousSite.resources = [];
					mysteriousSite.carpet = [];
					for (var c in mysteriousSite.commodities) {
						mysteriousSite.commodities[c] = data.commodities[c].baseValue * .03;
					};
				};
				view.displayMap();
			};
		};
	},
	
	oldWorldCache: function()  {
		var site = sites[Math.random() * sites.length << 0];
		var commodities = ['clothing','fuel','metals'];
		var commoditiesList = [];
		for (var i of commodities) {
			site.logTransaction(i,Math.random() * Math.random() * 10);
			commoditiesList.push(view.commodityIcon(i)+" "+data.commodities[i].name);
		};
		if (site.hasVisited.p1) {
			gamen.displayPassage(new Passage("The people at " + site.name + " have uncovered a large cache of old world goods.  The values of " + gamen.prettyList(commoditiesList) + " drop!"));
		};
	},
	
	plague: function()  {
		var site = sites[Math.random() * sites.length << 0];
		if (site.population > 0) {
			var housing = 0;
			for (var i in site.infrastructure) {
				if (site.infrastructure[i].housing !== undefined) {
					housing += site.infrastructure[i].housing;
				};
			};
			var deathRate = Math.random() * Math.random();
			var housedDeaths = Math.ceil(deathRate * Math.min(site.population,housing));
			var unhousedDeaths = Math.ceil(0.5 * deathRate * Math.max(0,site.population - housing));
			var deathRatio = Math.ceil((housedDeaths+unhousedDeaths)/site.population * 100);
			var passageString = "Disease strikes " + site.name + ".  "
			if (unhousedDeaths > 0) {
				passageString += "Those without proper housing are hit hardest, and "+gamen.prettyNumber(unhousedDeaths)+" die in the streets.  ";
			};
			if (housedDeaths > 0) {
				if (housedDeaths == 1) {var conjugate = 'es',nounPlural = '';} else {var conjugate = '',nounPlural = 's';};
				var housedDeathString = gamen.prettyNumber(housedDeaths);
				housedDeathString = housedDeathString.charAt(0).toUpperCase() + housedDeathString.slice(1);
				passageString += housedDeathString + " pass" + conjugate + " in the comfort of their home"+nounPlural+".  ";
			};
			passageString += "All told, "+deathRatio+"% of the population perishes.";
			site.population -= unhousedDeaths + housedDeaths;
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage(passageString));
			};

			for (var i of ['clothing','fuel','tack','food','water']) {
				site.logTransaction(i,(housedDeaths+unhousedDeaths)/-20)
			};


		};
	},
	
	raid: function()  {
		var threat = sites[Math.random() * sites.length << 0].nearestThreat.threat;
		var targetList = [];
		var furthestTarget = 0;
		for (var i of threat.targets) {
			if (i.distance > furthestTarget) {
				furthestTarget = i.distance
			};
		};
		for (var d=0;d<furthestTarget;d=d+furthestTarget/5) {
			for (i of threat.targets) {
				if (i.distance < d && sites[i.siteIndex].population > 0) {
					targetList.push(sites[i.siteIndex]);
				};
			};
		};
		var site = targetList[Math.random() * targetList.length << 0];
		var passageString = threat.name + " launches a raid against " + site.name + ".";
		if (Math.random() > site.defenses() / threat.strength) {
			passageString += "<p>The raiders crash against the town defenses, but do not breach them.";
		} else {
			passageString += "<p>The town's defenses collapse in the face of the attack.  Raiders ransack the town, looting stockpiles and stores.";
			for (var i in site.trading()) {
				site.logTransaction(i,Math.random()*5 << 0);
			};
			if (Math.random() < 0.2) {
				var burnIndex = Math.random() * site.infrastructure.length << 0
				passageString += "<p>Worse, the town's " + site.infrastructure[burnIndex].name + " is destroyed in the fighting.";
// 				site.infrastructure.splice(burnIndex,1);
				site.destroyInfrastructure(site.infrastructure[burnIndex]);
				var kills = Math.floor(site.population * Math.random() / 5);
				if (kills > 0) {
					passageString += " " + kills + " souls are lost in the battle.";
					site.population -= kills;
				};
			};
		};
		
		if (site.hasVisited.p1) {
			gamen.displayPassage(new Passage(passageString));
		};
	},
	
	refugees: function()  {
		var site = sites[Math.random() * sites.length << 0];
		var number = Math.ceil(Math.random() * Math.random() * 80 + 20);
		if (site.population > 0) {
			var commodities = ['clothing','fuel','tack','food','water'];
			var commoditiesList = [];
			for (var i of commodities) {
				site.logTransaction(i,number/20)
				commoditiesList.push(view.commodityIcon(i)+" "+data.commodities[i].name);
			};
			site.population += number;
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage("A bedraggled band of " +number+ " refugees arrive at " + site.name + ".  The locals begrudgingly tolerate the newcomers settling in.  The values of " + gamen.prettyList(commoditiesList) + " rise."));
			};
		} else {
			site.population += number;
			gamen.displayPassage(new Passage("A band of refugees settles in the ghost town of "+site.name+", bringing new life to the place.  Hopefully they can make the town work where the previous residents failed."));
			view.displayMap();
		};
	},
	
	respawnInfrastructure: function() {
		var infrastructure = ['tinkerCamp','nakedDowser','cartwright','mechanic','arena','lensmeister','hangar'];
		var infrastructureCheck = {};
		for (var i of infrastructure) {
			infrastructureCheck[i] = false;
		};
		for (var s in sites) {
			for (var i of infrastructure) {
				if (sites[s].population < 1 && sites[s].infrastructure.indexOf(data.infrastructure[i]) !== -1) {
					sites[s].infrastructure.splice(sites[s].infrastructure.indexOf(data.infrastructure[i]),1);
				};
				if (sites[s].infrastructure.indexOf(data.infrastructure[i]) !== -1) {infrastructureCheck[i] = true;};
			};
		};
		if (players.p1.unitsUnlocked.tinkersCart) {infrastructureCheck.tinkerCamp = true;};
		if (players.p1.unitsUnlocked.dowser) {infrastructureCheck.nakedDowser = true;};
		var respawned = false;
		for (var i in infrastructureCheck) {
			if (!infrastructureCheck[i] && !respawned) {
				respawned = true;
				var newSite = sites[Math.random() * sites.length << 0];
				if (newSite.population > 0) {
					newSite.infrastructure.push(data.infrastructure[i]);
					if (newSite.hasVisited.p1) {
						gamen.displayPassage(new Passage (data.infrastructure[i].spawn,undefined,true,newSite.name));
					};
				};
			};
		};
	},
	
	roadRefugees: function() {
		var unit = units[Math.random() * units.length << 0];
		view.focus.unit = unit;
		view.displayUnit(unit,true);
		if (unit.caravan !== undefined) {
			for (var i in unit.caravan) {
				if (unit.caravan[i].type.canPassenger) {
					view.focus.unit = unit.caravan[i];
					view.displayUnit(unit.caravan[i],true);
				};
			};
		};
		if (unit.inTransit && !unit.offroad && !unit.airborne) {
			var numberRefugees = Math.max(Math.floor(Math.random() * 12 << 0),10);
			var passageString = unit.name + " comes across "+numberRefugees+" people shuffling down the road.  They look tired and half-starved; who knows if they'll make it to where they're going.";
			if (unit.type.canPassenger) {
				var choiceArray = [new Choice("Give Them a Ride",events.roadRefugeesTake,[numberRefugees]),new Choice("Split Provisions with Them",events.roadRefugeesFeed,[numberRefugees]),new Choice("Leave Them")];
			} else {
				var choiceArray = [new Choice("Split Provisions with Them",events.roadRefugeesFeed,[numberRefugees]),new Choice("Wish Them Luck")];
			};
			gamen.displayPassage(new Passage(passageString,choiceArray,false));
		};
	},
	
	roadRefugeesTake: function(numberRefugees) {
		view.focus.unit.commodities.push({commodity:'Passengers',qty:numberRefugees*10});
	},
	
	roadRefugeesFeed: function(numberRefugees) {
		var fed = 0;
		var caravan = [view.focus.unit];
		if (view.focus.unit.caravan !== undefined) {
			caravan = view.focus.unit.caravan;
		};
		for (var u in caravan) {
			for (var i in caravan[u].commodities) {
				if (fed < numberRefugees * 10 && caravan[u].commodities[i].commodity == 'food') {
					fed += caravan[u].commodities[i].qty / 2;
					caravan[u].commodities[i].qty /= 2;
				};
			};
		};
		view.displayUnit(view.focus.unit,true);
		gamen.displayPassage(new Passage("The refugees gratefully accept your generosity, showering you with well wishes and blessings."));
	},
	
	threat: function() {
		events.bandits();
	},
	
	war: function() {
		var spoils = sites[Math.random() * sites.length << 0];
		var threatA = spoils.nearestThreat.threat;
		var threatB = sites[Math.random() * sites.length << 0].nearestThreat.threat;
		if (threatA != threatB) {
			var passageString = threatB.name+" sparks a petty war with "+threatA.name+", fighting over the town of "+spoils.name+".<p>";
			if (Math.random() > 0.5) {
				passageString += "The fighting is intense but brief, and in the end, "+threatB.name+" wins the day.  "+threatB.name+" grows powerful while "+threatA.name+" is crippled.";
				threatB.strength++;
				threatA.strength--;
			} else {
				passageString += "The fighting is intense but brief, but in the end, "+threatA.name+" defends its turf.  "+threatA.name+" grows powerful while "+threatB.name+" is crippled.";
				threatB.strength--;
				threatA.strength++;
			};
			if (spoils.hasVisited.p1) {
				gamen.displayPassage(new Passage(passageString));
			};
		};
	},
		
	// Mysterious Site Arrival Events
	
	ghostTown: function(site) {
		var potentialNames = [];
		for (var s of site.infrastructure) {
			if (s.outputs !== undefined) {
				potentialNames.push(s);
				potentialNames.push(s);
			} else {
				potentialNames.push(s);
			};
		};
		var suffix = potentialNames[Math.random() * potentialNames.length << 0].name
		suffix = suffix.split(" ").splice(-1);
		var prefices = ['Lost ','Abandoned ','Old ','Empty ','Ruined '];
		site.name = prefices[Math.random() * prefices.length << 0] + suffix;
		gamen.displayPassage(new Passage("Nothing but a ghost town, long abandoned."));
	},
	
	forgottenCache: function(site) {
		site.name = "Cache";
		if (site.trash.length > 0) {
			passageString = "It seems you've stumbled across a cache of old world goods!";
		} else {
			passageString = "Nothing but a crumbled building.  Recent tracks suggest somebody found something worth looting, just before you got here.";
		};
		gamen.displayPassage(new Passage(passageString));
	},
	
	crashSite: function(site) {
		site.name = "Crash Site";
		if (site.trash.length > 0) {
			passageString = "Something huge and metal seems to have crashed here.  Sheets of cloth hang off of the twisted wreck, stirring in the faint wind.";
		} else {
			passageString = "You find an impact crater, signs of fires, and tracks indicating that, whatever it was that crashed here, its remains have already been hauled away.";
		};
		gamen.displayPassage(new Passage(passageString));
	},
	
	refugeeCamp: function(site) {
		site.name = "Camp";
		gamen.displayPassage(new Passage("Refugees, fleeing from danger elsewhere."));
	},

};