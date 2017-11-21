// Hides flight search form and shows all the results

$(document).ready(function() {
    $("#flightSearch").on('click', function(e) {
        e.preventDefault();
        $("#flightForm").hide();
        $("#results").show();
        $("#flightEdit").show();
    });
});

$(document).ready(function() {
    $("#flightEdit").on('click', function(e) {
        e.preventDefault();
        $("#flightForm").show();
        $("#results").hide();
        $("#flightEdit").hide();
    });
});