// mapChart.js

let mapPaths = null; // global variable for map paths
//input: geoData
//output: mapPaths(global variable)
//components: map, title, ACT button
const drawMapChart = (geoData) => {
  
  const svg = d3.select("#mapChart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);
  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //map paths data processing
  //*AI used
  const myprojection = d3.geoMercator().fitSize([innerWidth, innerHeight], geoData);// Convert [lat, lon] coordinates to [x, y]
  const path = d3.geoPath().projection(myprojection);//AI used, projection(projection) : Function for drawing paths

  //draw map
  mapPaths = innerChart.selectAll("path")
    .data(geoData.features)
    .join("path")
    .attr("d", path)
    .attr("fill", defaultFill)
    .attr("stroke", strokeColor)
    .attr("stroke-width", 1)
    .style("cursor", "pointer");

  //title
  svg.append("text")
    .text("Australian Map")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
     .style("font-size", "20px");

  //For ACT button
  const actButton = svg.append("g")
    .attr("class", "act-button")
    .attr("transform", `translate(${width - 270}, ${margin.top+220})`);
  //ACT button(rect)
  actButton.append("rect")
    .attr("class", "act-rect")
    .attr("width", 50)
    .attr("height", 30)
    .attr("fill", defaultFill)
    .attr("stroke", strokeColor)
    .attr("rx", 4)
    .attr("ry", 4);
  //ACT button (text)
  actButton.append("text")
    .attr("class", "act-text")
    .attr("x", 25)
    .attr("y", 18)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .text("ACT")
    .attr("fill", "black")
    .style("font-weight", "bold")
    .style("font-size", "13px")
    .style("cursor", "pointer");

  //seleected state label
  svg.append("rect")
    .attr("class", "selected-label-bg")
    .attr("x", width / 2-80)
    .attr("y", height - 70)
    .attr("width", 83)
    .attr("height", 50)
    .attr("fill", "#ccc")
    .attr("stroke", strokeColor)
    .attr("rx", 4)
    .attr("ry", 4);

  svg.append("text")
    .attr("class", "selected-label")
    .attr("id", "selected-state-label")
    .attr("x", width / 2-40)
    .attr("y", height - 35)
    .attr("text-anchor", "middle")
    .style("font-size", "30px")
    .style("fill", "#333")
    .style("font-weight", "bold")
    .text(""); 

  


};

