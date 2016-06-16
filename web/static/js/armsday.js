window.$ = require('jquery');
window._ = require('underscore');

import PrivilegedBungie from "./privileged_bungie"

let privilegedBungieApiCall = (url) => {
	return new Promise((fulfill, reject) => {
		browser.runtime.sendMessage("lmbhbnnolkjmjgfaieegmlliglfdnadn", {type: 'bungieapi', apiCall: {url: url}}, (data) => {
			if(data["status"] == "error") {
				reject(data["message"])
			} else {
				fulfill(data["data"])
			}
		});
	});
}

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
	area.append(template(redemptions));
}
// getRedemptions().then((data) => {
// 	window.redemptions = data;
// 	doHandleBars();
// 	return data;
// })


