const sendGETRequest = function(url, callback) {
  fetch(url, {method: 'GET'})
    .then(response => response.json())
    .then(callback);
};

const sendPOSTRequest = function(url, postData, callback) {
  const requestOptions = {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: postData
  };
  fetch(url, requestOptions)
    .then(response => response.json())
    .then(callback);
};
