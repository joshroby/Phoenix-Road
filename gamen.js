var gamen = {

	focus: {
		passage: undefined,
	},

	init: function() {
		var titleHead = document.getElementById('titleHead');
		var gameTitle = model.gameTitle;
		if (titleHead !== undefined && gameTitle !== undefined) {
			titleHead.innerHTML = gameTitle;
		};
		
		var loadGameDiv = document.getElementById('loadGameDiv');
		if (loadGameDiv !== undefined) {
			gamen.displayLoadGameDiv();
		};
		
		if (model.gameDivContents !== undefined) {
			var gameDivContents = model.gameDivContents();
			for (var i of gameDivContents) {
				document.getElementById('gameDiv').appendChild(i);
			};
		};
	},
	
	prettyList: function(list,andor) {
		if (andor == undefined) {andor = 'and'};
		var prettyList = '';
		for (item in list) {
			prettyList += ' ' + list[item];
			if (item == list.length-1) {
			} else if (list.length == 2) {
				prettyList += ' ' + andor;
			} else if (item == list.length-2) {
				prettyList += ', ' + andor;
			} else {
				prettyList += ',';
			};
		};
		return prettyList;
	},
	
	displayLoadGameDiv: function(saveGames,gameSavePrefix) {
		var loadGameDiv = document.getElementById('loadGameDiv');
		loadGameDiv.innerHTML = '';
		var gameSavePrefix = model.gameSavePrefix;
		var localStorageKeys= Object.keys(localStorage);
		var saveGames = [];
		for (s in localStorageKeys) {
			if (localStorageKeys[s].startsWith(gameSavePrefix)) {
				saveGames.push(localStorageKeys[s]);
			}
		};
		if (saveGames.length > 0) {
			var loadGameHeader = document.createElement('div');
			loadGameHeader.id = 'loadGameHeader';
			loadGameHeader.innerHTML = 'Continue a Saved Game';
			loadGameDiv.appendChild(loadGameHeader);
			for (var i in saveGames) {
				var saveDate = new Date(JSON.parse(localStorage[saveGames[i]]).saveDate);
				var since = new Date() - saveDate;
				if (since < 8.64e+7) {
					saveDate = 
						['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][saveDate.getDay()] + ", " +
						['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][saveDate.getMonth()] + " " +
						saveDate.getDate() + ", " +
						saveDate.getFullYear() + " " +
						saveDate.getHours() + ":" +
						saveDate.getMinutes() + " " ;
				} else {
					saveDate = since + 's ago';
				}
				var loadGameItem = document.createElement('div');
				loadGameItem.className = 'loadGameItem';
				loadGameItem.innerHTML = saveGames[i].substring(gameSavePrefix.length);
				loadGameItem.innerHTML += " ";
				loadGameDiv.appendChild(loadGameItem);
				var loadGameBtn = document.createElement('div');
				loadGameBtn.className = 'loadGameTimeDiv';
				loadGameBtn.innerHTML = saveDate;
				loadGameDiv.appendChild(loadGameBtn);
				var loadGameBtn = document.createElement('button');
				loadGameBtn.className = 'loadGameBtn';
				loadGameBtn.innerHTML = 'Continue';
				loadGameBtn.setAttribute('onclick','gamen.loadGame("'+saveGames[i]+'")');
				loadGameDiv.appendChild(loadGameBtn);
				var loadGameBtn = document.createElement('button');
				loadGameBtn.className = 'loadGameBtn';
				loadGameBtn.innerHTML = 'Delete';
				loadGameBtn.setAttribute('onclick','gamen.deleteGame("'+saveGames[i]+'")');
				loadGameDiv.appendChild(loadGameBtn);
			};
		};
	},
	
	saveGame: function() {
		var name = 'Autosave';
		var saveGame;
		if (model.gamenSave !== undefined) {
			saveGame = gamenSave;
		} else if (model.flatGame !== undefined) {
			saveGame = model.flatGame();
		} else {
			console.log('No Game to Save!');
		};
		if (saveGame !== undefined) {
			var saveName = prompt('Overwrite current save or rename:',name);
			saveName = model.gameSavePrefix + ' ' + saveName;
			localStorage[saveName] = JSON.stringify(saveGame);
		};

	},
	
	loadGame: function(storageKey) {
		var gameSave = JSON.parse(localStorage[storageKey]);
		model.unflattenGame(gameSave);
		view.refreshGameDisplay();
	},
	
	deleteGame: function(storageKey) {
		localStorage.removeItem(storageKey);
		gamen.displayLoadGameDiv();
	},

	passageQueue: [],

	displayPassage: function(passage) {

		if (document.getElementById('gamenModalBacksplash').style.display !== 'block') {
		
			gamen.focus.passage = passage;
			
			for (var i in gamen.clocks) {
				gamen.clocks[i].paused = true;
			};
		
			var gamenModalTextDiv = document.getElementById('gamenModalTextDiv');
		
			if (passage.speaker !== undefined) {
				var gamenModalSpeakerSpan = document.createElement('span');
				gamenModalSpeakerSpan.className = 'gamenModalSpeakerSpan';
				gamenModalSpeakerSpan.innerHTML = passage.speaker + ": ";
				gamenModalTextDiv.appendChild(gamenModalSpeakerSpan);
			};
		
			gamenModalTextDiv.innerHTML += passage.text;
		
			var gamenModalChoicesDiv = document.createElement('div');
			gamenModalChoicesDiv.id = 'gamenModalChoicesDiv';
			gamenModalTextDiv.appendChild(gamenModalChoicesDiv);
			for (var choice of passage.choiceArray) {
				var choiceBtn = document.createElement('button');
				choiceBtn.innerHTML = choice.label;
				choiceBtn.addEventListener('click',gamen.passageChoice.bind(this,choice));
				choiceBtn.disabled = choice.disabled;
				gamenModalChoicesDiv.appendChild(choiceBtn);
			};
		
			document.getElementById('gamenModalBacksplash').style.display = 'block';
		} else {
			gamen.passageQueue.push(passage);
		};
	},
	
	dismissPassage: function(choiceSelected) {
		
		if (gamen.focus.passage.dismissable || choiceSelected) {
		
			for (var i in gamen.clocks) {
				gamen.clocks[i].resume();
			};
		

			document.getElementById('gamenModalBustDiv').innerHTML = '';
			document.getElementById('gamenModalTextDiv').innerHTML = '';
		
			document.getElementById('gamenModalBacksplash').style.display = 'none';
		
			if (gamen.passageQueue.length > 0) {
				var nextPassage = gamen.passageQueue.shift();
				gamen.displayPassage(nextPassage);
			};
		};
	},
	
	passageChoice: function(choice) {
		
		if (choice.execute !== undefined) {choice.execute.apply(this,choice.argsArray);};
		gamen.dismissPassage(choice);
	},

};

// dismissing dialogue pane
window.onclick = function(event) {
	var dialogueBacksplash = document.getElementById('gamenModalBacksplash');
	if (event.target == dialogueBacksplash) {
		gamen.dismissPassage(false);
	};
};


function Clock(start) {
	if (start == undefined) { start = new Date(); };
	this.running = false;
	this.paused = false;
	this.time = start;
	this.timeStep = 1000;
	this.tick = 1000;
	
	this.events = [];
	
	this.logEventIn = function(timeUntil,event) {
		var timeWhen = new Date(this.time.getTime() + timeUntil);
		this.logEventWhen(timeWhen,event);
	};
	
	this.logEventWhen = function(timeWhen,event) {
		if (this.events[timeWhen.getTime()] == undefined) {
			this.events[timeWhen.getTime()] = [event];
		} else {
			this.events[timeWhen.getTime()].push(event);
		};
	};
	
	this.start = function () {
		this.running = true;
		this.go();
	};
	
	this.stop = function() {
		this.running = false;
	};
	
	this.resume = function() {
		if (this.paused) {
			this.paused = false;
			this.go();
		};
	};
	
	this.go = function() {
		if (this.running && !this.paused) {
			this.time = new Date(this.time.getTime() + this.timeStep);
			var timedEvent = setTimeout(this.go.bind(this),this.tick);
		
			var previousEvents = [];
			for (var i in this.events) {
				if (i <= this.time.getTime()) {
					for (var e in this.events[i]) {
						previousEvents.push(this.events[i][e]);
					};
					delete this.events[i];
				};
			};
			for (i in previousEvents) {
				gamenEventPointers[previousEvents[i]]();
			};
		};
	};
};

function Passage(text,choiceArray,dismissable,speaker,bust,bustPosition) {
	if (text == undefined) {text = 'No text'};
	if (choiceArray == undefined) { choiceArray = [new Choice()]; };
	if (dismissable == undefined) {dismissable = true;};
	
	this.text = text;
	
	this.choiceArray = choiceArray;
	
	this.dismissable = dismissable;
	
	this.speaker = speaker;
	this.bust = bust;
	this.bustPosition = bustPosition;

};

function Choice(label,execute,argsArray,disabled) {
	if (label == undefined) {label = 'Dismiss'};
	if (disabled == undefined) {disabled = false};
	
	this.label = label;
	this.execute = execute;
	this.argsArray = argsArray;
	this.disabled = disabled;
};

