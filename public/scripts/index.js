const main = function() {
  renderMap();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
