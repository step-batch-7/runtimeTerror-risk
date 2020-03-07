const main = function() {
  renderMap();
  sendSyncReq();
  setInterval(sendSyncReq, 1000);
};

window.onload = main;
