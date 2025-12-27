function $(id) {
	return document.getElementById(id);
}

function $$(selector) {
	return document.querySelector(selector);
}

function $$$(selector) {
	return document.querySelectorAll(selector);
}

function root(object) {
	Object.keys(object).forEach(att => {
		document.documentElement.style.setProperty(att, object[att]);
	});
}

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function interval(val, limit1, limit2) {
	return val === clamp(Math.min(limit1,limit2), val, Math.max(limit1,limit2));
}

function dist(p1, p2 = {"x":0,"y":0}) {
	return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
}

function center(p1, p2) {
	return {"x": (p1.x + p2.x)/2, "y": (p1.y + p2.y)/2};
}

function client(x,y) {
	return {"clientX": x, "clientY": y};
}

function time(ms) {
	const yearsFloat = ms/(1000*60*60*24*30*12),
		  years = Math.floor(yearsFloat),
		  monthsFloat = Math.decimal(yearsFloat)*12,
		  months = Math.floor(monthsFloat),
		  daysFloat = Math.decimal(monthsFloat)*30,
		  days = Math.floor(daysFloat),
		  hoursFloat = Math.decimal(daysFloat)*24,
		  hours = Math.floor(hoursFloat);
	
	return [years, months, days, hours];
}

/* Credits to: Web Dev Simplified */
function debounce(cb, delay = 1000) {
	let timeout;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			cb(...args);
		}, delay);
	};
}

/* Credits to: Web Dev Simplified */
function throttle(cb, delay = 1000) {
	let shouldWait = false;
	let waitingArgs;
	const timeoutFunc = () => {
		if (waitingArgs == null) {
			shouldWait = false;
		} else {
			cb(...waitingArgs);
			waitingArgs = null;
			setTimeout(timeoutFunc, delay);
		}
	};

	return (...args) => {
		if (shouldWait) {
			waitingArgs = args;
			return;
		}

		cb(...args);
		shouldWait = true;

		setTimeout(timeoutFunc, delay);
	};
}

function lineInterc(p1,p2,q1,q2) {
	const a1 = (p2.y - p1.y)/(p2.x - p1.x);
	const a2 = (q2.y - q1.y)/(q2.x - q1.x);
	const b1 = p1.y - a1*p1.x;
	const b2 = q1.y - a2*q1.x;

	if(a1 != a2) {
		if(Math.abs(a1 + a2) != Infinity) {
			const x = (b2 - b1)/(a1 - a2);
			if(interval(x,p1.x,p2.x) && interval(x,q1.x,q2.x)) {
				return true;
			}
		}
		else {
			if(Math.abs(a1) > Math.abs(a2)) {
				if(interval(p1.x,q1.x,q2.x) && interval(a2*q1.x+b2,p1.y,p2.y)) {
					return true;
				}
			}
			else {
				if(interval(q1.x,p1.x,p2.x) && interval(a1*p1.x+b1,q1.y,q2.y)) {
					return true;
				}
			}
		}
	}
	return false;
}


Math.decimal = function(num) {
	return num - Math.floor(num);
	// return parseFloat("0."+`${num}`.split(".")[1]);
}


Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

Array.prototype.max = function() {
	return Math.max.apply(null, this);
};

Array.prototype.deparseLine = function() {
	let result = [];
	this.forEach((point, i) => {
		if(i === 0) {
			result.push(`M${point.x},${point.y}`);
		}
		else {
			result.push(`L${point.x},${point.y}`);
		}
	});

	return result.join(" ");
};


Element.prototype.rect = Element.prototype.getBoundingClientRect;

Element.prototype.attrs = function(object) {
	Object.keys(object).forEach(att => {
		this.setAttribute(att, object[att]);
	});

	return this;
};

Element.prototype.hasPointer = function(e, margin = 0) {
	let box = this.rect();
	if(e.clientX >= box.left-margin && e.clientX <= box.right+margin && e.clientY >= box.top-margin && e.clientY <= box.bottom+margin) {
		return true;
	}
	return false;
};

Element.prototype.aspectRatio = function() {
	let box = this.rect();

	return box.width/box.height;
};

Element.prototype.pos = function(e) {
	let box = this.rect();

	return {"x": clamp(0, e.clientX - box.left, box.width), "y": clamp(0, e.clientY - box.top, box.height)};
};

