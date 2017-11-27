var preloader = `<div class="progress">
        <div class="indeterminate"></div>
    </div> `;

$('#flight-search').on('click', evt => {
    $('#flight-search').html(preloader);
});

$("#destination").val(getParameterByName("destination"));
$('#departure-city').val(getParameterByName("origin"));

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}