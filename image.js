for (let i = 0; i < 100; i++) { 
  src = $"https://github.com/manavmahan/image/blob/main/pngs/crop_{i}.png?raw=true"
  img = document.createElement('img');

  img.src = src;
  document.body.appendChild(img);
}

Plotly.newPlot('container', plotData);