Element.prototype.perc = function(e) {
	let pos = this.pos(e);
	let box = this.rect();

	return {"x": clamp(0, pos.x/box.width, 1), "y": clamp(0, pos.y/box.height, 1)};
};

Element.prototype.newElement = function(type) {
	let el = document.createElement(type);
	this.appendChild(el);

	return el;
};

Element.prototype.fullyContains = function() {
	let box1 = this.rect();
	let count = 0;

	[...arguments].forEach(el => {
		let box2 = el.rect();

		if(box2.top >= box1.top && box2.right <= box1.right && box2.bottom <= box1.bottom && box2.left >= box1.left) {
			count++;
		}
	});

	return count;
};

Element.prototype.containsCenter = function() {
	let box1 = this.rect();
	let count = 0;

	[...arguments].forEach(el => {
		let box2 = el.rect();
		let center = {"x": box2.left + box2.width/2, "y": box2.top + box2.height/2};

		if(center.y >= box1.top && center.x <= box1.right && center.y <= box1.bottom && center.x >= box1.left) {
			count++;
		}
	});

	return count;
};

Element.prototype.intersects = function() {
	let box1 = this.rect();
	let count = 0;

	[...arguments].forEach(el => {
		let box2 = el.rect();

		if(box2.top <= box1.bottom && box2.right >= box1.left && box2.bottom >= box1.top && box2.left <= box1.right) {
			count++;
		}
	});

	return count;
};


SVGPathElement.prototype.parseLine = function() {
	let parse = this.getAttribute("d").split(" ");
	let result = [];

	parse.forEach((point, i) => {
		if(point != "Z") {
			let split = point.substring(1).split(",");
			result.push({"x":parseFloat(split[0]), "y": parseFloat(split[1]), "path": this, "index": i});
		}
	});

	return result;
};


SVGGElement.prototype.newElement = function(type) {
	let el = document.createElementNS("http://www.w3.org/2000/svg", type);
	this.appendChild(el);

	return el;
};

SVGGElement.prototype.newText = function(label) {
	let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
	txt.textContent = label;
	this.appendChild(txt);

	return txt;
};

SVGGElement.prototype.asArray = function() {
	return [...this.children];
};


SVGSVGElement.prototype.getViewBox = function() {
	let array = this.getAttribute("viewBox").split(" ").map((v) => parseFloat(v,10));

	return {"vbX": array[0], "vbY": array[1], "vbW": array[2], "vbH": array[3]};
};

SVGSVGElement.prototype.setViewBox = function(object) {
	let vb = this.getViewBox();

	Object.keys(object).forEach(key => {
		vb[key] = object[key];
	});

	this.setAttribute("viewBox", `${vb.vbX} ${vb.vbY} ${vb.vbW} ${vb.vbH}`);
};

SVGSVGElement.prototype.center = function() {
	let vb = this.getViewBox();

	return {"x": vb.vbX + vb.vbW/2, "y": vb.vbY + vb.vbH/2};
};

SVGSVGElement.prototype.coord = function(e) {
	let vb = this.getViewBox();
	let perc = this.perc(e);

	return {"x": Math.trunc(vb.vbX + vb.vbW*perc.x)+0.5, "y": Math.trunc(vb.vbY + vb.vbH*perc.y)+0.5};
};

SVGSVGElement.prototype.pointPerc = function(point) {
	let vb = this.getViewBox();

	return {"x": (point.x - vb.vbX)/vb.vbW, "y": (point.y - vb.vbY)/vb.vbH};
};

SVGSVGElement.prototype.pointPos = function(point) {
	const vb = this.getViewBox();
	const rect = map.rect();

	return {"x": map.pointPerc(point).x*rect.width, "y": map.pointPerc(point).y*rect.height};
};

SVGSVGElement.prototype.resizeX = function() {
	let vb = this.getViewBox();

	this.setViewBox({"vbX": this.center().x - vb.vbH*this.aspectRatio()/2});
};

SVGSVGElement.prototype.resizeY = function() {
	let vb = this.getViewBox();

	this.setViewBox({"vbY": this.center().y - vb.vbW/this.aspectRatio()/2});
};
