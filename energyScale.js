
const allCategories = [45, 50, 55, 60, 65, 70];
const color = ["#2ca02c", "#1f77b4", "#9467bd", "#ff7f0e", "#d62728", "#000000"]

function GetEnergyScale(){
    var n = allCategories.length;
    var data = []

    let minX = -1;
    let maxX = -.5;

    let fixX = minX + 0.1;
    let diffX = maxX - fixX;

    let nPart = 125;
    for (let i=0; i<n-1; i++){
        for (let g=0; g<nPart; g++)
        {   
            let maxX1 = fixX + i / n + g * 0.01/nPart;
            let maxX2 = fixX + i * diffX / n + g/nPart * diffX / n;

            mi = allCategories[i];
            ma = allCategories[i] + 5 * g/nPart;
            var trace1 = {
                showlegend:false,
                mode:"lines",
                hoverinfo:'skip',
                x: [minX, maxX2, ],
                y: [ma, ma,], 
                line:{color:GetWeighedColor(color[i], color[i+1], g/nPart), width:0.15},
                fill:'toself'
            }
            data.push(trace1);
        }
    }
    return data
}
