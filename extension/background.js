var R = require('ramda');
var $ = require('jquery');
var extensionPlatform = null;

if(typeof window.chrome === 'object') {
  extensionPlatform = window.chrome;
} else {
  extensionPlatform = window.browser;
}


var bungledCookie = function() {
  return new Promise(function(fulfill, reject) {
    getBungieCookies().then(function(cookies) {
      var bungled = R.find(R.propEq('name', 'bungled'))(cookies);
      if(bungled === undefined) {
        reject("Bungled cookie not found");
      } else {
        fulfill(bungled);
      }
    });
  });
}

var bungieApi = function(apiRequest) {
  return bungledCookie().then(function(bungled) {
    return Promise.resolve($.ajax({
      url: apiRequest.url,
      headers: {
        "X-API-Key": "0742112eb3d0491e8203a038b64532f7",
        "x-csrf": bungled.value
      }
    }))
  });
}

var getBungieCookies = function() {
  return new Promise(function(fulfill, reject) {
    extensionPlatform.cookies.getAll({
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

var onMessageResponse = function (message, sender, sendResponse){
	if (message.type === 'installCheck'){
		sendResponse(true);
	}
	if (message.type === 'bungieapi'){
	  bungieApi(message.apiCall)
	    .then(function(data){ sendResponse({"status": "ok", "data": data})})
	    .catch(function(error) { sendResponse({"status": "error", "message": error}) });
	}
  return true;
}

extensionPlatform.runtime.onMessage.addListener(onMessageResponse);
extensionPlatform.runtime.onMessageExternal.addListener(onMessageResponse);
