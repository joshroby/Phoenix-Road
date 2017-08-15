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
		
		lumber: {
			name: 'Lumber',
			rarity: 2,
			cargo: true,
		},
		
		stone: {
			name: 'Stone',
			rarity: 2,
			cargo: true,
		},
	
		coin: {
			name: 'Coin',
			rarity: 100,
			cargo: false,
		},
		
	},
	
	infrastructure: {

		arbors: {
			name: 'Arbors',
			buildCost: [],
			goodwill: 20,
			visible: true,
		},
		barracks: {
			name:'Barracks',
			buildCost: [],
			goodwill: 20,
			visible: true,
			housing:100,
		},
		bunker: {
			name:'Bunker',
			buildCost: [],
			goodwill: 20,
			visible: false,
			housing:20,
			defense:5,
		},
		fields: {
			name: 'Fields',
			buildCost: [],
			goodwill: 20,
			visible: true,
		},
		fortress: {
			name:'Fortress',
			buildCost: [],
			goodwill: 20,
			visible: true,
			defense:10,
		},
		manorHouse: {
			name:'Manor House',
			buildCost: [],
			goodwill: 20,
			visible: false,
			housing:50,
		},
		mine: {
			name: 'Mine',
			buildCost: [],
			goodwill: 20,
			visible: false,
		},
		pens: {
			name: 'Pens',
			buildCost: [],
			goodwill: 20,
			visible: false,
		},
		quarry: {
			name: 'Quarry',
			buildCost: [],
			goodwill: 20,
			visible: false,
		},
		stoneWall: {
			name:'Stone Wall',
			buildCost: [],
			goodwill: 20,
			visible: true,
			defense:5,
		},
		tenements: {
			name:'Tenements',
			buildCost: [],
			goodwill: 20,
			visible: true,
			housing:200,
		},
		woodenPallisade: {
			name:'Wooden Pallisade',
			buildCost: [],
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
	
		wagon: {
			name: 'Wagon',
			cargo: 5,
			crew: 2,
			speed: 10,
			offroadSpeed: 0.25,
		},
		
		zeppelin: {
		},
	
	},

};