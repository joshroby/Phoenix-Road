var data = {

	commodities: {
	
		food: {
			name: 'Food',
			rarity: 1,
			cargo: true,
		},
		
		water: {
			name: 'Water',
			rarity: 0.1,
			cargo: true,
		},
		
		fiber: {
			name: 'Fiber',
			rarity: 2,
			cargo: true,
		},
		
		fuel: {
			name: 'Fuel',
			rarity: 10,
			cargo: true,
		},
		
		lumber: {
			name: 'Lumber',
			rarity: 3,
			cargo: true,
		},
		
		stone: {
			name: 'Stone',
			rarity: 5,
			cargo: true,
		},
		
	},
	
	infrastructure: {

		arbors: {
			name: 'Arbors',
			description: 'reduces cost of food',
			buildCost: {lumber:1},
			goodwill: 20,
			visible: true,
		},
		bank: {
			name:'Bank',
			description: 'enables credit scrip',
			buildCost: {stone:4,lumber:2,reputation:2000},
			goodwill: 20,
			visible: false,
			valuables: 'scrip',
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
			buildUnits: ['donkeyCart','oxCart','horseCart','tinkersCart'],
		},
		fields: {
			name: 'Fields',
			description: 'reduces cost of food',
			buildCost: {lumber:1,fiber:4},
			goodwill: 20,
			visible: true,
		},
		fortress: {
			name:'Fortress',
			buildCost: {stone:8,lumber:8,fiber:2},
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
		},
		manorHouse: {
			name:'Manor House',
			buildCost: {stone:2,lumber:2,fiber:4},
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
		},
		pens: {
			name: 'Pens',
			description: 'reduces cost of food',
			buildCost: {lumber:2,fiber:2},
			goodwill: 20,
			visible: false,
		},
		quarry: {
			name: 'Quarry',
			description: 'reduces cost of stone',
			buildCost: {lumber:4},
			goodwill: 20,
			visible: false,
		},
		stoneWall: {
			name:'Stone Wall',
			buildCost: {stone:8,lumber:2},
			goodwill: 20,
			visible: true,
			defense:5,
		},
		tenements: {
			name:'Tenements',
			buildCost: {stone:8,lumber:4},
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
			offroadSpeed: 7,
			buildCost: {lumber:2,fiber:2,food:1,water:1},
		},
	
		oxCart: {
			name: 'Ox Cart',
			cargo: 5,
			crew: 2,
			speed: 8,
			offroadSpeed: 5,
			buildCost: {lumber:3,fiber:3,food:1,water:1},
		},
	
		horseCart: {
			name: 'Horse Cart',
			cargo: 5,
			crew: 2,
			speed: 15,
			offroadSpeed: 5,
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