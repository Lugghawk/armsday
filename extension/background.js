var R = require('ramda');
var $ = require('jquery');

if(typeof browser === 'undefined' && chrome) {
  browser = chrome;
}

var bungledCookie = function() {
  return new Promise(function(fulfill, reject) {
    getBungieCookies().then(function(cookies) {
      var bungled = R.find(R.propEq('nope', 'bungled'))(cookies);
      if(bungled === undefined) {
        reject("Bungled cookie not found");
      } else {
        fulfill(bungled);
      }
    });
  });
}

var bungieApi = function(apiRequest) {
  return bungledCookie().then(function(bungledCookie) {
    return Promise.resolve($.ajax({
      url: apiRequest.url,
      headers: {
        "X-API-Key": "0742112eb3d0491e8203a038b64532f7",
        "x-csrf": bungledCookie
      }
    }))
  });
}

var getBungieCookies = function() {
  return new Promise(function(fulfill, reject) {
    browser.cookies.getAll({
      "domain": ".bungie.net"
    }, function(cookies){
      fulfill(cookies);
    });
  });
}

// debug

window.getBungieCookies = getBungieCookies;
window.bungieApi = bungieApi;
window.bungledCookie = bungledCookie;
window.R = R;

// debug end

browser.runtime.onMessage.addListener(function (message, sender, sendResponse){
  bungieApi(message, sendResponse);
  return true;
});


browser.runtime.onMessageExternal.addListener(function (message, sender, sendResponse){
  bungieApi(message, sendResponse);
  return true;
});

