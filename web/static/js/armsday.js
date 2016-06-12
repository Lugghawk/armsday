window.$ = require('jquery');
window._ = require('underscore');

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
let doHandleBars = () => {
	Handlebars.registerPartial("roll", $("#roll-partial").html());
	Handlebars.registerPartial("weapon", $("#weapon-partial").html());
	Handlebars.registerPartial("perkColumn", $("#perk-column-partial").html());
	Handlebars.registerPartial("perk", $("#perk-partial").html());

	Handlebars.registerHelper("inc", (number) => {
		return number+1;
	});

	Handlebars.registerHelper("perkColumns", (perks) => {
		let columns = _.groupBy(perks, (perk) => {
			return perk.column;
		})
		return _.toArray(columns);
	});
	
	let template = Handlebars.compile($("#redemptions-template").html());
	let area = $(".redemptions-area");
	console.log(area);
	area.append(template(redemptions));
}
getRedemptions().then((data) => {
	window.redemptions = {"weapons":data};
	doHandleBars();
	return data;
})


