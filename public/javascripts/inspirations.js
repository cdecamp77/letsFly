var origin;
var destinationResults;
var currentDestination;
var currentDestinationIndex;
var nextDestination;
var nextDetinationIndex;
var destinationDetails;
var screenMode = "search";
var template = _.template($('#destination-template').html());  
var preloader = `<div class="progress">
    <div class="indeterminate"></div>
    </div> `;
    
  
$('#image-container').ready(() => {
    var random = Math.floor(Math.random() * 9) + 0;
    var bigSize = ['https://i.imgur.com/nruvJeb.jpg', 'https://i.imgur.com/wAsxQzx.jpg', 'https://i.imgur.com/7atabBq.jpg', 'https://i.imgur.com/qDiMxsG.jpg', 'https://i.imgur.com/ugoD6Ng.jpg', 'https://i.imgur.com/GgXgiJD.jpg', 'https://i.imgur.com/nruvJeb.jpg', 'https://i.imgur.com/lxJP0AC.jpg', 'https://i.imgur.com/qff3Lhs.jpg'];
    $("#random").attr("src", bigSize[random]);
});
  
function render() {
    if (screenMode === "search") {
      return;
    } else if (screenMode === "destinationView") {
      $('#search').hide();
      $('#inspiration-search').html('Search');
      $('#destination-display').html(template({currentDestination})).show();
      $('.parallax').parallax();
      $('.materialboxed').materialbox();
      preloadNextDestination();
    } else if (screenMode === "editSearch") {
      $('#search').show();
      $('#destination-display').hide();
    }
}
  
function submitInspirationSearch() { 
    if ( !$('#departure-city').val() ) return;
    $('#inspiration-search').html(preloader);
    origin = $('#departure-city').val().slice(-4, -1);
    
    fetch('/inspirations/search', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin: $('#departure-city').val().slice(-4, -1) })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 400) {
        window.location.pathname = "/error";
      }
      destinationResults = data.results;
      currentDestinationIndex = 0;
      currentDestination = destinationResults[currentDestinationIndex];
      screenMode = "destinationView";
      render();
    });
}

function preloadNextDestination() {
    if (currentDestinationIndex === destinationResults.length - 1) {
      nextDetinationIndex = 0;
    } else {
      nextDetinationIndex = currentDestinationIndex + 1;
    }
    nextDestination = destinationResults[nextDetinationIndex];
    fetch('/inspirations/new', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({nextDestination})
    })
    .then(res => res.json())
    .then(data => {
      nextDestination = destinationResults[nextDetinationIndex] = data;
      $('#new-destination').show();
    });
}

function showNewDestination() {
    currentDestinationIndex = nextDetinationIndex
    currentDestination = nextDestination;
    screenMode = "destinationView";
    render();
}

function editSearch() {
    screenMode = "editSearch";
    render();
}