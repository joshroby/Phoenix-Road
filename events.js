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
		var passageText = "You've loaded up your Grams' old donkey cart with " +view.commodityIcon('food')+ " Food and " +view.commodityIcon('food')+ " Water for the journey, plus a load of your town's most plentiful commodity: " + view.commodityIcon(cargo) + data.commodities[cargo].name + ".<p>The food is for you and your friend.  The water is for the donkey.  The " + view.commodityIcon(cargo) + data.commodities[cargo].name + " is for somebody out there who needs it more than you do.  Maybe they'll have something they don't need, something plentiful in their town, for which the people here have a dire need.";
		var choiceArray = [new Choice('Continue',events.tutorial_005),new Choice('Turn off Tutorial',events.disableTutorial)];
		gamen.displayPassage(new Passage(passageText,choiceArray));
		gamen.displayPassage(new Passage("Did you want to disable the tutorial?",choiceArray));
	},
	
	tutorial_005: function() {
		gamen.passageQueue = [];
		var cargo = units[0].commodities[2].commodity;
		gamen.displayPassage(new Passage("It's time to hit the road.  After you've dismissed this message, click on your donkey cart to select it.<p>You can then click on another town on the map and you'll start heading there.<p>Before you go, though, you might want to request another load of a commodity.  Click on any of the <span class='fa fa-cart-plus'></span> icons next to the commodity you want to ask for and then click on the Trade button below the map.  Your cart can carry one more load.  Do you want another " + view.commodityIcon(cargo) + data.commodities[cargo].name + ", or something different? "+data.commodities[units[0].commodities[2].commodity].name+" is cheap, but carrying two different commodities increases the chances that the people out there will find it useful."));
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

};