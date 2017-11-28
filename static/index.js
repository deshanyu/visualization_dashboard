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

// Grab data for samples and otus
function init() {
  
  d3.json("/metadata/BB_940", function(error, response) {
    if (error) return console.log(error);
    
  
    var items = Object.keys(response);
        
        for (var i = 0; i < items.length; i++) {
            var $p = document.createElement("p");
            $p.innerHTML = `${items[i]}: ${response[items[i]]}`;

            $sampleMetadata.appendChild($p);
        };
    });
  
  // Initial pie chart data
    d3.json("/samples/BB_940", function(error, response) {
    if (error) return console.log(error);
    
  
    var $sampleValues=response.BB_940.slice(1,10);
    var $sampleOtus=response.otu_id.slice(1,10);

  var data = [{
    values: $sampleValues,
    labels: $sampleOtus,
    type: "pie"
  }];

  var layout = {
    height: 500,
    width: 500
  };

  Plotly.plot("pie", data, layout);
});
};

init();