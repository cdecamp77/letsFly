var preloader = `<div class="progress">
        <div class="indeterminate"></div>
    </div> `;

$('#flight-search').on('click', evt => {
    $('#flight-search').html(preloader);
});