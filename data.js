var data = {

	commodities: {
	
		food: {
			name: 'Food',
			common: true,
			baseValue: 15,
			stability: 6,
			cargo: true,
			icon: 'cutlery',
			iconColor: 'grey',
		},
		
		water: {
			name: 'Water',
			common: true,
			baseValue: 10,
			stability: 3,
			cargo: true,
			icon: 'tint',
			iconColor: 'blue',
		},
		
		lumber: {
			name: 'Lumber',
			common: true,
			baseValue: 30,
			stability: 4,
			cargo: true,
			icon: 'tree',
			iconColor: 'green',
		},
		
		stone: {
			name: 'Stone',
			common: true,
			baseValue: 40,
			stability: 5,
			cargo: true,
			icon: 'institution',
			iconColor: 'darkgrey',
			},
		
		clothing: {
			name: 'Clothing',
			common: true,
			baseValue: 70,
			stability: 2,
			cargo: true,
			icon: 'black-tie',
		},
		
		tack: {
			name: 'Saddles & Tack',
			common: true,
			baseValue: 80,
			stability: 3,
			cargo: true,
			icon: 'link',
			iconColor: 'saddlebrown',
		},
		
		fuel: {
			name: 'Fuel',
			common: true,
			baseValue: 100,
			stability: 2,
			cargo: true,
			icon: 'tint',
			iconColor: 'olive',
		},
		
		fiber: {
			name: 'Fiber',
			common: false,
			baseValue: 20,
			stability: 3,
			cargo: true,
			icon: 'pagelines',
			iconColor: 'gold',
		},
		
		hides: {
			name: 'Hides',
			common: false,
			baseValue: 30,
			stability: 2,
			cargo: true,
			icon: 'joomla',
			iconColor: 'saddlebrown',
		},
		
		ore: {
			name: 'Ore',
			common: false,
			baseValue: 40,
			stability: 6,
			cargo: true,
			icon: 'cloud',
			iconColor: 'grey',
		},
		
		leather: {
			name: 'Leather',
			common: false,
			baseValue: 50,
			stability: 4,
			cargo: true,
			icon: 'ticket',
			iconColor: 'saddlebrown',
		},
		
		crudeOil: {
			name: 'Crude Oil',
			common: false,
			baseValue: 50,
			stability: 3,
			cargo: true,
			icon: 'tint',
		},
		
		cloth: {
			name: 'Cloth',
			common: false,
			baseValue: 60,
			stability: 3,
			cargo: true,
			icon: 'map',
			iconColor: 'cyan',
		},
		
		metals: {
			name: 'Metals',
			common: false,
			baseValue: 100,
			stability: 4,
			cargo: true,
			icon: 'steam',
			iconColor: 'grey',
		},
		
		mail: {
			name: 'Mail',
			common: false,
			baseValue: 30,
			stability: 100,
			cargo: false,
			icon: 'envelope-o',
		},
		
		scrip: {
			name: 'Scrip',
			common: false,
			baseValue: 100,
			stability: 10,
			cargo: false,
			icon: 'bookmark',
			iconColor: 'peru',
		},
		
		passengers: {
			name: 'Passengers',
			common: false,
			baseValue: 0,
			stability: 0,
			cargo: true,
			icon: 'users'
		},
		
	},
	
	infrastructure: {
	
		kidOnABike: {
			name: 'Kid on a Bike',
			unitName: 'Kid on a Bike',
			recruit: 'bicycle',
			recruitCost: {},
			text: "There's a kid here with an ancient but functional bike.",
			passage: "There's a kid here with an ancient but functional bicycle.",
			visible: false,
		},
		nakedDowser:  {
			name: 'Naked Dowser',
			unitName: 'Clothed Dowser',
			recruit: 'dowser',
			recruitCost: {clothing:1,lumber:1},
			text: "This unfortunate dowser is huddled over a pitiful fire... naked.",
			passage: "Just outside of town, you come across a small cart with 'Dowsing Services' painted on the side.  In the shelter afforded by the cart sputters a pitiful fire, and beside the fire, shivering and cursing, is what you assume to be the dowser... naked as a jaybird.<p>At your hesitant inquiry, the dowser warns, 'Careful, the people in that town over yonder don't take kindly to bad news.  They left me like this when I couldn't find a spring some ancient fool swears he used to drink from as a kid.'<p>Whether or not you trade with the town, you wonder if there's anything you can do for the poor dowser.",
			visible: false,
		},
		tinkerCamp: {
			name: 'Tinker Camp',
			unitName: 'Tinker Band',
			recruit: 'tinkersCart',
			recruitCost: {food:8},
			text: "These tinkers are interested in work but skeptical of your ability to feed them.",
			passage: "This small band of tinkers travels town to town doing odd jobs.  When informed of your plans, they suggest they could help in exchange for regular meals.",
			visible: false,
		},
		burntOutBus: {
			name: 'Burnt Out Bus',
			unitName: 'Charred Bus',
			recruit: 'bus',
			recruitCost: {water:2,fuel:1,metals:1},
			text: "This burnt-out husk can be refurbished with a few materials.",
			passage: "You come across a burned-out vehicle, apparently hit by bandits.  It appears it was large enough for its former owners to live in... and die in.  They sure aren't using it anymore...",
			visible: false,
		},
		cartwright: {
			name:'Cartwright',
			buildCost: {lumber:2},
			buildTime: 14,
			goodwill: 1,
			visible: false,
			buildUnits: [
				'donkeyCart',
				'oxCart',
				'horseCart',
				'tinkersCart',
				'dowser'
				],
			inputs: ['tack','lumber','fiber'],
			jobs: 2,
		},
		hangar: {
			name:'Hangar',
			passage: "You come across a huge, old-world building, like half a barrel lying on its side... if that barrel was broader than any tree.  A handful of people mill about outside the structure, working diligently on repairing or building bits of machinery.  Inside... inside is a huge skeleton of metal beams draped in shimmering cloth.<p>At your approach, one of the workers waves a hand in welcome.  'Ah, the trader,' she shouts merrily.  'We've heard about you.  How'd you like to make your deliveries from the sky?'",
			visible: true,
			buildUnits: ['zeppelin'],
			inputs: ['metals','fiber','fuel'],
			jobs: 3,
		},
		lensmeister: {
			name: 'Lensmeister',
			passage: "One of this town's eldest citizens has amassed a sizeable collection of ancient glass lenses.  Some of the pieces in the collection include spyglasses and powerful telescopes.  The elder is happy enough to gift you with a weak specimen in exchange for an evening of your stories.  They intimate that they'd be willing to part with even more powerful artifacts if you help their town.",
			text: "The elder is happy to share their collection of lenses with people who help the town.",
			visible: false,
			upgrade: 'vision',
			jobs: 1,
		},
		mechanic: {
			name:'Mechanic',
			passage: "This town is the home of an expert in ancient machines, a mechanic.  Cars and trucks resurrected from her junkyard are used throughout the town.  These powerful machines can haul more, and faster, than anything pulled by an animal.  For the right materials, she can rebuild one of the hulks in her junkyard for your use.",
			visible: false,
			buildUnits: [
				'bicycle',
				'buggy',
				'wagon',
				'truck',
				'bus',
				'semi',
				'constructionCrew'
				],
			inputs: ['fuel'],
			jobs: 4,
		},
		

		aqueduct: {
			name: 'Aqueduct',
			buildCost: {stone:4,lumber:2},
			requiredResource: ['river','spring'],
			buildTime: 42,
			replaces: ['well'],
			goodwill:2,
			visible: true,
			outputs: ['water'],
			jobs: 5,
		},
		bank: {
			name:'Bank',
			buildCost: {stone:4,lumber:2,reputation:2000},
			buildTime: 14,
			goodwill: -10,
			visible: false,
			inputs: ['scrip'],
			outputs: ['scrip'],
			jobs: 4,
		},
		barracks: {
			name:'Barracks',
			buildCost: {stone:4,lumber:2},
			buildTime: 14,
			goodwill: 3,
			visible: true,
			inputs: ['fuel'],
			housing:100,
			jobs: 10,
		},
		bunker: {
			name:'Bunker',
			buildCost: {stone:2,lumber:1},
			buildTime: 6,
			goodwill: 1,
			visible: false,
			inputs: ['fuel'],
			housing:20,
			defense:5,
			jobs: 1,
		},
		cisterns: {
			name: 'Cisterns',
			buildCost: {stone:4},
			buildTime: 14,
			goodwill: 1,
			visible: true,
			outputs: ['water'],
			jobs: 2,
		},
		corral: {
			name: 'Corral',
			buildCost: {lumber:2,fiber:2},
			requiredResource: ['pasture'],
			buildTime: 6,
			goodwill: 2,
			visible: false,
			outputs: ['food','hides'],
			jobs: 10,
		},
		fields: {
			name: 'Fields',
			buildCost: {lumber:1,fiber:4},
			requiredResource: ['river','spring'],
			buildTime: 14,
			goodwill: 1,
			visible: true,
			inputs: ['water'],
			outputs: ['food','fiber'],
			jobs: 20,
		},
		foundry: {
			name:'Foundry',
			buildCost: {stone:6,lumber:6,cloth:2,ore:5},
			buildTime: 20,
			goodwill: 5,
			visible: true,
			inputs: ['ore','fuel','water'],
			outputs: ['metals'],
			jobs: 5,
		},
		fortress: {
			name:'Fortress',
			buildCost: {stone:8,lumber:8,fiber:2,cloth:2},
			buildTime: 56,
			replaces: ['bunker'],
			goodwill: 5,
			visible: true,
			inputs: ['fuel'],
			defense:10,
			jobs: 10,
		},
		granary: {
			name: 'Granaries',
			buildCost: {stone: 4,lumber:2},
			buildTime: 14,
			goodwill: 1,
			visible: true,
			jobs: 4,
			outputs: ['food'],
		},
		hovels: {
			name: 'Hovels & Shacks',
			visible: false,
			housing: 4,
		},
		loom: {
			name: 'Loom',
			buildCost: {lumber:2,fiber:4},
			buildTime: 8,
			goodwill: 3,
			visible: false,
			inputs: ['fiber'],
			outputs: ['cloth'],
			jobs: 10,
		},
		lumbermill: {
			name: 'Lumbermill',
			buildCost: {lumber:3,fiber:2},
			requiredResource: ['forest'],
			buildTime: 14,
			goodwill:2,
			visible:false,
			outputs: ['lumber'],
			jobs: 10,
		},
		manorHouse: {
			name:'Manor House',
			buildCost: {stone:2,lumber:2,cloth:4},
			buildTime: 28,
			goodwill: -1,
			visible: false,
			inputs: ['fuel'],
			housing:20,
			jobs: 2,
		},
		mineshaft: {
			name: 'Mineshaft',
			buildCost: {lumber:4,metal:2,stone:2},
			requiredResource: ['mineralVein'],
			buildTime: 28,
			replaces: ['openPitMine'],
			goodwill: 4,
			visible: false,
			inputs: ['fuel'],
			outputs: ['ore','stone'],
			jobs: 50,
		},
		oilWell: {
			name: 'Oil Well',
			buildCost: {metals:8},
			requiredResource: ['oilReservoir'],
			buildTime: 14,
			goodwill: 3,
			visible: true,
			outputs: ['crudeOil'],
			jobs: 20,
		},
		orchards: {
			name: 'Orchards',
			buildCost: {lumber:1},
			requiredResource: ['forest'],
			buildTime: 14,
			goodwill: 1,
			visible: true,
			inputs: ['water'],
			outputs: ['food','lumber'],
			jobs: 10,
		},
		openPitMine: {
			name: 'Open Pit Mine',
			buildCost: {lumber:4},
			requiredResource: ['mineralVein'],
			buildTime: 21,
			goodwill: 2,
			visible: false,
			inputs: ['fuel'],
			outputs: ['ore','stone'],
			jobs: 20,
		},
		postOffice: {
			name: 'Post Office',
			buildCost: {lumber:1,stone:1},
			buildTime: 8,
			goodwill: 1,
			visible: false,
			outputs: ['mail'],
			jobs: 2,
		},
		quarry: {
			name: 'Quarry',
			buildCost: {lumber:4},
			requiredResource: ['outcropping'],
			buildTime: 14,
			goodwill: 2,
			visible: false,
			inputs: ['fuel'],
			outputs: ['stone'],
			jobs: 20,
		},
		refinery: {
			name: 'Refinery',
			buildCost: {metals:3,crudeOil:5},
			buildTime: 28,
			goodwill: 5,
			visible: true,
			inputs: ['crudeOil'],
			outputs: ['fuel'],
			jobs: 15,
		},
		rowhouses: {
			name: 'Rowhouses',
			buildCost: {stone: 4,lumber: 2, cloth: 2 },
			buildTime: 14,
			goodwill: 3,
			replaces: ['hovels'],
			inputs: ['fuel'],
			visible: false,
			housing: 100,
		},
		saddler: {
			name: 'Saddler',
			buildCost: {lumber:1,fiber:3,leather:3},
			buildTime: 8,
			goodwill: 2,
			visible: false,
			inputs: ['leather'],
			outputs: ['tack'],
			jobs: 2,
		},
		seine: {
			name: 'Seine',
			buildCost: {fiber:4},
			requiredResource: ['river'],
			buildTime: 2,
			goodwill: 1,
			visible: false,
			outputs: ['food'],
			jobs: 4,
		},
		seamstress: {
			name: 'Seamstress',
			buildCost: {lumber:1,fiber:1,leather:1,cloth:5},
			buildTime: 8,
			goodwill: 2,
			visible: false,
			inputs: ['fiber','cloth','leather'],
			outputs: ['clothing'],
			jobs: 4,
		},
		shantyTown: {
			name:'Shanty Town',
			buildCost: {stone:4,lumber:2,cloth:1},
			requiredResource: ['ruins'],
			buildTime: 42,
			replaces: ['hovels'],
			goodwill: 4,
			visible: false,
			inputs: ['fuel'],
			housing:150,
			jobs: 10,
		},
		stoneWall: {
			name:'Stone Wall',
			buildCost: {stone:8,lumber:2},
			buildTime: 28,
			replaces: ['woodenPallisade'],
			goodwill: 2,
			visible: true,
			defense:5,
		},
		tannery: {
			name:'Tannery',
			buildCost: {stone:1,lumber:1,hides:5,fiber:1},
			buildTime: 8,
			goodwill: 2,
			visible: false,
			inputs: ['hides'],
			outputs: ['leather'],
			jobs: 2,
		},
		tenements: {
			name:'Tenements',
			buildCost: {stone:8,lumber:4,cloth:2},
			buildTime: 42,
			replaces: ['hovels'],
			goodwill: 5,
			visible: true,
			inputs: ['fuel'],
			housing:200,
			jobs: 10,
		},
		warehouse: {
			name: 'Warehouse',
			buildCost: {stone:2,lumber:4},
			buildTime: 14,
			goodwill: -1,
			visible: false,
			jobs: 5,
		},
		watchtower: {
			name:'Watchtower',
			buildCost: {lumber:4,fiber:2},
			buildTime: 6,
			goodwill: 1,
			visible: true,
			defense:2,
		},
		watermill: {
			name: 'Watermill',
			buildCost: {lumber:4,stone:1,cloth:2},
			requiredResource: ['river'],
			buildTime: 28,
			goodwill:5,
			visible: false,
			outputs: ['food'],
			jobs: 2,
		},
		well: {
			name: 'Well',
			buildCost: {stone:2,lumber:1},
			requiredResource: ['spring'],
			buildTime: 4,
			goodwill:1,
			visible: false,
			outputs: ['water'],
		},
		woodenPallisade: {
			name:'Wooden Pallisade',
			buildCost: {lumber:4,fiber:2},
			buildTime: 6,
			goodwill: 1,
			visible: true,
			defense:3,
		},
	},
	
	resources: {
	
		forest: {
			name: "Forest",
			visible: true,
		},
		mineralVein: {
			name: "Mineral Vein",
			visible: false,
		},
		oilReservoir: {
			name: "Oil Reservoir",
			visible: false,
		},
		outcropping: {
			name: "Outcropping",
			visible: true,
		},
		pasture: {
			name: "Pasture",
			visible: false,
		},
		spring: {
			name: "Spring",
			visible: false,
		},
		river: {
			name: "River",
			visible: true,
		},
		ruins: {
			name: "Old World Ruin",
			visible: false,
		},
	
	},
	
	units: {
	
		donkeyCart: {
			name: 'Donkey Cart',
			symbol: 'donkeyCart',
			cargo: 4,
			crew: 2,
			fuel: {water:1},
			speed: 10,
			offroadSpeed: 5,
			buildCost: {lumber:2,fiber:2,tack:1,food:1,water:1},
		},
	
		horseCart: {
			name: 'Horse Cart',
			symbol: 'horseCart',
			cargo: 5,
			crew: 2,
			fuel: {water:3},
			speed: 15,
			offroadSpeed: 5,
			buildCost: {lumber:3,fiber:3,tack:1,food:1,water:1},
		},
	
		oxCart: {
			name: 'Ox Cart',
			symbol: 'oxCart',
			cargo: 5,
			crew: 2,
			fuel: {water:3},
			speed: 10,
			offroadSpeed: 8,
			buildCost: {lumber:3,fiber:3,tack:1,food:1,water:1},
		},
	
		tinkersCart: {
			name: "Tinker's Cart",
			symbol: 'tinkersCart',
			unlockable: true,
			cargo: 5,
			crew: 3,
			fuel: {water:2},
			speed: 10,
			offroadSpeed: 7,
			canBuild: true,
			buildInfrastructures: [
				'barracks',
				'bunker',
				'cisterns',
				'corral',
				'fields',
				'granary',
				'loom',
				'lumbermill',
				'openPitMine',
				'orchards',
				'postOffice',
				'rowhouses',
				'saddler',
				'seamstress',
				'seine',
				'shantyTown',
				'tannery',
				'well',
				'watchtower',
				'watermill',
				'woodenPallisade'
			],
			buildCost: {lumber:4,fiber:4,tack:1,stone:1,food:1,water:1},
		},
	
		constructionCrew: {
			name: "Construction Crew",
			symbol: 'constructionCrew',
			cargo: 6,
			crew: 5,
			fuel: {fuel:2},
			speed: 10,
			offroadSpeed: 3,
			canBuild: true,
			buildInfrastructures: [
				'aqueduct',
				'barracks',
				'bank',
				'bunker',
				'cisterns',
				'fields',
				'fortress',
				'foundry',
				'loom',
				'lumbermill',
				'manorHouse',
				'mineshaft',
				'oilWell',
				'orchards',
				'postOffice',
				'quarry',
				'refinery',
				'rowhouses',
				'saddler',
				'seamstress',
				'stoneWall',
				'tannery',
				'tenements',
				'watermill'
			],
			buildCost: {metals:6,fuel:6,cloth:4,food:1,water:1},
		},
	
		dowser: {
			name: "Dowser",
			symbol: 'dowser',
			unlockable: true,
			cargo: 2,
			crew: 1,
			fuel: {water:1},
			speed: 8,
			offroadSpeed: 2,
			canSurvey: true,
			surveyTime: 7,
			surveyResources: ['mineralVein','oilReservoir','pasture','spring'],
			buildCost: {lumber:2,fiber:2,stone:1,tack:1,food:1,fuel:2,water:1},
		},
		
		bicycle: {
			name: 'Bicycle',
			symbol: 'bicycle',
			unlockable: true,
			cargo: 1,
			crew: 1,
			fuel: {},
			speed: 15,
			offroadSpeed: 5,
			buildCost: {metals:1,food:1},
		},
		
		buggy: {
			name: 'Buggy',
			symbol: 'buggy',
			cargo: 3,
			crew: 1,
			fuel: {fuel:1},
			speed: 20,
			offroadSpeed: 20,
			buildCost: {metals:3,fuel:1,food:1},
		},
		
		wagon: {
			name: 'Station Wagon',
			symbol: 'wagon',
			cargo: 5,
			crew: 2,
			fuel: {fuel:1},
			speed: 20,
			offroadSpeed: 10,
			buildCost: {metals:4,fuel:2,food:1},
			canPassenger: true,
		},
		
		truck: {
			name: 'Truck',
			symbol: 'truck',
			cargo: 6,
			crew: 2,
			fuel: {fuel:2},
			speed: 25,
			offroadSpeed: 12,
			buildCost: {metals:4,fuel:2,food:1},
		},
		
		bus: {
			name: 'Bus',
			symbol: 'bus',
			unlockable: true,
			cargo: 10,
			crew: 2,
			fuel: {fuel:2},
			speed: 25,
			offroadSpeed: 5,
			buildCost: {metals:8,fuel:2,food:1},
			canPassenger: true,
		},
		
		semi: {
			name: 'Semi',
			symbol: 'semi',
			cargo: 15,
			crew: 4,
			fuel: {fuel:3},
			speed: 20,
			offroadSpeed: 5,
			buildCost: {metals:8,fuel:2,food:1},
		},
		
		zeppelin: {
			name: 'Zeppelin',
			symbol: 'zeppelin',
			cargo: 10,
			crew: 4,
			fuel: {fuel:3},
			speed: 0,
			offroadSpeed: 20,
			buildCost: {metals:5,cloth:20,fiber:5,food:1,water:1},
			canPassenger: true,
		},
	
	},

};