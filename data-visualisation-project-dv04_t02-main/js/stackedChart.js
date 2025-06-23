//input: finesData, selectedState + selectedAgeGroups
//output: none
//components: stackedChart, label

const drawStackedChart = (finesData, selectedAgeGroups, selectedState) => {
  // return early if no state or age groups are selected
if (!selectedState || !selectedAgeGroups || selectedAgeGroups.length === 0) {
  d3.select("#stackedChart").selectAll("*").remove();

  const width = 500;
  const height = 300;

  const svg = d3.select("#stackedChart")
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
    "1. Which detection method is most effective for each age group?",
    "2. Which is more effective, camera-based or police-issued?",
    "3. Which detection method works best for a specific age group?",
    "4. Among the different camera methods, which one is the most effective?",
    "",
    "→ Select multiple age groups on the bar chart to compare!"
  ];

  lines.forEach((oneline, i) => {
    placeholder.append("tspan")
      .attr("x", width / 2)
      .attr("dy", i === 0 ? "0" : "1.5em")
      .text(oneline);
  });

  return;
}

  // SVG reset
  d3.select("#stackedChart").selectAll("*").remove();

  const svg = d3.select("#stackedChart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // finesData => "filtered" : store data only for selectedState and selectedAgeGroups
  const filtered = finesData.filter(d =>
    d.jurisdiction === selectedState &&
    selectedAgeGroups.includes(d.ageGroup)
  );

  // detectionMethodData: { Row1: detectionMethod1, ageGroup1: fine1, ageGroup2: fine2, ... }
  const detectionMethodData = d3.rollups(
    filtered,
    v => {
        const byAge = d3.rollup(v, v2 => d3.sum(v2, d => d.fineCount), d => d.ageGroup);
        // byAge { ageGroup1: fine1, ageGroup2: fine2, ... } 
        const result = { detectionMethod: v[0].detectionMethod };
        for (const [ageGroup, fine] of byAge.entries()) {
          result[ageGroup] = fine; //Map to result object
        }
        //return : result{ detectionMethod, ageGroup1: fine1, ageGroup2: fine2, ... }
      return result;
    },
    d => d.detectionMethod
  )// detectionMethodData = [ [detectionMethod1, { detectionMethod1, ageGroup1: fine1, ageGroup2: fine2, ... }], [detectionMethod2, {...}], ... ]
  .map(d => d[1]); //{ detectionMethod1, ageGroup1: fine1, ageGroup2: fine2, ... },{..}... ]


  //*AI used
  //stack generatior 
  const stackGen = d3.stack()
    .keys(selectedAgeGroups); // selectedAgeGroups is an array of age groups like ["0-16", "17-25", ...]
/*[
    // Stacked data for the "18–25" age group
    [
      [0, 50], // Camera
      [0, 25]  // Officer
    ],
    // Stacked data for the "26–35" age group
    [
      [50, 90], // Camera (stacked on top of 18–25: 50 + 40)
      [25, 60]  // Officer (stacked on top of 18–25: 25 + 35)
    ]
  ]*/

  const stackedData = stackGen(detectionMethodData);
  /*stackedData = [
  [
    [0, 50, data0],  // data0 = detectionMethodData[0]
    [0, 25, data1]
  ],
  [
    [50, 90, data0],
    [25, 60, data1]
  ]
];
 */

  //X,Y Scales
  const xScale = d3.scaleBand()
    .domain(detectionMethodData.map(d => d.detectionMethod))
    .range([0, innerWidth])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(detectionMethodData, d => {
      return d3.sum(selectedAgeGroups, key => d[key] || 0);
    })])
    .range([innerHeight, 0])
    .nice();

  //draw stacked bars
  innerChart.selectAll("g.layer")
    .data(stackedData)
    .join("g")
    .attr("class", "layer")
    .attr("fill", d => getAgeGroupColor(d.key))//key is ageGroup
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => xScale(d.data.detectionMethod))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth());

  // X-axis
  const xAxis = d3.axisBottom(xScale);
  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis)
     .style("font-size", "12px");

  svg.append("text")
    .text("Detection Method")
    .attr("x", width / 2)
    .attr("y", height )
    .attr("text-anchor", "middle")
    .attr("class", "axis-label");

  // Y-axis
  const yAxis = d3.axisLeft(yScale);
  innerChart.append("g")
  .call(yAxis)
   .style("font-size", "11px");

  svg.append("text")
    .text("Total Fines")
    .attr("x", 15)
    .attr("y", 20)
    .attr("text-anchor", "start")
    .attr("class", "axis-label");

// legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - 120}, ${margin.top})`);

legend.selectAll("rect")
  .data(selectedAgeGroups)
  .join("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * 20)
  .attr("width", 12)
  .attr("height", 12)
  .attr("fill", d => getAgeGroupColor(d));

legend.selectAll("text")
  .data(selectedAgeGroups)
  .join("text")
  .attr("x", 18)
  .attr("y", (d, i) => i * 20 + 10)
  .text(d => d)
  .attr("font-size", "16px")
  .attr("fill", getTextColor());

};
