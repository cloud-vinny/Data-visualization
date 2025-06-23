// shared-constants.js

const width = 800;
const height = 400;

const margin = { top: 40, right: 120, bottom: 40, left: 50 };

const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;



// Map Color 
const defaultFill = "#a8dadc";
const selectedFill = "#1d3557";
const strokeColor = "#457b9d";

const ageGroupColors = {
  "0-16": "#e41a1c",       // red
  "17-25": "#377eb8",      // blue
  "26-39": "#4daf4a",      // green
  "40-64": "#984ea3",      // purple
  "65 and over": "#ff7f00" // orange
};

const darkAgeGroupColors = {
  "0-16": "#ff6666",
  "17-25": "#6fa8dc",
  "26-39": "#93e499",
  "40-64": "#c58ef2",
  "65 and over": "#ffc266"
};


function getTextColor() {
  return document.body.classList.contains("dark") ? "#f5f5f5" : "black";
}

function getTooltipBg() {
  return document.body.classList.contains("dark") ? "#222" : "#cccccc";
}

function applyThemeToSVG() {
  d3.selectAll("text").attr("fill", getTextColor());
  d3.selectAll(".tooltip rect").attr("fill", getTooltipBg());
   d3.selectAll(".map-tooltip-bg").attr("fill", getTooltipBg());
}


const getAgeGroupColor = (ageGroup, isActive = true) => {
  const isDark = document.body.classList.contains("dark");
  const palette = isDark ? darkAgeGroupColors : ageGroupColors;
  return isActive ? palette[ageGroup] : "#999"; // fallback or dimmed
};


//tooltip

const tooltipWidth = 150;
const tooltipHeight = 100;


