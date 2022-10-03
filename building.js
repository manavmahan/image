let colorElement = {"wall":'#7a0006', "window":'#8cd3ff', "floor":'#1f77b4', "roof":'#b3cf99', }

function displace(x, y, z){
    let normal = getNormal(x, y, z);
    dist = 0.1;
    dist /= Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);

    dx = dist * normal.x;
    dy = dist * normal.y;
    dz = dist * normal.z;

    var x1 = [], y1 = [], z1 = [];
    x.forEach(p => {x1.push(p + dx)});
    y.forEach(p => {y1.push(p + dy)});
    z.forEach(p => {z1.push(p + dz)});
    return {x: x1, y: y1, z: z1};
}

function plotBuilding(building){
    var data = []
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
            
            var wall = {type: 'mesh3d', x:x, y:y, z:z, delaunayaxis:axis, color:colorElement[t], };
            data.push(wall);

            lines = {type:"scatter3d", x:x, y:y, z:z, mode:'lines', line:{color: 'rgb(0, 0, 0)', width:2}, showlegend:false};
            data.push(lines);

            s["Fenestrations"].forEach( w => {
            var x=[], y=[], z=[];
            t = "window"
            w["VerticesList"]["XYZs"].forEach(p => {
                x.push(p['X']);
                y.push(p['Y']);
                z.push(p['Z']);
            });
            
            points = displace(x, y, z);
            x = points.x;
            y = points.y;
            z = points.z;
            var window = {type: 'mesh3d', x:x, y:y, z:z, delaunayaxis:axis, color:colorElement[t], opacity:0.9, };
            data.push(window);

            lines = {type:"scatter3d", x:x, y:y, z:z, mode:'lines', line:{color: 'rgb(0, 0, 1)', width:1}, showlegend:false};
            data.push(lines);
            });
        }

        if (s["SurfaceType"] != 2){
            t = "roof";
            triangles = earcut(s["XYZList"]["XYZs"].flatMap((p)=>{return [p.X, p.Y]}), dimensions = 2);
            i = triangles.filter((e, i) => i % 3 == 0)
            j = triangles.filter((e, i) => i % 3 == 1)
            k = triangles.filter((e, i) => i % 3 == 2)

            roof = {type: 'mesh3d', x:x, y:y, z:z, i:i, j:j, k:k, color:colorElement[t], }
            data.push(roof);

            if (s["SurfaceType"] == 0){
            lines = {type:"scatter3d", x:x, y:y, z:z, mode:'lines', line:{color: 'rgb(0, 0, 0)', width:5}, showlegend:false};
            data.push(lines);
            }
        }
        });
    });

    var layoutBui = { 
        scene:{
            xaxis: { visible: false, range: [0, 60], },
            yaxis: { visible: false, range: [0, 60], },
            zaxis: { visible: false, range: [0, 19.998], },
            aspectratio:{x:1, y:1, z:0.333},
            camera: {
                up: {x:0, y:0, z:1},
                center: {x:0, y:0, z:0},
                eye: {x:0.5, y:0.5, z:0.5},
            }
        },
        paper_bgcolor:"rgba(0,0,0,0)",
        plot_bgcolor:"rgba(0,0,0,0)",
        margin: {l: 10, r: 10, b: 10, t: 10},
        hovermode: false,
    };

    var config = {displayModeBar:true, responsive: true};
    Plotly.newPlot("plot3d", data, layoutBui, config);
}