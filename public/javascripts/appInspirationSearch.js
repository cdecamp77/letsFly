var allDestinations;
var template;


function searchInspirations() {
  $.get(`https://api.sandbox.amadeus.com/v1.2/flights/inspiration-search?apikey=${process.env.AMADEUS_TOKEN}&origin=${$('#departure_city').val()}`, data => {
    console.log(data);
  })
}
