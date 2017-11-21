$(document).ready(function() {
    $("#hotelSearch").on('click', function(e) {
        e.preventDefault();
        $("#hotelForm").hide();
        $("#results").show();
    });
});

$(document).ready(function() {
    $("#hotelEdit").on('click', function(e) {
        e.preventDefault();
        $("#hotelForm").show();
        $("#results").hide();
    });
});
