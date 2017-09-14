var events = {

	disableTutorial: function() {
		model.options.tutorials = false;
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
		gamen.displayPassage(new Passage(passageText,choiceArray));
		gamen.displayPassage(new Passage("Did you want to disable the tutorial?",choiceArray));
	},

	tutorial_002: function() {
		gamen.passageQueue = [];
		view.displaySiteDetails(units[0].location);
		var passageText = "Since you grew up here, you have a respectable reputation as a trustworthy individual.  Townsfolk will just give you most of what you ask for, trusting you to do something worthwhile with the materials.  You've spent your whole life doing the same, sharing what you have with townsfolk who need it.<p>Of course, your reputation has its limits.  If you ask for too much, you'll get turned down. Some things, too, are more valuable than your reputation merits.  You can see a measure of your reputation in the town on the right, in green.  Your reputation here is "+Math.floor(units[0].location.reputation.p1)+".";
		var choiceArray = [new Choice('Continue',events.tutorial_003),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray));
		gamen.displayPassage(new Passage("Did you want to disable the tutorial?",choiceArray));
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
				passageText += "<p>Your town does boast a "+i.name+", which produces "+gamen.prettyList(outputs)+".  Consequently, these commodities are a little more plentiful, and folks are more likely to hand them over.";
			};
		} else {
			passageText += "<p>There's no organized industry in your hometown.  Everyone's just too desperate to scrounge up enough food to eat.  Nobody has the time or resources to organize a going concern.";
		};
		view.displaySiteDetails(units[0].location);
		var choiceArray = [new Choice('Continue',events.tutorial_004),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray));
		gamen.displayPassage(new Passage("Did you want to disable the tutorial?",choiceArray));
	},

	tutorial_004: function() {
		gamen.passageQueue = [];
		var cargo = units[0].commodities[2].commodity;
		view.displayUnit(units[0]);
		var passageText = "You've loaded up your Grams' old donkey cart with " +view.commodityIcon('food')+ " Food and " +view.commodityIcon('water')+ " Water for the journey, plus a load of your town's most plentiful commodity: " + view.commodityIcon(cargo) + data.commodities[cargo].name + ".<p>The food is for you and your friend.  The water is for the donkey.  The " + view.commodityIcon(cargo) + data.commodities[cargo].name + " is for somebody out there who needs it more than you do.  Maybe they'll have something they don't need, something plentiful in their town, for which the people here have a dire need.";
		var choiceArray = [new Choice('Continue',events.tutorial_005),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray));
		gamen.displayPassage(new Passage("Did you want to disable the tutorial?",choiceArray));
	},
	
	tutorial_005: function() {
		gamen.passageQueue = [];
		var cargo = units[0].commodities[2].commodity;
		gamen.displayPassage(new Passage("It's time to hit the road.  After you've dismissed this message, click on your donkey cart to select it.<p>You can then click on another town on the map and you'll start heading there.<p>Before you go, though, you might want to request another load of a commodity.  Click on any of the <span class='fa fa-cart-plus'></span> icons next to the commodity you want to ask for and then click on the Trade button below the map.  Your cart can carry one more load.  Do you want another " + view.commodityIcon(cargo) + data.commodities[cargo].name + ", or something different? "+data.commodities[units[0].commodities[2].commodity].name+" is cheap, but carrying two different commodities increases the chances that the people out there will find what you've got useful."));
	},
	
	tutorial_firstArrival: function() {
		players.p1.eventLog.firstArrival = true;
		var cargo = [units[0].commodities[2],units[0].commodities[3]];
		var tradedHere = units[0].location.trading();
		var tradedThere = players.p1.hometown.trading();
		var cargoValueHere = tradedHere[cargo[0].commodity];
		var cargoValueThere = tradedThere[cargo[0].commodity];
		if (cargo[1] !== undefined) {
			cargoValueHere += units[0].location.trading()[cargo[1].commodity];
			cargoValueThere += players.p1.hometown.trading()[cargo[1].commodity];
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
		gamen.displayPassage(new Passage(passageString));
		if (potentialTrades.length > 0) {
			events.tutorial_howToTrade();
		};
	},
	
	tutorial_howToTrade: function() {
		gamen.displayPassage(new Passage('To set up a trade, click on the <span class="fa fa-cart-arrow-down"></span> on your cart display on the left and the <span class="fa fa-cart-plus"></span> icons in the town display on the right.<p>This will send those commodities down to the Trade Window underneath the map.  The change in your reputation that the trade will produce is displayed in the center of the Trade Window.  As long as that number is green, the people here will make the trade.<p>After the trade is complete, the values for the traded commodities will slowly change in this town.  Commodities that you delivered will reduce in value.  Commodities that you took will rise in value.<p>Dismiss this message and make your trade, then head back home with your treasures.'));
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
			passageString += "with a cart full of valuables your community can make good use of.<p>To give these commodities to your community, click on the <span class='fa fa-cart-arrow-down'></span> icons in your cart display on the left and hit the Trade button.<p>Your reputation here will rise by " + cargoValueHere + ".  By delivering valuable commodities to more than one community, your reputation grows.  This will allow you to move more necessary goods between even more communities.<p>Maintaining a good reputation will also allow you to refresh your provisions by clicking on the <span class='fa fa-refresh'></span> icons in your cart display on the left.  Your project runs on the bellies of you and your friends, so don't forget to top off your stocks of provisions whenever you can.";
			var further = true;
		} else {
			passageString += "without much to show for your troubles.<p>Never fear, however.  You can swap out your cargo for something else.  While you're here, you can also click on the <span class='fa fa-refresh'></span> icons to refresh your food and water.  Then head back out there and find somebody who needs what you've got."
		};
		gamen.displayPassage(new Passage(passageString));
		if (further) {events.tutorial_further()};
	},
	
	tutorial_further: function() {
		gamen.displayPassage(new Passage("Your first trip down the Phoenix Road has proven that you can connect the disparate towns of the wasteland together with trade and mutual support.  You <em>can</em> make this blasted world a better place.<p>Take a look at the progress bars in the upper right hand corner of your screen. These bars track the needs of your community: Hunger, Shelter, and Safety.  As you continue to move commodities and better living conditions, you may notice these progress bars shift, both in your hometown and in the places your travels take you.<p>Pushing those progress bars to completion indicates that you have recreated the security and comforts of the world before.  Completing all progress bars in all towns indicates that you have rebuilt civilization.<p>The power is in your hands.  A world of plenty and safety is waiting for you... down the Phoenix Road."));
	},
	
	tutorial_cartwright: function() {
		players.p1.eventLog.cartwright = true;
		gamen.displayPassage(new Passage("This town boasts a cartwright, a builder of carts and wagons.  If you provide the right materials -- or have a great enough reputation in town to acquire them locally -- the cartwright will build you another cart.  Recruiting some eager young people from the town should be easy, and then you'll have two carts moving materials down the Phoenix Road."));
	},
	
	randomEvents: {
	
		angryAurochs: function() {
			var unit = units[Math.random() * units.length << 0];
			var passageString = unit.name + " encounters an angry aurochs!";
			var defenseScore = unit.type.crew * players.p1.selfDefense * Math.random();
			var attackScore = 5 * Math.random();
			if (defenseScore > attackScore) {
				passageString += "  The crew manages to subdue the beast, carving up the carcass and adding it to their provisions.";
				unit.commodities.push({commodity:'food',qty:100});
			} else {
				passageString += "  They barely manage to escape with their lives!";
			};
			gamen.displayPassage(new Passage(passageString));
		},
		
		bandits: function() {
			var unit = units[Math.random() * units.length << 0];
			var threat = {name:"the wilderness",strength: 2};
			if (unit.location !== undefined) {
				var threat = unit.location.nearestThreat.threat;
			} else {
				var threat = undefined;
				var threatDistance = Infinity;
				for (var i in sites) {
					var distance = Math.pow(Math.pow(sites[i].x - unit.route[0].x,2) + Math.pow(sites[i].y - unit.route[0].y,2),0.5);
					if (sites[i].threat !== undefined && distance < threatDistance) {
						threatDistance = distance;
						threat = sites[i].threat;
					};
				};
			};
			var defenseScore = unit.type.crew * players.p1.selfDefense * Math.random();
			var attackScore = threat.strength * Math.random();
			var passageString = unit.name + " are beset by bandits from "+threat.name+"!";
			if (defenseScore > attackScore) {
				passageString += "<p>With a bit of quick thinking, the crew manages to overcome their would-be attackers and make an escape.";
			} else {
				passageString += "<p>The bandits quickly overwhelm the crew and ransack the " + unit.type.name + " of its valuables.";
				for (var i in unit.commodities) {
					if (unit.commodities[i].qty > 50 && (unit.commodities[i].commodity !== 'food' && unit.commodities[i].commodity !== 'water') ) {
						unit.commodities[i].qty = 10;
					};
				};
			};
			gamen.displayPassage(new Passage(passageString));
		},
	
		drought: function()  {
			var site = sites[Math.random() * sites.length << 0];
			var infrastructureList = [];
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
		},
		
		fire: function()  {
			var site = sites[Math.random() * sites.length << 0];
			var index = Math.random() * site.infrastructure.length << 0;
			var outputs = [];
			var passageString = "A terrible fire rips through " + site.name + ".  Their " + site.infrastructure[index].name + " is completely destroyed.";
			if (site.infrastructure[index].outputs !== undefined) {
				for (var o of site.infrastructure[index].outputs) {
					site.commodities[o] *= 1.25;
					outputs.push(view.commodityIcon(o)+" "+data.commodities[o].name);
				};
				passageString += " The value of " + gamen.prettyList(outputs) + " rises.";
			};
			site.infrastructure.splice(index,1);
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage(passageString));
			};
		},
		
		flood: function()  {
			var site = sites[Math.random() * sites.length << 0];
			if (site.resources.indexOf(data.resources.river !== -1)) {
				var index = Math.random() * site.infrastructure.length << 0;
				var outputs = [];
				var passageString = "The river floods in " + site.name + ".  The " + site.infrastructure[index].name + " is completely destroyed.";
				if (site.infrastructure[index].outputs !== undefined) {
					for (var o of site.infrastructure[index].outputs) {
						site.commodities[o] *= 1.25;
						outputs.push(view.commodityIcon(o)+" "+data.commodities[o].name);
					};
					passageString += " The value of " + gamen.prettyList(outputs) + " rises.";
				};
				site.infrastructure.splice(index,1);
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
				};
			};
		},
		
		oldWorldCache: function()  {
			var site = sites[Math.random() * sites.length << 0];
			var commodities = ['clothing','fuel','metals'];
			var commoditiesList = [];
			for (var i of commodities) {
				site.commodities[i] *= (Math.random() + Math.random())/4 + 0.5;
				commoditiesList.push(view.commodityIcon(i)+" "+data.commodities[i].name);
			};
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage("The people at " + site.name + " have uncovered a large cache of old world goods.  The values of " + gamen.prettyList(commoditiesList) + " drop!"));
			};
		},
		
		plague: function()  {
			var site = sites[Math.random() * sites.length << 0];
			var deaths = Math.ceil(site.population * Math.random() * Math.random());
			site.population -= deaths;
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage("Plague in " + site.name + ".  " + deaths + " people perish."));
			};
		},
		
// 		raid: function()  {
// 			var site = sites[Math.random() * sites.length << 0];
// 			if (site.hasVisited.p1) {
// 				gamen.displayPassage(new Passage("Raid on " + site.name + "."));
// 			};
// 		},
		
		refugees: function()  {
			var site = sites[Math.random() * sites.length << 0];
			var number = Math.ceil(Math.random() * Math.random() * 80 + 20);
			var commodities = ['clothing','fuel','tack'];
			var commoditiesList = [];
			for (var i of commodities) {
				site.commodities[i] *= (number * site.population) / site.population;
				commoditiesList.push(view.commodityIcon(i)+" "+data.commodities[i].name);
			};
			site.population += number;
			if (site.hasVisited.p1) {
				gamen.displayPassage(new Passage("A bedraggled band of " +number+ " refugees arrive at " + site.name + ".  The locals begrudgingly tolerate the newcomers settling in.  The values of " + gamen.prettyList(commoditiesList) + " rise."));
			};
		},
	
	},
	
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