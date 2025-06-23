const toggle = document.getElementById("darkToggle");
const body = document.body;
const cards = document.querySelectorAll(".card");
const header = document.querySelector("header");


toggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  header.classList.toggle("dark");
  toggle.classList.toggle("dark");

  
  cards.forEach(card => card.classList.toggle("dark"));

  // Optional: toggle emoji
  toggle.textContent = body.classList.contains("dark") ? "☀️" : "🌙";
   applyThemeToSVG(); // Add this here

   // Reapply bar colors based on dark mode
    // Reapply bar colors based on dark mode
    if (barRects) {
      const currentSelected = getSelectedAgeGroups();
      barRects.attr("fill", d =>
        getAgeGroupColor(d.ageGroup, currentSelected.includes(d.ageGroup))
      );
    }

     // Redraw stacked chart to apply dark mode colors
    if (lastSelectedState && lastSelectedAgeGroups.length > 0) {
      drawStackedChart(finesData, lastSelectedAgeGroups, lastSelectedState);
      addStackedTooltip(); // rebind tooltips
    }
    // Redraw line chart to apply dark mode colors
    if (lastSelectedAgeGroups.length > 0) {
      drawLineChart(finesData, lastSelectedAgeGroups, lastSelectedState);
      addLineTooltip(); // rebind tooltips
    }  

    // Reapply text color for placeholder messages
    d3.selectAll(".chart-placeholder").style("color", getTextColor());
    

    // Repaint map with new fill color
    d3.selectAll("#mapChart path").attr("fill", d =>
    document.body.classList.contains("dark") ? darkMapFill : lightMapFill
    );

   
});
