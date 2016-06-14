import socket from "./socket"
import PrivilegedBungie from "./privileged_bungie"

let insertSpinner = () => {
	let opts = {
		lines: 5 // The number of lines to draw
		, length: 3 // The length of each line
		, width: 8 // The line thickness
		, radius: 42 // The radius of the inner circle
		, scale: 2.75 // Scales overall size of the spinner
		, corners: 0.8 // Corner roundness (0..1)
		, color: '#bbb' // #rgb or #rrggbb or array of colors
		, opacity: 0 // Opacity of the lines
		, rotate: 54 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 0.6 // Rounds per second
		, trail: 64 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '51%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: true // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	}
	window.spinner = new Spinner(opts);
}


let getSpinnerElement = () => {
	return document.getElementById('loader');
}

insertSpinner();

var channel = socket.channel("armsday:redemptions", {})

channel.on("privileged_bungie", payload => {
	console.log("Recieved a request for a privileged_bungie API call to: " + payload["url"]);
	PrivilegedBungie.apiCall(payload["url"]).then(resp => {
		channel.push("privileged_bungie_response", {url: payload["url"], response: resp})
	});
});

channel.on("redemptions", payload => {
	console.log("Received redemptions", payload["redemptions"]);
	window.redemptions = payload["redemptions"];
	doHandleBars();
	window.spinner.stop();
});

channel.join()
	.receive("error", resp => { console.log("Unable to join", resp) })
	.receive("ok", resp => {
		console.log("Joined successfully", resp);
		channel.push("redemptions_start");
		window.spinner.spin(getSpinnerElement());
	})

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


