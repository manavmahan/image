const nrows = 4;
const ncols = 8;

const size = {width: ncols * 100, height: nrows * 100}

const nums = 400;
function createRandomMapping(num){
  var ar = []
  while(ar.length < num){
    var r = Math.floor(Math.random() * 400);
    if(ar.indexOf(r) === -1) ar.push(r);
  }
  return ar;
}

row.style.width = `${size.width}px`;
row.style.height =`${size.height}px`;

images = []
const arr = createRandomMapping( nrows * ncols);

for (let i = 0; i < arr.length; i++) { 
  src = `https://raw.githubusercontent.com/manavmahan/image/main/Images/crop_${arr[i]}.png`
  img = {
    "type": "image",
    "source": src,
    "xref": "x",
    "yref": "y",
    "x": i%ncols,
    "y": Math.floor(i/ncols), 
    "sizex": 0.85,
    "sizey": 0.85,
    "xanchor": "center",
    "yanchor": "middle"
  };
  images.push(img)
}

const layout = {
  autosize: false,
  xaxis: {visible: false, range: [-.5, ncols - .5]},
  yaxis: {visible: false, range: [-.5, nrows - .5]},
  hovermode:'closest',
  width: size.width,
  height: size.height,
  images:images,
  margin: {l: 0, r: 0, b: 0, t: 0},
  paper_bgcolor: '#00000000',
  plot_bgcolor: '#00000000'
};

function range(start, stop, inc){
  var ar = []
  for (let i = start; i < stop; i += inc) { 
    ar.push(i);
  }
  return ar;
}

function getMatrix(nrows, ncols){
  var x = [];
  var y = [];
  range(0, ncols, 1).forEach(x1 => {
    range(0, nrows, 1).forEach(y1 =>{
      x.push(x1);
      y.push(y1);
    })
  });
  
  return {x: x, y: y, type: 'line', line: {color: 'rgba(0, 0, 0, 1)'}, mode: 'markers', hoverinfo:'none'}
}

function plotData(num){
  var src = `https://raw.githubusercontent.com/manavmahan/image/main/Data/b_${leadingZeros(num, 3)}.json`;
  $.getJSON(src, function(building){
    closeLoader();
    createScreen();
    plotBuilding(building);
    plotAnalysis(building);
  });
}

var config = {displayModeBar:false, responsive: true};
var plot = Plotly.newPlot('container', [getMatrix(nrows, ncols)], layout, config);

var myPlot = document.getElementById("container");
myPlot.on('plotly_click', function(data){
  // screen.style.visibility = "unset";
  var x = data.points[0].x;
  var y = data.points[0].y;
  var num = x + y * ncols;
  plotData(arr[num]);
});

myPlot.on('plotly_hover', function(data){
  var x = data.points[0].x;
  var y = data.points[0].y;

  createLoader(- (ncols - x) * 100, (nrows -y - 1) * 100);
})



// myPlot.on('plotly_unhover', function(data){
//   closeLoader();
// });