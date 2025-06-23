let barRects = null; // global variable for bar chart rectangles
let lastBarChartData = null;   // global variable for last bar tooltip
let lastBarChartScale = null;  // global variable for last bar tooltip
let lastBarChartYScale = null; // global variable for last bar tooltip
//input: finesData, selectedState
//output: barRects(global variable), lastBarChartData, lastBarChartScale, lastBarChartYScale
//components: bar chart, legend
const drawBarChart = (finesData, selectedState) => {

  // return early if no state is selected
if (!selectedState) {
  d3.select("#barChart").selectAll("*").remove();
  const width = 500;
  const height = 300;
  const svg = d3.select("#barChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const placeholder = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 60)
    .attr("text-anchor", "middle")
    .attr("fill", getTextColor())
    .attr("font-size", "25px")
    .attr("font-style", "italic")
    .attr("font-weight", "normal");

  const lines = [
    "Discover how different age groups are fined  ",
    "",
    "- start by selecting a state on the map -"
  ];

  lines.forEach((oneline, i) => {
    placeholder.append("tspan")
      .attr("x", width / 2)
      .attr("dy", i === 0 ? "0" : "1.5em")
      .text(oneline);
  });
return;}
  // SVG reset
  d3.select("#barChart").selectAll("*").remove();

  const svg = d3.select("#barChart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // *AI used
  //Data for BarChart
  //d3.rollup(data, function, key1, key2...)
  //d3.rollups finesdata 
  // => filter : selectedstate 
  // => Calculate : sum(fineCount) / population * 10000 within each ageGroup 
  // => return : [ageGroup, sum(fineCount) / population * 10000 within each ageGroup]
  const filtered = d3.rollups(
    finesData.filter(d => d.jurisdiction === selectedState),
    v => {
        const totalFines = d3.sum(v, d => d.fineCount);
        const population = v[0].population;  // population is the same for all entries in the group
        return (population === 0) ? 0 : (totalFines / population) * 10000;
    },
    d => d.ageGroup
  );


  //Mapping : EX) [0-16, 4600] => { key: 0-16, value:4,600 }
  const data = filtered.map(([ageGroup, fineRate]) => ({ ageGroup, fineRate }));

  lastBarChartData = data; // global variable 

  // X, Y Scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.ageGroup))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.fineRate)])
    .range([innerHeight, 0])
    .nice();

  lastBarChartScale = xScale; // global variable
  lastBarChartYScale = yScale; // global

 const activeGroups = getSelectedAgeGroups(); // bring selected ageGroup현재 선택된 ageGroups 가져오기, getSelectedAgeGroups()는 interactions.js에 정의되어 있음
  
 //Draw Bar
  barRects = innerChart.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => xScale(d.ageGroup))
    .attr("y", d => yScale(d.fineRate))
    .attr("width", xScale.bandwidth())
    .attr("height", d => innerHeight - yScale(d.fineRate))
    .attr("fill", d => getAgeGroupColor(d.ageGroup))
    .attr("opacity", d => activeGroups.includes(d.ageGroup) ? 1 : 0.5) //if ageGroup is selected, opacity is 1, else 0.5
    .style("cursor", "pointer");


    

  // X-axis {generator->draw x-axis->x-label}
  const xAxis = d3.axisBottom(xScale);

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis)
    .style("font-size", "16px");

  svg.append("text")
    .text("Age Group")
    .attr("x", width / 2)
    .attr("y", height -3)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label")
    .attr("fill", getTextColor());

  // Y-axis {generator->draw y-axis->y-label}
  const yAxis = d3.axisLeft(yScale);
  innerChart.append("g")
    .call(yAxis)
    .style("font-size", "16px");

  svg.append("text")
    .text("Fines per 10,000 people")
    .attr("x", 15)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .attr("class", "axis-label")
    .attr("fill", getTextColor());
  
// Add legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - 120}, ${margin.top})`);

const legendData = data.map(d => d.ageGroup);

legend.selectAll("rect")
  .data(legendData)
  .join("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * 20)
  .attr("width", 12)
  .attr("height", 12)
  .attr("fill", d => getAgeGroupColor(d));

legend.selectAll("text")
  .data(legendData)
  .join("text")
  .attr("x", 18)
  .attr("y", (d, i) => i * 20 + 10)
  .text(d => d)
  .attr("font-size", "12px")
  .attr("fill", getTextColor())
  .style("font-size", "16px");

};
