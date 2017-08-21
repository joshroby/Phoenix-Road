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
		
		metal: {
			name: 'Metals',
			common: false,
			baseValue: 100,
			stability: 4,
			cargo: true,
		},
		
		cloth: {
			name: 'Cloth',
			common: true,
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
			common: true,
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
			description: 'reduces cost of water',
			buildCost: {stone:4},
			goodwill:20,
			visible: true,
			outputs: ['water'],
		},
		arbors: {
			name: 'Arbors',
			description: 'reduces cost of food',
			buildCost: {lumber:1},
			goodwill: 20,
			visible: true,
			inputs: ['water'],
			outputs: ['food','lumber'],
		},
		bank: {
			name:'Bank',
			description: 'enables credit scrip',
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
			description: 'enables basic unit building',
			buildCost: {lumber:2},
			goodwill: 20,
			visible: false,
			unlock: 300,
			buildUnits: ['donkeyCart','oxCart','horseCart','tinkersCart','dowser'],
		},
		fields: {
			name: 'Fields',
			description: 'reduces cost of food',
			buildCost: {lumber:1,fiber:4},
			goodwill: 20,
			visible: true,
			inputs: ['water'],
			outputs: ['food','fiber'],
		},
		foundry: {
			name:'Foundry',
			description: 'reduces cost of metals',
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
			description: 'reduces cost of cloth',
			buildCost: {lumber:2,fiber:4},
			goodwill: 20,
			visible: false,
			inputs: ['fiber'],
			outputs: ['cloth'],
		},
		lensmeister: {
			name: 'Lensmeister',
			description: 'increases player vision',
			visible: false,
			upgrade: 'vision',
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
			description: 'reduces cost of ore',
			buildCost: {lumber:4},
			goodwill: 20,
			visible: false,
			outputs: ['ore'],
		},
		pens: {
			name: 'Pens',
			description: 'reduces cost of food',
			buildCost: {lumber:2,fiber:2},
			goodwill: 20,
			visible: false,
			outputs: ['food','hides'],
		},
		quarry: {
			name: 'Quarry',
			description: 'reduces cost of stone',
			buildCost: {lumber:4},
			goodwill: 20,
			visible: false,
			outputs: ['stone'],
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
			buildCost: {lumber:2,fiber:2,food:1,water:1},
		},
	
		horseCart: {
			name: 'Horse Cart',
			cargo: 5,
			crew: 2,
			speed: 15,
			offroadSpeed: 5,
			buildCost: {lumber:3,fiber:3,food:1,water:1},
		},
	
		oxCart: {
			name: 'Ox Cart',
			cargo: 5,
			crew: 2,
			speed: 10,
			offroadSpeed: 8,
			buildCost: {lumber:3,fiber:3,food:1,water:1},
		},
	
		tinkersCart: {
			name: "Tinker's Cart",
			cargo: 5,
			crew: 3,
			speed: 10,
			offroadSpeed: 7,
			canBuild: true,
			buildCost: {lumber:4,fiber:4,stone:1,food:1,water:1},
		},
	
		dowser: {
			name: "Dowser",
			cargo: 2,
			crew: 1,
			speed: 10,
			offroadSpeed: 2,
			canSurvey: true,
			surveyTime: 7,
			surveyResources: ['mineralVein','pasture','spring'],
			buildCost: {lumber:2,fiber:2,stone:1,food:1,fuel:2,water:1},
		},
		
		bicycle: {
			name: 'Bicycle',
			cargo: 2,
			crew: 1,
			speed: 15,
			offroadSpeed: 5,
			buildCost: {metal:1,food:1,water:1},
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