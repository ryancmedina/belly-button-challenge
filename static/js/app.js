// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the meta data field
    let meta = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredMeta = meta.filter(item => item.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metaTable = d3.select("#sample-metadata")

    //console.log(metaTable)
    // Use `.html("") to clear any existing metadata
    let h = metaTable.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    filteredM = filteredMeta[0];
    console.log(filteredM);

    Object.keys(filteredM).forEach(key => {
      console.log(`${key}, ${filteredM[key]}`)
      //metaTable.html(`${key}: ${filteredM[key]}`)
      metaTable.append("tr").text(`${key}: ${filteredM[key]}`)
    })

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    //console.log(samples);
    // Filter the samples for the object with the desired sample number
    let filteredSamps = samples.filter(item => item.id == sample);
    //941
    //console.log(filteredSamps);
    // Get the otu_ids, otu_labels, and sample_values
    otu_ids = filteredSamps[0].otu_ids;
    otu_labels = filteredSamps[0].otu_labels;
    sample_values = filteredSamps[0].sample_values;

    // console.log(otu_ids);
    // console.log(otu_labels);
    // console.log(sample_values);

    // Build a Bubble Chart
    let bubbleTrace = {
      x : otu_ids,
      y : sample_values,
      mode : "markers",
      marker : {
        size : sample_values,
        color : otu_ids 
      },
      text : otu_labels
    }

    let layout = {
      title : "Bacteria Cultures Per Sample"
    }

    // Render the Bubble Chart
    let plotData = [bubbleTrace];

    Plotly.newPlot("bubble",  plotData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    sortedSamps = filteredSamps;
    //sortedSamps = sortedSamps.sort(function(a, b) {b.sample_values - a.sample_values})
    sortedSamps = sortedSamps.sort(function(a, b) {(a.sample_values < b.sample_values) ? -1 : ((a.sample_values == b.sample_values) ? 0 : 1)})
    //(a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1)

    //console.log("sortedSamps below")
    //console.log(sortedSamps);
    // s.sort(function(a, b) {b.sample_values - a.sample_values});
    // final = single.slice(0, 10);
    let bar_sample_values = sample_values.slice(0,10);
    //let bar_otu_ids = otu_ids.slice(0,10);
    let bar_otu_ids = []

    for(let i = 0; i < 10; i++)
    {
      bar_otu_ids.push(`OTU ${otu_ids[i]}`);
    }

    let barTrace = {
      x : bar_sample_values.reverse(),
      y : bar_otu_ids,
      text : bar_otu_ids,
      type: "bar",
      orientation: "h"
    }

    plotData = [barTrace];

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    layout = {
      title : "Top 10"
    }

    // Render the Bar Chart
    Plotly.newPlot("bar", plotData, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i = 0; i < names.length; i++)
    {
      dropdown.append("option").text(`${names[i]}`)
    }
    
    //dropdown.append("option").text(`${names[0]}`)

    // Get the first sample from the list
    fName = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(fName);
    buildMetadata(fName);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
