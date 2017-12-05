// Getting references
var $selDataset = document.getElementById("selDataset");
var $sampleMetadata = document.getElementById("metadata");
var $pie = document.getElementById("pie");

// Grab the sample lists
d3.json("/names", function(error, response) {
    if (error) return console.log(error);
    var sampleNames = response;
    
    for (var i = 0; i < sampleNames.length; i++) {
      var sampleName = sampleNames[i];
      var $option = document.createElement("option");
      $option.setAttribute("value", sampleName);
      $option.innerHTML = sampleName;
      $selDataset.appendChild($option);
  };
});

// Initial data and pie/bubble chart graphs
function init() {
  
  // Initial metadata sample
  d3.json("/metadata/BB_940", function(error, response) {
    if (error) return console.log(error);
        var response=response[0];
        var items = Object.keys(response);
        
        for (var i = 0; i < items.length; i++) {
            var $p = document.createElement("p");
            $p.setAttribute("class", "center-text");
            $p.innerHTML = `${items[i]}: ${response[items[i]]}`;         
            $sampleMetadata.appendChild($p);
        };
    });
  
  // Initial pie/bubble chart data
    d3.json("/samples/BB_940", function(error, response) {
    if (error) return console.log(error);
    
    // pie chart variables
    var $sampleValues=response.BB_940.slice(0,10);
    var $sampleOtus=response.otu_id.slice(0,10);
     
    // bubble chart variables
    var $bsampleValues=response.BB_940.slice(1,3674);
    var $bsampleOtus=response.otu_id.slice(1,3674);
    console.log($bsampleValues);
   
    //Hover text variable for the pie/bubble chart
       d3.json("/otu", function(error, response) {
         if (error) return console.log(error);
          var $botuDesc=response;
          console.log($botuDesc)
    
    var data = [{
    values: $sampleValues,
    labels: $sampleOtus,
    type: "pie",
    hovertext: $botuDesc
  }];

  var layout = {
    height: 500,
    width: 500
  };

  Plotly.plot("pie", data, layout);

  // Plot initial bubble chart data
  var bubbleData = [{
                x: $bsampleOtus,
                y: $bsampleValues,
                mode: "markers",
                text: $botuDesc,
                marker: {
                    size: $bsampleValues,
                    color: $bsampleOtus.map(row=>row),
                    colorscale: "Rainbow"
                }
            }];
            var bubbleLayout = {
                xaxis: {
                    title: "OTU ID",
                    hovermode: "closest"
                }
            };
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
     });   
      });
   };

init();

// Pie/bubble chart update
function updatePlotly(newPiedata, newBubbledata) {
  
  var PIE = document.getElementById("pie");
  var Bubble = document.getElementById("bubble");
    
  Plotly.restyle(PIE, "values", [newPiedata.values]);
  Plotly.restyle(Bubble, "y", [newBubbledata.values]);
  }

function optionChanged(dataset) {
  
  //Update the metadata 
  var metadataUrl = `/metadata/${dataset}`;
  d3.json(metadataUrl, function(error, response) {
    if (error) return console.log(error);
        var response=response[0];
        var items = Object.keys(response);
        $sampleMetadata.innerHTML = "";
        for (var i = 0; i < items.length; i++) {
            var $p = document.createElement("p");
            $p.setAttribute("class", "center-text");
            $p.innerHTML = `${items[i]}: ${response[items[i]]}`;         
            $sampleMetadata.appendChild($p);
        };
    });
  
  // Update pie/bubble chart
        var newdataUrl = `/samples/${dataset}`;
      
        d3.json(newdataUrl, function(error, response) {
        if (error) return console.log(error);
    
  
         $sampleValues=response[dataset].slice(0,10);
         $sampleOtus=response.otu_id.slice(0,10);
        
        var pieData = {
          values: $sampleValues,
          labels: $sampleOtus};
        
          // bubble chart variables
        var bubbleData = {
          values: response[dataset],
          labels: response.otu_id};
    
        updatePlotly(pieData, bubbleData);
  });
  }

