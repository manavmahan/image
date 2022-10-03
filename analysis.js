
const allCategories = [45, 50, 55, 60, 65, 70, 75];
const color = ["#2ca02c", "#2ca02c", "#1f77b4", "#9467bd", "#ff7f0e", "#d62728", "#000000"]

function getRandomArray(min, max, num) {
    var ar = []
    for(var i=0; i<num; ++i){
      ar.push(Math.random() * (max - min) + min)
    }
    return ar;
}

function getColor(mean){
    let i = 0;
    while (allCategories[i] < mean){
        i ++;
    }
    var col1 = color[i];
    var col2 = color[i+1];
    var weight = (mean - allCategories[i]) / (allCategories[i+1] - allCategories[i]);
    var col = getWeighedColor(col1, col2, weight);
    return col;
}
  
function plotAnalysis(building){
    var data = [];
    var epp = building["EPP"];
    // var ep = []
    // for (i = 0; i < epp.length; i++) { 
    //   ep.push(epp[i]["EUI"]);
    // }
    ep = getRandomArray(50, 55, 200)
    ci = confidence95(ep);

    var col = getColor(ci.mean);

    var box = {
      x: Array(ep.length).fill(0),
      y: ep,
      type: 'box',
      showlegend:false,
      width:0.2,
      points:'all',
      medianline_visible:"True",
      notched:true,
      line: {
          width: 2,
      },
      marker: {
          line: {
              width: 0
          },
          size: 2,
          color: col,
          // symbol: "line-ew"
      },
      hoverinfo:'y',
      boxpoints: 'all',
      jitter: 5,
      pointpos: -2,
    };
  
    var o = 0;
    var line = {
        x: [o, o],
        y: [ci.mean - ci.interval, ci.mean + ci.interval],
        mode: 'lines',
        showlegend:false,
        name:"",
        hovertemplate:`<span> EUI: ${ci.mean.toFixed(1)} \u00b1 ${ci.interval.toFixed(2)}`,
        line: {
            color: 'rgb(0, 0, 0)',
            width: 5
        }
    };
    data.push(line);
    data.push(box);
  
    var layout2 = {
      autosize: true,
      xaxis: {visible: false, range: [-.5, .5]},
      title: "EUI (kWh/a.m\u00b2)",
      title_font_color: "rgb(0, 0, 0)",
      hovermode:'closest',
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)",
      margin: {l: 0, r: 0, t:50, b:25},
    };
    var config2 = {displayModeBar:false, responsive: true};
  
    Plotly.newPlot("analysis", data, layout2, config2);
}