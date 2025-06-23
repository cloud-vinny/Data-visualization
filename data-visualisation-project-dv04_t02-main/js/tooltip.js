// =======================================================================================
// create tooltip
// =======================
const createTooltip = (chartId, tooltipClass = "tooltip") => {
  const svg = d3.select(chartId).select("svg");

  const tooltip = svg.append("g")
    .attr("class", tooltipClass)
    .style("opacity", 0);

  const bg = tooltip.append("rect")
    .attr("class", "map-tooltip-bg") // only for map tooltips
    .attr("fill", getTooltipBg())  // uses helper
    .attr("stroke", "#aaa")
    .attr("rx", 6)
    .attr("ry", 6)
    .attr("width", 200)
    .attr("height", 20)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill-opacity", 0.95);

  const title = tooltip.append("text")
    .attr("x", 8)
    .attr("y", 18)
    .attr("font-weight", "bold")
    .attr("fill", getTextColor())  // uses helper
    .attr("font-size", "15px");

  const tooltipContent = tooltip.append("g")
    .attr("class", "tooltip-rows")
    .attr("transform", "translate(8, 30)");

  return { svg, tooltip, bg, title, tooltipContent };
};
// =======================================================================================
// mapChart tooltip
// =======================
const addMapTooltip = (finesData) => {
  const { svg, tooltip, bg, title, tooltipContent } = createTooltip("#mapChart", "map-tooltip");

  d3.selectAll("#mapChart svg path")
    .on("mouseenter", function (event, d) {
      const state = d.properties.STATE_NAME;

      if (state !== getSelectedJurisdiction()) {
      d3.select(this).attr("fill", selectedFill); 
    }

      const stateData = finesData.filter(v => v.jurisdiction === state);
      const totalFines = d3.sum(stateData, v => v.fineCount);

      title.text(state);

      const rows = [
        { label: "Total Fines", value: totalFines.toLocaleString() }
      ];

      const rowGroup = tooltipContent.selectAll("g.row")
        .data(rows)
        .join("g")
        .attr("class", "row")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      rowGroup.selectAll("circle")
        .data(d => [d])
        .join("circle")
        .attr("cx", 0)
        .attr("cy", 5)
        .attr("r", 4)
        .attr("fill", getTextColor());

      rowGroup.selectAll("text")
        .data(d => [d])
        .join("text")
        .attr("x", 10)
        .attr("y", 10)
        .attr("font-size", "15px")
        .attr("fill", getTextColor())
        .text(d => `${d.label}: ${d.value}`);

      const [x, y] = d3.pointer(event, svg.node());
      const boxHeight = 30 + rows.length * 20;
      bg.attr("height", boxHeight);

      tooltip
        .attr("transform", `translate(${x + 25}, ${y-80})`)
        .style("opacity", 1);
    })
    .on("mouseleave", function (event, d) {
      const state = d.properties.STATE_NAME;
    if (state !== getSelectedJurisdiction()) {
      d3.select(this).attr("fill", defaultFill);
    }
      tooltip
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
    // For ACT button
    d3.select(".act-rect")
    .on("mouseenter", function (event) {
      if ("ACT" !== getSelectedJurisdiction()) {
        d3.select(this).attr("fill", selectedFill);
      }

      showMapTooltip(event, "ACT", finesData, svg, tooltip, bg, title, tooltipContent);
    })
    .on("mouseleave", function () {
      if ("ACT" !== getSelectedJurisdiction()) {
        d3.select(this).attr("fill", defaultFill);
      }
      tooltip.style("opacity", 0).attr("transform", "translate(0, 500)");
    });
};
//for act button tooltip
const showMapTooltip = (event, state, finesData, svg, tooltip, bg, title, tooltipContent) => {
  const stateData = finesData.filter(v => v.jurisdiction === state);
  const totalFines = d3.sum(stateData, v => v.fineCount);

  title.text(state);

  const rows = [
    { label: "Total Fines", value: totalFines.toLocaleString() }
  ];

  const rowGroup = tooltipContent.selectAll("g.row")
    .data(rows)
    .join("g")
    .attr("class", "row")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  rowGroup.selectAll("circle")
    .data(d => [d])
    .join("circle")
    .attr("cx", 0)
    .attr("cy", 5)
    .attr("r", 4)
    .attr("fill", "#333");

  rowGroup.selectAll("text")
    .data(d => [d])
    .join("text")
    .attr("x", 10)
    .attr("y", 10)
    .attr("font-size", "15px")
    .attr("fill", getTextColor())
    .text(d => `${d.label}: ${d.value}`);

  const [x, y] = d3.pointer(event, svg.node());
  const boxHeight = 30 + rows.length * 20;
  bg.attr("height", boxHeight);

  tooltip
    .attr("transform", `translate(${x }, ${y - 80})`)
    .style("opacity", 1);
};


// =======================================================================================
// barChart tooltip
// =======================

const addBarTooltipBelow = (finesData, selectedState) => {

  const {svg, tooltip, bg, title, tooltipContent} = createTooltip("#barChart", "bar-tooltip-below"); // create tooltip for bar chart
  const bars = barRects;
  bars
  //start----------------
  .on("mouseenter", function (event, d) {
    d3.select(this).attr("opacity", 1);//여기다름름

    title.text("Age Group: " + d.ageGroup);

    const groupData = finesData.filter(v =>
      v.jurisdiction === selectedState && v.ageGroup === d.ageGroup
    );

    const fineCount = d3.sum(groupData, v => v.fineCount);
    const population = groupData[0]?.population ?? 0;
    const fineRate = (population === 0) ? 0 : (fineCount / population) * 10000;

    const rows = [
      { label: "Fines", value: fineCount.toLocaleString() },
      { label: "People", value: population.toLocaleString() },
      { label: "Per 10,000", value: fineRate.toFixed(1) }
    ];

    const rowGroup = tooltipContent.selectAll("g.row")
      .data(rows)
      .join("g")
      .attr("class", "row")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    rowGroup.selectAll("circle")
      .data(d => [d])
      .join("circle")
      .attr("cx", 0)
      .attr("cy", 5)
      .attr("r", 4)
      .attr("fill", getAgeGroupColor(d.ageGroup)); 

    rowGroup.selectAll("text")
      .data(d => [d])
      .join("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("font-size", "15px")
      .attr("fill", getTextColor())
      .text(d => `${d.label}: ${d.value}`);

    const boxHeight = 30 + rows.length * 20;
    bg.attr("height", boxHeight);

    const cx = +d3.select(this).attr("x") + +d3.select(this).attr("width") / 2 + margin.left;
    tooltip
      .attr("transform", `translate(${cx + 10}, ${innerHeight - boxHeight - 20})`)
      .style("opacity", 1);
  });
  //end----------------
  bars.on("mouseleave", function () {
    const ageGroup = d3.select(this).datum().ageGroup;
    const currentSelected = getSelectedAgeGroups();
    d3.select(this)
      .attr("opacity", currentSelected.includes(ageGroup) ? 1 : 0.5);
    tooltip
      .style("opacity", 0)
      .attr("transform", "translate(0, 500)");
  });
};

const addBarTooltipAbove = (finesData, selectedState) => {

  const xScale = lastBarChartScale;
  const yScale = lastBarChartYScale;
  const data = lastBarChartData;
  if (!xScale || !yScale || !data) return;

const {svg, tooltip, bg, title, tooltipContent} = createTooltip("#barChart", "bar-tooltip-above");  // transparent rects for hover
  const inner = svg.select("g");
  inner.selectAll(".above-hover-rect")
    .data(data)
    .join("rect")
    .attr("class", "above-hover-rect")
    .attr("x", d => xScale(d.ageGroup))
    .attr("y", 0)
    .attr("width", xScale.bandwidth())
    .attr("height", d => yScale(d.fineRate))
    .attr("fill", "#999")
    .attr("opacity", 0)
    .style("pointer-events", "visiblePainted")
    //start---------------
    .on("mouseenter", function (event, d) {
      d3.select(this).attr("opacity", 0.2);

      title.text("Age Group: " + d.ageGroup);

      const groupData = finesData.filter(v =>
        v.jurisdiction === selectedState && v.ageGroup === d.ageGroup
      );

      const fineCount = d3.sum(groupData, v => v.fineCount);
      const population = groupData[0]?.population ?? 0;
      const fineRate = (population === 0) ? 0 : (fineCount / population) * 10000;

      const rows = [
        { label: "Fines", value: fineCount.toLocaleString() },
        { label: "People", value: population.toLocaleString() },
        { label: "Per 10,000", value: fineRate.toFixed(1) }
      ];

      const rowGroup = tooltipContent.selectAll("g.row")
        .data(rows)
        .join("g")
        .attr("class", "row")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      rowGroup.selectAll("circle")
        .data(d => [d])
        .join("circle")
        .attr("cx", 0)
        .attr("cy", 5)
        .attr("r", 4)
        .attr("fill", getAgeGroupColor(d.ageGroup)); 

      rowGroup.selectAll("text")
        .data(d => [d])
        .join("text")
        .attr("x", 10)
        .attr("y", 10)
        .attr("font-size", "15px")
        .attr("fill", getTextColor())
        .text(d => `${d.label}: ${d.value}`);

      const boxHeight = 30 + rows.length * 20;
      bg.attr("height", boxHeight);
      //end----------------
      
      const cx = +d3.select(this).attr("x") + xScale.bandwidth() / 2 + margin.left;
      tooltip
        .attr("transform", `translate(${cx + 10}, ${innerHeight - boxHeight - 20})`)
        .style("opacity", 1);
    })
    .on("mouseleave", function () {
      d3.select(this).attr("opacity", 0);
      tooltip
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    })
    //click event
    .on("click", function (event, d) {
    // 1. toggle the clicked ageGroup and execute callbacks
    set_SelectedAgeGroups(d.ageGroup); 

    // 2. highlight the clicked bar
    const currentSelected = getSelectedAgeGroups();
    barRects.attr("fill", d =>
      getAgeGroupColor(d.ageGroup, currentSelected.includes(d.ageGroup))
    );
  });
};


// =======================================================================================
// lineChart tooltip
// =======================

const addLineTooltip = (groupData) => {
 const {svg, tooltip, bg, title, tooltipContent} = createTooltip("#lineChart", "line-tooltip");  // transparent rects for hover

  const xScale = d3.scaleLinear()
    .domain([1, 12])
    .range([0, innerWidth]);

  svg.select("g").selectAll(".hover-rect")
    .data(d3.range(1, 13))
    .join("rect")
    .attr("class", "hover-rect")
    .attr("x", d => xScale(d) - (xScale(2) - xScale(1)) / 2)
    .attr("width", xScale(2) - xScale(1))
    .attr("y", 0)
    .attr("height", innerHeight)
    .attr("fill", "#999")
    .attr("opacity", 0)
    .on("mouseenter", function (event, month) {
      d3.select(this).attr("opacity", 0.1);
      title.text(`Month: ${month}`);

      const rows = groupData.map(group => {
        const rec = group.values.find(v => v.month === month);
        return {
          ageGroup: group.ageGroup,
          value: rec?.fine ?? 0,
          color: getAgeGroupColor(group.ageGroup)
        };
      });

      const rowGroup = tooltipContent.selectAll("g.row")
        .data(rows)
        .join("g")
        .attr("class", "row")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      rowGroup.selectAll("circle")
        .data(d => [d])
        .join("circle")
        .attr("cx", 0)
        .attr("cy", 5)
        .attr("r", 4)
        .attr("fill", d => d.color);

      rowGroup.selectAll("text")
        .data(d => [d])
        .join("text")
        .attr("x", 10)
        .attr("y", 10)
        .attr("font-size", "15px")
        .attr("fill", getTextColor())
        .text(d => `${d.ageGroup}: ${d.value.toLocaleString()} fines`);

      const boxHeight = 30 + rows.length * 20;
      bg.attr("height", boxHeight);

      const cx = xScale(month) + margin.left;
      tooltip
        .attr("transform", `translate(${cx + 10}, ${margin.top})`)
        .style("opacity", 1);
    })
    .on("mouseleave", function () {
      d3.select(this).attr("opacity", 0);
      tooltip
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};

// =======================================================================================
// stackedBarChart tooltip
// =======================

const addStackedTooltip = () => {
  const {svg, tooltip, bg, title, tooltipContent} = createTooltip("#stackedChart", "stacked-tooltip"); 

  const allRects = svg.selectAll("g.layer rect").data();
  const detectionMethods = Array.from(new Set(allRects.map(d => d.data.detectionMethod)));

  const xScale = d3.scaleBand()
    .domain(detectionMethods)
    .range([0, innerWidth])
    .padding(0.2);

  svg.select("g").selectAll(".hover-rect")
    .data(detectionMethods)
    .join("rect")
    .attr("class", "hover-rect")
    .attr("x", d => xScale(d))
    .attr("y", 0)
    .attr("width", xScale.bandwidth())
    .attr("height", innerHeight)
    .attr("fill", "#999")
    .attr("opacity", 0)
    .on("mouseenter", function (event, method) {
      d3.select(this).attr("opacity", 0.2);
      title.text("Detection: " + method);

      const rows = [];
      svg.selectAll("g.layer").each(function () {
        const group = d3.select(this).datum().key;
        const rects = d3.select(this).selectAll("rect").data();
        for (let i = 0; i < rects.length; i++) {
          if (rects[i].data.detectionMethod === method) {
            const fine = rects[i][1] - rects[i][0];
            rows.push({
              ageGroup: group,
              value: fine,
              color: getAgeGroupColor(group)
            });
          }
        }
      });

      const rowGroup = tooltipContent.selectAll("g.row")
        .data(rows)
        .join("g")
        .attr("class", "row")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      rowGroup.selectAll("circle")
        .data(d => [d])
        .join("circle")
        .attr("cx", 0)
        .attr("cy", 5)
        .attr("r", 4)
        .attr("fill", d => d.color);

      rowGroup.selectAll("text")
        .data(d => [d])
        .join("text")
        .attr("x", 10)
        .attr("y", 10)
        .attr("font-size", "15px")
        .attr("fill", getTextColor())
        .text(d => `${d.ageGroup}: ${d.value.toLocaleString()} fines`);

      const boxHeight = 30 + rows.length * 20;
      bg.attr("height", boxHeight);

      const cx = xScale(method) + xScale.bandwidth() / 2 + margin.left;
      tooltip
        .attr("transform", `translate(${cx + 10}, ${margin.top})`)
        .style("opacity", 1);
    })
    .on("mouseleave", function () {
      d3.select(this).attr("opacity", 0);
      tooltip
        .style("opacity", 0)
        .attr("transform", "translate(0, 500)");
    });
};
