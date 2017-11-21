// var request = require('request-promise-native');

// function listEvents(token) {
//     var options = {
//         headers: {
//             Authorization: `Bearer ${token}`
//         },
//         uri: 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
//      };
//     return request(options);
// }


// function addEvent(token, summary, start, end){
//     var options = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         json: true,
//         body: { 
//             'summary': summary,
//             'start': {
//                 'dateTime': start,
//                 },
//                 'end': {
//                 'dateTime': end
//                 },
//         },
//         uri: 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
//     };
//     return request(options);
// }


// module.exports = {
//     listEvents , 
//     addEvent,
// };


// var options = {
//     headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-type': 'application/json'
//     },
//     method: 'POST',
//     json: true,
//     body: {
     
//     },
//     uri: 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
//  };
