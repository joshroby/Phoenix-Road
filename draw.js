var draw = {

	dumbSquare: function() {
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x',0);
		rect.setAttribute('y',0);
		rect.setAttribute('width',50);
		rect.setAttribute('height',20);
		return rect;
	},

	wheel: function(x,y,r) {
		var circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		circle.setAttribute('stroke','#FFAA00');
		circle.setAttribute('stroke-width',"15.1384");
		circle.setAttribute('stroke-miterlimit',10);
		circle.setAttribute('cx',x);
		circle.setAttribute('cy',y);
		circle.setAttribute('r',r);
		return circle;
	},
	
	bicycle: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'bicycle';
		return dumbSquare;
	},

	buggy: function() {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.id = 'buggy';
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points',"523.801,212.632 542.611,115.524 520.021,95.359 573.508,27.478 491.355,37.321 472.305,52.771 443.975,27.485 407.294,27.485 374.817,101.241 168.646,101.241 27.501,121.413 2.922,212.632");
		svgNodes.appendChild(polygon);
				
		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		polyline.setAttribute('fill','none');
		polyline.setAttribute('stroke','#000000');
		polyline.setAttribute('stroke-width',"19.1048" );
		polyline.setAttribute('stroke-linecap','round');
		polyline.setAttribute('stroke-linejoin','round');
		polyline.setAttribute('stroke-miterlimit','10');
		polyline.setAttribute('points','443.975,27.485 275.668,27.478 168.646,101.241');
		svgNodes.appendChild(polyline);
		
		svgNodes.appendChild(draw.wheel(101,212,73.632));
		svgNodes.appendChild(draw.wheel(431,212,73.632));
		
		return svgNodes;
	},
	
	constructionCrew: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'constructionCrew';
		return dumbSquare;
	},
	
	donkeyCart: function() {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.id = 'donkeyCart';

		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('stroke','#FFAA00');
		path.setAttribute('stroke-width',15);
		path.setAttribute('stroke-miterlimit',10);
		path.setAttribute('d','M477.092,210.449 c3.189,33.412-21.314,63.088-54.725,66.275c-33.414,3.188-63.084-21.314-66.271-54.727c-3.189-33.41,21.312-63.084,54.723-66.273 C444.232,152.537,473.906,177.037,477.092,210.449z');
		svgNodes.appendChild(path);

		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('d','M270.479,134.031c0,0-3.854,20.811-5.395,29.29c-1.542,8.478-6.573,15.935-5.396,23.894 c1.374,9.279,9.056,33.555,10.791,35.195c1.736,1.641,1.216,4.594,0,6.234c-1.216,1.639-2.856,18.371-2.856,22.635 c0,4.266-4.593,2.953-4.593,5.25s1.313,16.402-0.328,17.387c-1.64,0.984-16.074,2.297-18.371,0s6.232-17.387,8.529-20.012 s-4.266-3.281-2.296-6.889c1.969-3.607,7.193-11.156,7.205-15.748s-17.701-35.758-20.327-35.43s-11.81,22.635-12.138,26.242 c-0.329,3.611-1.64,4.924-3.28,6.234c-1.641,1.312-11.483,10.828-12.467,19.027c-0.985,8.203-6.234,4.922-6.234,6.234 s0.983,9.842,0,10.824c-0.983,0.986-16.728,3.939-19.682,1.643s5.903-16.404,8.2-18.701s-0.656-4.266,0.984-6.561 c1.643-2.295,18.701-17.385,20.013-25.588c1.313-8.203-2.952-27.229-2.952-27.229s-26.245,14.434-39.041,15.09 c-12.793,0.656-29.852-1.311-29.852-1.311s-6.234,11.809-5.25,20.994c0.984,9.186,5.248,21.982,7.218,24.604 c1.968,2.627,1.311,5.908-0.657,7.219c-1.967,1.312-2.296,16.074-2.296,18.043s-17.712,6.164-21.323,2.588 c-3.611-3.572,7.873-17.352,9.841-19.318c1.97-1.969-4.041-2.951-2.185-4.594c1.857-1.641,2.84-11.482-2.409-19.027 c-5.248-7.545-8.859-13.779-7.874-20.666c0.985-6.891-1.969-11.158-6.232-8.861c-4.263,2.299-20.339,14.438-20.996,22.312 c-0.656,7.869,8.199,11.48,9.84,14.105c1.641,2.623-4.917,2.297-2.623,3.936c2.295,1.641,10.824,4.594,10.824,4.594 s-2.954,14.107-8.529,17.057c-5.576,2.953-10.824-12.463-11.81-17.713c-0.984-5.25-3.934,0-4.591-4.264 c-0.656-4.266-2.301-17.061-4.924-19.686c-2.622-2.625-2.297-8.527,0-10.826c2.297-2.297,13.782-21.652,13.453-27.555 c-0.328-5.906-29.529-45.602-29.529-45.602s-14.758,12.136-17.055,14.434c-2.297,2.297-3.28,10.498-6.89,13.451 c-3.609,2.953-9.843,1.64-9.843,1.64s-2.628,2.626-4.267,2.298c-1.637-0.33-11.809-10.498-11.479-16.076 c0.328-5.577,5.904-13.056,7.545-20.799c1.641-7.742,1.966-22.833,4.264-26.441c2.297-3.609,2.297-3.609,2.297-3.609 S5.693,89.219,1.894,75.44c-3.798-13.779,22.307,11.155,22.307,11.155S8.455,71.177,9.439,56.741 c0.984-14.436,35.433,29.197,35.433,29.197l10.496-4.594l-3.607,4.594l9.512-4.265l-3.935,4.265l9.187-2.953l-2.297,4.266 l12.137-1.313l-4.92,2.624l10.17-0.657l-3.609,3.284l11.483-0.329l-3.61,2.952h10.828l-3.282,3.938l7.545-0.329l-5.248,3.609 h12.136l-6.232,3.936c0,0,0.332,0.33,3.61,1.312c3.278,0.983,23.946,5.903,45.27,4.592c21.326-1.312,65.611-9.513,83.655-6.233 c18.045,3.28,32.48,8.857,44.289,29.197c11.812,20.34,13.123,27.23,22.306,33.135c9.188,5.905,20.996,9.514,22.311,10.498 c1.312,0.984-13.125-4.266-7.873-1.313c5.248,2.956,12.793,14.437,12.139,21.325c-0.494,5.168-2.646-1.662-5.768-6.23 c-1.043-1.521-2.189-2.793-3.42-3.283c-4.92-1.969,4.918,9.184,0.328,4.92c-4.592-4.264-9.186-8.199-15.418-11.811 c-6.234-3.607-10.496-15.091-16.403-24.604C280.744,146.957,270.479,134.031,270.479,134.031z');
		svgNodes.appendChild(path);

		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','541.914,171.186 60.397,170.92 61.393,181.337 542.91,181.603');
		svgNodes.appendChild(polygon);

		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','334.465,127.719 570.518,127.862 571.512,138.278 334.906,138.135');
		svgNodes.appendChild(polygon);

		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		polyline.setAttribute('points','352.107,177.582 368.959,68.181 359.521,65.305 342.674,174.703');
		svgNodes.appendChild(polyline);

		var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
		polyline.setAttribute('points','493.949,184.062 510.797,74.663 501.361,71.787 484.512,181.186');
		svgNodes.appendChild(polyline);

		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','542.291,187.842 559.143,78.442 549.705,75.568 532.857,184.965');
		svgNodes.appendChild(polygon);

		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('stroke','#FFAA00');
		path.setAttribute('stroke-width',15);
		path.setAttribute('stroke-miterlimit',10);
		path.setAttribute('d','M538.904,218.443 c3.191,33.416-21.311,63.086-54.725,66.275c-33.412,3.189-63.084-21.314-66.271-54.729c-3.191-33.41,21.311-63.08,54.727-66.27 C506.045,160.533,535.717,185.033,538.904,218.443z');
		svgNodes.appendChild(path);
		
		svgNodes.setAttribute('transform','scale(0.1)');

		return svgNodes;
	},	
	
	dowser: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'dowser';
		return dumbSquare;
	},
	
	horseCart: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'horseCart';
		return dumbSquare;
	},
	
	oxCart: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'oxCart';
		return dumbSquare;
	},
	
	semi: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'semi';
		return dumbSquare;
	},
	
	tinkersCart: function() {
		var svgNodes = document.createElementNS('http://www.w3.org/2000/svg','g');
		svgNodes.id = 'tinkersCart';
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('d','M190.32,135.231c-21.066-0.703-35.284,11.844-53.284,11.844c-17.999,0-28.657-13.742-38.84-13.742 c-10.179,0-12.315,10.187-13.023,6.869c-0.712-3.312-9-13.494-13.5-10.179c-4.497,3.31-4.97,22.969-9.235,24.152 c-4.265,1.188-10.892-1.183-10.892-1.183s-0.474-16.577-13.735-19.42c-13.267-2.842-1.661,0.709,0,1.658 c1.655,0.948,9.471,17.29,2.837,23.445c-6.628,6.156-21.55-4.733-16.336-16.336c5.205-11.609,0.233-7.343-2.136-0.952 c-2.364,6.395-8.048,20.605-3.786,25.342c4.259,4.735-15.694-5.211-15.694-5.211s7.406,16.104,14.274,16.815 c6.867,0.708-2.609,7.104-3.083,12.313c-0.474,5.209,4.502,15.396,3.557,20.128c-0.947,4.737,2.13,23.924,10.183,25.104 c8.051,1.186,11.126-18.708,18.467-22.494c7.348-3.79,17.527-4.264,17.053-0.473c-0.471,3.79-0.471,12.786,3.314,13.021 c3.792,0.239,8.29-13.26,8.29-13.26s1.896-4.498,5.211,0.946c3.317,5.445-4.739,19.66-8.048,28.183 c-3.319,8.527-13.027,22.958-12.32,27.236c0.713,4.272,5.685,4.737,9.71,2.6c4.026-2.126,3.55-9.707,3.55-9.707 s5.214-10.895,9.476-15.865c4.265-4.972,14.384-12.312,14.178-15.63c-0.203-3.317-0.676-10.659,1.452-10.187 c2.13,0.474,5.211,6.157,7.581,9.475c2.365,3.317,11.601,14.922,11.366,20.84c-0.24,5.922,0.475,10.894,0.475,10.894 s-7.815,4.971-6.396,7.581c1.422,2.6,12.314,3.317,12.547,0c0.242-3.318,0.715-4.972,0.715-4.972s4.738-6.396,3.077-8.059 c-1.655-1.654-5.446-15.859-4.972-21.314c0.475-5.443,3.55-12.547,3.55-12.547s13.028,6.157,22.499,4.972 c9.475-1.186,25.344-9.001,25.344-9.001s5.208,9.001,3.313,14.924c-1.896,5.916-8.524,20.84-12.314,25.811 c-3.789,4.971-6.868,8.528-6.159,10.187c0.713,1.653,9.477,1.653,11.37-0.475c1.896-2.131,2.604-8.287,2.604-8.287 s3.55-1.191,5.445-5.449c1.896-4.264,1.896-8.762,4.499-13.733c2.607-4.975,8.763-5.927,9.95-10.424 c1.182-4.498,2.842-21.075,4.498-15.631c1.662,5.449,4.738,13.265,7.341,15.396c2.61,2.132,10.899,11.601,12.081,18.474 c1.181,6.869,0,12.074,0,12.074s-6.16,7.58-4.026,9.234c2.13,1.664,8.29,0.946,9.945-0.706c1.661-1.66,1.188-7.343,1.188-7.343 s3.55,0.708,3.077-3.552c-0.474-4.264-3.791-10.654-3.55-14.923c0.233-4.264,1.655-9.474-0.949-12.312 c-2.607-2.844-12.078-17.289-11.131-26.284c0.946-9.007,4.498-29.373,2.369-33.633c-2.133-4.264,4.259,2.605,4.733,9.943 c0.473,7.342-0.475,29.133,3.082,32.211c3.551,3.083,13.021,4.025,7.574-3.552c-5.445-7.579-9.708-20.127-9.234-27.942 c0.473-7.82-3.792-26.527-8.524-29.371C206.19,149.913,204.534,135.705,190.32,135.231z');
		svgNodes.appendChild(path);
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('points','573.884,81.034 260.239,74.672 260.239,81.034 274.235,86.76 269.146,171.376 230.338,171.376 230.338,180.275 286.322,234.991 345.49,234.991 381.755,219.72 438.374,222.898 477.184,245.803 517.898,245.803 560.523,235.627 566.249,203.816 553.527,203.181 556.709,92.481 573.884,86.756');
		svgNodes.appendChild(polygon);
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('d','M510.266,26.318l-6.36-14.632c0,0-25.45,3.181-27.36,33.719c-1.907,30.538,0,44.534,0,44.534h16.438 c0,0-0.531-20.358-0.531-39.125C492.452,32.044,510.266,26.318,510.266,26.318z');
		svgNodes.appendChild(path);
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('d','M479.355,32.037 c-25.074,18.458-116.054,40.456-163.13,43.771');
		svgNodes.appendChild(path);
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('d','M474.003,60.672l-8.907-7.952V39.678l-28.631,13.043 c0,0,6.363,13.041,6.363,17.495s16.541,0,16.541,0l1.909-6.998l5.727,3.818L474.003,60.672z');
		svgNodes.appendChild(path);
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('d','M433.923,72.195c-3.819-7.069-2.537-19.77-2.537-19.77 s-5.734,8.34-12.732,9.885c-7,1.543-16.54-1.71-16.54-1.71l6.361,14.072h9.543l3.182-6.365l6.361,6.365L433.923,72.195z');
		svgNodes.appendChild(path);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','#FFAA00');
		rect.setAttribute('x','391.936');
		rect.setAttribute('y','110.933');
		rect.setAttribute('width','13.991');
		rect.setAttribute('height','15.905');
		svgNodes.appendChild(rect);
		
		var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		polygon.setAttribute('fill','#FFAA00');
		polygon.setAttribute('points','405.927,133.835 391.936,133.835 391.936,146.561 402.113,146.561 ');
		svgNodes.appendChild(polygon);
		
		var path = document.createElementNS('http://www.w3.org/2000/svg','path');
		path.setAttribute('fill','#FFAA00');
		path.setAttribute('d','M387.48,110.933v15.905H377.3v-6.176c0,0,6.363-4.005,5.091-9.729H387.48z');
		svgNodes.appendChild(path);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('fill','#FFAA00');
		rect.setAttribute('x','377.3');
		rect.setAttribute('y','133.835');
		rect.setAttribute('width','10.181');
		rect.setAttribute('height','12.725');
		svgNodes.appendChild(rect);
		
		var wheel = draw.wheel(317.212,236.139,50.913);
		svgNodes.appendChild(wheel);
		
		var wheel = draw.wheel(484.835,236.139,50.912);
		svgNodes.appendChild(wheel);
		
		var rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
		rect.setAttribute('x','98.008');
		rect.setAttribute('y','180.281');
		rect.setAttribute('width','175.59');
		rect.setAttribute('height','8.904');
		svgNodes.appendChild(rect);
		
		svgNodes.setAttribute('transform','scale(0.1)');
		
		return svgNodes;
	},
	
	truck: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'truck';
		return dumbSquare;
	},
	
	wagon: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'wagon';
		return dumbSquare;
	},
	
	zeppelin: function() {
		var dumbSquare = draw.dumbSquare();
		dumbSquare.id = 'zeppelin';
		return dumbSquare;
	},

};