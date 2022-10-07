const row = document.getElementById("row");
const container = document.getElementById("container");

function confidence95(numbers) {
	var sum = listSum(numbers);
	var mean = sum/numbers.length;
	var sqerrs = numbers.map(function(n){ return (n - mean)*(n - mean); });
	var std = Math.sqrt(listSum(sqerrs)/numbers.length);
	var interval = 1.959964*std/Math.sqrt(numbers.length);
	return {
		mean: mean,
		std: std,
		interval: interval
	};
};

function closeLoader(){
	for (var i = 0; i < container.children.length; i++)
	{
		if (container.children[i].id == "loader1"){
			container.removeChild(container.children[i]);
			break;
		}
	}
}

function closeScreen(){
	row.removeChild(row.lastChild);
}

function createLoader(x, y){
	var loader1 = null;
	for (var i = 0; i < container.children.length; i++)
	{
		if (container.children[i].id == "loader1"){
			loader1 = container.children[i];
		}
	}

	if (loader1 == null)
	{
		var template = document.getElementById("loader");
		var loader = template.content.cloneNode(true);
		var loader1 = loader.children[0];
		loader1.id = "loader1";
		container.appendChild(loader1);
	}
	
	loader1.style.margin = `${y}px 0px 0px ${x}px`;
}

function createScreen(){
	var template = document.getElementById("screen");
	var screen = template.content.cloneNode(true);
	row.appendChild(screen);
}

function getNormal(x, y, z){
	let v1 = {x: x[1]-x[0], y: y[1]-y[0], z: z[1]-z[0]};
	let v2 = {x: x[2]-x[0], y: y[2]-y[0], z: z[2]-z[0]};

	let normal = {x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x};
	return normal;
}

function leadingZeros(num, size){
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

function listSum(lst) {
	return lst.reduce(function(a, b) { return a + b; });
};

function hexToRGBA(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16),
	  a: 1
	} : null;
  }

function getWeighedColor(col1, col2, w){
	var c1 = col1[0]==='#' ? hexToRGBA(col1) : col1
	var c2 = col2[0]==='#' ? hexToRGBA(col2) : col2
	var c ={
		r:parseInt((1-w)*c1.r + w*c2.r, 10),
		g:parseInt((1-w)*c1.g + w*c2.g, 10),
		b:parseInt((1-w)*c1.b + w*c2.b, 10),
		a:(1-w)*c1.a + w*c2.a
	}
    return c;
}