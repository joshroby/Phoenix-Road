var data = {

	commodities: {
	
		food: {
			name: 'Food',
			common: true,
			baseValue: 10,
			stability: 6,
			cargo: true,
		},
		
		water: {
			name: 'Water',
			common: true,
			baseValue: 5,
			stability: 3,
			cargo: true,
		},
		
		fiber: {
			name: 'Fiber',
			common: false,
			baseValue: 20,
			stability: 3,
			cargo: true,
		},
		
		lumber: {
			name: 'Lumber',
			common: true,
			baseValue: 30,
			stability: 4,
			cargo: true,
		},
		
		stone: {
			name: 'Stone',
			common: true,
			baseValue: 40,
			stability: 5,
			cargo: true,
		},
		
		clothing: {
			name: 'Clothing',
			common: true,
			baseValue: 70,
			stability: 2,
			cargo: true,
		},
		
		tack: {
			name: 'Saddles and Tack',
			common: true,
			baseValue: 80,
			stability: 3,
			cargo: true,
		},
		
		fuel: {
			name: 'Fuel',
			common: true,
			baseValue: 100,
			stability: 1,
			cargo: true,
		},
		
		crudeOil: {
			name: 'Crude Oil',
			common: false,
			baseValue: 80,
			stability: 2,
			cargo: true,
		},
		
		ore: {
			name: 'Ore',
			common: false,
			baseValue: 40,
			stability: 6,
			cargo: true,
		},
		
		metals: {
			name: 'Metals',
			common: false,
			baseValue: 100,
			stability: 4,
			cargo: true,
		},
		
		cloth: {
			name: 'Cloth',
			common: false,
			baseValue: 60,
			stability: 3,
			cargo: true,
		},
		
		hides: {
			name: 'Hides',
			common: false,
			baseValue: 20,
			stability: 2,
			cargo: true,
		},
		
		leather: {
			name: 'Leather',
			common: false,
			baseValue: 50,
			stability: 4,
			cargo: true,
		},
		
		scrip: {
			name: 'Scrip',
			common: false,
			baseValue: 100,
			stability: 10,
			cargo: false,
		},
		
	},
	
	infrastructure: {

		aqueduct: {
			name: 'Aqueduct',
			buildCost: {stone:4,lumber:2},
			goodwill:20,
			visible: true,
			requiredResource: ['river','spring'],
			outputs: ['water'],
		},
		bank: {
			name:'Bank',
			buildCost: {stone:4,lumber:2,reputation:2000},
			goodwill: 20,
			visible: false,
			inputs: ['scrip'],
			outputs: ['scrip'],
		},
		barracks: {
			name:'Barracks',
			buildCost: {stone:4,lumber:2},
			goodwill: 20,
			visible: true,
			housing:100,
		},
		bunker: {
			name:'Bunker',
			buildCost: {stone:2,lumber:1},
			goodwill: 20,
			visible: false,
			housing:20,
			defense:5,
		},
		cartwright: {
			name:'Cartwright',
			buildCost: {lumber:2},
			goodwill: 20,
			visible: false,
			unlock: 300,
			buildUnits: ['donkeyCart','oxCart','horseCart','tinkersCart','dowser'],
			inputs: ['tack','lumber'],
		},
		cisterns: {
			name: 'Cisterns',
			buildCost: {stone:4},
			goodwill: 20,
			visible: true,
			outputs: ['water'],
		},
		fields: {
			name: 'Fields',
			buildCost: {lumber:1,fiber:4},
			goodwill: 20,
			visible: true,
			inputs: ['water'],
			outputs: ['food','fiber'],
		},
		foundry: {
			name:'Foundry',
			buildCost: {stone:8,lumber:8,cloth:2},
			goodwill: 20,
			visible: true,
			inputs: ['ore','fuel','water'],
			outputs: ['metals']
		},
		fortress: {
			name:'Fortress',
			buildCost: {stone:8,lumber:8,fiber:2,cloth:2},
			goodwill: 20,
			visible: true,
			defense:10,
		},
		loom: {
			name: 'Loom',
			buildCost: {lumber:2,fiber:4},
			goodwill: 20,
			visible: false,
			inputs: ['fiber'],
			outputs: ['cloth'],
		},
		lensmeister: {
			name: 'Lensmeister',
			visible: false,
			upgrade: 'vision',
		},
		lumbermill: {
			name: 'Lumbermill',
			buildCost: {lumber:3,fiber:2},
			requiredResource: ['forest'],
			goodwill:20,
			visible:false,
			outputs: ['lumber'],
		},
		manorHouse: {
			name:'Manor House',
			buildCost: {stone:2,lumber:2,cloth:4},
			goodwill: 20,
			visible: false,
			housing:50,
		},
		mine: {
			name: 'Mine',
			buildCost: {lumber:4},
			goodwill: 20,
			visible: false,
			requiredResource: ['mineralVein'],
			outputs: ['ore'],
		},
		oilWell: {
			name: 'Oil Well',
			buildCost: {metals:8},
			goodwill: 20,
			visible: true,
			outputs: ['crudeOil'],
		},
		orchards: {
			name: 'Orchards',
			buildCost: {lumber:1},
			goodwill: 20,
			visible: true,
			inputs: ['water'],
			outputs: ['food','lumber'],
		},
		pens: {
			name: 'Pens',
			buildCost: {lumber:2,fiber:2,livestock:1},
			goodwill: 20,
			visible: false,
			outputs: ['food','hides'],
		},
		quarry: {
			name: 'Quarry',
			buildCost: {lumber:4},
			goodwill: 20,
			visible: false,
			requiredResource: ['outcropping'],
			outputs: ['stone'],
		},
		refinery: {
			name: 'Refinery',
			buildCost: {lumber:1},
			goodwill: 20,
			visible: true,
			inputs: ['crudeOil'],
			outputs: ['fuel'],
		},
		saddler: {
			name: 'Saddler',
			buildCost: {lumber:1,fiber:1,leather:1},
			goodwill: 20,
			visible: false,
			inputs: ['leather'],
			outputs: ['tack'],
		},
		seamstress: {
			name: 'Seamstress',
			buildCost: {lumber:1,fiber:1,leather:1,cloth:1},
			goodwill: 20,
			visible: false,
			inputs: ['fiber','cloth','leather'],
			outputs: ['clothing'],
		},
		stoneWall: {
			name:'Stone Wall',
			buildCost: {stone:8,lumber:2},
			goodwill: 20,
			visible: true,
			defense:5,
		},
		tannery: {
			name:'Tannery',
			buildCost: {stone:2,lumber:2,fiber:2},
			goodwill: 20,
			visible: false,
			inputs: ['hides'],
			outputs: ['leather'],
		},
		tenements: {
			name:'Tenements',
			buildCost: {stone:8,lumber:4,cloth:2},
			goodwill: 20,
			visible: true,
			housing:200,
		},
		woodenPallisade: {
			name:'Wooden Pallisade',
			buildCost: {lumber:4,fiber:2},
			goodwill: 20,
			visible: true,
			defense:3,
		},
		watermill: {
			name: 'Watermill',
			buildCost: {lumber:4,stone:1,cloth:2},
			goodwill:20,
			visible: false,
			requiredResource: ['river'],
			outputs: ['food'],
		},
	},
	
	resources: {
	
		forest: {
			name: "Forest",
			visible: true,
		},
		herds: {
			name: "Herds",
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
	
	},
	
	units: {
	
		donkeyCart: {
			name: 'Donkey Cart',
			cargo: 4,
			crew: 2,
			speed: 10,
			offroadSpeed: 5,
			buildCost: {lumber:2,fiber:2,tack:1,food:1,water:1},
		},
	
		horseCart: {
			name: 'Horse Cart',
			cargo: 5,
			crew: 2,
			speed: 15,
			offroadSpeed: 5,
			buildCost: {lumber:3,fiber:3,tack:1,food:1,water:1},
		},
	
		oxCart: {
			name: 'Ox Cart',
			cargo: 5,
			crew: 2,
			speed: 10,
			offroadSpeed: 8,
			buildCost: {lumber:3,fiber:3,tack:1,food:1,water:1},
		},
	
		tinkersCart: {
			name: "Tinker's Cart",
			cargo: 5,
			crew: 3,
			speed: 10,
			offroadSpeed: 7,
			canBuild: true,
			buildInfrastructures: ['aqueduct','barracks','bunker','cisterns','fields','loom','lumbermill','orchards','pens','quarry','saddler','seamstress','stoneWall','tannery','woodenPallisade','watermill'],
			buildCost: {lumber:4,fiber:4,tack:1,stone:1,food:1,water:1},
		},
	
		dowser: {
			name: "Dowser",
			cargo: 2,
			crew: 1,
			speed: 10,
			offroadSpeed: 2,
			canSurvey: true,
			surveyTime: 7,
			surveyResources: ['mineralVein','oilReservoir','pasture','spring'],
			buildCost: {lumber:2,fiber:2,stone:1,tack:1,food:1,fuel:2,water:1},
		},
		
		bicycle: {
			name: 'Bicycle',
			cargo: 2,
			crew: 1,
			speed: 15,
			offroadSpeed: 5,
			buildCost: {metals:1,food:1,water:1},
		},
		
		zeppelin: {
			name: 'Zeppelin',
			cargo: 10,
			crew: 4,
			speed: 0,
			offroadSpeed: 20,
			buildCost: {lumber:5,fiber:20,food:1,water:1},
		},
	
	},

};