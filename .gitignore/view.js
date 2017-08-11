var view = {

	displayMap: function() {
		var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.setAttribute('viewBox','0 0 1000 1000');
		
		var background = document.createElementNS('http://www.w3.org/2000/svg','rect');
		background.setAttribute('fill','green');
		background.setAttribute('x','0');
		background.setAttribute('y','0');
		background.setAttribute('width','100%');
		background.setAttribute('height','100%');
		svg.appendChild(background);
		
		for (i in sites) {
			for (n in sites[i].neighbors) {
				var newRoute = document.createElementNS('http://www.w3.org/2000/svg','line');
				newRoute.setAttribute('fill','none');
				newRoute.setAttribute('stroke','yellow');
				newRoute.setAttribute('x1',sites[i].x);
				newRoute.setAttribute('y1',sites[i].y);
				newRoute.setAttribute('x2',sites[i].neighbors[n].x);
				newRoute.setAttribute('y2',sites[i].neighbors[n].y);
				svg.appendChild(newRoute);
			};
		};
		
		for (i in sites) {
			var newSite = document.createElementNS('http://www.w3.org/2000/svg','circle');
			newSite.id = 'site_' + i;
			newSite.setAttribute('fill','black');
			newSite.setAttribute('stroke','white');
			newSite.setAttribute('cx',sites[i].x);
			newSite.setAttribute('cy',sites[i].y);
			newSite.setAttribute('r',5);
			newSite.setAttribute('onmouseover','handlers.selectSite('+i+')');
			svg.appendChild(newSite);
			
			var siteLabel = document.createElementNS('http://www.w3.org/2000/svg','text');
			siteLabel.setAttribute('stroke','black');
			siteLabel.setAttribute('x',sites[i].x + 10);
			siteLabel.setAttribute('y',sites[i].y + 5);
			siteLabel.innerHTML = sites[i].name;
			svg.appendChild(siteLabel);
		};
		
		var mapDiv = document.getElementById('mapDiv');
		mapDiv.innerHTML = '';
		mapDiv.appendChild(svg);
	},
	
	selectSite: function(site) {
		site = sites[site];
		var detailsDiv = document.getElementById('detailsDiv');
		detailsDiv.innerHTML = '';
		var siteHead = document.createElement('h3');
		siteHead.innerHTML = site.name;
		detailsDiv.appendChild(siteHead);
		var siteCoords = document.createElement('p');
		siteCoords.innerHTML = "(" + site.x + "," + site.y + ")";
		detailsDiv.appendChild(siteCoords);
	},

};