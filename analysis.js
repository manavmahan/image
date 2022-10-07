
function getColor(mean){
    let i = 0;
    while (allCategories[i] < mean){
        i ++;
    }
    var col1 = color[i - 1];
    var col2 = color[i];
    var weight = (mean - allCategories[i-1]) / (allCategories[i] - allCategories[i-1]);
    var col = GetWeighedColor(col1, col2, weight);
    return col;
}
  
function plotAnalysis(building){
    var data = [];
    var ep = building["EPP"];

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
    var energyScale = GetEnergyScale();
    energyScale.forEach(x => data.push(x));
  
    var layout2 = {
      autosize: true,
      xaxis: {visible: false, range: [-1.1, .25]},
      yaxis: {visible: true, range: [allCategories[0], allCategories[allCategories.length - 1]], title: {text: "EUI (kWh/a.m\u00b2)"}},
      title_font_color: "rgb(0, 0, 0)",
      hovermode:'closest',
      paper_bgcolor:"rgba(0,0,0,0)",
      plot_bgcolor:"rgba(0,0,0,0)",
      margin: {l: 80, r: 0, t:50, b:25},
    };
    var config2 = {displayModeBar:false, responsive: true};
  
    Plotly.newPlot("analysis", data, layout2, config2);
}