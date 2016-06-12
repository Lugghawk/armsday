var $ = require('jquery');

if(typeof browser === 'undefined' && chrome) {
	window.browser = chrome;
}

let privilegedBungieApiCall = (url) => {
	return new Promise((fulfill, reject) => {
		browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {url: url}, (data) => {
			if(data["status"] == "error") {
				reject(data["message"])
			} else {
				fulfill(data["data"])
			}
		});
	});
}

let bungieUser = () => {
	return privilegedBungieApiCall("https://www.bungie.net/Platform/User/GetBungieNetUser/");
}

bungieUser().then(function(user) {
	console.log("Hello, " + user['Response']['psnId']);
}).catch(function(message) {
	console.log("Error during privilegedBungieApiCall: " + message);
});

let getRedemptions = () => {
	return Promise.resolve($.ajax({
		url: "api/test/redemptions"
	}))
}

getRedemptions().then((data) => {
	console.log(data)
})
