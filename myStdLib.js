function $(id){
  return document.getElementById(id);
}

function $$(selector){
  return document.querySelector(selector);
}

function $$$(selector){
  return document.querySelectorAll(selector);
}

function root(object){
  Object.keys(object).forEach(att => {
	  document.documentElement.style.setProperty(att, object[att]);
	});
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function dist(p1, p2){
  return Math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2);
}

function center(p1, p2){
  return {"x": (p1.x + p2.x)/2, "y": (p1.y + p2.y)/2};
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


Array.prototype.min = function(){
	return Math.min.apply(null, this);
};

Array.prototype.max = function(){
	return Math.max.apply(null, this);
};


Element.prototype.attrs = function(object){
	Object.keys(object).forEach(att => {
	  this.setAttribute(att, object[att]);
	});
	
	return this;
};

Element.prototype.hasPointer = function(e){
	const box = this.getBoundingClientRect();
	
	if(e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom){
		return true;
	}
	return false;
};

Element.prototype.aspectRatio = function(){
	let box = this.getBoundingClientRect();
	
	return box.width/box.height;
};

Element.prototype.pos = function(e){
  let box = this.getBoundingClientRect();

  return {"x": clamp(0, e.clientX - box.left, box.width), "y": clamp(0, e.clientY - box.top, box.height)};
};

Element.prototype.perc = function(e){
  let pos = this.pos(e);
  let box = this.getBoundingClientRect();

  return {"x": clamp(0, pos.x/box.width, 1), "y": clamp(0, pos.y/box.height, 1)};
};

Element.prototype.newElement = function(type){
	let el = document.createElement(type);
	this.appendChild(el);

	return el;
};


SVGGElement.prototype.newElement = function(type){
	let el = document.createElementNS("http://www.w3.org/2000/svg", type);
	this.appendChild(el);
	
	return el;
};

SVGGElement.prototype.newText = function(label){
	let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
	txt.textContent = label;
	this.appendChild(txt);
	
	return txt;
};

SVGGElement.prototype.asArray = function(){
  return [...this.children];
};


SVGSVGElement.prototype.getViewBox = function(){
  let array = this.getAttribute("viewBox").split(" ").map((v) => parseFloat(v,10));
  
  return {"vbX": array[0], "vbY": array[1], "vbW": array[2], "vbH": array[3]};
};

SVGSVGElement.prototype.setViewBox = function(object){
	let vb = this.getViewBox();
	
	Object.keys(object).forEach(key => {
	  vb[key] = object[key];
	});
	
	this.setAttribute("viewBox", `${vb.vbX} ${vb.vbY} ${vb.vbW} ${vb.vbH}`);
};

SVGSVGElement.prototype.center = function(){
	let vb = this.getViewBox();
	
	return {"x": vb.vbX + vb.vbW/2, "y": vb.vbY + vb.vbH/2};
};

SVGSVGElement.prototype.coord = function(e){
	let vb = this.getViewBox();
	let perc = this.perc(e);
	
	return {"x": vb.vbX + vb.vbW*perc.x, "y": vb.vbY + vb.vbH*perc.y};
};

SVGSVGElement.prototype.resizeX = function(){
	let vb = this.getViewBox();
  
	this.setViewBox({"vbX": this.center().x - vb.vbH*this.aspectRatio()/2});
};

SVGSVGElement.prototype.resizeY = function(){
	let vb = this.getViewBox();
  
	this.setViewBox({"vbY": this.center().y - vb.vbW/this.aspectRatio()/2});
};
