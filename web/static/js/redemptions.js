import socket from "./socket"
import PrivilegedBungie from "./privileged_bungie"

window.$ = require('jquery');
window._ = require('underscore');

if(typeof browser === 'undefined' && chrome) {
    window.browser = chrome;
}

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
};

let insertSpinner = () => {
    let opts = {
        lines: 5, // the number of lines to draw
        length: 3, // The length of each line
        width: 8, // The line thickness
        radius: 42, // The radius of the inner circle
        scale: 2.75, // Scales overall size of the spinner
        corners: 0.8, // Corner roundness (0..1)
        color: '#bbb', // #rgb or #rrggbb or array of colors
        opacity: 0, // Opacity of the lines
        rotate: 54, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 0.6, // Rounds per second
        trail: 64, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '51%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: 'absolute' // Element positioning
    }
    window.spinner = new Spinner(opts);
}


let getSpinnerElement = () => {
    return document.getElementById('loader');
}

insertSpinner();

var channel = socket.channel("armsday:redemptions", {})

channel.on("privileged_bungie", payload => {
    PrivilegedBungie.apiCall(payload["url"]).then(resp => {
        channel.push("privileged_bungie_response", {
            url: payload["url"],
            response: resp
        });
    });
});

channel.on("redemptions", payload => {
    window.redemptions = payload["redemptions"];
    doHandleBars();
    window.spinner.stop();
    addPopovers();
});

let joinChannel = () => {

    channel.join()
        .receive("error", resp => {
            console.log("Unable to join", resp)
        })
    .receive("ok", resp => {
        channel.push("redemptions_start");
        window.spinner.spin(getSpinnerElement());
    })
}

let showExtensionInstallerOverlay = () => {
    $(".modal-overlay").removeClass("hidden");
    $(".modal-content").removeClass("hidden");
}

let isExtensionInstalled = () => {
    PrivilegedBungie.isInstalled().then(installed => {
        joinChannel();
    }, notInstalled => {
        showExtensionInstallerOverlay();
    });
}


let doHandleBars = () => {
    Handlebars.registerPartial("roll", $("#roll-partial").html());
    Handlebars.registerPartial("weapon", $("#weapon-partial").html());
    Handlebars.registerPartial("perkColumn", $("#perk-column-partial").html());
    Handlebars.registerPartial("perk", $("#perk-partial").html());

    Handlebars.registerHelper("inc", (number) => {
        return number + 1;
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

let addPopovers = () => {
    console.log("adding popovers");
    $('.perk').each(function(idx, perk) {
        new Drop({
            target: this,
            content: this.getAttribute('data-description'),
            openDelay: 150,
            openOn: 'hover',
            remove: true,
            tetherOptions: {
                attachment: 'bottom center',
                targetAttachment: 'top center',
                offset: "10px 0",
                constraints: [{
                    to: 'window',
                    attachment: 'both'
                }]
            },
        });
    })
}


isExtensionInstalled();
