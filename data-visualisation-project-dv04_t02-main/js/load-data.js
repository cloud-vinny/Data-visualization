// load-data.js

// Load CSV and GeoJSON in parallel
/*
Promise.all([promise1, promise2])
  .then(([result1, result2]) => {
    // execute code with result1 and result2
  });
*/

Promise.all([ //*AI used From "Promise.all" to ".then(([finesData, geoData])"
  d3.csv("data/fines_population.csv", d => ({
    jurisdiction: d.JURISDICTION,
    ageGroup: d.AGE_GROUP,
    detectionMethod: d.DETECTION_METHOD,
    month: +d.Month,
    detectionType: d.DETECTION_TYPE,
    fineCount: +d["Sum(FINES)"],
    population: +d.POPULATION
  })),
  d3.json("data/states.geojson")
])
.then(([finesData, geoData]) => {


  console.log("✅ Data loaded");
  //mapPaths : global variable for mapChart
  //barRects: global variable for barChart
  // 1. Render the map chart
  drawMapChart(geoData);
  // 2. map tooltip
  addMapTooltip(finesData);
  // 3. Get map paths and bind click event => excute callback function
  handleMapClick(mapPaths);
  // *initially draw bar/line/stacked chart with no selected
  drawBarChart(finesData, null); 


  // 4. On state selection: Draw bar chart + bind click event + tooltip(Bar)
  storeJurisdictionChange(state => {
    drawBarChart(finesData, state);
    handleBarClick(barRects);// bar click event binding
    addBarTooltipBelow( finesData, state); 
    addBarTooltipAbove( finesData, state);
    //*initially draw bar/line/stacked chart with no selected
    drawLineChart(finesData, [], null); 
    drawStackedChart(finesData, [], null); 
  });

  //  5. On age group selection: Draw redraw Bar chart => line chart & stacked chart and tooltips
  storeAgeGroupChange(ageGroups => {
    const selectedState = getSelectedJurisdiction();  // brings selected state
    drawBarChart(finesData, selectedState);     // bar chart redraw
    handleBarClick(barRects);           // bar click event rebinding
    addBarTooltipBelow( finesData, selectedState); 
    addBarTooltipAbove( finesData, selectedState); 
  if (ageGroups.length === 0) {
    // When no age group is selected -> reset to an empty chart
    d3.select("#lineChart").selectAll("*").remove();
    d3.select("#stackedChart").selectAll("*").remove();
    return;
  }
    
    drawLineChart(finesData, ageGroups, selectedState);
    addLineTooltip(lastLineChartGroupData);
    drawStackedChart(finesData, ageGroups, selectedState);
    addStackedTooltip();
  });

})
.catch(error => {
  console.error("Error loading data:", error);
});
