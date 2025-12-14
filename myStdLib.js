/* equivalent to document.getElementById() */
function $(id){
  return document.getElementById(id);
}

/* equivalent to document.querySelector() */
function $$(selector){
  return document.querySelector(selector);
}

/* equivalent to document.querySelectorAll() */
function $$$(selector){
  return document.querySelectorAll(selector);
}
/* returns array with SVG group's children */
function children(group){
  return [...group.children];
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* changes multiple CSS variables within :root{} */
/* args => ("variable1", "value1", "variable2", "value2", ...) */
function root(){
  if(arguments.length % 2 != 0){
    console.error(`Missig variable/value in root().`);
  }
  for(let i = 0; i < arguments.length; i += 2){
    document.documentElement.style.setProperty(arguments[i], arguments[i+1]);
  }
}

/* returns distance betheen two coordinates [x, y] (no units specified) */
function dist(C1, C2){
  return Math.sqrt((C2[0] - C1[0])**2 + (C2[1] - C1[1])**2);
}

/* returns medium coordinate between two coordinates [x, y] (no units specified) */
function center(C1, C2){
  return [(C1[0] + C2[0])/2, (C1[1] + C2[1])/2];
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

/* returns pointer position (in HTMP pixels) within Element with [0,0] beeing top left corner and [this.width,this.height] the bottom right */
/* dependencies: clamp() */
Element.prototype.pos = function(e){
    let box = this.getBoundingClientRect();
    
    let x = clamp(0, e.clientX - box.left, box.width);
    let y = clamp(0, e.clientY - box.top, box.height);
    
    return [x,y];
};

/* returns pointer position percentage within Element with [0,0] beeing top the left corner and [1,1] the bottom right */
/* dependencies: clamp(), pos() */
Element.prototype.perc = function(e){
    let pos = this.pos(e);
    let box = this.getBoundingClientRect();
    
    let px = clamp(0, pos[0]/box.width, 1);
    let py = clamp(0, pos[1]/box.height, 1);
    
    return [px,py];
};

/* equivalent to .setAttribute() but accepts multiple arguments */
/* args => ("attibute1", "value1", "attibute2", "value2", ...) */
/* returns this Element */
Element.prototype.attrs = function(){
  if(arguments.length % 2 != 0){
    console.error(`Missig argument/value in .attrs().`);
  }
  for(let i = 0; i < arguments.length; i += 2){
    this.setAttribute(arguments[i], arguments[i+1]);
  }
  
  return this;
};

/* creates and returns new Element and appends it to this Element/tag */
Element.prototype.newElement = function(type){
  let el = document.createElement(type);
  this.appendChild(el);
  
  return el;
};

/* returns true if pointer is hovering Element */
Element.prototype.hasPointer = function(e){
  const box = this.getBoundingClientRect();
  
  if(e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom){
    return true;
  }
  return false;
};

/* returns aspect ratio of Element */
Element.prototype.aspectRatio = function(){
  let box = this.getBoundingClientRect();
  
  return box.width/box.height;
};
  
/* creates and returns new SVG Element and appends it to this group */
SVGGElement.prototype.newElement = function(type){
  let el = document.createElementNS("http://www.w3.org/2000/svg", type);
  this.appendChild(el);
  
  return el;
};

/* creates and returns new SVG Text and appends it to this Element */
SVGGElement.prototype.newText = function(label){
  let txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
  txt.textContent = label;
  this.appendChild(txt);
  
  return txt;
};

Array.prototype.min = function(){
  return Math.min.apply(null, this);
};

Array.prototype.max = function(){
  return Math.max.apply(null, this);
};

/* returns the SVG coordinates of pointer within SVG as array [x,y] */
SVGSVGElement.prototype.coord = function(e){
  let vb = this.getViewBox();
  let perc = this.perc(e);
  
  return [vb[0]+vb[2]*perc[0], vb[1]+vb[3]*perc[1]];
};

/* returns parsed viewBox of SVG (numbers) as array [x,y,viewBoxWidth,viewBoxHeight] */
SVGSVGElement.prototype.getViewBox = function(){
  return this.getAttribute("viewBox").split(" ").map((v) => parseFloat(v,10));
};

/* sets SVG viewBox buy doesn't change value if it is null */
SVGSVGElement.prototype.setViewBox = function(x, y, vbx, vby){
  let newVB = this.getViewBox();
  
  [...arguments].forEach((arg,i) => {
    if(arg != null){
      newVB[i] = arg;
    }
  });
  
  this.setAttribute("viewBox", newVB.join(" "));
};

/* returns center of current SVG viewBox in SVG coordinates as array [x,y] */
SVGSVGElement.prototype.center = function(){
  let vb = this.getViewBox();
  
  return [vb[0]+vb[2]/2,vb[1]+vb[3]/2];
};

/* fixes SVG viewBox if SVG is resized in width */
SVGSVGElement.prototype.resize = function(){
  let center = this.center();
  let vbx = this.getViewBox()[3]*this.aspectRatio();
  
  this.setViewBox(center[1]-0.5*vbx, null,null, null);
};
