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

color = {"wall":'#7a0006', "intWall":'#994251', "window":'#8cd3ff', "gFloor":'#c39b77', "floor":'#1f77b4', "roof":'#b3cf99', "site":'#77ab59'}
opacity = {"wall":1, "intWall":1, "window":0.9, "gFloor":1, "floor":1, "roof":1, "site":1}

function leadingZeros(num, size){
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

var layoutBui = { 
  scene:{
      xaxis: { showspikes: false, range: [0,150],
          showgrid: false,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: '',
          showticklabels: false, title: '', },
      yaxis: { showspikes: false, autorange: [0,150],
          showgrid: false,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: '',
          showticklabels: false, title: '' },
      zaxis: { showspikes: false, range: [0,75],
          showgrid: false,
          zeroline: false,
          showline: false,
          autotick: true,
          ticks: '',
          showticklabels: false,title: '', }
    },
  font: {size: 12},
  paper_bgcolor:"rgba(0,0,0,0)",
  plot_bgcolor:"rgba(0,0,0,0)",
  margin: {l: 10, r: 10, b: 10, t: 10},
  hovermode: "closest"
};
// layoutBui.scene.camera = {
//   up:{x:0, y:0, z:1},
//   center:{x:0, y:0, z:0}
// }

var config = {displayModeBar:false, responsive: true};

function plotBuilding(i){
  var src = `https://raw.githubusercontent.com/manavmahan/image/main/data/building_${leadingZeros(i, 3)}.json`;
  var plotData = [];
  
  $.getJSON(src, function(building){
    building['zones'].forEach(z => {
      z['Surfaces'].forEach(s => {
        var x=[], y=[], z=[];
        s["XYZList"]["XYZs"].forEach(p => {
          x.push(p['X']);
          y.push(p['Y']);
          z.push(p['Z']);
        });

        if (s["SurfaceType"] == 2 && s["OutsideCondition"] == "Outdoors"){
          t = "wall"
          if (x.every( (val, _, __) => val == 0 ))
            axis = 'x';
          else
            axis = 'y';
          
          var wall = {type: 'mesh3d', x:x, y:y, z:z, delaunayaxis:axis, color:color[t], opacity:opacity[t], };
          plotData.push(wall);

          lines = {type:"scatter3d", x:x, y:y, z:z, mode:'lines', line:{color: 'rgb(0, 0, 0)', width:2}, showlegend:false};
          // plotData.push(lines);

          s["Fenestrations"].forEach( w => {
            var x=[], y=[], z=[];
            t = "window"
            w["VerticesList"]["XYZs"].forEach(p => {
              x.push(p['X']);
              y.push(p['Y']);
              z.push(p['Z']);
            });

            var window = {type: 'mesh3d', x:x, y:y, z:z, delaunayaxis:axis, color:color[t], opacity:opacity[t], };
            plotData.push(window);

            lines = {type:"scatter3d", x:x, y:y, z:z, mode:'lines', line:{color: 'rgb(0, 0, 0)', width:1}, showlegend:false};
            // plotData.push(lines);
          });
        }

        if (s["SurfaceType"] != 2){
          t = "roof";
          triangles = earcut([x, y], dimensions = 2);
          i = triangles.filter((e, i) => i % 3 == 0)
          j = triangles.filter((e, i) => i % 3 == 1)
          k = triangles.filter((e, i) => i % 3 == 2)

          roof = {type: 'mesh3d', x:x, y:y, z:z, i:i, j:j, k:k, color:color[t], opacity:opacity[t], }
          plotData.push(roof);

          if (s["SurfaceType"] == 0){
            lines = {x:x, y:y, z:z, mode:'lines', line:{color: 'rgb(0, 0, 0)', width:5}, showlegend:false};
            // plotData.push(lines);
          }
        }
      });
    });
    Plotly.newPlot("plot3d", plotData, layoutBui, config);
  });
}

var plot = Plotly.newPlot('container', [getMatrix(nrows, ncols)], layout);

var myPlot = document.getElementById("container");
// myPlot.on('plotly_hover', function(data){
//   var x = data.points[0].x;
//   var y = data.points[0].y
//   console.log(x, y);
// })



// myPlot.on('plotly_unhover', function(data){
//   alert('released');
// });