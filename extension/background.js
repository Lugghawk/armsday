if(typeof browser === 'undefined' && chrome) {
	browser = chrome;
}

var bungieApi = function(apiRequest, callback){
	$.ajax({
		url: apiRequest.url,
		headers: {"X-API-Key": "0742112eb3d0491e8203a038b64532f7"},
		complete: function(xhr, status){
			callback(JSON.parse(xhr.responseText));
		}
	});
}

browser.runtime.onMessage.addListener(function (message, sender, sendResponse){
	bungieApi(message, sendResponse);
	return true;
});


