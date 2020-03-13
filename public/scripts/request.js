const sendGETRequest = function(url, callback) {
  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(callback);
};

const sendPOSTRequest = function(url, requestOptions, callback) {
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(callback);
};
