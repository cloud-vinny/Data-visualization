// interactions.js

// =======================
// For map and ageGroup( getter, setter, store, handleBarClick )
// =======================

// =======================
// map
// // =======================
let selectedPath = null; //store selected path
let selectedJurisdiction = null;//store selected state
let jurisdiction_Callbacks = [];//store callbacks for jurisdiction change

const getSelectedJurisdiction = () => selectedJurisdiction;

const set_SelectedState = (state) => {
  selectedJurisdiction = state;
  selectedAgeGroups = [];
  //reset line and stacked charts When jurisdiction changes
  d3.select("#lineChart").selectAll("*").remove();
  d3.select("#stackedChart").selectAll("*").remove();
  //execute all callbacks for jurisdiction change
  jurisdiction_Callbacks.forEach(fn => fn(state));

};

const storeJurisdictionChange = (callbackfn) => {
  jurisdiction_Callbacks.push(callbackfn);
};

const handleMapClick = (mapPaths) => {//mapPaths is the selection of all paths in the map
  //1. All states click event
  mapPaths.on("click", function (event, d) {
    // reset previously selected path
    if (selectedPath) {
      selectedPath.attr("fill", defaultFill);
      // ACT button color reset
      d3.select(".act-rect").attr("fill", defaultFill);
      d3.select(".act-text").attr("fill", "Black");
    }

    // highlight the clicked state
    d3.select(this).attr("fill", selectedFill);//"this" is the clicked path(state)
    selectedPath = d3.select(this);

    
    const state = d.properties.STATE_NAME;// store the selected state
    set_SelectedState(state); // execute callbacks function to update selected state

    d3.select("#selected-state-label").text(state);// update the label for selected state

    
  d3.select("#conclusion").style("font-style", "italic").style("opacity", "0");
  });

   // 2. ACT button click event
  d3.select(".act-button").on("click", function () {
    set_SelectedState("ACT");

    if (selectedPath) {
      selectedPath.attr("fill", defaultFill);
    }

    // store the selected path for ACT
    selectedPath = mapPaths.filter(d =>
      d.properties.STATE_NAME === "ACT"
    ).attr("fill", selectedFill);

    d3.select(".act-rect").attr("fill", selectedFill);
    d3.select(".act-text").attr("fill", "white");
    d3.select("#selected-state-label").text("ACT");

    
  d3.select("#conclusion").style("font-style", "italic").style("opacity", "0");

  });
};


// =======================================================================================
// Age Group ( getter, setter, store, handleBarClick )" 
// =======================
let selectedAgeGroups = [];
let ageGroup_Callbacks = [];

const getSelectedAgeGroups = () => selectedAgeGroups;

const set_SelectedAgeGroups = (ageGroup) => {

  //*AI used(indexOf) : check if ageGroup is already in selectedAgeGroups
  const index = selectedAgeGroups.indexOf(ageGroup);// find index of ageGroup in selectedAgeGroups
  // if index is -1, ageGroup is not in selectedAgeGroups, so add it

  if (index === -1) {
    selectedAgeGroups.push(ageGroup); // add
  } else {
    selectedAgeGroups.splice(index, 1); // delete(startindex, deleteCount)
  }

  ageGroup_Callbacks.forEach(fn => fn(selectedAgeGroups));
};

const storeAgeGroupChange = (callbackFn) => {
  ageGroup_Callbacks.push(callbackFn);
};

const handleBarClick = (bars) => {
  bars.on("click", function (event, d) {
    // 1. toggle the clicked ageGroup and execute callbacks
    set_SelectedAgeGroups(d.ageGroup); 

    // 2. highlight the clicked bar
    const currentSelected = getSelectedAgeGroups();
    bars.attr("fill", d =>
      getAgeGroupColor(d.ageGroup, currentSelected.includes(d.ageGroup))
    );
    //conclusiton message
  d3.select("#conclusion").style("font-style", "italic").style("opacity", "1");
  });
  
};


