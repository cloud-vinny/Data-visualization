// lineChart.js
let lastLineChartGroupData = []; //global variable for line chart tooltip data
//input: finesData, selectedState + selectedAgeGroups
//output: lastLineChartGroupData(global variable)
//components: lineChart, label

const drawLineChart = (finesData, selectedAgeGroups, selectedState) => {
// return early if no state or age groups are selected
if (!selectedState || !selectedAgeGroups || selectedAgeGroups.length === 0) {
  d3.select("#lineChart").selectAll("*").remove();
  const width = 500;
  const height = 300;
  const svg = d3.select("#lineChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const placeholder = svg.append("text")
    .attr("x", width / 2)
    .attr("y", height / 2 - 60)
    .attr("text-anchor", "middle")
    .attr("fill", getTextColor())
    .attr("font-size", "15px")
    .attr("font-style", "italic")
    .attr("font-weight", "normal");

  const lines = [
    "What insights can we discover here?",
    "",
    "1. In which month is the number of fines the highest?",
    "2. Is there a seasonal trend in speeding fines?",
    "3. Do different age groups show similar monthly patterns in fines?",
    "4. Which age group shows the greatest variation in fines across months?",
    "",
    "→ Select multiple age groups on the bar chart to compare!"
  ];

  lines.forEach((oneline, i) => {
    placeholder.append("tspan")
      .attr("x", width / 2)
      .attr("dy", i === 0 ? "0" : "1.5em")
      .text(oneline);
    
});
return;}




  

  // SVG reset
  d3.select("#lineChart").selectAll("*").remove();

  const svg = d3.select("#lineChart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //finesData => "filtered" : store data only for selectedState and selectedAgeGroups
  const filtered = finesData.filter(d =>
    d.jurisdiction === selectedState &&
    selectedAgeGroups.includes(d.ageGroup)
  );

  // "filtered" => Map<ageGroup, data[]>
  const groupMap = d3.group(filtered, d => d.ageGroup);//groupMap <ageGroup, data[]>
  /*groupMap = Map {
      "18-25" => [
        { ageGroup: "18-25", month: 1, fineCount: 10 },
        { ageGroup: "18-25", month: 2, fineCount: 12 }
      ],
      "26-35" => [
        { ageGroup: "26-35", month: 1, fineCount: 8 }
      ]
    }*/

  const groupData = [];


//*AI used
  for (const [ageGroup, records] of groupMap.entries()) {
    //excute for each ageGroup
    const monthly_fine = d3.rollups(
      records,
      v => d3.sum(v, d => d.fineCount),
      d => d.month
    )//montly_fine[month, fine]

    groupData.push({
      ageGroup,
      values: monthly_fine.map(([month, fine]) => ({ month, fine }))
    });
  }
//return: groupData = [{ageGroup,values: [{ month1, fine1 },{ month2, fine12 },...];

  lastLineChartGroupData = groupData;// global variable for tooltip

  // X, Y Scales
  const xScale = d3.scaleLinear()
    .domain([1, 12])
    .range([0, innerWidth]);

  const yMax = d3.max(groupData, oneAgeGroup =>
    d3.max(oneAgeGroup.values, d => d.fine)
  );

  const yScale = d3.scaleLinear()
    .domain([0, yMax])
    .range([innerHeight, 0])
    .nice();


  //line generator
  const line = d3.line()
    .x(d => xScale(d.month))
    .y(d => yScale(d.fine));

  //draw lines
  innerChart.selectAll("path")
    .data(groupData)
    .join("path")
    .attr("stroke", d => getAgeGroupColor(d.ageGroup))
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("d", d => line(d.values));

  // draw dots
  innerChart.selectAll(".dot-group")
    .data(groupData)
    .join("g")
    .attr("class", "dot-group")
    .selectAll("circle")
    .data(d => d.values.map(v => ({ ...v, group: d.ageGroup })))
    //...v : copy value of v, add group property => { month, fine, group }
    .join("circle")
    .attr("cx", d => xScale(d.month))
    .attr("cy", d => yScale(d.fine))
    .attr("r", 3)
    .attr("fill", d => getAgeGroupColor(d.group));

  // X-axis
  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .style("font-size", "16px");

  svg.append("text")
    .text("Month")
    .attr("x", width / 2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("class", "axis-label");

  // Y축
  innerChart.append("g")
    .call(d3.axisLeft(yScale))
    .style("font-size", "11px");

  svg.append("text")
    .text("Fines per Month")
    .attr("x", 15)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .attr("class", "axis-label");

  // labels for each line
  innerChart.selectAll(".line-label")
    .data(groupData)
    .join("text")
    .attr("class", "line-label")
    .attr("x", d => xScale(d.values[d.values.length - 1].month) + 5)
    .attr("y", d => yScale(d.values[d.values.length - 1].fine))
    .text(d => d.ageGroup)
    .attr("alignment-baseline", "middle")
    .attr("font-size", "16px")
    .attr("fill", getTextColor())
    .attr("fill", d => getAgeGroupColor(d.ageGroup));

};
