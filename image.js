nrows = 8;
ncols = 6;

images = []
for (let i = 0; i < nrows * ncols; i++) { 
  src = `https://raw.githubusercontent.com/manavmahan/image/main/pngs/crop_${i}.png`
  img = {
    "type": "image",
    "source": src,
    "xref": "x",
    "yref": "y",
    "x": Math.floor(i/ncols), 
    "y": i%ncols, 
    "sizex": 0.8,
    "sizey": 0.8,
    "xanchor": "center",
    "yanchor": "middle"
  };
  images.push(img)
}

var layout = {
  autosize: false,
  xaxis: {visible: false, range: [-.5, nrows + .5]},
  yaxis: {visible: false, range: [-.5, ncols + .5]},
  hovermode:'closest',
  width: nrows * 100,
  height: ncols * 100,
  images:images
};

function range(start, stop, inc){
  ar = []
  for (let i = start; i < stop; i += inc) { 
    ar.push(i);
  }
  return ar;
}

function getMatrix(nrows, ncols){
  var x = [];
  var y = [];
  range(0, nrows, 1).forEach(x1 => {
    range(0, ncols, 1).forEach(y1 =>{
      x.push(x1);
      y.push(y1);
    })
  });
  
  return {x: x, y: y, type: 'line', line: {color: 'rgba(0, 0, 0, 1)'}, mode: 'markers'}
}

var plot = Plotly.newPlot('container', [getMatrix(nrows, ncols)], layout);

var myPlot = document.getElementById("container");
// myPlot.on('plotly_hover', function(data){
//   var x = data.points[0].x;
//   var y = data.points[0].y
//   console.log(x, y);
// })

myPlot.on('plotly_click', function(data){
  var x = data.points[0].x;
  var y = data.points[0].y;
  var num = x * ncols + y;
  console.log(num);
})

// myPlot.on('plotly_unhover', function(data){
//   alert('released');
// });