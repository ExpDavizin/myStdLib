SVGPathElement.prototype.parseLine = function(){
  let parse = this.getAttribute("d").split(" ");
  let result = [];
  
  parse.forEach(point => {
    if(point != "Z"){
      let split = point.substring(1).split(",");
      result.push([parseFloat(split[0]), parseFloat(split[1])]);
    }
  });
  
  return result;
};

Array.prototype.deparseLine = function(){
  let result = [];
  this.forEach((point, i) => {
    if(i === 0){
      result.push(`M${point[0]},${point[1]}`);
    }
    else{
      result.push(`L${point[0]},${point[1]}`);
    }
  });
  
  return result.join(" ");
};
