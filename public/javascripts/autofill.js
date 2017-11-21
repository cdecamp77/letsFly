
// autocompletes an airport code when typing out a city

$(document).ready(function () {
var autocompleteData = {};

airports.forEach( function (airport){
  var airportName = `${airport.city}, ${airport.country}, (${airport.iata})`;
  autocompleteData[airportName] = null;
});

  $('input.autocomplete').autocomplete({

    data: autocompleteData,
    limit: 7, // The max amount of results that can be shown at once. Default: Infinity.
    onAutocomplete: function(val) {
      // Callback function when value is autcompleted.
    },
    minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
  });
  });