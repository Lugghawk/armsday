if(typeof browser === 'undefined' && chrome) {
	browser = chrome;
}

var bungieCookies;

var getBungledCookieValue = function(){
	for (var i = 0; i < bungieCookies.length; i++){
		var cookie = bungieCookies[i];
		if (cookie.name === "bungled") return cookie.value;
	}
	return null;
}

var bungieApi = function(apiRequest, callback){
	$.ajax({
		url: apiRequest.url,
		headers: {
			"X-API-Key": "0742112eb3d0491e8203a038b64532f7",
			"x-csrf": getBungledCookieValue()
		},
		complete: function(xhr, status){
			callback(JSON.parse(xhr.responseText));
		}
	});
}

var getBungieCookies = function(){
	browser.cookies.getAll({
		"domain": ".bungie.net"
	}, function(cookies){
		bungieCookies = cookies;
	});
}

getBungieCookies();

browser.runtime.onMessage.addListener(function (message, sender, sendResponse){
	bungieApi(message, sendResponse);
	return true;
});


browser.runtime.onMessageExternal.addListener(function (message, sender, sendResponse){
	bungieApi(message, sendResponse);
	return true;
});

