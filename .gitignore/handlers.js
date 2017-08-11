var handlers = {

	newGame: function() {
		console.log('---');
		model.newGame();
	},
	
	selectSite: function(site) {
		view.selectSite(site);
	},

};