var gamen = {

	clocks: [],
	
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

	passageQueue: [],

	displayPassage: function(passage) {
	
		if (!this.passageUp) {
			gamen.dismissPassage();
			
			for (var i in gamen.clocks) {
				gamen.clocks[i].paused = true;
			};
		
			this.passageUp = true;
		
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
	
	dismissPassage: function() {
		this.passageUp = false;

		document.getElementById('gamenModalBustDiv').innerHTML = '';
		document.getElementById('gamenModalTextDiv').innerHTML = '';
		
		document.getElementById('gamenModalBacksplash').style.display = 'none';
		
		if (gamen.passageQueue.length > 0) {
			var nextPassage = gamen.passageQueue.shift();
			gamen.displayPassage(nextPassage);
		};
		
		for (i in gamen.clocks) {
			gamen.clocks[i].resume();
		};
		
	},
	
	passageChoice: function(choice) {
		if (choice.execute !== undefined) {choice.execute();};
		gamen.dismissPassage();
	},

};

// dismissing dialogue pane
window.onclick = function(event) {
	var dialogueBacksplash = document.getElementById('gamenModalBacksplash');
	if (event.target == dialogueBacksplash) {
		gamen.dismissPassage();
		console.log('Upgrade this to switch between dismiss and continue');
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
// 			console.log(this.time);
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
				previousEvents[i]();
			};
		};
	};
	
	gamen.clocks.push(this);
};

function Passage(text,choiceArray,speaker,bust,bustPosition) {
	if (text == undefined) {text = 'No text'};
	if (choiceArray == undefined) { choiceArray = [new Choice()]; };
	
	this.text = text;
	
	this.choiceArray = choiceArray;
	
	this.speaker = speaker;
	this.bust = bust;
	this.bustPosition = bustPosition;

};

function Choice(label,execute,disabled) {
	if (label == undefined) {label = 'Dismiss'};
	if (disabled == undefined) {disabled = false};
	
	this.label = label;
	this.execute = execute;
	this.disabled = disabled;
};