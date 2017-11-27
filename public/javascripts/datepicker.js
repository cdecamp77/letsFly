// pops up a calendar for selecting dates    
$('.datepicker').pickadate({
  selectMonths: true,
  selectYears: 15,
  today: 'Today',
  clear: 'Clear',
  close: 'Ok',
  closeOnSelect: false,
  format: 'yyyy-mm-dd'
});

$(document).ready(function() {
  $('select').material_select();
});