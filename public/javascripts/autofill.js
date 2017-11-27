// autocompletes an airport code when typing out a city
$(document).ready(function () {
var autocompleteData = {};
airports.forEach( function (airport){
  var airportName = `${airport.city}, ${airport.country}, (${airport.iata})`;
  autocompleteData[airportName] = null;
});
$('input.autocomplete').autocomplete({
  data: autocompleteData,
  limit: 7,
  onAutocomplete: function(val) {
    // Callback function when value is autcompleted.
  },
  minLength: 1,
});
});